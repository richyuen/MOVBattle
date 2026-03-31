import { FactionId } from "./factionColors";

export type UnitArchetype =
  | "tiny_melee"
  | "light_melee"
  | "shield_melee"
  | "polearm_melee"
  | "heavy_melee"
  | "boss_melee"
  | "giant_melee"
  | "archer"
  | "gunner"
  | "shotgunner"
  | "rapid_ranged"
  | "thrower"
  | "artillery"
  | "support_heal"
  | "support_buff"
  | "special_magic"
  | "charge_melee"
  | "flying_melee"
  | "flying_ranged"
  | "summoner";

export type UnitSize = "tiny" | "small" | "medium" | "large" | "giant" | "colossal";

export type AbilityKind =
  | "teleport"
  | "spin_move"
  | "jump_charge"
  | "flying_hover"
  | "lightning_strike"
  | "shotgun_blast"
  | "rapid_fire"
  | "volley_fire"
  | "summon"
  | "push_force"
  | "pull_hook"
  | "freeze"
  | "fire_dot"
  | "poison"
  | "parry"
  | "charge_impact"
  | "leap_attack"
  | "revive"
  | "clone"
  | "fear"
  | "giant_slam";

export type UnitVisualPreset =
  | "default"
  | "secret_ballooner"
  | "secret_bomb_on_a_stick"
  | "secret_fan_bearer"
  | "secret_raptor"
  | "secret_teacher"
  | "secret_jester"
  | "secret_ball_n_chain"
  | "secret_chu_ko_nu"
  | "secret_executioner"
  | "secret_shouter"
  | "secret_taekwondo"
  | "secret_raptor_rider"
  | "secret_cheerleader"
  | "secret_cupid"
  | "secret_mace_spinner"
  | "secret_clams"
  | "secret_present_elf"
  | "secret_ice_mage"
  | "secret_infernal_whip"
  | "secret_bank_robbers"
  | "secret_witch"
  | "secret_banshee"
  | "secret_necromancer"
  | "secret_solar_architect"
  | "secret_wheelbarrow_dragon"
  | "secret_skeleton_giant"
  | "secret_bomb_cannon"
  | "secret_cavalry"
  | "secret_vlad"
  | "secret_gatling_gun"
  | "secret_blackbeard"
  | "secret_samurai_giant"
  | "secret_ullr"
  | "secret_lady_red_jade"
  | "secret_sensei"
  | "secret_shogun"
  | "secret_tree_giant"
  | "secret_artemis"
  | "secret_ice_giant";

export type UnitBehaviorPreset =
  | "default"
  | "secret_balloon_lift"
  | "secret_push_fan"
  | "secret_charge_beast"
  | "secret_duelist"
  | "secret_evasive_melee"
  | "secret_spin_flail"
  | "secret_burst_crossbow"
  | "secret_executioner"
  | "secret_shout_push"
  | "secret_jump_kicker"
  | "secret_mounted_charge"
  | "secret_cheerleader"
  | "secret_flying_archer"
  | "secret_mace_spinner"
  | "secret_clams"
  | "secret_present_spawn"
  | "secret_freeze_caster"
  | "secret_fire_whip"
  | "secret_bank_robbers"
  | "secret_witch"
  | "secret_banshee"
  | "secret_necromancer"
  | "secret_solar_blast"
  | "secret_dragon_cart"
  | "secret_giant_slam"
  | "secret_bomb_cannon"
  | "secret_vlad_hook"
  | "secret_gatling"
  | "secret_blackbeard"
  | "secret_ullr"
  | "secret_lady_red_jade"
  | "secret_sensei"
  | "secret_shogun"
  | "secret_artemis"
  | "secret_ice_giant";

export interface RosterManifestEntry {
  id: string;
  displayName: string;
  faction: FactionId;
  cost: number;
  archetype: UnitArchetype;
  size?: UnitSize;
  abilities?: AbilityKind[];
  visualPreset?: UnitVisualPreset;
  behaviorPreset?: UnitBehaviorPreset;
  projectileHint?: string;
  weaponHint?: string;
  hatHint?: string;
  shieldHint?: string;
  specialHint?: string;
  summonUnitIds?: string[];
  summonCount?: number;
  burstCount?: number;
  volleyCount?: number;
  controlStrength?: number;
  statusDurationSeconds?: number;
  cooldownMultiplier?: number;
  moveSpeedOverride?: number;
  engageRangeOverride?: number;
  healthMultiplier?: number;
}

type FactionEntryInput = readonly [
  id: string,
  displayName: string,
  cost: number,
  archetype: UnitArchetype,
  options?: Omit<RosterManifestEntry, "id" | "displayName" | "cost" | "archetype" | "faction">,
];

function makeFaction(
  faction: FactionId,
  slug: string,
  entries: readonly FactionEntryInput[],
): RosterManifestEntry[] {
  return entries.map(([id, displayName, cost, archetype, options]) => ({
    id: `${slug}.${id}`,
    displayName,
    faction,
    cost,
    archetype,
    ...options,
  }));
}

const tribal = makeFaction(FactionId.Tribal, "tribal", [
  ["clubber", "Clubber", 70, "light_melee", { weaponHint: "club" }],
  ["protector", "Protector", 90, "shield_melee", { weaponHint: "spear", shieldHint: "round" }],
  ["spear_thrower", "Spear Thrower", 140, "archer", { projectileHint: "spear", weaponHint: "javelin" }],
  ["stoner", "Stoner", 160, "thrower", { projectileHint: "stone", weaponHint: "stone" }],
  ["bone_mage", "Bone Mage", 220, "special_magic", { weaponHint: "bone_staff" }],
  ["chieftain", "Chieftain", 400, "boss_melee", { weaponHint: "club" }],
  ["mammoth", "Mammoth", 1200, "giant_melee", { size: "colossal", abilities: ["giant_slam"], specialHint: "mammoth" }],
]);

const farmer = makeFaction(FactionId.Farmer, "farmer", [
  ["halfling", "Halfling", 65, "tiny_melee", { weaponHint: "frying_pan", size: "tiny" }],
  ["farmer", "Farmer", 80, "polearm_melee", { weaponHint: "pitchfork", hatHint: "straw_hat" }],
  ["hay_baler", "Hay Baler", 110, "shield_melee", { weaponHint: "hay_bale", hatHint: "straw_hat", size: "large" }],
  ["potion_seller", "Potion Seller", 180, "thrower", { weaponHint: "potion", projectileHint: "bomb" }],
  ["harvester", "Harvester", 260, "heavy_melee", { weaponHint: "scythe" }],
  ["wheelbarrow", "Wheelbarrow", 520, "charge_melee", { specialHint: "cart", size: "large", abilities: ["charge_impact"] }],
  ["scarecrow", "Scarecrow", 1000, "summoner", { abilities: ["summon"], summonUnitIds: ["secret.ballooner"], summonCount: 2, projectileHint: "crow", specialHint: "scarecrow" }],
]);

const medieval = makeFaction(FactionId.Medieval, "medieval", [
  ["bard", "Bard", 65, "light_melee", { weaponHint: "lute" }],
  ["squire", "Squire", 100, "light_melee", { weaponHint: "sword", hatHint: "great_helm" }],
  ["archer", "Archer", 140, "archer", { weaponHint: "bow" }],
  ["healer", "Healer", 180, "support_heal", { weaponHint: "staff" }],
  ["knight", "Knight", 320, "heavy_melee", { weaponHint: "sword", hatHint: "plume_helmet", shieldHint: "kite" }],
  ["catapult", "Catapult", 1000, "artillery", { size: "large", projectileHint: "stone", specialHint: "catapult" }],
  ["king", "King", 1200, "boss_melee", { weaponHint: "greatsword", hatHint: "crown" }],
]);

const ancient = makeFaction(FactionId.Ancient, "ancient", [
  ["shield_bearer", "Shield Bearer", 80, "shield_melee", { weaponHint: "sword", shieldHint: "tower" }],
  ["sarissa", "Sarissa", 100, "polearm_melee", { weaponHint: "spear" }],
  ["hoplite", "Hoplite", 140, "shield_melee", { weaponHint: "spear", shieldHint: "round", hatHint: "plume_helmet" }],
  ["snake_archer", "Snake Archer", 220, "archer", { weaponHint: "bow", abilities: ["poison"], projectileHint: "arrow" }],
  ["ballista", "Ballista", 900, "artillery", { size: "large", projectileHint: "bolt", specialHint: "ballista" }],
  ["minotaur", "Minotaur", 700, "giant_melee", { size: "giant", abilities: ["charge_impact"], specialHint: "minotaur" }],
  ["zeus", "Zeus", 2000, "special_magic", { abilities: ["lightning_strike"], weaponHint: "lightning_bolt" }],
]);

const viking = makeFaction(FactionId.Viking, "viking", [
  ["headbutter", "Headbutter", 90, "charge_melee", { abilities: ["charge_impact"], hatHint: "viking_helmet" }],
  ["ice_archer", "Ice Archer", 160, "archer", { weaponHint: "bow", abilities: ["freeze"] }],
  ["brawler", "Brawler", 140, "shield_melee", { weaponHint: "axe", shieldHint: "round", hatHint: "viking_helmet" }],
  ["berserker", "Berserker", 220, "charge_melee", { abilities: ["jump_charge", "spin_move"], weaponHint: "axe", hatHint: "horned_helmet" }],
  ["valkyrie", "Valkyrie", 420, "flying_melee", { abilities: ["flying_hover"], weaponHint: "sword", shieldHint: "round", specialHint: "wings" }],
  ["longship", "Longship", 500, "charge_melee", { size: "large", weaponHint: "axe", specialHint: "longship" }],
  ["jarl", "Jarl", 1200, "boss_melee", { weaponHint: "greatsword", hatHint: "horned_helmet" }],
]);

const dynasty = makeFaction(FactionId.Dynasty, "dynasty", [
  ["samurai", "Samurai", 140, "heavy_melee", { abilities: ["parry"], weaponHint: "katana", hatHint: "samurai_helmet" }],
  ["firework_archer", "Firework Archer", 180, "archer", { projectileHint: "firework", weaponHint: "bow", hatHint: "conical_hat", abilities: ["fire_dot"] }],
  ["monk", "Monk", 220, "light_melee", { moveSpeedOverride: 4.7, specialHint: "monk" }],
  ["ninja", "Ninja", 160, "rapid_ranged", { abilities: ["teleport", "rapid_fire"], projectileHint: "shuriken", hatHint: "ninja_mask" }],
  ["dragon", "Dragon", 1000, "special_magic", { abilities: ["fire_dot"], projectileHint: "fireball", specialHint: "dragon" }],
  ["hwacha", "Hwacha", 900, "artillery", { abilities: ["volley_fire"], projectileHint: "rocket_arrow", specialHint: "hwacha", size: "large" }],
  ["monkey_king", "Monkey King", 2000, "boss_melee", { abilities: ["clone"], weaponHint: "bo_staff" }],
]);

const renaissance = makeFaction(FactionId.Renaissance, "renaissance", [
  ["painter", "Painter", 80, "light_melee", { weaponHint: "paintbrush", hatHint: "beret" }],
  ["fencer", "Fencer", 160, "light_melee", { abilities: ["parry"], weaponHint: "rapier", hatHint: "plume_helmet" }],
  ["balloon_archer", "Balloon Archer", 180, "flying_ranged", { abilities: ["flying_hover"], weaponHint: "bow", specialHint: "balloon" }],
  ["musketeer", "Musketeer", 220, "gunner", { weaponHint: "musket", hatHint: "plume_helmet" }],
  ["halberd", "Halberd", 200, "polearm_melee", { weaponHint: "halberd", hatHint: "helmet" }],
  ["jouster", "Jouster", 500, "charge_melee", { abilities: ["charge_impact"], weaponHint: "lance", specialHint: "horse", size: "large" }],
  ["da_vinci_tank", "Da Vinci Tank", 1800, "artillery", { abilities: ["rapid_fire"], specialHint: "tank", size: "large", projectileHint: "bolt" }],
]);

const pirate = makeFaction(FactionId.Pirate, "pirate", [
  ["flintlock", "Flintlock", 120, "gunner", { weaponHint: "flintlock", hatHint: "tricorn" }],
  ["blunderbuss", "Blunderbuss", 160, "shotgunner", { abilities: ["shotgun_blast"], weaponHint: "blunderbuss", hatHint: "tricorn" }],
  ["bomb_thrower", "Bomb Thrower", 220, "thrower", { weaponHint: "bomb", projectileHint: "bomb" }],
  ["harpooner", "Harpooner", 140, "gunner", { abilities: ["pull_hook"], projectileHint: "spear", weaponHint: "harpoon" }],
  ["cannon", "Cannon", 1000, "artillery", { specialHint: "cannon", size: "large", projectileHint: "stone" }],
  ["captain", "Captain", 500, "heavy_melee", { weaponHint: "cutlass", hatHint: "captain_hat" }],
  ["pirate_queen", "Pirate Queen", 2500, "boss_melee", { weaponHint: "cutlass", hatHint: "pirate_hat" }],
]);

const spooky = makeFaction(FactionId.Spooky, "spooky", [
  ["skeleton_warrior", "Skeleton Warrior", 80, "light_melee", { weaponHint: "sword" }],
  ["skeleton_archer", "Skeleton Archer", 150, "archer", { weaponHint: "bow" }],
  ["candlehead", "Candlehead", 180, "special_magic", { abilities: ["fire_dot"], weaponHint: "torch" }],
  ["vampire", "Vampire", 200, "flying_melee", { abilities: ["flying_hover", "leap_attack"], weaponHint: "dagger" }],
  ["pumpkin_catapult", "Pumpkin Catapult", 1000, "artillery", { specialHint: "catapult", projectileHint: "bomb", size: "large" }],
  ["swordcaster", "Swordcaster", 300, "special_magic", { weaponHint: "sword", projectileHint: "bolt" }],
  ["reaper", "Reaper", 2500, "boss_melee", { abilities: ["push_force", "fear"], weaponHint: "scythe", size: "giant" }],
]);

const wildWest = makeFaction(FactionId.WildWest, "wild_west", [
  ["dynamite_thrower", "Dynamite Thrower", 180, "thrower", { weaponHint: "bomb", projectileHint: "bomb" }],
  ["miner", "Miner", 250, "heavy_melee", { weaponHint: "hammer", hatHint: "hood" }],
  ["cactus", "Cactus", 300, "heavy_melee", { specialHint: "cactus", size: "large" }],
  ["gunslinger", "Gunslinger", 400, "rapid_ranged", { abilities: ["rapid_fire"], weaponHint: "flintlock", hatHint: "bandana" }],
  ["lasso", "Lasso", 500, "charge_melee", { abilities: ["pull_hook", "charge_impact"], specialHint: "horse", weaponHint: "spear" }],
  ["deadeye", "Deadeye", 650, "gunner", { weaponHint: "musket", hatHint: "bandana", engageRangeOverride: 16 }],
  ["quick_draw", "Quick Draw", 1000, "rapid_ranged", { abilities: ["rapid_fire"], weaponHint: "flintlock", hatHint: "captain_hat" }],
]);

const legacy = makeFaction(FactionId.Legacy, "legacy", [
  ["peasant", "Peasant", 30, "tiny_melee", { size: "tiny" }],
  ["banner_bearer", "Banner Bearer", 80, "support_buff", { weaponHint: "staff" }],
  ["poacher", "Poacher", 140, "archer", { weaponHint: "bow" }],
  ["blowdarter", "Blowdarter", 200, "rapid_ranged", { abilities: ["poison", "rapid_fire"], weaponHint: "staff", projectileHint: "arrow" }],
  ["pike", "Pike", 350, "polearm_melee", { weaponHint: "spear", engageRangeOverride: 3.1 }],
  ["barrel_roller", "Barrel Roller", 400, "thrower", { weaponHint: "bomb", projectileHint: "stone", size: "large" }],
  ["boxer", "Boxer", 30, "tiny_melee", { size: "tiny" }],
  ["flag_bearer", "Flag Bearer", 1000, "support_buff", { weaponHint: "staff" }],
  ["pharaoh", "Pharaoh", 1000, "special_magic", { abilities: ["fear"], hatHint: "pharaoh", weaponHint: "staff" }],
  ["wizard", "Wizard", 3000, "special_magic", { projectileHint: "bolt", weaponHint: "staff" }],
  ["chariot", "Chariot", 1000, "charge_melee", { abilities: ["charge_impact"], specialHint: "horse", size: "large" }],
  ["thor", "Thor", 2200, "special_magic", { abilities: ["lightning_strike"], weaponHint: "lightning_bolt" }],
  ["tank", "Tank", 5000, "artillery", { abilities: ["rapid_fire"], specialHint: "tank", size: "colossal", projectileHint: "bolt" }],
  ["super_boxer", "Super Boxer", 100000, "boss_melee", { moveSpeedOverride: 5.2, size: "large" }],
  ["dark_peasant", "Dark Peasant", 500000, "special_magic", { abilities: ["summon", "fear"], summonUnitIds: ["legacy.peasant"], summonCount: 4, size: "giant" }],
  ["super_peasant", "Super Peasant", 500000, "boss_melee", { abilities: ["flying_hover", "charge_impact"], size: "giant", moveSpeedOverride: 6.2 }],
]);

const good = makeFaction(FactionId.Good, "good", [
  ["devout_gauntlet", "Devout Gauntlet", 220, "light_melee", { weaponHint: "mace" }],
  ["celestial_aegis", "Celestial Aegis", 300, "shield_melee", { shieldHint: "tower", weaponHint: "sword" }],
  ["radiant_glaive", "Radiant Glaive", 650, "polearm_melee", { weaponHint: "halberd" }],
  ["righteous_paladin", "Righteous Paladin", 900, "heavy_melee", { weaponHint: "greatsword", shieldHint: "kite" }],
  ["divine_arbiter", "Divine Arbiter", 3500, "special_magic", { abilities: ["lightning_strike"], weaponHint: "lightning_bolt" }],
  ["sacred_elephant", "Sacred Elephant", 2200, "giant_melee", { size: "colossal", abilities: ["giant_slam"], specialHint: "mammoth" }],
  ["chronomancer", "Chronomancer", 1600, "special_magic", { abilities: ["push_force"], weaponHint: "staff" }],
]);

const evil = makeFaction(FactionId.Evil, "evil", [
  ["shadow_walker", "Shadow Walker", 220, "light_melee", { abilities: ["teleport"], weaponHint: "dagger" }],
  ["exiled_sentinel", "Exiled Sentinel", 300, "shield_melee", { shieldHint: "tower", weaponHint: "sword" }],
  ["mad_mechanic", "Mad Mechanic", 650, "thrower", { weaponHint: "hammer", projectileHint: "bomb" }],
  ["void_cultist", "Void Cultist", 800, "special_magic", { abilities: ["summon"], weaponHint: "staff", summonUnitIds: ["evil.exiled_sentinel"], summonCount: 1 }],
  ["tempest_lich", "Tempest Lich", 1500, "special_magic", { abilities: ["lightning_strike", "push_force"], weaponHint: "staff" }],
  ["death_bringer", "Death Bringer", 2500, "boss_melee", { weaponHint: "greatsword", abilities: ["fear"] }],
  ["void_monarch", "Void Monarch", 4000, "special_magic", { abilities: ["summon", "fear"], weaponHint: "staff", size: "giant", summonUnitIds: ["evil.shadow_walker"], summonCount: 2 }],
]);

const secret = makeFaction(FactionId.Secret, "secret", [
  ["ballooner", "Ballooner", 120, "flying_melee", { abilities: ["flying_hover", "pull_hook"], specialHint: "balloon", visualPreset: "secret_ballooner", behaviorPreset: "secret_balloon_lift", controlStrength: 1.3, statusDurationSeconds: 2.2 }],
  ["bomb_on_a_stick", "Bomb on a Stick", 150, "thrower", { weaponHint: "bomb", projectileHint: "bomb", visualPreset: "secret_bomb_on_a_stick" }],
  ["fan_bearer", "Fan Bearer", 180, "special_magic", { abilities: ["push_force"], weaponHint: "staff", hatHint: "conical_hat", visualPreset: "secret_fan_bearer", behaviorPreset: "secret_push_fan", controlStrength: 1.5 }],
  ["raptor", "Raptor", 200, "charge_melee", { abilities: ["charge_impact"], size: "large", visualPreset: "secret_raptor", behaviorPreset: "secret_charge_beast", controlStrength: 1.15 }],
  ["the_teacher", "The Teacher", 220, "heavy_melee", { abilities: ["parry"], weaponHint: "katana", visualPreset: "secret_teacher", behaviorPreset: "secret_duelist", cooldownMultiplier: 0.82 }],
  ["jester", "Jester", 250, "light_melee", { moveSpeedOverride: 5.1, weaponHint: "dagger", visualPreset: "secret_jester", behaviorPreset: "secret_evasive_melee", cooldownMultiplier: 0.78 }],
  ["ball_n_chain", "Ball 'n' Chain", 300, "heavy_melee", { abilities: ["spin_move"], weaponHint: "mace", visualPreset: "secret_ball_n_chain", behaviorPreset: "secret_spin_flail", controlStrength: 1.1 }],
  ["chu_ko_nu", "Chu Ko Nu", 350, "rapid_ranged", { abilities: ["rapid_fire"], weaponHint: "crossbow", projectileHint: "bolt", visualPreset: "secret_chu_ko_nu", behaviorPreset: "secret_burst_crossbow", burstCount: 6, cooldownMultiplier: 0.82 }],
  ["executioner", "Executioner", 550, "heavy_melee", { weaponHint: "axe", size: "large", visualPreset: "secret_executioner", behaviorPreset: "secret_executioner", controlStrength: 1.15 }],
  ["shouter", "Shouter", 600, "special_magic", { abilities: ["push_force"], weaponHint: "staff", visualPreset: "secret_shouter", behaviorPreset: "secret_shout_push", controlStrength: 2.1 }],
  ["taekwondo", "Taekwondo", 800, "charge_melee", { abilities: ["jump_charge"], moveSpeedOverride: 5.4, visualPreset: "secret_taekwondo", behaviorPreset: "secret_jump_kicker", cooldownMultiplier: 0.72 }],
  ["raptor_rider", "Raptor Rider", 900, "charge_melee", { abilities: ["charge_impact"], size: "large", specialHint: "horse", visualPreset: "secret_raptor_rider", behaviorPreset: "secret_mounted_charge", controlStrength: 1.25 }],
  ["cheerleader", "Cheerleader", 1000, "support_buff", { weaponHint: "staff", visualPreset: "secret_cheerleader", behaviorPreset: "secret_cheerleader", cooldownMultiplier: 0.62 }],
  ["cupid", "Cupid", 1200, "flying_ranged", { abilities: ["flying_hover"], weaponHint: "bow", specialHint: "wings", visualPreset: "secret_cupid", behaviorPreset: "secret_flying_archer", volleyCount: 2, cooldownMultiplier: 0.85 }],
  ["mace_spinner", "Mace Spinner", 1300, "heavy_melee", { abilities: ["spin_move"], weaponHint: "mace", visualPreset: "secret_mace_spinner", behaviorPreset: "secret_mace_spinner", controlStrength: 1.35 }],
  ["clams", "CLAMS", 1400, "summoner", { abilities: ["summon"], summonUnitIds: ["secret.bomb_on_a_stick"], summonCount: 2, specialHint: "cannon", size: "large", visualPreset: "secret_clams", behaviorPreset: "secret_clams", cooldownMultiplier: 0.9 }],
  ["present_elf", "Present Elf", 1500, "summoner", { abilities: ["summon"], summonUnitIds: ["legacy.peasant", "farmer.halfling", "medieval.squire"], summonCount: 2, weaponHint: "staff", visualPreset: "secret_present_elf", behaviorPreset: "secret_present_spawn", cooldownMultiplier: 0.8 }],
  ["ice_mage", "Ice Mage", 1600, "special_magic", { abilities: ["freeze"], weaponHint: "staff", projectileHint: "bolt", visualPreset: "secret_ice_mage", behaviorPreset: "secret_freeze_caster", statusDurationSeconds: 3.4 }],
  ["infernal_whip", "Infernal Whip", 1700, "special_magic", { abilities: ["fire_dot"], weaponHint: "torch", visualPreset: "secret_infernal_whip", behaviorPreset: "secret_fire_whip", statusDurationSeconds: 2.8 }],
  ["bank_robbers", "Bank Robbers", 1800, "rapid_ranged", { abilities: ["rapid_fire"], weaponHint: "flintlock", visualPreset: "secret_bank_robbers", behaviorPreset: "secret_bank_robbers", burstCount: 4, cooldownMultiplier: 0.78 }],
  ["witch", "Witch", 1800, "summoner", { abilities: ["summon"], summonUnitIds: ["spooky.skeleton_warrior"], summonCount: 3, weaponHint: "staff", hatHint: "hood", visualPreset: "secret_witch", behaviorPreset: "secret_witch", cooldownMultiplier: 0.72 }],
  ["banshee", "Banshee", 1900, "flying_melee", { abilities: ["flying_hover", "fear"], specialHint: "wings", visualPreset: "secret_banshee", behaviorPreset: "secret_banshee", controlStrength: 1.3 }],
  ["necromancer", "Necromancer", 2000, "summoner", { abilities: ["revive", "summon"], summonUnitIds: ["spooky.skeleton_warrior"], summonCount: 2, weaponHint: "bone_staff", visualPreset: "secret_necromancer", behaviorPreset: "secret_necromancer", cooldownMultiplier: 0.72 }],
  ["solar_architect", "Solar Architect", 2200, "special_magic", { abilities: ["lightning_strike"], weaponHint: "staff", visualPreset: "secret_solar_architect", behaviorPreset: "secret_solar_blast", controlStrength: 1.2 }],
  ["wheelbarrow_dragon", "Wheelbarrow Dragon", 2300, "charge_melee", { abilities: ["charge_impact", "fire_dot"], size: "large", specialHint: "cart", visualPreset: "secret_wheelbarrow_dragon", behaviorPreset: "secret_dragon_cart", controlStrength: 1.2 }],
  ["skeleton_giant", "Skeleton Giant", 2500, "giant_melee", { size: "colossal", abilities: ["giant_slam"], visualPreset: "secret_skeleton_giant", behaviorPreset: "secret_giant_slam", controlStrength: 1.4 }],
  ["bomb_cannon", "Bomb Cannon", 2600, "artillery", { projectileHint: "bomb", specialHint: "cannon", size: "large", visualPreset: "secret_bomb_cannon", behaviorPreset: "secret_bomb_cannon", volleyCount: 2 }],
  ["cavalry", "Cavalry", 2800, "charge_melee", { abilities: ["charge_impact"], specialHint: "horse", size: "large", weaponHint: "lance", visualPreset: "secret_cavalry", behaviorPreset: "secret_mounted_charge", controlStrength: 1.35 }],
  ["vlad", "Vlad", 3000, "heavy_melee", { abilities: ["pull_hook"], weaponHint: "spear", size: "large", visualPreset: "secret_vlad", behaviorPreset: "secret_vlad_hook", controlStrength: 1.7 }],
  ["gatling_gun", "Gatling Gun", 3200, "rapid_ranged", { abilities: ["rapid_fire"], specialHint: "cannon", projectileHint: "bolt", size: "large", visualPreset: "secret_gatling_gun", behaviorPreset: "secret_gatling", burstCount: 8, cooldownMultiplier: 0.55 }],
  ["blackbeard", "Blackbeard", 3400, "boss_melee", { abilities: ["push_force"], weaponHint: "cutlass", hatHint: "captain_hat", visualPreset: "secret_blackbeard", behaviorPreset: "secret_blackbeard", controlStrength: 1.7 }],
  ["samurai_giant", "Samurai Giant", 3600, "giant_melee", { size: "colossal", weaponHint: "katana", abilities: ["giant_slam"], visualPreset: "secret_samurai_giant", behaviorPreset: "secret_giant_slam", controlStrength: 1.4 }],
  ["ullr", "Ullr", 3800, "archer", { weaponHint: "bow", abilities: ["freeze"], engageRangeOverride: 15, visualPreset: "secret_ullr", behaviorPreset: "secret_ullr", volleyCount: 3, statusDurationSeconds: 2.8 }],
  ["lady_red_jade", "Lady Red Jade", 4000, "boss_melee", { abilities: ["jump_charge"], weaponHint: "sword", visualPreset: "secret_lady_red_jade", behaviorPreset: "secret_lady_red_jade", cooldownMultiplier: 0.72 }],
  ["sensei", "Sensei", 4200, "rapid_ranged", { abilities: ["rapid_fire"], projectileHint: "shuriken", hatHint: "conical_hat", visualPreset: "secret_sensei", behaviorPreset: "secret_sensei", burstCount: 7, cooldownMultiplier: 0.7 }],
  ["shogun", "Shogun", 4500, "boss_melee", { abilities: ["parry"], weaponHint: "katana", hatHint: "samurai_helmet", visualPreset: "secret_shogun", behaviorPreset: "secret_shogun", cooldownMultiplier: 0.82 }],
  ["tree_giant", "Tree Giant", 5000, "giant_melee", { size: "colossal", abilities: ["giant_slam"], specialHint: "mammoth", visualPreset: "secret_tree_giant", behaviorPreset: "secret_giant_slam", controlStrength: 1.6 }],
  ["artemis", "Artemis", 5500, "special_magic", { abilities: ["volley_fire"], projectileHint: "arrow", weaponHint: "bow", visualPreset: "secret_artemis", behaviorPreset: "secret_artemis", volleyCount: 8, cooldownMultiplier: 0.78 }],
  ["ice_giant", "Ice Giant", 6000, "giant_melee", { size: "colossal", abilities: ["freeze", "giant_slam"], specialHint: "mammoth", visualPreset: "secret_ice_giant", behaviorPreset: "secret_ice_giant", controlStrength: 1.55, statusDurationSeconds: 3.4 }],
]);

export const ROSTER_MANIFEST: RosterManifestEntry[] = [
  ...tribal,
  ...farmer,
  ...medieval,
  ...ancient,
  ...viking,
  ...dynasty,
  ...renaissance,
  ...pirate,
  ...spooky,
  ...wildWest,
  ...legacy,
  ...good,
  ...evil,
  ...secret,
];

export const EXPECTED_FACTION_COUNTS: Record<FactionId, number> = {
  [FactionId.Tribal]: 7,
  [FactionId.Farmer]: 7,
  [FactionId.Medieval]: 7,
  [FactionId.Ancient]: 7,
  [FactionId.Viking]: 7,
  [FactionId.Dynasty]: 7,
  [FactionId.Renaissance]: 7,
  [FactionId.Pirate]: 7,
  [FactionId.Spooky]: 7,
  [FactionId.WildWest]: 7,
  [FactionId.Legacy]: 16,
  [FactionId.Good]: 7,
  [FactionId.Evil]: 7,
  [FactionId.Secret]: 39,
};
