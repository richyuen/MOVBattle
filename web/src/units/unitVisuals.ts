import type { BodyProportions } from "./bodyBuilder";

export type WeaponType =
  | "none" | "club" | "sword" | "greatsword" | "spear" | "javelin"
  | "axe" | "hammer" | "mace" | "staff" | "dagger"
  | "bow" | "crossbow" | "musket" | "flintlock" | "blunderbuss" | "cannon_hand"
  | "shield_sword" | "halberd" | "lance"
  | "scythe" | "pitchfork" | "frying_pan" | "broom" | "wheelbarrow_weapon"
  | "bone_staff" | "lute" | "paintbrush" | "rapier"
  | "harpoon" | "cutlass" | "bomb" | "torch"
  | "katana" | "nunchaku" | "shuriken_hand" | "bo_staff";

export type HatType =
  | "none" | "crown" | "helmet" | "viking_helmet" | "horned_helmet"
  | "hood" | "turban" | "conical_hat" | "tricorn" | "bandana"
  | "laurel" | "plume_helmet" | "straw_hat" | "beret"
  | "samurai_helmet" | "ninja_mask" | "monk_headband"
  | "pharaoh" | "feather_headdress" | "bone_mask"
  | "pirate_hat" | "captain_hat";

export type ShieldType = "none" | "round" | "kite" | "tower" | "buckler";

export type SpecialType =
  | "none" | "mount_mammoth" | "mount_horse" | "wings" | "cape"
  | "barrel_body" | "cart" | "longship_body" | "tank_body"
  | "catapult_arm" | "cannon_base" | "hwacha_rack" | "ballista_frame"
  | "balloon" | "dragon_wings" | "scarecrow_post";

export interface UnitVisualConfig {
  proportions: Partial<BodyProportions>;
  weapon: WeaponType;
  offhandWeapon?: WeaponType;
  hat: HatType;
  shield: ShieldType;
  special: SpecialType;
  /** Extra color accent for weapon/props (hex) */
  accentColor?: string;
}

function vis(
  proportions: Partial<BodyProportions>,
  weapon: WeaponType,
  hat: HatType,
  shield: ShieldType = "none",
  special: SpecialType = "none",
  accentColor?: string,
  offhandWeapon?: WeaponType,
): UnitVisualConfig {
  return { proportions, weapon, offhandWeapon, hat, shield, special, accentColor };
}

/**
 * Visual config for every unit in the game, keyed by unit id.
 */
export const UNIT_VISUALS: Record<string, UnitVisualConfig> = {
  // ═══════════════════════ TRIBAL ═══════════════════════
  "tribal.clubber": vis(
    { scale: 0.9, bulk: 0.9 }, "club", "none", "none", "none", "#8B4513",
  ),
  "tribal.protector": vis(
    { scale: 1.0, bulk: 1.1 }, "spear", "bone_mask", "round", "none", "#D2B48C",
  ),
  "tribal.spear_thrower": vis(
    { scale: 0.95, armLength: 1.1 }, "javelin", "feather_headdress", "none", "none", "#CD853F",
  ),
  "tribal.stoner": vis(
    { scale: 1.05, bulk: 1.15 }, "bomb", "none", "none", "none", "#808080",
  ),
  "tribal.bone_mage": vis(
    { scale: 1.1, headSize: 1.15 }, "bone_staff", "bone_mask", "none", "none", "#FFFFF0",
  ),
  "tribal.chieftain": vis(
    { scale: 1.35, bulk: 1.3, headSize: 1.1 }, "greatsword", "feather_headdress", "none", "cape", "#FFD700",
  ),
  "tribal.mammoth": vis(
    { scale: 2.8, bulk: 2.0, headSize: 1.6, legLength: 0.8 }, "none", "none", "none", "mount_mammoth", "#8B7355",
  ),

  // ═══════════════════════ FARMER ═══════════════════════
  "farmer.halfling": vis(
    { scale: 0.65, headSize: 1.3, legLength: 0.7 }, "frying_pan", "none", "none", "none", "#696969",
  ),
  "farmer.farmer": vis(
    { scale: 0.95, bulk: 0.95 }, "pitchfork", "straw_hat", "none", "none", "#8B7355",
  ),
  "farmer.hay_baler": vis(
    { scale: 1.15, bulk: 1.3 }, "hammer", "straw_hat", "none", "none", "#DAA520",
  ),
  "farmer.potion_seller": vis(
    { scale: 0.95, headSize: 1.1 }, "bomb", "hood", "none", "none", "#9932CC",
  ),
  "farmer.harvester": vis(
    { scale: 1.2, bulk: 1.2, armLength: 1.1 }, "scythe", "bandana", "none", "none", "#556B2F",
  ),
  "farmer.wheelbarrow": vis(
    { scale: 1.4, bulk: 1.5 }, "hammer", "straw_hat", "none", "cart", "#8B4513",
  ),
  "farmer.scarecrow": vis(
    { scale: 1.3, bulk: 0.8, armLength: 1.3 }, "crossbow", "straw_hat", "none", "scarecrow_post", "#DAA520",
  ),

  // ═══════════════════════ MEDIEVAL ═══════════════════════
  "medieval.bard": vis(
    { scale: 0.85, bulk: 0.8 }, "lute", "beret", "none", "none", "#8B008B",
  ),
  "medieval.squire": vis(
    { scale: 1.0, bulk: 1.0 }, "sword", "helmet", "buckler", "none", "#C0C0C0",
  ),
  "medieval.archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood", "none", "none", "#228B22",
  ),
  "medieval.healer": vis(
    { scale: 0.95, headSize: 1.05 }, "staff", "hood", "none", "none", "#FFD700",
  ),
  "medieval.knight": vis(
    { scale: 1.25, bulk: 1.4 }, "greatsword", "plume_helmet", "kite", "cape", "#C0C0C0",
  ),
  "medieval.catapult": vis(
    { scale: 1.6, bulk: 1.8, legLength: 0.7 }, "none", "helmet", "none", "catapult_arm", "#8B4513",
  ),
  "medieval.king": vis(
    { scale: 1.5, bulk: 1.3, headSize: 1.1 }, "greatsword", "crown", "none", "cape", "#FFD700",
  ),

  // ═══════════════════════ ANCIENT ═══════════════════════
  "ancient.shield_bearer": vis(
    { scale: 1.0, bulk: 1.1 }, "sword", "helmet", "tower", "none", "#CD853F",
  ),
  "ancient.sarissa": vis(
    { scale: 1.05, armLength: 1.15 }, "spear", "helmet", "round", "none", "#B8860B",
  ),
  "ancient.hoplite": vis(
    { scale: 1.15, bulk: 1.2 }, "spear", "plume_helmet", "round", "none", "#DAA520",
  ),
  "ancient.ballista": vis(
    { scale: 1.5, bulk: 1.6, legLength: 0.7 }, "none", "helmet", "none", "ballista_frame", "#8B7355",
  ),
  "ancient.snake_archer": vis(
    { scale: 1.0, armLength: 1.1 }, "bow", "turban", "none", "none", "#6B8E23",
  ),
  "ancient.minotaur": vis(
    { scale: 1.7, bulk: 1.6, headSize: 1.4 }, "axe", "horned_helmet", "none", "none", "#8B0000",
  ),
  "ancient.zeus": vis(
    { scale: 1.8, bulk: 1.3, headSize: 1.2 }, "staff", "laurel", "none", "cape", "#87CEEB",
  ),

  // ═══════════════════════ VIKING ═══════════════════════
  "viking.headbutter": vis(
    { scale: 1.0, headSize: 1.3, bulk: 1.1 }, "none", "viking_helmet", "none", "none", "#808080",
  ),
  "viking.ice_archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood", "none", "none", "#ADD8E6",
  ),
  "viking.brawler": vis(
    { scale: 1.1, bulk: 1.2 }, "axe", "viking_helmet", "round", "none", "#A0522D",
  ),
  "viking.berserker": vis(
    { scale: 1.15, bulk: 1.1, armLength: 1.1 }, "axe", "horned_helmet", "none", "none", "#8B0000",
  ),
  "viking.valkyrie": vis(
    { scale: 1.2, bulk: 1.0, armLength: 1.05 }, "sword", "plume_helmet", "round", "wings", "#E6E6FA",
  ),
  "viking.longship": vis(
    { scale: 1.8, bulk: 2.0, legLength: 0.6 }, "axe", "viking_helmet", "round", "longship_body", "#8B7355",
  ),
  "viking.jarl": vis(
    { scale: 1.55, bulk: 1.4, headSize: 1.1 }, "greatsword", "horned_helmet", "none", "cape", "#FFD700",
  ),

  // ═══════════════════════ DYNASTY ═══════════════════════
  "dynasty.samurai": vis(
    { scale: 1.1, bulk: 1.1 }, "katana", "samurai_helmet", "none", "none", "#C41E3A",
  ),
  "dynasty.firework_archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "conical_hat", "none", "none", "#FF4500",
  ),
  "dynasty.monk": vis(
    { scale: 1.1, bulk: 1.15 }, "bo_staff", "monk_headband", "none", "none", "#FF8C00",
  ),
  "dynasty.ninja": vis(
    { scale: 0.9, bulk: 0.85, armLength: 1.05 }, "shuriken_hand", "ninja_mask", "none", "none", "#1C1C1C",
  ),
  "dynasty.dragon": vis(
    { scale: 1.6, bulk: 1.3, headSize: 1.4 }, "torch", "none", "none", "dragon_wings", "#FF4500",
  ),
  "dynasty.hwacha": vis(
    { scale: 1.5, bulk: 1.6, legLength: 0.7 }, "none", "conical_hat", "none", "hwacha_rack", "#8B4513",
  ),
  "dynasty.monkey_king": vis(
    { scale: 1.6, bulk: 1.2, headSize: 1.2, armLength: 1.15 }, "bo_staff", "crown", "none", "cape", "#FFD700",
  ),

  // ═══════════════════════ RENAISSANCE ═══════════════════════
  "renaissance.painter": vis(
    { scale: 0.9, bulk: 0.9 }, "paintbrush", "beret", "none", "none", "#FF69B4",
  ),
  "renaissance.fencer": vis(
    { scale: 1.05, bulk: 0.9, armLength: 1.1 }, "rapier", "plume_helmet", "none", "cape", "#FFFFFF",
  ),
  "renaissance.balloon_archer": vis(
    { scale: 0.9, armLength: 1.05 }, "bow", "beret", "none", "balloon", "#FFB6C1",
  ),
  "renaissance.musketeer": vis(
    { scale: 1.05, bulk: 1.0 }, "musket", "plume_helmet", "none", "none", "#191970",
  ),
  "renaissance.halberd": vis(
    { scale: 1.2, bulk: 1.2 }, "halberd", "helmet", "none", "none", "#4682B4",
  ),
  "renaissance.jouster": vis(
    { scale: 1.4, bulk: 1.3 }, "lance", "plume_helmet", "kite", "mount_horse", "#C0C0C0",
  ),
  "renaissance.da_vinci_tank": vis(
    { scale: 2.0, bulk: 2.2, legLength: 0.5 }, "cannon_hand", "none", "none", "tank_body", "#8B7355",
  ),

  // ═══════════════════════ PIRATE ═══════════════════════
  "pirate.flintlock": vis(
    { scale: 0.95, bulk: 0.95 }, "flintlock", "bandana", "none", "none", "#8B4513",
  ),
  "pirate.blunderbuss": vis(
    { scale: 1.05, bulk: 1.1 }, "blunderbuss", "tricorn", "none", "none", "#696969",
  ),
  "pirate.bomb_thrower": vis(
    { scale: 1.0, bulk: 1.0 }, "bomb", "bandana", "none", "none", "#2F4F4F",
  ),
  "pirate.harpooner": vis(
    { scale: 1.05, armLength: 1.15 }, "harpoon", "bandana", "none", "none", "#708090",
  ),
  "pirate.captain": vis(
    { scale: 1.35, bulk: 1.3 }, "cutlass", "captain_hat", "none", "cape", "#DAA520",
  ),
  "pirate.cannon": vis(
    { scale: 1.6, bulk: 1.8, legLength: 0.7 }, "none", "bandana", "none", "cannon_base", "#2F4F4F",
  ),
  "pirate.pirate_queen": vis(
    { scale: 1.6, bulk: 1.2, headSize: 1.1 }, "cutlass", "pirate_hat", "none", "cape", "#FF1493",
  ),
};

export function getUnitVisual(id: string): UnitVisualConfig {
  return UNIT_VISUALS[id] ?? vis({ scale: 1.0 }, "club", "none");
}
