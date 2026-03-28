export enum AttackType {
  Melee,
  Ranged,
  Siege,
  Support,
}

export enum TargetPriority {
  Nearest,
  LowestHealth,
  HighestCost,
}

export interface AttackProfile {
  id: string;
  type: AttackType;
  damage: number;
  cooldown: number;
  windup: number;
  knockback: number;
  splashRadius: number;
  projectileId?: string;
}

export interface AIProfile {
  id: string;
  targetPriority: TargetPriority;
  retargetInterval: number;
  aggression: number;
  formationBias: number;
  prefersRangedDistance: boolean;
}

export interface RagdollProfile {
  id: string;
  impactMultiplier: number;
  deathImpulseMultiplier: number;
  cleanupDelaySeconds: number;
}

export const ATTACK_PROFILES: AttackProfile[] = [
  { id: "melee.light", type: AttackType.Melee, damage: 22, cooldown: 1.0, windup: 0.15, knockback: 2.5, splashRadius: 0 },
  { id: "melee.medium", type: AttackType.Melee, damage: 35, cooldown: 1.3, windup: 0.2, knockback: 4, splashRadius: 0 },
  { id: "melee.heavy", type: AttackType.Melee, damage: 55, cooldown: 1.8, windup: 0.3, knockback: 6, splashRadius: 0.5 },
  { id: "ranged.light", type: AttackType.Ranged, damage: 24, cooldown: 1.1, windup: 0.2, knockback: 1.5, splashRadius: 0, projectileId: "projectile.arrow" },
  { id: "ranged.heavy", type: AttackType.Ranged, damage: 45, cooldown: 1.8, windup: 0.35, knockback: 3.5, splashRadius: 0, projectileId: "projectile.bolt" },
  { id: "throw.explosive", type: AttackType.Siege, damage: 60, cooldown: 2.2, windup: 0.45, knockback: 7, splashRadius: 2.2, projectileId: "projectile.bomb" },
  { id: "siege.catapult", type: AttackType.Siege, damage: 85, cooldown: 3.0, windup: 0.6, knockback: 9, splashRadius: 3, projectileId: "projectile.stone" },
  { id: "support.heal", type: AttackType.Support, damage: 0, cooldown: 2.0, windup: 0.2, knockback: 0, splashRadius: 0 },
  { id: "boss.legendary", type: AttackType.Melee, damage: 95, cooldown: 2.3, windup: 0.5, knockback: 11, splashRadius: 2 },
];

export const AI_PROFILES: AIProfile[] = [
  { id: "ai.rush", targetPriority: TargetPriority.Nearest, retargetInterval: 0.2, aggression: 1.1, formationBias: 0.1, prefersRangedDistance: false },
  { id: "ai.brace", targetPriority: TargetPriority.Nearest, retargetInterval: 0.25, aggression: 0.9, formationBias: 0.55, prefersRangedDistance: false },
  { id: "ai.ranged", targetPriority: TargetPriority.LowestHealth, retargetInterval: 0.18, aggression: 1, formationBias: 0.2, prefersRangedDistance: true },
  { id: "ai.boss", targetPriority: TargetPriority.HighestCost, retargetInterval: 0.15, aggression: 1.4, formationBias: 0, prefersRangedDistance: false },
  { id: "ai.support", targetPriority: TargetPriority.LowestHealth, retargetInterval: 0.2, aggression: 0.7, formationBias: 0.35, prefersRangedDistance: true },
];

export const RAGDOLL_PROFILES: RagdollProfile[] = [
  { id: "ragdoll.light", impactMultiplier: 1.2, deathImpulseMultiplier: 1.4, cleanupDelaySeconds: 5 },
  { id: "ragdoll.medium", impactMultiplier: 1.0, deathImpulseMultiplier: 1.2, cleanupDelaySeconds: 6 },
  { id: "ragdoll.heavy", impactMultiplier: 0.7, deathImpulseMultiplier: 0.9, cleanupDelaySeconds: 7 },
  { id: "ragdoll.boss", impactMultiplier: 0.45, deathImpulseMultiplier: 0.7, cleanupDelaySeconds: 8 },
];

const attackMap = new Map(ATTACK_PROFILES.map((p) => [p.id, p]));
const aiMap = new Map(AI_PROFILES.map((p) => [p.id, p]));
const ragdollMap = new Map(RAGDOLL_PROFILES.map((p) => [p.id, p]));

export function getAttackProfile(id: string): AttackProfile {
  return attackMap.get(id) ?? ATTACK_PROFILES[0];
}

export function getAIProfile(id: string): AIProfile {
  return aiMap.get(id) ?? AI_PROFILES[0];
}

export function getRagdollProfile(id: string): RagdollProfile {
  return ragdollMap.get(id) ?? RAGDOLL_PROFILES[0];
}
