import { Color3, Vector3 } from "@babylonjs/core";
import type { RuntimeUnit, BattleFeelState } from "../units/runtimeUnit";
import type { VisualEffects } from "./visualEffects";

export type ImpactTier = "none" | "light" | "medium" | "heavy" | "crowdShock" | "topple" | "downed" | "death";
export type ImpactPath =
  | "direct"
  | "splash-primary"
  | "splash-secondary"
  | "projectile-direct"
  | "projectile-splash"
  | "crowd-shock"
  | "harness-damage";
export type ImpactSource = "simulation" | "projectile" | "scenario-harness";

export const IMPACT_TIER_RANK: Record<ImpactTier, number> = {
  none: 0,
  light: 1,
  medium: 2,
  heavy: 3,
  crowdShock: 4,
  topple: 5,
  downed: 6,
  death: 7,
};

export const IMPACT_PATHS: readonly ImpactPath[] = [
  "direct",
  "splash-primary",
  "splash-secondary",
  "projectile-direct",
  "projectile-splash",
  "crowd-shock",
  "harness-damage",
];

export interface ImpactDelta {
  targetRuntimeId: number;
  targetUnitId: string;
  damageApplied: number;
  healthBefore: number;
  healthAfter: number;
  wasDead: boolean;
  isDead: boolean;
  stateBefore: BattleFeelState;
  stateAfter: BattleFeelState;
  impulseMagnitude: number;
  killed: boolean;
  toppled: boolean;
  downed: boolean;
  staggered: boolean;
}

export interface CrowdImpactMetrics {
  pressure: number;
  displacementMagnitude: number;
  impulseMagnitude?: number;
}

export interface ImpactEventInput {
  source: ImpactSource;
  path: ImpactPath;
  position: Vector3;
  target?: RuntimeUnit;
  impactDelta?: ImpactDelta | null;
  crowdMetrics?: CrowdImpactMetrics;
  damage?: number;
  impulse?: Vector3;
  radius?: number;
  falloff?: number;
  attackerTeam?: number;
}

export interface ImpactUnitDebug {
  id: string;
  runtimeId: number;
  lastImpactTier: ImpactTier;
  peakImpactTier: ImpactTier;
  impactEventCount: number;
  lastImpactPath: ImpactPath | null;
  peakByPath: Partial<Record<ImpactPath, ImpactTier>>;
  countsByPath: Partial<Record<ImpactPath, number>>;
}

export interface ImpactDebugSnapshot {
  lastTier: ImpactTier;
  peakTier: ImpactTier;
  eventCount: number;
  countsByTier: Partial<Record<ImpactTier, number>>;
  countsByPath: Partial<Record<ImpactPath, number>>;
  peakShake: number;
  lastPath: ImpactPath | null;
  units: ImpactUnitDebug[];
}

function maxTier(a: ImpactTier, b: ImpactTier): ImpactTier {
  return IMPACT_TIER_RANK[b] > IMPACT_TIER_RANK[a] ? b : a;
}

function emptyTierCounts(): Partial<Record<ImpactTier, number>> {
  return {};
}

function emptyPathCounts(): Partial<Record<ImpactPath, number>> {
  return {};
}

export class ImpactPresentation {
  visualEffects: VisualEffects | null = null;
  onShake: ((intensity: number) => void) | null = null;

  private _lastTier: ImpactTier = "none";
  private _peakTier: ImpactTier = "none";
  private _eventCount = 0;
  private _countsByTier = emptyTierCounts();
  private _countsByPath = emptyPathCounts();
  private _peakShake = 0;
  private _lastPath: ImpactPath | null = null;
  private _unitDebug = new Map<number, ImpactUnitDebug>();
  private _shakeCooldownUntil = 0;

  reset(): void {
    this._lastTier = "none";
    this._peakTier = "none";
    this._eventCount = 0;
    this._countsByTier = emptyTierCounts();
    this._countsByPath = emptyPathCounts();
    this._peakShake = 0;
    this._lastPath = null;
    this._unitDebug.clear();
    this._shakeCooldownUntil = 0;
  }

  recordImpact(event: ImpactEventInput): ImpactTier {
    const tier = this._classify(event);
    if (tier === "none") return tier;

    this._eventCount += 1;
    this._lastTier = tier;
    this._peakTier = maxTier(this._peakTier, tier);
    this._lastPath = event.path;
    this._countsByTier[tier] = (this._countsByTier[tier] ?? 0) + 1;
    this._countsByPath[event.path] = (this._countsByPath[event.path] ?? 0) + 1;

    const target = event.target;
    if (target) {
      const existing = this._unitDebug.get(target.runtimeId) ?? {
        id: target.definition.id,
        runtimeId: target.runtimeId,
        lastImpactTier: "none" as ImpactTier,
        peakImpactTier: "none" as ImpactTier,
        impactEventCount: 0,
        lastImpactPath: null,
        peakByPath: {},
        countsByPath: {},
      };
      existing.lastImpactTier = tier;
      existing.peakImpactTier = maxTier(existing.peakImpactTier, tier);
      existing.impactEventCount += 1;
      existing.lastImpactPath = event.path;
      existing.peakByPath[event.path] = maxTier(existing.peakByPath[event.path] ?? "none", tier);
      existing.countsByPath[event.path] = (existing.countsByPath[event.path] ?? 0) + 1;
      this._unitDebug.set(target.runtimeId, existing);
    }

    this._present(event, tier);
    return tier;
  }

  presentExplosion(position: Vector3, scale = 1): void {
    if (!this.visualEffects) return;
    this.visualEffects.spawnExplosionBurst(position, scale);
    this.visualEffects.spawnGroundScorch(position);
    this._shake(0.075 * scale);
  }

  getUnitDebug(unit: RuntimeUnit): ImpactUnitDebug | null {
    return this._unitDebug.get(unit.runtimeId) ?? null;
  }

  getDebugSnapshot(): ImpactDebugSnapshot {
    return {
      lastTier: this._lastTier,
      peakTier: this._peakTier,
      eventCount: this._eventCount,
      countsByTier: { ...this._countsByTier },
      countsByPath: { ...this._countsByPath },
      peakShake: Number(this._peakShake.toFixed(3)),
      lastPath: this._lastPath,
      units: [...this._unitDebug.values()].map((entry) => ({
        ...entry,
        peakByPath: { ...entry.peakByPath },
        countsByPath: { ...entry.countsByPath },
      })),
    };
  }

  private _classify(event: ImpactEventInput): ImpactTier {
    const delta = event.impactDelta ?? null;
    if (delta?.killed || delta?.isDead) return "death";
    if (delta?.downed || delta?.stateAfter === "downed") return "downed";
    if (delta?.toppled || delta?.stateAfter === "toppled") return "topple";

    const crowdPressure = event.crowdMetrics?.pressure ?? 0;
    const crowdDisplacement = event.crowdMetrics?.displacementMagnitude ?? 0;
    if (event.path === "crowd-shock" && (crowdPressure > 0 || crowdDisplacement > 0)) {
      return "crowdShock";
    }

    const magnitude = Math.max(
      delta?.impulseMagnitude ?? 0,
      event.impulse?.length() ?? 0,
      event.crowdMetrics?.impulseMagnitude ?? 0,
    );
    const damage = Math.max(delta?.damageApplied ?? 0, event.damage ?? 0);
    const radius = event.radius ?? 0;

    if (delta?.staggered || delta?.stateAfter === "staggered") {
      if (damage >= 60 || magnitude >= 6 || radius >= 1.5) return "heavy";
      return "medium";
    }
    if (damage >= 70 || magnitude >= 8 || radius >= 2) return "heavy";
    if (damage >= 24 || magnitude >= 2.5 || radius >= 1) return "medium";
    if (damage > 0 || magnitude > 0 || crowdPressure > 0) return "light";
    return "none";
  }

  private _present(event: ImpactEventInput, tier: ImpactTier): void {
    if (!this.visualEffects) return;
    // The blast draws its own fireball; a dust cloud per caught body would bury it in fog.
    if (event.path === "projectile-splash") return;
    const position = event.position;
    switch (tier) {
      case "light":
        this.visualEffects.spawnImpactDust(position, 0.65);
        break;
      case "medium":
        // Dust only: chunks are kept for heavy hits and deaths, so a long melee does not hang a curtain of them
        this.visualEffects.spawnImpactDust(position, 1);
        break;
      case "heavy":
        this.visualEffects.spawnImpactDust(position, 1.35);
        this.visualEffects.spawnHitDebris(position, 1.05);
        this.visualEffects.spawnHitSparks(position, 1.1);
        this._shake(0.055);
        break;
      case "crowdShock":
        this.visualEffects.spawnImpactDust(position, 1.2, new Color3(0.65, 0.58, 0.42));
        this._shake(0.045);
        break;
      case "topple":
      case "downed":
        this.visualEffects.spawnImpactDust(position, tier === "downed" ? 1.55 : 1.35);
        this.visualEffects.spawnHitSparks(position, 1.25);
        this._shake(tier === "downed" ? 0.08 : 0.065);
        break;
      case "death":
        this.visualEffects.spawnImpactDust(position, 1.75, new Color3(0.78, 0.68, 0.52));
        this.visualEffects.spawnHitDebris(position, 1.25);
        this.visualEffects.spawnHitSparks(position, 1.35);
        this._shake(0.095);
        break;
    }
  }

  private _shake(intensity: number): void {
    const now = performance.now() / 1000;
    this._peakShake = Math.max(this._peakShake, intensity);
    if (!this.onShake || now < this._shakeCooldownUntil) return;
    this._shakeCooldownUntil = now + 0.08;
    this.onShake(intensity);
  }
}
