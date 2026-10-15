import { Color3, Vector3 } from "@babylonjs/core";
import { RuntimeUnit } from "../units/runtimeUnit";
import {
  AttackType, TargetPriority,
  getAttackProfile, getAIProfile,
  type AttackProfile, type AIProfile,
} from "../data/combatProfiles";
import { ProjectileSystem, type ProjectileShape } from "./projectileSystem";
import { VisualEffects } from "./visualEffects";
import type { ImpactPresentation } from "./impactPresentation";
import type { LinkedRelation, RuntimeSpawnRole } from "../units/runtimeUnit";
import type { UnitVisualConfig } from "../units/unitVisuals";
import type { HazardRegion } from "../map/hazards";
import { isPointInsideHazard } from "../map/hazards";
import type { PlacementZone } from "../map/placementValidator";
import type { Obstacle } from "../map/obstacles";
import { NavigationGrid } from "../map/navigation";

export interface SpawnUnitOptions {
  role?: RuntimeSpawnRole;
  countsTowardVictory?: boolean;
  linkedParent?: RuntimeUnit;
  linkedRelation?: LinkedRelation;
  visualOverride?: UnitVisualConfig;
  suppressDecorativeOperators?: boolean;
  forceArticulatedBody?: boolean;
  expireAfterSeconds?: number;
}

function hasAbility(unit: RuntimeUnit, ability: string): boolean {
  return (unit.definition.abilities ?? []).includes(ability as never);
}

function resolveProjectileShape(unit: RuntimeUnit, profile: AttackProfile): ProjectileShape | null {
  switch (unit.definition.projectileHint) {
    case "arrow": return "arrow";
    case "bolt": return "bolt";
    case "bomb": return "bomb";
    case "stone": return unit.definition.specialHint === "cannon" ? "cannonball" : "stone"; // a cannon fires an iron ball, not the catapult's rock
    case "spear": return "spear";
    case "firework": return "firework";
    case "shuriken": return "shuriken";
    case "rocket_arrow": return "rocket_arrow";
    case "crow": return "crow";
    case "fireball": return "fireball";
    default:
      break;
  }

  const pid = profile.projectileId ?? "";
  switch (pid) {
    case "projectile.arrow": return "arrow";
    case "projectile.bolt": return "bolt";
    case "projectile.bomb": return "bomb";
    case "projectile.stone": return "stone";
    default: break;
  }

  if (profile.type === AttackType.Ranged) return "arrow";
  if (profile.type === AttackType.Siege) return "stone";
  return null;
}

function isFirearmUnit(unit: RuntimeUnit): boolean {
  const hint = unit.definition.weaponHint ?? "";
  return hint === "flintlock" || hint === "musket" || hint === "blunderbuss" || hint === "cannon_hand";
}

function getBehaviorPreset(unit: RuntimeUnit): string {
  return unit.definition.behaviorPreset ?? "default";
}

function originLiftForSource(source: "vehicle-socket" | "linked-role" | "parent"): number {
  return source === "vehicle-socket" ? 0 : 1;
}

function muzzleScaleForProjectile(shape: ProjectileShape): number {
  switch (shape) {
    case "shell": return 1.8;
    case "bomb": return 1.4;
    case "rocket_arrow": return 0.65;
    case "bolt": return 0.7;
    default: return 1;
  }
}

function shouldSpawnProjectileMuzzleFx(shape: ProjectileShape): boolean {
  return shape === "shell" || shape === "bomb" || shape === "rocket_arrow" || shape === "bolt";
}

function countAliveSpawnedChildren(attacker: RuntimeUnit): number {
  return attacker.linkedChildren.filter((child) => !child.isDead && child.linkedRelation === "spawned-child").length;
}

// How far ahead of a front-rank carrier his board stands against an enemy (see _resolveLivingCollisions): the board plane's reach plus its thickness.
const SHIELD_BOARD_STANDOFF = 0.46;

// The shield wall as one body (see the spec at SimulationSystem._holdShieldFrames): the most a step puts a carrier back toward his slot. At 60 steps a second
// that is 9 m/s, more than any shove or march moves a man in a step, so on his feet he is on his slot.
const SHIELD_SLOT_SNAP = 0.15;
// Rear-rank men are kept at least this share of a clear body gap behind the man ahead (see _keepRanksDeep).
const RANK_DEPTH_SHARE = 0.95;
// An ally who is not in the wall stands at least this much more than a body behind its front rank (clear of the boards, see _keepRanksDeep).
const WALL_QUEUE_GAP = 0.25;
// A clubber a rank back (see _allyBetween): how much further than a front man's strike reach he strikes from, over an ally within this lane of his line.
const REAR_RANK_REACH = 1.4;
const REAR_RANK_LANE = 0.7;

/** One carrier's place in its wall: `offset` is the sideways step from where it stands to its slot. */
interface ShieldSlot {
  wall: number;
  offset: Vector3;
  /** Yaw of the wall's advance: its carriers stand square to it in contact. */
  heading: number;
  /** A rear-rank man's step to his place behind the front, across and in depth; null in the front rank. */
  hold: Vector3 | null;
  /** A front-rank wall's line along its heading (metres): every board in it stands on the plane this far forward, so the boards lap into one surface; null in a rear rank. */
  plane: number | null;
  /** Where on the ground his slot is in the wall's frame: across at his slot's place, in depth on his rank's line. The frame sits on the wall's own mean place, so it moves as one with the men under the shove. */
  at: Vector3;
}

/** A formed wall as the rank behind it sees it: its first slot across the line, how many slots, and how far forward it stands. */
interface ShieldWallLine {
  first: number;
  count: number;
  depth: number;
}

interface UnitPathState {
  waypoints: Vector3[];
  waypointIndex: number;
  desiredGoal: Vector3 | null;
  bypassGoal: Vector3 | null;
  bypassExpiresAt: number;
  lastPositionSample: Vector3;
  lastCollisionContacts: number;
  lastProgressAt: number;
  repathBlockedUntil: number;
}

export class SimulationSystem {
  /** Melee blows landed, newest last, for evidence captures that shoot the frame a blow lands on. Capped at 200. */
  readonly hitLog: Array<{ t: number; attackerUnit: string; targetUnit: string; x: number; y: number; z: number }> = [];
  private _units: RuntimeUnit[] = [];
  private _nextDecisionAt = new Map<RuntimeUnit, number>();
  private _pathStates = new Map<RuntimeUnit, UnitPathState>();
  private _isRunning = false;
  private _battleStartedAt = 0;
  private _lastBattleDuration = 0;
  private _nextCleanupSweepAt = 0;

  projectileSystem: ProjectileSystem | null = null;
  visualEffects: VisualEffects | null = null;
  impactPresentation: ImpactPresentation | null = null;
  spawnUnitById: ((unitId: string, team: number, position: Vector3, options?: SpawnUnitOptions) => RuntimeUnit | null) | null = null;
  hazards: readonly HazardRegion[] = [];
  navigationGrid: NavigationGrid | null = null;

  readonly minimumDecisionInterval = 0.08;
  readonly attackRangePadding = 0.2;
  /** Short-reach melee (reach under this) keeps closing after it can swing, until bodies touch. */
  readonly meleePressMaxReach = 2.3;
  readonly meleePressGap = 0.1;
  readonly cleanupSweepInterval = 0.75;
  readonly summonLivingCap = 55;
  readonly collisionResolutionPadding = 0.03;
  readonly collisionResolutionPasses = 2;
  readonly waypointReachDistance = 1.1;
  readonly progressSampleDistance = 0.6;
  readonly stuckTimeout = 0.75;
  readonly repathCooldown = 0.35;
  /** Enemies are only sidestepped at arm's length, so opposing lines close and shove. */
  readonly localAvoidanceRadius = 0.7;
  readonly localAvoidanceStrength = 1.45;
  /** Marching allies only steer apart when nearly touching, so ranks stay closed up. */
  readonly formationAvoidanceRadius = 0.3;
  /** Fallen units of either team are stepped around closely so the press stays shut over bodies. */
  readonly fallenAvoidanceRadius = 0.9;
  readonly cohesionRadius = 1.5;
  // A runner more than runnerLeadMargin ahead of every marching ally within runnerHoldRadius drops to runnerHoldMultiplier until they draw level.
  // Only in a body of troops: with fewer than runnerHoldMinAllies marching around it a unit runs free.
  readonly runnerHoldRadius = 3;
  readonly runnerHoldMinAllies = 3;
  readonly runnerLeadMargin = 0.4;
  readonly runnerHoldMultiplier = 0.6;
  readonly congestionBypassDistance = 2.2;
  /** Shield carriers of one wall stand this far apart, centre to centre: two thirds of a round board, so each board laps a third over the next. */
  readonly shieldSlotSpacing = 0.54;
  /** Carriers within this depth of the foremost one form a rank; a sideways gap wider than shieldWallGap splits a rank into separate walls. */
  readonly shieldRankDepth = 1.0;
  readonly shieldWallGap = 2.2;
  /** The most a carrier steps across toward its slot for each stride forward. */
  readonly shieldSlotStride = 0.6;
  /** A rear rank stands this far behind the rank it backs, each man behind the gap between two boards. */
  readonly shieldRankGap = 0.75;
  /** On the march a rear-rank man slows over this last stretch as he comes up to his depth behind the front, and halts at it. */
  readonly shieldRankFollowBand = 0.25;
  /** A wall's men level their spears at the man they are closing on from this far outside their reach, the rear rank with the front. */
  readonly spearLevelReach = 3.5;
  /** Within this much of its reach a heavy weapon's man strikes on his own beat as the press does, out of contact (see ProceduralAnimator._pressBlow). */
  blowStrikeReach = 0.9;
  /** Within this much of its reach a melee unit with a heavy weapon carries it cocked (see ProceduralAnimator.readyBlow). */
  readonly blowReadyReach = 4;
  /** A slotted carrier in contact stands square to the wall's advance while his enemy is within this arc of it; outside it he turns to face him. */
  readonly shieldHeadingArc = 1.0;
  /** Each slotted carrier's wall and the sideways step from where it stands to its slot in it. */
  private _shieldSlots = new Map<RuntimeUnit, ShieldSlot>();
  /** The rank each living carrier was sorted into, 0 the front: kept from tick to tick, so a rear rank pressed up against the front stays a rank behind it. */
  private _shieldRanks = new Map<RuntimeUnit, number>();
  private _now = 0;

  get isRunning(): boolean { return this._isRunning; }

  get battleDuration(): number {
    if (this._isRunning) return this._now - this._battleStartedAt;
    return this._lastBattleDuration;
  }

  get units(): readonly RuntimeUnit[] { return this._units; }

  configureNavigation(
    zones: readonly PlacementZone[],
    obstacles: readonly Obstacle[],
    hazards: readonly HazardRegion[],
  ): void {
    this.hazards = hazards;
    this.navigationGrid = new NavigationGrid(zones, obstacles, hazards);
    this._pathStates.clear();
  }

  registerUnit(unit: RuntimeUnit): void {
    if (this._units.includes(unit)) return;
    this._units.push(unit);
    this._nextDecisionAt.set(unit, 0);
    this._pathStates.delete(unit);
  }

  unregisterUnit(unit: RuntimeUnit): void {
    const idx = this._units.indexOf(unit);
    if (idx >= 0) this._units.splice(idx, 1);
    this._nextDecisionAt.delete(unit);
    this._pathStates.delete(unit);
  }

  beginSimulation(now: number): void {
    this._isRunning = true;
    this._now = now;
    this._battleStartedAt = now;
    this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    this._lastBattleDuration = 0;
  }

  endSimulation(now = this._now): void {
    if (this._isRunning) {
      this._lastBattleDuration = now - this._battleStartedAt;
    }
    this._isRunning = false;
    for (const unit of this._units) {
      unit.stopMoving();
      unit.setSpinning(false);
    }
    this._pathStates.clear();
  }

  update(dt: number, now: number): void {
    if (!this._isRunning) return;
    this._now = now;

    for (const unit of this._units) {
      unit.update(dt, now);
    }

    if (this.hazards.length > 0) {
      for (const unit of this._units) {
        if (unit.isDead || unit.linkedParent) continue;
        const inHazard = this.hazards.some((hazard) => isPointInsideHazard(
          unit.position,
          hazard,
          Math.max(0.15, unit.definition.collisionRadius * 0.2),
        ));
        if (!inHazard) continue;
        unit.applyDamage(unit.maxHealth + 9999, Vector3.Zero());
      }
    }

    this._assignShieldSlots();
    this._resolveLivingCollisions();
    this._holdShieldFrames();

    for (const unit of this._units) {
      if (unit.isDead || unit.isAnchoredActor) continue;

      const nextDecision = this._nextDecisionAt.get(unit) ?? 0;
      if (now < nextDecision) continue;

      const aiProfile = getAIProfile(unit.definition.aiProfileId);
      this._processUnitDecision(unit, aiProfile, now);
      this._nextDecisionAt.set(unit, now + Math.max(this.minimumDecisionInterval, aiProfile.retargetInterval));
    }

    if (now >= this._nextCleanupSweepAt) {
      this._cleanupExpiredCorpses(now);
      this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    }
  }

  getLivingCount(team: number): number {
    let count = 0;
    for (const unit of this._units) {
      if (!unit.isDead && unit.team === team && unit.countsTowardVictory) count++;
    }
    return count;
  }

  private _resolveLivingCollisions(): void {
    const roots = this._units.filter((unit) => !unit.isDead && !unit.linkedParent);
    if (roots.length < 2) return;

    for (let pass = 0; pass < this.collisionResolutionPasses; pass++) {
      for (let i = 0; i < roots.length; i++) {
        const a = roots[i];
        for (let j = i + 1; j < roots.length; j++) {
          const b = roots[j];
          if (b.isDead) continue;

          const delta = b.position.subtract(a.position);
          delta.y = 0;
          const sameTeam = a.team === b.team;
          // Two bracers of one team stand a fifth closer than their body widths, so a shield line closes up shoulder to shoulder. Any other two of one team stand a tenth closer, so the ranks behind press up into the front one. Enemy contact keeps the full distance.
          const bracedRank = sameTeam && a.definition.aiProfileId === "ai.brace" && b.definition.aiProfileId === "ai.brace";
          // Two carriers slotted into one wall stand at the slot spacing, boards lapping: the solver only parts them inside it.
          const slotA = this._shieldSlots.get(a);
          const sameWall = slotA !== undefined && slotA.wall === this._shieldSlots.get(b)?.wall;
          // Against an enemy a front-rank carrier's reach is his board, not his body: the board stands SHIELD_BOARD_STANDOFF ahead of him on the wall's plane, so an
          // enemy is stopped at its face and two walls meet board to board, instead of bodies and shafts sinking through the boards into the men behind them.
          const reach = (unit: RuntimeUnit) => (this._shieldSlots.get(unit)?.plane ?? null) !== null
            ? Math.max(unit.collisionBodyRadius, SHIELD_BOARD_STANDOFF)
            : unit.collisionBodyRadius;
          const minDistance = sameWall
            ? this.shieldSlotSpacing * 0.9
            : sameTeam
              ? (a.collisionBodyRadius + b.collisionBodyRadius) * (bracedRank ? 0.8 : 0.9)
              : reach(a) + reach(b);
          const distanceSq = delta.lengthSquared();
          if (distanceSq > minDistance * minDistance) continue;

          const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
          const normal = distanceSq > 0.000001
            ? delta.scale(1 / distance)
            : new Vector3(((a.runtimeId + b.runtimeId) % 2 === 0) ? 1 : -1, 0, 0);
          const overlap = minDistance - distance + this.collisionResolutionPadding;
          if (overlap <= 0) continue;

          const contactBias = sameTeam ? 0.55 : 1.0;
          // A colossus is not held up by its own troops: it wades through their ranks and they are the ones moved aside.
          const resistance = (unit: RuntimeUnit) => sameTeam && unit.definition.size === "colossal"
            ? 1e6
            : Math.max(0.55, unit.definition.mass * unit.crowdResistance * (1 + unit.braceAbsorption));
          const resistanceA = resistance(a);
          const resistanceB = resistance(b);
          const inverseMassA = 1 / resistanceA;
          const inverseMassB = 1 / resistanceB;
          const inverseMassTotal = inverseMassA + inverseMassB;
          // A colossus on the move parts its own troops to either side of its path: pushed straight off it, the ones at its rump stayed queued behind it.
          const colossus = !sameTeam ? null : a.definition.size === "colossal" ? a : b.definition.size === "colossal" ? b : null;
          const sideways = (unit: RuntimeUnit, away: Vector3): Vector3 => {
            if (!colossus || unit === colossus) return away;
            const heading = colossus.collisionVelocity;
            if (heading.lengthSquared() < 0.04) return away;
            heading.normalize();
            const side = away.subtract(heading.scale(Vector3.Dot(away, heading)));
            if (side.lengthSquared() < 0.0025) side.set(-heading.z, 0, heading.x).scaleInPlace(unit.runtimeId % 2 === 0 ? 1 : -1);
            return side.normalize();
          };
          a.applyCollisionSeparation(sideways(a, normal.scale(-1)).scale(overlap * (inverseMassA / inverseMassTotal) * a.crowdSeparationStrength * contactBias));
          b.applyCollisionSeparation(sideways(b, normal).scale(overlap * (inverseMassB / inverseMassTotal) * b.crowdSeparationStrength * contactBias));

          const relativeVelocity = b.collisionVelocity.subtract(a.collisionVelocity);
          const impactSpeed = Math.max(0, -Vector3.Dot(relativeVelocity, normal));
          const impulseStrength = Math.min(4.5, overlap * 4.2 * contactBias + impactSpeed * (sameTeam ? 0.55 : 0.9));
          if (impulseStrength <= 0.08) continue;

          const weightedMassA = resistanceA * this._collisionMomentumMultiplier(a);
          const weightedMassB = resistanceB * this._collisionMomentumMultiplier(b);
          const weightedMassTotal = weightedMassA + weightedMassB;
          const compressionRatio = overlap / Math.max(0.05, minDistance);
          // Allies shove each other apart but do not knock each other over: contact inside a team adds nothing to balance pressure. A blow reaches the rank behind through the spillover below.
          const sameTeamPressureScale = 0;
          const enemyPressureScale = 0.92 + compressionRatio * 0.46 + impactSpeed * 0.08;
          const contactPressureScale = sameTeam ? sameTeamPressureScale : enemyPressureScale;
          const pressureScaleA = contactPressureScale * this._collisionMomentumMultiplier(b);
          const pressureScaleB = contactPressureScale * this._collisionMomentumMultiplier(a);
          a.applyCollisionImpulse(
            normal.scale(-impulseStrength * (weightedMassB / weightedMassTotal)),
            normal,
            pressureScaleA,
            b.contactRole,
          );
          b.applyCollisionImpulse(
            normal.scale(impulseStrength * (weightedMassA / weightedMassTotal)),
            normal.scale(-1),
            pressureScaleB,
            a.contactRole,
          );
          if (!sameTeam && impulseStrength >= 0.9) {
            const contactCenter = a.position.add(b.position).scale(0.5);
            this.impactPresentation?.recordImpact({
              source: "simulation",
              path: "crowd-shock",
              position: contactCenter,
              target: a,
              impulse: normal.scale(-impulseStrength),
              crowdMetrics: {
                pressure: impulseStrength * pressureScaleA,
                displacementMagnitude: overlap,
                impulseMagnitude: impulseStrength,
              },
              attackerTeam: b.team,
            });
            this.impactPresentation?.recordImpact({
              source: "simulation",
              path: "crowd-shock",
              position: contactCenter,
              target: b,
              impulse: normal.scale(impulseStrength),
              crowdMetrics: {
                pressure: impulseStrength * pressureScaleB,
                displacementMagnitude: overlap,
                impulseMagnitude: impulseStrength,
              },
              attackerTeam: a.team,
            });
            this._applySingleHopSpillover(a, normal.scale(-1), impulseStrength * a.pressureTransferScale, b.contactRole);
            this._applySingleHopSpillover(b, normal, impulseStrength * b.pressureTransferScale, a.contactRole);
          }
        }
      }
    }
  }

  private _applySingleHopSpillover(
    source: RuntimeUnit,
    awayDirection: Vector3,
    basePressure: number,
    contactRole: RuntimeUnit["contactRole"],
  ): void {
    if (basePressure <= 0.12) return;
    let candidate: RuntimeUnit | null = null;
    let bestDistanceSq = Number.POSITIVE_INFINITY;
    const radius = Math.max(2.2, source.collisionBodyRadius * 4.2);
    for (const other of this._units) {
      if (other === source || other.isDead || other.linkedParent || other.team !== source.team) continue;
      const delta = other.position.subtract(source.position);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      if (distanceSq <= 0.0001 || distanceSq > radius * radius || distanceSq >= bestDistanceSq) continue;
      bestDistanceSq = distanceSq;
      candidate = other;
    }
    if (!candidate) return;

    const pressure = Math.min(1.45, basePressure);
    const push = awayDirection.scale(Math.min(0.18, pressure * 0.06));
    candidate.applyCrowdDisplacement(push, pressure, awayDirection, 0.58, contactRole);
    candidate.registerPressureTransfer(pressure, contactRole);
  }

  private _collisionMomentumMultiplier(unit: RuntimeUnit): number {
    let multiplier = 1;
    const abilities = new Set(unit.definition.abilities ?? []);
    const size = unit.definition.size ?? "medium";

    if (size === "large") multiplier += 0.08;
    if (size === "giant") multiplier += 0.18;
    if (size === "colossal") multiplier += 0.28;
    if (unit.definition.archetype === "charge_melee") multiplier += 0.18;
    if (unit.definition.archetype === "giant_melee") multiplier += 0.12;
    if (abilities.has("push_force")) multiplier += 0.25;
    if (abilities.has("giant_slam")) multiplier += 0.18;
    if (abilities.has("jump_charge") || abilities.has("leap_attack")) multiplier += 0.12;
    if (unit.isSpinning) multiplier += 0.1;

    return multiplier;
  }

  private _processUnitDecision(unit: RuntimeUnit, aiProfile: AIProfile, now: number): void {
    const attackProfile = getAttackProfile(unit.definition.attackProfileId);
    const preset = getBehaviorPreset(unit);
    const canAttack = unit.hasCapability("attack", now);
    const canMove = unit.hasCapability("move", now);
    unit.holdHeading(null);

    if (attackProfile.type === AttackType.Support) {
      const ally = this._selectAllyToSupport(unit, aiProfile);
      if (!ally) {
        this._clearPathState(unit);
        return;
      }
      if (!canMove && Vector3.Distance(unit.position, ally.position) > unit.definition.engageRange + this.attackRangePadding) {
        unit.stopMoving();
        this._clearPathState(unit);
        return;
      }
      this._handleSupportAction(unit, ally, attackProfile, now);
      return;
    }

    const enemy = this._selectEnemyTarget(unit, aiProfile);
    if (!enemy) {
      unit.stopMoving();
      unit.setSpinning(false);
      this._clearPathState(unit);
      return;
    }

    // Reach is to the target's hide, not its middle: a giant's body keeps a man farther from its centre than his weapon is long, and he never swung.
    // ...and a giant is struck from the second rank too: it stands over the men at its hide, and those a rank's depth behind them reach it past their shoulders.
    const overRank = enemy.collisionBodyRadius > unit.collisionBodyRadius * 2 ? 1 : 0;
    const engageDistance = unit.definition.engageRange + this.attackRangePadding + Math.max(0, enemy.collisionBodyRadius - unit.collisionBodyRadius) + overRank;
    const distance = Vector3.Distance(unit.position, enemy.position);

    if (hasAbility(unit, "teleport") && distance > engageDistance && distance < engageDistance * 3 && unit.canAttack(now)) {
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(unit.position);
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.65, 8);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(newPos);
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.5);
      return;
    }

    if ((preset === "iconic_super_peasant" || preset === "iconic_thor") && distance > engageDistance && distance < engageDistance * (preset === "iconic_super_peasant" ? 5.5 : 3.0) && unit.canAttack(now)) {
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(
          unit.position,
          preset === "iconic_super_peasant" ? new Color3(1.0, 0.88, 0.35) : undefined,
        );
      }
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.45, preset === "iconic_super_peasant" ? 9.5 : 4.6);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(
          newPos,
          preset === "iconic_super_peasant" ? new Color3(1.0, 0.9, 0.45) : undefined,
        );
      }
      unit.setAttackCooldown(now, attackProfile.cooldown * (preset === "iconic_super_peasant" ? 0.18 : 0.32));
      return;
    }

    if ((hasAbility(unit, "jump_charge") || hasAbility(unit, "leap_attack")) && distance > engageDistance && distance < engageDistance * 2.5 && unit.canAttack(now)) {
      const dir = enemy.position.subtract(unit.position).normalize();
      const leapDist = Math.min(distance - engageDistance * 0.4, 4.5);
      const newPos = unit.position.add(dir.scale(leapDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.35);
      return;
    }

    if (hasAbility(unit, "spin_move") && distance > engageDistance) {
      if (!canMove) {
        unit.stopMoving();
        unit.setSpinning(false);
        this._clearPathState(unit);
        return;
      }
      this._moveUnitToward(unit, enemy.position, engageDistance, now);
      unit.setSpinning(true);
      if (this.visualEffects && Math.random() < 0.35) {
        this.visualEffects.spawnTornadoDust(unit.position);
      }
      return;
    }
    unit.setSpinning(false);
    const spearSlot = this._shieldSlots.get(unit);
    if (spearSlot && distance <= engageDistance + this.spearLevelReach) unit.levelSpearAt(enemy.position, enemy.collisionBodyRadius, spearSlot.hold !== null);
    if (attackProfile.type === AttackType.Melee && distance <= engageDistance + this.blowReadyReach) {
      const inReach = distance <= engageDistance + this.blowStrikeReach;
      // Out of reach of his own target, his blow is aimed at any enemy across his front within his reach and a body more: a rank back, over his own front man
      const mark = inReach ? enemy : this._blowMark(unit, enemy, engageDistance + this.blowStrikeReach + unit.collisionBodyRadius * 2);
      // A rank back, behind a man of his own side, a clubber rests his club low over that man's shoulder between beats and strikes from there on his beat
      const behind = !inReach && (mark !== null || (distance <= engageDistance + this.blowStrikeReach + REAR_RANK_REACH && this._allyBetween(unit, enemy)));
      unit.readyBlow(inReach || behind, mark ?? enemy, behind);
    }

    if (distance <= engageDistance) {
      // Reach decides who may swing, not where the rank stops: short weapons shove in to
      // shoulder contact so the two front lines meet instead of fencing across a gap.
      // Bracers hold their ground and let the rush come onto the shields, but two shield lines facing each other both close.
      const contactDistance = unit.collisionBodyRadius + enemy.collisionBodyRadius + this.meleePressGap;
      const presses = (aiProfile.id !== "ai.brace" || enemy.definition.aiProfileId === "ai.brace") && unit.definition.engageRange < this.meleePressMaxReach;
      // A carrier out of its slot sidles along the wall into it while it fights.
      const slot = this._shieldSlots.get(unit);
      const sidle = this._shieldSlotStep(unit, true);
      if (canMove && slot?.hold) {
        // A rear-rank man keeps his place behind the boards and fights over them: he does not press through the front.
        if (sidle) unit.moveTo(unit.position.add(sidle));
        else unit.stopMoving();
      } else if (canMove && presses && distance > contactDistance + 0.05) {
        const back = unit.position.subtract(enemy.position);
        back.y = 0;
        const stand = enemy.position.add(back.normalize().scale(contactDistance));
        unit.moveTo(sidle ? stand.addInPlace(sidle) : stand);
      } else if (canMove && sidle) {
        unit.moveTo(unit.position.add(sidle));
      } else {
        unit.stopMoving();
      }
      this._clearPathState(unit);
      unit.faceTarget(enemy.position);
      if (slot) this._holdWallHeading(unit, slot, enemy);
      if (attackProfile.type === AttackType.Melee) unit.leanIntoShove();
      if (canAttack) {
        this._tryAttack(unit, enemy, attackProfile, now);
      }
    } else {
      if (canMove) {
        this._moveUnitToward(unit, enemy.position, engageDistance, now);
      } else {
        unit.stopMoving();
        this._clearPathState(unit);
      }
    }
  }

  private _handleSupportAction(
    supporter: RuntimeUnit, ally: RuntimeUnit,
    attackProfile: AttackProfile, now: number,
  ): void {
    const engageDistance = supporter.definition.engageRange + this.attackRangePadding;
    const distance = Vector3.Distance(supporter.position, ally.position);

    if (distance > engageDistance) {
      this._moveUnitToward(supporter, ally.position, engageDistance, now);
      return;
    }

    supporter.stopMoving();
    this._clearPathState(supporter);
    supporter.faceTarget(ally.position);
    if (!supporter.canAttack(now)) return;

    const cooldownMultiplier = supporter.definition.cooldownMultiplier ?? 1;
    supporter.setAttackCooldown(now, attackProfile.cooldown * cooldownMultiplier);
    let healAmount = Math.max(20, attackProfile.damage);
    if (getBehaviorPreset(supporter) === "secret_cheerleader") {
      healAmount = Math.max(healAmount, 45);
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(ally.position);
    }
    ally.heal(healAmount);
  }

  private _moveUnitToward(unit: RuntimeUnit, desired: Vector3, engageDistance: number, now: number): void {
    // A rear-rank man follows the wall he backs: he marches no closer to it than shieldRankGap, paced to the front as he comes up,
    // and when the front halts he halts behind it, square to the advance, stepping only across to his gap. He is never pulled back.
    const slot = this._shieldSlots.get(unit);
    const behind = slot?.hold ? slot.hold.x * Math.sin(slot.heading) + slot.hold.z * Math.cos(slot.heading) : Infinity;
    if (slot && behind <= 0) {
      const across = this._shieldSlotStep(unit);
      if (across) unit.moveTo(unit.position.add(across));
      else unit.stopMoving();
      this._clearPathState(unit);
      unit.faceTarget(desired);
      unit.holdHeading(slot.heading);
      // Halted behind a wall that has met the enemy he is in the press too: board up and spear down, though his own reach is short of them.
      if (Vector3.Distance(unit.position, desired) <= engageDistance + this.shieldRankGap + 1) unit.leanIntoShove();
      return;
    }
    unit.setCohesionMoveMultiplier(Math.min(this._resolveCohesionMoveMultiplier(unit, desired), 0.5 + 0.5 * behind / this.shieldRankFollowBand));
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) {
      unit.moveTo(this._steerIntoShieldSlot(unit, this._resolveHazardAwareMoveTarget(unit, desired)));
      return;
    }

    const state = this._getPathState(unit, now);
    this._updatePathProgress(unit, desired, engageDistance, state, now);

    if (state.bypassGoal && now >= state.bypassExpiresAt) {
      state.bypassGoal = null;
    }

    const activeGoal = state.bypassGoal ?? desired;
    const desiredGoalMoved = !state.desiredGoal
      || Vector3.DistanceSquared(state.desiredGoal, activeGoal) > 4;
    const routeMissing = state.waypoints.length === 0 || state.waypointIndex >= state.waypoints.length;
    const needsFreshRoute = (desiredGoalMoved || routeMissing) && now >= state.repathBlockedUntil;

    if (needsFreshRoute) {
      state.desiredGoal = activeGoal.clone();
      state.waypoints = this._buildNavigationWaypoints(unit, activeGoal);
      state.waypointIndex = 0;
      state.repathBlockedUntil = now + this.repathCooldown;
    }

    while (state.waypointIndex < state.waypoints.length) {
      const waypoint = state.waypoints[state.waypointIndex];
      const reachDistance = Math.max(this.waypointReachDistance, unit.definition.collisionRadius * 1.6);
      if (Vector3.DistanceSquared(unit.position, waypoint) > reachDistance * reachDistance) break;
      state.waypointIndex += 1;
      if (state.bypassGoal && Vector3.DistanceSquared(unit.position, waypoint) <= reachDistance * reachDistance) {
        state.bypassGoal = null;
      }
    }

    const nextWaypoint = state.waypoints[state.waypointIndex] ?? this._resolveHazardAwareMoveTarget(unit, activeGoal);
    const steered = this._applyCrowdAvoidance(unit, nextWaypoint);
    unit.moveTo(state.bypassGoal ? steered : this._steerIntoShieldSlot(unit, steered));
  }

  /**
   * Sorts each team's shield carriers into walls: the carriers of one rank, side by side across the line of advance,
   * each given a slot shieldSlotSpacing from the next about the middle of the wall. Carriers close up into their slots
   * on the march and in contact, so their boards overlap. A rank behind a wall is slotted to it: each man behind the
   * gap between two of its boards and shieldRankGap back, on the march as in contact, so the wall stands two deep.
   */
  private _assignShieldSlots(): void {
    this._shieldSlots.clear();
    for (const unit of [...this._shieldRanks.keys()]) {
      if (unit.isDead || !this._units.includes(unit)) this._shieldRanks.delete(unit);
    }
    let walls = 0;
    const standing = this._units.filter((unit) => !unit.isDead && !unit.linkedParent);
    const teams = [...new Set(standing.map((unit) => unit.team))].sort((a, b) => a - b);
    for (const team of teams) {
      const carriers = standing.filter((unit) => unit.team === team && this._carriesWallShield(unit));
      const enemies = standing.filter((unit) => unit.team !== team);
      if (carriers.length < 2 || enemies.length === 0) continue;
      const middle = (units: RuntimeUnit[], axis: "x" | "z") => units.reduce((sum, unit) => sum + unit.position[axis], 0) / units.length;
      let fx = middle(enemies, "x") - middle(carriers, "x");
      let fz = middle(enemies, "z") - middle(carriers, "z");
      const advance = Math.hypot(fx, fz);
      if (advance < 0.01) continue;
      fx /= advance;
      fz /= advance;
      const heading = Math.atan2(fx, fz);
      // Depth runs along the advance, side across it.
      const placed = carriers.map((unit) => ({
        unit,
        depth: unit.position.x * fx + unit.position.z * fz,
        side: unit.position.z * fx - unit.position.x * fz,
      })).sort((a, b) => a.side - b.side || a.unit.runtimeId - b.unit.runtimeId);
      // A carrier seen for the first time takes the rank its depth behind the foremost one puts it in.
      const front = Math.max(...placed.map((entry) => entry.depth));
      for (const entry of placed) {
        if (this._shieldRanks.has(entry.unit)) continue;
        this._shieldRanks.set(entry.unit, Math.max(0, Math.ceil((front - entry.depth) / this.shieldRankDepth - 1 - 1e-6)));
      }
      const rankOf = (unit: RuntimeUnit) => this._shieldRanks.get(unit) ?? 0;
      let ahead: ShieldWallLine[] = [];
      let aheadRank = -1;
      for (const r of [...new Set(placed.map((entry) => rankOf(entry.unit)))].sort((a, b) => a - b)) {
        const rank = placed.filter((entry) => rankOf(entry.unit) === r);
        const hosts = aheadRank === r - 1 ? ahead : [];
        const formed: ShieldWallLine[] = [];
        if (r === 0) {
          let start = 0;
          for (let i = 1; i <= rank.length; i++) {
            if (i < rank.length && rank[i].side - rank[i - 1].side <= this.shieldWallGap) continue;
            const wall = rank.slice(start, i);
            start = i;
            if (wall.length < 2) continue;
            const first = wall.reduce((sum, entry) => sum + entry.side, 0) / wall.length - (wall.length - 1) * 0.5 * this.shieldSlotSpacing;
            const wallId = walls++;
            const line = wall.reduce((sum, entry) => sum + entry.depth, 0) / wall.length;
            wall.forEach((entry, k) => {
              const shift = first + k * this.shieldSlotSpacing - entry.side;
              const side = first + k * this.shieldSlotSpacing;
              this._shieldSlots.set(entry.unit, { wall: wallId, offset: new Vector3(-fz * shift, 0, fx * shift), heading, hold: null, plane: line, at: new Vector3(line * fx - side * fz, 0, line * fz + side * fx) });
            });
            formed.push({ first, count: wall.length, depth: wall.reduce((sum, entry) => sum + entry.depth, 0) / wall.length });
          }
        } else {
          // Each rear man backs the wall ahead that he stands behind; with none ahead of him he moves up a rank.
          const backing = new Map<ShieldWallLine, typeof rank>();
          for (const entry of rank) {
            const host = hosts.find((line) => entry.side >= line.first - this.shieldWallGap
              && entry.side <= line.first + (line.count - 1) * this.shieldSlotSpacing + this.shieldWallGap);
            if (!host) {
              this._shieldRanks.set(entry.unit, r - 1);
              continue;
            }
            backing.set(host, [...(backing.get(host) ?? []), entry]);
          }
          for (const [host, group] of backing) {
            // Slots sit on the half spacings of the wall ahead: behind its gaps while the group fits between its flanks, centred on it when it does not.
            const gaps = host.count - 1;
            const wanted = Math.round((group.reduce((sum, entry) => sum + entry.side, 0) / group.length - host.first) / this.shieldSlotSpacing - group.length * 0.5);
            const j0 = group.length <= gaps ? Math.min(Math.max(wanted, 0), gaps - group.length) : Math.floor((gaps - group.length) / 2);
            const first = host.first + (j0 + 0.5) * this.shieldSlotSpacing;
            const depth = host.depth - this.shieldRankGap;
            const wallId = walls++;
            group.forEach((entry, k) => {
              const shift = first + k * this.shieldSlotSpacing - entry.side;
              const back = depth - entry.depth;
              this._shieldSlots.set(entry.unit, {
                wall: wallId,
                offset: new Vector3(-fz * shift, 0, fx * shift),
                heading,
                hold: new Vector3(-fz * shift + fx * back, 0, fx * shift + fz * back),
                plane: null,
                at: new Vector3(depth * fx - (first + k * this.shieldSlotSpacing) * fz, 0, depth * fz + (first + k * this.shieldSlotSpacing) * fx),
              });
            });
            formed.push({ first, count: group.length, depth });
          }
        }
        ahead = formed;
        aheadRank = r;
      }
    }
    // Every slotted man's spear stands on his wall's heading from the moment he is slotted, not only once an enemy is handed to him, so a wall's shafts are one line.
    // ...and his board on his rank's strip: the front rank's on the wall's plane, a rear rank's on its own line, each seated on his slot (see _holdShieldFrames).
    for (const [unit, slot] of this._shieldSlots) {
      const line = slot.plane ?? slot.at.x * Math.sin(slot.heading) + slot.at.z * Math.cos(slot.heading);
      unit.holdSpearInWall(slot.heading, line, slot.at);
    }
  }

  /*
   * The shield wall as one body (rebuilt 210). Spec, read off the reference:
   *   tabs_screenshot_06 (a Viking wall closing, two ranks): the front rank's round boards, each about 1.5 shoulder spacings across, overlap rim over rim into one
   *   band at chest height, every board at the same height and the same turn, so from the front, the side or three-quarter on no torso shows between two of them.
   *   Every man stands upright behind his own board, a shoulder spacing from the next, none inside another; the rear rank stands a rank gap behind, its boards a
   *   second band behind the first. trailer_2_sheet_03 r2c3: tall boards packed edge to edge in one plane, the wall a single face.
   * So:
   *   Slots: each carrier's slot is a point in his wall's frame (ShieldSlot.at): across at his slot spacing, in depth on his rank's line. The frame sits on the
   *   wall's mean place and heading every step, so what the shove does to the men together moves the whole wall; after the crowd solver each carrier on his feet
   *   is put back on his slot (up to SHIELD_SLOT_SNAP a step, which is every step's drift), so no shove parts two men of a wall or runs one into another.
   *   Feet: a man held in his wall is braced by it: crowd pressure does not topple him (RuntimeUnit.wallBraced). A blast still throws him, and a man out of his
   *   wall falls as any other does.
   *   Boards: each rank's boards are one strip: every board in a rank is seated on its bearer's slot across the wall, BOARD_PLANE_REACH ahead of the rank's line,
   *   at one height (BOARD_SEAT_HEIGHT of the bearer's stature) and one turn (the heading plus BOARD_LAP), whatever his arms and trunk are doing (see
   *   ProceduralAnimator._lapBoard). The front rank's strip is the face an enemy is stopped at (SHIELD_BOARD_STANDOFF).
   */
  private _holdShieldFrames(): void {
    for (const unit of this._units) unit.wallBraced = false;
    for (const [unit, slot] of this._shieldSlots) {
      if (unit.isDead || unit.isToppled || unit.isDowned) continue;
      unit.wallBraced = true;
      const error = slot.at.subtract(unit.position);
      error.y = 0;
      const reach = error.length();
      if (reach < 1e-3) continue;
      unit.applyCollisionSeparation(error.scaleInPlace(Math.min(reach, SHIELD_SLOT_SNAP) / reach));
    }
    this._keepRanksDeep();
  }

  /**
   * Ranks a body deep (tabs_screenshot_06: the rear rank stands a full body behind the front, every helmet its own): after the slot snap, a rear-rank man who
   * has come within a body of a man of his own side ahead of him in the wall is put back along the wall's heading by the shortfall. Depth only: the front rank and
   * the lateral pitch (the board lap) are not touched, so this does not fight the snap across.
   */
  /** The nearest enemy on his feet within reach of him and across his front (the side his own target is on), or null: the man a blow out of the sim's reach is aimed at. */
  private _blowMark(unit: RuntimeUnit, target: RuntimeUnit, reach: number): RuntimeUnit | null {
    const tx = target.position.x - unit.position.x, tz = target.position.z - unit.position.z;
    const far = Math.hypot(tx, tz);
    if (far < 1e-3) return null;
    let best: RuntimeUnit | null = null;
    let bestDistance = reach;
    for (const other of this._units) {
      if (other.team === unit.team || other.isDead || other.isDowned || other.linkedParent) continue;
      const dx = other.position.x - unit.position.x, dz = other.position.z - unit.position.z;
      const d = Math.hypot(dx, dz);
      if (d >= bestDistance || d < 1e-3) continue;
      if ((dx * tx + dz * tz) / (d * far) < 0.5) continue;
      best = other;
      bestDistance = d;
    }
    return best;
  }

  /** Whether a man of his side on his feet stands between him and this enemy, in a lane of his line to him and within about two bodies of him. */
  private _allyBetween(unit: RuntimeUnit, enemy: RuntimeUnit): boolean {
    const tx = enemy.position.x - unit.position.x, tz = enemy.position.z - unit.position.z;
    const reach = Math.hypot(tx, tz);
    if (reach < 1e-3) return false;
    const fx = tx / reach, fz = tz / reach;
    for (const ally of this._units) {
      if (ally === unit || ally.team !== unit.team || ally.isDead || ally.isToppled || ally.isDowned) continue;
      const dx = ally.position.x - unit.position.x, dz = ally.position.z - unit.position.z;
      const along = dx * fx + dz * fz;
      if (along <= 0.1 || along >= reach) continue;
      if (Math.abs(dz * fx - dx * fz) < REAR_RANK_LANE && along < REAR_RANK_REACH + 0.6) return true;
    }
    return false;
  }

  private _keepRanksDeep(): void {
    const front: RuntimeUnit[] = [];
    for (const [unit, slot] of this._shieldSlots) if (slot.hold === null && unit.wallBraced) front.push(unit);
    for (const [unit, slot] of this._shieldSlots) {
      if (slot.hold === null || !unit.wallBraced) continue;
      const fx = Math.sin(slot.heading), fz = Math.cos(slot.heading);
      let back = 0;
      for (const ahead of front) {
        if (ahead.team !== unit.team) continue;
        const dx = ahead.position.x - unit.position.x, dz = ahead.position.z - unit.position.z;
        const along = dx * fx + dz * fz;
        const across = Math.abs(dz * fx - dx * fz);
        const body = unit.collisionBodyRadius + ahead.collisionBodyRadius;
        if (along < -0.05 || across >= body) continue;
        // How far in depth he must stand behind this man for the two bodies to be clear at this lateral offset
        const need = Math.sqrt(Math.max(0, body * body - across * across)) * RANK_DEPTH_SHARE;
        back = Math.max(back, need - along);
      }
      if (back > 1e-3) unit.applyCollisionSeparation(new Vector3(-fx * back, 0, -fz * back));
    }
    // ...and an ally of the wall who is not in it (a knight, a clubber come up behind it) queues behind its board row: a man on his feet within a body and a
    // board's reach behind a front-rank wall man is put back along that wall's heading, so no blade or mitt is pushed through the boards from behind
    for (const unit of this._units) {
      if (unit.isDead || unit.isToppled || unit.isDowned || this._shieldSlots.has(unit) || unit.position.y > 0.3) continue;
      let back = 0;
      let dir: Vector3 | null = null;
      for (const ahead of front) {
        if (ahead.team !== unit.team) continue;
        const heading = this._shieldSlots.get(ahead)!.heading;
        const fx = Math.sin(heading), fz = Math.cos(heading);
        const dx = ahead.position.x - unit.position.x, dz = ahead.position.z - unit.position.z;
        const along = dx * fx + dz * fz;
        const across = Math.abs(dz * fx - dx * fz);
        const body = unit.collisionBodyRadius + ahead.collisionBodyRadius;
        if (along < -0.05 || across >= body) continue;
        const need = Math.sqrt(Math.max(0, body * body - across * across)) + WALL_QUEUE_GAP;
        if (need - along > back) {
          back = need - along;
          dir = new Vector3(-fx, 0, -fz);
        }
      }
      if (dir && back > 1e-3) unit.applyCollisionSeparation(dir.scaleInPlace(back));
    }
  }

  /** In contact a slotted carrier stands square to his wall's advance, board to the front, while his enemy is within shieldHeadingArc of it. */
  private _holdWallHeading(unit: RuntimeUnit, slot: ShieldSlot, enemy: RuntimeUnit): void {
    const bearing = Math.atan2(enemy.position.x - unit.position.x, enemy.position.z - unit.position.z);
    const off = Math.atan2(Math.sin(bearing - slot.heading), Math.cos(bearing - slot.heading));
    unit.holdHeading(Math.abs(off) <= this.shieldHeadingArc ? slot.heading : null);
  }

  /** A man on his feet holding the line with a full board: bucklers and chargers do not make a wall. */
  private _carriesWallShield(unit: RuntimeUnit): boolean {
    const shield = unit.visualConfig.shield;
    return unit.definition.aiProfileId === "ai.brace" && shield !== "none" && shield !== "buckler"
      && !unit.isToppled && !unit.isDowned;
  }

  /** The step across that takes a carrier toward its slot, no longer than shieldSlotStride, or null when it stands in it. In contact a rear-rank man's step also takes him to his depth behind the front. */
  private _shieldSlotStep(unit: RuntimeUnit, inContact = false): Vector3 | null {
    const slot = this._shieldSlots.get(unit);
    const offset = inContact ? slot?.hold ?? slot?.offset : slot?.offset;
    if (!offset) return null;
    const reach = offset.length();
    if (reach <= 0.05) return null;
    return offset.scale(Math.min(reach, this.shieldSlotStride) / reach);
  }

  /** A slotted carrier marches a stride ahead and a step across toward its slot, so the wall closes up as it advances. */
  private _steerIntoShieldSlot(unit: RuntimeUnit, target: Vector3): Vector3 {
    const step = this._shieldSlotStep(unit);
    if (!step) return target;
    const ahead = target.subtract(unit.position);
    ahead.y = 0;
    if (ahead.lengthSquared() <= 1) return target.add(step);
    return unit.position.add(ahead.normalize()).addInPlace(step);
  }

  private _buildNavigationWaypoints(unit: RuntimeUnit, desired: Vector3): Vector3[] {
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) return [];

    const route = navigationGrid.findRoute(unit.position, desired, unit.definition.collisionRadius);
    if (route) {
      return route.waypoints.map((waypoint) => waypoint.clone());
    }

    const preferredDirection = desired.subtract(unit.position);
    preferredDirection.y = 0;
    const reachableGoal = navigationGrid.findOpenPositionNear(
      desired,
      unit.definition.collisionRadius,
      preferredDirection.lengthSquared() > 0.0001 ? preferredDirection : undefined,
    );
    if (!reachableGoal) return [];

    const fallbackRoute = navigationGrid.findRoute(unit.position, reachableGoal, unit.definition.collisionRadius);
    return fallbackRoute?.waypoints.map((waypoint) => waypoint.clone()) ?? [reachableGoal];
  }

  /** Caps approach speed to the slowest marching ally within cohesionRadius, and holds back a runner that is out ahead of its rank. */
  private _resolveCohesionMoveMultiplier(unit: RuntimeUnit, desired: Vector3): number {
    const ownSpeed = unit.definition.moveSpeed;
    if (ownSpeed <= 0.01) return 1;
    let slowest = ownSpeed;
    const radiusSq = this.cohesionRadius * this.cohesionRadius;
    const holdRadiusSq = this.runnerHoldRadius * this.runnerHoldRadius;
    const advanceX = desired.x - unit.position.x;
    const advanceZ = desired.z - unit.position.z;
    const advanceLength = Math.hypot(advanceX, advanceZ);
    // How far along the advance the foremost marching ally nearby stands from this unit: negative when all of them are behind it.
    let foremostAlly = -Infinity;
    let marchingAllies = 0;
    for (const other of this._units) {
      if (other === unit || other.isDead || other.linkedParent) continue;
      if (other.team !== unit.team || !other.isMoving) continue;
      const dx = other.position.x - unit.position.x;
      const dz = other.position.z - unit.position.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq <= holdRadiusSq && advanceLength > 0.01) {
        marchingAllies++;
        foremostAlly = Math.max(foremostAlly, (dx * advanceX + dz * advanceZ) / advanceLength);
      }
      const otherSpeed = other.definition.moveSpeed;
      if (otherSpeed <= 0.01 || otherSpeed >= slowest) continue;
      if (distanceSq > radiusSq) continue;
      slowest = otherSpeed;
    }
    const held = marchingAllies >= this.runnerHoldMinAllies && foremostAlly < -this.runnerLeadMargin;
    return Math.min(slowest / ownSpeed, held ? this.runnerHoldMultiplier : 1);
  }

  private _applyCrowdAvoidance(unit: RuntimeUnit, waypoint: Vector3): Vector3 {
    const desired = waypoint.subtract(unit.position);
    desired.y = 0;
    if (desired.lengthSquared() <= 0.0001) {
      return waypoint;
    }

    const desiredDirection = desired.normalize();
    const avoidance = new Vector3(0, 0, 0);

    for (const other of this._units) {
      if (other === unit || other.isDead || other.linkedParent) continue;
      const delta = unit.position.subtract(other.position);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      // Press up against standing allies; step closely around fallen bodies of either team
      const ally = other.team === unit.team;
      const fallen = other.isToppled || other.isDowned;
      // Two carriers of one wall only steer apart inside their slot spacing.
      const slot = this._shieldSlots.get(unit);
      const sameWall = !fallen && slot !== undefined && slot.wall === this._shieldSlots.get(other)?.wall;
      const separation = sameWall ? this.shieldSlotSpacing : unit.collisionBodyRadius + other.collisionBodyRadius
        + (fallen ? this.fallenAvoidanceRadius : !ally ? this.localAvoidanceRadius : this.formationAvoidanceRadius);
      if (distanceSq <= 0.0001 || distanceSq > separation * separation) continue;

      const distance = Math.sqrt(distanceSq);
      const away = delta.scale(1 / distance);
      const aheadBias = Math.max(0.15, Vector3.Dot(away, desiredDirection.scale(-1)) + 0.45);
      const weight = ((separation - distance) / separation) * aheadBias * this.localAvoidanceStrength;
      avoidance.addInPlace(away.scale(weight));
    }

    if (avoidance.lengthSquared() <= 0.0001) {
      return waypoint;
    }

    avoidance.normalize().scaleInPlace(Math.min(this.navigationGrid?.cellSize ?? 1, 0.9));
    return waypoint.add(avoidance);
  }

  private _updatePathProgress(
    unit: RuntimeUnit,
    desired: Vector3,
    engageDistance: number,
    state: UnitPathState,
    now: number,
  ): void {
    if (now - state.lastProgressAt < this.stuckTimeout) {
      return;
    }

    const movement = Vector3.Distance(unit.position, state.lastPositionSample);
    const collisionDelta = unit.collisionContactCount - state.lastCollisionContacts;
    const distanceToGoal = Vector3.Distance(unit.position, desired);
    const stalled = distanceToGoal > engageDistance + 1
      && movement < this.progressSampleDistance
      && collisionDelta >= 2;

    if (stalled) {
      const bypass = this._findBypassGoal(unit, desired);
      if (bypass) {
        state.bypassGoal = bypass;
        state.bypassExpiresAt = now + 1.4;
      }
      state.repathBlockedUntil = now;
    }

    state.lastPositionSample = unit.position.clone();
    state.lastCollisionContacts = unit.collisionContactCount;
    state.lastProgressAt = now;
  }

  private _findBypassGoal(unit: RuntimeUnit, desired: Vector3): Vector3 | null {
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) return null;

    const toGoal = desired.subtract(unit.position);
    toGoal.y = 0;
    if (toGoal.lengthSquared() <= 0.0001) {
      return null;
    }

    const forward = toGoal.normalize();
    const right = new Vector3(forward.z, 0, -forward.x);
    const lateralDistance = Math.max(this.congestionBypassDistance, unit.definition.collisionRadius * 6);
    const candidates = [
      unit.position.add(right.scale(lateralDistance)),
      unit.position.add(right.scale(-lateralDistance)),
      unit.position.add(forward.scale(-Math.max(this.congestionBypassDistance, unit.definition.collisionRadius * 4))),
    ];

    let bestCandidate: Vector3 | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      const reachable = navigationGrid.findOpenPositionNear(
        candidate,
        unit.definition.collisionRadius,
        desired.subtract(unit.position),
      );
      if (!reachable) continue;
      const score = Vector3.DistanceSquared(reachable, candidate) + Vector3.DistanceSquared(reachable, desired) * 0.08;
      if (score < bestScore) {
        bestScore = score;
        bestCandidate = reachable;
      }
    }

    return bestCandidate;
  }

  private _getPathState(unit: RuntimeUnit, now: number): UnitPathState {
    const existing = this._pathStates.get(unit);
    if (existing) return existing;

    const created: UnitPathState = {
      waypoints: [],
      waypointIndex: 0,
      desiredGoal: null,
      bypassGoal: null,
      bypassExpiresAt: 0,
      lastPositionSample: unit.position.clone(),
      lastCollisionContacts: unit.collisionContactCount,
      lastProgressAt: now,
      repathBlockedUntil: 0,
    };
    this._pathStates.set(unit, created);
    return created;
  }

  private _clearPathState(unit: RuntimeUnit): void {
    this._pathStates.delete(unit);
  }

  private _tryAttack(attacker: RuntimeUnit, target: RuntimeUnit, attackProfile: AttackProfile, now: number): void {
    if (!attacker.canAttack(now)) return;

    const preset = getBehaviorPreset(attacker);
    const cooldownMultiplier = attacker.definition.cooldownMultiplier ?? 1;
    attacker.setAttackCooldown(now, attackProfile.cooldown * cooldownMultiplier);
    attacker.triggerLinkedRoleActions(attackProfile.cooldown * cooldownMultiplier);
    const emitter = attacker.getAttackEmitter();
    const attackOriginInfo = attacker.getAttackOrigin();
    const smokeOriginInfo = attacker.getSmokeOrigin();
    const impactOriginInfo = attacker.getImpactOrigin();
    const attackOrigin = attackOriginInfo.position;
    const impactOrigin = impactOriginInfo.position;
    if (emitter !== attacker) {
      emitter.triggerAttackVisual(Math.max(0.08, attackProfile.cooldown * cooldownMultiplier * 0.28));
    }

    let impulseDir = target.position.subtract(impactOrigin);
    if (impulseDir.lengthSquared() > 0.0001) {
      impulseDir.normalize();
    } else {
      impulseDir = Vector3.Up();
    }

    const abilities = new Set(attacker.definition.abilities ?? []);
    let damage = attackProfile.damage;
    let splashRadius = attackProfile.splashRadius;
    let knockback = impulseDir.scale(attackProfile.knockback);
    const controlStrength = attacker.definition.controlStrength ?? 1;

    if (abilities.has("pull_hook")) knockback = knockback.scale(-0.8);
    if (abilities.has("push_force")) {
      splashRadius = Math.max(splashRadius, 3.0);
      knockback = knockback.scale(1.7);
      damage *= 0.85;
    }
    if (abilities.has("giant_slam")) {
      splashRadius = Math.max(splashRadius, 2.8);
      knockback = knockback.scale(1.35);
      damage *= 1.15;
    }
    if (abilities.has("fire_dot")) damage *= 1.1;
    if (abilities.has("poison")) damage *= 1.05;

    switch (preset) {
      case "secret_balloon_lift":
        knockback = knockback.scale(-1.3 * controlStrength);
        knockback.y = Math.max(knockback.y, 2.1 * controlStrength);
        splashRadius = Math.max(splashRadius, 1.4);
        damage *= 0.8;
        break;
      case "secret_push_fan":
        splashRadius = Math.max(splashRadius, 3.6);
        knockback = knockback.scale(2.35 * controlStrength);
        damage *= 0.72;
        break;
      case "secret_shout_push":
        splashRadius = Math.max(splashRadius, 5.0);
        knockback = knockback.scale(3.2 * controlStrength);
        damage *= 0.78;
        break;
      case "secret_vlad_hook":
        knockback = knockback.scale(-1.9 * controlStrength);
        knockback.y = Math.max(knockback.y, 0.8);
        damage *= 1.15;
        splashRadius = Math.max(splashRadius, 1.6);
        break;
      case "secret_charge_beast":
      case "secret_mounted_charge":
      case "secret_jump_kicker":
      case "secret_lady_red_jade":
      case "secret_dragon_cart":
        knockback = knockback.scale(1.35 * controlStrength);
        splashRadius = Math.max(splashRadius, 1.25);
        damage *= 1.15;
        break;
      case "secret_spin_flail":
      case "secret_mace_spinner":
        splashRadius = Math.max(splashRadius, 1.8);
        knockback = knockback.scale(1.3 * controlStrength);
        damage *= 1.08;
        break;
      case "secret_executioner":
        splashRadius = Math.max(splashRadius, 1.9);
        knockback = knockback.scale(1.35 * controlStrength);
        damage *= 1.12;
        break;
      case "secret_blackbeard":
        splashRadius = Math.max(splashRadius, 2.8);
        knockback = knockback.scale(2.2 * controlStrength);
        damage *= 1.15;
        break;
      case "secret_giant_slam":
        splashRadius = Math.max(splashRadius, 3.6);
        knockback = knockback.scale(1.55 * controlStrength);
        damage *= 1.18;
        break;
      case "secret_ice_giant":
        splashRadius = Math.max(splashRadius, 3.8);
        knockback = knockback.scale(1.6 * controlStrength);
        damage *= 1.16;
        break;
      case "iconic_mammoth":
        splashRadius = Math.max(splashRadius, 3.0);
        knockback = knockback.scale(1.0 * controlStrength);
        knockback.y = Math.max(knockback.y, 1.35);
        damage *= 1.0;
        break;
      case "iconic_reaper":
        splashRadius = Math.max(splashRadius, 4.2);
        knockback = knockback.scale(-2.0 * controlStrength);
        knockback.y = Math.max(knockback.y, 0.7);
        damage *= 1.08;
        break;
      case "iconic_pirate_queen":
        splashRadius = Math.max(splashRadius, 2.25);
        knockback = knockback.scale(1.65 * controlStrength);
        damage *= 1.18;
        break;
      case "iconic_super_peasant":
        splashRadius = Math.max(splashRadius, 2.4);
        knockback = knockback.scale(2.35 * controlStrength);
        knockback.y = Math.max(knockback.y, 1.3);
        damage *= 1.42;
        break;
      default:
        break;
    }

    if (preset === "iconic_dark_peasant") {
      this._summonUnits(attacker);
      const controlRadius = Math.max(5.2, splashRadius + 1.6);
      const controlDuration = attacker.definition.statusDurationSeconds ?? 3.2;
      const pullForce = knockback.scale(-2.15 * controlStrength);
      const secondaryCenter = target.position.add(impulseDir.scale(-1.2));
      this._applyAreaControl(target.position, controlRadius, attacker.team, damage * 0.9, pullForce, now, 0.28, controlDuration);
      this._applyAreaControl(secondaryCenter, Math.max(3.6, controlRadius * 0.7), attacker.team, damage * 0.55, pullForce.scale(0.78), now, 0.34, Math.max(2.4, controlDuration - 0.4));
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position, new Color3(0.35, 0.24, 0.52));
        this.visualEffects.spawnSmokePuff(secondaryCenter, new Color3(0.28, 0.2, 0.42));
        this.visualEffects.spawnSmokePuff(attacker.position.add(impulseDir.scale(1.2)), new Color3(0.24, 0.18, 0.38));
      }
      return;
    }

    if (preset === "iconic_chronomancer") {
      this._applyAreaControl(target.position, Math.max(3.6, splashRadius + 1.1), attacker.team, damage * 0.72, knockback.scale(0.55 * controlStrength), now, 0.34, attacker.definition.statusDurationSeconds ?? 3.8);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position);
        this.visualEffects.spawnSpellDome(target.position, Math.max(3.6, splashRadius + 1.1), new Color3(0.55, 0.62, 0.95));
      }
      return;
    }

    if ((abilities.has("summon") || abilities.has("clone") || abilities.has("revive")) && this._summonUnits(attacker)) {
      if (attacker.definition.archetype === "summoner" || attacker.definition.archetype === "support_buff") {
        return;
      }
    }

    if (preset === "iconic_zeus") {
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        this.visualEffects.spawnLightning(attackOrigin, target.position.add(new Vector3(0.8, 0, 0.6)));
        this.visualEffects.spawnLightning(attackOrigin, target.position.add(new Vector3(-0.8, 0, -0.6)));
      }
      this._applyDirectOrSplash(target, damage * 1.12, Math.max(3.3, splashRadius + 1.1), attacker.team, knockback.scale(1.95 * controlStrength));
      return;
    }

    if (preset === "iconic_thor") {
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        this.visualEffects.spawnSmokePuff(attackOrigin);
      }
      this._applyDirectOrSplash(target, damage * 1.22, Math.max(2.4, splashRadius + 0.5), attacker.team, knockback.scale(2.15 * controlStrength));
      return;
    }

    if (abilities.has("lightning_strike")) {
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        // The strike's area as one solid shape over the men it hits
        this.visualEffects.spawnSpellDome(target.position, splashRadius > 0 ? splashRadius : 2.2);
      }
      this._applyDirectOrSplash(target, damage, splashRadius > 0 ? splashRadius : 2.2, attacker.team, knockback.scale(1.4));
      if (abilities.has("freeze")) {
        target.applySlow(0.55, attacker.definition.statusDurationSeconds ?? 2.4, now);
      }
      return;
    }

    if (preset === "iconic_scarecrow") {
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(6, attacker.definition.volleyCount ?? 8), {
        projectileShape: "crow",
        splashRadius: 0,
        spreadX: 0.9,
        spreadY: 0.7,
        spreadZ: 0.5,
        delayStep: 0.04,
      });
      return;
    }

    if (preset === "iconic_hwacha") {
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(10, attacker.definition.volleyCount ?? 14), {
        projectileShape: "rocket_arrow",
        splashRadius: 0.4,
        spreadX: 1.2,
        spreadY: 0.85,
        spreadZ: 0.65,
        delayStep: 0.03,
      });
      return;
    }

    if (preset === "iconic_da_vinci_tank") {
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(6, attacker.definition.burstCount ?? 8), {
        projectileShape: "bolt",
        splashRadius: 0.45,
        spreadX: 1.0,
        spreadY: 0.5,
        spreadZ: 0.75,
        delayStep: 0.04,
      });
      return;
    }

    if (preset === "iconic_legacy_tank") {
      this._fireCustomVolley(attacker, target, damage * 1.25, knockback.scale(1.35), 1, {
        projectileShape: "shell",
        splashRadius: 1.5,
        spreadX: 0,
        spreadY: 0,
        spreadZ: 0,
        delayStep: 0,
      });
      return;
    }

    if (preset === "iconic_quick_draw") {
      this._fireBurst(attacker, target, damage * 1.18, knockback.scale(1.2), splashRadius, Math.max(4, attacker.definition.burstCount ?? 6));
      return;
    }

    if (preset === "iconic_monkey_king") {
      const summoned = this._summonUnits(attacker);
      if (summoned) {
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(attacker.position, new Color3(0.94, 0.78, 0.34));
        }
        this._applyDirectOrSplash(target, damage * 0.62, Math.max(1.1, splashRadius * 0.55), attacker.team, knockback.scale(0.72));
        return;
      }
    }

    if (preset === "iconic_super_peasant") {
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(impactOrigin, new Color3(1.0, 0.9, 0.42));
      }
      this._applyAreaControl(target.position, Math.max(3.1, splashRadius + 0.9), attacker.team, damage * 1.08, knockback.scale(1.12), now);
      return;
    }

    if (preset === "iconic_pirate_queen") {
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position, new Color3(0.92, 0.56, 0.38));
      }
      this._applyDirectOrSplash(target, damage * 1.2, Math.max(2.6, splashRadius + 0.5), attacker.team, knockback.scale(1.2));
      return;
    }

    if (preset === "secret_artemis" || preset === "secret_ullr" || preset === "secret_flying_archer") {
      this._fireVolley(attacker, target, damage, knockback, Math.max(2, attacker.definition.volleyCount ?? 3));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (preset === "secret_bomb_cannon") {
      this._fireVolley(attacker, target, damage, knockback, Math.max(2, attacker.definition.volleyCount ?? 2));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (abilities.has("rapid_fire") || preset === "secret_burst_crossbow" || preset === "secret_bank_robbers" || preset === "secret_sensei" || preset === "secret_gatling") {
      this._fireBurst(attacker, target, damage, knockback, splashRadius, Math.max(3, attacker.definition.burstCount ?? 3));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (abilities.has("shotgun_blast")) {
      this._fireShotgun(attacker, target, damage, knockback);
      return;
    }

    if (abilities.has("volley_fire")) {
      this._fireVolley(attacker, target, damage, knockback, Math.max(4, attacker.definition.summonCount ?? 6));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (attackProfile.type === AttackType.Ranged || attackProfile.type === AttackType.Siege) {
      if (this.projectileSystem) {
        if (isFirearmUnit(attacker)) {
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            impulseDir,
            1,
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
          this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
        } else {
          this.projectileSystem.spawnProjectile(
            resolveProjectileShape(attacker, attackProfile) ?? "arrow",
            attackOrigin,
            target,
            damage,
            knockback,
            splashRadius,
            attacker.team,
            this._units,
            undefined,
            0,
            { originLift: originLiftForSource(attackOriginInfo.source) },
          );
        }
      } else {
        this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
      }
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
    if (this.hitLog.length >= 200) this.hitLog.shift();
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: impactOrigin.x, y: impactOrigin.y, z: impactOrigin.z });
    // The blow is seen to land on the step it is struck: striker and struck re-posed now (see RuntimeUnit.landBlow)
    attacker.landBlow(target, now);
    // Melee sparks
    if (this.visualEffects) this.visualEffects.spawnHitSparks(target.position);
    this._applyOnHitStatuses(attacker, target, now, impactOrigin);
  }

  private _summonUnits(attacker: RuntimeUnit): boolean {
    if (!this.spawnUnitById) return false;
    if (this.getLivingCount(attacker.team) >= this.summonLivingCap) return false;
    if (attacker.spawnRole === "summoned" && getBehaviorPreset(attacker) === "iconic_monkey_king") return false;

    const summonIds = attacker.definition.summonUnitIds
      ?? (hasAbility(attacker, "clone") ? [attacker.definition.id] : undefined)
      ?? (hasAbility(attacker, "revive") ? ["spooky.skeleton_warrior"] : undefined);
    if (!summonIds || summonIds.length === 0) return false;

    const activeChildren = countAliveSpawnedChildren(attacker);
    const maxActive = attacker.definition.maxActiveSummons;
    if (maxActive !== undefined && activeChildren >= maxActive) return false;

    const summonCount = Math.max(1, attacker.definition.summonCount ?? 1);
    const remainingSlots = maxActive === undefined ? summonCount : Math.max(0, maxActive - activeChildren);
    const actualSummonCount = Math.min(summonCount, remainingSlots || summonCount);
    if (actualSummonCount <= 0) return false;
    let summoned = false;
    const preset = getBehaviorPreset(attacker);
    const summonLifetime = attacker.definition.summonLifetimeSeconds;
    for (let i = 0; i < actualSummonCount; i++) {
      if (this.getLivingCount(attacker.team) >= this.summonLivingCap) break;
      const summonId = summonIds[i % summonIds.length];
      const angle = (Math.PI * 2 * i) / actualSummonCount;
      const spacing = attacker.definition.behaviorPreset === "secret_present_spawn"
        ? 1.9
        : preset === "iconic_monkey_king"
          ? 2.1
          : 1.5;
      const pos = attacker.position.add(new Vector3(Math.cos(angle) * spacing, 0, Math.sin(angle) * spacing));
      const visualOverride = preset === "iconic_monkey_king"
        ? {
            ...attacker.visualConfig,
            proportions: {
              ...attacker.visualConfig.proportions,
              scale: (attacker.visualConfig.proportions.scale ?? 1) * 0.9,
              bulk: (attacker.visualConfig.proportions.bulk ?? 1) * 0.92,
            },
          }
        : undefined;
      const unit = this.spawnUnitById(summonId, attacker.team, pos, {
        role: "summoned",
        linkedParent: attacker,
        linkedRelation: "spawned-child",
        expireAfterSeconds: summonLifetime,
        visualOverride,
      });
      if (unit) {
        summoned = true;
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(
            pos,
            preset === "iconic_dark_peasant"
              ? new Color3(0.34, 0.22, 0.5)
              : preset === "iconic_monkey_king"
                ? new Color3(0.95, 0.8, 0.35)
                : undefined,
          );
        }
      }
    }
    return summoned;
  }

  private _fireBurst(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, splashRadius: number, shots: number): void {
    const projectileShape = resolveProjectileShape(attacker, getAttackProfile(attacker.definition.attackProfileId)) ?? "arrow";
    const perShotDamage = Math.max(1, Math.ceil(damage / shots));
    for (let i = 0; i < shots; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      if (this.projectileSystem && !isFirearmUnit(attacker)) {
        if (shouldSpawnProjectileMuzzleFx(projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
          const dir = target.position.subtract(attackOrigin).normalize();
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            dir,
            muzzleScaleForProjectile(projectileShape),
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
        }
        const offset = new Vector3((Math.random() - 0.5) * 0.25, Math.random() * 0.2, (Math.random() - 0.5) * 0.15);
        this.projectileSystem.spawnProjectile(
          projectileShape,
          attackOrigin,
          target,
          perShotDamage,
          knockback.scale(0.4),
          splashRadius > 0 ? splashRadius * 0.5 : 0,
          attacker.team,
          this._units,
          offset,
          i * 0.04,
          { originLift: originLiftForSource(attackOriginInfo.source) },
        );
      } else {
        if (this.projectileSystem && isFirearmUnit(attacker)) {
          const dir = target.position.subtract(attackOrigin).normalize();
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            dir,
            1,
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
        }
        this._applyDirectOrSplash(target, perShotDamage, splashRadius, attacker.team, knockback.scale(0.35));
      }
    }
  }

  private _fireShotgun(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3): void {
    const pellets = 6;
    const perPellet = Math.max(1, Math.ceil(damage / pellets));
    const attackOriginInfo = attacker.getAttackOrigin();
    const smokeOriginInfo = attacker.getSmokeOrigin();
    const attackOrigin = attackOriginInfo.position;
    if (this.projectileSystem) {
      const dir = target.position.subtract(attackOrigin).normalize();
      this.projectileSystem.spawnMuzzleFlash(
        smokeOriginInfo.position,
        dir,
        1,
        { originLift: originLiftForSource(smokeOriginInfo.source) },
      );
    }

    for (const unit of this._units) {
      if (unit.isDead || unit.team === attacker.team) continue;
      const distSq = unit.position.subtract(target.position).lengthSquared();
      if (distSq > 2.2 * 2.2) continue;
      const pelletHits = unit === target ? pellets : Math.max(1, Math.floor(pellets / 3));
      this._applyDirectOrSplash(unit, perPellet * pelletHits, 0, attacker.team, knockback.scale(0.5));
    }
  }

  private _fireVolley(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, count: number): void {
    const projectileShape = resolveProjectileShape(attacker, getAttackProfile(attacker.definition.attackProfileId)) ?? "arrow";
    const perProjectile = Math.max(1, Math.ceil(damage / count));

    if (!this.projectileSystem) {
      this._applyDirectOrSplash(target, damage, 1.8, attacker.team, knockback.scale(0.65));
      return;
    }

    for (let i = 0; i < count; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      if (shouldSpawnProjectileMuzzleFx(projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
        const dir = target.position.subtract(attackOrigin).normalize();
        this.projectileSystem.spawnMuzzleFlash(
          smokeOriginInfo.position,
          dir,
          muzzleScaleForProjectile(projectileShape),
          { originLift: originLiftForSource(smokeOriginInfo.source) },
        );
      }
      const spread = new Vector3((Math.random() - 0.5) * 0.9, Math.random() * 0.5, (Math.random() - 0.5) * 0.45);
      this.projectileSystem.spawnProjectile(
        projectileShape,
        attackOrigin,
        target,
        perProjectile,
        knockback.scale(0.35),
        projectileShape === "bomb" || projectileShape === "fireball" ? 0.8 : 0,
        attacker.team,
        this._units,
        spread,
        i * 0.05,
        { originLift: originLiftForSource(attackOriginInfo.source) },
      );
    }
  }

  private _fireCustomVolley(
    attacker: RuntimeUnit,
    target: RuntimeUnit,
    damage: number,
    knockback: Vector3,
    count: number,
    options: {
      projectileShape: ProjectileShape;
      splashRadius: number;
      spreadX: number;
      spreadY: number;
      spreadZ: number;
      delayStep: number;
    },
  ): void {
    if (!this.projectileSystem) {
      this._applyDirectOrSplash(target, damage, Math.max(0, options.splashRadius), attacker.team, knockback);
      return;
    }

    const perProjectile = Math.max(1, Math.ceil(damage / count));
    for (let i = 0; i < count; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      if (shouldSpawnProjectileMuzzleFx(options.projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
        const dir = target.position.subtract(attackOrigin).normalize();
        this.projectileSystem.spawnMuzzleFlash(
          smokeOriginInfo.position,
          dir,
          muzzleScaleForProjectile(options.projectileShape),
          { originLift: originLiftForSource(smokeOriginInfo.source) },
        );
      }
      const spread = new Vector3(
        (Math.random() - 0.5) * options.spreadX,
        Math.random() * options.spreadY,
        (Math.random() - 0.5) * options.spreadZ,
      );
      this.projectileSystem.spawnProjectile(
        options.projectileShape,
        attackOrigin,
        target,
        perProjectile,
        knockback.scale(0.42),
        options.splashRadius,
        attacker.team,
        this._units,
        spread,
        i * options.delayStep,
        { originLift: originLiftForSource(attackOriginInfo.source) },
      );
    }
  }

  private _applyAreaControl(
    center: Vector3,
    radius: number,
    attackerTeam: number,
    damage: number,
    impulse: Vector3,
    now: number,
    slowMultiplier?: number,
    slowDuration?: number,
  ): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam || !unit.isTargetable) continue;
      const distanceSq = unit.position.subtract(center).lengthSquared();
      if (distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = radius > 0 ? Math.max(0, 1 - distance / radius) : 1;
      const delta = unit.applyDamage(damage, impulse);
      this.impactPresentation?.recordImpact({
        source: "simulation",
        path: "splash-secondary",
        position: unit.position,
        target: unit,
        impactDelta: delta,
        damage,
        impulse,
        radius,
        falloff,
        attackerTeam,
      });
      if (slowMultiplier !== undefined && slowDuration !== undefined) {
        unit.applySlow(slowMultiplier, slowDuration, now);
      }
    }
    this._applyCrowdShockwave(center, Math.max(1.8, radius + 0.8), attackerTeam, impulse.scale(0.28));
  }

  private _applyOnHitStatuses(attacker: RuntimeUnit, target: RuntimeUnit, now: number, impactOrigin?: Vector3): void {
    const abilities = new Set(attacker.definition.abilities ?? []);
    const preset = getBehaviorPreset(attacker);
    const statusDuration = attacker.definition.statusDurationSeconds ?? 2.5;
    if (abilities.has("freeze")) {
      const freezeStrength = preset === "secret_ice_giant" ? 0.4 : 0.55;
      target.applySlow(freezeStrength, statusDuration, now);
    }
    if (abilities.has("fire_dot")) {
      const fireDamage = preset === "secret_fire_whip" || preset === "secret_dragon_cart" ? 14 : 10;
      const source = impactOrigin ?? attacker.position;
      target.applyDamage(fireDamage, target.position.subtract(source).normalize().scale(0.3));
      if (this.visualEffects) this.visualEffects.spawnFireBurst(target.position);
    }
    if (abilities.has("poison")) {
      target.applyDamage(6, Vector3.Zero());
    }
    if (abilities.has("fear") && this.visualEffects) {
      this.visualEffects.spawnSmokePuff(target.position);
    }
  }

  private _applyDirectOrSplash(target: RuntimeUnit, damage: number, splashRadius: number, attackerTeam: number, knockback: Vector3): void {
    if (splashRadius > 0) {
      this._applySplashDamage(target.position, splashRadius, attackerTeam, damage, knockback, target);
    } else {
      const delta = target.applyDamage(damage, knockback);
      if (this.impactPresentation) {
        this.impactPresentation.recordImpact({
          source: "simulation",
          path: "direct",
          position: target.position,
          target,
          impactDelta: delta,
          damage,
          impulse: knockback,
          attackerTeam,
        });
      } else if (this.visualEffects) {
        this.visualEffects.spawnImpactDust(target.position);
        this.visualEffects.spawnHitDebris(target.position);
      }
    }
    const shockRadius = splashRadius > 0 ? splashRadius + 0.85 : 1.55;
    this._applyCrowdShockwave(target.position, shockRadius, attackerTeam, knockback.scale(splashRadius > 0 ? 0.3 : 0.2), target);
  }

  private _applySplashDamage(center: Vector3, radius: number, attackerTeam: number, damage: number, impulse: Vector3, primaryTarget?: RuntimeUnit): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam || !unit.isTargetable) continue;
      const distanceSq = unit.position.subtract(center).lengthSquared();
      if (distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = radius > 0 ? Math.max(0, 1 - distance / radius) : 1;
      const delta = unit.applyDamage(damage, impulse);
      const path = unit === primaryTarget ? "splash-primary" : "splash-secondary";
      if (this.impactPresentation) {
        this.impactPresentation.recordImpact({
          source: "simulation",
          path,
          position: unit.position,
          target: unit,
          impactDelta: delta,
          damage,
          impulse,
          radius,
          falloff,
          attackerTeam,
        });
      } else if (this.visualEffects) {
        this.visualEffects.spawnImpactDust(unit.position);
        this.visualEffects.spawnHitDebris(unit.position);
      }
    }
  }

  private _applyCrowdShockwave(
    center: Vector3,
    radius: number,
    attackerTeam: number,
    impulse: Vector3,
    primaryTarget?: RuntimeUnit,
  ): void {
    const baseMagnitude = impulse.length();
    if (baseMagnitude < 0.55 || radius <= 0.5) return;
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit === primaryTarget || unit.isDead || unit.team === attackerTeam || !unit.isTargetable || unit.linkedParent) continue;
      const delta = unit.position.subtract(center);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      if (distanceSq <= 0.00001 || distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = 1 - distance / radius;
      if (falloff <= 0) continue;
      const direction = delta.scale(1 / distance);
      const displacement = direction.scale(baseMagnitude * 0.05 * falloff);
      const pressure = baseMagnitude * 0.7 * falloff;
      unit.applyCrowdDisplacement(displacement, pressure, direction.scale(-1), 1 + falloff * 0.35);
      this.impactPresentation?.recordImpact({
        source: "simulation",
        path: "crowd-shock",
        position: unit.position,
        target: unit,
        impulse,
        radius,
        falloff,
        attackerTeam,
        crowdMetrics: {
          pressure,
          displacementMagnitude: displacement.length(),
          impulseMagnitude: baseMagnitude,
        },
      });
    }
  }

  private _selectEnemyTarget(requester: RuntimeUnit, aiProfile: AIProfile): RuntimeUnit | null {
    let best: RuntimeUnit | null = null;
    let bestScore = Infinity;

    for (const candidate of this._units) {
      if (candidate.isDead || candidate.team === requester.team || !candidate.isTargetable) continue;
      const score = this._scoreCandidate(requester, candidate, aiProfile.targetPriority);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  private _selectAllyToSupport(requester: RuntimeUnit, aiProfile: AIProfile): RuntimeUnit | null {
    let best: RuntimeUnit | null = null;
    let bestScore = Infinity;

    for (const candidate of this._units) {
      if (candidate.isDead || candidate.team !== requester.team || candidate === requester || !candidate.isTargetable) continue;
      if (candidate.currentHealth >= candidate.maxHealth) continue;
      const score = this._scoreCandidate(requester, candidate, aiProfile.targetPriority);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  private _scoreCandidate(requester: RuntimeUnit, candidate: RuntimeUnit, priority: TargetPriority): number {
    // Nearest is by the hide too: measured to its middle a giant was never the nearest enemy of the men pressed against it.
    const hide = Math.max(0, candidate.position.subtract(requester.position).length() - Math.max(0, candidate.collisionBodyRadius - requester.collisionBodyRadius));
    // A giant draws the men round it: within 2 of its hide it counts as touching, and past that as six tenths as far, so they turn on it and do not fight on beside its legs.
    const hideDistance = candidate.collisionBodyRadius > requester.collisionBodyRadius * 2 ? Math.max(0, hide - 2) * 0.6 : hide;
    const baseDistanceScore = hideDistance * hideDistance;
    const linkedRolePenalty = candidate.linkedParent ? 9 : 0;

    switch (priority) {
      case TargetPriority.LowestHealth:
        return candidate.currentHealth + baseDistanceScore * 0.01 + linkedRolePenalty * 0.1;
      case TargetPriority.HighestCost:
        return -candidate.definition.cost + baseDistanceScore * 0.001 + linkedRolePenalty * 0.1;
      default:
        return baseDistanceScore + linkedRolePenalty;
    }
  }

  private _cleanupExpiredCorpses(now: number): void {
    for (let i = this._units.length - 1; i >= 0; i--) {
      const unit = this._units[i];
      if (!unit.isDead || now < unit.deathCleanupAt) continue;

      this._nextDecisionAt.delete(unit);
      for (const mesh of unit.body.allMeshes) {
        mesh.isVisible = false;
      }
      // Gear leaves with the body: a field of loose hats and weapons with no corpses reads as a bug.
      for (const mesh of unit.propMeshes) {
        mesh.isVisible = false;
      }
      if (unit.healthBarMesh) unit.healthBarMesh.isVisible = false;
      if (unit.healthBarBg) unit.healthBarBg.isVisible = false;
    }
  }

  private _resolveHazardAwareMoveTarget(unit: RuntimeUnit, desired: Vector3): Vector3 {
    if (this.hazards.length === 0) return desired;

    const start = unit.position;
    for (const hazard of this.hazards) {
      if (hazard.shape !== "box") continue;

      const padding = Math.max(4.5, unit.definition.collisionRadius + 3.5);
      const left = hazard.center.x - hazard.halfX - padding;
      const right = hazard.center.x + hazard.halfX + padding;
      const top = hazard.center.z - hazard.halfZ - padding;
      const bottom = hazard.center.z + hazard.halfZ + padding;
      if (!this._segmentIntersectsBox(start, desired, left, right, top, bottom)) continue;

      const topCost = Math.abs(start.z - top) + Math.abs(desired.z - top);
      const bottomCost = Math.abs(start.z - bottom) + Math.abs(desired.z - bottom);
      const bypassZ = topCost <= bottomCost ? top : bottom;
      const startOnLeft = start.x <= hazard.center.x;
      const desiredOnLeft = desired.x <= hazard.center.x;
      const crossingHazard = startOnLeft !== desiredOnLeft;
      const nearX = startOnLeft ? left : right;
      const farX = startOnLeft ? right : left;
      const alignedToBypassLane = Math.abs(start.z - bypassZ) <= 2.5;

      if (crossingHazard) {
        return new Vector3(alignedToBypassLane ? farX : nearX, desired.y, bypassZ);
      }

      return new Vector3(nearX, desired.y, bypassZ);
    }

    return desired;
  }

  private _segmentIntersectsBox(
    start: Vector3,
    end: Vector3,
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): boolean {
    const pointInside = (point: Vector3) => (
      point.x >= left && point.x <= right && point.z >= top && point.z <= bottom
    );
    if (pointInside(start) || pointInside(end)) return true;

    const dx = end.x - start.x;
    const dz = end.z - start.z;
    let tMin = 0;
    let tMax = 1;

    const clipAxis = (p: number, q: number): boolean => {
      if (Math.abs(p) < 0.000001) {
        return q >= 0;
      }
      const ratio = q / p;
      if (p < 0) {
        if (ratio > tMax) return false;
        if (ratio > tMin) tMin = ratio;
      } else {
        if (ratio < tMin) return false;
        if (ratio < tMax) tMax = ratio;
      }
      return true;
    };

    return (
      clipAxis(-dx, start.x - left)
      && clipAxis(dx, right - start.x)
      && clipAxis(-dz, start.z - top)
      && clipAxis(dz, bottom - start.z)
      && tMin <= tMax
    );
  }
}
