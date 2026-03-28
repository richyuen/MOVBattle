import { FactionId } from "./factionColors";

export interface UnitDefinition {
  id: string;
  displayName: string;
  faction: FactionId;
  cost: number;
  maxHealth: number;
  mass: number;
  moveSpeed: number;
  engageRange: number;
  collisionRadius: number;
  attackProfileId: string;
  aiProfileId: string;
  ragdollProfileId: string;
}

function u(
  id: string, displayName: string, faction: FactionId,
  cost: number, maxHealth: number, mass: number, moveSpeed: number,
  engageRange: number, collisionRadius: number,
  attackProfileId: string, aiProfileId: string, ragdollProfileId: string,
): UnitDefinition {
  return { id, displayName, faction, cost, maxHealth, mass, moveSpeed, engageRange, collisionRadius, attackProfileId, aiProfileId, ragdollProfileId };
}

const F = FactionId;

export const ALL_UNITS: UnitDefinition[] = [
  // Tribal
  u("tribal.clubber", "Clubber", F.Tribal, 70, 95, 0.9, 4.2, 1.6, 0.42, "melee.light", "ai.rush", "ragdoll.light"),
  u("tribal.protector", "Protector", F.Tribal, 90, 120, 1.1, 3.8, 1.7, 0.46, "melee.light", "ai.brace", "ragdoll.medium"),
  u("tribal.spear_thrower", "Spear Thrower", F.Tribal, 140, 95, 0.9, 3.9, 10.0, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("tribal.stoner", "Stoner", F.Tribal, 160, 120, 1.2, 3.6, 11.5, 0.5, "throw.explosive", "ai.ranged", "ragdoll.medium"),
  u("tribal.bone_mage", "Bone Mage", F.Tribal, 220, 150, 1.2, 3.3, 8.0, 0.52, "melee.heavy", "ai.rush", "ragdoll.medium"),
  u("tribal.chieftain", "Chieftain", F.Tribal, 400, 420, 1.9, 4.4, 2.2, 0.62, "melee.heavy", "ai.boss", "ragdoll.heavy"),
  u("tribal.mammoth", "Mammoth", F.Tribal, 1200, 1600, 5.2, 3.0, 2.4, 1.15, "boss.legendary", "ai.boss", "ragdoll.boss"),

  // Farmer
  u("farmer.halfling", "Halfling", F.Farmer, 65, 70, 0.6, 4.5, 1.4, 0.35, "melee.light", "ai.rush", "ragdoll.light"),
  u("farmer.farmer", "Farmer", F.Farmer, 80, 95, 0.9, 4.0, 1.8, 0.42, "melee.light", "ai.rush", "ragdoll.light"),
  u("farmer.hay_baler", "Hay Baler", F.Farmer, 110, 145, 1.3, 3.4, 1.8, 0.5, "melee.medium", "ai.brace", "ragdoll.medium"),
  u("farmer.potion_seller", "Potion Seller", F.Farmer, 180, 115, 1.0, 3.4, 9.0, 0.42, "throw.explosive", "ai.ranged", "ragdoll.light"),
  u("farmer.harvester", "Harvester", F.Farmer, 260, 240, 1.6, 3.8, 2.0, 0.56, "melee.heavy", "ai.rush", "ragdoll.medium"),
  u("farmer.wheelbarrow", "Wheelbarrow", F.Farmer, 520, 480, 2.4, 5.0, 2.0, 0.72, "melee.heavy", "ai.rush", "ragdoll.heavy"),
  u("farmer.scarecrow", "Scarecrow", F.Farmer, 1000, 540, 1.7, 3.3, 13.0, 0.66, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),

  // Medieval
  u("medieval.bard", "Bard", F.Medieval, 65, 70, 0.7, 4.8, 1.2, 0.36, "melee.light", "ai.rush", "ragdoll.light"),
  u("medieval.squire", "Squire", F.Medieval, 100, 125, 1.0, 4.0, 1.8, 0.46, "melee.medium", "ai.rush", "ragdoll.medium"),
  u("medieval.archer", "Archer", F.Medieval, 140, 95, 0.8, 3.7, 12.0, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("medieval.healer", "Healer", F.Medieval, 180, 100, 0.9, 3.6, 8.0, 0.4, "support.heal", "ai.support", "ragdoll.light"),
  u("medieval.knight", "Knight", F.Medieval, 320, 320, 1.8, 3.9, 2.1, 0.58, "melee.heavy", "ai.brace", "ragdoll.heavy"),
  u("medieval.catapult", "Catapult", F.Medieval, 1000, 380, 3.1, 2.2, 18.0, 0.8, "siege.catapult", "ai.ranged", "ragdoll.heavy"),
  u("medieval.king", "King", F.Medieval, 1200, 900, 2.3, 4.2, 2.3, 0.72, "boss.legendary", "ai.boss", "ragdoll.boss"),

  // Ancient
  u("ancient.shield_bearer", "Shield Bearer", F.Ancient, 80, 135, 1.1, 3.8, 1.7, 0.5, "melee.light", "ai.brace", "ragdoll.medium"),
  u("ancient.sarissa", "Sarissa", F.Ancient, 100, 120, 1.1, 3.6, 2.6, 0.48, "melee.medium", "ai.brace", "ragdoll.medium"),
  u("ancient.hoplite", "Hoplite", F.Ancient, 140, 185, 1.4, 3.8, 2.0, 0.54, "melee.medium", "ai.brace", "ragdoll.medium"),
  u("ancient.ballista", "Ballista", F.Ancient, 900, 300, 2.4, 2.4, 17.0, 0.78, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),
  u("ancient.snake_archer", "Snake Archer", F.Ancient, 220, 105, 0.9, 3.7, 11.5, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("ancient.minotaur", "Minotaur", F.Ancient, 700, 780, 2.7, 4.3, 2.4, 0.84, "melee.heavy", "ai.boss", "ragdoll.heavy"),
  u("ancient.zeus", "Zeus", F.Ancient, 2000, 1200, 2.2, 3.7, 13.0, 0.76, "boss.legendary", "ai.boss", "ragdoll.boss"),

  // Viking
  u("viking.headbutter", "Headbutter", F.Viking, 90, 125, 1.0, 4.1, 1.6, 0.46, "melee.medium", "ai.rush", "ragdoll.medium"),
  u("viking.ice_archer", "Ice Archer", F.Viking, 160, 100, 0.9, 3.6, 12.0, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("viking.brawler", "Brawler", F.Viking, 140, 170, 1.3, 4.0, 1.9, 0.5, "melee.medium", "ai.rush", "ragdoll.medium"),
  u("viking.berserker", "Berserker", F.Viking, 220, 220, 1.2, 5.0, 1.7, 0.52, "melee.heavy", "ai.rush", "ragdoll.medium"),
  u("viking.valkyrie", "Valkyrie", F.Viking, 420, 300, 1.4, 4.8, 2.0, 0.56, "melee.heavy", "ai.rush", "ragdoll.heavy"),
  u("viking.longship", "Longship", F.Viking, 500, 520, 2.8, 3.3, 2.3, 0.92, "melee.heavy", "ai.brace", "ragdoll.heavy"),
  u("viking.jarl", "Jarl", F.Viking, 1200, 920, 2.4, 4.1, 2.3, 0.74, "boss.legendary", "ai.boss", "ragdoll.boss"),

  // Dynasty
  u("dynasty.samurai", "Samurai", F.Dynasty, 140, 180, 1.2, 4.1, 2.0, 0.5, "melee.medium", "ai.brace", "ragdoll.medium"),
  u("dynasty.firework_archer", "Firework Archer", F.Dynasty, 180, 100, 0.9, 3.7, 12.5, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("dynasty.monk", "Monk", F.Dynasty, 220, 240, 1.2, 4.6, 1.9, 0.5, "melee.heavy", "ai.rush", "ragdoll.medium"),
  u("dynasty.ninja", "Ninja", F.Dynasty, 160, 90, 0.8, 4.9, 10.0, 0.4, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("dynasty.dragon", "Dragon", F.Dynasty, 1000, 500, 2.0, 3.9, 11.0, 0.75, "throw.explosive", "ai.ranged", "ragdoll.heavy"),
  u("dynasty.hwacha", "Hwacha", F.Dynasty, 900, 320, 2.8, 2.4, 16.0, 0.8, "ranged.heavy", "ai.ranged", "ragdoll.heavy"),
  u("dynasty.monkey_king", "Monkey King", F.Dynasty, 2000, 1500, 2.3, 4.3, 2.4, 0.8, "boss.legendary", "ai.boss", "ragdoll.boss"),

  // Renaissance
  u("renaissance.painter", "Painter", F.Renaissance, 80, 95, 0.9, 3.9, 1.7, 0.44, "melee.light", "ai.rush", "ragdoll.light"),
  u("renaissance.fencer", "Fencer", F.Renaissance, 160, 150, 1.0, 4.5, 2.0, 0.46, "melee.medium", "ai.rush", "ragdoll.medium"),
  u("renaissance.balloon_archer", "Balloon Archer", F.Renaissance, 180, 95, 0.8, 3.8, 11.5, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("renaissance.musketeer", "Musketeer", F.Renaissance, 220, 110, 1.0, 3.5, 12.5, 0.46, "ranged.heavy", "ai.ranged", "ragdoll.light"),
  u("renaissance.halberd", "Halberd", F.Renaissance, 200, 230, 1.4, 3.7, 2.3, 0.54, "melee.heavy", "ai.brace", "ragdoll.medium"),
  u("renaissance.jouster", "Jouster", F.Renaissance, 500, 460, 2.2, 4.7, 2.4, 0.74, "melee.heavy", "ai.rush", "ragdoll.heavy"),
  u("renaissance.da_vinci_tank", "Da Vinci Tank", F.Renaissance, 1800, 1100, 3.5, 2.7, 14.0, 1.05, "siege.catapult", "ai.ranged", "ragdoll.boss"),

  // Pirate
  u("pirate.flintlock", "Flintlock", F.Pirate, 120, 95, 0.9, 3.9, 10.0, 0.42, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("pirate.blunderbuss", "Blunderbuss", F.Pirate, 160, 110, 1.0, 3.5, 7.0, 0.45, "ranged.heavy", "ai.ranged", "ragdoll.light"),
  u("pirate.bomb_thrower", "Bomb Thrower", F.Pirate, 220, 110, 1.0, 3.5, 10.0, 0.45, "throw.explosive", "ai.ranged", "ragdoll.light"),
  u("pirate.harpooner", "Harpooner", F.Pirate, 140, 125, 1.0, 3.8, 10.5, 0.44, "ranged.light", "ai.ranged", "ragdoll.light"),
  u("pirate.captain", "Captain", F.Pirate, 500, 520, 2.0, 4.0, 2.3, 0.7, "melee.heavy", "ai.boss", "ragdoll.heavy"),
  u("pirate.cannon", "Cannon", F.Pirate, 1000, 340, 3.0, 2.3, 16.0, 0.86, "siege.catapult", "ai.ranged", "ragdoll.heavy"),
  u("pirate.pirate_queen", "Pirate Queen", F.Pirate, 2500, 1700, 2.7, 4.4, 2.5, 0.85, "boss.legendary", "ai.boss", "ragdoll.boss"),
];

const unitMap = new Map(ALL_UNITS.map((u) => [u.id, u]));

export function getUnit(id: string): UnitDefinition | undefined {
  return unitMap.get(id);
}
