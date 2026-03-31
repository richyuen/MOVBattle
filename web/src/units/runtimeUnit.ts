import { Vector3, Mesh, MeshBuilder, StandardMaterial, Color3, Scene } from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import type { RagdollProfile } from "../data/combatProfiles";
import type { ArticulatedBody } from "./bodyBuilder";
import { ProceduralAnimator, AnimState } from "./proceduralAnimation";
import { resolveObstacleCollisions, type Obstacle } from "../map/obstacles";
import type { FxPreset, UnitVisualConfig, VisualStateTag } from "./unitVisuals";
import type { LinkedDamageRouting } from "./linkedActorPresets";

export type RuntimeSpawnRole = "placed" | "summoned" | "crew" | "mount" | "attachment";
export type LinkedRelation = "crew" | "mount" | "attachment" | "spawned-child";

export interface LinkedEntityDescriptor {
  relation: LinkedRelation;
  label: string;
  persistent: boolean;
  runtimeUnitId?: number;
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
  private _currentHealth: number;
  private _isDead = false;
  private _nextAttackAt = 0;
  private _deathCleanupAt = Infinity;
  private _deathTime = 0;

  // Movement
  private _moveTarget: Vector3 | null = null;
  private _isMoving = false;

  // Physics velocity (used for knockback while alive AND death slide)
  private _velocity = Vector3.Zero();
  private _grounded = true;

  // Death physics
  private _deathImpulse = Vector3.Zero();
  private _physicsActive = false;

  // Hit stagger
  private _staggerTimer = 0;

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
  private _primaryEmitterEnabled = true;
  private _emitterCursor = 0;

  /** Shared obstacle list — set once from main.ts after map build */
  static obstacles: readonly Obstacle[] = [];

  // Health bar
  healthBarMesh: Mesh | null = null;
  healthBarBg: Mesh | null = null;

  get currentHealth(): number { return this._currentHealth; }
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

  constructor(
    definition: UnitDefinition,
    team: number,
    body: ArticulatedBody,
    propMeshes: Mesh[],
    visualConfig: UnitVisualConfig,
    ragdollProfile: RagdollProfile,
  ) {
    this.runtimeId = RuntimeUnit._nextRuntimeId++;
    this.definition = definition;
    this.team = team;
    this.body = body;
    this.propMeshes = propMeshes;
    this.visualConfig = visualConfig;
    this._ragdollProfile = ragdollProfile;
    this._currentHealth = definition.maxHealth;
    this.animator = new ProceduralAnimator(body);
    this._spawnPosition = body.root.position.clone();
    this._spawnRotationY = body.root.rotation.y;
  }

  canAttack(now: number): boolean {
    return !this._isDead && now >= this._nextAttackAt;
  }

  setSpawnRole(role: RuntimeSpawnRole, countsTowardVictory = true): void {
    this._spawnRole = role;
    this._countsTowardVictory = countsTowardVictory;
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
  }): void {
    this._isAnchoredActor = true;
    this._linkedRoleLabel = options.roleLabel;
    this._linkedParentRoleLabel = options.parentRoleLabel ?? null;
    this._anchoredOffset = options.offset.clone();
    this._syncLinkedFacing = options.syncFacing ?? true;
    this._isTargetable = options.targetable;
    this._isCombatEmitter = options.combatEmitter;
    this._damageRouting = options.damageRouting;
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

    // Flinch: tilt body toward impact
    this.animator.triggerFlinch();
  }

  heal(amount: number): void {
    if (this._isDead || amount <= 0) return;
    this._currentHealth = Math.min(this.definition.maxHealth, this._currentHealth + amount);
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

    if (this._linkedParent && this._isAnchoredActor) {
      this._updateAnchoredActor(now);
      return;
    }

    if (this._isDead) {
      this._updateDead(dt, now);
      return;
    }

    const pos = this.body.root.position;
    if (now >= this._slowUntil) {
      this._slowMultiplier = 1;
    }

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
        const step = this.definition.moveSpeed * this._slowMultiplier * dt;
        pos.addInPlace(dir.scale(Math.min(step, Math.sqrt(distSq))));

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

    this._updateHealthBar();
  }

  private _updateAnchoredActor(now: number): void {
    const parent = this._linkedParent;
    if (!parent) return;

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

    if (parent.animator.state === AnimState.Walking) {
      this.animator.setState(AnimState.Walking);
    } else if (this.animator.state !== AnimState.Attacking) {
      this.animator.setState(AnimState.Idle);
    }

    this.setHealthBarVisible(false);
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

  private _updateHealthBar(): void {
    if (!this.healthBarMesh || !this.healthBarBg) return;
    if (this._isAnchoredActor && !this._isTargetable) {
      this.healthBarMesh.isVisible = false;
      this.healthBarBg.isVisible = false;
      return;
    }
    const ratio = this._currentHealth / this.definition.maxHealth;
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
    this._currentHealth = this.definition.maxHealth;
    this._moveTarget = null;
    this._isMoving = false;
    this._velocity.setAll(0);
    this._grounded = true;
    this._staggerTimer = 0;
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
    this._primaryEmitterEnabled = true;
    this._emitterCursor = 0;
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

  triggerAttackVisual(durationSeconds: number): void {
    this.animator.triggerAttack(durationSeconds);
  }
}
