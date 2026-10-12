import { FactionId } from "../data/factionColors";
import type { UnitVisualConfig } from "../units/unitVisuals";

// White line-art glyphs for the placement tray and faction tabs (24x24 viewBox path data).

function ring(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
}

const MAMMOTH = "M3 19v-7a6 6 0 0 1 6-6h5a5 5 0 0 1 5 5v5a2 2 0 0 0 2 2h-3a2 2 0 0 1-2-2v-3h-2v6h-4v-4H8v4z";
const ROCK = "M6 18L3 12l4-6 8-1 5 5-2 7zM7 6l4 5h9M11 11l-1 7";
const SKULL_STAFF = `M7 21l6-11${ring(16, 6, 3.5)}M14.8 5.5v.6M17.2 5.5v.6M14.5 9v2h3V9`;
const CART = `M3 8h13l-2 7H5zM16 9l5-3${ring(10.5, 18, 2.5)}`;

// Units whose silhouette is more than their weapon.
const BY_UNIT: Record<string, string> = {
  "tribal.protector": `${ring(12, 12, 7)}${ring(12, 12, 2)}M3 21l4-4M17 7l4-4M17 3.5h3.5V7`,
  "tribal.chieftain": `${ring(12, 16, 4)}M7.5 13h9M8.5 12L5 5M10.5 11L9 3M12 11V2M13.5 11L15 3M15.5 12L19 5`,
  "tribal.mammoth": MAMMOTH,
};

// Weaponless units: mounts, machines and bodies.
const BY_SPECIAL: Record<string, string> = {
  mount_mammoth: MAMMOTH,
  mount_horse: "M7 21c0-6 1-9 4-12l-1-5 3 2c4 0 6 3 7 7l-3 2-4-2c-1 3-1 5 0 8",
  cannon_base: `M3 10l13-3 1 4-13 3zM17 8l3-1${ring(11, 17, 3)}`,
  catapult_arm: `M3 18h18M6 18l6-8 6 8M12 10L6 5${ring(5.5, 4.5, 2)}`,
  ballista_frame: "M3 12h18M21 12l-3-2M21 12l-3 2M8 4c5 3 5 13 0 16M8 4L4 12l4 8",
  hwacha_rack: `M5 6h12v8H5zM8 6v8M11 6v8M14 6v8M17 8l4-1M17 12l4-1M9 14v2${ring(8.5, 19, 2.5)}`,
  tank_body: "M3 14h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 14v-4h8v4M15 11h7",
  longship_body: "M2 14c3 5 17 5 20 0M2 14l-1-4M22 14l1-5M12 14V3M12 4l7 3-7 4",
  balloon: "M6 9a6 6 0 1 1 12 0c0 4-4 6-6 8-2-2-6-4-6-8M10 17h4v4h-4z",
  cart: CART,
  dragon_cart: CART,
  chariot_cart: CART,
  wings: `${ring(12, 6, 2)}M12 8v10M12 12c-4-5-8-4-10-1 3 0 6 1 10 4M12 12c4-5 8-4 10-1-3 0-6 1-10 4`,
  giant_tree: "M12 21v-8M6 13a6 6 0 1 1 12 0zM9 21h6M12 16l3-2",
};

const BY_WEAPON: Record<string, string> = {
  club: "M5 21l-2-2 8-9c1-3 3-6 7-6 1 0 2 1 2 2 0 4-3 6-6 7z",
  sword: "M5 19l4-4M6 13l5 5M9 15L20 4v3L11 17",
  greatsword: "M4 20l4-4M5 12l7 7M7.5 14.5L19 3h2v2L9.5 16.5",
  spear: "M4 20L16 8M14 6l6-2-2 6z",
  javelin: "M4 18L18 6M15 5l5-1-1 5M5 13l2 2M8 10l2 2",
  axe: "M5 20L16 5M12 6c3-3 7-2 8 1l-5 4z",
  hammer: "M5 20l6-7M11 13l4-6 5 4-6 5z",
  mace: `M4 20l8-8${ring(15.5, 9, 3.5)}M15.5 3v2M21 9h-2M19.5 5L18 6.5`,
  staff: `M6 21L15 7${ring(16.5, 5, 2.5)}`,
  bo_staff: "M4 20L20 4M7 17l1 1M16 8l1 1",
  bone_staff: SKULL_STAFF,
  dagger: "M8 16l-3 3M6 13l5 5M9.5 14.5L17 7h1v1l-7.5 7.5",
  bow: "M7 3c9 3 9 15 0 18M7 3v18M4 12h15M16 9l3 3-3 3",
  crossbow: "M12 4v16M4 10c4-5 12-5 16 0M4 10l8 5 8-5",
  musket: "M3 9h15v3H9l-2 6H4l1-6H3zM18 10h3",
  flintlock: "M4 8h13v3h-7l-1 2H7l-1 6H3l1-8zM17 9h3",
  blunderbuss: "M3 10h12l5-2v7l-5-2H9l-2 6H4l1-6H3z",
  cannon_hand: "M4 9h14a3 3 0 0 1 0 6H4zM7 9v6M4 12H2",
  shield_sword: "M4 5h9v7c0 3-2 5-4.5 6.5C6 17 4 15 4 12zM15 20l1-1M21 4l-6 12M14 15l4 2",
  halberd: "M4 21L18 4M18 4l2-2M13 6c3-2 6 0 6 3l-4 1z",
  lance: "M3 21L21 3M6 16l2 2M4.5 19.5l2-5 3 3z",
  scythe: "M6 21L14 4M14 4c4 0 7 3 7 7-2-3-5-4-8-4",
  pitchfork: "M5 21L15 9M12 6l6 6M12 6l2-3M15 9l4-6M18 12l3-3",
  frying_pan: `M4 20l6-6${ring(14, 10, 5)}`,
  broom: "M5 3l8 10M10 13l6-3 4 9-9 2zM14 12l3 8M12 13l1 8",
  katana: "M4 20l3-3M5.5 15.5l3 3M7 17C12 14 17 9 20 3",
  cutlass: "M5 20l3-3M6 15l3 3M8 17c5-1 10-6 11-13-3 4-8 8-13 10",
  rapier: "M4 20l3-3M6 15a2.5 2.5 0 0 0 3 3M7.5 16.5L21 3",
  harpoon: "M4 20L18 6M18 6l-5 1M18 6l-1 5M20 4l-2 2M14 10l-3-1",
  pickaxe: "M5 20L15 8M8 6c5-2 10 1 11 7",
  bomb: `${ring(11, 14, 6)}M15 9l3-3M18 6l1-2M18 6h2M18 6l1.5 1.5`,
  stone: ROCK,
  hay_bale: "M4 8h16v10H4zM9 8v10M15 8v10M4 13h16",
  potion: "M10 3h4M10.5 3v5l-4 8a3 3 0 0 0 3 4h5a3 3 0 0 0 3-4l-4-8V3M8 14h8",
  lightning_bolt: "M14 2L6 13h5l-2 9 9-12h-5z",
  whip: "M4 20l3-3M7 17c6-2 2-8 7-9s5 4 2 5-4-3 0-7",
  flail: `M4 20l7-7M11 13l2-4 2-1${ring(16.5, 5, 2.5)}`,
  fan: "M12 20L4 9a10 10 0 0 1 16 0zM12 20V6M12 20L8 7M12 20l4-13",
  nunchaku: "M4 10l5 9M20 10l-5 9M4 10l1-2c3-4 11-4 14 0l1 2",
  shuriken_hand: `M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z${ring(12, 12, 1)}`,
  boxing_glove: "M8 20v-4c-3-1-4-4-3-7s4-5 8-4 5 4 4 7l-2 4v4zM16 10c2 0 3 2 2 4",
  torch: "M8 21l3-9h3l-2 9zM12.5 12c-3-3 0-5 0-9 3 2 5 6 1 9",
  lute: "M6 18a4 4 0 1 0 5-5l8-9M17 3l3 3M8 16l2 2",
  paintbrush: "M4 20c0-3 2-4 4-3s1 4-4 3M8 16L19 4l1 1-11 12",
  blowgun: "M3 14L21 8M21 8l-1 3M5 11l1 4",
  present_box: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-4 0M12 7c2-4 6-3 4 0",
  pom_pom: `M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2${ring(12, 12, 3)}`,
};

const BY_FAMILY: Record<string, string> = {
  heavy_swing: BY_WEAPON.hammer,
  blade_slash: BY_WEAPON.sword,
  thrust: BY_WEAPON.spear,
  throw: BY_WEAPON.javelin,
  bow_draw_release: BY_WEAPON.bow,
  crossbow_snap: BY_WEAPON.crossbow,
  firearm_recoil: BY_WEAPON.musket,
};

// Closed shapes that read as solid silhouettes when filled; the rest stay line art.
const SOLID = new Set<string>([
  ...Object.values(BY_UNIT),
  ...["mount_horse", "cannon_base", "tank_body", "longship_body", "balloon", "cart", "giant_tree"].map((k) => BY_SPECIAL[k]),
  ...[
    "club", "spear", "axe", "hammer", "mace", "staff", "musket", "flintlock", "blunderbuss", "cannon_hand",
    "shield_sword", "halberd", "lance", "scythe", "frying_pan", "cutlass", "pickaxe", "bomb", "stone", "potion",
    "lightning_bolt", "flail", "fan", "shuriken_hand", "boxing_glove", "torch",
  ].map((k) => BY_WEAPON[k]),
]);

export function isSolidGlyph(path: string): boolean {
  return SOLID.has(path);
}

const FIGURE = `${ring(12, 6, 3)}M12 9v7M7 12h10M12 16l-4 5M12 16l4 5`;

/** Most specific glyph first: the unit itself, then its mount or machine, its weapon, its weapon family. */
export function unitGlyphPath(unitId: string, visual: UnitVisualConfig): string {
  return BY_UNIT[unitId]
    ?? (visual.weapon === "none" ? BY_SPECIAL[visual.special] : undefined)
    ?? BY_WEAPON[visual.weapon]
    ?? BY_FAMILY[visual.weaponPresentationFamily ?? ""]
    ?? FIGURE;
}

export const FACTION_GLYPH_PATHS: Record<number, string> = {
  [FactionId.Tribal]: "M8.5 15.5l7-7M6 14a2 2 0 1 0 2.5 1.5A2 2 0 1 0 10 18M18 10a2 2 0 1 0-2.5-1.5A2 2 0 1 0 14 6",
  [FactionId.Farmer]: "M4 20V10l8-6 8 6v10zM9 20v-6h6v6M9 14l6 6M15 14l-6 6",
  [FactionId.Medieval]: "M5 21V8h14v13zM5 8V4h3v2h2.5V4h3v2H16V4h3v4M10 21v-5a2 2 0 0 1 4 0v5",
  [FactionId.Ancient]: "M5 5h14M6 5v2h12V5M8 7v11M12 7v11M16 7v11M6 18h12v2H6zM4 20h16",
  [FactionId.Viking]: "M6 18v-5a6 6 0 0 1 12 0v5zM6 12C3 11 2 8 3 5M18 12c3-1 4-4 3-7M12 13v5",
  [FactionId.Dynasty]: "M3 11l9-6 9 6M6 11v3M18 11v3M2 17l10-4 10 4M7 17v4h10v-4M12 5V2",
  [FactionId.Renaissance]: `${ring(12, 12, 4)}M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.5 2.5M16.5 16.5L19 19M5 19l2.5-2.5M16.5 7.5L19 5`,
  [FactionId.Pirate]: `${ring(12, 9, 5)}${ring(10, 9, 1)}${ring(14, 9, 1)}M9.5 13.5v3h5v-3M4 16l16 5M20 16L4 21`,
  [FactionId.Spooky]: "M6 21V10a6 6 0 0 1 12 0v11l-2-2-2 2-2-2-2 2-2-2zM10 10v1M14 10v1",
  [FactionId.WildWest]: "M2 15c3 3 17 3 20 0M7 15c0-5 1-9 3-9 1 0 1 1 2 1s1-1 2-1c2 0 3 4 3 9",
  [FactionId.Legacy]: "M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2-5.6-3.2-5.6 3.2 1.3-6.2L3 9.5l6.3-.7z",
  [FactionId.Good]: "M7 5a5 2 0 1 0 10 0a5 2 0 1 0-10 0M12 9v12M12 13c-4-3-7-2-9 0 3 0 6 2 9 4M12 13c4-3 7-2 9 0-3 0-6 2-9 4",
  [FactionId.Evil]: `${ring(12, 13, 5)}M8.5 9.5C6 8 5 6 5 3c2 1 4 2 5.5 5M15.5 9.5C18 8 19 6 19 3c-2 1-4 2-5.5 5M10 13l1.5 1M14 13l-1.5 1`,
  [FactionId.Secret]: "M8 8a4 4 0 1 1 6 3.5c-1.5 1-2 1.5-2 3.5M12 19v.5",
};
