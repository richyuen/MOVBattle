import {
  Scene, Mesh, MeshBuilder, Color3, Vector3, Quaternion, TransformNode,
  PBRMetallicRoughnessMaterial, VertexBuffer, VertexData,
} from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import type {
  AttachmentPreset, UnitVisualConfig, WeaponType, HatType, ShieldType, SpecialType, WeaponGripPreset,
} from "./unitVisuals";
import { inferWeaponGripPreset, inferWeaponPresentationFamily } from "./unitVisuals";
import { getMaterialFactory, type MatCategory } from "./materialFactory";

/** Weapons are built three fifths over life size (TABS), so they still read as shapes from across the field: a quarter over, thin swords and staffs vanished at lineup distance */
const PROP_OVERSIZE = 1.6;
/** Hats are a third over: three fifths over, a bucket helm was wider than the shoulders under it */
const HAT_OVERSIZE = 1.3;
/** Cone and brim hats keep the weapons' three fifths: they sit on top of the head and not round it, and at a third over a wizard's cone and a farmer's brim were no wider than the head */
const TALL_HAT_OVERSIZE = 1.6;
const TALL_HATS: (HatType | undefined)[] = ["conical_hat", "witch_hat", "straw_hat", "cowboy_hat", "tricorn", "pirate_hat", "captain_hat", "jester_cap"];
/*
 * Soft hats fitted to the head (rebuilt 233). Spec, read off the reference:
 *   tabs_screenshot_05: the cowboy's brim is about 2 to 2.5 heads across and sits low, the crown pulled down over the skull, the face and its bead eyes in full
 *   view under it. tabs_screenshot_06: helms and caps seated down to the brow line, never perched on the crown. tabs_screenshot_04: the bead eyes always read
 *   under the head line.
 * So a soft hat is built in its wearer's head units, not the hat scale (see buildFittedHat):
 *   Seat: its lowest edge stands HAT_EYE_CLEAR of the head's height above the top of the eye (the eyes are 0.56 of the head up, EYE_OF_FACE x EYE_RIM wide),
 *   wherever that falls for this head, so it is low on the brow and the eyes stay clear.
 *   Beret: a soft disc BERET_HEADS heads across, BERET_THICK of the head high, cocked BERET_TILT to one side, its rim on the seat.
 *   Cone: a brim ring CONE_BRIM_HEADS heads across on the seat, under a cone CONE_HEADS heads across at its foot and CONE_TALL of the head high.
 */
const HEAD_FITTED_HATS: (HatType | undefined)[] = ["beret", "brim_hat", "cavalier_hat", "morion", "sallet", "feather_hat", "conical_hat", "helmet", "plume_helmet", "hood_liripipe", "hood", "viking_helmet", "horned_helmet", "bone_mask", "antler_skull", "bull_head", "crested_helm", "dragon_head", "kasa", "pointed_cowl", "sun_hat", "bandana", "tricorn", "pirate_hat"];
/*
 * A tricorn (250; units/pirate.captain: a black felt hat pulled down to the brow, its brim turned up on three sides into a triangle about two heads across,
 * one corner over the face and two behind the ears, the walls standing about half a head high; the captain's carries a white skull and crossbones on the
 * front). Not a stovepipe: the old tricorn was a box on a flat triangle and read as a black top hat at lineup range.
 *   Crown TRICORN_DOME heads across, from the seat to TRICORN_CROWN of the head over the crown; brim corners on a circle TRICORN_BRIM heads across, walls
 *   TRICORN_WALL of the head high leaning TRICORN_LEAN out; skull TRICORN_SKULL head widths across.
 */
const TRICORN_DOME = 1.12;
const TRICORN_CROWN = 0.16;
const TRICORN_BRIM = 2.3;
const TRICORN_WALL = 0.42;
const TRICORN_LEAN = 0.3;
const TRICORN_SKULL = 0.26;
/*
 * A bandana tied over the skull (249; units/secret.taekwondo, factions/secret: cloth pulled down over the whole crown to the brow, the face and bead eyes clear
 * under its edge, knotted at the nape with two short tails hanging and flaring behind). Not a halo: the old bandana was a thin ring floating at the crown, and
 * six secret bodies wore it.
 *   Wrap BANDANA_HEADS heads across, from the seat to BANDANA_CROWN of the head over the crown; knot BANDANA_KNOT head widths across at the nape; tails
 *   BANDANA_TAIL of the head long, splayed BANDANA_SPLAY apart and swept BANDANA_SWEEP back off hanging.
 */
const BANDANA_HEADS = 1.16;
const BANDANA_CROWN = 0.1;
const BANDANA_KNOT = 0.3;
const BANDANA_TAIL = 0.55;
const BANDANA_SPLAY = 0.35;
const BANDANA_SWEEP = 0.5;
/*
 * A harvester's wide felt sun hat (249; factions/farmer, the scythe woman: a brown hat pushed back off the brow, its brim about two and a half heads across,
 * a low round-topped crown with a dark band, two brown braids hanging from under the brim at the sides down to the shoulders). Not a halo: the old bandana
 * was a thin ring floating at the crown.
 *   Brim SUN_BRIM heads across, SUN_BRIM_THICK of the head thick, on the seat, tipped SUN_TIP back; crown SUN_CROWN heads across at its foot and
 *   SUN_CROWN_TALL of the head high, band SUN_BAND of the head deep; braids SUN_BRAID of the head long. Felt: brown lerped SUN_TEAM toward the team colour.
 */
const SUN_BRIM = 2.4;
const SUN_BRIM_THICK = 0.07;
const SUN_TIP = 0.16;
const SUN_CROWN = 1.15;
const SUN_CROWN_TALL = 0.55;
const SUN_BAND = 0.12;
const SUN_BRAID = 0.95;
const SUN_TEAM = 0.22;
/*
 * A farmer's pointed cowl (248; units/farmer.farmer: a cloth hood in the team colour a shade darker than the skin, wrapped round the whole head to the jaw with
 * the face and both bead eyes showing in its opening, rising off the crown into a tall stiff point about as high again as the head, raked back and bending
 * further back near its tip, a short faceted collar of the same cloth over the shoulders). Not a ball cap: the old liripipe read as a small dome at lineup range.
 *   Cowl as the fitted hood (HOOD_HEADS, HOOD_OPEN). Point: a foot COWL_FOOT heads across on the crown, a lower frustum COWL_LOWER of the head high raked
 *   COWL_RAKE back, then a tip COWL_TIP of the head high bent COWL_BEND further back. Collar COWL_COLLAR heads across, COWL_COLLAR_DEEP of the head deep.
 *   Cloth: team colour x COWL_SHADE (the accent when no team colour is given).
 */
const COWL_FOOT = 1.05;
const COWL_LOWER = 0.8;
const COWL_TIP = 0.6;
const COWL_RAKE = 0.22;
const COWL_BEND = 0.4;
const COWL_COLLAR = 2.0;
const COWL_COLLAR_DEEP = 0.42;
const COWL_SHADE = 0.78;
/*
 * A monk's kasa (247; units/dynasty.monk: a wide shallow straw cone in the accent orange, about 2.4 heads across and half a head high, pulled low over
 * the brow so the bead eyes look out from just under its rim, a darker woven band round its edge; strings of fist-sized orange prayer beads hang from
 * the neck down the chest). Not a halo: the old headband was a thin ring floating at the crown.
 *   Cone KASA_HEADS heads across at the rim, KASA_TALL of the head high, its tip KASA_TIP heads across; rim band KASA_BAND of the head deep, its lowest
 *   edge on the hat seat. Beads: KASA_BEADS beads, each KASA_BEAD of the torso across, round the neck and down the chest.
 */
const KASA_HEADS = 2.4;
const KASA_TALL = 0.55;
const KASA_TIP = 0.14;
const KASA_BAND = 0.09;
const KASA_BEADS = 11;
const KASA_BEAD = 0.16;
/*
 * A dragon-dance costume head worn over the man's (246; units/dynasty.dragon: a huge faceted head in the team colour, wider than the man's shoulders, a broad
 * blunt snout jutting forward with a dark nose pad on top, the lower jaw hanging open on a red mouth edged in orange, two big round white eyes with black
 * pupils set high on the front corners in red sockets, a tan brow ridge over them, two tan horns sweeping back off the crown, and a scalloped cloth body
 * running back from the nape). The shell covers the head, so the man's own eyes are hidden and the dragon's are the face.
 *   Shell DRAGON_SHELL heads across; snout DRAGON_SNOUT heads long; jaw dropped DRAGON_JAW_DROP open; eyes DRAGON_EYE of the width; horns DRAGON_HORN heads
 *   long, raked DRAGON_HORN_RAKE back off upright; body cloth DRAGON_TAIL heads long behind, DRAGON_SCALLOPS scallops along its ridge.
 */
const DRAGON_SHELL = 1.9;
const DRAGON_SNOUT = 0.95;
const DRAGON_JAW_DROP = 0.32;
const DRAGON_EYE = 0.5;
const DRAGON_HORN = 1.25;
const DRAGON_HORN_RAKE = 1.05;
const DRAGON_TAIL = 2.6;
const DRAGON_SCALLOPS = 7;
/*
 * A bull's head in place of the man's (243; units/ancient.minotaur: a long hide head, brow to muzzle about 1.4 of its width, the muzzle jutting forward and
 * down to a dark nose, two big round white eyes set wide on the front corners under a heavy brow, ears flat out to the sides, and pale horns leaving the
 * crown's sides level then sweeping up past it). The shell covers the head, so the man's own eyes are hidden and the bull's are the face.
 *   Shell BULL_SHELL heads across; muzzle BULL_MUZZLE heads long, tipped BULL_MUZZLE_DIP down; eyes BULL_EYE of the width; horn root BULL_HORN_ROOT and
 *   tip BULL_HORN_TIP heads long, the tip turned BULL_HORN_TURN off level toward the sky.
 */
const BULL_SHELL = 1.15;
const BULL_MUZZLE = 0.75;
const BULL_MUZZLE_DIP = 0.4;
const BULL_EYE = 0.34;
const BULL_HORN_ROOT = 0.42;
const BULL_HORN_TIP = 0.85;
const BULL_HORN_TURN = 1.05;
/*
 * A horned helm fitted to the head (241; factions/viking, units/viking.jarl: a dark iron cap domed down to the brow, two horns leaving its sides level and
 * turning up past the crown like a pair of tusks, a nose bar over the face, and a faceted orange beard chunk hanging from under the eyes to the chest). Not
 * a dish: the old helm was a sphere cap turned open side up with two cones splayed flat, a wide grey brim at eye level.
 *   Dome as the fitted helm (HELM_HEADS, HELM_CROWN). Horn: a root HORN_ROOT heads long out of the dome's side at HORN_SEAT of its height, then a tip
 *   HORN_TIP heads long turned HORN_TURN off level toward the sky. Beard: BEARD_HEADS heads across, from BEARD_TOP of the head under the crown down
 *   BEARD_LONG of the head, on the face.
 */
const HORN_ROOT = 0.32;
const HORN_TIP = 0.55;
const HORN_SEAT = 0.45;
const HORN_TURN = 1.15;
const BEARD_HEADS = 0.8;
const BEARD_TOP = 0.66;
const BEARD_LONG = 0.75;
/*
 * A hood fitted to the head (239; tabs_screenshot_04/05: a hood is cloth round the whole head, the face showing in its opening, falling to the shoulders): a cowl
 * shell HOOD_HEADS heads across round the skull, open at the face (HOOD_OPEN of its round), its crown drawn up into a short peak tipped back, a mantle flaring from
 * the neck over the shoulders to HOOD_MANTLE_HEADS across, and the liripipe tail hanging from the peak down the back. Not a cone perched on the crown.
 * A plain hood (240; units/medieval.healer) is the same cowl, peak and mantle in a darker cloth, without the tail.
 */
const HOOD_HEADS = 1.3;
const HOOD_OPEN = 0.3;
const HOOD_MANTLE_HEADS = 2.2;
/*
 * Helms fitted to the head (237; tabs_screenshot_06: every helm a dome down over the skull to the brow, the face below it, a crest standing up on top): a dome
 * HELM_HEADS heads across from the hat seat to HELM_CROWN of the head over the crown, open at the brow so the eyes show; a plume helm carries a crest
 * PLUME_TALL of the head high running front to back on its top. Not a bowl: the old helm was a sphere cap turned open side up, a dish lying on the head.
 */
const HELM_HEADS = 1.2;
const HELM_CROWN = 0.12;
const PLUME_TALL = 0.45;
const HAT_EYE_CLEAR = 0.05;
/*
 * A crested Corinthian helm (244; units/ancient.hoplite: the helm closes over the whole head to the jaw, a T-shaped opening leaving the eyes and nose bar,
 * cheek guards down both sides of the face, a neck guard behind, and a tall crest standing on a short stalk, front to back, its top arched over the head):
 *   dome CREST_HELM_HEADS heads across; cheek guards CREST_CHEEK_DROP of the head below the seat, CREST_CHEEK_WIDE head widths each, set out past the eyes;
 *   crest CREST_TALL of the head high, CREST_LONG head widths front to back, on a stalk CREST_STALK of the head over the dome's top.
 */
const CREST_HELM_HEADS = 1.28;
const CREST_CHEEK_DROP = 0.62;
const CREST_CHEEK_WIDE = 0.24;
const CREST_TALL = 1.05;
const CREST_LONG = 1.25;
const CREST_STALK = 0.14;
// Team paint (245): the helm is the team colour with CREST_HELM_BRONZE of bronze mixed in; the crest is the team colour at CREST_HAIR_SHADE
const CREST_HELM_BRONZE = 0.18;
const CREST_HAIR_SHADE = 0.62;
// The bone skull cap (bone_mask): cranium width in heads, eye-hole width and snout length in head widths
const SKULL_HEADS = 1.25;
const SKULL_SOCKET = 0.26;
const SKULL_SNOUT = 0.45;
/*
 * The protector's skull helmet (319 [S]; units/tribal.protector, tribal.protector.png and .blue.png: a big pale faceted animal skull sat on top of the head over
 * its top half, bulging out behind and to the sides, two deep dark sockets on its front and a short flat snout over the brow): a coarse flat-faced ball
 * SKULL_FACETED.heads heads across, SKULL_FACETED.tall of the cap height above its middle, every vertex pushed in or out by its own hashed share (jitter),
 * its underside cut flat SKULL_FACETED.under of its half height below the middle and seated on the brow line; sockets SKULL_FACETED.socket head widths across
 * and sunk; a snout SKULL_FACETED.snout head widths long. Pale bone self-lit a little: the smooth cap before it went grey in the capture's shade.
 */
const SKULL_FACETED = { heads: 1.45, tall: 1.6, under: 0.7, jitter: 0.09, socket: 0.3, snout: 0.55 };
const BERET_HEADS = 2.0;
const BERET_THICK = 0.32;
const BERET_TILT = 0.22;
/*
 * A minstrel's feathered hat (264; units/medieval.bard: a soft straw-tan hat, its brim about two heads across, a low puffed crown, the whole cocked over to
 * one side and dipped at the front; a long feather in the team colour, nearly twice the head's height, standing up out of the band at the side and back,
 * raked back and curling further back toward its tip, a flat tapering vane on a darker quill). Not a beret: the old purple disc read as a cap at lineup range.
 *   Brim FEATHER_HAT_BRIM heads across, dipped FEATHER_HAT_DIP at the front and cocked FEATHER_HAT_COCK to the side; crown FEATHER_HAT_CROWN heads across,
 *   FEATHER_HAT_TALL of the head high. Felt: straw tan lerped FEATHER_HAT_TEAM toward the team colour. Feather FEATHER_LONG heads long in FEATHER_PIECES
 *   pieces, FEATHER_WIDE head widths across at its widest, raked FEATHER_RAKE back at its root and FEATHER_CURL more at each joint; team colour.
 */
const FEATHER_HAT_BRIM = 2.05;
const FEATHER_HAT_DIP = 0.14;
const FEATHER_HAT_COCK = 0.2;
const FEATHER_HAT_CROWN = 1.15;
const FEATHER_HAT_TALL = 0.5;
const FEATHER_HAT_TEAM = 0.06;
const FEATHER_HAT_STRAW = new Color3(0.8, 0.54, 0.3);
const FEATHER_LONG = 1.9;
const FEATHER_PIECES = 4;
const FEATHER_WIDE = 0.42;
const FEATHER_RAKE = 0.3;
const FEATHER_CURL = 0.22;
/*
 * A balloon archer's black felt hat (327; units/renaissance.balloon_archer: a round black hat pulled down to the brow, the bead eyes in full view under it, a
 * low rounded crown and a short brim turned down all round, about one and a half heads across). Not a beret: the archer wore a flat disc under a lilac ball.
 *   Brim: a skirt BRIM_HAT.brim heads across at its lip and BRIM_HAT.crown at its root, BRIM_HAT.drop of the head deep; crown BRIM_HAT.crown heads across,
 *   BRIM_HAT.tall of the head over the seat; felt BRIM_HAT_FELT (near-black, the tricorn's).
 */
const BRIM_HAT = { brim: 1.75, crown: 1.12, drop: 0.16, tall: 0.42 };
const BRIM_HAT_FELT = new Color3(0.11, 0.1, 0.12);
/*
 * A musketeer's morion (327; renaissance.musketeer.red.png, card Appearance: a black iron helmet, a round dome over the skull with a thin comb standing along
 * its crown front to back, and a boat-shaped brim all round, longer front to back than across, swept up to a peak at the front and at the back). Not a box:
 * the old plume helm read as a blue box on a grey brim. Dome MORION.dome heads across, MORION.tall of the head over the seat; comb MORION.comb of the head
 * high, MORION.combThick head widths thick; brim MORION.brimX heads across by MORION.brimZ front to back, its ends lifted MORION.peak of the head.
 */
const MORION = { dome: 1.18, tall: 0.3, comb: 0.22, combThick: 0.1, brimX: 1.5, brimZ: 2.05, peak: 0.3 };
const MORION_IRON = new Color3(0.12, 0.12, 0.14);
/*
 * A halberdier's sallet (328; renaissance.halberd.red.png, card Appearance "a black sallet": a black iron helm closed over the whole head from a rounded top
 * to below the chin, a little wider at its foot, a narrow slit across the eyes where the team colour shows, and a neck guard sweeping out behind and down).
 * Not a cap: the old grey helm dome read as a flat cap over a bare face. Dome SALLET.dome of the head tall, its top SALLET.crown of the head over the skull;
 * shell SALLET.heads heads across and SALLET.deep of that front to back, flaring SALLET.flare to its foot SALLET.drop of the head under the crown; slit
 * SALLET.slit of the head high, SALLET.slitDown of the head under the eye's top, SALLET.slitWide of the shell across; tail SALLET.tail head widths long,
 * dipped SALLET.dip rad. Iron the morion's near-black.
 */
const SALLET = { heads: 1.3, deep: 1.12, crown: 0.12, dome: 0.45, drop: 1.05, flare: 1.08, slit: 0.07, slitDown: 0.04, slitWide: 0.78, tail: 0.5, dip: 0.45 };
/*
 * A fencer's cavalier hat (327; renaissance.fencer.red.png, renaissance.fencer.png: a wide dark team-felt hat pulled to the brow, its brim about two and a quarter
 * heads across, turned up hard against the crown on the left side, a long pale team-coloured plume sweeping back over the turned-up side). Not a helm: the
 * old plume helm read as a grey stovepipe. Brim CAVALIER.brim heads across, CAVALIER.flap of it turned up CAVALIER.lift rad; crown CAVALIER.crown heads across,
 * CAVALIER.tall of the head high; felt the team colour at CAVALIER.shade; feather CAVALIER.feather heads long, CAVALIER.wide across, CAVALIER.pale toward white, raked CAVALIER.rake back at its root (it sweeps back, not up).
 */
const CAVALIER = { brim: 2.25, flap: 0.3, lift: 1.25, crown: 1.1, tall: 0.55, shade: 0.75, feather: 2.3, wide: 0.55, pale: 0.4, rake: 1.15 };
const CONE_BRIM_HEADS = 2.1;
const CONE_HEADS = 1.5;
const CONE_TALL = 1.05;

/*
 * The bone mage's deer skull (251; units/tribal.bone_mage): a stag's skull worn as a mask, its long muzzle running forward and down over the face, and a rack
 * of antlers far wider than the head. Read off the reference: each antler leaves the crown out and up, a main beam bending upward about 1.9 heads long in two
 * lengths, three tines off it (one forward low, one outward at the bend, a fork at the tip), the rack spanning about 3 head widths; antlers a darker brown
 * bone than the skull.
 *   DEER_MUZZLE head widths long, tipped DEER_MUZZLE_DIP below level; beam lengths DEER_BEAM (of the head height), splay DEER_SPLAY from upright; tines DEER_TINE.
 */
const DEER_MUZZLE = 0.95;
const DEER_MUZZLE_DIP = 0.7;
const DEER_BEAM = [1.05, 0.9];
const DEER_SPLAY = [0.95, 0.4];
const DEER_TINE = 0.58;
const DEER_ANTLER = new Color3(0.66, 0.5, 0.33);

function addDeerSkull(scene: Scene, skull: Mesh, snout: Mesh, W: number, H: number, tall: number, R: number, u: (v: number) => number): void {
  const bone = snout.material;
  const muzzleLong = u(DEER_MUZZLE * W);
  const muzzle = MeshBuilder.CreateCylinder("deerMuzzle", { height: muzzleLong, diameterTop: u(0.2 * W), diameterBottom: u(0.5 * W), tessellation: 6 }, scene);
  const down = Math.PI / 2 + DEER_MUZZLE_DIP;
  muzzle.rotation.x = down;
  muzzle.position.set(0, u(tall * 0.35) - Math.sin(DEER_MUZZLE_DIP) * muzzleLong * 0.5, u(R * 0.9) + Math.cos(DEER_MUZZLE_DIP) * muzzleLong * 0.5);
  muzzle.scaling.x = 1.15;
  muzzle.material = bone;
  muzzle.parent = skull;
  const antler = mat(scene, DEER_ANTLER);
  const up = Vector3.Up();
  const stick = (from: Vector3, dir: Vector3, long: number, thick: number) => {
    const d = dir.normalize();
    const m = MeshBuilder.CreateCylinder("deerAntler", { height: long, diameterTop: thick * 0.6, diameterBottom: thick, tessellation: 5 }, scene);
    m.rotationQuaternion = Quaternion.Identity();
    Quaternion.FromUnitVectorsToRef(up, d, m.rotationQuaternion);
    m.position = from.add(d.scale(long / 2));
    m.material = antler;
    m.parent = skull;
    return from.add(d.scale(long));
  };
  const thick = u(0.17 * W);
  for (const side of [-1, 1]) {
    const root = new Vector3(side * u(0.3 * W), u(tall * 0.85), u(0.05 * W));
    const dir1 = new Vector3(side * Math.sin(DEER_SPLAY[0]), Math.cos(DEER_SPLAY[0]), -0.15);
    const bend = stick(root, dir1, u(DEER_BEAM[0] * H), thick);
    const dir2 = new Vector3(side * Math.sin(DEER_SPLAY[1]), Math.cos(DEER_SPLAY[1]), -0.2);
    const tip = stick(bend, dir2, u(DEER_BEAM[1] * H), thick * 0.8);
    // Brow tine forward and up off the low beam, a tine outward at the bend, and a fork at the tip
    stick(root.add(dir1.normalize().scale(u(DEER_BEAM[0] * H * 0.35))), new Vector3(side * 0.25, 0.6, 1), u(DEER_TINE * H), thick * 0.7);
    stick(bend, new Vector3(side * 1, 0.55, 0.25), u(DEER_TINE * H), thick * 0.65);
    stick(tip, new Vector3(side * 0.6, 1, 0.35), u(DEER_TINE * 0.7 * H), thick * 0.5);
    stick(tip, new Vector3(-side * 0.15, 1, -0.3), u(DEER_TINE * 0.6 * H), thick * 0.5);
  }
}

function buildFittedHat(scene: Scene, type: HatType, head: { width: number; height: number }, unit: number, accent: Color3, teamColor?: Color3): Mesh {
  const W = head.width, H = head.height;
  // Below the crown (the head top joint) to the top of the eye, in the neck's units; the hat's seat is HAT_EYE_CLEAR of the head above that
  const eyeTop = 0.44 * H - 0.18 * W;
  const seat = -eyeTop + HAT_EYE_CLEAR * H;
  const u = (v: number) => v / unit;
  if (type === "pointed_cowl") {
    const cloth = mat(scene, teamColor ? teamColor.scale(COWL_SHADE) : accent);
    const cowl = MeshBuilder.CreateSphere("cowlShell", { diameter: 1, segments: 10, arc: 1 - HOOD_OPEN, sideOrientation: Mesh.DOUBLESIDE }, scene);
    cowl.scaling.set(u(HOOD_HEADS * W), u(1.2 * H), u(HOOD_HEADS * W));
    cowl.rotation.y = Math.PI / 2 + Math.PI * HOOD_OPEN;
    cowl.position.y = u(-0.42 * H);
    cowl.material = cloth;
    cowl.convertToFlatShadedMesh();
    // The point is built off the cowl in the head's frame (a sibling under a holder), so the cowl's squash does not bend it
    const holder = new Mesh("pointedCowl", scene);
    cowl.parent = holder;
    const lowerTall = u(COWL_LOWER * H);
    const lower = MeshBuilder.CreateCylinder("cowlPoint", { height: lowerTall, diameterTop: u(COWL_FOOT * 0.5 * W), diameterBottom: u(COWL_FOOT * W), tessellation: 7 }, scene);
    lower.setPivotPoint(new Vector3(0, -lowerTall / 2, 0));
    lower.position.set(0, u(0.02 * H) + lowerTall / 2, u(-0.05 * W));
    lower.rotation.x = -COWL_RAKE;
    lower.material = cloth;
    lower.convertToFlatShadedMesh();
    lower.parent = holder;
    const tipTall = u(COWL_TIP * H);
    const tip = MeshBuilder.CreateCylinder("cowlTip", { height: tipTall, diameterTop: 0, diameterBottom: u(COWL_FOOT * 0.5 * W), tessellation: 7 }, scene);
    tip.setPivotPoint(new Vector3(0, -tipTall / 2, 0));
    tip.position.set(0, lowerTall / 2 + tipTall / 2 - u(0.02 * H), 0);
    tip.rotation.x = -COWL_BEND;
    tip.material = cloth;
    tip.convertToFlatShadedMesh();
    tip.parent = lower;
    const collar = MeshBuilder.CreateCylinder("cowlCollar", { height: u(COWL_COLLAR_DEEP * H), diameterTop: u(0.95 * W), diameterBottom: u(COWL_COLLAR * W), tessellation: 7 }, scene);
    collar.position.y = u(-1.02 * H);
    collar.material = cloth;
    collar.convertToFlatShadedMesh();
    collar.parent = holder;
    return holder;
  }
  if (type === "tricorn" || type === "pirate_hat") {
    const felt = mat(scene, new Color3(0.11, 0.1, 0.12));
    // Crown: a low dome pulled down over the skull to the seat
    const domeTall = eyeTop - HAT_EYE_CLEAR * H + TRICORN_CROWN * H;
    const crown = MeshBuilder.CreateSphere("tricornCrown", { diameterX: u(TRICORN_DOME * W), diameterY: u(domeTall * 2), diameterZ: u(TRICORN_DOME * W * 1.05), segments: 6, slice: 0.5 }, scene);
    crown.position.y = u(seat);
    crown.material = felt;
    crown.convertToFlatShadedMesh();
    // Brim: three walls on the sides of a triangle, one corner over the brow and two behind the ears, each turned up and leaning out
    const R = TRICORN_BRIM * W * 0.5;
    const wallTall = u(TRICORN_WALL * H);
    const corners = [90, 210, 330].map((d) => (d * Math.PI) / 180);
    const plate: number[] = [0, 0, 0];
    for (const a of corners) plate.push(u(R * Math.cos(a)), 0, u(R * Math.sin(a)));
    const flat = new Mesh("tricornBrim", scene);
    const data = new VertexData();
    data.positions = plate;
    // Both windings, so the plate shows from above and below
    data.indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 0, 2, 1, 0, 3, 2, 0, 1, 3];
    data.normals = plate.map((_, k) => (k % 3 === 1 ? 1 : 0));
    data.applyToMesh(flat);
    flat.material = felt;
    flat.parent = crown;
    for (let i = 0; i < 3; i++) {
      const a = corners[i], b = corners[(i + 1) % 3];
      const ax = R * Math.cos(a), az = R * Math.sin(a), bx = R * Math.cos(b), bz = R * Math.sin(b);
      const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      const side = Math.hypot(bx - ax, bz - az);
      const wall = MeshBuilder.CreateBox("tricornWall", { width: u(side * 1.04), height: wallTall, depth: u(0.06 * W) }, scene);
      wall.setPivotPoint(new Vector3(0, -wallTall / 2, 0));
      wall.position.set(u(mx), wallTall / 2, u(mz));
      wall.rotation.y = Math.atan2(mx, mz);
      wall.rotation.x = TRICORN_LEAN;
      wall.material = felt;
      wall.parent = crown;
    }
    if (type === "pirate_hat") {
      // The captain's white skull on the front of the crown, over the brow corner
      const bone = mat(scene, new Color3(0.92, 0.9, 0.84));
      const skull = MeshBuilder.CreateSphere("tricornSkull", { diameter: u(TRICORN_SKULL * W), segments: 4 }, scene);
      skull.position.set(0, u(domeTall * 0.55), u(TRICORN_DOME * W * 0.5));
      skull.material = bone;
      skull.parent = crown;
      for (const s of [-1, 1]) {
        const bar = MeshBuilder.CreateBox("tricornBone", { width: u(TRICORN_SKULL * 1.5 * W), height: u(0.05 * W), depth: u(0.04 * W) }, scene);
        bar.position.set(0, u(domeTall * 0.55 - TRICORN_SKULL * 0.6 * W), u(TRICORN_DOME * W * 0.5));
        bar.rotation.z = s * 0.6;
        bar.material = bone;
        bar.parent = crown;
      }
    }
    return crown;
  }
  if (type === "bandana") {
    const cloth = mat(scene, accent);
    const tall = eyeTop - HAT_EYE_CLEAR * H + BANDANA_CROWN * H;
    const R = BANDANA_HEADS * W * 0.5;
    const wrap = MeshBuilder.CreateSphere("bandana", { diameterX: u(2 * R), diameterY: u(tall * 2), diameterZ: u(2 * R * 1.06), segments: 7, slice: 0.5 }, scene);
    wrap.position.y = u(seat);
    wrap.material = cloth;
    wrap.convertToFlatShadedMesh();
    // The knot at the back of the head just above the wrap's edge, and the two tails hanging from it, swept back and apart
    const knot = MeshBuilder.CreateIcoSphere("bandanaKnot", { radius: u(BANDANA_KNOT * W * 0.5), subdivisions: 1, flat: true }, scene);
    knot.position.set(0, u(tall * 0.3), -u(R * 1.02));
    knot.material = cloth;
    knot.parent = wrap;
    const tailLong = u(BANDANA_TAIL * H);
    for (const side of [-1, 1]) {
      const tail = MeshBuilder.CreateBox("bandanaTail", { width: u(0.16 * W), height: tailLong, depth: u(0.04 * W) }, scene);
      tail.setPivotPoint(new Vector3(0, tailLong / 2, 0));
      tail.position.set(side * u(0.06 * W), -tailLong / 2, -u(0.04 * W));
      tail.rotation.set(BANDANA_SWEEP, 0, side * BANDANA_SPLAY * 0.5);
      tail.material = cloth;
      tail.parent = knot;
    }
    return wrap;
  }
  if (type === "sun_hat") {
    const brown = new Color3(0.44, 0.27, 0.16);
    const felt = mat(scene, teamColor ? Color3.Lerp(brown, teamColor, SUN_TEAM) : brown);
    const brim = MeshBuilder.CreateCylinder("sunHatBrim", { height: u(SUN_BRIM_THICK * H), diameter: u(SUN_BRIM * W), tessellation: 11 }, scene);
    brim.position.y = u(seat + SUN_BRIM_THICK * H * 0.5);
    brim.rotation.x = -SUN_TIP;
    brim.material = felt;
    brim.convertToFlatShadedMesh();
    // A low crown narrowing a little to a rounded top, over the skull; the band rings its foot on the brim
    const crownTall = u(SUN_CROWN_TALL * H);
    const crown = MeshBuilder.CreateCylinder("sunHatCrown", { height: crownTall, diameterTop: u(SUN_CROWN * 0.82 * W), diameterBottom: u(SUN_CROWN * W), tessellation: 9 }, scene);
    crown.position.y = crownTall * 0.5;
    crown.material = felt;
    crown.convertToFlatShadedMesh();
    crown.parent = brim;
    const top = MeshBuilder.CreateSphere("sunHatTop", { diameterX: u(SUN_CROWN * 0.82 * W), diameterY: u(0.22 * H), diameterZ: u(SUN_CROWN * 0.82 * W), segments: 5, slice: 0.5 }, scene);
    top.position.y = crownTall * 0.5;
    top.material = felt;
    top.convertToFlatShadedMesh();
    top.parent = crown;
    const band = MeshBuilder.CreateCylinder("sunHatBand", { height: u(SUN_BAND * H), diameterTop: u(SUN_CROWN * 0.97 * W), diameterBottom: u(SUN_CROWN * 1.02 * W), tessellation: 9 }, scene);
    band.position.y = u(SUN_BAND * H * 0.5 + SUN_BRIM_THICK * H * 0.5);
    band.material = mat(scene, brown.scale(0.45));
    band.convertToFlatShadedMesh();
    band.parent = brim;
    // Braids: from under the brim behind the ears, down past the jaw to the shoulders, each a stack of three faceted plaits
    const hair = mat(scene, new Color3(0.3, 0.17, 0.09));
    const braidLong = SUN_BRAID * H;
    for (const side of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        const plait = MeshBuilder.CreateIcoSphere("sunHatBraid", { radiusX: u(0.11 * W), radiusY: u(braidLong / 6 * 1.15), radiusZ: u(0.11 * W), subdivisions: 1, flat: true }, scene);
        plait.position.set(side * u(0.52 * W), u(seat - braidLong * (k + 0.5) / 3), u(-0.12 * W));
        plait.rotation.z = side * 0.08;
        plait.material = hair;
        plait.setParent(brim);
      }
    }
    return brim;
  }
  if (type === "hood_liripipe" || type === "hood") {
    const cloth = mat(scene, type === "hood" ? accent.scale(0.6) : accent);
    // The cowl round the skull, its gap turned to the face (+Z), so the eyes and the face show in the opening
    const cowl = MeshBuilder.CreateSphere("hoodCowl", { diameter: 1, segments: 12, arc: 1 - HOOD_OPEN, sideOrientation: Mesh.DOUBLESIDE }, scene);
    cowl.scaling.set(u(HOOD_HEADS * W), u(1.2 * H), u(HOOD_HEADS * W));
    cowl.rotation.y = Math.PI / 2 + Math.PI * HOOD_OPEN;
    cowl.position.y = u(-0.42 * H);
    cowl.material = cloth;
    const peak = MeshBuilder.CreateCylinder("hoodPeak", { height: u(0.45 * H), diameterTop: 0, diameterBottom: u(0.7 * W), tessellation: 10 }, scene);
    peak.position.set(0, u(0.12 * H), u(-0.12 * W));
    peak.rotation.x = -0.5;
    peak.material = cloth;
    peak.setParent(cowl);
    const mantle = MeshBuilder.CreateCylinder("hoodMantle", { height: u(0.3 * H), diameterTop: u(0.9 * W), diameterBottom: u(HOOD_MANTLE_HEADS * W), tessellation: 14 }, scene);
    mantle.position.y = u(-1.05 * H);
    mantle.material = cloth;
    mantle.setParent(cowl);
    if (type === "hood") return cowl;
    const tail = MeshBuilder.CreateBox("liripipe", { width: u(0.14 * W), height: u(0.9 * H), depth: u(0.1 * W) }, scene);
    tail.position.set(0, u(-0.3 * H), u(-0.6 * W));
    tail.rotation.x = 0.25;
    tail.material = cloth;
    tail.setParent(cowl);
    return cowl;
  }
  if (type === "viking_helmet" || type === "horned_helmet") {
    const tall = eyeTop - HAT_EYE_CLEAR * H + HELM_CROWN * H;
    const R = HELM_HEADS * W * 0.5;
    const iron = mat(scene, new Color3(0.42, 0.44, 0.5));
    const helm = MeshBuilder.CreateSphere("vhelm", { diameterX: u(2 * R), diameterY: u(tall * 2), diameterZ: u(2 * R * 1.05), segments: 8, slice: 0.5 }, scene);
    helm.position.y = u(seat);
    helm.material = iron;
    const nose = MeshBuilder.CreateBox("vhelmNose", { width: u(0.1 * W), height: u(0.32 * H), depth: u(0.06 * W) }, scene);
    nose.position.set(0, u(-0.08 * H), u(R * 1.02));
    nose.material = iron;
    nose.parent = helm;
    const bone = mat(scene, new Color3(0.93, 0.87, 0.72));
    const big = type === "horned_helmet" ? 1.15 : 1;
    for (const side of [-1, 1]) {
      // The root leaves the dome level, out to the side; the tip turns up off its end
      const root = MeshBuilder.CreateCylinder("vhornRoot", { height: u(HORN_ROOT * W * big), diameterTop: u(0.17 * W * big), diameterBottom: u(0.24 * W * big), tessellation: 6 }, scene);
      root.rotation.z = -side * Math.PI / 2;
      root.position.set(side * u(R * 0.92 + HORN_ROOT * W * big * 0.5), u(tall * HORN_SEAT), 0);
      root.material = bone;
      root.parent = helm;
      const tipLong = u(HORN_TIP * W * big);
      const tip = MeshBuilder.CreateCylinder("vhornTip", { height: tipLong, diameterTop: 0, diameterBottom: u(0.17 * W * big), tessellation: 6 }, scene);
      // In the root's frame +y runs outward and -side x is the sky: the tip's foot sits on the root's outer end, its axis turned HORN_TURN toward the sky
      const turn = side * HORN_TURN;
      tip.rotation.z = turn;
      tip.position.set(-Math.sin(turn) * tipLong * 0.5, u(HORN_ROOT * W * big * 0.5) + Math.cos(turn) * tipLong * 0.5, 0);
      tip.material = bone;
      tip.parent = root;
    }
    const beard = MeshBuilder.CreateCylinder("vbeard", { height: u(BEARD_LONG * H), diameterTop: u(BEARD_HEADS * W), diameterBottom: u(0.25 * W), tessellation: 5 }, scene);
    beard.scaling.z = 0.55;
    beard.position.set(0, u(-BEARD_TOP * H - BEARD_LONG * H * 0.5) - helm.position.y, u(0.4 * W));
    beard.rotation.x = -0.12;
    beard.material = mat(scene, new Color3(0.78, 0.38, 0.14));
    beard.parent = helm;
    return helm;
  }
  if (type === "bull_head") {
    const hide = mat(scene, Color3.Lerp(accent, new Color3(0.42, 0.24, 0.16), 0.55).scale(0.85));
    const snoutHide = mat(scene, Color3.Lerp(accent, new Color3(0.62, 0.42, 0.3), 0.6));
    const dark = mat(scene, new Color3(0.1, 0.07, 0.06));
    const shell = MeshBuilder.CreateSphere("bullShell", { diameterX: u(BULL_SHELL * W), diameterY: u(1.08 * H), diameterZ: u(BULL_SHELL * W * 1.05), segments: 7 }, scene);
    shell.position.y = u(-0.5 * H);
    shell.material = hide;
    // Heavy brow across the front, the eyes peering from under it
    const brow = MeshBuilder.CreateBox("bullBrow", { width: u(1.05 * W), height: u(0.16 * H), depth: u(0.35 * W) }, scene);
    brow.position.set(0, u(0.18 * H), u(0.36 * W));
    brow.rotation.x = 0.2;
    brow.material = hide;
    brow.parent = shell;
    // The muzzle: a long wedge forward and down from under the eyes to a flat dark nose with two nostrils
    const muzzleLong = u(BULL_MUZZLE * W);
    const muzzle = MeshBuilder.CreateCylinder("bullMuzzle", { height: muzzleLong, diameterTop: u(0.62 * W), diameterBottom: u(0.78 * W), tessellation: 6 }, scene);
    muzzle.rotation.x = Math.PI / 2 + BULL_MUZZLE_DIP;
    muzzle.scaling.z = 0.8;
    muzzle.position.set(0, u(-0.2 * H) - Math.sin(BULL_MUZZLE_DIP) * muzzleLong * 0.5, u(0.42 * W) + Math.cos(BULL_MUZZLE_DIP) * muzzleLong * 0.5);
    muzzle.material = snoutHide;
    muzzle.parent = shell;
    const nose = MeshBuilder.CreateCylinder("bullNose", { height: u(0.08 * W), diameter: u(0.64 * W), tessellation: 6 }, scene);
    nose.position.y = muzzleLong * 0.5;
    nose.scaling.z = 0.8;
    nose.material = mat(scene, Color3.Lerp(accent, new Color3(0.3, 0.17, 0.13), 0.7).scale(0.7));
    nose.parent = muzzle;
    for (const side of [-1, 1]) {
      const nostril = MeshBuilder.CreateCylinder("bullNostril", { height: u(0.04 * W), diameter: u(0.14 * W), tessellation: 6 }, scene);
      nostril.position.set(side * u(0.15 * W), u(0.03 * W), 0);
      nostril.material = dark;
      nostril.parent = nose;
      // Big round eyes on the front corners, turned a little outward
      const eye = MeshBuilder.CreateCylinder("bullEye", { height: u(0.05 * W), diameter: u(BULL_EYE * W), tessellation: 12 }, scene);
      eye.rotation.set(Math.PI / 2, side * 0.45, 0);
      eye.position.set(side * u(0.3 * W), u(0.02 * H), u(0.5 * W));
      eye.material = mat(scene, new Color3(0.95, 0.95, 0.92), 0.3);
      eye.parent = shell;
      const pupil = MeshBuilder.CreateCylinder("bullPupil", { height: u(0.02 * W), diameter: u(BULL_EYE * 0.5 * W), tessellation: 10 }, scene);
      pupil.position.y = u(0.03 * W);
      pupil.material = dark;
      pupil.parent = eye;
      // Ears flat out to the sides, drooping a little, below the horns
      const ear = MeshBuilder.CreateCylinder("bullEar", { height: u(0.5 * W), diameterTop: 0, diameterBottom: u(0.26 * W), tessellation: 4 }, scene);
      ear.scaling.z = 0.4;
      ear.rotation.z = -side * (Math.PI / 2 + 0.3);
      ear.position.set(side * u(0.72 * W), u(0.0 * H), u(-0.05 * W));
      ear.material = hide;
      ear.parent = shell;
      // Horns: a root out of the crown's side, level, then a tip turned up toward the sky
      const horn = mat(scene, new Color3(0.9, 0.82, 0.64), 0.15);
      const rootLong = u(BULL_HORN_ROOT * W);
      const root = MeshBuilder.CreateCylinder("bullHornRoot", { height: rootLong, diameterTop: u(0.26 * W), diameterBottom: u(0.36 * W), tessellation: 6 }, scene);
      root.rotation.z = -side * Math.PI / 2;
      root.position.set(side * (u(0.45 * W) + rootLong * 0.5), u(0.3 * H), 0);
      root.material = horn;
      root.parent = shell;
      const tipLong = u(BULL_HORN_TIP * W);
      const tip = MeshBuilder.CreateCylinder("bullHornTip", { height: tipLong, diameterTop: 0, diameterBottom: u(0.26 * W), tessellation: 6 }, scene);
      const turn = side * BULL_HORN_TURN;
      tip.rotation.set(0, 0, turn);
      tip.position.set(-Math.sin(turn) * tipLong * 0.5, rootLong * 0.5 + Math.cos(turn) * tipLong * 0.5, 0);
      tip.material = horn;
      tip.parent = root;
    }
    return shell;
  }
  if (type === "dragon_head") {
    const team = teamColor ?? accent;
    const hide = mat(scene, team.scale(0.82), 0.04);
    const deep = mat(scene, team.scale(0.5));
    const tan = mat(scene, new Color3(0.88, 0.64, 0.36), 0.08);
    const red = mat(scene, new Color3(0.62, 0.1, 0.1));
    const trim = mat(scene, new Color3(0.9, 0.48, 0.18), 0.08);
    const dark = mat(scene, new Color3(0.06, 0.05, 0.06));
    const R = DRAGON_SHELL * W * 0.5;
    const shell = MeshBuilder.CreateIcoSphere("dragonShell", { radiusX: u(R), radiusY: u(0.82 * H), radiusZ: u(R * 1.05), subdivisions: 2 }, scene);
    shell.position.set(0, u(-0.45 * H), u(0.1 * W));
    shell.material = hide;
    // The snout: a broad blunt block forward from under the eyes, its nose pad dark on top, the upper teeth along its underside
    const snoutLong = DRAGON_SNOUT * W;
    const snout = MeshBuilder.CreateIcoSphere("dragonSnout", { radiusX: u(0.68 * W), radiusY: u(0.3 * H), radiusZ: u(snoutLong * 0.55), subdivisions: 1 }, scene);
    snout.position.set(0, u(-0.12 * H), u(R * 0.75 + snoutLong * 0.35));
    snout.material = hide;
    snout.parent = shell;
    const nose = MeshBuilder.CreateIcoSphere("dragonNose", { radiusX: u(0.42 * W), radiusY: u(0.14 * H), radiusZ: u(0.24 * W), subdivisions: 1 }, scene);
    nose.position.set(0, u(0.2 * H), u(snoutLong * 0.32));
    nose.material = deep;
    nose.parent = snout;
    for (const side of [-1, 1]) {
      const nostril = MeshBuilder.CreateCylinder("dragonNostril", { height: u(0.05 * W), diameter: u(0.12 * W), tessellation: 6 }, scene);
      nostril.position.set(side * u(0.18 * W), u(0.1 * H), u(0.12 * W));
      nostril.material = dark;
      nostril.parent = nose;
    }
    // The open mouth: a red lining under the snout, and the lower jaw hinged at its back, dropped open, its rim orange with cream teeth
    const mouth = MeshBuilder.CreateBox("dragonMouth", { width: u(1.05 * W), height: u(0.2 * H), depth: u(snoutLong * 0.9) }, scene);
    mouth.position.set(0, u(-0.3 * H), u(-0.05 * W));
    mouth.material = red;
    mouth.parent = snout;
    const hinge = new TransformNode("dragonHinge", scene);
    hinge.parent = shell;
    hinge.position.set(0, u(-0.62 * H), u(R * 0.55));
    hinge.rotation.x = DRAGON_JAW_DROP;
    const jaw = MeshBuilder.CreateBox("dragonJaw", { width: u(1.15 * W), height: u(0.26 * H), depth: u(snoutLong * 1.05) }, scene);
    jaw.position.set(0, u(-0.13 * H), u(snoutLong * 0.52));
    jaw.material = hide;
    jaw.parent = hinge;
    // The jaw's top is the red mouth floor; only its front and side edges are the orange rim
    const floor = MeshBuilder.CreateBox("dragonMouthFloor", { width: u(0.95 * W), height: u(0.04 * H), depth: u(snoutLong * 0.9) }, scene);
    floor.position.set(0, u(0.14 * H), u(-0.04 * W));
    floor.material = red;
    floor.parent = jaw;
    const lip = MeshBuilder.CreateBox("dragonLip", { width: u(1.2 * W), height: u(0.1 * H), depth: u(0.14 * W) }, scene);
    lip.position.set(0, u(0.14 * H), u(snoutLong * 0.48));
    lip.material = trim;
    lip.parent = jaw;
    for (const side of [-1, 1]) {
      const rim = MeshBuilder.CreateBox("dragonLipSide", { width: u(0.1 * W), height: u(0.1 * H), depth: u(snoutLong * 1.0) }, scene);
      rim.position.set(side * u(0.55 * W), u(0.14 * H), 0);
      rim.material = trim;
      rim.parent = jaw;
    }
    const ivory = mat(scene, new Color3(0.95, 0.9, 0.78));
    for (let i = 0; i < 4; i++) {
      const x = (i - 1.5) * 0.26 * W;
      for (const [parent, y, flip] of [[jaw, 0.2 * H, 0], [mouth, -0.1 * H, Math.PI]] as const) {
        const tooth = MeshBuilder.CreateCylinder("dragonTooth", { height: u(0.16 * H), diameterTop: 0, diameterBottom: u(0.1 * W), tessellation: 4 }, scene);
        tooth.rotation.x = flip;
        tooth.position.set(u(x), u(y + (flip ? -0.06 : 0.06) * H), u(snoutLong * 0.42));
        tooth.material = ivory;
        tooth.parent = parent;
      }
    }
    for (const side of [-1, 1]) {
      // Big round eyes high on the front corners, each in a red socket under a tan brow ridge
      const socket = MeshBuilder.CreateCylinder("dragonSocket", { height: u(0.05 * W), diameter: u(DRAGON_EYE * 1.35 * W), tessellation: 10 }, scene);
      socket.rotation.set(Math.PI / 2, side * 0.5, 0);
      socket.position.set(side * u(0.5 * W), u(0.22 * H), u(R * 0.86));
      socket.material = red;
      socket.parent = shell;
      const eye = MeshBuilder.CreateCylinder("dragonEye", { height: u(0.04 * W), diameter: u(DRAGON_EYE * W), tessellation: 14 }, scene);
      eye.position.y = u(0.035 * W);
      eye.material = mat(scene, new Color3(0.96, 0.94, 0.86), 0.35);
      eye.parent = socket;
      const pupil = MeshBuilder.CreateCylinder("dragonPupil", { height: u(0.02 * W), diameter: u(DRAGON_EYE * 0.48 * W), tessellation: 10 }, scene);
      pupil.position.set(0, u(0.03 * W), u(0.04 * W));
      pupil.material = dark;
      pupil.parent = eye;
      const brow = MeshBuilder.CreateBox("dragonBrow", { width: u(0.75 * W), height: u(0.13 * H), depth: u(0.3 * W) }, scene);
      brow.position.set(side * u(0.46 * W), u(0.5 * H), u(R * 0.78));
      brow.rotation.set(0.25, side * 0.45, side * -0.3);
      brow.material = tan;
      brow.parent = shell;
      // Horns: out of the crown behind the brow, raked back and a little out, a tan cone with a kinked tip
      const horn = MeshBuilder.CreateCylinder("dragonHorn", { height: u(DRAGON_HORN * W * 0.6), diameterTop: u(0.16 * W), diameterBottom: u(0.3 * W), tessellation: 6 }, scene);
      horn.rotation.set(-DRAGON_HORN_RAKE, 0, -side * 0.3);
      horn.position.set(side * u(0.45 * W), u(0.68 * H), u(-0.05 * W));
      horn.material = tan;
      horn.parent = shell;
      const hornTip = MeshBuilder.CreateCylinder("dragonHornTip", { height: u(DRAGON_HORN * W * 0.5), diameterTop: 0, diameterBottom: u(0.16 * W), tessellation: 6 }, scene);
      hornTip.rotation.x = -0.6;
      hornTip.position.set(0, u(DRAGON_HORN * W * 0.5), u(-0.08 * W));
      hornTip.material = tan;
      hornTip.parent = horn;
      // Gold diamonds on the cheeks
      const mark = MeshBuilder.CreateBox("dragonMark", { width: u(0.14 * W), height: u(0.14 * W), depth: u(0.04 * W) }, scene);
      mark.rotation.set(0, side * 0.7, Math.PI / 4);
      mark.position.set(side * u(0.78 * W), u(-0.2 * H), u(R * 0.62));
      mark.material = tan;
      mark.parent = shell;
    }
    // The cloth body: a flat team-coloured train from the nape down the man's back, a row of deep scallops standing along its ridge
    const train = MeshBuilder.CreateBox("dragonTrain", { width: u(1.3 * W), height: u(0.08 * H), depth: u(DRAGON_TAIL * H) }, scene);
    train.rotation.x = -1.1;
    train.position.set(0, u(-0.55 * H - Math.sin(1.1) * DRAGON_TAIL * H * 0.5), u(-R * 0.7 - Math.cos(1.1) * DRAGON_TAIL * H * 0.5));
    train.material = hide;
    train.parent = shell;
    for (let i = 0; i < DRAGON_SCALLOPS; i++) {
      const t = (i + 0.5) / DRAGON_SCALLOPS;
      const scallop = MeshBuilder.CreateCylinder("dragonScallop", { height: u(0.32 * H * (1 - t * 0.4)), diameterTop: 0, diameterBottom: u(0.3 * W), tessellation: 4 }, scene);
      scallop.scaling.x = 0.35;
      scallop.position.set(0, u(0.18 * H), u((0.5 - t) * DRAGON_TAIL * H));
      scallop.material = deep;
      scallop.parent = train;
    }
    return shell;
  }
  if (type === "bone_mask") {
    // The protector's faceted skull (spec at SKULL_FACETED). Built to size in its own vertices (no scaling on the node) so the sockets, cheeks and snout hung
    // under it keep their shapes.
    const tall = eyeTop - HAT_EYE_CLEAR * H + HELM_CROWN * H;
    const Rx = SKULL_FACETED.heads * W * 0.5, Rz = Rx * 1.12, Ry = tall * SKULL_FACETED.tall;
    const under = SKULL_FACETED.under * Ry;
    const bone = mat(scene, new Color3(0.93, 0.8, 0.58), 0.18);
    const skull = MeshBuilder.CreateIcoSphere("bskull", { radius: 1, subdivisions: 2, flat: true }, scene);
    const at = skull.getVerticesData(VertexBuffer.PositionKind);
    if (at) {
      for (let v = 0; v < at.length; v += 3) {
        const k = 1 - SKULL_FACETED.jitter + 2 * SKULL_FACETED.jitter * roundBoardSeed(11.5, Math.round(at[v] * 89 + at[v + 1] * 53 + at[v + 2] * 37));
        at[v] = u(at[v] * k * Rx);
        at[v + 1] = u(Math.max(-under, at[v + 1] * k * Ry));
        at[v + 2] = u(at[v + 2] * k * Rz);
      }
      skull.setVerticesData(VertexBuffer.PositionKind, at);
      const normals: number[] = [];
      VertexData.ComputeNormals(at, skull.getIndices() ?? [], normals);
      skull.setVerticesData(VertexBuffer.NormalKind, normals);
      skull.refreshBoundingInfo();
    }
    skull.position.y = u(seat + under);
    skull.material = bone;
    const socket = mat(scene, new Color3(0.12, 0.09, 0.08));
    for (const side of [-1, 1]) {
      // A socket: a dark disc sunk into the front just above the middle, where the ball's face is, turned a little round to its own side
      const hole = MeshBuilder.CreateCylinder("bskullEye", { height: u(0.12 * W), diameter: u(SKULL_FACETED.socket * W), tessellation: 6 }, scene);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(side * u(0.3 * W), u(0.12 * Ry), u(Rz * 0.9));
      hole.rotation.y = side * 0.4;
      hole.material = socket;
      hole.parent = skull;
      const cheek = MeshBuilder.CreateBox("bskullCheek", { width: u(0.12 * W), height: u(0.45 * H), depth: u(0.3 * W) }, scene);
      cheek.position.set(side * u(Rx * 0.88), u(-under - 0.15 * H), u(0.2 * W));
      cheek.rotation.z = side * 0.12;
      cheek.material = bone;
      cheek.parent = skull;
    }
    const snoutLong = SKULL_FACETED.snout * W;
    const snout = MeshBuilder.CreateCylinder("bskullSnout", { height: u(snoutLong), diameterTop: u(0.28 * W), diameterBottom: u(0.55 * W), tessellation: 5 }, scene);
    snout.rotation.x = Math.PI / 2 - 0.2;
    snout.position.set(0, u(-0.1 * Ry), u(Rz * 0.92 + snoutLong * 0.4));
    snout.scaling.x = 1.25;
    snout.material = bone;
    snout.parent = skull;
    return skull;
  }
  if (type === "antler_skull") {
    // An animal skull worn as a cap (242 [R]; units/tribal.protector): a bone cranium SKULL_HEADS heads across seated down to the brow, two dark eye holes on
    // its front over the wearer's own eyes, a short snout jutting forward over the brow, and cheek bones down the sides of the face. The face shows under it.
    const tall = eyeTop - HAT_EYE_CLEAR * H + HELM_CROWN * H;
    const R = SKULL_HEADS * W * 0.5;
    const bone = mat(scene, new Color3(0.92, 0.76, 0.5));
    const skull = MeshBuilder.CreateSphere("bskull", { diameterX: u(2 * R), diameterY: u(tall * 2.1), diameterZ: u(2 * R * 1.1), segments: 7, slice: 0.5 }, scene);
    skull.position.y = u(seat);
    skull.material = bone;
    const socket = mat(scene, new Color3(0.12, 0.09, 0.08));
    for (const side of [-1, 1]) {
      const hole = MeshBuilder.CreateCylinder("bskullEye", { height: u(0.04 * W), diameter: u(SKULL_SOCKET * W), tessellation: 6 }, scene);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(side * u(0.24 * W), u(tall * 0.42), u(R * 1.02));
      hole.rotation.y = side * 0.35;
      hole.material = socket;
      hole.parent = skull;
      const cheek = MeshBuilder.CreateBox("bskullCheek", { width: u(0.12 * W), height: u(0.45 * H), depth: u(0.3 * W) }, scene);
      cheek.position.set(side * u(R * 0.92), u(-0.18 * H), u(0.2 * W));
      cheek.rotation.z = side * 0.12;
      cheek.material = bone;
      cheek.parent = skull;
    }
    const snout = MeshBuilder.CreateCylinder("bskullSnout", { height: u(SKULL_SNOUT * W), diameterTop: u(0.26 * W), diameterBottom: u(0.5 * W), tessellation: 6 }, scene);
    snout.rotation.x = Math.PI / 2 - 0.25;
    snout.position.set(0, u(tall * 0.2), u(R + SKULL_SNOUT * W * 0.35));
    snout.scaling.x = 1.2;
    snout.material = bone;
    snout.parent = skull;
    if (type === "antler_skull") addDeerSkull(scene, skull, snout, W, H, tall, R, u);
    return skull;
  }
  if (type === "crested_helm") {
    const tall = eyeTop - HAT_EYE_CLEAR * H + HELM_CROWN * H;
    const R = CREST_HELM_HEADS * W * 0.5;
    // The helm is painted in the team colour like the skin under it, a shade deeper, with only a touch of bronze (units/ancient.hoplite: red helm on a red
    // man); the crest is the team colour deeper still, so a blue hoplite wears a blue helm and crest and never the other side's red
    const bronzeBase = new Color3(0.74, 0.5, 0.22);
    const bronze = mat(scene, teamColor ? Color3.Lerp(teamColor, bronzeBase, CREST_HELM_BRONZE).scale(0.88) : Color3.Lerp(bronzeBase, accent, 0.2), 0.06);
    const helm = MeshBuilder.CreateSphere("chelm", { diameterX: u(2 * R), diameterY: u(tall * 2.1), diameterZ: u(2 * R * 1.08), segments: 8, slice: 0.5 }, scene);
    helm.position.y = u(seat);
    helm.material = bronze;
    // Brow band over the eyes, a nose bar down from it, cheek guards closing the sides of the face to the jaw, and a neck guard behind
    const brow = MeshBuilder.CreateBox("chelmBrow", { width: u(1.05 * W), height: u(0.1 * H), depth: u(0.2 * W) }, scene);
    brow.position.set(0, u(0.02 * H), u(R * 0.88));
    brow.material = bronze;
    brow.parent = helm;
    const nose = MeshBuilder.CreateBox("chelmNose", { width: u(0.1 * W), height: u(0.3 * H), depth: u(0.08 * W) }, scene);
    nose.position.set(0, u(-0.15 * H), u(R * 1.0));
    nose.material = bronze;
    nose.parent = helm;
    for (const side of [-1, 1]) {
      const cheek = MeshBuilder.CreateBox("chelmCheek", { width: u(CREST_CHEEK_WIDE * W), height: u(CREST_CHEEK_DROP * H), depth: u(0.75 * W) }, scene);
      cheek.position.set(side * u(R - CREST_CHEEK_WIDE * W * 0.45), u(-CREST_CHEEK_DROP * H * 0.5), u(0.12 * W));
      cheek.rotation.y = side * 0.25;
      cheek.material = bronze;
      cheek.parent = helm;
    }
    const neck = MeshBuilder.CreateBox("chelmNeck", { width: u(1.1 * W), height: u(0.5 * H), depth: u(0.16 * W) }, scene);
    neck.position.set(0, u(-0.25 * H), u(-R * 0.92));
    neck.rotation.x = -0.15;
    neck.material = bronze;
    neck.parent = helm;
    // The crest: a stalk on the dome's top and a horsehair fan on it, an ellipsoid half sunk in its base so only the arch stands
    const hair = mat(scene, teamColor ? teamColor.scale(CREST_HAIR_SHADE) : new Color3(0.62, 0.12, 0.1), 0.05);
    const stalk = MeshBuilder.CreateBox("chelmStalk", { width: u(0.1 * W), height: u(CREST_STALK * H), depth: u(0.5 * W) }, scene);
    stalk.position.y = u(tall + CREST_STALK * H * 0.4);
    stalk.material = bronze;
    stalk.parent = helm;
    const crest = MeshBuilder.CreateSphere("chelmCrest", { diameterX: u(0.26 * W), diameterY: u(CREST_TALL * H * 2), diameterZ: u(CREST_LONG * W), segments: 8, slice: 0.5 }, scene);
    crest.position.y = u(tall + CREST_STALK * H * 0.8);
    crest.material = hair;
    crest.parent = helm;
    return helm;
  }
  if (type === "helmet" || type === "plume_helmet") {
    const tall = eyeTop - HAT_EYE_CLEAR * H + HELM_CROWN * H;
    const helm = MeshBuilder.CreateSphere("helm", { diameter: 1, segments: 10, slice: 0.5 }, scene);
    helm.scaling.set(u(HELM_HEADS * W), u(tall * 2), u(HELM_HEADS * W * 1.05));
    helm.position.y = u(seat);
    helm.material = mat(scene, new Color3(0.6, 0.6, 0.65));
    if (type === "plume_helmet") {
      const crest = MeshBuilder.CreateBox("plume", { width: 1, height: 1, depth: 1 }, scene);
      crest.scaling.set(u(0.12 * W), u(PLUME_TALL * H), u(0.95 * W));
      crest.position.y = u(seat + tall + PLUME_TALL * H * 0.4);
      crest.material = mat(scene, accent, 0.1);
      crest.parent = null;
      // Both are seated on the head top joint by the caller through the helm: the crest rides on it
      crest.setParent(helm);
    }
    return helm;
  }
  if (type === "kasa") {
    // The band is the rim; the cone stands on it, both faceted and open underneath so the dark underside shows from below
    const band = MeshBuilder.CreateCylinder("kasaBand", { height: u(KASA_BAND * H), diameter: u(KASA_HEADS * W), tessellation: 16 }, scene);
    band.position.y = u(seat + KASA_BAND * H * 0.5);
    band.material = mat(scene, accent.scale(0.55));
    const cone = MeshBuilder.CreateCylinder("kasa", {
      height: u(KASA_TALL * H), diameterTop: u(KASA_TIP * W), diameterBottom: u(KASA_HEADS * W * 0.98), tessellation: 16, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    cone.position.y = u(KASA_BAND * H * 0.5 + KASA_TALL * H * 0.5);
    cone.material = mat(scene, accent);
    cone.parent = band;
    const knob = MeshBuilder.CreateSphere("kasaKnob", { diameter: u(KASA_TIP * W * 1.3), segments: 4 }, scene);
    knob.position.y = u(KASA_TALL * H * 0.5);
    knob.material = band.material;
    knob.parent = cone;
    return band;
  }
  if (type === "feather_hat" || type === "cavalier_hat") {
    // The cavalier's hat is the minstrel's hat cut wider in team felt, one side of its brim turned up against the crown (spec at CAVALIER)
    const cav = type === "cavalier_hat";
    const brimHeads = cav ? CAVALIER.brim : FEATHER_HAT_BRIM;
    const felt = cav
      ? mat(scene, (teamColor ?? accent).scale(CAVALIER.shade), 0.12)
      : mat(scene, teamColor ? Color3.Lerp(FEATHER_HAT_STRAW, teamColor, FEATHER_HAT_TEAM) : FEATHER_HAT_STRAW, 0.12);
    const brim = MeshBuilder.CreateCylinder("featherHatBrim", { height: u(0.08 * H), diameter: u(brimHeads * W), tessellation: cav ? 14 : 10, arc: cav ? 1 - CAVALIER.flap : 1, enclose: cav }, scene);
    // An arc runs clockwise from +x seen from above; turned by its own share of a half turn, its gap faces -x (the wearer's left)
    if (cav) {
      brim.rotation.y = -Math.PI * (1 - CAVALIER.flap);
      brim.bakeCurrentTransformIntoVertices();
    }
    brim.position.y = u(seat + 0.04 * H);
    brim.rotation.set(FEATHER_HAT_DIP, 0, cav ? 0 : FEATHER_HAT_COCK);
    brim.material = felt;
    brim.convertToFlatShadedMesh();
    if (cav) {
      // The turned-up side: the missing wedge of brim, hinged on the brim's middle and stood up CAVALIER.lift against the crown
      const hinge = new TransformNode("cavalierHinge", scene);
      hinge.parent = brim;
      hinge.rotation.z = -CAVALIER.lift;
      const flap = MeshBuilder.CreateCylinder("cavalierFlap", { height: u(0.08 * H), diameter: u(brimHeads * W), tessellation: 6, arc: CAVALIER.flap, enclose: true }, scene);
      flap.rotation.y = Math.PI * (1 - CAVALIER.flap);
      flap.bakeCurrentTransformIntoVertices();
      flap.material = felt;
      flap.convertToFlatShadedMesh();
      flap.parent = hinge;
    }
    // A low puffed crown over the skull, a darker band round its foot
    const crownHeads = cav ? CAVALIER.crown : FEATHER_HAT_CROWN;
    const crown = MeshBuilder.CreateSphere("featherHatCrown", { diameterX: u(crownHeads * W), diameterY: u((cav ? CAVALIER.tall : FEATHER_HAT_TALL) * H * 2), diameterZ: u(crownHeads * 0.95 * W), segments: 6, slice: 0.5 }, scene);
    crown.material = felt;
    crown.convertToFlatShadedMesh();
    crown.parent = brim;
    const band = MeshBuilder.CreateCylinder("featherHatBand", { height: u(0.12 * H), diameter: u(crownHeads * 1.01 * W), tessellation: 9 }, scene);
    band.position.y = u(0.06 * H);
    band.material = mat(scene, cav ? (teamColor ?? accent).scale(CAVALIER.shade * 0.5) : FEATHER_HAT_STRAW.scale(0.45));
    band.convertToFlatShadedMesh();
    band.parent = brim;
    // The feather: out of the band at the left side and back, a chain of flat tapering pieces, each raked further back than the one under it, its vane turned
    // half to the front so it shows broad from the front and from the side
    const plume = cav ? Color3.Lerp(teamColor ?? accent, Color3.White(), CAVALIER.pale) : teamColor ?? accent;
    const vane = mat(scene, plume, 0.15);
    const quill = mat(scene, plume.scale(0.45));
    const featherWide = cav ? CAVALIER.wide : FEATHER_WIDE;
    const pieceLong = u(((cav ? CAVALIER.feather : FEATHER_LONG) * H) / FEATHER_PIECES);
    let parent: Mesh = brim;
    for (let i = 0; i < FEATHER_PIECES; i++) {
      const t = i / FEATHER_PIECES, t1 = (i + 1) / FEATHER_PIECES;
      // Widest a third of the way up, a narrow root and a point at the tip
      const across = (k: number) => featherWide * W * Math.min(1, 0.45 + k * 1.8) * (k > 0.4 ? (1 - k) / 0.6 : 1);
      const piece = MeshBuilder.CreateCylinder("featherHatPlume", { height: pieceLong, diameterBottom: u(across(t)), diameterTop: u(Math.max(across(t1), 0.02 * W)), tessellation: 4 }, scene);
      // Flattened into the vertices, so the next piece hangs off it unsquashed
      piece.scaling.z = 0.18;
      piece.bakeCurrentTransformIntoVertices();
      piece.setPivotPoint(new Vector3(0, -pieceLong / 2, 0));
      piece.material = vane;
      piece.convertToFlatShadedMesh();
      if (i === 0) {
        piece.position.set(u(-0.5 * crownHeads * W), u(0.1 * H) + pieceLong / 2, u(-0.18 * W));
        piece.rotation.set(-(cav ? CAVALIER.rake : FEATHER_RAKE), 0.7, 0.18);
      } else {
        piece.position.y = pieceLong;
        piece.rotation.x = -FEATHER_CURL;
      }
      piece.parent = parent;
      const stem = MeshBuilder.CreateCylinder("featherHatQuill", { height: pieceLong, diameter: u(0.035 * W), tessellation: 4 }, scene);
      stem.material = quill;
      stem.parent = piece;
      parent = piece;
    }
    return brim;
  }
  if (type === "morion") {
    // The morion, built to the spec at MORION: a dome from the seat, a comb along its crown, a boat brim peaked up front and back
    const iron = mat(scene, MORION_IRON, 0.06, "metal");
    const domeTall = eyeTop - HAT_EYE_CLEAR * H + MORION.tall * H;
    const dome = MeshBuilder.CreateSphere("morionDome", { diameterX: u(MORION.dome * W), diameterY: u(domeTall * 2), diameterZ: u(MORION.dome * 1.08 * W), segments: 7, slice: 0.5 }, scene);
    dome.position.y = u(seat);
    dome.material = iron;
    dome.convertToFlatShadedMesh();
    const comb = MeshBuilder.CreateSphere("morionComb", { diameterX: u(MORION.combThick * W), diameterY: u(MORION.comb * H * 2), diameterZ: u(MORION.dome * 0.9 * W), segments: 6, slice: 0.5 }, scene);
    comb.position.y = u(domeTall * 0.82);
    comb.material = iron;
    comb.convertToFlatShadedMesh();
    comb.parent = dome;
    // The brim: a thin oval plate wider front to back than across, every point lifted by the square of how far forward or back it lies
    const brim = MeshBuilder.CreateCylinder("morionBrim", { height: u(0.05 * H), diameter: 1, tessellation: 18 }, scene);
    brim.scaling.set(u(MORION.brimX * W), 1, u(MORION.brimZ * W));
    brim.bakeCurrentTransformIntoVertices();
    const pos = brim.getVerticesData(VertexBuffer.PositionKind);
    if (pos) {
      const rz = u(MORION.brimZ * W) * 0.5;
      for (let i = 0; i < pos.length; i += 3) pos[i + 1] += u(MORION.peak * H) * (pos[i + 2] / rz) ** 2;
      brim.updateVerticesData(VertexBuffer.PositionKind, pos);
    }
    brim.position.y = u(0.02 * H);
    brim.material = iron;
    brim.convertToFlatShadedMesh();
    brim.parent = dome;
    return dome;
  }
  if (type === "sallet") {
    // The sallet, built to the spec at SALLET: a dome over a shell to below the chin, a team slit at the eyes, a neck guard behind
    const iron = mat(scene, MORION_IRON, 0.06, "metal");
    const R = SALLET.heads * W * 0.5;
    const skirtTop = SALLET.crown * H - SALLET.dome * H;
    const skirtLong = skirtTop + SALLET.drop * H;
    const dome = MeshBuilder.CreateSphere("salletDome", { diameterX: u(2 * R), diameterY: u(SALLET.dome * H * 2), diameterZ: u(2 * R * SALLET.deep), segments: 6, slice: 0.5 }, scene);
    dome.position.y = u(skirtTop);
    dome.material = iron;
    dome.convertToFlatShadedMesh();
    const shell = MeshBuilder.CreateCylinder("salletShell", { height: u(skirtLong), diameterTop: u(2 * R), diameterBottom: u(2 * R * SALLET.flare), tessellation: 12 }, scene);
    shell.scaling.z = SALLET.deep;
    shell.position.y = -u(skirtLong) * 0.5;
    shell.material = iron;
    shell.convertToFlatShadedMesh();
    shell.parent = dome;
    // The slit: a thin team band laid on the shell's front at the eyes, proud of the facets so it shows
    const slitY = -(eyeTop + SALLET.slitDown * H);
    const flareAt = 1 + (SALLET.flare - 1) * (skirtTop - slitY) / skirtLong;
    const slit = MeshBuilder.CreateBox("salletSlit", { width: u(2 * R * SALLET.slitWide), height: u(SALLET.slit * H), depth: u(0.08 * W) }, scene);
    slit.position.set(0, u(slitY - skirtTop), u(R * SALLET.deep * flareAt * 0.97));
    slit.material = mat(scene, teamColor ?? accent, 0.35);
    slit.parent = dome;
    // The neck guard: a plate hinged on the shell's back near its foot, sweeping out behind and down
    const tail = u(SALLET.tail * W);
    const guard = MeshBuilder.CreateBox("salletTail", { width: u(2 * R * 0.9), height: u(0.05 * H), depth: tail }, scene);
    guard.rotation.x = -SALLET.dip;
    guard.position.set(0, u(-skirtLong * 0.78) - tail * 0.5 * Math.sin(SALLET.dip), -u(R * SALLET.deep * 0.95) - tail * 0.5 * Math.cos(SALLET.dip));
    guard.material = iron;
    guard.convertToFlatShadedMesh();
    guard.parent = dome;
    return dome;
  }
  if (type === "brim_hat") {
    const felt = mat(scene, BRIM_HAT_FELT);
    // The crown: a dome over the skull from the seat; the brim hangs off its foot, wider at the lip, open below so the face shows
    const domeTall = eyeTop - HAT_EYE_CLEAR * H + BRIM_HAT.tall * H;
    const crown = MeshBuilder.CreateSphere("brimHatCrown", { diameterX: u(BRIM_HAT.crown * W), diameterY: u(domeTall * 2), diameterZ: u(BRIM_HAT.crown * W * 1.04), segments: 7, slice: 0.5 }, scene);
    crown.position.y = u(seat);
    crown.material = felt;
    crown.convertToFlatShadedMesh();
    const drop = u(BRIM_HAT.drop * H);
    const brim = MeshBuilder.CreateCylinder("brimHatBrim", { height: drop, diameterTop: u(BRIM_HAT.crown * 1.02 * W), diameterBottom: u(BRIM_HAT.brim * W), tessellation: 12, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, scene);
    brim.position.y = -drop * 0.5 + u(0.04 * H);
    brim.material = felt;
    brim.convertToFlatShadedMesh();
    brim.parent = crown;
    return crown;
  }
  if (type === "beret") {
    const beret = MeshBuilder.CreateSphere("beret", { diameter: 1, segments: 10 }, scene);
    beret.scaling.set(u(BERET_HEADS * W), u(BERET_THICK * H), u(BERET_HEADS * W * 0.95));
    beret.position.y = u(seat + BERET_THICK * H * 0.5);
    beret.rotation.z = BERET_TILT;
    beret.material = mat(scene, accent);
    return beret;
  }
  const brim = MeshBuilder.CreateCylinder("conehatBrim", { height: 1, diameter: 1, tessellation: 18 }, scene);
  brim.scaling.set(u(CONE_BRIM_HEADS * W), u(0.05 * H), u(CONE_BRIM_HEADS * W));
  brim.position.y = u(seat);
  brim.material = mat(scene, accent.scale(0.45));
  const cone = MeshBuilder.CreateCylinder("conehat", { height: 1, diameterTop: 0, diameterBottom: 1, tessellation: 14 }, scene);
  cone.parent = brim;
  // In the brim's scaled frame: a cone CONE_HEADS heads across standing CONE_TALL of the head high on the brim
  cone.scaling.set(CONE_HEADS / CONE_BRIM_HEADS, CONE_TALL / 0.05, CONE_HEADS / CONE_BRIM_HEADS);
  cone.position.y = 0.5 + 0.5 * CONE_TALL / 0.05;
  cone.material = mat(scene, accent.scale(0.5));
  return brim;
}

/**
 * A bomb is held in the fist, not out ahead of it on a grip cut for a haft (units/pirate.bomb_thrower: the mitt closed over the top of the ball, the fuse stub
 * out of the front): its centre BOMB_SEAT_DOWN fist widths below the wrist and BOMB_SEAT_FORWARD ahead, fuse turned forward.
 */
function seatInFist(mesh: Mesh, body: ArticulatedBody, scale: number): void {
  const w = body.metrics.hand?.width ?? 0.058 * scale;
  mesh.position.set(0, -w * BOMB_SEAT_DOWN, w * BOMB_SEAT_FORWARD);
  mesh.rotation.set(BOMB_SEAT_TURN, 0, 0);
}

/**
 * A pole built along +y from the fist with its root lifted `lift` up its own length (the halberd, the matchlock): turned about that fist point, not its middle,
 * and the fist point set on the hand mitt, so the grip preset's tilt leaves the shaft running through the fist (329: it hung ~0.4 m off the wrist).
 */
function seatPoleInFist(mesh: Mesh, body: ArticulatedBody, lift: number): void {
  const mitt = body.rightHand.getChildren().find((n): n is TransformNode => /HandM$/.test(n.name));
  mesh.setPivotPoint(new Vector3(0, -lift, 0));
  mesh.position.copyFrom(mitt?.position ?? Vector3.Zero());
  mesh.position.y += lift;
}
const SEATED_POLES = new Set<string>(["halberd"]);

export function attachProps(
  scene: Scene,
  body: ArticulatedBody,
  config: UnitVisualConfig,
  scale: number,
  teamColor?: Color3,
): Mesh[] {
  const props: Mesh[] = [];
  const accent = config.accentColor ? Color3.FromHexString(config.accentColor) : new Color3(0.5, 0.5, 0.5);

  // A sword is cut to the man who carries it: his fist and his standing height, handed over in the weapon's own units, under the oversize.
  const bladeFit: BladeFit = { fist: (body.metrics.hand?.width ?? 0.058 * scale) / PROP_OVERSIZE, stand: body.metrics.overallHeight / PROP_OVERSIZE };
  const weapon = buildWeapon(scene, config.weapon, scale, accent, bladeFit, teamColor);
  if (weapon) {
    const lift = weapon.position.y;
    weapon.parent = body.rightHand;
    weapon.scaling.scaleInPlace(PROP_OVERSIZE);
    applyWeaponGripPreset(weapon, config.weaponGripPreset ?? "default", scale);
    applyPresentationOffsets(weapon, config.weaponPositionOffset, config.weaponRotationOffset, scale);
    if (config.weapon === "bomb") seatInFist(weapon, body, scale);
    if (config.weapon && SEATED_POLES.has(config.weapon)) seatPoleInFist(weapon, body, lift);
    if (config.attachmentPreset === "fan_bearer") {
      tagVisualState(weapon, "fan_closed");
    }
    props.push(weapon);
  }

  if (config.offhandWeapon) {
    const offhand = buildWeapon(scene, config.offhandWeapon, scale, accent, bladeFit);
    if (offhand) {
      offhand.parent = body.leftHand;
      offhand.scaling.scaleInPlace(PROP_OVERSIZE);
      applyWeaponGripPreset(offhand, inferWeaponGripPreset(inferWeaponPresentationFamily(config.offhandWeapon)), scale);
      if (config.offhandWeapon === "bomb") seatInFist(offhand, body, scale);
      props.push(offhand);
    }
  }

  // A great helm is cut to the man under it and not to the hat scale: a rim 1.3 heads across but never over four fifths of the shoulders, tapered to a crown that just
  // clears the skull, and tall enough to hide the neck and sit on the shoulders. Handed over in the hat's own units, under the head-top scale and the oversize.
  const head = body.metrics.head;
  const hatUnit = body.headTop.scaling.x;
  let helmFit: HelmFit | undefined;
  if (config.hat === "great_helm" && head) {
    const rim = Math.min(head.width * 1.3, body.metrics.shoulderWidth * 0.8);
    const height = head.height * 1.06 + head.neck;
    helmFit = {
      rim: rim / (hatUnit * HAT_OVERSIZE),
      crown: rim * 0.86 / (hatUnit * HAT_OVERSIZE),
      height: height / (hatUnit * HAT_OVERSIZE),
      y: (head.height * 0.06 - height * 0.5) / hatUnit,
      slit: 0.5 - head.height * 0.5 / height,
    };
  }
  const hat = head && HEAD_FITTED_HATS.includes(config.hat)
    ? buildFittedHat(scene, config.hat, head, hatUnit, accent, teamColor)
    : buildHat(scene, config.hat, scale, accent, teamColor, helmFit);
  if (hat && head && HEAD_FITTED_HATS.includes(config.hat)) {
    hat.parent = body.headTop;
    props.push(hat);
  } else if (hat) {
    hat.parent = body.headTop;
    hat.scaling.scaleInPlace(TALL_HATS.includes(config.hat) ? TALL_HAT_OVERSIZE : HAT_OVERSIZE);
    props.push(hat);
  }

  // A kasa's prayer beads: a loop from the neck's sides down over the front of the chest, strung on the torso so they ride the chest and not the head
  if (config.hat === "kasa") {
    const chest = body.torsoMesh.getBoundingInfo().boundingBox;
    const half = chest.maximum.x, front = chest.maximum.z, base = body.torsoMesh.position;
    const neckY = body.neck.position.y;
    const bead = KASA_BEAD * half * 2;
    const beadMat = mat(scene, accent.scale(0.85));
    for (let i = 0; i < KASA_BEADS; i++) {
      const t = (i + 0.5) / KASA_BEADS;
      const around = Math.sin(Math.PI * t);
      const b = MeshBuilder.CreateIcoSphere("monkBead", { radius: bead * 0.5, subdivisions: 1 }, scene);
      b.position.set(base.x - half * 0.62 * Math.cos(Math.PI * t), neckY - (neckY - base.y) * 0.75 * around, base.z + front * (0.35 + 0.65 * Math.sqrt(around)) + bead * 0.3);
      b.material = beadMat;
      b.parent = body.torso;
      props.push(b);
    }
  }

  // Hide eyes behind face-covering headgear
  const faceCoveringHats: (HatType | undefined)[] = ["great_helm", "ninja_mask", "bull_head", "dragon_head", "sallet"];
  if (faceCoveringHats.includes(config.hat)) {
    body.leftEye?.setEnabled(false);
    body.rightEye?.setEnabled(false);
    body.leftPupil?.setEnabled(false);
    body.rightPupil?.setEnabled(false);
  }

  const shield = buildShield(scene, config.shield, scale, accent, teamColor ?? accent);
  if (shield) {
    shield.parent = body.leftHand;
    // TABS shields cover neck to knee and overlap along a line; bucklers stay small on purpose
    if (config.shield === "palette") {
      // The palette is held out flat off the hand, its face tipped up and toward the viewer, not strapped across the chest
      shield.scaling.scaleInPlace(PROP_OVERSIZE);
      shield.rotation.set(PALETTE_TIP, PALETTE_TURN, 0);
      shield.position.set(0.06 * scale, -0.02 * scale, 0.12 * scale);
    } else if (config.shield !== "buckler") {
      const round = config.shield === "round";
      shield.scaling.scaleInPlace(round ? 2.0 : 1.9);
      // A kite is shoulder-wide at the top, not a plank
      if (config.shield === "kite") shield.scaling.x *= 1.4;
      // The slab's length runs up the man, not along the forearm that carries it (a lapped board is stood up by the wall instead)
      if (config.shield === "slab") shield.rotation.x = Math.PI / 2;
      // Strapped up the forearm and carried across the chest, not dangling at the hip
      shield.position.set(0.1 * scale, (round ? 0.22 : 0.14) * scale, 0.2 * scale);
    }
    props.push(shield);
  }

  // The western rider sits a bare paint horse, not the barded charger
  const special = buildSpecial(scene, config.special, scale, accent, body, teamColor, config.materialPreset === "wildwest_leather" ? "pinto" : "barded");
  if (special) {
    props.push(special);
  }

  const extraAttachments = buildAttachmentPreset(scene, body, config.attachmentPreset ?? "none", scale, accent);
  props.push(...extraAttachments);

  // The swordcaster's lockbox comes with his ring of standing swords (units/spooky.swordcaster)
  if (config.weapon === "lockbox") props.push(buildSwordRing(scene, body) as unknown as Mesh);

  return props;
}

function tagVisualState(mesh: Mesh, key: string): void {
  mesh.metadata = { ...(mesh.metadata ?? {}), visualKey: key };
}

function setTaggedVisibility(meshes: Mesh[], visible: boolean): void {
  for (const mesh of meshes) {
    mesh.isVisible = visible;
  }
}

function mat(scene: Scene, color: Color3, emissive = 0, category: MatCategory = "wood"): PBRMetallicRoughnessMaterial {
  const mf = getMaterialFactory();
  if (emissive > 0) {
    return mf.get(category, color, { emissiveIntensity: emissive });
  }
  return mf.get(category, color);
}

/**
 * A swordcaster's sword (see SWORD_BLADE_LONG), built under `root` with its +z the point: the guard at the root, blade forward of it, grip plate and pommel
 * behind. The flying missile and the blades of his ring are this same sword.
 */
export function buildFlyingSword(scene: Scene, root: TransformNode): void {
  const glowLayer = scene.getGlowLayerByName("glow");
  const bladeMat = getMaterialFactory().get("unlit", SWORD_BLADE_COLOR, { emissive: SWORD_BLADE_COLOR });
  const hiltMat = mat(scene, SWORD_HILT_COLOR, 0.08, "stone");
  const keyMat = mat(scene, SWORD_KEY_COLOR, 0.2, "stone");
  // Built flat in x-z, then stood on edge so the blade's face (not its edge) is turned to a side-on eye
  const flat = new TransformNode("sword_flat", scene);
  flat.rotation.z = Math.PI / 2;
  flat.parent = root;
  const edge = SWORD_BLADE_LONG - SWORD_BLADE_WIDE * 1.2;
  const blade = MeshBuilder.CreateBox("sword_blade", { width: SWORD_BLADE_WIDE, height: SWORD_BLADE_WIDE * 0.22, depth: edge }, scene);
  blade.position.z = edge / 2;
  blade.material = bladeMat;
  blade.parent = flat;
  // The point: a flat four-sided taper off the blade's end
  const point = MeshBuilder.CreateCylinder("sword_point", { height: SWORD_BLADE_WIDE * 1.2, diameterTop: 0, diameterBottom: SWORD_BLADE_WIDE, tessellation: 4 }, scene);
  point.rotation.x = Math.PI / 2;
  point.scaling.set(1, 1, 0.22);
  point.position.z = edge + SWORD_BLADE_WIDE * 0.6;
  point.material = bladeMat;
  point.parent = flat;
  const guard = MeshBuilder.CreateBox("sword_guard", { width: SWORD_GUARD_WIDE, height: 0.05, depth: 0.06 }, scene);
  guard.position.z = -0.03;
  guard.material = hiltMat;
  guard.parent = flat;
  const grip = MeshBuilder.CreateBox("sword_grip", { width: 0.075, height: 0.035, depth: SWORD_GRIP_LONG }, scene);
  grip.position.z = -0.06 - SWORD_GRIP_LONG / 2;
  grip.material = hiltMat;
  grip.parent = flat;
  // The keyhole through the grip plate, both faces: a round bow over a narrow slot
  for (const face of [1, -1]) {
    const bow = MeshBuilder.CreateCylinder("sword_keyhole", { height: 0.004, diameter: 0.034, tessellation: 8 }, scene);
    bow.position.set(0, face * 0.019, -0.06 - SWORD_GRIP_LONG * 0.35);
    bow.material = keyMat;
    bow.parent = flat;
    const slot = MeshBuilder.CreateBox("sword_keyslot", { width: 0.014, height: 0.004, depth: 0.05 }, scene);
    slot.position.set(0, face * 0.019, -0.06 - SWORD_GRIP_LONG * 0.35 - 0.03);
    slot.material = keyMat;
    slot.parent = flat;
  }
  const pommel = MeshBuilder.CreateCylinder("sword_pommel", { height: 0.09, diameterTop: 0.055, diameterBottom: 0, tessellation: 5 }, scene);
  pommel.rotation.x = -Math.PI / 2;
  pommel.position.z = -0.06 - SWORD_GRIP_LONG - 0.05;
  pommel.material = keyMat;
  pommel.parent = flat;
  for (const m of [guard, grip, pommel]) glowLayer?.addExcludedMesh(m);
}

/** The swordcaster's ring of standing swords (see the [R] swordcaster-blade-ring spec): a node on his root, one "ringSword" child per blade, point up. */
function buildSwordRing(scene: Scene, body: ArticulatedBody): TransformNode {
  const tall = body.metrics.overallHeight;
  const ring = new TransformNode("swordRing", scene);
  ring.parent = body.root;
  for (let i = 0; i < SWORD_RING_COUNT; i++) {
    const a = SWORD_RING_ANGLES[i % SWORD_RING_ANGLES.length];
    const slot = new TransformNode("ringSword", scene);
    slot.parent = ring;
    const y = tall * (SWORD_RING_GUARD + SWORD_RING_STAGGER * (((i * 7) % 5) / 2 - 1));
    slot.position.set(Math.sin(a) * tall * SWORD_RING_RADIUS, y, Math.cos(a) * tall * SWORD_RING_RADIUS);
    // Point up (+z turned to +y), each at its own small lean out of true
    slot.rotation.set(-Math.PI / 2 + 0.07 * Math.sin(i * 2.3), 0, 0.08 * Math.cos(i * 1.7));
    slot.scaling.setAll((tall * SWORD_RING_BLADE) / SWORD_BLADE_LONG);
    slot.metadata = { restY: y, phase: i * 1.9, refillIn: 0 };
    buildFlyingSword(scene, slot);
  }
  return ring;
}

/**
 * A cast takes the standing sword of the ring nearest `toward` (world) out of it: that blade is hidden and its place refills after SWORD_RING_REFILL s (the
 * animator tends the ring). Returns the blade's world guard point and world size factor, where the flying sword is lifted from; null for no ring or no blade left.
 */
export function launchRingSword(body: ArticulatedBody, toward: Vector3): { at: Vector3; size: number } | null {
  const ring = body.root.getChildren().find((n): n is TransformNode => n.name === "swordRing");
  if (!ring || !ring.isEnabled()) return null;
  let best: TransformNode | null = null;
  let bestD = Infinity;
  for (const slot of ring.getChildren() as TransformNode[]) {
    if (!slot.isEnabled(false)) continue;
    slot.computeWorldMatrix(true);
    const d = Vector3.DistanceSquared(slot.getAbsolutePosition(), toward);
    if (d < bestD) { bestD = d; best = slot; }
  }
  if (!best) return null;
  const at = best.getAbsolutePosition().clone();
  const size = best.absoluteScaling.y;
  best.setEnabled(false);
  best.metadata.refillIn = SWORD_RING_REFILL;
  return { at, size };
}

function addGripWraps(
  scene: Scene,
  parent: Mesh,
  positions: number[],
  diameter: number,
): void {
  for (const posY of positions) {
    const wrap = MeshBuilder.CreateTorus("gripWrap", {
      diameter,
      thickness: diameter * 0.23,
      tessellation: 12,
    }, scene);
    wrap.position.y = posY;
    wrap.parent = parent;
    wrap.material = mat(scene, new Color3(0.3, 0.18, 0.08));
  }
}

function applyWeaponGripPreset(mesh: Mesh, preset: WeaponGripPreset, scale: number): void {
  const s = scale;
  switch (preset) {
    case "heavy_swing":
      mesh.position.addInPlace(new Vector3(0.02 * s, 0.1 * s, 0.12 * s));
      mesh.rotation.x += 0.46;
      mesh.rotation.z -= 1.08;
      break;
    case "blade_slash":
      mesh.position.addInPlace(new Vector3(0.02 * s, 0.12 * s, 0.08 * s));
      mesh.rotation.x += 0.22;
      mesh.rotation.z -= 0.24;
      break;
    case "thrust":
      mesh.position.addInPlace(new Vector3(0.01 * s, 0.14 * s, 0.22 * s));
      mesh.rotation.x += 1.24;
      mesh.rotation.z += 0.06;
      break;
    case "throw":
      mesh.position.addInPlace(new Vector3(0.02 * s, 0.12 * s, 0.14 * s));
      mesh.rotation.x += 0.58;
      mesh.rotation.z -= 0.26;
      break;
    case "bow":
      mesh.position.addInPlace(new Vector3(0.05 * s, 0.14 * s, 0.16 * s));
      mesh.rotation.x += 0.3;
      mesh.rotation.z += 0.18;
      break;
    case "crossbow":
      mesh.position.addInPlace(new Vector3(0.05 * s, 0.12 * s, 0.18 * s));
      mesh.rotation.x += 0.76;
      mesh.rotation.z += 0.08;
      break;
    case "firearm":
      mesh.position.addInPlace(new Vector3(0.04 * s, 0.12 * s, 0.24 * s));
      mesh.rotation.x += 1.16;
      mesh.rotation.z -= 0.08;
      break;
    default:
      break;
  }
}

function applyPresentationOffsets(
  mesh: Mesh,
  positionOffset: UnitVisualConfig["weaponPositionOffset"],
  rotationOffset: UnitVisualConfig["weaponRotationOffset"],
  scale: number,
): void {
  if (positionOffset) {
    mesh.position.x += (positionOffset.x ?? 0) * scale;
    mesh.position.y += (positionOffset.y ?? 0) * scale;
    mesh.position.z += (positionOffset.z ?? 0) * scale;
  }
  const rotation = rotationOffset;
  if (rotation) {
    mesh.rotation.x += rotation.rx ?? rotation.x ?? 0;
    mesh.rotation.y += rotation.ry ?? rotation.y ?? 0;
    mesh.rotation.z += rotation.rz ?? rotation.z ?? 0;
  }
}

function buildAttachmentPreset(
  scene: Scene,
  body: ArticulatedBody,
  preset: AttachmentPreset,
  s: number,
  accent: Color3,
): Mesh[] {
  const meshes: Mesh[] = [];
  const makeGlow = (name: string, diameter: number, color: Color3, parent: TransformNode, pos: Vector3, key: string): Mesh => {
    const glow = MeshBuilder.CreateSphere(name, { diameter, segments: 6 }, scene);
    glow.parent = parent;
    glow.position.copyFrom(pos);
    glow.material = mat(scene, color, 0.25);
    tagVisualState(glow, key);
    glow.isVisible = false;
    meshes.push(glow);
    return glow;
  };

  switch (preset) {
    case "none":
      return meshes;
    case "storm_halo": {
      const crown = MeshBuilder.CreateTorus("stormHalo", { diameter: 0.42 * s, thickness: 0.028 * s, tessellation: 26 }, scene);
      crown.parent = body.headTop;
      crown.position.y = 0.18 * s;
      crown.material = mat(scene, accent, 0.45);
      tagVisualState(crown, "storm_flare");
      crown.isVisible = false;
      meshes.push(crown);

      for (const side of [-1, 1]) {
        const spark = MeshBuilder.CreateBox("stormSpark", { width: 0.04 * s, height: 0.12 * s, depth: 0.04 * s }, scene);
        spark.parent = body.headTop;
        spark.position.set(side * 0.12 * s, 0.18 * s, 0.04 * s);
        spark.rotation.z = side * 0.45;
        spark.material = mat(scene, new Color3(0.9, 0.95, 1.0), 0.55);
        tagVisualState(spark, "storm_flare");
        spark.isVisible = false;
        meshes.push(spark);
      }
      return meshes;
    }
    case "crow_swarm": {
      for (const side of [-1, 1]) {
        const wing = MeshBuilder.CreatePlane("crowWing", { width: 0.18 * s, height: 0.1 * s }, scene);
        wing.parent = body.headTop;
        wing.position.set(side * 0.16 * s, 0.12 * s, 0.04 * s);
        wing.rotation.z = side * 0.55;
        wing.material = mat(scene, new Color3(0.12, 0.12, 0.14), 0.18);
        tagVisualState(wing, "crow_swarm");
        wing.isVisible = false;
        meshes.push(wing);
      }
      return meshes;
    }
    case "chrono_ring": {
      const ring = MeshBuilder.CreateTorus("chronoRing", { diameter: 0.55 * s, thickness: 0.022 * s, tessellation: 30 }, scene);
      ring.parent = body.torso;
      ring.position.set(0, 0.28 * s, 0.14 * s);
      ring.rotation.y = Math.PI / 2;
      ring.material = mat(scene, accent, 0.45);
      tagVisualState(ring, "chrono_ring");
      ring.isVisible = false;
      meshes.push(ring);
      return meshes;
    }
    case "shadow_orbit": {
      for (const side of [-1, 1]) {
        const shard = MeshBuilder.CreatePlane("shadowOrbit", { width: 0.16 * s, height: 0.2 * s }, scene);
        shard.parent = body.torso;
        shard.position.set(side * 0.24 * s, 0.2 * s, -0.06 * s);
        shard.rotation.y = side * 0.45;
        shard.material = mat(scene, new Color3(0.35, 0.28, 0.55), 0.38);
        tagVisualState(shard, "shadow_orbit");
        shard.isVisible = false;
        meshes.push(shard);
      }
      return meshes;
    }
    case "quickdraw_smoke": {
      const puff = MeshBuilder.CreateSphere("quickdrawSmoke", { diameter: 0.12 * s, segments: 6 }, scene);
      puff.parent = body.rightHand;
      puff.position.set(0.03 * s, 0.18 * s, 0.02 * s);
      puff.material = mat(scene, new Color3(0.88, 0.78, 0.52), 0.3);
      tagVisualState(puff, "quickdraw_smoke");
      puff.isVisible = false;
      meshes.push(puff);
      return meshes;
    }
    case "reaper_aura": {
      const arc = MeshBuilder.CreateDisc("reaperArc", { radius: 0.34 * s, tessellation: 24, arc: 0.45 }, scene);
      arc.parent = body.rightHand;
      arc.position.set(0.02 * s, 0.18 * s, 0.12 * s);
      arc.rotation.x = Math.PI / 2;
      arc.rotation.z = Math.PI * 0.55;
      arc.material = mat(scene, accent, 0.42);
      tagVisualState(arc, "reaper_arc");
      arc.isVisible = false;
      meshes.push(arc);

      for (const side of [-1, 1]) {
        const trail = MeshBuilder.CreatePlane("reaperTrail", { width: 0.18 * s, height: 0.28 * s }, scene);
        trail.parent = body.torso;
        trail.position.set(side * 0.22 * s, 0.18 * s, -0.12 * s);
        trail.rotation.y = side * 0.28;
        trail.material = mat(scene, accent, 0.22);
        tagVisualState(trail, "reaper_trail");
        trail.isVisible = false;
        meshes.push(trail);
      }
      return meshes;
    }
    case "super_aura": {
      const aura = MeshBuilder.CreateTorus("superAura", { diameter: 0.5 * s, thickness: 0.04 * s, tessellation: 28 }, scene);
      aura.parent = body.torso;
      aura.position.set(0, 0.26 * s, 0.06 * s);
      aura.rotation.y = Math.PI / 2;
      aura.material = mat(scene, accent, 0.5);
      tagVisualState(aura, "super_aura");
      aura.isVisible = false;
      meshes.push(aura);
      return meshes;
    }
    case "fan_bearer": {
      const openFan = MeshBuilder.CreateDisc("openFan", { radius: 0.22 * s, tessellation: 18, arc: 0.55 }, scene);
      openFan.parent = body.rightHand;
      openFan.rotation.z = Math.PI * 0.5;
      openFan.position.y = 0.12 * s;
      openFan.material = mat(scene, accent, 0.1);
      tagVisualState(openFan, "fan_open");
      openFan.isVisible = false;
      meshes.push(openFan);

      const gust = MeshBuilder.CreateTorus("gustRing", { diameter: 0.52 * s, thickness: 0.02 * s, tessellation: 24 }, scene);
      gust.parent = body.torso;
      gust.position.set(0, 0.26 * s, 0.28 * s);
      gust.rotation.y = Math.PI / 2;
      gust.material = mat(scene, accent, 0.3);
      tagVisualState(gust, "gust_ring");
      gust.isVisible = false;
      meshes.push(gust);
      return meshes;
    }
    case "bow_ready": {
      makeGlow("drawnArrow", 0.06 * s, accent.scale(1.05), body.rightHand, new Vector3(0.06 * s, 0.18 * s, 0.16 * s), "drawn_arrow");
      return meshes;
    }
    case "crossbow_ready": {
      const bolt = MeshBuilder.CreateBox("readyBolt", { width: 0.018 * s, height: 0.18 * s, depth: 0.018 * s }, scene);
      bolt.parent = body.rightHand;
      bolt.position.set(0.09 * s, 0.16 * s, 0.18 * s);
      bolt.rotation.z = Math.PI / 2;
      bolt.rotation.x = Math.PI / 2 + 0.12;
      bolt.material = mat(scene, new Color3(0.82, 0.82, 0.88));
      tagVisualState(bolt, "crossbow_bolt");
      bolt.isVisible = false;
      meshes.push(bolt);
      return meshes;
    }
    case "shouter": {
      const ring = MeshBuilder.CreateTorus("shoutRing", { diameter: 0.7 * s, thickness: 0.025 * s, tessellation: 20 }, scene);
      ring.parent = body.neck;
      ring.position.set(0, 0.08 * s, 0.18 * s);
      ring.rotation.y = Math.PI / 2;
      ring.material = mat(scene, accent, 0.35);
      tagVisualState(ring, "shout_ring");
      ring.isVisible = false;
      meshes.push(ring);
      return meshes;
    }
    case "cheerleader": {
      for (const hand of [body.leftHand, body.rightHand]) {
        const ribbon = MeshBuilder.CreateBox("streamer", { width: 0.04 * s, height: 0.12 * s, depth: 0.02 * s }, scene);
        ribbon.parent = hand;
        ribbon.position.set(0, 0.08 * s, -0.05 * s);
        ribbon.material = mat(scene, accent, 0.2);
        tagVisualState(ribbon, "pom_streamers");
        ribbon.isVisible = false;
        meshes.push(ribbon);
      }
      return meshes;
    }
    case "summoner": {
      for (const side of [-1, 1]) {
        makeGlow("summonOrb", 0.09 * s, accent, body.torso, new Vector3(side * 0.18 * s, 0.24 * s, 0.08 * s), "summon_orbs");
      }
      return meshes;
    }
    case "infernal_whip": {
      const lash = MeshBuilder.CreateCylinder("flameLash", { height: 0.28 * s, diameterTop: 0.01 * s, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
      lash.parent = body.rightHand;
      lash.position.set(0.08 * s, 0.22 * s, 0);
      lash.rotation.z = -0.7;
      lash.material = mat(scene, new Color3(1, 0.45, 0.12), 0.5);
      tagVisualState(lash, "flame_lash");
      lash.isVisible = false;
      meshes.push(lash);
      return meshes;
    }
    case "hero_halo": {
      const flare = MeshBuilder.CreateTorus("haloFlare", { diameter: 0.38 * s, thickness: 0.03 * s, tessellation: 28 }, scene);
      flare.parent = body.headTop;
      flare.position.y = 0.22 * s;
      flare.material = mat(scene, accent, 0.45);
      tagVisualState(flare, "halo_flare");
      flare.isVisible = false;
      meshes.push(flare);
      return meshes;
    }
    case "ghost_trail": {
      for (const side of [-1, 1]) {
        const trail = MeshBuilder.CreatePlane("ghostTrail", { width: 0.18 * s, height: 0.26 * s }, scene);
        trail.parent = body.torso;
        trail.position.set(side * 0.22 * s, 0.18 * s, -0.16 * s);
        trail.rotation.y = side * 0.3;
        trail.material = mat(scene, accent, 0.22);
        tagVisualState(trail, "ghost_stream");
        trail.isVisible = false;
        meshes.push(trail);
      }
      return meshes;
    }
    case "giant_aura": {
      for (const side of [-1, 1]) {
        const shard = MeshBuilder.CreateBox("giantShard", { width: 0.08 * s, height: 0.18 * s, depth: 0.05 * s }, scene);
        shard.parent = body.torso;
        shard.position.set(side * 0.28 * s, 0.24 * s, -0.04 * s);
        shard.rotation.z = side * 0.35;
        shard.material = mat(scene, accent, 0.2);
        tagVisualState(shard, "giant_shards");
        shard.isVisible = false;
        meshes.push(shard);
      }
      return meshes;
    }
    case "present_elf": {
      const sparkle = MeshBuilder.CreateSphere("presentSpark", { diameter: 0.08 * s, segments: 6 }, scene);
      sparkle.parent = body.rightHand;
      sparkle.position.set(0, 0.16 * s, 0);
      sparkle.material = mat(scene, new Color3(1, 1, 1), 0.4);
      tagVisualState(sparkle, "present_spark");
      sparkle.isVisible = false;
      meshes.push(sparkle);
      return meshes;
    }
    case "bank_robbers": {
      const loot = MeshBuilder.CreateBox("lootFlash", { width: 0.06 * s, height: 0.03 * s, depth: 0.1 * s }, scene);
      loot.parent = body.hip;
      loot.position.set(0.02 * s, 0.02 * s, -0.02 * s);
      loot.material = mat(scene, new Color3(1, 0.85, 0.35), 0.35);
      tagVisualState(loot, "loot_flash");
      loot.isVisible = false;
      meshes.push(loot);
      return meshes;
    }
    case "bomb_lit": {
      makeGlow("litFuse", 0.04 * s, new Color3(1, 0.75, 0.2), body.rightHand, new Vector3(0.02 * s, 0.18 * s, 0), "lit_fuse");
      return meshes;
    }
    case "dragon_cart_fx": {
      const glow = MeshBuilder.CreateSphere("dragonGlow", { diameter: 0.1 * s, segments: 6 }, scene);
      glow.parent = body.hip;
      glow.position.set(0, 0.02 * s, 0.28 * s);
      glow.material = mat(scene, accent, 0.35);
      tagVisualState(glow, "dragon_glow");
      glow.isVisible = false;
      meshes.push(glow);
      return meshes;
    }
    default:
      return meshes;
  }
}

// ─── Weapons ───
/** A sword is cut to the man who carries it and not to the weapon scale: his fist's width and his standing height, in the weapon's own units, under the oversize. */
interface BladeFit { fist: number; stand: number }

/**
 * A sword as a broad slab and not a sliver: the blade is a share of the man's standing height long (under half for a sword, two thirds for a greatsword), some three fists
 * across but never under a fifth nor over a quarter of its length, and a third as thick as it is wide, drawn in to a blunt point over its last fifth. The hilt is cut from
 * the fist: a bar guard twice the blade across, a grip the fist closes round, and a pommel block. Returns the blade and how far under its middle the guard sits.
 */
function buildSlabSword(scene: Scene, name: string, fit: BladeFit, accent: Color3, great: boolean): { blade: Mesh; hilt: number } {
  const length = fit.stand * (great ? 0.68 : 0.46);
  const width = Math.min(length / (great ? 5 : 4), Math.max(length / (great ? 6.5 : 5), fit.fist * 2.8));
  const depth = width * 0.3;
  const flat = length * 0.78;
  // Matte pale steel: a mirror-metal blade reflects the dark sky and ground and renders near-black
  const steel = mat(scene, new Color3(0.8, 0.8, 0.85), 0, "stone");
  const blade = MeshBuilder.CreateBox(name, { width, height: flat, depth }, scene);
  blade.material = steel;
  const point = MeshBuilder.CreateCylinder(`${name}Point`, { height: length - flat, diameterBottom: width * Math.SQRT2, diameterTop: width * 0.35 * Math.SQRT2, tessellation: 4 }, scene);
  point.rotation.y = Math.PI / 4;
  point.bakeCurrentTransformIntoVertices();
  point.scaling.z = depth / width;
  point.convertToFlatShadedMesh();
  point.position.y = length * 0.5;
  point.parent = blade;
  point.material = steel;
  // Fuller (channel groove on blade)
  const fuller = MeshBuilder.CreateBox("fuller", { width: width * 0.3, height: flat * 0.7, depth: depth * 1.15 }, scene);
  fuller.position.y = -flat * 0.08;
  fuller.parent = blade;
  fuller.material = mat(scene, new Color3(0.65, 0.65, 0.7), 0, "stone");
  const guardHeight = fit.fist * 0.7;
  const hilt = flat * 0.5 + guardHeight * 0.5;
  const guard = MeshBuilder.CreateBox("guard", { width: Math.max(width * 2, fit.fist * 5), height: guardHeight, depth: Math.max(depth * 1.5, fit.fist) }, scene);
  guard.position.y = -hilt;
  guard.parent = blade;
  guard.material = mat(scene, accent, 0, "metal");
  const gripLength = fit.fist * (great ? 3.2 : 1.7);
  const grip = MeshBuilder.CreateCylinder("grip", { height: gripLength, diameter: fit.fist * 0.6, tessellation: 6 }, scene);
  grip.position.y = -hilt - guardHeight * 0.5 - gripLength * 0.5;
  grip.parent = blade;
  grip.material = mat(scene, new Color3(0.35, 0.2, 0.1));
  const pommel = MeshBuilder.CreateBox("pommel", { size: fit.fist }, scene);
  pommel.rotation.y = Math.PI / 4;
  pommel.position.y = grip.position.y - gripLength * 0.5 - fit.fist * 0.4;
  pommel.parent = blade;
  pommel.material = mat(scene, accent, 0, "metal");
  return { blade, hilt };
}

/*
 * The giant's tree [R] (267; units/secret.tree_giant, H = the carrier's standing height, read off the reference):
 * - trunk: about 0.6 H all told, gripped TREE_CLUB_GRIP of it from the butt, so a 0.09 H stub shows behind the fist and 0.5 H runs out to the crown.
 *   It is thick, as thick as his forearm at the fist (TREE_CLUB_THICK of the trunk as radius), swelling at the broken butt and down to about half at the crown.
 * - it is gnarled and bent, not a turned pole: it bows TREE_CLUB_BEND of its length toward its far end and kinks a little at two knots along the way.
 *   The bow is built toward the trunk's own +x; the animator turns that side up (see TREE_HIP_TIP), so the trunk runs near level from the fist and rises a
 *   little into the crown (269: hung under, it carried the crown down into the grass).
 * - roots: TREE_CLUB_ROOTS short tapered roots, about 0.07 H, fanning back from the butt TREE_CLUB_ROOT_FAN off the trunk's axis like a torn root ball, all
 *   behind the fist and none square across it (that read as a sword's crossguard).
 * - one forked limb stub rising off the top of the trunk near the crown, and a knot half way out.
 * - crown: three big round olive lobes, each about 0.13 H in radius, in a triangle centred on the trunk's end: two above its line and one below,
 *   so the crown sits hip-high at his side, as high as the fist, with its bottom well clear of the grass.
 */
const TREE_CLUB_LONG = 0.6;
const TREE_CLUB_GRIP = 0.15;
const TREE_CLUB_THICK = 0.09;
const TREE_CLUB_BEND = 0.12;
const TREE_CLUB_ROOTS = 5;
const TREE_CLUB_ROOT_FAN = [0.35, 0.6];
const TREE_CLUB_CROWN = 0.25;
const TREE_CLUB_CARRY = 1.2;
const TREE_CLUB_LOBE = 0.85;
// Lobes of the crown from the trunk's end, in crown radii: along the trunk, toward its bowed (upper) side, and across it; centred on the trunk's line
const TREE_CLUB_LOBES: [number, number, number][] = [[0.35, 0.55, 0.25], [1.3, 0.3, -0.2], [0.8, -0.75, 0.1]];
// Bomb (units/pirate.bomb_thrower): across, in fists of the man holding it; its iron neck and its fuse stub, in bomb widths
const BOMB_FISTS = 2.2;
// ...and its seat in the fist (see seatInFist): down from the wrist and ahead, in fist widths; the fuse's turn forward off straight up the arm (rad)
const BOMB_SEAT_DOWN = 1.15;
const BOMB_SEAT_FORWARD = 0.35;
const BOMB_SEAT_TURN = 1.7;
const BOMB_NECK = 0.22;
const BOMB_FUSE = 0.32;
// Dynamite bundle (units/wild_west.dynamite_thrower): a hip-to-chest bundle near as wide as his torso, packed DYNAMITE_ROWS deep and DYNAMITE_COLS across,
// each stick's width and length in weapon units (s), the two black bands' height as a share of the length
const DYNAMITE_COLS = 3;
const DYNAMITE_ROWS = 2;
const DYNAMITE_STICK_WIDE = 0.075;
const DYNAMITE_LONG = 0.38;
const DYNAMITE_BAND = 0.17;
const DYNAMITE_SPARK = 0.075; // lit-fuse spark core, of s; rays 2.2x as long
const DYNAMITE_SPARK_RAYS = 6;
// The stoner's boulder (units/tribal.stoner), in prop units (x s, the man about .67 s tall): across, its height and depth as shares of that, colour
const BOULDER_WIDE = 0.3;
const BOULDER_SQUASH = { y: 0.88, z: 0.94 };
// ...and how far each vertex is pushed in or out of its chunk, as a share of its radius (tribal.stoner.blue.png: deep flat facets of unequal size)
const BOULDER_JITTER = 0.16;
// The lump is not one ball but BOULDER_CHUNKS coarse twenty-face chunks run together (centre and radius as shares of BOULDER_WIDE, each squashed its own way
// and turned its own way), so its faces come out unequal and its outline uneven; dark charcoal-brown, the darkest thing on the man
const BOULDER_CHUNKS: { at: [number, number, number]; r: number; squash: [number, number, number]; turn: [number, number, number] }[] = [
  { at: [0, 0, 0], r: 0.42, squash: [1, 0.92, 0.95], turn: [0.3, 0.2, 0.1] },
  { at: [0.2, 0.1, -0.06], r: 0.34, squash: [1.1, 0.8, 1], turn: [0.9, 1.3, 0.4] },
  { at: [-0.18, -0.1, 0.08], r: 0.3, squash: [0.95, 0.85, 1.15], turn: [1.7, 0.5, 2.1] },
];
const BOULDER_COLOR = new Color3(0.2, 0.18, 0.16);
// The swordcaster's lockbox (units/spooky.swordcaster): a chest about as wide as his torso, held across the belly in both hands; across, tall, deep (x s),
// the domed lid's share of the height, dark iron body, lighter iron bands and a pale keyhole plate on the front
const LOCKBOX_SIZE = { wide: 0.26, tall: 0.16, deep: 0.16 };
const LOCKBOX_LID = 0.35;
const LOCKBOX_IRON = new Color3(0.13, 0.14, 0.17);
const LOCKBOX_BAND = new Color3(0.32, 0.33, 0.36);
const LOCKBOX_PLATE = new Color3(0.62, 0.62, 0.6);
// A swordcaster's sword (units/spooky.swordcaster), the one that stands in his ring and the one that flies (world units, the flying size): a long straight
// glowing white blade (about 10 widths long, 4-5x the hilt below the guard), a short dark crossguard, a dark flat grip plate with a pale keyhole through it and a
// pale drop pommel
const SWORD_BLADE_LONG = 1.0;
const SWORD_BLADE_WIDE = 0.1;
const SWORD_GUARD_WIDE = 0.3;
const SWORD_GRIP_LONG = 0.22;
const SWORD_BLADE_COLOR = new Color3(0.93, 0.96, 1);
const SWORD_HILT_COLOR = new Color3(0.13, 0.14, 0.17);
const SWORD_KEY_COLOR = new Color3(0.6, 0.62, 0.66);
/*
 * [R] swordcaster-blade-ring (vfx.p). Spec read off units/spooky.swordcaster.jpg (front view, the man ~800 px tall) and factions/spooky.png:
 * - SWORD_RING_COUNT (6) swords stand round him, point up, none in front of him: three a side, from beside the hips round to behind the shoulders
 *   (SWORD_RING_ANGLES from his facing), SWORD_RING_RADIUS of his height out from his axis (the outer pair ~.55 H to the side in the shot).
 * - Each blade is SWORD_RING_BLADE of his height long (waist to over the head), the guard SWORD_RING_GUARD of his height off the ground (knee to hip in the
 *   shot), each at its own height (SWORD_RING_STAGGER) and lean, all bobbing slowly out of step: they hang in the air, not planted.
 * - A cast lifts the blade nearest the man out of the ring (it turns from point-up onto him while it hovers, then flies point first: the missile is that same
 *   sword); its place stands empty SWORD_RING_REFILL s and a new blade appears there.
 */
const SWORD_RING_COUNT = 6;
const SWORD_RING_ANGLES = [1.05, -1.05, 1.85, -1.85, 2.6, -2.6];
const SWORD_RING_RADIUS = 0.55;
const SWORD_RING_BLADE = 0.7;
const SWORD_RING_GUARD = 0.36;
const SWORD_RING_STAGGER = 0.06;
export const SWORD_RING_BOB = { height: 0.025, rate: 1.7 };
const SWORD_RING_REFILL = 1.4;
// The javelin (units/tribal.spear_thrower), in prop units (x s): shaft plus head JAVELIN_LONG, a leaf head JAVELIN_HEAD_LONG x _WIDE, barbs swept back _SWEEP rad
// The tribal club (units/tribal.clubber), in the man's heights: its length, the share of it below the fist, and the head's width (the grip is 0.056)
const CLUB_LONG = 0.6;
const CLUB_GRIP = 0.2;
const CLUB_HEAD = 0.22;
// The chieftain's stone axe (units/tribal.chieftain), in the man's heights: handle length, the share below the fist, the stone's length across the top
const AXE_LONG = 0.4;
const AXE_GRIP = 0.25;
const AXE_HEAD = 0.78;
// ...and the stone's squash off a ball of AXE_HEAD across: its height and its thickness as shares of its length (a fat stone, not a lens)
const AXE_HEAD_SQUASH = { y: 0.62, z: 0.5 };
// ...and the lashing (tribal.chieftain.red.png: twine bound tight over the stone and round the handle top, crossing in an X at the joint, hugging the
// surfaces): flat strips bedded on the chunk's broad faces, in handle lengths: each strip's width and thickness, how far its outer face stands proud of the
// chunk's face, its tilt off the handle (the two of a face tilted opposite ways so they cross), the X's centre out along the chunk from the handle, and
// how much of the chunk's jitter is kept across its thin axis (damped, so a strip can lie on the face; the long faces keep the full jitter)
const AXE_LASH = { wide: 0.055, thick: 0.06, proud: 0.012, tilt: 0.5, at: 0.1, bed: 0.35 };
// The bone mage's staff (units/tribal.bone_mage), in prop units: its length, the share of it below the fist, the skull's width (the mage's own head is about 0.14)
const BONE_STAFF_LONG = 0.62;
const BONE_STAFF_GRIP = 0.4;
const BONE_STAFF_SKULL = 0.1;
const JAVELIN_LONG = 0.4;
const JAVELIN_HEAD_LONG = 0.15;
const JAVELIN_HEAD_WIDE = 0.095;
// The spear thrower's stone leaf (tribal.spear_thrower.jpg, critic 319): a knapped slab, not a cast cone: a jittered faceted ball pressed flat to
// JAVELIN_LEAF.thick of its width, widest JAVELIN_LEAF.waist up from its root and running to a point, every vertex pushed by its own share (jitter);
// grey stone self-lit so it is not a black spot in the shade; a rope wrap of JAVELIN_LEAF.wraps turns over the socket
const JAVELIN_LEAF = { thick: 0.3, waist: 0.35, root: 0.4, jitter: 0.14, wraps: 3 };
const JAVELIN_STONE = new Color3(0.44, 0.43, 0.41);
const JAVELIN_ROPE = new Color3(0.5, 0.34, 0.2);
const JAVELIN_BARB_LONG = 0.06;
const JAVELIN_BARB_SWEEP = 0.45;
// The harpoon gun (units/pirate.harpooner): a canister about a forearm long and half as wide again as the forearm is thick; the harpoon leaves from the node named HARPOON_MUZZLE
const HARPOON_GUN_LONG = 0.24;
const HARPOON_GUN_WIDE = 0.11;
export const HARPOON_MUZZLE = "harpoonMuzzle";
/*
 * The halberd (327; renaissance.halberd.jpg: a long red-brown shaft taller than the man, at its top a dark steel head: a broad axe blade out to one side, its
 * edge bowed in an arc and its lower horn hanging below the upper, a short back spike opposite it, and a long spear point standing off the top). Not a pole:
 * the old halberd was a thin rod with a slim grey tab. Shared by every halberd and glaive. In the man's heights, the parts in shaft lengths:
 *   HALBERD.long long, HALBERD.grip of it below the fist, HALBERD.thick across; socket HALBERD.socket long; point HALBERD.point long; axe HALBERD.axe out from
 *   the shaft, HALBERD.axeTall along it at the edge and HALBERD.axeRoot at the shaft; spike HALBERD.spike out; plates HALBERD.plate thick.
 */
const HALBERD = { long: 1.3, grip: 0.3, thick: 0.02, socket: 0.1, point: 0.13, axe: 0.13, axeTall: 0.16, axeRoot: 0.07, spike: 0.07, plate: 0.012 };
const HALBERD_WOOD = new Color3(0.55, 0.3, 0.18);
const HALBERD_STEEL = new Color3(0.2, 0.21, 0.24);
/** A flat convex plate in the x-y plane, `thick` deep in z, fanned from its outline's centre and flat shaded */
function flatPlate(scene: Scene, name: string, outline: number[][], thick: number): Mesh {
  const n = outline.length;
  const cx = outline.reduce((a, p) => a + p[0], 0) / n, cy = outline.reduce((a, p) => a + p[1], 0) / n;
  const positions: number[] = [cx, cy, thick / 2, cx, cy, -thick / 2];
  for (const [x, y] of outline) positions.push(x, y, thick / 2, x, y, -thick / 2);
  const indices: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = 2 + 2 * i, b = 2 + 2 * ((i + 1) % n);
    indices.push(0, a, b, 0, b, a, 1, b + 1, a + 1, 1, a + 1, b + 1);
    indices.push(a, a + 1, b + 1, a, b + 1, b, a, b + 1, a + 1, a, b, b + 1);
  }
  const mesh = new Mesh(name, scene);
  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  const normals: number[] = [];
  VertexData.ComputeNormals(positions, indices, normals);
  data.normals = normals;
  data.applyToMesh(mesh);
  mesh.convertToFlatShadedMesh();
  return mesh;
}
/*
 * The painter's brush (327; renaissance.painter.jpg: a short one-handed brush about a forearm and a half long, a red-brown handle thin at the butt and
 * thickening to a grey ferrule, then a fat team-coloured tuft swelling out of it and running to a point; a fist's width of butt behind the hand).
 * Not a rod: the old brush ran about two thirds of the man's height and read as a musket. In the man's heights, all the parts in brush lengths:
 *   BRUSH.long long, BRUSH.grip of it below the fist; handle BRUSH.butt across at the butt to BRUSH.neck at the ferrule; ferrule from BRUSH.ferrule up,
 *   BRUSH.collar long and across; tuft swells to BRUSH.tuft across BRUSH.swell along, then a point to the tip.
 */
/*
 * A jousting lance (328; renaissance.jouster.red.png, card Appearance "spirals of the lancer's team color and white": a lance well over the rider's height,
 * thick at the hand and tapering to the tip, wound with a team stripe spiralling round a cream shaft; a grey steel cone (the vamplate) over the fist, and a
 * crown of short splayed prongs at the tip in place of a point). Not a pole: the old lance was a plain grey rod with a spear point. +y up the shaft from the
 * fist at the origin, LANCE.grip of it behind. Length LANCE.long of the man's height; shaft LANCE.thick of the length across at the hand, LANCE.taper of that
 * at the tip; stripe one turn every LANCE.pitch of the length, LANCE.stripe of the shaft's radius thick; vamplate LANCE.vamp of the length across,
 * LANCE.vampLong long; LANCE.prongs prongs LANCE.prong of the length long. Shared by every lance (the cavalry's too).
 */
const LANCE = { long: 1.75, grip: 0.14, thick: 0.045, taper: 0.45, pitch: 0.075, stripe: 0.55, vamp: 0.1, vampLong: 0.07, prongs: 3, prong: 0.03 };
const LANCE_CREAM = new Color3(0.88, 0.8, 0.62);
/*
 * A matchlock musket (328; renaissance.musketeer.red.png, card Appearance "a matchlock musket": longer than the man who carries it, a light-grey octagonal
 * barrel with a wider ring at the muzzle and a band round it, on an orange-brown wooden stock that runs under the barrel most of its length and ends behind
 * the hand in a deep butt; a dark lock and match lever at the hand). Not a rod: the old gun was a short dark stick half the man's height, the flintlock's
 * mesh grown. +y up the barrel from the fist at the origin, MUSKET.grip of the length behind it. Length MUSKET.long of the man's height; barrel MUSKET.bore
 * of the length across; fore-stock to MUSKET.fore of the barrel; butt MUSKET.butt of the length deep. Shared by every "musket" (the deadeye too).
 */
const MUSKET = { long: 1.05, grip: 0.27, bore: 0.034, fore: 0.8, stock: 0.02, butt: 0.085, ring: 1.45 };
const MUSKET_STEEL = new Color3(0.58, 0.58, 0.6);
const MUSKET_WOOD = new Color3(0.66, 0.33, 0.15);
const BRUSH = { long: 0.34, grip: 0.16, butt: 0.08, neck: 0.12, ferrule: 0.6, collar: 0.1, tuft: 0.22, swell: 0.1 };
const BRUSH_WOOD = new Color3(0.6, 0.3, 0.2);
function buildWeapon(scene: Scene, type: WeaponType, _s: number, accent: Color3, bladeFit?: BladeFit, teamColor?: Color3): Mesh | null {
  const s = _s * 1.25; // TABS-style weapon exaggeration
  const fit = bladeFit ?? { fist: 0.058 * _s / PROP_OVERSIZE, stand: 1.5 * _s / PROP_OVERSIZE };
  switch (type) {
    case "none": return null;

    case "club": {
      // The tribal club (units/tribal.clubber, spec at CLUB_LONG): one faceted brown stick, wrist-thin where the fists hold it near the butt and swelling
      // smoothly to a head CLUB_HEAD across (nearly three grips), rounded off at the end; a rope wrap above the hands. Self-lit a little: a plain brown
      // went near-black in the field's shade. +y up the stick from the fist at the origin, CLUB_GRIP of its length below the fist.
      const L = fit.stand * CLUB_LONG;
      const along = [0, 0.1, 0.3, 0.5, 0.68, 0.84, 0.94, 1];
      const across = [0.032, 0.032, 0.034, 0.05, 0.078, CLUB_HEAD * 0.5, 0.07, 0.025];
      const line = along.map((u, i) => new Vector3(0, (u - CLUB_GRIP) * L, (i === 4 || i === 5 ? 0.015 : 0) * L));
      const m = MeshBuilder.CreateTube("club", { path: line, tessellation: 7, cap: Mesh.CAP_ALL, radiusFunction: (i) => across[i] * L }, scene);
      m.material = mat(scene, new Color3(0.55, 0.36, 0.2), 0.12);
      m.convertToFlatShadedMesh();
      addGripWraps(scene, m, [0.06 * L, 0.11 * L, 0.16 * L], 0.08 * L);
      m.rotation.x = Math.PI * 0.14;
      return m;
    }
    case "stone_axe": {
      // The chieftain's stone axe (units/tribal.chieftain, spec at AXE_LONG; tribal.chieftain.red.png): a thin brown handle AXE_LONG of his height, the fist
      // AXE_GRIP up from the butt, and a grey irregular faceted chunk as wide as his own head (skull cap included) hung off one side of its top, the handle
      // running up the chunk's inner side to just short of its top; rope crossed over the stone and round the handle top (AXE_LASH) binds the two. Stone and
      // wood a little self-lit so they read grey and brown in the shade, never iron.
      const L = fit.stand * AXE_LONG;
      // Named "handle" like the iron axe's: the animator turns a hafted head in the fist by that name (proceduralAnimation, the carry's node)
      const handle = MeshBuilder.CreateCylinder("handle", { height: L, diameterTop: 0.05 * L, diameterBottom: 0.065 * L, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.5, 0.3, 0.17), 0.1);
      handle.position.y = (0.5 - AXE_GRIP) * L;
      // The chunk: a flat-faced ball AXE_HEAD across with every vertex pushed in or out by its own hashed share, so no two faces lie in a line
      const stone = MeshBuilder.CreateIcoSphere("stoneAxeHead", { radius: AXE_HEAD * 0.5 * L, subdivisions: 1, flat: true }, scene);
      const at = stone.getVerticesData(VertexBuffer.PositionKind);
      if (at) {
        for (let v = 0; v < at.length; v += 3) {
          const k = 0.78 + 0.44 * roundBoardSeed(7.5, Math.round(at[v] * 97 + at[v + 1] * 57 + at[v + 2] * 31));
          // The thin axis (local z, turned onto the handle's x below) keeps only AXE_LASH.bed of the jitter, so the broad faces stay near enough flat for the lashing
          at[v] *= k; at[v + 1] *= k; at[v + 2] *= 1 + (k - 1) * AXE_LASH.bed;
        }
        stone.setVerticesData(VertexBuffer.PositionKind, at);
        const normals: number[] = [];
        VertexData.ComputeNormals(at, stone.getIndices() ?? [], normals);
        stone.setVerticesData(VertexBuffer.NormalKind, normals);
        stone.refreshBoundingInfo();
      }
      stone.scaling.set(1, AXE_HEAD_SQUASH.y, AXE_HEAD_SQUASH.z);
      // The chunk's broad face lies in the handle's y-z plane (its width along z, thin across x): the swing runs in that plane, so the face shows from the
      // side of the swing and from the front of the man standing with the axes at his sides (tribal.chieftain.red.png), like a real axe head
      stone.rotation.set(0.1, Math.PI / 2, 0);
      // In the handle's frame (its centre the origin): the chunk's middle out to +z of the handle top, its inner third round the handle
      stone.position.set(0, 0.4 * L, AXE_HEAD * 0.24 * L);
      stone.material = mat(scene, new Color3(0.5, 0.5, 0.52), 0.12, "stone");
      stone.parent = handle;
      // The lashing (AXE_LASH): flat rope strips bedded on the chunk's two broad faces, a pair on each face tilted AXE_LASH.tilt off the handle the opposite
      // ways so they cross in an X at the joint; each diagonal is carried over the chunk's top edge and under its bottom edge by a strip laid across the
      // thickness (the pairs of the two faces joined), and the handle is bound with a sleeve above the stone and another where it enters below. Strips
      // lying on the surfaces, not hoops: the 318 tori stood off the stone (critic 318, blocker 3)
      const rope = mat(scene, new Color3(0.3, 0.17, 0.07), 0.12);
      const faceX = AXE_HEAD * 0.5 * AXE_HEAD_SQUASH.z * L; // the chunk's half thickness, half height and half length, in the handle's frame
      const tallY = AXE_HEAD * 0.5 * AXE_HEAD_SQUASH.y * L;
      const longZ = AXE_HEAD * 0.5 * L;
      const cy = 0.4 * L, cz = AXE_LASH.at * L, chunkZ = AXE_HEAD * 0.24 * L;
      const wide = AXE_LASH.wide * L, thick = AXE_LASH.thick * L, proud = AXE_LASH.proud * L;
      // The chunk's half height at a point z along it (its outline in the face's plane): each strip is cut to that rim at its own two ends, not run out past
      // the stone's corners like a frame
      const rim = (z: number): number => tallY * Math.sqrt(Math.max(0, 1 - ((z - chunkZ) / longZ) ** 2));
      const reach = tallY * Math.tan(AXE_LASH.tilt);
      const tan = Math.tan(AXE_LASH.tilt), cos = Math.cos(AXE_LASH.tilt);
      for (const way of [-1, 1]) {
        // Its top end toward +z for way 1: the rims there and at its bottom end, the strip run between them through (cy, cz)
        const rimTop = rim(cz + way * reach), rimBot = rim(cz - way * reach);
        const diag = (rimTop + rimBot) / cos - wide * 0.3;
        const shift = (rimTop - rimBot) * 0.5;
        for (const side of [-1, 1]) {
          const band = MeshBuilder.CreateBox("stoneAxeLash", { width: thick, height: diag, depth: wide }, scene);
          band.position.set(side * (faceX + proud - thick * 0.5), cy + shift, cz + way * shift * tan);
          band.rotation.x = way * AXE_LASH.tilt; // the strip's length leant in the face's plane
          band.material = rope;
          band.parent = handle;
        }
      }
      // Over the top and under the bottom edge, where each diagonal reaches it: a strip across the thickness, laid on the chunk's own height at that point
      for (const way of [-1, 1]) {
        for (const top of [-1, 1]) {
          const z = cz + top * way * reach;
          const cap = MeshBuilder.CreateBox("stoneAxeLashCap", { width: 2 * (faceX + proud), height: thick, depth: wide }, scene);
          cap.position.set(0, cy + top * (rim(z) + proud - thick * 0.5), z);
          cap.material = rope;
          cap.parent = handle;
        }
      }
      for (const y of [cy + tallY + 0.06 * L, cy - tallY - 0.04 * L]) {
        const sleeve = MeshBuilder.CreateCylinder("stoneAxeLashSleeve", { height: 0.08 * L, diameter: 0.09 * L, tessellation: 6 }, scene);
        sleeve.position.y = y;
        sleeve.material = rope;
        sleeve.parent = handle;
      }
      return handle;
    }
    case "tree_club": {
      // An uprooted tree swung as a club, built to the spec above TREE_CLUB_LONG
      const T = fit.stand * TREE_CLUB_LONG;
      const bark = mat(scene, new Color3(0.47, 0.31, 0.18));
      // Strapped on out to the giant's side (TREE_CLUB_CARRY off upright); standing and on the march the animator turns it in the fist to the low hip carry (TREE_HIP_TIP)
      const carry = new Mesh("treeClubCarry", scene);
      carry.rotation.set(0.3, 0, -TREE_CLUB_CARRY);
      // The trunk's line in the carry's frame, the fist at the origin: butt at -GRIP, crown end at 1 - GRIP, bowed to +x and kinked at the knots
      const along = [0, 0.1, 0.3, 0.5, 0.7, 0.88, 1];
      const kinkX = [0, 0, 0.025, -0.02, 0.02, 0, 0];
      const kinkZ = [0, 0.015, -0.025, 0.02, -0.015, 0.01, 0];
      const line = along.map((u, i) => new Vector3((TREE_CLUB_BEND * u * u + kinkX[i]) * T, (u - TREE_CLUB_GRIP) * T, kinkZ[i] * T));
      const trunk = MeshBuilder.CreateTube("treeTrunk", {
        path: line, tessellation: 7, cap: Mesh.CAP_ALL,
        radiusFunction: (i) => {
          const u = along[i];
          return T * (TREE_CLUB_THICK * (1 - 0.45 * u) + (u < 0.1 ? 0.025 * (1 - u / 0.1) : 0));
        },
      }, scene);
      trunk.material = bark;
      trunk.parent = carry;
      trunk.convertToFlatShadedMesh();
      const axis = line[1].subtract(line[0]).normalize();
      const butt = line[0];
      for (let i = 0; i < TREE_CLUB_ROOTS; i++) {
        const a = (i / TREE_CLUB_ROOTS) * Math.PI * 2 + 0.4;
        const fan = TREE_CLUB_ROOT_FAN[0] + (TREE_CLUB_ROOT_FAN[1] - TREE_CLUB_ROOT_FAN[0]) * ((i * 0.618) % 1);
        const dir = axis.scale(-Math.cos(fan)).add(new Vector3(Math.cos(a), 0, Math.sin(a)).scale(Math.sin(fan))).normalize();
        const long = T * (0.1 + 0.04 * (i % 2));
        const root = MeshBuilder.CreateCylinder("treeClubRoot", { height: long, diameterTop: 0, diameterBottom: T * 0.04, tessellation: 5 }, scene);
        root.parent = carry;
        root.position.copyFrom(butt.add(dir.scale(long * 0.45)));
        root.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
        root.material = bark;
      }
      // A forked limb stub off the top of the trunk (its bowed +x side) near the crown, and a knot half way out
      const limbAt = line[4].add(line[5]).scale(0.5);
      const limbs: [Vector3, number, number][] = [[new Vector3(0.75, 0.65, 0.1), 0.2, 0.035], [new Vector3(0.35, 0.9, -0.25), 0.13, 0.022]];
      for (const [toward, long, thick] of limbs) {
        const dir = toward.normalize();
        const limb = MeshBuilder.CreateCylinder("treeClubLimb", { height: T * long, diameterTop: T * thick * 0.35, diameterBottom: T * thick, tessellation: 5 }, scene);
        limb.parent = carry;
        limb.position.copyFrom(limbAt.add(dir.scale(T * long * 0.45)));
        limb.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion());
        limb.material = bark;
      }
      const knot = MeshBuilder.CreateIcoSphere("treeClubKnot", { radius: T * 0.045, subdivisions: 1 }, scene);
      knot.parent = carry;
      knot.position.copyFrom(line[3].add(new Vector3(0.02 * T, 0, 0.025 * T)));
      knot.scaling.set(1, 1.6, 1);
      knot.material = bark;
      // The crown: three separate round lobes one shade apart, so its silhouette reads as three bumps and not one merged blob
      const leaves = [mat(scene, new Color3(0.5, 0.57, 0.27)), mat(scene, new Color3(0.43, 0.5, 0.23))];
      const R = T * TREE_CLUB_CROWN;
      const end = line[line.length - 1];
      TREE_CLUB_LOBES.forEach(([on, hang, across], i) => {
        const lobe = MeshBuilder.CreateIcoSphere("treeClubCrown", { radius: R * TREE_CLUB_LOBE * (1 - i * 0.05), subdivisions: 2 }, scene);
        lobe.parent = carry;
        lobe.position.set(end.x + hang * R, end.y + on * R, end.z + across * R);
        lobe.scaling.set(0.95, 0.9, 1);
        lobe.rotation.y = i * 2.1;
        lobe.material = leaves[i % 2];
        lobe.convertToFlatShadedMesh();
      });
      return carry;
    }
    case "sword":
    case "cutlass": {
      const { blade, hilt } = buildSlabSword(scene, "blade", fit, accent, false);
      // The guard stays where the old one sat on the fist, whatever the blade above it is cut to
      blade.position.y = hilt * PROP_OVERSIZE - 0.11 * _s;
      return blade;
    }
    case "greatsword": {
      const { blade, hilt } = buildSlabSword(scene, "gsblade", fit, accent, true);
      blade.position.y = hilt * PROP_OVERSIZE - 0.19 * _s;
      return blade;
    }
    case "rapier": {
      const blade = MeshBuilder.CreateCylinder("rapier", { height: 0.6 * s, diameter: 0.015 * s, tessellation: 6 }, scene);
      blade.material = mat(scene, new Color3(0.85, 0.85, 0.9));
      const guard = MeshBuilder.CreateTorus("rguard", { diameter: 0.08 * s, thickness: 0.01 * s, tessellation: 12 }, scene);
      guard.position.y = -0.2 * s;
      guard.rotation.x = Math.PI / 2;
      guard.parent = blade;
      guard.material = mat(scene, accent);
      blade.position.y = 0.15 * s;
      return blade;
    }
    case "katana": {
      const blade = MeshBuilder.CreateBox("katana", { width: 0.025 * s, height: 0.6 * s, depth: 0.006 * s }, scene);
      blade.material = mat(scene, new Color3(0.9, 0.9, 0.95), 0, "metal");
      // Tsuba (circular hand guard)
      const tsuba = MeshBuilder.CreateDisc("tsuba", { radius: 0.04 * s, tessellation: 12 }, scene);
      tsuba.position.y = -0.15 * s;
      tsuba.rotation.x = Math.PI / 2;
      tsuba.parent = blade;
      tsuba.material = mat(scene, new Color3(0.3, 0.25, 0.2), 0, "metal");
      // Grip wrap
      const grip = MeshBuilder.CreateCylinder("kgrip", { height: 0.12 * s, diameter: 0.022 * s }, scene);
      grip.position.y = -0.22 * s;
      grip.parent = blade;
      grip.material = mat(scene, new Color3(0.15, 0.1, 0.08));
      addGripWraps(scene, grip, [-0.03 * s, 0, 0.03 * s], 0.026 * s);
      // Kashira (pommel cap)
      const kashira = MeshBuilder.CreateCylinder("kashira", { height: 0.015 * s, diameter: 0.028 * s, tessellation: 8 }, scene);
      kashira.position.y = -0.29 * s;
      kashira.parent = blade;
      kashira.material = mat(scene, new Color3(0.3, 0.25, 0.2), 0, "metal");
      blade.position.y = 0.15 * s;
      blade.rotation.z = 0.05;
      return blade;
    }
    case "harpoon": {
      // A harpoon gun (units/pirate.harpooner): a chunky blue-grey octagonal canister carried at the hip, a grey barrel stepping down to a ringed
      // muzzle with the harpoon's dark head sat in it, and a handle on top. Its long axis is the barrel (+y, muzzle up the fist), where a spear lay;
      // the harpoon leaves from HARPOON_MUZZLE on its rope (simulationSystem harpoonMuzzleOf).
      // Self-lit, not metal: as metal in the field's shade the canister read as one black drill. Dark navy, not pale steel (the reference canister is a
      // deep slate blue under its grey nozzle)
      const steel = mat(scene, new Color3(0.17, 0.21, 0.34), 0.12, "cloth");
      const grey = mat(scene, new Color3(0.55, 0.56, 0.58), 0.2, "cloth");
      const dark = mat(scene, new Color3(0.14, 0.14, 0.16), 0, "cloth");
      const body = MeshBuilder.CreateCylinder("harpoonGun", { height: HARPOON_GUN_LONG * s, diameter: HARPOON_GUN_WIDE * s, tessellation: 8 }, scene);
      body.material = steel;
      const cap = MeshBuilder.CreateCylinder("harpoonCap", { height: 0.03 * s, diameter: HARPOON_GUN_WIDE * 1.12 * s, tessellation: 8 }, scene);
      cap.position.y = -HARPOON_GUN_LONG * 0.5 * s;
      cap.material = dark;
      cap.parent = body;
      const barrel = MeshBuilder.CreateCylinder("harpoonBarrel", { height: 0.16 * s, diameterTop: HARPOON_GUN_WIDE * 0.42 * s, diameterBottom: HARPOON_GUN_WIDE * 0.6 * s, tessellation: 8 }, scene);
      barrel.position.y = (HARPOON_GUN_LONG * 0.5 + 0.08) * s;
      barrel.material = grey;
      barrel.parent = body;
      for (const y of [0.03, 0.12]) {
        const ring = MeshBuilder.CreateCylinder("harpoonRing", { height: 0.025 * s, diameter: HARPOON_GUN_WIDE * 0.62 * s, tessellation: 8 }, scene);
        ring.position.y = (HARPOON_GUN_LONG * 0.5 + y) * s;
        ring.material = dark;
        ring.parent = body;
      }
      const head = MeshBuilder.CreateCylinder("harpoonHead", { height: 0.09 * s, diameterTop: 0, diameterBottom: HARPOON_GUN_WIDE * 0.38 * s, tessellation: 4 }, scene);
      head.position.y = (HARPOON_GUN_LONG * 0.5 + 0.2) * s;
      head.material = dark;
      head.parent = body;
      const handle = MeshBuilder.CreateBox("harpoonHandle", { width: 0.025 * s, height: HARPOON_GUN_LONG * 0.5 * s, depth: 0.025 * s }, scene);
      handle.position.z = -(HARPOON_GUN_WIDE * 0.5 + 0.03) * s;
      handle.material = dark;
      handle.parent = body;
      const muzzle = new TransformNode(HARPOON_MUZZLE, scene);
      muzzle.position.y = (HARPOON_GUN_LONG * 0.5 + 0.16) * s;
      muzzle.parent = body;
      body.position.y = 0.06 * s; // gripped below the middle, the barrel ahead of the fist
      return body;
    }
    case "javelin": {
      // A short throwing spear, not a pole (units/tribal.spear_thrower: gripped near the butt, the shaft about a forearm and a half ahead of the fist, under a
      // broad grey stone leaf as long as his own head, two barbs swept back off its root, a rope wrap at the socket). JAVELIN_LONG is shaft plus head,
      // about .6 of the man's height; the thrown missile is a copy of this (ProjectileSystem._buildHeldMissile), so it flies the same.
      const shaftLong = JAVELIN_LONG - JAVELIN_HEAD_LONG;
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: shaftLong * s, diameter: 0.028 * s, tessellation: 6 }, scene);
      shaft.material = mat(scene, new Color3(0.36, 0.2, 0.15));
      const iron = mat(scene, JAVELIN_STONE, 0.15);
      const top = shaftLong * 0.5;
      // The leaf (spec at JAVELIN_LEAF): broad in the prop's y-z plane (upright in flight, ProjectileSystem turns +y to the flight's +z), thin across x.
      // Built to size in its own vertices: t runs 0 at the root to 1 at the point; the half width swells from root share to full at the waist, then falls to 0.
      const head = MeshBuilder.CreateIcoSphere("tip", { radius: 1, subdivisions: 1, flat: true }, scene);
      const leafAt = head.getVerticesData(VertexBuffer.PositionKind);
      if (leafAt) {
        const halfWide = JAVELIN_HEAD_WIDE * 0.5;
        for (let v = 0; v < leafAt.length; v += 3) {
          const t = (leafAt[v + 1] + 1) * 0.5;
          const k = 1 - JAVELIN_LEAF.jitter + 2 * JAVELIN_LEAF.jitter * roundBoardSeed(23.5, Math.round(leafAt[v] * 89 + leafAt[v + 1] * 53 + leafAt[v + 2] * 37));
          const w = t < JAVELIN_LEAF.waist
            ? JAVELIN_LEAF.root + (1 - JAVELIN_LEAF.root) * Math.sin((t / JAVELIN_LEAF.waist) * Math.PI * 0.5)
            : 1 - (t - JAVELIN_LEAF.waist) / (1 - JAVELIN_LEAF.waist);
          leafAt[v] = leafAt[v] * halfWide * JAVELIN_LEAF.thick * k * Math.max(0.35, w) * s;
          leafAt[v + 1] = (t * JAVELIN_HEAD_LONG) * s;
          leafAt[v + 2] = leafAt[v + 2] * halfWide * w * k * s;
        }
        head.setVerticesData(VertexBuffer.PositionKind, leafAt);
        const leafNormals: number[] = [];
        VertexData.ComputeNormals(leafAt, head.getIndices() ?? [], leafNormals);
        head.setVerticesData(VertexBuffer.NormalKind, leafNormals);
        head.refreshBoundingInfo();
      }
      head.position.y = (top - 0.01) * s;
      head.material = iron;
      head.parent = shaft;
      // Barbs: two flat stone spikes off the leaf's root, pointing back down the shaft and out
      for (const side of [1, -1]) {
        const barb = MeshBuilder.CreateCylinder("javelinBarb", { height: JAVELIN_BARB_LONG * s, diameterTop: 0, diameterBottom: 0.026 * s, tessellation: 4 }, scene);
        barb.scaling.x = 0.5;
        // Its tip (+y) turned back down the shaft (-y) and out along z by the sweep, in the leaf's plane
        barb.rotation.x = Math.PI - side * JAVELIN_BARB_SWEEP;
        barb.position.set(
          0,
          (top + 0.012 - Math.cos(JAVELIN_BARB_SWEEP) * JAVELIN_BARB_LONG * 0.5) * s,
          side * (JAVELIN_HEAD_WIDE * 0.3 + Math.sin(JAVELIN_BARB_SWEEP) * JAVELIN_BARB_LONG * 0.5) * s,
        );
        barb.material = iron;
        barb.parent = shaft;
      }
      // The rope wrap: turns of twine round the socket and over the leaf's root, each a little tilted so they read as wound rope and not a sleeve
      const rope = mat(scene, JAVELIN_ROPE, 0.15);
      for (let i = 0; i < JAVELIN_LEAF.wraps; i++) {
        const turn = MeshBuilder.CreateTorus("javelinBinding", { diameter: (0.034 + i * 0.004) * s, thickness: 0.011 * s, tessellation: 8 }, scene);
        turn.rotation.x = (i % 2 ? 1 : -1) * 0.3;
        turn.position.y = (top - 0.03 + i * 0.016) * s;
        turn.material = rope;
        turn.parent = shaft;
      }
      shaft.position.y = (shaftLong * 0.5 - 0.06) * s; // gripped near the butt, the shaft and head ahead of the fist
      return shaft;
    }
    case "spear": {
      // Half as tall again as the unit and no more: body height is ~1.3 at scale 1 and s carries the 1.25 exaggeration under the 1.6 prop oversize, so a 1.3 shaft stood twice a man and a rank of them was a forest of poles
      // A stick with a small point: a head 0.09 across and 0.22 long was as big as a torso once oversized, and a 0.036 shaft a pole as thick as its own point.
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 1.0 * s, diameter: 0.024 * s, tessellation: 6 }, scene);
      shaft.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const tip = MeshBuilder.CreateCylinder("tip", { height: 0.18 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 4 }, scene);
      tip.position.y = 0.59 * s; // seated on the shaft end: a point 0.055 across and 0.16 long was a spade on a stick, and one 0.038 across and 0.12 long a pin
      tip.parent = shaft;
      tip.material = mat(scene, new Color3(0.6, 0.6, 0.65)); // bright steel: at (0.35, 0.35, 0.4) the point was a dark stub that read as more shaft
      shaft.position.y = 0.15 * s; // gripped where it was, 0.35 up from the butt
      return shaft;
    }
    case "axe": {
      const handle = MeshBuilder.CreateCylinder("handle", { height: 0.5 * s, diameter: 0.03 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, handle, [-0.12 * s, -0.04 * s, 0.04 * s], 0.035 * s);
      const metalMat = mat(scene, new Color3(0.6, 0.6, 0.65), 0, "metal");
      const head = MeshBuilder.CreateBox("axehead", { width: 0.15 * s, height: 0.12 * s, depth: 0.02 * s }, scene);
      head.position.y = 0.22 * s;
      head.position.x = 0.04 * s;
      head.parent = handle;
      head.material = metalMat;
      // Cutting edge (tapered wedge)
      const edge = MeshBuilder.CreateCylinder("axeedge", {
        height: 0.12 * s, diameterTop: 0.003 * s, diameterBottom: 0.02 * s, tessellation: 4,
      }, scene);
      edge.position.set(0.12 * s, 0.22 * s, 0);
      edge.rotation.z = Math.PI / 2;
      edge.parent = handle;
      edge.material = mat(scene, new Color3(0.75, 0.75, 0.8), 0, "metal");
      // Rivets at head-handle junction
      for (const dy of [-0.03, 0.03]) {
        const rivet = MeshBuilder.CreateSphere("rivet", { diameter: 0.012 * s, segments: 4 }, scene);
        rivet.position.set(0, 0.22 * s + dy * s, 0.012 * s);
        rivet.parent = handle;
        rivet.material = metalMat;
      }
      handle.position.y = 0.1 * s;
      return handle;
    }
    case "pickaxe": {
      const handle = MeshBuilder.CreateCylinder("pickaxeHandle", { height: 0.56 * s, diameter: 0.032 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, handle, [-0.12 * s, -0.04 * s, 0.04 * s], 0.035 * s);
      const head = MeshBuilder.CreateBox("pickaxeHead", { width: 0.2 * s, height: 0.04 * s, depth: 0.04 * s }, scene);
      head.position.y = 0.22 * s;
      head.parent = handle;
      head.material = mat(scene, new Color3(0.52, 0.52, 0.56));
      for (const side of [-1, 1]) {
        const spike = MeshBuilder.CreateCylinder("pickaxeSpike", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.03 * s, tessellation: 6 }, scene);
        spike.position.set(side * 0.11 * s, 0.22 * s, 0);
        spike.rotation.z = side * Math.PI / 2;
        spike.parent = handle;
        spike.material = mat(scene, new Color3(0.56, 0.56, 0.6));
      }
      handle.position.y = 0.1 * s;
      return handle;
    }
    case "hammer":
    case "mace": {
      const handle = MeshBuilder.CreateCylinder("handle", { height: 0.5 * s, diameter: 0.035 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      addGripWraps(scene, handle, [-0.12 * s, -0.04 * s, 0.04 * s], 0.04 * s);
      const headMat = mat(scene, accent, 0, "metal");
      if (type === "mace") {
        // Mace: sphere head with flanges
        const head = MeshBuilder.CreateSphere("macehead", { diameter: 0.12 * s, segments: 8 }, scene);
        head.position.y = 0.28 * s;
        head.parent = handle;
        head.material = headMat;
        // 6 flanges around the head
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const flange = MeshBuilder.CreateBox("flange", { width: 0.06 * s, height: 0.04 * s, depth: 0.008 * s }, scene);
          flange.position.set(Math.cos(angle) * 0.04 * s, 0.28 * s, Math.sin(angle) * 0.04 * s);
          flange.rotation.y = -angle;
          flange.parent = handle;
          flange.material = headMat;
        }
      } else {
        // Hammer: a pale block across the haft, the same face at both ends, gripped by a dark collar where the haft goes through. Stone, not metal: a pale colour on metal has nothing to reflect and goes black.
        // A fixed pale stone and not the accent, which is blended with the team colour and made the head a block of skin
        const stoneMat = mat(scene, new Color3(0.85, 0.82, 0.78), 0, "stone");
        const head = MeshBuilder.CreateBox("hammerhead", { width: 0.155 * s, height: 0.1 * s, depth: 0.1 * s }, scene); // a long heavy block across the haft, not a near-cube: at 0.22 it was as big as the torso behind it
        head.position.y = 0.28 * s;
        head.parent = handle;
        head.material = stoneMat;
        const collar = MeshBuilder.CreateBox("hammerCollar", { width: 0.06 * s, height: 0.115 * s, depth: 0.115 * s }, scene);
        collar.position.y = 0.28 * s;
        collar.parent = handle;
        collar.material = mat(scene, new Color3(0.2, 0.19, 0.2), 0, "stone");
      }
      handle.position.y = 0.1 * s;
      return handle;
    }
    case "boxing_glove": {
      const cuff = MeshBuilder.CreateCylinder("boxingCuff", { height: 0.08 * s, diameter: 0.06 * s, tessellation: 10 }, scene);
      cuff.position.y = 0.04 * s;
      cuff.material = mat(scene, accent.scale(0.75), 0.04);
      const glove = MeshBuilder.CreateSphere("boxingGlove", { diameter: 0.14 * s, segments: 8 }, scene);
      glove.position.set(0, 0.13 * s, 0.03 * s);
      glove.parent = cuff;
      glove.scaling.set(1.0, 0.84, 1.15);
      glove.material = mat(scene, accent, 0.08);
      return cuff;
    }
    case "halberd": {
      // The halberd, built to the spec at HALBERD: +y up the shaft from the fist at the origin, HALBERD.grip of it below the fist
      const L = fit.stand * HALBERD.long;
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: L, diameter: HALBERD.thick * L, tessellation: 7 }, scene);
      shaft.position.y = (0.5 - HALBERD.grip) * L;
      shaft.material = mat(scene, HALBERD_WOOD, 0.12);
      shaft.convertToFlatShadedMesh();
      const steel = mat(scene, HALBERD_STEEL, 0.08, "metal");
      const top = L * 0.5;
      // The socket: a dark collar over the shaft's top under the head
      const socket = MeshBuilder.CreateCylinder("hsocket", { height: HALBERD.socket * L, diameter: HALBERD.thick * 1.5 * L, tessellation: 6 }, scene);
      socket.position.y = top - HALBERD.socket * L * 0.5;
      socket.material = steel;
      socket.convertToFlatShadedMesh();
      socket.parent = shaft;
      // The spear point: a long four-sided spike standing off the shaft's top
      const point = MeshBuilder.CreateCylinder("hpoint", { height: HALBERD.point * L, diameterTop: 0, diameterBottom: HALBERD.thick * 1.8 * L, tessellation: 4 }, scene);
      point.position.y = top + HALBERD.point * L * 0.5;
      point.scaling.x = 0.5;
      point.material = steel;
      point.convertToFlatShadedMesh();
      point.parent = shaft;
      // The axe and the back spike: flat plates on the socket, turned a quarter about the shaft so their broad faces lie across the hand's grip plane (in the
      // x-y plane they faced the fist and showed edge-on from the side); the point is pressed flat the same way
      const at = top - HALBERD.socket * L * 0.5;
      const plate = (name: string, outline: number[][]): Mesh => {
        const m = flatPlate(scene, name, outline.map(([x, y]) => [x * L, y * L]), HALBERD.plate * L);
        m.position.y = at;
        m.rotation.y = Math.PI / 2;
        m.material = steel;
        m.parent = shaft;
        return m;
      };
      const [aw, ah, ar] = [HALBERD.axe, HALBERD.axeTall, HALBERD.axeRoot];
      const edge: number[][] = [];
      for (let k = 0; k <= 6; k++) {
        // The cutting edge bows out in an arc from the top horn to the lower horn, which hangs lower than the top one
        const t = k / 6;
        const y = ah * 0.42 - t * ah;
        edge.push([aw * (0.82 + 0.18 * Math.sin(Math.PI * t)), y]);
      }
      plate("haxe", [[0, ar * 0.5], ...edge, [0, -ar * 0.5]]);
      plate("hspike", [[0, HALBERD.thick * 0.9], [-HALBERD.spike, HALBERD.spike * 0.35], [0, -HALBERD.thick * 0.9]]);
      return shaft;
    }
    case "lance": {
      // The jousting lance, built to the spec at LANCE: a tapered cream shaft from the fist, a team stripe wound round it, vamplate and crown
      const L = fit.stand * LANCE.long;
      const back = LANCE.grip * L, front = (1 - LANCE.grip) * L;
      const r0 = LANCE.thick * L * 0.5;
      const radius = (y: number) => r0 * (1 - (1 - LANCE.taper) * Math.max(0, y + back) / L);
      const shaft = MeshBuilder.CreateCylinder("lance", { height: L, diameterBottom: 2 * r0, diameterTop: 2 * r0 * LANCE.taper, tessellation: 8 }, scene);
      const lift = (0.5 - LANCE.grip) * L;
      shaft.position.y = lift;
      shaft.material = mat(scene, LANCE_CREAM, 0.12, "cloth");
      shaft.convertToFlatShadedMesh();
      // The stripe: a flat tube wound round the shaft on a helix, butt to just short of the crown, its own radius a share of the shaft's there
      const helix: Vector3[] = [];
      const steps = Math.ceil(L / (LANCE.pitch * L)) * 10;
      for (let i = 0; i <= steps; i++) {
        const y = -back + (i / steps) * (L * 0.97);
        const a = ((y + back) / (LANCE.pitch * L)) * Math.PI * 2;
        const r = radius(y) * 0.92;
        helix.push(new Vector3(Math.cos(a) * r, y - lift, Math.sin(a) * r));
      }
      const stripe = MeshBuilder.CreateTube("lanceStripe", { path: helix, tessellation: 5, cap: Mesh.CAP_ALL, radiusFunction: (i) => radius(helix[Math.min(i, helix.length - 1)].y + lift) * LANCE.stripe }, scene);
      stripe.material = mat(scene, teamColor ?? accent, 0.12, "cloth");
      stripe.parent = shaft;
      const steel = mat(scene, new Color3(0.55, 0.56, 0.6), 0.08, "metal");
      // The vamplate: a steel cone over the fist, its mouth back toward the hand
      const vamp = MeshBuilder.CreateCylinder("lanceVamplate", { height: LANCE.vampLong * L, diameterTop: 2 * r0 * 1.1, diameterBottom: LANCE.vamp * L, tessellation: 10 }, scene);
      vamp.position.y = 0.02 * L + LANCE.vampLong * L * 0.5 - lift;
      vamp.material = steel;
      vamp.convertToFlatShadedMesh();
      vamp.parent = shaft;
      // The crown: a steel socket on the tip and short prongs splayed out of it
      const tipR = r0 * LANCE.taper;
      const socket = MeshBuilder.CreateCylinder("lanceCrown", { height: LANCE.prong * L, diameterTop: tipR * 3.2, diameterBottom: tipR * 2.2, tessellation: 6 }, scene);
      socket.position.y = front + LANCE.prong * L * 0.5 - lift;
      socket.material = steel;
      socket.convertToFlatShadedMesh();
      socket.parent = shaft;
      for (let k = 0; k < LANCE.prongs; k++) {
        const a = (k / LANCE.prongs) * Math.PI * 2;
        const prong = MeshBuilder.CreateCylinder("lanceProng", { height: LANCE.prong * L, diameterTop: 0, diameterBottom: tipR * 1.1, tessellation: 4 }, scene);
        prong.setPivotPoint(new Vector3(0, -LANCE.prong * L * 0.5, 0));
        prong.position.set(Math.cos(a) * tipR * 1.1, LANCE.prong * L, Math.sin(a) * tipR * 1.1);
        prong.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45);
        prong.material = steel;
        prong.parent = socket;
      }
      // Tipped forward a little about the fist, as the old lance was
      shaft.setPivotPoint(new Vector3(0, -lift, 0));
      shaft.rotation.x = -0.3;
      return shaft;
    }
    case "bone_staff": {
      // The bone mage's staff (units/tribal.bone_mage, spec at BONE_STAFF_LONG): a crooked brown branch BONE_STAFF_LONG long, the fist BONE_STAFF_GRIP up it,
      // topped by a stag's skull (the cranium a head BONE_STAFF_SKULL across, dark eye sockets, the long muzzle and the antler rack of addDeerSkull, bone and
      // antler one shade off the mage's own mask) with a rope round the neck of the shaft and red-brown leaves hanging from it. The root keeps the plain
      // staff's name and its "orb" child (the cranium): the animator's overhead cast looks for a staff with an orb on it and the boneStaff id.
      const L = BONE_STAFF_LONG * s;
      const bark = mat(scene, new Color3(0.42, 0.27, 0.16), 0.1);
      const kinks = [[0, 0], [0.012, -0.008], [-0.015, 0.01], [0.01, 0.014], [-0.008, -0.012], [0.006, 0.004], [0, 0]];
      const line = kinks.map(([x, z], i) => new Vector3(x * L, (i / (kinks.length - 1) - BONE_STAFF_GRIP) * L, z * L));
      const shaft = MeshBuilder.CreateTube("staff", { path: line, tessellation: 6, cap: Mesh.CAP_ALL, radiusFunction: (i) => (0.022 - i * 0.0012) * L }, scene);
      shaft.material = bark;
      shaft.convertToFlatShadedMesh();
      const top = line[line.length - 1];
      const W = BONE_STAFF_SKULL * s;
      const bone = mat(scene, new Color3(0.86, 0.74, 0.52), 0.1);
      const skull = MeshBuilder.CreateSphere("orb", { diameterX: W, diameterY: W * 0.9, diameterZ: W * 1.05, segments: 6 }, scene);
      skull.position.set(top.x, top.y + W * 0.4, top.z);
      skull.material = bone;
      skull.convertToFlatShadedMesh();
      skull.parent = shaft;
      const socket = mat(scene, new Color3(0.12, 0.09, 0.08));
      for (const side of [-1, 1]) {
        const hole = MeshBuilder.CreateCylinder("staffSkullEye", { height: W * 0.06, diameter: W * 0.3, tessellation: 6 }, scene);
        hole.rotation.x = Math.PI / 2;
        hole.rotation.y = side * 0.4;
        hole.position.set(side * W * 0.26, W * 0.05, W * 0.46);
        hole.material = socket;
        hole.parent = skull;
      }
      // The muzzle and the antlers, cut from the mask's spec to this cranium (W across, a cranium-height tall): the bone material is read off the skull itself
      addDeerSkull(scene, skull, skull, W, W * 0.9, W * 0.45, W * 0.5, (v) => v);
      const rope = MeshBuilder.CreateTorus("staffRope", { diameter: 0.07 * L, thickness: 0.016 * L, tessellation: 8 }, scene);
      rope.position.set(top.x, top.y - 0.02 * L, top.z);
      rope.material = mat(scene, new Color3(0.36, 0.22, 0.1));
      rope.parent = shaft;
      const leaves = [new Color3(0.62, 0.2, 0.12), new Color3(0.58, 0.3, 0.1), new Color3(0.5, 0.14, 0.1)];
      [[-1, 0.3], [1, -0.2], [-0.6, -0.8], [0.7, 0.7]].forEach(([x, z], i) => {
        const leaf = MeshBuilder.CreateCylinder("staffLeaf", { height: 0.1 * L, diameterTop: 0, diameterBottom: 0.045 * L, tessellation: 4 }, scene);
        leaf.scaling.z = 0.25;
        leaf.rotation.set(0.35 * z, i * 0.8, 0.3 * x);
        leaf.position.set(top.x + x * 0.04 * L, top.y - 0.07 * L, top.z + z * 0.03 * L);
        leaf.material = mat(scene, leaves[i % 3], 0.15, "cloth");
        leaf.parent = shaft;
      });
      shaft.id = "boneStaff";
      return shaft;
    }
    case "staff":
    case "bo_staff": {
      const color = type === "bo_staff" ? new Color3(0.6, 0.35, 0.15)
        : new Color3(0.5, 0.35, 0.2);
      const shaft = MeshBuilder.CreateCylinder("staff", { height: 0.85 * s, diameter: 0.05 * s }, scene);
      shaft.material = mat(scene, color);
      if (type === "staff") {
        const orb = MeshBuilder.CreateSphere("orb", { diameter: 0.1 * s, segments: 8 }, scene);
        orb.position.y = 0.42 * s; orb.parent = shaft;
        orb.material = mat(scene, accent, 0.3);
      }
      shaft.position.y = 0.2 * s;
      return shaft;
    }
    case "bow":
    case "crossbow": {
      // The stave is an arc: its tips meet the string and its belly bows a third of its length away from it
      const bowHeight = type === "crossbow" ? 0.25 : 0.4;
      const stavePath: Vector3[] = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 4 - 1;
        stavePath.push(new Vector3(0, t * bowHeight * s * 0.5, (0.04 - bowHeight * 0.33 * (1 - t * t)) * s));
      }
      const bowMesh = MeshBuilder.CreateTube("bow", {
        path: stavePath, radius: 0.0225 * s, tessellation: 6, cap: Mesh.CAP_ALL,
      }, scene);
      bowMesh.material = mat(scene, new Color3(0.5, 0.35, 0.15));
      // String
      const string = MeshBuilder.CreateCylinder("string", {
        height: bowHeight * s, diameter: 0.014 * s, tessellation: 4,
      }, scene);
      string.position.z = 0.04 * s;
      string.parent = bowMesh;
      string.material = mat(scene, new Color3(0.8, 0.75, 0.65));
      bowMesh.rotation.z = Math.PI / 2;
      bowMesh.position.y = 0.1 * s;
      return bowMesh;
    }
    case "blunderbuss": {
      // Short barrel with flared bell muzzle
      const barrel = MeshBuilder.CreateCylinder("barrel", { height: 0.35 * s, diameter: 0.04 * s, tessellation: 8 }, scene);
      barrel.material = mat(scene, new Color3(0.3, 0.3, 0.35));
      // Flared muzzle bell
      const bell = MeshBuilder.CreateCylinder("bell", {
        height: 0.1 * s, diameterTop: 0.12 * s, diameterBottom: 0.04 * s, tessellation: 10,
      }, scene);
      bell.position.y = 0.22 * s;
      bell.parent = barrel;
      bell.material = mat(scene, new Color3(0.35, 0.35, 0.4));
      // Wood stock
      const stock = MeshBuilder.CreateBox("stock", { width: 0.05 * s, height: 0.18 * s, depth: 0.035 * s }, scene);
      stock.position.y = -0.2 * s;
      stock.parent = barrel;
      stock.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      barrel.rotation.x = -0.2;
      barrel.position.y = 0.12 * s;
      return barrel;
    }
    case "musket": {
      // The matchlock, built to the spec at MUSKET: barrel, fore-stock and butt along +y from the fist; the wood lies on the barrel's +z side
      const L = fit.stand * MUSKET.long;
      const back = MUSKET.grip * L, front = (1 - MUSKET.grip) * L;
      const steel = mat(scene, MUSKET_STEEL, 0.08, "metal");
      const wood = mat(scene, MUSKET_WOOD, 0.12);
      const bore = MUSKET.bore * L;
      const barrel = MeshBuilder.CreateCylinder("barrel", { height: front + 0.04 * L, diameter: bore, tessellation: 8 }, scene);
      barrel.position.y = (front - 0.04 * L) * 0.5;
      barrel.material = steel;
      barrel.convertToFlatShadedMesh();
      // The barrel is the root: every other piece is placed from the fist and set back by the barrel's own lift
      const lift = barrel.position.y;
      const holder = barrel;
      // The muzzle ring and a band two thirds of the way out
      for (const [at, tall] of [[front - 0.02 * L, 0.04 * L], [front * 0.66, 0.015 * L]]) {
        const ring = MeshBuilder.CreateCylinder("musketRing", { height: tall, diameter: bore * MUSKET.ring, tessellation: 8 }, scene);
        ring.position.y = at - lift;
        ring.material = steel;
        ring.convertToFlatShadedMesh();
        ring.parent = holder;
      }
      // The fore-stock: a wooden bar under the barrel from the hand most of the way to the muzzle
      const foreLong = front * MUSKET.fore;
      // narrower than the barrel and hung under it, so the grey barrel shows over the wood from every side
      const fore = MeshBuilder.CreateBox("musketFore", { width: bore * 0.75, height: foreLong, depth: MUSKET.stock * L }, scene);
      fore.position.set(0, foreLong * 0.5 - lift, bore * 0.45 + MUSKET.stock * L * 0.5);
      fore.material = wood;
      fore.parent = holder;
      // The butt: a slim wrist at the hand deepening to the butt plate behind it, a tapered block flattened across
      const butt = MeshBuilder.CreateCylinder("musketButt", { height: back + 0.04 * L, diameterTop: bore * 1.3, diameterBottom: MUSKET.butt * L * 1.4, tessellation: 4 }, scene);
      butt.rotation.y = Math.PI / 4;
      butt.scaling.x = 0.5;
      butt.bakeCurrentTransformIntoVertices();
      butt.position.set(0, -(back - 0.04 * L) * 0.5 - lift, MUSKET.stock * L * 0.6);
      butt.rotation.x = 0.12;
      butt.material = wood;
      butt.convertToFlatShadedMesh();
      butt.parent = holder;
      // The lock plate and the match lever (the serpentine) curling up beside the barrel at the hand
      const dark = mat(scene, new Color3(0.14, 0.14, 0.16), 0.05, "metal");
      const lock = MeshBuilder.CreateBox("musketLock", { width: bore * 0.5, height: 0.07 * L, depth: MUSKET.stock * L }, scene);
      lock.position.set(bore * 0.75, 0.02 * L - lift, bore * 0.5);
      lock.material = dark;
      lock.parent = holder;
      const lever = MeshBuilder.CreateBox("musketSerpentine", { width: bore * 0.3, height: 0.06 * L, depth: bore * 0.4 }, scene);
      lever.position.set(bore * 0.8, 0.05 * L - lift, -bore * 0.3);
      lever.rotation.x = -0.6;
      lever.material = dark;
      lever.parent = holder;
      // Tipped back a little about the fist, as the old gun was
      barrel.setPivotPoint(new Vector3(0, -lift, 0));
      barrel.rotation.x = -0.2;
      return barrel;
    }
    case "flintlock":
    case "cannon_hand": {
      const len = type === "cannon_hand" ? 0.7 : 0.35;
      const diam = type === "cannon_hand" ? 0.08 : 0.03;
      const barrel = MeshBuilder.CreateCylinder("barrel", { height: len * s, diameter: diam * s, tessellation: 8 }, scene);
      barrel.material = mat(scene, new Color3(0.3, 0.3, 0.35));
      const stock = MeshBuilder.CreateBox("stock", { width: 0.04 * s, height: 0.15 * s, depth: 0.03 * s }, scene);
      stock.position.y = -len * s * 0.45;
      stock.parent = barrel;
      stock.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      barrel.rotation.x = -0.2;
      barrel.position.y = 0.12 * s;
      return barrel;
    }
    case "bomb": {
      // A round iron bomb a little wider than the fist it sits in (units/pirate.bomb_thrower: one in each hand), not a head-sized ball: a short iron neck on top
      // and a stub of fuse out of it. Built about its centre, so it rides in the fist and the thrown copy flies the same size.
      const d = BOMB_FISTS * fit.fist;
      const bomb = MeshBuilder.CreateSphere("bomb", { diameter: d, segments: 5 }, scene);
      bomb.convertToFlatShadedMesh();
      bomb.material = mat(scene, new Color3(0.13, 0.13, 0.15));
      const neck = MeshBuilder.CreateCylinder("bombNeck", { height: d * BOMB_NECK, diameter: d * 0.34, tessellation: 6 }, scene);
      neck.position.y = d * (0.5 + BOMB_NECK * 0.3);
      neck.parent = bomb;
      neck.material = bomb.material;
      const fuse = MeshBuilder.CreateCylinder("fuse", { height: d * BOMB_FUSE, diameter: d * 0.09, tessellation: 5 }, scene);
      fuse.position.y = d * (0.5 + BOMB_NECK * 0.8 + BOMB_FUSE * 0.5);
      fuse.rotation.z = 0.35;
      fuse.parent = bomb;
      fuse.material = mat(scene, new Color3(0.85, 0.7, 0.45), 0.2, "cloth");
      return bomb;
    }
    case "dynamite": {
      // A bundle of dynamite (units/wild_west.dynamite_thrower): DYNAMITE_COLS x DYNAMITE_ROWS fat red sticks packed in a block, each its own cylinder with a gap
      // that shows between them, bound by two broad black bands, a fuse out of the top. Long axis up the fist (+y) so the thrown copy (a clone, sticks and bands
      // and all) flies end first; the top stays where the lit-fuse spark rides the fist (0.18 s), so the extra length hangs down below the hand.
      const red = mat(scene, new Color3(0.8, 0.13, 0.1), 0.12, "cloth");
      const black = mat(scene, new Color3(0.05, 0.05, 0.06), 0, "cloth");
      const stickD = DYNAMITE_STICK_WIDE * s;
      const long = DYNAMITE_LONG * s;
      const pitch = stickD * 0.94;
      // The root is the block's red core, hidden inside the sticks but for the seams; it gives the thrown copy its length
      const root = MeshBuilder.CreateBox("dynamite", { width: pitch * (DYNAMITE_COLS - 1), height: long * 0.96, depth: pitch * (DYNAMITE_ROWS - 1) * 0.9 }, scene);
      root.material = red;
      for (let c = 0; c < DYNAMITE_COLS; c++) {
        for (let r = 0; r < DYNAMITE_ROWS; r++) {
          const stick = MeshBuilder.CreateCylinder("dynamiteStick", { height: long * (r === 0 ? 1 : 0.97), diameter: stickD, tessellation: 8 }, scene);
          stick.position.x = (c - (DYNAMITE_COLS - 1) / 2) * pitch;
          stick.position.z = (r - (DYNAMITE_ROWS - 1) / 2) * pitch;
          stick.material = red;
          stick.parent = root;
        }
      }
      const bandW = pitch * (DYNAMITE_COLS - 1) + stickD * 1.06;
      const bandD = pitch * (DYNAMITE_ROWS - 1) + stickD * 1.06;
      for (const y of [-0.27, 0.27]) {
        const band = MeshBuilder.CreateBox("dynamiteBand", { width: bandW, height: long * DYNAMITE_BAND, depth: bandD }, scene); // a strap round the block
        band.position.y = y * long;
        band.material = black;
        band.parent = root;
      }
      const fuse = MeshBuilder.CreateCylinder("fuse", { height: 0.06 * s, diameter: 0.014 * s, tessellation: 5 }, scene);
      fuse.position.y = long / 2 + 0.03 * s;
      fuse.rotation.z = 0.35;
      fuse.material = mat(scene, new Color3(0.85, 0.72, 0.45), 0.2);
      fuse.parent = root;
      // The lit fuse (units/wild_west.dynamite_thrower): an unlit white-hot core in an orange burst of DYNAMITE_SPARK_RAYS short spikes on the fuse tip.
      // A child of the fuse, so the thrown copy carries it burning through the air.
      const spark = MeshBuilder.CreateIcoSphere("dynamiteSpark", { radius: DYNAMITE_SPARK * 0.5 * s, subdivisions: 1 }, scene);
      spark.position.y = 0.03 * s + DYNAMITE_SPARK * 0.25 * s;
      spark.material = getMaterialFactory().getEmissive(new Color3(1, 0.95, 0.75), 1);
      spark.parent = fuse;
      const rayMat = getMaterialFactory().getEmissive(new Color3(1, 0.55, 0.12), 1);
      for (let i = 0; i < DYNAMITE_SPARK_RAYS; i++) {
        const ray = MeshBuilder.CreateBox("dynamiteSparkRay", { width: DYNAMITE_SPARK * 0.22 * s, height: DYNAMITE_SPARK * 2.2 * s, depth: DYNAMITE_SPARK * 0.22 * s }, scene);
        ray.rotation.set((i % 2 ? 0.9 : -0.9), (i * Math.PI * 2) / DYNAMITE_SPARK_RAYS, (i * 2.4) % Math.PI);
        ray.material = rayMat;
        ray.parent = spark;
      }
      root.position.y = 0.155 * s - long / 2;
      return root;
    }
    case "torch": {
      const handle = MeshBuilder.CreateCylinder("torch", { height: 0.35 * s, diameter: 0.03 * s }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const flame = MeshBuilder.CreateSphere("flame", { diameter: 0.1 * s, segments: 6 }, scene);
      flame.position.y = 0.2 * s; flame.parent = handle;
      flame.material = mat(scene, new Color3(1, 0.6, 0.1), 0.5);
      handle.position.y = 0.05 * s;
      return handle;
    }
    case "dagger":
    case "shuriken_hand": {
      const blade = MeshBuilder.CreateBox("dagger", { width: 0.02 * s, height: 0.18 * s, depth: 0.005 * s }, scene);
      blade.material = mat(scene, new Color3(0.8, 0.8, 0.85));
      blade.position.y = 0.05 * s;
      return blade;
    }
    case "blowgun": {
      const tube = MeshBuilder.CreateCylinder("blowgun", { height: 0.38 * s, diameter: 0.026 * s, tessellation: 8 }, scene);
      tube.rotation.z = Math.PI / 2;
      tube.position.y = 0.14 * s;
      tube.material = mat(scene, new Color3(0.36, 0.22, 0.08));
      const dart = MeshBuilder.CreateCylinder("blowdart", { height: 0.1 * s, diameterTop: 0, diameterBottom: 0.016 * s, tessellation: 6 }, scene);
      dart.position.set(0.16 * s, 0.14 * s, 0);
      dart.rotation.z = -Math.PI / 2;
      dart.parent = tube;
      dart.material = mat(scene, new Color3(0.72, 0.82, 0.48));
      return tube;
    }
    case "scythe": {
      // A war scythe (251; units/spooky.reaper): the snath taller than the man, a collar at its head, and a long blade sweeping out from it and curving
      // down, broad at the heel and narrowing to a point, about SCYTHE_BLADE of the snath long, built from SCYTHE_SEGS flat faceted segments along the arc.
      // 252: the blade lies across the carrier's front and not along his line of sight (held across the body, its flat faces the viewer as in the reference),
      // turned SCYTHE_TURN about the snath; SCYTHE_HEEL wide at the heel, with a thick spine SCYTHE_SPINE deep tapering to the tip, so edge-on it is still a wedge.
      // 266 (units/spooky.reaper): the blade is one continuous crescent, not stepped slabs. It leaves the collar rising SCYTHE_RISE off square, runs out
      // SCYTHE_BLADE of the snath along its arc and curls SCYTHE_CURL radians down to a point, SCYTHE_HEEL wide at the heel tapering to nothing, a wedge
      // SCYTHE_SPINE thick at its back; the snath bows SCYTHE_BOW of its length away from the blade, and the hand grips it SCYTHE_GRIP below the middle, so
      // the head stands high over the hood and the crescent hangs over it.
      // 268 (units/spooky.reaper): the crescent is seated on a heel collar (tang + socket) that turns it SCYTHE_LEVEL below square to the snath, which in the
      // high carry (snath leant ~0.6 rad out) lays its heel level off the head; its curl is not even but grows along the blade (none at the heel, twice the
      // mean at the tip), so it runs out flat over the hood and then droops in a long arc, the tip hanging below the head.
      const SCYTHE_SNATH = 1.25, SCYTHE_BLADE = 0.8, SCYTHE_SEGS = 14, SCYTHE_CURL = 1.3, SCYTHE_LEVEL = -0.6;
      const SCYTHE_TURN = Math.PI / 2, SCYTHE_HEEL = 0.17, SCYTHE_SPINE = 0.045, SCYTHE_BOW = 0.05, SCYTHE_GRIP = 0.15;
      const snathLong = SCYTHE_SNATH * s;
      const bow = SCYTHE_BOW * snathLong;
      const shaft = MeshBuilder.CreateTube("shaft", {
        path: [-0.5, -0.25, 0, 0.25, 0.5].map((t) => new Vector3(0, t * snathLong, bow * (1 - 4 * t * t))),
        radius: 0.016 * s, tessellation: 6, cap: Mesh.CAP_ALL,
      }, scene);
      shaft.material = mat(scene, new Color3(0.32, 0.22, 0.14));
      addGripWraps(scene, shaft, [-0.18 * s, -0.08 * s, 0.02 * s], 0.035 * s);
      // Matte pale grey-white steel (units/spooky.reaper), a touch self-lit: the bluer, glossier steel went lavender under the night sky
      const steel = mat(scene, new Color3(0.81, 0.83, 0.84), 0.15, "stone");
      const collar = MeshBuilder.CreateCylinder("scycollar", { height: 0.06 * s, diameter: 0.05 * s, tessellation: 6 }, scene);
      collar.position.y = snathLong * 0.46;
      collar.material = steel;
      collar.parent = shaft;
      const head = new Mesh("scyhead", scene);
      head.rotation.y = SCYTHE_TURN;
      head.parent = shaft;
      const heel = MeshBuilder.CreateBox("scyheel", { width: 0.07 * s, height: SCYTHE_HEEL * 1.1 * s, depth: SCYTHE_SPINE * 1.2 * s }, scene);
      heel.position.set(0.03 * s, snathLong * 0.47, 0);
      heel.rotation.z = SCYTHE_LEVEL;
      heel.material = steel;
      heel.parent = head;
      // The heel collar: a socket capping the snath's head and a tang run out of it along the blade's seat, so the crescent sits on the end of the pole
      const socket = MeshBuilder.CreateCylinder("scysocket", { height: 0.08 * s, diameterTop: 0.06 * s, diameterBottom: 0.045 * s, tessellation: 6 }, scene);
      socket.position.y = snathLong * 0.5;
      socket.material = steel;
      socket.parent = head;
      const tang = MeshBuilder.CreateBox("scytang", { width: 0.1 * s, height: 0.035 * s, depth: SCYTHE_SPINE * 1.4 * s }, scene);
      tang.position.set(0.05 * s * Math.cos(SCYTHE_LEVEL), snathLong * 0.5 + 0.05 * s * Math.sin(SCYTHE_LEVEL), 0);
      tang.rotation.z = SCYTHE_LEVEL;
      tang.material = steel;
      tang.parent = head;
      // Three paths along the arc (spine front, cutting edge, spine back), closed round into a wedge-section ribbon
      const segLong = (SCYTHE_BLADE * snathLong) / SCYTHE_SEGS;
      const front: Vector3[] = [], edge: Vector3[] = [], back: Vector3[] = [];
      let x = 0.04 * s, y = snathLong * 0.5, heading = SCYTHE_LEVEL;
      for (let i = 0; i <= SCYTHE_SEGS; i++) {
        const k = i / SCYTHE_SEGS;
        const wide = SCYTHE_HEEL * s * (1 - k) * (1 - 0.35 * k);
        const thick = SCYTHE_SPINE * s * (1 - k * 0.85) * 0.5;
        // the edge lies on the inside of the curl, below the spine
        const nx = Math.sin(heading), ny = -Math.cos(heading);
        front.push(new Vector3(x, y, thick));
        edge.push(new Vector3(x + nx * wide, y + ny * wide, 0));
        back.push(new Vector3(x, y, -thick));
        x += Math.cos(heading) * segLong;
        y += Math.sin(heading) * segLong;
        heading -= (SCYTHE_CURL * (2 * i + 1)) / (SCYTHE_SEGS * SCYTHE_SEGS);
      }
      const blade = MeshBuilder.CreateRibbon("scyblade", { pathArray: [front, edge, back], closeArray: true, sideOrientation: Mesh.DOUBLESIDE }, scene);
      blade.convertToFlatShadedMesh();
      blade.material = steel;
      blade.parent = head;
      // 267: strapped on through a carry node of its own, so the animator turns it in the fist to the high carry (SCYTHE_HIGH_TIP) and not the arm's swing
      const carry = new Mesh("scytheCarry", scene);
      shaft.parent = carry;
      shaft.position.y = snathLong * SCYTHE_GRIP;
      return carry;
    }
    case "pitchfork": {
      const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.7 * s, diameter: 0.025 * s }, scene);
      shaft.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      for (let i = -1; i <= 1; i++) {
        const tine = MeshBuilder.CreateCylinder("tine", { height: 0.15 * s, diameter: 0.012 * s }, scene);
        tine.position.y = 0.4 * s; tine.position.x = i * 0.03 * s;
        tine.parent = shaft;
        tine.material = mat(scene, new Color3(0.6, 0.6, 0.65));
      }
      shaft.position.y = 0.15 * s;
      return shaft;
    }
    case "frying_pan": {
      const pan = MeshBuilder.CreateCylinder("pan", { height: 0.02 * s, diameter: 0.16 * s, tessellation: 12 }, scene);
      pan.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      const handle = MeshBuilder.CreateCylinder("panhandle", { height: 0.15 * s, diameter: 0.02 * s }, scene);
      handle.position.y = -0.1 * s; handle.parent = pan;
      handle.material = mat(scene, new Color3(0.4, 0.25, 0.1));
      pan.position.y = 0.1 * s;
      return pan;
    }
    case "lute": {
      const body = MeshBuilder.CreateSphere("lute", { diameter: 0.14 * s, segments: 8 }, scene);
      body.scaling.z = 0.5;
      body.material = mat(scene, new Color3(0.6, 0.4, 0.2));
      const neck = MeshBuilder.CreateCylinder("luteneck", { height: 0.2 * s, diameter: 0.02 * s }, scene);
      neck.position.y = 0.12 * s; neck.parent = body;
      neck.material = mat(scene, new Color3(0.5, 0.35, 0.15));
      return body;
    }
    case "paintbrush": {
      // The painter's brush, built to the spec at BRUSH: +y up the brush from the fist at the origin, BRUSH.grip of it below the fist
      const L = fit.stand * BRUSH.long;
      const handleLong = BRUSH.ferrule * L;
      const brush = MeshBuilder.CreateCylinder("brush", { height: handleLong, diameterTop: BRUSH.neck * L, diameterBottom: BRUSH.butt * L, tessellation: 7 }, scene);
      // The hand's +y runs back up the forearm: the brush is turned end over end so the tuft leaves the fist away from the elbow, the butt behind it
      brush.position.y = -(handleLong * 0.5 - BRUSH.grip * L);
      brush.rotation.x = Math.PI;
      brush.material = mat(scene, BRUSH_WOOD, 0.12);
      brush.convertToFlatShadedMesh();
      const ferrule = MeshBuilder.CreateCylinder("brushFerrule", { height: BRUSH.collar * L, diameterTop: BRUSH.collar * L, diameterBottom: BRUSH.neck * 1.05 * L, tessellation: 7 }, scene);
      ferrule.position.y = handleLong * 0.5 + BRUSH.collar * L * 0.5;
      ferrule.material = mat(scene, new Color3(0.42, 0.42, 0.46), 0.1);
      ferrule.convertToFlatShadedMesh();
      ferrule.parent = brush;
      // The tuft: swells out of the ferrule, then runs to a point; in the team colour
      const paint = mat(scene, teamColor ?? accent, 0.15);
      const swell = MeshBuilder.CreateCylinder("brushTuft", { height: BRUSH.swell * L, diameterTop: BRUSH.tuft * L, diameterBottom: BRUSH.collar * L, tessellation: 7 }, scene);
      swell.position.y = BRUSH.collar * L * 0.5 + BRUSH.swell * L * 0.5;
      swell.material = paint;
      swell.convertToFlatShadedMesh();
      swell.parent = ferrule;
      const pointLong = (1 - BRUSH.ferrule - BRUSH.collar - BRUSH.swell) * L;
      const point = MeshBuilder.CreateCylinder("brushPoint", { height: pointLong, diameterTop: 0, diameterBottom: BRUSH.tuft * L, tessellation: 7 }, scene);
      point.position.y = BRUSH.swell * L * 0.5 + pointLong * 0.5;
      point.material = paint;
      point.convertToFlatShadedMesh();
      point.parent = swell;
      return brush;
    }
    case "nunchaku": {
      const a = MeshBuilder.CreateCylinder("n1", { height: 0.18 * s, diameter: 0.025 * s }, scene);
      a.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const b = MeshBuilder.CreateCylinder("n2", { height: 0.18 * s, diameter: 0.025 * s }, scene);
      b.position.y = 0.22 * s; b.rotation.z = 0.4; b.parent = a;
      b.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      a.position.y = 0.05 * s;
      return a;
    }
    case "broom":
    case "wheelbarrow_weapon":
    case "shield_sword":
      return buildWeapon(scene, "sword", s, accent, bladeFit);
    case "stone": {
      // The stoner's boulder (units/tribal.stoner; tribal.stoner.blue.png: a dark irregular chunk wider than his torso, a dozen big flat faces no two in a
      // line, cradled before the belly in both hands): a coarse flat-faced ball BOULDER_WIDE across with every vertex pushed in or out by its own hashed
      // share (BOULDER_JITTER), now BOULDER_CHUNKS such chunks run together into one uneven lump (unequal faces, not an even ball). Carried in both hands at the belly
      // (ProceduralAnimator._carryBoulder sets it between the hands, the hands solved onto its sides); the thrown one is a copy of it, so the same chunk flies
      const chunks = BOULDER_CHUNKS.map((c, i) => {
        const chunk = MeshBuilder.CreateIcoSphere("boulderChunk" + i, { radius: c.r * BOULDER_WIDE * s, subdivisions: 1, flat: true }, scene);
        const at = chunk.getVerticesData(VertexBuffer.PositionKind);
        if (at) {
          for (let v = 0; v < at.length; v += 3) {
            const k = 1 - BOULDER_JITTER + 2 * BOULDER_JITTER * roundBoardSeed(9.5 + i, Math.round((at[v] * 83 + at[v + 1] * 47 + at[v + 2] * 29) / (c.r * s)));
            at[v] *= k * c.squash[0]; at[v + 1] *= k * c.squash[1]; at[v + 2] *= k * c.squash[2];
          }
          chunk.setVerticesData(VertexBuffer.PositionKind, at);
        }
        chunk.rotation.set(c.turn[0], c.turn[1], c.turn[2]);
        chunk.position.set(c.at[0] * BOULDER_WIDE * s, c.at[1] * BOULDER_WIDE * s, c.at[2] * BOULDER_WIDE * s);
        return chunk;
      });
      const rock = Mesh.MergeMeshes(chunks, true, true) ?? chunks[0];
      rock.name = "boulder";
      rock.id = "boulder";
      const merged = rock.getVerticesData(VertexBuffer.PositionKind);
      if (merged) {
        const normals: number[] = [];
        VertexData.ComputeNormals(merged, rock.getIndices() ?? [], normals);
        rock.setVerticesData(VertexBuffer.NormalKind, normals);
        rock.refreshBoundingInfo();
      }
      rock.scaling.set(1, BOULDER_SQUASH.y, BOULDER_SQUASH.z);
      rock.rotation.set(0.5, 0.8, 0.3);
      rock.material = mat(scene, BOULDER_COLOR, 0.1, "stone");
      return rock;
    }
    case "lockbox": {
      // The swordcaster's lockbox (units/spooky.swordcaster): an iron chest, box below and a domed lid on top running across him (a round bar half sunk in the
      // box's top), two bands over the lid and down the front, a keyhole plate between them. Carried in both hands (ProceduralAnimator._carryBoulder sets it
      // between the hands, square to his chest).
      const { wide, tall, deep } = LOCKBOX_SIZE;
      const lowTall = tall * (1 - LOCKBOX_LID) * s;
      const dome = (tall * LOCKBOX_LID * 2) / deep; // the round bar's height over its depth
      const box = MeshBuilder.CreateBox("lockbox", { width: wide * s, height: lowTall, depth: deep * s }, scene);
      box.material = mat(scene, LOCKBOX_IRON, 0.05, "stone");
      const lid = MeshBuilder.CreateCylinder("lockboxLid", { height: wide * s, diameter: deep * s, tessellation: 12 }, scene);
      lid.rotation.z = Math.PI / 2; // axis across him; its local x is now up
      lid.scaling.x = dome;
      lid.position.y = lowTall / 2;
      lid.parent = box;
      lid.material = box.material;
      const bandMat = mat(scene, LOCKBOX_BAND, 0.05, "stone");
      for (const x of [-0.3, 0.3]) {
        const band = MeshBuilder.CreateCylinder("lockboxBand", { height: wide * s * 0.08, diameter: deep * s * 1.06, tessellation: 12 }, scene);
        band.rotation.z = Math.PI / 2;
        band.scaling.x = dome;
        band.position.set(x * wide * s, lowTall / 2, 0);
        band.parent = box;
        band.material = bandMat;
        const strap = MeshBuilder.CreateBox("lockboxStrap", { width: wide * s * 0.08, height: lowTall * 1.02, depth: deep * s * 1.06 }, scene);
        strap.position.x = x * wide * s;
        strap.parent = box;
        strap.material = bandMat;
      }
      const plate = MeshBuilder.CreateBox("lockboxPlate", { width: wide * s * 0.2, height: tall * s * 0.5, depth: 0.012 * s }, scene);
      plate.position.set(0, lowTall * 0.15, deep * s * 0.53 + 0.006 * s);
      plate.parent = box;
      plate.material = mat(scene, LOCKBOX_PLATE, 0.1, "stone");
      const hole = MeshBuilder.CreateBox("lockboxKeyhole", { width: wide * s * 0.045, height: tall * s * 0.22, depth: 0.004 * s }, scene);
      hole.position.set(0, -tall * s * 0.04, 0.008 * s);
      hole.parent = plate;
      hole.material = mat(scene, new Color3(0.04, 0.04, 0.05), 0);
      return box;
    }
    case "hay_bale": {
      const bale = MeshBuilder.CreateBox("bale", { width: 0.25 * s, height: 0.18 * s, depth: 0.2 * s }, scene);
      bale.material = mat(scene, new Color3(0.82, 0.72, 0.28));
      // Twine bands
      const band = MeshBuilder.CreateBox("band", { width: 0.26 * s, height: 0.015 * s, depth: 0.21 * s }, scene);
      band.position.y = 0.03 * s; band.parent = bale;
      band.material = mat(scene, new Color3(0.6, 0.45, 0.2));
      bale.position.y = 0.1 * s;
      return bale;
    }
    case "potion": {
      const flask = MeshBuilder.CreateCylinder("flask", { height: 0.12 * s, diameterTop: 0.04 * s, diameterBottom: 0.07 * s, tessellation: 8 }, scene);
      flask.material = mat(scene, accent, 0.2);
      const stopper = MeshBuilder.CreateSphere("stopper", { diameter: 0.04 * s, segments: 6 }, scene);
      stopper.position.y = 0.08 * s; stopper.parent = flask;
      stopper.material = mat(scene, new Color3(0.55, 0.3, 0.15));
      const neck = MeshBuilder.CreateCylinder("neck", { height: 0.04 * s, diameter: 0.025 * s, tessellation: 6 }, scene);
      neck.position.y = 0.06 * s; neck.parent = flask;
      neck.material = mat(scene, accent, 0.15);
      flask.position.y = 0.08 * s;
      return flask;
    }
    case "lightning_bolt": {
      // A held bolt is the thrown one in the hand (trailer_2_sheet_03 r3c2): flat white jagged slabs, each a long four-sided shard pressed flat, laid end to end
      // in a zigzag, every one backed by the same shard half again as broad in cyan, a hair behind it, so it reads as a white blade with a cyan rim and not a
      // glowing yellow block.
      const bolt = new TransformNode("bolt", scene) as unknown as Mesh;
      const white = mat(scene, new Color3(1, 1, 1), 1.2);
      const cyan = mat(scene, new Color3(0.35, 0.9, 1), 1.0);
      // Joints of the zigzag, bottom (the fist) to top, as x, y in units of s
      const joints: [number, number][] = [[0, -0.08], [0.07, 0.12], [-0.05, 0.3], [0.08, 0.5], [-0.02, 0.68]];
      for (let k = 0; k < joints.length - 1; k++) {
        const [x0, y0] = joints[k];
        const [x1, y1] = joints[k + 1];
        const length = Math.hypot(x1 - x0, y1 - y0) * s * 1.15;
        const broad = (0.07 - 0.012 * k) * s;
        for (const [layer, material, scale, z] of [[0, white, 1, 0], [1, cyan, 1.55, -0.012]] as const) {
          const shard = MeshBuilder.CreateCylinder(`boltShard${layer}`, { height: length, diameterTop: 0, diameterBottom: broad * scale, tessellation: 4 }, scene);
          shard.scaling.z = 0.18; // pressed flat: a slab, not a spike
          shard.position.set(((x0 + x1) / 2) * s, ((y0 + y1) / 2) * s, z * s);
          shard.rotation.z = -Math.atan2(x1 - x0, y1 - y0);
          shard.material = material;
          shard.parent = bolt;
        }
      }
      return bolt;
    }
    case "fan": {
      const root = new TransformNode("fan", scene) as unknown as Mesh;
      const handle = MeshBuilder.CreateCylinder("fanHandle", { height: 0.2 * s, diameter: 0.02 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      handle.position.y = -0.04 * s;
      handle.parent = root;
      for (let i = -3; i <= 3; i++) {
        const rib = MeshBuilder.CreateBox("fanRib", { width: 0.018 * s, height: 0.22 * s, depth: 0.01 * s }, scene);
        rib.position.set(i * 0.03 * s, 0.1 * s, 0);
        rib.rotation.z = i * 0.18;
        rib.parent = root;
        rib.material = mat(scene, accent, 0.1);
      }
      return root;
    }
    case "flail": {
      const handle = MeshBuilder.CreateCylinder("flailHandle", { height: 0.35 * s, diameter: 0.03 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.45, 0.3, 0.15));
      const chain = MeshBuilder.CreateCylinder("flailChain", { height: 0.18 * s, diameter: 0.01 * s, tessellation: 4 }, scene);
      chain.position.y = 0.18 * s;
      chain.parent = handle;
      chain.material = mat(scene, new Color3(0.45, 0.45, 0.5));
      const ball = MeshBuilder.CreateSphere("flailBall", { diameter: 0.12 * s, segments: 6 }, scene);
      ball.position.y = 0.3 * s;
      ball.parent = handle;
      ball.material = mat(scene, accent);
      handle.position.y = 0.08 * s;
      return handle;
    }
    case "whip": {
      const root = new TransformNode("whip", scene) as unknown as Mesh;
      const handle = MeshBuilder.CreateCylinder("whipHandle", { height: 0.18 * s, diameter: 0.025 * s, tessellation: 6 }, scene);
      handle.material = mat(scene, new Color3(0.25, 0.15, 0.1));
      handle.parent = root;
      for (let i = 0; i < 4; i++) {
        const seg = MeshBuilder.CreateCylinder("whipSeg", { height: 0.1 * s, diameter: Math.max(0.008, 0.018 - i * 0.002) * s, tessellation: 4 }, scene);
        seg.position.set(0.02 * s * i, 0.08 * s + i * 0.07 * s, 0);
        seg.rotation.z = 0.2 + i * 0.15;
        seg.parent = root;
        seg.material = mat(scene, accent, 0.08);
      }
      return root;
    }
    case "present_box": {
      const box = MeshBuilder.CreateBox("present", { width: 0.16 * s, height: 0.16 * s, depth: 0.16 * s }, scene);
      box.material = mat(scene, accent, 0.08);
      const ribbonA = MeshBuilder.CreateBox("ribbonA", { width: 0.03 * s, height: 0.17 * s, depth: 0.17 * s }, scene);
      ribbonA.parent = box;
      ribbonA.material = mat(scene, new Color3(0.95, 0.95, 0.95));
      const ribbonB = MeshBuilder.CreateBox("ribbonB", { width: 0.17 * s, height: 0.17 * s, depth: 0.03 * s }, scene);
      ribbonB.parent = box;
      ribbonB.material = mat(scene, new Color3(0.95, 0.95, 0.95));
      box.position.y = 0.08 * s;
      return box;
    }
    case "pom_pom": {
      const root = new TransformNode("pompom", scene) as unknown as Mesh;
      for (let i = 0; i < 6; i++) {
        const puff = MeshBuilder.CreateSphere("puff", { diameter: 0.07 * s, segments: 4 }, scene);
        const angle = (Math.PI * 2 * i) / 6;
        puff.position.set(Math.cos(angle) * 0.04 * s, Math.sin(angle) * 0.04 * s + 0.08 * s, 0);
        puff.parent = root;
        puff.material = mat(scene, accent, 0.15);
      }
      return root;
    }
    default:
      return null;
  }
}

// ─── Hats ───
/** A great helm's cut: rim and crown diameters and height in the hat's own units, the height of its centre over the head top, and how far up from its centre the eye slit lies (as a share of its height) */
interface HelmFit { rim: number; crown: number; height: number; y: number; slit: number }

function buildHat(scene: Scene, type: HatType, _s: number, accent: Color3, teamColor?: Color3, helmFit?: HelmFit): Mesh | null {
  const s = _s * 1.1; // TABS-style hat exaggeration
  switch (type) {
    case "none": return null;
    case "crown": {
      const crown = MeshBuilder.CreateTorus("crown", { diameter: 0.2 * s, thickness: 0.04 * s, tessellation: 16 }, scene);
      crown.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
      // Points
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        const pt = MeshBuilder.CreateCylinder("crpt", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.04 * s, tessellation: 4 }, scene);
        pt.position.set(Math.cos(a) * 0.08 * s, 0.03 * s, Math.sin(a) * 0.08 * s);
        pt.parent = crown;
        pt.material = mat(scene, new Color3(1, 0.84, 0), 0.15);
        const jewel = MeshBuilder.CreateSphere("crjewel", { diameter: 0.025 * s, segments: 4 }, scene);
        jewel.position.y = 0.06 * s;
        jewel.parent = pt;
        jewel.material = mat(scene, new Color3(0.8, 0.1, 0.1), 0.3);
      }
      crown.position.y = 0.02 * s;
      return crown;
    }
    case "helmet":
    case "plume_helmet": {
      const helm = MeshBuilder.CreateSphere("helm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.6, 0.6, 0.65));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      if (type === "plume_helmet") {
        const plume = MeshBuilder.CreateBox("plume", { width: 0.03 * s, height: 0.15 * s, depth: 0.12 * s }, scene);
        plume.position.y = 0.1 * s;
        plume.parent = helm;
        plume.material = mat(scene, accent, 0.1);
      }
      return helm;
    }
    case "viking_helmet": {
      const helm = MeshBuilder.CreateSphere("vhelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      const noseGuard = MeshBuilder.CreateBox("nose", { width: 0.015 * s, height: 0.1 * s, depth: 0.01 * s }, scene);
      noseGuard.position.set(0, -0.02 * s, 0.1 * s);
      noseGuard.parent = helm;
      noseGuard.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      // Iconic viking horns
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("vhorn", { height: 0.22 * s, diameterTop: 0, diameterBottom: 0.055 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.1 * s, 0.08 * s, 0);
        horn.rotation.z = -side * 0.4;
        horn.parent = helm;
        horn.material = mat(scene, new Color3(0.9, 0.85, 0.7));
      }
      return helm;
    }
    case "horned_helmet": {
      const helm = MeshBuilder.CreateSphere("hhelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("horn", { height: 0.28 * s, diameterTop: 0, diameterBottom: 0.07 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.1 * s, 0.08 * s, 0);
        horn.rotation.z = -side * 0.5;
        horn.parent = helm;
        horn.material = mat(scene, new Color3(0.9, 0.85, 0.7));
      }
      return helm;
    }
    case "hood": {
      const hood = MeshBuilder.CreateCylinder("hood", { height: 0.18 * s, diameterTop: 0.04 * s, diameterBottom: 0.24 * s, tessellation: 8 }, scene);
      hood.material = mat(scene, accent.scale(0.6));
      hood.position.y = 0.07 * s;
      return hood;
    }
    case "turban": {
      const turban = MeshBuilder.CreateSphere("turban", { diameter: 0.24 * s, segments: 8 }, scene);
      turban.scaling.y = 0.7;
      turban.material = mat(scene, new Color3(0.9, 0.9, 0.85));
      turban.position.y = 0.04 * s;
      return turban;
    }
    case "conical_hat": {
      const hat = MeshBuilder.CreateCylinder("conehat", { height: 0.25 * s, diameterTop: 0, diameterBottom: 0.3 * s, tessellation: 12 }, scene);
      hat.material = mat(scene, accent.scale(0.5));
      hat.position.y = 0.08 * s;
      return hat;
    }
    case "witch_hat": {
      const brim = MeshBuilder.CreateCylinder("witchBrim", { height: 0.02 * s, diameter: 0.34 * s, tessellation: 18 }, scene);
      brim.material = mat(scene, new Color3(0.14, 0.12, 0.18));
      brim.position.y = 0.04 * s;
      const cone = MeshBuilder.CreateCylinder("witchCone", { height: 0.24 * s, diameterTop: 0.02 * s, diameterBottom: 0.18 * s, tessellation: 12 }, scene);
      cone.parent = brim;
      cone.position.set(-0.03 * s, 0.14 * s, 0);
      cone.rotation.z = 0.08;
      cone.material = mat(scene, teamColor ? teamColor.scale(0.55) : new Color3(0.15, 0.13, 0.2)); // a deep shade of the team colour: near black it was a hole in the rank
      const band = MeshBuilder.CreateTorus("witchBand", { diameter: 0.125 * s, thickness: 0.022 * s, tessellation: 18 }, scene); // 0.012 thick it was a thread round the cone
      band.parent = cone;
      band.position.y = -0.04 * s;
      band.material = mat(scene, accent, 0.08);
      return brim;
    }
    case "samurai_helmet": {
      const helm = MeshBuilder.CreateSphere("shelm", { diameter: 0.26 * s, segments: 8, slice: 0.55 }, scene);
      helm.material = mat(scene, accent.scale(0.7));
      helm.rotation.x = Math.PI;
      helm.position.y = 0.05 * s;
      const neckGuard = MeshBuilder.CreateBox("samuraiNeckGuard", { width: 0.24 * s, height: 0.08 * s, depth: 0.03 * s }, scene);
      neckGuard.position.set(0, -0.04 * s, -0.1 * s);
      neckGuard.parent = helm;
      neckGuard.material = mat(scene, accent.scale(0.55));
      const faceGuard = MeshBuilder.CreateBox("samuraiFaceGuard", { width: 0.08 * s, height: 0.07 * s, depth: 0.03 * s }, scene);
      faceGuard.position.set(0, -0.03 * s, 0.11 * s);
      faceGuard.parent = helm;
      faceGuard.material = mat(scene, accent.scale(0.6));
      const crest = MeshBuilder.CreateDisc("crest", { radius: 0.14 * s, tessellation: 18, arc: 0.5 }, scene);
      crest.position.y = 0.13 * s;
      crest.parent = helm;
      crest.rotation.z = Math.PI;
      crest.material = mat(scene, new Color3(1, 0.84, 0), 0.1);
      return helm;
    }
    case "ninja_mask": {
      // Hood covering head
      const hood = MeshBuilder.CreateSphere("hood", { diameter: 0.27 * s, segments: 8 }, scene);
      hood.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      hood.position.y = 0.02 * s;
      // Metal headband/plate
      const plate = MeshBuilder.CreateBox("plate", { width: 0.2 * s, height: 0.035 * s, depth: 0.01 * s }, scene);
      plate.position.set(0, 0.02 * s, 0.12 * s);
      plate.parent = hood;
      plate.material = mat(scene, new Color3(0.55, 0.55, 0.6), 0.15);
      // Face wrap (covers lower face)
      const wrap = MeshBuilder.CreateBox("wrap", { width: 0.18 * s, height: 0.08 * s, depth: 0.14 * s }, scene);
      wrap.position.set(0, -0.06 * s, 0.04 * s);
      wrap.parent = hood;
      wrap.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      // Trailing cloth (bandana tail)
      const trail = MeshBuilder.CreateBox("trail", { width: 0.06 * s, height: 0.04 * s, depth: 0.18 * s }, scene);
      trail.position.set(0, 0.0, -0.16 * s);
      trail.parent = hood;
      trail.material = mat(scene, new Color3(0.15, 0.15, 0.18));
      return hood;
    }
    case "tricorn": {
      const brim = MeshBuilder.CreateCylinder("brim", { height: 0.02 * s, diameter: 0.32 * s, tessellation: 3 }, scene);
      brim.material = mat(scene, new Color3(0.15, 0.15, 0.15));
      brim.position.y = 0.03 * s;
      const top = MeshBuilder.CreateBox("trictop", { width: 0.14 * s, height: 0.1 * s, depth: 0.14 * s }, scene);
      top.position.y = 0.06 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.15, 0.15, 0.15));
      return brim;
    }
    case "pirate_hat":
    case "captain_hat": {
      const brim = MeshBuilder.CreateCylinder("pbrim", { height: 0.02 * s, diameter: 0.3 * s, tessellation: 16 }, scene);
      brim.material = mat(scene, new Color3(0.12, 0.12, 0.12));
      brim.position.y = 0.03 * s;
      const top = MeshBuilder.CreateBox("ptop", { width: 0.2 * s, height: 0.12 * s, depth: 0.16 * s }, scene);
      top.position.y = 0.07 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.12, 0.12, 0.12));
      if (type === "captain_hat") {
        const badge = MeshBuilder.CreateSphere("badge", { diameter: 0.04 * s }, scene);
        badge.position.set(0, 0.06 * s, 0.09 * s); badge.parent = brim;
        badge.material = mat(scene, new Color3(1, 0.84, 0), 0.2);
      }
      return brim;
    }
    case "bandana": {
      const band = MeshBuilder.CreateTorus("bandana", { diameter: 0.22 * s, thickness: 0.03 * s, tessellation: 16 }, scene);
      band.material = mat(scene, accent);
      band.position.y = 0.01 * s;
      return band;
    }
    case "cowboy_hat": {
      const brim = MeshBuilder.CreateCylinder("cowboyBrim", { height: 0.02 * s, diameter: 0.34 * s, tessellation: 18 }, scene);
      brim.material = mat(scene, new Color3(0.22, 0.15, 0.1));
      brim.position.y = 0.04 * s;
      const crown = MeshBuilder.CreateCylinder("cowboyCrown", { height: 0.12 * s, diameterTop: 0.14 * s, diameterBottom: 0.18 * s, tessellation: 14 }, scene);
      crown.position.y = 0.08 * s;
      crown.parent = brim;
      crown.material = mat(scene, new Color3(0.24, 0.17, 0.11));
      const band = MeshBuilder.CreateTorus("cowboyBand", { diameter: 0.17 * s, thickness: 0.012 * s, tessellation: 16 }, scene);
      band.position.y = 0.01 * s;
      band.parent = crown;
      band.material = mat(scene, accent, 0.05);
      return brim;
    }
    case "miner_hat": {
      const brim = MeshBuilder.CreateCylinder("minerBrim", { height: 0.025 * s, diameter: 0.28 * s, tessellation: 16 }, scene);
      brim.material = mat(scene, new Color3(0.2, 0.14, 0.1));
      const crown = MeshBuilder.CreateCylinder("minerCrown", { height: 0.12 * s, diameterTop: 0.18 * s, diameterBottom: 0.22 * s, tessellation: 12 }, scene);
      crown.parent = brim;
      crown.position.y = 0.07 * s;
      crown.material = mat(scene, new Color3(0.22, 0.16, 0.12));
      const lamp = MeshBuilder.CreateCylinder("minerLamp", { height: 0.03 * s, diameter: 0.08 * s, tessellation: 12 }, scene);
      lamp.parent = brim;
      lamp.position.set(0, 0.04 * s, 0.12 * s);
      lamp.rotation.x = Math.PI / 2;
      lamp.material = mat(scene, new Color3(0.7, 0.7, 0.74));
      const glow = MeshBuilder.CreateSphere("minerLampGlow", { diameter: 0.04 * s, segments: 6 }, scene);
      glow.parent = lamp;
      glow.position.z = 0.02 * s;
      glow.material = mat(scene, new Color3(1, 0.8, 0.25), 0.4);
      return brim;
    }
    case "straw_hat": {
      const brim = MeshBuilder.CreateCylinder("sbrim", { height: 0.015 * s, diameter: 0.35 * s, tessellation: 16 }, scene);
      brim.material = mat(scene, new Color3(0.85, 0.78, 0.45));
      brim.position.y = 0.04 * s;
      const top = MeshBuilder.CreateCylinder("stop", { height: 0.08 * s, diameter: 0.16 * s, tessellation: 12 }, scene);
      top.position.y = 0.04 * s; top.parent = brim;
      top.material = mat(scene, new Color3(0.85, 0.78, 0.45));
      return brim;
    }
    case "beret": {
      const beret = MeshBuilder.CreateSphere("beret", { diameter: 0.22 * s, segments: 8 }, scene);
      beret.scaling.y = 0.4;
      beret.material = mat(scene, accent);
      beret.position.y = 0.06 * s;
      return beret;
    }
    case "laurel": {
      // A cap of brown hair over the crown and the back of the head, with the wreath resting on it tipped up at the back,
      // so the head is not bald under a sweatband.
      const hair = MeshBuilder.CreateIcoSphere("laurelHair", { radiusX: 0.068 * s, radiusY: 0.075 * s, radiusZ: 0.08 * s, subdivisions: 1, flat: true }, scene);
      // The face is bare below the brow (tabs_screenshot_04: two eyes on a plain head): the cap's front is cut back to its own middle under the wreath, or its lowest
      // front facet broke through the face below the eyes as a dark "o" of a mouth.
      const hairAt = hair.getVerticesData(VertexBuffer.PositionKind);
      if (hairAt) {
        for (let i = 0; i < hairAt.length; i += 3) {
          if (hairAt[i + 1] < 0.02 * s && hairAt[i + 2] > 0) hairAt[i + 2] = 0;
        }
        hair.setVerticesData(VertexBuffer.PositionKind, hairAt);
        const normals: number[] = [];
        VertexData.ComputeNormals(hairAt, hair.getIndices() ?? [], normals);
        hair.setVerticesData(VertexBuffer.NormalKind, normals);
        hair.refreshBoundingInfo();
      }
      hair.material = mat(scene, new Color3(0.36, 0.22, 0.1));
      hair.position.set(0, -0.05 * s, -0.03 * s);
      const laurel = MeshBuilder.CreateTorus("laurel", { diameter: 0.125 * s, thickness: 0.022 * s, tessellation: 6 }, scene);
      laurel.material = mat(scene, new Color3(0.35, 0.45, 0.18), 0.1);
      laurel.parent = hair;
      laurel.position.set(0, 0.028 * s, 0.015 * s); // on the brow, clear of the eye discs: at 0.005 and tipped 0.25 its front lay across them
      laurel.rotation.x = 0.1;
      return hair;
    }
    case "feather_headdress": {
      const base = MeshBuilder.CreateTorus("fbase", { diameter: 0.22 * s, thickness: 0.025 * s, tessellation: 16 }, scene);
      base.material = mat(scene, accent);
      base.position.y = 0.02 * s;
      for (let i = 0; i < 5; i++) {
        const feather = MeshBuilder.CreateBox("feather", { width: 0.015 * s, height: 0.18 * s, depth: 0.005 * s }, scene);
        feather.position.y = 0.1 * s;
        feather.position.x = (i - 2) * 0.035 * s;
        feather.rotation.z = (i - 2) * 0.15;
        feather.parent = base;
        const c = i % 2 === 0 ? new Color3(0.9, 0.2, 0.1) : new Color3(0.2, 0.7, 0.2);
        feather.material = mat(scene, c);
      }
      return base;
    }
    case "bone_mask": {
      const mask = MeshBuilder.CreateSphere("bmask", { diameter: 0.24 * s, segments: 6 }, scene);
      mask.scaling.z = 0.6;
      mask.material = mat(scene, new Color3(0.92, 0.88, 0.8));
      mask.position.y = -0.02 * s;
      mask.position.z = 0.02 * s;
      return mask;
    }
    case "pharaoh": {
      const head = MeshBuilder.CreateBox("pharaoh", { width: 0.2 * s, height: 0.22 * s, depth: 0.15 * s }, scene);
      head.material = mat(scene, new Color3(0.8, 0.7, 0.3), 0.1);
      head.position.y = 0.06 * s;
      const flapColor = mat(scene, new Color3(0.1, 0.18, 0.45));
      for (const side of [-1, 1]) {
        const flap = MeshBuilder.CreateBox("pharaohFlap", { width: 0.06 * s, height: 0.2 * s, depth: 0.02 * s }, scene);
        flap.position.set(side * 0.12 * s, -0.01 * s, 0.03 * s);
        flap.rotation.z = -side * 0.15;
        flap.parent = head;
        flap.material = flapColor;
      }
      const cobra = MeshBuilder.CreateCylinder("pharaohCobra", { height: 0.08 * s, diameterTop: 0, diameterBottom: 0.04 * s, tessellation: 6 }, scene);
      cobra.position.set(0, 0.14 * s, 0.08 * s);
      cobra.parent = head;
      cobra.material = mat(scene, new Color3(0.9, 0.78, 0.28), 0.08);
      for (const stripeY of [0.04 * s, -0.03 * s]) {
        const stripe = MeshBuilder.CreateBox("pharaohStripe", { width: 0.18 * s, height: 0.018 * s, depth: 0.012 * s }, scene);
        stripe.position.set(0, stripeY, 0.082 * s);
        stripe.parent = head;
        stripe.material = flapColor;
      }
      return head;
    }
    case "great_helm": {
      // Fitted barrel helm: a tall, faceted, slightly tapered bucket pulled down over the head to the shoulders, cut from the head it covers. Off a body with no head
      // to measure it keeps the old stock cut.
      const fit = helmFit ?? { rim: 0.164 * s, crown: 0.14 * s, height: 0.156 * s, y: -0.065 * s, slit: -0.09 };
      const helm = MeshBuilder.CreateCylinder("ghelm", { height: fit.height, diameterTop: fit.crown, diameterBottom: fit.rim, tessellation: 8 }, scene);
      // Turn a flat facet to the front so the eye slit lies on a face, not across an edge
      helm.rotation.y = Math.PI / 8;
      helm.bakeCurrentTransformIntoVertices();
      helm.convertToFlatShadedMesh();
      // Bare steel like the open helmet, with only a breath of team colour: the helm is gear, not skin, and any heavier
      // wash turns it into the lightest team-coloured block on the unit
      const steel = new Color3(0.6, 0.6, 0.65);
      helm.material = mat(scene, teamColor ? Color3.Lerp(steel, teamColor, 0.12) : steel);
      helm.position.y = fit.y;
      // Eye slit: a bold dark bar across the front facet that wraps onto the two facets beside it, at the height of the eyes behind it
      const slitMat = mat(scene, new Color3(0.08, 0.08, 0.08));
      const slitY = fit.slit * fit.height;
      const faceR = (fit.rim + (fit.crown - fit.rim) * (0.5 + fit.slit)) * 0.5 * Math.cos(Math.PI / 8);
      const facet = faceR * 2 * Math.tan(Math.PI / 8);
      const slitH = facet * 0.4;
      const slitD = facet * 0.16;
      const slit = MeshBuilder.CreateBox("slit", { width: facet, height: slitH, depth: slitD }, scene);
      slit.position.set(0, slitY, faceR); slit.parent = helm;
      slit.material = slitMat;
      for (const side of [-1, 1]) {
        const wrap = MeshBuilder.CreateBox("slitWrap", { width: facet * 0.49, height: slitH, depth: slitD }, scene);
        const along = facet * 0.26;
        wrap.position.set(side * Math.SQRT1_2 * (faceR - along), slitY, Math.SQRT1_2 * (faceR + along));
        wrap.rotation.y = side * Math.PI / 4;
        wrap.parent = helm;
        wrap.material = slitMat;
      }
      return helm;
    }
    case "hood_liripipe": {
      // Cone hood with trailing cloth tail
      const hood = MeshBuilder.CreateCylinder("hood", {
        height: 0.18 * s, diameterTop: 0, diameterBottom: 0.22 * s, tessellation: 10,
      }, scene);
      hood.material = mat(scene, accent);
      hood.position.y = 0.07 * s;
      // Liripipe tail hanging behind
      const tail = MeshBuilder.CreateBox("liripipe", { width: 0.03 * s, height: 0.22 * s, depth: 0.02 * s }, scene);
      tail.position.set(0, -0.06 * s, -0.08 * s); tail.parent = hood;
      tail.rotation.x = 0.4;
      tail.material = mat(scene, accent);
      return hood;
    }
    case "jester_cap": {
      const base = MeshBuilder.CreateSphere("jesterCap", { diameter: 0.28 * s, segments: 6 }, scene);
      base.scaling.y = 0.55;
      base.material = mat(scene, accent, 0.05);
      base.position.y = 0.08 * s;
      for (const side of [-1, 1]) {
        const horn = MeshBuilder.CreateCylinder("jesterHorn", { height: 0.24 * s, diameterTop: 0.015 * s, diameterBottom: 0.06 * s, tessellation: 6 }, scene);
        horn.position.set(side * 0.08 * s, 0.1 * s, 0);
        horn.rotation.z = -side * 0.7;
        horn.parent = base;
        horn.material = mat(scene, accent.scale(0.8));
        const bell = MeshBuilder.CreateSphere("jesterBell", { diameter: 0.03 * s, segments: 4 }, scene);
        bell.position.y = 0.1 * s;
        bell.parent = horn;
        bell.material = mat(scene, new Color3(1, 0.84, 0), 0.2);
      }
      return base;
    }
    default:
      return null;
  }
}

// ─── Shields ───
/*
 * Round boards are each their own (242 [R]; tabs_screenshot_06: in a wall no two boards show one face): the wood a shade off by up to ROUND_SHADE either way, and one
 * of ROUND_FACES painted faces (planks with 2-4 seams, quartered, a band round the boss) in ROUND_PAINT of the wood, turned to the board's own angle. Seeded by the
 * order boards are built in, so a scenario builds the same wall every run.
 */
const ROUND_FACES = 3;
const ROUND_SHADE = 0.12;
const ROUND_PAINT = 1.45;
let roundBoardSerial = 0;
// The protector's plank shield (units/tribal.protector), in the shield's own units before the 1.9 carry scale: width and height (the render: about half as wide as
// tall, shin to over the crown), the face opening across and how far above the middle it sits (as a share of the height)
const SLAB_WIDE = 0.34;
const SLAB_TALL = 0.71;
const SLAB_EYE = 0.12;
const SLAB_EYE_UP = 0.22;
// ...and its moss (tribal.protector.blue.png): two faceted green chunks grown on the face, a long one draped over the top corner beside the opening and a
// small one at the bottom edge, each a chunk this big (prop units) and stood proud of the planks by SLAB_MOSS.proud so it reads with the shield edge-on
const SLAB_MOSS = { top: 0.13, bottom: 0.08, proud: 0.03 };
let slabSerial = 0;
/*
 * The painter's palette (328; renaissance.painter.jpg: a big flat red-brown kidney board wider than the torso, held out from the shoulder at chest height
 * on the off hand, a thumb hole by a notch cut in its inner edge, three fat smears of team paint on its face). Not an oval at the hip: the old board was a
 * plain brown disc low by the thigh. Board PALETTE_WIDE across in its own units before the prop oversize, PALETTE.deep of that tall; notch PALETTE.notch of
 * the half width deep; hole PALETTE.hole across; daubs PALETTE.daub across, PALETTE.proud off the face. Tipped PALETTE_TIP face-up and turned PALETTE_TURN
 * out in the hand; the arm that holds it up is the animator's PALETTE_HOLD.
 */
const PALETTE = { deep: 0.74, notch: 0.42, hole: 0.15, daub: 0.27, proud: 0.012, thick: 0.016 };
const PALETTE_WIDE = 0.34;
const PALETTE_TIP = -1.0;
const PALETTE_TURN = 0.4;
function roundBoardSeed(serial: number, k: number): number {
  const x = Math.sin(serial * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const HEATER = { wide: 0.26, tall: 0.36, side: 0.35, rim: 0.012, thick: 0.025 };
const HEATER_YELLOW = new Color3(0.95, 0.72, 0.12);
const HEATER_RIM = new Color3(0.62, 0.42, 0.08);
function buildShield(scene: Scene, type: ShieldType, s: number, accent: Color3, teamColor: Color3): Mesh | null {
  // A cool team colour is held as deep as the plate behind it and not washed with white: the sky-blue team colour paled is a slate board.
  const teamHsv = teamColor.toHSV();
  const cool = teamHsv.r > 150 && teamHsv.r < 300;
  // A cool board is turned 15 toward royal blue (30 was a violet board beside a royal-blue tabard) and nearly fully saturated: the sky-blue team colour itself is a cyan.
  if (cool) teamColor = Color3.HSVtoRGBToRef(teamHsv.r + 15, Math.max(teamHsv.g, 0.95), teamHsv.b * 0.72, new Color3()); // and darker than the cloth beside it: at the team value the board outshone the tabard
  const board = cool ? teamColor : Color3.Lerp(teamColor, Color3.White(), 0.12);
  switch (type) {
    case "none": return null;
    case "heater": {
      // The jouster's heater (329; renaissance.jouster.red.png: a plain yellow board on the off arm, whatever the team): a flat top HEATER.wide across, the sides
      // straight down HEATER.side of the height and then bowed in to a point, HEATER.tall high, on a darker rim HEATER.rim proud all round it. Face toward +Z.
      const outline = (grow: number): number[][] => {
        const w = HEATER.wide * 0.5 + grow, top = HEATER.tall * 0.5 + grow, bottom = -HEATER.tall * 0.5 - grow * 1.4, shoulder = top - (HEATER.tall + grow * 2) * HEATER.side;
        const pts: number[][] = [[-w, top], [w, top]];
        for (let k = 0; k <= 6; k++) {
          const t = k / 6;
          pts.push([w * Math.cos(t * Math.PI * 0.5), shoulder + (bottom - shoulder) * Math.sin(t * Math.PI * 0.5)]);
        }
        for (let k = 5; k >= 0; k--) {
          const t = k / 6;
          pts.push([-w * Math.cos(t * Math.PI * 0.5), shoulder + (bottom - shoulder) * Math.sin(t * Math.PI * 0.5)]);
        }
        return pts.map(([x, y]) => [x * s, y * s]);
      };
      const shield = flatPlate(scene, "hshield", outline(0), HEATER.thick * s);
      shield.material = mat(scene, HEATER_YELLOW, 0.12);
      const rim = flatPlate(scene, "hshieldRim", outline(HEATER.rim), HEATER.thick * 0.6 * s);
      rim.position.z = -HEATER.thick * 0.5 * s;
      rim.material = mat(scene, HEATER_RIM, 0.08);
      rim.parent = shield;
      return shield;
    }
    case "round": {
      // Faceted disc standing upright, face toward +Z: team-colored board, dark rim, metal boss
      const disc = (name: string, diameter: number, depth: number): Mesh => {
        const m = MeshBuilder.CreateCylinder(name, { height: depth * s, diameter: diameter * s, tessellation: 10 }, scene);
        m.rotation.x = Math.PI / 2;
        m.bakeCurrentTransformIntoVertices();
        return m;
      };
      // Each board its own (see ROUND_FACES): its wood a shade off its neighbours', and one of the painted faces turned to its own angle
      const r = (k: number) => roundBoardSeed(roundBoardSerial, k);
      roundBoardSerial++;
      const own = board.scale(1 - ROUND_SHADE + r(1) * ROUND_SHADE * 2);
      const shield = disc("rshield", 0.36, 0.03);
      shield.material = mat(scene, own);
      const rim = disc("rshieldRim", 0.4, 0.022);
      rim.position.z = -0.006 * s;
      rim.parent = shield;
      rim.material = mat(scene, teamColor.scale(0.45));
      const face = new TransformNode("rshieldFace", scene);
      face.parent = shield;
      face.rotation.z = r(2) * Math.PI;
      const paint = mat(scene, own.scale(ROUND_PAINT));
      const pick = Math.floor(r(3) * ROUND_FACES);
      if (pick === 1) {
        // Quartered: two opposite quarters painted over the wood
        for (const q of [0, Math.PI]) {
          const quarter = MeshBuilder.CreateCylinder("rshieldQuarter", { height: 0.006 * s, diameter: 0.34 * s, tessellation: 12, arc: 0.25, enclose: true }, scene);
          quarter.rotation.x = Math.PI / 2;
          quarter.bakeCurrentTransformIntoVertices();
          quarter.rotation.z = q;
          quarter.position.z = 0.016 * s;
          quarter.parent = face;
          quarter.material = paint;
        }
      } else if (pick === 2) {
        // A painted band round the boss
        const band = disc("rshieldBand", 0.27, 0.006);
        band.position.z = 0.015 * s;
        band.parent = face;
        band.material = paint;
        const inner = disc("rshieldInner", 0.17, 0.006);
        inner.position.z = 0.017 * s;
        inner.parent = face;
        inner.material = shield.material;
      } else {
        // Planks: two to four dark seams across the board at its own angle, each cut to the disc's chord at that offset
        const seams = 2 + Math.floor(r(4) * 3);
        for (let i = 0; i < seams; i++) {
          const x = (i - (seams - 1) / 2) * (0.3 / (seams + 1));
          const chord = 2 * Math.sqrt(Math.max(0, 0.18 * 0.18 - x * x)) * 0.95;
          const seam = MeshBuilder.CreateBox("rshieldSeam", { width: 0.008 * s, height: chord * s, depth: 0.006 * s }, scene);
          seam.position.set(x * s, 0, 0.015 * s);
          seam.parent = face;
          seam.material = rim.material;
        }
      }
      const boss = MeshBuilder.CreateSphere("boss", { diameter: 0.09 * s, segments: 4 }, scene);
      boss.position.z = 0.016 * s; boss.parent = shield;
      boss.material = mat(scene, new Color3(0.45, 0.45, 0.5));
      return shield;
    }
    case "kite": {
      const shield = MeshBuilder.CreateBox("kshield", { width: 0.18 * s, height: 0.32 * s, depth: 0.025 * s }, scene);
      shield.material = mat(scene, board);
      // Short point pressed as flat as the board and turned a quarter (diameter is corner to corner, hence SQRT2), so a flat
      // triangle faces forward and not a ridge
      const point = MeshBuilder.CreateCylinder("kpoint", { height: 0.13 * s, diameterTop: 0.18 * Math.SQRT2 * s, diameterBottom: 0, tessellation: 4 }, scene);
      point.rotation.y = Math.PI / 4;
      point.bakeCurrentTransformIntoVertices();
      point.position.y = -0.225 * s;
      point.scaling.z = 0.14;
      point.parent = shield;
      point.material = shield.material;
      // Dark rim showing round the board and its point, and a metal boss on the face, as on the round shield
      const rim = MeshBuilder.CreateBox("kshieldRim", { width: 0.22 * s, height: 0.36 * s, depth: 0.018 * s }, scene);
      rim.position.z = -0.006 * s;
      rim.parent = shield;
      rim.material = mat(scene, new Color3(0.85, 0.83, 0.78), 0, "stone"); // a pale band: in the darkened team colour it did not show against the board
      const rimPoint = MeshBuilder.CreateCylinder("kpointRim", { height: 0.17 * s, diameterTop: 0.22 * Math.SQRT2 * s, diameterBottom: 0, tessellation: 4 }, scene);
      rimPoint.rotation.y = Math.PI / 4;
      rimPoint.bakeCurrentTransformIntoVertices();
      rimPoint.position.set(0, -0.265 * s, -0.006 * s);
      rimPoint.scaling.z = 0.08;
      rimPoint.parent = shield;
      rimPoint.material = rim.material;
      // A pale cross on the face in place of a boss (units/medieval.knight): the upright from near the top down into the point, the arm across the upper third
      const cross = mat(scene, new Color3(0.93, 0.87, 0.74), 0.05);
      for (const [w, h, y] of [[0.04, 0.38, -0.04], [0.15, 0.04, 0.0]]) {
        const bar = MeshBuilder.CreateBox("kcross", { width: w * s, height: h * s, depth: 0.008 * s }, scene);
        bar.position.set(0, y * s, 0.015 * s);
        bar.parent = shield;
        bar.material = cross;
      }
      return shield;
    }
    case "tower": {
      const shield = MeshBuilder.CreateBox("tshield", { width: 0.22 * s, height: 0.4 * s, depth: 0.03 * s }, scene);
      shield.material = mat(scene, board);
      const boss = MeshBuilder.CreateSphere("towerBoss", { diameter: 0.06 * s, segments: 6 }, scene);
      boss.position.z = -0.02 * s;
      boss.parent = shield;
      boss.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      for (const bandY of [-0.09 * s, 0.09 * s]) {
        const band = MeshBuilder.CreateBox("towerBand", { width: 0.21 * s, height: 0.02 * s, depth: 0.01 * s }, scene);
        band.position.set(0, bandY, -0.016 * s);
        band.parent = shield;
        band.material = mat(scene, new Color3(0.56, 0.42, 0.22));
      }
      return shield;
    }
    case "slab": {
      // The protector's plank shield (units/tribal.protector, spec at SLAB_WIDE): four rough planks side by side, SLAB_TALL tall and SLAB_WIDE wide, their
      // tops cut to a slant at different heights, bare brown wood with no team colour in it, and a round opening SLAB_EYE across at face height
      // (SLAB_EYE_UP of the height above the middle) that the two middle planks stop short of above and below, framed by an eight-sided ring. The root is an
      // empty node, so the opening is a true hole and his face shows through it. The face is +z; two battens hold the planks on the back.
      const wood = new Color3(0.6, 0.36, 0.22);
      const r = (k: number) => roundBoardSeed(slabSerial + 0.5, k);
      slabSerial++;
      const shield = new Mesh("slabshield", scene);
      const W = SLAB_WIDE * s, H = SLAB_TALL * s, eye = SLAB_EYE * s, eyeY = SLAB_EYE_UP * H;
      const plankW = W / 4;
      for (let i = 0; i < 4; i++) {
        const x = (i - 1.5) * plankW;
        const shade = mat(scene, wood.scale(0.9 + r(i + 1) * 0.2), 0.1);
        // Each plank its own length and shade; its top a wedge. The middle two are a lower and an upper board with the opening between them.
        const top = H * (0.44 + r(i + 5) * 0.06);
        const pieces: [number, number][] = i === 1 || i === 2 ? [[-H * 0.5, eyeY - eye * 0.5], [eyeY + eye * 0.5, top]] : [[-H * 0.5, top]];
        for (const [y0, y1] of pieces) {
          const plank = MeshBuilder.CreateBox("slabPlank", { width: plankW * 0.96, height: y1 - y0, depth: 0.045 * s }, scene);
          plank.position.set(x, (y0 + y1) * 0.5, 0);
          plank.material = shade;
          plank.parent = shield;
        }
        const cap = MeshBuilder.CreateCylinder("slabCap", { height: plankW * 0.96, diameter: 0.064 * s, tessellation: 3 }, scene);
        cap.rotation.z = Math.PI / 2;
        cap.scaling.z = 0.7;
        cap.position.set(x, top, 0);
        cap.material = shade;
        cap.parent = shield;
      }
      const ring = MeshBuilder.CreateTorus("slabEye", { diameter: eye * 1.3, thickness: eye * 0.3, tessellation: 8 }, scene);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, eyeY, 0);
      ring.material = mat(scene, wood.scale(0.75), 0.08);
      ring.parent = shield;
      const batten = mat(scene, wood.scale(0.7), 0.06);
      for (const y of [0.3, -0.3]) {
        const bar = MeshBuilder.CreateBox("slabBatten", { width: W * 1.02, height: 0.035 * s, depth: 0.03 * s }, scene);
        bar.position.set(0, y * H, -0.035 * s);
        bar.material = batten;
        bar.parent = shield;
      }
      // Moss (spec at SLAB_MOSS): irregular faceted lumps, one lying along the top corner on the side away from the opening and slanted down toward it, one
      // clinging to the bottom edge on the other side; both stand off the face. Self-lit a little: a plain green went near-black in the field's shade.
      const moss = mat(scene, new Color3(0.4, 0.5, 0.2), 0.15, "stone");
      const lumps: [number, number, number, number, number, number][] = [
        [0.28 * W, H * 0.45, SLAB_MOSS.top * s, 1.7, 0.6, -0.45],
        [-0.36 * W, -H * 0.44, SLAB_MOSS.bottom * s, 1.2, 0.8, 0.3],
      ];
      for (let i = 0; i < lumps.length; i++) {
        const [x, y, size, wide, tall, roll] = lumps[i];
        const lump = MeshBuilder.CreateIcoSphere("slabMoss", { radius: size * 0.5, subdivisions: 1, flat: true }, scene);
        // Knobbly, not a ball: every vertex pushed in or out by its own hashed share
        const at = lump.getVerticesData(VertexBuffer.PositionKind);
        if (at) {
          for (let v = 0; v < at.length; v += 3) {
            const k = 0.8 + 0.4 * roundBoardSeed(slabSerial + i, Math.round(at[v] * 97 + at[v + 1] * 57 + at[v + 2] * 31));
            at[v] *= k; at[v + 1] *= k; at[v + 2] *= k;
          }
          lump.setVerticesData(VertexBuffer.PositionKind, at);
          const normals: number[] = [];
          VertexData.ComputeNormals(at, lump.getIndices() ?? [], normals);
          lump.setVerticesData(VertexBuffer.NormalKind, normals);
          lump.refreshBoundingInfo();
        }
        lump.scaling.set(wide, tall, 0.7);
        lump.rotation.z = roll;
        lump.position.set(x, y, SLAB_MOSS.proud * s + size * 0.2);
        lump.material = moss;
        lump.parent = shield;
      }
      return shield;
    }
    case "palette": {
      // The painter's palette (255; units/renaissance.painter): a flat red-brown kidney board about a torso across, a thumb hole near its inner edge, three daubs
      // of team paint on its face. Held out flat beside the hip, tipped face-up toward the viewer.
      // Built to the spec at PALETTE: an oval outline in the x-y plane (face +z), pinched in to a notch on its inner (-x) upper edge by the thumb hole
      const rx = PALETTE_WIDE * s * 0.5, ry = rx * PALETTE.deep;
      const outline: number[][] = [];
      for (let k = 0; k < 22; k++) {
        const a = (k / 22) * Math.PI * 2;
        // The notch: a smooth dent centred at 160 degrees (inner side, a little above the middle)
        const off = Math.atan2(Math.sin(a - 2.8), Math.cos(a - 2.8));
        const dent = 1 - PALETTE.notch * Math.exp(-(off * off) / 0.09);
        outline.push([Math.cos(a) * rx * dent, Math.sin(a) * ry * dent]);
      }
      const shield = flatPlate(scene, "palette", outline, PALETTE.thick * s);
      shield.material = mat(scene, new Color3(0.66, 0.3, 0.22), 0.12);
      // The thumb hole beside the notch, dark on both faces
      const hole = MeshBuilder.CreateCylinder("paletteHole", { height: PALETTE.thick * 1.3 * s, diameter: PALETTE.hole * PALETTE_WIDE * s, tessellation: 8 }, scene);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(-rx * 0.45, ry * 0.3, 0);
      hole.material = mat(scene, new Color3(0.16, 0.08, 0.06));
      hole.parent = shield;
      // Three smears of team paint standing proud of the face, flattened and turned each its own way; laid on both faces, as the hand turns either one out
      for (const face of [1, -1]) for (const [x, y, turn, k] of [[0.05, 0.42, 0.4, 0.75], [0.2, -0.38, -0.3, 1.0], [0.6, 0.05, 1.3, 0.55]]) {
        const daub = MeshBuilder.CreateSphere("paletteDaub", { diameter: PALETTE.daub * PALETTE_WIDE * s, segments: 4 }, scene);
        daub.scaling.set(1.4, 0.7, 0.3);
        daub.rotation.z = turn;
        daub.position.set(x * rx, y * ry, face * (PALETTE.thick * 0.5 + PALETTE.proud * 0.5) * s);
        daub.material = mat(scene, Color3.Lerp(teamColor, Color3.White(), 0.15).scale(k + 0.2), 0.12);
        daub.parent = shield;
      }
      return shield;
    }
    case "buckler": {
      const shield = MeshBuilder.CreateCylinder("buckler", { height: 0.02 * s, diameter: 0.18 * s, tessellation: 12 }, scene);
      shield.rotation.x = Math.PI / 2;
      shield.material = mat(scene, new Color3(0.5, 0.5, 0.55));
      const boss = MeshBuilder.CreateSphere("bucklerBoss", { diameter: 0.05 * s, segments: 6 }, scene);
      boss.position.z = -0.015 * s;
      boss.parent = shield;
      boss.material = mat(scene, new Color3(0.7, 0.7, 0.75));
      const rim = MeshBuilder.CreateTorus("bucklerRim", { diameter: 0.18 * s, thickness: 0.012 * s, tessellation: 14 }, scene);
      rim.parent = shield;
      rim.material = mat(scene, new Color3(0.65, 0.65, 0.7));
      return shield;
    }
    default:
      return null;
  }
}

/** Feathered wings (units/viking.valkyrie): each wing a brown leading-edge bar this many torso heights long, raised WING_RAISE and swept WING_SWEEP back off the upper back */
const WING_SPAN = 2.4;
const WING_RAISE = 0.5;
const WING_SWEEP = 0.3;
/** Primary feathers hung under the bar: count, length (share of the bar, growing toward the tip) and their fan from straight down at the root to out along the bar at the tip */
const WING_FEATHERS = 7;
const WING_FEATHER_LEN = [0.32, 0.62];
const WING_FEATHER_FAN = [0.35, 1.25];

/**
 * Two big faceted white feather wings on the back, angled up and out (units/viking.valkyrie, tabs_screenshot_06): a brown bar along each leading edge, a pale covert
 * slab under it and a fan of flat pointed feathers below that, longest toward the tip, whose stepped points make the notched trailing edge. Sized off the torso it hangs
 * on, so the pair spans several torsos and stands over the head at lineup distance.
 */
function buildFeatherWings(scene: Scene, body: ArticulatedBody): void {
  const torsoH = body.torsoMesh.position.y * 2;
  const L = torsoH * WING_SPAN;
  const featherMat = mat(scene, new Color3(0.8, 0.9, 0.98), 0.04);
  const covertMat = mat(scene, new Color3(0.9, 0.95, 1.0), 0.04);
  const barMat = mat(scene, new Color3(0.42, 0.29, 0.19));
  for (const side of [-1, 1]) {
    const root = new TransformNode("wingRoot", scene);
    root.parent = body.torso;
    root.position.set(side * torsoH * 0.18, torsoH * 0.82, -torsoH * 0.3);
    root.rotation.set(0, side * WING_SWEEP, side * WING_RAISE);
    const bar = MeshBuilder.CreateBox("wingBar", { width: L, height: torsoH * 0.11, depth: torsoH * 0.07 }, scene);
    bar.parent = root;
    bar.position.x = side * L * 0.5;
    bar.material = barMat;
    const covert = MeshBuilder.CreateCylinder("wingCovert", { height: L * 0.95, diameterTop: torsoH * 1.0, diameterBottom: torsoH * 0.35, tessellation: 4 }, scene);
    covert.rotation.z = -side * Math.PI / 2;
    covert.bakeCurrentTransformIntoVertices();
    covert.scaling.z = 0.12;
    covert.parent = root;
    covert.position.set(side * L * 0.5, -torsoH * 0.3, -torsoH * 0.01);
    covert.material = covertMat;
    for (let i = 0; i < WING_FEATHERS; i++) {
      const t = (i + 1) / WING_FEATHERS;
      const len = L * (WING_FEATHER_LEN[0] + (WING_FEATHER_LEN[1] - WING_FEATHER_LEN[0]) * t);
      const a = WING_FEATHER_FAN[0] + (WING_FEATHER_FAN[1] - WING_FEATHER_FAN[0]) * t;
      const feather = MeshBuilder.CreateCylinder("wingFeather", { height: len, diameterTop: 0, diameterBottom: torsoH * 0.75, tessellation: 4 }, scene);
      feather.scaling.z = 0.1;
      feather.parent = root;
      // Its point down and out: the cylinder's +y turned onto (side * sin a, -cos a)
      feather.rotation.z = Math.PI + side * a;
      const ax = side * L * (0.08 + 0.9 * t);
      feather.position.set(ax + side * Math.sin(a) * len * 0.5, -torsoH * 0.06 - Math.cos(a) * len * 0.5, -torsoH * 0.02 * (i % 2));
      feather.material = i % 2 === 0 ? featherMat : covertMat;
    }
  }
}

// ─── Special features ───
/*
 * A barded horse under the rider (units/renaissance.jouster), given in the rider's standing hip height H. Spec, read off the reference's blue horse
 * (side-on, back to hoof ~330 px):
 *   - Heights over the ground, as shares of the back's height B (~1.85 H), read off the red horse: back 1, caparison hem HORSE_HEM_SHARE ~0.5 (just over the
 *     belly line), knee/hock ~0.3, hoof 0.07. So back-to-hem and hem-to-hoof are near even: ~40-45% of the horse's height is leg under a long low drape.
 *   - The caparison is a drape, not a sack: in plan a stadium (two straight flat side panels joined by rounded chest and rump ends, HORSE_CAP_END of
 *     its half-width deep), ~1.5 times as long as the horse is tall from hem to back; its sides fall plumb from the shoulder of the back to a straight
 *     level hem. A lathe oval read as a round pot from the three-quarter view.
 *   - The barrel is deep and round: depth HORSE_DEEP ~0.57 B, length HORSE_LONG about 1.8 times its depth, width at least HORSE_WIDE of H
 *     (a stocky barrel, legs set in under it); the drape stands out past the barrel (HORSE_CAP_BULGE of its half-width) and its hem is a cream band
 *     with square dags.
 *   - Under the hem: the thick chestnut upper leg (forearm / gaskin, ~0.45 of the barrel's half-width across, ~1.45 times as deep fore-and-aft as across)
 *     carries on for HORSE_UPPER_SHOW of H and narrows into the joint, then a short cannon about half as long again as the hoof is tall, a fetlock bulge,
 *     and a big dark hoof as wide as the upper leg (HORSE_HOOF of H, ~2.3 cannons across).
 *   - The caparison runs HORSE_CAP_LONG past the barrel's length over chest and rump, so from any side it is a long low drape and not a pot.
 *     The hind leg's hock sits HORSE_HOCK of H behind its root and the cannon slants forward again to the hoof: a plain Z in side view.
 *   - The rider is lifted HORSE_LIFT of H, so the back sits just under his lifted hip. The neck leaves the top front of the barrel raked forward HORSE_NECK_RAKE,
 *     the long grey-armoured head points forward and down with ears and a team plume; a dark tail falls off the rump. The rider's shins and feet are hidden.
 */
const HORSE_LIFT = 0.9;
const HORSE_LONG = 1.95;
const HORSE_DEEP = 1.05;
const HORSE_NECK_RAKE = 0.75;
const HORSE_DAGS = 7;
const HORSE_FORE_THICK = 0.36;
const HORSE_HIND_THICK = 0.44;
const HORSE_HOCK = 0.22;
const HORSE_UPPER_SHOW = 0.32;
const HORSE_UPPER_DEEP = 1.45;
const HORSE_COAT_GLOW = 0.14;
// 268 (units/renaissance.jouster: a long low flat-backed box, not a tub): the drape's back is a flat deck at full width that breaks over a hard shoulder
// bevel HORSE_CAP_BEVEL of the back's height deep into plumb sides, and its chest and rump ends are squared (a superellipse of exponent HORSE_CAP_SQUARE,
// 1 = round) and run HORSE_CAP_LONG past the barrel, so they overhang chest and rump as flat end panels.
const HORSE_CAP_LONG = 1.32;
const HORSE_HOOF = 0.27;
const HORSE_CAP_BULGE = 1.22;
const HORSE_CAP_END = 0.55;
const HORSE_CAP_SQUARE = 0.35;
const HORSE_CAP_BEVEL = 0.07;
const HORSE_HEM_SHARE = 0.5;
// The bare pinto keeps its legs as they were: its joint height was set from the old sack hem
const HORSE_PINTO_HEM = 0.55;
const HORSE_WIDE = 0.85;
/*
 * The pinto (units/wild_west.lasso: the lasso rides a bare paint horse, no barding): the same horse body, its coat a warm orange broken by big cream
 * patches, each about a tenth of the barrel (PINTO_PATCHES directions, a face cream within PINTO_PATCH of one, ragged by PINTO_RAGGED), cream socks on two
 * legs and a cream blaze down the face; a big white eye with a black pupil on each side of the head (PINTO_EYE of H), long ears PINTO_EAR of H with pink
 * insides, a pink muzzle, and a dark mane in tufts down the top of the neck. No chanfron, plume or caparison. The rider carries a coiled rope loop in his
 * off hand (PINTO_LOOP of his scale across).
 */
const PINTO_COAT = new Color3(0.95, 0.42, 0.1);
const PINTO_CREAM = new Color3(1, 0.93, 0.78);
const PINTO_PINK = new Color3(0.98, 0.55, 0.66);
const PINTO_GLOW = 0.18;
const PINTO_PATCHES: ReadonlyArray<readonly [number, number, number]> = [[-0.9, 0.25, 0.1], [0.85, 0.1, -0.35], [0.25, 0.7, -0.7], [-0.15, -0.75, 0.55], [0.35, 0.15, 0.92], [-0.5, 0.1, -0.85]];
const PINTO_PATCH = 0.83;
const PINTO_RAGGED = 0.06;
const PINTO_EYE = 0.075;
const PINTO_EAR = 0.3;
const PINTO_LOOP = 0.42;
type HorseStyle = "barded" | "pinto";
function buildHorse(scene: Scene, body: ArticulatedBody, cloth: Color3, style: HorseStyle = "barded"): Mesh {
  const pinto = style === "pinto";
  const H = body.hip.position.y;
  // Up on the horse: the animator keeps this as the hip's rest height (it is read once, on the first tick after the build)
  body.hip.position.y = H * (1 + HORSE_LIFT);
  const ground = -H * (1 + HORSE_LIFT);
  const L = H * HORSE_LONG;
  const W = Math.max(body.metrics.hipWidth * 2.2, H * HORSE_WIDE);
  // The paint's coat and patches are a little self-lit, so they stay orange and cream in the blue shade instead of greying
  const coat = pinto ? mat(scene, PINTO_COAT, PINTO_GLOW) : mat(scene, new Color3(0.55, 0.3, 0.18), HORSE_COAT_GLOW);
  const dark = mat(scene, new Color3(0.16, 0.1, 0.07));
  const plate = mat(scene, new Color3(0.66, 0.68, 0.7));
  const cream = pinto ? mat(scene, PINTO_CREAM, PINTO_GLOW) : mat(scene, new Color3(0.93, 0.84, 0.64));
  const barrel = MeshBuilder.CreateIcoSphere("horse", { radius: 1, subdivisions: 2 }, scene);
  barrel.scaling.set(W / 2, H * HORSE_DEEP / 2, L / 2);
  barrel.convertToFlatShadedMesh();
  barrel.parent = body.hip;
  barrel.position.y = -H * (0.05 + HORSE_DEEP / 2);
  barrel.material = coat;
  if (pinto) {
    // The paint coat: the barrel's faces that point near one of the patch directions are laid over again in cream, a hair proud of the orange
    const pos = barrel.getVerticesData(VertexBuffer.PositionKind)!;
    const idx = barrel.getIndices()!;
    const centres = PINTO_PATCHES.map(([x, y, z]) => new Vector3(x, y, z).normalize());
    const patchPos: number[] = [], patchIdx: number[] = [];
    for (let f = 0; f < idx.length; f += 3) {
      const c = new Vector3(0, 0, 0);
      for (let j = 0; j < 3; j++) c.addInPlace(Vector3.FromArray(pos, idx[f + j] * 3));
      c.normalize();
      const ragged = (Math.abs(Math.sin(f * 12.9898) * 43758.5453) % 1 - 0.5) * 2 * PINTO_RAGGED;
      if (!centres.some((p) => Vector3.Dot(c, p) > PINTO_PATCH + ragged)) continue;
      for (let j = 0; j < 3; j++) {
        patchIdx.push(patchPos.length / 3);
        patchPos.push(...Vector3.FromArray(pos, idx[f + j] * 3).scale(1.02).asArray());
      }
    }
    const patches = new Mesh("hpatches", scene);
    const data = new VertexData();
    data.positions = patchPos;
    data.indices = patchIdx;
    const normals: number[] = [];
    VertexData.ComputeNormals(patchPos, patchIdx, normals);
    data.normals = normals;
    data.applyToMesh(patches);
    patches.parent = barrel;
    patches.material = cream;
  }
  // Parts hang off a holder at the barrel's middle, so the barrel's own scaling does not stretch them
  const frame = new Mesh("horseFrame", scene);
  frame.parent = body.hip;
  frame.position.y = barrel.position.y;
  const part = (m: Mesh, material: typeof coat): Mesh => {
    m.parent = frame;
    m.material = material;
    m.convertToFlatShadedMesh();
    return m;
  };
  const belly = -H * HORSE_DEEP / 2;
  // Frame-local ground: the frame sits at the barrel's middle
  const floor = ground - barrel.position.y;
  // The drape's hem: HORSE_HEM_SHARE of the way from the ground to the back
  const hemY = pinto ? floor + H * HORSE_PINTO_HEM : floor + (H * HORSE_DEEP / 2 - floor) * HORSE_HEM_SHARE;
  // A tapered limb from point a (bottom) to point b (top), its thick end at the top
  const limb = (name: string, a: Vector3, b: Vector3, thick: number, thin: number): Mesh => {
    const d = b.subtract(a);
    const seg = part(MeshBuilder.CreateCylinder(name, { height: d.length(), diameterTop: thick, diameterBottom: thin, tessellation: 6 }, scene), coat);
    seg.rotation.x = Math.atan2(d.z, d.y);
    seg.position.copyFrom(a.add(b).scale(0.5));
    return seg;
  };
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      // Each leg is a horse's leg and not a post: a muscled upper wedge, deeper fore-and-aft than across (HORSE_UPPER_DEEP), that comes out
      // of the hem for at least HORSE_UPPER_SHOW of H and narrows into the joint with no ball at it; a short cannon as thick as the wedge's
      // foot; a fetlock bulge; a big flared dark hoof. The coat is part self-lit (HORSE_COAT_GLOW) so the legs stay chestnut in the shade.
      const legX = x * W * 0.24;
      const legZ = z * L * (z > 0 ? 0.3 : 0.27);
      const top = belly + H * HORSE_DEEP * 0.3;
      const hoofTall = H * 0.13;
      const hemAt = hemY;
      // Fore: knee straight under the shoulder; hind: the hock set well back and the cannon slanting forward again to the hoof, a Z
      const joint = z > 0
        ? new Vector3(legX, hemAt - H * HORSE_UPPER_SHOW, legZ + H * 0.02)
        : new Vector3(legX, hemAt - H * (HORSE_UPPER_SHOW - 0.04), legZ - H * HORSE_HOCK);
      const hoofAt = new Vector3(legX, floor + hoofTall * 0.9, z > 0 ? legZ + H * 0.03 : legZ - H * 0.06);
      const upper = new Vector3(legX, top, z > 0 ? legZ : legZ + H * 0.14);
      const foot = H * 0.2;
      // The thick upper leg (forearm / gaskin) runs from inside the barrel down past the hem to the joint: a four-sided wedge set square to
      // the horse, laid in a holder stretched HORSE_UPPER_DEEP fore-and-aft (ends given in the holder's space, so they land where they should)
      const holder = new Mesh("hwedge", scene);
      holder.parent = frame;
      holder.scaling.z = HORSE_UPPER_DEEP;
      const jl = new Vector3(joint.x, joint.y, joint.z / HORSE_UPPER_DEEP);
      const ul = new Vector3(upper.x, upper.y, upper.z / HORSE_UPPER_DEEP);
      const d = ul.subtract(jl);
      const thick = H * (z > 0 ? HORSE_FORE_THICK : HORSE_HIND_THICK);
      const wedge = MeshBuilder.CreateCylinder(z > 0 ? "hforearm" : "hgaskin", { height: d.length() + foot * 0.4, diameterTop: thick * Math.SQRT2, diameterBottom: foot * Math.SQRT2, tessellation: 4 }, scene);
      wedge.rotation.y = Math.PI / 4;
      wedge.bakeCurrentTransformIntoVertices();
      part(wedge, coat);
      wedge.parent = holder;
      wedge.rotation.x = Math.atan2(d.z, d.y);
      wedge.position.copyFrom(jl.add(ul).scale(0.5).subtract(d.normalize().scale(foot * 0.2)));
      const cannon = limb("hcannon", hoofAt, joint, foot, H * 0.15);
      // The paint's cream socks, on one fore and the opposite hind
      if (pinto && x === z) cannon.material = cream;
      // The fetlock: a squat bulge where the cannon meets the hoof
      const fetlock = part(MeshBuilder.CreateIcoSphere("hfetlock", { radius: H * 0.1, subdivisions: 1 }, scene), cannon.material as typeof coat);
      fetlock.scaling.set(1, 0.8, 1.15);
      fetlock.position.set(legX, floor + hoofTall * 1.15, hoofAt.z);
      // A big flared hoof, as wide as the upper leg
      const hoof = part(MeshBuilder.CreateCylinder("hhoof", { height: hoofTall, diameterTop: H * HORSE_HOOF * 0.72, diameterBottom: H * HORSE_HOOF, tessellation: 6 }, scene), dark);
      hoof.position.set(legX, floor + hoofTall / 2, hoofAt.z + H * 0.02);
    }
  }
  const neckTall = H * 1.05;
  const neck = part(MeshBuilder.CreateCylinder("hneck", { height: neckTall, diameterTop: H * 0.24, diameterBottom: H * 0.42, tessellation: 6 }, scene), coat);
  neck.rotation.x = HORSE_NECK_RAKE;
  const neckRoot = new Vector3(0, H * HORSE_DEEP * 0.25, L * 0.38);
  neck.position.set(0, neckRoot.y + Math.cos(HORSE_NECK_RAKE) * neckTall * 0.5, neckRoot.z + Math.sin(HORSE_NECK_RAKE) * neckTall * 0.5);
  const poll = new Vector3(0, neckRoot.y + Math.cos(HORSE_NECK_RAKE) * neckTall, neckRoot.z + Math.sin(HORSE_NECK_RAKE) * neckTall);
  const headLong = H * 0.72;
  const head = part(MeshBuilder.CreateCylinder("hhead", { height: headLong, diameterTop: H * 0.17, diameterBottom: H * 0.3, tessellation: 5 }, scene), coat);
  head.rotation.x = 2.05;
  head.position.set(0, poll.y + Math.cos(2.05) * headLong * 0.42, poll.z + Math.sin(2.05) * headLong * 0.42);
  // The chanfron: a grey plate down the face, on top of the head and standing proud of it (the pinto's is a cream blaze instead)
  const chanfron = part(MeshBuilder.CreateBox(pinto ? "hblaze" : "hchanfron", { width: H * (pinto ? 0.12 : 0.2), height: headLong * 0.85, depth: H * 0.05 }, scene), pinto ? cream : plate);
  chanfron.parent = head;
  chanfron.position.set(0, -headLong * 0.04, pinto ? -H * 0.085 : -H * 0.1);
  const pink = mat(scene, PINTO_PINK, PINTO_GLOW);
  const muzzle = part(MeshBuilder.CreateBox("hmuzzle", { width: H * (pinto ? 0.19 : 0.13), height: H * (pinto ? 0.15 : 0.1), depth: H * (pinto ? 0.17 : 0.12) }, scene), pinto ? pink : coat);
  muzzle.position.set(0, poll.y + Math.cos(2.05) * headLong * 0.95, poll.z + Math.sin(2.05) * headLong * 0.95);
  const earTall = H * (pinto ? PINTO_EAR : 0.18);
  for (const x of [-1, 1]) {
    const ear = part(MeshBuilder.CreateCylinder("hear", { height: earTall, diameterTop: 0, diameterBottom: H * (pinto ? 0.1 : 0.07), tessellation: 4 }, scene), coat);
    ear.position.set(x * H * (pinto ? 0.08 : 0.07), poll.y + earTall * 0.45, poll.z - H * 0.02);
    ear.rotation.set(-0.3, 0, -x * 0.25);
    if (!pinto) continue;
    // Pink inside the long ear, facing forward
    const inner = part(MeshBuilder.CreateCylinder("hearInner", { height: earTall * 0.8, diameterTop: 0, diameterBottom: H * 0.065, tessellation: 4 }, scene), pink);
    inner.parent = ear;
    inner.position.set(0, -earTall * 0.06, H * 0.028);
    // A big white eye with a black pupil on each side of the head
    const eye = part(MeshBuilder.CreateIcoSphere("heye", { radius: H * PINTO_EYE, subdivisions: 1 }, scene), mat(scene, new Color3(0.97, 0.97, 0.95)));
    eye.parent = head;
    eye.position.set(x * H * 0.12, -headLong * 0.22, -H * 0.03);
    const pupil = part(MeshBuilder.CreateIcoSphere("hpupil", { radius: H * PINTO_EYE * 0.55, subdivisions: 1 }, scene), dark);
    pupil.parent = eye;
    pupil.position.set(x * H * PINTO_EYE * 0.6, 0, -H * PINTO_EYE * 0.15);
  }
  if (pinto) {
    // The mane: dark tufts down the top of the neck, a forelock at the poll
    for (let i = 0; i < 5; i++) {
      const tuft = part(MeshBuilder.CreateBox("hmane", { width: H * 0.06, height: neckTall * 0.2, depth: H * 0.13 }, scene), dark);
      tuft.parent = neck;
      tuft.position.set(0, neckTall * (0.4 - i * 0.18), -H * (0.12 + i * 0.018));
      tuft.rotation.x = -0.25;
    }
  } else {
    const plume = part(MeshBuilder.CreateCylinder("hplume", { height: H * 0.3, diameterTop: H * 0.16, diameterBottom: H * 0.03, tessellation: 5 }, scene), mat(scene, cloth.scale(0.9)));
    plume.position.set(0, poll.y + H * 0.16, poll.z + H * 0.04);
    plume.rotation.x = -0.35;
  }
  const tail = part(MeshBuilder.CreateCylinder("htail", { height: H * 0.55, diameterTop: H * 0.1, diameterBottom: H * 0.03, tessellation: 5 }, scene), dark);
  tail.rotation.x = 0.35;
  // Out of the back of the barrel, or of the longer caparison over it
  tail.position.set(0, H * HORSE_DEEP * 0.15 - H * 0.26, -L * 0.5 * (pinto ? 1 : HORSE_CAP_LONG) - H * 0.08);
  // Down in the saddle: his shins and feet would stand between the horse's legs
  for (const knee of [body.leftKnee, body.rightKnee]) {
    for (const m of knee.getChildMeshes(false)) m.isVisible = false;
  }
  if (pinto) {
    // The lasso: a coiled rope loop hanging from his off hand
    const loop = MeshBuilder.CreateTorus("lassoLoop", { diameter: H * PINTO_LOOP * 2, thickness: H * 0.035, tessellation: 12 }, scene);
    loop.parent = body.leftHand;
    loop.position.set(0, -H * PINTO_LOOP * 0.9, H * 0.02);
    loop.rotation.z = Math.PI / 2;
    loop.material = mat(scene, new Color3(0.86, 0.74, 0.52));
    return barrel;
  }
  // The caparison: a drape over the barrel, a stadium in plan (see the spec): flat side panels falling plumb to a level hem HORSE_HEM_SHARE of
  // the way up, squared chest and rump ends HORSE_CAP_END of the half-width deep, its back a flat deck breaking over a hard shoulder bevel
  const clothMat = mat(scene, cloth.scale(0.85));
  const rCap = (W / 2) * HORSE_CAP_BULGE;
  const capHalf = (L / 2) * HORSE_CAP_LONG;
  const straight = capHalf - rCap * HORSE_CAP_END;
  const backY = H * HORSE_DEEP / 2;
  // A point on the stadium of half-width r at perimeter share u (from the rump end of the +x panel, round by the chest), with its outward heading.
  // Its ends are squared superellipses: flat end panels with tight rounded corners.
  const endLong = (r: number) => r * (2 + 2 * HORSE_CAP_END);
  const sq = (v: number, p: number) => Math.sign(v) * Math.abs(v) ** p;
  const endPoint = (r: number, y: number, a: number, z0: number): { at: Vector3; heading: number } => {
    const c = Math.cos(a), s = Math.sin(a);
    return {
      at: new Vector3(r * sq(c, HORSE_CAP_SQUARE), y, z0 + r * HORSE_CAP_END * sq(s, HORSE_CAP_SQUARE)),
      heading: Math.atan2(sq(c, 2 - HORSE_CAP_SQUARE) * HORSE_CAP_END, sq(s, 2 - HORSE_CAP_SQUARE)),
    };
  };
  const stadium = (r: number, y: number, u: number): { at: Vector3; heading: number } => {
    const side = 2 * straight, end = endLong(r);
    let d = (((u % 1) + 1) % 1) * 2 * (side + end);
    if (d < side) return { at: new Vector3(r, y, -straight + d), heading: Math.PI / 2 };
    d -= side;
    if (d < end) return endPoint(r, y, (d / end) * Math.PI, straight);
    d -= end;
    if (d < side) return { at: new Vector3(-r, y, straight - d), heading: -Math.PI / 2 };
    return endPoint(r, y, Math.PI + ((d - side) / end) * Math.PI, -straight);
  };
  const ring = (r: number, y: number): Vector3[] => {
    const pts: Vector3[] = [];
    for (let i = 0; i < 40; i++) pts.push(stadium(r, y, i / 40).at);
    return pts;
  };
  // A flat deck to the shoulder edge, a short hard bevel, then the plumb sides
  const profile: ReadonlyArray<readonly [number, number]> = [[0.002, 1.02], [0.92, 1.02], [1, 1.02 - HORSE_CAP_BEVEL], [1, 0.25]];
  const rings = profile.map(([r, y]) => ring(rCap * r, backY * y));
  rings.push(ring(rCap, hemY));
  part(MeshBuilder.CreateRibbon("hcaparison", { pathArray: rings, closePath: true, sideOrientation: Mesh.DOUBLESIDE }, scene), clothMat);
  // The cream hem band, standing a hair proud of the panels
  part(MeshBuilder.CreateRibbon("hhem", { pathArray: [ring(rCap * 1.02, hemY + H * 0.08), ring(rCap * 1.02, hemY)], closePath: true, sideOrientation: Mesh.DOUBLESIDE }, scene), cream);
  // The square dags evenly round the hem, each turned to face out
  const dagCount = HORSE_DAGS * 2 + 4;
  for (let i = 0; i < dagCount; i++) {
    const { at, heading } = stadium(rCap * 1.03, hemY - H * 0.04, (i + 0.5) / dagCount);
    const dag = part(MeshBuilder.CreateBox("hdag", { width: H * 0.12, height: H * 0.09, depth: H * 0.02 }, scene), cream);
    dag.position.copyFrom(at);
    dag.rotation.y = heading;
  }
  return barrel;
}

function buildSpecial(scene: Scene, type: SpecialType, s: number, accent: Color3, body: ArticulatedBody, teamColor?: Color3, horse: HorseStyle = "barded"): Mesh | null {
  switch (type) {
    case "none": return null;

    case "cape": {
      const cape = MeshBuilder.CreateBox("cape", { width: 0.3 * s, height: 0.35 * s, depth: 0.02 * s }, scene);
      cape.position.set(0, 0.2 * s, -0.12 * s);
      cape.parent = body.torso;
      cape.material = mat(scene, accent, 0.05);
      return cape;
    }
    case "candle_flame": {
      const wick = MeshBuilder.CreateCylinder("candleWick", { height: 0.1 * s, diameter: 0.018 * s, tessellation: 6 }, scene);
      wick.parent = body.headTop;
      wick.position.y = 0.04 * s;
      wick.material = mat(scene, new Color3(0.18, 0.12, 0.08));
      const flame = MeshBuilder.CreateSphere("candleFlame", { diameter: 0.12 * s, segments: 6 }, scene);
      flame.parent = body.headTop;
      flame.position.y = 0.12 * s;
      flame.scaling.y = 1.4;
      flame.material = mat(scene, new Color3(1.0, 0.7, 0.18), 0.5);
      return flame;
    }
    case "cactus_body": {
      const trunk = MeshBuilder.CreateCylinder("cactusBody", { height: 0.7 * s, diameterTop: 0.26 * s, diameterBottom: 0.34 * s, tessellation: 10 }, scene);
      trunk.parent = body.torso;
      trunk.position.set(0, -0.02 * s, 0);
      trunk.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
      for (const side of [-1, 1]) {
        const arm = MeshBuilder.CreateCylinder("cactusArm", { height: 0.26 * s, diameter: 0.09 * s, tessellation: 8 }, scene);
        arm.parent = trunk;
        arm.position.set(side * 0.19 * s, 0.12 * s, 0);
        arm.rotation.z = side * 1.1;
        arm.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
        const forearm = MeshBuilder.CreateCylinder("cactusForearm", { height: 0.18 * s, diameter: 0.07 * s, tessellation: 8 }, scene);
        forearm.parent = trunk;
        forearm.position.set(side * 0.28 * s, 0.24 * s, 0);
        forearm.material = mat(scene, new Color3(0.38, 0.62, 0.3), 0.04);
      }
      for (let i = 0; i < 10; i++) {
        const spine = MeshBuilder.CreateCylinder("cactusSpine", { height: 0.05 * s, diameterTop: 0, diameterBottom: 0.01 * s, tessellation: 4 }, scene);
        const angle = (Math.PI * 2 * i) / 10;
        spine.parent = trunk;
        spine.position.set(Math.cos(angle) * 0.14 * s, -0.18 * s + (i % 5) * 0.09 * s, Math.sin(angle) * 0.14 * s);
        spine.rotation.x = Math.PI / 2;
        spine.rotation.z = angle;
        spine.material = mat(scene, new Color3(0.85, 0.9, 0.72));
      }
      return trunk;
    }
    case "wings":
    case "dragon_wings": {
      if (type === "dragon_wings") {
        for (const side of [-1, 1]) {
          const wing = MeshBuilder.CreateBox("wing", { width: 0.35 * s * 1.3, height: 0.25 * s * 1.3, depth: 0.01 * s }, scene);
          wing.position.set(side * 0.25 * s, 0.3 * s, -0.1 * s);
          wing.rotation.y = side * 0.3;
          wing.parent = body.torso;
          wing.material = mat(scene, new Color3(0.12, 0.12, 0.15), 0.05);
        }
      } else {
        buildFeatherWings(scene, body);
      }
      // Return a dummy mesh for disposal tracking
      const marker = MeshBuilder.CreateBox("wingMarker", { width: 0.01, height: 0.01, depth: 0.01 }, scene);
      marker.isVisible = false;
      marker.parent = body.torso;
      return marker;
    }
    case "mount_mammoth": {
      const mammoth = MeshBuilder.CreateBox("mammoth", { width: 1.2 * s, height: 0.8 * s, depth: 0.7 * s }, scene);
      mammoth.position.y = -0.2 * s;
      mammoth.parent = body.hip;
      mammoth.material = mat(scene, new Color3(0.5, 0.38, 0.25));
      // Tusks
      for (const side of [-1, 1]) {
        const tusk = MeshBuilder.CreateCylinder("tusk", { height: 0.4 * s, diameterTop: 0, diameterBottom: 0.06 * s, tessellation: 6 }, scene);
        tusk.position.set(side * 0.3 * s, -0.2 * s, 0.35 * s);
        tusk.rotation.x = 0.6;
        tusk.rotation.z = side * 0.3;
        tusk.parent = mammoth;
        tusk.material = mat(scene, new Color3(0.95, 0.92, 0.85));
      }
      return mammoth;
    }
    case "mount_horse":
      return buildHorse(scene, body, teamColor ?? accent, horse);
    case "catapult_arm": {
      const base = MeshBuilder.CreateBox("catbase", { width: 0.6 * s, height: 0.2 * s, depth: 0.4 * s }, scene);
      base.position.set(0, -0.1 * s, 0.1 * s);
      base.parent = body.hip;
      base.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const arm = MeshBuilder.CreateCylinder("catarm", { height: 0.6 * s, diameter: 0.05 * s }, scene);
      arm.position.y = 0.3 * s;
      arm.rotation.z = -0.3;
      arm.parent = base;
      arm.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      return base;
    }
    case "cannon_base": {
      const base = MeshBuilder.CreateBox("canbase", { width: 0.4 * s, height: 0.15 * s, depth: 0.3 * s }, scene);
      base.position.set(0, -0.1 * s, 0.2 * s);
      base.parent = body.hip;
      base.material = mat(scene, new Color3(0.4, 0.25, 0.12));
      const barrel = MeshBuilder.CreateCylinder("canbarrel", { height: 0.6 * s, diameter: 0.12 * s, tessellation: 12 }, scene);
      barrel.position.set(0, 0.1 * s, 0.15 * s);
      barrel.rotation.x = Math.PI / 2;
      barrel.parent = base;
      barrel.material = mat(scene, new Color3(0.25, 0.25, 0.3));
      return base;
    }
    case "ballista_frame": {
      const frame = MeshBuilder.CreateBox("bframe", { width: 0.5 * s, height: 0.3 * s, depth: 0.3 * s }, scene);
      frame.position.set(0, -0.05 * s, 0.15 * s);
      frame.parent = body.hip;
      frame.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      const bolt = MeshBuilder.CreateCylinder("bolt", { height: 0.5 * s, diameter: 0.03 * s }, scene);
      bolt.position.set(0, 0.15 * s, 0.1 * s);
      bolt.rotation.x = Math.PI / 2;
      bolt.parent = frame;
      bolt.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      return frame;
    }
    case "hwacha_rack": {
      const rack = MeshBuilder.CreateBox("hrack", { width: 0.45 * s, height: 0.35 * s, depth: 0.3 * s }, scene);
      rack.position.set(0, 0, 0.2 * s);
      rack.parent = body.hip;
      rack.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      for (let i = 0; i < 6; i++) {
        const arrow = MeshBuilder.CreateCylinder("harrow", { height: 0.3 * s, diameter: 0.015 * s }, scene);
        arrow.position.set((i - 2.5) * 0.06 * s, 0.1 * s, 0);
        arrow.rotation.x = Math.PI / 2;
        arrow.parent = rack;
        arrow.material = mat(scene, new Color3(0.6, 0.35, 0.15));
      }
      return rack;
    }
    case "tank_body": {
      const hull = MeshBuilder.CreateCylinder("tank", { height: 0.6 * s, diameter: 1.0 * s, tessellation: 16 }, scene);
      hull.position.y = -0.2 * s;
      hull.parent = body.hip;
      hull.material = mat(scene, new Color3(0.55, 0.45, 0.3));
      return hull;
    }
    case "longship_body": {
      const hull = MeshBuilder.CreateBox("longship", { width: 0.9 * s, height: 0.25 * s, depth: 0.35 * s }, scene);
      hull.position.y = -0.35 * s;
      hull.parent = body.hip;
      hull.material = mat(scene, new Color3(0.55, 0.4, 0.2));
      // Prow
      const prow = MeshBuilder.CreateCylinder("prow", { height: 0.3 * s, diameterTop: 0, diameterBottom: 0.08 * s, tessellation: 6 }, scene);
      prow.position.set(0, 0.05 * s, 0.25 * s);
      prow.rotation.x = -0.5;
      prow.parent = hull;
      prow.material = mat(scene, new Color3(0.6, 0.45, 0.2));
      return hull;
    }
    case "balloon": {
      const balloon = MeshBuilder.CreateSphere("balloon", { diameter: 0.5 * s, segments: 10 }, scene);
      balloon.position.y = 0.7 * s;
      balloon.parent = body.torso;
      balloon.material = mat(scene, new Color3(1, 0.6, 0.65), 0.1);
      // String
      const str = MeshBuilder.CreateCylinder("string", { height: 0.3 * s, diameter: 0.008 * s }, scene);
      str.position.y = -0.2 * s;
      str.parent = balloon;
      str.material = mat(scene, new Color3(0.3, 0.3, 0.3));
      return balloon;
    }
    case "scarecrow_post": {
      const post = MeshBuilder.CreateCylinder("post", { height: 0.6 * s, diameter: 0.04 * s }, scene);
      post.position.set(0, -0.3 * s, -0.05 * s);
      post.parent = body.hip;
      post.material = mat(scene, new Color3(0.5, 0.35, 0.2));
      return post;
    }
    case "monk_robe": {
      // Orange robe draped over left shoulder, wrapped around body
      const robe = MeshBuilder.CreateBox("robe", { width: 0.32 * s, height: 0.4 * s, depth: 0.22 * s }, scene);
      robe.position.set(0, 0.05 * s, 0);
      robe.parent = body.torso;
      robe.material = mat(scene, new Color3(0.9, 0.55, 0.1), 0.05);
      // Shoulder drape (over left shoulder diagonally)
      const drape = MeshBuilder.CreateBox("drape", { width: 0.08 * s, height: 0.35 * s, depth: 0.16 * s }, scene);
      drape.position.set(-0.12 * s, 0.2 * s, 0);
      drape.rotation.z = 0.3;
      drape.parent = body.torso;
      drape.material = mat(scene, new Color3(0.9, 0.55, 0.1), 0.05);
      return robe;
    }
    case "raptor_mount": {
      const bodyMesh = MeshBuilder.CreateBox("raptorBody", { width: 0.22 * s, height: 0.42 * s, depth: 0.85 * s }, scene);
      bodyMesh.position.y = -0.38 * s;
      bodyMesh.parent = body.hip;
      bodyMesh.material = mat(scene, new Color3(0.45, 0.55, 0.28));
      const neck = MeshBuilder.CreateCylinder("raptorNeck", { height: 0.28 * s, diameter: 0.08 * s, tessellation: 6 }, scene);
      neck.position.set(0, -0.08 * s, 0.38 * s);
      neck.rotation.x = -0.7;
      neck.parent = bodyMesh;
      neck.material = mat(scene, new Color3(0.45, 0.55, 0.28));
      const head = MeshBuilder.CreateSphere("raptorHead", { diameter: 0.16 * s, segments: 6 }, scene);
      head.position.set(0, 0.08 * s, 0.52 * s);
      head.parent = bodyMesh;
      head.material = mat(scene, new Color3(0.5, 0.62, 0.3));
      const tail = MeshBuilder.CreateCylinder("raptorTail", { height: 0.45 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
      tail.position.set(0, -0.02 * s, -0.5 * s);
      tail.rotation.x = 1.05;
      tail.parent = bodyMesh;
      tail.material = mat(scene, new Color3(0.4, 0.5, 0.24));
      for (const side of [-1, 1]) {
        const leg = MeshBuilder.CreateCylinder("raptorLeg", { height: 0.32 * s, diameter: 0.05 * s, tessellation: 6 }, scene);
        leg.position.set(side * 0.12 * s, -0.32 * s, side > 0 ? -0.18 * s : 0.18 * s);
        leg.parent = bodyMesh;
        leg.material = mat(scene, new Color3(0.4, 0.5, 0.24));
      }
      const crest = MeshBuilder.CreateBox("raptorCrest", { width: 0.04 * s, height: 0.14 * s, depth: 0.03 * s }, scene);
      crest.position.set(0, 0.16 * s, 0.54 * s);
      crest.parent = bodyMesh;
      crest.material = mat(scene, accent, 0.1);
      return bodyMesh;
    }
    case "clam_shell": {
      const shell = MeshBuilder.CreateSphere("clamShell", { diameter: 0.7 * s, segments: 8 }, scene);
      shell.scaling.y = 0.45;
      shell.position.y = -0.15 * s;
      shell.parent = body.hip;
      shell.material = mat(scene, new Color3(0.5, 0.72, 0.78));
      const lowerShell = MeshBuilder.CreateSphere("lowerShell", { diameter: 0.68 * s, segments: 8 }, scene);
      lowerShell.scaling.y = 0.28;
      lowerShell.position.set(0, -0.08 * s, 0);
      lowerShell.parent = shell;
      lowerShell.material = mat(scene, new Color3(0.42, 0.62, 0.68));
      const pearl = MeshBuilder.CreateSphere("pearl", { diameter: 0.14 * s, segments: 6 }, scene);
      pearl.position.set(0, 0.08 * s, 0.08 * s);
      pearl.parent = shell;
      pearl.material = mat(scene, new Color3(0.95, 0.98, 1), 0.15);
      return shell;
    }
    case "safe_bundle": {
      const safe = MeshBuilder.CreateBox("safe", { width: 0.32 * s, height: 0.26 * s, depth: 0.22 * s }, scene);
      safe.position.set(0, -0.1 * s, -0.15 * s);
      safe.parent = body.hip;
      safe.material = mat(scene, new Color3(0.3, 0.32, 0.35));
      const dial = MeshBuilder.CreateCylinder("dial", { height: 0.03 * s, diameter: 0.08 * s, tessellation: 12 }, scene);
      dial.position.set(0, 0, 0.12 * s);
      dial.rotation.x = Math.PI / 2;
      dial.parent = safe;
      dial.material = mat(scene, new Color3(0.85, 0.75, 0.35));
      const handle = MeshBuilder.CreateBox("safeHandle", { width: 0.08 * s, height: 0.02 * s, depth: 0.02 * s }, scene);
      handle.position.set(0.08 * s, 0, 0.12 * s);
      handle.parent = safe;
      handle.material = mat(scene, new Color3(0.82, 0.72, 0.3));
      return safe;
    }
    case "dragon_cart": {
      const cart = MeshBuilder.CreateBox("dragonCart", { width: 0.4 * s, height: 0.2 * s, depth: 0.55 * s }, scene);
      cart.position.set(0, -0.18 * s, -0.08 * s);
      cart.parent = body.hip;
      cart.material = mat(scene, new Color3(0.5, 0.34, 0.2));
      const head = MeshBuilder.CreateBox("dragonHead", { width: 0.18 * s, height: 0.16 * s, depth: 0.18 * s }, scene);
      head.position.set(0, 0.08 * s, 0.34 * s);
      head.parent = cart;
      head.material = mat(scene, accent, 0.08);
      for (const side of [-1, 1]) {
        const wing = MeshBuilder.CreateBox("dragonWing", { width: 0.24 * s, height: 0.12 * s, depth: 0.01 * s }, scene);
        wing.position.set(side * 0.24 * s, 0.1 * s, 0.05 * s);
        wing.rotation.y = side * 0.55;
        wing.parent = cart;
        wing.material = mat(scene, accent.scale(0.9), 0.05);
      }
      const horn = MeshBuilder.CreateCylinder("dragonHorn", { height: 0.12 * s, diameterTop: 0, diameterBottom: 0.025 * s, tessellation: 6 }, scene);
      horn.position.set(0, 0.17 * s, 0.4 * s);
      horn.parent = cart;
      horn.material = mat(scene, new Color3(0.92, 0.85, 0.68));
      return cart;
    }
    case "elephant_shrine": {
      const platform = MeshBuilder.CreateBox("elephantShrinePlatform", { width: 0.48 * s, height: 0.1 * s, depth: 0.36 * s }, scene);
      platform.parent = body.torso;
      platform.position.set(0, 0.18 * s, -0.06 * s);
      platform.material = mat(scene, new Color3(0.82, 0.72, 0.46));
      for (const xOff of [-0.16, 0.16]) {
        for (const zOff of [-0.1, 0.1]) {
          const post = MeshBuilder.CreateCylinder("elephantShrinePost", { height: 0.22 * s, diameter: 0.03 * s, tessellation: 8 }, scene);
          post.parent = platform;
          post.position.set(xOff * s, 0.14 * s, zOff * s);
          post.material = mat(scene, new Color3(0.72, 0.58, 0.28));
        }
      }
      const roof = MeshBuilder.CreateCylinder("elephantShrineRoof", { height: 0.08 * s, diameterTop: 0.18 * s, diameterBottom: 0.46 * s, tessellation: 10 }, scene);
      roof.parent = platform;
      roof.position.y = 0.28 * s;
      roof.material = mat(scene, accent, 0.12);
      const halo = MeshBuilder.CreateTorus("elephantShrineHalo", { diameter: 0.34 * s, thickness: 0.018 * s, tessellation: 18 }, scene);
      halo.parent = roof;
      halo.position.y = 0.07 * s;
      halo.rotation.x = Math.PI / 2;
      halo.material = mat(scene, new Color3(1, 0.92, 0.5), 0.3);
      return platform;
    }
    // The tree giant is a hooded, bearded man in a tunic and a rag skirt carrying a whole tree (tree_club; dressed in unitFactory's dressTreeGiant), not a leafy plated block
    case "giant_tree": return null;
    case "giant_bones":
    case "giant_ice": {
      const color = type === "giant_bones"
        ? new Color3(0.88, 0.85, 0.78)
        : new Color3(0.62, 0.9, 1.0);
      const shoulder = MeshBuilder.CreateBox("giantShoulder", { width: 0.55 * s, height: 0.22 * s, depth: 0.16 * s }, scene);
      shoulder.position.set(0, 0.18 * s, -0.06 * s);
      shoulder.parent = body.torso;
      shoulder.material = mat(scene, color, 0.06);
      const crown = MeshBuilder.CreateSphere("giantCrown", { diameter: 0.26 * s, segments: 6 }, scene);
      crown.position.y = 0.05 * s;
      crown.parent = body.headTop;
      crown.material = mat(scene, color, 0.08);
      for (const side of [-1, 1]) {
        const pauldron = MeshBuilder.CreateBox("giantPauldron", { width: 0.18 * s, height: 0.24 * s, depth: 0.14 * s }, scene);
        pauldron.position.set(side * 0.22 * s, 0.14 * s, 0);
        pauldron.rotation.z = side * 0.2;
        pauldron.parent = body.torso;
        pauldron.material = mat(scene, color, 0.08);
      }
      if (type === "giant_bones") {
        for (const side of [-1, 1]) {
          const horn = MeshBuilder.CreateCylinder("boneHorn", { height: 0.18 * s, diameterTop: 0, diameterBottom: 0.05 * s, tessellation: 6 }, scene);
          horn.position.set(side * 0.08 * s, 0.06 * s, 0);
          horn.rotation.z = -side * 0.45;
          horn.parent = crown;
          horn.material = mat(scene, new Color3(0.94, 0.9, 0.82));
        }
      } else {
        for (const side of [-1, 1]) {
          const shard = MeshBuilder.CreateBox("iceHorn", { width: 0.04 * s, height: 0.18 * s, depth: 0.05 * s }, scene);
          shard.position.set(side * 0.08 * s, 0.12 * s, 0);
          shard.rotation.z = side * 0.35;
          shard.parent = crown;
          shard.material = mat(scene, new Color3(0.82, 0.98, 1), 0.18);
        }
      }
      return shoulder;
    }
    case "halo": {
      const halo = MeshBuilder.CreateTorus("halo", { diameter: 0.28 * s, thickness: 0.02 * s, tessellation: 20 }, scene);
      halo.position.y = 0.18 * s;
      halo.parent = body.headTop;
      halo.material = mat(scene, new Color3(1, 0.88, 0.35), 0.25);
      const gem = MeshBuilder.CreateSphere("haloGem", { diameter: 0.05 * s, segments: 6 }, scene);
      gem.position.set(0, 0.02 * s, 0.14 * s);
      gem.parent = halo;
      gem.material = mat(scene, accent, 0.22);
      return halo;
    }
    case "vampire_collar": {
      const collar = MeshBuilder.CreateDisc("vampireCollar", { radius: 0.24 * s, tessellation: 18, arc: 0.62 }, scene);
      collar.parent = body.neck;
      collar.position.set(0, -0.03 * s, -0.08 * s);
      collar.rotation.x = Math.PI * 0.62;
      collar.material = mat(scene, accent.scale(0.72), 0.04);
      for (const side of [-1, 1]) {
        const panel = MeshBuilder.CreatePlane("vampireCollarWing", { width: 0.18 * s, height: 0.22 * s }, scene);
        panel.parent = body.neck;
        panel.position.set(side * 0.16 * s, 0.06 * s, -0.02 * s);
        panel.rotation.y = side * 0.36;
        panel.rotation.z = -side * 0.18;
        panel.material = mat(scene, accent.scale(0.85), 0.05);
      }
      return collar;
    }
    case "quiver_back": {
      const quiver = MeshBuilder.CreateCylinder("quiver", { height: 0.3 * s, diameterTop: 0.08 * s, diameterBottom: 0.1 * s, tessellation: 10 }, scene);
      quiver.parent = body.torso;
      quiver.position.set(-0.16 * s, 0.12 * s, -0.12 * s);
      quiver.rotation.z = 0.34;
      quiver.rotation.x = 0.28;
      quiver.material = mat(scene, new Color3(0.34, 0.22, 0.12));
      const strap = MeshBuilder.CreateBox("quiverStrap", { width: 0.04 * s, height: 0.46 * s, depth: 0.03 * s }, scene);
      strap.parent = body.torso;
      strap.position.set(0.09 * s, 0.06 * s, 0.08 * s);
      strap.rotation.z = -0.72;
      strap.material = mat(scene, new Color3(0.24, 0.14, 0.08));
      for (const zOff of [-0.02, 0.02, 0.06]) {
        const shaft = MeshBuilder.CreateCylinder("quiverArrow", { height: 0.24 * s, diameter: 0.012 * s, tessellation: 6 }, scene);
        shaft.parent = quiver;
        shaft.position.set(0, 0.17 * s, zOff * s);
        shaft.material = mat(scene, new Color3(0.78, 0.72, 0.58));
        const fletch = MeshBuilder.CreateBox("quiverFletch", { width: 0.04 * s, height: 0.028 * s, depth: 0.012 * s }, scene);
        fletch.parent = shaft;
        fletch.position.y = 0.11 * s;
        fletch.material = mat(scene, accent, 0.06);
      }
      return quiver;
    }
    case "banner_back": {
      const pole = MeshBuilder.CreateCylinder("bannerPole", { height: 0.82 * s, diameter: 0.028 * s, tessellation: 6 }, scene);
      pole.parent = body.torso;
      pole.position.set(-0.05 * s, 0.34 * s, -0.08 * s);
      pole.rotation.z = -0.08;
      pole.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      const crossbar = MeshBuilder.CreateCylinder("bannerCross", { height: 0.24 * s, diameter: 0.02 * s, tessellation: 6 }, scene);
      crossbar.parent = pole;
      crossbar.position.set(0.12 * s, 0.28 * s, 0);
      crossbar.rotation.z = Math.PI / 2;
      crossbar.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      const cloth = MeshBuilder.CreatePlane("bannerCloth", { width: 0.2 * s, height: 0.28 * s }, scene);
      cloth.parent = pole;
      cloth.position.set(0.12 * s, 0.14 * s, 0.02 * s);
      cloth.material = mat(scene, accent, 0.08);
      return pole;
    }
    case "chariot_cart": {
      const cart = MeshBuilder.CreateBox("chariotBody", { width: 0.46 * s, height: 0.18 * s, depth: 0.34 * s }, scene);
      cart.parent = body.hip;
      cart.position.set(0, -0.18 * s, -0.14 * s);
      cart.material = mat(scene, new Color3(0.56, 0.39, 0.18));
      for (const side of [-1, 1]) {
        const wheel = MeshBuilder.CreateCylinder("chariotWheel", { height: 0.04 * s, diameter: 0.24 * s, tessellation: 12 }, scene);
        wheel.parent = cart;
        wheel.position.set(side * 0.24 * s, -0.02 * s, 0);
        wheel.rotation.z = Math.PI / 2;
        wheel.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      }
      const yoke = MeshBuilder.CreateBox("chariotYoke", { width: 0.06 * s, height: 0.04 * s, depth: 0.46 * s }, scene);
      yoke.parent = cart;
      yoke.position.set(0, 0.02 * s, 0.28 * s);
      yoke.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      for (const side of [-1, 1]) {
        const horse = MeshBuilder.CreateBox("chariotHorse", { width: 0.12 * s, height: 0.26 * s, depth: 0.42 * s }, scene);
        horse.parent = cart;
        horse.position.set(side * 0.12 * s, -0.02 * s, 0.56 * s);
        horse.material = mat(scene, new Color3(0.72, 0.66, 0.54));
      }
      return cart;
    }
    case "cart":
      return null;
    case "barrel_body": {
      const barrel = MeshBuilder.CreateCylinder("barrelBody", { height: 0.48 * s, diameter: 0.4 * s, tessellation: 12 }, scene);
      barrel.parent = body.hip;
      barrel.position.set(0, -0.12 * s, 0);
      barrel.rotation.z = Math.PI / 2;
      barrel.material = mat(scene, new Color3(0.44, 0.28, 0.16));
      for (const zOff of [-0.14, 0, 0.14]) {
        const hoop = MeshBuilder.CreateTorus("barrelHoop", { diameter: 0.34 * s, thickness: 0.02 * s, tessellation: 18 }, scene);
        hoop.parent = barrel;
        hoop.position.z = zOff * s;
        hoop.rotation.y = Math.PI / 2;
        hoop.material = mat(scene, new Color3(0.28, 0.28, 0.3));
      }
      return barrel;
    }
    default:
      return null;
  }
}
