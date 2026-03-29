import { Vector3, Mesh, MeshBuilder, StandardMaterial, Color3, Scene } from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import type { RagdollProfile } from "../data/combatProfiles";
import type { ArticulatedBody } from "./bodyBuilder";
import { ProceduralAnimator, AnimState } from "./proceduralAnimation";
import { resolveObstacleCollisions, type Obstacle } from "../map/obstacles";

export class RuntimeUnit {
  readonly definition: UnitDefinition;
  readonly team: number;
  readonly body: ArticulatedBody;
  readonly animator: ProceduralAnimator;
  readonly propMeshes: Mesh[];

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

  // Spawn state for reset
  private _spawnPosition: Vector3;

  /** Shared obstacle list — set once from main.ts after map build */
  static obstacles: readonly Obstacle[] = [];

  // Health bar
  healthBarMesh: Mesh | null = null;
  healthBarBg: Mesh | null = null;

  get currentHealth(): number { return this._currentHealth; }
  get isDead(): boolean { return this._isDead; }
  get deathCleanupAt(): number { return this._deathCleanupAt; }
  get position(): Vector3 { return this.body.root.position; }

  constructor(
    definition: UnitDefinition,
    team: number,
    body: ArticulatedBody,
    propMeshes: Mesh[],
    ragdollProfile: RagdollProfile,
  ) {
    this.definition = definition;
    this.team = team;
    this.body = body;
    this.propMeshes = propMeshes;
    this._ragdollProfile = ragdollProfile;
    this._currentHealth = definition.maxHealth;
    this.animator = new ProceduralAnimator(body);
    this._spawnPosition = body.root.position.clone();
  }

  canAttack(now: number): boolean {
    return !this._isDead && now >= this._nextAttackAt;
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

  update(dt: number, now: number): void {
    // Animate
    this.animator.update(dt);

    if (this._isDead) {
      this._updateDead(dt, now);
      return;
    }

    const pos = this.body.root.position;

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
        const step = this.definition.moveSpeed * dt;
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

  private _die(impulse: Vector3): void {
    this._isDead = true;
    this._currentHealth = 0;
    this._moveTarget = null;
    this._isMoving = false;
    this._deathTime = performance.now() / 1000;
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
    const ratio = this._currentHealth / this.definition.maxHealth;
    this.healthBarMesh.scaling.x = Math.max(0.01, ratio);
    this.healthBarMesh.position.x = -(1 - ratio) * 0.5 * 0.5;
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
    this._physicsActive = false;
    this._bounceCount = 0;
    this._deathSpinX = 0;
    this._deathSpinY = 0;
    this._nextAttackAt = 0;

    // Restore position and clear rotation
    this.body.root.position.copyFrom(this._spawnPosition);
    this.body.root.rotation.set(0, 0, 0);

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
}
