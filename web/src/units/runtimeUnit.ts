import { Vector3, Mesh, MeshBuilder, Color3, Scene, ParticleSystem } from "@babylonjs/core";
import { createFxAmbient } from "../combat/particleFactory";
import type { UnitDefinition } from "../data/unitDefinitions";
import type { CrowdPhysicsProfile, RagdollProfile } from "../data/combatProfiles";
import type { ArticulatedBody } from "./bodyBuilder";
import { ProceduralAnimator, AnimState } from "./proceduralAnimation";
import { resolveObstacleCollisions, type Obstacle } from "../map/obstacles";
import type { FxPreset, UnitVisualConfig, VisualStateTag } from "./unitVisuals";
import type {
  LinkedActionPreset, LinkedCleanupPolicy, LinkedContributionChannel, LinkedDamageRouting, LinkedMoveMode, LinkedVictoryRouting,
} from "./linkedActorPresets";

export type RuntimeSpawnRole = "placed" | "summoned" | "crew" | "mount" | "attachment";
export type LinkedRelation = "crew" | "mount" | "attachment" | "spawned-child";

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

export class RuntimeUnit {
  private static _nextRuntimeId = 1;
  static timeNowSeconds: () => number = () => performance.now() / 1000;

  readonly runtimeId: number;
  readonly definition: UnitDefinition;
  readonly team: number;
  readonly body: ArticulatedBody;
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
  private _toppledUntil = 0;
  private _recoveringUntil = 0;

  // Ambient FxPreset particle system
  private _fxParticleSystem: ParticleSystem | null = null;

  // Special: spinning (berserker)
  private _spinning = false;
  private _slowMultiplier = 1;
  private _slowUntil = 0;

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

  // Health bar
  healthBarMesh: Mesh | null = null;
  healthBarBg: Mesh | null = null;

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
  get isAirborne(): boolean { return !this._grounded || this.position.y > 0.01; }
  get crowdPressure(): number { return this._crowdPressure; }
  get crowdPhysicsProfileId(): string { return this._crowdPhysicsProfile.id; }
  get crowdResistance(): number { return this._crowdPhysicsProfile.crowdResistance; }
  get crowdSeparationStrength(): number { return this._crowdPhysicsProfile.separationStrength; }
  get horizontalSpeed(): number { return Math.sqrt(this._velocity.x * this._velocity.x + this._velocity.z * this._velocity.z); }
  get isStaggered(): boolean { return this._staggerTimer > 0.02; }
  get isToppled(): boolean { return !this._isDead && RuntimeUnit.timeNowSeconds() < this._toppledUntil; }
  get isRecovering(): boolean {
    const now = RuntimeUnit.timeNowSeconds();
    return !this._isDead && now >= this._toppledUntil && now < this._recoveringUntil;
  }
  get physicsState(): "steady" | "airborne" | "toppled" | "recovering" | "dead" {
    if (this._isDead) return "dead";
    const now = RuntimeUnit.timeNowSeconds();
    if (now < this._toppledUntil) return "toppled";
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
    this.propMeshes = propMeshes;
    this.visualConfig = visualConfig;
    this._ragdollProfile = ragdollProfile;
    this._crowdPhysicsProfile = crowdPhysicsProfile;
    this._maxHealth = definition.maxHealth;
    this._currentHealth = this._maxHealth;
    this.animator = new ProceduralAnimator(body);
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
    this.animator.triggerAttack(cooldown * 0.3);
  }

  moveTo(target: Vector3): void {
    if (this._isDead) return;
    this._moveTarget = target.clone();
    if (!this._isMoving) {
      this._isMoving = true;
      this.animator.setState(AnimState.Walking);
    }
  }

  stopMoving(): void {
    this._moveTarget = null;
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

  setSpinning(spinning: boolean): void {
    this._spinning = spinning;
  }

  get isSpinning(): boolean { return this._spinning; }

  applyDamage(damage: number, impulse: Vector3): void {
    if (this._linkedParent && this._isAnchoredActor && this._damageRouting === "parent") {
      this._linkedParent.applyDamage(damage, impulse);
      return;
    }
    if (this._isDead || damage <= 0) return;
    this._currentHealth -= damage;

    if (this._currentHealth <= 0) {
      this._die(impulse);
      return;
    }

    // Velocity-based knockback for living units
    const mult = this._ragdollProfile.impactMultiplier;
    const knockScale = mult / Math.max(0.5, this.definition.mass);
    const knockVel = impulse.scale(knockScale * 0.8);
    // Add upward pop proportional to horizontal knockback
    knockVel.y = Math.max(knockVel.y, impulse.length() * knockScale * 0.25);
    this._velocity.addInPlace(knockVel);
    this._grounded = false;

    // Stagger: briefly interrupt movement
    this._staggerTimer = Math.min(0.3, knockScale * 0.15);
    this._crowdPressure = Math.min(
      1.6,
      Math.max(
        this._crowdPressure,
        (impulse.length() * 0.04 * this._crowdPhysicsProfile.staggerResponse) / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance),
      ),
    );
    this._updateCrowdPhysicsState(
      (impulse.length() * 0.04 * this._crowdPhysicsProfile.staggerResponse) / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance),
      impulse,
    );

    // Flinch: tilt body toward impact
    this.animator.triggerFlinch();
  }

  applyCollisionImpulse(impulse: Vector3): void {
    if (this._isDead || (this._linkedParent && this._isAnchoredActor)) return;
    const horizontalImpulse = new Vector3(impulse.x, 0, impulse.z);
    const magnitude = horizontalImpulse.length();
    if (magnitude <= 0.0001) return;

    this._collisionContactCount += 1;
    this._collisionPushTotal += magnitude;
    this._collisionPushPeak = Math.max(this._collisionPushPeak, magnitude);

    const pushScale = 0.42 / Math.max(0.55, this.definition.mass);
    this._velocity.addInPlace(horizontalImpulse.scale(pushScale));
    this._staggerTimer = Math.max(this._staggerTimer, Math.min(0.22, 0.04 + magnitude * 0.025));
    this._crowdPressure = Math.min(
      1.8,
      Math.max(this._crowdPressure, magnitude * 0.18 * this._crowdPhysicsProfile.staggerResponse),
    );
    this._updateCrowdPhysicsState(
      Math.min(
        1.8,
        (magnitude * 0.18 * this._crowdPhysicsProfile.staggerResponse) / Math.max(0.45, this._crowdPhysicsProfile.crowdResistance),
      ),
      horizontalImpulse,
    );
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
    resolveObstacleCollisions(this.body.root.position, this.definition.collisionRadius, RuntimeUnit.obstacles);
  }

  applyCrowdDisplacement(offset: Vector3, pressure: number): void {
    if (this._isDead || this._isAnchoredActor) return;
    if (offset.lengthSquared() <= 0.000001) return;

    this.body.root.position.addInPlace(offset);
    if (this.body.root.position.y < 0) {
      this.body.root.position.y = 0;
    }
    resolveObstacleCollisions(this.body.root.position, this.definition.collisionRadius, RuntimeUnit.obstacles);
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
      new Vector3(
        offset.x * 6.5 * this._crowdPhysicsProfile.shoveResponse,
        0,
        offset.z * 6.5 * this._crowdPhysicsProfile.shoveResponse,
      ),
    );
  }

  heal(amount: number): void {
    if (this._isDead || amount <= 0) return;
    this._currentHealth = Math.min(this._maxHealth, this._currentHealth + amount);
  }

  applySlow(multiplier: number, durationSeconds: number, now: number): void {
    if (this._isDead) return;
    this._slowMultiplier = Math.min(this._slowMultiplier, Math.max(0.2, multiplier));
    this._slowUntil = Math.max(this._slowUntil, now + Math.max(0.1, durationSeconds));
  }

  update(dt: number, now: number): void {
    // Animate
    this.animator.update(dt);
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
    if (now >= this._slowUntil) {
      this._slowMultiplier = 1;
    }
    const physicsState = this.physicsState;

    // ── Physics: gravity + velocity for knockback ──
    if (!this._grounded || this._velocity.lengthSquared() > 0.001) {
      // Gravity
      this._velocity.y -= 22 * dt;

      // Apply velocity
      pos.addInPlace(this._velocity.scale(dt));

      // Ground collision
      if (pos.y <= 0) {
        pos.y = 0;
        if (this._velocity.y < -1) {
          // Bounce slightly
          this._velocity.y *= -0.25;
        } else {
          this._velocity.y = 0;
          this._grounded = true;
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
      resolveObstacleCollisions(pos, this.definition.collisionRadius, RuntimeUnit.obstacles);
    }

    // ── Stagger: skip movement while staggered ──
    if (this._staggerTimer > 0) {
      this._staggerTimer -= dt;
      this._applyCrowdLean(dt);
      this._updateHealthBar();
      return;
    }

    if (physicsState === "toppled" || physicsState === "airborne") {
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
        const recoveryMoveMultiplier = physicsState === "recovering" ? 0.55 : 1;
        const appliedDistance = Math.min(this.definition.moveSpeed * this._slowMultiplier * recoveryMoveMultiplier * dt, Math.sqrt(distSq));
        pos.addInPlace(dir.scale(appliedDistance));
        this._movementVelocity.copyFrom(dir.scale(appliedDistance / Math.max(dt, 0.0001)));

        // Face movement direction
        if (this._spinning) {
          this.body.root.rotation.y += dt * 20;
        } else {
          const angle = Math.atan2(dir.x, dir.z);
          this.body.root.rotation.y = angle;
        }

        // Resolve obstacle collisions after movement step
        resolveObstacleCollisions(pos, this.definition.collisionRadius, RuntimeUnit.obstacles);
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
    // Always pop upward so bodies visibly fly
    launchDir.y = Math.max(launchDir.y, impulse.length() * deathMult * massInv * 0.6);
    // Add any existing knockback velocity
    this._velocity.addInPlace(launchDir);

    // Random spin on death
    this._deathSpinX = (Math.random() - 0.3) * 6 * massInv;
    this._deathSpinY = (Math.random() - 0.5) * 4 * massInv;

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
      }
    } else {
      // Air drag (very light)
      this._velocity.x *= (1 - 0.5 * dt);
      this._velocity.z *= (1 - 0.5 * dt);
    }

    // Settle
    if (pos.y <= 0.01 && this._velocity.lengthSquared() < 0.02) {
      this._physicsActive = false;
      this._velocity.setAll(0);
    }
  }

  private _applyCrowdLean(dt: number): void {
    const horizontalSpeed = this.horizontalSpeed;
    if (this.physicsState === "toppled") {
      const settle = Math.min(1, dt * 12);
      this.body.root.rotation.x += (-1.05 - this.body.root.rotation.x) * settle;
      this.body.root.rotation.z += ((this._velocity.x * 0.04) - this.body.root.rotation.z) * settle;
      return;
    }
    const targetLeanX = Math.max(
      -0.28,
      Math.min(
        0.28,
        (-this._velocity.z * 0.025 - this._crowdPressure * 0.08) * this._crowdPhysicsProfile.leanResponse,
      ),
    );
    const targetLeanZ = Math.max(
      -0.32,
      Math.min(
        0.32,
        (this._velocity.x * 0.03) * this._crowdPhysicsProfile.leanResponse,
      ),
    );
    const settle = Math.min(1, dt * (8 + this._crowdPhysicsProfile.recoveryRate * 2 + horizontalSpeed));
    this.body.root.rotation.x += (targetLeanX - this.body.root.rotation.x) * settle;
    this.body.root.rotation.z += (targetLeanZ - this.body.root.rotation.z) * settle;
  }

  hasCapability(channel: LinkedContributionChannel, now = RuntimeUnit.timeNowSeconds()): boolean {
    if (!this.hasContribution(channel)) return false;
    if (this._isDead) return false;
    if (now < this._toppledUntil) return false;
    if (!this._grounded || this.position.y > 0.04) return false;
    if (channel === "attack" && now < this._recoveringUntil) return false;
    return true;
  }

  getPhysicsDisabledChannels(now = RuntimeUnit.timeNowSeconds()): LinkedContributionChannel[] {
    const disabled: LinkedContributionChannel[] = [];
    if (!this.hasCapability("move", now)) disabled.push("move");
    if (!this.hasCapability("attack", now)) disabled.push("attack");
    return disabled;
  }

  private _updateCrowdPhysicsState(pressure: number, impulse: Vector3): void {
    if (this._isDead || this._isAnchoredActor) return;
    const now = RuntimeUnit.timeNowSeconds();
    if (pressure >= this._crowdPhysicsProfile.launchThreshold) {
      this._toppledUntil = Math.max(this._toppledUntil, now + this._crowdPhysicsProfile.toppleSeconds);
      this._recoveringUntil = Math.max(this._recoveringUntil, this._toppledUntil + this._crowdPhysicsProfile.recoverySeconds);
      this._grounded = false;
      this._velocity.y = Math.max(this._velocity.y, 0.85 + pressure * 1.2);
      this._staggerTimer = Math.max(this._staggerTimer, this._crowdPhysicsProfile.toppleSeconds * 0.45);
      this.stopMoving();
      return;
    }
    if (pressure >= this._crowdPhysicsProfile.toppleThreshold) {
      this._toppledUntil = Math.max(this._toppledUntil, now + this._crowdPhysicsProfile.toppleSeconds);
      this._recoveringUntil = Math.max(this._recoveringUntil, this._toppledUntil + this._crowdPhysicsProfile.recoverySeconds);
      this._velocity.y = Math.max(this._velocity.y, 0.35 + pressure * 0.45);
      this._grounded = false;
      this._staggerTimer = Math.max(this._staggerTimer, this._crowdPhysicsProfile.toppleSeconds * 0.35);
      this.stopMoving();
      if (impulse.lengthSquared() > 0.01) {
        this.animator.triggerFlinch();
      }
    }
  }

  private _updateHealthBar(): void {
    if (!this.healthBarMesh || !this.healthBarBg) return;
    if (this._isAnchoredActor) {
      this.healthBarMesh.isVisible = false;
      this.healthBarBg.isVisible = false;
      return;
    }
    const ratio = this._currentHealth / Math.max(1, this._maxHealth);
    this.healthBarMesh.scaling.x = Math.max(0.01, ratio);
    this.healthBarMesh.position.x = -(1 - ratio) * 0.5 * 0.5;
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

  private _applyFxPreset(fxPreset: FxPreset, isAttacking: boolean, now: number): void {
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
      this.body.skinMaterial.emissiveColor.set(0, 0, 0);
      return;
    }

    this.body.bodyMaterial.emissiveColor = color.scale(pulse);
    this.body.skinMaterial.emissiveColor = color.scale(pulse * 0.25);
  }

  /** Reset unit to its original spawn state (position, health, alive). */
  resetToSpawn(): void {
    this._isDead = false;
    this._maxHealth = this.definition.maxHealth;
    this._currentHealth = this._maxHealth;
    this._moveTarget = null;
    this._isMoving = false;
    this._velocity.setAll(0);
    this._movementVelocity.setAll(0);
    this._grounded = true;
    this._staggerTimer = 0;
    this._crowdPressure = 0;
    this._toppledUntil = 0;
    this._recoveringUntil = 0;
    this._collisionPushTotal = 0;
    this._collisionPushPeak = 0;
    this._collisionContactCount = 0;
    this._spinning = false;
    this._slowMultiplier = 1;
    this._slowUntil = 0;
    this._physicsActive = false;
    this._bounceCount = 0;
    this._deathSpinX = 0;
    this._deathSpinY = 0;
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
      this._fxParticleSystem.dispose();
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
    const emitter = this.getAttackEmitter();
    return {
      position: emitter._resolveCustomOrigin(emitter._smokeOriginOffset ?? emitter._attackOriginOffset),
      source: emitter === this ? "parent" : "linked-role",
      emitter,
    };
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

  triggerAttackVisual(durationSeconds: number): void {
    let motion: "strike" | "reload" | "crank" | "brace" | "carry" | "breath" = "strike";
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
}
