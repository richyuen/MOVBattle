import type { BodyProportions } from "./bodyBuilder";
import { FactionId } from "../data/factionColors";
import { getUnit } from "../data/unitDefinitions";
import { ROSTER_MANIFEST } from "../data/rosterManifest";

export type WeaponType =
  | "none" | "club" | "sword" | "greatsword" | "spear" | "javelin"
  | "axe" | "hammer" | "mace" | "staff" | "dagger"
  | "pickaxe" | "boxing_glove"
  | "blowgun"
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
  | "hood" | "turban" | "conical_hat" | "witch_hat" | "tricorn" | "bandana"
  | "cowboy_hat"
  | "miner_hat"
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
  | "giant_bones" | "giant_tree" | "giant_ice" | "halo"
  | "candle_flame" | "cactus_body" | "banner_back" | "chariot_cart"
  | "vampire_collar" | "quiver_back" | "elephant_shrine";

export type VisualStateTag = "idle" | "moving" | "attacking" | "ability-active";

export type PosePreset =
  | "default"
  | "archer"
  | "caster"
  | "shouter"
  | "duelist"
  | "gunner"
  | "brute"
  | "boxer"
  | "monarch"
  | "spinner"
  | "giant"
  | "mounted"
  | "support"
  | "beast"
  | "vehicle";

export type MaterialPreset =
  | "default"
  | "tribal_hide"
  | "medieval_steel"
  | "ancient_bronze"
  | "viking_fur"
  | "dynasty_lacquer"
  | "renaissance_velvet"
  | "pirate_tar"
  | "wildwest_leather"
  | "legacy_toy"
  | "good_gold"
  | "evil_void"
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

export type WeaponPresentationFamily =
  | "default"
  | "heavy_swing"
  | "blade_slash"
  | "thrust"
  | "throw"
  | "bow_draw_release"
  | "crossbow_snap"
  | "firearm_recoil";

export type WeaponGripPreset =
  | "default"
  | "heavy_swing"
  | "blade_slash"
  | "thrust"
  | "throw"
  | "bow"
  | "crossbow"
  | "firearm";

export type LocomotionBiasPreset = "none" | "heavy_carry" | "aimed" | "braced";

export type ReleaseTimingPreset = "default" | "melee_commit" | "thrust_extend" | "bow_release" | "crossbow_release" | "firearm_recoil" | "throw_release";

export interface PresentationOffset3 {
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
}

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
  bodyDetailLevel?: "standard" | "hero" | "operator";
  stateVariants?: Partial<Record<VisualStateTag, string[]>>;
  weaponPresentationFamily?: WeaponPresentationFamily;
  weaponGripPreset?: WeaponGripPreset;
  locomotionBiasPreset?: LocomotionBiasPreset;
  releaseTimingPreset?: ReleaseTimingPreset;
  weaponPositionOffset?: PresentationOffset3;
  weaponRotationOffset?: PresentationOffset3;
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
  const weaponPresentationFamily = extras.weaponPresentationFamily ?? inferWeaponPresentationFamily(weapon);
  const defaultAttachmentPreset = inferAttachmentPreset(weaponPresentationFamily);
  const config: UnitVisualConfig = {
    proportions,
    weapon,
    offhandWeapon,
    hat,
    shield,
    special,
    accentColor,
    posePreset: inferPosePreset(weaponPresentationFamily),
    materialPreset: "default",
    attachmentPreset: defaultAttachmentPreset,
    fxPreset: "none",
    bodyDetailLevel: "standard",
    weaponPresentationFamily,
    weaponGripPreset: extras.weaponGripPreset ?? inferWeaponGripPreset(weaponPresentationFamily),
    locomotionBiasPreset: extras.locomotionBiasPreset ?? inferLocomotionBiasPreset(weaponPresentationFamily),
    releaseTimingPreset: extras.releaseTimingPreset ?? inferReleaseTimingPreset(weaponPresentationFamily),
    ...extras,
  };
  config.posePreset = extras.posePreset ?? config.posePreset;
  config.attachmentPreset = extras.attachmentPreset ?? config.attachmentPreset;
  config.stateVariants = extras.stateVariants ?? inferStateVariants(config.attachmentPreset ?? "none");
  return config;
}

/**
 * Visual config for every unit in the game, keyed by unit id.
 */
export const UNIT_VISUALS: Record<string, UnitVisualConfig> = {
  // ═══════════════════════ TRIBAL ═══════════════════════
  "tribal.clubber": vis(
    { scale: 0.9, bulk: 0.9, headSize: 1.1 }, "club", "none", "none", "none", "#8B4513",
    undefined,
    {
      posePreset: "brute",
      weaponGripPreset: "heavy_swing",
      locomotionBiasPreset: "heavy_carry",
      releaseTimingPreset: "melee_commit",
      weaponPositionOffset: { x: 0.015, y: 0.03, z: 0.03 },
      weaponRotationOffset: { rx: 0.18, rz: -0.18 },
    },
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
    { scale: 0.55, headSize: 1.55, legLength: 0.7 }, "frying_pan", "none", "none", "none", "#696969",
  ),
  "farmer.farmer": vis(
    { scale: 0.95, bulk: 0.95 }, "pitchfork", "hood_liripipe", "none", "none", "#4A7A2E",
  ),
  "farmer.hay_baler": vis(
    { scale: 1.25, bulk: 1.6 }, "hay_bale", "straw_hat", "none", "none", "#DAA520",
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
    undefined,
    {
      posePreset: "duelist",
      materialPreset: "medieval_steel",
      weaponGripPreset: "blade_slash",
      locomotionBiasPreset: "braced",
      releaseTimingPreset: "melee_commit",
    },
  ),
  "medieval.archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood_liripipe", "none", "quiver_back", "#228B22",
    undefined,
    {
      posePreset: "archer",
      attachmentPreset: "bow_ready",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "bow_release",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "medieval.healer": vis(
    { scale: 0.95, headSize: 1.05 }, "staff", "hood", "none", "none", "#FFD700",
  ),
  "medieval.knight": vis(
    { scale: 1.25, bulk: 1.55 }, "sword", "plume_helmet", "kite", "cape", "#C0C0C0",
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
    undefined,
    { materialPreset: "ancient_bronze" },
  ),
  "ancient.sarissa": vis(
    { scale: 1.05, armLength: 1.3 }, "spear", "helmet", "buckler", "none", "#B8860B",
    undefined,
    {
      posePreset: "support",
      materialPreset: "ancient_bronze",
      weaponGripPreset: "thrust",
      locomotionBiasPreset: "braced",
      releaseTimingPreset: "thrust_extend",
      weaponPositionOffset: { y: 0.04, z: 0.08 },
      weaponRotationOffset: { rx: 0.08 },
    },
  ),
  "ancient.hoplite": vis(
    { scale: 1.15, bulk: 1.2 }, "spear", "plume_helmet", "round", "none", "#DAA520",
    undefined,
    { materialPreset: "ancient_bronze" },
  ),
  "ancient.ballista": vis(
    { scale: 1.5, bulk: 1.6, legLength: 0.7 }, "none", "helmet", "none", "ballista_frame", "#8B7355",
  ),
  "ancient.snake_archer": vis(
    { scale: 1.0, armLength: 1.1 }, "bow", "pharaoh", "none", "quiver_back", "#2E8B57",
    undefined,
    {
      posePreset: "archer",
      attachmentPreset: "bow_ready",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "bow_release",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "ancient.minotaur": vis(
    { scale: 1.7, bulk: 1.6, headSize: 1.4 }, "axe", "horned_helmet", "none", "none", "#8B0000",
  ),
  "ancient.zeus": vis(
    { scale: 1.9, bulk: 1.3, headSize: 1.3 }, "lightning_bolt", "laurel", "none", "cape", "#87CEEB",
  ),

  // ═══════════════════════ VIKING ═══════════════════════
  "viking.headbutter": vis(
    { scale: 1.0, headSize: 1.8, bulk: 1.1 }, "none", "viking_helmet", "none", "none", "#808080",
    undefined,
    { posePreset: "brute", materialPreset: "viking_fur" },
  ),
  "viking.ice_archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "hood", "none", "quiver_back", "#ADD8E6",
    undefined,
    {
      posePreset: "archer",
      attachmentPreset: "bow_ready",
      materialPreset: "viking_fur",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "bow_release",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "viking.brawler": vis(
    { scale: 1.1, bulk: 1.2 }, "axe", "viking_helmet", "round", "none", "#A0522D",
    undefined,
    { materialPreset: "viking_fur" },
  ),
  "viking.berserker": vis(
    { scale: 1.15, bulk: 1.2, armLength: 1.1 }, "axe", "horned_helmet", "none", "none", "#8B0000", "axe",
  ),
  "viking.valkyrie": vis(
    { scale: 1.2, bulk: 1.0, armLength: 1.05 }, "sword", "plume_helmet", "round", "wings", "#E6E6FA",
  ),
  "viking.longship": vis(
    { scale: 1.8, bulk: 2.0, legLength: 0.6 }, "axe", "viking_helmet", "round", "longship_body", "#8B7355",
  ),
  "viking.jarl": vis(
    { scale: 1.55, bulk: 1.4, headSize: 1.1 }, "greatsword", "horned_helmet", "none", "cape", "#FFD700",
    undefined,
    { posePreset: "monarch", materialPreset: "viking_fur", bodyDetailLevel: "hero" },
  ),

  // ═══════════════════════ DYNASTY ═══════════════════════
  "dynasty.samurai": vis(
    { scale: 1.1, bulk: 1.1 }, "katana", "samurai_helmet", "none", "none", "#C41E3A",
    undefined,
    { materialPreset: "dynasty_lacquer" },
  ),
  "dynasty.firework_archer": vis(
    { scale: 0.95, armLength: 1.05 }, "bow", "conical_hat", "none", "none", "#FF4500",
    undefined,
    {
      posePreset: "archer",
      materialPreset: "dynasty_lacquer",
      attachmentPreset: "bow_ready",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "bow_release",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "dynasty.monk": vis(
    { scale: 1.1, bulk: 1.15, headSize: 1.15 }, "none", "monk_headband", "none", "monk_robe", "#FF8C00",
    undefined,
    { materialPreset: "dynasty_lacquer" },
  ),
  "dynasty.ninja": vis(
    { scale: 0.85, bulk: 0.85, armLength: 1.05 }, "shuriken_hand", "ninja_mask", "none", "none", "#1A1A1A",
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
    undefined,
    { materialPreset: "renaissance_velvet" },
  ),
  "renaissance.fencer": vis(
    { scale: 1.05, bulk: 0.9, armLength: 1.1 }, "rapier", "plume_helmet", "none", "cape", "#FFFFFF",
    undefined,
    { posePreset: "duelist", materialPreset: "renaissance_velvet" },
  ),
  "renaissance.balloon_archer": vis(
    { scale: 0.9, armLength: 1.05 }, "bow", "beret", "none", "balloon", "#FFB6C1",
    undefined,
    {
      posePreset: "archer",
      materialPreset: "renaissance_velvet",
      attachmentPreset: "bow_ready",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "bow_release",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "renaissance.musketeer": vis(
    { scale: 1.05, bulk: 1.0 }, "musket", "plume_helmet", "none", "none", "#191970",
    undefined,
    {
      posePreset: "gunner",
      materialPreset: "renaissance_velvet",
      weaponGripPreset: "firearm",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "firearm_recoil",
    },
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
    undefined,
    { posePreset: "gunner", materialPreset: "pirate_tar" },
  ),
  "pirate.blunderbuss": vis(
    { scale: 1.05, bulk: 1.1 }, "blunderbuss", "tricorn", "none", "none", "#696969",
    undefined,
    { posePreset: "gunner", materialPreset: "pirate_tar" },
  ),
  "pirate.bomb_thrower": vis(
    { scale: 1.0, bulk: 1.0 }, "bomb", "tricorn", "none", "none", "#2F4F4F",
    undefined,
    {
      posePreset: "support",
      materialPreset: "pirate_tar",
      attachmentPreset: "bomb_lit",
      weaponGripPreset: "throw",
      locomotionBiasPreset: "aimed",
      releaseTimingPreset: "throw_release",
      weaponPositionOffset: { y: 0.03, z: 0.03 },
      stateVariants: { attacking: ["lit_fuse"], "ability-active": ["lit_fuse"] },
    },
  ),
  "pirate.harpooner": vis(
    { scale: 1.05, armLength: 1.15 }, "harpoon", "bandana", "none", "none", "#708090",
    undefined,
    { materialPreset: "pirate_tar" },
  ),
  "pirate.captain": vis(
    { scale: 1.35, bulk: 1.3 }, "cutlass", "captain_hat", "none", "cape", "#DAA520",
    undefined,
    { posePreset: "monarch", materialPreset: "pirate_tar", bodyDetailLevel: "hero" },
  ),
  "pirate.cannon": vis(
    { scale: 1.6, bulk: 1.8, legLength: 0.7 }, "none", "tricorn", "none", "cannon_base", "#2F4F4F",
  ),
  "pirate.pirate_queen": vis(
    { scale: 1.6, bulk: 1.2, headSize: 1.1 }, "cutlass", "pirate_hat", "none", "cape", "#FF1493",
  ),

  // ═══════════════════════ SPOOKY ═══════════════════════
  "spooky.skeleton_warrior": vis(
    { scale: 0.98, bulk: 0.82, headSize: 1.12, armLength: 1.05, limbTaper: 1.08 }, "sword", "none", "buckler", "none", "#D8CCB0", undefined, {
      posePreset: "duelist",
      materialPreset: "secret_bone",
    },
  ),
  "spooky.skeleton_archer": vis(
    { scale: 0.96, bulk: 0.78, headSize: 1.1, armLength: 1.12, limbTaper: 1.08 }, "bow", "none", "none", "quiver_back", "#D8CCB0", undefined, {
      posePreset: "archer",
      materialPreset: "secret_bone",
      attachmentPreset: "bow_ready",
      fxPreset: "spectral",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "spooky.candlehead": vis(
    { scale: 1.02, bulk: 0.86, headSize: 1.18 }, "torch", "none", "none", "candle_flame", "#FFB347", undefined, {
      posePreset: "support",
      materialPreset: "secret_ghost",
      fxPreset: "ember",
    },
  ),
  "spooky.vampire": vis(
    { scale: 1.08, bulk: 0.92, headSize: 1.04, armLength: 1.1 }, "dagger", "none", "none", "vampire_collar", "#7A2131", "dagger", {
      posePreset: "duelist",
      materialPreset: "secret_ghost",
      attachmentPreset: "ghost_trail",
      fxPreset: "spectral",
      stateVariants: { moving: ["ghost_stream"], "ability-active": ["ghost_stream"] },
    },
  ),
  "spooky.pumpkin_catapult": vis(
    { scale: 1.58, bulk: 1.82, legLength: 0.68 }, "none", "hood", "none", "catapult_arm", "#D66A1F", undefined, {
      posePreset: "vehicle",
      materialPreset: "secret_festive",
    },
  ),
  "spooky.swordcaster": vis(
    { scale: 1.08, bulk: 0.92, headSize: 1.08 }, "sword", "hood", "none", "cape", "#A793FF", undefined, {
      posePreset: "caster",
      materialPreset: "secret_ghost",
      attachmentPreset: "summoner",
      fxPreset: "spectral",
      stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
    },
  ),

  // ═══════════════════════ WILD WEST ═══════════════════════
  "wild_west.dynamite_thrower": vis(
    { scale: 1.0, bulk: 0.96 }, "bomb", "cowboy_hat", "none", "none", "#B75C21", undefined, {
      posePreset: "support",
      materialPreset: "secret_bandit",
      attachmentPreset: "bomb_lit",
      stateVariants: { attacking: ["lit_fuse"], "ability-active": ["lit_fuse"] },
    },
  ),
  "wild_west.miner": vis(
    { scale: 1.12, bulk: 1.22, headSize: 1.04 }, "pickaxe", "miner_hat", "none", "none", "#6B4A2F", undefined, {
      posePreset: "brute",
      materialPreset: "wildwest_leather",
    },
  ),
  "wild_west.cactus": vis(
    { scale: 1.26, bulk: 1.34, headSize: 0.94, armLength: 0.88, legLength: 0.84 }, "none", "none", "none", "cactus_body", "#5E9B4C", undefined, {
      posePreset: "beast",
      materialPreset: "secret_nature",
    },
  ),
  "wild_west.gunslinger": vis(
    { scale: 1.0, bulk: 0.9, armLength: 1.08 }, "flintlock", "cowboy_hat", "none", "none", "#7F4B24", "flintlock", {
      posePreset: "gunner",
      materialPreset: "wildwest_leather",
      attachmentPreset: "quickdraw_smoke",
      stateVariants: { attacking: ["quickdraw_smoke"] },
    },
  ),
  "wild_west.lasso": vis(
    { scale: 1.28, bulk: 1.02, armLength: 1.06 }, "whip", "cowboy_hat", "none", "mount_horse", "#8B6A3D", undefined, {
      posePreset: "mounted",
      materialPreset: "wildwest_leather",
    },
  ),
  "wild_west.deadeye": vis(
    { scale: 1.02, bulk: 0.92, armLength: 1.12 }, "musket", "cowboy_hat", "none", "none", "#6C5136", undefined, {
      posePreset: "gunner",
      materialPreset: "wildwest_leather",
    },
  ),

  // ═══════════════════════ LEGACY ═══════════════════════
  "legacy.peasant": vis(
    { scale: 0.62, bulk: 0.78, headSize: 1.44, legLength: 0.74 }, "none", "none", "none", "none", "#D8D8D8",
    undefined,
    { materialPreset: "legacy_toy" },
  ),
  "legacy.banner_bearer": vis(
    { scale: 1.0, bulk: 0.9 }, "staff", "none", "none", "banner_back", "#D74A4A", undefined, {
      posePreset: "support",
      materialPreset: "legacy_toy",
    },
  ),
  "legacy.poacher": vis(
    { scale: 0.94, bulk: 0.84, armLength: 1.1 }, "bow", "hood", "none", "none", "#6F7D43", undefined, {
      posePreset: "archer",
      materialPreset: "legacy_toy",
      attachmentPreset: "bow_ready",
      stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
    },
  ),
  "legacy.blowdarter": vis(
    { scale: 0.95, bulk: 0.8, armLength: 1.08 }, "blowgun", "hood", "none", "none", "#6E8A5A", undefined, {
      posePreset: "archer",
      materialPreset: "secret_nature",
    },
  ),
  "legacy.pike": vis(
    { scale: 1.14, bulk: 1.12, armLength: 1.3 }, "spear", "great_helm", "none", "none", "#B5B5B5",
    undefined,
    { materialPreset: "legacy_toy" },
  ),
  "legacy.barrel_roller": vis(
    { scale: 1.24, bulk: 1.48, headSize: 0.98 }, "none", "none", "none", "barrel_body", "#704726", undefined, {
      posePreset: "support",
      materialPreset: "secret_bandit",
    },
  ),
  "legacy.boxer": vis(
    { scale: 0.68, bulk: 0.94, headSize: 1.32, armLength: 1.08 }, "boxing_glove", "none", "none", "none", "#C54A4A", "boxing_glove", {
      posePreset: "boxer",
      materialPreset: "legacy_toy",
    },
  ),
  "legacy.flag_bearer": vis(
    { scale: 1.34, bulk: 1.08, headSize: 1.05 }, "staff", "none", "none", "banner_back", "#5C79D4", undefined, {
      posePreset: "support",
      materialPreset: "legacy_toy",
    },
  ),
  "legacy.pharaoh": vis(
    { scale: 1.36, bulk: 1.08, headSize: 1.08 }, "staff", "pharaoh", "none", "cape", "#E0B34A", undefined, {
      posePreset: "caster",
      materialPreset: "secret_royal",
      fxPreset: "royal",
    },
  ),
  "legacy.wizard": vis(
    { scale: 1.76, bulk: 1.08, headSize: 1.12 }, "staff", "witch_hat", "none", "cape", "#7BA0FF", undefined, {
      posePreset: "caster",
      materialPreset: "secret_holy",
      attachmentPreset: "storm_halo",
      fxPreset: "wind",
      stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
    },
  ),
  "legacy.chariot": vis(
    { scale: 1.42, bulk: 1.08, legLength: 0.82 }, "spear", "plume_helmet", "buckler", "chariot_cart", "#C7A85D", undefined, {
      posePreset: "mounted",
      materialPreset: "secret_royal",
    },
  ),
  "legacy.super_boxer": vis(
    { scale: 1.48, bulk: 1.38, headSize: 1.08, armLength: 1.18 }, "boxing_glove", "none", "none", "none", "#F0C24D", "boxing_glove", {
      posePreset: "boxer",
      materialPreset: "secret_hero",
      bodyDetailLevel: "hero",
    },
  ),

  // ═══════════════════════ GOOD ═══════════════════════
  "good.devout_gauntlet": vis(
    { scale: 1.02, bulk: 1.12, armLength: 1.08 }, "mace", "laurel", "none", "none", "#E3C76A", undefined, {
      posePreset: "duelist",
      materialPreset: "good_gold",
    },
  ),
  "good.celestial_aegis": vis(
    { scale: 1.12, bulk: 1.2 }, "sword", "plume_helmet", "tower", "none", "#F0D87A", undefined, {
      materialPreset: "good_gold",
    },
  ),
  "good.radiant_glaive": vis(
    { scale: 1.24, bulk: 1.16, armLength: 1.16 }, "halberd", "laurel", "none", "none", "#F2D55D", undefined, {
      materialPreset: "good_gold",
    },
  ),
  "good.righteous_paladin": vis(
    { scale: 1.34, bulk: 1.36 }, "greatsword", "great_helm", "kite", "cape", "#E8D89B", undefined, {
      posePreset: "monarch",
      materialPreset: "good_gold",
    },
  ),
  "good.divine_arbiter": vis(
    { scale: 1.86, bulk: 1.22, headSize: 1.16 }, "lightning_bolt", "laurel", "none", "halo", "#F5D971", undefined, {
      posePreset: "caster",
      materialPreset: "secret_holy",
      attachmentPreset: "storm_halo",
      fxPreset: "solar",
      stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
    },
  ),
  "good.sacred_elephant": vis(
    { scale: 2.56, bulk: 1.98, headSize: 1.42, legLength: 0.84 }, "none", "none", "none", "elephant_shrine", "#F3D88C", undefined, {
      posePreset: "vehicle",
      materialPreset: "good_gold",
      bodyDetailLevel: "hero",
    },
  ),

  // ═══════════════════════ EVIL ═══════════════════════
  "evil.shadow_walker": vis(
    { scale: 1.0, bulk: 0.84, armLength: 1.12 }, "dagger", "hood", "none", "cape", "#5A487A", "dagger", {
      posePreset: "duelist",
      materialPreset: "secret_ghost",
      attachmentPreset: "shadow_orbit",
      fxPreset: "spectral",
      stateVariants: { moving: ["shadow_orbit"], attacking: ["shadow_orbit"], "ability-active": ["shadow_orbit"] },
    },
  ),
  "evil.exiled_sentinel": vis(
    { scale: 1.14, bulk: 1.2 }, "sword", "great_helm", "tower", "cape", "#7B3434", undefined, {
      materialPreset: "evil_void",
    },
  ),
  "evil.mad_mechanic": vis(
    { scale: 1.18, bulk: 1.16, headSize: 1.04 }, "hammer", "hood", "none", "none", "#8E5A3A", "bomb", {
      posePreset: "support",
      materialPreset: "secret_bandit",
      attachmentPreset: "bomb_lit",
      stateVariants: { attacking: ["lit_fuse"], "ability-active": ["lit_fuse"] },
    },
  ),
  "evil.void_cultist": vis(
    { scale: 1.08, bulk: 0.96, headSize: 1.08 }, "staff", "hood", "none", "cape", "#6B52A8", undefined, {
      posePreset: "caster",
      materialPreset: "evil_void",
      attachmentPreset: "summoner",
      fxPreset: "spectral",
      stateVariants: { attacking: ["summon_orbs"], "ability-active": ["summon_orbs"] },
    },
  ),
  "evil.tempest_lich": vis(
    { scale: 1.42, bulk: 1.04, headSize: 1.14 }, "staff", "hood", "none", "none", "#86A7FF", undefined, {
      posePreset: "caster",
      materialPreset: "evil_void",
      attachmentPreset: "storm_halo",
      fxPreset: "spectral",
      stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
    },
  ),
  "evil.death_bringer": vis(
    { scale: 1.74, bulk: 1.44, headSize: 1.1, armLength: 1.16 }, "greatsword", "hood", "none", "cape", "#7D2E2E", undefined, {
      posePreset: "giant",
      materialPreset: "secret_demon",
      attachmentPreset: "reaper_aura",
      fxPreset: "ember",
      stateVariants: { moving: ["reaper_trail"], attacking: ["reaper_trail", "reaper_arc"], "ability-active": ["reaper_trail", "reaper_arc"] },
    },
  ),
  "evil.void_monarch": vis(
    { scale: 2.08, bulk: 1.46, headSize: 1.14, armLength: 1.16 }, "staff", "crown", "none", "cape", "#5A4A8E", undefined, {
      posePreset: "monarch",
      materialPreset: "evil_void",
      attachmentPreset: "shadow_orbit",
      fxPreset: "spectral",
      bodyDetailLevel: "hero",
      stateVariants: { moving: ["shadow_orbit"], attacking: ["shadow_orbit"], "ability-active": ["shadow_orbit"] },
    },
  ),
};

export function getUnitVisual(id: string): UnitVisualConfig {
  const presetVisual = getPresetVisual(id);
  if (presetVisual) return presetVisual;
  if (UNIT_VISUALS[id]) return UNIT_VISUALS[id];

  const def = getUnit(id);
  if (def) {
    throw new Error(`Missing authored visual config for ${id}`);
  }

  return inferUnitVisual(id);
}

function validateVisualCoverage(): void {
  const missing = ROSTER_MANIFEST
    .map((unit) => unit.id)
    .filter((id) => !UNIT_VISUALS[id] && !getPresetVisual(id));

  if (missing.length > 0) {
    throw new Error(`Roster units missing authored visuals: ${missing.join(", ")}`);
  }
}

function getPresetVisual(id: string): UnitVisualConfig | null {
  const def = getUnit(id);
  const preset = def?.visualPreset;
  if (!preset) return null;

  switch (preset) {
    case "iconic_zeus":
      return vis({ scale: 1.7, bulk: 1.08, headSize: 1.16, armLength: 1.16 }, "lightning_bolt", "laurel", "none", "cape", "#f7dd6f", undefined, {
        posePreset: "caster", materialPreset: "secret_holy", attachmentPreset: "storm_halo", fxPreset: "solar",
        bodyDetailLevel: "hero",
        stateVariants: { attacking: ["storm_flare"], "ability-active": ["storm_flare"] },
      });
    case "iconic_thor":
      return vis({ scale: 1.68, bulk: 1.18, headSize: 1.1, armLength: 1.12 }, "hammer", "horned_helmet", "none", "cape", "#8ec7ff", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", attachmentPreset: "storm_halo", fxPreset: "wind",
        bodyDetailLevel: "hero",
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
        bodyDetailLevel: "hero",
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
        bodyDetailLevel: "hero",
        stateVariants: { moving: ["shadow_orbit"], attacking: ["shadow_orbit"], "ability-active": ["shadow_orbit"] },
      });
    case "iconic_super_peasant":
      return vis({ scale: 2.02, bulk: 1.18, headSize: 1.08, armLength: 1.2, legLength: 1.08 }, "none", "laurel", "none", "cape", "#f3d45a", undefined, {
        posePreset: "giant", materialPreset: "secret_hero", attachmentPreset: "super_aura", fxPreset: "solar",
        bodyDetailLevel: "hero",
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
        bodyDetailLevel: "hero",
        stateVariants: { moving: ["halo_flare"], attacking: ["halo_flare"], "ability-active": ["halo_flare"] },
      });
    case "iconic_pirate_queen":
      return vis({ scale: 1.72, bulk: 1.24, headSize: 1.08, armLength: 1.08 }, "cutlass", "pirate_hat", "none", "cape", "#ff4f8a", "flintlock", {
        posePreset: "duelist", materialPreset: "secret_pirate", attachmentPreset: "quickdraw_smoke",
        bodyDetailLevel: "hero",
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
      return vis({ scale: 1.12, bulk: 0.95, armLength: 1.15 }, "katana", "none", "none", "monk_robe", "#3b3b3b", undefined, {
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
      return vis({ scale: 1.0, bulk: 0.95, armLength: 1.05 }, "crossbow", "conical_hat", "none", "quiver_back", "#7e4b2d", undefined, {
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
      return vis({ scale: 1.05, bulk: 0.95, headSize: 1.08 }, "staff", "witch_hat", "none", "cape", "#7d5ba6", undefined, {
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
        bodyDetailLevel: "hero",
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
      return vis({ scale: 1.4, bulk: 1.22, headSize: 1.08 }, "spear", "crown", "none", "vampire_collar", "#822f2f", undefined, {
        posePreset: "duelist", materialPreset: "secret_pirate", fxPreset: "spectral",
      });
    case "secret_gatling_gun":
      return vis({ scale: 1.6, bulk: 1.75, legLength: 0.7 }, "none", "none", "none", "none", "#6f5f48", undefined, {
        posePreset: "vehicle", materialPreset: "secret_pirate",
      });
    case "secret_blackbeard":
      return vis({ scale: 1.58, bulk: 1.28, headSize: 1.08 }, "cutlass", "captain_hat", "none", "cape", "#5d3a1f", "flintlock", {
        posePreset: "duelist", materialPreset: "secret_pirate", attachmentPreset: "quickdraw_smoke",
        bodyDetailLevel: "hero",
        stateVariants: { attacking: ["quickdraw_smoke"] },
      });
    case "secret_samurai_giant":
      return vis({ scale: 2.3, bulk: 1.75, headSize: 1.16, armLength: 1.1, legLength: 0.95 }, "katana", "samurai_helmet", "none", "cape", "#b53333", undefined, {
        posePreset: "giant", materialPreset: "secret_royal", attachmentPreset: "giant_aura", fxPreset: "royal",
        bodyDetailLevel: "hero",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    case "secret_ullr":
      return vis({ scale: 1.28, bulk: 1.05, armLength: 1.08 }, "bow", "viking_helmet", "none", "cape", "#9cd5ff", "axe", {
        posePreset: "archer", materialPreset: "secret_ice", attachmentPreset: "bow_ready", fxPreset: "frost",
        stateVariants: { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] },
      });
    case "secret_lady_red_jade":
      return vis({ scale: 1.52, bulk: 1.18, headSize: 1.05 }, "sword", "crown", "none", "cape", "#cf2f2f", "sword", {
        posePreset: "duelist", materialPreset: "secret_royal", fxPreset: "royal",
        bodyDetailLevel: "hero",
      });
    case "secret_sensei":
      return vis({ scale: 1.32, bulk: 1.0, armLength: 1.1 }, "shuriken_hand", "conical_hat", "none", "monk_robe", "#f5e4b4", "shuriken_hand", {
        posePreset: "duelist", materialPreset: "secret_holy",
      });
    case "secret_shogun":
      return vis({ scale: 1.58, bulk: 1.3, headSize: 1.08 }, "katana", "samurai_helmet", "none", "banner_back", "#a42323", undefined, {
        posePreset: "duelist", materialPreset: "secret_royal", fxPreset: "royal",
        bodyDetailLevel: "hero",
      });
    case "secret_tree_giant":
      return vis({ scale: 2.45, bulk: 1.85, headSize: 1.1, armLength: 1.12, legLength: 0.92 }, "none", "none", "none", "giant_tree", "#6f8a42", undefined, {
        posePreset: "giant", materialPreset: "secret_nature", attachmentPreset: "giant_aura",
        bodyDetailLevel: "hero",
        stateVariants: { attacking: ["giant_shards"], "ability-active": ["giant_shards"] },
      });
    case "secret_artemis":
      return vis({ scale: 1.45, bulk: 1.02, armLength: 1.12 }, "bow", "laurel", "none", "halo", "#f5d566", undefined, {
        posePreset: "archer", materialPreset: "secret_hero", attachmentPreset: "hero_halo", fxPreset: "solar",
        bodyDetailLevel: "hero",
        stateVariants: { attacking: ["drawn_arrow", "halo_flare"], "ability-active": ["drawn_arrow", "halo_flare"] },
      });
    case "secret_ice_giant":
      return vis({ scale: 2.48, bulk: 1.88, headSize: 1.12, armLength: 1.12, legLength: 0.92 }, "none", "none", "none", "giant_ice", "#9fe9ff", undefined, {
        posePreset: "giant", materialPreset: "secret_ice", attachmentPreset: "giant_aura", fxPreset: "frost",
        bodyDetailLevel: "hero",
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

validateVisualCoverage();

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

export function inferWeaponPresentationFamily(weapon: WeaponType): WeaponPresentationFamily {
  switch (weapon) {
    case "club":
    case "mace":
    case "hammer":
    case "pickaxe":
    case "frying_pan":
    case "hay_bale":
      return "heavy_swing";
    case "sword":
    case "greatsword":
    case "axe":
    case "dagger":
    case "shield_sword":
    case "scythe":
    case "cutlass":
    case "katana":
    case "nunchaku":
    case "bo_staff":
    case "rapier":
    case "boxing_glove":
    case "broom":
    case "flail":
    case "whip":
    case "torch":
      return "blade_slash";
    case "spear":
    case "halberd":
    case "lance":
    case "pitchfork":
    case "harpoon":
      return "thrust";
    case "javelin":
    case "bomb":
    case "stone":
    case "potion":
    case "shuriken_hand":
      return "throw";
    case "bow":
      return "bow_draw_release";
    case "crossbow":
    case "blowgun":
      return "crossbow_snap";
    case "musket":
    case "flintlock":
    case "blunderbuss":
    case "cannon_hand":
      return "firearm_recoil";
    default:
      return "default";
  }
}

export function inferWeaponGripPreset(family: WeaponPresentationFamily): WeaponGripPreset {
  switch (family) {
    case "heavy_swing":
      return "heavy_swing";
    case "blade_slash":
      return "blade_slash";
    case "thrust":
      return "thrust";
    case "throw":
      return "throw";
    case "bow_draw_release":
      return "bow";
    case "crossbow_snap":
      return "crossbow";
    case "firearm_recoil":
      return "firearm";
    default:
      return "default";
  }
}

export function inferPosePreset(family: WeaponPresentationFamily): PosePreset {
  switch (family) {
    case "bow_draw_release":
    case "crossbow_snap":
      return "archer";
    case "firearm_recoil":
      return "gunner";
    default:
      return "default";
  }
}

export function inferLocomotionBiasPreset(family: WeaponPresentationFamily): LocomotionBiasPreset {
  switch (family) {
    case "heavy_swing":
      return "heavy_carry";
    case "bow_draw_release":
    case "crossbow_snap":
      return "aimed";
    case "firearm_recoil":
    case "thrust":
      return "braced";
    default:
      return "none";
  }
}

export function inferReleaseTimingPreset(family: WeaponPresentationFamily): ReleaseTimingPreset {
  switch (family) {
    case "thrust":
      return "thrust_extend";
    case "bow_draw_release":
      return "bow_release";
    case "crossbow_snap":
      return "crossbow_release";
    case "firearm_recoil":
      return "firearm_recoil";
    case "throw":
      return "throw_release";
    case "heavy_swing":
    case "blade_slash":
      return "melee_commit";
    default:
      return "default";
  }
}

export function inferAttachmentPreset(family: WeaponPresentationFamily): AttachmentPreset {
  switch (family) {
    case "bow_draw_release":
      return "bow_ready";
    case "crossbow_snap":
      return "crossbow_ready";
    default:
      return "none";
  }
}

export function inferStateVariants(attachmentPreset: AttachmentPreset): Partial<Record<VisualStateTag, string[]>> {
  switch (attachmentPreset) {
    case "bow_ready":
      return { attacking: ["drawn_arrow"], "ability-active": ["drawn_arrow"] };
    case "crossbow_ready":
      return { attacking: ["crossbow_bolt"], "ability-active": ["crossbow_bolt"] };
    default:
      return {};
  }
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
