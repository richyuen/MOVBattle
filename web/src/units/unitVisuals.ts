import type { BodyProportions } from "./bodyBuilder";
import { FactionId } from "../data/factionColors";
import { getUnit } from "../data/unitDefinitions";

export type WeaponType =
  | "none" | "club" | "sword" | "greatsword" | "spear" | "javelin"
  | "axe" | "hammer" | "mace" | "staff" | "dagger"
  | "bow" | "crossbow" | "musket" | "flintlock" | "blunderbuss" | "cannon_hand"
  | "shield_sword" | "halberd" | "lance"
  | "scythe" | "pitchfork" | "frying_pan" | "broom" | "wheelbarrow_weapon"
  | "bone_staff" | "lute" | "paintbrush" | "rapier"
  | "harpoon" | "cutlass" | "bomb" | "torch"
  | "katana" | "nunchaku" | "shuriken_hand" | "bo_staff"
  | "stone" | "hay_bale" | "potion" | "lightning_bolt"
  | "fan" | "flail" | "whip" | "present_box" | "pom_pom";

export type HatType =
  | "none" | "crown" | "helmet" | "viking_helmet" | "horned_helmet"
  | "hood" | "turban" | "conical_hat" | "tricorn" | "bandana"
  | "laurel" | "plume_helmet" | "straw_hat" | "beret"
  | "samurai_helmet" | "ninja_mask" | "monk_headband"
  | "pharaoh" | "feather_headdress" | "bone_mask"
  | "pirate_hat" | "captain_hat"
  | "great_helm" | "hood_liripipe" | "jester_cap";

export type ShieldType = "none" | "round" | "kite" | "tower" | "buckler";

export type SpecialType =
  | "none" | "mount_mammoth" | "mount_horse" | "wings" | "cape"
  | "barrel_body" | "cart" | "longship_body" | "tank_body"
  | "catapult_arm" | "cannon_base" | "hwacha_rack" | "ballista_frame"
  | "balloon" | "dragon_wings" | "scarecrow_post" | "monk_robe"
  | "raptor_mount" | "clam_shell" | "safe_bundle" | "dragon_cart"
  | "giant_bones" | "giant_tree" | "giant_ice" | "halo";

export type VisualStateTag = "idle" | "moving" | "attacking" | "ability-active";

export type PosePreset =
  | "default"
  | "archer"
  | "caster"
  | "shouter"
  | "duelist"
  | "spinner"
  | "giant"
  | "mounted"
  | "support"
  | "beast"
  | "vehicle";

export type MaterialPreset =
  | "default"
  | "secret_hero"
  | "secret_ghost"
  | "secret_ice"
  | "secret_nature"
  | "secret_bone"
  | "secret_demon"
  | "secret_holy"
  | "secret_bandit"
  | "secret_beast"
  | "secret_pirate"
  | "secret_festive"
  | "secret_royal";

export type AttachmentPreset =
  | "none"
  | "storm_halo"
  | "crow_swarm"
  | "chrono_ring"
  | "shadow_orbit"
  | "quickdraw_smoke"
  | "reaper_aura"
  | "super_aura"
  | "fan_bearer"
  | "bow_ready"
  | "crossbow_ready"
  | "shouter"
  | "cheerleader"
  | "summoner"
  | "infernal_whip"
  | "hero_halo"
  | "ghost_trail"
  | "giant_aura"
  | "present_elf"
  | "bank_robbers"
  | "bomb_lit"
  | "dragon_cart_fx";

export type FxPreset = "none" | "frost" | "ember" | "spectral" | "solar" | "royal" | "wind";

export interface UnitVisualConfig {
  proportions: Partial<BodyProportions>;
  weapon: WeaponType;
  offhandWeapon?: WeaponType;
  hat: HatType;
  shield: ShieldType;
  special: SpecialType;
  /** Extra color accent for weapon/props (hex) */
  accentColor?: string;
  posePreset?: PosePreset;
  materialPreset?: MaterialPreset;
  attachmentPreset?: AttachmentPreset;
  fxPreset?: FxPreset;
  stateVariants?: Partial<Record<VisualStateTag, string[]>>;
}

function vis(
  proportions: Partial<BodyProportions>,
  weapon: WeaponType,
  hat: HatType,
  shield: ShieldType = "none",
  special: SpecialType = "none",
  accentColor?: string,
  offhandWeapon?: WeaponType,
  extras: Partial<Omit<UnitVisualConfig, "proportions" | "weapon" | "offhandWeapon" | "hat" | "shield" | "special" | "accentColor">> = {},
): UnitVisualConfig {
  return {
    proportions,
    weapon,
    offhandWeapon,
    hat,
    shield,
    special,
    accentColor,
    posePreset: "default",
    materialPreset: "default",
    attachmentPreset: "none",
    fxPreset: "none",
    ...extras,
  };
}

/**
 * Visual config for every unit in the game, keyed by unit id.
 */
export const UNIT_VISUALS: Record<string, UnitVisualConfig> = {
  // ═══════════════════════ TRIBAL ═══════════════════════
  "tribal.clubber": vis(
    { scale: 0.9, bulk: 0.9, headSize: 1.1 }, "club", "none", "none", "none", "#8B4513",
  ),
  "tribal.protector": vis(
    { scale: 1.0, bulk: 1.1 }, "spear", "bone_mask", "round", "none", "#D2B48C",
  ),
  "tribal.spear_thrower": vis(
    { scale: 0.95, armLength: 1.1 }, "javelin", "none", "none", "none", "#CD853F",
  ),
  "tribal.stoner": vis(
    { scale: 1.05, bulk: 1.15 }, "stone", "none", "none", "none", "#808080",
  ),
  "tribal.bone_mage": vis(
    { scale: 1.1, headSize: 1.15 }, "bone_staff", "bone_mask", "none", "none", "#FFFFF0",
  ),
  "tribal.chieftain": vis(
    { scale: 1.35, bulk: 1.3, headSize: 1.1 }, "club", "feather_headdress", "none", "cape", "#FFD700",
  ),
  "tribal.mammoth": vis(
    { scale: 2.8, bulk: 2.0, headSize: 1.6, legLength: 0.8 }, "none", "none", "none", "mount_mammoth", "#8B7355",
  ),

  // ═══════════════════════ FARMER ═══════════════════════
  "farmer.halfling": vis(
    { scale: 0.65, headSize: 1.3, legLength: 0.7 }, "frying_pan", "none", "none", "none", "#696969",
  ),
  "farmer.farmer": vis(
    { scale: 0.95, bulk: 0.95 }, "pitchfork", "hood_liripipe", "none", "none", "#4A7A2E",
  ),
  "farmer.hay_baler": vis(
    { scale: 1.25, bulk: 1.4 }, "hay_bale", "straw_hat", "none", "none", "#DAA520",
  ),
  "farmer.potion_seller": vis(
    { scale: 0.95, headSize: 1.1 }, "potion", "hood", "none", "none", "#9932CC",
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
    { scale: 0.85, bulk: 0.8 }, "lute", "beret", "none", "none", "#9B30FF",
  ),
  "medieval.squire": vis(
    { scale: 1.0, bulk: 1.0 }, "sword", "great_helm", "none", "none", "#C0C0C0",
  ),
  "medieval.archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood_liripipe", "none", "none", "#228B22",
  ),
  "medieval.healer": vis(
    { scale: 0.95, headSize: 1.05 }, "staff", "hood", "none", "none", "#FFD700",
  ),
  "medieval.knight": vis(
    { scale: 1.25, bulk: 1.4 }, "sword", "plume_helmet", "kite", "cape", "#C0C0C0",
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
    { scale: 1.05, armLength: 1.3 }, "spear", "helmet", "buckler", "none", "#B8860B",
  ),
  "ancient.hoplite": vis(
    { scale: 1.15, bulk: 1.2 }, "spear", "plume_helmet", "round", "none", "#DAA520",
  ),
  "ancient.ballista": vis(
    { scale: 1.5, bulk: 1.6, legLength: 0.7 }, "none", "helmet", "none", "ballista_frame", "#8B7355",
  ),
  "ancient.snake_archer": vis(
    { scale: 1.0, armLength: 1.1 }, "bow", "pharaoh", "none", "none", "#2E8B57",
  ),
  "ancient.minotaur": vis(
    { scale: 1.7, bulk: 1.6, headSize: 1.4 }, "axe", "horned_helmet", "none", "none", "#8B0000",
  ),
  "ancient.zeus": vis(
    { scale: 1.8, bulk: 1.3, headSize: 1.2 }, "lightning_bolt", "laurel", "none", "cape", "#87CEEB",
  ),

  // ═══════════════════════ VIKING ═══════════════════════
  "viking.headbutter": vis(
    { scale: 1.0, headSize: 1.5, bulk: 1.1 }, "none", "viking_helmet", "none", "none", "#808080",
  ),
  "viking.ice_archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood", "none", "none", "#ADD8E6",
  ),
  "viking.brawler": vis(
    { scale: 1.1, bulk: 1.2 }, "axe", "viking_helmet", "round", "none", "#A0522D",
  ),
  "viking.berserker": vis(
    { scale: 1.15, bulk: 1.1, armLength: 1.1 }, "axe", "horned_helmet", "none", "none", "#8B0000", "axe",
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
    { scale: 1.1, bulk: 1.15 }, "none", "monk_headband", "none", "monk_robe", "#FF8C00",
  ),
  "dynasty.ninja": vis(
    { scale: 0.9, bulk: 0.85, armLength: 1.05 }, "shuriken_hand", "ninja_mask", "none", "none", "#1A1A1A",
  ),
  "dynasty.dragon": vis(
    { scale: 1.6, bulk: 1.3, headSize: 1.5 }, "none", "none", "none", "dragon_wings", "#1A1A1A",
  ),
  "dynasty.hwacha": vis(
    { scale: 1.5, bulk: 1.6, legLength: 0.7 }, "none", "conical_hat", "none", "hwacha_rack", "#8B4513",
  ),
  "dynasty.monkey_king": vis(
    { scale: 1.6, bulk: 1.2, headSize: 1.4, armLength: 1.3 }, "bo_staff", "crown", "none", "cape", "#8B5A2B",
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
    { scale: 1.25, bulk: 1.25 }, "halberd", "helmet", "none", "none", "#4682B4",
  ),
  "renaissance.jouster": vis(
    { scale: 1.4, bulk: 1.3 }, "lance", "plume_helmet", "kite", "mount_horse", "#C0C0C0",
  ),
  "renaissance.da_vinci_tank": vis(
    { scale: 2.0, bulk: 2.2, legLength: 0.5 }, "cannon_hand", "none", "none", "tank_body", "#8B7355",
  ),

  // ═══════════════════════ PIRATE ═══════════════════════
  "pirate.flintlock": vis(
    { scale: 0.95, bulk: 0.95 }, "flintlock", "tricorn", "none", "none", "#8B4513",
  ),
  "pirate.blunderbuss": vis(
    { scale: 1.05, bulk: 1.1 }, "blunderbuss", "tricorn", "none", "none", "#696969",
  ),
  "pirate.bomb_thrower": vis(
    { scale: 1.0, bulk: 1.0 }, "bomb", "tricorn", "none", "none", "#2F4F4F",
  ),
  "pirate.harpooner": vis(
    { scale: 1.05, armLength: 1.15 }, "harpoon", "bandana", "none", "none", "#708090",
  ),
  "pirate.captain": vis(
    { scale: 1.35, bulk: 1.3 }, "cutlass", "captain_hat", "none", "cape", "#DAA520",
  ),
  "pirate.cannon": vis(
    { scale: 1.6, bulk: 1.8, legLength: 0.7 }, "none", "tricorn", "none", "cannon_base", "#2F4F4F",
  ),
  "pirate.pirate_queen": vis(
    { scale: 1.6, bulk: 1.2, headSize: 1.1 }, "cutlass", "pirate_hat", "none", "cape", "#FF1493",
  ),
};

export function getUnitVisual(id: string): UnitVisualConfig {
  const presetVisual = getPresetVisual(id);
  if (presetVisual) return presetVisual;
  if (UNIT_VISUALS[id]) return UNIT_VISUALS[id];

  const def = getUnit(id);
  if (def?.faction === FactionId.Secret) {
    throw new Error(`Missing explicit Secret visual preset for ${id}`);
  }

  return inferUnitVisual(id);
}

function getPresetVisual(id: string): UnitVisualConfig | null {
  const def = getUnit(id);
  const preset = def?.visualPreset;
  if (!preset) return null;

  switch (preset) {
    case "iconic_zeus":
      return vis({ scale: 1.7, bulk: 1.08, headSize: 1.16, armLength: 1.16 }, "lightning_bolt", "laurel", "none", "cape", "#f7dd6f", undefined, {
        posePreset: "caster", materialPreset: "secret_holy", attachmentPreset: "storm_halo", fxPreset: "solar",
        stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
      });
    case "iconic_thor":
      return vis({ scale: 1.68, bulk: 1.18, headSize: 1.1, armLength: 1.12 }, "hammer", "horned_helmet", "none", "cape", "#8ec7ff", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", attachmentPreset: "storm_halo", fxPreset: "wind",
        stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
      });
    case "iconic_mammoth":
      return vis({ scale: 2.9, bulk: 2.1, headSize: 1.5, legLength: 0.82 }, "none", "none", "none", "mount_mammoth", "#8b7355", undefined, {
        posePreset: "vehicle", materialPreset: "secret_beast",
      });
    case "iconic_scarecrow":
      return vis({ scale: 1.34, bulk: 0.76, armLength: 1.34, legLength: 1.05 }, "crossbow", "straw_hat", "none", "scarecrow_post", "#d5a743", undefined, {
        posePreset: "archer", materialPreset: "secret_festive", attachmentPreset: "crow_swarm", fxPreset: "wind",
        stateVariants: { attacking: ["crow_swarm"], "ability-active": ["crow_swarm"] },
      });
    case "iconic_reaper":
      return vis({ scale: 1.92, bulk: 1.5, headSize: 1.12, armLength: 1.18 }, "scythe", "hood", "none", "cape", "#6f6d86", undefined, {
        posePreset: "giant", materialPreset: "secret_ghost", attachmentPreset: "reaper_aura", fxPreset: "spectral",
        stateVariants: { moving: ["reaper_trail"], attacking: ["reaper_trail", "reaper_arc"], "ability-active": ["reaper_trail", "reaper_arc"] },
      });
    case "iconic_quick_draw":
      return vis({ scale: 1.08, bulk: 0.94, armLength: 1.12 }, "flintlock", "captain_hat", "none", "cape", "#a56c34", "flintlock", {
        posePreset: "duelist", materialPreset: "secret_bandit", attachmentPreset: "quickdraw_smoke",
        stateVariants: { attacking: ["quickdraw_smoke"] },
      });
    case "iconic_chronomancer":
      return vis({ scale: 1.3, bulk: 0.96, headSize: 1.1 }, "staff", "laurel", "none", "halo", "#b8e6ff", undefined, {
        posePreset: "caster", materialPreset: "secret_ice", attachmentPreset: "chrono_ring", fxPreset: "wind",
        stateVariants: { attacking: ["chrono_ring"], "ability-active": ["chrono_ring"] },
      });
    case "iconic_dark_peasant":
      return vis({ scale: 2.08, bulk: 1.64, headSize: 1.16, armLength: 1.22 }, "none", "hood", "none", "cape", "#3b2b59", undefined, {
        posePreset: "giant", materialPreset: "secret_ghost", attachmentPreset: "shadow_orbit", fxPreset: "spectral",
        stateVariants: { moving: ["shadow_orbit"], attacking: ["shadow_orbit"], "ability-active": ["shadow_orbit"] },
      });
    case "iconic_super_peasant":
      return vis({ scale: 2.02, bulk: 1.18, headSize: 1.08, armLength: 1.2, legLength: 1.08 }, "none", "laurel", "none", "cape", "#f3d45a", undefined, {
        posePreset: "giant", materialPreset: "secret_hero", attachmentPreset: "super_aura", fxPreset: "solar",
        stateVariants: { moving: ["super_aura"], attacking: ["super_aura"], "ability-active": ["super_aura"] },
      });
    case "iconic_hwacha":
      return vis({ scale: 1.55, bulk: 1.7, legLength: 0.72 }, "none", "conical_hat", "none", "hwacha_rack", "#8b4513", undefined, {
        posePreset: "vehicle", materialPreset: "secret_bandit",
      });
    case "iconic_da_vinci_tank":
      return vis({ scale: 2.0, bulk: 2.2, legLength: 0.52 }, "none", "none", "none", "tank_body", "#8b7355", undefined, {
        posePreset: "vehicle", materialPreset: "secret_holy",
      });
    case "iconic_legacy_tank":
      return vis({ scale: 2.2, bulk: 2.4, legLength: 0.48 }, "none", "none", "none", "tank_body", "#5f6f52", undefined, {
        posePreset: "vehicle", materialPreset: "secret_bandit",
      });
    case "iconic_monkey_king":
      return vis({ scale: 1.72, bulk: 1.18, headSize: 1.14, armLength: 1.28 }, "bo_staff", "crown", "none", "cape", "#9a6a2d", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", attachmentPreset: "hero_halo", fxPreset: "royal",
        stateVariants: { moving: ["halo_flare"], attacking: ["halo_flare"], "ability-active": ["halo_flare"] },
      });
    case "iconic_pirate_queen":
      return vis({ scale: 1.72, bulk: 1.24, headSize: 1.08, armLength: 1.08 }, "cutlass", "pirate_hat", "none", "cape", "#ff4f8a", "flintlock", {
        posePreset: "duelist", materialPreset: "secret_pirate", attachmentPreset: "quickdraw_smoke",
        stateVariants: { attacking: ["quickdraw_smoke"] },
      });
    case "secret_ballooner":
      return vis({ scale: 1.0, bulk: 0.9, armLength: 1.1 }, "dagger", "none", "none", "balloon", "#ff9db5", undefined, {
        posePreset: "support", materialPreset: "secret_festive", fxPreset: "wind", attachmentPreset: "ghost_trail",
        stateVariants: { moving: ["ghost_stream"], "ability-active": ["ghost_stream"] },
      });
    case "secret_bomb_on_a_stick":
      return vis({ scale: 1.0, bulk: 1.0, armLength: 1.1 }, "bomb", "none", "none", "none", "#3a3a3a", undefined, {
        materialPreset: "secret_bandit", attachmentPreset: "bomb_lit",
        stateVariants: { attacking: ["lit_fuse"], "ability-active": ["lit_fuse"] },
      });
    case "secret_fan_bearer":
      return vis({ scale: 1.0, bulk: 0.9, armLength: 1.15 }, "fan", "conical_hat", "none", "none", "#ead8a6", undefined, {
        posePreset: "caster", materialPreset: "secret_holy", attachmentPreset: "fan_bearer", fxPreset: "wind",
        stateVariants: { idle: ["fan_closed"], moving: ["fan_closed"], attacking: ["fan_open"], "ability-active": ["fan_open", "gust_ring"] },
      });
    case "secret_raptor":
      return vis({ scale: 1.2, bulk: 0.95, headSize: 0.95, armLength: 0.7, legLength: 1.2 }, "none", "none", "none", "raptor_mount", "#7c8a4b", undefined, {
        posePreset: "beast", materialPreset: "secret_beast",
      });
    case "secret_teacher":
      return vis({ scale: 1.12, bulk: 0.95, armLength: 1.15 }, "katana", "none", "none", "none", "#3b3b3b", undefined, {
        posePreset: "duelist", materialPreset: "secret_bandit",
      });
    case "secret_jester":
      return vis({ scale: 1.0, bulk: 0.88, headSize: 1.08 }, "dagger", "jester_cap", "none", "none", "#d43d3d", "dagger", {
        posePreset: "duelist", materialPreset: "secret_festive",
      });
    case "secret_ball_n_chain":
      return vis({ scale: 1.22, bulk: 1.25 }, "flail", "hood", "none", "none", "#5d5d5d", undefined, {
        posePreset: "spinner", materialPreset: "secret_bandit",
      });
    case "secret_chu_ko_nu":
      return vis({ scale: 1.0, bulk: 0.95, armLength: 1.05 }, "crossbow", "conical_hat", "none", "none", "#7e4b2d", undefined, {
        posePreset: "archer", materialPreset: "secret_bandit", attachmentPreset: "crossbow_ready",
        stateVariants: { attacking: ["crossbow_bolt"] },
      });
    case "secret_executioner":
      return vis({ scale: 1.42, bulk: 1.4, headSize: 1.05 }, "axe", "hood", "none", "cape", "#4a1f1f", undefined, {
        posePreset: "duelist", materialPreset: "secret_demon",
      });
    case "secret_shouter":
      return vis({ scale: 1.35, bulk: 1.25, headSize: 1.18 }, "none", "none", "none", "cape", "#92d7ff", undefined, {
        posePreset: "shouter", materialPreset: "secret_holy", attachmentPreset: "shouter", fxPreset: "wind",
        stateVariants: { attacking: ["shout_ring"], "ability-active": ["shout_ring"] },
      });
    case "secret_taekwondo":
      return vis({ scale: 1.05, bulk: 0.9, legLength: 1.1 }, "none", "bandana", "none", "none", "#f6f6f6", undefined, {
        posePreset: "duelist", materialPreset: "secret_holy",
      });
    case "secret_raptor_rider":
      return vis({ scale: 1.24, bulk: 1.1 }, "spear", "bone_mask", "none", "raptor_mount", "#8c6b45", undefined, {
        posePreset: "mounted", materialPreset: "secret_beast",
      });
    case "secret_cheerleader":
      return vis({ scale: 0.95, bulk: 0.88 }, "pom_pom", "bandana", "none", "none", "#f0d66a", "pom_pom", {
        posePreset: "support", materialPreset: "secret_festive", attachmentPreset: "cheerleader",
        stateVariants: { moving: ["pom_streamers"], attacking: ["pom_streamers"], "ability-active": ["pom_streamers"] },
      });
    case "secret_cupid":
      return vis({ scale: 0.9, bulk: 0.85, armLength: 1.08 }, "bow", "none", "none", "wings", "#ffbfd1", undefined, {
        posePreset: "archer", materialPreset: "secret_holy", attachmentPreset: "bow_ready",
        stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
      });
    case "secret_mace_spinner":
      return vis({ scale: 1.3, bulk: 1.2 }, "mace", "helmet", "none", "none", "#8e8e8e", "mace", {
        posePreset: "spinner", materialPreset: "secret_bandit",
      });
    case "secret_clams":
      return vis({ scale: 1.18, bulk: 1.55, legLength: 0.8 }, "none", "none", "none", "clam_shell", "#8db4be", undefined, {
        posePreset: "support", materialPreset: "secret_holy", attachmentPreset: "summoner",
        stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
      });
    case "secret_present_elf":
      return vis({ scale: 0.95, bulk: 0.88 }, "present_box", "hood_liripipe", "none", "none", "#7ad957", undefined, {
        posePreset: "support", materialPreset: "secret_festive", attachmentPreset: "present_elf",
        stateVariants: { attacking: ["present_spark"], "ability-active": ["present_spark"] },
      });
    case "secret_ice_mage":
      return vis({ scale: 1.08, bulk: 0.95 }, "staff", "hood", "none", "none", "#87d8ff", undefined, {
        posePreset: "caster", materialPreset: "secret_ice", attachmentPreset: "summoner", fxPreset: "frost",
        stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
      });
    case "secret_infernal_whip":
      return vis({ scale: 1.12, bulk: 1.0, armLength: 1.15 }, "whip", "hood", "none", "none", "#ff7a2f", undefined, {
        posePreset: "duelist", materialPreset: "secret_demon", attachmentPreset: "infernal_whip", fxPreset: "ember",
        stateVariants: { attacking: ["flame_lash"], "ability-active": ["flame_lash"] },
      });
    case "secret_bank_robbers":
      return vis({ scale: 1.08, bulk: 1.08 }, "flintlock", "bandana", "none", "safe_bundle", "#5b5b5b", "flintlock", {
        posePreset: "support", materialPreset: "secret_bandit", attachmentPreset: "bank_robbers",
        stateVariants: { attacking: ["loot_flash"] },
      });
    case "secret_witch":
      return vis({ scale: 1.05, bulk: 0.95, headSize: 1.08 }, "staff", "hood", "none", "cape", "#7d5ba6", undefined, {
        posePreset: "caster", materialPreset: "secret_ghost", attachmentPreset: "summoner", fxPreset: "spectral",
        stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
      });
    case "secret_banshee":
      return vis({ scale: 1.12, bulk: 0.88, armLength: 1.08 }, "none", "hood", "none", "wings", "#e8ecff", undefined, {
        posePreset: "support", materialPreset: "secret_ghost", attachmentPreset: "ghost_trail", fxPreset: "spectral",
        stateVariants: { moving: ["ghost_stream"], "ability-active": ["ghost_stream"] },
      });
    case "secret_necromancer":
      return vis({ scale: 1.12, bulk: 0.95, headSize: 1.08 }, "bone_staff", "hood", "none", "cape", "#ddd4bf", undefined, {
        posePreset: "caster", materialPreset: "secret_bone", attachmentPreset: "summoner", fxPreset: "spectral",
        stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
      });
    case "secret_solar_architect":
      return vis({ scale: 1.18, bulk: 0.98 }, "staff", "laurel", "none", "halo", "#f7dd6f", undefined, {
        posePreset: "caster", materialPreset: "secret_holy", attachmentPreset: "hero_halo", fxPreset: "solar",
        stateVariants: { attacking: ["halo_flare"], "ability-active": ["halo_flare"] },
      });
    case "secret_wheelbarrow_dragon":
      return vis({ scale: 1.42, bulk: 1.35 }, "none", "straw_hat", "none", "dragon_cart", "#7f4c2c", undefined, {
        posePreset: "mounted", materialPreset: "secret_beast", attachmentPreset: "dragon_cart_fx", fxPreset: "ember",
        stateVariants: { attacking: ["dragon_glow"], "ability-active": ["dragon_glow"] },
      });
    case "secret_skeleton_giant":
      return vis({ scale: 2.35, bulk: 1.7, headSize: 1.15, armLength: 1.12, legLength: 0.92 }, "none", "none", "none", "giant_bones", "#e5ddd0", undefined, {
        posePreset: "giant", materialPreset: "secret_bone", attachmentPreset: "giant_aura", fxPreset: "spectral",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    case "secret_bomb_cannon":
      return vis({ scale: 1.55, bulk: 1.65, legLength: 0.7 }, "none", "none", "none", "none", "#4a4a4a", undefined, {
        posePreset: "vehicle", materialPreset: "secret_bandit",
      });
    case "secret_cavalry":
      return vis({ scale: 1.32, bulk: 1.15 }, "lance", "plume_helmet", "kite", "mount_horse", "#c4b28a", undefined, {
        posePreset: "mounted", materialPreset: "secret_royal",
      });
    case "secret_vlad":
      return vis({ scale: 1.4, bulk: 1.22, headSize: 1.08 }, "spear", "captain_hat", "none", "cape", "#822f2f", undefined, {
        posePreset: "duelist", materialPreset: "secret_pirate",
      });
    case "secret_gatling_gun":
      return vis({ scale: 1.6, bulk: 1.75, legLength: 0.7 }, "none", "none", "none", "none", "#6f5f48", undefined, {
        posePreset: "vehicle", materialPreset: "secret_pirate",
      });
    case "secret_blackbeard":
      return vis({ scale: 1.58, bulk: 1.28, headSize: 1.08 }, "cutlass", "captain_hat", "none", "cape", "#5d3a1f", "flintlock", {
        posePreset: "duelist", materialPreset: "secret_pirate",
      });
    case "secret_samurai_giant":
      return vis({ scale: 2.3, bulk: 1.75, headSize: 1.16, armLength: 1.1, legLength: 0.95 }, "katana", "samurai_helmet", "none", "cape", "#b53333", undefined, {
        posePreset: "giant", materialPreset: "secret_royal", attachmentPreset: "giant_aura", fxPreset: "royal",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    case "secret_ullr":
      return vis({ scale: 1.28, bulk: 1.05, armLength: 1.08 }, "bow", "viking_helmet", "none", "cape", "#9cd5ff", "axe", {
        posePreset: "archer", materialPreset: "secret_ice", attachmentPreset: "bow_ready", fxPreset: "frost",
        stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
      });
    case "secret_lady_red_jade":
      return vis({ scale: 1.52, bulk: 1.18, headSize: 1.05 }, "sword", "crown", "none", "cape", "#cf2f2f", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", fxPreset: "royal",
      });
    case "secret_sensei":
      return vis({ scale: 1.32, bulk: 1.0, armLength: 1.1 }, "shuriken_hand", "conical_hat", "none", "cape", "#f5e4b4", "shuriken_hand", {
        posePreset: "duelist", materialPreset: "secret_holy",
      });
    case "secret_shogun":
      return vis({ scale: 1.58, bulk: 1.3, headSize: 1.08 }, "katana", "samurai_helmet", "none", "cape", "#a42323", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", fxPreset: "royal",
      });
    case "secret_tree_giant":
      return vis({ scale: 2.45, bulk: 1.85, headSize: 1.1, armLength: 1.12, legLength: 0.92 }, "none", "none", "none", "giant_tree", "#6f8a42", undefined, {
        posePreset: "giant", materialPreset: "secret_nature", attachmentPreset: "giant_aura",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    case "secret_artemis":
      return vis({ scale: 1.45, bulk: 1.02, armLength: 1.12 }, "bow", "laurel", "none", "halo", "#f5d566", undefined, {
        posePreset: "archer", materialPreset: "secret_hero", attachmentPreset: "hero_halo", fxPreset: "solar",
        stateVariants: { attacking: ["drawn_arrow", "halo_flare"], "ability-active": ["drawn_arrow", "halo_flare"] },
      });
    case "secret_ice_giant":
      return vis({ scale: 2.48, bulk: 1.88, headSize: 1.12, armLength: 1.12, legLength: 0.92 }, "none", "none", "none", "giant_ice", "#9fe9ff", undefined, {
        posePreset: "giant", materialPreset: "secret_ice", attachmentPreset: "giant_aura", fxPreset: "frost",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    default:
      return null;
  }
}

function inferUnitVisual(id: string): UnitVisualConfig {
  const def = getUnit(id);
  if (!def) return vis({ scale: 1.0 }, "club", "none");

  return vis(
    inferProportions(def.size, def.archetype),
    inferWeapon(def.weaponHint, def.displayName),
    inferHat(def.hatHint, def.faction, def.displayName),
    inferShield(def.shieldHint, def.displayName),
    inferSpecial(def.specialHint, def.displayName),
    inferAccent(def.faction),
  );
}

function inferProportions(size: string | undefined, archetype: string): Partial<BodyProportions> {
  switch (size) {
    case "tiny":
      return { scale: 0.68, headSize: 1.25, legLength: 0.72, bulk: 0.8 };
    case "large":
      return { scale: 1.25, bulk: 1.22, headSize: 1.05 };
    case "giant":
      return { scale: 1.7, bulk: 1.45, headSize: 1.15, armLength: 1.1 };
    case "colossal":
      return { scale: 2.25, bulk: 1.85, headSize: 1.25, armLength: 1.15, legLength: 0.9 };
    default:
      break;
  }

  if (archetype === "flying_melee" || archetype === "flying_ranged") {
    return { scale: 1.05, armLength: 1.08 };
  }
  if (archetype === "boss_melee") {
    return { scale: 1.45, bulk: 1.3, headSize: 1.08 };
  }
  if (archetype === "artillery") {
    return { scale: 1.45, bulk: 1.6, legLength: 0.7 };
  }
  if (archetype === "shield_melee") {
    return { scale: 1.05, bulk: 1.1 };
  }
  return { scale: 1.0 };
}

function inferWeapon(hint: string | undefined, name: string): WeaponType {
  switch (hint) {
    case "club":
    case "sword":
    case "greatsword":
    case "spear":
    case "javelin":
    case "axe":
    case "hammer":
    case "mace":
    case "staff":
    case "dagger":
    case "bow":
    case "crossbow":
    case "musket":
    case "flintlock":
    case "blunderbuss":
    case "cannon_hand":
    case "halberd":
    case "lance":
    case "scythe":
    case "pitchfork":
    case "frying_pan":
    case "broom":
    case "bone_staff":
    case "lute":
    case "paintbrush":
    case "rapier":
    case "harpoon":
    case "cutlass":
    case "bomb":
    case "torch":
    case "katana":
    case "nunchaku":
    case "bo_staff":
    case "stone":
    case "hay_bale":
    case "potion":
    case "lightning_bolt":
      return hint;
    default:
      break;
  }

  const lower = name.toLowerCase();
  if (lower.includes("archer") || lower.includes("cupid") || lower.includes("poacher")) return "bow";
  if (lower.includes("musketeer") || lower.includes("deadeye")) return "musket";
  if (lower.includes("flintlock") || lower.includes("gunslinger") || lower.includes("quick draw") || lower.includes("bank robbers")) return "flintlock";
  if (lower.includes("blunderbuss")) return "blunderbuss";
  if (lower.includes("bomb")) return "bomb";
  if (lower.includes("harpoon")) return "harpoon";
  if (lower.includes("wizard") || lower.includes("mage") || lower.includes("cultist") || lower.includes("lich") || lower.includes("monarch") || lower.includes("architect")) return "staff";
  if (lower.includes("samurai") || lower.includes("shogun") || lower.includes("teacher")) return "katana";
  if (lower.includes("fencer")) return "rapier";
  if (lower.includes("halberd") || lower.includes("glaive")) return "halberd";
  if (lower.includes("lasso") || lower.includes("cavalry") || lower.includes("jouster")) return "lance";
  if (lower.includes("scythe") || lower.includes("harvester") || lower.includes("reaper")) return "scythe";
  if (lower.includes("bard")) return "lute";
  if (lower.includes("painter")) return "paintbrush";
  if (lower.includes("samurai") || lower.includes("ninja")) return "katana";
  return "club";
}

function inferHat(hint: string | undefined, faction: FactionId, name: string): HatType {
  switch (hint) {
    case "crown":
    case "helmet":
    case "viking_helmet":
    case "horned_helmet":
    case "hood":
    case "turban":
    case "conical_hat":
    case "tricorn":
    case "bandana":
    case "laurel":
    case "plume_helmet":
    case "straw_hat":
    case "beret":
    case "samurai_helmet":
    case "ninja_mask":
    case "monk_headband":
    case "pharaoh":
    case "feather_headdress":
    case "bone_mask":
    case "pirate_hat":
    case "captain_hat":
    case "great_helm":
    case "hood_liripipe":
      return hint;
    default:
      break;
  }

  const lower = name.toLowerCase();
  if (lower.includes("king") || lower.includes("queen")) return "crown";
  if (lower.includes("samurai") || lower.includes("shogun")) return "samurai_helmet";
  if (lower.includes("ninja")) return "ninja_mask";
  if (lower.includes("captain") || lower.includes("blackbeard")) return "captain_hat";
  if (lower.includes("pirate")) return "pirate_hat";
  if (lower.includes("pharaoh")) return "pharaoh";

  switch (faction) {
    case FactionId.Farmer:
      return "straw_hat";
    case FactionId.Medieval:
      return "helmet";
    case FactionId.Viking:
      return "viking_helmet";
    case FactionId.Dynasty:
      return "conical_hat";
    case FactionId.Renaissance:
      return "beret";
    case FactionId.Pirate:
      return "tricorn";
    case FactionId.Spooky:
      return "hood";
    case FactionId.WildWest:
      return "bandana";
    case FactionId.Good:
      return "laurel";
    case FactionId.Evil:
      return "hood";
    case FactionId.Secret:
      return "none";
    default:
      return "none";
  }
}

function inferShield(hint: string | undefined, name: string): ShieldType {
  switch (hint) {
    case "round":
    case "kite":
    case "tower":
    case "buckler":
      return hint;
    default:
      break;
  }

  if (name.toLowerCase().includes("shield")) return "tower";
  return "none";
}

function inferSpecial(hint: string | undefined, name: string): SpecialType {
  switch (hint) {
    case "mammoth":
      return "mount_mammoth";
    case "horse":
      return "mount_horse";
    case "wings":
      return "wings";
    case "cart":
      return "cart";
    case "longship":
      return "longship_body";
    case "tank":
      return "tank_body";
    case "catapult":
      return "catapult_arm";
    case "cannon":
      return "cannon_base";
    case "hwacha":
      return "hwacha_rack";
    case "ballista":
      return "ballista_frame";
    case "balloon":
      return "balloon";
    case "dragon":
      return "dragon_wings";
    case "scarecrow":
      return "scarecrow_post";
    case "monk":
      return "monk_robe";
    default:
      break;
  }

  const lower = name.toLowerCase();
  if (lower.includes("balloon")) return "balloon";
  if (lower.includes("dragon")) return "dragon_wings";
  if (lower.includes("valkyrie") || lower.includes("cupid") || lower.includes("banshee")) return "wings";
  return "none";
}

function inferAccent(faction: FactionId): string {
  switch (faction) {
    case FactionId.Tribal: return "#8B5A2B";
    case FactionId.Farmer: return "#C8A24A";
    case FactionId.Medieval: return "#8FA4D8";
    case FactionId.Ancient: return "#C5A24B";
    case FactionId.Viking: return "#C8DDF5";
    case FactionId.Dynasty: return "#C73131";
    case FactionId.Renaissance: return "#5777BE";
    case FactionId.Pirate: return "#6E6E6E";
    case FactionId.Spooky: return "#9C7FCC";
    case FactionId.WildWest: return "#B7722C";
    case FactionId.Legacy: return "#B9B9B9";
    case FactionId.Good: return "#E6C75A";
    case FactionId.Evil: return "#7D3434";
    case FactionId.Secret: return "#B8B8B8";
  }
}
