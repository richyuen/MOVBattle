import { Vector3 } from "@babylonjs/core";
import { RuntimeUnit } from "../units/runtimeUnit";
import {
  AttackType, TargetPriority,
  getAttackProfile, getAIProfile,
  type AttackProfile, type AIProfile,
} from "../data/combatProfiles";
import { ProjectileSystem, type ProjectileShape } from "./projectileSystem";
import { VisualEffects } from "./visualEffects";

/** Map projectileId / attackProfileId to a visible projectile shape. */
function resolveProjectileShape(profile: AttackProfile): ProjectileShape | null {
  const pid = profile.projectileId ?? "";
  switch (pid) {
    case "projectile.arrow": return "arrow";
    case "projectile.bolt": return "bolt";
    case "projectile.bomb": return "bomb";
    case "projectile.stone": return "stone";
    default: break;
  }
  // Fallback by attack type
  if (profile.type === AttackType.Ranged) return "arrow";
  if (profile.type === AttackType.Siege) return "stone";
  return null;
}

/** Is this a firearm that should produce muzzle flash instead of a visible projectile? */
function isFirearm(attackProfileId: string): boolean {
  // Firearms: flintlock, blunderbuss, musketeer, cannon_hand all use ranged.heavy or ranged.light
  // We detect by unit attack profile + projectile combo
  return false; // handled per-unit below
}

const FIREARM_UNIT_PREFIXES = [
  "pirate.flintlock", "pirate.blunderbuss", "pirate.cannon",
  "renaissance.musketeer", "renaissance.da_vinci_tank",
];

function isFirearmUnit(unitId: string): boolean {
  return FIREARM_UNIT_PREFIXES.some((p) => unitId === p);
}

/** Firework archer gets a special projectile */
function isFireworkUnit(unitId: string): boolean {
  return unitId === "dynasty.firework_archer";
}

function isZeusUnit(unitId: string): boolean {
  return unitId === "ancient.zeus";
}

function isNinjaUnit(unitId: string): boolean {
  return unitId === "dynasty.ninja";
}

function isBerserkerUnit(unitId: string): boolean {
  return unitId === "viking.berserker";
}

export class SimulationSystem {
  private _units: RuntimeUnit[] = [];
  private _nextDecisionAt = new Map<RuntimeUnit, number>();
  private _isRunning = false;
  private _battleStartedAt = 0;
  private _lastBattleDuration = 0;
  private _nextCleanupSweepAt = 0;

  /** External projectile system -- set by main.ts */
  projectileSystem: ProjectileSystem | null = null;
  /** External visual effects system -- set by main.ts */
  visualEffects: VisualEffects | null = null;

  readonly minimumDecisionInterval = 0.08;
  readonly attackRangePadding = 0.2;
  readonly cleanupSweepInterval = 0.75;

  get isRunning(): boolean { return this._isRunning; }

  get battleDuration(): number {
    if (this._isRunning) return performance.now() / 1000 - this._battleStartedAt;
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

  beginSimulation(): void {
    this._isRunning = true;
    const now = performance.now() / 1000;
    this._battleStartedAt = now;
    this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    this._lastBattleDuration = 0;
  }

  endSimulation(): void {
    if (this._isRunning) {
      this._lastBattleDuration = performance.now() / 1000 - this._battleStartedAt;
    }
    this._isRunning = false;
    for (const unit of this._units) {
      unit.stopMoving();
    }
  }

  update(dt: number): void {
    if (!this._isRunning) return;

    const now = performance.now() / 1000;

    // Update all unit positions
    for (const unit of this._units) {
      unit.update(dt, now);
    }

    // AI decisions
    for (const unit of this._units) {
      if (unit.isDead) continue;

      const nextDecision = this._nextDecisionAt.get(unit) ?? 0;
      if (now < nextDecision) continue;

      const aiProfile = getAIProfile(unit.definition.aiProfileId);
      this._processUnitDecision(unit, aiProfile, now);
      this._nextDecisionAt.set(unit, now + Math.max(this.minimumDecisionInterval, aiProfile.retargetInterval));
    }

    // Cleanup corpses
    if (now >= this._nextCleanupSweepAt) {
      this._cleanupExpiredCorpses(now);
      this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    }
  }

  getLivingCount(team: number): number {
    let count = 0;
    for (const unit of this._units) {
      if (!unit.isDead && unit.team === team) count++;
    }
    return count;
  }

  private _processUnitDecision(unit: RuntimeUnit, aiProfile: AIProfile, now: number): void {
    const attackProfile = getAttackProfile(unit.definition.attackProfileId);

    if (attackProfile.type === AttackType.Support) {
      const ally = this._selectAllyToSupport(unit, aiProfile);
      if (!ally) return;
      this._handleSupportAction(unit, ally, attackProfile, now);
      return;
    }

    const enemy = this._selectEnemyTarget(unit, aiProfile);
    if (!enemy) {
      unit.stopMoving();
      return;
    }

    const engageDistance = unit.definition.engageRange + this.attackRangePadding;
    const distance = Vector3.Distance(unit.position, enemy.position);

    // ─── Ninja: teleport toward enemy when far, throw shuriken when close ───
    if (isNinjaUnit(unit.definition.id)) {
      if (distance > engageDistance && distance < engageDistance * 3 && unit.canAttack(now)) {
        // Teleport: smoke at origin, blink closer, smoke at destination
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(unit.position);
        }
        const dir = enemy.position.subtract(unit.position).normalize();
        const teleportDist = Math.min(distance - engageDistance * 0.5, 8);
        const newPos = unit.position.add(dir.scale(teleportDist));
        newPos.y = 0;
        unit.teleportTo(newPos);
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(newPos);
        }
        unit.setAttackCooldown(now, attackProfile.cooldown * 0.5);
        return;
      }
    }

    // ─── Berserker: spin while moving ───
    if (isBerserkerUnit(unit.definition.id) && distance > engageDistance) {
      unit.moveTo(enemy.position);
      unit.setSpinning(true);
      // Spawn tornado dust periodically
      if (this.visualEffects && Math.random() < 0.4) {
        this.visualEffects.spawnTornadoDust(unit.position);
      }
      return;
    }
    if (isBerserkerUnit(unit.definition.id)) {
      unit.setSpinning(false);
    }

    if (distance <= engageDistance) {
      unit.stopMoving();
      this._tryAttack(unit, enemy, attackProfile, now);
    } else {
      unit.moveTo(enemy.position);
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
    if (!supporter.canAttack(now)) return;

    supporter.setAttackCooldown(now, attackProfile.cooldown);
    const healAmount = Math.max(20, attackProfile.damage);
    ally.heal(healAmount);
  }

  private _tryAttack(
    attacker: RuntimeUnit, target: RuntimeUnit,
    attackProfile: AttackProfile, now: number,
  ): void {
    if (!attacker.canAttack(now)) return;

    attacker.setAttackCooldown(now, attackProfile.cooldown);

    let impulseDir = target.position.subtract(attacker.position);
    if (impulseDir.lengthSquared() > 0.0001) {
      impulseDir.normalize();
    } else {
      impulseDir = Vector3.Up();
    }

    const knockback = impulseDir.scale(attackProfile.knockback);

    // ─── Zeus: lightning bolt ───
    if (isZeusUnit(attacker.definition.id)) {
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attacker.position, target.position);
      }
      // Instant damage + heavy knockback
      if (attackProfile.splashRadius > 0) {
        this._applySplashDamage(target.position, attackProfile.splashRadius, attacker.team, attackProfile.damage, knockback.scale(1.5));
      } else {
        target.applyDamage(attackProfile.damage, knockback.scale(1.5));
      }
      return;
    }

    // ─── Ninja: throw shuriken ───
    if (isNinjaUnit(attacker.definition.id)) {
      if (this.projectileSystem) {
        this.projectileSystem.spawnProjectile(
          "shuriken",
          attacker.position,
          target,
          attackProfile.damage,
          knockback,
          0,
          attacker.team,
          this._units,
        );
      } else {
        target.applyDamage(attackProfile.damage, knockback);
      }
      return;
    }

    // ─── Ranged / Siege: spawn projectile ───
    if (attackProfile.type === AttackType.Ranged || attackProfile.type === AttackType.Siege) {
      if (this.projectileSystem) {
        if (isFirearmUnit(attacker.definition.id)) {
          // Guns: muzzle flash + instant hit (bullets are too fast to see)
          this.projectileSystem.spawnMuzzleFlash(attacker.position, impulseDir);
          if (attackProfile.splashRadius > 0) {
            this._applySplashDamage(target.position, attackProfile.splashRadius, attacker.team, attackProfile.damage, knockback);
          } else {
            target.applyDamage(attackProfile.damage, knockback);
          }
        } else {
          // Visible projectile
          let shape = resolveProjectileShape(attackProfile);
          if (isFireworkUnit(attacker.definition.id)) shape = "firework";
          // Javelin/spear throwers
          if (attacker.definition.id.includes("spear") || attacker.definition.id.includes("harpooner")) {
            shape = "spear";
          }

          this.projectileSystem.spawnProjectile(
            shape ?? "arrow",
            attacker.position,
            target,
            attackProfile.damage,
            knockback,
            attackProfile.splashRadius,
            attacker.team,
            this._units,
          );
        }
      } else {
        // Fallback: instant damage if no projectile system
        this._applyDirectOrSplash(target, attackProfile, attacker.team, knockback);
      }
      return;
    }

    // ─── Melee: instant damage ───
    this._applyDirectOrSplash(target, attackProfile, attacker.team, knockback);
  }

  private _applyDirectOrSplash(
    target: RuntimeUnit, attackProfile: AttackProfile,
    attackerTeam: number, knockback: Vector3,
  ): void {
    if (attackProfile.splashRadius > 0) {
      this._applySplashDamage(target.position, attackProfile.splashRadius, attackerTeam, attackProfile.damage, knockback);
    } else {
      target.applyDamage(attackProfile.damage, knockback);
    }
  }

  private _applySplashDamage(
    center: Vector3, radius: number, attackerTeam: number,
    damage: number, impulse: Vector3,
  ): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam) continue;
      if (unit.position.subtract(center).lengthSquared() > radiusSq) continue;
      unit.applyDamage(damage, impulse);
    }
  }

  private _selectEnemyTarget(requester: RuntimeUnit, aiProfile: AIProfile): RuntimeUnit | null {
    let best: RuntimeUnit | null = null;
    let bestScore = Infinity;

    for (const candidate of this._units) {
      if (candidate.isDead || candidate.team === requester.team) continue;

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
      if (candidate.isDead || candidate.team !== requester.team || candidate === requester) continue;
      if (candidate.currentHealth >= candidate.definition.maxHealth) continue;

      const score = this._scoreCandidate(requester, candidate, aiProfile.targetPriority);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  private _scoreCandidate(requester: RuntimeUnit, candidate: RuntimeUnit, priority: TargetPriority): number {
    switch (priority) {
      case TargetPriority.LowestHealth:
        return candidate.currentHealth;
      case TargetPriority.HighestCost:
        return -candidate.definition.cost;
      default: // Nearest
        return candidate.position.subtract(requester.position).lengthSquared();
    }
  }

  private _cleanupExpiredCorpses(now: number): void {
    for (let i = this._units.length - 1; i >= 0; i--) {
      const unit = this._units[i];
      if (!unit.isDead || now < unit.deathCleanupAt) continue;

      this._nextDecisionAt.delete(unit);
      this._units.splice(i, 1);
      unit.dispose();
    }
  }
}
