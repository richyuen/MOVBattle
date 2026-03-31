import { FactionId } from "./factionColors";
import {
  ROSTER_MANIFEST,
  type AbilityKind,
  type RosterManifestEntry,
  type UnitArchetype,
  type UnitSize,
} from "./rosterManifest";

export interface UnitDefinition extends RosterManifestEntry {
  maxHealth: number;
  mass: number;
  moveSpeed: number;
  engageRange: number;
  collisionRadius: number;
  attackProfileId: string;
  aiProfileId: string;
  ragdollProfileId: string;
}

interface ArchetypeTemplate {
  attackProfileId: string;
  aiProfileId: string;
  ragdollProfileId: string;
  healthScale: number;
  healthBase: number;
  mass: number;
  moveSpeed: number;
  engageRange: number;
  collisionRadius: number;
}

const ARCHETYPES: Record<UnitArchetype, ArchetypeTemplate> = {
  tiny_melee: { attackProfileId: "melee.light", aiProfileId: "ai.rush", ragdollProfileId: "ragdoll.light", healthScale: 0.9, healthBase: 25, mass: 0.5, moveSpeed: 4.8, engageRange: 1.4, collisionRadius: 0.32 },
  light_melee: { attackProfileId: "melee.light", aiProfileId: "ai.rush", ragdollProfileId: "ragdoll.light", healthScale: 1.15, healthBase: 35, mass: 0.9, moveSpeed: 4.2, engageRange: 1.7, collisionRadius: 0.42 },
  shield_melee: { attackProfileId: "melee.medium", aiProfileId: "ai.brace", ragdollProfileId: "ragdoll.medium", healthScale: 1.45, healthBase: 50, mass: 1.15, moveSpeed: 3.8, engageRange: 1.9, collisionRadius: 0.48 },
  polearm_melee: { attackProfileId: "melee.medium", aiProfileId: "ai.brace", ragdollProfileId: "ragdoll.medium", healthScale: 1.3, healthBase: 40, mass: 1.1, moveSpeed: 3.9, engageRange: 2.5, collisionRadius: 0.46 },
  heavy_melee: { attackProfileId: "melee.heavy", aiProfileId: "ai.rush", ragdollProfileId: "ragdoll.medium", healthScale: 1.65, healthBase: 65, mass: 1.45, moveSpeed: 4.0, engageRange: 2.1, collisionRadius: 0.56 },
  boss_melee: { attackProfileId: "boss.legendary", aiProfileId: "ai.boss", ragdollProfileId: "ragdoll.boss", healthScale: 2.1, healthBase: 120, mass: 2.1, moveSpeed: 4.2, engageRange: 2.4, collisionRadius: 0.72 },
  giant_melee: { attackProfileId: "boss.legendary", aiProfileId: "ai.boss", ragdollProfileId: "ragdoll.boss", healthScale: 2.5, healthBase: 220, mass: 3.8, moveSpeed: 3.2, engageRange: 2.8, collisionRadius: 0.95 },
  archer: { attackProfileId: "ranged.light", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.78, healthBase: 35, mass: 0.85, moveSpeed: 3.7, engageRange: 12.0, collisionRadius: 0.42 },
  gunner: { attackProfileId: "ranged.heavy", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.8, healthBase: 40, mass: 0.95, moveSpeed: 3.6, engageRange: 12.5, collisionRadius: 0.44 },
  shotgunner: { attackProfileId: "ranged.heavy", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.9, healthBase: 45, mass: 1.0, moveSpeed: 3.5, engageRange: 7.5, collisionRadius: 0.45 },
  rapid_ranged: { attackProfileId: "ranged.light", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.75, healthBase: 30, mass: 0.85, moveSpeed: 4.0, engageRange: 10.5, collisionRadius: 0.42 },
  thrower: { attackProfileId: "throw.explosive", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.92, healthBase: 40, mass: 1.0, moveSpeed: 3.5, engageRange: 10.0, collisionRadius: 0.45 },
  artillery: { attackProfileId: "siege.catapult", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.heavy", healthScale: 0.35, healthBase: 60, mass: 2.8, moveSpeed: 2.3, engageRange: 17.0, collisionRadius: 0.82 },
  support_heal: { attackProfileId: "support.heal", aiProfileId: "ai.support", ragdollProfileId: "ragdoll.light", healthScale: 0.85, healthBase: 35, mass: 0.9, moveSpeed: 3.7, engageRange: 8.0, collisionRadius: 0.4 },
  support_buff: { attackProfileId: "support.heal", aiProfileId: "ai.support", ragdollProfileId: "ragdoll.light", healthScale: 1.0, healthBase: 60, mass: 0.95, moveSpeed: 3.8, engageRange: 8.0, collisionRadius: 0.42 },
  special_magic: { attackProfileId: "ranged.heavy", aiProfileId: "ai.boss", ragdollProfileId: "ragdoll.heavy", healthScale: 1.3, healthBase: 70, mass: 1.3, moveSpeed: 3.8, engageRange: 13.0, collisionRadius: 0.58 },
  charge_melee: { attackProfileId: "melee.heavy", aiProfileId: "ai.rush", ragdollProfileId: "ragdoll.heavy", healthScale: 1.45, healthBase: 65, mass: 1.8, moveSpeed: 4.9, engageRange: 2.4, collisionRadius: 0.68 },
  flying_melee: { attackProfileId: "melee.heavy", aiProfileId: "ai.rush", ragdollProfileId: "ragdoll.medium", healthScale: 1.1, healthBase: 50, mass: 1.0, moveSpeed: 4.8, engageRange: 2.0, collisionRadius: 0.5 },
  flying_ranged: { attackProfileId: "ranged.light", aiProfileId: "ai.ranged", ragdollProfileId: "ragdoll.light", healthScale: 0.9, healthBase: 45, mass: 0.85, moveSpeed: 4.4, engageRange: 12.5, collisionRadius: 0.44 },
  summoner: { attackProfileId: "ranged.heavy", aiProfileId: "ai.support", ragdollProfileId: "ragdoll.heavy", healthScale: 1.15, healthBase: 75, mass: 1.4, moveSpeed: 3.4, engageRange: 12.0, collisionRadius: 0.6 },
};

const SIZE_MULTIPLIERS: Record<UnitSize, { health: number; mass: number; radius: number }> = {
  tiny: { health: 0.72, mass: 0.7, radius: 0.8 },
  small: { health: 0.9, mass: 0.85, radius: 0.92 },
  medium: { health: 1.0, mass: 1.0, radius: 1.0 },
  large: { health: 1.35, mass: 1.4, radius: 1.18 },
  giant: { health: 1.9, mass: 2.2, radius: 1.45 },
  colossal: { health: 2.8, mass: 3.3, radius: 1.75 },
};

function inferSize(entry: RosterManifestEntry): UnitSize {
  return entry.size ?? "medium";
}

function usesBossPhysics(entry: RosterManifestEntry): boolean {
  const size = inferSize(entry);
  return entry.archetype === "boss_melee" || entry.archetype === "giant_melee" || size === "giant" || size === "colossal";
}

function prefersRagdoll(entry: RosterManifestEntry): string {
  if (usesBossPhysics(entry)) return "ragdoll.boss";
  if (entry.archetype === "artillery" || entry.archetype === "summoner" || inferSize(entry) === "large") return "ragdoll.heavy";
  if (entry.archetype === "tiny_melee" || entry.archetype === "light_melee" || entry.archetype === "archer" || entry.archetype === "rapid_ranged") return "ragdoll.light";
  return "ragdoll.medium";
}

function applyAbilityOverrides(
  entry: RosterManifestEntry,
  base: ArchetypeTemplate,
): Pick<UnitDefinition, "attackProfileId" | "aiProfileId" | "engageRange" | "moveSpeed"> {
  const abilities = new Set<AbilityKind>(entry.abilities ?? []);

  let attackProfileId = base.attackProfileId;
  let aiProfileId = base.aiProfileId;
  let engageRange = entry.engageRangeOverride ?? base.engageRange;
  let moveSpeed = entry.moveSpeedOverride ?? base.moveSpeed;

  if (abilities.has("rapid_fire")) {
    attackProfileId = base.attackProfileId === "ranged.heavy" ? "ranged.heavy" : "ranged.light";
  }
  if (abilities.has("push_force")) {
    attackProfileId = "boss.legendary";
    engageRange = Math.max(engageRange, 10);
  }
  if (abilities.has("lightning_strike")) {
    attackProfileId = "ranged.heavy";
    aiProfileId = "ai.boss";
    engageRange = Math.max(engageRange, 13);
  }
  if (abilities.has("summon") || abilities.has("revive")) {
    aiProfileId = "ai.support";
  }
  if (abilities.has("teleport") || abilities.has("jump_charge") || abilities.has("leap_attack")) {
    moveSpeed = Math.max(moveSpeed, 4.9);
  }
  if (abilities.has("flying_hover")) {
    moveSpeed = Math.max(moveSpeed, 4.8);
  }

  return { attackProfileId, aiProfileId, engageRange, moveSpeed };
}

function buildDefinition(entry: RosterManifestEntry): UnitDefinition {
  const base = ARCHETYPES[entry.archetype];
  const size = inferSize(entry);
  const sizeMultiplier = SIZE_MULTIPLIERS[size];
  const { attackProfileId, aiProfileId, engageRange, moveSpeed } = applyAbilityOverrides(entry, base);
  const healthMultiplier = entry.healthMultiplier ?? 1;

  return {
    ...entry,
    maxHealth: Math.round((entry.cost * base.healthScale + base.healthBase) * sizeMultiplier.health * healthMultiplier),
    mass: Number((base.mass * sizeMultiplier.mass).toFixed(2)),
    moveSpeed,
    engageRange,
    collisionRadius: Number((base.collisionRadius * sizeMultiplier.radius).toFixed(2)),
    attackProfileId,
    aiProfileId,
    ragdollProfileId: prefersRagdoll(entry),
  };
}

export const ALL_UNITS: UnitDefinition[] = ROSTER_MANIFEST.map(buildDefinition);

const unitMap = new Map(ALL_UNITS.map((unit) => [unit.id, unit]));

export function getUnit(id: string): UnitDefinition | undefined {
  return unitMap.get(id);
}

export function getUnitsByFaction(faction: FactionId): UnitDefinition[] {
  return ALL_UNITS.filter((unit) => unit.faction === faction);
}

export function getFactionCounts(): Record<FactionId, number> {
  return ALL_UNITS.reduce<Record<FactionId, number>>((counts, unit) => {
    counts[unit.faction] = (counts[unit.faction] ?? 0) + 1;
    return counts;
  }, {} as Record<FactionId, number>);
}
