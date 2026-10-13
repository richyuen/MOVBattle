import {
  Scene, TransformNode, Mesh, MeshBuilder, Color3, Vector3,
  PBRMetallicRoughnessMaterial,
} from "@babylonjs/core";
import { getMaterialFactory } from "./materialFactory";

/**
 * All the joint TransformNodes and meshes that make up a TABS-style articulated body.
 * Joints are TransformNodes whose rotation drives the limb wobble.
 */
export interface ArticulatedBody {
  root: TransformNode;
  bodyMaterial: PBRMetallicRoughnessMaterial;
  skinMaterial: PBRMetallicRoughnessMaterial;
  metrics: BodyMetrics;
  vehicleSockets?: VehicleSocketSet;

  // Torso
  hip: TransformNode;
  torso: TransformNode;
  torsoMesh: Mesh;

  // Head
  neck: TransformNode;
  headMesh: Mesh;

  // Arms
  leftShoulder: TransformNode;
  leftUpperArm: Mesh;
  leftElbow: TransformNode;
  leftLowerArm: Mesh;
  rightShoulder: TransformNode;
  rightUpperArm: Mesh;
  rightElbow: TransformNode;
  rightLowerArm: Mesh;

  // Legs
  leftHip: TransformNode;
  leftUpperLeg: Mesh;
  leftKnee: TransformNode;
  leftLowerLeg: Mesh;
  rightHip: TransformNode;
  rightUpperLeg: Mesh;
  rightKnee: TransformNode;
  rightLowerLeg: Mesh;

  // Optional prop attachment points
  rightHand: TransformNode;
  leftHand: TransformNode;
  headTop: TransformNode;

  // Googly eyes (optional — absent on vehicles)
  leftEye?: Mesh;
  rightEye?: Mesh;
  leftPupil?: Mesh;
  rightPupil?: Mesh;

  // All meshes for material assignment
  allMeshes: Mesh[];
  // All joints for animation
  allJoints: TransformNode[];
}

export interface VehicleSocketSet {
  primaryMuzzle?: TransformNode;
  muzzleSequence?: TransformNode[];
  smokeSocket?: TransformNode;
  impactOrigin?: TransformNode;
}

export interface BodyMetrics {
  overallHeight: number;
  headTopY: number;
  shoulderWidth: number;
  hipWidth: number;
  handReachY: number;
  footBottomY: number;
  /** The head block and the neck under it, in the body's own units, for headgear that is fitted to the head and not only stood on it */
  head?: { width: number; height: number; neck: number };
  /** The fist's width across the knuckles, in the body's own units, for props that are cut to the hand that holds them */
  hand?: { width: number };
}

export interface BodyProportions {
  /** Overall height multiplier (1.0 = normal human) */
  scale: number;
  /** Torso width multiplier */
  bulk: number;
  /** Head size multiplier */
  headSize: number;
  /** Arm length multiplier */
  armLength: number;
  /** Leg length multiplier */
  legLength: number;
  /** Optional head stretch and shaping controls */
  headLength?: number;
  headWidth?: number;
  headDepth?: number;
  /** Optional torso shaping controls */
  torsoWidth?: number;
  torsoDepth?: number;
  torsoLength?: number;
  torsoRoundness?: number;
  /** Optional limb shaping controls */
  upperArmWidth?: number;
  lowerArmWidth?: number;
  upperLegWidth?: number;
  lowerLegWidth?: number;
  limbTaper?: number;
  /** Optional hand and foot shaping controls */
  handSize?: number;
  footLength?: number;
  footWidth?: number;
  footHeight?: number;
}

export interface BodyBuildOptions {
  detailLevel?: "standard" | "hero" | "operator";
  showNeck?: boolean;
  showShoulderPads?: boolean;
  showBelt?: boolean;
}

const DEFAULT_PROPORTIONS: BodyProportions = {
  scale: 1.0,
  bulk: 1.0,
  headSize: 1.15,
  armLength: 1.0,
  legLength: 0.92,
  headLength: 1.08,
  headWidth: 0.98,
  headDepth: 0.95,
  torsoWidth: 1.05,
  torsoDepth: 1.0,
  torsoRoundness: 1.1,
  upperArmWidth: 0.95,
  lowerArmWidth: 0.82,
  upperLegWidth: 1.0,
  lowerLegWidth: 0.82,
  limbTaper: 0.75,
  handSize: 1.12,
  footLength: 1.1,
  footWidth: 1.0,
  footHeight: 1.0,
};

/** Gun crew and machine operators are small men, not thin ones: whatever their own scale, head and limb lengths, they are cut to the shirt and trouser widths of standard infantry. */
export function crewProportions(own: Partial<BodyProportions> = {}): Partial<BodyProportions> {
  const { bulk, torsoWidth, torsoDepth, upperArmWidth, lowerArmWidth, upperLegWidth, lowerLegWidth, limbTaper } = DEFAULT_PROPORTIONS;
  return { ...own, bulk, torsoWidth, torsoDepth, upperArmWidth, lowerArmWidth, upperLegWidth, lowerLegWidth, limbTaper };
}

/** TABS silhouette: a tall block of a head on long limbs a good quarter as thick as the torso is wide, so the torso is the wide block. Applied on top of every unit's own proportions. */
const LIMB_THIN = 1.12;
/** The head sizes itself from the body it stands on: this share of the standing height for default proportions, a little under a fifth. */
const HEAD_OF_BODY = 0.18;
/** The head block's bevelled corners sit this share of the way out to its flat sides: 1 is a plain box, 0.41 a regular octagon. */
const HEAD_CORNER = 0.55;
/** The head's profile, chin to crown, as [share of the brow's width, height from the middle in half heads]: chin, cheek, brow, temple, crown. */
const HEAD_RINGS: ReadonlyArray<readonly [number, number]> = [[0.5, -1], [0.8, -0.45], [1, 0.15], [0.95, 0.6], [0.66, 1]];
/** ...and it is no taller than its brow is wide: the block was an eighth taller than wide. */
const HEAD_SQUAT = 0.86;
/** Hats, crowns and halos were cut for a round head this many head units across, less the corners a block has: the hat anchor scales them up to the head they now sit on. */
const HAT_CUT_FOR_HEAD = 0.7;
/** The head stands clear of the shoulders on a neck this long, a third of its own height: head, eyes and hat anchor all ride on top of it. */
const NECK_LENGTH = 0.07;
/** Arms and legs are stretched by this much over their old segment lengths, so the body is some six and a half heads tall and the hands hang to mid thigh. */
const LIMB_STRETCH = 1.16;
/** A mitt is sized from the wrist it hangs from, not from the sleeve or the head: its knuckles are this many forearm ends across, a quarter over the arm it ends: at the arm's own width the fist was a stump end, gone at distance. */
const MITT_OF_WRIST = 1.25;
/** ...and it is a block: this many of its own widths long and deep. */
const MITT_LENGTH = 1.4;
const MITT_DEPTH = 0.8;
/** Sleeves and thighs are a little fuller than the forearms and shins they end in: more made them square puffed blocks. */
const SLEEVE_BULK = 1.05;
/** A limb narrows in one unbroken line: the forearm and shin start at the width the sleeve and thigh end at, with no step at the joint, and run down to a wrist and ankle no thinner than this share of it. */
const LOWER_LIMB_MIN_TAPER = 0.6;
/** Elbows and knees: each segment overruns the hinge by this share of its width there, as a stub drawn in to JOINT_STUB_END of it. */
const JOINT_STUB = 0.45;
const JOINT_STUB_END = 0.6;
/** Shoulders: the sleeve swells over its top SLEEVE_HEAD_DROP of the upper arm to a head SLEEVE_HEAD of the sleeve wide at the joint (SLEEVE_HEAD_PLATE under a breastplate's pad), closed above by a chamfer SLEEVE_HEAD_RISE of that width tall and drawn in to SLEEVE_HEAD_CROWN of it. */
const SLEEVE_HEAD = 1.08;
const SLEEVE_HEAD_PLATE = 1.08;
const SLEEVE_HEAD_DROP = 0.4;
const SLEEVE_HEAD_RISE = 0.35;
const SLEEVE_HEAD_CROWN = 0.6;
/** Shoulder yoke: the top of the torso is a slab that reaches out over both arm roots, to this share of a sleeve past each shoulder joint, so the arm comes out from under the chest's own silhouette
 * and not from a post stood beside it. It runs from the chest line up to this share of a sleeve above the joints at this share of the torso's depth, and from there slopes in to the neck. */
const YOKE_REACH = 0.2;
const YOKE_RISE = 0.1;
const YOKE_DEPTH = 0.92;
const YOKE_NECK = 0.5;
// The hull under the yoke: its foot stands this far up the torso, this much of the waist wide and deep (a box drawn inside the waist's round).
const HULL_FOOT = 0.06;
const HULL_WAIST = 1.0;
/** A thigh is no thinner than this share of the leg's length, however slight the body: a small man stands on trouser legs and not on wire. */
const THIGH_OF_LEG = 0.2;
/** Thigh head: the thigh swells up to the hip as the sleeve does to the shoulder, to this many thighs wide, and its crown sinks into the pelvis block in place of a ball cap. */
const THIGH_HEAD = 1.15;
/** The pelvis is never narrower than the pair of thighs under it, lapped into each other by what this leaves of one. */
const THIGH_LAP = 0.9;
/** A forearm and a shin are not straight tubes: each swells below its elbow or knee to a belly this many of its top widths across, this share of its length down, and narrows from there to the wrist or ankle. */
const FOREARM_SWELL = 1.35;
const CALF_SWELL = 1.4;
const LIMB_BELLY_DROP = 0.3;
/** A shin does not run down to a point: it keeps at least this share of its top width to where it goes into the boot. */
const SHIN_END = 0.78;
/** Boot: a cuff this many shin ends across that stands this share of the shin up the leg, on a toe box this many cuff widths long that stops at this share of the cuff's height. */
const BOOT_OVER_SHIN = 1.3;
const BOOT_RISE = 0.34;
const BOOT_LENGTH = 1.7;
const BOOT_TOE_HEIGHT = 0.5;
/** Torso wedge: the chest line sits this far up from the middle of the torso (1 is the top), a little wider than the chest, and above it the shoulders slope in to this share of the chest; the waist keeps this share of its depth. */
const CHEST_LINE = 0.36;
const CHEST_SWELL = 1.05;
const SHOULDER_SLOPE = 0.8;
const WAIST_DEPTH = 0.85;
/** The legs hang from the lower corners of a pelvis block this share of the shoulders wide and this many thigh widths tall, so the thighs start hip-width apart and run down side by side instead of forking from one point under the belt. */
const PELVIS_OF_SHOULDERS = 0.8;
const PELVIS_HEIGHT = 1.2;

export function buildArticulatedBody(
  scene: Scene,
  name: string,
  proportions: Partial<BodyProportions> = {},
  bodyColor: Color3,
  options: BodyBuildOptions = {},
): ArticulatedBody {
  const p = { ...DEFAULT_PROPORTIONS, ...proportions };
  const s = p.scale;
  const detailLevel = options.detailLevel ?? (s >= 1.7 ? "hero" : "standard");
  // Few sides, flat shaded below: bodies read as faceted low-poly, not smooth tubes.
  const radialSegments = detailLevel === "hero" ? 8 : 6;
  const sphereSegments = detailLevel === "hero" ? 5 : 4;
  const capSegments = 3;

  const allMeshes: Mesh[] = [];
  const allJoints: TransformNode[] = [];

  // PBR materials via factory
  // Body & skin are unique per unit (mutated by presets/FxPresets at runtime)
  // Eyes & pupils are cached (never mutated)
  const mf = getMaterialFactory();
  const bodyMat = mf.createUnique("cloth", bodyColor);
  const skinMat = mf.createUnique("skin", new Color3(0.94, 0.90, 0.86));
  const eyeMat = mf.get("skin", new Color3(0.05, 0.05, 0.05), { roughness: 0.4 });
  const pupilMat = mf.get("skin", new Color3(0.05, 0.05, 0.05), { roughness: 0.4 });

  function sphere(
    n: string,
    diameter: number,
    mat: PBRMetallicRoughnessMaterial,
    scaling: Vector3 = Vector3.One(),
    segments = sphereSegments,
  ): Mesh {
    const m = MeshBuilder.CreateSphere(n, { diameter: diameter * s, segments }, scene);
    m.scaling.copyFrom(scaling);
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  function tapered(
    n: string,
    height: number,
    diameterTop: number,
    diameterBottom: number,
    mat: PBRMetallicRoughnessMaterial,
    scaling: Vector3 = Vector3.One(),
    tessellation = radialSegments,
    jointEnd?: "top" | "bottom",
    stubMat?: PBRMetallicRoughnessMaterial,
    headDiameter?: number,
    bellyDiameter?: number,
  ): Mesh {
    const shaft = MeshBuilder.CreateCylinder(n, {
      height: height * s,
      diameterTop: diameterTop * s,
      diameterBottom: diameterBottom * s,
      tessellation,
      subdivisions: bellyDiameter ? 2 : 1,
    }, scene);
    if (bellyDiameter) {
      // Calf or forearm belly: the middle ring is drawn up to LIMB_BELLY_DROP of the way down and pushed out to the belly's width, so the segment flares below the joint and tapers from there to its end
      const positions = shaft.getVerticesData("position")!;
      const out = bellyDiameter / ((diameterTop + diameterBottom) * 0.5);
      for (let i = 0; i < positions.length; i += 3) {
        if (Math.abs(positions[i + 1]) > height * s * 0.25) continue;
        positions[i] *= out;
        positions[i + 1] = height * s * (0.5 - LIMB_BELLY_DROP);
        positions[i + 2] *= out;
      }
      shaft.setVerticesData("position", positions);
      shaft.refreshBoundingInfo();
    }
    let m = shaft;
    if (jointEnd) {
      // The end that meets an elbow or a knee runs on past the hinge as a short chamfered stub, drawn in to JOINT_STUB_END of the limb there. Straight, each stub lies
      // hidden inside the segment it meets; bent, the two close the open side of the hinge as one faceted elbow or knee, in the colours of the limb itself.
      const up = jointEnd === "top" ? 1 : -1;
      const d = (jointEnd === "top" ? diameterTop : diameterBottom) * s;
      const stubH = d * JOINT_STUB;
      const stub = MeshBuilder.CreateCylinder(`${n}_stub`, {
        height: stubH,
        diameterTop: d * (up > 0 ? JOINT_STUB_END : 1),
        diameterBottom: d * (up > 0 ? 1 : JOINT_STUB_END),
        tessellation,
      }, scene);
      stub.position.y = up * (height * s + stubH) * 0.5;
      if (stubMat) {
        // A stub that runs up into the segment above wears that segment's colour and is a part of its own: a forearm's stays sleeve where it shows behind the bent elbow
        stub.parent = shaft;
        stub.material = stubMat;
        allMeshes.push(stub);
      } else {
        stub.computeWorldMatrix(true);
        shaft.computeWorldMatrix(true);
        m = Mesh.MergeMeshes([shaft, stub], true)!;
        m.name = n;
      }
    }
    if (headDiameter) {
      // Sleeve head: the top of the upper arm is one faceted mass with the shoulder and not a stick under a ball. The sleeve swells up to the joint, wider than
      // the arm below it, and a low chamfered crown closes it over the joint and sinks into the torso's corner; it turns with the arm and takes its colour.
      const top = height * s * 0.5;
      const flareH = height * s * SLEEVE_HEAD_DROP;
      const crownH = headDiameter * s * SLEEVE_HEAD_RISE;
      const flare = MeshBuilder.CreateCylinder(`${n}_headFlare`, {
        height: flareH,
        diameterTop: headDiameter * s,
        diameterBottom: (diameterTop + (diameterBottom - diameterTop) * SLEEVE_HEAD_DROP) * s,
        tessellation,
      }, scene);
      flare.position.y = top - flareH * 0.5;
      const crown = MeshBuilder.CreateCylinder(`${n}_headCrown`, {
        height: crownH,
        diameterTop: headDiameter * s * SLEEVE_HEAD_CROWN,
        diameterBottom: headDiameter * s,
        tessellation,
      }, scene);
      crown.position.y = top + crownH * 0.5;
      for (const part of [m, flare, crown]) part.computeWorldMatrix(true);
      m = Mesh.MergeMeshes([m, flare, crown], true)!;
      m.name = n;
    }
    m.scaling.copyFrom(scaling);
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  /** Torso: a faceted wedge and not a drum. Widest at the chest line, straight-sided from there down to the waist, and sloped in over the shoulders to the neck. */
  function wedgeTorso(n: string): Mesh {
    const m = MeshBuilder.CreateCylinder(n, { height: torsoH * s, diameter: chestTop * s, tessellation: radialSegments, subdivisions: 2 }, scene);
    const positions = m.getVerticesData("position")!;
    const half = torsoH * s * 0.5;
    const waistScale = waist / Math.max(chestTop, 0.001);
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      if (y > half * 0.5) {
        positions[i] *= SHOULDER_SLOPE;
        positions[i + 2] *= SHOULDER_SLOPE;
      } else if (y < -half * 0.5) {
        positions[i] *= waistScale;
        positions[i + 2] *= waistScale * WAIST_DEPTH;
      } else {
        positions[i] *= CHEST_SWELL;
        positions[i + 1] = half * CHEST_LINE;
      }
    }
    m.setVerticesData("position", positions);
    m.refreshBoundingInfo();
    m.scaling.z = torsoD / Math.max(chestTop, waist, 0.001);
    m.material = bodyMat;
    allMeshes.push(m);
    return m;
  }
  /**
   * Shoulder yoke and the hull under it, one solid with the torso: at the shoulder line it is as wide as the arm roots it covers, and from that edge its side planes run
   * straight down and in to the waist, an underarm gusset in place of an armpit gap under a shelf. The chest stands out of its front as a swell; above, a wedge slopes in to the neck.
   */
  function shoulderYoke(n: string, jointX: number, jointY: number): Mesh {
    const chestW = chestTop * CHEST_SWELL * 0.96;
    const waistD = waist * WAIST_DEPTH * torsoD / Math.max(chestTop, waist, 0.001);
    const yokeW = Math.max(chestW, (jointX + upperArmTop * YOKE_REACH) * 2);
    const yokeD = Math.max(torsoD * YOKE_DEPTH, upperArmTop * 1.1);
    const yokeY = jointY + upperArmTop * YOKE_RISE;
    const neckW = Math.max(yokeW * YOKE_NECK, chestTop * SHOULDER_SLOPE * 0.9);
    const frustum = (part: string, y0: number, y1: number, w0: number, d0: number, w1: number, d1: number): Mesh => {
      const box = MeshBuilder.CreateBox(`${n}_${part}`, { width: w1 * s, height: (y1 - y0) * s, depth: d1 * s }, scene);
      const positions = box.getVerticesData("position")!;
      for (let i = 0; i < positions.length; i += 3) {
        if (positions[i + 1] > 0) continue;
        positions[i] *= w0 / w1;
        positions[i + 2] *= d0 / d1;
      }
      box.setVerticesData("position", positions);
      box.position.y = (y0 + y1) * 0.5 * s;
      box.computeWorldMatrix(true);
      return box;
    };
    const slab = frustum("hull", torsoH * HULL_FOOT, yokeY, waist * HULL_WAIST, waistD * HULL_WAIST, yokeW, yokeD);
    const slope = frustum("slope", yokeY, torsoH * 1.02, yokeW, yokeD, neckW, yokeD * 0.75);
    const m = Mesh.MergeMeshes([slab, slope], true)!;
    m.name = n;
    m.material = bodyMat;
    allMeshes.push(m);
    return m;
  }
  /** Head: a faceted wedge and not a tall box. Flat sides with the face square to the front and bevelled corners; it is widest at the brow, above the middle, is closed over by a crown that slopes in to a small flat top, and below the brow draws in past the cheeks to a chin half the brow across. */
  function blockHead(n: string, size: number, mat: PBRMetallicRoughnessMaterial, scaling: Vector3): Mesh {
    const m = MeshBuilder.CreateCylinder(n, { height: size * s, diameter: size * s, tessellation: 8, subdivisions: 4 }, scene);
    const positions = m.getVerticesData("position")!;
    const half = size * s * 0.5;
    const turn = Math.PI / 8;
    for (let i = 0; i < positions.length; i += 3) {
      // Turned so a flat and not a corner faces front, then each ring vertex is pushed out to the side it belongs to.
      let x = positions[i] * Math.cos(turn) - positions[i + 2] * Math.sin(turn);
      let z = positions[i] * Math.sin(turn) + positions[i + 2] * Math.cos(turn);
      const y = positions[i + 1];
      if (Math.max(Math.abs(x), Math.abs(z)) > half * 0.1) {
        const onSide = Math.abs(x) >= Math.abs(z);
        x = Math.sign(x) * half * (onSide ? 1 : HEAD_CORNER);
        z = Math.sign(z) * half * (onSide ? HEAD_CORNER : 1);
      }
      // Five rings from the chin up: each has its share of the brow's width and its height on the head
      const [ring, at] = HEAD_RINGS[Math.max(0, Math.min(4, Math.round(y / half * 2) + 2))];
      positions[i] = x * ring;
      positions[i + 1] = half * at;
      positions[i + 2] = z * ring;
    }
    m.setVerticesData("position", positions);
    m.refreshBoundingInfo();
    m.scaling.copyFrom(scaling);
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  /** Mitt hand: a block fist and not a paddle. Its knuckles are as wide as the forearm end it hangs from and nearly as deep, it draws in a little to the wrist above them and is bevelled to a blunt end below, and a thumb block stands off the front of the palm. */
  function mitt(n: string, width: number, mat: PBRMetallicRoughnessMaterial): Mesh {
    const w = width * s;
    const length = w * MITT_LENGTH;
    const depth = w * MITT_DEPTH;
    const palm = MeshBuilder.CreateCylinder(`${n}_palm`, { height: length, diameter: 1, tessellation: 4, subdivisions: 2 }, scene);
    const positions = palm.getVerticesData("position")!;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const y = positions[i + 1];
      // Three square rings: the wrist, the knuckles at full width a third of the way down, and the fingertips drawn in under them.
      const ring = y > length * 0.25 ? 0.85 : y < -length * 0.25 ? 0.7 : 1;
      if (ring === 1) positions[i + 1] = length * 0.1;
      if (Math.abs(x) + Math.abs(z) < 1e-6) continue;
      positions[i] = Math.sign(x - z) * w * 0.5 * ring;
      positions[i + 2] = Math.sign(x + z) * depth * 0.5 * (ring === 0.7 ? 0.6 : ring);
    }
    palm.setVerticesData("position", positions);
    // The thumb: a short block on the front of the palm below the wrist, tipped out from it and narrower at its end.
    const thumb = MeshBuilder.CreateBox(`${n}_thumb`, { width: w * 0.42, height: length * 0.5, depth: depth * 0.5 }, scene);
    const thumbPositions = thumb.getVerticesData("position")!;
    for (let i = 0; i < thumbPositions.length; i += 3) {
      if (thumbPositions[i + 1] < 0) thumbPositions[i] *= 0.7;
    }
    thumb.setVerticesData("position", thumbPositions);
    thumb.rotation.x = -0.45;
    thumb.position.set(0, length * 0.02, depth * 0.62);
    for (const part of [palm, thumb]) {
      part.convertToFlatShadedMesh();
      part.computeWorldMatrix(true);
    }
    const m = Mesh.MergeMeshes([palm, thumb], true)!;
    m.name = n;
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  /** Foot: a boot and not a sole. A cuff block wider and deeper than the shin stands up around its lower end, so the shin goes into the boot, and a lower toe box runs out in front of it from the heel, blunt and a little narrower at the toe. */
  function foot(n: string): Mesh {
    const sole = -(lowerLegH + footBottomOffset) * s;
    const cuffHeight = (footBottomOffset + lowerLegH * BOOT_RISE) * s;
    const cuff = MeshBuilder.CreateBox(`${n}_cuff`, { width: footWidth * s, height: cuffHeight, depth: footDepth * s }, scene);
    const cuffPositions = cuff.getVerticesData("position")!;
    for (let i = 0; i < cuffPositions.length; i += 3) {
      // The cuff draws in a little to its top edge, which still stands clear of the shin all round.
      if (cuffPositions[i + 1] <= 0) continue;
      cuffPositions[i] *= 0.9;
      cuffPositions[i + 2] *= 0.9;
    }
    cuff.setVerticesData("position", cuffPositions);
    cuff.position.set(0, sole + cuffHeight * 0.5, 0);
    const toeHeight = cuffHeight * BOOT_TOE_HEIGHT;
    const toe = MeshBuilder.CreateBox(`${n}_toe`, { width: footWidth * s, height: toeHeight, depth: footLength * s }, scene);
    const toePositions = toe.getVerticesData("position")!;
    for (let i = 0; i < toePositions.length; i += 3) {
      if (toePositions[i + 2] <= 0) continue;
      toePositions[i] *= 0.8;
      if (toePositions[i + 1] > 0) toePositions[i + 1] *= 0.4;
    }
    toe.setVerticesData("position", toePositions);
    // The heel sits flush with the back of the cuff; everything else of the toe box is out in front of the shin.
    toe.position.set(0, sole + toeHeight * 0.5, (footLength - footDepth) * s * 0.5);
    for (const part of [cuff, toe]) {
      part.convertToFlatShadedMesh();
      part.computeWorldMatrix(true);
    }
    const m = Mesh.MergeMeshes([cuff, toe], true)!;
    m.name = n;
    m.material = bodyMat;
    allMeshes.push(m);
    return m;
  }
  function joint(n: string, parent: TransformNode): TransformNode {
    const t = new TransformNode(n, scene);
    t.parent = parent;
    allJoints.push(t);
    return t;
  }

  // ─── Root ───
  const root = new TransformNode(`${name}_root`, scene);

  const limbTaper = Math.max(0.15, p.limbTaper ?? 1.0);
  const torsoW = 0.33 * p.bulk * (p.torsoWidth ?? 1.0);
  const torsoH = 0.46 * (p.torsoLength ?? 1.0);
  const torsoD = 0.21 * Math.max(0.75, p.bulk * 0.92) * (p.torsoDepth ?? 1.0);
  const torsoRoundness = Math.max(0.6, p.torsoRoundness ?? 1.0);
  const torsoTop = torsoW * (1.0 + torsoRoundness * 0.08);
  const torsoBottom = torsoW * (0.76 + torsoRoundness * 0.04);
  // A breastplate flares to the shoulders: the chest top widens while the shoulder joints stay put, so the shoulder
  // caps sink into its corners and the chest is broader than the helm above it.
  const chestTop = torsoTop * (options.showShoulderPads ? 1.24 : 1);
  // ...and its waist widens by half that flare, so the plate is a broad slab and not a funnel down to the belt.
  const waist = torsoBottom * (options.showShoulderPads ? 1.12 : 1);

  const upperArmH = 0.264 * LIMB_STRETCH * p.armLength;
  const lowerArmH = 0.242 * LIMB_STRETCH * p.armLength;
  const upperArmTop = 0.09 * LIMB_THIN * SLEEVE_BULK * Math.max(0.8, p.bulk * 0.95) * (p.upperArmWidth ?? 1.0);
  const upperArmBottom = upperArmTop * Math.max(0.62, 0.82 - limbTaper * 0.12);
  const lowerArmTop = upperArmBottom;
  const lowerArmBottom = lowerArmTop * Math.max(LOWER_LIMB_MIN_TAPER, 0.8 - limbTaper * 0.14) * (p.lowerArmWidth ?? 1.0);
  const handWidth = lowerArmBottom * MITT_OF_WRIST * (p.handSize ?? 1.0);
  const handLength = handWidth * MITT_LENGTH;

  const upperLegH = 0.308 * LIMB_STRETCH * p.legLength;
  const lowerLegH = 0.275 * LIMB_STRETCH * p.legLength;
  const upperLegTop = Math.max(0.12 * LIMB_THIN * SLEEVE_BULK * p.bulk * (p.upperLegWidth ?? 1.0), (upperLegH + lowerLegH) * THIGH_OF_LEG);
  const upperLegBottom = upperLegTop * Math.max(0.72, 0.9 - limbTaper * 0.1);
  const lowerLegTop = upperLegBottom;
  // The shin ends at the width of the boot top it goes into, and not at a needle ankle: a unit's own shin width only thins it down to SHIN_END.
  const lowerLegBottom = lowerLegTop * Math.max(SHIN_END, Math.max(LOWER_LIMB_MIN_TAPER, 0.8 - limbTaper * 0.14) * (p.lowerLegWidth ?? 1.0));
  // One line through the hinge: an elbow or a knee is not where the taper of the sleeve or thigh above it happens to end, pinched between that and the belly below, which made each limb
  // two links. It stands on the straight line from the top of the limb to the belly of the forearm or shin, so the limb runs through its joint as one tube and narrows only from the belly down.
  const throughHinge = (top: number, upperH: number, belly: number, lowerH: number): number =>
    (top * lowerH * LIMB_BELLY_DROP + belly * upperH) / (upperH + lowerH * LIMB_BELLY_DROP);
  const elbowWidth = throughHinge(upperArmTop, upperArmH, lowerArmTop * FOREARM_SWELL, lowerArmH);
  const kneeWidth = throughHinge(upperLegTop, upperLegH, lowerLegTop * CALF_SWELL, lowerLegH);
  // The boot is cut from the shin end it wraps: wider and deeper than it, and longer than it is wide with the length out in front as the toe.
  const footWidth = lowerLegBottom * BOOT_OVER_SHIN * (p.footWidth ?? 1.0);
  const footDepth = lowerLegBottom * BOOT_OVER_SHIN;
  const footLength = footDepth * BOOT_LENGTH * (p.footLength ?? 1.0);
  const footHeight = 0.07 * (p.footHeight ?? 1.0);
  const footBottomOffset = footHeight * 0.82;

  // The head is cut to the body under it: HEAD_OF_BODY of the standing height for the default head, and a unit's own head proportions scale it from there.
  const belowHead = upperLegH + lowerLegH + footBottomOffset + torsoH + NECK_LENGTH;
  const headUnit = belowHead * HEAD_OF_BODY / (1 - HEAD_OF_BODY) * p.headSize / (0.216 * DEFAULT_PROPORTIONS.headSize * (DEFAULT_PROPORTIONS.headLength ?? 1.0));
  const headHeight = 0.216 * HEAD_SQUAT * headUnit * (p.headLength ?? 1.0);
  const headWidth = 0.192 * headUnit * (p.headWidth ?? 1.0);
  const headDepth = 0.176 * headUnit * (p.headDepth ?? 1.0);
  const headBase = Math.max(headHeight, headWidth, headDepth);

  // ─── Hip (root pivot for body) ───
  const hip = joint(`${name}_hip`, root);
  hip.position.y = (upperLegH + lowerLegH + footBottomOffset) * s;

  // ─── Torso ───
  const torso = joint(`${name}_torso`, hip);
  const torsoMesh = wedgeTorso(`${name}_torsoM`);
  torsoMesh.position.y = torsoH * s * 0.5;
  torsoMesh.parent = torso;

  // ─── Neck / Head ───
  const neck = joint(`${name}_neck`, torso);
  neck.position.y = torsoH * s;

  // Neck: a thin faceted column from just inside the shoulders up into the head, which stands on top of it
  const neckLength = NECK_LENGTH * s;
  if (options.showNeck !== false) {
    const neckH = neckLength * 1.3;
    const neckDTop = headWidth * 0.5 * s;
    const neckDBot = headWidth * 0.62 * s;
    const neckMesh = MeshBuilder.CreateCylinder(`${name}_neckM`, {
      height: neckH,
      diameterTop: neckDTop,
      diameterBottom: neckDBot,
      tessellation: radialSegments,
    }, scene);
    neckMesh.material = skinMat;
    neckMesh.position.y = neckLength * 0.5;
    neckMesh.parent = neck;
    allMeshes.push(neckMesh);
  }

  const headMesh = blockHead(
    `${name}_headM`,
    headBase,
    skinMat,
    new Vector3(
      headWidth / Math.max(headBase, 0.001),
      headHeight / Math.max(headBase, 0.001),
      headDepth / Math.max(headBase, 0.001),
    ),
  );
  headMesh.position.y = neckLength + headHeight * s * 0.5;
  headMesh.parent = neck;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(headMesh); // no halo off the self-lit head: it lay over the bead eyes and turned their black to the skin's navy

  const headTop = joint(`${name}_headTop`, neck);
  headTop.position.y = neckLength + headHeight * s;
  headTop.scaling.setAll(headUnit / (HAT_CUT_FOR_HEAD * p.headSize));

  // ─── Bead Eyes (small black beads, no sclera): set half into the flat of the face, just under the brow line ───
  const eyeDiam = headWidth * 0.17;
  const pupilDiam = headWidth * 0.02;
  const eyeSegs = 6;
  const eyeY = neckLength + headHeight * s * 0.56;
  const eyeZ = headDepth * s * 0.49;
  const eyeSpread = headWidth * s * 0.22;

  const leftEye = MeshBuilder.CreateSphere(`${name}_lEye`, { diameter: eyeDiam * s, segments: eyeSegs }, scene);
  leftEye.material = eyeMat;
  leftEye.position.set(-eyeSpread, eyeY, eyeZ);
  leftEye.parent = neck;
  allMeshes.push(leftEye);

  const rightEye = MeshBuilder.CreateSphere(`${name}_rEye`, { diameter: eyeDiam * s, segments: eyeSegs }, scene);
  rightEye.material = eyeMat;
  rightEye.position.set(eyeSpread, eyeY, eyeZ);
  rightEye.parent = neck;
  allMeshes.push(rightEye);

  const leftPupil = MeshBuilder.CreateSphere(`${name}_lPupil`, { diameter: pupilDiam * s, segments: eyeSegs }, scene);
  leftPupil.material = pupilMat;
  leftPupil.scaling = new Vector3(1, 1, 0.5);
  leftPupil.position.z = eyeDiam * s * 0.14;
  leftPupil.parent = leftEye;
  leftPupil.setEnabled(false);
  allMeshes.push(leftPupil);

  const rightPupil = MeshBuilder.CreateSphere(`${name}_rPupil`, { diameter: pupilDiam * s, segments: eyeSegs }, scene);
  rightPupil.material = pupilMat;
  rightPupil.scaling = new Vector3(1, 1, 0.5);
  rightPupil.position.z = eyeDiam * s * 0.14;
  rightPupil.parent = rightEye;
  rightPupil.setEnabled(false);
  allMeshes.push(rightPupil);

  // ─── Arms ───
  const armDepthScale = 0.88;
  const sleeveHead = upperArmTop * (options.showShoulderPads ? SLEEVE_HEAD_PLATE : SLEEVE_HEAD);
  const shoulderOffX = (Math.max(torsoTop, torsoBottom) * 0.48 + upperArmTop * 0.4) * s;
  const shoulderOffY = (torsoH - 0.08) * s;
  shoulderYoke(`${name}_yoke`, shoulderOffX / s, shoulderOffY / s).parent = torso;

  // Left arm
  const leftShoulder = joint(`${name}_lShoulder`, torso);
  leftShoulder.position.set(-shoulderOffX, shoulderOffY, 0);
  const leftUpperArm = tapered(
    `${name}_lUpperArm`,
    upperArmH,
    upperArmTop,
    elbowWidth,
    bodyMat,
    new Vector3(1, 1, armDepthScale),
    radialSegments,
    "bottom",
    undefined,
    sleeveHead,
  );
  leftUpperArm.position.y = -upperArmH * s * 0.5;
  leftUpperArm.parent = leftShoulder;
  const leftElbow = joint(`${name}_lElbow`, leftShoulder);
  leftElbow.position.y = -upperArmH * s;
  const leftLowerArm = tapered(
    `${name}_lLowerArm`,
    lowerArmH,
    elbowWidth,
    lowerArmBottom,
    skinMat,
    new Vector3(1, 1, armDepthScale * 0.92),
    radialSegments,
    "top",
    bodyMat,
    undefined,
    lowerArmTop * FOREARM_SWELL,
  );
  leftLowerArm.position.y = -lowerArmH * s * 0.5;
  leftLowerArm.parent = leftElbow;
  const leftHand = joint(`${name}_lHand`, leftElbow);
  leftHand.position.y = -lowerArmH * s;
  const leftHandMesh = mitt(`${name}_lHandM`, handWidth, skinMat);
  leftHandMesh.position.set(0, -handLength * s * 0.42, 0);
  leftHandMesh.parent = leftHand;

  // Right arm
  const rightShoulder = joint(`${name}_rShoulder`, torso);
  rightShoulder.position.set(shoulderOffX, shoulderOffY, 0);
  const rightUpperArm = tapered(
    `${name}_rUpperArm`,
    upperArmH,
    upperArmTop,
    elbowWidth,
    bodyMat,
    new Vector3(1, 1, armDepthScale),
    radialSegments,
    "bottom",
    undefined,
    sleeveHead,
  );
  rightUpperArm.position.y = -upperArmH * s * 0.5;
  rightUpperArm.parent = rightShoulder;
  const rightElbow = joint(`${name}_rElbow`, rightShoulder);
  rightElbow.position.y = -upperArmH * s;
  const rightLowerArm = tapered(
    `${name}_rLowerArm`,
    lowerArmH,
    elbowWidth,
    lowerArmBottom,
    skinMat,
    new Vector3(1, 1, armDepthScale * 0.92),
    radialSegments,
    "top",
    bodyMat,
    undefined,
    lowerArmTop * FOREARM_SWELL,
  );
  rightLowerArm.position.y = -lowerArmH * s * 0.5;
  rightLowerArm.parent = rightElbow;
  const rightHand = joint(`${name}_rHand`, rightElbow);
  rightHand.position.y = -lowerArmH * s;
  const rightHandMesh = mitt(`${name}_rHandM`, handWidth, skinMat);
  rightHandMesh.position.set(0, -handLength * s * 0.42, 0);
  rightHandMesh.parent = rightHand;

  // ─── Shoulder Pads (armored presets) ───
  if (options.showShoulderPads) {
    const padW = upperArmTop * 1.6;
    const padH = 0.06;
    const padD = upperArmTop * 1.4;
    const padMat = bodyMat; // colored same as body, preset tints it metallic

    const lPad = MeshBuilder.CreateCylinder(`${name}_lPad`, {
      height: padH * s,
      diameterTop: padW * 0.7 * s,
      diameterBottom: padW * s,
      tessellation: radialSegments,
    }, scene);
    lPad.scaling.z = padD / padW;
    lPad.material = padMat;
    lPad.position.y = upperArmH * s * 0.05;
    lPad.parent = leftShoulder;
    allMeshes.push(lPad);

    const rPad = MeshBuilder.CreateCylinder(`${name}_rPad`, {
      height: padH * s,
      diameterTop: padW * 0.7 * s,
      diameterBottom: padW * s,
      tessellation: radialSegments,
    }, scene);
    rPad.scaling.z = padD / padW;
    rPad.material = padMat;
    rPad.position.y = upperArmH * s * 0.05;
    rPad.parent = rightShoulder;
    allMeshes.push(rPad);
  }

  // ─── Legs ───
  const legDepthScale = 0.92;
  const pelvisW = Math.max(waist, shoulderOffX * 2 / s * PELVIS_OF_SHOULDERS, upperLegTop * 2 * THIGH_LAP);
  const pelvisH = upperLegTop * PELVIS_HEIGHT;
  const pelvisD = Math.max(waist * WAIST_DEPTH * torsoD / Math.max(chestTop, waist, 0.001), upperLegTop * legDepthScale) * 1.05;
  const hipOffX = (pelvisW - upperLegTop) * 0.5 * s;

  // Pelvis: a short block under the waist, drawn in at the top to the waist it meets, with a thigh under each lower corner
  const pelvis = MeshBuilder.CreateBox(`${name}_pelvis`, { width: pelvisW * s, height: pelvisH * s, depth: pelvisD * s }, scene);
  const pelvisPositions = pelvis.getVerticesData("position")!;
  for (let i = 0; i < pelvisPositions.length; i += 3) {
    if (pelvisPositions[i + 1] > 0) pelvisPositions[i] *= waist / pelvisW;
  }
  pelvis.setVerticesData("position", pelvisPositions);
  pelvis.position.y = -pelvisH * s * 0.2;
  pelvis.material = bodyMat;
  pelvis.parent = hip;
  allMeshes.push(pelvis);

  // Left leg
  const leftHipJ = joint(`${name}_lHip`, hip);
  leftHipJ.position.set(-hipOffX, 0, 0);
  const leftUpperLeg = tapered(
    `${name}_lUpperLeg`,
    upperLegH,
    upperLegTop,
    kneeWidth,
    bodyMat,
    new Vector3(1, 1, legDepthScale),
    radialSegments,
    "bottom",
    undefined,
    upperLegTop * THIGH_HEAD,
  );
  leftUpperLeg.position.y = -upperLegH * s * 0.5;
  leftUpperLeg.parent = leftHipJ;
  const leftKnee = joint(`${name}_lKnee`, leftHipJ);
  leftKnee.position.y = -upperLegH * s;
  const leftLowerLeg = tapered(
    `${name}_lLowerLeg`,
    lowerLegH,
    kneeWidth,
    lowerLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale * 0.94),
    radialSegments,
    "top",
    undefined,
    undefined,
    lowerLegTop * CALF_SWELL,
  );
  leftLowerLeg.position.y = -lowerLegH * s * 0.5;
  leftLowerLeg.parent = leftKnee;
  const leftFoot = foot(`${name}_lFootM`);
  leftFoot.parent = leftKnee;

  // Right leg
  const rightHipJ = joint(`${name}_rHip`, hip);
  rightHipJ.position.set(hipOffX, 0, 0);
  const rightUpperLeg = tapered(
    `${name}_rUpperLeg`,
    upperLegH,
    upperLegTop,
    kneeWidth,
    bodyMat,
    new Vector3(1, 1, legDepthScale),
    radialSegments,
    "bottom",
    undefined,
    upperLegTop * THIGH_HEAD,
  );
  rightUpperLeg.position.y = -upperLegH * s * 0.5;
  rightUpperLeg.parent = rightHipJ;
  const rightKnee = joint(`${name}_rKnee`, rightHipJ);
  rightKnee.position.y = -upperLegH * s;
  const rightLowerLeg = tapered(
    `${name}_rLowerLeg`,
    lowerLegH,
    kneeWidth,
    lowerLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale * 0.94),
    radialSegments,
    "top",
    undefined,
    undefined,
    lowerLegTop * CALF_SWELL,
  );
  rightLowerLeg.position.y = -lowerLegH * s * 0.5;
  rightLowerLeg.parent = rightKnee;
  const rightFoot = foot(`${name}_rFootM`);
  rightFoot.parent = rightKnee;

  // ─── Belt (at torso base / hip level) ───
  if (options.showBelt) {
    const beltRadius = waist * 0.54;
    const beltTube = beltRadius * 0.12;
    const belt = MeshBuilder.CreateTorus(`${name}_belt`, {
      diameter: beltRadius * 2 * s,
      thickness: beltTube * 2 * s,
      tessellation: radialSegments,
    }, scene);
    belt.material = bodyMat;
    belt.position.y = torsoH * s * 0.02; // just above hip joint
    belt.parent = torso;
    allMeshes.push(belt);
  }

  // Faceted matte read: hard edges on everything but the bead eyes.
  const beads = new Set<Mesh>([leftEye, rightEye, leftPupil, rightPupil]);
  for (const mesh of allMeshes) {
    if (!beads.has(mesh)) mesh.convertToFlatShadedMesh();
  }

  const metrics: BodyMetrics = {
    overallHeight: hip.position.y + torsoH * s + neckLength + headHeight * s,
    headTopY: hip.position.y + torsoH * s + neckLength + headHeight * s,
    shoulderWidth: shoulderOffX * 2,
    hipWidth: hipOffX * 2,
    handReachY: hip.position.y + shoulderOffY - upperArmH * s - lowerArmH * s,
    footBottomY: 0,
    head: { width: headWidth * s, height: headHeight * s, neck: neckLength },
    hand: { width: handWidth * s },
  };

  return {
    root, bodyMaterial: bodyMat, skinMaterial: skinMat, metrics, hip, torso, torsoMesh,
    neck, headMesh,
    leftShoulder, leftUpperArm, leftElbow, leftLowerArm,
    rightShoulder, rightUpperArm, rightElbow, rightLowerArm,
    leftHip: leftHipJ, leftUpperLeg, leftKnee, leftLowerLeg,
    rightHip: rightHipJ, rightUpperLeg, rightKnee, rightLowerLeg,
    rightHand, leftHand, headTop,
    leftEye, rightEye, leftPupil, rightPupil,
    allMeshes, allJoints,
  };
}
