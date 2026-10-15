import {
  Scene, Vector3, Color3, Mesh, MeshBuilder, Quaternion, TransformNode,
  type Material, type ShadowGenerator,
} from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import { getCrowdPhysicsProfile, getRagdollProfile } from "../data/combatProfiles";
import { FACTION_COLORS, FactionId, TEAM_COLORS } from "../data/factionColors";
import { buildArticulatedBody, crewProportions, type ArticulatedBody } from "./bodyBuilder";
import { getUnitVisual, type MaterialPreset, type UnitVisualConfig } from "./unitVisuals";
import { attachProps } from "./propBuilder";
import { isVehicleUnit, buildVehicleBody, dressCannonCrew } from "./vehicleBuilder";
import { RuntimeUnit } from "./runtimeUnit";
import { getMaterialFactory } from "./materialFactory";
import { getLinkedActorPreset } from "./linkedActorPresets";

export interface SpawnVisualOptions {
  visualOverride?: UnitVisualConfig;
  suppressDecorativeOperators?: boolean;
  forceArticulatedBody?: boolean;
}

const TEAM_DOMINANT_BODY_PRESETS = new Set<MaterialPreset>([
  "evil_void",
  "secret_beast",
  "secret_bone",
  "secret_demon",
  "secret_ghost",
  "secret_ice",
  "secret_nature",
]);

// How much of each preset's flesh tone / cloth tone survives over the team color.
const SKIN_FLESH_WEIGHT = 0.25;
// Red skin takes more of the flesh tone: the red team colour nearly pure is a crimson, and TABS red skin is a duller rose red.
const WARM_SKIN_FLESH_WEIGHT = 1.0;
// Bare skin is part self-lit with the hue of its team colour, so the faces lit by the sun are a bright team colour and not a dull one.
const SKIN_GLOW = 0.4;
const SKIN_GLOW_BLUE = 1.5;
// Red skin keeps three quarters of its blue: the blue sky light on the whole of it turned the lit faces pink.
const WARM_SKIN_BLUE = 0.75;
// ...and is lightened: red well past white, green and blue lifted a little, so its sunlit faces are a coral red: lifted 0.18 and 0.30 they were pink. Red alone, to 1.8, left them at the same level and only more saturated.
const WARM_SKIN_RED = 2.5;
const WARM_SKIN_GREEN_LIFT = 0.14; // at 0.10 the sunlit faces were a duller, bluer red than the coral of TABS
const WARM_SKIN_BLUE_LIFT = 0.06; // at 0.12 the lit skin still carried a blue cast, a rose pink beside the crimson of TABS red
// Its glow is a quarter of the cool skin's, so its shaded side is a deep crimson: at full strength the red stayed a bright scarlet however the base was greyed, and at three quarters its shaded side was as light as its lit one. At 0.35 its lit side was a bubblegum pink.
const WARM_SKIN_GLOW = 0.25;
// Red has next to no blue above its weakest channel to glow with, so its shaded side was a brick: this much blue glows on it flat, and the shade is a crimson toward plum.
const WARM_SKIN_GLOW_BLUE = 0.03;
// The head is kept out of the glow layer for its eyes' sake, and so glows this much more in its own material to stay the tone of the arms.
const HEAD_GLOW = 1.9;
const BODY_PRESET_WEIGHT = 0.45;
// Preset metal is quartered: an unlit-environment metal body goes grey or near-black and loses its team colour.
const BODY_METAL_WEIGHT = 0.25;
// Cloth and armour are a different hue from the team-coloured skin they are worn over, not just a darker one:
// rotated away from the skin hue and a little darker, but nearly as saturated so it still reads as the team's.
const CLOTH_HUE_SHIFT = 18;
// Cool cloth turns less far: at 18 a tunic was teal beside the navy tabards and periwinkle skin in the same rank, three hues on one team.
const COOL_CLOTH_HUE_SHIFT = 8;
const CLOTH_SATURATION = 0.92;
// Cloth is a fifth darker than the skin it is worn over: at the same value a tunic and the arms out of it were one tone.
const CLOTH_SHADE = 0.8;
// Cool cloth is at least this saturated: at the pale team blue’s own it was the grey-blue of the skin beside it, and every tunic in a lineup was one tone.
const COOL_CLOTH_SATURATION = 0.7; // at 0.55 a tunic was a washed pale cyan beside the 0.75 tabards in the same rank
// A tunic takes a twentieth of its unit’s accent colour before it is shaded, so a bard’s, an archer’s and a healer’s are three blues and not one: at a fifth a green or gold accent turned the tunic teal beside the navy tabards.
const CLOTH_ACCENT_WEIGHT = 0.05;
// Trousers are a darker shade of the tunic cloth, so the legs break from the torso at the waist and from the boot at the ankle.
const TROUSER_SHADE = 0.68;
// Clothed humanoids take more of their preset's cloth tone, so the torso is a different hue from the skin.
const CLOTHED_PRESET_WEIGHT = 0.75;
// Armour is the team colour itself, only darker (TABS): a light wash of its metal, no hue rotation for warm plate. More grey or a
// turn toward orange and red plate goes brown-maroon.
const ARMOUR_PRESET_WEIGHT = 0.2;
// Plate is a clearly darker value than the skin of the head and hands beside it, on top of the cloth shade.
const ARMOUR_SHADE = 0.65;
// Cool plate is hardly darkened and turned toward royal blue: the sky-blue team colour at the warm shade is a dark teal.
const COOL_ARMOUR_SHADE = 0.9;
const COOL_ARMOUR_HUE_SHIFT = 12;
// Cool plate and surcoats are never paler than this: the sky-blue team colour only darkened is slate, and TABS knights are a deep blue.
const COOL_ARMOUR_SATURATION = 0.85;
// Boots are the trouser cloth a shade darker, so the foot ends the leg and does not sit under it as a black block.
const BOOT_SHADE = 0.7;
// Under cool plate the boot is a neutral grey and the leg is the plate itself: a darker blue leg and boot ran into one navy with the cuirass, or near black.
const COOL_ARMOUR_BOOT = new Color3(0.40, 0.42, 0.46);
const BARE_FOOT_SHADE = 0.72;
// Red darkened as far as blue goes brick-maroon, so warm cloth, plate, trousers and boots keep only a quarter of each darkening and stay coral.
const WARM_SHADE_KEEP = 0.25;
// ...but trousers and boots keep four fifths of theirs, so red legs step clearly down from the tunic, and warm cloth and
// plate are pushed more saturated instead of washing out to salmon.
const WARM_LEG_SHADE_KEEP = 0.8;
const WARM_SATURATION = 1.18;
// A surcoat is the team colour a shade deeper (nine tenths of it, never paled toward cream) with a cream cross on the chest, the
// full width of the chest it covers and long enough to hang a third of the torso's height below it as a short skirt,
// cinched by a dark belt.
const TABARD_COLOR = new Color3(0.93, 0.9, 0.8);
const TABARD_SHADE = 0.9;
// A cool surcoat is turned half as far toward royal blue as the plate and is deeper: the sky-blue team colour at nine tenths is a pale cyan board on the chest, and at six tenths the surcoat was a navy mass beside the teal cloth of its own rank.
const COOL_TABARD_HUE_SHIFT = 6;
const COOL_TABARD_SHADE = 0.78;
const TABARD_WIDTH = 1.02;
const TABARD_LENGTH = 1.6;
const TABARD_DEPTH = 1.18;
// Under the tabard the arms are sleeves of pale grey mail, not bare team-coloured skin.
const MAIL_COLOR = new Color3(0.78, 0.8, 0.84);
const BELT_COLOR = new Color3(0.2, 0.14, 0.1);
// Zeus wears a plain off-white tunic with a red sash from one shoulder to the other hip, not a breastplate.
const ZEUS_TUNIC_COLOR = new Color3(0.94, 0.92, 0.86);
const ZEUS_SASH_COLOR = new Color3(0.8, 0.2, 0.2);
// Tribal units wear nothing but a hide loincloth: the only part of them that is not team-coloured skin.
const LOINCLOTH_COLOR = new Color3(0.42, 0.27, 0.15);
// ...and a dark shaggy mop of hair over the crown and the back of the head.
const TRIBAL_HAIR_COLOR = new Color3(0.16, 0.1, 0.06);
/*
 * Skeletons are bones, not men (250; units/spooky.skeleton_warrior: cream bone limbs about a third as thick as a man's, a rib cage of hoops round a thin
 * spine in place of the chest block, a bare skull for a head under a team-coloured hood, and a ragged team-coloured skirt from the hips to the knees with
 * tatters hanging off its hem). Team colour lives on the cloth: hood, skirt, shield.
 *   Limbs SKELETON_LIMB of their width; spine SKELETON_SPINE of the chest width; SKELETON_RIBS hoops from SKELETON_RIB_TOP down to SKELETON_RIB_LOW of the
 *   chest height, narrowing from the chest's width; skirt SKELETON_SKIRT of the thigh long, its hem SKELETON_HEM pelvis widths across, SKELETON_TATTERS tatters.
 */
const SKELETON_UNITS = new Set(["spooky.skeleton_warrior", "spooky.skeleton_archer"]);
// Warm cream: a paler bone went lavender-grey in the shade under the teal sky
const SKELETON_BONE = new Color3(1.0, 0.86, 0.6);
const SKELETON_LIMB = 0.42;
const SKELETON_SPINE = 0.16;
const SKELETON_RIBS = 4;
const SKELETON_RIB_TOP = 0.86;
const SKELETON_RIB_LOW = 0.42;
const SKELETON_SKIRT = 0.7;
const SKELETON_HEM = 1.45;
const SKELETON_TATTERS = 6;
const SKELETON_CLOTH = 0.72;
/*
 * The reaper (251; units/spooky.reaper): a skeleton in a hooded robe. Read off the reference: the cowl is deep and drawn down over the brow, about 1.7 heads
 * across, the bone skull and its bead eyes looking out of the opening; the robe hangs from the shoulders, wider than the chest, in wide sleeves to the wrist,
 * and falls in a ragged hem to mid-shin, the bone shins and feet showing below it; the cloth is near-black maroon, tinted toward the team.
 *   REAPER_HOOD heads across, REAPER_HOOD_OPEN of its round open at the face, REAPER_HOOD_FORWARD heads set forward (negative: back); robe REAPER_ROBE chest widths at the hem
 *   of the bodice, skirt REAPER_SKIRT thighs long flaring to REAPER_HEM pelvis widths, REAPER_TATTERS rags off the hem; sleeves REAPER_SLEEVE thicker than an arm.
 * 252: the cowl set back off the face and opened wider so the bone skull stands proud of it, with a long bone jaw (REAPER_JAW*); the hem raised to mid-shin, rags included.
 */
const REAPER_HOOD = 1.7;
const REAPER_HOOD_OPEN = 0.46;
const REAPER_HOOD_FORWARD = -0.24;
const REAPER_JAW = 0.5;
const REAPER_JAW_LONG = 0.5;
const REAPER_ROBE = 1.3;
const REAPER_SKIRT = 0.85;
const REAPER_HEM = 2.1;
const REAPER_TATTERS = 7;
const REAPER_SLEEVE = 1.35;
const REAPER_CLOTH = new Color3(0.3, 0.06, 0.09);
const REAPER_TEAM = 0.4;
/*
 * The tree giant (253; units/secret.tree_giant): not a tree-man but a giant woodsman carrying a whole tree. Read off the reference: team-coloured bare skin on
 * the forearms, legs and face; a dark teal short-sleeved tunic over the chest and upper arms, a rope belt at the waist; a dark hood drawn over the crown, open on
 * the face so the bead eyes show, running into a long beard that hangs from the chin onto the chest; a ragged khaki skirt from the waist to the knee.
 *   TREE_GIANT_HOOD heads across, TREE_GIANT_HOOD_OPEN of its round open at the face; beard TREE_GIANT_BEARD heads long, TREE_GIANT_BEARD_WIDE heads across at the chin;
 *   skirt TREE_GIANT_SKIRT thighs long flaring to TREE_GIANT_HEM pelvis widths, TREE_GIANT_TATTERS rags off the hem.
 */
const TREE_GIANT_HOOD = 1.32;
const TREE_GIANT_HOOD_OPEN = 0.42;
const TREE_GIANT_BEARD = 1.05;
const TREE_GIANT_BEARD_WIDE = 0.85;
const TREE_GIANT_SKIRT = 0.85;
const TREE_GIANT_HEM = 1.3;
const TREE_GIANT_TATTERS = 8;
const TREE_GIANT_TUNIC = new Color3(0.08, 0.18, 0.2);
const TREE_GIANT_HAIR = new Color3(0.42, 0.15, 0.17);
const TREE_GIANT_HAIR_TEAM = 0.1;
const TREE_GIANT_RAGS = new Color3(0.56, 0.42, 0.28);
/*
 * The painter (255; units/renaissance.painter): a two-tone man, not one team colour. A dark team doublet and sleeves, tan hose to the ankle, red-brown shoes, a
 * cream ruff in two stacked collars round the neck, a dark team beret; the palette rides in the off hand (propBuilder "palette").
 *   doublet PAINTER_DOUBLET of the team colour, beret PAINTER_BERET; ruff PAINTER_RUFF necks across in PAINTER_RUFF_TIERS tiers.
 */
const PAINTER_DOUBLET = 0.6;
const PAINTER_BERET = 0.42;
const PAINTER_HOSE = new Color3(0.92, 0.6, 0.3);
const PAINTER_SHOE = new Color3(0.66, 0.22, 0.12);
const PAINTER_RUFF_COLOR = new Color3(1.0, 0.86, 0.55);
const PAINTER_RUFF = 1.25;
const PAINTER_RUFF_TIERS = 2;
/*
 * The righteous paladin (units/good.righteous_paladin): white plate trimmed in gold over the team skin, not a plain team tunic. Read off the reference: white
 * chest, hips, thighs, greaves and feet; bare team-skin arms; bright orange-gold bands at the waist and round each knee with a pointed gold knee plate on the
 * front; a white-steel helm with a gold band round its rim and a gold comb over its crown; a white shield with a gold rim and a gold device on the face.
 *   white PALADIN_WHITE and gold PALADIN_GOLD are self-lit (PALADIN_GLOW, PALADIN_GOLD_GLOW) so they stay white and gold in the lineup shade;
 *   waist band PALADIN_BELT of the chest's height, knee bands PALADIN_KNEE legs across, helm band PALADIN_HELM_BAND of the helm's height.
 */
const PALADIN_WHITE = new Color3(0.93, 0.94, 0.96);
const PALADIN_GOLD = new Color3(0.95, 0.52, 0.06);
const PALADIN_GLOW = 0.2;
const PALADIN_GOLD_GLOW = 0.22;
const PALADIN_BELT = 0.14;
const PALADIN_KNEE = 1.15;
const PALADIN_HELM_BAND = 0.16;
/*
 * The void cultist (units/evil.void_cultist): a bald, bearded priest in a long dark robe, not a man in a plain hood. Read off the reference: a dark
 * maroon-brown robe from the neck to the shins, banded in the team colour twice near its hem, at the neck and at the cuffs; bare team-skin head with a long
 * grey-tan beard hanging in strands to the chest; a wooden sun wheel (a ring ~2 heads across with ~10 spokes to a hub) standing upright behind the head;
 * a dark round wooden shield studded with spikes round its rim and one at the boss; a staff topped with a spiked iron ball.
 *   robe VOID_ROBE, self-lit VOID_GLOW; bands team, self-lit VOID_BAND_GLOW; skirt VOID_SKIRT thighs long, hem VOID_HEM pelvises wide;
 *   wheel VOID_WHEEL heads across, VOID_SPOKES spokes; beard VOID_BEARD heads long in VOID_STRANDS strands; shield VOID_SHIELD chests across, VOID_STUDS rim spikes.
 */
const VOID_ROBE = new Color3(0.3, 0.15, 0.12);
const VOID_WOOD = new Color3(0.36, 0.22, 0.15);
const VOID_BEARD_COLOR = new Color3(0.62, 0.52, 0.4);
const VOID_GLOW = 0.12;
const VOID_BAND_GLOW = 0.3;
const VOID_SKIRT = 1.75;
const VOID_HEM = 1.6;
const VOID_WHEEL = 2.1;
const VOID_SPOKES = 10;
const VOID_BEARD = 0.85;
const VOID_STRANDS = 5;
const VOID_SHIELD = 1.5;
const VOID_STUDS = 8;
/*
 * The horned evil (units/evil.shadow_walker, evil.death_bringer): a horned head over dark armour, not a man in a plain hood. Read off the references:
 *   shadow_walker: a dark iron cap on the crown, a mask of ~5 cream bone teeth hanging down over the face, and two long pale horns that run out level from the
 *   cap's sides for about a head, then turn and rise ~1.5 heads above the crown in a wide U (span ~3 heads); a dark navy jerkin, dark brown breeches and boots,
 *   cream spikes standing off the forearm guards, the shins and the shoulders; team-skin arms.
 *   death_bringer: a cream skull over the whole head with dark sockets, and two dark purple horns from the crown that rise ~1.8 heads and sweep back; a black
 *   tunic and short dark breeches; shins wrapped in pale bandage bands.
 *   Horn paths are head-local points in heads (x out to the side, y up, z to the face), each horn EVIL_HORN_ROOT x thick heads across at the root, tapering to a point;
 *   the dark cloth self-lit EVIL_GLOW and the pale bone EVIL_BONE_GLOW so neither greys out in the lineup shade; EVIL_SPIKE heads long per spike.
 *   tempest_lich (units/evil.tempest_lich): no hood. A crown of ~7 dark red-brown branch tines rises straight off the crown, the tallest ~2.4 heads, each kinking
 *   out and back like a dead twig; a dark purple robe to the ankle with its hem torn into long rags. LICH_TINES tines, LICH_TINE_TALL heads at the tallest.
 *   mad_mechanic (factions/evil, third from left): no hood. A dark leather cap with a pair of round pale-blue goggles on the brow, a dark leather apron to the knee.
 */
type HornedEvilStyle = {
  horn: [number, number, number][]; hornColor: Color3; cloth: Color3; legs: Color3; helm: Color3 | null; teeth: number; skull: boolean;
  spikes: boolean; wraps: boolean; skirt: number; thick: number; tines?: number; goggles?: boolean; rags?: number;
};
const HORNED_EVIL: Record<string, HornedEvilStyle> = {
  "evil.shadow_walker": {
    horn: [[0.42, 0.3, 0], [0.95, 0.38, 0], [1.42, 0.5, 0], [1.62, 0.95, 0], [1.6, 1.55, 0.05], [1.5, 2.0, 0.1]],
    hornColor: new Color3(0.9, 0.8, 0.55), cloth: new Color3(0.1, 0.11, 0.24), legs: new Color3(0.26, 0.17, 0.12),
    helm: new Color3(0.24, 0.16, 0.13), teeth: 5, skull: false, spikes: true, wraps: false, skirt: 0, thick: 1,
  },
  "evil.death_bringer": {
    horn: [[0.24, 0.42, -0.05], [0.4, 0.95, -0.18], [0.46, 1.45, -0.5], [0.36, 1.85, -1.0], [0.24, 2.05, -1.45]],
    hornColor: new Color3(0.22, 0.12, 0.32), cloth: new Color3(0.1, 0.07, 0.13), legs: new Color3(0.14, 0.09, 0.2),
    helm: null, teeth: 0, skull: true, spikes: false, wraps: true, skirt: 0.55, thick: 1.5,
  },
  "evil.tempest_lich": {
    horn: [], hornColor: new Color3(0.3, 0.13, 0.11), cloth: new Color3(0.17, 0.09, 0.22), legs: new Color3(0.12, 0.07, 0.15),
    helm: new Color3(0.13, 0.08, 0.15), teeth: 0, skull: false, spikes: false, wraps: false, skirt: 1.9, thick: 1, tines: 7, rags: 9,
  },
  "evil.mad_mechanic": {
    horn: [], hornColor: new Color3(0.3, 0.2, 0.13), cloth: new Color3(0.24, 0.15, 0.1), legs: new Color3(0.16, 0.11, 0.09),
    helm: new Color3(0.32, 0.2, 0.12), teeth: 0, skull: false, spikes: false, wraps: false, skirt: 0.95, thick: 1, goggles: true,
  },
};
const LICH_TINE_TALL = 2.4;
const GOGGLE_GLASS = new Color3(0.55, 0.85, 1);
const EVIL_HORN_ROOT = 0.24;
const EVIL_BONE = new Color3(0.9, 0.82, 0.62);
const EVIL_GLOW = 0.15;
const EVIL_BONE_GLOW = 0.3;
const EVIL_SPIKE = 0.32;
/*
 * The super peasant (units/legacy.super_peasant): a giant farmhand with a shock of straw hair in a plain sack, not a laurel-crowned hero. Read off the reference:
 * a mop of pale straw hair, thick spiky locks swept up and back off the crown (~12 seen), standing ~1 head off the scalp and hanging over the brow; an off-white
 * sack tunic from the shoulders to mid-thigh, belted with a thick tan rope; bare team-skin arms, legs and feet.
 *   hair STRAW_LOCKS locks each STRAW_LOCK heads long, swept STRAW_SWEEP back off upright, self-lit STRAW_GLOW; sack SACK_COLOR, skirt SACK_SKIRT knees long.
 */
const STRAW_COLOR = new Color3(0.92, 0.66, 0.24);
const STRAW_GLOW = 0.2;
const STRAW_LOCKS = 16;
const STRAW_LOCK = 1.1;
const STRAW_SWEEP = 0.75;
const SACK_COLOR = new Color3(0.9, 0.88, 0.82);
const SACK_GLOW = 0.18;
const SACK_SKIRT = 0.62;
const SACK_ROPE = new Color3(0.78, 0.64, 0.4);
/*
 * The cactus (256; units/wild_west.cactus): a man in a full-length cactus suit, not a man holding a green plank. Read off the reference: one dark green robe from
 * the shoulders to the ankle, flaring a little to the hem, with green sleeves to the wrist; a squarish green hood over the head with a window cut on the face so the
 * team-skin face and bead eyes show; team-skin shins and dark shoes under the hem; the whole suit studded with fat brown-maroon four-sided spines (about 40 seen
 * on one side), standing straight out of the cloth; a lilac flower with a yellow eye on the crown of the hood and one low on the robe front.
 *   robe CACTUS_ROBE chest widths across at the hem, CACTUS_LONG of the leg long; hood CACTUS_HOOD heads across, CACTUS_HOOD_OPEN of its round open on the face;
 *   sleeves CACTUS_SLEEVE thick; CACTUS_SPINES spines on the robe, CACTUS_SLEEVE_SPINES per arm segment, CACTUS_HOOD_SPINES on the hood, each CACTUS_SPINE heads tall.
 */
const CACTUS_ROBE = 1.55;
const CACTUS_LONG = 0.86;
const CACTUS_HOOD = 1.6;
const CACTUS_HOOD_OPEN = 0.26;
const CACTUS_SLEEVE = 1.4;
const CACTUS_SPINES = 34;
const CACTUS_SLEEVE_SPINES = 3;
const CACTUS_HOOD_SPINES = 6;
const CACTUS_SPINE = 0.4;
const CACTUS_GREEN = new Color3(0.12, 0.36, 0.2);
const CACTUS_SPINE_COLOR = new Color3(0.66, 0.38, 0.26);
const CACTUS_PETAL = new Color3(0.62, 0.55, 0.98);

// Clothes are solids hung on the body, not a colour painted on it. The lower half of a garment is a faceted bell hung from the waist over the pelvis and the tops of
// the thighs, standing off the legs at its hem: it rides the hips and not the legs, so a stride swings the knees out from under it. length is in thighs, flare is the
// hem's width over the pelvis's.
const SKIRT_WAIST = 1.15;
const ARMOUR_SKIRT_SHADE = 0.8;
const FUR_COLOR = new Color3(0.3, 0.2, 0.13);
function hangSkirt(scene: Scene, body: ArticulatedBody, name: string, length: number, flare: number, material: Material | null): Mesh | null {
  const pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return null;
  const size = pelvis.getBoundingInfo().boundingBox.extendSize;
  const drop = Math.abs(body.leftKnee.position.y) * length;
  const skirt = MeshBuilder.CreateCylinder(name, {
    height: drop, diameterTop: size.x * 2 * SKIRT_WAIST, diameterBottom: size.x * 2 * flare, tessellation: 6,
  }, scene);
  skirt.convertToFlatShadedMesh();
  skirt.scaling.z = Math.max(0.7, size.z / size.x * 1.25);
  skirt.position.y = pelvis.position.y + size.y - drop / 2;
  skirt.parent = body.hip;
  skirt.material = material;
  return skirt;
}

// A fur collar is a fat faceted ring laid over the shoulders round the neck, as wide as the chest
function furCollar(scene: Scene, body: ArticulatedBody): Mesh {
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const span = chest.x * 2 * body.torsoMesh.scaling.x;
  const collar = MeshBuilder.CreateTorus("furCollar", { diameter: span * 0.64, thickness: span * 0.32, tessellation: 7 }, scene);
  collar.convertToFlatShadedMesh();
  collar.scaling.set(1, 0.85, Math.max(0.75, chest.z * body.torsoMesh.scaling.z / (chest.x * body.torsoMesh.scaling.x) * 1.3));
  collar.position.y = body.torsoMesh.position.y + chest.y * 0.9;
  collar.parent = body.torsoMesh.parent;
  collar.material = getMaterialFactory().getCloth(FUR_COLOR);
  return collar;
}

function shouldFavorTeamBodyColor(materialPreset: MaterialPreset): boolean {
  return TEAM_DOMINANT_BODY_PRESETS.has(materialPreset);
}

export class UnitFactory {
  private _scene: Scene;
  shadowGenerator?: ShadowGenerator;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  spawn(
    definition: UnitDefinition,
    team: number,
    position: Vector3,
    options: SpawnVisualOptions = {},
  ): RuntimeUnit {
    const ragdoll = getRagdollProfile(definition.ragdollProfileId);
    const crowdPhysics = getCrowdPhysicsProfile(definition.crowdPhysicsProfileId);
    const visual = options.visualOverride ?? getUnitVisual(definition.id);
    const linkedPreset = getLinkedActorPreset(definition.id);
    const materialPreset = visual.materialPreset ?? "default";

    // Team color is the skin and dominates the body; faction color and material preset only tint it,
    // with low-skin/non-skin units biased even further toward team ownership.
    const factionColor = FACTION_COLORS[definition.faction] ?? new Color3(0.5, 0.5, 0.5);
    const teamColor = TEAM_COLORS[team] ?? new Color3(0.5, 0.5, 0.5);
    const shouldUseVehicleBody = isVehicleUnit(definition.id) && !options.forceArticulatedBody;
    const isArmored = materialPreset === "medieval_steel" || materialPreset === "ancient_bronze"
      || materialPreset === "good_gold" || materialPreset === "secret_hero" || materialPreset === "secret_holy";
    const bodyColor = Color3.Lerp(
      factionColor,
      teamColor,
      isArmored ? 0.95 : shouldUseVehicleBody || shouldFavorTeamBodyColor(materialPreset) ? 0.9 : 0.85,
    );
    const skinColor = teamColor.scale(0.9);
    const isZeus = definition.id === "ancient.zeus";
    const bareSkinned = definition.faction === FactionId.Tribal && !shouldFavorTeamBodyColor(materialPreset);

    let body;
    let propMeshes: Mesh[] = [];

    if (shouldUseVehicleBody) {
      // Build as vehicle/equipment instead of humanoid
      body = buildVehicleBody(this._scene, definition.id, bodyColor, {
        showOperators: options.suppressDecorativeOperators ? false : true,
      });
    } else {
      // Build articulated humanoid body
      body = buildArticulatedBody(
        this._scene,
        `${team}_${definition.id}_${Math.random().toString(36).slice(2, 6)}`,
        // Linked gun crew are built to the infantry's widths like a machine's own operator
        visual.posePreset === "crew" ? crewProportions(visual.proportions) : visual.proportions,
        bodyColor,
        {
          detailLevel: visual.bodyDetailLevel ?? "standard",
          showNeck: true,
          showShoulderPads: isArmored && !isZeus,
          showBelt: isArmored,
        },
      );
      // Attach weapon, hat, shield, special props
      propMeshes = attachProps(this._scene, body, visual, visual.proportions.scale ?? 1.0, teamColor);
      // Arms are bare team-coloured skin (TABS); the torso and thighs keep the cloth or armour colour as a
      // tunic and trousers down to the ankle, and the feet are boots a shade darker than the trousers. Whole-body presets (ghost, bone, void...)
      // stay one material.
      if (bareSkinned) {
        // Bare from head to foot (TABS tribal): only the pelvis block keeps the body material, as the loincloth;
        // the thigh heads that sink into its corners are bare leg.
        for (const mesh of body.root.getChildMeshes(false)) {
          if (mesh.material !== body.bodyMaterial || propMeshes.includes(mesh as Mesh)) continue;
          if (!/_pelvis$/.test(mesh.name)) mesh.material = body.skinMaterial;
        }
        // Hair mop: a coarse faceted lump half as big again as the head, set up and back so the face stays bare. Not under a bone skull cap: the cap is his crown.
        if (visual.hat !== "bone_mask" && visual.hat !== "antler_skull") {
          const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
          const hair = MeshBuilder.CreateSphere(`${body.headMesh.name}_hair`, { diameter: headSize * 1.5, segments: 3 }, this._scene);
          hair.position.set(0, headSize * 0.24, -headSize * 0.14);
          hair.material = getMaterialFactory().getCloth(TRIBAL_HAIR_COLOR);
          hair.convertToFlatShadedMesh();
          hair.parent = body.headMesh;
          propMeshes.push(hair);
        }
      } else if (!shouldFavorTeamBodyColor(materialPreset)) {
        for (const limb of [body.leftUpperArm, body.rightUpperArm]) {
          limb.material = body.skinMaterial;
        }
      }
    }

    const clothed = !shouldUseVehicleBody && !shouldFavorTeamBodyColor(materialPreset);
    applyMaterialPreset(body, visual, bodyColor, skinColor, clothed ? (isArmored ? ARMOUR_PRESET_WEIGHT : CLOTHED_PRESET_WEIGHT) : BODY_PRESET_WEIGHT, shouldUseVehicleBody ? 0 : SKIN_GLOW);
    if (!shouldUseVehicleBody && body.headMesh.material === body.skinMaterial) {
      const headMaterial = body.skinMaterial.clone(`${body.skinMaterial.name}_head`);
      headMaterial.emissiveColor = body.skinMaterial.emissiveColor.scale(HEAD_GLOW);
      body.headMesh.material = headMaterial;
    }
    if (bareSkinned && clothed) {
      body.bodyMaterial.baseColor = LOINCLOTH_COLOR;
      // Bare feet are a slightly darker shade of the skin, so a bare leg still ends in a foot and not a point.
      const soleMaterial = getMaterialFactory().getCloth(body.skinMaterial.baseColor.scale(BARE_FOOT_SHADE));
      for (const mesh of [...body.leftKnee.getChildMeshes(true), ...body.rightKnee.getChildMeshes(true)]) {
        if (/_[lr]FootM$/.test(mesh.name)) mesh.material = soleMaterial;
      }
    } else if (clothed) {
      // Warm cloth rotates toward orange and tan, cool cloth toward teal, so neither drifts into the other team's colour.
      const accentTint = !isArmored && visual.accentColor ? Color3.FromHexString(visual.accentColor) : null;
      const hsv = (accentTint ? Color3.Lerp(body.bodyMaterial.baseColor, accentTint, CLOTH_ACCENT_WEIGHT) : body.bodyMaterial.baseColor).toHSV();
      const cool = hsv.r > 150 && hsv.r < 300;
      const shade = (factor: number) => cool ? factor : 1 - (1 - factor) * WARM_SHADE_KEEP;
      const legShade = (factor: number) => cool ? factor : 1 - (1 - factor) * WARM_LEG_SHADE_KEEP;
      const hue = isArmored ? hsv.r + (cool ? COOL_ARMOUR_HUE_SHIFT : 0) : (hsv.r + (cool ? -COOL_CLOTH_HUE_SHIFT : CLOTH_HUE_SHIFT) + 360) % 360;
      const saturation = cool ? (isArmored ? Math.max(hsv.g, COOL_ARMOUR_SATURATION) : Math.max(hsv.g * CLOTH_SATURATION, COOL_CLOTH_SATURATION)) : Math.min(1, hsv.g * WARM_SATURATION);
      body.bodyMaterial.baseColor = Color3.HSVtoRGBToRef(hue, saturation, hsv.b * shade(CLOTH_SHADE) * (isArmored ? (cool ? COOL_ARMOUR_SHADE : shade(ARMOUR_SHADE)) : 1), new Color3());
      // Trousers and boots are shades of the team skin, not of the tunic: orange-tan legs vanish against the autumn grass, and cool legs shaded from the tunic were one navy with it.
      const legBase = isArmored ? body.bodyMaterial.baseColor : body.skinMaterial.baseColor;
      const plateLegs = isArmored && cool;
      const trouserMaterial = getMaterialFactory().getCloth(plateLegs ? legBase : legBase.scale(legShade(TROUSER_SHADE)));
      for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
        leg.material = trouserMaterial;
      }
      const bootMaterial = getMaterialFactory().getCloth(plateLegs ? COOL_ARMOUR_BOOT : legBase.scale(legShade(TROUSER_SHADE) * legShade(BOOT_SHADE)));
      for (const mesh of [...body.leftKnee.getChildMeshes(true), ...body.rightKnee.getChildMeshes(true)]) {
        if (/_[lr]FootM$/.test(mesh.name)) mesh.material = bootMaterial;
      }
    }

    if (SKELETON_UNITS.has(definition.id) && !shouldUseVehicleBody) {
      propMeshes.push(...dressSkeleton(this._scene, body, teamColor));
    }
    if (definition.id === "spooky.reaper" && !shouldUseVehicleBody) {
      propMeshes.push(...dressReaper(this._scene, body, teamColor));
    }
    if (definition.id === "secret.tree_giant" && !shouldUseVehicleBody) {
      propMeshes.push(...dressTreeGiant(this._scene, body, teamColor));
    }
    if (definition.id === "renaissance.painter" && !shouldUseVehicleBody) {
      propMeshes.push(...dressPainter(this._scene, body, teamColor, propMeshes));
    }
    if (definition.id === "wild_west.cactus" && !shouldUseVehicleBody) {
      propMeshes.push(...dressCactus(this._scene, body, teamColor));
    }
    if (definition.id === "good.righteous_paladin" && !shouldUseVehicleBody) {
      propMeshes.push(...dressPaladin(this._scene, body, propMeshes));
    }
    if (definition.id === "evil.void_cultist" && !shouldUseVehicleBody) {
      propMeshes.push(...dressVoidCultist(this._scene, body, teamColor, propMeshes));
    }
    if (HORNED_EVIL[definition.id] && !shouldUseVehicleBody) {
      propMeshes.push(...dressHornedEvil(this._scene, body, HORNED_EVIL[definition.id]));
    }
    if (definition.id === "legacy.super_peasant" && !shouldUseVehicleBody) {
      propMeshes.push(...dressSuperPeasant(this._scene, body));
    }

    if (isZeus && !shouldUseVehicleBody) {
      body.bodyMaterial.baseColor = ZEUS_TUNIC_COLOR;
      body.bodyMaterial.metallic = 0;
      const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
      const sash = MeshBuilder.CreateBox("zeusSash", {
        width: chest.x * body.torsoMesh.scaling.x * 2.3, height: chest.y * 0.3, depth: chest.z * body.torsoMesh.scaling.z * 2.12,
      }, this._scene);
      sash.parent = body.torsoMesh.parent;
      sash.position.y = body.torsoMesh.position.y;
      sash.rotation.z = 0.75;
      sash.material = getMaterialFactory().getCloth(ZEUS_SASH_COLOR);
      propMeshes.push(sash);
      // The tunic hangs on below the waist as a skirt to just above the knee: the torso's own shape turned over,
      // so it is narrow at the waist and flares to the hem.
      const skirtLength = Math.abs(body.leftKnee.position.y) * 0.9;
      const skirt = body.torsoMesh.clone("zeusSkirt");
      skirt.scaling.set(body.torsoMesh.scaling.x * 1.08, skirtLength / (chest.y * 2), body.torsoMesh.scaling.z * 1.15);
      skirt.rotation.z = Math.PI;
      skirt.position.y = body.torsoMesh.position.y - chest.y * 0.92 - skirtLength / 2;
      skirt.material = getMaterialFactory().getCloth(ZEUS_TUNIC_COLOR);
      propMeshes.push(skirt);
    }

    // Helmed medieval men-at-arms wear a tabard: team-coloured cloth down the chest and back with a pale cross on the front.
    if (!shouldUseVehicleBody && definition.faction === FactionId.Medieval && (visual.hat === "great_helm" || visual.hat === "plume_helmet")) {
      // It is the torso's own tapered shape, a skin thicker front and back, so it hugs the chest, narrows with the
      // waist and ends above the hip instead of standing off the body as a board.
      const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
      const tabard = body.torsoMesh.clone("tabard");
      tabard.scaling.set(body.torsoMesh.scaling.x * TABARD_WIDTH, TABARD_LENGTH, body.torsoMesh.scaling.z * TABARD_DEPTH);
      tabard.position.y = body.torsoMesh.position.y + chest.y * (1 - TABARD_LENGTH) * 0.8;
      const teamHsv = teamColor.toHSV();
      const coolTabard = teamHsv.r > 150 && teamHsv.r < 300;
      const tabardColor = coolTabard
        ? Color3.HSVtoRGBToRef(teamHsv.r + COOL_TABARD_HUE_SHIFT, Math.max(teamHsv.g, COOL_ARMOUR_SATURATION), teamHsv.b, new Color3())
        : teamColor;
      tabard.material = getMaterialFactory().getCloth(tabardColor.scale(coolTabard ? COOL_TABARD_SHADE : TABARD_SHADE));
      propMeshes.push(tabard);
      const mailMaterial = getMaterialFactory().getCloth(MAIL_COLOR);
      for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
        limb.material = mailMaterial;
      }
      // The cross is two thin cream bars sunk into the front of the cloth, so only their faces show on the chest.
      const crossDepth = chest.z * body.torsoMesh.scaling.z * 0.3;
      const crossMaterial = getMaterialFactory().getCloth(TABARD_COLOR);
      for (const [width, height] of [[0.2, 1.3], [1.0, 0.18]]) {
        const bar = MeshBuilder.CreateBox("tabardCross", {
          width: chest.x * body.torsoMesh.scaling.x * width, height: chest.y * height, depth: crossDepth,
        }, this._scene);
        bar.parent = body.torsoMesh.parent;
        bar.position.y = body.torsoMesh.position.y + chest.y * 0.25;
        bar.position.z = chest.z * body.torsoMesh.scaling.z * (TABARD_DEPTH + 0.04) - crossDepth / 2;
        bar.material = crossMaterial;
        propMeshes.push(bar);
      }
      // The belt is a thin dark band round the waist, just proud of the cloth, so the skirt below it reads as a hem.
      // It is a faceted ring of the torso's own section and not a box, whose corners stood out of the waist as a plate.
      const belt = MeshBuilder.CreateCylinder("tabardBelt", {
        diameter: Math.max(chest.x, chest.z) * 2 * body.torsoMesh.scaling.x * 0.88, height: chest.y * 0.14,
        tessellation: visual.bodyDetailLevel === "hero" ? 8 : 6,
      }, this._scene);
      belt.scaling.z = body.torsoMesh.scaling.z / body.torsoMesh.scaling.x * (TABARD_DEPTH / 1.06);
      belt.parent = body.torsoMesh.parent;
      belt.position.y = body.torsoMesh.position.y - chest.y * 0.85;
      belt.material = getMaterialFactory().getCloth(BELT_COLOR);
      propMeshes.push(belt);
    }

    // Every dressed man's garment ends in a skirt of its own: the tabard's long one, a tunic's short hem, a cloth kilt under a cuirass, and on a bare tribesman a hide
    // kilt in place of the painted loincloth, with a fur collar over his shoulders.
    if (!shouldUseVehicleBody && !shouldFavorTeamBodyColor(materialPreset) && !isZeus && visual.posePreset !== "crew") {
      const tabard = propMeshes.find((mesh) => mesh.name === "tabard");
      const skirt = bareSkinned
        ? hangSkirt(this._scene, body, "hideKilt", 0.5, 1.45, body.bodyMaterial)
        : tabard
          ? hangSkirt(this._scene, body, "tabardSkirt", 0.7, 1.6, tabard.material)
          : isArmored
            ? hangSkirt(this._scene, body, "armourKilt", 0.6, 1.55, getMaterialFactory().getCloth(body.bodyMaterial.baseColor.scale(ARMOUR_SKIRT_SHADE)))
            : hangSkirt(this._scene, body, "tunicSkirt", 0.45, 1.5, body.bodyMaterial);
      if (skirt) propMeshes.push(skirt);
      if (bareSkinned) propMeshes.push(furCollar(this._scene, body));
    }

    // Linked gun crew wear the same hooped shirt and brown trousers as the cannon's own operator, under their own headgear
    if (visual.posePreset === "crew" && !shouldUseVehicleBody) dressCannonCrew(this._scene, body, bodyColor, false);

    body.root.position = position.clone();
    // Face the border: blue (team 0) faces right (+X), red (team 1) faces left (-X)
    body.root.rotation.y = team === 0 ? Math.PI / 2 : -Math.PI / 2;

    // Tag all meshes for raycasting
    const unit = new RuntimeUnit(definition, team, body, propMeshes, visual, ragdoll, crowdPhysics);
    unit.initFxParticles(this._scene);
    if (!linkedPreset) {
      for (const part of definition.compositionParts ?? []) {
        unit.addLinkedDescriptor(part.relation, part.label, true);
      }
    }

    // Set animation style for special units
    if (definition.id === "tribal.mammoth" || definition.id === "good.sacred_elephant") {
      unit.animator.attackStyle = "mammoth";
      unit.animator.walkStyle = "quadruped";
    }
    // The elbow stub that runs up into the sleeve wears whatever the upper arm ended up in (sleeve, bare skin or mail), never the forearm's own skin
    for (const mesh of body.allMeshes) {
      const side = /_([lr])LowerArm_stub$/.exec(mesh.name)?.[1];
      if (side) mesh.material = (side === "l" ? body.leftUpperArm : body.rightUpperArm).material;
    }
    for (const mesh of [...body.allMeshes, ...propMeshes]) {
      mesh.metadata = { runtimeUnit: unit };
    }

    // Register shadow casters
    if (this.shadowGenerator) {
      for (const mesh of body.allMeshes) {
        this.shadowGenerator.addShadowCaster(mesh);
      }
      // Solid props cast too, so a shield or a spear shows in the shadow; see-through effect props do not
      for (const mesh of propMeshes) {
        if ((mesh.material?.alpha ?? 1) >= 1 && mesh.visibility >= 1) this.shadowGenerator.addShadowCaster(mesh, false);
      }
    }

    // No per-unit health bars: TABS never draws them; damage reads from the body alone.

    return unit;
  }
}

/** Strips a skeleton's body to bone (see SKELETON_*): thin bone limbs, a spine and rib hoops for the chest, a skull under a team hood, a ragged team skirt. */
function dressSkeleton(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const bone = getMaterialFactory().getCloth(SKELETON_BONE);
  const cloth = getMaterialFactory().getCloth(teamColor.scale(SKELETON_CLOTH));
  const flesh = new Set<Material | null>([body.bodyMaterial, body.skinMaterial]);
  for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    limb.scaling.x *= SKELETON_LIMB;
    limb.scaling.z *= SKELETON_LIMB;
    limb.material = bone;
  }
  // Hands, feet, neck and stubs: every part of the body left in flesh or cloth goes bone, whatever it was given
  for (const mesh of [...body.allMeshes, ...body.leftElbow.getChildMeshes(false), ...body.rightElbow.getChildMeshes(false), ...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name) || flesh.has(mesh.material)) mesh.material = bone;
  }
  // Chest: the block thins to a spine; rib hoops round it, widest at the top
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const foot = chest.position.y - H / 2;
  chest.scaling.x *= SKELETON_SPINE;
  chest.scaling.z *= SKELETON_SPINE * 2;
  chest.material = bone;
  // The shoulder yoke is the trunk's hull and trapezius: a skeleton has none, the ribs stand in for it
  for (const mesh of body.torso.getChildMeshes(true)) {
    if (/_yoke/.test(mesh.name)) mesh.setEnabled(false);
  }
  for (let i = 0; i < SKELETON_RIBS; i++) {
    const k = i / (SKELETON_RIBS - 1);
    const across = W * (0.95 - 0.3 * k);
    const rib = MeshBuilder.CreateTorus(`${chest.name}_rib`, { diameter: across, thickness: W * 0.07, tessellation: 8 }, scene);
    rib.scaling.z = (D * 0.9) / across;
    rib.position.set(0, foot + H * (SKELETON_RIB_TOP - (SKELETON_RIB_TOP - SKELETON_RIB_LOW) * k), D * 0.05);
    rib.material = bone;
    rib.convertToFlatShadedMesh();
    rib.parent = body.torso;
    added.push(rib);
  }
  const collar = MeshBuilder.CreateBox(`${chest.name}_collarbone`, { width: W * 1.05, height: W * 0.08, depth: W * 0.08 }, scene);
  collar.position.set(0, foot + H * 0.97, D * 0.1);
  collar.material = bone;
  collar.parent = body.torso;
  added.push(collar);
  // Skull and hood: the head goes bone; a team-coloured hood sits up and back over the crown, the face and its bead eyes clear in front
  body.headMesh.material = bone;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const hood = MeshBuilder.CreateSphere(`${body.headMesh.name}_hood`, { diameter: headSize * 1.32, segments: 4 }, scene);
  hood.position.set(0, headSize * 0.12, -headSize * 0.26);
  hood.material = cloth;
  hood.convertToFlatShadedMesh();
  hood.parent = body.headMesh;
  added.push(hood);
  // Ragged skirt from the pelvis to the knees, tatters hanging off the hem
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  if (pelvis) {
    pelvis.material = cloth;
    const pExt = pelvis.getBoundingInfo().boundingBox.extendSize;
    const thigh = body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2 * body.leftUpperLeg.scaling.y;
    const long = thigh * SKELETON_SKIRT;
    const top = pExt.x * 2.1, hem = pExt.x * 2 * SKELETON_HEM;
    const skirt = MeshBuilder.CreateCylinder(`${pelvis.name}_skirt`, { height: long, diameterTop: top, diameterBottom: hem, tessellation: 9 }, scene);
    skirt.scaling.z = (pExt.z * 2.2) / top;
    skirt.position.y = pelvis.position.y + pExt.y - long / 2;
    skirt.material = cloth;
    skirt.convertToFlatShadedMesh();
    skirt.parent = body.hip;
    added.push(skirt);
    for (let i = 0; i < SKELETON_TATTERS; i++) {
      const a = ((i + 0.5) / SKELETON_TATTERS) * Math.PI * 2;
      const drop = long * (0.25 + 0.2 * ((i * 7) % 3) / 2);
      const tatter = MeshBuilder.CreateCylinder(`${pelvis.name}_tatter`, { height: drop, diameterTop: hem * 0.32, diameterBottom: 0, tessellation: 3 }, scene);
      tatter.position.set(Math.sin(a) * hem * 0.42, -long / 2 - drop / 2, Math.cos(a) * hem * 0.42);
      tatter.rotation.y = a;
      tatter.material = cloth;
      tatter.parent = skirt;
      added.push(tatter);
    }
  }
  return added;
}

/** Dresses the tree giant as a hooded, bearded woodsman (see TREE_GIANT_*): team skin on the limbs and face, a dark tunic and rope belt, a hood into a long beard, a rag skirt. */
function dressTreeGiant(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const tunic = getMaterialFactory().getCloth(Color3.Lerp(TREE_GIANT_TUNIC, teamColor.scale(0.3), 0.25));
  // The hood and beard are one maroon-brown, barely tinted to the team, self-lit so they do not go navy in the lineup shade
  const hair = getMaterialFactory().get("cloth", Color3.Lerp(TREE_GIANT_HAIR, teamColor.scale(0.45), TREE_GIANT_HAIR_TEAM), { emissiveIntensity: 0.18 });
  const rags = getMaterialFactory().getCloth(TREE_GIANT_RAGS);
  // The tunic is whatever the body wore; forearms and legs go bare team skin, feet dark leather
  for (const mesh of body.allMeshes) {
    if (mesh.material === body.bodyMaterial) mesh.material = tunic;
  }
  for (const limb of [body.leftLowerArm, body.rightLowerArm, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    limb.material = body.skinMaterial;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = getMaterialFactory().getCloth(new Color3(0.28, 0.18, 0.12));
  }
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const belt = MeshBuilder.CreateTorus(`${chest.name}_rope`, { diameter: W * 0.92, thickness: W * 0.08, tessellation: 10 }, scene);
  belt.scaling.z = (D * 1.05) / (W * 0.92);
  belt.position.set(0, chest.position.y - H * 0.42, 0);
  belt.material = getMaterialFactory().getCloth(new Color3(0.56, 0.22, 0.18));
  belt.parent = body.torso;
  added.push(belt);
  // Hood: a shell over the crown and back of the head, its arc gap on the face (+z, see dressReaper), a short peak at the back
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const hood = MeshBuilder.CreateSphere(`${body.headMesh.name}_woodHood`, { diameter: 1, segments: 8, arc: 1 - TREE_GIANT_HOOD_OPEN, sideOrientation: Mesh.DOUBLESIDE }, scene);
  hood.scaling.set(headSize * TREE_GIANT_HOOD, headSize * TREE_GIANT_HOOD * 1.1, headSize * TREE_GIANT_HOOD);
  hood.rotation.y = -Math.PI / 2 + Math.PI * TREE_GIANT_HOOD_OPEN;
  hood.position.set(0, headSize * 0.1, -headSize * 0.1);
  hood.material = hair;
  hood.convertToFlatShadedMesh();
  hood.parent = body.headMesh;
  added.push(hood);
  const peak = MeshBuilder.CreateCylinder(`${body.headMesh.name}_woodHoodPeak`, { height: headSize * 0.45, diameterTop: 0, diameterBottom: headSize * 0.8, tessellation: 6 }, scene);
  peak.position.set(0, headSize * 0.7, -headSize * 0.15);
  peak.rotation.x = -0.45;
  peak.material = hair;
  peak.convertToFlatShadedMesh();
  peak.parent = body.headMesh;
  added.push(peak);
  // Beard: a faceted wedge from under the eyes down over the chin onto the chest, widest at the cheeks
  const beard = MeshBuilder.CreateCylinder(`${body.headMesh.name}_beard`, { height: headSize * TREE_GIANT_BEARD, diameterTop: headSize * TREE_GIANT_BEARD_WIDE, diameterBottom: headSize * 0.22, tessellation: 6 }, scene);
  beard.scaling.z = 0.6;
  beard.rotation.x = 0.28;
  beard.position.set(0, -headSize * 0.52, headSize * 0.3);
  beard.material = hair;
  beard.convertToFlatShadedMesh();
  beard.parent = body.headMesh;
  added.push(beard);
  // Rag skirt from the waist to the knee, its hem torn into points
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  if (pelvis) {
    pelvis.material = rags;
    const pExt = pelvis.getBoundingInfo().boundingBox.extendSize;
    const thigh = body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2 * body.leftUpperLeg.scaling.y;
    const long = thigh * TREE_GIANT_SKIRT;
    const top = pExt.x * 2.2, hem = pExt.x * 2 * TREE_GIANT_HEM;
    const skirt = MeshBuilder.CreateCylinder(`${pelvis.name}_rags`, { height: long, diameterTop: top, diameterBottom: Math.max(hem, top * 1.1), tessellation: 9 }, scene);
    skirt.scaling.z = (pExt.z * 2.3) / top;
    skirt.position.y = pelvis.position.y + pExt.y * 1.4 - long / 2;
    skirt.material = rags;
    skirt.convertToFlatShadedMesh();
    skirt.parent = body.hip;
    added.push(skirt);
    const rim = Math.max(hem, top * 1.1);
    for (let i = 0; i < TREE_GIANT_TATTERS; i++) {
      const a = ((i + 0.5) / TREE_GIANT_TATTERS) * Math.PI * 2;
      const drop = long * (0.16 + 0.12 * ((i * 5) % 3) / 2);
      const tatter = MeshBuilder.CreateCylinder(`${pelvis.name}_rag`, { height: drop, diameterTop: rim * 0.36, diameterBottom: 0, tessellation: 3 }, scene);
      tatter.position.set(Math.sin(a) * rim * 0.42, -long / 2 - drop / 2, Math.cos(a) * rim * 0.42);
      tatter.rotation.y = a;
      tatter.material = rags;
      tatter.parent = skirt;
      added.push(tatter);
    }
  }
  return added;
}

/** Dresses the painter two-tone (see PAINTER_*): dark team doublet, tan hose, red-brown shoes, a cream ruff at the neck, a dark team beret. */
function dressPainter(scene: Scene, body: ArticulatedBody, teamColor: Color3, props: Mesh[]): Mesh[] {
  const added: Mesh[] = [];
  // The doublet is the body's own cloth turned dark team; the tunic hem hung later follows it
  body.bodyMaterial.baseColor = teamColor.scale(PAINTER_DOUBLET);
  const hose = getMaterialFactory().getCloth(PAINTER_HOSE);
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    leg.material = hose;
  }
  const shoe = getMaterialFactory().getCloth(PAINTER_SHOE);
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = shoe;
  }
  const beret = props.find((m) => m.name === "beret");
  if (beret) beret.material = getMaterialFactory().getCloth(teamColor.scale(PAINTER_BERET));
  // Ruff: stacked faceted collars round the neck, each a little narrower than the one under it, wider than the neck so they stand off the doublet
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const ruffMat = getMaterialFactory().getCloth(PAINTER_RUFF_COLOR);
  for (let i = 0; i < PAINTER_RUFF_TIERS; i++) {
    const across = headSize * PAINTER_RUFF * (1 - 0.18 * i);
    const tier = MeshBuilder.CreateCylinder(`${chest.name}_ruff`, { height: headSize * 0.2, diameterTop: across * 0.82, diameterBottom: across, tessellation: 9 }, scene);
    tier.scaling.z = Math.min(1, (D * 1.3) / across);
    tier.position.set(0, chest.position.y + H * 0.5 + headSize * (0.02 + 0.17 * i), D * 0.06);
    tier.material = ruffMat;
    tier.convertToFlatShadedMesh();
    tier.parent = body.torso;
    added.push(tier);
  }
  // A cream bib falls from the ruff down the front of the chest, as on the reference
  const bib = MeshBuilder.CreateCylinder(`${chest.name}_ruffBib`, { height: H * 0.32, diameterTop: W * 0.42, diameterBottom: 0, tessellation: 3 }, scene);
  bib.rotation.y = Math.PI;
  bib.scaling.z = 0.25;
  bib.position.set(0, chest.position.y + H * 0.34, D * 0.5);
  bib.material = ruffMat;
  bib.parent = body.torso;
  added.push(bib);
  return added;
}

/** Dresses the paladin in white plate with gold trim (see PALADIN_*): white body, legs and feet, gold waist and knee bands, gold-banded helm, white-and-gold shield. */
function dressPaladin(scene: Scene, body: ArticulatedBody, props: Mesh[]): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  // The plate is the body's own material turned white and matte, a little self-lit
  body.bodyMaterial.baseColor = PALADIN_WHITE;
  body.bodyMaterial.metallic = 0;
  body.bodyMaterial.roughness = 0.6;
  body.bodyMaterial.emissiveColor = PALADIN_WHITE.scale(PALADIN_GLOW);
  const white = mf.get("cloth", PALADIN_WHITE, { emissiveIntensity: PALADIN_GLOW });
  const gold = mf.get("cloth", PALADIN_GOLD, { emissiveIntensity: PALADIN_GOLD_GLOW });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    leg.material = white;
  }
  const sabaton = mf.get("cloth", PALADIN_WHITE.scale(0.86), { emissiveIntensity: PALADIN_GLOW });
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = sabaton;
  }
  // Gold waist band round the bottom of the chest
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const belt = MeshBuilder.CreateBox(`${chest.name}_paladinBelt`, { width: W * 1.06, height: H * PALADIN_BELT, depth: D * 1.12 }, scene);
  belt.position.set(0, chest.position.y - H * 0.42, 0);
  belt.material = gold;
  belt.parent = body.torso;
  added.push(belt);
  // A gold band round each knee and a pointed gold knee plate on its front
  for (const [knee, shin] of [[body.leftKnee, body.leftLowerLeg], [body.rightKnee, body.rightLowerLeg]] as const) {
    const sx = shin.getBoundingInfo().boundingBox.extendSize;
    const across = Math.max(sx.x * shin.scaling.x, sx.z * shin.scaling.z) * 2 * PALADIN_KNEE;
    const band = MeshBuilder.CreateCylinder(`${knee.name}_paladinKnee`, { height: across * 0.28, diameter: across, tessellation: 6 }, scene);
    band.position.set(0, -across * 0.1, 0);
    band.material = gold;
    band.convertToFlatShadedMesh();
    band.parent = knee;
    added.push(band);
    const plate = MeshBuilder.CreateCylinder(`${knee.name}_paladinPoleyn`, { height: across * 0.75, diameterTop: across * 0.8, diameterBottom: 0, tessellation: 3 }, scene);
    plate.scaling.z = 0.35;
    plate.position.set(0, across * 0.3, across * 0.48);
    plate.material = gold;
    plate.parent = knee;
    added.push(plate);
  }
  // The helm goes white steel with a gold band round its rim and a gold ridge up the face
  const helm = props.find((m) => m.name === "ghelm");
  if (helm) {
    helm.material = white;
    const hb = helm.getBoundingInfo().boundingBox;
    const tall = hb.maximum.y - hb.minimum.y;
    const rim = (hb.maximum.x - hb.minimum.x) * 1.06;
    const band = MeshBuilder.CreateCylinder("paladinHelmBand", { height: tall * PALADIN_HELM_BAND, diameter: rim, tessellation: 8 }, scene);
    band.rotation.y = Math.PI / 8;
    band.position.y = hb.minimum.y + tall * PALADIN_HELM_BAND * 0.5;
    band.material = gold;
    band.convertToFlatShadedMesh();
    band.parent = helm;
    added.push(band);
    // A gold comb front to back over the crown, clear of the eye slit
    const ridge = MeshBuilder.CreateBox("paladinHelmRidge", { width: rim * 0.12, height: tall * 0.2, depth: rim * 0.92 }, scene);
    ridge.position.set(0, hb.maximum.y + tall * 0.06, 0);
    ridge.material = gold;
    ridge.parent = helm;
    added.push(ridge);
  }
  // The kite shield: white board, gold rim and gold cross
  const shield = props.find((m) => m.name === "kshield");
  if (shield) {
    shield.material = white;
    for (const m of shield.getChildMeshes(true)) {
      m.material = m.name === "kpoint" ? white : gold;
    }
  }
  return added;
}

/** Dresses the void cultist as a robed, bearded sun priest (see VOID_*): dark banded robe, beard strands, spoked wheel behind the head, spiked shield and mace head. */
function dressVoidCultist(scene: Scene, body: ArticulatedBody, teamColor: Color3, props: Mesh[]): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const keep = (m: Mesh, parent: TransformNode, material: Material): Mesh => {
    m.convertToFlatShadedMesh();
    m.parent = parent;
    m.material = material;
    added.push(m);
    return m;
  };
  // The robe is the body's own cloth turned dark maroon-brown, a little self-lit; legs and feet go with it
  body.bodyMaterial.baseColor = VOID_ROBE;
  body.bodyMaterial.metallic = 0;
  body.bodyMaterial.emissiveColor = VOID_ROBE.scale(VOID_GLOW);
  const robe = mf.get("cloth", VOID_ROBE.scale(0.85), { emissiveIntensity: VOID_GLOW });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = robe;
  const wood = mf.get("cloth", VOID_WOOD, { emissiveIntensity: VOID_GLOW });
  const iron = mf.get("cloth", new Color3(0.2, 0.17, 0.16), { emissiveIntensity: VOID_GLOW });
  const band = mf.get("cloth", teamColor, { emissiveIntensity: VOID_BAND_GLOW });
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  // Long robe skirt to the shins, two team bands round it near the hem
  const skirt = hangSkirt(scene, body, "voidRobe", VOID_SKIRT, VOID_HEM, robe);
  if (skirt) {
    added.push(skirt);
    const sb = skirt.getBoundingInfo().boundingBox;
    const long = sb.maximum.y - sb.minimum.y;
    const hemD = (sb.maximum.x - sb.minimum.x);
    for (const at of [0.06, 0.22]) {
      const ring = MeshBuilder.CreateCylinder("voidRobeBand", { height: long * 0.07, diameter: hemD * (1.03 - at * 0.18), tessellation: 6 }, scene);
      ring.position.y = sb.minimum.y + long * at;
      keep(ring, skirt, band);
    }
  }
  // A team band round the neck and round each cuff
  const neck = MeshBuilder.CreateCylinder("voidNeckBand", { height: H * 0.08, diameter: W * 0.62, tessellation: 8 }, scene);
  neck.scaling.z = Math.min(1.2, (D * 1.1) / (W * 0.62));
  neck.position.set(0, chest.position.y + H * 0.48, 0);
  keep(neck, body.torso, band);
  for (const hand of [body.leftHand, body.rightHand]) {
    const cuff = MeshBuilder.CreateCylinder("voidCuff", { height: headSize * 0.16, diameter: headSize * 0.5, tessellation: 6 }, scene);
    cuff.position.y = headSize * 0.1;
    keep(cuff, hand, band);
  }
  // The beard: a broad wedge under the face and strands hanging from it onto the chest
  const hair = mf.get("cloth", VOID_BEARD_COLOR, { emissiveIntensity: VOID_GLOW });
  const beard = MeshBuilder.CreateCylinder("voidBeard", { height: headSize * VOID_BEARD * 0.5, diameterTop: headSize * 0.85, diameterBottom: headSize * 0.5, tessellation: 6 }, scene);
  beard.scaling.z = 0.55;
  beard.position.set(0, -headSize * 0.42, headSize * 0.3);
  keep(beard, body.headMesh, hair);
  for (let i = 0; i < VOID_STRANDS; i++) {
    const t = i / (VOID_STRANDS - 1) - 0.5;
    const len = headSize * VOID_BEARD * (0.75 + 0.25 * (1 - Math.abs(t) * 2));
    const strand = MeshBuilder.CreateCylinder("voidBeardStrand", { height: len, diameterTop: headSize * 0.13, diameterBottom: headSize * 0.03, tessellation: 4 }, scene);
    strand.position.set(t * headSize * 0.6, -headSize * 0.55 - len * 0.5, headSize * (0.36 + 0.04 * Math.cos(t * 3)));
    strand.rotation.set(-0.18, 0, t * 0.5);
    keep(strand, body.headMesh, hair);
  }
  // The sun wheel: an upright wooden ring behind the head, spokes to a hub
  const wheelD = headSize * VOID_WHEEL;
  const wheel = new TransformNode("voidWheel", scene);
  wheel.parent = body.headMesh;
  wheel.position.set(0, headSize * 0.05, -headSize * 0.62);
  const rim = MeshBuilder.CreateTorus("voidWheelRim", { diameter: wheelD, thickness: headSize * 0.13, tessellation: 16 }, scene);
  rim.rotation.x = Math.PI / 2;
  keep(rim, wheel, wood);
  const hub = MeshBuilder.CreateCylinder("voidWheelHub", { height: headSize * 0.1, diameter: headSize * 0.42, tessellation: 8 }, scene);
  hub.rotation.x = Math.PI / 2;
  keep(hub, wheel, wood);
  for (let i = 0; i < VOID_SPOKES; i++) {
    const a = (i / VOID_SPOKES) * Math.PI * 2;
    const spoke = MeshBuilder.CreateBox("voidWheelSpoke", { width: headSize * 0.07, height: wheelD * 0.5, depth: headSize * 0.05 }, scene);
    spoke.rotation.z = a;
    spoke.position.set(-Math.sin(a) * wheelD * 0.25, Math.cos(a) * wheelD * 0.25, 0);
    keep(spoke, wheel, wood);
  }
  // The round shield on the off hand: a dark wooden board, a rim, spikes round it and one at the boss (not named *shield: it is no wall board)
  const shieldD = W * VOID_SHIELD;
  const board = MeshBuilder.CreateCylinder("voidBoard", { height: headSize * 0.1, diameter: shieldD, tessellation: 12 }, scene);
  board.rotation.x = Math.PI / 2;
  board.position.set(W * 0.25, W * 0.55, W * 0.45);
  keep(board, body.leftHand, wood);
  const boardRim = MeshBuilder.CreateTorus("voidBoardRim", { diameter: shieldD, thickness: headSize * 0.12, tessellation: 12 }, scene);
  keep(boardRim, board, iron);
  for (let i = 0; i <= VOID_STUDS; i++) {
    const a = (i / VOID_STUDS) * Math.PI * 2;
    const boss = i === VOID_STUDS;
    const spike = MeshBuilder.CreateCylinder("voidBoardSpike", { height: headSize * (boss ? 0.4 : 0.3), diameterTop: 0, diameterBottom: headSize * 0.14, tessellation: 4 }, scene);
    // The board's own +y is its face (it is a cylinder turned up onto +z): rim spikes point out round the edge, the boss spike out of the face
    if (boss) spike.position.y = headSize * 0.22;
    else {
      spike.position.set(Math.cos(a) * shieldD * 0.56, 0, Math.sin(a) * shieldD * 0.56);
      spike.rotation.set(0, -a, -Math.PI / 2);
    }
    keep(spike, board, iron);
  }
  // The staff's glowing orb gives way to a spiked iron ball
  const staff = props.find((m) => m.name === "staff");
  if (staff) {
    const orb = staff.getChildMeshes(true).find((m) => m.name === "orb");
    if (orb) orb.isVisible = false;
    const top = staff.getBoundingInfo().boundingBox.maximum.y;
    const ball = MeshBuilder.CreateIcoSphere("voidMace", { radius: headSize * 0.26, subdivisions: 1 }, scene);
    ball.position.y = top + headSize * 0.16;
    keep(ball, staff, iron);
    for (const dir of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1], [0.7, 0.7, 0], [-0.7, 0.7, 0]] as const) {
      const v = new Vector3(dir[0], dir[1], dir[2]).normalize();
      const spike = MeshBuilder.CreateCylinder("voidMaceSpike", { height: headSize * 0.3, diameterTop: 0, diameterBottom: headSize * 0.12, tessellation: 4 }, scene);
      spike.position.copyFrom(v.scale(headSize * 0.32));
      // Its +y turned onto the spike's direction
      spike.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), v, new Quaternion());
      keep(spike, ball, iron);
    }
  }
  return added;
}

/** A tapered tube through head-local points: one faceted segment per pair, its root `thick` across narrowing to a point. */
function taperedPath(scene: Scene, name: string, points: Vector3[], thick: number, parent: TransformNode, material: Material, added: Mesh[]): void {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i + 1];
    const dir = b.subtract(a);
    const len = dir.length();
    const seg = MeshBuilder.CreateCylinder(name, {
      height: len * 1.08, diameterBottom: thick * (1 - i / (points.length - 1)), diameterTop: thick * (1 - (i + 1) / (points.length - 1)) + thick * 0.04, tessellation: 5,
    }, scene);
    seg.position.copyFrom(a.add(b).scale(0.5));
    seg.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir.normalize(), new Quaternion());
    seg.convertToFlatShadedMesh();
    seg.material = material;
    seg.parent = parent;
    added.push(seg);
  }
}

/** A four-sided spike `len` long standing off `parent` at `at` along `dir`. */
function spikeOut(scene: Scene, parent: TransformNode, at: Vector3, dir: Vector3, len: number, material: Material, added: Mesh[]): void {
  const v = dir.normalize();
  const spike = MeshBuilder.CreateCylinder("evilSpike", { height: len, diameterTop: 0, diameterBottom: len * 0.42, tessellation: 4 }, scene);
  spike.position.copyFrom(at.add(v.scale(len * 0.5)));
  spike.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), v, new Quaternion());
  spike.material = material;
  spike.parent = parent;
  added.push(spike);
}

/** Dresses shadow_walker / death_bringer horned over dark armour (see HORNED_EVIL): horns, iron cap and tooth mask or a full skull, dark cloth, spikes or wraps. */
function dressHornedEvil(scene: Scene, body: ArticulatedBody, style: HornedEvilStyle): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const keep = (m: Mesh, parent: TransformNode, material: Material): Mesh => {
    m.convertToFlatShadedMesh();
    m.parent = parent;
    m.material = material;
    added.push(m);
    return m;
  };
  // The armour is the body's own cloth turned dark and matte, a little self-lit; the legs go dark breeches
  body.bodyMaterial.baseColor = style.cloth;
  body.bodyMaterial.metallic = 0;
  body.bodyMaterial.roughness = 0.75;
  body.bodyMaterial.alpha = 1;
  body.bodyMaterial.emissiveColor = style.cloth.scale(EVIL_GLOW * 2);
  const legs = mf.get("cloth", style.legs, { emissiveIntensity: EVIL_GLOW });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = legs;
  const boot = mf.get("cloth", style.cloth.scale(0.8), { emissiveIntensity: EVIL_GLOW });
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = boot;
  }
  const bone = mf.get("cloth", EVIL_BONE, { emissiveIntensity: EVIL_BONE_GLOW });
  const hornMat = mf.get("cloth", style.hornColor, { emissiveIntensity: style.skull ? EVIL_GLOW * 2 : EVIL_BONE_GLOW });
  const head = body.headMesh;
  const hExt = head.getBoundingInfo().boundingBox.extendSize;
  const headSize = hExt.y * 2;
  const face = hExt.z;
  if (style.helm) {
    // An iron cap boxed over the block head's crown down to the brow, a low dome on top
    const iron = mf.get("cloth", style.helm, { emissiveIntensity: EVIL_GLOW });
    const cap = MeshBuilder.CreateBox("evilCap", { width: hExt.x * 2.24, height: headSize * 0.42, depth: face * 2.24 }, scene);
    cap.position.y = headSize * 0.32;
    keep(cap, head, iron);
    const dome = MeshBuilder.CreateSphere("evilCapDome", { diameter: 1, segments: 4, slice: 0.5 }, scene);
    dome.scaling.set(hExt.x * 2.1, headSize * 0.5, face * 2.1);
    dome.position.y = headSize * 0.5;
    keep(dome, head, iron);
  }
  if (style.skull) {
    // A cream skull boxed over the whole block head (cranium, then a narrower jaw), dark sockets and a nose hole on its face; the bead eyes go
    const skull = MeshBuilder.CreateBox("evilSkull", { width: hExt.x * 2.3, height: headSize * 0.8, depth: face * 2.3 }, scene);
    skull.position.set(0, headSize * 0.16, face * 0.04);
    keep(skull, head, bone);
    const jaw = MeshBuilder.CreateBox("evilJaw", { width: hExt.x * 1.7, height: headSize * 0.42, depth: face * 1.9 }, scene);
    jaw.position.set(0, -headSize * 0.36, face * 0.16);
    keep(jaw, head, bone);
    body.leftEye?.setEnabled(false);
    body.rightEye?.setEnabled(false);
    const socket = mf.get("cloth", new Color3(0.08, 0.05, 0.08), { emissiveIntensity: 0 });
    for (const side of [-1, 1]) {
      const eye = MeshBuilder.CreateBox("evilSocket", { width: hExt.x * 0.6, height: headSize * 0.24, depth: face * 0.2 }, scene);
      eye.position.set(side * hExt.x * 0.46, headSize * 0.08, face * 1.13);
      keep(eye, head, socket);
    }
    const nose = MeshBuilder.CreateCylinder("evilNose", { height: headSize * 0.16, diameterTop: 0, diameterBottom: headSize * 0.18, tessellation: 3 }, scene);
    nose.rotation.x = Math.PI;
    nose.scaling.z = 0.4;
    nose.position.set(0, -headSize * 0.12, face * 1.16);
    keep(nose, head, socket);
  }
  for (let i = 0; i < style.teeth; i++) {
    // Bone teeth hanging from the cap's brim down over the face
    const t = i / (style.teeth - 1) - 0.5;
    const tooth = MeshBuilder.CreateCylinder("evilTooth", { height: headSize * 0.55, diameterTop: headSize * 0.16, diameterBottom: headSize * 0.1, tessellation: 5 }, scene);
    tooth.scaling.z = 0.6;
    tooth.position.set(t * hExt.x * 1.35, -headSize * 0.08, face * (1.12 - Math.abs(t) * 0.35));
    tooth.rotation.y = t * 0.9;
    keep(tooth, head, bone);
  }
  for (const side of [-1, 1]) {
    const pts = style.horn.map(([x, y, z]) => new Vector3(side * x * headSize, y * headSize, z * headSize));
    taperedPath(scene, "evilHorn", pts, headSize * EVIL_HORN_ROOT * style.thick, head, hornMat, added);
  }
  for (let i = 0; i < (style.tines ?? 0); i++) {
    // Branch crown: tines round the crown, the middle (front-on) ones tallest, each kinking out then back up like a dead twig
    const n = style.tines ?? 1;
    const t = i / (n - 1) - 0.5;
    const a = t * 2.6;
    const tall = LICH_TINE_TALL * (1 - Math.abs(t) * 0.75) * (0.85 + 0.15 * ((i * 7) % 3) / 2);
    const out = new Vector3(Math.sin(a), 0, Math.cos(a) * 0.4 - 0.25);
    const root = new Vector3(out.x * 0.34, 0.5, out.z * 0.3).scale(headSize);
    const kink = (i % 2 ? 1 : -1) * 0.12;
    const pts = [
      root,
      root.add(new Vector3(out.x * 0.12 + kink, tall * 0.35, out.z * 0.1).scale(headSize)),
      root.add(new Vector3(out.x * 0.34 - kink, tall * 0.68, out.z * 0.2).scale(headSize)),
      root.add(new Vector3(out.x * 0.42 + kink * 0.5, tall, out.z * 0.26).scale(headSize)),
    ];
    taperedPath(scene, "lichTine", pts, headSize * 0.2, head, hornMat, added);
    if (Math.abs(t) < 0.3) {
      // A side twig off the taller tines
      const fork = pts[2];
      taperedPath(scene, "lichTwig", [fork, fork.add(new Vector3((kink > 0 ? 1 : -1) * 0.3, 0.42, 0).scale(headSize))], headSize * 0.1, head, hornMat, added);
    }
  }
  if (style.goggles) {
    // A strap round the cap at the brow, two round pale-blue lenses in brass rims on it
    const brass = mf.get("cloth", new Color3(0.62, 0.45, 0.2), { emissiveIntensity: EVIL_BONE_GLOW });
    const glass = mf.get("cloth", GOGGLE_GLASS, { emissiveIntensity: 0.55 });
    const strap = MeshBuilder.CreateBox("goggleStrap", { width: hExt.x * 2.32, height: headSize * 0.14, depth: face * 2.32 }, scene);
    strap.position.y = headSize * 0.16;
    keep(strap, head, mf.get("cloth", new Color3(0.08, 0.06, 0.05), { emissiveIntensity: 0 }));
    for (const side of [-1, 1]) {
      const rim = MeshBuilder.CreateCylinder("goggleRim", { height: face * 0.32, diameter: headSize * 0.36, tessellation: 8 }, scene);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(side * hExt.x * 0.48, headSize * 0.17, face * 1.2);
      keep(rim, head, brass);
      const lens = MeshBuilder.CreateCylinder("goggleLens", { height: face * 0.06, diameter: headSize * 0.26, tessellation: 8 }, scene);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(side * hExt.x * 0.48, headSize * 0.17, face * 1.37);
      keep(lens, head, glass);
    }
  }
  const spikeLen = headSize * EVIL_SPIKE;
  if (style.spikes) {
    // Dark guards on the forearms and shins, cream spikes standing off them; a spike off each shoulder
    const guard = mf.get("cloth", style.cloth.scale(1.4), { emissiveIntensity: EVIL_GLOW });
    for (const limb of [body.leftLowerArm, body.rightLowerArm, body.leftLowerLeg, body.rightLowerLeg]) {
      const e = limb.getBoundingInfo().boundingBox.extendSize;
      const r = Math.max(e.x, e.z);
      const band = MeshBuilder.CreateCylinder("evilGuard", { height: e.y * 1.1, diameter: r * 2.5, tessellation: 6 }, scene);
      band.position.y = -e.y * 0.2;
      keep(band, limb, guard);
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, -1]] as const) {
        spikeOut(scene, limb, new Vector3(dx * r * 1.15, -e.y * 0.2, dz * r * 1.15), new Vector3(dx, 0.35, dz), spikeLen, bone, added);
      }
    }
    for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
      const e = arm.getBoundingInfo().boundingBox.extendSize;
      spikeOut(scene, arm, new Vector3(0, e.y * 0.8, 0), new Vector3(0, 1, -0.3), spikeLen * 1.1, bone, added);
    }
  }
  if (style.wraps) {
    // Pale bandage bands wound round the shins
    const wrap = mf.get("cloth", new Color3(0.84, 0.82, 0.76), { emissiveIntensity: EVIL_BONE_GLOW });
    for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
      const e = shin.getBoundingInfo().boundingBox.extendSize;
      const r = Math.max(e.x, e.z);
      for (let k = 0; k < 5; k++) {
        const ring = MeshBuilder.CreateCylinder("evilWrap", { height: e.y * 0.36, diameter: r * (2.35 - k * 0.06), tessellation: 6 }, scene);
        ring.position.y = e.y * (0.75 - k * 0.38);
        ring.rotation.set(0.12 * (k % 2 ? 1 : -1), k, 0);
        keep(ring, shin, wrap);
      }
    }
  }
  if (style.skirt > 0) {
    const robe = mf.get("cloth", style.rags ? style.cloth : style.legs, { emissiveIntensity: EVIL_GLOW });
    const skirt = hangSkirt(scene, body, "evilBreech", style.skirt, 1.35, robe);
    if (skirt) {
      added.push(skirt);
      // A robe's hem torn into long rags
      const sExt = skirt.getBoundingInfo().boundingBox.extendSize;
      const rim = sExt.x * 2;
      for (let i = 0; i < (style.rags ?? 0); i++) {
        const a = ((i + 0.5) / (style.rags ?? 1)) * Math.PI * 2;
        const drop = sExt.y * 2 * (0.2 + 0.14 * ((i * 5) % 3));
        const rag = MeshBuilder.CreateCylinder("evilRag", { height: drop, diameterTop: rim * 0.42, diameterBottom: 0, tessellation: 3 }, scene);
        rag.position.set(Math.sin(a) * rim * 0.4, -sExt.y - drop / 2, Math.cos(a) * rim * 0.4);
        rag.rotation.y = a;
        keep(rag, skirt, robe);
      }
    }
  }
  return added;
}

/** Dresses the super peasant as a giant farmhand (see STRAW_*, SACK_*): a spiky straw mop swept up and back, an off-white sack tunic with a rope belt. */
function dressSuperPeasant(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  // The sack is the body's own cloth turned off-white and matte; legs go bare team skin
  body.bodyMaterial.baseColor = SACK_COLOR;
  body.bodyMaterial.metallic = 0;
  body.bodyMaterial.roughness = 0.85;
  body.bodyMaterial.emissiveColor = SACK_COLOR.scale(SACK_GLOW);
  const sack = mf.get("cloth", SACK_COLOR.scale(0.94), { emissiveIntensity: SACK_GLOW });
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) leg.material = body.skinMaterial;
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = body.skinMaterial;
  }
  const skirt = hangSkirt(scene, body, "sackSkirt", SACK_SKIRT, 1.5, sack);
  if (skirt) added.push(skirt);
  // A thick rope belt round the waist
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const rope = MeshBuilder.CreateTorus("sackRope", { diameter: W * 0.98, thickness: W * 0.11, tessellation: 10 }, scene);
  rope.scaling.z = (D * 1.1) / (W * 0.98);
  rope.position.set(0, chest.position.y - H * 0.4, 0);
  rope.material = mf.get("cloth", SACK_ROPE, { emissiveIntensity: SACK_GLOW });
  rope.convertToFlatShadedMesh();
  rope.parent = body.torso;
  added.push(rope);
  // The straw mop: a cap on the crown, then locks fanned round it, each a long tapered spike swept up and back, the front ones hanging over the brow
  const head = body.headMesh;
  const hExt = head.getBoundingInfo().boundingBox.extendSize;
  const headSize = hExt.y * 2;
  const straw = mf.get("cloth", STRAW_COLOR, { emissiveIntensity: STRAW_GLOW });
  // The block head's crown and back are boxed in straw (a sphere left its corners bare), a fringe over the brow
  const cap = MeshBuilder.CreateBox("strawCap", { width: hExt.x * 2.2, height: headSize * 0.36, depth: hExt.z * 2.2 }, scene);
  cap.position.y = headSize * 0.36;
  const back = MeshBuilder.CreateBox("strawBack", { width: hExt.x * 2.2, height: headSize * 0.8, depth: hExt.z * 0.5 }, scene);
  back.position.set(0, headSize * 0.05, -hExt.z * 0.9);
  const fringe = MeshBuilder.CreateBox("strawFringe", { width: hExt.x * 2.1, height: headSize * 0.16, depth: hExt.z * 0.3 }, scene);
  fringe.position.set(0, headSize * 0.24, hExt.z * 1.0);
  for (const m of [cap, back, fringe]) {
    m.convertToFlatShadedMesh();
    m.material = straw;
    m.parent = head;
    added.push(m);
  }
  for (let i = 0; i < STRAW_LOCKS; i++) {
    // Rooted over the crown box in a jittered grid; every lock rises and sweeps back, the front row hanging forward over the brow
    const col = (i % 4) / 3 - 0.5, row = Math.floor(i / 4) / Math.max(1, Math.floor((STRAW_LOCKS - 1) / 4)) - 0.5;
    const root = new Vector3(col * hExt.x * 1.7, headSize * 0.5, row * -hExt.z * 1.7);
    const front = row < -0.4;
    const dir = (front ? new Vector3(col * 0.6, 0.35, 1) : new Vector3(col * 1.4, 1, -STRAW_SWEEP * (1 + row))).normalize();
    const len = headSize * STRAW_LOCK * (front ? 0.55 : 0.85 + 0.35 * ((i * 5) % 4) / 3);
    const tip = root.add(dir.scale(len));
    taperedPath(scene, "strawLock", [root, root.add(tip).scale(0.5).add(new Vector3(0, len * 0.1, 0)), tip], headSize * 0.42, head, straw, added);
  }
  return added;
}

/** Dresses the cactus in a full-length spiked cactus suit (see CACTUS_*): green robe, sleeves and face-window hood, brown spines all over, lilac flowers. */
function dressCactus(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  // The suit is the body's own cloth turned green, so the tunic hem hung later follows it
  body.bodyMaterial.baseColor = Color3.Lerp(CACTUS_GREEN, teamColor.scale(0.3), 0.08);
  const green = body.bodyMaterial;
  const spineMat = getMaterialFactory().getCloth(CACTUS_SPINE_COLOR);
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const spineTall = headSize * CACTUS_SPINE;
  // A four-sided spine on a parent, at a point on its surface, pointing out along `out` (unit, horizontal or not)
  const spine = (parent: Mesh | ArticulatedBody["hip"], at: Vector3, out: Vector3): void => {
    const s = MeshBuilder.CreateCylinder("cactusSpine", { height: spineTall, diameterTop: 0, diameterBottom: spineTall * 0.85, tessellation: 4 }, scene);
    s.parent = parent;
    s.position.copyFrom(at.add(out.scale(spineTall * 0.35)));
    // The cylinder's +y turned onto `out`: pitch it off upright, then yaw it round
    s.rotation.set(Math.acos(Math.max(-1, Math.min(1, out.y))), Math.atan2(out.x, out.z), 0);
    s.material = spineMat;
    s.convertToFlatShadedMesh();
    added.push(s);
  };
  // Arms go green sleeves, wider than the arm
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    arm.scaling.x *= CACTUS_SLEEVE;
    arm.scaling.z *= CACTUS_SLEEVE;
    arm.material = green;
    const ext = arm.getBoundingInfo().boundingBox.extendSize;
    const r = Math.max(ext.x * arm.scaling.x, ext.z * arm.scaling.z);
    const len = ext.y * 2 * arm.scaling.y;
    const holder = arm.parent as Mesh;
    for (let i = 0; i < CACTUS_SLEEVE_SPINES; i++) {
      const a = i * 2.3 + (arm === body.leftUpperArm || arm === body.leftLowerArm ? 0.7 : 0);
      const out = new Vector3(Math.sin(a), 0, Math.cos(a));
      spine(holder, arm.position.add(new Vector3(out.x * r, len * (0.3 - 0.3 * i), out.z * r)), out);
    }
  }
  // Bodice over the chest, wider than it, into the robe skirt to the ankle
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const bodiceTop = W * 1.12, bodiceBottom = W * 1.24, depthScale = (D * 1.3) / W;
  const bodice = MeshBuilder.CreateCylinder(`${chest.name}_cactusRobe`, { height: H * 1.04, diameterTop: bodiceTop, diameterBottom: bodiceBottom, tessellation: 8 }, scene);
  bodice.scaling.z = depthScale;
  bodice.position.set(0, chest.position.y, 0);
  bodice.material = green;
  bodice.convertToFlatShadedMesh();
  bodice.parent = body.torso;
  added.push(bodice);
  const leg = (body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2 * body.leftUpperLeg.scaling.y)
    + (body.leftLowerLeg.getBoundingInfo().boundingBox.extendSize.y * 2 * body.leftLowerLeg.scaling.y);
  const long = leg * CACTUS_LONG;
  const hem = W * CACTUS_ROBE;
  const skirt = MeshBuilder.CreateCylinder(`${chest.name}_cactusSkirt`, { height: long, diameterTop: bodiceBottom, diameterBottom: hem, tessellation: 9 }, scene);
  skirt.scaling.z = depthScale;
  const skirtY = H * 0.08 - long / 2;
  skirt.position.y = skirtY;
  skirt.material = green;
  skirt.convertToFlatShadedMesh();
  skirt.parent = body.hip;
  added.push(skirt);
  // Spines over the robe, scattered round it in a golden-angle spiral from the shoulders to the hem
  for (let i = 0; i < CACTUS_SPINES; i++) {
    const t = (i + 0.5) / CACTUS_SPINES;
    const a = i * 2.39996;
    const out = new Vector3(Math.sin(a), 0, Math.cos(a) * depthScale).normalize();
    const onBodice = t < 0.3;
    const u = onBodice ? t / 0.3 : (t - 0.3) / 0.7;
    const r = onBodice ? (bodiceTop + (bodiceBottom - bodiceTop) * u) / 2 : (bodiceBottom + (hem - bodiceBottom) * u) / 2;
    const at = new Vector3(Math.sin(a) * r, 0, Math.cos(a) * r * depthScale);
    if (onBodice) {
      at.y = chest.position.y + H * (0.45 - 0.9 * u);
      spine(body.torso as Mesh, at, out);
    } else {
      at.y = skirtY + long * (0.48 - 0.92 * u);
      spine(body.hip as Mesh, at, out);
    }
  }
  // Hood: a blocky green shell over the head, its arc gap on the face (+z, see dressReaper), into a mantle over the shoulders
  const hood = MeshBuilder.CreateSphere(`${body.headMesh.name}_cactusHood`, { diameter: 1, segments: 5, arc: 1 - CACTUS_HOOD_OPEN, sideOrientation: Mesh.DOUBLESIDE }, scene);
  hood.scaling.set(headSize * CACTUS_HOOD, headSize * CACTUS_HOOD * 1.15, headSize * CACTUS_HOOD);
  hood.rotation.y = -Math.PI / 2 + Math.PI * CACTUS_HOOD_OPEN;
  hood.position.set(0, headSize * 0.1, -headSize * 0.08);
  hood.material = green;
  hood.convertToFlatShadedMesh();
  hood.parent = body.headMesh;
  added.push(hood);
  const mantle = MeshBuilder.CreateCylinder(`${body.headMesh.name}_cactusMantle`, { height: headSize * 0.5, diameterTop: headSize * 1.2, diameterBottom: bodiceTop * 1.02, tessellation: 8 }, scene);
  mantle.position.set(0, chest.position.y + H * 0.48, -D * 0.05);
  mantle.scaling.z = depthScale;
  mantle.material = green;
  mantle.convertToFlatShadedMesh();
  mantle.parent = body.torso;
  added.push(mantle);
  const hoodR = headSize * CACTUS_HOOD * 0.5;
  for (let i = 0; i < CACTUS_HOOD_SPINES; i++) {
    // Over the crown and back of the hood, clear of the face window
    const a = Math.PI * (0.55 + 0.9 * i / (CACTUS_HOOD_SPINES - 1)) * (i % 2 ? 1 : -1);
    const tilt = 0.5 + 0.35 * (i % 3);
    const out = new Vector3(Math.sin(a) * Math.sin(tilt), Math.cos(tilt), Math.cos(a) * Math.sin(tilt));
    spine(body.headMesh, new Vector3(0, headSize * 0.1, -headSize * 0.08).add(out.scale(hoodR)), out);
  }
  // Lilac flowers: one on the crown of the hood, one low on the robe front
  const petal = getMaterialFactory().getCloth(CACTUS_PETAL);
  const eye = getMaterialFactory().getCloth(new Color3(1, 0.85, 0.3));
  const flower = (parent: Mesh | ArticulatedBody["hip"], at: Vector3, pitch: number, size: number): void => {
    const holder = new Mesh("cactusFlower", scene);
    holder.parent = parent;
    holder.position.copyFrom(at);
    holder.rotation.x = pitch;
    for (let i = 0; i < 6; i++) {
      const p = MeshBuilder.CreateSphere("cactusPetal", { diameter: 1, segments: 3 }, scene);
      const a = (i / 6) * Math.PI * 2;
      p.scaling.set(size * 0.22, size * 0.07, size * 0.5);
      p.rotation.y = a;
      p.position.set(Math.sin(a) * size * 0.25, 0, Math.cos(a) * size * 0.25);
      p.material = petal;
      p.parent = holder;
      added.push(p);
    }
    const c = MeshBuilder.CreateSphere("cactusFlowerEye", { diameter: size * 0.24, segments: 3 }, scene);
    c.position.y = size * 0.05;
    c.material = eye;
    c.parent = holder;
    added.push(c);
    added.push(holder);
  };
  flower(body.headMesh, new Vector3(headSize * 0.12, headSize * 0.1 + hoodR * 1.3, -headSize * 0.05), -0.25, headSize * 0.85);
  flower(body.hip as Mesh, new Vector3(hem * 0.12, skirtY - long * 0.25, (bodiceBottom + (hem - bodiceBottom) * 0.75) / 2 * depthScale + headSize * 0.03), Math.PI / 2, headSize * 0.8);
  return added;
}

/** Dresses the reaper as a robed skeleton (see REAPER_*): bone skull, hands, shins and feet; a deep forward cowl; a robe with wide sleeves and a ragged hem. */
function dressReaper(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const bone = getMaterialFactory().getCloth(SKELETON_BONE);
  const robe = getMaterialFactory().getCloth(Color3.Lerp(REAPER_CLOTH, teamColor.scale(0.45), REAPER_TEAM));
  const flesh = new Set<Material | null>([body.bodyMaterial, body.skinMaterial]);
  // Everything the body wore goes robe, hands and feet go bone
  for (const mesh of [...body.allMeshes, ...body.leftElbow.getChildMeshes(false), ...body.rightElbow.getChildMeshes(false), ...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr](Hand|HandM|FootM)$/.test(mesh.name)) mesh.material = bone;
    else if (flesh.has(mesh.material)) mesh.material = robe;
  }
  // Wide sleeves to the wrist; bone legs, thin as a skeleton's, under the skirt
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    arm.scaling.x *= REAPER_SLEEVE;
    arm.scaling.z *= REAPER_SLEEVE;
    arm.material = robe;
  }
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    leg.scaling.x *= SKELETON_LIMB;
    leg.scaling.z *= SKELETON_LIMB;
    leg.material = bone;
  }
  // Bodice: the robe round the chest from the shoulders to the waist, wider than the chest
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const bodice = MeshBuilder.CreateCylinder(`${chest.name}_robe`, { height: H * 1.04, diameterTop: W * 1.08, diameterBottom: W * REAPER_ROBE, tessellation: 8 }, scene);
  bodice.scaling.z = (D * 1.25) / W;
  bodice.position.set(0, chest.position.y, 0);
  bodice.material = robe;
  bodice.convertToFlatShadedMesh();
  bodice.parent = body.torso;
  added.push(bodice);
  // Skull in the cowl: the head goes bone, the cowl shell round it opens wide to the face (the giant stands side-on in the lineup, so the bone face must clear the cowl in profile), its crown pulled up into a peak
  body.headMesh.material = bone;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  const cowl = MeshBuilder.CreateSphere(`${body.headMesh.name}_cowl`, { diameter: 1, segments: 10, arc: 1 - REAPER_HOOD_OPEN, sideOrientation: Mesh.DOUBLESIDE }, scene);
  cowl.scaling.set(headSize * REAPER_HOOD, headSize * REAPER_HOOD * 1.12, headSize * REAPER_HOOD * 1.05);
  // The sphere's arc gap opens on the face (+z): until 252 it was turned half a turn the wrong way, the opening at the back of the head and the face walled in
  cowl.rotation.y = -Math.PI / 2 + Math.PI * REAPER_HOOD_OPEN;
  cowl.position.set(0, headSize * 0.08, headSize * REAPER_HOOD_FORWARD);
  cowl.material = robe;
  cowl.convertToFlatShadedMesh();
  cowl.parent = body.headMesh;
  added.push(cowl);
  // The skull's long bone jaw thrust out of the cowl under the bead eyes, REAPER_JAW heads wide at the cheek narrowing down and forward, REAPER_JAW_LONG heads long,
  // standing proud of the cowl's rim so the face reads in profile as well as from the front
  const jaw = MeshBuilder.CreateCylinder(`${body.headMesh.name}_reaperJaw`, { height: headSize * REAPER_JAW_LONG, diameterTop: headSize * REAPER_JAW, diameterBottom: headSize * REAPER_JAW * 0.55, tessellation: 6 }, scene);
  jaw.scaling.z = 0.75;
  jaw.rotation.x = 0.35;
  jaw.position.set(0, -headSize * 0.32, headSize * 0.36);
  jaw.material = bone;
  jaw.convertToFlatShadedMesh();
  jaw.parent = body.headMesh;
  added.push(jaw);
  const peak = MeshBuilder.CreateCylinder(`${body.headMesh.name}_cowlPeak`, { height: headSize * 0.6, diameterTop: 0, diameterBottom: headSize * 0.9, tessellation: 7 }, scene);
  peak.position.set(0, headSize * 0.78, -headSize * 0.12);
  peak.rotation.x = -0.55;
  peak.material = robe;
  peak.convertToFlatShadedMesh();
  peak.parent = body.headMesh;
  added.push(peak);
  const mantle = MeshBuilder.CreateCylinder(`${body.headMesh.name}_mantle`, { height: headSize * 0.5, diameterTop: headSize * 1.1, diameterBottom: W * 1.25, tessellation: 8 }, scene);
  mantle.position.set(0, chest.position.y + H * 0.48, -D * 0.05);
  mantle.scaling.z = (D * 1.35) / (W * 1.25);
  mantle.material = robe;
  mantle.convertToFlatShadedMesh();
  mantle.parent = body.torso;
  added.push(mantle);
  // Skirt from the waist to mid-shin, flaring, the hem torn into rags
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  if (pelvis) {
    const pExt = pelvis.getBoundingInfo().boundingBox.extendSize;
    const thigh = body.leftUpperLeg.getBoundingInfo().boundingBox.extendSize.y * 2 * body.leftUpperLeg.scaling.y;
    const long = thigh * REAPER_SKIRT;
    const top = Math.max(pExt.x * 2.3, W * REAPER_ROBE * 0.95), hem = pExt.x * 2 * REAPER_HEM;
    const skirt = MeshBuilder.CreateCylinder(`${pelvis.name}_robeSkirt`, { height: long, diameterTop: top, diameterBottom: Math.max(hem, top * 1.15), tessellation: 9 }, scene);
    skirt.scaling.z = (pExt.z * 2.6) / top + 0.25;
    skirt.position.y = pelvis.position.y + pExt.y * 1.5 - long / 2;
    skirt.material = robe;
    skirt.convertToFlatShadedMesh();
    skirt.parent = body.hip;
    added.push(skirt);
    const rim = Math.max(hem, top * 1.15);
    for (let i = 0; i < REAPER_TATTERS; i++) {
      const a = ((i + 0.5) / REAPER_TATTERS) * Math.PI * 2;
      const drop = long * (0.13 + 0.12 * ((i * 5) % 3) / 2);
      const tatter = MeshBuilder.CreateCylinder(`${pelvis.name}_robeRag`, { height: drop, diameterTop: rim * 0.34, diameterBottom: 0, tessellation: 3 }, scene);
      tatter.position.set(Math.sin(a) * rim * 0.4, -long / 2 - drop / 2, Math.cos(a) * rim * 0.4);
      tatter.rotation.y = a;
      tatter.material = robe;
      tatter.parent = skirt;
      added.push(tatter);
    }
  }
  return added;
}

function applyMaterialPreset(
  body: ReturnType<typeof buildArticulatedBody>,
  visual: UnitVisualConfig,
  bodyColor: Color3,
  skinColor: Color3,
  presetWeight: number,
  skinGlow: number,
): void {
  const tint = resolveMaterialTint(visual.materialPreset ?? "default", bodyColor, skinColor, presetWeight);
  body.bodyMaterial.baseColor = tint.bodyDiffuse;
  body.bodyMaterial.emissiveColor = tint.bodyEmissive;
  body.bodyMaterial.metallic = tint.metallic * BODY_METAL_WEIGHT;
  body.bodyMaterial.roughness = tint.roughness;
  body.bodyMaterial.alpha = tint.alpha;
  const warmSkin = skinColor.r > skinColor.g && skinColor.r > skinColor.b;
  body.skinMaterial.baseColor = warmSkin ? new Color3(tint.skinDiffuse.r * WARM_SKIN_RED, tint.skinDiffuse.g + WARM_SKIN_GREEN_LIFT, tint.skinDiffuse.b * WARM_SKIN_BLUE + WARM_SKIN_BLUE_LIFT) : tint.skinDiffuse;
  // Only the part of the team colour above its weakest channel glows: the whole colour would wash the skin toward white.
  // Blue glows half again as strongly, so blue skin is a clear sky blue and not a teal grey; red skin has next to no blue above its weakest channel and is unchanged.
  const grey = Math.min(skinColor.r, skinColor.g, skinColor.b);
  body.skinMaterial.emissiveColor = tint.skinEmissive.add(new Color3(skinColor.r - grey, skinColor.g - grey, (skinColor.b - grey) * SKIN_GLOW_BLUE).scale(skinGlow * (warmSkin ? WARM_SKIN_GLOW : 1))).add(new Color3(0, 0, warmSkin && skinGlow > 0 ? WARM_SKIN_GLOW_BLUE : 0));
}

interface MaterialTint {
  bodyDiffuse: Color3;
  bodyEmissive: Color3;
  skinDiffuse: Color3;
  skinEmissive: Color3;
  alpha: number;
  metallic: number;
  roughness: number;
}

function resolveMaterialTint(materialPreset: MaterialPreset, bodyColor: Color3, skinColor: Color3, presetWeight: number): MaterialTint {
  const skinBase = skinColor;
  // Skin is the team color (TABS); presets only nudge it a little toward their flesh tone.
  const fleshWeight = skinColor.r > skinColor.g && skinColor.r > skinColor.b ? WARM_SKIN_FLESH_WEIGHT : SKIN_FLESH_WEIGHT;
  const flesh = (target: Color3, amount: number) => Color3.Lerp(skinBase, target, amount * fleshWeight);
  const zero = new Color3(0, 0, 0);
  const blend = (target: Color3, amount: number) => Color3.Lerp(bodyColor, target, amount * presetWeight);
  // Defaults: cloth-like (non-metallic, fairly rough)
  const base = { metallic: 0.0, roughness: 0.9 };
  switch (materialPreset) {
    case "tribal_hide":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.46, 0.32, 0.2), 0.58), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.74, 0.62), 0.16), skinEmissive: zero, alpha: 1 };
    case "medieval_steel":
      return { metallic: 0.8, roughness: 0.3, bodyDiffuse: blend(new Color3(0.62, 0.64, 0.68), 0.46), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: flesh(new Color3(0.9, 0.84, 0.76), 0.12), skinEmissive: zero, alpha: 1 };
    case "ancient_bronze":
      return { metallic: 0.7, roughness: 0.35, bodyDiffuse: blend(new Color3(0.72, 0.56, 0.28), 0.5), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.8, 0.68), 0.16), skinEmissive: zero, alpha: 1 };
    case "viking_fur":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.5, 0.4, 0.28), 0.54), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.88, 0.78, 0.68), 0.14), skinEmissive: zero, alpha: 1 };
    case "dynasty_lacquer":
      return { metallic: 0.15, roughness: 0.35, bodyDiffuse: blend(new Color3(0.62, 0.16, 0.14), 0.5), bodyEmissive: new Color3(0.02, 0.0, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.84, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "renaissance_velvet":
      return { ...base, roughness: 0.92, bodyDiffuse: blend(new Color3(0.38, 0.32, 0.52), 0.48), bodyEmissive: new Color3(0.01, 0.01, 0.02), skinDiffuse: flesh(new Color3(0.9, 0.82, 0.74), 0.12), skinEmissive: zero, alpha: 1 };
    case "pirate_tar":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.24, 0.18, 0.14), 0.62), bodyEmissive: new Color3(0.01, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "wildwest_leather":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.46, 0.3, 0.18), 0.54), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.86, 0.72, 0.6), 0.14), skinEmissive: zero, alpha: 1 };
    case "legacy_toy":
      return { metallic: 0.1, roughness: 0.5, bodyDiffuse: blend(new Color3(0.74, 0.74, 0.74), 0.4), bodyEmissive: new Color3(0.01, 0.01, 0.01), skinDiffuse: flesh(new Color3(0.92, 0.86, 0.8), 0.08), skinEmissive: zero, alpha: 1 };
    case "good_gold":
      return { metallic: 0.85, roughness: 0.2, bodyDiffuse: blend(new Color3(0.92, 0.82, 0.56), 0.48), bodyEmissive: new Color3(0.04, 0.03, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.9, 0.8), 0.2), skinEmissive: zero, alpha: 1 };
    case "evil_void":
      return { metallic: 0.2, roughness: 0.6, bodyDiffuse: blend(new Color3(0.3, 0.22, 0.42), 0.62), bodyEmissive: new Color3(0.03, 0.01, 0.05), skinDiffuse: flesh(new Color3(0.82, 0.72, 0.84), 0.14), skinEmissive: zero, alpha: 0.98 };
    case "secret_hero":
      return { metallic: 0.6, roughness: 0.3, bodyDiffuse: blend(new Color3(0.92, 0.84, 0.45), 0.45), bodyEmissive: new Color3(0.08, 0.06, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.92, 0.82), 0.25), skinEmissive: zero, alpha: 1 };
    case "secret_ghost":
      return { metallic: 0.1, roughness: 0.3, bodyDiffuse: blend(new Color3(0.82, 0.78, 0.96), 0.55), bodyEmissive: new Color3(0.06, 0.04, 0.08), skinDiffuse: flesh(new Color3(0.9, 0.9, 1.0), 0.4), skinEmissive: new Color3(0.02, 0.02, 0.04), alpha: 0.94 };
    case "secret_ice":
      return { metallic: 0.15, roughness: 0.2, bodyDiffuse: blend(new Color3(0.62, 0.88, 0.98), 0.6), bodyEmissive: new Color3(0.03, 0.06, 0.08), skinDiffuse: flesh(new Color3(0.88, 0.96, 1.0), 0.45), skinEmissive: zero, alpha: 1 };
    case "secret_nature":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.4, 0.54, 0.28), 0.6), bodyEmissive: new Color3(0.02, 0.04, 0.01), skinDiffuse: flesh(new Color3(0.68, 0.58, 0.46), 0.35), skinEmissive: zero, alpha: 1 };
    case "secret_bone":
      return { ...base, roughness: 0.5, bodyDiffuse: blend(new Color3(0.88, 0.84, 0.76), 0.58), bodyEmissive: new Color3(0.03, 0.03, 0.02), skinDiffuse: flesh(new Color3(0.92, 0.88, 0.8), 0.3), skinEmissive: zero, alpha: 1 };
    case "secret_demon":
      return { metallic: 0.3, roughness: 0.5, bodyDiffuse: blend(new Color3(0.56, 0.16, 0.12), 0.62), bodyEmissive: new Color3(0.06, 0.02, 0.01), skinDiffuse: flesh(new Color3(0.88, 0.66, 0.58), 0.15), skinEmissive: zero, alpha: 1 };
    case "secret_holy":
      return { metallic: 0.5, roughness: 0.25, bodyDiffuse: blend(new Color3(0.94, 0.9, 0.72), 0.42), bodyEmissive: new Color3(0.05, 0.04, 0.01), skinDiffuse: flesh(new Color3(0.98, 0.9, 0.8), 0.22), skinEmissive: zero, alpha: 1 };
    case "secret_bandit":
      return { ...base, roughness: 0.75, bodyDiffuse: blend(new Color3(0.24, 0.24, 0.28), 0.55), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.8, 0.66, 0.56), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_beast":
      return { ...base, roughness: 0.85, bodyDiffuse: blend(new Color3(0.48, 0.52, 0.24), 0.55), bodyEmissive: zero, skinDiffuse: flesh(new Color3(0.78, 0.68, 0.5), 0.2), skinEmissive: zero, alpha: 1 };
    case "secret_pirate":
      return { metallic: 0.05, roughness: 0.7, bodyDiffuse: blend(new Color3(0.3, 0.18, 0.14), 0.58), bodyEmissive: new Color3(0.02, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.84, 0.68, 0.55), 0.14), skinEmissive: zero, alpha: 1 };
    case "secret_festive":
      return { ...base, roughness: 0.8, bodyDiffuse: blend(new Color3(0.34, 0.6, 0.28), 0.46), bodyEmissive: new Color3(0.02, 0.03, 0.01), skinDiffuse: flesh(new Color3(0.94, 0.82, 0.72), 0.12), skinEmissive: zero, alpha: 1 };
    case "secret_royal":
      return { metallic: 0.4, roughness: 0.4, bodyDiffuse: blend(new Color3(0.62, 0.18, 0.18), 0.52), bodyEmissive: new Color3(0.03, 0.01, 0.0), skinDiffuse: flesh(new Color3(0.92, 0.82, 0.74), 0.15), skinEmissive: zero, alpha: 1 };
    default:
      return { ...base, bodyDiffuse: bodyColor, bodyEmissive: zero, skinDiffuse: skinBase, skinEmissive: zero, alpha: 1 };
  }
}
