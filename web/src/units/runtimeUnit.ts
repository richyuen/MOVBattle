import { Vector3, Mesh, MeshBuilder, Color3, Scene, ParticleSystem, TransformNode } from "@babylonjs/core";
import { createFxAmbient } from "../combat/particleFactory";
import { getMaterialFactory } from "./materialFactory";

/*
 * [S] spin while firing (330; card Characteristics "During battle, the machine spins around, launching cannonballs from the cannons"; renaissance.da_vinci_tank.jpg).
 * The da Vinci tank's drum (hull, cannons, muzzles) turns about the upright from its first volley on, DRUM_SPIN.rate rad/s at full speed, reached at
 * spinUp and lost at spinDown per second, and keeps turning through the wait for the next volley and DRUM_SPIN.linger s past it.
 */
const DRUM_SPIN = { rate: 3.5, spinUp: 12, spinDown: 1.5, linger: 1.0 };
/*
 * [S] balloon float (332; renaissance.balloon_archer card Characteristics: "balloons attached to them that causes whatever unit the arrow has hit to float
 * upward. Heavier units may require more balloons to float"; Appearance: the arrow's ball "expand[s] into balloons"). A man a balloon arrow strikes
 * (floatOnBalloons) has `per` team balloons swell over his head in `swell` s, `size` m across on `string` m strings, up to `most` from several arrows;
 * while they hold (`seconds` from the last arrow) gravity is cancelled and he rises at `rise` m/s, divided by the square root of his mass (a heavy man
 * needs more arrows: each arrow's balloons add their share), to at most `top` m; then they pop and he falls.
 */
const BALLOON_FLOAT = { seconds: 3, rise: 1.4, top: 3.2, per: 3, most: 9, size: 0.42, string: 0.55, swell: 0.12 };
/*
 * [S] drunk (342; farmer.potion_seller.jpg, card: "making them green and confused ... These tipsy units will fail to concentrate on attacking and wander about;
 * they may even struggle to stand and walk"). While drunk his skin is DRUNK.dye of the way to DRUNK.green and lit .glow of it (his clothes .6 of that), his
 * trunk rolls .roll rad side to side at .rate rad/s with the head lolling against it, and he goes at .slow of his pace; the simulation has him wander.
 */
const DRUNK = { green: new Color3(0.35, 0.85, 0.2), dye: 0.8, glow: 0.35, roll: 0.22, rate: 4.5, slow: 0.55 };
import type { ImpactDelta } from "../combat/impactPresentation";
import type { UnitDefinition } from "../data/unitDefinitions";
import type { ContactRole, CrowdPhysicsProfile, RagdollProfile } from "../data/combatProfiles";
import type { ArticulatedBody } from "./bodyBuilder";
import { isVehicleUnit } from "./vehicleBuilder";
import { ProceduralAnimator, AnimState, type AttackMotion, type LocomotionBias } from "./proceduralAnimation";
import { resolveObstacleCollisions, type Obstacle } from "../map/obstacles";
import { isPointInsideHazard, type HazardRegion } from "../map/hazards";
import type {
  FxPreset, UnitVisualConfig, VisualStateTag, WeaponPresentationFamily,
} from "./unitVisuals";
import type {
  LinkedActionPreset, LinkedCleanupPolicy, LinkedContributionChannel, LinkedDamageRouting, LinkedMoveMode, LinkedVictoryRouting,
} from "./linkedActorPresets";

export type RuntimeSpawnRole = "placed" | "summoned" | "crew" | "mount" | "attachment";
export type LinkedRelation = "crew" | "mount" | "attachment" | "spawned-child";
export type BattleFeelState = "steady" | "pressure-loaded" | "staggered" | "toppled" | "downed" | "recovering" | "dead";

export interface LinkedEntityDescriptor {
  relation: LinkedRelation;
  label: string;
  persistent: boolean;
  runtimeUnitId?: number;
}

export interface OriginInfo {
  position: Vector3;
  source: "vehicle-socket" | "linked-role" | "parent";
  socket?: "primaryMuzzle" | "muzzleSequence" | "smokeSocket" | "impactOrigin";
  emitter?: RuntimeUnit;
}

/** The rendering group a flung body is drawn in: after the scene's see-through effects, sharing their depth (main.ts keeps its depth uncleared). */
export const FLUNG_RENDER_GROUP = 1;

// A landed heavy blow throws the struck man back off his feet, hip-led (trailer_3_sheet_01 r2c3: the red man leaves seat-first, his trunk tipped back the way
// he goes to ~57 deg from upright with his head still above his hips, one leg trailing down toward where he is going, the other knee kicked up toward the
// striker at hip height): on the land step the trunk pitches BLOW_THROW_TRUNK rad away from the striker about the pelvis (the animator anchors the hip over
// the root and lays the legs out in the flight frame, see THROWN), holds it BLOW_THROW_HOLD s, and settles over the rest of BLOW_THROW_SECONDS, while he is
// thrown back and up in proportion to the blow (its knockback times his own shove response: a club throws a light man further than a heavy one),
// BLOW_THROW_SPEED and BLOW_THROW_LIFT m/s per unit of that, capped at _MAX. Laid outside the crowd lean's clamp and his wall's bracing: while the throw runs
// (isBlowThrown) his wall lets go of him (no slot snap, no bracing) and a man struck from his front half goes straight back out of his file, the way he faced,
// not along a slanting blow into the next man. It is a stagger, not a topple: no balance pressure is loaded, no topple clocks run, he lands on his feet and
// his wall takes him back.
const BLOW_THROW_SECONDS = 0.6;
const BLOW_THROW_HOLD = 0.28;
// Trunk back past 45 deg at the top of the throw, his seat the lowest point and the pivot (was 1.3 about the feet: laid flat, head-first and lowest)
const BLOW_THROW_TRUNK = 1.0;
const BLOW_THROW_SPEED = 0.75;
const BLOW_THROW_LIFT = 1.0;
const BLOW_THROW_SPEED_MAX = 3.5;
const BLOW_THROW_LIFT_MAX = 3.2;
// However braced or heavy he is, a landed blow puts daylight under his feet: at least BLOW_THROW_LIFT_MIN m/s up and BLOW_THROW_SPEED_MIN m/s back
const BLOW_THROW_LIFT_MIN = 5.0;
const BLOW_THROW_SPEED_MIN = 4.5;

export class RuntimeUnit {
  private static _nextRuntimeId = 1;
  static timeNowSeconds: () => number = () => performance.now() / 1000;

  readonly runtimeId: number;
  readonly definition: UnitDefinition;
  readonly team: number;
  readonly body: ArticulatedBody;
  /** The skin's own self-light from the factory: the base an fx preset glows on top of and falls back to. */
  private readonly _skinGlow: Color3;
  readonly animator: ProceduralAnimator;
  readonly propMeshes: Mesh[];
  readonly visualConfig: UnitVisualConfig;

  private _ragdollProfile: RagdollProfile;
  private _crowdPhysicsProfile: CrowdPhysicsProfile;
  private _maxHealth: number;
  private _currentHealth: number;
  private _isDead = false;
  private _nextAttackAt = 0;
  private _deathCleanupAt = Infinity;
  private _deathTime = 0;

  // Movement
  private _moveTarget: Vector3 | null = null;
  private _isMoving = false;
  private _movementVelocity = Vector3.Zero();

  // Physics velocity (used for knockback while alive AND death slide)
  private _velocity = Vector3.Zero();
  private _grounded = true;

  // Death physics
  private _physicsActive = false;

  // Hit stagger
  private _staggerTimer = 0;
  private _crowdPressure = 0;
  private _balancePressure = 0;
  private _balanceDirection = new Vector3(0, 0, 1);
  private _toppleDirection = new Vector3(0, 0, 1);
  private _toppleDirectionTag: "none" | "forward" | "backward" | "sideways" = "none";
  private _toppleForwardness = 0;
  private _toppledUntil = 0;
  private _downedUntil = 0;
  private _recoveringUntil = 0;
  private _pressureTransferred = 0;
  private _attackInterruptedCount = 0;
  private _attackInterruptedUntil = 0;
  private _lastContactRole: ContactRole | null = null;

  // Ambient FxPreset particle system
  private _fxParticleSystem: ParticleSystem | null = null;

  // Special: spinning (berserker)
  private _spinning = false;
  private _headingHold: number | null = null;
  private _slowMultiplier = 1;
  // A charge's run-in (startCharge): his walk times this until _chargeUntil
  private _chargeMultiplier = 1;
  private _chargeUntil = 0;
  private _cohesionMoveMultiplier = 1;
  private _slowUntil = 0;
  // Drunk from a potion's splash (getDrunk, DRUNK): until when, and whether his skin is dyed green now
  private _drunkUntil = 0;
  private _drunkDyed = false;
  private _skinBase: Color3 | null = null;

  // Spawn state for reset
  private _spawnPosition: Vector3;
  private _spawnRotationY: number;
  private _spawnRole: RuntimeSpawnRole = "placed";
  private _countsTowardVictory = true;
  private _linkedParent: RuntimeUnit | null = null;
  private _linkedRelation: LinkedRelation | null = null;
  private _linkedDescriptors: LinkedEntityDescriptor[] = [];
  private _linkedChildren = new Set<RuntimeUnit>();
  private _anchoredOffset: Vector3 | null = null;
  private _syncLinkedFacing = true;
  private _linkedRoleLabel: string | null = null;
  private _linkedParentRoleLabel: string | null = null;
  private _isAnchoredActor = false;
  private _isTargetable = true;
  private _isCombatEmitter = true;
  private _damageRouting: LinkedDamageRouting = "self";
  private _victoryRouting: LinkedVictoryRouting = "self";
  private _moveMode: LinkedMoveMode = "self";
  private _cleanupPolicy: LinkedCleanupPolicy = "self";
  private _detachOnParentDeath = false;
  private _actionPreset: LinkedActionPreset = "none";
  private _contributionChannels: LinkedContributionChannel[] = [];
  private _isImpactOrigin = false;
  private _primaryEmitterEnabled = true;
  private _emitterCursor = 0;
  private _vehicleSocketCursor = 0;
  private _attackOriginOffset: Vector3 | null = null;
  private _smokeOriginOffset: Vector3 | null = null;
  private _impactOriginOffset: Vector3 | null = null;
  private _decorativeStandinsSuppressed = false;
  private _expiresAt = Infinity;
  private _collisionPushTotal = 0;
  private _collisionPushPeak = 0;
  private _collisionContactCount = 0;

  /** Shared obstacle list — set once from main.ts after map build */
  static obstacles: readonly Obstacle[] = [];
  static hazards: readonly HazardRegion[] = [];

  // Health bar
  healthBarMesh: Mesh | null = null;
  healthBarBg: Mesh | null = null;
  healthBarWidth = 1;

  get currentHealth(): number { return this._currentHealth; }
  get maxHealth(): number { return this._maxHealth; }
  get isDead(): boolean { return this._isDead; }
  get deathCleanupAt(): number { return this._deathCleanupAt; }
  get position(): Vector3 { return this.body.root.position; }
  get spawnRole(): RuntimeSpawnRole { return this._spawnRole; }
  get countsTowardVictory(): boolean { return this._countsTowardVictory; }
  get linkedParent(): RuntimeUnit | null { return this._linkedParent; }
  get linkedRelation(): LinkedRelation | null { return this._linkedRelation; }
  get linkedEntities(): readonly LinkedEntityDescriptor[] { return this._linkedDescriptors; }
  get linkedChildren(): readonly RuntimeUnit[] { return [...this._linkedChildren]; }
  get isAnchoredActor(): boolean { return this._isAnchoredActor; }
  get isTargetable(): boolean { return this._isTargetable; }
  get isCombatEmitter(): boolean { return this._isAnchoredActor ? this._isCombatEmitter : this._primaryEmitterEnabled; }
  get linkedRoleLabel(): string | null { return this._linkedRoleLabel; }
  get linkedParentRoleLabel(): string | null { return this._linkedParentRoleLabel; }
  get damageRouting(): LinkedDamageRouting { return this._damageRouting; }
  get victoryRouting(): LinkedVictoryRouting { return this._victoryRouting; }
  get moveMode(): LinkedMoveMode { return this._moveMode; }
  get cleanupPolicy(): LinkedCleanupPolicy { return this._cleanupPolicy; }
  get detachOnParentDeath(): boolean { return this._detachOnParentDeath; }
  get actionPreset(): LinkedActionPreset { return this._actionPreset; }
  get contributionChannels(): readonly LinkedContributionChannel[] { return this._contributionChannels; }
  get isImpactOrigin(): boolean { return this._isImpactOrigin; }
  get decorativeStandinsSuppressed(): boolean { return this._decorativeStandinsSuppressed; }
  get collisionVelocity(): Vector3 {
    return new Vector3(
      this._movementVelocity.x + this._velocity.x,
      0,
      this._movementVelocity.z + this._velocity.z,
    );
  }
  get collisionPushTotal(): number { return this._collisionPushTotal; }
  get collisionPushPeak(): number { return this._collisionPushPeak; }
  get collisionContactCount(): number { return this._collisionContactCount; }
  /**
   * A man killed drops what he carried (trailer_2_sheet_02 r1c2: shields and blades lie among the dead): his shield and the weapon in his fist leave his hands as
   * free copies placed where they were in the world, for the battle's litter to throw and keep, and his own are hidden until he is reset. Once per death.
   */
  shedGear(): TransformNode[] {
    if (this._shedGear.length > 0 || isVehicleUnit(this.definition.id)) return [];
    const carried = [
      ...this.body.leftHand.getChildren().filter((n) => /shield$/.test(n.name)),
      ...this.body.rightHand.getChildren().filter((n) => !/HandM$/.test(n.name) && (this.propMeshes.includes(n as Mesh) || /bolt|weapon|sword|club|spear|axe|hammer|mace/i.test(n.name))),
    ].filter((n): n is TransformNode => n instanceof TransformNode && n.isEnabled());
    const copies: TransformNode[] = [];
    for (const node of carried) {
      node.computeWorldMatrix(true);
      const copy = (node as Mesh).clone(`${node.name}_shed`, null);
      if (!copy) continue;
      // Off the hand: a clone keeps its source's parent, and left on the hand it rode the corpse into the air
      copy.parent = null;
      copy.position.copyFrom(node.getAbsolutePosition());
      copy.rotationQuaternion = node.absoluteRotationQuaternion.clone();
      copy.scaling.copyFrom(node.absoluteScaling);
      node.setEnabled(false);
      this._shedGear.push(node);
      copies.push(copy);
    }
    return copies;
  }
  private _shedGear: TransformNode[] = [];

  get isAirborne(): boolean { return !this._grounded || this.position.y > 0.01; }
  get crowdPressure(): number { return this._crowdPressure; }
  get balancePressure(): number { return this._balancePressure; }
  get pressureLoad(): number {
    return Math.min(1.8, this._balancePressure / Math.max(0.0001, this._crowdPhysicsProfile.balanceCapacity));
  }
  get contactRole(): ContactRole { return this.definition.contactRole; }
  get braceAbsorption(): number { return this.definition.braceAbsorption; }
  get pressureTransferScale(): number { return this.definition.pressureTransferScale; }
  get attackInterruptThreshold(): number { return this.definition.attackInterruptThreshold; }
  get pressureTransferred(): number { return this._pressureTransferred; }
  get attackInterruptedCount(): number { return this._attackInterruptedCount; }
  get attackInterrupted(): boolean { return RuntimeUnit.timeNowSeconds() < this._attackInterruptedUntil; }
  get downedSecondsRemaining(): number {
    return Math.max(0, this._downedUntil - RuntimeUnit.timeNowSeconds());
  }
  get downedBlockActive(): boolean { return this.isDowned && this._grounded; }
  get lastContactRole(): ContactRole | null { return this._lastContactRole; }
  get isPressureLoaded(): boolean {
    return this.pressureLoad >= this._crowdPhysicsProfile.pressureLoadedThreshold;
  }
  get isDowned(): boolean {
    const now = RuntimeUnit.timeNowSeconds();
    return !this._isDead && now >= this._toppledUntil && now < this._downedUntil && this._grounded && this.position.y <= 0.05;
  }
  get battleFeelState(): "steady" | "pressure-loaded" | "staggered" | "toppled" | "downed" | "recovering" | "dead" {
    if (this._isDead) return "dead";
    if (this.isToppled) return "toppled";
    if (this.isDowned) return "downed";
    if (this.isRecovering) return "recovering";
    if (this.isStaggered) return "staggered";
    if (this.isPressureLoaded) return "pressure-loaded";
    return "steady";
  }
  get balanceState(): "steady" | "pressure-loaded" | "toppled" | "downed" | "recovering" {
    if (this.isToppled) return "toppled";
    if (this.isDowned) return "downed";
    if (this.isRecovering) return "recovering";
    if (this.isPressureLoaded) return "pressure-loaded";
    return "steady";
  }
  get toppleDirectionTag(): "none" | "forward" | "backward" | "sideways" { return this._toppleDirectionTag; }
  get toppleForwardness(): number { return this._toppleForwardness; }
  get crowdPhysicsProfileId(): string { return this._crowdPhysicsProfile.id; }
  get crowdResistance(): number { return this._crowdPhysicsProfile.crowdResistance; }
  get crowdSeparationStrength(): number { return this._crowdPhysicsProfile.separationStrength; }
  get horizontalSpeed(): number { return Math.sqrt(this._velocity.x * this._velocity.x + this._velocity.z * this._velocity.z); }
  get isStaggered(): boolean { return this._staggerTimer > 0.02; }
  get isToppled(): boolean { return !this._isDead && RuntimeUnit.timeNowSeconds() < this._toppledUntil; }
  get isRecovering(): boolean {
    const now = RuntimeUnit.timeNowSeconds();
    return !this._isDead && now >= this._downedUntil && now < this._recoveringUntil;
  }
  get collisionBodyRadius(): number {
    const radiusScale = this.isDowned ? this.definition.downedBlockRadiusScale : 1;
    return this.definition.collisionRadius * radiusScale;
  }
  private _drawnFlung = false;
  get physicsState(): "steady" | "airborne" | "toppled" | "downed" | "recovering" | "dead" {
    if (this._isDead) return "dead";
    const now = RuntimeUnit.timeNowSeconds();
    if (now < this._toppledUntil) return "toppled";
    if (now < this._downedUntil && this._grounded && this.position.y <= 0.05) return "downed";
    if (!this._grounded || this.position.y > 0.04) return "airborne";
    if (now < this._recoveringUntil) return "recovering";
    return "steady";
  }

  constructor(
    definition: UnitDefinition,
    team: number,
    body: ArticulatedBody,
    propMeshes: Mesh[],
    visualConfig: UnitVisualConfig,
    ragdollProfile: RagdollProfile,
    crowdPhysicsProfile: CrowdPhysicsProfile,
  ) {
    this.runtimeId = RuntimeUnit._nextRuntimeId++;
    this.definition = definition;
    this.team = team;
    this.body = body;
    this._skinGlow = body.skinMaterial.emissiveColor.clone();
    this.propMeshes = propMeshes;
    this.visualConfig = visualConfig;
    this._ragdollProfile = ragdollProfile;
    this._crowdPhysicsProfile = crowdPhysicsProfile;
    this._maxHealth = definition.maxHealth;
    this._currentHealth = this._maxHealth;
    this.animator = new ProceduralAnimator(body);
    // each man's own blow and reaction (one-blow-per-man): his share of the line's spread of timing and shape, fixed by his runtime id
    this.animator.variety = this.vary(31);
    this.animator.defaultAttackMotion = this._resolvePrimaryAttackMotion();
    this.animator.locomotionBias = this._resolveLocomotionBias();
    this._spawnPosition = body.root.position.clone();
    this._spawnRotationY = body.root.rotation.y;
  }

  /** Initialize ambient particles for FxPreset units. Call after spawn. */
  initFxParticles(scene: Scene): void {
    const preset = this.visualConfig.fxPreset;
    if (!preset || preset === "none") return;
    const emitter = this.body.torsoMesh;
    if (!emitter) return;
    const ps = createFxAmbient(scene, emitter, preset, 8);
    if (ps) {
      ps.start();
      this._fxParticleSystem = ps;
    }
  }

  canAttack(now: number): boolean {
    return !this._isDead && this._staggerTimer <= 0.05 && now >= this._nextAttackAt && this.hasCapability("attack", now);
  }

  setSpawnRole(role: RuntimeSpawnRole, countsTowardVictory = true): void {
    this._spawnRole = role;
    this._countsTowardVictory = countsTowardVictory;
  }

  setLifetime(seconds: number, now = RuntimeUnit.timeNowSeconds()): void {
    this._expiresAt = now + Math.max(0.1, seconds);
  }

  setPrimaryEmitterEnabled(enabled: boolean): void {
    this._primaryEmitterEnabled = enabled;
  }

  configureAnchoredLink(options: {
    roleLabel: string;
    parentRoleLabel?: string;
    offset: Vector3;
    syncFacing?: boolean;
    targetable: boolean;
    combatEmitter: boolean;
    damageRouting: LinkedDamageRouting;
    victoryRouting: LinkedVictoryRouting;
    moveMode: LinkedMoveMode;
    cleanupPolicy: LinkedCleanupPolicy;
    detachOnParentDeath: boolean;
    actionPreset: LinkedActionPreset;
    contributionChannels?: LinkedContributionChannel[];
    healthOverride?: number;
    impactOrigin?: boolean;
    attackOriginOffset?: Vector3;
    smokeOriginOffset?: Vector3;
    impactOriginOffset?: Vector3;
  }): void {
    this._isAnchoredActor = true;
    this._linkedRoleLabel = options.roleLabel;
    this._linkedParentRoleLabel = options.parentRoleLabel ?? null;
    this._anchoredOffset = options.offset.clone();
    this._syncLinkedFacing = options.syncFacing ?? true;
    this._isTargetable = options.targetable;
    this._isCombatEmitter = options.combatEmitter;
    this._damageRouting = options.damageRouting;
    this._victoryRouting = options.victoryRouting;
    this._moveMode = options.moveMode;
    this._cleanupPolicy = options.cleanupPolicy;
    this._detachOnParentDeath = options.detachOnParentDeath;
    this._actionPreset = options.actionPreset;
    this._contributionChannels = [...(options.contributionChannels ?? [])];
    this._maxHealth = options.healthOverride ?? this.definition.maxHealth;
    this._currentHealth = Math.min(this._currentHealth, this._maxHealth);
    this._isImpactOrigin = options.impactOrigin ?? false;
    this._attackOriginOffset = options.attackOriginOffset?.clone() ?? null;
    this._smokeOriginOffset = options.smokeOriginOffset?.clone() ?? null;
    this._impactOriginOffset = options.impactOriginOffset?.clone() ?? null;
  }

  setDecorativeStandinsSuppressed(suppressed: boolean): void {
    this._decorativeStandinsSuppressed = suppressed;
  }

  setBaseBodyVisible(visible: boolean): void {
    for (const mesh of this.body.allMeshes) {
      mesh.isVisible = visible;
    }
    // The skirt hung on a man is part of his body: a hidden crewman (the da Vinci tank's pilot) must not leave it floating over the machine
    for (const mesh of this.propMeshes) {
      if (/Skirt$|Kilt$|^furCollar$/.test(mesh.name)) mesh.isVisible = visible;
    }
  }

  setHealthBarVisible(visible: boolean): void {
    if (this.healthBarMesh) this.healthBarMesh.isVisible = visible;
    if (this.healthBarBg) this.healthBarBg.isVisible = visible;
  }

  addLinkedDescriptor(relation: LinkedRelation, label: string, persistent = true, runtimeUnitId?: number): void {
    this._linkedDescriptors.push({ relation, label, persistent, runtimeUnitId });
  }

  attachLinkedChild(child: RuntimeUnit, relation: LinkedRelation): void {
    this._linkedChildren.add(child);
    child._linkedParent = this;
    child._linkedRelation = relation;
    this.addLinkedDescriptor(
      relation,
      child._linkedRoleLabel ?? child.definition.displayName,
      relation !== "spawned-child",
      child.runtimeId,
    );
  }

  detachLinkedChild(child: RuntimeUnit): void {
    if (!this._linkedChildren.delete(child)) return;
    this._linkedDescriptors = this._linkedDescriptors.filter((descriptor) => descriptor.runtimeUnitId !== child.runtimeId);
    if (child._linkedParent === this) {
      child._linkedParent = null;
      child._linkedRelation = null;
    }
  }

  setAttackCooldown(now: number, cooldown: number): void {
    this._nextAttackAt = now + Math.max(0.05, cooldown);
    // Trigger attack animation
    this.animator.triggerAttack(this._resolvePrimaryAttackWindup(cooldown), this._resolvePrimaryAttackMotion());
    // A spinning drum (the da Vinci tank) keeps turning from this volley through the wait for the next one
    this._drumTimer = Math.max(this._drumTimer, cooldown + DRUM_SPIN.linger);
  }

  // The da Vinci tank's drum (see DRUM_SPIN), looked up once, its spin (0 still, 1 full speed) and how long it has left to keep turning
  private _drum: TransformNode | null | undefined = undefined;
  private _drumSpin = 0;
  private _drumTimer = 0;
  private _spinDrum(dt: number): void {
    if (this._drum === undefined) this._drum = this.body.root.getChildren().find((n): n is TransformNode => n.name === "davinci_spin") ?? null;
    if (!this._drum) return;
    this._drumTimer -= dt;
    const want = this._drumTimer > 0 && !this._isDead ? 1 : 0;
    this._drumSpin += (want - this._drumSpin) * Math.min(1, dt * (want > this._drumSpin ? DRUM_SPIN.spinUp : DRUM_SPIN.spinDown));
    this._drum.rotation.y += this._drumSpin * DRUM_SPIN.rate * dt;
  }

  moveTo(target: Vector3): void {
    if (this._isDead) return;
    this._moveTarget = target.clone();
    if (!this._isMoving) {
      this._isMoving = true;
      this.animator.setState(AnimState.Walking);
    }
  }

  /** In melee reach of its target, pressing or bracing: humanoids pitch into the shove and flail instead of standing upright. */
  leanIntoShove(): void {
    if (isVehicleUnit(this.definition.id)) return;
    this.animator.leanIntoShove();
  }

  /** Closing on its target, a few strides out: a heavy weapon comes up cocked over the shoulder; within striking distance it is brought down on its own beat. */
  readyBlow(striking = false, target: RuntimeUnit | null = null, behindRank = false): void {
    if (isVehicleUnit(this.definition.id)) return;
    // A man thrown, toppled or down is no press mark: the beat's club would chase his crown to the ground
    const standing = target && !target.isDead && !target.isBlowThrown && !target.isToppled && !target.isDowned;
    this.animator.readyBlow(striking, behindRank, standing ? target.body.headTop : null);
    if (striking) this._blowTarget = target;
  }
  // The man a press blow lands on: he flinches (head and trunk snapped back) on each slam that reaches him
  private _blowTarget: RuntimeUnit | null = null;

  private _blowStagger = 0;
  private readonly _blowStaggerDir = new Vector3(0, 0, 1);

  /** Thrown by a landed blow and not yet settled (BLOW_THROW): his shield wall lets go of him until he is. */
  get isBlowThrown(): boolean {
    return this._blowStagger > 0;
  }

  // A dwelling blow's club rests on him until then: no flinch snaps him off it before the throw (see SimulationSystem._landMeleeBlow)
  private _flinchHeldUntil = 0;
  holdFlinch(seconds: number): void {
    this._flinchHeldUntil = RuntimeUnit.timeNowSeconds() + seconds;
  }

  /** A heavy blow from `from` with `knockback` m/s of push has just landed on him: he is thrown back off his feet (BLOW_THROW), shown on this very frame. */
  staggerFromBlow(from: Vector3, knockback: number): void {
    if (this._isDead || this.isToppled || this.isDowned || (this._linkedParent && this._isAnchoredActor)) return;
    const away = this.position.subtract(from);
    away.y = 0;
    const back = this._getFacingVector().scale(-1);
    back.y = 0;
    // Struck from his front half: straight back out of his file
    if (away.lengthSquared() < 0.0001 || Vector3.Dot(away, back) > 0) away.copyFrom(back);
    this._blowStaggerDir.copyFrom(away.normalize());
    this._blowStagger = BLOW_THROW_SECONDS;
    this._staggerTimer = Math.max(this._staggerTimer, BLOW_THROW_SECONDS);
    // Thrown back and up: the feet leave the ground
    const push = knockback * this._crowdPhysicsProfile.shoveResponse;
    const speed = Math.max(BLOW_THROW_SPEED_MIN, Math.min(BLOW_THROW_SPEED_MAX, push * BLOW_THROW_SPEED));
    this._velocity.x = this._blowStaggerDir.x * speed;
    this._velocity.z = this._blowStaggerDir.z * speed;
    this._velocity.y = Math.max(this._velocity.y, Math.max(BLOW_THROW_LIFT_MIN, Math.min(BLOW_THROW_LIFT_MAX, push * BLOW_THROW_LIFT)));
    this._grounded = false;
    // The blow lands after this step's lean was set: put the full pitch on now, before the pose is re-laid on this frame, so the hip is anchored under it
    const [x, z] = this._blowStaggerLean(1);
    this.body.root.rotation.x = x;
    this.body.root.rotation.z = z;
    // His board is knocked off his face, arms flung out and legs laid out in the flight frame, on this frame too
    this.animator.knockBoardOff();
    this.animator.throwBack(BLOW_THROW_SECONDS, BLOW_THROW_HOLD);
    this.animator.update(0);
  }

  /**
   * Root pitch and roll of the blow throw at strength `k`: his trunk tips the way the blow drove him (away from the striker), in his own facing frame, about
   * his pelvis. A positive root pitch tips his top toward his facing (+z local) and a positive roll tips it toward his left, so a man driven back takes a
   * negative pitch.
   */
  private _blowStaggerLean(k: number): [number, number] {
    const forward = Vector3.Dot(this._blowStaggerDir, this._getFacingVector());
    const side = Vector3.Dot(this._blowStaggerDir, this._getRightVector());
    return [forward * BLOW_THROW_TRUNK * k, -side * BLOW_THROW_TRUNK * k];
  }

  /** In a shield wall that is closing on or fighting this enemy: the spear comes down at him. */
  levelSpearAt(enemyGround: Vector3, enemyRadius: number, rearRank: boolean): void {
    this.animator.levelSpearAt(enemyGround, enemyRadius, rearRank);
  }

  /** Slotted into a shield wall this step: the spear stands on the wall's heading. */
  holdSpearInWall(heading: number, boardPlane: number | null = null, slotAt: Vector3 | null = null): void {
    this.animator.holdSpearInWall(heading, boardPlane, slotAt);
  }

  /** Held on his slot in a shield wall this step (see SimulationSystem._holdShieldFrames): crowd pressure does not topple a braced man, a blast still does. */
  wallBraced = false;

  get isMoving(): boolean {
    return this._isMoving;
  }

  /** Formation pacing: scales approach speed so a rank advances with its slowest neighbour. */
  setCohesionMoveMultiplier(multiplier: number): void {
    this._cohesionMoveMultiplier = Math.max(0.5, Math.min(1, multiplier));
  }

  stopMoving(): void {
    this._moveTarget = null;
    this._cohesionMoveMultiplier = 1;
    if (this._isMoving) {
      this._isMoving = false;
      if (this.animator.state === AnimState.Walking) {
        this.animator.setState(AnimState.Idle);
      }
    }
  }

  teleportTo(pos: Vector3): void {
    if (this._isDead) return;
    this.body.root.position.copyFrom(pos);
  }

  faceTarget(target: Vector3): void {
    const dx = target.x - this.body.root.position.x;
    const dz = target.z - this.body.root.position.z;
    if (dx * dx + dz * dz > 0.001) {
      this.body.root.rotation.y = Math.atan2(dx, dz);
    }
  }

  /** Stands facing this yaw whichever way it steps, until released with null. */
  holdHeading(yaw: number | null): void {
    this._headingHold = yaw;
    if (yaw !== null && !this._isDead) this.body.root.rotation.y = yaw;
  }

  setSpinning(spinning: boolean): void {
    this._spinning = spinning;
  }

  get isSpinning(): boolean { return this._spinning; }

  applyDamage(damage: number, impulse: Vector3): ImpactDelta | null {
    if (this._linkedParent && this._isAnchoredActor && this._damageRouting === "parent") {
      return this._linkedParent.applyDamage(damage, impulse);
    }
    if (this._isDead || damage <= 0) return null;
    const healthBefore = this._currentHealth;
    const wasDead = this._isDead;
    const stateBefore = this.battleFeelState;
    this._currentHealth -= damage;

    if (this._currentHealth <= 0) {
      this._die(impulse);
      return this._buildImpactDelta(damage, healthBefore, wasDead, stateBefore, impulse);
    }

    // Velocity-based knockback for living units
    const mult = this._ragdollProfile.impactMultiplier;
    const knockScale = mult / Math.max(0.5, this.definition.mass);
    const knockVel = impulse.scale(knockScale * 0.8);
    const horizontalImpulse = Math.sqrt(impulse.x * impulse.x + impulse.z * impulse.z);
    const liftFromHorizontal = horizontalImpulse * knockScale * 0.06;
    const liftFromVertical = Math.max(0, impulse.y * knockScale * 0.22);
    // Keep living-hit lift shallow so topples read as forward pitch, not balloon launches.
    knockVel.y = Math.min(
      0.95,
      Math.max(knockVel.y * 0.12, liftFromHorizontal, liftFromVertical),
    );
    this._velocity.addInPlace(knockVel);
    if (knockVel.y > 0.04) {
      this._grounded = false;
    }

    // Stagger: briefly interrupt movement
    this._staggerTimer = Math.min(0.3, knockScale * 0.15);
    this._crowdPressure = Math.min(
      1.6,
      Math.max(
        this._crowdPressure,
        (impulse.length() * 0.04 * this._crowdPhysicsProfile.staggerResponse) / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance),
      ),
    );
    const impactPressure = (impulse.length() * 0.04 * this._crowdPhysicsProfile.staggerResponse)
      / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance);
    this._updateCrowdPhysicsState(
      impactPressure,
      impulse,
      this._crowdPhysicsProfile.impactToppleScale,
    );
    this._maybeInterruptAttack(impactPressure * this._crowdPhysicsProfile.impactToppleScale, RuntimeUnit.timeNowSeconds());

    // Flinch: tilt body toward impact (not while a dwelling blow's club rests on him, see holdFlinch)
    if (RuntimeUnit.timeNowSeconds() >= this._flinchHeldUntil) this.animator.triggerFlinch();
    this._updateHealthBar();
    return this._buildImpactDelta(damage, healthBefore, wasDead, stateBefore, impulse);
  }

  /**
   * Explosion fling: throws the body up and outward from a blast centre. Bypasses the shallow
   * living-hit and death lift caps, which exist to keep ordinary melee hits from ballooning.
   */
  applyBlastLaunch(outward: Vector3, speed: number, lift: number): void {
    if (this._isAnchoredActor) return;
    // One launch per flight: rapid shells must not juggle a body across the map.
    if (!this._grounded && this.position.y > 0.2) return;
    const scale = this._ragdollProfile.impactMultiplier / Math.max(0.8, this.definition.mass);
    // Per-body spread keyed on the runtime id (deterministic): each body gets its own height,
    // heading and tumble rate, so a blast scatters a group instead of lifting it as one plane.
    const spread = (salt: number): number => {
      const v = Math.sin(this.runtimeId * 12.9898 + salt * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const swing = (spread(2) - 0.5) * 1.1;
    const cos = Math.cos(swing);
    const sin = Math.sin(swing);
    const dirX = outward.x * cos - outward.z * sin;
    const dirZ = outward.x * sin + outward.z * cos;
    // Never faster sideways than the base throw: rapid shells have to keep finding the body.
    const throwSpeed = speed * (0.7 + 0.3 * spread(3)) * scale;
    if (!this._isDead) {
      this._enterTopple(RuntimeUnit.timeNowSeconds(), this._crowdPhysicsProfile.launchThreshold, outward, true);
    }
    this._velocity.x += dirX * throwSpeed;
    this._velocity.z += dirZ * throwSpeed;
    this._velocity.y = Math.max(this._velocity.y, lift * (0.7 + 0.3 * spread(1)) * scale);
    this._grounded = false;

    // End-over-end tumble about the axis across the throw, in the body's own pitch/roll frame.
    const spinRate = 6 + 6 * spread(4);
    const spinX = -(dirX * this._getFacingVector().x + dirZ * this._getFacingVector().z) * spinRate;
    const spinZ = (dirX * this._getRightVector().x + dirZ * this._getRightVector().z) * spinRate;
    if (this._isDead) {
      // A settled corpse is asleep: wake it so the throw and the spin both play.
      this._physicsActive = true;
      this._bounceCount = 0;
      this._deathSpinX = spinX;
      this._deathSpinY = (spread(5) - 0.5) * 6;
      this._corpseYaw = this.body.root.rotation.y + (spread(5) - 0.5) * Math.PI * 2;
    } else {
      this._blastSpinX = spinX;
      this._blastSpinZ = spinZ;
      this._blastTumbling = true;
      this._pendingBlastSprawlSeconds = 3;
    }
  }

  private _buildImpactDelta(
    damageApplied: number,
    healthBefore: number,
    wasDead: boolean,
    stateBefore: BattleFeelState,
    impulse: Vector3,
  ): ImpactDelta {
    const stateAfter = this.battleFeelState;
    return {
      targetRuntimeId: this.runtimeId,
      targetUnitId: this.definition.id,
      damageApplied,
      healthBefore,
      healthAfter: this._currentHealth,
      wasDead,
      isDead: this._isDead,
      stateBefore,
      stateAfter,
      impulseMagnitude: impulse.length(),
      killed: !wasDead && this._isDead,
      toppled: stateBefore !== "toppled" && stateAfter === "toppled",
      downed: stateBefore !== "downed" && stateAfter === "downed",
      staggered: stateBefore !== "staggered" && stateAfter === "staggered",
    };
  }

  applyCollisionImpulse(
    impulse: Vector3,
    contactDirection?: Vector3,
    pressureScale = 1,
    contactRole?: ContactRole,
    toppleScale = 1,
  ): void {
    if (this._isDead || (this._linkedParent && this._isAnchoredActor)) return;
    const horizontalImpulse = new Vector3(impulse.x, 0, impulse.z);
    const magnitude = horizontalImpulse.length();
    if (magnitude <= 0.0001) return;

    this._collisionContactCount += 1;
    if (contactRole) this._lastContactRole = contactRole;
    this._collisionPushTotal += magnitude;
    this._collisionPushPeak = Math.max(this._collisionPushPeak, magnitude);

    const pushScale = 0.42 / Math.max(0.55, this.definition.mass);
    this._velocity.addInPlace(horizontalImpulse.scale(pushScale));
    this._staggerTimer = Math.max(this._staggerTimer, Math.min(0.22, 0.04 + magnitude * 0.025));
    this._crowdPressure = Math.min(
      1.8,
      Math.max(this._crowdPressure, magnitude * 0.18 * this._crowdPhysicsProfile.staggerResponse),
    );
    const adjustedPressure = Math.min(
      1.8,
      (magnitude * 0.18 * this._crowdPhysicsProfile.staggerResponse) / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance),
    );
    this._updateCrowdPhysicsState(
      adjustedPressure,
      contactDirection ?? horizontalImpulse.scale(-1),
      pressureScale * toppleScale * this._crowdPhysicsProfile.compressionToppleScale,
    );
    this._maybeInterruptAttack(adjustedPressure * pressureScale, RuntimeUnit.timeNowSeconds(), contactRole);
    if (magnitude >= 0.9) {
      this.animator.triggerFlinch();
    }
  }

  applyCollisionSeparation(offset: Vector3): void {
    if (this._isDead || (this._linkedParent && this._isAnchoredActor)) return;
    this.body.root.position.addInPlace(offset);
    if (this.body.root.position.y < 0) {
      this.body.root.position.y = 0;
    }
    resolveObstacleCollisions(this.body.root.position, this.collisionBodyRadius, RuntimeUnit.obstacles);
  }

  applyCrowdDisplacement(
    offset: Vector3,
    pressure: number,
    contactDirection?: Vector3,
    pressureScale = 1,
    contactRole?: ContactRole,
  ): void {
    if (this._isDead || this._isAnchoredActor) return;
    if (offset.lengthSquared() <= 0.000001) return;
    if (contactRole) this._lastContactRole = contactRole;

    this.body.root.position.addInPlace(offset);
    if (this.body.root.position.y < 0) {
      this.body.root.position.y = 0;
    }
    resolveObstacleCollisions(this.body.root.position, this.collisionBodyRadius, RuntimeUnit.obstacles);
    this._velocity.x += offset.x * 5.2 * this._crowdPhysicsProfile.shoveResponse;
    this._velocity.z += offset.z * 5.2 * this._crowdPhysicsProfile.shoveResponse;

    const adjustedPressure = pressure / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance);
    this._crowdPressure = Math.min(
      1.8,
      Math.max(this._crowdPressure, adjustedPressure * this._crowdPhysicsProfile.staggerResponse),
    );
    this._staggerTimer = Math.max(
      this._staggerTimer,
      Math.min(0.52, adjustedPressure * 0.11 * this._crowdPhysicsProfile.staggerResponse),
    );
    this._updateCrowdPhysicsState(
      adjustedPressure,
      contactDirection ?? new Vector3(
        -offset.x * 6.5 * this._crowdPhysicsProfile.shoveResponse,
        0,
        -offset.z * 6.5 * this._crowdPhysicsProfile.shoveResponse,
      ),
      pressureScale * this._crowdPhysicsProfile.compressionToppleScale,
    );
    this._maybeInterruptAttack(adjustedPressure * pressureScale, RuntimeUnit.timeNowSeconds(), contactRole);
  }

  registerPressureTransfer(amount: number, contactRole?: ContactRole): void {
    if (this._isDead || amount <= 0) return;
    this._pressureTransferred = Math.max(this._pressureTransferred, amount);
    if (contactRole) this._lastContactRole = contactRole;
  }

  heal(amount: number): void {
    if (this._isDead || amount <= 0) return;
    this._currentHealth = Math.min(this._maxHealth, this._currentHealth + amount);
    this._updateHealthBar();
  }

  /** A charge: he runs in at `multiplier` times his walking speed until world time `until` (or endCharge). */
  startCharge(multiplier: number, until: number): void {
    if (this._isDead) return;
    this._chargeMultiplier = Math.max(1, multiplier);
    this._chargeUntil = until;
  }

  endCharge(): void {
    this._chargeMultiplier = 1;
    this._chargeUntil = 0;
  }

  get isCharging(): boolean {
    return this._chargeMultiplier > 1;
  }

  applySlow(multiplier: number, durationSeconds: number, now: number): void {
    if (this._isDead) return;
    this._slowMultiplier = Math.min(this._slowMultiplier, Math.max(0.2, multiplier));
    this._slowUntil = Math.max(this._slowUntil, now + Math.max(0.1, durationSeconds));
  }

  /** Splashed by a potion (DRUNK): green and tottering, slowed, for `seconds`; the simulation has him wander instead of fight while isDrunk. */
  getDrunk(seconds: number): void {
    if (this._isDead || this._isAnchoredActor) return;
    const now = RuntimeUnit.timeNowSeconds();
    this._drunkUntil = Math.max(this._drunkUntil, now + seconds);
    this.applySlow(DRUNK.slow, seconds, now);
  }

  get isDrunk(): boolean {
    return !this._isDead && RuntimeUnit.timeNowSeconds() < this._drunkUntil;
  }

  /** Struck by a balloon arrow (BALLOON_FLOAT): team balloons swell over his head and float him up until they pop. */
  floatOnBalloons(color: Color3): void {
    if (this._isDead || this._isAnchoredActor) return;
    const now = RuntimeUnit.timeNowSeconds();
    this._floatUntil = now + BALLOON_FLOAT.seconds;
    this._grounded = false;
    const scene = this.body.root.getScene();
    this._balloonRig ??= new TransformNode("balloonRig", scene);
    const paint = getMaterialFactory().get("bone", color, { emissiveIntensity: 0.12 });
    const string = getMaterialFactory().get("cloth", new Color3(0.85, 0.85, 0.82));
    for (let i = 0; i < BALLOON_FLOAT.per && this._balloons.length < BALLOON_FLOAT.most; i++) {
      const k = this._balloons.length;
      // Round the head in a loose bunch, each a little higher and further out than the last
      const a = k * 2.4;
      const out = 0.12 + 0.05 * (k % 3);
      const up = BALLOON_FLOAT.string + 0.08 * (k % 3);
      const holder = new TransformNode("balloon", scene);
      holder.parent = this._balloonRig;
      holder.rotation.set(Math.cos(a) * out, 0, Math.sin(a) * out);
      const ball = MeshBuilder.CreateSphere("balloonBall", { diameter: BALLOON_FLOAT.size, segments: 6 }, scene);
      ball.scaling.set(1, 1.18, 1);
      ball.bakeCurrentTransformIntoVertices();
      ball.convertToFlatShadedMesh();
      ball.material = paint;
      ball.position.y = up + BALLOON_FLOAT.size * 0.55;
      ball.parent = holder;
      const cord = MeshBuilder.CreateCylinder("balloonString", { height: up, diameter: 0.012, tessellation: 3 }, scene);
      cord.material = string;
      cord.position.y = up * 0.5;
      cord.parent = holder;
      holder.scaling.setAll(0.01);
      this._balloons.push({ node: holder, born: now });
    }
  }
  private _floatUntil = 0;
  private _balloonRig: TransformNode | null = null;
  private _balloons: { node: TransformNode; born: number }[] = [];

  /** The balloons ride over his head, swelling in; dead or out of time, they pop. */
  private _tendBalloons(now: number): void {
    if (!this._balloonRig) return;
    if (this._isDead || now >= this._floatUntil) {
      this._balloonRig.dispose(false, false);
      this._balloonRig = null;
      this._balloons = [];
      return;
    }
    this.body.headTop.computeWorldMatrix(true);
    this._balloonRig.position.copyFrom(this.body.headTop.getAbsolutePosition());
    for (const b of this._balloons) b.node.scaling.setAll(Math.max(0.01, Math.min(1, (now - b.born) / BALLOON_FLOAT.swell)));
  }

  update(dt: number, now: number): void {
    this._tendBalloons(now);
    // Animate
    // A blasted body stays limp for its whole flight, not just until the topple clock runs out mid-air.
    this.animator.setLimp(this.isToppled || this.isDowned || this._pendingBlastSprawlSeconds > 0);
    const flung = !this._grounded && this.position.y > 0.35;
    this.animator.setAirborne(flung);
    // A flung body is drawn over the blast it is thrown through (FLUNG_RENDER_GROUP: after the fire and smoke sprites, still depth-tested against the solid
    // scene), so it stays a dark, solid figure against the fireball and the smoke instead of being lit pale by the additive fire in front of it
    if (flung !== this._drawnFlung) {
      this._drawnFlung = flung;
      for (const mesh of this.body.root.getChildMeshes()) mesh.renderingGroupId = flung ? FLUNG_RENDER_GROUP : 0;
    }
    this.animator.update(dt);
    this._spinDrum(dt);
    if (this.animator.takeBlowsLanded() > 0 && this._blowTarget && !this._blowTarget.isDead && Vector3.Distance(this._blowTarget.position, this.position) < 3
      && now >= this._blowTarget._flinchHeldUntil) {
      this._blowTarget.animator.triggerFlinch();
    }
    this._applyVisualPresentation(now);
    this._movementVelocity.setAll(0);

    if (this._linkedParent && this._isAnchoredActor) {
      this._updateAnchoredActor(now);
      return;
    }

    if (this._isDead) {
      this._updateDead(dt, now);
      return;
    }

    if (now >= this._expiresAt) {
      this._expire(now);
      return;
    }

    const pos = this.body.root.position;
    this._crowdPressure = Math.max(0, this._crowdPressure - dt * this._crowdPhysicsProfile.recoveryRate);
    this._balancePressure = Math.max(0, this._balancePressure - dt * this._crowdPhysicsProfile.recoveryRate * 0.68);
    this._pressureTransferred = Math.max(0, this._pressureTransferred - dt * this._crowdPhysicsProfile.recoveryRate * 0.8);
    if (this._balancePressure <= 0.001 && !this.isToppled && !this.isDowned && !this.isRecovering) {
      this._balancePressure = 0;
      this._toppleForwardness = 0;
      this._toppleDirectionTag = "none";
      this._balanceDirection.copyFrom(this._getFacingVector());
    }
    if (now >= this._slowUntil) {
      this._slowMultiplier = 1;
    }
    if (now >= this._chargeUntil) this._chargeMultiplier = 1;
    const physicsState = this.physicsState;

    // ── Physics: gravity + velocity for knockback ──
    if (!this._grounded || this._velocity.lengthSquared() > 0.001) {
      // Gravity, or his balloons holding him up (BALLOON_FLOAT): rising to the top of the float and hanging there
      if (now < this._floatUntil) {
        this._grounded = false;
        const lift = BALLOON_FLOAT.rise * Math.min(1, this._balloons.length / BALLOON_FLOAT.per) / Math.sqrt(Math.max(1, this.definition.mass));
        const want = pos.y < BALLOON_FLOAT.top ? lift : 0;
        this._velocity.y += (want - this._velocity.y) * Math.min(1, dt * 5);
      } else {
        this._velocity.y -= 22 * dt;
      }

      // Apply velocity
      pos.addInPlace(this._velocity.scale(dt));

      // Ground collision (not while the balloons lift him off it)
      if (pos.y <= 0 && now >= this._floatUntil) {
        pos.y = 0;
        if (this._velocity.y < -1) {
          // Bounce slightly
          this._velocity.y *= -0.25;
        } else {
          this._velocity.y = 0;
          this._grounded = true;
          if (this._pendingBlastSprawlSeconds > 0 && !this._isDead) {
            // The topple clocks ran out mid-flight: restart the downed window where the body comes to rest.
            const now = RuntimeUnit.timeNowSeconds();
            this._downedUntil = Math.max(this._downedUntil, now + this._pendingBlastSprawlSeconds);
            this._recoveringUntil = Math.max(this._recoveringUntil, this._downedUntil + this._crowdPhysicsProfile.recoverySeconds);
          }
          this._pendingBlastSprawlSeconds = 0;
        }
      }

      // Horizontal friction (ground friction stronger than air)
      const friction = this._grounded ? 8.0 : 1.5;
      const decay = Math.max(0, 1 - friction * dt);
      this._velocity.x *= decay;
      this._velocity.z *= decay;

      // Stop tiny residual velocity
      if (this._grounded && this._velocity.lengthSquared() < 0.01) {
        this._velocity.setAll(0);
      }

      // Resolve obstacle collisions after knockback
      resolveObstacleCollisions(pos, this.collisionBodyRadius, RuntimeUnit.obstacles);
    }

    // ── Stagger: skip movement while staggered ──
    if (this._staggerTimer > 0) {
      this._staggerTimer -= dt;
      this._applyCrowdLean(dt);
      this._updateHealthBar();
      return;
    }

    if (physicsState === "toppled" || physicsState === "airborne" || physicsState === "downed") {
      this.stopMoving();
      this._applyCrowdLean(dt);
      this._updateHealthBar();
      return;
    }

    // ── Movement toward target ──
    if (this._moveTarget) {
      const offset = this._moveTarget.subtract(pos);
      offset.y = 0;
      const distSq = offset.lengthSquared();
      if (distSq <= 0.01) {
        this._moveTarget = null;
        this._isMoving = false;
        if (this.animator.state === AnimState.Walking) {
          this.animator.setState(AnimState.Idle);
        }
      } else {
        const dir = offset.normalize();
        const recoveryMoveMultiplier = physicsState === "recovering"
          ? this._crowdPhysicsProfile.recoveryMovePenalty
          : 1;
        const pressureMoveMultiplier = this.isPressureLoaded
          ? Math.max(0.22, 1 - this.pressureLoad * this._crowdPhysicsProfile.pressureMovePenalty)
          : 1;
        const appliedDistance = Math.min(
          this.definition.moveSpeed * this._slowMultiplier * this._chargeMultiplier * this._cohesionMoveMultiplier * recoveryMoveMultiplier * pressureMoveMultiplier * dt,
          Math.sqrt(distSq),
        );
        const proposedPosition = pos.add(dir.scale(appliedDistance));
        const wouldEnterHazard = RuntimeUnit.hazards.some((hazard) => isPointInsideHazard(
          proposedPosition,
          hazard,
          Math.max(0.15, this.collisionBodyRadius * 0.2),
        ));
        if (wouldEnterHazard) {
          this._movementVelocity.setAll(0);
          this._applyCrowdLean(dt);
          this._updateHealthBar();
          return;
        }
        pos.copyFrom(proposedPosition);
        this._movementVelocity.copyFrom(dir.scale(appliedDistance / Math.max(dt, 0.0001)));

        // Face movement direction
        if (this._spinning) {
          this.body.root.rotation.y += dt * 20;
        } else {
          const angle = Math.atan2(dir.x, dir.z);
          this.body.root.rotation.y = this._headingHold ?? angle;
        }

        // Resolve obstacle collisions after movement step
        resolveObstacleCollisions(pos, this.collisionBodyRadius, RuntimeUnit.obstacles);
      }
    }

    this._applyCrowdLean(dt);
    this._updateHealthBar();
  }

  private _updateAnchoredActor(now: number): void {
    const parent = this._linkedParent;
    if (!parent) return;

    if (this._isDead) {
      this.setBaseBodyVisible(false);
      for (const mesh of this.propMeshes) {
        mesh.isVisible = false;
      }
      this.setHealthBarVisible(false);
      return;
    }

    if (parent.isDead) {
      this._isDead = true;
      this._currentHealth = 0;
      this._deathCleanupAt = now;
      this.setBaseBodyVisible(false);
      for (const mesh of this.propMeshes) {
        mesh.isVisible = false;
      }
      this.setHealthBarVisible(false);
      return;
    }

    const offset = this._anchoredOffset ?? Vector3.Zero();
    const yaw = parent.body.root.rotation.y;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const rotatedOffset = new Vector3(
      offset.x * cos + offset.z * sin,
      offset.y,
      -offset.x * sin + offset.z * cos,
    );
    this.body.root.position.copyFrom(parent.position.add(rotatedOffset));
    if (this._syncLinkedFacing) {
      this.body.root.rotation.y = parent.body.root.rotation.y;
    }

    const shouldMirrorWalking =
      this._linkedRelation === "mount" ||
      this._actionPreset === "charge-mount";

    if (parent.animator.state === AnimState.Walking && shouldMirrorWalking) {
      this.animator.setState(AnimState.Walking);
    } else if (this.animator.state !== AnimState.Attacking) {
      this.animator.setState(AnimState.Idle);
    }

    this.setHealthBarVisible(false);
    this._updateHealthBar();
  }

  private _die(impulse: Vector3): void {
    this._isDead = true;
    this._currentHealth = 0;
    this._moveTarget = null;
    this._isMoving = false;
    this._deathTime = RuntimeUnit.timeNowSeconds();
    this._deathCleanupAt = this._deathTime + this._ragdollProfile.cleanupDelaySeconds;
    this._physicsActive = true;

    // Strong launch: scale by impulse and ragdoll profile, inversely by mass
    const massInv = 1.0 / Math.max(0.5, this.definition.mass);
    const deathMult = this._ragdollProfile.deathImpulseMultiplier;
    const launchDir = impulse.scale(deathMult * massInv * 1.2);
    const horizontalImpulse = Math.sqrt(impulse.x * impulse.x + impulse.z * impulse.z);
    const deathLift = Math.max(
      launchDir.y * 0.18,
      horizontalImpulse * deathMult * massInv * 0.1,
    );
    // Death launches should read as knockdown, not sky-high ragdoll balloons.
    launchDir.y = Math.min(1.35, Math.max(0.16, deathLift));
    // Add any existing knockback velocity
    this._velocity.addInPlace(launchDir);

    // Random spin on death
    // Half fall on their faces and half on their backs, and each comes to rest on a heading of its own, so a
    // row of the dead is a litter of bodies and not a rank of planks.
    const fall = Math.random();
    const turn = Math.random();
    this._deathSpinX = (fall < 0.5 ? -1 : 1) * (1.5 + (fall * 2 % 1) * 3) * massInv;
    this._deathSpinY = (turn - 0.5) * 4 * massInv;
    this._corpseYaw = this.body.root.rotation.y + (turn - 0.5) * Math.PI * 2;

    // Switch to death animation (ragdoll joints)
    this.animator.setState(AnimState.Dead);

    // Hide health bar
    if (this.healthBarMesh) this.healthBarMesh.isVisible = false;
    if (this.healthBarBg) this.healthBarBg.isVisible = false;
  }

  private _expire(now: number): void {
    this._isDead = true;
    this._currentHealth = 0;
    this._moveTarget = null;
    this._isMoving = false;
    this._physicsActive = false;
    this._velocity.setAll(0);
    this._deathTime = now;
    this._deathCleanupAt = now;
    this.setBaseBodyVisible(false);
    for (const mesh of this.propMeshes) {
      mesh.isVisible = false;
    }
    this.setHealthBarVisible(false);
  }

  private _deathSpinX = 0;
  private _deathSpinY = 0;
  private _bounceCount = 0;

  private _updateDead(dt: number, _now: number): void {
    if (!this._physicsActive) return;

    const pos = this.body.root.position;

    // Gravity
    this._velocity.y -= 22 * dt;

    // Apply velocity
    pos.addInPlace(this._velocity.scale(dt));

    // Spin body
    this.body.root.rotation.x += this._deathSpinX * dt;
    this.body.root.rotation.y += this._deathSpinY * dt;

    // Ground collision with bounce
    let flatError = 0;
    if (pos.y <= 0) {
      pos.y = 0;
      if (this._velocity.y < -1.5 && this._bounceCount < 3) {
        // Bounce with energy loss
        this._velocity.y *= -0.3;
        this._velocity.x *= 0.7;
        this._velocity.z *= 0.7;
        this._deathSpinX *= 0.5;
        this._deathSpinY *= 0.5;
        this._bounceCount++;
      } else {
        this._velocity.y = 0;
        // Ground friction
        const friction = 6.0;
        const decay = Math.max(0, 1 - friction * dt);
        this._velocity.x *= decay;
        this._velocity.z *= decay;
        this._deathSpinX *= decay;
        this._deathSpinY *= decay;
        flatError = this._layCorpseFlat(dt);
      }
    } else {
      // Air drag (very light)
      this._velocity.x *= (1 - 0.5 * dt);
      this._velocity.z *= (1 - 0.5 * dt);
    }

    // Settle
    if (pos.y <= 0.01 && this._velocity.lengthSquared() < 0.02 && flatError < 0.02) {
      this._physicsActive = false;
      this._velocity.setAll(0);
    }
  }

  /** A grounded humanoid corpse rolls onto its back or its front rather than resting at a lean or on edge, and tells its animator which. */
  private _layCorpseFlat(dt: number): number {
    if (isVehicleUnit(this.definition.id) || this.animator.walkStyle === "quadruped") return 0;
    const rot = this.body.root.rotation;
    const nearestFlat = (angle: number): number =>
      Math.round((angle - Math.PI / 2) / Math.PI) * Math.PI + Math.PI / 2;
    const onSide = Math.abs(Math.sin(rot.z)) > 0.8;
    // A body down on its flank is a plank on edge: it rolls on over about its own length, onto its back or its front.
    const targetX = nearestFlat(rot.x);
    const targetZ = onSide ? rot.z : Math.round(rot.z / Math.PI) * Math.PI;
    // The body's front points along -sin(rot.x) in height, so that is the face left open to the sky.
    this.animator.setLandedFace(-Math.sin(targetX));
    const settle = Math.min(1, dt * 9);
    rot.x += (targetX - rot.x) * settle;
    rot.z += (targetZ - rot.z) * settle;
    // It slews round to its own resting heading as it goes down, slower than it falls.
    const yawLeft = this._corpseYaw === null ? 0 : this._corpseYaw - rot.y;
    rot.y += yawLeft * Math.min(1, dt * 4);
    return Math.abs(targetX - rot.x) + Math.abs(targetZ - rot.z) + Math.abs(yawLeft) * 0.2;
  }

  /** Heading a corpse turns to as it comes to rest; null until the unit dies. */
  private _corpseYaw: number | null = null;

  private _blastTumbling = false;
  private _blastSpinX = 0;
  /** Seconds a blast survivor lies sprawled, counted from the landing and not from the launch. */
  private _pendingBlastSprawlSeconds = 0;
  private _blastSpinZ = 0;

  private _applyCrowdLean(dt: number): void {
    if (this._blastTumbling) {
      const rot = this.body.root.rotation;
      if (!this._grounded && (this._velocity.y > 0 || this.position.y > 0.02)) {
        // Blast flight: spin freely instead of settling toward the topple lean.
        rot.x += this._blastSpinX * dt;
        rot.z += this._blastSpinZ * dt;
        return;
      }
      // Landed: drop whole turns so the lay-flat settle below takes the short way round.
      this._blastTumbling = false;
      rot.x = Math.atan2(Math.sin(rot.x), Math.cos(rot.x));
      rot.z = Math.atan2(Math.sin(rot.z), Math.cos(rot.z));
    }
    const horizontalSpeed = this.horizontalSpeed;
    const facing = this._getFacingVector();
    const right = this._getRightVector();
    const balanceDirection = this._balanceDirection.lengthSquared() > 0.0001
      ? this._balanceDirection
      : facing;
    const forwardLoad = Vector3.Dot(balanceDirection, facing);
    const sideLoad = Vector3.Dot(balanceDirection, right);
    if (this.physicsState === "toppled" || this.isDowned) {
      this._blowStagger = 0;
      // Fall all the way over along the dominant push axis: toppled bodies tip past 70 deg,
      // downed ones lie flat on the ground instead of hanging at a lean with their feet planted.
      const settle = Math.min(1, dt * (this.isDowned ? 10 : 7));
      const flat = this.isDowned ? 1.5 : 1.3;
      const pitchDominant = Math.abs(forwardLoad) >= Math.abs(sideLoad);
      const targetLeanX = pitchDominant ? (forwardLoad >= 0 ? -flat : flat) : -forwardLoad * 0.5;
      const targetLeanZ = pitchDominant ? sideLoad * 0.5 : (sideLoad >= 0 ? flat : -flat);
      this.body.root.rotation.x += (targetLeanX - this.body.root.rotation.x) * settle;
      this.body.root.rotation.z += (targetLeanZ - this.body.root.rotation.z) * settle;
      return;
    }
    const targetLeanX = Math.max(
      -0.18,
      Math.min(
        0.18,
        (
          -this._velocity.z * 0.02
          - this._crowdPressure * 0.05
          - forwardLoad * this.pressureLoad * 0.18
        ) * this._crowdPhysicsProfile.leanResponse,
      ),
    );
    const targetLeanZ = Math.max(
      -0.36,
      Math.min(
        0.36,
        (
          this._velocity.x * 0.025
          + sideLoad * this.pressureLoad * 0.16
        ) * this._crowdPhysicsProfile.leanResponse,
      ),
    );
    let settle = Math.min(1, dt * (8 + this._crowdPhysicsProfile.recoveryRate * 2 + horizontalSpeed));
    let staggerX = 0;
    let staggerZ = 0;
    if (this._blowStagger > 0) {
      const before = this._blowStagger;
      this._blowStagger = Math.max(0, this._blowStagger - dt);
      const k = Math.min(1, this._blowStagger / (BLOW_THROW_SECONDS - BLOW_THROW_HOLD));
      [staggerX, staggerZ] = this._blowStaggerLean(k);
      if (before > BLOW_THROW_SECONDS - BLOW_THROW_HOLD) settle = 1;
    }
    this.body.root.rotation.x += (targetLeanX + staggerX - this.body.root.rotation.x) * settle;
    this.body.root.rotation.z += (targetLeanZ + staggerZ - this.body.root.rotation.z) * settle;
  }

  hasCapability(channel: LinkedContributionChannel, now = RuntimeUnit.timeNowSeconds()): boolean {
    if (!this.hasContribution(channel)) return false;
    if (this._isDead) return false;
    if (this.isStaggered) return false;
    if (now < this._toppledUntil) return false;
    if (now < this._downedUntil) return false;
    if (!this._grounded || this.position.y > 0.04) return false;
    if (channel === "attack" && now < this._attackInterruptedUntil) return false;
    if (channel === "attack" && now < this._recoveringUntil) return false;
    return true;
  }

  getPhysicsDisabledChannels(now = RuntimeUnit.timeNowSeconds()): LinkedContributionChannel[] {
    const disabled: LinkedContributionChannel[] = [];
    if (!this.hasCapability("move", now)) disabled.push("move");
    if (!this.hasCapability("attack", now)) disabled.push("attack");
    return disabled;
  }

  private _updateCrowdPhysicsState(pressure: number, impulse: Vector3, pressureScale = 1): void {
    if (this._isDead || this._isAnchoredActor) return;
    if (pressure <= 0) return;
    const now = RuntimeUnit.timeNowSeconds();
    const direction = this._normalizeHorizontal(impulse);
    const facing = this._getFacingVector();
    const contactDirection = direction.lengthSquared() > 0.0001 ? direction : facing;
    const forwardDot = Vector3.Dot(contactDirection, facing);
    const directionalScale = forwardDot >= 0
      ? 1 + forwardDot * Math.max(0, this._crowdPhysicsProfile.forwardToppleBias - 1)
      : Math.max(0.7, 1 + forwardDot * 0.55);
    const appliedPressure = Math.max(0, pressure * pressureScale * directionalScale);

    const weightedDirection = this._balanceDirection.scale(this._balancePressure)
      .add(contactDirection.scale(appliedPressure));
    if (weightedDirection.lengthSquared() > 0.0001) {
      this._balanceDirection.copyFrom(weightedDirection.normalize());
    } else {
      this._balanceDirection.copyFrom(contactDirection);
    }

    this._balancePressure = Math.min(
      this._crowdPhysicsProfile.balanceCapacity,
      this._balancePressure + appliedPressure,
    );

    const alreadyToppled = now < this._downedUntil;
    const stillAirborneFromTopple = this._toppleDirectionTag !== "none" && (!this._grounded || this.position.y > 0.05);
    if (alreadyToppled || stillAirborneFromTopple) {
      return;
    }

    // A man held in his shield wall is braced by it: the shove moves the wall, it does not fold him
    if (this.wallBraced) return;
    if (this._balancePressure >= this._crowdPhysicsProfile.launchThreshold) {
      this._enterTopple(now, Math.max(appliedPressure, this._balancePressure), this._balanceDirection, true);
      return;
    }
    if (this._balancePressure >= this._crowdPhysicsProfile.toppleThreshold) {
      this._enterTopple(now, Math.max(appliedPressure, this._balancePressure), this._balanceDirection, false);
    }
  }

  private _enterTopple(now: number, pressure: number, direction: Vector3, launched: boolean): void {
    const toppleDirection = direction.lengthSquared() > 0.0001
      ? direction
      : this._getFacingVector();
    const facing = this._getFacingVector();
    const right = this._getRightVector();
    this._toppleDirection.copyFrom(toppleDirection);
    const forwardness = Vector3.Dot(toppleDirection, facing);
    this._toppleForwardness = Number(forwardness.toFixed(3));
    if (forwardness >= 0.2) {
      this._toppleDirectionTag = "forward";
    } else if (forwardness <= -0.2) {
      this._toppleDirectionTag = "backward";
    } else {
      this._toppleDirectionTag = "sideways";
    }
    this._toppledUntil = Math.max(this._toppledUntil, now + this._crowdPhysicsProfile.toppleSeconds);
    const downedSeconds = this.definition.downedSeconds;
    this._downedUntil = Math.max(this._downedUntil, this._toppledUntil + downedSeconds);
    this._recoveringUntil = Math.max(this._recoveringUntil, this._downedUntil + this._crowdPhysicsProfile.recoverySeconds);
    this._grounded = false;
    const carry = toppleDirection.scale(Math.max(0.22, pressure * this._crowdPhysicsProfile.shoveResponse * this._crowdPhysicsProfile.topplePitchStrength));
    this._velocity.x = this._velocity.x * 0.35 + carry.x;
    this._velocity.z = this._velocity.z * 0.35 + carry.z;
    const toppleLift = (launched ? 0.24 : 0.12) + pressure * this._crowdPhysicsProfile.toppleCarry;
    this._velocity.y = Math.min(0.7, Math.max(this._velocity.y * 0.45, toppleLift));
    this._staggerTimer = Math.max(
      this._staggerTimer,
      this._crowdPhysicsProfile.toppleSeconds * (launched ? 0.45 : 0.35),
    );
    if (this._attackInterruptedUntil < now + 0.05) {
      this._attackInterruptedUntil = now + Math.min(0.52, 0.2 + pressure * 0.1);
      this._attackInterruptedCount += 1;
    }
    this.stopMoving();
    const rollInfluence = Vector3.Dot(toppleDirection, right);
    this.body.root.rotation.z = Math.max(
      -0.92,
      Math.min(0.92, rollInfluence * this._crowdPhysicsProfile.toppleRollStrength * 2),
    );
    this.animator.triggerFlinch();
  }

  private _maybeInterruptAttack(pressure: number, now: number, contactRole?: ContactRole): void {
    if (pressure < this.attackInterruptThreshold) return;
    if (this.isDowned) return;
    if (now < this._attackInterruptedUntil - 0.05) return;
    this._attackInterruptedUntil = now + Math.min(0.48, 0.18 + pressure * 0.12);
    this._nextAttackAt = Math.max(this._nextAttackAt, now + Math.min(0.52, 0.22 + pressure * 0.14));
    this._staggerTimer = Math.max(this._staggerTimer, Math.min(0.28, 0.08 + pressure * 0.05));
    this._attackInterruptedCount += 1;
    if (contactRole) this._lastContactRole = contactRole;
    if (this.animator.state === AnimState.Attacking) {
      this.animator.setState(AnimState.Idle);
    }
  }

  private _getFacingVector(): Vector3 {
    return new Vector3(Math.sin(this.body.root.rotation.y), 0, Math.cos(this.body.root.rotation.y));
  }

  private _getRightVector(): Vector3 {
    return new Vector3(Math.cos(this.body.root.rotation.y), 0, -Math.sin(this.body.root.rotation.y));
  }

  private _normalizeHorizontal(vector: Vector3): Vector3 {
    const horizontal = new Vector3(vector.x, 0, vector.z);
    if (horizontal.lengthSquared() <= 0.000001) {
      return Vector3.Zero();
    }
    return horizontal.normalize();
  }

  private _updateHealthBar(): void {
    if (!this.healthBarMesh || !this.healthBarBg) return;
    if (this._isAnchoredActor) {
      this.healthBarMesh.isVisible = false;
      this.healthBarBg.isVisible = false;
      return;
    }
    const ratio = this._currentHealth / Math.max(1, this._maxHealth);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    this.healthBarMesh.isVisible = clampedRatio > 0;
    this.healthBarBg.isVisible = !this._isDead;
    this.healthBarMesh.scaling.x = Math.max(0.01, clampedRatio);
    this.healthBarMesh.position.x = -(1 - clampedRatio) * this.healthBarWidth * 0.5;
  }

  private _applyVisualPresentation(now: number): void {
    const activeStates = new Set<VisualStateTag>();
    activeStates.add(this._isMoving ? "moving" : "idle");
    const isAttacking = this.animator.state === AnimState.Attacking;
    if (isAttacking) activeStates.add("attacking");
    if (isAttacking || this._spinning) activeStates.add("ability-active");

    const activeKeys = new Set<string>();
    for (const state of activeStates) {
      for (const key of this.visualConfig.stateVariants?.[state] ?? []) {
        activeKeys.add(key);
      }
    }

    for (const mesh of this.propMeshes) {
      const key = mesh.metadata?.visualKey as string | undefined;
      if (!key) continue;
      mesh.isVisible = activeKeys.has(key);
    }

    this._applyPoseOverlay(isAttacking);
    this._applyFxPreset(this.visualConfig.fxPreset ?? "none", isAttacking, now);
  }

  private _applyPoseOverlay(isAttacking: boolean): void {
    const body = this.body;
    switch (this.visualConfig.posePreset) {
      case "archer":
        body.leftShoulder.rotation.z -= 0.18;
        body.rightShoulder.rotation.z += 0.1;
        if (isAttacking) {
          body.leftShoulder.rotation.x -= 0.35;
          body.rightShoulder.rotation.x += 0.22;
          body.torso.rotation.z -= 0.05;
        }
        break;
      case "caster":
        // A caster with a rod in his hand stands and casts from his own hold: only one with nothing to hold has his arms spread for him
        if (this.animator.castsFromHold) break;
        body.leftShoulder.rotation.z -= 0.22;
        body.rightShoulder.rotation.z += 0.22;
        body.leftElbow.rotation.x -= 0.15;
        body.rightElbow.rotation.x -= 0.15;
        if (isAttacking) {
          body.torso.rotation.x -= 0.08;
          body.neck.rotation.x += 0.1;
        }
        break;
      case "shouter":
        body.torso.rotation.x -= isAttacking ? 0.18 : 0.06;
        body.neck.rotation.x += isAttacking ? 0.26 : 0.08;
        body.leftShoulder.rotation.z -= 0.28;
        body.rightShoulder.rotation.z += 0.28;
        break;
      case "duelist":
        body.torso.rotation.z += 0.04;
        body.leftShoulder.rotation.z -= 0.12;
        body.rightShoulder.rotation.z += 0.04;
        if (isAttacking) {
          body.torso.rotation.x -= 0.1;
          body.neck.rotation.z += 0.08;
        }
        break;
      case "gunner":
        body.torso.rotation.z += 0.02;
        body.leftShoulder.rotation.z -= 0.1;
        body.rightShoulder.rotation.z += 0.18;
        body.leftElbow.rotation.x -= 0.14;
        body.rightElbow.rotation.x -= 0.18;
        if (isAttacking) {
          body.torso.rotation.x -= 0.06;
          body.neck.rotation.x += 0.06;
        }
        break;
      case "brute":
        body.torso.rotation.x += isAttacking ? 0.12 : 0.06;
        body.leftShoulder.rotation.z -= 0.16;
        body.rightShoulder.rotation.z += 0.16;
        body.leftElbow.rotation.x -= 0.08;
        body.rightElbow.rotation.x -= 0.08;
        break;
      case "boxer":
        body.leftShoulder.rotation.z -= 0.24;
        body.rightShoulder.rotation.z += 0.24;
        body.leftElbow.rotation.x -= 0.32;
        body.rightElbow.rotation.x -= 0.32;
        body.torso.rotation.x -= isAttacking ? 0.14 : 0.05;
        break;
      case "monarch":
        body.torso.rotation.x += isAttacking ? 0.02 : 0.06;
        body.torso.rotation.z += 0.02;
        body.leftShoulder.rotation.z -= 0.08;
        body.rightShoulder.rotation.z += 0.08;
        body.neck.rotation.x -= 0.04;
        break;
      case "spinner":
        body.leftShoulder.rotation.z -= 0.42;
        body.rightShoulder.rotation.z += 0.42;
        body.leftElbow.rotation.x -= 0.24;
        body.rightElbow.rotation.x -= 0.24;
        break;
      case "giant":
        body.leftShoulder.rotation.z -= 0.24;
        body.rightShoulder.rotation.z += 0.24;
        body.torso.rotation.x += isAttacking ? 0.12 : 0.05;
        body.neck.rotation.x -= 0.04;
        break;
      case "mounted":
        body.torso.rotation.x += 0.12;
        body.leftHip.rotation.x += 0.08;
        body.rightHip.rotation.x += 0.08;
        break;
      case "crew": {
        // Gun crew lunge at the carriage: leaning into it on a near-straight back with both hands on it, one leg stepped forward on a bent
        // knee and the other braced back. The loader leads with the other leg and bends less, so the two are not twins.
        // The lead thigh is raised near level with the shin dropped back under it and the arms reach out to the gun, a
        // deep lunge and not a straight-legged plank lean with hanging arms.
        const loader = this._linkedRoleLabel === "loader";
        const lead = loader ? body.leftHip : body.rightHip;
        const leadKnee = loader ? body.leftKnee : body.rightKnee;
        const brace = loader ? body.rightHip : body.leftHip;
        body.torso.rotation.x += loader ? 0.42 : 0.5;
        body.neck.rotation.x -= loader ? 0.15 : 0.2;
        lead.rotation.x -= loader ? 0.6 : 0.7;
        leadKnee.rotation.x += loader ? 0.6 : 0.7;
        brace.rotation.x += 0.4;
        body.leftShoulder.rotation.x -= loader ? 1.15 : 1.3;
        body.rightShoulder.rotation.x -= loader ? 1.4 : 1.3;
        body.leftElbow.rotation.x -= 0.3;
        body.rightElbow.rotation.x -= 0.3;
        break;
      }
      case "support":
        body.leftShoulder.rotation.z -= 0.18;
        body.rightShoulder.rotation.z += 0.18;
        body.leftElbow.rotation.x -= 0.1;
        body.rightElbow.rotation.x -= 0.1;
        break;
      case "beast":
        body.neck.rotation.x += 0.12;
        body.leftShoulder.rotation.x += 0.12;
        body.rightShoulder.rotation.x += 0.12;
        break;
      default:
        break;
    }
  }

  /** The drunk look (DRUNK): skin dyed green and lit green, the trunk rolling side to side and the head lolling; undone when it wears off. */
  private _applyDrunk(now: number): boolean {
    const drunk = this.isDrunk;
    const skin = this.body.skinMaterial;
    if (drunk && !this._drunkDyed) {
      this._skinBase = skin.baseColor.clone();
      skin.baseColor = Color3.Lerp(this._skinBase, DRUNK.green, DRUNK.dye);
      this._drunkDyed = true;
    } else if (!drunk && this._drunkDyed) {
      if (this._skinBase) skin.baseColor = this._skinBase;
      this._drunkDyed = false;
    }
    if (!drunk) return false;
    skin.emissiveColor = this._skinGlow.add(DRUNK.green.scale(DRUNK.glow));
    this.body.bodyMaterial.emissiveColor = DRUNK.green.scale(DRUNK.glow * 0.6);
    const b = this.body;
    b.torso.rotation.z += Math.sin(now * DRUNK.rate) * DRUNK.roll;
    b.neck.rotation.z -= Math.sin(now * DRUNK.rate + 0.8) * DRUNK.roll * 1.4;
    b.neck.rotation.x += DRUNK.roll * 0.6;
    return true;
  }

  private _applyFxPreset(fxPreset: FxPreset, isAttacking: boolean, now: number): void {
    if (this._applyDrunk(now)) return;
    const pulse = 0.08 + (isAttacking ? 0.14 : 0.04) * (0.5 + 0.5 * Math.sin(now * 8));
    let color: Color3 | null = null;
    switch (fxPreset) {
      case "frost":
        color = new Color3(0.6, 0.9, 1.0);
        break;
      case "ember":
        color = new Color3(1.0, 0.45, 0.12);
        break;
      case "spectral":
        color = new Color3(0.75, 0.7, 1.0);
        break;
      case "solar":
        color = new Color3(1.0, 0.88, 0.35);
        break;
      case "royal":
        color = new Color3(0.95, 0.78, 0.3);
        break;
      case "wind":
        color = new Color3(0.75, 0.95, 1.0);
        break;
      default:
        break;
    }

    if (!color) {
      this.body.bodyMaterial.emissiveColor.set(0, 0, 0);
      this.body.skinMaterial.emissiveColor.copyFrom(this._skinGlow);
      return;
    }

    this.body.bodyMaterial.emissiveColor = color.scale(pulse);
    this.body.skinMaterial.emissiveColor = this._skinGlow.add(color.scale(pulse * 0.25));
  }

  /** Reset unit to its original spawn state (position, health, alive). */
  resetToSpawn(): void {
    this._isDead = false;
    this._drunkUntil = 0;
    if (this._drunkDyed && this._skinBase) this.body.skinMaterial.baseColor = this._skinBase;
    this._drunkDyed = false;
    this._maxHealth = this.definition.maxHealth;
    this._currentHealth = this._maxHealth;
    this._moveTarget = null;
    this._isMoving = false;
    this._velocity.setAll(0);
    this._movementVelocity.setAll(0);
    this._grounded = true;
    this._staggerTimer = 0;
    this._crowdPressure = 0;
    this._balancePressure = 0;
    this._balanceDirection.copyFromFloats(0, 0, 1);
    this._toppleDirection.copyFromFloats(0, 0, 1);
    this._toppleDirectionTag = "none";
    this._toppleForwardness = 0;
    this._toppledUntil = 0;
    this._downedUntil = 0;
    this._recoveringUntil = 0;
    this._pendingBlastSprawlSeconds = 0;
    this._collisionPushTotal = 0;
    this._collisionPushPeak = 0;
    this._collisionContactCount = 0;
    this._pressureTransferred = 0;
    this._attackInterruptedCount = 0;
    this._attackInterruptedUntil = 0;
    this._lastContactRole = null;
    this._spinning = false;
    this._slowMultiplier = 1;
    this._slowUntil = 0;
    this._physicsActive = false;
    this._bounceCount = 0;
    this._corpseYaw = null;
    for (const node of this._shedGear) node.setEnabled(true);
    this._shedGear.length = 0;
    this._deathSpinX = 0;
    this._deathSpinY = 0;
    this._blastTumbling = false;
    this._nextAttackAt = 0;
    this._spawnRole = "placed";
    this._countsTowardVictory = true;
    this._linkedParent = null;
    this._linkedRelation = null;
    this._linkedChildren.clear();
    this._anchoredOffset = null;
    this._syncLinkedFacing = true;
    this._linkedRoleLabel = null;
    this._linkedParentRoleLabel = null;
    this._isAnchoredActor = false;
    this._isTargetable = true;
    this._isCombatEmitter = true;
    this._damageRouting = "self";
    this._victoryRouting = "self";
    this._moveMode = "self";
    this._cleanupPolicy = "self";
    this._detachOnParentDeath = false;
    this._actionPreset = "none";
    this._contributionChannels = [];
    this._isImpactOrigin = false;
    this._primaryEmitterEnabled = true;
    this._emitterCursor = 0;
    this._vehicleSocketCursor = 0;
    this._attackOriginOffset = null;
    this._smokeOriginOffset = null;
    this._impactOriginOffset = null;
    this._decorativeStandinsSuppressed = false;
    this._expiresAt = Infinity;
    this._linkedDescriptors = this._linkedDescriptors.filter((descriptor) => descriptor.persistent);

    // Restore position and clear rotation
    this.body.root.position.copyFrom(this._spawnPosition);
    this.body.root.rotation.set(0, this._spawnRotationY, 0);

    // Reset all joint rotations
    for (const joint of this.body.allJoints) {
      joint.rotation.set(0, 0, 0);
    }

    // Restore mesh visibility (corpses may have been hidden)
    for (const mesh of this.body.allMeshes) {
      mesh.isVisible = true;
    }

    // Restore health bar
    if (this.healthBarMesh) {
      this.healthBarMesh.isVisible = true;
      this.healthBarMesh.scaling.x = 1;
      this.healthBarMesh.position.x = 0;
    }
    if (this.healthBarBg) this.healthBarBg.isVisible = true;

    this.animator.setState(AnimState.Idle);
  }

  dispose(): void {
    if (this._fxParticleSystem) {
      this._fxParticleSystem.stop();
      this._fxParticleSystem.dispose(false);
      this._fxParticleSystem = null;
    }
    if (this._linkedParent) {
      this._linkedParent.detachLinkedChild(this);
    }
    for (const child of [...this._linkedChildren]) {
      this.detachLinkedChild(child);
    }
    if (this.healthBarMesh) this.healthBarMesh.dispose();
    if (this.healthBarBg) this.healthBarBg.dispose();
    for (const m of this.propMeshes) {
      m.dispose();
    }
    // Dispose all body meshes
    for (const m of this.body.allMeshes) {
      m.dispose();
    }
    this.body.root.dispose();
  }

  getAttackEmitter(): RuntimeUnit {
    const emitters: RuntimeUnit[] = [];
    if (this._primaryEmitterEnabled) {
      emitters.push(this);
    }
    for (const child of this._linkedChildren) {
      if (!child.isDead && child._isCombatEmitter) {
        emitters.push(child);
      }
    }
    if (emitters.length === 0) return this;
    const emitter = emitters[this._emitterCursor % emitters.length];
    this._emitterCursor += 1;
    return emitter;
  }

  getImpactEmitter(): RuntimeUnit {
    for (const child of this._linkedChildren) {
      if (!child.isDead && child._isImpactOrigin) {
        return child;
      }
    }
    return this.getAttackEmitter();
  }

  requiresContribution(channel: LinkedContributionChannel): boolean {
    for (const child of this._linkedChildren) {
      if (child._contributionChannels.includes(channel)) return true;
    }
    return false;
  }

  hasContribution(channel: LinkedContributionChannel): boolean {
    if (!this.requiresContribution(channel)) return true;
    for (const child of this._linkedChildren) {
      if (!child.isDead && child._contributionChannels.includes(channel)) return true;
    }
    return false;
  }

  getMissingContributionRoles(channel: LinkedContributionChannel): string[] {
    if (!this.requiresContribution(channel)) return [];
    return Array.from(this._linkedChildren)
      .filter((child) => child.isDead && child._contributionChannels.includes(channel))
      .map((child) => `${child._linkedRoleLabel ?? child.definition.displayName}:${channel}`);
  }

  getAttackOrigin(advanceSequence = true): OriginInfo {
    const sockets = this.body.vehicleSockets;
    if (sockets?.muzzleSequence && sockets.muzzleSequence.length > 0) {
      const cursor = this._vehicleSocketCursor % sockets.muzzleSequence.length;
      const socket = sockets.muzzleSequence[cursor];
      if (advanceSequence) {
        this._vehicleSocketCursor += 1;
      }
      return {
        position: socket.getAbsolutePosition(),
        source: "vehicle-socket",
        socket: "muzzleSequence",
      };
    }
    if (sockets?.primaryMuzzle) {
      return {
        position: sockets.primaryMuzzle.getAbsolutePosition(),
        source: "vehicle-socket",
        socket: "primaryMuzzle",
      };
    }
    const emitter = this.getAttackEmitter();
    const position = emitter._resolveCustomOrigin(emitter._attackOriginOffset);
    return {
      position,
      source: emitter === this ? "parent" : "linked-role",
      emitter,
    };
  }

  getSmokeOrigin(advanceSequence = true): OriginInfo {
    const sockets = this.body.vehicleSockets;
    if (sockets?.smokeSocket) {
      return {
        position: sockets.smokeSocket.getAbsolutePosition(),
        source: "vehicle-socket",
        socket: "smokeSocket",
      };
    }
    // A long gun in the fist smokes at its own mouth, where the aim has put it, not at a point off the chest (renaissance.musketeer.jpg)
    const muzzle = this._gunMuzzle();
    if (muzzle) {
      muzzle.computeWorldMatrix(true);
      return { position: muzzle.getAbsolutePosition().clone(), source: "vehicle-socket", socket: "smokeSocket" };
    }
    const emitter = this.getAttackEmitter();
    return {
      position: emitter._resolveCustomOrigin(emitter._smokeOriginOffset ?? emitter._attackOriginOffset),
      source: emitter === this ? "parent" : "linked-role",
      emitter,
    };
  }

  private _gunMuzzleNode: TransformNode | null | undefined = undefined;
  private _gunMuzzle(): TransformNode | null {
    if (this._gunMuzzleNode === undefined) {
      const found = this.body.vehicleSockets ? undefined : this.body.rightHand?.getDescendants(false, (n) => n.name === "musketMuzzle")[0];
      this._gunMuzzleNode = found instanceof TransformNode ? found : null;
    }
    return this._gunMuzzleNode && !this._gunMuzzleNode.isDisposed() ? this._gunMuzzleNode : null;
  }

  getImpactOrigin(advanceSequence = true): OriginInfo {
    const sockets = this.body.vehicleSockets;
    if (sockets?.impactOrigin) {
      return {
        position: sockets.impactOrigin.getAbsolutePosition(),
        source: "vehicle-socket",
        socket: "impactOrigin",
      };
    }
    const emitter = this.getImpactEmitter();
    return {
      position: emitter._resolveCustomOrigin(emitter._impactOriginOffset),
      source: emitter === this ? "parent" : "linked-role",
      emitter,
    };
  }

  private _resolveCustomOrigin(offset: Vector3 | null): Vector3 {
    if (!offset) return this.position.clone();
    const yaw = this.body.root.rotation.y;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    return this.position.add(new Vector3(
      offset.x * cos + offset.z * sin,
      offset.y,
      -offset.x * sin + offset.z * cos,
    ));
  }

  triggerLinkedRoleActions(durationSeconds: number): void {
    for (const child of this._linkedChildren) {
      if (child.isDead || child._actionPreset === "none") continue;
      switch (child._actionPreset) {
        case "reload":
          child.animator.triggerAttack(Math.max(0.12, durationSeconds * 0.18), "reload");
          break;
        case "crank":
          child.animator.triggerAttack(Math.max(0.16, durationSeconds * 0.28), "crank");
          break;
        case "charge-mount":
        case "dragon-breath":
          child.animator.triggerAttack(Math.max(0.18, durationSeconds * 0.26), "breath");
          break;
        case "cart-brace":
        case "shell-guard":
          child.animator.triggerAttack(Math.max(0.1, durationSeconds * 0.16), "brace");
          break;
        case "carry-safe":
          child.animator.triggerAttack(Math.max(0.1, durationSeconds * 0.16), "carry");
          break;
        default:
          break;
      }
    }
  }

  /** A number in [0, 1) fixed for this man and this salt (deterministic, keyed on the runtime id): his own share of a spread every man draws from. */
  vary(salt: number): number {
    const v = Math.sin(this.runtimeId * 12.9898 + salt * 78.233) * 43758.5453;
    return v - Math.floor(v);
  }

  /** His own attack is a swing that comes down on a man: heavy (club, hammer, axe) or a blade's slash. */
  get swingsAtMan(): boolean {
    const motion = this._resolvePrimaryAttackMotion();
    return motion === "heavy_swing" || motion === "blade_slash";
  }

  /** The swing he has just started is struck at this man's head (null: at nobody). */
  aimBlowAt(target: RuntimeUnit | null, landsIn = 0): void {
    this.animator.aimBlowAt(target ? target.body.headTop : null, landsIn);
  }

  /** Seconds until the swing he has just started is on the man it is struck at; 0 when his attack is no such swing. */
  blowLandsIn(): number {
    return this.animator.blowLandsIn();
  }

  /** Re-runs this frame's pose without advancing time, so something that happened to him later in the step (a blow landing) shows on this very frame. */
  reposeNow(): void {
    if (!this._isDead) this.animator.update(0);
  }

  triggerAttackVisual(durationSeconds: number): void {
    let motion = this._resolvePrimaryAttackMotion();
    switch (this._actionPreset) {
      case "reload":
        motion = "reload";
        break;
      case "crank":
        motion = "crank";
        break;
      case "cart-brace":
      case "shell-guard":
        motion = "brace";
        break;
      case "carry-safe":
        motion = "carry";
        break;
      case "charge-mount":
      case "dragon-breath":
        motion = "breath";
        break;
      default:
        break;
    }
    this.animator.triggerAttack(durationSeconds, motion);
  }

  private _resolvePresentationFamily(): WeaponPresentationFamily {
    return this.visualConfig.weaponPresentationFamily ?? "default";
  }

  private _resolvePrimaryAttackMotion(): AttackMotion {
    switch (this._resolvePresentationFamily()) {
      case "heavy_swing":
        return "heavy_swing";
      case "blade_slash":
        return "blade_slash";
      case "thrust":
        return "thrust";
      case "throw":
        return "throw";
      case "bow_draw_release":
        return "bow_draw_release";
      case "crossbow_snap":
        return "crossbow_snap";
      case "firearm_recoil":
        return "firearm_recoil";
      default:
        return "strike";
    }
  }

  private _resolveLocomotionBias(): LocomotionBias {
    const bias = this.visualConfig.locomotionBiasPreset ?? "none";
    switch (bias) {
      case "heavy_carry":
      case "aimed":
      case "braced":
        return bias;
      default:
        return "none";
    }
  }

  private _resolvePrimaryAttackWindup(cooldown: number): number {
    const base = cooldown * 0.3;
    const timing = this.visualConfig.releaseTimingPreset ?? "default";
    switch (timing) {
      case "bow_release":
        return Math.max(0.2, cooldown * 0.46);
      case "crossbow_release":
        return Math.max(0.18, cooldown * 0.4);
      case "firearm_recoil":
        return Math.max(0.16, cooldown * 0.34);
      case "thrust_extend":
        return Math.max(0.14, cooldown * 0.32);
      case "throw_release":
        return Math.max(0.16, cooldown * 0.36);
      case "melee_commit":
        return Math.max(0.12, cooldown * 0.3);
      default:
        return Math.max(0.12, base);
    }
  }
}
