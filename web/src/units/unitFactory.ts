import {
  Scene, Vector3, Color3, Mesh, MeshBuilder, Quaternion, TransformNode, VertexBuffer, VertexData,
  type Material, type ShadowGenerator,
} from "@babylonjs/core";
import type { UnitDefinition } from "../data/unitDefinitions";
import { getCrowdPhysicsProfile, getRagdollProfile } from "../data/combatProfiles";
import { FACTION_COLORS, FactionId, TEAM_COLORS } from "../data/factionColors";
import { buildArticulatedBody, crewProportions, type ArticulatedBody } from "./bodyBuilder";
import { getUnitVisual, type MaterialPreset, type UnitVisualConfig } from "./unitVisuals";
import { attachProps, buildPerchedCrow } from "./propBuilder";
import { isVehicleUnit, buildVehicleBody, dressCannonCrew, wheelbarrowCrew, type WheelbarrowCrew } from "./vehicleBuilder";
import { RuntimeUnit } from "./runtimeUnit";
import { getMaterialFactory } from "./materialFactory";
import { getLinkedActorPreset } from "./linkedActorPresets";
import { dressAfro, dressBeard, dressTribalBracelets, dressTribalHair, dressTribalHideDress, dressTribalLoincloth, dressTribalNecklace, dressTribalPauldrons, hasTribalNecklace, trunkBand, wearsHideDress } from "./tribalDress";
import { bardTunic, dressMedieval, healerRobeTrim, knightCuirass, squireTabardTrim } from "./medievalDress";
import { halflingFootFur, halflingJacket, halflingMop, harvesterBraids, potionHead, potionJerkin } from "./farmerDress";
import { dressHoplite, dressMinotaur, dressSarissa, dressShieldBearer, dressSnakeArcher, dressZeus, dressZeusToga, heldSnake, sarissaKit, snakeArcherKit, zeusLegs } from "./ancientDress";
import { balloonArcherFront, featherClump, fencerTrim, halberdBreeches, halberdHose, heldBalloonArrow, musketeerHose, PAINTER_SWEATER, painterJabot, painterSweaterRib } from "./renaissanceDress";
import { headbutterBraids, headbutterCap, brawlerHelm, jarlPelt } from "./vikingDress";

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
// [S] the knight's steel fauld (357; medieval.knight.png): a short steel skirt over the hips under his cuirass, .long thighs long, .flare pelvises wide at the hem
const KNIGHT_FAULD = { long: 0.42, flare: 1.4, steel: new Color3(0.6, 0.6, 0.65) };
const BELT_COLOR = new Color3(0.2, 0.14, 0.1);
// Zeus wears a plain off-white tunic with a red sash from one shoulder to the other hip, not a breastplate.
const ZEUS_TUNIC_COLOR = new Color3(0.94, 0.92, 0.86);
// Tribal units wear nothing but a hide loincloth: the only part of them that is not team-coloured skin.
const LOINCLOTH_COLOR = new Color3(0.42, 0.27, 0.15);
// ...and a dark shaggy mop of hair over the crown and the back of the head.
const TRIBAL_HAIR_COLOR = new Color3(0.16, 0.1, 0.06);
/*
 * The tribal hide garment (tribal.stoner.jpg, card Appearance: "a simple brown garment held by a shoulder strap on their right side"): a brown tunic over
 * the trunk from under the arms, hanging on below the waist as a skirt to mid-thigh with a ragged hem, held up by one strap over the right shoulder, the
 * left shoulder bare. The trunk part is a faceted sleeve round the torso's bounds, its top TUNIC.top of the trunk high; the skirt TUNIC.skirt of the thigh long,
 * flaring TUNIC.flare; TUNIC.tatters points hang off its hem. Self-lit so the brown does not go black in the shade.
 */
// The protector wears the same garment (card Appearance: "a brown garment held by a shoulder strap on one side"; tribal.protector.png)
// (the stoner wears her own one-strap hide dress since 362: tribalDress dressTribalHideDress)
const TRIBAL_TUNIC_UNITS = new Set(["tribal.protector"]);
const TUNIC = { top: 0.88, skirt: 0.6, flare: 1.25, tatters: 5, strap: 0.22 };
const TUNIC_COLOR = new Color3(0.5, 0.29, 0.18);
/*
 * The tribal hide cape (tribal.bone_mage.blue.png, card Appearance: "a primitive hide cape that extends to their thigh"): a stiff brown hide hung from the
 * shoulders down the back to the thigh, not cloth: a jittered faceted slab HIDE_CAPE.wide shoulder spans across and HIDE_CAPE.thick of the trunk's depth,
 * tilted HIDE_CAPE.tilt off the back, HIDE_CAPE.points pointed tatters off its hem, and a pointed flap forward over each shoulder. Self-lit dark brown.
 */
const TRIBAL_CAPE_UNITS = new Set(["tribal.bone_mage", "tribal.chieftain"]);
const HIDE_CAPE = { wide: 1.25, thick: 0.35, tilt: 0.12, jitter: 0.12, points: 4, drop: 0.55 };
const HIDE_CAPE_COLOR = new Color3(0.38, 0.23, 0.14);
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
 *   doublet PAINTER_DOUBLET of the team colour, beret PAINTER_BERET; cravat at the throat PAINTER_CRAVAT.
 */
const PAINTER_DOUBLET = 0.6;
const PAINTER_BERET = 0.42;
const PAINTER_HOSE = new Color3(0.92, 0.6, 0.3);
const PAINTER_SHOE = new Color3(0.66, 0.22, 0.12);
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
/*
 * [S] the healer's priest robe (354; medieval.healer.blue.png: one long team robe from the shoulders to the shins, not a shirt ending at the hip). The team
 * shirt runs on into a robe skirt hung from the hips (hangSkirt), HEALER_ROBE.long thighs long and .hem pelvises wide at the hem, in the team cloth.
 */
const HEALER_ROBE = { long: 1.75, hem: 1.5 };
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
 *   void_monarch (units/evil.void_monarch): no gold. A grey-olive bone crown: a band round the brow and ~7 straight four-sided spikes standing off it, the front
 *   one tallest (~1.5 heads), the flanking ones falling away to ~0.5 heads at the sides; two bone pauldrons, each rising off the shoulder to about the crown's
 *   height, then running out level ~0.6 chests to the side and hooking down, with spikes along the top; dark navy armour, bone spikes on gauntlets and greaves.
 *   MONARCH_SPIKES [angle round the band from the face, heads tall]; pauldron MONARCH_PAULDRON chests out, MONARCH_PAULDRON_THICK chests thick.
 */
type HornedEvilStyle = {
  horn: [number, number, number][]; hornColor: Color3; cloth: Color3; legs: Color3; helm: Color3 | null; teeth: number; skull: boolean;
  spikes: boolean; wraps: boolean; skirt: number; thick: number; tines?: number; goggles?: boolean; rags?: number; boneCrown?: boolean; bone?: Color3;
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
  "evil.void_monarch": {
    horn: [], hornColor: new Color3(0.6, 0.6, 0.46), cloth: new Color3(0.08, 0.09, 0.2), legs: new Color3(0.07, 0.07, 0.11),
    helm: null, teeth: 0, skull: false, spikes: true, wraps: false, skirt: 0, thick: 1, boneCrown: true, bone: new Color3(0.6, 0.6, 0.46),
  },
};
const MONARCH_SPIKES: [number, number][] = [[0, 1.5], [-0.55, 0.9], [0.55, 0.9], [-1.2, 0.65], [1.2, 0.65], [-2.0, 0.5], [2.0, 0.5]];
const MONARCH_PAULDRON = 0.62;
const MONARCH_PAULDRON_THICK = 0.17;
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
      // [S] the wheelbarrow's three men dressed as themselves (349; WHEELBARROW_OVERALLS)
      const crew = wheelbarrowCrew(body);
      if (crew) propMeshes.push(...dressWheelbarrowCrew(this._scene, crew, teamColor));
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
        // ...or his own hair (tribalDress: the stoner's long locks)
        const ownHair = dressTribalHair(this._scene, body, definition.id);
        if (ownHair) propMeshes.push(...ownHair);
        else if (visual.hat !== "bone_mask" && visual.hat !== "beast_skull" && visual.hat !== "antler_skull") {
          const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
          const hair = MeshBuilder.CreateSphere(`${body.headMesh.name}_hair`, { diameter: headSize * 1.5, segments: 3 }, this._scene);
          hair.position.set(0, headSize * 0.24, -headSize * 0.14);
          hair.material = getMaterialFactory().getCloth(TRIBAL_HAIR_COLOR);
          hair.convertToFlatShadedMesh();
          hair.parent = body.headMesh;
          propMeshes.push(hair);
        }
        if (TRIBAL_TUNIC_UNITS.has(definition.id)) propMeshes.push(...dressTribalTunic(this._scene, body));
        propMeshes.push(...dressTribalHideDress(this._scene, body, definition.id));
        if (TRIBAL_CAPE_UNITS.has(definition.id)) propMeshes.push(...dressTribalCape(this._scene, body));
        // A strung necklace (tribalDress) in place of the dark fur collar
        propMeshes.push(...dressTribalNecklace(this._scene, body, definition.id));
        // ...and the rope, skull and bones over the loincloth (tribalDress)
        propMeshes.push(...dressTribalLoincloth(this._scene, body, definition.id));
        // ...and bone bracelets round the wrists (tribalDress)
        propMeshes.push(...dressTribalBracelets(this._scene, body, definition.id));
        // ...and skulls strapped to the upper arms as shoulder guards (tribalDress)
        propMeshes.push(...dressTribalPauldrons(this._scene, body, definition.id));
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
    // Medieval units' own hair, cloth and ornaments (medievalDress)
    if (definition.faction === FactionId.Medieval && !shouldUseVehicleBody) {
      propMeshes.push(...dressMedieval(this._scene, body, definition.id, teamColor));
    }
    if (definition.id === "renaissance.painter" && !shouldUseVehicleBody) {
      propMeshes.push(...dressPainter(this._scene, body, teamColor, propMeshes));
      // ...and his long dark hair from under the beret (tribalDress)
      propMeshes.push(...(dressTribalHair(this._scene, body, definition.id) ?? []));
    }
    // [S] the halfling's shaggy brown mop (340; tribalDress SHAGGY)
    if (definition.id === "farmer.halfling" && !shouldUseVehicleBody) {
      // [S] ...now a bushy mop of splayed locks (382; farmerDress HALFLING_MOP)
      propMeshes.push(...halflingMop(this._scene, body));
      // [S] ...and his shorts and hairy feet (342-343; HALFLING_SHORTS, HALFLING_FEET)
      propMeshes.push(...dressHalfling(this._scene, body, teamColor));
      // [S] ...his long open jacket over a light vest, white shirt V, dark belt and big grey buckle (376; farmerDress HALFLING_COAT)
      propMeshes.push(...halflingJacket(this._scene, body, teamColor));
    }
    // [S] the minotaur in his own brown fur, team colour only on his belt and pauldron, a leather sash (378; ancientDress dressMinotaur)
    if (definition.id === "ancient.minotaur" && !shouldUseVehicleBody) {
      propMeshes.push(...dressMinotaur(this._scene, body, teamColor, propMeshes));
    }
    // [S] the sarissa's dark team cape to the calves and folded collar (383; ancientDress dressSarissa)
    if (definition.id === "ancient.sarissa" && !shouldUseVehicleBody) {
      propMeshes.push(...dressSarissa(this._scene, body, teamColor));
      // [S] big brown belt, a dagger down his left hip, brown bracers (384; ancientDress sarissaKit)
      propMeshes.push(...sarissaKit(this._scene, body));
    }
    // [S] the shield bearer's lorica segmentata: fitted brown hoops round the trunk, flat shoulder strips (384; ancientDress dressShieldBearer)
    if (definition.id === "ancient.shield_bearer" && !shouldUseVehicleBody) {
      propMeshes.push(...dressShieldBearer(this._scene, body));
    }
    // [S] the hoplite's dark brown greaves over brown strapped sandals (384; ancientDress dressHoplite)
    if (definition.id === "ancient.hoplite" && !shouldUseVehicleBody) {
      propMeshes.push(...dressHoplite(this._scene, body));
    }
    // [S] Zeus's dirty-blond bolt-hair beard and locks, olive leaves at the temples (379; ancientDress dressZeus)
    if (definition.id === "ancient.zeus" && !shouldUseVehicleBody) {
      propMeshes.push(...dressZeus(this._scene, body, propMeshes));
    }
    // [S] the snake archer's team hood, face wrap and tied collar, no khaki box (382; ancientDress dressSnakeArcher)
    if (definition.id === "ancient.snake_archer" && !shouldUseVehicleBody) {
      propMeshes.push(...dressSnakeArcher(this._scene, body, teamColor));
      // [S] the snake nocked in his draw fist (385; ancientDress SNAKE)
      propMeshes.push(...heldSnake(this._scene, body).getChildMeshes() as Mesh[]);
      // [S] ...a brown baldric to the back quiver, brown belt and gold buckle, brown knee boots over strap sandals (386; ancientDress SNAKE_KIT)
      propMeshes.push(...snakeArcherKit(this._scene, body));
    }
    // [S] the Headbutter's own spiked team cap in place of the shared horned viking helmet (392; vikingDress HEADBUTTER_CAP)
    if (definition.id === "viking.headbutter" && !shouldUseVehicleBody) {
      propMeshes.push(...headbutterCap(this._scene, body, teamColor));
      // [S] ...and two tan braids from under the ear flaps down onto the chest, a dark tie at each end (393; vikingDress HEADBUTTER_BRAID)
      propMeshes.push(...headbutterBraids(this._scene, body));
    }
    // [S] the Jarl's bear-head hood and the pelt draping to his hips, in place of the horned helm (393; vikingDress JARL_PELT)
    if (definition.id === "viking.jarl" && !shouldUseVehicleBody) {
      propMeshes.push(...jarlPelt(this._scene, body));
    }
    // [S] the Brawler's full-face Norse helm, no horns (394; vikingDress BRAWLER_HELM)
    if (definition.id === "viking.brawler" && !shouldUseVehicleBody) {
      propMeshes.push(...brawlerHelm(this._scene, body, teamColor));
    }
    if (definition.id === "renaissance.halberd" && !shouldUseVehicleBody) {
      propMeshes.push(...dressHalberd(this._scene, body));
      // ...and his dark stockings and low leather shoes with a turned cuff (374, renaissanceDress halberdHose)
      propMeshes.push(...halberdHose(this._scene, body, teamColor));
      // ...and puffed, slashed team breeches from the hip to the knee (375, renaissanceDress halberdBreeches)
      propMeshes.push(...halberdBreeches(this._scene, body, teamColor));
    }
    if (definition.id === "renaissance.fencer" && !shouldUseVehicleBody) {
      propMeshes.push(...dressFencer(this._scene, body, teamColor));
      // ...and his dark hair from under the hat and a curled moustache (tribalDress)
      propMeshes.push(...(dressTribalHair(this._scene, body, definition.id) ?? []));
    }
    if (definition.id === "renaissance.musketeer" && !shouldUseVehicleBody) {
      propMeshes.push(...dressMusketeer(this._scene, body, teamColor));
      // ...and his curled moustache and goatee (tribalDress)
      propMeshes.push(...(dressTribalHair(this._scene, body, definition.id) ?? []));
    }
    if (definition.id === "renaissance.balloon_archer" && !shouldUseVehicleBody) {
      propMeshes.push(...dressBalloonArcher(this._scene, body, teamColor));
      // ...and the balloon arrow in his draw fist (renaissanceDress HELD_BALLOON_ARROW)
      propMeshes.push(...heldBalloonArrow(this._scene, body, teamColor));
    }
    if (definition.id === "renaissance.jouster" && !shouldUseVehicleBody) {
      propMeshes.push(...dressJouster(this._scene, body, teamColor));
    }
    if (definition.id === "farmer.farmer" && !shouldUseVehicleBody) {
      // [S] white socks and brown slip-on shoes (341; FARMER_SOCK)
      propMeshes.push(...dressFarmerLegs(this._scene, body));
      // [S] ...the leaf-cut hem of his shirt and the strap belt at his waist (348; FARMER_SHIRT)
      propMeshes.push(...dressFarmerShirt(this._scene, body, teamColor));
    }
    if (definition.id === "farmer.potion_seller" && !shouldUseVehicleBody) {
      // [S] a round head under a close umber hair cap following its curve, no hood (343; 377 farmerDress POTION_HEAD)
      propMeshes.push(...potionHead(this._scene, body));
      // [S] a slim fitted dark team jerkin in place of the trunk, laced V, copper buttons, light skirt band (376; farmerDress POTION_FIT)
      propMeshes.push(...potionJerkin(this._scene, body, teamColor));
      // [S] dark team hosen and brown cuffed boots (345; POTION_BOOT)
      propMeshes.push(...dressPotionSellerLegs(this._scene, body, teamColor));
    }
    if (definition.id === "farmer.harvester" && !shouldUseVehicleBody) {
      // [S] two peg handles on the snath, the upper one where his off fist takes it (342; SNATH_PEG, proceduralAnimation SCYTHE_LOW)
      propMeshes.push(...addSnathPegs(this._scene, body));
      propMeshes = propMeshes.filter((m) => !m.isDisposed()); // its grip wraps are taken off (344)
      // [S] beige shoulder collar, rope belt and two stitched team patches on his tunic (348; HARVESTER_TRIM)
      propMeshes.push(...dressHarvester(this._scene, body, teamColor));
      // [S] ...and two braids from beside the cheeks down onto the chest, hung from the torso (376; farmerDress CHEST_BRAID)
      propMeshes.push(...harvesterBraids(this._scene, body, teamColor));
    }
    if (definition.id === "farmer.scarecrow" && !shouldUseVehicleBody) {
      // [S] a crow perched on each elbow (344; propBuilder buildPerchedCrow), kept upright by the animator's T-pose (proceduralAnimation TPOSE)
      for (const [shoulder, elbow] of [[body.leftShoulder, body.leftElbow], [body.rightShoulder, body.rightElbow]] as const) {
        const perch = buildPerchedCrow(this._scene, visual.proportions.scale ?? 1.0);
        perch.parent = shoulder;
        perch.position.copyFrom(elbow.position);
        propMeshes.push(...perch.getChildMeshes(false).filter((m): m is Mesh => m instanceof Mesh));
      }
      // [S] team shirt, patched brown trousers on team-buttoned suspenders, hay at the cuffs and ankles, brown shoes (346; SCARECROW_DRESS)
      propMeshes.push(...dressScarecrow(this._scene, body, teamColor));
    }
    if (definition.id === "farmer.hay_baler" && !shouldUseVehicleBody) {
      propMeshes.push(...dressHayBale(this._scene, body));
      // [S] ...and his brown bowl cut, no hat (341; tribalDress BOWL)
      propMeshes.push(...(dressTribalHair(this._scene, body, definition.id) ?? []));
    }
    if (definition.id === "wild_west.cactus" && !shouldUseVehicleBody) {
      propMeshes.push(...dressCactus(this._scene, body, teamColor));
    }
    if (definition.id === "good.righteous_paladin" && !shouldUseVehicleBody) {
      propMeshes.push(...dressPaladin(this._scene, body, propMeshes));
    }
    if (definition.id === "medieval.healer" && !shouldUseVehicleBody) {
      const robe = hangSkirt(this._scene, body, "healerRobe", HEALER_ROBE.long, HEALER_ROBE.hem, getMaterialFactory().get("cloth", teamColor));
      if (robe) propMeshes.push(robe, ...healerRobeTrim(this._scene, body, robe));
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
      // [S] 385 the white toga over his left shoulder on a bare chest, gold bolt emblem, triple gold belt, in place of the brown sash (ancientDress ZEUS_TOGA)
      propMeshes.push(...dressZeusToga(this._scene, body));
      // [S] 386 bare team legs in short brown strap sandals, no trousers or boots (ancientDress ZEUS_SANDAL)
      propMeshes.push(...zeusLegs(this._scene, body));
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
    if (!shouldUseVehicleBody && definition.faction === FactionId.Medieval && (visual.hat === "great_helm" || visual.hat === "crusader_helm" || visual.hat === "armet" || visual.hat === "plume_helmet")) {
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
      // ...not on the knight (357; medieval.knight.png: his chest is grey plate, medievalDress knightCuirass), who keeps only the mail arms
      if (definition.id === "medieval.knight") tabard.dispose(); else propMeshes.push(tabard);
      const mailMaterial = getMaterialFactory().getCloth(MAIL_COLOR);
      for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
        limb.material = mailMaterial;
      }
      // The cross is two thin cream bars sunk into the front of the cloth, so only their faces show on the chest.
      // Not on the knight (356; medieval.knight.png: his chest is plate, and the cream T read as a second sword hilt floating over his shield)
      const crossDepth = chest.z * body.torsoMesh.scaling.z * 0.3;
      const crossMaterial = getMaterialFactory().getCloth(TABARD_COLOR);
      // ...nor on the squire, whose cross is his own pattee (medievalDress squireTabardTrim)
      for (const [width, height] of definition.id === "medieval.knight" || definition.id === "medieval.squire" ? [] : [[0.2, 1.3], [1.0, 0.18]]) {
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
      if (definition.id === "medieval.knight") belt.dispose(); else propMeshes.push(belt);
    }

    // Every dressed man's garment ends in a skirt of its own: the tabard's long one, a tunic's short hem, a cloth kilt under a cuirass, and on a bare tribesman a hide
    // kilt in place of the painted loincloth, with a fur collar over his shoulders.
    // (not the scarecrow: his shirt is tucked into the trousers his suspenders hold up, SCARECROW_DRESS)
    // (nor the king: his short blouse ends at the belt over puffy breeches to the knee, medievalDress kingDress)
    // (nor the minotaur: bare fur under his scrolled team girdle, 386 ancientDress MINO_SCROLL; the tunic skirt hid the girdle as a plain flared band)
    if (!shouldUseVehicleBody && !shouldFavorTeamBodyColor(materialPreset) && !isZeus && visual.posePreset !== "crew" && definition.id !== "farmer.scarecrow" && definition.id !== "medieval.king" && definition.id !== "ancient.minotaur") {
      const tabard = propMeshes.find((mesh) => mesh.name === "tabard");
      const knight = definition.id === "medieval.knight";
      const skirt = knight
        ? hangSkirt(this._scene, body, "knightFauld", KNIGHT_FAULD.long, KNIGHT_FAULD.flare, getMaterialFactory().get("stone", KNIGHT_FAULD.steel, { emissiveIntensity: 0.05 }))
        : bareSkinned && (wearsHideDress(definition.id) || definition.id === "tribal.spear_thrower")
        ? null
        : bareSkinned
        ? hangSkirt(this._scene, body, "hideKilt", 0.5, 1.45, body.bodyMaterial)
        : tabard
          ? hangSkirt(this._scene, body, "tabardSkirt", 0.7, 1.6, tabard.material)
          : isArmored
            ? hangSkirt(this._scene, body, "armourKilt", 0.6, 1.55, getMaterialFactory().getCloth(body.bodyMaterial.baseColor.scale(ARMOUR_SKIRT_SHADE)))
            // the painter's sweater ends at the hip in a snug ribbed band, not a flared tunic to mid-thigh (374, renaissanceDress PAINTER_SWEATER)
            : definition.id === "renaissance.painter"
              ? hangSkirt(this._scene, body, "painterSweaterHem", PAINTER_SWEATER.long, PAINTER_SWEATER.flare, body.bodyMaterial)
              : hangSkirt(this._scene, body, "tunicSkirt", 0.45, 1.5, body.bodyMaterial);
      if (skirt) propMeshes.push(skirt);
      if (definition.id === "renaissance.painter" && skirt) propMeshes.push(...painterSweaterRib(this._scene, skirt, teamColor));
      if (knight && skirt) propMeshes.push(...knightCuirass(this._scene, body, skirt));
      if (definition.id === "medieval.bard" && skirt) propMeshes.push(...bardTunic(this._scene, skirt, teamColor));
      if (definition.id === "medieval.squire" && tabard && skirt) propMeshes.push(...squireTabardTrim(this._scene, body, tabard, skirt));
      // ...not under a hide cape: its flaps lie over the shoulders where the collar would (the chieftain)
      if (bareSkinned && !hasTribalNecklace(definition.id) && !TRIBAL_CAPE_UNITS.has(definition.id)) propMeshes.push(furCollar(this._scene, body));
    }

    // Linked gun crew wear the same hooped shirt and brown trousers as the cannon's own operator, under their own headgear
    if (visual.posePreset === "crew" && !shouldUseVehicleBody) dressCannonCrew(this._scene, body, bodyColor, false);

    body.root.position = position.clone();
    // Face the border: red (team 0) faces right (+X), blue (team 1) faces left (-X)
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
      // (380) a shield root keeps the hold's holeUp (propBuilder scutum): wiping it seated the scutum on his eyes, a head over him
      const holeUp = (mesh.metadata as { holeUp?: number } | null)?.holeUp;
      mesh.metadata = holeUp === undefined ? { runtimeUnit: unit } : { runtimeUnit: unit, holeUp };
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
  // The jabot (renaissanceDress, spec at PAINTER_JABOT), in place of the 335 cravat
  added.push(...painterJabot(scene, body));
  return added;
}

/*
 * [S] halberdier's dress (333; renaissance.halberd.blue.png: a cream half-tabard down the right side of the chest from the shoulder to mid-thigh, the left
 * side of the doublet team; padded brown sleeves in HALBERD_DRESS.bands rolls to the upper arm and to the forearm; dark-grey gauntlets with a flared cuff
 * over the wrist; a brown belt round the waist over all of it). Sizes are shares of the chest (W, H, D) and of each arm mesh's own girth.
 *   tabard: HALBERD_DRESS.tabard of the chest across on the weapon side, over the chest front and back (HALBERD_DRESS.wrap of its depth), its flaps hanging
 *   HALBERD_DRESS.skirt of the chest's height below the waist; belt HALBERD_BELT_FIT; rolls HALBERD_DRESS.roll of the arm's girth proud;
 *   cuff HALBERD_DRESS.cuff of the forearm's girth, flared, over its last third.
 */
const HALBERD_DRESS = { tabard: 0.55, wrap: 1.12, skirt: 0.45, bands: 3, roll: 1.22, cuff: 1.5 };
// [S] tan tabard and proud belt (336; renaissance.halberd.blue.png: the half-tabard is a warm tan, not white; a brown belt with a buckle stands out over
// it at the waist): the tabard on self-lit tan cloth (HALBERD_TAN, HALBERD_TAN_GLOW; plain cream cloth greyed white), the belt HALBERD_BELT_FIT.proud of
// the tabard round it and .tall of the chest high, a squared buckle .buckle of the chest across on its front.
const HALBERD_TAN = new Color3(0.8, 0.56, 0.28);
const HALBERD_TAN_GLOW = 0.3;
const HALBERD_BELT_FIT = { proud: 1.14, tall: 0.14, buckle: 0.2 };
const HALBERD_BUCKLE = new Color3(0.78, 0.62, 0.3);
const HALBERD_SLEEVE = new Color3(0.5, 0.24, 0.16);
/*
 * [S] quilted sleeves (370; renaissance.halberd.jpg: both sleeves are fat quilted rust-brown padding, puffed bands packed edge to edge from the shoulder
 * to the gauntlet, light and dark by turns, the arm twice as thick as bare; black gauntlets flaring wide toward the elbow over the forearm's lower half).
 * Not the 333 rolls: three thin dark rings spaced down a plain arm. Each arm mesh in its own frame: the upper arm HALBERD_QUILT.upper puffs over its whole
 * length, the forearm .lower puffs over its top (1 - .cuffLong); a puff .swell of the arm's girth across and .tall of its band long (overlapping the next);
 * colours .light / .dark self-lit .glow; the cuff .cuffLong of the forearm long, .cuffFlare of its girth across at the elbow end.
 */
const HALBERD_QUILT = { upper: 5, lower: 3, swell: 1.6, tall: 1.25, light: new Color3(0.66, 0.32, 0.2), dark: new Color3(0.48, 0.21, 0.13), glow: 0.12, cuffLong: 0.48, cuffFlare: 1.75 };
const HALBERD_GAUNTLET = new Color3(0.19, 0.2, 0.21);
const HALBERD_BELT = new Color3(0.32, 0.17, 0.1);
/*
 * [S] hay-bale armour (339; farmer.hay_baler.red.png, card Appearance: a thick tan bale worn over the whole torso from the shoulders to the knees, the
 * arms and head out of it; its top edge breaks into big flat blades of hay standing up and out past the head, the bottom into a flared hem of pointed
 * blades over the knees; two dark straps round its middle, at the lower chest and the waist; the top a darker brown than the sunlit lower bale).
 * [S] fitted to the man (345; factions/farmer.jpg: an average man, the farmer's height, inside a bale about twice his shoulders across): the barrel is
 * measured off his own skeleton, not off the chest box (which bulk swells): from the shoulder line (the neck joint) down to HAY_BALE.knee of the thigh
 * above the knee joint, HAY_BALE.top of the shoulder span S across at the top and .bottom at the foot, .deep of S through. W below is S.
 * Other sizes are shares of S and of the chest height H:
 *   HAY_BALE.blades top blades .blade of H long (every other one .short of that), .bladeWide of W at the root, leaning out .lean (rad);
 *   HAY_BALE.hems hem blades .hem of H long, flaring out .flare; straps .strap of H tall at .straps (shares of the barrel down from its top), .proud round it.
 * Self-lit tan cloth (HAY_TAN / HAY_TOP, HAY_GLOW): plain tan greys out under this light.
 * [S] flat planks, not spikes (375; farmer.hay_baler.red.png: the top breaks into a few broad flat hay planks, each about half the shoulders wide,
 * squared off at a slant at the tip, fanning up and out past the head; below the lower strap a flared skirt of wide flat tongues overlapping round
 * the bale and hanging to mid-shin. Not the 339 rings of thin diamond cones, which read as spikes). Each blade is a flat four-sided plank, its
 * section HAY_PLANK.flat of its width deep, narrowing to .tip of its root width at the tip:
 *   top: HAY_BALE.blades planks .bladeWide of W across, .blade of H long (every other one .short of that), leaning out .lean;
 *   skirt: HAY_BALE.hems tongues .hemWide of W across, .hem of H long (every third .75 of that), from .hemAt of H above the bale's foot, leaning .flare.
 */
const HAY_BALE = { knee: 0.12, top: 1.95, bottom: 2.15, deep: 1.45, blades: 7, blade: 0.8, short: 0.7, bladeWide: 0.72, lean: 0.75, hems: 11, hem: 0.75, hemWide: 0.62, hemAt: 0.3, flare: 0.3, strap: 0.09, straps: [0.38, 0.68], proud: 1.05 };
const HAY_PLANK = { flat: 0.14, tip: 0.6, hemTip: 0.3 };
const HAY_TAN = new Color3(0.7, 0.46, 0.22);
const HAY_TOP = new Color3(0.5, 0.32, 0.18);
const HAY_STRAP = new Color3(0.26, 0.16, 0.11);
const HAY_GLOW = 0.2;
/** Dresses the hay baler (spec at HAY_BALE): the bale over his torso, its blade fringe top and bottom and two straps. */
function dressHayBale(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const B = HAY_BALE;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const H = ext.y * 2 * chest.scaling.y;
  // the man's own frame, in torso space (the torso joint sits on the hip joint): shoulder span, shoulder line, knee line
  const W = Math.abs(body.leftShoulder.position.x - body.rightShoulder.position.x);
  const top = body.neck.position.y;
  const kneeY = body.leftHip.position.y + body.leftKnee.position.y;
  const foot = kneeY - body.leftKnee.position.y * B.knee;
  const tall = top - foot;
  const tan = mf.get("cloth", HAY_TAN, { emissiveIntensity: HAY_GLOW });
  const dark = mf.get("cloth", HAY_TOP, { emissiveIntensity: HAY_GLOW * 0.8 });
  // depth over width of the barrel's section: a round bale, a little shallower than wide
  const deepK = B.deep / B.top;
  const barrel = MeshBuilder.CreateCylinder("hayBarrel", { height: tall, diameterTop: W * B.top, diameterBottom: W * B.bottom, tessellation: 10 }, scene);
  barrel.scaling.z = deepK;
  barrel.position.y = (top + foot) * 0.5;
  barrel.material = tan;
  barrel.convertToFlatShadedMesh();
  barrel.parent = body.torso;
  added.push(barrel);
  // A ring of flat planks round a rim at height y and half-widths rx, rz, each leaning out from upright by `lean` (down when > PI/2): a four-sided
  // frustum turned square to the rim and flattened to HAY_PLANK.flat, narrowing to `tip` of its root width
  const ring = (name: string, n: number, y: number, rx: number, rz: number, long: (i: number) => number, wide: number, lean: number, material: typeof tan, tip: number): void => {
    for (let i = 0; i < n; i++) {
      const a = (i + 0.5) * (Math.PI * 2) / n;
      const at = new TransformNode(name + "At", scene);
      at.parent = body.torso;
      at.position.set(Math.sin(a) * rx, y, Math.cos(a) * rz);
      at.rotation.y = a;
      const L = long(i);
      const blade = MeshBuilder.CreateCylinder(name, { height: L, diameterTop: wide * Math.SQRT2 * tip, diameterBottom: wide * Math.SQRT2, tessellation: 4 }, scene);
      blade.rotation.y = Math.PI / 4;
      blade.bakeCurrentTransformIntoVertices();
      blade.scaling.z = HAY_PLANK.flat;
      blade.setPivotPoint(new Vector3(0, -L * 0.5, 0));
      blade.position.y = L * 0.5;
      blade.rotation.x = lean + ((i * 37) % 5 - 2) * 0.05;
      blade.material = material;
      blade.convertToFlatShadedMesh();
      blade.parent = at;
      added.push(blade);
    }
  };
  // the top fringe, darker, standing up past the head (the blades over the shoulders the longest)
  ring("hayBlade", B.blades, top - H * 0.08, W * B.top * 0.46, W * B.top * 0.46 * deepK, (i) => H * B.blade * (i % 2 ? B.short : 1), W * B.bladeWide, B.lean, dark, HAY_PLANK.tip);
  // the skirt below the lower strap: wide flat tongues overlapping round the bale, flaring out and hanging to mid-shin
  ring("hayHem", B.hems, foot + H * B.hemAt, W * B.bottom * 0.47, W * B.bottom * 0.47 * deepK, (i) => H * B.hem * (i % 3 === 1 ? 0.75 : 1), W * B.hemWide, Math.PI - B.flare, tan, HAY_PLANK.hemTip);
  // two dark straps round its middle
  for (const share of B.straps) {
    const y = top - tall * share;
    const k = share;
    const across = W * (B.top + (B.bottom - B.top) * k) * B.proud;
    const strap = MeshBuilder.CreateCylinder("hayStrap", { height: H * B.strap, diameter: across, tessellation: 10 }, scene);
    strap.scaling.z = deepK;
    strap.position.y = y;
    strap.material = mf.getCloth(HAY_STRAP);
    strap.convertToFlatShadedMesh();
    strap.parent = body.torso;
    added.push(strap);
  }
  return added;
}

/** Dresses the halberdier (spec at HALBERD_DRESS): cream half-tabard, rolled brown sleeves, dark gauntlets, belt. */
function dressHalberd(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const D_ = HALBERD_DRESS;
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const waist = chest.position.y - H * 0.5;
  const side = Math.sign(body.rightShoulder.position.x) || 1;
  const cream = mf.get("cloth", HALBERD_TAN, { emissiveIntensity: HALBERD_TAN_GLOW });
  const tabW = W * D_.tabard;
  // Tabard over the chest, on the weapon side, from the shoulder to the waist
  const tabard = MeshBuilder.CreateBox("halberdTabard", { width: tabW, height: H * 0.96, depth: D * D_.wrap }, scene);
  tabard.position.set(side * (W * 0.5 - tabW * 0.5 + W * 0.03), chest.position.y - H * 0.02, 0);
  tabard.material = cream;
  tabard.parent = body.torso;
  added.push(tabard);
  // and its two flaps hanging below the belt, front and back, a little splayed
  for (const face of [1, -1]) {
    const flap = MeshBuilder.CreateBox("halberdTabardFlap", { width: tabW * 0.95, height: H * D_.skirt, depth: D * 0.07 }, scene);
    flap.setPivotPoint(new Vector3(0, H * D_.skirt * 0.5, 0));
    flap.position.set(side * (W * 0.5 - tabW * 0.5 + W * 0.03), waist - H * D_.skirt * 0.5, face * D * (D_.wrap * 0.5 - 0.04));
    flap.rotation.x = face * 0.12;
    flap.material = cream;
    flap.parent = body.torso;
    added.push(flap);
  }
  // Belt round the waist, standing proud over the tabard, a squared buckle on its front
  const B = HALBERD_BELT_FIT;
  const belt = MeshBuilder.CreateCylinder("halberdBelt", { height: H * B.tall, diameter: 1, tessellation: 8 }, scene);
  belt.scaling.x = W * B.proud;
  belt.scaling.z = D * D_.wrap * B.proud;
  belt.position.set(0, waist + H * B.tall * 0.5, 0);
  belt.material = mf.getCloth(HALBERD_BELT);
  belt.convertToFlatShadedMesh();
  belt.parent = body.torso;
  added.push(belt);
  const buckle = MeshBuilder.CreateBox("halberdBuckle", { width: W * B.buckle, height: H * B.tall * 1.25, depth: D * 0.08 }, scene);
  buckle.position.set(0, waist + H * B.tall * 0.5, D * D_.wrap * B.proud * 0.5 + D * 0.02);
  buckle.material = mf.get("cloth", HALBERD_BUCKLE, { emissiveIntensity: 0.15 });
  buckle.parent = body.torso;
  added.push(buckle);
  const hole = MeshBuilder.CreateBox("halberdBuckleHole", { width: W * B.buckle * 0.55, height: H * B.tall * 0.7, depth: D * 0.09 }, scene);
  hole.position.copyFrom(buckle.position);
  hole.position.z += D * 0.005;
  hole.material = mf.getCloth(HALBERD_BELT);
  hole.parent = body.torso;
  added.push(hole);
  // Sleeves: brown, rolled; gauntlets dark with a flared cuff
  const sleeve = mf.getCloth(HALBERD_SLEEVE);
  const quiltLight = mf.get("cloth", HALBERD_QUILT.light, { emissiveIntensity: HALBERD_QUILT.glow });
  const quiltDark = mf.get("cloth", HALBERD_QUILT.dark, { emissiveIntensity: HALBERD_QUILT.glow });
  const steel = mf.getMetal(HALBERD_GAUNTLET, 0.6);
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    arm.material = sleeve;
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2;
    const long = e.y * 2;
    const lower = arm === body.leftLowerArm || arm === body.rightLowerArm;
    // the quilted sleeve (370, HALBERD_QUILT): puffed bands packed edge to edge down the arm, light and dark rust by turns; on the forearm they stop
    // where the gauntlet's cuff starts
    const Q = HALBERD_QUILT;
    const span = lower ? 1 - Q.cuffLong : 1;
    const count = lower ? Q.lower : Q.upper;
    const step = (long * span) / count;
    for (let i = 0; i < count; i++) {
      const puff = MeshBuilder.CreateSphere("halberdQuilt", { diameterX: girth * Q.swell, diameterY: step * Q.tall, diameterZ: girth * Q.swell, segments: 3 }, scene);
      puff.position.y = long * 0.5 - step * (i + 0.5);
      puff.rotation.y = (i % 2) * 0.4;
      puff.material = i % 2 ? quiltDark : quiltLight;
      puff.convertToFlatShadedMesh();
      puff.parent = arm;
      added.push(puff);
    }
    if (lower) {
      const cuff = MeshBuilder.CreateCylinder("halberdCuff", { height: long * Q.cuffLong, diameterTop: girth * Q.cuffFlare, diameterBottom: girth * 1.05, tessellation: 7 }, scene);
      cuff.position.y = -long * 0.5 + long * Q.cuffLong * 0.5;
      cuff.material = steel;
      cuff.convertToFlatShadedMesh();
      cuff.parent = arm;
      added.push(cuff);
    }
  }
  for (const hand of [body.leftHand, body.rightHand]) {
    for (const m of hand.getChildMeshes(true)) if (/_[lr]HandM$/.test(m.name)) m.material = steel;
  }
  return added;
}

/*
 * [S] fencer's doublet and breeches (334; renaissance.fencer.red.png: a team doublet over the chest with a cream band round the top of each sleeve under a
 * short team shoulder wing, a ring of short team tabs below the waist; puffed knee breeches paned in upright stripes, team and cream by turns). Sizes are
 * shares of the chest (W, H, D) and of each limb mesh's own girth and length.
 *   doublet FENCER_DRESS.doublet of the chest round it; wings, bands, belt and tabs are renaissanceDress FENCER_TRIM (373); the breeches are the thigh
 *   rolls (FENCER_ROLL, 337).
 */
const FENCER_DRESS = { doublet: 1.08 };
const FENCER_CREAM = new Color3(0.8, 0.56, 0.28);
const FENCER_GLOW = 0.3;
/*
 * [S] thigh rolls (337; renaissance.fencer.red.png: each thigh in its own short puffed roll, round and fat, from the hip down about two thirds of the
 * thigh, paned in upright panes team and tan by turns, a pane as wide as the gap beside it; the plain team thigh shows below it to the knee; the two
 * rolls stand apart, not one skirt). Each roll is FENCER_ROLL.panes flat-faced pane slices of a lathe, the slices team and self-lit tan by turns:
 *   FENCER_ROLL.long of the thigh long from the hip; .swell of the thigh's girth across at its middle, .end of it at top and foot. The thighs stand
 *   close, so a roll that would cross .apart of the half-gap between the hips is pushed out sideways by the overlap: the rolls swell out over the
 *   hips, never into each other.
 */
// 374 (critic 373: the tabs had to flare 2x to clear rolls swelling from the hip): each roll starts .drop of the thigh long below the hip, so the
// waist tabs hang near-straight over its top (renaissanceDress FENCER_TRIM hip)
const FENCER_ROLL = { panes: 8, long: 0.68, swell: 2.1, end: 1.3, apart: 0.9, drop: 0.24 };
// [S] boots (336; renaissance.fencer.blue.png: brown knee-high boots, a wide cuff turned down under the knee): shaft .shaft of the shin's girth at its
// top, cuff .cuff of it at its rim, .cuffLong of the shin long
const FENCER_BOOTS = { shaft: 1.3, cuff: 1.85, cuffLong: 0.36 };
const FENCER_BOOT = new Color3(0.42, 0.17, 0.12);
/** Dresses the fencer (spec at FENCER_DRESS): team doublet with cream shoulder bands and waist tabs, paned team-and-cream puffed breeches. */
function dressFencer(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const F = FENCER_DRESS;
  const team = mf.getCloth(teamColor.scale(0.82));
  const cream = mf.get("cloth", FENCER_CREAM, { emissiveIntensity: FENCER_GLOW });
  const put = (m: Mesh, mat: Material, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const waist = chest.position.y - H * 0.5;
  const doublet = put(MeshBuilder.CreateBox("fencerDoublet", { width: W * F.doublet, height: H * 0.9, depth: D * F.doublet }, scene), team, body.torso);
  doublet.position.set(0, chest.position.y - H * 0.04, 0);
  // rolled shoulder wings with tan bands, a dark belt and a flared skirt of tabs (373, renaissanceDress FENCER_TRIM)
  added.push(...fencerTrim(scene, body, teamColor, { W: W * F.doublet, H, D: D * F.doublet, waist }));
  // a puffed roll round each thigh, paned team and tan by turns (FENCER_ROLL)
  const R = FENCER_ROLL;
  const hipsApart = Math.abs(body.leftHip.position.x - body.rightHip.position.x);
  for (const [leg, hipJoint] of [[body.leftUpperLeg, body.leftHip], [body.rightUpperLeg, body.rightHip]] as const) {
    const e = leg.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2 * R.long;
    const swell = girth * R.swell / 2;
    const end = girth * R.end / 2;
    const outward = Math.max(0, swell - hipsApart * 0.5 * R.apart) * Math.sign(hipJoint.position.x || 1);
    // the roll's side in profile: tucked in at hip and foot, round and full at the middle
    const shape = [
      new Vector3(end, -long / 2, 0), new Vector3(swell * 0.9, -long * 0.28, 0), new Vector3(swell, 0, 0),
      new Vector3(swell * 0.92, long * 0.28, 0), new Vector3(end, long / 2, 0),
    ];
    for (let i = 0; i < R.panes; i++) {
      const pane = put(MeshBuilder.CreateLathe("fencerRollPane", { shape, arc: 1 / R.panes, tessellation: 1, sideOrientation: Mesh.DOUBLESIDE }, scene), i % 2 ? team : cream, leg);
      pane.rotation.y = (i / R.panes) * Math.PI * 2 + Math.PI / R.panes;
      pane.position.set(outward, e.y - e.y * 2 * R.drop - long / 2, 0);
    }
  }
  // knee-high brown boots: the shaft over the shin, a wide cuff turned down at its top under the knee, brown feet
  const boot = mf.getCloth(FENCER_BOOT);
  const bootCuff = mf.getCloth(FENCER_BOOT.scale(1.12));
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    shin.material = boot;
    const e = shin.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const shaft = put(MeshBuilder.CreateCylinder("fencerBootShaft", { height: long * 0.75, diameterTop: girth * FENCER_BOOTS.shaft, diameterBottom: girth * 1.1, tessellation: 7 }, scene), boot, shin);
    shaft.position.y = -long * 0.5 + long * 0.375;
    const cuff = put(MeshBuilder.CreateCylinder("fencerBootCuff", { height: long * FENCER_BOOTS.cuffLong, diameterTop: girth * FENCER_BOOTS.cuff, diameterBottom: girth * FENCER_BOOTS.shaft * 1.04, tessellation: 7 }, scene), bootCuff, shin);
    cuff.position.y = long * 0.5 - long * FENCER_BOOTS.cuffLong * 0.5 - long * 0.02;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = boot;
  }
  return added;
}

/*
 * [S] musketeer's vest and blouse (335; renaissance.musketeer.red.png, card Appearance "a chestplate, a blouse, ruffled pants, boots"): a team vest over
 * the chest, standing off it, with short team wings over the shoulders; the arms in cream blouse sleeves, puffed over the upper arm; a cream collar laid
 * flat round the neck's foot; puffy team knee breeches swelling out to the knee and gathered there in a dark band; team stockings banded dark twice down
 * the shin; tan shoes. Cream is self-lit (MUSKETEER_GLOW) so it stays cream and does not grey out. Sizes are shares of the chest (W, H, D), of each
 * limb's girth and length, and of the head's height.
 *   vest MUSKETEER_DRESS.vest of the chest round it; wings .wing of the arm's girth; sleeve puff .puff of the arm's girth; collar .collar heads across;
 *   breeches .breech of the thigh's girth at the top swelling to .knee at the knee. The hose below is renaissanceDress MUSKETEER_HOSE (371).
 */
const MUSKETEER_DRESS = { vest: 1.1, wing: 1.5, puff: 1.4, collar: 1.25, breech: 1.3, knee: 1.65 };
const MUSKETEER_CREAM = new Color3(0.8, 0.6, 0.36);
const MUSKETEER_GLOW = 0.15;
/*
 * [S] vest hem (337; renaissance.musketeer.red.png: the team vest stops at the waist in a short skirt flaring out over the hips, a dark belt line at
 * its top, and the breeches below it a deeper, duller team). Shares of the chest (W, D, H):
 *   vest MUSKETEER_VEST.shade of the team; hem skirt .hem of H deep, .flare of the vest round at its foot; belt .belt of H deep, .beltOut of the vest
 *   round; breeches and thighs .breech of the team.
 */
const MUSKETEER_VEST = { shade: 0.95, hem: 0.2, flare: 1.28, belt: 0.07, beltOut: 1.06, breech: 0.6 };
/*
 * [S] falling collar (370; renaissance.musketeer.red.png, .jpg: a broad pale tan collar turned down over the top of the team breastplate, from the neck
 * out to near the shoulders, two points down the front). Not the 335 flat cream disc at the neck's foot, which the head hid. Shares of the chest (W, H,
 * D): an eight-sided cape .tall of H tall from .neck of W across at the neck to .out of W at its foot, .deep of D front to back, its foot .over of its
 * height down over the vest's top edge; two front tabs from under its front foot, .tab of H long, .tabWide of W across at the top, .tabAt of W either side of the middle, splayed
 * .splay out at the foot. Matte pale tan .color self-lit .glow.
 */
const MUSKETEER_COLLAR = { tall: 0.17, neck: 0.75, out: 1.55, deep: 1.7, over: 0.1, tab: 0.3, tabWide: 0.34, tabAt: 0.13, splay: 0.3, color: new Color3(0.86, 0.74, 0.55), glow: 0.22 };
/** Dresses the musketeer (spec at MUSKETEER_DRESS): team vest, cream blouse sleeves and collar, puffy team breeches, banded stockings, tan shoes. */
function dressMusketeer(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const M = MUSKETEER_DRESS;
  const V = MUSKETEER_VEST;
  const team = mf.getCloth(teamColor.scale(0.82));
  const vestCloth = mf.getCloth(teamColor.scale(V.shade));
  const breechCloth = mf.getCloth(teamColor.scale(V.breech));
  const deep = mf.getCloth(teamColor.scale(0.4));
  const cream = mf.get("cloth", MUSKETEER_CREAM, { emissiveIntensity: MUSKETEER_GLOW });
  const put = (m: Mesh, mat: Material, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const headSize = body.headMesh.getBoundingInfo().boundingBox.extendSize.y * 2;
  // the vest over the chest, and the collar laid flat round the neck's foot
  const vest = put(MeshBuilder.CreateBox("musketeerVest", { width: W * M.vest, height: H * 0.92, depth: D * M.vest }, scene), vestCloth, body.torso);
  vest.position.set(0, chest.position.y - H * 0.03, 0);
  // the vest's foot at the waist: a dark belt line, and under it a short skirt flaring out over the hips all round (MUSKETEER_VEST)
  const vestFoot = vest.position.y - H * 0.46;
  const round = (W * M.vest) * Math.SQRT2;
  const hem = put(MeshBuilder.CreateCylinder("musketeerVestHem", { height: H * V.hem, diameterTop: round * 0.98, diameterBottom: round * V.flare, tessellation: 8 }, scene), vestCloth, body.torso);
  hem.rotation.y = Math.PI / 8;
  hem.scaling.z = D / W;
  hem.position.y = vestFoot - H * V.hem * 0.45;
  const belt = put(MeshBuilder.CreateCylinder("musketeerBelt", { height: H * V.belt, diameter: round * V.beltOut, tessellation: 8 }, scene), deep, body.torso);
  belt.rotation.y = Math.PI / 8;
  belt.scaling.z = D / W;
  belt.position.y = vestFoot + H * V.belt * 0.3;
  // the falling collar (370, MUSKETEER_COLLAR): a pale tan cape sloping from the neck out over the vest's top edge, two pointed tabs down the front
  const C = MUSKETEER_COLLAR;
  const collarCloth = mf.get("cloth", C.color, { emissiveIntensity: C.glow });
  const vestTop = vest.position.y + H * 0.46;
  const cape = put(MeshBuilder.CreateCylinder("musketeerCollar", { height: H * C.tall, diameterTop: W * C.neck, diameterBottom: W * C.out, tessellation: 8, cap: Mesh.CAP_START }, scene), collarCloth, body.torso);
  cape.rotation.y = Math.PI / 8;
  cape.scaling.z = (D * C.deep) / (W * C.out);
  cape.position.set(0, vestTop + H * C.tall * (0.5 - C.over), D * 0.03);
  for (const side of [-1, 1]) {
    const tab = put(MeshBuilder.CreateCylinder("musketeerCollarTab", { height: H * C.tab, diameterTop: W * C.tabWide, diameterBottom: 0, tessellation: 4 }, scene), collarCloth, body.torso);
    tab.scaling.z = 0.22;
    tab.rotation.z = side * C.splay;
    // hung from under the cape's front foot, down the breastplate
    tab.position.set(side * W * C.tabAt, vestTop - H * C.tall * C.over - H * C.tab * 0.4, D * M.vest * 0.5 + D * 0.04);
  }
  // blouse sleeves, puffed over the upper arm, under a team wing at the shoulder
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) {
    arm.material = cream;
  }
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const puff = put(MeshBuilder.CreateCylinder("musketeerPuff", { height: long * 0.6, diameterTop: girth * M.puff * 0.9, diameterBottom: girth * M.puff, tessellation: 7 }, scene), cream, arm);
    puff.position.y = -long * 0.08;
    const wing = put(MeshBuilder.CreateCylinder("musketeerWing", { height: long * 0.18, diameter: girth * M.wing, tessellation: 7 }, scene), team, arm);
    wing.position.y = long * 0.5 - long * 0.1;
  }
  // puffy breeches swelling to the knee and gathered there, over team thighs
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) {
    leg.material = breechCloth;
    const e = leg.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const breech = put(MeshBuilder.CreateCylinder("musketeerBreech", { height: long * 0.85, diameterTop: girth * M.breech, diameterBottom: girth * M.knee, tessellation: 8 }, scene), breechCloth, leg);
    breech.position.y = long * 0.5 - long * 0.45;
    const band = put(MeshBuilder.CreateCylinder("musketeerKneeBand", { height: long * 0.1, diameter: girth * M.knee * 0.86, tessellation: 8 }, scene), deep, leg);
    band.position.y = -long * 0.5 + long * 0.04;
  }
  // the hose below the knee band: garter and bow, tan sock tops, orange shoes (371, renaissanceDress musketeerHose)
  added.push(...musketeerHose(scene, body, teamColor));
  return added;
}

/*
 * [S] halfling's shorts (342; farmer.halfling.red.png, card Appearance "a pair of dark team-colored shorts"): dark team shorts from the waist over the
 * hips and down each thigh to the knee, a little flared at the hem (the jacket, vest, shirt and buckled belt are farmerDress HALFLING_COAT, 376). Shares
 * of the chest (W, H, D) and of the thigh: seat HALFLING_SHORTS.seat round the chest and .seatTall of H tall; leg .leg of the thigh's girth, .flare more
 * at the hem, .long of the thigh long. Team shade .dark, self-lit .glow so it reads dark team, not black.
 */
// 383 [S]: the legs end .long .78 of the thigh in a turned cuff .cuff of the thigh tall, .cuffOut proud, team x .cuffShade, and the foot fur sits low
// on the foot (HALFLING_FEET clumpTall, rise), so the bare shin shows between them (critic 379: shins barely visible above the hairy feet)
const HALFLING_SHORTS = { seat: 1.04, seatTall: 0.3, leg: 1.3, flare: 1.12, long: 0.78, dark: 0.45, glow: 0.14, cuff: 0.14, cuffOut: 1.08, cuffShade: 0.62 };
/*
 * [S] potionseller's hosen and boots (345; farmer.potion_seller.red.png, card Appearance "a pair of dark team-colored hosen along with a pair of brown
 * boots"): both legs in dark team hosen from the hip to the ankle; over the lower shin a brown boot shaft standing a little off the leg, its top turned
 * down in a fatter flared cuff with a dark band under its lip; the foot is the brown boot. Shares of the shin's girth and length: shaft POTION_BOOT.shaft
 * round it and .long of the shin long; cuff .cuff round at its lip, .cuffTall long; band .band long. Hosen team shade .dark; all self-lit (.glow) so
 * brown and dark team do not go black in the shade.
 */
const POTION_BOOT = { shaft: 1.24, long: 0.46, cuff: 1.62, cuffTall: 0.16, band: 0.035, dark: 0.42, glow: 0.18 };
const POTION_BOOT_BROWN = new Color3(0.52, 0.3, 0.2);
const POTION_BOOT_BAND = new Color3(0.26, 0.14, 0.1);
/** Dresses the potionseller's legs (spec at POTION_BOOT): dark team hosen, brown boots with flared cuffs. */
function dressPotionSellerLegs(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const B = POTION_BOOT;
  const hosen = mf.get("cloth", teamColor.scale(B.dark), { emissiveIntensity: B.glow });
  const boot = mf.get("cloth", POTION_BOOT_BROWN, { emissiveIntensity: B.glow });
  const band = mf.get("cloth", POTION_BOOT_BAND, { emissiveIntensity: 0.12 });
  const put = (m: Mesh, mt: Material, parent: TransformNode): Mesh => {
    m.material = mt;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  for (const thigh of [body.leftUpperLeg, body.rightUpperLeg]) thigh.material = hosen;
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    shin.material = hosen;
    const e = shin.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const foot = -long * 0.5;
    const shaftTall = long * B.long;
    const shaft = put(MeshBuilder.CreateCylinder("potionBootShaft", { height: shaftTall, diameterTop: girth * B.shaft, diameterBottom: girth * B.shaft * 1.04, tessellation: 7 }, scene), boot, shin);
    shaft.position.y = foot + shaftTall * 0.5 - long * 0.02;
    const top = foot + shaftTall - long * 0.02;
    const cuff = put(MeshBuilder.CreateCylinder("potionBootCuff", { height: long * B.cuffTall, diameterTop: girth * B.cuff, diameterBottom: girth * B.shaft * 1.08, tessellation: 7 }, scene), boot, shin);
    cuff.position.y = top + long * B.cuffTall * 0.5 - long * 0.03;
    const lip = put(MeshBuilder.CreateCylinder("potionBootBand", { height: long * B.band, diameter: girth * B.shaft * 1.12, tessellation: 7 }, scene), band, shin);
    lip.position.y = top - long * 0.04;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = boot;
  }
  return added;
}

/*
 * [S] scarecrow's clothes (346; farmer.scarecrow.red.png, card Appearance "a team-colored long sleeves shirt that has a patch on it, along with hay
 * sticking out of their cuffs ... a pair of brown pants, with two patches, and are suspended with two straps on either side by a team-colored button
 * ... brown shoes tightened with rope and hay sticking out"): shirt and sleeves plain team cloth; pelvis and both legs brown trousers; two brown
 * suspender straps from the shoulders down the chest and back to the waistband, a team button at each strap's front foot; a team patch on the right
 * thigh and the left shin, a darker team patch on the shirt; a fan of straw tufts out of each sleeve end and each trouser end; brown shoes with a
 * rope tie. Shares (of the chest W/H/D or the limb's girth/length): straps SCARECROW_DRESS.strap of W wide, .apart of W apart; button .button of W;
 * patch .patch of the limb girth; tufts .tufts per cuff, .tuft of the limb long, splayed .splay rad. Brown and straw self-lit (.glow).
 */
const SCARECROW_DRESS = { strap: 0.13, apart: 0.46, button: 0.14, patch: 0.85, tufts: 7, tuft: 0.3, splay: 0.6, glow: 0.22 };
const SCARECROW_BROWN = new Color3(0.5, 0.31, 0.2);
const SCARECROW_STRAP = new Color3(0.42, 0.25, 0.16);
const SCARECROW_STRAW = new Color3(0.86, 0.68, 0.3);
const SCARECROW_ROPE = new Color3(0.72, 0.58, 0.36);
/** Dresses the scarecrow (spec at SCARECROW_DRESS). */
function dressScarecrow(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const C = SCARECROW_DRESS;
  const shirt = mf.get("cloth", teamColor, { emissiveIntensity: 0.12 });
  const brown = mf.get("cloth", SCARECROW_BROWN, { emissiveIntensity: C.glow });
  const strapMat = mf.get("cloth", SCARECROW_STRAP, { emissiveIntensity: C.glow });
  const straw = mf.get("cloth", SCARECROW_STRAW, { emissiveIntensity: 0.28 });
  const rope = mf.get("cloth", SCARECROW_ROPE, { emissiveIntensity: 0.25 });
  const patchMat = mf.get("cloth", Color3.Lerp(teamColor, new Color3(1, 1, 1), 0.2), { emissiveIntensity: 0.14 });
  const shirtPatch = mf.get("cloth", teamColor.scale(0.62), { emissiveIntensity: 0.14 });
  const put = (m: Mesh, mt: Material, parent: TransformNode): Mesh => {
    m.material = mt;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  // the body's own cloth: trousers from the waist down, the shirt above
  const legs = [body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg];
  for (const mesh of body.root.getChildMeshes(false)) {
    if (mesh.material !== body.bodyMaterial) continue;
    mesh.material = /_pelvis$/.test(mesh.name) || legs.includes(mesh as Mesh) ? brown : shirt;
  }
  for (const leg of legs) leg.material = brown;
  // suspenders: a strap down the front and the back of each side of the chest, a team button at each front foot
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const face = D * 0.5 + D * 0.03;
  for (const side of [-1, 1]) {
    for (const front of [1, -1]) {
      const strap = put(MeshBuilder.CreateBox("scarecrowStrap", { width: W * C.strap, height: H * 1.02, depth: D * 0.05 }, scene), strapMat, body.torso);
      strap.position.set(side * W * C.apart * 0.5, chest.position.y, front * face);
    }
    const button = put(MeshBuilder.CreateCylinder("scarecrowButton", { height: D * 0.07, diameter: W * C.button, tessellation: 8 }, scene), shirt, body.torso);
    button.rotation.x = Math.PI / 2;
    button.position.set(side * W * C.apart * 0.5, chest.position.y - H * 0.42, face + D * 0.03);
  }
  // a darker team patch on the shirt, off the left strap
  const sp = put(MeshBuilder.CreateBox("scarecrowShirtPatch", { width: W * 0.2, height: H * 0.18, depth: D * 0.03 }, scene), shirtPatch, body.torso);
  sp.position.set(W * 0.08, chest.position.y + H * 0.05, face);
  sp.rotation.z = 0.25;
  // two team patches on the trousers: the right thigh and the left shin, on the front
  for (const leg of [body.rightUpperLeg, body.leftLowerLeg]) {
    const e = leg.getBoundingInfo().boundingBox.extendSize;
    const g = Math.max(e.x, e.z) * 2;
    const patch = put(MeshBuilder.CreateBox("scarecrowPatch", { width: g * C.patch * 0.5, height: g * C.patch * 0.5, depth: g * 0.05 }, scene), patchMat, leg);
    patch.position.set(0, e.y * 0.1, e.z + g * 0.02);
    patch.rotation.z = 0.35;
  }
  // straw out of each sleeve end and each trouser end, fanned outward round the limb's foot
  const tufts = (limb: Mesh): void => {
    const e = limb.getBoundingInfo().boundingBox.extendSize;
    const g = Math.max(e.x, e.z), long = e.y * 2;
    for (let i = 0; i < C.tufts; i++) {
      const a = (i / C.tufts) * Math.PI * 2;
      const pivot = new TransformNode("scarecrowStrawPivot", scene);
      pivot.parent = limb;
      pivot.position.set(Math.cos(a) * g * 0.7, -e.y * 0.92, Math.sin(a) * g * 0.7);
      pivot.rotation.set(-Math.sin(a) * C.splay, 0, Math.cos(a) * C.splay);
      const len = long * C.tuft * (0.8 + 0.4 * ((i * 37) % 7) / 7);
      const tuft = put(MeshBuilder.CreateCylinder("scarecrowStraw", { height: len, diameterTop: 0, diameterBottom: g * 0.28, tessellation: 4 }, scene), straw, pivot);
      tuft.rotation.x = Math.PI;
      tuft.position.y = -len * 0.5;
    }
  };
  for (const limb of [body.leftLowerArm, body.rightLowerArm, body.leftLowerLeg, body.rightLowerLeg]) tufts(limb);
  // brown shoes tied with a rope round the ankle
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    const e = shin.getBoundingInfo().boundingBox.extendSize;
    const tie = put(MeshBuilder.CreateTorus("scarecrowRope", { diameter: Math.max(e.x, e.z) * 2.2, thickness: Math.max(e.x, e.z) * 0.22, tessellation: 10 }, scene), rope, shin);
    tie.position.y = -e.y * 0.8;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = brown;
  }
  return added;
}

/** Dresses the halfling below the jacket (spec at HALFLING_SHORTS, HALFLING_FEET): dark team shorts, hairy feet. */
function dressHalfling(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const put = (m: Mesh, mat: Material): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = body.torso;
    added.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  // the jacket, vest, shirt V and buckled belt are farmerDress halflingJacket since 376 (HALFLING_COAT)
  // [S] dark team knee shorts (342; spec at HALFLING_SHORTS)
  const S = HALFLING_SHORTS;
  const shortsCloth = mf.get("cloth", teamColor.scale(S.dark), { emissiveIntensity: S.glow });
  const cuffCloth = mf.get("cloth", teamColor.scale(S.cuffShade), { emissiveIntensity: S.glow });
  const waist = chest.position.y - H * 0.5;
  // the seat of the shorts under the jacket's hem, from the waist down over the hips
  const seat = put(MeshBuilder.CreateBox("halflingShortsSeat", { width: W * S.seat, height: H * S.seatTall, depth: D * S.seat }, scene), shortsCloth);
  seat.position.set(0, waist - H * S.seatTall * 0.5 + H * 0.06, 0);
  // a short flared leg of the shorts down each thigh to the knee
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) {
    leg.material = shortsCloth;
    const e = leg.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const tube = MeshBuilder.CreateCylinder("halflingShortsLeg", { height: long * S.long, diameterTop: girth * S.leg * 0.94, diameterBottom: girth * S.leg * S.flare, tessellation: 8 }, scene);
    tube.material = shortsCloth;
    tube.convertToFlatShadedMesh();
    tube.parent = leg;
    tube.position.y = long * 0.5 - long * S.long * 0.5;
    added.push(tube);
    // [S] 383: a turned cuff round the hem, a step proud and lighter, so the shorts end in a clear line above the knee and the bare shin shows under it
    const cuff = MeshBuilder.CreateCylinder("halflingShortsCuff", { height: long * S.cuff, diameter: girth * S.leg * S.flare * S.cuffOut, tessellation: 8 }, scene);
    cuff.material = cuffCloth;
    cuff.convertToFlatShadedMesh();
    cuff.parent = leg;
    cuff.position.y = long * 0.5 - long * S.long + long * S.cuff * 0.5;
    added.push(cuff);
  }
  // [S] 389 his hairy feet: a compact dark tuft on top of each foot (farmerDress HALFLING_TUFT; the 343 splayed clump HALFLING_FEET retired)
  added.push(...halflingFootFur(scene, body));
  return added;
}

/*
 * [S] harvester's snath pegs (342; farmer.harvester.red.png: two short peg handles stand off the snath, one under each fist). Shares of the snath's length L
 * from its middle: the lower peg SNATH_PEG.low (the weapon fist's, which sits SCYTHE_GRIP below the middle), the upper .high; each .long of L long and
 * .thick across, standing out square to the snath. The upper is named "snathPeg", the POLE_GRIP mark that puts his off fist on the snath (_twoHandPole).
 * [S] rooted (343; farmer.harvester.red.png: the pegs grow out of a red-brown snath under a grey blade): the snath bows away from the blade (the prop's
 * SCYTHE_BOW), so each peg's root is set on the bow's own line at its height, sunk SNATH_PEG.sink of its length into the pole, not on the straight chord a
 * hand-width off it. His snath is red-brown SNATH_WOOD, his blade, heel and collar a mid grey SNATH_STEEL (the reaper's scythe keeps its own).
 * [S] plain snath (344; farmer.harvester.red.png: no rings on the pole, only the two pegs): the shared scythe's grip-wrap hoops ride the straight chord,
 * a hand-width off his bowed snath, so they hang beside it as loose rings; his are taken off, and the pegs are the only grips.
 */
const SNATH_PEG = { low: -0.15, high: 0.15, long: 0.09, thick: 0.03, sink: 0.2 };
const SNATH_WOOD = new Color3(0.5, 0.24, 0.17);
const SNATH_STEEL = new Color3(0.5, 0.51, 0.53);
/** Adds the two peg handles to the harvester's scythe (spec at SNATH_PEG). */
function addSnathPegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const carry = body.rightHand.getChildren().find((n) => n.name === "scytheCarry");
  const snath = carry?.getChildren().find((n): n is Mesh => n instanceof Mesh && n.name === "shaft");
  if (!snath) return [];
  const box = snath.getBoundingInfo().boundingBox;
  const L = box.extendSize.y * 2;
  // the bow: the snath's line runs z = bow * (1 - 4 t^2) at t of its length from the middle (its ends on z 0), the pole's radius round it
  const bow = box.maximum.z - box.extendSize.x;
  const wood = getMaterialFactory().get("wood", SNATH_WOOD, { emissiveIntensity: 0.18 });
  const steel = getMaterialFactory().get("metal", SNATH_STEEL, { emissiveIntensity: 0.12 });
  snath.material = wood;
  for (const m of snath.getChildMeshes(false)) {
    if (m.name === "gripWrap") m.dispose(false, false);
    else m.material = steel;
  }
  const added: Mesh[] = [];
  for (const [name, at] of [["snathPegLow", SNATH_PEG.low], ["snathPeg", SNATH_PEG.high]] as const) {
    const peg = MeshBuilder.CreateCylinder(name, { height: L * SNATH_PEG.long, diameterTop: L * SNATH_PEG.thick * 0.8, diameterBottom: L * SNATH_PEG.thick, tessellation: 6 }, scene);
    peg.rotation.z = Math.PI / 2;
    peg.position.set(-L * SNATH_PEG.long * (0.5 - SNATH_PEG.sink), at * L, bow * (1 - 4 * at * at));
    peg.material = wood;
    peg.convertToFlatShadedMesh();
    peg.parent = snath;
    added.push(peg);
  }
  return added;
}

/*
 * [S] farmer's socks and shoes (341; farmer.farmer.red.png, card Appearance "a pair of long white socks along with a pair of brown medieval slip-on
 * shoes"): from under the knee-length shorts to the ankle a white sock, a tube standing a little off the shin, its top turned down in a fatter cuff just
 * under the knee; at the ankle the brown shoe's raised collar wraps the foot of the sock, and the foot is the brown shoe. Shares of the shin's girth and
 * length: sock FARMER_SOCK.sock round it and .long of the shin long; cuff .cuff round and .cuffTall long; shoe collar .collar round and .collarTall long.
 * White is self-lit (.glow) so it reads white and not grey in the shade.
 */
const FARMER_SOCK = { sock: 1.14, long: 0.9, cuff: 1.3, cuffTall: 0.12, collar: 1.36, collarTall: 0.13, glow: 0.22 };
const FARMER_SOCK_WHITE = new Color3(0.9, 0.88, 0.84);
const FARMER_SHOE = new Color3(0.5, 0.29, 0.18);
/** Dresses the farmer's lower legs (spec at FARMER_SOCK): white socks with turned cuffs, brown slip-on shoes with raised collars. */
function dressFarmerLegs(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const F = FARMER_SOCK;
  const sock = mf.get("cloth", FARMER_SOCK_WHITE, { emissiveIntensity: F.glow });
  const shoe = mf.get("cloth", FARMER_SHOE, { emissiveIntensity: 0.15 });
  const put = (m: Mesh, mt: Material, parent: TransformNode): Mesh => {
    m.material = mt;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) {
    shin.material = sock;
    const e = shin.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const tube = put(MeshBuilder.CreateCylinder("farmerSock", { height: long * F.long, diameterTop: girth * F.sock, diameterBottom: girth * F.sock * 0.94, tessellation: 7 }, scene), sock, shin);
    tube.position.y = long * 0.5 - long * F.long * 0.5 - long * 0.03;
    const cuff = put(MeshBuilder.CreateCylinder("farmerSockCuff", { height: long * F.cuffTall, diameterTop: girth * F.cuff, diameterBottom: girth * F.cuff * 1.04, tessellation: 7 }, scene), sock, shin);
    cuff.position.y = long * 0.5 - long * 0.03 - long * F.cuffTall * 0.5;
    const collar = put(MeshBuilder.CreateCylinder("farmerShoeCollar", { height: long * F.collarTall, diameterTop: girth * F.collar, diameterBottom: girth * F.collar * 0.92, tessellation: 7 }, scene), shoe, shin);
    collar.position.y = -long * 0.5 + long * F.collarTall * 0.35;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = shoe;
  }
  return added;
}

/*
 * [S] farmer's shirt hem and strap belt (348; farmer.farmer.blue.png, card Appearance "a team-colored shirt with its bottom cut into a leaf-like pattern
 * ... knee-length shorts belted with straps"): round the hem of the team shirt's skirt hangs a ring of FARMER_SHIRT.dags pointed leaf dags, each a flat
 * downward triangle standing out with the skirt's flare, alternate ones a shade darker so the cut reads; round the waist where the skirt meets the chest a
 * brown leather strap, a buckle loop at the front and its tongue hanging down over the shirt. Sizes are shares of the pelvis (the skirt's own measure, as
 * hangSkirt hangs it): dags .dag of the hem's circumference across each, .dagLong of the thigh long, tilted out .tilt rad; strap .strap of the thigh tall,
 * .strapProud round the skirt's waist; tongue .tongue of the thigh long. Brown self-lit (.glow) so it reads brown and not black.
 */
const FARMER_SHIRT = { dags: 10, dag: 1.25, dagLong: 0.24, tilt: 0.32, shade: 0.82, strap: 0.1, strapProud: 1.1, tongue: 0.22, glow: 0.2 };
const FARMER_STRAP = new Color3(0.5, 0.27, 0.17);
/*
 * [S] The wheelbarrow's crew (349; farmer.wheelbarrow.red.png/.blue.png, card Characteristics "three sub-units: the Traveller, the Apple Thrower and the
 * Farmer"): the front rider is the Farmer, in his own liripipe hood (the farmer's pointed_cowl, through attachProps), white socks and brown shoes
 * (dressFarmerLegs) and leaf-cut hem with the strap belt (dressFarmerShirt); the Apple Thrower behind him is bald with a brown beard (dressBeard); the
 * Traveller on the handles wears a big round brown afro (dressAfro) and overalls: a bib over the front of his trunk from WHEELBARROW_OVERALLS.lo to .hi of
 * the neck's height, .bib of the trunk across, in the team colour darkened to .shade, two straps .strap of the trunk across from the bib's top corners up
 * over the shoulders and down his back to .backLo, a pale button at the foot of each strap. Self-lit (.glow) so the dark shade stays cloth.
 */
const WHEELBARROW_OVERALLS = { lo: 0.05, hi: 0.62, bib: 0.62, shade: 0.55, strap: 0.13, backLo: 0.35, proud: 0.03, button: 0.07, glow: 0.18 };
/** Dresses the wheelbarrow's three men (spec at WHEELBARROW_OVERALLS). */
function dressWheelbarrowCrew(scene: Scene, crew: WheelbarrowCrew, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  added.push(...attachProps(scene, crew.farmer, { ...getUnitVisual("farmer.farmer"), weapon: "none" }, 0.46, teamColor));
  added.push(...dressFarmerLegs(scene, crew.farmer));
  added.push(...dressFarmerShirt(scene, crew.farmer, teamColor));
  added.push(...dressBeard(scene, crew.thrower));
  added.push(...dressAfro(scene, crew.traveller));
  // the Traveller's overalls: bib, straps over the shoulders, buttons
  const O = WHEELBARROW_OVERALLS;
  const body = crew.traveller;
  const dark = teamColor.scale(O.shade);
  const cloth = getMaterialFactory().get("cloth", dark, { emissive: dark.scale(O.glow) });
  const pale = getMaterialFactory().get("cloth", new Color3(0.86, 0.8, 0.66), { emissiveIntensity: 0.2 });
  const band = trunkBand(body, O.lo, O.hi);
  const top = trunkBand(body, O.hi, 1);
  const across = band.halfX * 2;
  const thin = O.proud * across;
  const put = (m: Mesh, mt: Material): Mesh => { m.material = mt; m.parent = body.torso; added.push(m); return m; };
  const tall = band.trunk * (O.hi - O.lo);
  const bib = put(MeshBuilder.CreateBox("overallBib", { width: across * O.bib, height: tall, depth: thin }, scene), cloth);
  bib.position.set(band.midX, band.trunk * (O.lo + O.hi) * 0.5, band.maxZ + thin * 0.5);
  const strapW = across * O.strap;
  for (const side of [-1, 1]) {
    const x = band.midX + side * across * O.bib * 0.35;
    const front = new Vector3(x, band.trunk * O.hi, top.maxZ + thin * 0.5);
    const over = new Vector3(x, band.trunk * 1.02, (top.maxZ + top.minZ) * 0.5);
    const back = new Vector3(x, band.trunk * O.backLo, top.minZ - thin * 0.5);
    for (const [a, b] of [[front, over], [over, back]]) {
      const span = b.subtract(a);
      const strap = put(MeshBuilder.CreateBox("overallStrap", { width: strapW, height: span.length(), depth: thin }, scene), cloth);
      strap.position.copyFrom(a.add(b).scale(0.5));
      strap.rotation.x = Math.atan2(span.z, span.y);
    }
    const button = put(MeshBuilder.CreateCylinder("overallButton", { height: thin, diameter: across * O.button, tessellation: 6 }, scene), pale);
    button.rotation.x = Math.PI / 2;
    button.position.set(x, band.trunk * O.hi - strapW * 0.4, band.maxZ + thin * 1.2);
  }
  return added;
}

/** Dresses the farmer's shirt (spec at FARMER_SHIRT): leaf-cut dags round the skirt's hem, a brown strap belt at the waist. */
function dressFarmerShirt(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const pelvis = body.allMeshes.find((m) => /_pelvis$/.test(m.name));
  if (!pelvis) return added;
  const mf = getMaterialFactory();
  const S = FARMER_SHIRT;
  const size = pelvis.getBoundingInfo().boundingBox.extendSize;
  const thigh = Math.abs(body.leftKnee.position.y);
  // the tunic skirt as hangSkirt hangs it (length .45, flare 1.5)
  const drop = thigh * 0.45;
  const depthScale = Math.max(0.7, size.z / size.x * 1.25);
  const waistY = pelvis.position.y + size.y;
  const hemY = waistY - drop;
  const hemR = size.x * 1.5;
  const put = (m: Mesh, mt: Material, parent: TransformNode): Mesh => {
    m.material = mt;
    m.parent = parent;
    added.push(m);
    return m;
  };
  // the leaf dags round the hem
  const light = mf.get("cloth", teamColor, { emissiveIntensity: 0.12 });
  const dark = mf.get("cloth", teamColor.scale(S.shade), { emissiveIntensity: 0.12 });
  const across = 2 * Math.PI * hemR / S.dags * S.dag;
  const long = thigh * S.dagLong;
  for (let k = 0; k < S.dags; k++) {
    const a = (k + 0.5) / S.dags * Math.PI * 2;
    const seat = new TransformNode("farmerDagSeat", scene);
    seat.parent = body.hip;
    seat.position.set(Math.sin(a) * hemR, hemY + long * 0.12, Math.cos(a) * hemR * depthScale);
    seat.rotation.y = a;
    seat.rotation.x = S.tilt;
    // a downward triangle: its flat top along the hem, its point below
    const dag = MeshBuilder.CreateDisc("farmerDag", { radius: 1, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene);
    dag.rotation.z = -Math.PI / 2;
    dag.scaling.set(long / 1.5, across / Math.sqrt(3), 1);
    dag.position.y = -long / 3 + long * 0.1;
    dag.convertToFlatShadedMesh();
    put(dag, k % 2 ? dark : light, seat);
  }
  // the brown strap belt round the waist, its buckle loop at the front and the tongue hanging from it
  const strapMat = mf.get("cloth", FARMER_STRAP, { emissiveIntensity: S.glow });
  const strapTall = thigh * S.strap;
  const strap = put(MeshBuilder.CreateCylinder("farmerStrap", { height: strapTall, diameter: size.x * 2 * SKIRT_WAIST * S.strapProud, tessellation: 8 }, scene), strapMat, body.hip);
  strap.scaling.z = depthScale;
  strap.position.y = waistY - strapTall * 0.5;
  strap.convertToFlatShadedMesh();
  const front = size.x * SKIRT_WAIST * S.strapProud * depthScale;
  const loop = put(MeshBuilder.CreateTorus("farmerBuckle", { diameter: strapTall * 1.3, thickness: strapTall * 0.32, tessellation: 8 }, scene), strapMat, body.hip);
  loop.rotation.x = Math.PI / 2;
  loop.position.set(size.x * 0.25, waistY - strapTall * 0.5, front + strapTall * 0.1);
  const tongueLong = thigh * S.tongue;
  const tongue = put(MeshBuilder.CreateBox("farmerStrapEnd", { width: strapTall * 0.7, height: tongueLong, depth: strapTall * 0.18 }, scene), strapMat, body.hip);
  tongue.position.set(size.x * 0.25 + strapTall * 0.4, waistY - strapTall * 0.6 - tongueLong * 0.5, front + strapTall * 0.12);
  tongue.rotation.z = 0.12;
  return added;
}

/*
 * [S] harvester's tunic trim (348; farmer.harvester.red.png, card Appearance "a team-colored ragged tunic with a beige collar that extends to their
 * shoulders ... ragged pants that is belted with a rope ... patched with two light team-colored cloths stitched together with twine"): a beige collar
 * laid over the top of the chest, a low faceted cone from round the neck out past the shoulders, its V dipping down the front; a beige rope round the
 * waist, knotted at the front with two cord ends hanging down the tunic; a light team patch on the tunic's belly and one on the right thigh, each
 * crossed with tan twine stitches at its edges. Shares of the chest (W, H, D) or the thigh: collar HARVESTER_TRIM.collar of W across at its foot,
 * .collarTall of H tall, .neck of W at its top, its V .vee of H deep; rope .rope of H thick, ends .ends of H long; patches .patch of W (belly) and of the
 * thigh's girth (leg), team lightened .light; .stitches stitches on each patch. Beige and tan self-lit (.glow) so they read light, not grey.
 */
const HARVESTER_TRIM = { collar: 1.42, collarTall: 0.26, neck: 0.56, vee: 0.3, rope: 0.055, ends: 0.42, patch: 0.3, light: 0.45, stitches: 3, glow: 0.2 };
const HARVESTER_BEIGE = new Color3(0.86, 0.76, 0.6);
const HARVESTER_ROPE = new Color3(0.8, 0.66, 0.46);
/** Dresses the harvester's tunic (spec at HARVESTER_TRIM): beige shoulder collar, rope belt, two light team patches stitched with twine. */
function dressHarvester(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const T = HARVESTER_TRIM;
  const put = (m: Mesh, mt: Material, parent: TransformNode): Mesh => {
    m.material = mt;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const top = chest.position.y + H * 0.5;
  const foot = chest.position.y - H * 0.5;
  const beige = mf.get("cloth", HARVESTER_BEIGE, { emissiveIntensity: T.glow });
  const rope = mf.get("cloth", HARVESTER_ROPE, { emissiveIntensity: T.glow });
  // the beige collar over the shoulders, a low cone round the neck
  const collarTall = H * T.collarTall;
  const collar = put(MeshBuilder.CreateCylinder("harvesterCollar", { height: collarTall, diameterTop: W * T.neck, diameterBottom: W * T.collar, tessellation: 8 }, scene), beige, body.torso);
  collar.scaling.z = (D * 1.3) / W;
  collar.position.y = top - collarTall * 0.1;
  // ...its V dipping down the front of the chest
  const vee = put(MeshBuilder.CreateDisc("harvesterCollarVee", { radius: 1, tessellation: 3, sideOrientation: Mesh.DOUBLESIDE }, scene), beige, body.torso);
  vee.rotation.z = -Math.PI / 2;
  vee.scaling.set(H * T.vee / 1.5, W * T.neck * 0.9 / Math.sqrt(3), 1);
  vee.position.set(0, top - collarTall * 0.5 - H * T.vee / 3, D * 0.5 + D * 0.04);
  // the rope round the waist, knotted at the front, two cord ends hanging
  const ropeThick = H * T.rope;
  const belt = put(MeshBuilder.CreateTorus("harvesterRope", { diameter: W * 1.08, thickness: ropeThick, tessellation: 10 }, scene), rope, body.torso);
  belt.scaling.z = (D * 1.12) / (W * 1.08);
  belt.position.y = foot + H * 0.04;
  const front = D * 0.56;
  const knot = put(MeshBuilder.CreateIcoSphere("harvesterRopeKnot", { radius: ropeThick * 1.2, subdivisions: 1, flat: true }, scene), rope, body.torso);
  knot.position.set(-W * 0.16, foot + H * 0.04, front);
  for (const [dx, lean] of [[-0.2, 0.12], [-0.1, -0.06]] as const) {
    const endLong = H * T.ends;
    const end = put(MeshBuilder.CreateCylinder("harvesterRopeEnd", { height: endLong, diameter: ropeThick * 0.8, tessellation: 5 }, scene), rope, body.torso);
    end.position.set(W * dx, foot + H * 0.04 - endLong * 0.5, front + ropeThick * 0.3);
    end.rotation.z = lean;
    const tuft = put(MeshBuilder.CreateCylinder("harvesterRopeTuft", { height: ropeThick * 1.4, diameterTop: ropeThick * 0.8, diameterBottom: ropeThick * 1.5, tessellation: 5 }, scene), rope, body.torso);
    tuft.position.set(W * dx + Math.sin(-lean) * endLong * 0.5, foot + H * 0.04 - endLong, front + ropeThick * 0.3);
  }
  // two light team patches, each stitched at its edges with tan twine
  const patchMat = mf.get("cloth", Color3.Lerp(teamColor, new Color3(1, 1, 1), T.light), { emissiveIntensity: 0.14 });
  const patchOn = (parent: TransformNode, side: number, y: number, z: number, size: number, tilt: number) => {
    const patch = put(MeshBuilder.CreateBox("harvesterPatch", { width: size, height: size * 0.9, depth: size * 0.06 }, scene), patchMat, parent);
    patch.position.set(side, y, z);
    patch.rotation.z = tilt;
    for (let k = 0; k < T.stitches; k++) {
      for (const edge of [-1, 1]) {
        const stitch = put(MeshBuilder.CreateBox("harvesterStitch", { width: size * 0.3, height: size * 0.06, depth: size * 0.04 }, scene), rope, parent);
        const along = (k - (T.stitches - 1) / 2) * size * 0.3;
        stitch.position.set(side + Math.cos(tilt) * edge * size * 0.5 - Math.sin(tilt) * along, y + Math.sin(tilt) * edge * size * 0.5 + Math.cos(tilt) * along, z + size * 0.04);
        stitch.rotation.z = tilt;
      }
    }
  };
  patchOn(body.torso, W * 0.18, foot + H * 0.32, D * 0.5 + D * 0.03, W * T.patch, 0.18);
  const thigh = body.rightUpperLeg;
  const te = thigh.getBoundingInfo().boundingBox.extendSize;
  const girth = Math.max(te.x, te.z) * 2;
  const legPatch = W * T.patch * 0.75;
  // on the thigh: the patch rides the thigh mesh, on its front face below the skirt's hem
  const legFront = te.z + girth * 0.12;
  patchOn(thigh, 0, -te.y * 0.35, legFront, Math.min(legPatch, girth * 0.95), -0.15);
  return added;
}

/*
 * [S] balloon archer's striped doublet (336; renaissance.balloon_archer.blue.png, card Appearance "a 1300s style hat and tunic that have stripes"): a team
 * doublet over the chest striped in upright tan bands all the way round (front, sides and back, so it reads from behind too); the upper arms in puffed
 * team sleeves slashed with tan panes; a brown belt round the waist; puffed team knee breeches; tan stockings to the shoe; orange-tan shoes. Tan is
 * self-lit so it stays tan. Sizes are shares of the chest (W, H, D) and of each limb's girth and length. 371: the stripes and arm puffs gave way to a solid
 * doublet with a tan placket and big slashed shoulder puffs (renaissanceDress ARCHER_FRONT).
 *   doublet ARCHER_DRESS.doublet of the chest round it; belt .belt of the chest tall; breeches .breech of the thigh's girth.
 */
const ARCHER_DRESS = { doublet: 1.1, belt: 0.12, breech: 1.45 };
const ARCHER_STOCKING = new Color3(0.66, 0.5, 0.32);
const ARCHER_BELT = new Color3(0.36, 0.17, 0.1);
const ARCHER_SHOE = new Color3(0.78, 0.36, 0.18);
/** Dresses the balloon archer (spec at ARCHER_DRESS): solid team doublet with tan placket, slashed shoulder puffs, belt, puffed breeches, tan stockings. */
function dressBalloonArcher(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const A = ARCHER_DRESS;
  const team = mf.getCloth(teamColor.scale(0.82));
  const put = (m: Mesh, mat: Material, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const waist = chest.position.y - H * 0.5;
  const dW = W * A.doublet, dD = D * A.doublet, dH = H * 0.94;
  const doublet = put(MeshBuilder.CreateBox("archerDoublet", { width: dW, height: dH, depth: dD }, scene), team, body.torso);
  doublet.position.set(0, chest.position.y - H * 0.02, 0);
  // a solid doublet: the tan placket, buttons and neck edge down its front, and the slashed shoulder puffs (371, renaissanceDress balloonArcherFront)
  added.push(...balloonArcherFront(scene, body, teamColor, { W: dW, H: dH, D: dD, y: doublet.position.y }));
  // the belt round the waist
  const belt = put(MeshBuilder.CreateBox("archerBelt", { width: dW * 1.05, height: H * A.belt, depth: dD * 1.08 }, scene), mf.getCloth(ARCHER_BELT), body.torso);
  belt.position.set(0, waist + H * A.belt * 0.5, 0);
  for (const arm of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm]) arm.material = team;
  // puffed team breeches over the thighs, and tan stockings below
  for (const leg of [body.leftUpperLeg, body.rightUpperLeg]) {
    leg.material = team;
    const e = leg.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const breech = put(MeshBuilder.CreateCylinder("archerBreech", { height: long * 0.95, diameterTop: girth * A.breech * 0.92, diameterBottom: girth * A.breech, tessellation: 8 }, scene), team, leg);
    breech.position.y = long * 0.5 - long * 0.5;
  }
  const stocking = mf.get("cloth", ARCHER_STOCKING, { emissiveIntensity: 0.22 });
  for (const shin of [body.leftLowerLeg, body.rightLowerLeg]) shin.material = stocking;
  const shoe = mf.getCloth(ARCHER_SHOE);
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = shoe;
  }
  return added;
}

/*
 * [S] plate rider (335; renaissance.jouster.blue.png / .red.png, card Appearance "Renaissance-style armor ... colored feathers depending on the team"): the
 * rider in grey plate from the neck to the feet, not plain team cloth: a rounded breastplate, a flared fauld over the hips, domed pauldrons with a lame
 * under each, dark gauntlets and sabatons; a close helm in place of a hat: a grey dome down to the brow, a grey bevor up to under the eyes, cheek and back
 * plates between, so only the face round the eyes shows through the slot; a tall team plume of stacked tufts rising off its crown. Sizes are shares of the
 * chest (W, H, D), of each arm's girth and length, and of the head's half extents (in its own frame).
 *   steel JOUSTER_STEEL, self-lit JOUSTER_GLOW (plain metal reads navy under the blue sky light); helm JOUSTER_HELM: dome .wide of the head round it, its
 *   rim .brow of the half-height over the middle, bevor's top .chin under it; plume a feather clump .clump heads across (renaissanceDress FEATHER_CLUMP, 371).
 */
const JOUSTER_STEEL = new Color3(0.5, 0.52, 0.56);
const JOUSTER_GLOW = 0.16;
const JOUSTER_HELM = { wide: 1.2, brow: 0.5, chin: -0.28, clump: 1.0 };
const JOUSTER_PLATE = { breast: 1.2, fauld: 0.3, flare: 1.3, pauldron: 2.1, lame: 1.6 };
/** Dresses the jouster's rider (spec at JOUSTER_HELM, JOUSTER_PLATE): grey plate, close helm, team plume. */
function dressJouster(scene: Scene, body: ArticulatedBody, teamColor: Color3): Mesh[] {
  const added: Mesh[] = [];
  const mf = getMaterialFactory();
  const P = JOUSTER_PLATE, J = JOUSTER_HELM;
  const put = (m: Mesh, mat: Material, parent: TransformNode): Mesh => {
    m.material = mat;
    m.convertToFlatShadedMesh();
    m.parent = parent;
    added.push(m);
    return m;
  };
  // The plate is the body's own material turned grey steel, a little self-lit
  body.bodyMaterial.baseColor = JOUSTER_STEEL;
  body.bodyMaterial.metallic = 0;
  body.bodyMaterial.roughness = 0.5;
  body.bodyMaterial.emissiveColor = JOUSTER_STEEL.scale(JOUSTER_GLOW);
  const steel = mf.get("cloth", JOUSTER_STEEL, { emissiveIntensity: JOUSTER_GLOW });
  const dark = mf.get("cloth", JOUSTER_STEEL.scale(0.62), { emissiveIntensity: JOUSTER_GLOW });
  for (const limb of [body.leftUpperArm, body.rightUpperArm, body.leftLowerArm, body.rightLowerArm, body.leftUpperLeg, body.rightUpperLeg, body.leftLowerLeg, body.rightLowerLeg]) {
    limb.material = steel;
  }
  for (const mesh of [...body.leftKnee.getChildMeshes(false), ...body.rightKnee.getChildMeshes(false)]) {
    if (/_[lr]FootM$/.test(mesh.name)) mesh.material = dark;
  }
  for (const hand of [body.leftHand, body.rightHand]) {
    for (const m of hand.getChildMeshes(true)) if (/_[lr]HandM$/.test(m.name)) m.material = dark;
  }
  const chest = body.torsoMesh;
  const ext = chest.getBoundingInfo().boundingBox.extendSize;
  const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
  const waist = chest.position.y - H * 0.5;
  // the breastplate's round over the upper chest, and the fauld flaring over the hips
  const breast = put(MeshBuilder.CreateSphere("jousterBreast", { diameterX: W * 1.04, diameterY: H * 0.72, diameterZ: D * P.breast, segments: 5 }, scene), steel, body.torso);
  breast.position.set(0, chest.position.y + H * 0.1, D * 0.06);
  const fauld = put(MeshBuilder.CreateCylinder("jousterFauld", { height: H * P.fauld, diameterTop: W * 1.06, diameterBottom: W * P.flare, tessellation: 8 }, scene), steel, body.torso);
  fauld.scaling.z = (D * 1.12) / W;
  fauld.position.y = waist - H * P.fauld * 0.3;
  // domed pauldrons over the shoulders, a lame under each
  for (const arm of [body.leftUpperArm, body.rightUpperArm]) {
    const e = arm.getBoundingInfo().boundingBox.extendSize;
    const girth = Math.max(e.x, e.z) * 2, long = e.y * 2;
    const cap = put(MeshBuilder.CreateSphere("jousterPauldron", { diameterX: girth * P.pauldron, diameterY: girth * 1.3, diameterZ: girth * P.pauldron, segments: 5, slice: 0.5 }, scene), steel, arm);
    cap.position.y = long * 0.5 - long * 0.14;
    const lame = put(MeshBuilder.CreateCylinder("jousterLame", { height: long * 0.13, diameterTop: girth * P.lame * 0.92, diameterBottom: girth * P.lame, tessellation: 7 }, scene), steel, arm);
    lame.position.y = long * 0.5 - long * 0.27;
  }
  // The close helm, in the head's own frame
  const head = body.headMesh;
  const he = head.getBoundingInfo().boundingBox.extendSize;
  const hx = he.x, hy = he.y, hz = he.z;
  const top = hy * 1.22;
  const dome = put(MeshBuilder.CreateSphere("jousterHelm", { diameterX: hx * 2 * J.wide, diameterY: (top - hy * J.brow) * 2, diameterZ: hz * 2 * J.wide, segments: 6, slice: 0.5 }, scene), steel, head);
  dome.position.y = hy * J.brow;
  const low = hy * 1.18;
  const bevor = put(MeshBuilder.CreateSphere("jousterBevor", { diameterX: hx * 2 * (J.wide - 0.04), diameterY: (low + hy * J.chin) * 2, diameterZ: hz * 2 * (J.wide + 0.06), segments: 6, slice: 0.5 }, scene), steel, head);
  bevor.rotation.x = Math.PI;
  bevor.position.set(0, hy * J.chin, hz * 0.06);
  // cheek plates and the back plate across the slot's height, so the slot is open at the face only
  const slot = hy * (J.brow - J.chin);
  for (const side of [-1, 1]) {
    const cheek = put(MeshBuilder.CreateBox("jousterCheek", { width: hx * 0.14, height: slot * 1.04, depth: hz * 1.7 }, scene), steel, head);
    cheek.position.set(side * hx * (J.wide - 0.08), hy * (J.brow + J.chin) * 0.5, -hz * 0.22);
  }
  const back = put(MeshBuilder.CreateBox("jousterHelmBack", { width: hx * 2 * (J.wide - 0.06), height: slot * 1.04, depth: hz * 0.16 }, scene), steel, head);
  back.position.set(0, hy * (J.brow + J.chin) * 0.5, -hz * (J.wide - 0.1));
  // the team plume: a packed clump of fat lumps off the crown, rising and curling back (371, renaissanceDress featherClump)
  added.push(...featherClump(scene, head, new Vector3(0, top - hy * 0.05, -hz * 0.15), hx * 2 * J.clump, teamColor, "jousterPlume"));
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
  const bone = mf.get("cloth", style.bone ?? EVIL_BONE, { emissiveIntensity: EVIL_BONE_GLOW });
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
  if (style.boneCrown) {
    // A bone band round the brow, straight spikes standing off its rim, the front one tallest
    const rx = hExt.x * 1.16, rz = face * 1.16;
    const band = MeshBuilder.CreateCylinder("monarchBand", { height: headSize * 0.28, diameterTop: rx * 2.08, diameterBottom: rx * 2, tessellation: 8 }, scene);
    band.scaling.z = rz / rx;
    band.rotation.y = Math.PI / 8;
    band.position.y = headSize * 0.4;
    keep(band, head, bone);
    for (const [a, tall] of MONARCH_SPIKES) {
      const h = tall * headSize;
      const spike = MeshBuilder.CreateCylinder("monarchSpike", { height: h, diameterTop: 0, diameterBottom: headSize * (tall > 1 ? 0.3 : 0.22), tessellation: 4 }, scene);
      spike.position.set(Math.sin(a) * rx * 0.92, headSize * 0.52 + h / 2, Math.cos(a) * rz * 0.92);
      spike.rotation.y = a + Math.PI / 4;
      keep(spike, head, bone);
    }
    // Bone pauldrons off the shoulders: up to the crown's height, out level, hooked down at the end, spikes along the top
    const chest = body.torsoMesh;
    const ext = chest.getBoundingInfo().boundingBox.extendSize;
    const W = ext.x * 2 * chest.scaling.x, H = ext.y * 2 * chest.scaling.y, D = ext.z * 2 * chest.scaling.z;
    const top = chest.position.y + H * 0.5;
    for (const side of [-1, 1]) {
      const cap = MeshBuilder.CreateSphere("monarchShoulder", { diameter: W * 0.46, segments: 4, slice: 0.5 }, scene);
      cap.position.set(side * W * 0.46, top - H * 0.04, 0);
      keep(cap, body.torso, bone);
      const pts = [
        new Vector3(side * W * 0.44, top, -D * 0.1),
        new Vector3(side * W * 0.62, top + H * 0.62, -D * 0.2),
        new Vector3(side * W * (0.62 + MONARCH_PAULDRON), top + H * 0.7, -D * 0.2),
        new Vector3(side * W * (0.78 + MONARCH_PAULDRON), top + H * 0.42, -D * 0.12),
      ];
      taperedPath(scene, "monarchPauldron", pts, W * MONARCH_PAULDRON_THICK, body.torso, bone, added);
      for (let k = 0; k < 3; k++) {
        const at = Vector3.Lerp(pts[1], pts[2], 0.2 + k * 0.3);
        spikeOut(scene, body.torso, at.add(new Vector3(0, W * 0.05, 0)), new Vector3(side * 0.25, 1, 0), W * 0.2, bone, added);
      }
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

/** Hangs the tribal hide tunic on a bare man (spec at TUNIC): trunk wrap below the shoulders, skirt to mid-thigh with ragged points, one strap over the right shoulder. */
function dressTribalTunic(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const hide = getMaterialFactory().get("cloth", TUNIC_COLOR, { emissiveIntensity: 0.15 });
  const trunk = body.neck.position.y;
  const thigh = Math.abs(body.leftKnee.position.y);
  const shoulderX = Math.abs(body.rightShoulder.position.x);
  const side = Math.sign(body.rightShoulder.position.x) || 1;
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const depth = chest.z * body.torsoMesh.scaling.z;
  // The trunk wrap: a faceted sleeve round the whole trunk (its bounding half widths a skin out, so no corner of the wedge pokes through), from just over the
  // waist to TUNIC.top of the trunk, a little narrower at the waist
  // Read off the trunk's own vertices in the torso joint's frame (the torso wedge and the shoulder yoke hull that is the trunk's real silhouette, each with its
  // own offset, lean and scale; bounding boxes go stale once the body builder reshapes the chest): the box they fill below the shoulders, and the widest
  // half width below the trunk's middle for the wrap's foot
  let minX = Infinity, maxXs = -Infinity, minZ = Infinity, maxZs = -Infinity, lowX = 0;
  body.torso.computeWorldMatrix(true);
  const toTorso = body.torso.getWorldMatrix().clone().invert();
  for (const part of body.torso.getChildMeshes(true).filter((m) => m === body.torsoMesh || /_yoke$/.test(m.name))) {
    const local = part.computeWorldMatrix(true).multiply(toTorso);
    const at = part.getVerticesData(VertexBuffer.PositionKind) ?? [];
    for (let v = 0; v < at.length; v += 3) {
      const p = Vector3.TransformCoordinates(new Vector3(at[v], at[v + 1], at[v + 2]), local);
      if (p.y > trunk * 0.92) continue;
      minX = Math.min(minX, p.x); maxXs = Math.max(maxXs, p.x);
      minZ = Math.min(minZ, p.z); maxZs = Math.max(maxZs, p.z);
      if (p.y < trunk * 0.45) lowX = Math.max(lowX, Math.abs(p.x));
    }
  }
  if (!Number.isFinite(minX)) { minX = -chest.x; maxXs = chest.x; minZ = -depth; maxZs = depth; }
  const midX = (minX + maxXs) * 0.5, midZ = (minZ + maxZs) * 0.5;
  const maxX = (maxXs - minX) * 0.5, maxZ = (maxZs - minZ) * 0.5;
  const halfX = maxX * 1.06;
  const halfZ = maxZ * 1.08;
  const wrapLong = trunk * (TUNIC.top + 0.04);
  // Four-sided and turned an eighth so its faces lie on the trunk's faces: the trunk is a box in section, and a round sleeve its own width left the corners out
  const SQ = Math.SQRT2;
  const wrap = MeshBuilder.CreateCylinder("tunicWrap", { height: wrapLong, diameterTop: 2 * halfX * SQ, diameterBottom: 2 * Math.max(lowX * 1.06, halfX * 0.7) * SQ, tessellation: 4 }, scene);
  wrap.rotation.y = Math.PI / 4;
  wrap.bakeCurrentTransformIntoVertices();
  wrap.scaling.z = halfZ / halfX;
  wrap.position.set(midX, wrapLong * 0.5 - trunk * 0.04, midZ);
  wrap.material = hide;
  wrap.convertToFlatShadedMesh();
  added.push(wrap);
  // The skirt: a flared faceted sleeve from the waist to mid-thigh, round the loincloth block
  const pelvis = body.hip.getChildMeshes(true).find((m) => /_pelvis$/.test(m.name));
  const pelvisHalf = pelvis ? pelvis.getBoundingInfo().boundingBox.extendSize : chest;
  const skirtTop = Math.max(halfX * 0.92, pelvisHalf.x * 1.12);
  const skirtLong = thigh * TUNIC.skirt + trunk * 0.06;
  const skirt = MeshBuilder.CreateCylinder("tunicSkirt", { height: skirtLong, diameterTop: 2 * skirtTop * SQ, diameterBottom: 2 * skirtTop * TUNIC.flare * SQ, tessellation: 4 }, scene);
  skirt.rotation.y = Math.PI / 4;
  skirt.bakeCurrentTransformIntoVertices();
  skirt.scaling.z = Math.max(halfZ, pelvisHalf.z * 1.15) / skirtTop;
  skirt.position.set(midX, trunk * 0.06 - skirtLong * 0.5, midZ);
  skirt.material = hide;
  skirt.convertToFlatShadedMesh();
  added.push(skirt);
  // Ragged hem: flat points hanging off the skirt's foot round its front, sides and back
  for (let i = 0; i < TUNIC.tatters; i++) {
    const a = (i / TUNIC.tatters) * Math.PI * 2 + 0.4;
    const point = MeshBuilder.CreateCylinder("tunicTatter", { height: thigh * 0.22, diameterTop: 0, diameterBottom: chest.x * 0.55, tessellation: 3 }, scene);
    point.scaling.z = 0.3;
    point.rotation.set(Math.PI, -a, 0);
    point.position.set(Math.sin(a) * skirtTop * TUNIC.flare * 0.92, trunk * 0.06 - skirtLong - thigh * 0.09, Math.cos(a) * skirtTop * skirt.scaling.z * TUNIC.flare * 0.92);
    point.material = hide;
    point.parent = body.torso;
    point.convertToFlatShadedMesh();
    added.push(point);
  }
  // The strap: a band over the right shoulder from the wrap's top at the chest to its top at the back
  const strapWide = shoulderX * TUNIC.strap * 2;
  const over = MeshBuilder.CreateBox("tunicStrap", { width: strapWide, height: trunk * 0.06, depth: depth * 2.5 }, scene);
  over.position.set(side * shoulderX * 0.5, trunk * 1.0, 0);
  over.material = hide;
  over.parent = body.torso;
  added.push(over);
  for (const face of [-1, 1]) {
    const drop = MeshBuilder.CreateBox("tunicStrap", { width: strapWide, height: trunk * 0.3, depth: trunk * 0.05 }, scene);
    drop.position.set(side * shoulderX * 0.5, trunk * 0.86, face * depth * 1.2);
    drop.material = hide;
    drop.parent = body.torso;
    added.push(drop);
  }
  for (const mesh of [wrap, skirt]) mesh.parent = body.torso;
  return added;
}

/** Hangs the tribal hide cape on a bare man's back (spec at HIDE_CAPE): a faceted slab from the shoulders to the thigh, pointed hem, a flap over each shoulder. */
function dressTribalCape(scene: Scene, body: ArticulatedBody): Mesh[] {
  const added: Mesh[] = [];
  const hide = getMaterialFactory().get("cloth", HIDE_CAPE_COLOR, { emissiveIntensity: 0.16 });
  const trunk = body.neck.position.y;
  const thigh = Math.abs(body.leftKnee.position.y);
  const shoulderX = Math.abs(body.rightShoulder.position.x);
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const depth = chest.z * body.torsoMesh.scaling.z;
  const top = trunk * 1.02;
  const foot = -thigh * HIDE_CAPE.drop;
  const halfWide = shoulderX * HIDE_CAPE.wide;
  const halfTall = (top - foot) * 0.5;
  const halfThick = depth * HIDE_CAPE.thick * 0.5;
  // The slab: a faceted ball pressed flat and stretched to the back's span, every vertex pushed in or out by its own share, narrower at the neck
  const slab = MeshBuilder.CreateIcoSphere("hideCape", { radius: 1, subdivisions: 1, flat: true }, scene);
  const at = slab.getVerticesData(VertexBuffer.PositionKind);
  if (at) {
    for (let v = 0; v < at.length; v += 3) {
      const seed = Math.sin(Math.round(at[v] * 89 + at[v + 1] * 53 + at[v + 2] * 37) * 311.7 + 41.3) * 43758.5453;
      const k = 1 - HIDE_CAPE.jitter + 2 * HIDE_CAPE.jitter * (seed - Math.floor(seed));
      const neckIn = 0.8 + 0.2 * (1 - (at[v + 1] + 1) * 0.5);
      at[v] = at[v] * halfWide * neckIn * k;
      at[v + 1] = Math.max(-0.9, Math.min(0.95, at[v + 1])) * halfTall;
      at[v + 2] = at[v + 2] * halfThick * k;
    }
    slab.setVerticesData(VertexBuffer.PositionKind, at);
    const normals: number[] = [];
    VertexData.ComputeNormals(at, slab.getIndices() ?? [], normals);
    slab.setVerticesData(VertexBuffer.NormalKind, normals);
    slab.refreshBoundingInfo();
  }
  slab.rotation.x = HIDE_CAPE.tilt;
  slab.position.set(0, (top + foot) * 0.5, -(depth * 1.05 + halfThick) - Math.sin(HIDE_CAPE.tilt) * halfTall * 0.5);
  slab.material = hide;
  slab.parent = body.torso;
  added.push(slab);
  // Pointed tatters hanging off the hem, tips down
  for (let i = 0; i < HIDE_CAPE.points; i++) {
    const x = ((i + 0.5) / HIDE_CAPE.points - 0.5) * 2 * halfWide * 0.85;
    const point = MeshBuilder.CreateCylinder("hideCapePoint", { height: thigh * 0.28, diameterTop: 0, diameterBottom: halfWide * 0.5, tessellation: 3 }, scene);
    point.scaling.z = 0.3;
    point.rotation.x = Math.PI;
    point.position.set(x, foot * 0.9 - thigh * 0.12, 0);
    point.material = hide;
    point.parent = slab;
    point.convertToFlatShadedMesh();
    added.push(point);
  }
  // A pointed flap forward over each shoulder, the hide's corners falling onto the chest
  for (const side of [-1, 1]) {
    const flap = MeshBuilder.CreateCylinder("hideCapeFlap", { height: trunk * 0.4, diameterTop: 0, diameterBottom: shoulderX * 0.8, tessellation: 3 }, scene);
    flap.scaling.z = 0.3;
    flap.rotation.set(Math.PI - 0.45, 0, side * 0.15);
    flap.position.set(side * shoulderX * 0.75, trunk * 0.92, depth * 0.55);
    flap.material = hide;
    flap.parent = body.torso;
    flap.convertToFlatShadedMesh();
    added.push(flap);
  }
  return added;
}
