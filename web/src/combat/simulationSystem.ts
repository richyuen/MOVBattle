import { Color3, Vector3 } from "@babylonjs/core";
import { RuntimeUnit } from "../units/runtimeUnit";
import {
  AttackType, TargetPriority,
  getAttackProfile, getAIProfile,
  type AttackProfile, type AIProfile,
} from "../data/combatProfiles";
import { ProjectileSystem, type ProjectileShape } from "./projectileSystem";
import { VisualEffects } from "./visualEffects";
import type { LinkedRelation, RuntimeSpawnRole } from "../units/runtimeUnit";
import type { UnitVisualConfig } from "../units/unitVisuals";
import type { HazardRegion } from "../map/hazards";
import { isPointInsideHazard } from "../map/hazards";

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
    case "stone": return "stone";
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

export class SimulationSystem {
  private _units: RuntimeUnit[] = [];
  private _nextDecisionAt = new Map<RuntimeUnit, number>();
  private _isRunning = false;
  private _battleStartedAt = 0;
  private _lastBattleDuration = 0;
  private _nextCleanupSweepAt = 0;

  projectileSystem: ProjectileSystem | null = null;
  visualEffects: VisualEffects | null = null;
  spawnUnitById: ((unitId: string, team: number, position: Vector3, options?: SpawnUnitOptions) => RuntimeUnit | null) | null = null;
  hazards: readonly HazardRegion[] = [];

  readonly minimumDecisionInterval = 0.08;
  readonly attackRangePadding = 0.2;
  readonly cleanupSweepInterval = 0.75;
  readonly summonLivingCap = 55;
  private _now = 0;

  get isRunning(): boolean { return this._isRunning; }

  get battleDuration(): number {
    if (this._isRunning) return this._now - this._battleStartedAt;
    return this._lastBattleDuration;
  }

  get units(): readonly RuntimeUnit[] { return this._units; }

  registerUnit(unit: RuntimeUnit): void {
    if (this._units.includes(unit)) return;
    this._units.push(unit);
    this._nextDecisionAt.set(unit, 0);
  }

  unregisterUnit(unit: RuntimeUnit): void {
    const idx = this._units.indexOf(unit);
    if (idx >= 0) this._units.splice(idx, 1);
    this._nextDecisionAt.delete(unit);
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

  private _processUnitDecision(unit: RuntimeUnit, aiProfile: AIProfile, now: number): void {
    const attackProfile = getAttackProfile(unit.definition.attackProfileId);
    const preset = getBehaviorPreset(unit);
    const canAttack = unit.hasContribution("attack");
    const canMove = unit.hasContribution("move");

    if (attackProfile.type === AttackType.Support) {
      const ally = this._selectAllyToSupport(unit, aiProfile);
      if (!ally) return;
      if (!canMove && Vector3.Distance(unit.position, ally.position) > unit.definition.engageRange + this.attackRangePadding) {
        unit.stopMoving();
        return;
      }
      this._handleSupportAction(unit, ally, attackProfile, now);
      return;
    }

    const enemy = this._selectEnemyTarget(unit, aiProfile);
    if (!enemy) {
      unit.stopMoving();
      unit.setSpinning(false);
      return;
    }

    const engageDistance = unit.definition.engageRange + this.attackRangePadding;
    const distance = Vector3.Distance(unit.position, enemy.position);

    if (hasAbility(unit, "teleport") && distance > engageDistance && distance < engageDistance * 3 && unit.canAttack(now)) {
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(unit.position);
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.65, 8);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
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
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.35);
      return;
    }

    if (hasAbility(unit, "spin_move") && distance > engageDistance) {
      if (!canMove) {
        unit.stopMoving();
        unit.setSpinning(false);
        return;
      }
      unit.moveTo(enemy.position);
      unit.setSpinning(true);
      if (this.visualEffects && Math.random() < 0.35) {
        this.visualEffects.spawnTornadoDust(unit.position);
      }
      return;
    }
    unit.setSpinning(false);

    if (distance <= engageDistance) {
      unit.stopMoving();
      unit.faceTarget(enemy.position);
      if (canAttack) {
        this._tryAttack(unit, enemy, attackProfile, now);
      }
    } else {
      if (canMove) {
        unit.moveTo(enemy.position);
      } else {
        unit.stopMoving();
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
      supporter.moveTo(ally.position);
      return;
    }

    supporter.stopMoving();
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
        splashRadius = Math.max(splashRadius, 4.4);
        knockback = knockback.scale(2.15 * controlStrength);
        knockback.y = Math.max(knockback.y, 1.35);
        damage *= 1.28;
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
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(target.position);
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
      if (unit.position.subtract(center).lengthSquared() > radiusSq) continue;
      unit.applyDamage(damage, impulse);
      if (slowMultiplier !== undefined && slowDuration !== undefined) {
        unit.applySlow(slowMultiplier, slowDuration, now);
      }
    }
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
      this._applySplashDamage(target.position, splashRadius, attackerTeam, damage, knockback);
    } else {
      target.applyDamage(damage, knockback);
    }
    // Impact visual feedback
    if (this.visualEffects) {
      this.visualEffects.spawnImpactDust(target.position);
      this.visualEffects.spawnHitFlash(target.position);
    }
  }

  private _applySplashDamage(center: Vector3, radius: number, attackerTeam: number, damage: number, impulse: Vector3): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam || !unit.isTargetable) continue;
      if (unit.position.subtract(center).lengthSquared() > radiusSq) continue;
      unit.applyDamage(damage, impulse);
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
    const baseDistanceScore = candidate.position.subtract(requester.position).lengthSquared();
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
      if (unit.healthBarMesh) unit.healthBarMesh.isVisible = false;
      if (unit.healthBarBg) unit.healthBarBg.isVisible = false;
    }
  }
}
