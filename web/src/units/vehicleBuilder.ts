import {
  Scene, TransformNode, Mesh, MeshBuilder, Color3, Quaternion, Vector3, Ray, Matrix, VertexData,
  PBRMetallicRoughnessMaterial, type Material,
} from "@babylonjs/core";
import { buildArticulatedBody, crewProportions } from "./bodyBuilder";
import type { ArticulatedBody, BodyMetrics, BodyProportions, VehicleSocketSet } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { jitterVertices } from "./tribalDress";
import { dressBallistaCrew } from "./ancientDress";
import { longshipCarrierDress } from "./vikingDress";
import { cannonBandanna, cannonShirt } from "./pirateDress";
import { skeletonCrew } from "./spookyDress";
import { buildFacetedBoulder } from "./propBuilder";
import { getUnit } from "../data/unitDefinitions";

/**
 * IDs of units that should be built as vehicles/equipment rather than humanoids.
 */
export const VEHICLE_UNIT_IDS = new Set([
  "medieval.catapult",
  "ancient.ballista",
  "viking.longship",
  "dynasty.hwacha",
  "pirate.cannon",
  "renaissance.da_vinci_tank",
  "farmer.wheelbarrow",
  "tribal.mammoth",
  "spooky.pumpkin_catapult",
  "legacy.chariot",
  "legacy.tank",
  "secret.bomb_cannon",
  "secret.gatling_gun",
  "good.sacred_elephant",
]);

export function isVehicleUnit(id: string): boolean {
  return VEHICLE_UNIT_IDS.has(id);
}

/**
 * Build a vehicle mesh and return it shaped as an ArticulatedBody
 * so it plugs into the same RuntimeUnit interface.
 *
 * CONVENTION: +Z is the FORWARD / firing direction. Operator sits at -Z (behind).
 * Wheels are on the X axis (sides). Y is up.
 */
export function buildVehicleBody(
  scene: Scene,
  unitId: string,
  bodyColor: Color3,
  options: { showOperators?: boolean } = {},
): ArticulatedBody {
  switch (unitId) {
    case "medieval.catapult": return buildCatapult(scene, bodyColor);
    case "ancient.ballista": return buildBallista(scene, bodyColor);
    case "viking.longship": return buildLongship(scene, bodyColor);
    case "dynasty.hwacha": return buildHwacha(scene, bodyColor, options);
    case "pirate.cannon": return buildCannon(scene, bodyColor);
    case "renaissance.da_vinci_tank": return buildDaVinciTank(scene, bodyColor, options);
    case "farmer.wheelbarrow": return buildWheelbarrow(scene, bodyColor);
    case "tribal.mammoth": return buildMammoth(scene, bodyColor, MAMMOTH_HIDE, 0, getUnit("tribal.mammoth")?.giantScale ?? 1);
    case "spooky.pumpkin_catapult": return buildCatapult(scene, bodyColor, { spooky: true });
    case "legacy.chariot": return buildChariot(scene, bodyColor);
    case "legacy.tank": return buildLegacyTank(scene, bodyColor, options);
    case "secret.bomb_cannon": return buildBombCannon(scene, bodyColor, options);
    case "secret.gatling_gun": return buildGatlingGun(scene, bodyColor, options);
    case "good.sacred_elephant": return buildSacredElephant(scene, bodyColor);
    default: return buildCatapult(scene, bodyColor);
  }
}

function makeMat(_scene: Scene, color: Color3): PBRMetallicRoughnessMaterial {
  return getMaterialFactory().getWood(color);
}

function brighten(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.95, 0.95, 0.95), amount);
}

function darken(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.12, 0.12, 0.12), amount);
}

function dummyJoint(name: string, parent: TransformNode, scene: Scene): TransformNode {
  const t = new TransformNode(name, scene);
  t.parent = parent;
  return t;
}

function makeBodyMetrics(
  headTopY: number,
  shoulderWidth: number,
  hipWidth: number,
  handReachY: number,
): BodyMetrics {
  return {
    overallHeight: headTopY,
    headTopY,
    shoulderWidth,
    hipWidth,
    handReachY,
    footBottomY: 0,
  };
}

function makeSocket(
  scene: Scene,
  parent: TransformNode,
  name: string,
  position: Vector3,
): TransformNode {
  const socket = new TransformNode(name, scene);
  socket.parent = parent;
  socket.position.copyFrom(position);
  return socket;
}

/**
 * Create a stub ArticulatedBody from vehicle parts.
 * All "limb" joints point to dummy nodes so the animator doesn't crash.
 */
function wrapAsBody(
  scene: Scene,
  root: TransformNode,
  mainMesh: Mesh,
  allMeshes: Mesh[],
  headMesh?: Mesh,
  metrics: BodyMetrics = makeBodyMetrics(1.8, 0.8, 0.5, 0.7),
  vehicleSockets?: VehicleSocketSet,
): ArticulatedBody {
  // Clone visible source materials so applyMaterialPreset() mutates the actual vehicle meshes.
  const srcBody = (mainMesh.material as PBRMetallicRoughnessMaterial) ?? makeMat(scene, new Color3(0.55, 0.45, 0.35));
  const bodyMaterial = srcBody.clone(`${srcBody.name}_vehicle_body`) as PBRMetallicRoughnessMaterial;
  const srcSkin = headMesh?.material as PBRMetallicRoughnessMaterial | undefined;
  const skinMaterial = srcSkin
    ? srcSkin.clone(`${srcSkin.name}_vehicle_skin`) as PBRMetallicRoughnessMaterial
    : bodyMaterial;

  for (const mesh of allMeshes) {
    if (mesh.material === srcBody) mesh.material = bodyMaterial;
    if (srcSkin && mesh.material === srcSkin) mesh.material = skinMaterial;
  }

  if (mainMesh.material !== bodyMaterial) mainMesh.material = bodyMaterial;
  if (headMesh && headMesh.material !== skinMaterial) headMesh.material = skinMaterial;

  const hip = dummyJoint("v_hip", root, scene);
  hip.position.y = Math.max(0.45, metrics.overallHeight * 0.28);
  const torso = dummyJoint("v_torso", hip, scene);
  torso.position.y = Math.max(0.02, metrics.overallHeight * 0.05);
  const neck = dummyJoint("v_neck", torso, scene);
  neck.position.y = Math.max(0.18, metrics.headTopY - hip.position.y - torso.position.y - 0.22);

  const lShoulder = dummyJoint("v_ls", torso, scene);
  const lElbow = dummyJoint("v_le", lShoulder, scene);
  const rShoulder = dummyJoint("v_rs", torso, scene);
  const rElbow = dummyJoint("v_re", rShoulder, scene);
  const lHip = dummyJoint("v_lh", hip, scene);
  const lKnee = dummyJoint("v_lk", lHip, scene);
  const rHip = dummyJoint("v_rh", hip, scene);
  const rKnee = dummyJoint("v_rk", rHip, scene);
  const rHand = dummyJoint("v_rhand", rElbow, scene);
  const lHand = dummyJoint("v_lhand", lElbow, scene);
  const headTop = dummyJoint("v_headtop", neck, scene);
  headTop.position.y = Math.max(0.12, metrics.headTopY - hip.position.y - torso.position.y - neck.position.y);

  const hd = headMesh ?? mainMesh;
  const allJoints = [hip, torso, neck, lShoulder, lElbow, rShoulder, rElbow, lHip, lKnee, rHip, rKnee];

  return {
    root, bodyMaterial, skinMaterial, metrics, hip, torso, torsoMesh: mainMesh, neck, headMesh: hd,
    leftShoulder: lShoulder, leftUpperArm: mainMesh, leftElbow: lElbow, leftLowerArm: mainMesh,
    rightShoulder: rShoulder, rightUpperArm: mainMesh, rightElbow: rElbow, rightLowerArm: mainMesh,
    leftHip: lHip, leftUpperLeg: mainMesh, leftKnee: lKnee, leftLowerLeg: mainMesh,
    rightHip: rHip, rightUpperLeg: mainMesh, rightKnee: rKnee, rightLowerLeg: mainMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints, vehicleSockets,
  };
}

interface VehicleOperator {
  headMesh: Mesh;
  headTopY: number;
  body: ArticulatedBody;
}

/** A gun crewman: a small man in the cut of the infantry, his own height, head and limb lengths, their shirt and trouser widths. */
const OPERATOR_PROPORTIONS: Partial<BodyProportions> = crewProportions({
  scale: 0.46,
  bulk: 1.3,
  torsoWidth: 1.16,
  headSize: 1.35,
  armLength: 0.86,
  legLength: 0.92,
  headLength: 1.16,
  headWidth: 1.05,
  torsoRoundness: 1.1,
  upperArmWidth: 1.2,
  upperLegWidth: 1.15,
  handSize: 1.1,
  footLength: 1.1,
  footWidth: 0.98,
  footHeight: 0.86,
});

// Helper to add an operator (small person) at a given position
function addOperator(
  scene: Scene, root: TransformNode, allMeshes: Mesh[],
  x: number, y: number, z: number, color: Color3,
  pose?: (body: ArticulatedBody) => void,
  proportions: Partial<BodyProportions> = OPERATOR_PROPORTIONS,
): VehicleOperator {
  const operator = buildArticulatedBody(
    scene,
    `vehicle_operator_${Math.random().toString(36).slice(2, 6)}`,
    proportions,
    color,
    { detailLevel: "operator" },
  );
  operator.root.parent = root;
  operator.root.position.set(x, y, z);
  pose?.(operator);
  allMeshes.push(...operator.allMeshes);
  return {
    headMesh: operator.headMesh,
    headTopY: operator.root.position.y + operator.metrics.headTopY,
    body: operator,
  };
}

// ═══════════════════════ CATAPULT ═══════════════════════
// Fires FORWARD (+Z). Arm swings over the top toward +Z.
// A siege machine stands over the men beside it: built at man height, then the whole rig is scaled under the root
const CATAPULT_SCALE = 1.4;
/*
 * [S] throwing arm (351; medieval.catapult.jpg: the arm whips up to upright and the boulder leaves the bucket on a high arc). The arm turns about a pivot
 * CATAPULT_ARM.pivotY up on the crossbar, .long to the bucket and .short to the counterweight. At rest it is cocked, the bucket end .cocked rad below
 * level behind the frame; on a shot it turns forward over the top to .thrown rad (upright), in RuntimeUnit's catapult throw (CATAPULT_THROW).
 */
export const CATAPULT_ARM = { pivotY: 1.62, long: 1.0, short: 0.7, cocked: 0.35, thrown: Math.PI / 2 };
export const CATAPULT_ARM_PIVOT = "catapult_arm_pivot";
/*
 * [S] the catapult's crewman (354; medieval.catapult.red.png, card Appearance "a Wobbler in a simple coif cap along with a shirt and a pair of belt-held pants
 * and shoes holding onto the bucket"). He stands on the back of the deck (rig units: .z along the firing axis, .y his feet) facing the bucket, both arms
 * raised .raise rad up to its underside, .spread apart, elbows .elbow; no counterweight block hangs in front of him. Dressed: a pale coif hood over his head
 * and neck, the team shirt, a brown belt, brown breeches and dark shoes (dressCatapultCrew, CREW_DRESS).
 */
const CATAPULT_CREW = { z: -0.74, y: 0.5, raise: -2.8, spread: 0.12, elbow: -0.2 };
/** The catapult's boulder across, in the bucket and in flight (buildFacetedBoulder) */
export const CATAPULT_BOULDER = 0.65;
/*
 * [S] spoon bucket (355; medieval.catapult.blue.png: a wooden cup at the arm's end cradles the rock, its lower half sunk in). An open eight-sided cup on the
 * long end: .bottom across at the base on the arm, flaring to .top at the mouth, .deep tall, both faces drawn so the inside wall shows; a chunky .rim
 * ring round the mouth in a lighter timber (.tone) so the cup reads against the arm. The boulder sits .sink of its height down inside it.
 */
/*
 * [S] box trestle frame (356; medieval.catapult.red.png: an open timber box on the wheels, not a slab; A-frame uprights; thick crossbeams; a block cap on every
 * corner; bolts through the front beam). Side rails CATAPULT_FRAME.long along the firing axis at x = +-.half, .railY up, beams .beam square; front, middle and back
 * crossbeams; .cap block caps on the rail ends and the crossbar's ends; each upright an A of two legs from .spread fore and aft of the middle up to the crossbar
 * under the arm's pivot, braced at half height; .bolt hex bolts on the front beam; a .deck plank deck at the back where the crewman stands.
 */
const CATAPULT_FRAME = { long: 1.6, half: 0.42, railY: 0.42, beam: 0.16, cap: 0.24, spread: 0.55, bolt: 0.09, deck: 0.5 };
/*
 * [S] wheels (357; medieval.catapult.red.png: small wooden wheels with grey iron rims tucked in at the frame corners, not big black tyres out at the sides). Each
 * wheel CATAPULT_WHEEL.across tall (its top near the rail caps), a .facets-sided timber drum in the orange .tone .face of it across standing .proud of a grey
 * .iron tyre .tyreWide thick, a small iron hub .hub of it across; at each rail end beside its corner cap.
 */
const CATAPULT_WHEEL = { across: 0.56, face: 0.8, tyreWide: 0.13, proud: 0.015, hub: 0.22, facets: 10, tone: new Color3(0.6, 0.3, 0.13), iron: new Color3(0.42, 0.43, 0.46) };
const CATAPULT_PAINT = { wood: new Color3(0.66, 0.32, 0.14), woodGlow: 0.16, paintGlow: 0.12, long: 0.62, short: 0.4, strip: 0.5, shift: 0.14 };
const CATAPULT_BUCKET = { bottom: 0.4, top: 0.68, deep: 0.28, rim: 0.06, sink: 0.45, tone: new Color3(0.55, 0.26, 0.12) };
/*
 * [S] 437 the Pumpkin Catapult's rib cage (audit 434 pumpkin_catapult b.2: "payload holder in unit_spooky.pumpkin_catapult_windup is a wooden cup - TABS:
 * a bone rib cage cradling a jack-o'-lantern"; spooky.pumpkin_catapult.red.png, card Appearance "the boulder holder for a rib cage": at the arm's end a
 * cream spine lies along it and curved cream ribs rise either side of it round the underside and flanks of a big orange jack-o'-lantern, open at the
 * top, the carved face glowing). RIB_CRADLE, in the arm pivot's frame (rig units): .ribs ribs .step apart along the arm about the cup's place, each a
 * bone tube .bone thick swept round the pumpkin's foot from .open rad off its top on one flank to the same on the other, .out of the pumpkin's radius
 * from its middle, the end ribs .taper smaller; a spine along their feet with a knob at each end; the jack-o'-lantern .size across, squashed
 * .squash, .lobes ribbed lobes, a stem and a glowing carved face (two triangle eyes, a toothed mouth) on each flank. Bone cream self-lit .glow.
 */
const RIB_CRADLE = {
  ribs: 4, step: 0.12, bone: 0.035, open: 0.75, out: 1.12, taper: 0.85, size: 0.5, squash: 0.82, lobes: 8, glow: 0.2,
  boneColor: new Color3(1.0, 0.86, 0.6), orange: new Color3(0.9, 0.38, 0.08), stem: new Color3(0.25, 0.3, 0.1), face: new Color3(1, 0.8, 0.2),
};
/*
 * [S] 438 the Pumpkin Catapult's bones (audit 434 pumpkin_catapult b.1: "crossbars are timber - TABS: cream bones lashed as the arm and crossbars";
 * spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones": the throwing arm is one long cream bone with knobbed ends, two
 * short bones lashed across it with dark cord in an X; a cream bone lies across the uprights' tops, run out past them, and a bigger one across their
 * fronts lower down, its knobbed ends standing out past the frame each side). BONE_FRAME (rig units): the arm .arm thick, crossbones .cross long at
 * .crossAt of the long end out from the pivot; the top bar .bar thick, run .past out each side; the low bone .big thick at .lowAt of the uprights'
 * height, run .past * 1.5 out; each end two knobs .knob of its thickness across, .lobe of it apart; cords .cord thick in BF.lash. RIB_CRADLE's bone.
 */
/*
 * [S] 442 the Pumpkin Catapult's upright posts (CONFIRM 441 pumpkin_catapult a.3: "the side frames are triangular A-frames - TABS: two tall upright square
 * posts rise from the chassis rails, joined by a crossbeam"; spooky.pumpkin_catapult.blue.png: on each rail a pair of thick square timber posts stands
 * straight up, side by side along the rail, to the top crossbar, a block collar round them low down). PUMPKIN_POSTS, in frame beams (F.beam): per rail
 * two posts .thick beams square, their centres .apart beams fore and aft of the pivot, from the rail to .over beams above the crossbar line; a collar
 * .collar of a post wide and .collarTall beams tall at .collarAt of the rise; a cleat block at their foot. The A-frame legs and brace are the medieval's
 * alone; the low bone crosses the posts' fronts.
 */
const PUMPKIN_POSTS = { thick: 1.35, apart: 0.75, over: 0.3, collar: 1.3, collarTall: 1.4, collarAt: 0.28 };
const BONE_FRAME = { arm: 0.11, cross: 0.62, crossAt: [0.5, 0.15], bar: 0.12, big: 0.15, lowAt: 0.62, past: 0.12, knob: 1.35, lobe: 0.32, cord: 0.025, lash: new Color3(0.14, 0.08, 0.06) };
/*
 * [S] 438 the Pumpkin Catapult's team banners (audit 434 pumpkin_catapult a.2: "banners absent - TABS: small team banners hanging on both sides of the
 * frame"; spooky.pumpkin_catapult.red.png, card Appearance "Team distinction comes in the form of small banners at both sides of the catapult": off each
 * knobbed end of the low crossbone a dark cord drops to a narrow team pennant hanging down the frame's flank to about the rails, its foot cut in two
 * tails). CATAPULT_BANNER (rig units): the cord .cord long; the cloth a slab .wide along the firing axis, .tall, .thick, set .back of the bone, swung
 * .sway rad; two tails .tail long; a dark rod across its head. Team (.shade of it) self-lit .glow.
 */
const PUMPKIN_TIMBER = { color: new Color3(0.1, 0.055, 0.05), glow: 0.14 };
const CATAPULT_BANNER = { cord: 0.06, wide: 0.24, tall: 0.46, thick: 0.025, back: 0.0, sway: 0.06, tail: 0.12, shade: 0.8, glow: 0.18 };
function buildCatapult(scene: Scene, color: Color3, options: { spooky?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("catapult_root", scene);
  const rig = new TransformNode("catapult_rig", scene);
  rig.parent = root;
  rig.scaling.setAll(CATAPULT_SCALE);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  // [S] painted timber (358; medieval.catapult.blue.png: orange timber with team paint streaked along the beams and uprights). The medieval catapult's wood is
  // CATAPULT_PAINT.wood (self-lit .woodGlow); on each long beam two team streaks (.team self-lit .paintGlow): one .long of the beam down two opposite faces, the
  // other .short of it down the other two, set off-centre in opposite directions (.shift) so the paint reads as worn streaks, not bands. The pumpkin keeps its own.
  const P = CATAPULT_PAINT;
  // [S] 441 the Pumpkin Catapult's black timber (434 pumpkin_catapult a.1: "frame is the medieval reddish-brown timber A-frame - TABS: near-black timber
  // frame"; spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones": rails, legs, crossbeams, caps, wheels and the deck all one
  // near-black plum-brown timber, its faces just told apart by the light). PUMPKIN_TIMBER: its own "cloth" material (the "wood" preset lifts a dark value
  // to grey-taupe), the code value off output/loop/palette.png's brown row at x .12-.18, self-lit .glow; it dresses the frame, the arm's wood, the wheel
  // faces and the counterweight. The axle stays the team body source (LESSONS 14).
  const pumpkinTimber = options.spooky ? getMaterialFactory().get("cloth", PUMPKIN_TIMBER.color, { emissive: PUMPKIN_TIMBER.color.scale(PUMPKIN_TIMBER.glow) }) : null;
  const wood = pumpkinTimber ?? getMaterialFactory().get("wood", P.wood, { emissive: P.wood.scale(P.woodGlow) });
  const paint = options.spooky ? null : getMaterialFactory().get("wood", color, { emissive: color.scale(P.paintGlow) });
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));
  const wheelWood = pumpkinTimber ?? makeMat(scene, new Color3(0.2, 0.14, 0.09)); // the cannon's dark wheel timber, so the wheels stand off the frame

  // Box trestle (CATAPULT_FRAME): no slab bed. Two side rails along the firing axis tied by a front, a middle and a back crossbeam, a block cap on each
  // rail end, two bolts through the front beam; a short plank deck at the back for the crewman to stand on.
  const F = CATAPULT_FRAME;
  const beam = (name: string, w: number, h: number, d: number, x: number, y: number, z: number): Mesh => {
    const m = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    m.position.set(x, y, z); m.parent = rig; m.material = wood; allMeshes.push(m);
    if (paint && name !== "frameCap" && name !== "base") {
      // the beam's long axis and its two short ones, as box dimensions [w, h, d]
      const dims = [w, h, d];
      const long = dims.indexOf(Math.max(...dims));
      const [a, b] = [0, 1, 2].filter((i) => i !== long);
      for (const [cover, strip, along, shift] of [[a, b, P.long, P.shift], [b, a, P.short, -P.shift]] as const) {
        const size = [0, 0, 0];
        size[long] = dims[long] * along;
        size[cover] = dims[cover] * 1.04;
        size[strip] = dims[strip] * P.strip;
        const s = MeshBuilder.CreateBox("framePaint", { width: size[0], height: size[1], depth: size[2] }, scene);
        const off = [0, 0, 0];
        off[long] = dims[long] * shift;
        off[strip] = dims[strip] * (shift > 0 ? 0.12 : -0.12);
        s.position.set(off[0], off[1], off[2]);
        s.parent = m; s.material = paint; allMeshes.push(s);
      }
    }
    return m;
  };
  for (const side of [-1, 1]) beam("frameRail", F.beam, F.beam, F.long, side * F.half, F.railY, 0);
  for (const z of [-1, 0, 1]) beam("frameCrossbeam", F.half * 2 + F.beam, F.beam * (z === 0 ? 0.8 : 1), F.beam, 0, F.railY, z * (F.long / 2 - F.beam / 2));
  for (const side of [-1, 1]) for (const end of [-1, 1]) beam("frameCap", F.cap, F.cap, F.cap, side * F.half, F.railY, end * (F.long / 2 - F.cap / 2 + 0.02));
  for (const side of [-1, 1]) {
    const bolt = MeshBuilder.CreateCylinder("frameBolt", { height: 0.04, diameter: F.bolt, tessellation: 6 }, scene);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(side * F.half * 0.45, F.railY, F.long / 2 + 0.01);
    bolt.parent = rig; bolt.material = metal; allMeshes.push(bolt);
  }
  beam("base", F.half * 2, 0.08, F.deck, 0, F.railY + F.beam / 2 - 0.04, -(F.long - F.deck) / 2);

  // Wheels (CATAPULT_WHEEL): a short faceted timber drum on a grey iron tyre at each rail end, tucked in beside the corner caps
  const W = CATAPULT_WHEEL;
  const wheelTimber = pumpkinTimber ?? getMaterialFactory().get("wood", W.tone, { emissive: W.tone.scale(0.18) });
  const iron = makeMat(scene, W.iron);
  for (const side of [-1, 1]) {
    for (const end of [-1, 1]) {
      const x = side * (F.half + F.cap / 2 + W.tyreWide / 2 + 0.01), z = end * (F.long / 2 - F.cap / 2), y = W.across / 2;
      const tyre = MeshBuilder.CreateCylinder("wheelRim", { height: W.tyreWide, diameter: W.across, tessellation: W.facets }, scene);
      tyre.convertToFlatShadedMesh();
      tyre.position.set(x, y, z); tyre.rotation.z = Math.PI / 2;
      tyre.parent = rig; tyre.material = iron; allMeshes.push(tyre);
      // the timber face stands proud of the tyre each side, so the iron reads as a band round it
      const face = MeshBuilder.CreateCylinder("wheel", { height: W.tyreWide + W.proud * 2, diameter: W.across * W.face, tessellation: W.facets }, scene);
      face.convertToFlatShadedMesh();
      face.position.set(x, y, z); face.rotation.z = Math.PI / 2;
      face.parent = rig; face.material = wheelTimber; allMeshes.push(face);
      const hub = MeshBuilder.CreateCylinder("wheelHub", { height: W.tyreWide + W.proud * 4, diameter: W.across * W.hub, tessellation: 6 }, scene);
      hub.position.set(x, y, z); hub.rotation.z = Math.PI / 2;
      hub.parent = rig; hub.material = iron; allMeshes.push(hub);
    }
  }

  // A-frame uprights: on each rail two legs lean in from its front and back to meet under the crossbar, braced across at half height; the crossbar over
  // both, a block cap at each end of it
  const topY = CATAPULT_ARM.pivotY - 0.12;
  // [S] 442 the pumpkin catapult stands on upright posts, not A-frames (spec at PUMPKIN_POSTS)
  const PP = PUMPKIN_POSTS;
  if (options.spooky) {
    for (const side of [-1, 1]) {
      const x = side * F.half;
      for (const end of [-1, 1]) {
        beam("framePost", F.beam * PP.thick, topY - F.railY + F.beam * PP.over, F.beam * PP.thick, x, (topY + F.railY + F.beam * PP.over) / 2, end * F.beam * PP.apart);
      }
      // a block collar round both posts low down, and a cleat block where they meet the rail
      beam("postCollar", F.beam * PP.thick * PP.collar, F.beam * PP.collarTall, F.beam * (PP.apart * 2 + PP.thick * PP.collar), x, F.railY + (topY - F.railY) * PP.collarAt, 0);
      beam("postCleat", F.beam * PP.thick * PP.collar, F.beam * 0.9, F.beam * (PP.apart * 2 + PP.thick) * 1.35, x, F.railY + F.beam * 0.9, 0);
    }
  }
  for (const side of options.spooky ? [] : [-1, 1]) {
    for (const end of [-1, 1]) {
      const footZ = end * F.spread, rise = topY - F.railY;
      const len = Math.hypot(rise, footZ);
      const leg = beam("frameLeg", F.beam, len, F.beam, side * F.half, F.railY + rise / 2, footZ / 2);
      leg.rotation.x = -end * Math.atan2(F.spread, rise);
    }
    beam("frameBrace", F.beam * 0.8, F.beam * 0.8, F.spread * 1.05, side * F.half, F.railY + (topY - F.railY) * 0.45, 0);
  }
  // [S] 438 the pumpkin catapult's crossbars are bones (spec at BONE_FRAME)
  const BF = BONE_FRAME;
  const boneMat = options.spooky ? getMaterialFactory().get("cloth", RIB_CRADLE.boneColor, { emissive: RIB_CRADLE.boneColor.scale(RIB_CRADLE.glow) }) : null;
  const lashMat = options.spooky ? getMaterialFactory().get("cloth", BF.lash, { emissive: BF.lash.scale(0.1) }) : null;
  // a bone along local x (`long` m, `thick` across) with two knob condyles at each end, under `parent`
  const boneBar = (name: string, parent: TransformNode, long: number, thick: number, at: Vector3, alongZ = false): void => {
    const shaft = MeshBuilder.CreateCylinder(name, { height: long, diameter: thick, tessellation: 7 }, scene);
    if (alongZ) shaft.rotation.x = Math.PI / 2; else shaft.rotation.z = Math.PI / 2;
    shaft.position.copyFrom(at);
    shaft.parent = parent; shaft.material = boneMat; allMeshes.push(shaft);
    for (const end of [-1, 1]) {
      for (const lobe of [-1, 1]) {
        const knob = MeshBuilder.CreateSphere(`${name}Knob`, { diameter: thick * BF.knob, segments: 4 }, scene);
        const off = end * (long / 2 - thick * 0.25);
        knob.position.set(at.x + (alongZ ? lobe * thick * BF.lobe : off), at.y + (alongZ ? 0 : lobe * thick * BF.lobe), at.z + (alongZ ? off : 0));
        knob.parent = parent; knob.material = boneMat; allMeshes.push(knob);
      }
    }
  };
  // dark cord lashed in an X where two bones cross, square to `normal` (x, y or z) at `at`
  const lashing = (parent: TransformNode, at: Vector3, size: number, normal: "y" | "z"): void => {
    for (const k of [-1, 1]) {
      // a flat band `size` long, a fifth of it wide, cord-thin along the normal, turned 45 deg either way about it
      const cord = normal === "z"
        ? MeshBuilder.CreateBox("boneLashing", { width: size, height: size * 0.2, depth: BF.cord }, scene)
        : MeshBuilder.CreateBox("boneLashing", { width: size, height: BF.cord, depth: size * 0.2 }, scene);
      cord.position.copyFrom(at);
      if (normal === "z") cord.rotation.z = k * Math.PI / 4; else cord.rotation.y = k * Math.PI / 4;
      cord.parent = parent; cord.material = lashMat; allMeshes.push(cord);
    }
  };
  if (options.spooky) {
    // the top crossbar a bone run out past the uprights' caps
    boneBar("crossbar", rig, F.half * 2 + F.beam + BF.past * 2, BF.bar, new Vector3(0, topY, 0));
    // and a big bone across the uprights' fronts lower down, lashed to each leg
    const lowY = F.railY + (topY - F.railY) * BF.lowAt;
    // [S] 442 across the posts' fronts (PUMPKIN_POSTS), not the A-frame legs'
    const lowZ = F.beam * (PP.apart + PP.thick / 2) + BF.big * 0.6;
    boneBar("crossbarLow", rig, F.half * 2 + F.beam + BF.past * 3, BF.big, new Vector3(0, lowY, lowZ));
    for (const side of [-1, 1]) lashing(rig, new Vector3(side * F.half, lowY, lowZ + BF.big * 0.4), BF.big * 1.5, "z");
    // [S] 438 a small team banner hung by a cord off each end of the low bone, down the frame's flank (spec at CATAPULT_BANNER)
    const CB = CATAPULT_BANNER;
    const flag = getMaterialFactory().get("cloth", color.scale(CB.shade), { emissive: color.scale(CB.shade * CB.glow) });
    const endX = (F.half * 2 + F.beam + BF.past * 3) / 2 - BF.big * 0.4;
    for (const side of [-1, 1]) {
      const x = side * endX;
      const cord = MeshBuilder.CreateBox("bannerCord", { width: BF.cord, height: CB.cord, depth: BF.cord }, scene);
      cord.position.set(x, lowY - CB.cord / 2, lowZ);
      cord.parent = rig; cord.material = lashMat; allMeshes.push(cord);
      const top = lowY - CB.cord;
      const cloth = MeshBuilder.CreateBox("banner", { width: CB.thick, height: CB.tall, depth: CB.wide }, scene);
      cloth.position.set(x, top - CB.tall / 2, lowZ - CB.back);
      cloth.rotation.x = CB.sway * side;
      cloth.parent = rig; cloth.material = flag; allMeshes.push(cloth);
      // its foot cut into two swallow tails
      for (const tail of [-1, 1]) {
        const t = MeshBuilder.CreateCylinder("bannerTail", { height: CB.tail, diameterTop: CB.wide * 0.5, diameterBottom: 0, tessellation: 4 }, scene);
        t.scaling.x = CB.thick / (CB.wide * 0.5) * 1.4;
        t.position.set(0, -CB.tall / 2 - CB.tail / 2 + 0.005, tail * CB.wide * 0.25);
        t.parent = cloth; t.material = flag; allMeshes.push(t);
      }
      // a dark rod across its head
      const rod = MeshBuilder.CreateBox("bannerRod", { width: CB.thick * 2, height: BF.cord * 1.6, depth: CB.wide * 1.15 }, scene);
      rod.position.set(0, CB.tall / 2, 0);
      rod.parent = cloth; rod.material = lashMat; allMeshes.push(rod);
    }
  } else {
    beam("crossbar", F.half * 2 + F.beam, F.beam, F.beam, 0, topY, 0);
  }
  for (const side of [-1, 1]) beam("frameCap", F.cap, F.cap, F.cap, side * (F.half + F.beam * 0.25), topY + 0.04, 0);

  // Throwing arm on its pivot at the crossbar (CATAPULT_ARM; swung by RuntimeUnit's catapult throw). Built along -Z from the pivot (bucket end back), the
  // pivot then turned to the cocked pose: the bucket end pulled down behind the frame, the short end with the counterweight up over the front.
  const pivot = new TransformNode(CATAPULT_ARM_PIVOT, scene);
  pivot.parent = rig;
  pivot.position.set(0, CATAPULT_ARM.pivotY, 0);
  pivot.rotation.x = -CATAPULT_ARM.cocked;
  const L = CATAPULT_ARM.long;
  if (options.spooky) {
    // [S] 438 the throwing arm a long bone, two short crossbones lashed across it (BONE_FRAME)
    boneBar("arm", pivot, L + CATAPULT_ARM.short, BF.arm, new Vector3(0, 0, (CATAPULT_ARM.short - L) / 2), true);
    for (const at of BF.crossAt) {
      const z = -L * at;
      boneBar("armCrossbone", pivot, BF.cross, BF.arm * 0.8, new Vector3(0, BF.arm * 0.2, z));
      lashing(pivot, new Vector3(0, BF.arm * 0.75, z), BF.arm * 1.6, "y");
    }
  } else {
    const arm = MeshBuilder.CreateBox("arm", { width: 0.16, height: 0.16, depth: L + CATAPULT_ARM.short }, scene);
    arm.position.set(0, 0, (CATAPULT_ARM.short - L) / 2);
    arm.parent = pivot; arm.material = wood; allMeshes.push(arm);
  }

  // Spoon bucket on the long end (CATAPULT_BUCKET): an open flared cup sat on the arm, rim ring round its mouth, the shot sunk in it
  const B = CATAPULT_BUCKET;
  const cupY = 0.08 + B.deep / 2;
  const cupZ = -L + 0.06;
  if (!options.spooky) {
    const bucketWood = makeMat(scene, B.tone);
    const bucket = MeshBuilder.CreateCylinder("bucket", {
      height: B.deep, diameterBottom: B.bottom, diameterTop: B.top, tessellation: 8, cap: Mesh.CAP_START, sideOrientation: Mesh.DOUBLESIDE,
    }, scene);
    bucket.position.set(0, cupY, cupZ);
    bucket.parent = pivot; bucket.material = bucketWood; allMeshes.push(bucket);
    const bucketRim = MeshBuilder.CreateTorus("bucketRim", { diameter: B.top, thickness: B.rim, tessellation: 8 }, scene);
    bucketRim.position.set(0, cupY + B.deep / 2, cupZ);
    bucketRim.parent = pivot; bucketRim.material = wood; allMeshes.push(bucketRim);
  }
  const payloadY = cupY + B.deep / 2 - B.sink * CATAPULT_BOULDER + CATAPULT_BOULDER / 2;

  if (options.spooky) {
    // [S] 437 a bone rib cage cradling a jack-o'-lantern in place of the wooden cup (spec at RIB_CRADLE)
    const R = RIB_CRADLE;
    const bone = getMaterialFactory().get("cloth", R.boneColor, { emissive: R.boneColor.scale(R.glow) });
    const orange = getMaterialFactory().get("cloth", R.orange, { emissive: R.orange.scale(0.14) });
    const rad = R.size / 2, midY = 0.08 + R.bone * 2 + rad * R.squash * R.out;
    for (let k = 0; k < R.ribs; k++) {
      const t = k / (R.ribs - 1) - 0.5;
      const r = rad * R.out * (Math.abs(t) > 0.4 ? R.taper : 1);
      const path: Vector3[] = [];
      for (let i = 0; i <= 12; i++) {
        // round the foot from one flank to the other: 0 straight down, +-(pi - open) up the flanks
        const a = (i / 12 - 0.5) * 2 * (Math.PI - R.open);
        path.push(new Vector3(Math.sin(a) * r, midY - Math.cos(a) * r * R.squash, cupZ + t * R.step * (R.ribs - 1)));
      }
      const rib = MeshBuilder.CreateTube("ribCradleRib", { path, radius: R.bone, tessellation: 6, cap: Mesh.CAP_ALL }, scene);
      rib.parent = pivot; rib.material = bone; allMeshes.push(rib);
      for (const end of [path[0], path[path.length - 1]]) {
        const knob = MeshBuilder.CreateSphere("ribCradleKnob", { diameter: R.bone * 2.6, segments: 4 }, scene);
        knob.position.copyFrom(end);
        knob.parent = pivot; knob.material = bone; allMeshes.push(knob);
      }
    }
    const spineLong = R.step * (R.ribs - 1) + R.bone * 6;
    const spine = MeshBuilder.CreateCylinder("ribCradleSpine", { height: spineLong, diameter: R.bone * 3.2, tessellation: 6 }, scene);
    spine.rotation.x = Math.PI / 2;
    spine.position.set(0, midY - rad * R.out * R.squash, cupZ);
    spine.parent = pivot; spine.material = bone; allMeshes.push(spine);
    for (const end of [-1, 1]) {
      const knob = MeshBuilder.CreateSphere("ribCradleKnob", { diameter: R.bone * 4.4, segments: 4 }, scene);
      knob.position.set(0, spine.position.y, cupZ + end * spineLong / 2);
      knob.parent = pivot; knob.material = bone; allMeshes.push(knob);
    }
    // the jack-o'-lantern sat in it: a squat ribbed pumpkin, a stem, a glowing carved face on each flank
    const pumpkin = new TransformNode("pumpkinPayload", scene);
    pumpkin.position.set(0, midY, cupZ);
    pumpkin.parent = pivot;
    const core = MeshBuilder.CreateSphere("pumpkinPayloadCore", { diameter: R.size, segments: 6 }, scene);
    core.scaling.y = R.squash;
    core.parent = pumpkin; core.material = orange; allMeshes.push(core);
    for (let i = 0; i < R.lobes; i++) {
      const a = (i / R.lobes) * Math.PI * 2;
      const lobe = MeshBuilder.CreateSphere("pumpkinPayloadLobe", { diameter: R.size * 0.5, segments: 4 }, scene);
      lobe.scaling.set(1, R.squash * 1.9, 1);
      lobe.position.set(Math.cos(a) * R.size * 0.27, 0, Math.sin(a) * R.size * 0.27);
      lobe.parent = pumpkin; lobe.material = orange; allMeshes.push(lobe);
    }
    const stem = MeshBuilder.CreateCylinder("pumpkinPayloadStem", { height: R.size * 0.22, diameterTop: R.size * 0.07, diameterBottom: R.size * 0.12, tessellation: 5 }, scene);
    stem.position.y = R.size * R.squash * 0.5 + R.size * 0.06;
    stem.rotation.z = 0.25;
    stem.parent = pumpkin; stem.material = getMaterialFactory().get("cloth", R.stem, { emissive: R.stem.scale(0.1) }); allMeshes.push(stem);
    const glow = getMaterialFactory().get("unlit", R.face, { emissive: R.face.scale(1.1) });
    for (const side of [-1, 1]) {
      const x = side * (R.size * 0.5 + R.size * 0.02);
      for (const ez of [-1, 1]) {
        const eye = MeshBuilder.CreateCylinder("pumpkinPayloadEye", { height: R.size * 0.04, diameter: R.size * 0.2, tessellation: 3 }, scene);
        eye.rotation.z = Math.PI / 2;
        eye.position.set(x, R.size * 0.09, ez * R.size * 0.14);
        eye.parent = pumpkin; eye.material = glow; allMeshes.push(eye);
      }
      const mouth = MeshBuilder.CreateBox("pumpkinPayloadMouth", { width: R.size * 0.04, height: R.size * 0.08, depth: R.size * 0.4 }, scene);
      mouth.position.set(x, -R.size * 0.11, 0);
      mouth.parent = pumpkin; mouth.material = glow; allMeshes.push(mouth);
    }
  } else {
    // The faceted grey-brown boulder (BOULDER in propBuilder), the same rock the shot flies as; wider than the tray it lies in
    const boulder = buildFacetedBoulder(scene, "boulderPayload", CATAPULT_BOULDER);
    boulder.position.set(0, payloadY, cupZ);
    boulder.parent = pivot;
    allMeshes.push(boulder);
  }

  // Counterweight on the short end, hung under the arm: a big dark block of the wheels' timber (the pumpkin catapult's; the medieval one has none, 354: it read as a
  // black cube hiding the crewman)
  if (options.spooky) {
    const cw = MeshBuilder.CreateBox("cw", { width: 0.36, height: 0.44, depth: 0.4 }, scene);
    cw.position.set(0, -0.3, CATAPULT_ARM.short - 0.2);
    cw.parent = pivot; cw.material = wheelWood; allMeshes.push(cw);
  }

  // Axle under the deck: the body mesh that takes the team tint, as on the cannon, so the timber keeps its own colours
  const axle = MeshBuilder.CreateCylinder("axle", { height: 1.1, diameter: 0.08, tessellation: 6 }, scene);
  axle.position.y = 0.35;
  axle.rotation.z = Math.PI / 2;
  axle.parent = rig; axle.material = teamPrimary; allMeshes.push(axle);

  // Operator sitting beside, behind the frame
  // Dressed as a gun crewman: bare, he was a washed mannequin beside the machine
  const operator = options.spooky
    ? addOperator(scene, rig, allMeshes, 0.4, 0.72, -0.5, color, (body) => {
      // [S] 439 a skeleton in tattered team rags, not a gun crewman (spookyDress SKELETON_CREW)
      allMeshes.push(...skeletonCrew(scene, body, color));
    })
    : addOperator(scene, rig, allMeshes, 0, CATAPULT_CREW.y, CATAPULT_CREW.z, color, (body) => {
      body.root.rotation.y = Math.PI;
      for (const [shoulder, elbow, side] of [[body.leftShoulder, body.leftElbow, -1], [body.rightShoulder, body.rightElbow, 1]] as const) {
        shoulder.rotation.set(CATAPULT_CREW.raise, 0, side * CATAPULT_CREW.spread);
        elbow.rotation.set(CATAPULT_CREW.elbow, 0, 0);
      }
      dressCatapultCrew(scene, body);
    });
  // [S] 440 the skeleton's skull is bone like the rest of him: wrapAsBody clones the head's material as the team-tinted skin and moves every mesh
  // sharing it (all his bones) onto that clone, so he hands it a hidden anchor in the skull with a material of its own instead
  let headMesh = operator.headMesh;
  if (options.spooky) {
    headMesh = MeshBuilder.CreateBox("skeletonCrewSkullAnchor", { size: 0.02 }, scene);
    headMesh.material = new PBRMetallicRoughnessMaterial("skeletonCrewSkullAnchor", scene);
    headMesh.parent = operator.headMesh;
    headMesh.isVisible = false;
    headMesh.isPickable = false;
  }

  const vehicleSockets: VehicleSocketSet = {
    // The shot leaves where the bucket is when the arm stands upright at the end of its swing (CATAPULT_ARM.thrown)
    primaryMuzzle: makeSocket(scene, rig, "catapult_bucket_socket", new Vector3(0, CATAPULT_ARM.pivotY + CATAPULT_ARM.long + 0.1, 0.35)),
    impactOrigin: makeSocket(scene, rig, "catapult_impact_socket", new Vector3(0, CATAPULT_ARM.pivotY + CATAPULT_ARM.long, 0.2)),
  };

  return wrapAsBody(
    scene,
    root,
    axle,
    allMeshes,
    headMesh,
    makeBodyMetrics(operator.headTopY * CATAPULT_SCALE, 0.8 * CATAPULT_SCALE, 0.45 * CATAPULT_SCALE, 0.8 * CATAPULT_SCALE),
    vehicleSockets,
  );
}

function buildBombCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const body = buildCannon(scene, color, options);
  const root = body.root;
  // One fat tapered mortar barrel: the field gun's own barrel comes off, so there are not two tubes stacked
  for (const name of ["barrel", "barrelBand", "breechKnob", "muzzle", "cannonSight"]) {
    for (let i = body.allMeshes.length - 1; i >= 0; i--) {
      if (body.allMeshes[i].name === name) body.allMeshes.splice(i, 1)[0].dispose();
    }
  }
  // Short and stubby, 0.7 long with the muzzle where it was, and hooped by two raised bands
  const barrelMat = makeMat(scene, new Color3(0.45, 0.41, 0.375));
  const barrel = MeshBuilder.CreateCylinder("bombBarrel", { height: 0.7, diameterTop: 0.3, diameterBottom: 0.38, tessellation: 8 }, scene);
  barrel.position.set(0, 0.52, 0.55); // at 0.69 the barrel sat at its crew's head height, and at 0.60 it still rode above the wheel rims
  barrel.rotation.x = Math.PI / 2 - 0.18;
  barrel.parent = root;
  barrel.material = barrelMat;
  body.allMeshes.push(barrel);
  for (const [along, d] of [[-0.2, 0.43], [0.16, 0.39]]) {
    const band = MeshBuilder.CreateCylinder("bombBand", { height: 0.08, diameter: d, tessellation: 8 }, scene);
    band.position.set(0, 0.52 + Math.sin(0.18) * along, 0.55 + Math.cos(0.18) * along);
    band.rotation.x = Math.PI / 2 - 0.18;
    band.parent = root;
    band.material = barrelMat;
    body.allMeshes.push(band);
  }
  const bomb = MeshBuilder.CreateSphere("bombRound", { diameter: 0.22, segments: 8 }, scene);
  bomb.position.set(0, 0.55, 0.75);
  bomb.parent = root;
  bomb.material = makeMat(scene, new Color3(0.12, 0.12, 0.12));
  body.allMeshes.push(bomb);
  body.vehicleSockets = {
    primaryMuzzle: makeSocket(scene, root, "bomb_cannon_muzzle_socket", new Vector3(0, 0.61, 0.96)),
    smokeSocket: makeSocket(scene, root, "bomb_cannon_smoke_socket", new Vector3(0, 0.59, 0.9)),
    impactOrigin: makeSocket(scene, root, "bomb_cannon_impact_socket", new Vector3(0, 0.55, 0.78)),
  };
  return body;
}

function buildGatlingGun(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("gatling_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.45, 0.32, 0.18));
  const metal = makeMat(scene, new Color3(0.32, 0.34, 0.38));

  const chassis = MeshBuilder.CreateBox("gatlingChassis", { width: 0.9, height: 0.18, depth: 1.2 }, scene);
  chassis.position.y = 0.45;
  chassis.parent = root;
  chassis.material = teamPrimary;
  allMeshes.push(chassis);

  for (const xOff of [-0.38, 0.38]) {
    for (const zOff of [-0.32, 0.32]) {
      const wheel = MeshBuilder.CreateCylinder("gatlingWheel", { height: 0.08, diameter: 0.44, tessellation: 12 }, scene);
      wheel.position.set(xOff, 0.24, zOff);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = root;
      wheel.material = wood;
      allMeshes.push(wheel);
    }
  }

  const carriage = MeshBuilder.CreateBox("gatlingCarriage", { width: 0.35, height: 0.18, depth: 0.45 }, scene);
  carriage.position.set(0, 0.72, 0.2);
  carriage.parent = root;
  carriage.material = metal;
  allMeshes.push(carriage);

  for (let i = 0; i < 5; i++) {
    const barrel = MeshBuilder.CreateCylinder("gatlingBarrel", { height: 0.95, diameter: 0.06, tessellation: 10 }, scene);
    const angle = (Math.PI * 2 * i) / 5;
    barrel.position.set(Math.cos(angle) * 0.1, 0.76 + Math.sin(angle) * 0.1, 0.55);
    barrel.rotation.x = Math.PI / 2;
    barrel.parent = root;
    barrel.material = metal;
    allMeshes.push(barrel);
  }

  const crank = MeshBuilder.CreateCylinder("gatlingCrank", { height: 0.25, diameter: 0.03, tessellation: 6 }, scene);
  crank.position.set(0.2, 0.72, -0.05);
  crank.rotation.z = Math.PI / 2;
  crank.parent = root;
  crank.material = metal;
  allMeshes.push(crank);

  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, root, allMeshes, -0.22, 0.78, -0.18, color);
    addOperator(scene, root, allMeshes, 0.22, 0.78, -0.18, color);
  }
  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "gatling_muzzle_socket", new Vector3(0, 0.76, 1.08)),
    smokeSocket: makeSocket(scene, root, "gatling_smoke_socket", new Vector3(0, 0.76, 1.02)),
    impactOrigin: makeSocket(scene, root, "gatling_impact_socket", new Vector3(0, 0.76, 0.98)),
  };
  return wrapAsBody(
    scene,
    root,
    chassis,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.62, 0.8, 0.48, 0.84),
    vehicleSockets,
  );
}

// ═══════════════════════ BALLISTA ═══════════════════════
// Fires FORWARD (+Z). Bolt points along +Z. Bow arms at the front.
/*
 * [S] box frame (384; ancient.ballista.red.png, .blue.png: a tall open box of red-brown timber on four spoked wheels, two torsion-spring housings on its top
 * with team coil caps, small iron plates on the top plank, bow arms out of the sides bound in black, a long trough to the rear). Metres, +z the firing line:
 *   - BALLISTA_FRAME: a top plank .wide across, .deep fore and aft, .plank thick, its top at .top; four corner posts .post square from .floor up to it and
 *     two inner posts either side of the trough slot (.slot across); a bottom plank at .floor; front and back rails at mid height. Open between the posts,
 *     so the two spring columns (.spring across) stand inside the box under the housings, seen through the front.
 *   - BALLISTA_HOUSING: on the top plank at x = +-.at, an eight-sided collar .base across, .baseTall, a drum .drum across, .drumTall above it, and a lumpy
 *     team coil cap .cap across on the drum; .plates dark iron plates .plate long on the top plank in two rows.
 *   - BALLISTA_ARMS: from the frame's sides out to .reach of half-width each way, .thick square, tapering to .tip; a black binding .bind long at .bindAt.
 *   - BALLISTA_STOCK: a trough .wide across from .front ahead of the frame back to .back behind it, its top at the plank's; two dark cords along it; a winch
 *     axle across its rear end with four handle spokes on each side.
 *   - BALLISTA_WHEEL: four wheels .across tall at the frame's corners, outside the posts: an open ten-sided rim .rim thick on four spokes round a hub.
 */
/*
 * [S] 390 the frame stands above a man (ancient.ballista.png, factions/ancient.jpg: the box's top plank over the crew's heads, ~1.3 of a man, the bow
 * arms and the bolt passing through the box at mid height between the spring columns, a beam across at that height; critic 389: top about .8 of a
 * man). BALLISTA_FRAME.top 1.02 -> 1.7 (taller corner and inner posts lift the top plank and housings); the trough no longer lies on the top plank:
 * its top at BALLISTA_STOCK.y, through the slot between the inner posts, the arms out of the sides at that height on a cross beam .beam tall front
 * and back, so the crewman still works the winch at chest height.
 */
const BALLISTA_FRAME = { wide: 1.5, deep: 0.62, plank: 0.11, top: 1.7, post: 0.13, slot: 0.24, floor: 0.34, spring: 0.17, beam: 0.12 };
const BALLISTA_HOUSING = { at: 0.48, base: 0.34, baseTall: 0.07, drum: 0.24, drumTall: 0.13, cap: 0.24, plates: 8, plate: 0.13 };
const BALLISTA_ARMS = { reach: 1.75, thick: 0.1, tip: 0.6, bind: 0.13, bindAt: 0.72 };
const BALLISTA_STOCK = { wide: 0.18, tall: 0.12, front: 0.5, back: 1.55, y: 1.0 };
const BALLISTA_WHEEL = { across: 0.62, rim: 0.07, wide: 0.08, hub: 0.12 };
// [S] 389 a warm terracotta in the PBR's linear space (ancient.ballista.blue.png ~ sRGB .78/.4/.28): the 384 (.62,.3,.2) displayed as a pale taupe
const BALLISTA_WOOD = new Color3(0.55, 0.15, 0.075);
/* [S] 389 the top plank's iron plates: columns at .cols of the half width each side, rows .edge in from its front and back edges, .wide x .thick x .deep */
/*
 * [S] 389 the loaded bolt (spec at its build): a shaft .shaft long, .thick across at the head, .tail of that at its butt; its leaf head .head long with
 * the point .past ahead of the trough's front, widest (.wide) .waist of the way back from the socket end, .flat of that thick; a socket .socket long.
 */
const BALLISTA_BOLT = { shaft: 1.45, thick: 0.1, tail: 0.7, head: 0.62, past: 0.75, wide: 0.24, waist: 0.3, flat: 0.3, socket: 0.1, iron: new Color3(0.03, 0.03, 0.04) };
const BALLISTA_PLATES = { cols: [0.2, 0.83], edge: 0.08, wide: 0.075, thick: 0.022, deep: 0.12, iron: new Color3(0.08, 0.08, 0.09) };
/*
 * [S] 388 the crewman at the trough's rear end (ancient.ballista.blue.png: a helmeted team crewman close behind the machine, his helmeted head over the
 * stock, both hands on it; critic 387: crouched beside the trough under the beam his head and helmet were buried in it, his hands not on the stock;
 * critic 378: a bare team man standing 2 m off). BALLISTA_CREW: on the firing line, .gap m behind the stock's rear end, standing (hips at .y), facing
 * the machine, his trunk leaning .lean rad in over the stock; each arm aimed (solved in world space, not Euler guesses) straight at the winch handle on
 * its side, .grip m out from the axle's end; feet a little apart (.splay). His iron helmet is ancientDress dressBallistaCrew.
 */
const BALLISTA_CREW = { gap: 0.3, y: 0.72, lean: 0.3, grip: 0.06, splay: 0.08 };
function buildBallista(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("ballista_root", scene);
  const allMeshes: Mesh[] = [];
  const mf = getMaterialFactory();
  const wood = mf.get("wood", BALLISTA_WOOD, { emissive: BALLISTA_WOOD.scale(0.14) });
  const darkWood = mf.get("wood", BALLISTA_WOOD.scale(0.7), { emissive: BALLISTA_WOOD.scale(0.08) });
  const iron = mf.get("cloth", new Color3(0.36, 0.32, 0.3), { emissive: new Color3(0.05, 0.045, 0.04) });
  const black = mf.get("cloth", new Color3(0.12, 0.12, 0.13));
  // the coil caps wear the team paint the vehicle wrapper tints (its main mesh's material), so the timber keeps its own brown
  const team = makeMat(scene, color);
  const add = <T extends Mesh>(m: T, material: Material, parent: TransformNode = root): T => {
    m.parent = parent; m.material = material; allMeshes.push(m); return m;
  };
  const box = (name: string, w: number, h: number, d: number, x: number, y: number, z: number, material: Material = wood): Mesh => {
    const m = add(MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene), material);
    m.position.set(x, y, z);
    return m;
  };

  // Frame: top plank, corner and inner posts, bottom plank, front and back rails
  const F = BALLISTA_FRAME;
  const halfW = F.wide / 2;
  const halfD = F.deep / 2;
  box("ballistaTop", F.wide, F.plank, F.deep, 0, F.top - F.plank / 2, 0);
  const postTall = F.top - F.plank - F.floor;
  const postY = F.floor + postTall / 2;
  for (const x of [-halfW + F.post / 2, halfW - F.post / 2, -(F.slot / 2 + F.post / 2), F.slot / 2 + F.post / 2]) {
    for (const z of [-halfD + F.post / 2, halfD - F.post / 2]) box("ballistaPost", F.post, postTall, F.post, x, postY, z);
  }
  box("ballistaFloor", F.wide - 0.1, F.plank, F.deep - 0.06, 0, F.floor + F.plank / 2, 0);
  for (const z of [-halfD + 0.03, halfD - 0.03]) box("ballistaRail", F.wide - 0.06, 0.1, 0.06, 0, F.floor + (BALLISTA_STOCK.y - F.floor) * 0.45, z, darkWood);
  // [S] 390 the cross beams at the arms' height, front and back, the trough's slot left open between the inner posts
  const armY = BALLISTA_STOCK.y - BALLISTA_STOCK.tall * 0.5;
  for (const z of [-halfD + 0.04, halfD - 0.04]) {
    for (const side of [-1, 1]) {
      const span = halfW - F.slot / 2 - F.post;
      box("ballistaBeam", span, F.beam, 0.08, side * (halfW + F.slot / 2) / 2, armY, z, darkWood);
    }
  }
  // the spring columns inside the box, under each housing
  for (const side of [-1, 1]) {
    const spring = add(MeshBuilder.CreateCylinder("ballistaSpring", { height: postTall, diameter: F.spring, tessellation: 8 }, scene), darkWood);
    spring.position.set(side * BALLISTA_HOUSING.at, postY, 0);
  }

  // Torsion housings with team coil caps, iron plates on the plank
  const H = BALLISTA_HOUSING;
  const caps: Mesh[] = [];
  for (const side of [-1, 1]) {
    const collar = add(MeshBuilder.CreateCylinder("ballistaCollar", { height: H.baseTall, diameter: H.base, tessellation: 8 }, scene), darkWood);
    collar.position.set(side * H.at, F.top + H.baseTall / 2, 0);
    const drum = add(MeshBuilder.CreateCylinder("ballistaDrum", { height: H.drumTall, diameterTop: H.drum * 1.08, diameterBottom: H.drum, tessellation: 8 }, scene), darkWood);
    drum.position.set(side * H.at, F.top + H.baseTall + H.drumTall / 2, 0);
    const cap = add(MeshBuilder.CreateIcoSphere("ballistaCoil", { radius: H.cap / 2, subdivisions: 1, flat: true }, scene), team);
    cap.scaling.set(1, 0.62, 0.9);
    cap.position.set(side * H.at, F.top + H.baseTall + H.drumTall + H.cap * 0.18, 0);
    jitterVertices(cap, 0.18, 7 + side);
    caps.push(cap);
  }
  // [S] 389 the iron plates in two rows of four along the plank's front and back edges (BALLISTA_PLATES; ancient.ballista.blue.png: dark slabs at
  // .2 and .83 of the half width each side, clear of the housings), not one grid row that skipped six of its eight under the housings
  const P = BALLISTA_PLATES;
  const plateIron = mf.get("cloth", P.iron, { emissive: P.iron.scale(0.1) });
  for (const zs of [-1, 1]) {
    for (const xs of P.cols) {
      for (const side of [-1, 1]) box("ballistaPlate", P.wide, P.thick, P.deep, side * xs * halfW, F.top + P.thick / 2, zs * (halfD - P.edge), plateIron);
    }
  }

  // Bow arms out of the sides, black bindings
  const A = BALLISTA_ARMS;
  for (const side of [-1, 1]) {
    const length = A.reach - halfW;
    const arm = add(MeshBuilder.CreateCylinder("ballistaArm", { height: length, diameterTop: A.thick * A.tip, diameterBottom: A.thick, tessellation: 4 }, scene), wood);
    arm.rotation.z = -side * Math.PI / 2;
    arm.position.set(side * (halfW + length / 2), armY, halfD * 0.4);
    const bind = add(MeshBuilder.CreateCylinder("ballistaBind", { height: A.bind, diameter: A.thick * 1.35, tessellation: 6 }, scene), black);
    bind.rotation.z = Math.PI / 2;
    bind.position.set(side * (halfW + length * (A.bindAt - 0.5) + length / 2), arm.position.y, arm.position.z);
  }

  // Trough to the rear, cords along it, winch at its end
  const S = BALLISTA_STOCK;
  const stockLong = S.front + S.back;
  const stockZ = (S.front - S.back) / 2;
  const stockY = S.y - S.tall / 2;
  box("ballistaStock", S.wide, S.tall, stockLong, 0, stockY, stockZ);
  for (const side of [-1, 1]) box("ballistaCord", 0.02, 0.02, stockLong * 0.85, side * S.wide * 0.22, stockY + S.tall / 2 + 0.012, stockZ - stockLong * 0.05, black);
  const winchZ = -S.back + 0.08;
  const axle = add(MeshBuilder.CreateCylinder("ballistaWinch", { height: S.wide + 0.24, diameter: 0.06, tessellation: 6 }, scene), darkWood);
  axle.rotation.z = Math.PI / 2;
  axle.position.set(0, stockY, winchZ);
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const spoke = add(MeshBuilder.CreateBox("ballistaHandle", { width: 0.025, height: 0.26, depth: 0.025 }, scene), black);
      spoke.position.set(side * (S.wide / 2 + 0.1), stockY, winchZ);
      spoke.rotation.x = (k * Math.PI) / 4;
    }
  }

  // Loaded bolt in the trough, its leaf head past the frame's front
  // [S] 389 a huge bolt (BALLISTA_BOLT; ancient.ballista.red.png, .png: a thick wooden shaft tapering to the rear, a long flat near-black leaf head
  // well past the frame's front, a socket where it meets the shaft; critic 388: a thin rod), not the 5 cm rod with a small spike
  const Bt = BALLISTA_BOLT;
  const boltIron = mf.get("cloth", Bt.iron, { emissive: Bt.iron.scale(0.2) });
  const shaftFront = S.front + Bt.past - Bt.head;
  // [S] 390 the bolt is one node, "ballistaLoadedBolt", its +y the point (turned onto the firing line), origin where shaft meets socket: the sim flies a
  // copy of it (simulationSystem LOADED_BOLTS, ProjectileSystem._buildHeldMissile) and hides this one until the reload is half done (ancient.ballista.png:
  // the bolt in flight is the same massive shaft and black leaf head; critic 389: a thin dark rod flew while the loaded bolt stayed in the trough)
  const boltY = stockY + S.tall / 2 + Bt.thick / 2;
  const loaded = new TransformNode("ballistaLoadedBolt", scene);
  loaded.parent = root;
  loaded.rotation.x = Math.PI / 2;
  loaded.position.set(0, boltY, shaftFront);
  const bolt = add(MeshBuilder.CreateCylinder("bolt", { height: Bt.shaft, diameterTop: Bt.thick, diameterBottom: Bt.thick * Bt.tail, tessellation: 8 }, scene), wood, loaded);
  bolt.position.y = -Bt.shaft / 2;
  const socket = add(MeshBuilder.CreateCylinder("boltSocket", { height: Bt.socket, diameterTop: Bt.thick * 1.25, diameterBottom: Bt.thick * 1.1, tessellation: 8 }, scene), boltIron, loaded);
  socket.position.y = Bt.socket / 2 - 0.01;
  // the leaf: a long front blade to the point and a short back taper to the socket, flat (wide across, thin up and down)
  const blade = add(MeshBuilder.CreateCylinder("boltHead", { height: Bt.head * (1 - Bt.waist), diameterTop: 0, diameterBottom: Bt.wide, tessellation: 4 }, scene), boltIron, loaded);
  blade.scaling.z = Bt.flat;
  blade.position.y = Bt.head * Bt.waist + (Bt.head * (1 - Bt.waist)) / 2;
  const back = add(MeshBuilder.CreateCylinder("boltHead", { height: Bt.head * Bt.waist, diameterTop: Bt.wide, diameterBottom: Bt.thick * 1.1, tessellation: 4 }, scene), boltIron, loaded);
  back.scaling.z = Bt.flat;
  back.position.y = (Bt.head * Bt.waist) / 2;
  // [S] 390 the leaf crossed by an upright copy, so it shows its broad face from the side as well as from above (ancient.ballista.png: the flying head
  // broad side-on; in the look capture the flat leaf flew edge-on, a thin spike)
  for (const piece of [blade, back]) {
    const upright = add(piece.clone("boltHead", loaded) as Mesh, boltIron, loaded);
    upright.scaling.set(Bt.flat, 1, 1);
  }

  // Four spoked wheels at the corners, outside the posts
  const W = BALLISTA_WHEEL;
  for (const x of [-(halfW + W.wide / 2 + 0.01), halfW + W.wide / 2 + 0.01]) {
    for (const z of [-halfD + 0.05, halfD - 0.05]) {
      const rim = add(MeshBuilder.CreateTorus("ballistaWheel", { diameter: W.across - W.rim, thickness: W.rim, tessellation: 10 }, scene), wood);
      rim.rotation.z = Math.PI / 2;
      rim.scaling.y = W.wide / W.rim;
      rim.position.set(x, W.across / 2, z);
      for (let k = 0; k < 2; k++) {
        const spoke = add(MeshBuilder.CreateBox("ballistaSpoke", { width: 0.04, height: W.across - W.rim, depth: 0.04 }, scene), wood);
        spoke.position.set(x, W.across / 2, z);
        spoke.rotation.x = (k * Math.PI) / 2 + Math.PI / 4;
      }
      const hub = add(MeshBuilder.CreateCylinder("ballistaHub", { height: W.wide * 1.3, diameter: W.hub, tessellation: 8 }, scene), darkWood);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(x, W.across / 2, z);
    }
  }

  // [S] 388 the crewman behind the trough's rear end, leaning in, both hands on the winch handles, helmeted (spec at BALLISTA_CREW)
  const C = BALLISTA_CREW;
  const operator = addOperator(scene, root, allMeshes, 0, C.y, -S.back - C.gap, color, (man) => {
    man.torso.rotation.x = C.lean;
    for (const [hip, side] of [[man.leftHip, -1], [man.rightHip, 1]] as const) hip.rotation.z = side * C.splay;
    settleWorld(root);
    for (const [shoulder, elbow] of [[man.leftShoulder, man.leftElbow], [man.rightShoulder, man.rightElbow]] as const) {
      settleWorld(shoulder);
      const from = shoulder.getAbsolutePosition();
      const side = Math.sign(Vector3.TransformCoordinates(from, root.getWorldMatrix().clone().invert()).x) || 1;
      const handle = Vector3.TransformCoordinates(new Vector3(side * (S.wide / 2 + 0.1 + C.grip), stockY, winchZ), root.getWorldMatrix());
      const dir = handle.subtract(from);
      aimLimb(shoulder, dir);
      elbow.rotation.setAll(0);
      aimLimb(elbow, dir);
    }
    dressBallistaCrew(scene, man);
  });

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "ballista_bolt_socket", new Vector3(0, boltY, S.front + 0.4)),
    impactOrigin: makeSocket(scene, root, "ballista_impact_socket", new Vector3(0, boltY, S.front)),
  };

  return wrapAsBody(
    scene,
    root,
    caps[0],
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(Math.max(operator.headTopY, F.top + H.baseTall + H.drumTall), 0.72, 0.4, 0.78),
    vehicleSockets,
  );
}

// ═══════════════════════ HWACHA ═══════════════════════
/** [S] 416 the hwacha's launch rack (buildHwacha): .cols x .rows cells .cell across, .post posts and rails, .lath laths, .depth deep, seated .seatY up
 * and .seatZ ahead on the cart, leant back .lean rad; light .wood, dark .head diamond heads .headSize of a cell, drawn out .headLong toward the front. */
const HWACHA_RACK = {
  cols: 10, rows: 6, cell: 0.11, post: 0.06, lath: 0.018, depth: 0.22, seatY: 0.5, seatZ: 0.12, lean: 0.22, headSize: 0.36, headLong: 1.3,
  wood: new Color3(0.72, 0.45, 0.24), head: new Color3(0.16, 0.16, 0.2),
};
/** [S] 418 the hwacha's wheels (dynasty.hwacha.jpg: two big open wheels of light timber, an eight-sided rim on eight spokes round a dark hub): .across
 * tall, the rim .rim thick and .wide across the tread, .sides facets, .spokes spokes .spoke thick, the hub .hub across; set .out outside the cart's rails at .z. */
const HWACHA_WHEEL = { across: 0.74, rim: 0.07, wide: 0.08, sides: 8, spokes: 8, spoke: 0.035, hub: 0.14, out: 0.05, z: -0.1 };
/** [S] 419 the hwacha's shafts (dynasty.hwacha.red.png: two long brown beams from under the rack, past the wheels' inside, sloping down behind to team-coloured
 * end blocks): each .wide x .deep, from .frontY/.frontZ to .rearY/.rearZ at .x either side; a team cap .cap tall, .capLong long at the rear end. */
const HWACHA_SHAFT = { x: 0.45, wide: 0.1, deep: 0.09, frontY: 0.5, frontZ: 0.55, rearY: 0.18, rearZ: -1.45, cap: 0.2, capLong: 0.1, wood: new Color3(0.5, 0.28, 0.14) };
/** [P] 420 one self-lit timber for the rack, bed, shafts and wheels (audit 411 a.2: "timber colour near-black - TABS: light orange-brown wood"; the wood
 * preset displayed grey-taupe): orange x .6 off output/loop/palette.png, cloth with a .12 self-light, as the dress modules' timber. */
const HWACHA_TIMBER = new Color3(0.6, 0.27, 0.08);
// TABS-style hwacha: wide wooden cart with large, steeply-tilted rack of tube holes
// filled with rocket arrows pointing upward. Big spoked wheels, cart handles behind.
function buildHwacha(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("hwacha_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const darkWood = makeMat(scene, new Color3(0.35, 0.22, 0.1));
  const red = makeMat(scene, new Color3(0.72, 0.18, 0.12));
  const shaft = makeMat(scene, new Color3(0.6, 0.5, 0.3));
  const tubeMat = makeMat(scene, new Color3(0.42, 0.28, 0.14));

  // ─── Cart base ───
  const base = MeshBuilder.CreateBox("base", { width: 1.3, height: 0.1, depth: 1.2 }, scene);
  const timber = getMaterialFactory().get("cloth", HWACHA_TIMBER, { emissive: HWACHA_TIMBER.scale(0.12) }); // [P] 420
  base.position.y = 0.4; base.parent = root; base.material = timber; allMeshes.push(base); // [S] 419 a timber bed, not a team tray
  // the body's own material is tinted to the team (wrapAsBody, applyMaterialPreset), so the body mesh is a team core hidden inside the bed, and the bed's
  // timber material (shared with the rack and wheels) stays wood
  const core = MeshBuilder.CreateBox("hwachaCore", { width: 1.2, height: 0.08, depth: 1.1 }, scene);
  core.position.y = 0.4; core.parent = root; core.material = teamPrimary; allMeshes.push(core);

  // Side rails along the cart
  for (const xOff of [-0.6, 0.6]) {
    const sideRail = MeshBuilder.CreateBox("srail", { width: 0.06, height: 0.08, depth: 1.2 }, scene);
    sideRail.position.set(xOff, 0.45, 0);
    sideRail.parent = root; sideRail.material = darkWood; allMeshes.push(sideRail);
  }

  // ─── [S] 418 two spoked octagonal wheels (spec at HWACHA_WHEEL; audit a.3: "solid dark discs - TABS: spoked octagonal wooden wheels") ───
  const Wh = HWACHA_WHEEL;
  const wheelWood = timber;
  for (const xOff of [-0.6, 0.6]) {
    const at = new Vector3(xOff + Math.sign(xOff) * Wh.out, Wh.across / 2, Wh.z);
    const rim = MeshBuilder.CreateTorus("wheel", { diameter: Wh.across - Wh.rim, thickness: Wh.rim, tessellation: Wh.sides }, scene);
    rim.convertToFlatShadedMesh();
    rim.rotation.z = Math.PI / 2;
    rim.scaling.y = Wh.wide / Wh.rim;
    rim.position.copyFrom(at);
    rim.parent = root; rim.material = wheelWood; allMeshes.push(rim);
    const hub = MeshBuilder.CreateCylinder("hub", { height: Wh.wide * 1.6, diameter: Wh.hub, tessellation: 8 }, scene);
    hub.rotation.z = Math.PI / 2;
    hub.position.copyFrom(at);
    hub.parent = root; hub.material = darkWood; allMeshes.push(hub);
    for (let k = 0; k < Wh.spokes / 2; k++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: Wh.spoke, height: Wh.across - Wh.rim, depth: Wh.spoke }, scene);
      spoke.position.copyFrom(at);
      spoke.rotation.x = (k * Math.PI * 2) / Wh.spokes + Math.PI / Wh.spokes;
      spoke.parent = root; spoke.material = wheelWood; allMeshes.push(spoke);
    }
  }

  // ─── [S] 419 two long brown shafts (spec at HWACHA_SHAFT; audit a.4: "a flat team-blue tray - TABS: two long brown shafts with team end caps") ───
  const Sh = HWACHA_SHAFT;
  const shaftWood = timber;
  for (const side of [-1, 1]) {
    const from = new Vector3(side * Sh.x, Sh.frontY, Sh.frontZ), to = new Vector3(side * Sh.x, Sh.rearY, Sh.rearZ);
    const run = to.subtract(from);
    const bar = MeshBuilder.CreateBox("hwachaShaft", { width: Sh.wide, height: Sh.deep, depth: run.length() }, scene);
    bar.position.copyFrom(Vector3.Center(from, to));
    bar.lookAt(to); // the root stands at the origin while it is built
    bar.parent = root; bar.material = shaftWood; allMeshes.push(bar);
    const cap = MeshBuilder.CreateBox("hwachaShaftCap", { width: Sh.wide * 1.25, height: Sh.cap, depth: Sh.capLong }, scene);
    cap.position.copyFrom(to.add(run.normalize().scale(Sh.capLong * 0.3)));
    cap.lookAt(cap.position.add(run));
    cap.parent = root; cap.material = teamPrimary; allMeshes.push(cap);
  }

  // ─── [S] 416 the launch rack: an upright light-wood lattice, HWACHA_RACK.cols x .rows square slots facing forward, a dark diamond rocket head in each
  // (audit 411 a.1: "a dark sloped box with a flat top plate - TABS: an upright lattice frame of 6x10 slots facing forward"; dynasty.hwacha.red.png:
  // a light orange-brown frame of posts and rails round a grid of laths, every cell holding a dark pyramid point on a tube, the frame leant back a
  // little on a plank shelf over the cart) ───
  const R = HWACHA_RACK;
  const lightWood = timber;
  const headMat = makeMat(scene, R.head);
  const rackPivot = new TransformNode("rackPivot", scene);
  rackPivot.position.set(0, R.seatY, R.seatZ);
  rackPivot.rotation.x = -R.lean;
  rackPivot.parent = root;
  const W = R.cols * R.cell, H = R.rows * R.cell;
  // the shelf under it
  const shelf = MeshBuilder.CreateBox("rackShelf", { width: W + R.post * 3, height: R.post * 0.8, depth: R.depth * 1.6 }, scene);
  shelf.position.set(0, -R.post * 0.4, 0);
  shelf.parent = rackPivot; shelf.material = lightWood; allMeshes.push(shelf);
  // the back board the tubes sit in
  const back = MeshBuilder.CreateBox("rackBack", { width: W, height: H, depth: R.post * 0.5 }, scene);
  back.position.set(0, H / 2 + R.post, -R.depth * 0.5);
  back.parent = rackPivot; back.material = darkWood; allMeshes.push(back);
  // the posts and the top and bottom rails
  for (const x of [-1, 1]) {
    const post = MeshBuilder.CreateBox("rackPost", { width: R.post, height: H + R.post * 2.6, depth: R.depth }, scene);
    post.position.set(x * (W / 2 + R.post / 2), H / 2 + R.post, 0);
    post.parent = rackPivot; post.material = lightWood; allMeshes.push(post);
  }
  for (const y of [R.post / 2, H + R.post * 1.5]) {
    const rail = MeshBuilder.CreateBox("rackRail", { width: W + R.post * 2, height: R.post, depth: R.depth }, scene);
    rail.position.set(0, y, 0);
    rail.parent = rackPivot; rail.material = lightWood; allMeshes.push(rail);
  }
  // the lattice: thin laths between the cells
  for (let c = 1; c < R.cols; c++) {
    const lath = MeshBuilder.CreateBox("rackLath", { width: R.lath, height: H, depth: R.depth * 0.7 }, scene);
    lath.position.set(-W / 2 + c * R.cell, H / 2 + R.post, 0);
    lath.parent = rackPivot; lath.material = lightWood; allMeshes.push(lath);
  }
  for (let r = 1; r < R.rows; r++) {
    const lath = MeshBuilder.CreateBox("rackLath", { width: W, height: R.lath, depth: R.depth * 0.7 }, scene);
    lath.position.set(0, R.post + r * R.cell, 0);
    lath.parent = rackPivot; lath.material = lightWood; allMeshes.push(lath);
  }
  // a rocket in each cell: a tube back into the board, a dark diamond head standing out of the face
  const muzzleSequence: TransformNode[] = [];
  for (let row = 0; row < R.rows; row++) {
    for (let col = 0; col < R.cols; col++) {
      const cx = -W / 2 + (col + 0.5) * R.cell;
      const cy = R.post + (R.rows - row - 0.5) * R.cell;
      const tube = MeshBuilder.CreateCylinder("tube", { height: R.depth, diameter: R.cell * 0.32, tessellation: 6 }, scene);
      tube.position.set(cx, cy, -R.depth * 0.1);
      tube.rotation.x = Math.PI / 2;
      tube.parent = rackPivot; tube.material = tubeMat; allMeshes.push(tube);
      const tip = MeshBuilder.CreatePolyhedron("tip", { type: 1, size: R.cell * R.headSize }, scene);
      tip.scaling.z = R.headLong;
      tip.position.set(cx, cy, R.depth * 0.5 + R.cell * R.headSize * 0.4);
      tip.parent = rackPivot; tip.material = headMat; allMeshes.push(tip);
      if (muzzleSequence.length < 14 && row % 2 === 0 && col % 2 === 0) {
        muzzleSequence.push(makeSocket(scene, rackPivot, `hwacha_muzzle_${row}_${col}`, new Vector3(cx, cy, R.depth * 0.5 + R.cell)));
      }
    }
  }
  void red; void shaft;

  // ─── Rear support struts (angled braces from base to rack back) ───
  for (const xOff of [-0.35, 0.35]) {
    const strut = MeshBuilder.CreateBox("strut", { width: 0.05, height: 0.6, depth: 0.05 }, scene);
    strut.position.set(xOff, 0.6, -0.3);
    strut.rotation.x = -0.4;
    strut.parent = root; strut.material = darkWood; allMeshes.push(strut);
  }

  // ─── Operator behind (-Z) ───
  const operator = options.showOperators !== false
    ? addOperator(scene, root, allMeshes, 0.22, 0.7, -0.75, color)
    : null;

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: muzzleSequence[0],
    muzzleSequence,
    impactOrigin: makeSocket(scene, rackPivot, "hwacha_impact_socket", new Vector3(0, HWACHA_RACK.rows * HWACHA_RACK.cell * 0.5, HWACHA_RACK.depth)),
  };

  return wrapAsBody(
    scene,
    root,
    core,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.58, 0.95, 0.52, 0.76),
    vehicleSockets,
  );
}

// ═══════════════════════ CANNON ═══════════════════════
// Fires FORWARD (+Z). Barrel points along +Z. Trail extends back (-Z).
/** Pirate gun crew clothes on an operator body: mauve hoops round the team-coloured shirt, brown trousers and shoes, a dark peaked cap */
// The catapult crewman's clothes (CATAPULT_CREW): coif linen, belt leather, breeches, shoes
const CREW_DRESS = { coif: new Color3(0.86, 0.79, 0.64), belt: new Color3(0.3, 0.18, 0.09), breeches: new Color3(0.42, 0.26, 0.14), shoes: new Color3(0.22, 0.13, 0.07) };
function dressCatapultCrew(scene: Scene, body: ArticulatedBody): void {
  const mat = (c: Color3): PBRMetallicRoughnessMaterial => makeMat(scene, c);
  const coifMat = mat(CREW_DRESS.coif), beltMat = mat(CREW_DRESS.belt), legMat = mat(CREW_DRESS.breeches), shoeMat = mat(CREW_DRESS.shoes);
  const add = (mesh: Mesh, parent: TransformNode, material: PBRMetallicRoughnessMaterial): void => {
    mesh.parent = parent; mesh.material = material; body.allMeshes.push(mesh);
  };
  // Breeches and shoes: the legs in brown, the feet darker, and a baggy tube on each thigh
  const legJoints = new Set<unknown>([body.leftHip, body.leftKnee, body.rightHip, body.rightKnee]);
  for (const mesh of body.allMeshes) {
    if (legJoints.has(mesh.parent) || /_pelvis$/.test(mesh.name)) mesh.material = /FootM$/.test(mesh.name) ? shoeMat : legMat;
  }
  for (const [hip, thigh] of [[body.leftHip, body.leftUpperLeg], [body.rightHip, body.rightUpperLeg]] as const) {
    const width = thigh.getBoundingInfo().boundingBox.extendSize.x * 2 * thigh.scaling.x;
    const length = Math.abs(body.leftKnee.position.y);
    const leg = MeshBuilder.CreateCylinder("crewBreeches", { height: length * 1.05, diameterTop: width * 1.6, diameterBottom: width * 1.25, tessellation: 6 }, scene);
    leg.convertToFlatShadedMesh();
    leg.position.y = -length * 0.5;
    add(leg, hip, legMat);
  }
  // Belt: a brown band round the bottom of the shirt
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const belt = MeshBuilder.CreateCylinder("crewBelt", { height: chest.y * 0.16, diameter: Math.max(chest.x, chest.z) * 2 * 0.82, tessellation: 8 }, scene);
  belt.position.y = chest.y * 0.12;
  belt.scaling.z = body.torsoMesh.scaling.z;
  add(belt, body.torso, beltMat);
  // Coif: a close linen hood over the crown, sides and back of the head, the face open, falling to a short cape on the neck
  const w = body.headMesh.getBoundingInfo().boundingBox.extendSize.x * 2 * body.headMesh.scaling.x;
  const hood = MeshBuilder.CreateSphere("crewCoif", { diameter: w * 1.18, segments: 6, slice: 0.62 }, scene);
  hood.convertToFlatShadedMesh();
  hood.position.set(0, -w * 0.42, -w * 0.08);
  add(hood, body.headTop, coifMat);
  const back = MeshBuilder.CreateBox("crewCoifBack", { width: w * 1.05, height: w * 0.75, depth: w * 0.3 }, scene);
  back.position.set(0, -w * 0.82, -w * 0.42);
  add(back, body.headTop, coifMat);
  const cape = MeshBuilder.CreateCylinder("crewCoifCape", { height: w * 0.3, diameterTop: w * 0.9, diameterBottom: w * 1.45, tessellation: 8 }, scene);
  cape.position.set(0, -w * 1.3, -w * 0.05);
  add(cape, body.headTop, coifMat);
}

export function dressCannonCrew(scene: Scene, body: ArticulatedBody, color: Color3, cap = true): void {
  const hoopMat = makeMat(scene, new Color3(0.66, 0.50, 0.36)); // at (0.74, 0.66, 0.72) the stripes were near white on the shirt, at (0.60, 0.50, 0.68) a violet no TABS crew wears, at (0.58, 0.45, 0.42) a cool grey on the blue, and at (0.55, 0.36, 0.24) too brown
  const trouserMat = makeMat(scene, new Color3(0.42, 0.24, 0.14));
  const capMat = makeMat(scene, darken(color, 0.8)); // at 0.45 the cap was a mid team blue, not the dark navy of a TABS crew cap
  const add = (mesh: Mesh, parent: TransformNode, material: PBRMetallicRoughnessMaterial): void => {
    mesh.parent = parent; mesh.material = material; body.allMeshes.push(mesh);
  };

  // Trousers: everything hung off the hip and knee joints, feet included
  const legJoints = new Set<unknown>([body.leftHip, body.leftKnee, body.rightHip, body.rightKnee]);
  for (const mesh of body.allMeshes) {
    if (legJoints.has(mesh.parent) || /_pelvis$/.test(mesh.name)) mesh.material = trouserMat;
  }
  // Breeches: the trousers are solids of their own and not brown paint on the legs. A baggy faceted tube hangs on each thigh from the hip, wider than the leg inside it
  // and drawn in toward the knee, and the two meet over the pelvis as the seat.
  for (const [hip, thigh] of [[body.leftHip, body.leftUpperLeg], [body.rightHip, body.rightUpperLeg]] as const) {
    const width = thigh.getBoundingInfo().boundingBox.extendSize.x * 2 * thigh.scaling.x;
    const length = Math.abs(body.leftKnee.position.y);
    const leg = MeshBuilder.CreateCylinder("crewBreeches", { height: length * 1.1, diameterTop: width * 1.75, diameterBottom: width * 1.3, tessellation: 6 }, scene);
    leg.convertToFlatShadedMesh();
    leg.position.y = -length * 0.5;
    add(leg, hip, trouserMat);
  }

  // Shirt hoops: five even pale bands all but flush with the torso (at 1.1 of its girth and a dark mauve they were raised rings round it, not stripes on it), each as deep as the shirt showing between them, following its taper from waist to chest (three deep ones, and four, were a few grey belts, not a striped shirt)
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const girth = (t: number): number => Math.max(chest.x, chest.z) * 2 * (0.76 + 0.26 * t) * 1.03;
  for (const t of [0.04, 0.2, 0.36, 0.52, 0.68]) {
    const hoop = MeshBuilder.CreateCylinder("crewHoop", {
      height: chest.y * 0.16, diameterTop: girth(t + 0.08), diameterBottom: girth(t), tessellation: 6,
    }, scene);
    hoop.position.y = chest.y * 2 * (t + 0.04);
    hoop.scaling.z = body.torsoMesh.scaling.z;
    add(hoop, body.torso, hoopMat);
  }

  if (!cap) return;
  // Cap: a low crown pulled down over the top of the head and a flat peak out over the eyes
  const w = body.headMesh.getBoundingInfo().boundingBox.extendSize.x * 2 * body.headMesh.scaling.x;
  const crown = MeshBuilder.CreateCylinder("crewCap", { height: w * 0.5, diameterTop: w * 0.9, diameterBottom: w * 1.12, tessellation: 6 }, scene);
  crown.position.y = -w * 0.12;
  add(crown, body.headTop, capMat);
  const peak = MeshBuilder.CreateBox("crewCapPeak", { width: w * 0.9, height: w * 0.07, depth: w * 0.6 }, scene);
  peak.position.set(0, -w * 0.34, w * 0.6);
  add(peak, body.headTop, capMat);
}

/**
 * [S] 423 the cannon's barrel (critic 422: a short blue-grey cylinder sunk flush in the carriage box; pirate.cannon.red.png: a long grey faceted barrel
 * standing proud of the carriage and longer than it, a knob and a ring at the breech, the chase tapering to a neck, then swelling into a thick flared
 * muzzle ring with a dark bore). Profile as [radius, distance from the breech end] (m) turned about the axis in .sides facets; the axis .axis up, so
 * the barrel's belly rests on the cheek tops (.56) and its back stands over them; the breech end at z .breech; the dark bore disc .boreAt along.
 */
const CANNON_BARREL = {
  axis: 0.6, breech: -0.16, sides: 10, bore: 0.085, boreAt: 1.12,
  profile: [
    [0, -0.1], [0.045, -0.1], [0.055, -0.06], [0.035, -0.02], [0.14, 0], [0.155, 0.04], [0.155, 0.1], [0.14, 0.12],
    [0.13, 0.5], [0.14, 0.53], [0.14, 0.57], [0.12, 0.6], [0.105, 0.86], [0.12, 0.92], [0.17, 1.0], [0.195, 1.07],
    [0.19, 1.14], [0.1, 1.14], [0.09, 1.1],
  ] as [number, number][],
};

/**
 * [S] 425 the cannon's wheels (critic 422 a.1: small black spoked wheels whose rims stop at the carriage top; pirate.cannon.red.png: two black wheels
 * as tall as the whole gun standing either side of it, each an octagon of thick blocky rim segments with square iron clamps proud of it at four points,
 * spokes inside). In m: .across tall, axle .axle up (on the ground), .out to each side; the rim .rim deep and .wide across the tread; clamps
 * .clampWide x .clampTall x .clampLong of a rim block, on every other block; spokes .spoke square; hub .hub across. Charcoal, a little self-lit.
 */
const CANNON_WHEEL = {
  across: 0.84, axle: 0.42, out: 0.34, rim: 0.085, wide: 0.12, clampWide: 1.3, clampTall: 1.45, clampLong: 0.45, spoke: 0.05, hub: 0.15,
  color: new Color3(0.1, 0.1, 0.11), glow: 0.12,
};

/**
 * [S] 426 the cannon's ring sight (audit 422 a.2: "the top of the barrel plain - TABS: a ring crosshair sight standing on the barrel"; pirate.cannon.red.png:
 * an iron octagon ring standing upright on the barrel's back a third of the way from the breech, as wide as the barrel, a small octagon at its middle and
 * four bars from it out through the ring). In m: .at along the barrel from its breech end, on the barrel's back .seat over its axis; a post .post tall;
 * the ring .ring in radius, the inner .inner; bars .bar square, .thick deep along the bore's line; spokes reach .spokeOut of the ring's radius.
 */
const CANNON_SIGHT = { at: 0.42, seat: 0.12, post: 0.03, ring: 0.12, inner: 0.04, bar: 0.022, thick: 0.03, spokeOut: 1.3 };

/**
 * [S] 428 the cannon's breech handles and the rider on them (audit 422 b.2: "the rider's hands pushing on the wheel rim from behind - TABS: on the two
 * handles either side of the breech"; pirate.cannon.red.png: the crewman stands square behind the gun, leaning in, a fist closed on each of two dark iron
 * handles that stand up off the back of the wooden blocks either side of the breech, the barrel at his waist). The rider .rider of a man (a gun
 * crewman's .46 left his head under the breech's top). In m: each handle wanted at .x either side, .y up and .z along
 * the bore (the blocks' back); the rider's torso leans .lean rad, his legs braced (.hipBack/.hipFwd, .knee); his straight arms are aimed from the
 * shoulder at the handles and he is set back along the bore until they just reach (arm length read off the rig); each handle is then built where his
 * fist is: an upright grip .grip tall and .gripWide thick through the fist, a knob on top, a post down to the block's top .blockTop, iron self-lit.
 */
const CANNON_HANDLES = {
  rider: 0.66, x: 0.24, y: 0.72, z: -0.36, lean: 0.2, hipBack: 0.25, hipFwd: -0.3, knee: 0.3, grip: 0.1, gripWide: 0.035, knob: 0.05, blockTop: 0.5,
  color: new Color3(0.1, 0.1, 0.11), glow: 0.12,
};

function buildCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("cannon_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = getMaterialFactory().get("wood", new Color3(0.36, 0.13, 0.09), { emissive: new Color3(0.08, 0.04, 0.035) }); // dark red-brown wood, a little self-lit so the shaded side stays wood and not black
  const metal = makeMat(scene, new Color3(0.55, 0.50, 0.46)); // iron grey, a little warm against the blue sky light, under which a cool dark grey went navy

  // Carriage (longer along Z)
  const carriage = MeshBuilder.CreateBox("carriage", { width: 0.5, height: 0.12, depth: 0.9 }, scene);
  carriage.position.y = 0.3; carriage.parent = root; carriage.material = wood; allMeshes.push(carriage);

  // Cheeks: a thick wooden wall standing on the bed each side of the barrel, nearly to its top, so the gun sits down in its carriage; behind each a lower block, so the cheek steps down toward the tail of the bed
  for (const xOff of [-0.2, 0.2]) {
    const cheek = MeshBuilder.CreateBox("carriageCheek", { width: 0.1, height: 0.26, depth: 0.6 }, scene);
    cheek.position.set(xOff, 0.43, 0.2);
    cheek.parent = root; cheek.material = wood; allMeshes.push(cheek);
    const step = MeshBuilder.CreateBox("carriageCheekStep", { width: 0.1, height: 0.14, depth: 0.3 }, scene);
    step.position.set(xOff, 0.43, -0.25);
    step.parent = root; step.material = wood; allMeshes.push(step);
  }

  // Axle under the bed: the body mesh that takes the team tint, so the iron barrel and the wooden carriage keep their own colours
  // [S] 425 through the cheeks to the tall wheels' hubs (CANNON_WHEEL)
  const axle = MeshBuilder.CreateCylinder("axle", { height: CANNON_WHEEL.out * 2, diameter: 0.06, tessellation: 6 }, scene);
  axle.position.y = CANNON_WHEEL.axle;
  axle.rotation.z = Math.PI / 2;
  axle.parent = root; axle.material = teamPrimary; allMeshes.push(axle);

  // [S] 425 the wheels to the spec at CANNON_WHEEL: tall dark wheels standing to the barrel's top, each an octagon of thick rim blocks with four proud
  // iron clamps, eight spokes and a hub, on its own stub axle level with the cheeks
  const W = CANNON_WHEEL;
  const wheelIron = getMaterialFactory().get("cloth", W.color, { emissiveIntensity: W.glow });
  const rimR = W.across / 2 - W.rim / 2;
  const chord = 2 * rimR * Math.tan(Math.PI / 8) * 1.04;
  for (const side of [-1, 1]) {
    const x = side * W.out;
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4 + Math.PI / 8;
      const block = MeshBuilder.CreateBox("wheel", { width: W.wide, height: W.rim, depth: chord }, scene);
      block.position.set(x, W.axle + rimR * Math.sin(a), rimR * Math.cos(a));
      // its length (+z) along the rim's tangent (0, cos a, -sin a) at its place (0, sin a, cos a)
      block.rotation.x = -(a + Math.PI / 2);
      block.parent = root; block.material = wheelIron; allMeshes.push(block);
      if (k % 2 === 0) {
        const clamp = MeshBuilder.CreateBox("wheelClamp", { width: W.wide * W.clampWide, height: W.rim * W.clampTall, depth: chord * W.clampLong }, scene);
        clamp.position.set(x, W.axle + (rimR + W.rim * 0.1) * Math.sin(a), (rimR + W.rim * 0.1) * Math.cos(a));
        clamp.rotation.x = -(a + Math.PI / 2);
        clamp.parent = root; clamp.material = wheelIron; allMeshes.push(clamp);
      }
    }
    // Hub: a fat block on the axle where the spokes meet
    const wheelHub = MeshBuilder.CreateCylinder("wheelHub", { height: W.wide * 1.3, diameter: W.hub, tessellation: 8 }, scene);
    wheelHub.position.set(x, W.axle, 0);
    wheelHub.rotation.z = Math.PI / 2;
    wheelHub.parent = root; wheelHub.material = wheelIron; allMeshes.push(wheelHub);
    // Spokes: four bars across the rim's inside, turned about the axle
    for (let i = 0; i < 4; i++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: W.spoke, height: (rimR - W.rim * 0.4) * 2, depth: W.spoke }, scene);
      spoke.position.set(x, W.axle, 0);
      spoke.rotation.set(i * Math.PI / 4, 0, 0);
      spoke.parent = root; spoke.material = wheelIron; allMeshes.push(spoke);
    }
  }

  // Trail handle extending back (-Z)
  const trail = MeshBuilder.CreateBox("trail", { width: 0.08, height: 0.06, depth: 0.8 }, scene);
  trail.position.set(0, 0.22, -0.7);
  trail.parent = root; trail.material = wood; allMeshes.push(trail);

  // [S] 423 the barrel, one faceted lathe to the spec at CANNON_BARREL, along +Z: it lies on the cheeks' tops, proud of the carriage, and runs on past
  // the bed's front. Named "barrel" so the bomb cannon still strips it
  const B = CANNON_BARREL;
  const barrel = MeshBuilder.CreateLathe("barrel", {
    shape: B.profile.map(([r, y]) => new Vector3(r, y, 0)), tessellation: B.sides, cap: Mesh.NO_CAP,
  }, scene);
  barrel.convertToFlatShadedMesh();
  barrel.position.set(0, B.axis, B.breech);
  barrel.rotation.x = Math.PI / 2; // +y of the profile runs to the muzzle along +Z
  barrel.parent = root; barrel.material = metal; allMeshes.push(barrel);
  const bore = MeshBuilder.CreateDisc("muzzle", { radius: B.bore, tessellation: B.sides, sideOrientation: Mesh.DOUBLESIDE }, scene);
  bore.position.set(0, B.axis, B.breech + B.boreAt);
  bore.parent = root; bore.material = makeMat(scene, new Color3(0.08, 0.08, 0.09)); allMeshes.push(bore);
  const muzzleZ = B.breech + B.profile[B.profile.length - 1][1];

  // [S] 426 the ring sight to the spec at CANNON_SIGHT, standing on the barrel's back over the chase: an octagon ring upright across the bore's line, a
  // small octagon in its middle, four bars from it out through the ring, on a short post. Named "cannonSight" so the bomb cannon strips it with the barrel
  const S = CANNON_SIGHT;
  const sightY = B.axis + S.seat + S.post + S.ring;
  const octagon = (r: number, bar: number): void => {
    const chordS = 2 * r * Math.tan(Math.PI / 8) * 1.08;
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4 + Math.PI / 8;
      const seg = MeshBuilder.CreateBox("cannonSight", { width: chordS, height: bar, depth: S.thick }, scene);
      seg.position.set(r * Math.cos(a), sightY + r * Math.sin(a), B.breech + S.at);
      // its length (+x) along the ring's tangent at its place
      seg.rotation.z = a + Math.PI / 2;
      seg.parent = root; seg.material = metal; allMeshes.push(seg);
    }
  };
  octagon(S.ring, S.bar);
  octagon(S.inner, S.bar * 0.8);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    const long = S.ring * S.spokeOut - S.inner;
    const spokeS = MeshBuilder.CreateBox("cannonSight", { width: long, height: S.bar * 0.8, depth: S.thick }, scene);
    spokeS.position.set(Math.cos(a) * (S.inner + long / 2), sightY + Math.sin(a) * (S.inner + long / 2), B.breech + S.at);
    spokeS.rotation.z = a;
    spokeS.parent = root; spokeS.material = metal; allMeshes.push(spokeS);
  }
  const post = MeshBuilder.CreateBox("cannonSight", { width: S.bar * 1.4, height: S.post + S.seat * 0.4, depth: S.thick * 1.6 }, scene);
  post.position.set(0, B.axis + S.seat * 0.8 + S.post / 2, B.breech + S.at);
  post.parent = root; post.material = metal; allMeshes.push(post);

  // [S] 428 the operator stands square behind the breech, leaning in, a fist on each breech handle (spec at CANNON_HANDLES), in place of shoving
  // the wheel's rim from beside it. Sunk 0.03 so both feet are on the ground
  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    const H = CANNON_HANDLES;
    const handleIron = getMaterialFactory().get("cloth", H.color, { emissiveIntensity: H.glow });
    operator = addOperator(scene, root, allMeshes, 0, -0.03, H.z - 0.5, color, (body) => {
      body.torso.rotation.x = H.lean;
      body.neck.rotation.x = -H.lean * 0.8;
      body.leftHip.rotation.x = H.hipFwd;
      body.leftKnee.rotation.x = H.knee;
      body.rightHip.rotation.x = H.hipBack;
      body.rightKnee.rotation.x = 0.1;
      for (const elbow of [body.leftElbow, body.rightElbow]) elbow.rotation.setAll(0);
      // his arm's length, shoulder joint to fist, hanging straight
      settleWorld(body.leftHand);
      const armLong = Vector3.Distance(body.leftShoulder.getAbsolutePosition(), body.leftHand.getAbsolutePosition());
      // set him back along the bore until a straight arm just reaches the handles
      settleWorld(body.leftShoulder);
      const s = body.leftShoulder.getAbsolutePosition();
      const dx = Math.abs(s.x) - H.x, dy = H.y - s.y;
      const reach = Math.sqrt(Math.max(0.01, armLong * armLong - dx * dx - dy * dy));
      body.root.position.z += (H.z - reach) - s.z;
      for (const [shoulder, hand] of [[body.leftShoulder, body.leftHand], [body.rightShoulder, body.rightHand]] as [TransformNode, TransformNode][]) {
        settleWorld(shoulder);
        const at = shoulder.getAbsolutePosition();
        const side = Math.sign(at.x) || 1;
        aimLimb(shoulder, new Vector3(side * H.x, H.y, H.z).subtract(at));
        settleWorld(hand);
        // the handle where the fist closed: the grip through it, a knob over it, a post down to the block
        const fist = hand.getAbsolutePosition();
        const grip = MeshBuilder.CreateCylinder("cannonHandle", { height: H.grip, diameter: H.gripWide, tessellation: 6 }, scene);
        grip.position.set(fist.x, fist.y, fist.z);
        const knob = MeshBuilder.CreateSphere("cannonHandle", { diameter: H.knob, segments: 4 }, scene);
        knob.position.set(fist.x, fist.y + H.grip / 2 + H.knob * 0.3, fist.z);
        const postLong = Math.max(0.02, fist.y - H.grip / 2 - H.blockTop);
        const post = MeshBuilder.CreateBox("cannonHandle", { width: H.gripWide * 1.6, height: postLong, depth: H.gripWide * 1.6 }, scene);
        post.position.set(fist.x, H.blockTop + postLong / 2, fist.z);
        const foot = MeshBuilder.CreateBox("cannonHandle", { width: 0.09, height: 0.025, depth: 0.09 }, scene);
        foot.position.set(fist.x, H.blockTop + 0.012, fist.z);
        for (const m of [grip, knob, post, foot]) { m.convertToFlatShadedMesh(); m.parent = root; m.material = handleIron; allMeshes.push(m); }
      }
      dressCannonCrew(scene, body, color, false);
      // [S] 428 ...in a white shirt with team stripes (pirateDress CANNON_SHIRT)
      body.allMeshes.push(...cannonShirt(scene, body, color));
      // [S] 429 ...and a brimless team bandanna dome in place of the peaked crew cap (pirateDress CANNON_BANDANNA)
      body.allMeshes.push(...cannonBandanna(scene, body, color));
    }, { ...OPERATOR_PROPORTIONS, scale: H.rider });
  }

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "cannon_muzzle_socket", new Vector3(0, B.axis, muzzleZ + 0.1)),
    smokeSocket: makeSocket(scene, root, "cannon_smoke_socket", new Vector3(0, B.axis, muzzleZ + 0.02)),
    impactOrigin: makeSocket(scene, root, "cannon_impact_socket", new Vector3(0, B.axis, muzzleZ - 0.06)),
  };

  return wrapAsBody(
    scene,
    root,
    axle,
    allMeshes,
    operator?.headMesh,
    // Height stays the gun's old reach (operator plus the 0.57 he used to stand on), so targeting is unchanged
    makeBodyMetrics(operator ? operator.headTopY + 0.6 : 1.34, 0.7, 0.4, 0.68),
    vehicleSockets,
  );
}

// ═══════════════════════ DA VINCI TANK ═══════════════════════
// Roof spec, read off renaissance.da_vinci_tank.red.png: the lower tier is a wide shallow cone of 16 team planks (eave about 2.5 m across, rising
// about 25 deg) with a dark seam down every plank edge and a rivet at each seam's foot; above it a small second cone with its own short eave; under the
// eave a dark plank drum a little narrower, banded at the middle, where the cannons sit.
// [S] TABS scale (337; reference/factions/renaissance.jpg: the machine is a hut, its roof's top above the jouster's rider and about 1.5 men tall, the eave
// some 2.5 men across; renaissance.da_vinci_tank.red.png: the small upper tier is a frustum with a flat top and a dark lid, not a spike; the 331 machine
// stood below the halberdier's head). The whole machine (drum, roof, cannons, base, wheels, Da Vinci, sockets, the pilot's seat) is built in the units
// below and grown together by DAVINCI_SCALE, so the ~26 deg pitch of both tiers is kept (332 widened only the radii, 334 raised only the pitch).
// The cap rises from its eave (capEaveR at capY) at the lower tier's pitch to a flat top capTopR across at capTop, a dark lid on it.
export const DAVINCI_SCALE = 2.3;
const DAVINCI_ROOF = {
  planks: 16,
  eaveR: 1.25, eaveY: 0.74, topR: 0.42, topY: 1.12,
  capEaveR: 0.6, capY: 1.1, capTopR: 0.2, capTop: 1.3, lip: 0.05,
  seam: 0.035, rivet: 0.06,
  drumR: 1.0, drumBottom: 0.2, drumTop: 0.78, drumMid: 0.46,
  drumColor: new Color3(0.24, 0.13, 0.1), seamColor: new Color3(0.1, 0.06, 0.05),
};

// [S] The upper tier as its own hat (338; renaissance.da_vinci_tank.red.png: the small cone stands off the big one on a short dark collar, its
// eave a proud dark lip overhanging the lower roof's top, so the peak rises by the collar without re-pitching either tier). The cap, its lip, seams
// and lid are lifted by collar; the collar is a dark plank ring collarR across from the lower tier's top up to the cap's eave.
const DAVINCI_HAT = { collar: 0.16, collarR: 0.34, lip: 0.08, proud: 0.05 };
/** The roof's highest point (the cap's lid), in the machine's own units. */
const DAVINCI_PEAK = DAVINCI_ROOF.capTop + DAVINCI_HAT.collar + DAVINCI_ROOF.lip;

const DAVINCI_CANNON = { count: 16, out: 1.62, bore: 0.2, ring: 0.07, ringWide: 1.3, color: new Color3(0.16, 0.16, 0.18) };

function buildDaVinciRoof(scene: Scene, parent: TransformNode, team: PBRMetallicRoughnessMaterial, allMeshes: Mesh[]): Mesh {
  const R = DAVINCI_ROOF;
  const seamMat = makeMat(scene, R.seamColor);
  const drumMat = makeMat(scene, R.drumColor);
  const add = (m: Mesh, mat: PBRMetallicRoughnessMaterial): Mesh => { m.parent = parent; m.material = mat; allMeshes.push(m); return m; };
  // A seam strip laid along the cone surface from (r0, y0) to (r1, y1) at the plank edge angle a
  const seamAlong = (name: string, a: number, r0: number, y0: number, r1: number, y1: number, proud: number): void => {
    const p0 = new Vector3(Math.cos(a) * r0, y0, Math.sin(a) * r0);
    const p1 = new Vector3(Math.cos(a) * r1, y1, Math.sin(a) * r1);
    const along = p1.subtract(p0);
    const seam = MeshBuilder.CreateBox(name, { width: R.seam, height: along.length(), depth: R.seam }, scene);
    const out = new Vector3(Math.cos(a), 0, Math.sin(a));
    const up = along.normalize();
    const normal = Vector3.Cross(Vector3.Cross(up, out), up).normalize();
    seam.position = Vector3.Lerp(p0, p1, 0.5).add(normal.scale(proud));
    const side = Vector3.Cross(up, normal);
    seam.rotationQuaternion = Quaternion.FromRotationMatrix(Matrix.FromValues(
      side.x, side.y, side.z, 0, up.x, up.y, up.z, 0, normal.x, normal.y, normal.z, 0, 0, 0, 0, 1));
    add(seam, seamMat);
  };
  // Lower tier: flat-faced planks, so each plank reads as its own board
  const lower = MeshBuilder.CreateCylinder("hull", {
    height: R.topY - R.eaveY, diameterTop: R.topR * 2, diameterBottom: R.eaveR * 2, tessellation: R.planks,
  }, scene);
  lower.convertToFlatShadedMesh();
  lower.position.y = (R.topY + R.eaveY) / 2;
  add(lower, team);
  // The eave's thickness: a short team band under the plank ends
  const eave = MeshBuilder.CreateCylinder("davinci_eave", { height: 0.06, diameter: R.eaveR * 2 + 0.02, tessellation: R.planks }, scene);
  eave.convertToFlatShadedMesh();
  eave.position.y = R.eaveY - 0.03;
  add(eave, seamMat);
  // Upper tier as its own hat (DAVINCI_HAT): a dark collar standing on the lower tier's top, the cap lifted onto it with a proud dark eave lip
  const H = DAVINCI_HAT;
  const collar = MeshBuilder.CreateCylinder("davinci_collar", { height: H.collar + 0.04, diameter: H.collarR * 2, tessellation: R.planks }, scene);
  collar.convertToFlatShadedMesh();
  collar.position.y = R.topY - 0.02 + (H.collar + 0.04) / 2;
  add(collar, drumMat);
  const capLip = MeshBuilder.CreateCylinder("davinci_cap_lip", { height: H.lip, diameter: (R.capEaveR + H.proud) * 2, tessellation: R.planks }, scene);
  capLip.convertToFlatShadedMesh();
  capLip.position.y = R.capY + H.collar - H.lip / 2;
  add(capLip, seamMat);
  const cap = MeshBuilder.CreateCylinder("davinci_cap", {
    height: R.capTop - R.capY, diameterTop: R.capTopR * 2, diameterBottom: R.capEaveR * 2, tessellation: R.planks,
  }, scene);
  cap.convertToFlatShadedMesh();
  cap.position.y = (R.capTop + R.capY) / 2 + H.collar;
  add(cap, team);
  // The flat top's dark lid
  const lid = MeshBuilder.CreateCylinder("davinci_cap_lid", { height: R.lip, diameter: R.capTopR * 2 + 0.03, tessellation: R.planks }, scene);
  lid.convertToFlatShadedMesh();
  lid.position.y = R.capTop + H.collar + R.lip / 2;
  add(lid, seamMat);
  for (let i = 0; i < R.planks; i++) {
    const a = i * Math.PI * 2 / R.planks;
    seamAlong("davinci_seam", a, R.eaveR, R.eaveY, R.topR, R.topY, R.seam * 0.3);
    seamAlong("davinci_cap_seam", a, R.capEaveR, R.capY + H.collar, R.capTopR, R.capTop + H.collar, R.seam * 0.3);
    const rivet = MeshBuilder.CreateSphere("davinci_rivet", { diameter: R.rivet, segments: 3 }, scene);
    rivet.position.set(Math.cos(a + Math.PI / R.planks) * (R.eaveR - 0.08), R.eaveY + 0.04, Math.sin(a + Math.PI / R.planks) * (R.eaveR - 0.08));
    add(rivet, seamMat);
  }
  // The drum: dark boards standing round under the eave, an iron band at the middle
  const drumWall = MeshBuilder.CreateCylinder("davinci_drum", {
    height: R.drumTop - R.drumBottom, diameter: R.drumR * 2, tessellation: R.planks * 2,
  }, scene);
  drumWall.convertToFlatShadedMesh();
  drumWall.position.y = (R.drumTop + R.drumBottom) / 2;
  add(drumWall, drumMat);
  for (let i = 0; i < R.planks * 2; i++) {
    const a = i * Math.PI / R.planks;
    const board = MeshBuilder.CreateBox("davinci_board_seam", { width: 0.02, height: R.drumTop - R.drumBottom, depth: 0.02 }, scene);
    board.position.set(Math.cos(a) * R.drumR, drumWall.position.y, Math.sin(a) * R.drumR);
    board.rotation.y = -a;
    add(board, seamMat);
  }
  const band = MeshBuilder.CreateCylinder("davinci_band", { height: 0.05, diameter: R.drumR * 2 + 0.04, tessellation: R.planks * 2 }, scene);
  band.position.y = R.drumBottom + 0.06;
  add(band, seamMat);
  return lower;
}

// Symmetrical design, fires in all directions, so orientation matters less.
function buildDaVinciTank(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("tank_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.55, 0.42, 0.25));
  // The drum (330, card Characteristics "the machine spins around, launching cannonballs from the cannons"): the hull, its cannons, their muzzles and the
  // viewport ride one node that RuntimeUnit spins about the upright while the tank fights (DRUM_SPIN); the base, the wheels and Da Vinci stay put
  const drum = new TransformNode("davinci_spin", scene);
  drum.parent = root;
  drum.scaling.setAll(DAVINCI_SCALE);
  // The parts that stay put (base, wheels, Da Vinci) ride a holder grown by the same scale
  const chassis = new TransformNode("davinci_chassis", scene);
  chassis.parent = root;
  chassis.scaling.setAll(DAVINCI_SCALE);

  // Roof and drum (331, renaissance.da_vinci_tank.red.png): a low wide roof in two tiers of team planks with dark seams and rivets, its eave
  // overhanging a dark plank drum that carries the cannons. All of it rides the spinning drum node.
  const roof = buildDaVinciRoof(scene, drum, teamPrimary, allMeshes);
  const hull = roof;

  // Base plate
  const basePlate = MeshBuilder.CreateCylinder("basePlate", { height: 0.1, diameter: 2.1, tessellation: 16 }, scene);
  basePlate.position.y = 0.15; basePlate.parent = chassis; basePlate.material = makeMat(scene, DAVINCI_ROOF.drumColor); allMeshes.push(basePlate);

  const muzzleSequence: TransformNode[] = [];
  // Cannons (331, renaissance.da_vinci_tank.red.png; card "sixteen cannons"): 16 thick dark-grey octagonal barrels standing out level round the
  // drum about half the roof's radius, each with a breech ring at the drum and a muzzle ring at its mouth; a ball leaves from every mouth in turn
  const C = DAVINCI_CANNON;
  const gunMetal = makeMat(scene, C.color);
  const along = C.out - DAVINCI_ROOF.drumR;
  for (let i = 0; i < C.count; i++) {
    const angle = i * Math.PI * 2 / C.count;
    const dir = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const at = (r: number) => dir.scale(r).add(new Vector3(0, DAVINCI_ROOF.drumMid, 0));
    const piece = (name: string, long: number, wide: number, r: number) => {
      const m = MeshBuilder.CreateCylinder(name, { height: long, diameter: wide, tessellation: 8 }, scene);
      m.convertToFlatShadedMesh();
      m.position = at(r);
      // Point it out radially (cylinder y onto z, then about the upright)
      m.rotation.x = Math.PI / 2;
      m.rotation.y = -angle + Math.PI / 2;
      m.parent = drum; m.material = gunMetal; allMeshes.push(m);
    };
    piece("tbarrel", along, C.bore, DAVINCI_ROOF.drumR + along / 2);
    piece("tbarrel_breech", C.ring, C.bore * C.ringWide, DAVINCI_ROOF.drumR + C.ring / 2);
    piece("tbarrel_muzzle", C.ring, C.bore * C.ringWide, C.out - C.ring / 2);
    muzzleSequence.push(makeSocket(scene, drum, `davinci_muzzle_${i}`, at(C.out + 0.05)));
  }

  // Wheels (4, peeking out from base)
  for (const x of [-0.6, 0.6]) {
    for (const z of [-0.6, 0.6]) {
      const wheel = MeshBuilder.CreateCylinder("twheel", { height: 0.06, diameter: 0.35, tessellation: 10 }, scene);
      wheel.position.set(x, 0.1, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = chassis; wheel.material = wood; allMeshes.push(wheel);
    }
  }

  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, chassis, allMeshes, 0, 1.08, -0.02, color);
  }

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: muzzleSequence[0],
    muzzleSequence,
    smokeSocket: makeSocket(scene, chassis, "davinci_smoke_socket", new Vector3(0, DAVINCI_ROOF.drumMid, DAVINCI_CANNON.out + 0.05)),
    impactOrigin: makeSocket(scene, chassis, "davinci_impact_socket", new Vector3(0, DAVINCI_ROOF.drumMid, DAVINCI_CANNON.out)),
  };

  return wrapAsBody(
    scene,
    root,
    hull,
    allMeshes,
    operator?.headMesh,
    // Its height is the roof's top, its widths the machine's, all at DAVINCI_SCALE
    makeBodyMetrics(DAVINCI_PEAK * DAVINCI_SCALE, 0.8 * DAVINCI_SCALE, 0.5 * DAVINCI_SCALE, 0.7 * DAVINCI_SCALE),
    vehicleSockets,
  );
}

function buildLegacyTank(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("legacy_tank_root", scene);
  const allMeshes: Mesh[] = [];
  const hullMat = makeMat(scene, brighten(color, 0.12));
  const hullDark = makeMat(scene, darken(color, 0.28));
  const trackMat = makeMat(scene, new Color3(0.2, 0.22, 0.2));
  const metal = makeMat(scene, new Color3(0.34, 0.36, 0.38));

  const lowerHull = MeshBuilder.CreateBox("tankLowerHull", { width: 2.02, height: 0.42, depth: 2.95 }, scene);
  lowerHull.position.set(0, 0.38, 0.02);
  lowerHull.parent = root;
  lowerHull.material = hullDark;
  allMeshes.push(lowerHull);

  const hullDeck = MeshBuilder.CreateBox("tankHullDeck", { width: 1.9, height: 0.26, depth: 2.28 }, scene);
  hullDeck.position.set(0, 0.72, -0.08);
  hullDeck.parent = root;
  hullDeck.material = hullMat;
  allMeshes.push(hullDeck);

  const glacis = MeshBuilder.CreateBox("tankGlacis", { width: 1.84, height: 0.3, depth: 0.86 }, scene);
  glacis.position.set(0, 0.78, 0.98);
  glacis.rotation.x = -0.5;
  glacis.parent = root;
  glacis.material = hullMat;
  allMeshes.push(glacis);

  const nose = MeshBuilder.CreateBox("tankNose", { width: 1.68, height: 0.18, depth: 0.52 }, scene);
  nose.position.set(0, 0.56, 1.36);
  nose.rotation.x = -0.2;
  nose.parent = root;
  nose.material = hullMat;
  allMeshes.push(nose);

  const rearDeck = MeshBuilder.CreateBox("tankRearDeck", { width: 1.76, height: 0.14, depth: 0.72 }, scene);
  rearDeck.position.set(0, 0.72, -1.12);
  rearDeck.parent = root;
  rearDeck.material = hullMat;
  allMeshes.push(rearDeck);

  for (const side of [-1, 1]) {
    const skirt = MeshBuilder.CreateBox("tankSideSkirt", { width: 0.16, height: 0.42, depth: 2.52 }, scene);
    skirt.position.set(side * 0.98, 0.46, -0.08);
    skirt.parent = root;
    skirt.material = hullMat;
    allMeshes.push(skirt);

    const frontCheek = MeshBuilder.CreateBox("tankFrontCheek", { width: 0.16, height: 0.3, depth: 0.78 }, scene);
    frontCheek.position.set(side * 0.82, 0.72, 0.95);
    frontCheek.rotation.x = -0.48;
    frontCheek.parent = root;
    frontCheek.material = hullMat;
    allMeshes.push(frontCheek);

    const track = MeshBuilder.CreateBox("tankTrack", { width: 0.22, height: 0.26, depth: 2.82 }, scene);
    track.position.set(side * 1.02, 0.18, -0.02);
    track.parent = root;
    track.material = trackMat;
    allMeshes.push(track);

    for (let i = 0; i < 7; i++) {
      const z = -1.12 + i * 0.38;
      const wheel = MeshBuilder.CreateCylinder("tankWheel", { height: 0.1, diameter: 0.34, tessellation: 18 }, scene);
      wheel.position.set(side * 0.98, 0.14, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = root;
      wheel.material = metal;
      allMeshes.push(wheel);
    }

    for (const z of [-0.78, -0.18, 0.42]) {
      const returnRoller = MeshBuilder.CreateCylinder("tankReturnRoller", { height: 0.06, diameter: 0.12, tessellation: 12 }, scene);
      returnRoller.position.set(side * 1.0, 0.52, z);
      returnRoller.rotation.z = Math.PI / 2;
      returnRoller.parent = root;
      returnRoller.material = metal;
      allMeshes.push(returnRoller);
    }
  }

  const turretBase = new TransformNode("tankTurretBase", scene);
  turretBase.parent = root;
  turretBase.position.set(0, 0.96, 0.02);

  const turretMain = MeshBuilder.CreateBox("tankTurretMain", { width: 1.28, height: 0.42, depth: 1.16 }, scene);
  turretMain.position.set(0, 0.12, 0.08);
  turretMain.parent = turretBase;
  turretMain.material = hullMat;
  allMeshes.push(turretMain);

  const turretBustle = MeshBuilder.CreateBox("tankTurretBustle", { width: 1.08, height: 0.26, depth: 0.56 }, scene);
  turretBustle.position.set(0, 0.08, -0.72);
  turretBustle.parent = turretBase;
  turretBustle.material = hullMat;
  allMeshes.push(turretBustle);

  const turretFront = MeshBuilder.CreateBox("tankTurretFront", { width: 1.06, height: 0.28, depth: 0.52 }, scene);
  turretFront.position.set(0, 0.04, 0.76);
  turretFront.rotation.x = -0.16;
  turretFront.parent = turretBase;
  turretFront.material = hullMat;
  allMeshes.push(turretFront);

  for (const side of [-1, 1]) {
    const cheek = MeshBuilder.CreateBox("tankTurretCheek", { width: 0.28, height: 0.34, depth: 0.62 }, scene);
    cheek.position.set(side * 0.6, 0.08, 0.36);
    cheek.rotation.y = side * 0.18;
    cheek.parent = turretBase;
    cheek.material = hullMat;
    allMeshes.push(cheek);
  }

  const turretRoof = MeshBuilder.CreateBox("tankTurretRoof", { width: 1.0, height: 0.08, depth: 0.74 }, scene);
  turretRoof.position.set(0, 0.34, 0.02);
  turretRoof.parent = turretBase;
  turretRoof.material = hullDark;
  allMeshes.push(turretRoof);

  const gunMantlet = MeshBuilder.CreateCylinder("tankGunMantlet", { height: 0.34, diameter: 0.34, tessellation: 16 }, scene);
  gunMantlet.position.set(0, 0.08, 0.72);
  gunMantlet.rotation.x = Math.PI / 2;
  gunMantlet.parent = turretBase;
  gunMantlet.material = metal;
  allMeshes.push(gunMantlet);

  const barrel = MeshBuilder.CreateCylinder("tankBarrel", { height: 2.25, diameter: 0.12, tessellation: 16 }, scene);
  barrel.position.set(0, 0.1, 1.82);
  barrel.rotation.x = Math.PI / 2;
  barrel.parent = turretBase;
  barrel.material = metal;
  allMeshes.push(barrel);

  const fumeExtractor = MeshBuilder.CreateCylinder("tankFumeExtractor", { height: 0.34, diameter: 0.18, tessellation: 16 }, scene);
  fumeExtractor.position.set(0, 0.1, 1.2);
  fumeExtractor.rotation.x = Math.PI / 2;
  fumeExtractor.parent = turretBase;
  fumeExtractor.material = metal;
  allMeshes.push(fumeExtractor);

  const muzzle = MeshBuilder.CreateCylinder("tankMuzzle", { height: 0.12, diameterTop: 0.14, diameterBottom: 0.12, tessellation: 16 }, scene);
  muzzle.position.set(0, 0.1, 2.94);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.parent = turretBase;
  muzzle.material = metal;
  allMeshes.push(muzzle);

  const commanderCupola = MeshBuilder.CreateCylinder("tankCupola", { height: 0.12, diameter: 0.26, tessellation: 14 }, scene);
  commanderCupola.position.set(-0.18, 0.44, -0.08);
  commanderCupola.parent = turretBase;
  commanderCupola.material = hullDark;
  allMeshes.push(commanderCupola);

  const loaderHatch = MeshBuilder.CreateCylinder("tankLoaderHatch", { height: 0.05, diameter: 0.2, tessellation: 14 }, scene);
  loaderHatch.position.set(0.2, 0.42, 0.08);
  loaderHatch.parent = turretBase;
  loaderHatch.material = hullDark;
  allMeshes.push(loaderHatch);

  const sightBlock = MeshBuilder.CreateBox("tankSight", { width: 0.08, height: 0.08, depth: 0.16 }, scene);
  sightBlock.position.set(0.3, 0.26, 0.44);
  sightBlock.parent = turretBase;
  sightBlock.material = metal;
  allMeshes.push(sightBlock);

  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, root, allMeshes, 0, 0.98, -0.28, color);
  }
  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, turretBase, "legacy_tank_muzzle_socket", new Vector3(0, 0.1, 3.06)),
    smokeSocket: makeSocket(scene, turretBase, "legacy_tank_smoke_socket", new Vector3(0, 0.1, 2.9)),
    impactOrigin: makeSocket(scene, turretBase, "legacy_tank_impact_socket", new Vector3(0, 0.08, 0.72)),
  };
  return wrapAsBody(
    scene,
    root,
    lowerHull,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.92, 1.28, 1.0, 1.12),
    vehicleSockets,
  );
}

// ═══════════════════════ WHEELBARROW ═══════════════════════
// Pushed FORWARD (+Z). Wheel at front (+Z), pusher at back (-Z).
/*
 * Three men on one cart (card Appearance, farmer.wheelbarrow.red.png): the Farmer sits at the front of the tray facing ahead, legs out over
 * its sides; the Apple Thrower sits behind him, one arm up; the Traveller stands at the rear on the ground, leaning into the two handles.
 * The cart is built in operator units and the whole rig scaled by WHEELBARROW.scale, so the men (operator .46) come out man-sized (~1 m hip).
 */
const WHEELBARROW = {
  scale: 2.2,          // rig scale: operator .46 x 2.2 = a full man
  trayY: 0.36,         // tray floor centre height (rig units)
  trayWide: 0.2,       // 377: a rider's hips and a little more (farmer.wheelbarrow.red.png), so the riders straddle it and loom over it; was .44
  trayLong: 0.5,       // 378: a short tray the riders loom over, bunched in line (BUNCHED_CREW); was .78
  trayZ: 0.08,
  pushZ: -0.62,        // the Traveller's feet
  lean: 0.28,          // the Traveller's forward lean
};
/*
 * [S] The tray (347; farmer.wheelbarrow.blue.png/.red.png, card "wooden planks bolted together to form a rectangular shape; crudely painted with the
 * team's color and filled with hay"): each side and end is TRAY_PLANK.planks boards stacked with a dark seam between, light warm timber self-lit
 * TRAY_PLANK.glow; the top board of each side and the floor are painted team colour; a dark bolt head at each board end; heaped with a faceted straw
 * mound TRAY_PLANK.heap above the rim, wider than it is tall, and the riders sit on the mound's top (seatY), not down in the tray.
 */
const TRAY_PLANK = { planks: 3, sideTall: 0.13, seam: 0.008, thick: 0.03, bolt: 0.016, heap: 0.09, heapWide: 0.92, glow: 0.12 };
const TRAY_WOOD = new Color3(0.6, 0.34, 0.24); // the reference's warm salmon timber: at (.62,.4,.28) glow .22 it read cream
const TRAY_STRAW = new Color3(0.82, 0.62, 0.3);
/*
 * [S] The riders' props (347; farmer.wheelbarrow.blue.png/.red.png, card "the Apple Thrower throws apples and the Farmer stabs"): the front rider holds a
 * pitchfork in his right fist, CREW_FORK.long rig units of shaft from CREW_FORK.butt behind the fist, pointing ahead and across his front (CREW_FORK.dir),
 * three grey curled tines on a crossbar at its head; the Apple Thrower holds a red faceted apple CREW_APPLE.r across in his raised fist, a green leaf on it.
 * Each prop is set in the cart's frame and parented to the fist (holdInFist), so it rides the man's arm.
 */
/*
 * [S] The wheel, braces and legs (348; farmer.wheelbarrow.red.png, card "a single wheel at the front with two supporting legs ... The handles, legs and
 * braces are also made out of wood, bolted to the tray. The wheel is made out of a cut log, with its center bolted to the brace"): the wheel is a slice of
 * log LOG_WHEEL.d across and .thick wide: a dark bark rim round a light end-grain face that stands a little proud of the bark on both sides, a darker
 * growth ring .ring of the face across on each, and a dark bolt hub through the middle; on each side of it a wooden brace runs from the hub up and back
 * to the tray's floor .braceBack behind its nose; under the tray's back end two wooden legs stand down to .legFoot off the ground, splayed out a little,
 * a bolt head where each meets the tray. Wood self-lit (.glow) so it reads wood and not black. Rig units.
 * 350 [S] a drum, not a slice (farmer.wheelbarrow.red.png: a broad cut log almost as wide as the tray, its tread faceted bark): .thick is .82 of the
 * tray's width; the tread is .staves bark staves round the log, alternate ones a shade darker (.staveShade), each a little proud of the core; the
 * end-grain faces and growth rings show on both ends; the braces bolt to the hub at each end face and run up and out to the tray's side boards, and
 * the handles start at the drum's end faces, not inside it.
 */
const LOG_WHEEL = { d: 0.34, thick: 0.36 * (0.24 / 0.44), bark: 0.02, ring: 0.55, hub: 0.05, brace: 0.022, braceBack: 0.16, leg: 0.03, legFoot: 0.02, legIn: 0.1, splay: 0.04, glow: 0.18, staves: 12, staveShade: 0.78 };
const LOG_BARK = new Color3(0.36, 0.22, 0.14);
const LOG_GRAIN = new Color3(0.82, 0.62, 0.42);
const LOG_RING = new Color3(0.64, 0.42, 0.28);
const CART_WOOD = new Color3(0.52, 0.3, 0.2);
/*
 * [S] the riders sit on the tray, not in it (376; farmer.wheelbarrow.red.png, .png: the Farmer sits up on the tray's front lip, his thighs splayed wide
 * forward and his white-socked shins out over the wheel, feet below the rim either side of it; the Apple Thrower sits astride the hay behind him, thighs
 * out over the side boards, shins hanging down outside the tray; the 346-349 seats sank both to the waist in the hay, shins folded down inside it). Rig
 * units and radians: Farmer's hips .lipIn behind the tray's front end and .lipUp above its rim, thighs pitched .frontThigh (forward and a little down),
 * splayed .frontSplay out, knees .frontKnee; Apple Thrower .astrideUp above the hay seat, thighs .backThigh, splayed .backSplay, knees .backKnee.
 */
/*
 * [S] a narrow tray the Apple Thrower straddles (377; farmer.wheelbarrow.red.png: the tray is barely wider than a man's hips; the riders sit up on it,
 * legs hanging outside its side boards, and loom over it): WHEELBARROW.trayWide .44 -> .2 with the drum wheel kept at its share of the tray; the hay is
 * a flat bed filling the tray to HAY_BED.fill of its sides, lumpy on top, not a mound over the rim; the Apple Thrower's hips sit on the side boards'
 * top (the rim) + CREW_SEAT.astrideUp, his thighs splayed .backSplay out near level over the boards, and each knee rolled back by the same splay
 * so his shins hang plumb outside the tray (a knee bent only about its own x turned the shin round the thigh, back inside the tray).
 */
const HAY_BED = { fill: 0.92, lumps: 0.02, inset: 0.5 };
/*
 * [S] the riders bunched in line, the Farmer reclined against the Thrower (378; farmer.wheelbarrow.red.png: a short tray, the two riders one behind the
 * other with no gap, the Farmer leaning back into the Apple Thrower's chest, legs splayed forward over the wheel; critic 377: the riders sat far apart
 * along a long deep tray and looked small). WHEELBARROW.trayLong .78 -> .5 (wheel, braces, legs and hay follow it) and the Thrower's hips moved up to
 * WHEELBARROW.backSeat .1, about .18 rig units behind the Farmer's; the Farmer's torso leans back BUNCHED_CREW.recline rad about his hip, his head
 * BUNCHED_CREW.nod forward again so he looks ahead, so his shoulders rest on the Thrower's chest.
 */
const BUNCHED_CREW = { recline: -0.5, nod: 0.3 };
/*
 * [S] the riders overfill a low-rimmed tray (380; farmer.wheelbarrow.red.png, .png: the two riders fill the short tray from end to end and sit up over a
 * low rim, the Apple Thrower's legs splayed forward and out round the Farmer on both sides; critic 378: they sat at the wheel end over empty hay, hips
 * sunk below a deep three-board side, the Thrower's legs hanging plumb). Each side and end is one board LOW_RIM.tall high (team paint, bolted), the hay
 * bed under its top; the riders' hips on the middle of the tray, the Farmer's LOW_RIM.front ahead of its middle and the Thrower's .back behind it; the
 * Thrower's thighs run forward CREW_SEAT.backThigh and out .backSplay past the Farmer's hips, his knees bent .backKnee and rolled .backRoll so the shins
 * hang down outside the tray. Replaces WHEELBARROW.backSeat .1 and CREW_SEAT.lipIn .05 (seats off the tray's front lip).
 */
// (380 follow-up: at front .11, back -.07, splay .55 the tray's rear quarter stayed empty and the Thrower's knees hid behind the Farmer)
const LOW_RIM = { tall: 0.06, front: 0.06 };
// (frontThigh -1.15, frontSplay .62, frontKnee .45 retired 422 by FRONT_SPLIT: under the hip's own frame they crossed the knees over to the other side)
const CREW_SEAT = { lipUp: 0.03, astrideUp: 0.04 };
/*
 * [S] the Thrower's legs round the Farmer (381; farmer.wheelbarrow.red.png: the Apple Thrower sits at the tray's back end and his thighs run forward
 * either side of the Farmer, knees out past the Farmer's hips, shins hanging outside the tray; critic 380: his knees hid behind the Farmer and one shin
 * hung plumb under the tray). His hips sit THROWER_LEGS.seat behind the tray's middle; each thigh is aimed (solved in the rig's frame, not by Euler
 * guesses) at a knee target .kneeOut outside the Farmer's hip joint on that side, .kneeAhead ahead of it and .kneeUp above it; each shin is aimed down
 * and out (.shinOut) and forward (.shinAhead) from there. Replaces CREW_SEAT.backThigh/backSplay/backKnee/backRoll and LOW_RIM.back.
 */
// (THROWER_LEGS { seat -.08, knee targets at the Farmer's hips, shinOut .45, shinAhead .35 } retired 388 by THROWER_PERCH and THROWER_KNEES)
/*
 * [S] 387 the Thrower perched on the rear quarter (farmer.wheelbarrow.red.png: the Apple Thrower sits at the tray's back end over the handles, up higher
 * than the Farmer so his chest and bearded head stand clear above the Farmer's, his knees splayed out round the Farmer's sides, shins outside the tray;
 * critic 375/382: the rear quarter empty, the riders merged into one body, the far knee unseen). Replaces THROWER_LEGS.seat and the knee targets at
 * the Farmer's hips (the thigh, ~.15 rig long, never reached them from behind). Rig units: his hips THROWER_PERCH.seat behind the tray's middle and .up
 * above the rim, on a lumpy hay tuft (.tuftDeep fore and aft, filling the tray across, lumps .lumps) under them; each thigh aimed at a knee target
 * .wide outside the tray's side board, .kneeUp above the rim, level with the Farmer's hip joint fore and aft plus .ahead; shins down and out
 * (THROWER_LEGS.shinOut, .shinAhead).
 */
const THROWER_PERCH = { seat: -0.15, up: 0.09, tuftDeep: 0.13, lumps: 0.18, wide: 0.09, kneeUp: 0.05, ahead: 0 };
/*
 * [S] 388 the Thrower's knees round the Farmer's chest (farmer.wheelbarrow.red.png: the rear rider's thighs run forward and up either side of the front
 * rider, both knees out beside the Farmer's chest, shins hanging outside; critic 387: the near leg dropped nearly straight down outside the board, the
 * far knee unseen). Each knee target is now read off the Farmer's own trunk on that side: .chest of the way from his hip joint up to his shoulder
 * (height and fore-aft), .out rig units outside that shoulder; the shin then hangs down and out from the knee (.shinOut, .shinDown, .shinAhead).
 */
// (THROWER_KNEES { chest .55, out .2 } knee targets retired 422 by THROWER_SPLIT: a thigh .33 root units long never reached a target .6 away, so the
// knee landed a third of the way, up beside the Farmer's arms)
/*
 * [R] 422 the riders' split (unparked; farmer.wheelbarrow.red.png, .blue.png; the 403 critic's recipe: "seat the Farmer's hips on the board top, thighs
 * near pure sideways, knees a thigh past each board, shins plumb"; blocker 1: "the knees still close to the Farmer's upper arms, not splayed wide past
 * him - TABS: knees splayed wide out past the front rider, at his waist"). Both renders: the front rider's thighs run straight out to the sides from hips
 * sat on the side boards, barely down and a little forward, so each knee lands a thigh past its board at hip height; the socked shins carry on down and
 * further out, one wide V to feet beyond the wheel; the rear rider's thighs run forward and out round the Farmer's waist, knees wide past him at his
 * belt, shins down outside the tray. Directions in the rig's frame, each limb its own fixed length (aimLimb never stretches):
 *   Farmer: each hip joint slid FRONT_SPLIT.hipOut rig units out in the pelvis frame onto its board top; thigh along (side * .out, -.down, .ahead);
 *     shin along (side * .shinOut, -1, .shinAhead).
 *   Thrower: thigh along (side * THROWER_SPLIT.out, -.down, .ahead) from his perch; shin along (side * .shinOut, -1, .shinAhead).
 */
const FRONT_SPLIT = { hipOut: 0.05, out: 1, down: 0.1, ahead: 0.12, shinOut: 0.45, shinAhead: 0.1 };
const THROWER_SPLIT = { out: 1, down: 0.3, ahead: 0.35, shinOut: 0.6, shinAhead: 0.15 };
/** The Farmer's hips out onto the board tops, thighs straight out to the sides, shins down and out (spec at FRONT_SPLIT). */
function seatFarmerSplit(rig: TransformNode, farmer: ArticulatedBody): void {
  const S = FRONT_SPLIT;
  settleWorld(rig);
  const toRig = rig.getWorldMatrix().clone().invert();
  const fromRig = rig.getWorldMatrix();
  for (const [hip, knee] of [[farmer.leftHip, farmer.leftKnee], [farmer.rightHip, farmer.rightKnee]] as [TransformNode, TransformNode][]) {
    settleWorld(hip);
    const side = Math.sign(Vector3.TransformCoordinates(hip.getAbsolutePosition(), toRig).x) || 1;
    hip.position.x += Math.sign(hip.position.x || side) * S.hipOut;
    aimLimb(hip, Vector3.TransformNormal(new Vector3(side * S.out, -S.down, S.ahead), fromRig));
    aimLimb(knee, Vector3.TransformNormal(new Vector3(side * S.shinOut, -1, S.shinAhead), fromRig));
  }
}
/** World matrices of a node and every ancestor, root first, so a read made at build time is fresh. */
function settleWorld(node: TransformNode): void {
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = node; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
}
/** Turn a limb joint so its rest direction (local -y) points along a world direction. */
function aimLimb(joint: TransformNode, worldDir: Vector3): void {
  settleWorld(joint);
  const parent = joint.parent as TransformNode;
  const local = Vector3.TransformNormal(worldDir, parent.getWorldMatrix().clone().invert()).normalize();
  joint.rotation.setAll(0);
  joint.rotationQuaternion = Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), local, new Quaternion());
}
/** The Thrower's thighs forward and wide out round the Farmer's waist, his shins down and out from the knees (spec at THROWER_SPLIT). */
function legsRoundFarmer(rig: TransformNode, thrower: ArticulatedBody): void {
  const T = THROWER_SPLIT;
  settleWorld(rig);
  const toRig = rig.getWorldMatrix().clone().invert();
  const fromRig = rig.getWorldMatrix();
  for (const [hip, knee] of [[thrower.leftHip, thrower.leftKnee], [thrower.rightHip, thrower.rightKnee]] as [TransformNode, TransformNode][]) {
    settleWorld(hip);
    const side = Math.sign(Vector3.TransformCoordinates(hip.getAbsolutePosition(), toRig).x) || 1;
    aimLimb(hip, Vector3.TransformNormal(new Vector3(side * T.out, -T.down, T.ahead), fromRig));
    aimLimb(knee, Vector3.TransformNormal(new Vector3(side * T.shinOut, -1, T.shinAhead), fromRig));
  }
}
const CREW_FORK = { long: 0.72, butt: 0.2, thick: 0.013, tines: 3, tine: 0.2, spread: 0.055, curl: 0.4, dir: new Vector3(-0.42, 0.12, 0.9), glow: 0.2 };
const CREW_APPLE = { r: 0.05, lift: 0.035, glow: 0.18 };
function holdInFist(hand: TransformNode, prop: TransformNode, dir: Vector3, offset: Vector3, rigScale: number): void {
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
  const handWorld = hand.getWorldMatrix();
  const at = Vector3.TransformCoordinates(Vector3.Zero(), handWorld).add(offset.scale(rigScale));
  const d = dir.normalizeToNew();
  const turn = Quaternion.FromEulerAngles(-Math.asin(d.y), Math.atan2(d.x, d.z), 0);
  const want = Matrix.Compose(new Vector3(rigScale, rigScale, rigScale), turn, at);
  const local = want.multiply(Matrix.Invert(handWorld));
  const sc = new Vector3(); const q = new Quaternion(); const pos = new Vector3();
  local.decompose(sc, q, pos);
  prop.parent = hand;
  prop.position.copyFrom(pos);
  prop.rotationQuaternion = q;
  prop.scaling.copyFrom(sc);
}
/** The wheelbarrow's three men, kept on the cart's root (metadata.wheelbarrowCrew) so they can be dressed and moved after the build. */
export interface WheelbarrowCrew { farmer: ArticulatedBody; thrower: ArticulatedBody; traveller: ArticulatedBody }
/*
 * [S] The riders fight (349; card Characteristics "the Apple Thrower throws apples and the Farmer stabs any enemy units up close", farmer.wheelbarrow.png):
 * times in seconds from the start of each move, the sim's clock (simulationSystem WHEELBARROW_CREW picks the men and lands the blows).
 *   Apple throw: the raised throwing arm (rest: shoulder CREW_REST.throwArm, elbow .throwElbow) cocked further back and folded over CREW_FIGHT.cock, the
 *   apple let go at the end of it, the arm whipped forward and out to near level over .whip, held .hold, eased back up over .back; a new apple in the fist
 *   once he is back (CREW_FIGHT.cock + whip + hold + back).
 *   Stab: the Farmer's fork arm (rest: CREW_REST.forkArm, .forkElbow) drawn back, fist to the chest, over .draw; driven out over .drive, the trunk
 *   leaning in .lean; the blow lands at the end of the drive; held .stabHold, eased back over .stabBack.
 *   350 [S] aimed at the man (card "the Farmer stabs any enemy units up close"; 349 drove it level at shoulder height, over the head of a man at the
 *   wheel): given the man's chest in the world, the trunk turns toward him (up to .turn), both arms are solved down the shoulder->chest line, drawn
 *   back up that line (.drawBack of lift, elbow folded .drawFold) and driven out along it with the elbow straight, and the fork is turned in the fist
 *   onto the same line, so the tines go down into him from the seat.
 */
export const CREW_FIGHT = { cock: 0.3, whip: 0.15, hold: 0.25, back: 0.4, draw: 0.18, drive: 0.12, stabHold: 0.15, stabBack: 0.35, lean: 0.25, turn: 0.9, drawBack: 0.55, drawFold: -1.5 };
const CREW_REST = { throwArm: -2.5, throwSpread: -0.3, throwElbow: -0.8, forkArm: -0.7, forkElbow: -0.6 };
/** The wheelbarrow's crew on a built body, or null for any other. */
export function wheelbarrowCrew(body: ArticulatedBody): WheelbarrowCrew | null {
  return (body.root.metadata as { wheelbarrowCrew?: WheelbarrowCrew } | null)?.wheelbarrowCrew ?? null;
}
/** The riders' arms set for the throw `throwT` and the stab `stabT` seconds in (-1: at rest), the stab aimed at `stabAt` (a world point) when given; spec at CREW_FIGHT. Returns the thrower's apple. */
export function poseWheelbarrowCrew(crew: WheelbarrowCrew, throwT: number, stabT: number, stabAt: Vector3 | null = null): TransformNode | null {
  const F = CREW_FIGHT, R = CREW_REST;
  const ease = (u: number): number => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
  // the throw: k cocked (0..1), w whipped (0..1), r eased back (0..1)
  let k = 0, w = 0;
  if (throwT >= 0) {
    k = ease(throwT / F.cock);
    w = ease((throwT - F.cock) / F.whip);
    const r = ease((throwT - F.cock - F.whip - F.hold) / F.back);
    k *= 1 - w; w *= 1 - r;
  }
  const t = crew.thrower;
  t.rightShoulder.rotation.set(R.throwArm - 0.45 * k + 1.15 * w, 0, R.throwSpread - 0.1 * k);
  t.rightElbow.rotation.x = R.throwElbow - 0.8 * k + 0.65 * w;
  t.torso.rotation.y = 0.35 * k - 0.3 * w;
  // the stab: d drawn, o driven out, eased back by b
  let d = 0, o = 0;
  if (stabT >= 0) {
    d = ease(stabT / F.draw);
    o = ease((stabT - F.draw) / F.drive);
    const b = ease((stabT - F.draw - F.drive - F.stabHold) / F.stabBack);
    d *= 1 - o; o *= 1 - b;
  }
  const f = crew.farmer;
  f.rightShoulder.rotation.set(R.forkArm + 0.35 * d - 0.85 * o, 0, 0);
  f.rightElbow.rotation.x = R.forkElbow - 1.0 * d + 0.55 * o;
  f.leftShoulder.rotation.set(R.forkArm + 0.25 * d - 0.6 * o, 0, 0);
  f.leftElbow.rotation.x = R.forkElbow;
  // at rest reclined into the Thrower (BUNCHED_CREW), sitting up as the stab drives out
  f.torso.rotation.set(BUNCHED_CREW.recline * (1 - o) - 0.1 * d + F.lean * o, 0, 0);
  aimCrewStab(f, stabAt, d, o);
  return t.rightHand.getChildren().find((n): n is TransformNode => n.name === "crewApple") ?? null;
}
/** The Farmer's stab laid down the line to `at` (spec at CREW_FIGHT, 350): trunk turned to it, both arms solved down it, the fork turned onto it. */
function aimCrewStab(f: ArticulatedBody, at: Vector3 | null, d: number, o: number): void {
  const fork = f.rightHand.getChildren().find((n): n is TransformNode => n.name === "crewFork");
  if (!fork) return;
  const meta = (fork.metadata ??= {}) as { rest?: Quaternion };
  meta.rest ??= fork.rotationQuaternion?.clone() ?? Quaternion.Identity();
  const aim = Math.min(1, d + o);
  if (!at || aim <= 0.001) { fork.rotationQuaternion = meta.rest.clone(); return; }
  const F = CREW_FIGHT;
  const settle = (n: TransformNode): void => {
    const chain: TransformNode[] = [];
    for (let k: TransformNode | null = n; k; k = k.parent as TransformNode | null) chain.unshift(k);
    for (const k of chain) k.computeWorldMatrix(true);
  };
  // the trunk turned toward him, in the seat's frame
  settle(f.root);
  const inRoot = Vector3.TransformCoordinates(at, Matrix.Invert(f.root.getWorldMatrix()));
  const turn = Math.max(-F.turn, Math.min(F.turn, Math.atan2(inRoot.x, inRoot.z)));
  f.torso.rotation.y = turn * aim;
  // each arm hung down its shoulder's -y: solved onto the shoulder->chest line, drawn back up it or driven out along it
  const arm = (shoulder: TransformNode, elbow: TransformNode): void => {
    settle(shoulder);
    const parent = shoulder.parent as TransformNode;
    const local = Vector3.TransformCoordinates(at, Matrix.Invert(parent.getWorldMatrix())).subtract(shoulder.position);
    if (local.lengthSquared() < 1e-8) return;
    local.normalize();
    const roll = Math.asin(Math.max(-1, Math.min(1, local.x)));
    const pitch = Math.atan2(-local.z, -local.y);
    const want = (draw: number, drive: number): number => draw * d + drive * o;
    const keep = 1 - aim;
    shoulder.rotation.x = shoulder.rotation.x * keep + want(pitch + F.drawBack, pitch);
    shoulder.rotation.z = shoulder.rotation.z * keep + want(roll, roll);
    elbow.rotation.x = elbow.rotation.x * keep + want(F.drawFold, -0.05);
  };
  arm(f.rightShoulder, f.rightElbow);
  arm(f.leftShoulder, f.leftElbow);
  // the fork turned in the fist onto the same line, from the fist
  settle(f.rightHand);
  const dir = at.subtract(f.rightHand.getAbsolutePosition());
  if (dir.lengthSquared() < 1e-8) return;
  dir.normalize();
  const world = Quaternion.FromEulerAngles(-Math.asin(Math.max(-1, Math.min(1, dir.y))), Math.atan2(dir.x, dir.z), 0);
  const local = Quaternion.Inverse(f.rightHand.absoluteRotationQuaternion).multiply(world);
  fork.rotationQuaternion = Quaternion.Slerp(meta.rest, local, aim);
}
function buildWheelbarrow(scene: Scene, color: Color3): ArticulatedBody {
  const W = WHEELBARROW;
  const root = new TransformNode("wheelbarrow_root", scene);
  const rig = new TransformNode("wheelbarrow_rig", scene);
  rig.parent = root;
  rig.scaling.setAll(W.scale);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));

  // Tray: the floor painted team colour, sides and ends of stacked boards (spec at TRAY_PLANK)
  const P = TRAY_PLANK;
  const lit = (c: Color3, glow: number) => getMaterialFactory().get("cloth", c, { emissive: c.scale(glow) });
  const plankWood = lit(TRAY_WOOD, P.glow);
  const paint = lit(color, 0.12);
  const boltMat = makeMat(scene, new Color3(0.16, 0.14, 0.13));
  const tray = MeshBuilder.CreateBox("tray", { width: W.trayWide, height: 0.04, depth: W.trayLong }, scene);
  tray.position.set(0, W.trayY, W.trayZ);
  tray.parent = rig; tray.material = paint; allMeshes.push(tray);
  // one low board a side (LOW_RIM), not three stacked
  const sideTall = LOW_RIM.tall;
  const board = sideTall;
  const addBoards = (name: string, w: number, d: number, x: number, z: number, alongX: boolean) => {
    for (let k = 0; k < 1; k++) {
      const top = true;
      const plank = MeshBuilder.CreateBox(name, { width: w, height: board, depth: d }, scene);
      plank.position.set(x, W.trayY + board / 2 + k * (board + P.seam), z);
      plank.parent = rig; plank.material = top ? paint : plankWood; allMeshes.push(plank);
      // a bolt head at each end of the board, on its outer face
      for (const e of [-1, 1]) {
        const bolt = MeshBuilder.CreateBox("trayBolt", { width: P.bolt, height: P.bolt, depth: P.bolt }, scene);
        if (alongX) bolt.position.set(e * (w / 2 - P.bolt), plank.position.y, z + Math.sign(z) * d * 0.6);
        else bolt.position.set(x + Math.sign(x) * w * 0.6, plank.position.y, z + e * (d / 2 - P.bolt * 1.5));
        bolt.parent = rig; bolt.material = boltMat; allMeshes.push(bolt);
      }
    }
  };
  for (const xOff of [-W.trayWide / 2, W.trayWide / 2]) addBoards("side", P.thick, W.trayLong, xOff, W.trayZ, false);
  for (const zOff of [-W.trayLong / 2, W.trayLong / 2]) addBoards("front", W.trayWide + P.thick, P.thick, 0, W.trayZ + zOff, true);
  // The hay: a flat lumpy bed filling the tray to just under its rim (HAY_BED), not heaped over it
  const bedTall = sideTall * HAY_BED.fill;
  const heap = MeshBuilder.CreateBox("trayHay", { width: W.trayWide - P.thick * HAY_BED.inset * 2, height: bedTall, depth: W.trayLong - P.thick * HAY_BED.inset * 2 }, scene);
  heap.position.set(0, W.trayY + bedTall * 0.5, W.trayZ);
  heap.convertToFlatShadedMesh();
  heap.parent = rig; heap.material = lit(TRAY_STRAW, 0.25); allMeshes.push(heap);
  jitterVertices(heap, HAY_BED.lumps, 347);

  // Wheel at front (+Z), under the tray's nose
  const wheelZ = W.trayZ + W.trayLong / 2 + 0.06;
  // ...a cut log: bark rim, end-grain faces with a growth ring, a bolted hub (spec at LOG_WHEEL)
  const L = LOG_WHEEL;
  const axleY = L.d / 2;
  const wheel = MeshBuilder.CreateCylinder("wheel", { height: L.thick, diameter: L.d - L.bark, tessellation: L.staves }, scene);
  wheel.position.set(0, axleY, wheelZ);
  wheel.rotation.z = Math.PI / 2;
  wheel.parent = rig; wheel.material = lit(LOG_BARK, L.glow); allMeshes.push(wheel);
  // ...its tread a ring of bark staves the drum's width, alternate ones darker
  const barkDark = lit(LOG_BARK.scale(L.staveShade), L.glow);
  for (let k = 0; k < L.staves; k++) {
    const a = (k / L.staves) * Math.PI * 2;
    const r = L.d / 2 - L.bark / 2;
    const stave = MeshBuilder.CreateBox("wheelStave", { width: (Math.PI * L.d / L.staves) * 1.04, height: L.thick, depth: L.bark * 1.4 }, scene);
    stave.position.set(r * Math.cos(a), 0, r * Math.sin(a));
    stave.rotation.y = Math.PI / 2 - a;
    stave.parent = wheel; stave.material = k % 2 ? barkDark : wheel.material; allMeshes.push(stave);
  }
  const face = MeshBuilder.CreateCylinder("wheelGrain", { height: L.thick + 0.008, diameter: L.d - L.bark * 2, tessellation: 11 }, scene);
  face.parent = wheel; face.material = lit(LOG_GRAIN, L.glow); allMeshes.push(face);
  const ring = MeshBuilder.CreateCylinder("wheelRing", { height: L.thick + 0.012, diameter: (L.d - L.bark * 2) * L.ring, tessellation: 9 }, scene);
  ring.parent = wheel; ring.material = lit(LOG_RING, L.glow); allMeshes.push(ring);
  const inner = MeshBuilder.CreateCylinder("wheelGrainCore", { height: L.thick + 0.016, diameter: (L.d - L.bark * 2) * L.ring * 0.7, tessellation: 9 }, scene);
  inner.parent = wheel; inner.material = face.material; allMeshes.push(inner);
  const hub = MeshBuilder.CreateCylinder("wheelHub", { height: L.thick + 0.06, diameter: L.hub, tessellation: 6 }, scene);
  hub.parent = wheel; hub.material = boltMat; allMeshes.push(hub);
  // ...held on a brace each side, from the hub up and back to the tray's floor
  const braceWood = lit(CART_WOOD, L.glow);
  for (const side of [-1, 1]) {
    const from = new Vector3(side * (L.thick / 2 + 0.035), axleY, wheelZ);
    const to = new Vector3(side * Math.max(W.trayWide / 2 - 0.04, L.thick / 2 + 0.05), W.trayY - 0.02, W.trayZ + W.trayLong / 2 - L.braceBack);
    const span = to.subtract(from);
    const brace = MeshBuilder.CreateBox("wheelBrace", { width: L.brace, height: L.brace * 1.6, depth: span.length() }, scene);
    brace.position.copyFrom(from.add(to).scale(0.5));
    brace.rotation.set(-Math.atan2(span.y, Math.hypot(span.x, span.z)), Math.atan2(span.x, span.z), 0);
    brace.parent = rig; brace.material = braceWood; allMeshes.push(brace);
    const bolt = MeshBuilder.CreateBox("braceBolt", { width: 0.02, height: 0.02, depth: 0.02 }, scene);
    bolt.position.set(to.x + side * 0.012, to.y, to.z);
    bolt.parent = rig; bolt.material = boltMat; allMeshes.push(bolt);
  }
  // ...and two legs under the tray's back end, standing down to just off the ground
  for (const side of [-1, 1]) {
    const topAt = new Vector3(side * (W.trayWide / 2 - 0.05), W.trayY - 0.02, W.trayZ - W.trayLong / 2 + L.legIn);
    const footAt = new Vector3(side * (W.trayWide / 2 - 0.05 + L.splay), L.legFoot, topAt.z - 0.02);
    const span = footAt.subtract(topAt);
    const leg = MeshBuilder.CreateBox("cartLeg", { width: L.leg, height: span.length(), depth: L.leg }, scene);
    leg.position.copyFrom(topAt.add(footAt).scale(0.5));
    leg.rotation.z = Math.atan2(span.x, -span.y) * -1;
    leg.rotation.x = Math.atan2(span.z, -span.y);
    leg.parent = rig; leg.material = braceWood; allMeshes.push(leg);
    const bolt = MeshBuilder.CreateBox("legBolt", { width: 0.02, height: 0.02, depth: 0.02 }, scene);
    bolt.position.set(topAt.x + side * (L.leg / 2 + 0.004), topAt.y - 0.03, topAt.z);
    bolt.parent = rig; bolt.material = boltMat; allMeshes.push(bolt);
  }

  // Handles: from the wheel's axle along under the tray, out the back to the Traveller's fists
  const handleBack = W.pushZ + 0.2;
  for (const xOff of [-0.17, 0.17]) {
    const from = new Vector3(Math.sign(xOff) * (L.thick / 2 + 0.03), axleY, wheelZ);
    const to = new Vector3(xOff, 0.4, handleBack);
    const handle = MeshBuilder.CreateTube("handle", { path: [from, new Vector3(xOff * 0.9, W.trayY - 0.04, W.trayZ - W.trayLong / 2), to], radius: 0.016, tessellation: 6 }, scene);
    handle.parent = rig; handle.material = wood; allMeshes.push(handle);
  }

  const seatY = W.trayY + sideTall; // the rim: the Apple Thrower sits astride the side boards (HAY_BED spec)
  const crew: Partial<WheelbarrowCrew> = {};
  const S = CREW_SEAT;
  // The Farmer, front: sat up on the tray's front lip, legs splayed forward and out over the wheel (spec at CREW_SEAT)
  addOperator(scene, rig, allMeshes, 0, 0, W.trayZ + LOW_RIM.front, color, (man) => {
    crew.farmer = man;
    man.root.position.y = W.trayY + sideTall + S.lipUp - man.hip.position.y;
    // reclined back into the Apple Thrower's chest, head brought forward to look ahead (BUNCHED_CREW)
    man.torso.rotation.x = BUNCHED_CREW.recline;
    man.neck.rotation.x = BUNCHED_CREW.nod;
    // hips out onto the board tops, thighs straight out to the sides, shins down and out (spec at FRONT_SPLIT)
    seatFarmerSplit(rig, man);
    man.leftShoulder.rotation.x = -0.7;
    man.rightShoulder.rotation.x = -0.7;
    man.leftElbow.rotation.x = -0.6;
    man.rightElbow.rotation.x = -0.6;
    // his pitchfork, in the right fist, ahead and across his front (spec at CREW_FORK)
    const F = CREW_FORK;
    const shaftWood = getMaterialFactory().get("cloth", new Color3(0.5, 0.26, 0.17), { emissive: new Color3(0.5, 0.26, 0.17).scale(F.glow) });
    const steel = getMaterialFactory().get("cloth", new Color3(0.52, 0.53, 0.55), { emissive: new Color3(0.52, 0.53, 0.55).scale(F.glow) });
    const fork = new TransformNode("crewFork", scene);
    const shaft = MeshBuilder.CreateCylinder("crewForkShaft", { height: F.long, diameter: F.thick * 2, tessellation: 6 }, scene);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = F.long / 2 - F.butt;
    shaft.parent = fork; shaft.material = shaftWood; allMeshes.push(shaft);
    const head = F.long - F.butt;
    const bar = MeshBuilder.CreateBox("crewForkBar", { width: F.spread * (F.tines - 1) + F.thick * 2, height: F.thick * 1.4, depth: F.thick * 1.6 }, scene);
    bar.position.z = head;
    bar.parent = fork; bar.material = steel; allMeshes.push(bar);
    for (let k = 0; k < F.tines; k++) {
      const x = (k - (F.tines - 1) / 2) * F.spread;
      const path = [0, 0.33, 0.66, 1].map((t) => new Vector3(x * (1 + 0.3 * t), F.curl * F.tine * t * t, head + F.tine * t));
      const tine = MeshBuilder.CreateTube("crewForkTine", { path, radius: F.thick * 1.1, tessellation: 5 }, scene);
      tine.parent = fork; tine.material = steel; allMeshes.push(tine);
    }
    holdInFist(man.rightHand, fork, F.dir, Vector3.Zero(), W.scale);
  });
  // The Apple Thrower, behind him: astride the narrow tray on its side boards, legs out over them and hanging outside, his throwing arm up and back
  // ...perched on a hay tuft on the rear quarter, up over the Farmer (spec at THROWER_PERCH)
  const TP = THROWER_PERCH;
  const tuft = MeshBuilder.CreateBox("trayHayTuft", { width: W.trayWide - P.thick, height: TP.up + sideTall * 0.6, depth: TP.tuftDeep }, scene);
  tuft.position.set(0, seatY + (TP.up - sideTall * 0.6) / 2, W.trayZ + TP.seat);
  tuft.convertToFlatShadedMesh();
  tuft.parent = rig; tuft.material = heap.material; allMeshes.push(tuft);
  jitterVertices(tuft, TP.lumps, 391);
  addOperator(scene, rig, allMeshes, 0, 0, W.trayZ + TP.seat, color, (man) => {
    crew.thrower = man;
    man.root.position.y = seatY + S.astrideUp + TP.up - man.hip.position.y;
    legsRoundFarmer(rig, man);
    man.rightShoulder.rotation.set(-2.5, 0, -0.3);
    man.rightElbow.rotation.x = -0.8;
    man.leftShoulder.rotation.x = -0.5;
    // the apple in his raised fist (spec at CREW_FORK)
    const A = CREW_APPLE;
    const red = new Color3(0.78, 0.12, 0.1);
    const apple = new TransformNode("crewApple", scene);
    const ball = MeshBuilder.CreateIcoSphere("crewAppleBall", { radius: A.r, subdivisions: 1, flat: true }, scene);
    ball.scaling.y = 0.9;
    ball.parent = apple; ball.material = getMaterialFactory().get("cloth", red, { emissive: red.scale(A.glow) }); allMeshes.push(ball);
    const leafGreen = new Color3(0.25, 0.55, 0.18);
    const leaf = MeshBuilder.CreateBox("crewAppleLeaf", { width: A.r * 0.5, height: A.r * 0.12, depth: A.r * 0.9 }, scene);
    leaf.position.set(A.r * 0.25, A.r * 0.92, A.r * 0.25);
    leaf.rotation.set(0.5, 0.6, 0);
    leaf.parent = apple; leaf.material = getMaterialFactory().get("cloth", leafGreen, { emissive: leafGreen.scale(A.glow) }); allMeshes.push(leaf);
    holdInFist(man.rightHand, apple, new Vector3(0, 0, 1), new Vector3(0, A.lift, 0), W.scale);
  });
  // The Traveller, rear: on his feet behind the cart, leaning in, fists down on the handle ends
  let travellerHeadTop = 0;
  const operator = addOperator(scene, rig, allMeshes, 0, 0, W.pushZ, color, (man) => {
    crew.traveller = man;
    man.root.position.y = 0;
    man.hip.rotation.x = W.lean;
    man.leftShoulder.rotation.x = -0.75 - W.lean;
    man.rightShoulder.rotation.x = -0.75 - W.lean;
    man.leftElbow.rotation.x = -0.2;
    man.rightElbow.rotation.x = -0.2;
    man.leftHip.rotation.x = -W.lean;
    man.rightHip.rotation.x = -W.lean;
  });
  travellerHeadTop = operator.headTopY * W.scale;
  root.metadata = { ...(root.metadata ?? {}), wheelbarrowCrew: crew };

  const vehicleSockets: VehicleSocketSet = {
    impactOrigin: makeSocket(scene, rig, "wheelbarrow_impact_socket", new Vector3(0, 0.3, wheelZ)),
  };

  return wrapAsBody(
    scene,
    root,
    tray,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(travellerHeadTop, 0.55 * W.scale, 0.34 * W.scale, 0.8 * W.scale),
    vehicleSockets,
  );
}


function buildLongship(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("longship_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  // 392: the hull's timber is a warm mid-brown, two steps up from the old .46/.30/.16, and self-lit a little: under the deck's shadow the plain wood
  // read near black (LESSONS: lit timber under an overhang loses its colour; give it a small emissive)
  // 400: two steps DOWN again - .62/.42/.25 in sun read pale grey-taupe against the reference's rich brown hull (critic 399: "a pale flat raft"); the
  // sky's IBL lifts a mid albedo to beige, so the hull takes a deep code value (.2/.11/.055) and a stronger self-light to keep its hue in the deck's shade
  const woodColor = new Color3(0.2, 0.11, 0.055);
  const darkColor = new Color3(0.13, 0.07, 0.035);
  const wood = getMaterialFactory().get("wood", woodColor, { emissive: woodColor.scale(0.35) });
  const darkWood = getMaterialFactory().get("wood", darkColor, { emissive: darkColor.scale(0.3) });
  const shieldMat = makeMat(scene, brighten(color, 0.08));

  /*
   * [S] the clinker hull (392; viking.longship.red.png, viking.jpg: a brown lapstrake hull, pointed at the bow under a carved dragon head and curled at
   * the stern; critic 391: "a plain blue rectangular box hull with square ends"). Three strakes a side lap outward over a dark keel, each row shorter
   * than the one below, so the side is a stepped brown wall with the light in the laps; a flat three-sided stem closes each end to a point. The hull is
   * its own timber material (not the vehicle body material, which is the team colour): the team reads on the gunwale rails, the shields and the
   * operator. Brown .46/.30/.16 in linear space, dark keel .30/.18/.10 (LESSONS: timber keeps its own material).
   * [S] 400 the deep hull (critic 399: "a pale flat raft of stacked beams, the deck at gunwale height, the stern a bent stick"): four strakes now rise
   * .strakes rows above the keel, the deck dropped to .deck so the side stands .wall above it (the oarsmen are cut at the chest by a hull wall, not by a
   * flat deck at the gunwale), the timber darkened two steps (.42/.26/.14 with a .18 self-light - the old .62/.42/.25 read pale grey-taupe in sun), a
   * .stem post curving from the keel up into the dragon's neck, and a rolled scroll at the stern: two cylinders lying across the stern's head, the
   * smaller one turned inside the bigger like a mat rolled up.
   */
  const LONGSHIP_STERN = { post: [[0.45, -1.26], [0.9, -1.4], [1.3, -1.5], [1.5, -1.52]] as [number, number][], r0: 0.2, r1: 0.05, turns: 1.25, root: 0.12, mid: 0.08, tip: 0.04 };
  const LONGSHIP_PROW = { lift: 0.75, root: 0.11, tip: 0.085, eye: 0.2, path: [[0.95, 1.3], [1.2, 1.42], [1.45, 1.42], [1.68, 1.3], [1.9, 1.3], [2.0, 1.38]] as [number, number][] };
  const HULL = { rows: 4, rowStep: 0.13, strake: 0.15, keelY: 0.2, deck: 0.4, wall: 0.705, stem: 0.9, scroll: 0.13 };
  const keel = MeshBuilder.CreateBox("longshipKeel", { width: 0.18, height: 0.16, depth: 2.62 }, scene);
  keel.position.set(0, HULL.keelY, 0);
  keel.parent = root;
  keel.material = darkWood;
  allMeshes.push(keel);
  /*
   * [S] 406 the curved hull (CONFIRM 403 a.3: "a straight-sided rectangular box with a flat top"; viking.longship.jpg, .red.png: a boat whose sides
   * belly out amidships and draw in to the posts, the sheer sweeping up fore and aft into the tall bow and the curled stern). Each strake, the gunwale
   * rail and the deck run along a curve instead of a straight box: at t in [-1, 1] along the hull (stern to bow, half length .half), a row's half
   * width is its midships width times 1 - .pinch |t|^.pow (the sides close in to the posts), and its height rises .rise t^2 times the row's share of
   * the side (the top row sweeps up most), .bow more toward the bow. Built of .segs boxes laid end to end along the curve and merged, each keeping the
   * lapstrake roll. The keel, the deck's height and the carriers' grip under the keel do not move.
   */
  const SHEER = { half: 1.3, pinch: 0.8, pow: 3, rise: 0.34, bow: 1.25, segs: 12 };
  const widthAt = (mid: number, t: number): number => mid * (1 - SHEER.pinch * Math.abs(t) ** SHEER.pow);
  const riseAt = (share: number, t: number): number => SHEER.rise * share * t * t * (t > 0 ? SHEER.bow : 1);
  const curvedPlank = (name: string, side: number, mid: number, y0: number, share: number, w: number, h: number, roll: number, half = SHEER.half): Mesh => {
    const parts: Mesh[] = [];
    for (let k = 0; k < SHEER.segs; k++) {
      const ta = (k / SHEER.segs) * 2 - 1, tb = ((k + 1) / SHEER.segs) * 2 - 1;
      const a = new Vector3(side * widthAt(mid, ta), y0 + riseAt(share, ta), ta * half);
      const b = new Vector3(side * widthAt(mid, tb), y0 + riseAt(share, tb), tb * half);
      const d = b.subtract(a);
      const seg = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d.length() * 1.06 }, scene);
      seg.position.copyFrom(a.add(b).scale(0.5));
      seg.rotation.set(-Math.atan2(d.y, Math.hypot(d.x, d.z)), Math.atan2(d.x, d.z), roll);
      parts.push(seg);
    }
    const merged = Mesh.MergeMeshes(parts, true)!;
    merged.name = name;
    merged.parent = root;
    return merged;
  };
  for (const side of [-1, 1]) {
    for (let row = 0; row < HULL.rows; row++) {
      const strake = curvedPlank("longshipStrake", side, 0.32 + row * 0.08, 0.24 + row * HULL.rowStep, (row + 1) / HULL.rows, 0.09, HULL.strake, -side * 0.18);
      strake.material = wood;
      allMeshes.push(strake);
    }
  }
  for (const end of [-1, 1]) {
    const stem = MeshBuilder.CreateCylinder("longshipStem", { height: 0.62, diameterBottom: 0.5, diameterTop: 0, tessellation: 3 }, scene);
    stem.rotation.x = end * Math.PI / 2;
    stem.scaling.x = 0.55;
    stem.position.set(0, 0.44, end * 1.28);
    stem.parent = root;
    stem.material = darkWood;
    allMeshes.push(stem);
  }
  // [S] 404 the gunwale rails in the hull's dark timber (CONFIRM 403 a.1: "two long blue bars running the length of the hull over the shield row";
  // viking.longship.jpg, viking.longship.red.png: the hull is brown wood throughout, team colour only on the hanging shields). The vehicle body
  // material (the team tint) is now taken from the first shield face instead (LESSONS: a team-trim mesh goes in as the body source).
  // [S] 406 the rails ride the top strake's sweep (SHEER)
  for (const side of [-1, 1]) {
    const rail = curvedPlank("longshipGunwale", side, 0.6, HULL.wall + 0.03, 1, 0.12, 0.08, 0, SHEER.half * 0.97);
    rail.material = darkWood;
    allMeshes.push(rail);
  }
  let teamTrim: Mesh | null = null;

  // [S] 406 the deck narrows with the hull toward the posts: .segs slabs, each as wide as the second strake there, merged
  const deckParts: Mesh[] = [];
  const deckHalf = 1.17;
  for (let k = 0; k < SHEER.segs; k++) {
    const tm = ((k + 0.5) / SHEER.segs) * 2 - 1;
    const slab = MeshBuilder.CreateBox("longshipDeck", { width: Math.max(0.1, 2 * widthAt(0.41, tm * deckHalf / SHEER.half)), height: 0.05, depth: (2 * deckHalf) / SHEER.segs }, scene);
    slab.position.set(0, HULL.deck, tm * deckHalf);
    deckParts.push(slab);
  }
  const deck = Mesh.MergeMeshes(deckParts, true)!;
  deck.name = "longshipDeck";
  deck.parent = root;
  deck.material = darkWood;
  allMeshes.push(deck);

  /*
   * [S] the team shields on the gunwales (395; viking.longship.jpg "having Brawler shields on each side", viking.longship.red.png: big round shields
   * hanging over each side with a dark half, a brown rim and a boss; critic 394: "flat olive-grey discs, no boss or team colour"). Each shield is the
   * Brawler's board cut down to a plainer one: a twelve-sided disc .face across in the light team paint, a dark slate half over it with its split down the
   * middle, a wide brown wooden rim ring behind, and a bronze eight-sided boss proud of the face. Four a side, hung just outside the rail (at .across x,
   * .y up, spaced .spread apart from .first), facing outboard, so the hull's side is a row of boards.
   */
  const SHIELDS = { face: 0.46, rim: 0.51, boss: 0.17, across: 0.62, y: 0.58, first: -0.9, spread: 0.6, count: 4 };
  // [S] 405 plank seams in a dark brown and a dark iron-brown boss (spec at the seams below)
  const PLANKS = { count: 3, wide: 0.035 };
  const shieldDark = makeMat(scene, new Color3(0.14, 0.08, 0.05));
  const shieldWood = makeMat(scene, new Color3(0.34, 0.2, 0.12));
  const shieldBoss = makeMat(scene, new Color3(0.2, 0.13, 0.08));
  const shieldDisc = (name: string, diameter: number, depth: number, arc = 1): Mesh => {
    const m = MeshBuilder.CreateCylinder(name, { height: depth, diameter, tessellation: 12, arc, enclose: arc < 1 }, scene);
    m.rotation.x = Math.PI / 2;
    m.bakeCurrentTransformIntoVertices();
    return m;
  };
  for (const side of [-1, 1]) {
    for (let i = 0; i < SHIELDS.count; i++) {
      const holder = new TransformNode("longshipShieldMount", scene);
      holder.parent = root;
      // [S] 406 each board hangs on the curved rail where it is: in by the hull's pinch there, up by its sweep, turned with the side's run
      const zAt = SHIELDS.first + i * SHIELDS.spread, tAt = zAt / SHEER.half;
      holder.position.set(side * (widthAt(SHIELDS.across, tAt) + 0.02), SHIELDS.y + riseAt(0.8, tAt), zAt);
      holder.rotation.y = side * Math.PI / 2 - side * Math.atan(SHIELDS.across * SHEER.pinch * SHEER.pow * Math.abs(tAt) ** (SHEER.pow - 1) * Math.sign(tAt) / SHEER.half);
      holder.rotation.z = (i % 2 ? 1 : -1) * 0.06;
      const face = shieldDisc("longshipShield", SHIELDS.face, 0.035);
      face.parent = holder;
      face.material = shieldMat;
      allMeshes.push(face);
      teamTrim ??= face;
      const rim = shieldDisc("longshipShieldRim", SHIELDS.rim, 0.026);
      rim.position.z = -0.008;
      rim.parent = holder;
      rim.material = shieldWood;
      allMeshes.push(rim);
      // [S] 405 the whole face in the team paint, crossed by thin dark plank seams (CONFIRM 403 a.2: "a dark disc with only a team-coloured crescent";
      // viking.longship.blue.png: the face all team colour with brown plank lines, a wooden rim and a dark boss). The dark half is gone: PLANKS.count
      // seams .wide of the face across, running top to bottom, each clipped to the disc's chord at its x so none overhangs the rim.
      for (let p = 0; p < PLANKS.count; p++) {
        const x = ((p + 1) / (PLANKS.count + 1) - 0.5) * SHIELDS.face;
        const chord = 2 * Math.sqrt(Math.max(0, (SHIELDS.face / 2) ** 2 - x * x)) * 0.97;
        const seam = MeshBuilder.CreateBox("longshipShieldPlank", { width: SHIELDS.face * PLANKS.wide, height: chord, depth: 0.008 }, scene);
        seam.position.set(x, 0, 0.021);
        seam.parent = holder;
        seam.material = shieldDark;
        allMeshes.push(seam);
      }
      const boss = MeshBuilder.CreateCylinder("longshipShieldBoss", { height: 0.07, diameter: SHIELDS.boss, tessellation: 8 }, scene);
      boss.rotation.x = Math.PI / 2;
      boss.rotation.z = Math.PI / 8;
      boss.bakeCurrentTransformIntoVertices();
      boss.position.z = 0.04;
      boss.parent = holder;
      boss.material = shieldBoss;
      boss.convertToFlatShadedMesh();
      allMeshes.push(boss);
    }
  }

  /*
   * [S] the oars, not a rig (394; viking.longship.jpg, card Appearance "3 Long-Boaters holding oars"; critic 393: no mast or yard at all — the deck's
   * verticals are three upright black flat-bladed oars, plus the dragon prow and the stern post). The mast, yard and sail are gone: three long dark oars
   * stand out of the deck amidships, each a thin shaft with a broad flat leaf blade standing up over the hull, one forward, one aft and one between,
   * leaning a little fore and aft of each other so the three read apart. .long of the hull's height, the blade .blade of it and .bladeWide across at its
   * middle (a leaf: a widening foot and a point, not a spearhead), .lean rad off upright.
   * [S] 398 the critic read the blades as near-black discs taller than the crew: the oar's timber is now the hull's own warm brown, self-lit, and the
   * blade is narrower (.bladeWide .3, about a head wide on the small crew) and shorter (.blade .5).
   */
  const OARS = { long: 1.75, thick: 0.055, blade: 0.34, bladeWide: 0.2, neck: 0.1, stem: 0.07, flat: 0.25, lean: [-0.13, 0.05, 0.16], spread: [-0.52, 0.02, 0.56], across: [0.16, -0.12, 0.08] };
  const oarMat = getMaterialFactory().get("wood", new Color3(0.52, 0.34, 0.19), { emissive: new Color3(0.52, 0.34, 0.19).scale(0.16) });
  /*
   * [S] three Long-Boaters on their oars (395; viking.longship.jpg, card Appearance "3 Long-Boaters holding oars", card "The people riding it are called
   * oarmen"; critic 394: "an empty deck and three thin dark rods, one reading as a spear, no blades or hands"). The single operator is replaced by three
   * small crew bodies standing along the hull amidships (at .at z, .across x, their feet .feet up on the deck, facing the bow), each in a horned team cap
   * over a dark belt, and each gripping one of the three oars in one fist (.hand alternates so the oars stand either side of the line): the oar node is
   * hung off that fist (holdInFist) and the shaft runs .butt below the grip, .top above it, the leaf blade over his head and the butt down by the deck.
   * The fist is raised .raise at the shoulder, .spread out, elbow .elbow, so the hand is at his chest and the oar stands beside him.
   * [S] 398 the critic read the crew as slim mannequins with pinhead horns standing ON the deck, not stocky oarsmen sunk to the chest in the hull:
   * .feet drops to .16 (the deck's plank cuts them at the ribs, the gunwale rail at the chest) and they are built stout (bulk 1.3, broad trunk, thick
   * arms and legs, big head) with tall horns (.horn of the head's height) leaned out over the rail.
   * [S] 399 .feet drops again, .44 -> .3, so the gunwale cuts them at the chest rather than the belt (probe: with .44 the torso sat above
   * the .70 rail, with .2 only the neck and head cleared it); .top falls with them (1.05 -> 1.19, the fist .1 higher) so the oar heads keep their
   * height over the hull, and the blade is a paddle head on a neck (OARS).
   */
  const LONGSHIP_CREW = {
    at: [-0.62, 0.02, 0.66], across: [-0.1, 0.06, -0.02], feet: 0.3, hand: [1, -1, 1] as const,
    raise: -0.5, spread: 0.34, elbow: -0.55, butt: 0.62, top: 1.19, clutch: 0.03, glow: 0.08, horn: 3.2,
  };
  /**
   * [S] the oarsmen getting off the ship (396; viking.longship.jpg, card Characteristics: thrown at the enemies, its oarsmen disembark). Kept on the ship's
   * root so the sim can move them after the hurl: at the hurl they heave the hull up (both arms overhead), and at the crash they drop their oars and step
   * off the deck onto the ground either side of the hull (their feet at the root's own floor, the three spread fore and aft).
   */
  interface LongshipCrewman { body: ArticulatedBody; oar: TransformNode; landed: boolean }
  const crewBodies: LongshipCrewman[] = [];
  const crewCap = makeMat(scene, color.scale(0.78));
  const crewDark = makeMat(scene, new Color3(0.2, 0.13, 0.09));
  const crewHorn = makeMat(scene, new Color3(0.82, 0.8, 0.72));
  /** A horned team cap and a dark belt on a longship crewman (the oarsman's own cut, not the shared viking helmet). */
  const dressBoatSman = (body: ArticulatedBody): void => {
    const e = body.headMesh.getBoundingInfo().boundingBox.extendSize;
    const dome = MeshBuilder.CreateSphere("longshipCrewCap", { diameterX: 2.1 * e.x, diameterY: 1.7 * e.y, diameterZ: 2.1 * e.z, segments: 8, slice: 0.6 }, scene);
    dome.position.y = e.y * 0.18;
    dome.parent = body.headMesh;
    dome.material = crewCap;
    dome.convertToFlatShadedMesh();
    allMeshes.push(dome);
    for (const side of [-1, 1]) {
      const horn = MeshBuilder.CreateCylinder("longshipCrewHorn", { height: LONGSHIP_CREW.horn * e.y, diameterTop: 0, diameterBottom: 0.6 * e.y, tessellation: 4 }, scene);
      horn.position.set(side * e.x * 1.2, e.y * (0.5 + LONGSHIP_CREW.horn * 0.28), -e.z * 0.1);
      horn.rotation.z = -side * 0.5;
      horn.parent = body.headMesh;
      horn.material = crewHorn;
      horn.convertToFlatShadedMesh();
      allMeshes.push(horn);
    }
    const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
    const belt = MeshBuilder.CreateCylinder("longshipCrewBelt", { height: chest.y * 0.22, diameter: Math.max(chest.x, chest.z) * 2 * 0.86, tessellation: 8 }, scene);
    belt.position.y = chest.y * 0.14;
    belt.scaling.z = body.torsoMesh.scaling.z;
    belt.parent = body.torso;
    belt.material = crewDark;
    belt.convertToFlatShadedMesh();
    allMeshes.push(belt);
  };
  const crew: VehicleOperator[] = [];
  for (let i = 0; i < LONGSHIP_CREW.at.length; i++) {
    const C = LONGSHIP_CREW;
    const side = C.hand[i];
    const operator = addOperator(scene, root, allMeshes, C.across[i], C.feet, C.at[i], color, (body) => {
      dressBoatSman(body);
      const shoulder = side > 0 ? body.rightShoulder : body.leftShoulder;
      const elbow = side > 0 ? body.rightElbow : body.leftElbow;
      const hand = side > 0 ? body.rightHand : body.leftHand;
      shoulder.rotation.set(C.raise, 0, -side * C.spread);
      elbow.rotation.set(C.elbow, 0, 0);
      // the oar: a node hung off the fist (unscaled, in the ship's own units) with the shaft and the leaf blade standing out of it
      const mount = new TransformNode("longshipOar", scene);
      holdInFist(hand, mount, new Vector3(0.04 * side, 1, OARS.lean[i]), new Vector3(0, 0, C.clutch), 1);
      mount.parent = hand;
      // the oar's own frame: +Z of the mount is the way the shaft points (the fist's grip), so the geometry is built up +Y and stood on the mount
      const oarBody = new TransformNode("longshipOarBody", scene);
      oarBody.parent = mount;
      oarBody.rotation.x = Math.PI / 2;
      const shaft = MeshBuilder.CreateCylinder("longshipOarShaft", { height: C.butt + C.top, diameter: OARS.thick, tessellation: 6 }, scene);
      shaft.position.y = (C.top - C.butt) * 0.5;
      shaft.parent = oarBody;
      shaft.material = oarMat;
      allMeshes.push(shaft);
      const oarLeaf = (top: number): void => {
        // [S] 397 a flat ROUNDED paddle, not a spearhead (viking.longship.jpg: every oar ends in a broad, round-shouldered paddle blade). One faceted
        // oval slab across the shaft's head: wide in x, long in y down the shaft, thin through z, lit flat like the shaft.
        // [S] 399 the critic read the oval as 1.5 heads wide and two crew-heights tall: the head is now one head wide (.bladeWide .2), shorter
        // (.blade .34), and stands on a .neck of thin shaft, so it reads as a paddle's head rather than a leaf on a stick.
        const neck = MeshBuilder.CreateCylinder("longshipOarNeck", { height: OARS.neck, diameter: OARS.thick * 0.9, tessellation: 6 }, scene);
        neck.position.y = top + OARS.neck * 0.5;
        neck.parent = oarBody;
        neck.material = oarMat;
        allMeshes.push(neck);
        const blade = MeshBuilder.CreateCylinder("longshipOarBlade", { height: 1, diameter: 1, tessellation: 8 }, scene);
        blade.rotation.x = Math.PI / 2;
        blade.bakeCurrentTransformIntoVertices();
        blade.scaling.set(OARS.bladeWide, OARS.blade, OARS.bladeWide * OARS.flat);
        blade.position.y = top + OARS.neck + OARS.blade * 0.5;
        blade.parent = oarBody;
        blade.material = oarMat;
        blade.convertToFlatShadedMesh();
        allMeshes.push(blade);
      };
      oarLeaf(C.top);
      crewBodies.push({ body, oar: mount, landed: false });
    });
    crew.push(operator);
  }
  root.metadata = { ...(root.metadata ?? {}), longshipCrew: crewBodies };

  // [S] 400 the bow stem rises out of the keel into the dragon's neck (the old bow post was a bare stick beside the hull), and the stern carries a rolled
  // scroll: a fat cylinder lying across the ship with a smaller one turned inside it, the end of a mat rolled up (critic 399: "the stern a bent stick")
  const bowStem = MeshBuilder.CreateCylinder("longshipBowStem", { height: 1.02, diameterBottom: 0.26, diameterTop: 0.12, tessellation: 5 }, scene);
  bowStem.position.set(0, 0.58, 1.28);
  bowStem.rotation.x = -0.26;
  bowStem.parent = root;
  bowStem.material = wood;
  allMeshes.push(bowStem);
  const bowKnee = MeshBuilder.CreateBox("longshipBowKnee", { width: 0.2, height: 0.22, depth: 0.5 }, scene);
  bowKnee.position.set(0, 0.24, 1.12);
  bowKnee.parent = root;
  bowKnee.material = darkWood;
  allMeshes.push(bowKnee);
  /*
   * [S] 409 the stern scroll (CONFIRM 407 a.3: "a blunt log end barely above the gunwale"; viking.longship.jpg: the stern post rises tall off the keel
   * end and curls over into a rolled spiral, about three quarters of the prow's height). LONGSHIP_STERN: one tube off the keel end, up and leaning
   * back along .post ([y, z], ship units), then wound round a centre .turn ahead of its top: starting behind the centre at radius .r0, it climbs over
   * the top, comes down in front and winds in to .r1 over .turns turns; the tube's radius tapers from .root through .mid (at the scroll) to .tip.
   */
  const ST = LONGSHIP_STERN;
  const sternPath = ST.post.map(([y, z]) => new Vector3(0, y, z));
  const top = sternPath[sternPath.length - 1];
  const centre = new Vector3(0, top.y, top.z + ST.r0);
  const sternSteps = 18;
  for (let i = 1; i <= sternSteps; i++) {
    const f = i / sternSteps;
    const phi = f * ST.turns * Math.PI * 2;
    const r = ST.r0 + (ST.r1 - ST.r0) * f;
    sternPath.push(new Vector3(0, centre.y + r * Math.sin(phi), centre.z - r * Math.cos(phi)));
  }
  const postN = ST.post.length - 1;
  const sternPost = MeshBuilder.CreateTube("longshipSternPost", {
    path: sternPath, tessellation: 6, cap: Mesh.CAP_ALL,
    radiusFunction: (i) => i <= postN ? ST.root + (ST.mid - ST.root) * (i / postN) : ST.mid + (ST.tip - ST.mid) * ((i - postN) / sternSteps),
  }, scene);
  sternPost.convertToFlatShadedMesh();
  sternPost.parent = root;
  sternPost.material = darkWood;
  allMeshes.push(sternPost);

  /*
   * [S] the carved dragon head over the bow and the curled stern (392; viking.longship.red.png: a tall brown head on the stem, a white eye on each side
   * of it, an open jaw with a row of white teeth; the stern post curls back over the deck). A neck block off the stem, the skull box tipped forward, a
   * tapered snout over a dropped lower jaw with four teeth, two bead eyes, two horns; three short segments bent back make the curl.
   */
  /*
   * [S] 408 the tall S-curved prow neck (CONFIRM 407 a.1: "a squat box head sits just above the gunwale at the bow"; viking.longship.jpg, .red.png:
   * an S-curved dragon neck rising about a hull-depth above the hull, dominating the silhouette). LONGSHIP_PROW: the neck a tube off the stem's top
   * along an S in the y-z plane (.path, ship units: out over the bow, back, then out again under the head), its radius tapering from .root to .tip;
   * the head (skull, snout, jaw, teeth, eyes, horns) is the 392 head lifted .lift on top of it; each eye a big flat white disc .eye across with a black
   * pupil on its outer face (blocker 2: "a small white bead").
   */
  const P = LONGSHIP_PROW;
  const boneWhite = makeMat(scene, new Color3(0.93, 0.92, 0.86));
  const pupilMat = makeMat(scene, new Color3(0.05, 0.05, 0.06));
  const neckPath = P.path.map(([y, z]) => new Vector3(0, y, z));
  const neck = MeshBuilder.CreateTube("longshipDragonNeck", {
    path: neckPath, radiusFunction: (i) => P.root + (P.tip - P.root) * (i / (neckPath.length - 1)), tessellation: 6, cap: Mesh.CAP_ALL,
  }, scene);
  neck.parent = root;
  neck.material = darkWood;
  neck.convertToFlatShadedMesh();
  allMeshes.push(neck);
  const L = P.lift;
  const skull = MeshBuilder.CreateBox("longshipDragonHead", { width: 0.32, height: 0.28, depth: 0.36 }, scene);
  skull.position.set(0, 1.22 + L, 1.42);
  skull.rotation.x = -0.12;
  skull.parent = root;
  skull.material = wood;
  allMeshes.push(skull);
  const snout = MeshBuilder.CreateCylinder("longshipDragonSnout", { height: 0.32, diameterBottom: 0.26, diameterTop: 0.1, tessellation: 4 }, scene);
  snout.rotation.x = Math.PI / 2 - 0.12;
  snout.position.set(0, 1.2 + L, 1.66);
  snout.parent = root;
  snout.material = wood;
  allMeshes.push(snout);
  const jaw = MeshBuilder.CreateBox("longshipDragonJaw", { width: 0.2, height: 0.06, depth: 0.3 }, scene);
  jaw.position.set(0, 1.06 + L, 1.64);
  jaw.rotation.x = 0.14;
  jaw.parent = root;
  jaw.material = darkWood;
  allMeshes.push(jaw);
  for (let i = 0; i < 4; i++) {
    const tooth = MeshBuilder.CreateCylinder("longshipDragonTooth", { height: 0.07, diameterTop: 0, diameterBottom: 0.035, tessellation: 4 }, scene);
    tooth.rotation.x = Math.PI;
    tooth.position.set(-0.06 + i * 0.04, 1.09 + L, 1.72 - (i % 2) * 0.05);
    tooth.parent = root;
    tooth.material = boneWhite;
    allMeshes.push(tooth);
  }
  for (const side of [-1, 1]) {
    const eye = MeshBuilder.CreateCylinder("longshipDragonEye", { height: 0.04, diameter: P.eye, tessellation: 12 }, scene);
    eye.rotation.z = Math.PI / 2;
    eye.position.set(side * 0.17, 1.28 + L, 1.48);
    eye.parent = root;
    eye.material = boneWhite;
    allMeshes.push(eye);
    const pupil = MeshBuilder.CreateCylinder("longshipDragonPupil", { height: 0.02, diameter: P.eye * 0.45, tessellation: 10 }, scene);
    pupil.rotation.z = Math.PI / 2;
    pupil.position.set(side * 0.2, 1.28 + L, 1.5);
    pupil.parent = root;
    pupil.material = pupilMat;
    allMeshes.push(pupil);
    const horn = MeshBuilder.CreateCylinder("longshipDragonHorn", { height: 0.16, diameterTop: 0, diameterBottom: 0.05, tessellation: 4 }, scene);
    horn.position.set(side * 0.11, 1.4 + L, 1.34);
    horn.rotation.x = 0.5;
    horn.rotation.z = -side * 0.25;
    horn.parent = root;
    horn.material = darkWood;
    allMeshes.push(horn);
  }
  // 400: the bent stick is gone - the stern post and its rolled scroll are built with the bow stem above

  /*
   * [S] 401 the ship carried overhead by two Longship Carriers, at 1.8x (critic 400 a.4: "a ground-level box ~1.5x a man"; card Characteristics "three
   * Oarsmen aboard carried by 2 Longship Carriers", viking.longship.jpg: the hull rides on the carriers' shoulders/overhead, about three men long).
   * Everything built so far - hull, shields, oars, crew, prow - goes under one `ship` node, scaled SHIP.scale and stood at the carriers' hands, so the
   * whole boat grows together and its crew grow with it. Two full-size carriers stand under the keel (one fore, one aft), both arms straight up, hands at
   * the hull's underside: the ship's own height is read off a carrier's fist after the pose, so the hands always meet the keel. At the hurl the carriers
   * let go from overhead and stay behind (heaveLongshipCrew, flyLongshipHull, 402), so the boat, not the men, is what flies and crashes.
   */
  const SHIP = { scale: 1.8, at: [-0.98, 0.98], carrier: 0.98, raise: -2.62, spread: 0.2, elbow: -0.1 };
  const ship = new TransformNode("longship_ship", scene);
  ship.parent = root;
  ship.scaling.setAll(SHIP.scale);
  for (const child of [...root.getChildren()]) {
    if (child !== ship) child.parent = ship;
  }
  const CARRIER_PROPORTIONS: Partial<BodyProportions> = {
    scale: SHIP.carrier, bulk: 1.1, headSize: 1.2, armLength: 1.02, legLength: 0.96, torsoWidth: 1.05, headLength: 1.05,
  };
  const carriers: ArticulatedBody[] = [];
  for (const z of SHIP.at) {
    const carrier = addOperator(scene, root, allMeshes, 0, 0, z, color, (man) => {
      // [S] 407 the carriers' own dress: braided brown beard, horned headband, round-buckle belt (vikingDress LONGSHIP_CARRIER), not the oarsmen's cap
      allMeshes.push(...longshipCarrierDress(scene, man));
      man.leftShoulder.rotation.set(SHIP.raise, 0, -SHIP.spread);
      man.rightShoulder.rotation.set(SHIP.raise, 0, SHIP.spread);
      man.leftElbow.rotation.set(SHIP.elbow, 0, 0);
      man.rightElbow.rotation.set(SHIP.elbow, 0, 0);
    }, CARRIER_PROPORTIONS);
    carriers.push(carrier.body);
  }
  settleWorld(carriers[0].rightHand);
  const keelFoot = (HULL.keelY - 0.08) * SHIP.scale;
  ship.position.y = Math.max(1.2, carriers[0].rightHand.getAbsolutePosition().y - keelFoot + 0.03);
  root.metadata = { ...(root.metadata ?? {}), longshipRig: { ship, carriers, shipY: ship.position.y } };

  const operator = crew[1];
  const shipTop = ship.position.y + 2.05 * SHIP.scale;

  return wrapAsBody(
    scene,
    root,
    teamTrim!,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(shipTop, 1.1 * SHIP.scale, 0.6 * SHIP.scale, ship.position.y + 0.6),
    { impactOrigin: makeSocket(scene, root, "longship_impact_socket", new Vector3(0, ship.position.y + 0.72 * SHIP.scale, 1.28 * SHIP.scale)) },
  );
}

/** The Longship's crew, kept on its root (metadata.longshipCrew) so the sim can heave and land them after the hurl (spec at LONGSHIP_CREW). */
type LongshipCrew = Array<{ body: ArticulatedBody; oar: TransformNode; landed: boolean }>;
function longshipCrewOf(body: ArticulatedBody): LongshipCrew | null {
  return (body.root.metadata as { longshipCrew?: LongshipCrew } | null)?.longshipCrew ?? null;
}
/**
 * The carried ship and the two carriers under it (spec at SHIP in buildLongship). `shipY` is the hull's carried height on the root; `stood` holds the
 * carriers' world spots from the hurl's take-off until the crash (flyLongshipHull keeps them there while the root flies on).
 */
type LongshipRig = { ship: TransformNode; carriers: ArticulatedBody[]; shipY: number; stood?: Vector3[] };
function longshipRigOf(body: ArticulatedBody): LongshipRig | null {
  return (body.root.metadata as { longshipRig?: LongshipRig } | null)?.longshipRig ?? null;
}

/**
 * The oarsmen heave the hull up over their heads at the hurl's take-off (both arms overhead, elbows a little bent), and the two carriers let go.
 * [S] 402 the hull leaves the carriers' fists from overhead (CONFIRM 401 c.1: "no carrier in the frame at the hurl and the hull sits on the grass ...
 * 150 ms later it floats up from ground level with nobody throwing it"; viking.longship.blue.png: both carriers under the keel, arms straight up). The
 * carriers are no longer hidden nor the hull dropped here: the hull keeps its carried height (rig.shipY) on the root as the root leaps, and the carriers'
 * world spots are pinned (rig.stood) so flyLongshipHull holds them standing where they threw from, arms still up, while the root flies on; the hull
 * then sinks from their hands to the keel line over the flight and the carriers go at the crash (they stay behind in TABS, card Characteristics "the
 * carriers will throw the Longship on them").
 */
export function heaveLongshipCrew(body: ArticulatedBody): void {
  const rig = longshipRigOf(body);
  if (rig) {
    body.root.computeWorldMatrix(true);
    rig.stood = rig.carriers.map((carrier) => { carrier.root.computeWorldMatrix(true); return carrier.root.getAbsolutePosition().clone(); });
  }
  for (const man of longshipCrewOf(body) ?? []) {
    if (man.landed) continue;
    man.body.leftShoulder.rotation.set(-2.4, 0, -0.22);
    man.body.rightShoulder.rotation.set(-2.4, 0, 0.22);
    man.body.leftElbow.rotation.set(-0.28, 0, 0);
    man.body.rightElbow.rotation.set(-0.28, 0, 0);
  }
}

/**
 * [S] the oarsmen disembark (396; card Characteristics: the thrown ship's oarsmen get off). At the crash each man still aboard keeps the oar he holds
 * (403; it dropped them until then) and steps off the deck onto the ground either side of the hull, fore and aft, the oar raised to chop. One call lands
 * them all; a second call on an already landed crew does nothing.
 */
/**
 * One step of the hurled hull's flight (spec at heaveLongshipCrew): the carriers kept at their take-off spots in the flying root's own frame, and the
 * hull sunk from the carried height toward the keel line by `k` (0 at the take-off, 1 fully down), so it leaves their hands overhead and lands on its keel.
 */
export function flyLongshipHull(body: ArticulatedBody, k: number): void {
  const rig = longshipRigOf(body);
  if (!rig?.stood) return;
  body.root.computeWorldMatrix(true);
  const toRoot = body.root.getWorldMatrix().clone().invert();
  rig.carriers.forEach((carrier, i) => carrier.root.position.copyFrom(Vector3.TransformCoordinates(rig.stood![i], toRoot)));
  rig.ship.position.y = rig.shipY * (1 - Math.min(1, Math.max(0, k)));
}

export function landLongshipCrew(body: ArticulatedBody): boolean {
  const crew = longshipCrewOf(body);
  if (!crew) return false;
  // the hull is down on its keel; the carriers, left behind at the take-off, are done (spec at heaveLongshipCrew)
  const rig = longshipRigOf(body);
  if (rig) {
    rig.ship.position.y = 0;
    if (rig.stood) for (const carrier of rig.carriers) carrier.root.setEnabled(false);
    rig.stood = undefined;
  }
  let moved = false;
  crew.forEach((man, i) => {
    if (man.landed) return;
    man.landed = true;
    moved = true;
    const side = i % 2 === 0 ? -1 : 1;
    man.body.root.position.set(side * (0.86 + (i === 2 ? 0.16 : 0)), 0, -0.34 + i * 0.52);
  });
  // the oars stay in their fists, raised for the first chop (spec at OAR_CHOP)
  swingLongshipCrew(body, 0);
  return moved;
}

/*
 * [S] 403 the landed oarsmen fight with their oars (viking.longship.jpg, card Characteristics "the oarsmen disembark and attack enemy units with their
 * oars"; critic 402 c.2: the crew stood beside the landed hull empty-handed). The oar stays in the fist it was carried in (the node hangs off the
 * hand, so it follows the arm); both arms swing it together as a two-handed chop: from .up (shoulder pitch, the oar back over the head) down to .down
 * (out in front, the blade at a man's chest) over .strike of each .period s, then raised again over the rest; elbows .elbow. The sim
 * (simulationSystem LONGSHIP_OARS) lands each chop's blow at the end of the downstroke.
 */
export const OAR_CHOP = { period: 1.1, strike: 0.3, up: -2.75, down: -0.55, elbow: -0.3, spread: 0.14 };
/** The landed crew's two-handed oar chop `t` s after the landing (spec at OAR_CHOP). Returns true when this step is a chop's blow (end of a downstroke). */
export function swingLongshipCrew(body: ArticulatedBody, t: number, dt = 0): boolean {
  const C = OAR_CHOP;
  const crew = longshipCrewOf(body);
  if (!crew) return false;
  const phase = (t % C.period) / C.period;
  // 0 -> strike: the downstroke, eased in; strike -> 1: raised back up
  const down = phase < C.strike ? Math.sin((phase / C.strike) * Math.PI / 2) : 1 - (phase - C.strike) / (1 - C.strike);
  const pitch = C.up + (C.down - C.up) * down;
  for (const man of crew) {
    if (!man.landed) continue;
    man.body.leftShoulder.rotation.set(pitch, 0, -C.spread);
    man.body.rightShoulder.rotation.set(pitch, 0, C.spread);
    man.body.leftElbow.rotation.set(C.elbow, 0, 0);
    man.body.rightElbow.rotation.set(C.elbow, 0, 0);
  }
  const before = ((t - dt) % C.period) / C.period;
  return dt > 0 && t - dt >= 0 && before < C.strike && phase >= C.strike;
}

/** The landed oarsmen's world feet, for the sim's oar blows (empty while they are aboard). */
export function landedOarsmenAt(body: ArticulatedBody): Vector3[] {
  return (longshipCrewOf(body) ?? []).filter((m) => m.landed).map((m) => { m.body.root.computeWorldMatrix(true); return m.body.root.getAbsolutePosition().clone(); });
}

/*
 * The chariot (264; units/legacy.chariot). Spec, read off the reference: a big natural-coated horse (a pale mauve-tan hide, not the team colour) at full
 * gallop drawing a two-wheeled car on a pair of shafts. Horse: a long barrel about 1.7 m long and a man's shoulder high at the withers, a thick neck rising
 * forward at about 55 degrees to a long head pointing forward and down, a dark maroon muzzle, a big white eye with a black pupil on each side, two tall ears,
 * a dark ragged mane along the top of the neck and a dark tail cocked up and back; legs long and tapered to dark hooves, in a gallop: the near fore lifted and
 * folded, the far fore reaching, the hinds driving back. An orange collar strap round its chest, the shafts running from it back to the car. Car: a D-shaped
 * team-coloured box, curved front, open back, its rim at the driver's hips, a gold band round the rim; two wheels about two thirds of the withers high,
 * spoked, either side of it; the driver standing in it.
 *   Horse barrel centre CHARIOT_HORSE (y, z), radii HORSE_BARREL; legs off shoulder/hip points through a knee to a hoof (CHARIOT_GALLOP); car centred at
 *   CHARIOT_CAR_Z, floor CHARIOT_FLOOR high, rim CHARIOT_RIM high, CHARIOT_CAR_WIDE across; wheels CHARIOT_WHEEL across with CHARIOT_SPOKES spokes; driver
 *   a scale-0.46 operator scaled CHARIOT_DRIVER (a man of the line's height). The whole rig sits CHARIOT_SHIFT back so the unit centre is mid-length.
 */
const CHARIOT_HIDE = new Color3(0.74, 0.5, 0.4);
const CHARIOT_DARK = new Color3(0.2, 0.11, 0.11);
const CHARIOT_MUZZLE = new Color3(0.36, 0.14, 0.15);
const CHARIOT_STRAP = new Color3(0.95, 0.52, 0.14);
const CHARIOT_GOLD = new Color3(0.95, 0.66, 0.16);
const CHARIOT_HORSE = { y: 1.22, z: 1.0 };
const HORSE_BARREL = new Vector3(0.6, 0.72, 1.7);
const CHARIOT_CAR_Z = -1.1;
const CHARIOT_FLOOR = 0.56;
const CHARIOT_RIM = 1.2;
const CHARIOT_CAR_WIDE = 0.92;
const CHARIOT_WHEEL = 0.92;
const CHARIOT_SPOKES = 6;
const CHARIOT_DRIVER = 2.3;
const CHARIOT_SHIFT = -0.5;
// Gallop: [side, shoulder or hip (y, z off the barrel centre), knee (y, z), hoof (y, z)]; +x is the near fore lifted
const CHARIOT_GALLOP: [number, [number, number], [number, number], [number, number]][] = [
  [1, [1.0, 0.62], [0.72, 0.98], [0.42, 0.86]],
  [-1, [1.0, 0.62], [0.55, 0.82], [0.06, 1.02]],
  [1, [1.08, -0.6], [0.55, -0.95], [0.06, -1.2]],
  [-1, [1.08, -0.6], [0.52, -0.78], [0.06, -0.5]],
];
function buildChariot(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("chariot_root", scene);
  const rig = new TransformNode("chariot_rig", scene);
  rig.parent = root;
  rig.position.z = CHARIOT_SHIFT;
  const allMeshes: Mesh[] = [];
  const lit = (c: Color3, glow: number) => getMaterialFactory().get("cloth", c, { emissive: c.scale(glow) });
  const teamPrimary = makeMat(scene, color);
  const teamDark = makeMat(scene, darken(color, 0.3));
  const hide = lit(CHARIOT_HIDE, 0.16);
  const dark = lit(CHARIOT_DARK, 0.05);
  const muzzleMat = lit(CHARIOT_MUZZLE, 0.1);
  const strap = lit(CHARIOT_STRAP, 0.2);
  const gold = lit(CHARIOT_GOLD, 0.22);
  const white = lit(new Color3(0.95, 0.95, 0.93), 0.3);
  const add = (mesh: Mesh, material: Mesh["material"], flat = true): Mesh => {
    mesh.parent = rig;
    mesh.material = material;
    if (flat) mesh.convertToFlatShadedMesh();
    allMeshes.push(mesh);
    return mesh;
  };
  // A tapered limb from a to b, its foot dA across at a and dB at b, squashed to `wide` across its side
  const seg = (name: string, a: Vector3, b: Vector3, dA: number, dB: number, material: Mesh["material"], wide = 1): Mesh => {
    const span = b.subtract(a);
    const mesh = MeshBuilder.CreateCylinder(name, { height: span.length(), diameterBottom: dA, diameterTop: dB, tessellation: 6 }, scene);
    mesh.position.copyFrom(a.add(b).scale(0.5));
    mesh.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), span.normalize(), new Quaternion());
    mesh.scaling.x = wide;
    return add(mesh, material);
  };
  const H = (x: number, y: number, z: number) => new Vector3(x, y, CHARIOT_HORSE.z + z);

  // Horse: barrel, a deeper chest and a rounded rump, so the body is not a box
  const barrel = add(MeshBuilder.CreateSphere("chariotHorseBarrel", { diameterX: HORSE_BARREL.x, diameterY: HORSE_BARREL.y, diameterZ: HORSE_BARREL.z, segments: 7 }, scene), hide);
  barrel.position.set(0, CHARIOT_HORSE.y, CHARIOT_HORSE.z);
  const chest = add(MeshBuilder.CreateSphere("chariotHorseChest", { diameterX: 0.6, diameterY: 0.76, diameterZ: 0.66, segments: 6 }, scene), hide);
  chest.position.copyFrom(H(0, CHARIOT_HORSE.y + 0.04, 0.62));
  const rump = add(MeshBuilder.CreateSphere("chariotHorseRump", { diameterX: 0.62, diameterY: 0.72, diameterZ: 0.7, segments: 6 }, scene), hide);
  rump.position.copyFrom(H(0, CHARIOT_HORSE.y + 0.08, -0.6));
  // Neck up and forward, head long, forward and down, the dark muzzle at its end
  const withers = H(0, CHARIOT_HORSE.y + 0.18, 0.6);
  const poll = H(0, CHARIOT_HORSE.y + 1.0, 1.08);
  const muzzle = H(0, CHARIOT_HORSE.y + 0.58, 1.66);
  seg("chariotHorseNeck", withers, poll, 0.56, 0.32, hide, 0.7);
  seg("chariotHorseHead", poll, muzzle, 0.36, 0.3, hide, 0.82);
  const nose = add(MeshBuilder.CreateSphere("chariotHorseMuzzle", { diameterX: 0.26, diameterY: 0.3, diameterZ: 0.24, segments: 4 }, scene), muzzleMat);
  nose.position.copyFrom(muzzle);
  for (const side of [-1, 1]) {
    seg("chariotHorseEar", H(side * 0.08, CHARIOT_HORSE.y + 1.1, 1.04), H(side * 0.13, CHARIOT_HORSE.y + 1.4, 0.94), 0.13, 0.02, hide);
    const eye = add(MeshBuilder.CreateSphere("chariotHorseEye", { diameter: 0.13, segments: 6 }, scene), white, false);
    eye.position.copyFrom(H(side * 0.14, CHARIOT_HORSE.y + 0.9, 1.25));
    const pupil = add(MeshBuilder.CreateSphere("chariotHorsePupil", { diameter: 0.065, segments: 4 }, scene), dark, false);
    pupil.position.copyFrom(H(side * 0.195, CHARIOT_HORSE.y + 0.9, 1.27));
  }
  // Mane: a dark ragged crest along the top of the neck, poll to withers, in tufts; tail cocked up and back off the rump
  for (let i = 0; i < 5; i++) {
    const at = Vector3.Lerp(poll, withers, i / 4).add(new Vector3(0, 0.14, -0.16));
    seg("chariotHorseMane", at, at.add(new Vector3(0, 0.26 - 0.03 * i, -0.16)), 0.22, 0.05, dark, 0.6);
  }
  const tailRoot = H(0, CHARIOT_HORSE.y + 0.26, -0.92);
  const tailBend = tailRoot.add(new Vector3(0, 0.32, -0.32));
  seg("chariotHorseTail", tailRoot, tailBend, 0.14, 0.2, dark, 0.55);
  seg("chariotHorseTail", tailBend, tailBend.add(new Vector3(0, 0.1, -0.45)), 0.2, 0.04, dark, 0.55);
  // Legs: thigh or forearm, cannon, dark hoof
  for (const [side, top, knee, hoof] of CHARIOT_GALLOP) {
    const x = side * 0.17;
    const a = H(x, top[0], top[1]), k = H(x, knee[0], knee[1]), f = H(x, hoof[0], hoof[1]);
    seg("chariotHorseLeg", a, k, 0.26, 0.14, hide);
    seg("chariotHorseLeg", k, f, 0.13, 0.1, hide);
    seg("chariotHorseHoof", f, f.add(f.subtract(k).normalize().scale(0.1)), 0.14, 0.12, dark);
  }
  // Harness: an orange strap round the chest just behind the forelegs, and the two shafts from it back to the car
  const collar = add(MeshBuilder.CreateTorus("chariotCollar", { diameter: 0.66, thickness: 0.09, tessellation: 10 }, scene), strap);
  collar.rotation.x = Math.PI / 2;
  collar.scaling.set(1, 1, 1.18);
  collar.position.copyFrom(H(0, CHARIOT_HORSE.y, 0.36));
  for (const side of [-1, 1]) {
    const tip = H(side * 0.34, CHARIOT_HORSE.y - 0.08, 0.36);
    seg("chariotShaft", new Vector3(side * 0.32, CHARIOT_FLOOR + 0.12, CHARIOT_CAR_Z + 0.42), tip, 0.08, 0.07, teamDark);
    const knob = add(MeshBuilder.CreateSphere("chariotShaftKnob", { diameter: 0.13, segments: 3 }, scene), strap);
    knob.position.copyFrom(tip);
  }

  // Car: a floor, a curved team-coloured front (a half cylinder, its arc on -z, turned to the horse), two side boards, a gold band round the rim
  const floor = add(MeshBuilder.CreateBox("chariotFloor", { width: CHARIOT_CAR_WIDE, height: 0.08, depth: 0.78 }, scene), teamDark);
  floor.position.set(0, CHARIOT_FLOOR, CHARIOT_CAR_Z - 0.06);
  const wallTall = CHARIOT_RIM - CHARIOT_FLOOR;
  const front = add(MeshBuilder.CreateCylinder("chariotCart", { height: wallTall, diameter: CHARIOT_CAR_WIDE, arc: 0.5, tessellation: 12, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, scene), teamPrimary);
  front.rotation.y = Math.PI;
  front.scaling.z = 0.9;
  front.position.set(0, CHARIOT_FLOOR + wallTall / 2, CHARIOT_CAR_Z);
  const band = add(MeshBuilder.CreateCylinder("chariotRim", { height: 0.08, diameter: CHARIOT_CAR_WIDE + 0.05, arc: 0.5, tessellation: 12, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, scene), gold);
  band.rotation.y = Math.PI;
  band.scaling.z = 0.9;
  band.position.set(0, CHARIOT_RIM - 0.02, CHARIOT_CAR_Z);
  for (const side of [-1, 1]) {
    const board = add(MeshBuilder.CreateBox("chariotSide", { width: 0.05, height: wallTall * 0.7, depth: 0.36 }, scene), teamPrimary);
    board.position.set(side * (CHARIOT_CAR_WIDE / 2 - 0.02), CHARIOT_FLOOR + wallTall * 0.35, CHARIOT_CAR_Z - 0.2);
  }
  // Wheels either side: a dark team rim on spokes round a gold hub, on one axle
  const axleY = CHARIOT_WHEEL / 2;
  const axle = add(MeshBuilder.CreateCylinder("chariotAxle", { height: CHARIOT_CAR_WIDE + 0.36, diameter: 0.08, tessellation: 6 }, scene), teamDark);
  axle.rotation.z = Math.PI / 2;
  axle.position.set(0, axleY, CHARIOT_CAR_Z - 0.1);
  for (const side of [-1, 1]) {
    const x = side * (CHARIOT_CAR_WIDE / 2 + 0.12);
    const rim = add(MeshBuilder.CreateTorus("chariotWheel", { diameter: CHARIOT_WHEEL - 0.08, thickness: 0.09, tessellation: 14 }, scene), teamDark);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(x, axleY, CHARIOT_CAR_Z - 0.1);
    const hub = add(MeshBuilder.CreateCylinder("chariotHub", { height: 0.16, diameter: 0.17, tessellation: 8 }, scene), gold);
    hub.rotation.z = Math.PI / 2;
    hub.position.copyFrom(rim.position);
    for (let i = 0; i < CHARIOT_SPOKES; i++) {
      const spoke = add(MeshBuilder.CreateBox("chariotSpoke", { width: 0.04, height: CHARIOT_WHEEL - 0.12, depth: 0.05 }, scene), teamPrimary);
      spoke.rotation.x = (i / CHARIOT_SPOKES) * Math.PI;
      spoke.position.copyFrom(rim.position);
    }
  }

  // The driver standing in the car, arms out to the reins
  const stand = new TransformNode("chariotDriverStand", scene);
  stand.parent = rig;
  stand.scaling.setAll(CHARIOT_DRIVER);
  stand.position.set(0, CHARIOT_FLOOR + 0.04, CHARIOT_CAR_Z - 0.12);
  const operator = addOperator(scene, stand, allMeshes, 0, 0, 0, color, (driver) => {
    driver.leftShoulder.rotation.x = -0.9;
    driver.rightShoulder.rotation.x = -0.9;
    driver.leftElbow.rotation.x = -0.4;
    driver.rightElbow.rotation.x = -0.4;
  });
  const headTopY = stand.position.y + operator.headTopY * CHARIOT_DRIVER;

  return wrapAsBody(
    scene,
    root,
    front,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(headTopY, 0.92, 0.6, headTopY * 0.6),
    { impactOrigin: makeSocket(scene, root, "chariot_impact_socket", new Vector3(0, CHARIOT_HORSE.y, CHARIOT_HORSE.z + CHARIOT_SHIFT + 0.9)) },
  );
}

const MAMMOTH_SCALE = 1.8;

/*
 * The mammoth's hide (tribal.mammoth.blue.png, card Appearance: "covered in thick brown hair"): a warm dark brown, the same on both teams, its body one lumpy
 * faceted fur mass (MAMMOTH_FUR.jitter of each vertex in or out); the team colour is only paint (brow, tusk tips), never the coat. Self-lit MAMMOTH_FUR.glow so
 * the faces turned from the sun stay brown in the capture's shade; the shaggy pieces (hump, ridge, hem, cuffs, ears) MAMMOTH_FUR.shag of the way to near-black.
 */
const MAMMOTH_HIDE = new Color3(0.34, 0.17, 0.1);
const MAMMOTH_FUR = { jitter: 0.06, glow: 0.1, shag: 0.25 };
/*
 * The mane (tribal.mammoth.red.png, card Appearance: "a majestic wood-brown mane"): one shaggy dark-brown mass from the brow back over the crown and the nape
 * toward the hump, not a smooth cap: the forehead pad, the crest behind it and the three crown tufts are flat-faced balls with every vertex pushed in or out by
 * MAMMOTH_MANE.jitter, and MAMMOTH_MANE.locks ragged four-sided locks hang off the crest's back and sides, MAMMOTH_MANE.long long, tips down and out.
 * MAMMOTH_MANE_COLOR, self-lit MAMMOTH_MANE.glow so it stays brown, darker than the coat.
 */
const MAMMOTH_MANE = { jitter: 0.2, locks: 7, long: 0.42, glow: 0.12 };
const MAMMOTH_MANE_COLOR = new Color3(0.09, 0.055, 0.04);
/*
 * [S] the mane as one crest (378; tribal.mammoth.red.png, .jpg: a near-black shaggy crest rising from the brow, running over the crown and down the nape onto
 * the shoulders, swept back, no brim and no knob; critic 377: a mid-brown flat cap with a brim over the brow and a bun knob). It replaces the forehead dome
 * (the brim) and the three crown tufts (the bun) on the mammoth; the sacred elephant shaves them all the same. MAMMOTH_CREST.chunks: [y, z, half-width,
 * half-height, half-length, tilt back] in neck units (head centre (0, 0, .25), .7 tall), flat-faced jittered balls overlapping along the centre line,
 * the brow's narrow and pitched down, the crown's widest and highest, the nape's long and lying on the hull's top; MAMMOTH_MANE_COLOR now near-black.
 */
/*
 * [S] the head as a great dome (379; tribal.mammoth.red.png: the head the highest thing on him, a dome about as tall as the front of the body, the crest on
 * its crown, the googly eye set high on it; critic 378: head a third of the body's height, tucked under the front, its crown below the hull behind it, eye
 * mid-face). The head and everything that rides it (crest, mane locks, eyes, ears, face paint) hang off a skull node on the neck whose origin is the
 * head's centre (0, 0, .25): raised MAMMOTH_DOME.lift and grown .grow; the eyes .eyeUp higher on it and .eyeOut further out onto its skin. Trunk and
 * tusks stay on the neck, rooted inside the bigger face. The sacred elephant keeps its head.
 */
const MAMMOTH_DOME = { lift: 0.32, grow: 1.28, eyeUp: 0.12, eyeOut: 0.03 };
const MAMMOTH_DOME_PARTS = new Set(["head", "crest", "maneLock", "eye", "pupil", "facePaint", "ear"]);
/*
 * [S] the crest laid on the dome (380; tribal.mammoth.red.png: a near-black mane lying on the crown, from the brow over the top and down the back of the
 * head to the nape, hugging the skull, no wider than it; critic 379: the crest a huge black cap wider than the dome riding on top like a beret, its
 * chunks at .62-.92 up with the head's top at .7, then grown with the skull). Each chunk sits on the head's own ellipsoid (MAMMOTH_CREST.head: the half
 * height and half depth of the head sphere as scaled), on the centre line at pitch phi rad from straight up (minus toward the brow, plus back toward the
 * nape), its middle .sink of its thickness out from the skin and its flat face laid along the skin: [phi, half-width, half-thickness, half-length].
 */
const MAMMOTH_CREST = {
  head: [0.7, 0.56] as [number, number],
  sink: 0.35,
  chunks: [
    [-0.7, 0.26, 0.1, 0.18], [-0.35, 0.34, 0.12, 0.22], [0.05, 0.38, 0.13, 0.24], [0.45, 0.38, 0.13, 0.24],
    [0.85, 0.36, 0.12, 0.24], [1.25, 0.32, 0.11, 0.22], [1.65, 0.26, 0.1, 0.2],
  ] as [number, number, number, number][],
};
/*
 * Ankle bands (TABS blue render): on each leg, a hand above the foot, two thin team-colour stripes close together round the pillar and under them a
 * ring of round team dots, all flat paint on the brown fur. In knee space (lower leg 0.6 across, foot at -0.4): ANKLE_BAND.stripes the stripes'
 * heights, .stripeTall their height, .wide their diameter (just proud of the leg), .dots dots at .dotAt, .dot across, .dotOut from the leg's axis.
 */
/** The mammoth's face marking: the band's path on the head as (yaw off the front, pitch up) per side, forehead first; strips per stretch; band width
 * (neck units, the head is 1.4 across), share it narrows by the trunk, paint thickness; the trunk pieces (of 8) that carry a dot, and the dot's size. */
const FACE_PAINT = {
  path: [[0.95, 0.56], [0.57, 0.37], [0.5, -0.05], [0.42, -0.3]] as [number, number][],
  steps: 3, wide: 0.17, taper: 0.3, thick: 0.03, trunkDots: [1, 3, 5], dot: 0.12,
};
const ANKLE_BAND = { stripes: [-0.17, -0.25], stripeTall: 0.035, wide: 0.61, dots: 8, dotAt: -0.33, dot: 0.11, dotOut: 0.29, dotFlat: 0.2 };
/*
 * [S] the mammoth's legs (363; tribal.mammoth.blue.png: stubby pillars of the same lumpy brown fur as the body, thick where they leave it and narrowing a
 * little to the ankle, the foot flaring just a touch and ending flat in the fur colour; two team stripes and a ring of team dots painted flush round the
 * ankle). Replaces the octagonal drums (a fur cuff hoop, two posts, a black sole cap) whose stripes stood proud as raised hoops (critic 360).
 *   - each leg two lathes of MAMMOTH_LEG.sides sides in the fur, the thigh on the hip joint from .top over it down past the knee and the shin on the knee
 *     joint to the sole; radii (neck units) read down the profiles .thigh and .shin as [radius, y]; every vertex jittered .jitter (the coat's lumps);
 *   - paint (the shin unjittered so it stays flush): each ANKLE_BAND stripe a ring at its height, .proud over the surface and ANKLE_BAND.stripeTall high; the dots flat
 *     discs laid on the surface at ANKLE_BAND.dotAt, turned to face out.
 * [S] 372 tapering legs and a flared foot (critic: fat straight drums as wide as the head; tribal.mammoth.blue.png: stubby legs about half the body's depth,
 * tapering from the hull to the ankle, ending in a slightly flared foot). The thigh narrows from its dome (.thigh) and the shin keeps narrowing to the
 * ankle at .ankle; below it a separate foot lathe (.foot, its own jitter .footJitter so it reads as a pad) flares out to the flat sole.
 */
const MAMMOTH_LEG = {
  sides: 9, jitter: 0.035, proud: 1.012, ankle: -0.34, footJitter: 0.02,
  // the top a fur dome rising into the hull (366), not a flat cut
  thigh: [[0.14, 0.46], [0.25, 0.36], [0.31, 0.2], [0.305, 0.06], [0.29, -0.05], [0.265, -0.3], [0.245, -0.5]] as [number, number][],
  shin: [[0.245, 0.06], [0.23, -0.1], [0.215, -0.26], [0.205, -0.34]] as [number, number][],
  foot: [[0.205, -0.33], [0.215, -0.37], [0.245, -0.41], [0.255, -0.43]] as [number, number][],
  // the fur collar where the leg leaves the hull (375): a jittered ring round the thigh, [radius, y] from its foot to its top, hip-joint units
  collar: [[0.28, -0.36], [0.35, -0.3], [0.37, -0.2], [0.33, -0.1]] as [number, number][], collarJitter: 0.045,
};
/*
 * [S] the mammoth's barrel body (365; tribal.mammoth.red.png, .jpg, card "a big round belly"). Spec read off the renders: one rounded faceted barrel of
 * small facets, fuller than an egg (flat-ish flanks, round ends), a touch taller than wide, its underside sagging into a round belly between the legs, the
 * back line rising to a shoulder hump just behind the head and falling away to a round rump; the dark mane sits on top in front of the hump. It replaces the
 * 4-segment ellipsoid with a stuck-on hump sphere, back ridge and hem lobes, which read as flat boxy slabs (critic 360).
 *   - MAMMOTH_BARREL.rings rings of .sides sides along the body from rump to chest, .long either side of the middle; each ring an ellipse .wide by .tall
 *     shrunk by s(t) = (1 - |t|^.full)^(1/2) toward the ends (full > 2: barrel, not egg);
 *   - the top of each ring raised by .hump, peaking .humpAt of the way forward (skewed, 366); its foot lowered by .belly x (1 - t^2) (the belly);
 *   - every vertex jittered .jitter (the coat's lumps, as the legs), flat-shaded with the rest of the rig.
 * [S] the hump set back and the hull full over the leg roots (366; tribal.mammoth.red.png: the back highest just behind the mane and sloping away to the
 * rump; the legs grow out of the body under the fur; critic 365: from the side the back ran straight from the mane to the rump, and the legs' flat drum tops
 * stood clear of the hull where it narrows). The hump is skewed: it rises over .humpFront behind the mane and falls over .humpBack to the rump, peaking
 * .humpAt; the lower half of the rings bulges .haunch wider about the leg stations (|t| = .legAt, width .legSpread), so the flank runs over the leg roots;
 * the thighs end in a fur dome up into the hull (MAMMOTH_LEG.thigh's top), not a flat cut.
 * [S] the hull's lower half as one fur skirt over the leg tops (374; tribal.mammoth.red.png: the flank's fur hangs straight down over the leg roots and
 * stops in one hem line, no thigh top shows; critic 372: an egg-round underside curved in under the flank and in toward chest and rump, so the thigh
 * domes stood out in front of and below it; the 367 hem of separate lobes read as boulders). Below the waterline each ring is squared: its width goes
 * as |sin|^.skirtSquare (a flank that hangs plumb, then turns under), its end-taper eases with the steeper .skirtFull (the lower hull stays full out
 * past the front and back legs), and over the leg stations (|t| = .legAt, width .legSpread) the flank's foot hangs .skirtDrop lower, its hem.
 * [S] a round belly over legs that show (375; tribal.mammoth.red.png, .blue.png: the underside is round, sagging between the front and back legs, and
 * the legs show for about two thirds of the body's depth, slimmer than the head; critic 374: the squared skirt hung plumb to a straight hem and left the
 * legs as stubs a third of the body's depth). The lower rings are round again (no .skirtSquare, no .skirtDrop): the hull's foot over the legs rises from
 * ~1.07 to ~.77 below its middle; the belly sags .belly between the legs, as exp(-(t/.bellyNarrow)^2), so it is round and lowest mid-body. Each leg
 * leaves the hull through a jittered fur collar (MAMMOTH_LEG.collar), so no thigh dome shows under the flank.
 * [S] the topline falls from the head to the rump (378; tribal.mammoth.red.png, .jpg, factions/tribal.jpg: the domed head and its mane are the summit, the
 * back highest just behind them and sloping down to a lower, smaller rump; critic 377: the egg hull peaked over the mid-back, above the head). The hump
 * moves forward to just behind the head (.humpAt .5) and drops to .hump .2, so the mane tops it; the upper half of every ring is scaled 1 + .slope x t
 * (taller at the chest, lower at the rump: the back's top about .95 under the mane, under .6 over the rump; .25 read level, look 378), and the whole ring 1 + .slopeWide x t (a smaller rump).
 */
const MAMMOTH_BARREL = {
  rings: 13, sides: 14, long: 1.24, wide: 0.86, tall: 0.7, full: 2.8, hump: 0.2, humpAt: 0.5, humpFront: 0.25, humpBack: 0.8, belly: 0.2, bellyNarrow: 0.38,
  jitter: 0.035, haunch: 0.26, legAt: 0.44, legSpread: 0.32, skirtFull: 5, slope: 0.45, slopeWide: 0.15,
};
/** The mammoth's tail on the torso joint: path [y, z] root to tip (root sunk in the rump's back face at y .12-.25, z -1.24), thickness per point. */
const MAMMOTH_TAIL = {
  path: [[0.2, -1.22], [0.12, -1.38], [-0.04, -1.47], [-0.24, -1.5], [-0.42, -1.5]] as [number, number][],
  thick: [0.13, 0.1, 0.08, 0.065, 0.055], overlap: 0.04, tuftBalls: 4, tuft: 0.065, tuftOut: 0.035, tuftDrop: 0.07,
};
/** The mammoth's barrel hull (spec at MAMMOTH_BARREL), its vertices about its own origin. */
function mammothBarrel(scene: Scene): Mesh {
  const B = MAMMOTH_BARREL;
  const pos: number[] = [], idx: number[] = [];
  const ring = (t: number): number[] => {
    const s = Math.sqrt(Math.max(0, 1 - Math.abs(t) ** B.full));
    const spread = t < B.humpAt ? B.humpBack : B.humpFront;
    const hump = B.hump * Math.exp(-(((t - B.humpAt) / spread) ** 2)) * s;
    const atLeg = Math.exp(-(((Math.abs(t) - B.legAt) / B.legSpread) ** 2));
    const haunch = 1 + B.haunch * atLeg;
    // the lower hull's own end-taper, steeper, so it stays full out over the front and back legs (374)
    const sLow = Math.sqrt(Math.max(0, 1 - Math.abs(t) ** B.skirtFull));
    // the topline sloping from the chest down to a smaller rump (378)
    const rise = 1 + B.slope * t, narrow = 1 + B.slopeWide * t;
    const out: number[] = [];
    for (let k = 0; k < B.sides; k++) {
      const a = (k / B.sides) * Math.PI * 2;
      const c = Math.cos(a), sn = Math.sin(a);
      if (c >= 0) {
        out.push(B.wide * s * sn * narrow, (B.tall * s * rise + hump) * c, t * B.long);
        continue;
      }
      // below the middle: the flank swells over the leg roots, easing in from the waterline, and rounds under into the belly (375)
      // (the steeper taper eased in from the waterline, so no ledge where the halves meet)
      const sl = s + (sLow - s) * Math.min(1, -c * 1.5);
      const wide = B.wide * sl * (1 + (haunch - 1) * Math.min(1, -c * 2));
      const x = wide * sn * narrow;
      const up = (B.tall * sl + B.belly * Math.exp(-((t / B.bellyNarrow) ** 2)) * sl) * c;
      out.push(x, up, t * B.long);
    }
    return out;
  };
  // the rump and chest points, the rings between them at cosine spacing (closer at the round ends)
  pos.push(0, 0, -B.long);
  for (let r = 1; r < B.rings - 1; r++) pos.push(...ring(-Math.cos((r / (B.rings - 1)) * Math.PI)));
  pos.push(0, 0, B.long);
  const last = 1 + (B.rings - 2) * B.sides;
  // wound so the faces look out (374: the 365 winding faced them in, so the camera saw the far wall's inside and the thigh tops inside the hull
  // drew in front of the near flank)
  for (let k = 0; k < B.sides; k++) {
    const k1 = (k + 1) % B.sides;
    idx.push(0, 1 + k1, 1 + k);
    for (let r = 0; r < B.rings - 3; r++) {
      const a = 1 + r * B.sides, b = a + B.sides;
      idx.push(a + k, b + k1, b + k, a + k, a + k1, b + k1);
    }
    const a = 1 + (B.rings - 3) * B.sides;
    idx.push(a + k, a + k1, last);
  }
  const m = new Mesh("torso", scene);
  const data = new VertexData();
  data.positions = pos;
  data.indices = idx;
  const normals: number[] = [];
  VertexData.ComputeNormals(pos, idx, normals);
  data.normals = normals;
  data.applyToMesh(m, true);
  jitterVertices(m, B.jitter, 41.7);
  return m;
}
/*
 * [S] the mammoth's trunk (365; tribal.mammoth.red.png, .jpg: one long thick trunk in the body's own brown, as wide at the face as the gap between the eyes,
 * reaching forward and down to the ground, its end a blunt flared snout with a dark opening; team dots painted flat on its sides). It replaces eight
 * near-black cylinder pieces ending well above the ground with raised paint knobs (critic 360).
 *   - one tube on the neck from MAMMOTH_TRUNK.root (neck frame) along .pitch (each piece's tilt from straight down, + forward), pieces .piece long; radius
 *     .rootR easing to .tipR, the last point flared to .flare; the snout's opening a dark disc .hole of the end across;
 *   - returns its pieces' centres and radii, where the face paint lays its dots (FACE_PAINT.trunkDots).
 */
const MAMMOTH_TRUNK = { root: [0, -0.12, 0.74], pitch: [0.75, 0.55, 0.4, 0.3, 0.25, 0.3, 0.5, 0.9], piece: 0.21, rootR: 0.25, tipR: 0.13, flare: 0.16, hole: 0.62 };
/** The mammoth's trunk (spec at MAMMOTH_TRUNK). */
function mammothTrunk(scene: Scene, neck: TransformNode, fur: Material, dark: Material, allMeshes: Mesh[]): { centre: Vector3; radius: number }[] {
  const T = MAMMOTH_TRUNK;
  const path = [new Vector3(T.root[0], T.root[1], T.root[2])];
  for (const p of T.pitch) path.push(path[path.length - 1].add(new Vector3(0, -Math.cos(p) * T.piece, Math.sin(p) * T.piece)));
  const n = path.length - 1;
  const radius = (i: number): number => (i >= n ? T.flare : T.rootR + (T.tipR - T.rootR) * (i / (n - 1)));
  const tube = MeshBuilder.CreateTube("trunk", { path, radiusFunction: (i) => radius(i), tessellation: 10, cap: Mesh.CAP_ALL }, scene);
  tube.parent = neck; tube.material = fur; allMeshes.push(tube);
  const dir = path[n].subtract(path[n - 1]).normalize();
  const hole = MeshBuilder.CreateCylinder("trunkTip", { height: 0.02, diameter: T.flare * 2 * T.hole, tessellation: 10 }, scene);
  hole.position = path[n].add(dir.scale(0.012));
  hole.rotation = Vector3.RotationFromAxis(Vector3.Cross(dir, Vector3.Right()).normalize(), dir, Vector3.Right());
  hole.parent = neck; hole.material = dark; allMeshes.push(hole);
  return path.slice(0, n).map((p, i) => ({ centre: Vector3.Center(p, path[i + 1]), radius: (radius(i) + radius(i + 1)) / 2 }));
}
/*
 * [S] the mammoth's ears (367; tribal.mammoth.red.png, card "a pair of small flappy ears": a small rounded fur flap on each side of the head just behind and
 * above the eye, about a third of the head high, its back edge standing out from the skull; critic 360/366: none visible: the old fans sat edge-on at the back
 * of the head inside the hull). Spec in neck units (the head 1.4 high, centred .25 ahead):
 *   - each ear a jittered faceted flap MAMMOTH_EAR.tall high, .long front to back, .thick thick, its middle at (.out, .y, .z) on the head's side;
 *   - swung .flare rad about the vertical so its front edge tucks into the skull and its back edge stands well out, drooped .droop rad, in the darker
 *     shaggy fur so it reads against the head (in the coat's own fur it lay flush and vanished).
 */
const MAMMOTH_EAR = { tall: 0.48, long: 0.42, thick: 0.15, out: 0.62, y: 0.12, z: 0.3, flare: 1.05, droop: 0.15, jitter: 0.12 };
/** The mammoth's ears (spec at MAMMOTH_EAR). */
function mammothEars(scene: Scene, neck: TransformNode, fur: Material, allMeshes: Mesh[]): void {
  const E = MAMMOTH_EAR;
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateIcoSphere("ear", { radius: 1, subdivisions: 1, flat: true }, scene);
    jitterVertices(ear, E.jitter, 71.3 + side, E.thick * 0.5, E.tall * 0.5, E.long * 0.5);
    ear.rotation.set(0, -side * E.flare, side * E.droop);
    ear.position.set(side * E.out, E.y, E.z);
    ear.parent = neck; ear.material = fur; allMeshes.push(ear);
  }
}
/*
 * [S] the mammoth's tusk paint (366; tribal.mammoth.blue.png: dull bone-tan tusks, not glowing ivory; from the tip back a team-coloured tip about a quarter of
 * the tusk, a short bare tan gap, a thin team stripe round the tusk, then tan to the root). The tusk's pieces are MAMMOTH_TUSK.tan, self-lit only .glow;
 * the last .tip pieces of each are the team tip; .gap pieces short of the tip a team ring .stripe of that piece long and .proud of its girth across
 * sits at the piece's root. The sacred elephant keeps its own ivory tusks (two-piece tips, no stripe).
 */
const MAMMOTH_TUSK = { tan: new Color3(0.8, 0.6, 0.36), glow: 0.14, tip: 3, gap: 1, stripe: 0.45, proud: 1.08 };
/** Radius of a lathe profile at height y (linear between its points). */
function profileAt(profile: [number, number][], y: number): number {
  for (let i = 0; i < profile.length - 1; i++) {
    const [r0, y0] = profile[i], [r1, y1] = profile[i + 1];
    if (y <= y0 && y >= y1) return r0 + (r1 - r0) * ((y0 - y) / (y0 - y1 || 1));
  }
  return profile[y > profile[0][1] ? 0 : profile.length - 1][0];
}
/** One mammoth leg (spec at MAMMOTH_LEG): the fur thigh and shin lathes, the flush ankle stripes and dots. */
function mammothLeg(scene: Scene, hipJoint: TransformNode, kneeJoint: TransformNode, fur: Material, paint: Material, allMeshes: Mesh[], serial: number): void {
  const L = MAMMOTH_LEG;
  const lathe = (name: string, profile: [number, number][], parent: TransformNode, seed: number, jitter = L.jitter) => {
    const top = profile[0][1], foot = profile[profile.length - 1][1];
    // wound from the sole up: a lathe drawn top-down faces its normals inward and the leg reads near-black
    const shape = [new Vector3(0, top, 0), ...profile.map(([r, y]) => new Vector3(r, y, 0)), new Vector3(0, foot, 0)].reverse();
    const m = MeshBuilder.CreateLathe(name, { shape, tessellation: L.sides }, scene);
    if (jitter > 0) jitterVertices(m, jitter, seed);
    m.parent = parent; m.material = fur; allMeshes.push(m);
  };
  lathe("uleg", L.thigh, hipJoint, 61.3 + serial);
  // the fur collar round the thigh's top, under the hull's rounded foot (375)
  lathe("legCollar", L.collar, hipJoint, 83.1 + serial, L.collarJitter);
  lathe("lleg", L.shin, kneeJoint, 67.9 + serial, 0);
  // the flared foot under the ankle paint (372)
  lathe("lfoot", L.foot, kneeJoint, 71.3 + serial, L.footJitter);
  for (const y of ANKLE_BAND.stripes) {
    const r = profileAt(L.shin, y) * L.proud;
    const stripe = MeshBuilder.CreateCylinder("ankleStripe", { height: ANKLE_BAND.stripeTall, diameter: 2 * r, tessellation: L.sides * 2 }, scene);
    stripe.position.set(0, y, 0);
    stripe.parent = kneeJoint; stripe.material = paint; allMeshes.push(stripe);
  }
  const dotR = profileAt(L.shin, ANKLE_BAND.dotAt) * L.proud;
  for (let i = 0; i < ANKLE_BAND.dots; i++) {
    const a = (i + 0.5) / ANKLE_BAND.dots * Math.PI * 2;
    const dot = MeshBuilder.CreateCylinder("ankleDot", { height: 0.012, diameter: ANKLE_BAND.dot, tessellation: 8 }, scene);
    dot.rotation.set(Math.PI / 2, a, 0);
    dot.position.set(Math.sin(a) * dotR, ANKLE_BAND.dotAt, Math.cos(a) * dotR);
    dot.parent = kneeJoint; dot.material = paint; allMeshes.push(dot);
  }
}

function buildMammoth(scene: Scene, color: Color3, hide: Color3 = MAMMOTH_HIDE, teamTint = 0, giant = 1): ArticulatedBody {
  // The whole rig under the root scales by the unit's giant scale with its footprint and reach (unitDefinitions), so hull, legs, tusks, trunk and seats keep their proportions
  const scale = MAMMOTH_SCALE * giant;
  const root = new TransformNode("mammoth_root", scene);
  const allMeshes: Mesh[] = [];
  // The hide keeps its own colour: only the war paint is the team's. applyMaterialPreset()
  // repaints bodyMaterial/skinMaterial with the team tint, so those point at the paint.
  // Part self-lit, so the faces turned from the sun stay a brown hide and not near-black; the mammoth half as much as the sacred elephant, its plum-brown going grey with more; asked of the factory, whose plain wood is shared
  const mammoth = hide === MAMMOTH_HIDE;
  const hideLight = { emissive: hide.scale(mammoth ? MAMMOTH_FUR.glow : 0.16) };
  const fur = getMaterialFactory().get("wood", Color3.Lerp(hide, color, teamTint), hideLight);
  const shaggyFur = getMaterialFactory().get("wood", Color3.Lerp(hide, new Color3(0.08, 0.06, 0.05), mammoth ? MAMMOTH_FUR.shag : 0.45), hideLight);
  // Tusks are warm ivory and part self-lit, so the blue ambient does not grey them
  // The mammoth's are bone-tan and barely self-lit (MAMMOTH_TUSK), the elephant's stay warm ivory
  const tuskMat = mammoth
    ? getMaterialFactory().get("cloth", MAMMOTH_TUSK.tan, { emissive: MAMMOTH_TUSK.tan.scale(MAMMOTH_TUSK.glow) })
    : getMaterialFactory().get("bone", new Color3(1.0, 0.82, 0.58), { emissive: new Color3(0.22, 0.16, 0.09) });
  const darkMat = makeMat(scene, new Color3(0.25, 0.18, 0.12));
  const paintMat = getMaterialFactory().createUnique("cloth", color);

  // ── Joint hierarchy for animation ──
  // hip sits at body center; torso pivots on hip; neck pivots on torso
  // Giants are several human heights tall: scale the whole rig under the root
  const bulk = dummyJoint("m_bulk", root, scene);
  bulk.scaling.setAll(scale);
  const hip = dummyJoint("m_hip", bulk, scene);
  hip.position.set(0, 1.4, 0);
  const torso = dummyJoint("m_torso", hip, scene);
  const neck = dummyJoint("m_neck", torso, scene);
  neck.position.set(0, 0.2, 0.88);

  // Front-left leg joints
  const flHip = dummyJoint("m_fl_hip", hip, scene);
  flHip.position.set(-0.46, -0.35, 0.55);
  const flKnee = dummyJoint("m_fl_knee", flHip, scene);
  flKnee.position.set(0, -0.45, 0);

  // Front-right leg joints
  const frHip = dummyJoint("m_fr_hip", hip, scene);
  frHip.position.set(0.46, -0.35, 0.55);
  const frKnee = dummyJoint("m_fr_knee", frHip, scene);
  frKnee.position.set(0, -0.45, 0);

  // Back-left leg joints
  const blHip = dummyJoint("m_bl_hip", hip, scene);
  blHip.position.set(-0.46, -0.35, -0.55);
  const blKnee = dummyJoint("m_bl_knee", blHip, scene);
  blKnee.position.set(0, -0.45, 0);

  // Back-right leg joints
  const brHip = dummyJoint("m_br_hip", hip, scene);
  brHip.position.set(0.46, -0.35, -0.55);
  const brKnee = dummyJoint("m_br_knee", brHip, scene);
  brKnee.position.set(0, -0.45, 0);

  // ── Main body (parented to torso joint) ──
  // Spec, read off tabs_screenshot_01 (two mammoths at the charge): the body is one rounded, faceted fur mass, about as tall as it is
  // wide and half as long again, its back domed and rising to the shoulder hump; no side panels, no flat belly, no straps. Its
  // underside rounds up between the legs, so the legs show below it for about a quarter of the animal's height, each leaving the
  // body through a fur cuff. Team paint is a few round daubs on the hide (the blue dots on the head and flank), not bands.
  // So: one ellipsoid of BODY_RADII on the torso joint, raised BODY_LIFT so its underside is clear of the leg tops; a hem of fur
  // lobes round its lower flank; paint daubs laid flat on its surface.
  const BODY_RADII = new Vector3(0.85, 0.68, 1.16);
  const BODY_LIFT = 0.12;
  const BODY_BACK = -0.05;
  // [S] (365) the mammoth is one barrel hull (MAMMOTH_BARREL) with its hump and belly in it; the elephant keeps the ellipsoid
  const torsoMesh = mammoth ? mammothBarrel(scene) : MeshBuilder.CreateSphere("torso", { diameter: 2, segments: 4 }, scene);
  torsoMesh.position.set(0, BODY_LIFT, BODY_BACK);
  if (!mammoth) torsoMesh.scaling.copyFrom(BODY_RADII);
  torsoMesh.parent = torso; torsoMesh.material = fur; allMeshes.push(torsoMesh);

  // A point on the body's surface at height y and length z, on one side, and the way out of the hide there
  const onHide = (side: number, y: number, z: number): { at: Vector3; out: Vector3 } => {
    const v = (y - BODY_LIFT) / BODY_RADII.y;
    const w = (z - BODY_BACK) / BODY_RADII.z;
    const x = side * BODY_RADII.x * Math.sqrt(Math.max(0, 1 - v * v - w * w));
    const at = new Vector3(x, y, z);
    const out = new Vector3(x / BODY_RADII.x ** 2, (y - BODY_LIFT) / BODY_RADII.y ** 2, (z - BODY_BACK) / BODY_RADII.z ** 2).normalize();
    return { at, out };
  };

  // No war paint on the flank (the blue render: the coat is brown from shoulder to rump; the team colour is on the brow, the tusk tips and the legs)

  // Shaggy shoulder hump, standing well above the back line (not the mammoth: his barrel carries it)
  if (!mammoth) {
  const hump = MeshBuilder.CreateSphere("hump", { diameter: 1.6, segments: 4 }, scene);
  hump.position.set(0, 0.6, 0.4);
  hump.scaling.set(0.82, 0.82, 0.8);
  hump.parent = torso; hump.material = shaggyFur; allMeshes.push(hump);

  // Back ridge falling from the hump to the rump, so the top line slopes instead of running flat
  const ridge = MeshBuilder.CreateSphere("backRidge", { diameter: 1, segments: 3 }, scene);
  ridge.position.set(0, 0.4, -0.3);
  ridge.rotation.x = -0.32;
  ridge.scaling.set(1.15, 0.8, 1.7);
  ridge.parent = torso; ridge.material = shaggyFur; allMeshes.push(ridge);

  // Fur hem: a row of round shaggy lobes along each lower flank, set into the hide, so the side bulges out in fur and rounds
  // under instead of hanging as a straight panel; none drops below the body's underside, so the legs stay in sight
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const z = 0.7 - i * 0.36;
      const { at, out } = onHide(side, -0.32, z);
      const lobe = MeshBuilder.CreateSphere("furHem", { diameter: 0.5 - i * 0.03, segments: 3 }, scene);
      lobe.scaling.set(0.7, 0.85, 1);
      lobe.position = at.subtract(out.scale(0.08));
      lobe.parent = torso; lobe.material = shaggyFur; allMeshes.push(lobe);
    }
  }
  }

  // ── Head (parented to neck joint) ──
  const headMesh = MeshBuilder.CreateSphere("head", { diameter: 1.4, segments: 4 }, scene);
  headMesh.position.set(0, 0, 0.25);
  headMesh.scaling.set(0.85, 1, 0.8);
  headMesh.parent = neck; headMesh.material = fur; allMeshes.push(headMesh);

  // The mane (spec at MAMMOTH_MANE): the forehead pad overhanging the brow above the war paint, the crest behind it running back over the skull to the hump,
  // three fat crown tufts, all lumpy faceted fur, and ragged locks off the crest's back and sides. The sacred elephant shaves all of it (ELEPHANT_SHAVED).
  const crestMat = mammoth
    ? getMaterialFactory().get("wood", MAMMOTH_MANE_COLOR, { emissive: MAMMOTH_MANE_COLOR.scale(MAMMOTH_MANE.glow) })
    : makeMat(scene, Color3.Lerp(hide, new Color3(0.10, 0.05, 0.22), 0.75));
  const maneBall = (name: string, radii: Vector3, at: Vector3, serial: number): Mesh => {
    const m = MeshBuilder.CreateIcoSphere(name, { radius: 1, subdivisions: 2, flat: true }, scene);
    jitterVertices(m, MAMMOTH_MANE.jitter, serial, radii.x, radii.y, radii.z);
    m.position.copyFrom(at);
    m.parent = neck; m.material = crestMat; allMeshes.push(m);
    return m;
  };
  if (mammoth) {
    // [S] the crest laid on the dome (380, spec at MAMMOTH_CREST): flat chunks on the head's skin along its centre line, brow over the crown to the nape
    const [hy, hz] = MAMMOTH_CREST.head;
    MAMMOTH_CREST.chunks.forEach(([phi, w, t, l], i) => {
      const out = t * MAMMOTH_CREST.sink;
      const c = maneBall("crest", new Vector3(w, t, l), new Vector3(0, (hy + out) * Math.cos(phi), 0.25 - (hz + out) * Math.sin(phi)), 3.3 + i * 2.7);
      c.rotation.x = -phi;
    });
  } else {
    maneBall("dome", new Vector3(0.48, 0.3, 0.58), new Vector3(0, 0.52, 0.25), 3.3);
    maneBall("crest", new Vector3(0.42, 0.36, 0.56), new Vector3(0, 0.5, -0.2), 5.9);
    for (const [x, y, z, h, lean] of [[0, 0.82, 0.12, 0.55, 0.35], [-0.16, 0.72, 0.0, 0.44, 0.1], [0.16, 0.72, 0.0, 0.44, 0.1]]) {
      const tuft = maneBall("topknot", new Vector3(h * 0.5, h * 0.42, h * 0.5), new Vector3(x, y, z), 7.1 + x * 10);
      tuft.rotation.x = lean;
      tuft.rotation.z = -x * 1.6;
    }
  }
  // Ragged locks: four-sided spikes round the crest's back and sides, hanging down and out over the nape, each its own length
  for (let i = 0; i < MAMMOTH_MANE.locks; i++) {
    const a = -Math.PI * 0.75 + (i / (MAMMOTH_MANE.locks - 1)) * Math.PI * 1.5;
    const share = 0.5 + 0.5 * Math.sin(i * 12.9898 + 4.1);
    const long = MAMMOTH_MANE.long * (0.75 + 0.5 * share);
    const lock = MeshBuilder.CreateCylinder("maneLock", { height: long, diameterTop: 0.2, diameterBottom: 0.02, tessellation: 4 }, scene);
    lock.rotation.y = i * 0.7;
    lock.bakeCurrentTransformIntoVertices();
    lock.convertToFlatShadedMesh();
    const sx = Math.sin(a), cz = -Math.cos(a);
    lock.position.set(sx * 0.38, 0.38 - long * 0.35, -0.2 + cz * 0.42);
    lock.rotation.set(-cz * 0.45, 0, sx * 0.45);
    lock.parent = neck; lock.material = crestMat; allMeshes.push(lock);
  }

  // Eyes: flat discs of self-lit warm white, so the blue ambient does not grey them, kept out of the glow layer so each is a crisp disc with no halo, each turned out to lie on its side of the skull with a flat black pupil on the middle of its front
  const eyeWhite = getMaterialFactory().get("bone", new Color3(0.95, 0.95, 0.95), { emissive: new Color3(0.3, 0.28, 0.25) });
  const pupilMat = makeMat(scene, new Color3(0.03, 0.03, 0.03));
  for (const side of [-1, 1]) {
    const turn = side * 0.9;
    const eye = MeshBuilder.CreateSphere("eye", { diameter: 0.2, segments: 6 }, scene);
    eye.position.set(side * 0.36, 0.08, 0.63);
    eye.rotation.y = turn;
    eye.scaling.z = 0.3;
    eye.parent = neck; eye.material = eyeWhite; allMeshes.push(eye);
    scene.getGlowLayerByName("glow")?.addExcludedMesh(eye);
    const pupil = MeshBuilder.CreateSphere("pupil", { diameter: 0.09, segments: 4 }, scene);
    pupil.position.set(side * 0.36 + Math.sin(turn) * 0.03, 0.08, 0.63 + Math.cos(turn) * 0.03);
    pupil.rotation.y = turn;
    pupil.scaling.z = 0.3;
    pupil.parent = neck; pupil.material = pupilMat; allMeshes.push(pupil);
  }

  // ── Trunk (parented to neck) ──
  // Read off tabs_screenshot_01: one thick tube, as wide at the face as the gap between the eyes, rooted on the front of the
  // face below the eyes and ahead of the tusk roots, pitching out a little and then hanging nearly to the ground between the
  // tusks, its last stretch curled forward. Darker than the hide so it reads against the chest behind it.
  const trunkMat = getMaterialFactory().get("wood", Color3.Lerp(hide, new Color3(0.04, 0.03, 0.03), 0.6), { emissive: hide.scale(0.03) });
  // Pitch of each piece from straight down (positive = tip forward); the drop runs from the face to 0.15 above the ground
  const TRUNK_PITCH = [1.0, 0.7, 0.4, 0.2, 0.1, 0.3, 0.8, 1.3];
  const TRUNK_PIECE = 0.2;
  const TRUNK_ROOT = 0.5;
  const TRUNK_TIP = 0.22;
  const trunkAt = new Vector3(0, -0.12, 0.76);
  const trunkPieces: { centre: Vector3; radius: number }[] = [];
  // [S] (365) the mammoth's trunk is one tube in his own fur, down to the ground (mammothTrunk); the elephant keeps the pieces below
  if (mammoth) trunkPieces.push(...mammothTrunk(scene, neck, fur, darkMat, allMeshes));
  else {
  for (let i = 0; i < TRUNK_PITCH.length; i++) {
    const t = i / (TRUNK_PITCH.length - 1);
    const pitch = TRUNK_PITCH[i];
    const end = trunkAt.add(new Vector3(0, -Math.cos(pitch) * TRUNK_PIECE, Math.sin(pitch) * TRUNK_PIECE));
    const diam = TRUNK_ROOT + (TRUNK_TIP - TRUNK_ROOT) * t;
    const next = TRUNK_ROOT + (TRUNK_TIP - TRUNK_ROOT) * Math.min(1, (i + 1) / (TRUNK_PITCH.length - 1));
    // Each piece overruns its length so the bends close up with no gap between pieces
    const seg = MeshBuilder.CreateCylinder("trunk", {
      height: TRUNK_PIECE * 1.25, diameterTop: diam, diameterBottom: next, tessellation: 8,
    }, scene);
    seg.position = Vector3.Center(trunkAt, end);
    seg.rotation.x = Math.PI - pitch;
    seg.parent = neck; seg.material = trunkMat; allMeshes.push(seg);
    trunkPieces.push({ centre: seg.position.clone(), radius: (diam + next) / 4 });
    trunkAt.copyFrom(end);
  }
  // Blunt cap closing the curled tip
  const trunkTip = MeshBuilder.CreateSphere("trunkTip", { diameter: TRUNK_TIP * 1.05, segments: 4 }, scene);
  trunkTip.position.copyFrom(trunkAt);
  trunkTip.parent = neck; trunkTip.material = trunkMat; allMeshes.push(trunkTip);
  }

  // Face marking (FACE_PAINT), read off tribal.mammoth.blue.png: on each side a flat team-colour band from the forehead under the mane,
  // down in front of the eye and forward onto the top of the trunk root, then round paint dots spaced down the trunk's side.
  // The band is short flat strips laid on the faceted head where a ray finds its skin, so it lies flush on every facet.
  if (mammoth) {
    const faceMat = getMaterialFactory().getCloth(color);
    neck.computeWorldMatrix(true);
    headMesh.computeWorldMatrix(true);
    const toNeck = Matrix.Invert(neck.getWorldMatrix());
    const headAt = new Vector3(0, 0, 0.25);
    // A point on the head's skin seen from (yaw off the front, pitch up), and the skin's outward normal there, both in neck space
    const onSkin = (yaw: number, pitch: number): { at: Vector3; up: Vector3 } | null => {
      const out = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
      const from = Vector3.TransformCoordinates(headAt.add(out.scale(3)), neck.getWorldMatrix());
      const dir = Vector3.TransformNormal(out.negate(), neck.getWorldMatrix()).normalize();
      const hit = scene.pickWithRay(new Ray(from, dir, 100), (m) => m === headMesh);
      if (!hit?.hit || !hit.pickedPoint) return null;
      const n = hit.getNormal(true, false) ?? dir.negate();
      return { at: Vector3.TransformCoordinates(hit.pickedPoint, toNeck), up: Vector3.TransformNormal(n, toNeck).normalize() };
    };
    for (const side of [-1, 1]) {
      const path = FACE_PAINT.path;
      let last = onSkin(side * path[0][0], path[0][1]);
      for (let i = 1; i < path.length * FACE_PAINT.steps; i++) {
        const t = i / FACE_PAINT.steps, k = Math.min(path.length - 2, Math.floor(t)), u = t - k;
        const next = onSkin(side * (path[k][0] + (path[k + 1][0] - path[k][0]) * u), path[k][1] + (path[k + 1][1] - path[k][1]) * u);
        if (last && next) {
          const along = next.at.subtract(last.at);
          const long = along.length();
          const z = along.normalize();
          const y = last.up.add(next.up).normalize();
          const x = Vector3.Cross(y, z).normalize();
          const yy = Vector3.Cross(z, x).normalize();
          const wide = FACE_PAINT.wide * (1 - FACE_PAINT.taper * t / (path.length - 1));
          const strip = MeshBuilder.CreateBox("facePaint", { width: wide, height: FACE_PAINT.thick, depth: long + wide * 0.5 }, scene);
          strip.rotation = Vector3.RotationFromAxis(x, yy, z);
          strip.position = Vector3.Center(last.at, next.at).add(yy.scale(FACE_PAINT.thick * 0.2));
          strip.parent = neck; strip.material = faceMat; allMeshes.push(strip);
        }
        last = next;
        if (t >= path.length - 1) break;
      }
      // Dots down the trunk's outer side, flat on its skin
      for (const piece of FACE_PAINT.trunkDots) {
        const at = trunkPieces[piece];
        // flat painted discs on the trunk's side (365), not raised knobs
        const dot = MeshBuilder.CreateCylinder("trunkDot", { height: 0.012, diameter: FACE_PAINT.dot, tessellation: 8 }, scene);
        dot.rotation.z = Math.PI / 2;
        dot.position.set(side * at.radius * 1.0, at.centre.y, at.centre.z);
        dot.parent = neck; dot.material = faceMat; allMeshes.push(dot);
      }
    }
  }

  // ── Tusks (parented to neck) ──
  // One long thick curve per side: down and well out of the jaw, forward past the trunk, then up and back in to a tip about level with the eye.
  // Each segment starts where the last one ended, so the curve has no gaps.
  const tuskPitches = [0.4, 0.8, 1.3, 1.9, 2.4, 2.8];
  // The two steep segments off the jaw are short, so the curve turns forward high instead of kinking low at the knees
  const tuskLengths = [0.5, 0.5, 0.66, 0.66, 0.62, 0.58];
  const tuskGirths = [0.28, 0.26, 0.23, 0.19, 0.16, 0.12, 0.05];
  // The tips keep the flat team colour: the material preset repaints paintMat, and would dull them with the rest of the war paint
  const tuskTipMat = getMaterialFactory().getCloth(color);
  const tuskSplay = [0.14, 0.16, 0.12, 0.04, -0.08, -0.14];
  // Each of those six is laid as two half-length pieces with the pitch and girth eased between neighbours, at 0.6 of
  // the length: twelve small turns read as one short smooth curve that ends by the trunk, well clear of the ground and the brow
  const tuskAt = (values: number[], u: number): number => {
    const c = Math.max(0, Math.min(values.length - 1, u));
    const lo = Math.min(values.length - 2, Math.floor(c));
    return values[lo] + (values[lo + 1] - values[lo]) * (c - lo);
  };
  const tuskPieces = tuskPitches.length * 2;
  for (const side of [-1, 1]) {
    const start = new Vector3(side * 0.42, -0.3, 0.5);
    for (let i = 0; i < tuskPieces; i++) {
      const pitch = tuskAt(tuskPitches, (i + 0.5) / 2 - 0.5);
      const length = tuskLengths[i >> 1] * 0.5 * 0.6;
      const splay = tuskSplay[i >> 1] * 0.5 * 0.6;
      const end = start.add(new Vector3(side * splay, -Math.cos(pitch) * length, Math.sin(pitch) * length));
      const seg = MeshBuilder.CreateCylinder("tusk", {
        height: length * 1.14, diameterTop: tuskAt(tuskGirths, (i + 1) / 2), diameterBottom: tuskAt(tuskGirths, i / 2), tessellation: 8,
      }, scene);
      seg.position = Vector3.Center(start, end);
      seg.rotation.x = Math.PI - pitch;
      seg.rotation.z = -side * splay / length;
      // The last pieces are painted: a team-coloured tusk tip (the mammoth's MAMMOTH_TUSK.tip pieces long, the elephant's two)
      const tipPieces = mammoth ? MAMMOTH_TUSK.tip : 2;
      seg.parent = neck; seg.material = i >= tuskPieces - tipPieces ? tuskTipMat : tuskMat; allMeshes.push(seg);
      // ...and on the mammoth a team stripe round the tusk MAMMOTH_TUSK.gap pieces short of the tip, bare tan between
      if (mammoth && i === tuskPieces - tipPieces - MAMMOTH_TUSK.gap) {
        const girth = tuskAt(tuskGirths, i / 2);
        const stripe = MeshBuilder.CreateCylinder("tuskStripe", { height: length * MAMMOTH_TUSK.stripe, diameter: girth * MAMMOTH_TUSK.proud, tessellation: 8 }, scene);
        stripe.position = start.add(end.subtract(start).scale(0.5 * MAMMOTH_TUSK.stripe));
        stripe.rotation.copyFrom(seg.rotation);
        stripe.parent = neck; stripe.material = tuskTipMat; allMeshes.push(stripe);
      }
      start.copyFrom(end);
    }
  }

  // ── Ears (parented to neck): faceted fur fans flaring off the skull, not team slabs ──
  // [S] the mammoth's ears (367; spec at MAMMOTH_EAR): a small rounded fur flap on each side of the head behind the eye; the elephant keeps the fans below
  if (mammoth) mammothEars(scene, neck, shaggyFur, allMeshes);
  else for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateCylinder("ear", { height: 0.1, diameter: 0.95, tessellation: 7 }, scene);
    ear.position.set(side * 0.74, 0.0, 0.0);
    ear.scaling.set(0.8, 1, 1.1);
    ear.rotation.x = Math.PI / 2;
    ear.rotation.y = side * 0.55;
    ear.parent = neck; ear.material = shaggyFur; allMeshes.push(ear);
  }

  // ── Legs (parented to leg joints) ──
  const legJoints: [TransformNode, TransformNode][] = [
    [flHip, flKnee], [frHip, frKnee], [blHip, blKnee], [brHip, brKnee],
  ];

  for (const [hipJoint, kneeJoint] of legJoints) {
    if (mammoth) {
      mammothLeg(scene, hipJoint, kneeJoint, fur, tuskTipMat, allMeshes, legJoints.findIndex(([h]) => h === hipJoint));
      continue;
    }
    // Upper leg
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.55, diameterTop: 0.6, diameterBottom: 0.56, tessellation: 6,
    }, scene);
    upper.position.set(0, -0.22, 0);
    upper.parent = hipJoint; upper.material = fur; allMeshes.push(upper);

    // Shaggy cuff over the thigh, so the leg leaves the body through fur rather than as a bare post
    const cuff = MeshBuilder.CreateCylinder("legCuff", {
      height: 0.42, diameterTop: 0.72, diameterBottom: 0.62, tessellation: 6,
    }, scene);
    cuff.position.set(0, -0.14, 0);
    cuff.parent = hipJoint; cuff.material = shaggyFur; allMeshes.push(cuff);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.45, diameterTop: 0.56, diameterBottom: 0.6, tessellation: 6,
    }, scene);
    lower.position.set(0, -0.18, 0);
    // Pillars in the hide's own colour, 0.6 across on hips 0.92 apart: as wide as the hips allowed, the four ran together into one block seen from behind
    lower.parent = kneeJoint; lower.material = fur; allMeshes.push(lower);

    // Foot
    const foot = MeshBuilder.CreateCylinder("foot", {
      height: 0.08, diameter: 0.64, tessellation: 6,
    }, scene);
    foot.position.set(0, -0.4, 0);
    foot.parent = kneeJoint; foot.material = darkMat; allMeshes.push(foot);

    // War-paint anklet just above the foot: two team-colour stripes round the pillar and a ring of team dots under them (ANKLE_BAND)
    if (mammoth) {
      for (const y of ANKLE_BAND.stripes) {
        const stripe = MeshBuilder.CreateCylinder("ankleStripe", { height: ANKLE_BAND.stripeTall, diameter: ANKLE_BAND.wide, tessellation: 12 }, scene);
        stripe.position.set(0, y, 0);
        stripe.parent = kneeJoint; stripe.material = tuskTipMat; allMeshes.push(stripe);
      }
      for (let i = 0; i < ANKLE_BAND.dots; i++) {
        const a = (i + 0.5) / ANKLE_BAND.dots * Math.PI * 2;
        const dot = MeshBuilder.CreateSphere("ankleDot", { diameter: ANKLE_BAND.dot, segments: 4 }, scene);
        dot.scaling.set(1, 1, ANKLE_BAND.dotFlat);
        dot.position.set(Math.sin(a) * ANKLE_BAND.dotOut, ANKLE_BAND.dotAt, Math.cos(a) * ANKLE_BAND.dotOut);
        dot.rotation.y = a;
        dot.parent = kneeJoint; dot.material = tuskTipMat; allMeshes.push(dot);
      }
    }
  }

  // [S] the mammoth's tail (MAMMOTH_TAIL, 381; card Appearance "a skinny and fluffy tail at their rear"; critic 377: a small dark ball floated off the
  // rump). Rooted on the rump's back face just above its middle (the barrel's end ring, BODY_LIFT/BODY_BACK applied), it hangs back and down in
  // .chunks tapering fur pieces, bending plumb, to a fluffy tip tuft of .tuftBalls lumps in the mane's near-black, clear of the hull side-on.
  if (mammoth) {
    const T = MAMMOTH_TAIL;
    const pts = T.path.map(([y, z]) => new Vector3(0, y, z));
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], span = b.subtract(a);
      const piece = MeshBuilder.CreateCylinder("tail", { height: span.length() + T.overlap, diameterBottom: T.thick[i], diameterTop: T.thick[i + 1], tessellation: 6 }, scene);
      piece.position.copyFrom(a.add(b).scale(0.5));
      piece.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), span.normalize(), new Quaternion());
      piece.parent = torso; piece.material = fur; allMeshes.push(piece);
    }
    const tip = pts[pts.length - 1];
    for (let i = 0; i < T.tuftBalls; i++) {
      const a = (i / T.tuftBalls) * Math.PI * 2;
      const lump = MeshBuilder.CreateIcoSphere("tuft", { radius: 1, subdivisions: 1, flat: true }, scene);
      jitterVertices(lump, 0.2, 91 + i, T.tuft, T.tuft * 1.4, T.tuft);
      lump.position.set(Math.sin(a) * T.tuftOut, tip.y - T.tuftDrop * (i % 2 ? 1 : 0.5), tip.z + Math.cos(a) * T.tuftOut);
      lump.parent = torso; lump.material = crestMat; allMeshes.push(lump);
    }
  } else {
  // ── Tail (parented to torso) ──
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.5, diameterTop: 0.03, diameterBottom: 0.06, tessellation: 6,
  }, scene);
  tail.position.set(0, -0.2, -1.16);
  tail.rotation.x = -0.7;
  tail.parent = torso; tail.material = darkMat; allMeshes.push(tail);

  const tuft = MeshBuilder.CreateSphere("tuft", { diameter: 0.1, segments: 4 }, scene);
  tuft.position.set(0, -0.45, -1.36);
  tuft.parent = torso; tuft.material = darkMat; allMeshes.push(tuft);
  }

  // Map to ArticulatedBody: front legs = arms, back legs = legs
  const rHand = dummyJoint("m_rhand", frKnee, scene);
  const lHand = dummyJoint("m_lhand", flKnee, scene);
  const headTop = dummyJoint("m_headtop", neck, scene);

  // [S] the great dome (MAMMOTH_DOME): the head and what rides it lifted and grown about the head's centre on a skull node
  if (mammoth) {
    const skull = dummyJoint("m_skull", neck, scene);
    const centre = new Vector3(0, 0, 0.25);
    skull.position.set(0, MAMMOTH_DOME.lift, centre.z);
    skull.scaling.setAll(MAMMOTH_DOME.grow);
    for (const m of allMeshes) {
      if (m.parent !== neck || !MAMMOTH_DOME_PARTS.has(m.name)) continue;
      m.parent = skull;
      m.position.subtractInPlace(centre);
      if (m.name === "eye" || m.name === "pupil") {
        m.position.y += MAMMOTH_DOME.eyeUp;
        m.position.z += MAMMOTH_DOME.eyeOut;
      }
    }
  }

  // Faceted low-poly read instead of smooth cylinders
  for (const mesh of allMeshes) mesh.convertToFlatShadedMesh();

  const allJoints = [hip, torso, neck, flHip, flKnee, frHip, frKnee, blHip, blKnee, brHip, brKnee];

  return {
    root, bodyMaterial: paintMat, skinMaterial: paintMat, metrics: makeBodyMetrics(2.35 * scale, 0.8 * scale, 0.8 * scale, 0.62 * scale), hip, torso, torsoMesh, neck, headMesh,
    leftShoulder: flHip, leftUpperArm: torsoMesh, leftElbow: flKnee, leftLowerArm: torsoMesh,
    rightShoulder: frHip, rightUpperArm: torsoMesh, rightElbow: frKnee, rightLowerArm: torsoMesh,
    leftHip: blHip, leftUpperLeg: torsoMesh, leftKnee: blKnee, leftLowerLeg: torsoMesh,
    rightHip: brHip, rightUpperLeg: torsoMesh, rightKnee: brKnee, rightLowerLeg: torsoMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}

/*
 * The sacred elephant (261; units/good.sacred_elephant). Spec, read off the reference: a pale grey-white elephant, the same smooth faceted grey on body,
 * ears, legs and the long hanging trunk (no dark fur, no mop, crest or shoulder hump, no war paint); ivory tusks with a broad gold ring a third of the way along each;
 * a gold headplate on the brow, a pointed shield shape about half the skull wide, set with blue gems, with a gold strap running back from it over the
 * crown; a team-blue blanket with a gold hem draped over the back behind the shoulders, its sides hanging a third of the way down the flanks; and on the
 * shoulders a throne, a gold-framed team-coloured high back about as tall as the rider sitting before it, with an archer seated on it drawing a bow.
 * So: buildMammoth in an ELEPHANT_HIDE, its shaggy pieces repainted in the hide and its crest, mop and paint taken away; then the trappings below,
 * every one in torso or neck space (the rig's own 1.8 scale), the rider counter-scaled so he stays a man's size on it.
 */
const ELEPHANT_HIDE = new Color3(0.74, 0.75, 0.76);
const ELEPHANT_GOLD = new Color3(0.95, 0.66, 0.16);
const ELEPHANT_GEM = new Color3(0.16, 0.26, 0.85);
const ELEPHANT_SHAVED = new Set(["dome", "crest", "topknot", "maneLock", "browPaint", "facePaint", "trunkDot", "paintDaub", "hump", "ankleStripe", "ankleDot"]);
const ELEPHANT_HIDE_PIECES = new Set(["backRidge", "furHem", "ear", "legCuff", "trunk", "trunkTip"]);
const TUSK_RING_PIECE = 4;
const BLANKET_RADII = new Vector3(0.92, 0.8, 0.74);
const BLANKET_AT = new Vector3(0, 0.16, -0.46);
const THRONE_SEAT = new Vector3(0, 0.9, 0.12);
const THRONE_BACK_TALL = 0.62;
const RIDER_SCALE = 2.4;
function buildSacredElephant(scene: Scene, color: Color3): ArticulatedBody {
  const body = buildMammoth(scene, color, ELEPHANT_HIDE, 0);
  const hide = body.torsoMesh.material;
  const gold = getMaterialFactory().get("cloth", ELEPHANT_GOLD, { emissive: ELEPHANT_GOLD.scale(0.22) });
  const gem = getMaterialFactory().get("cloth", ELEPHANT_GEM, { emissive: ELEPHANT_GEM.scale(0.3) });
  const cloth = getMaterialFactory().get("cloth", color, { emissive: color.scale(0.12) });

  // Shave the mammoth: no indigo crest or mop, no daubs; every shaggy piece goes the smooth hide
  body.allMeshes = body.allMeshes.filter((mesh) => {
    if (ELEPHANT_SHAVED.has(mesh.name)) { mesh.dispose(); return false; }
    if (ELEPHANT_HIDE_PIECES.has(mesh.name)) mesh.material = hide;
    return true;
  });
  const add = (mesh: Mesh, parent: TransformNode, material: Mesh["material"]): Mesh => {
    mesh.parent = parent;
    mesh.material = material;
    mesh.convertToFlatShadedMesh();
    body.allMeshes.push(mesh);
    return mesh;
  };

  // Tusks: ivory to the tip, a broad gold ring round each a third of the way out
  const tusks = body.allMeshes.filter((mesh) => mesh.name === "tusk");
  const perSide = tusks.length / 2;
  for (const [i, tusk] of tusks.entries()) {
    if (i % perSide === perSide - 1 || i % perSide === perSide - 2) tusk.material = tusks[0].material;
    if (i % perSide !== TUSK_RING_PIECE) continue;
    const ring = add(MeshBuilder.CreateCylinder("tuskRing", { height: 0.13, diameter: 0.33, tessellation: 8 }, scene), body.neck, gold);
    ring.position.copyFrom(tusk.position);
    ring.rotation.copyFrom(tusk.rotation);
  }

  // Headplate: a pointed gold shield on the brow, point down between the eyes, three blue gems, and a strap back over the crown
  const plate = add(MeshBuilder.CreateCylinder("elephantHeadplate", { height: 0.06, diameter: 0.56, tessellation: 4 }, scene), body.neck, gold);
  plate.scaling.set(0.8, 1, 1.25);
  plate.position.set(0, 0.42, 0.6);
  plate.rotation.set(Math.PI / 2 - 0.75, 0, 0);
  for (const [x, y, z, d] of [[0, 0.5, 0.65, 0.12], [-0.12, 0.4, 0.68, 0.08], [0.12, 0.4, 0.68, 0.08], [0, 0.3, 0.72, 0.08]]) {
    const stone = add(MeshBuilder.CreateSphere("elephantGem", { diameter: d, segments: 2 }, scene), body.neck, gem);
    stone.position.set(x, y, z);
  }
  const strap = add(MeshBuilder.CreateTorus("elephantCrownStrap", { diameter: 1.16, thickness: 0.07, tessellation: 14 }, scene), body.neck, gold);
  strap.position.set(0, 0.12, 0.22);
  strap.rotation.z = Math.PI / 2;
  strap.scaling.set(1, 1, 0.92);

  // Blanket: a half shell over the back (a cylinder's arc runs on its negative z, so it is turned +90 degrees to lie over the top) behind the shoulders, team cloth with a gold hem along each flank and a gold band across each end
  const blanket = add(MeshBuilder.CreateCylinder("elephantBlanket", { height: 0.9, diameter: 2, arc: 0.5, tessellation: 18, enclose: false, sideOrientation: Mesh.DOUBLESIDE }, scene), body.torso, cloth);
  blanket.rotation.x = Math.PI / 2;
  blanket.scaling.copyFrom(BLANKET_RADII);
  blanket.position.copyFrom(BLANKET_AT);
  for (const end of [-1, 1]) {
    const band = add(MeshBuilder.CreateCylinder("elephantBlanketBand", { height: 0.08, diameter: 2.04, arc: 0.5, tessellation: 18, enclose: false, sideOrientation: Mesh.DOUBLESIDE }, scene), body.torso, gold);
    band.rotation.x = Math.PI / 2;
    band.scaling.copyFrom(BLANKET_RADII);
    band.position.set(BLANKET_AT.x, BLANKET_AT.y, BLANKET_AT.z + end * 0.43);
    const hem = add(MeshBuilder.CreateBox("elephantBlanketHem", { width: 0.06, height: 0.1, depth: 0.92 }, scene), body.torso, gold);
    hem.position.set(end * BLANKET_RADII.x, BLANKET_AT.y + 0.03, BLANKET_AT.z);
    // A tassel off each hem's back corner
    const tassel = add(MeshBuilder.CreateCylinder("elephantTassel", { height: 0.18, diameterTop: 0.03, diameterBottom: 0.1, tessellation: 5 }, scene), body.torso, cloth);
    tassel.position.set(end * BLANKET_RADII.x, BLANKET_AT.y - 0.1, BLANKET_AT.z - 0.4);
  }

  // Throne on the shoulders: a gold seat, a team-cloth high back in a gold frame with a round gold crest, gold arms
  const seat = add(MeshBuilder.CreateBox("elephantThroneSeat", { width: 0.42, height: 0.08, depth: 0.36 }, scene), body.torso, gold);
  seat.position.copyFrom(THRONE_SEAT);
  const back = add(MeshBuilder.CreateBox("elephantThroneBack", { width: 0.36, height: THRONE_BACK_TALL, depth: 0.05 }, scene), body.torso, cloth);
  back.position.set(0, THRONE_SEAT.y + THRONE_BACK_TALL / 2, THRONE_SEAT.z - 0.19);
  back.rotation.x = -0.12;
  const frame = add(MeshBuilder.CreateBox("elephantThroneFrame", { width: 0.44, height: THRONE_BACK_TALL + 0.06, depth: 0.04 }, scene), body.torso, gold);
  frame.position.set(0, back.position.y, back.position.z - 0.035);
  frame.rotation.x = back.rotation.x;
  const crown = add(MeshBuilder.CreateCylinder("elephantThroneCrest", { height: 0.04, diameter: 0.3, tessellation: 10 }, scene), body.torso, gold);
  crown.rotation.x = Math.PI / 2 + back.rotation.x;
  crown.position.set(0, THRONE_SEAT.y + THRONE_BACK_TALL + 0.06, back.position.z - 0.06);
  for (const side of [-1, 1]) {
    const arm = add(MeshBuilder.CreateBox("elephantThroneArm", { width: 0.05, height: 0.16, depth: 0.32 }, scene), body.torso, gold);
    arm.position.set(side * 0.21, THRONE_SEAT.y + 0.1, THRONE_SEAT.z);
  }

  // The archer: a seated man on the throne, thighs level, shins down, bow held out to the front in his left hand
  const saddle = new TransformNode("elephantRiderSeat", scene);
  saddle.parent = body.torso;
  saddle.scaling.setAll(RIDER_SCALE);
  let hipY = 0;
  addOperator(scene, saddle, body.allMeshes, 0, 0, 0, color, (rider) => {
    hipY = rider.hip.position.y;
    rider.leftHip.rotation.x = -1.45;
    rider.rightHip.rotation.x = -1.45;
    rider.leftKnee.rotation.x = 1.4;
    rider.rightKnee.rotation.x = 1.4;
    rider.leftShoulder.rotation.x = -1.45;
    rider.rightShoulder.rotation.x = -1.2;
    rider.rightElbow.rotation.x = -0.9;
    rider.neck.rotation.x = 0.1;
    const limb = Array.from({ length: 9 }, (_, i) => { const a = (i / 8 - 0.5) * 2.2; return new Vector3(0, Math.sin(a) * 0.26, Math.cos(a) * 0.26 - 0.16); });
    const bow = MeshBuilder.CreateTube("elephantRiderBow", { path: limb, radius: 0.016, tessellation: 5 }, scene);
    bow.parent = rider.leftHand;
    bow.material = gold;
    rider.allMeshes.push(bow);
  });
  // Seat the man by his hips on the throne seat
  saddle.position.set(0, THRONE_SEAT.y + 0.04 - hipY * RIDER_SCALE, THRONE_SEAT.z - 0.02);

  return body;
}
