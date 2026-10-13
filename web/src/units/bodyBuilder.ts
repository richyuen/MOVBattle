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

/** TABS silhouette: a tall block of a head on long limbs a good quarter as thick as the torso is wide, so the torso is the wide block. Applied on top of every unit's own proportions. */
const LIMB_THIN = 1.12;
/** The head sizes itself from the body it stands on: this share of the standing height for default proportions, a little under a fifth. */
const HEAD_OF_BODY = 0.18;
/** The head block's bevelled corners sit this share of the way out to its flat sides: 1 is a plain box, 0.41 a regular octagon. */
const HEAD_CORNER = 0.55;
/** Hats, crowns and halos were cut for a round head this many head units across, less the corners a block has: the hat anchor scales them up to the head they now sit on. */
const HAT_CUT_FOR_HEAD = 0.85;
/** The head stands clear of the shoulders on a neck this long, a third of its own height: head, eyes and hat anchor all ride on top of it. */
const NECK_LENGTH = 0.07;
/** Arms and legs are stretched by this much over their old segment lengths, so the body is some six and a half heads tall and the hands hang to mid thigh. */
const LIMB_STRETCH = 1.16;
/** A mitt is sized from the sleeve it hangs from and not from the head: this many sleeve-top widths across its longest side. */
const MITT_FROM_SLEEVE = 1.7;
/** Sleeves and thighs are a little fuller than the forearms and shins they end in: more made them square puffed blocks. */
const SLEEVE_BULK = 1.05;
/** A limb narrows in one unbroken line: the forearm and shin start at the width the sleeve and thigh end at, with no step at the joint, and run down to a wrist and ankle no thinner than this share of it. */
const LOWER_LIMB_MIN_TAPER = 0.6;
/** Feet are sized from the shin as if it kept this share of its width to the ankle, so the foot is a boot wider than the ankle above it. */
const FOOT_ANKLE = 0.85;
/** Torso wedge: the chest line sits this far up from the middle of the torso (1 is the top), a little wider than the chest, and above it the shoulders slope in to this share of the chest; the waist keeps this share of its depth. */
const CHEST_LINE = 0.36;
const CHEST_SWELL = 1.05;
const SHOULDER_SLOPE = 0.8;
const WAIST_DEPTH = 0.85;

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
  ): Mesh {
    const m = MeshBuilder.CreateCylinder(n, {
      height: height * s,
      diameterTop: diameterTop * s,
      diameterBottom: diameterBottom * s,
      tessellation,
    }, scene);
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
  /** Head: a tall flat-faced block and not a ball. Four flat sides with the face square to the front and narrow bevels at the corners, widest at the brow, under a flat crown and drawn in to a narrower flat jaw. */
  function blockHead(n: string, size: number, mat: PBRMetallicRoughnessMaterial, scaling: Vector3): Mesh {
    const m = MeshBuilder.CreateCylinder(n, { height: size * s, diameter: size * s, tessellation: 8, subdivisions: 2 }, scene);
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
      const ring = y > half * 0.5 ? 0.9 : y < -half * 0.5 ? 0.78 : 1;
      positions[i] = x * ring;
      positions[i + 1] = ring === 1 ? half * 0.2 : y;
      positions[i + 2] = z * ring;
    }
    m.setVerticesData("position", positions);
    m.refreshBoundingInfo();
    m.scaling.copyFrom(scaling);
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  /** Mitt hand: a flat thumbless paddle cut from a box and not a ball. Square across the fingertips, wider there than the wrist it hangs from, drawn in to the wrist at its top and thin through the palm. */
  function mitt(n: string, size: number, mat: PBRMetallicRoughnessMaterial): Mesh {
    const m = MeshBuilder.CreateBox(n, { width: size * s * 0.66, height: size * s * 0.84, depth: size * s * 0.24 }, scene);
    const positions = m.getVerticesData("position")!;
    for (let i = 0; i < positions.length; i += 3) {
      // The wrist end narrows to the forearm; the fingertip end keeps its full width and thins to a blunt edge.
      if (positions[i + 1] > 0) positions[i] *= 0.6;
      else positions[i + 2] *= 0.7;
    }
    m.setVerticesData("position", positions);
    m.convertToFlatShadedMesh();
    m.refreshBoundingInfo();
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  /** Foot: a wedge under the ankle with the heel just behind the shin and the rest of it out in front, narrowing and thinning to the toe. */
  function foot(n: string): Mesh {
    const m = MeshBuilder.CreateBox(n, { width: footWidth * s, height: footHeight * s, depth: footLength * s }, scene);
    const positions = m.getVerticesData("position")!;
    for (let i = 0; i < positions.length; i += 3) {
      if (positions[i + 2] <= 0) continue;
      positions[i] *= 0.5;
      if (positions[i + 1] > 0) positions[i + 1] *= 0.2;
    }
    m.setVerticesData("position", positions);
    m.convertToFlatShadedMesh();
    m.position.set(0, -(lowerLegH + footHeight * 0.32) * s, footLength * s * 0.25);
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
  const handDiameter = upperArmTop * MITT_FROM_SLEEVE * (p.handSize ?? 1.0);

  const upperLegH = 0.308 * LIMB_STRETCH * p.legLength;
  const lowerLegH = 0.275 * LIMB_STRETCH * p.legLength;
  const upperLegTop = 0.12 * LIMB_THIN * SLEEVE_BULK * p.bulk * (p.upperLegWidth ?? 1.0);
  const upperLegBottom = upperLegTop * Math.max(0.72, 0.9 - limbTaper * 0.1);
  const lowerLegTop = upperLegBottom;
  const lowerLegBottom = lowerLegTop * Math.max(LOWER_LIMB_MIN_TAPER, 0.8 - limbTaper * 0.14) * (p.lowerLegWidth ?? 1.0);
  // Feet are low flat-sided stubs wider than the tapered ankle they sit under, about one and a half times as long as wide,
  // so a leg ends in a foot pointing forward and not in a point, and the shin never stands on a plinth.
  const footAnkle = lowerLegTop * FOOT_ANKLE * (p.lowerLegWidth ?? 1.0);
  const footLength = footAnkle * 1.7 * (p.footLength ?? 1.0);
  const footWidth = footAnkle * 1.1 * (p.footWidth ?? 1.0);
  const footHeight = 0.07 * (p.footHeight ?? 1.0);
  const footBottomOffset = footHeight * 0.82;

  // The head is cut to the body under it: HEAD_OF_BODY of the standing height for the default head, and a unit's own head proportions scale it from there.
  const belowHead = upperLegH + lowerLegH + footBottomOffset + torsoH + NECK_LENGTH;
  const headUnit = belowHead * HEAD_OF_BODY / (1 - HEAD_OF_BODY) * p.headSize / (0.216 * DEFAULT_PROPORTIONS.headSize * (DEFAULT_PROPORTIONS.headLength ?? 1.0));
  const headHeight = 0.216 * headUnit * (p.headLength ?? 1.0);
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
  const shoulderOffX = (Math.max(torsoTop, torsoBottom) * 0.48 + upperArmTop * 0.4) * s;
  const shoulderOffY = (torsoH - 0.08) * s;

  // Left arm
  const leftShoulder = joint(`${name}_lShoulder`, torso);
  leftShoulder.position.set(-shoulderOffX, shoulderOffY, 0);
  const leftUpperArm = tapered(
    `${name}_lUpperArm`,
    upperArmH,
    upperArmTop,
    upperArmBottom,
    bodyMat,
    new Vector3(1, 1, armDepthScale),
  );
  leftUpperArm.position.y = -upperArmH * s * 0.5;
  leftUpperArm.parent = leftShoulder;
  const leftElbow = joint(`${name}_lElbow`, leftShoulder);
  leftElbow.position.y = -upperArmH * s;
  const leftLowerArm = tapered(
    `${name}_lLowerArm`,
    lowerArmH,
    lowerArmTop,
    lowerArmBottom,
    skinMat,
    new Vector3(1, 1, armDepthScale * 0.92),
  );
  leftLowerArm.position.y = -lowerArmH * s * 0.5;
  leftLowerArm.parent = leftElbow;
  const leftHand = joint(`${name}_lHand`, leftElbow);
  leftHand.position.y = -lowerArmH * s;
  const leftHandMesh = mitt(`${name}_lHandM`, handDiameter, skinMat);
  leftHandMesh.position.set(-0.01 * s, -handDiameter * s * 0.3, handDiameter * s * 0.08);
  leftHandMesh.parent = leftHand;

  // Right arm
  const rightShoulder = joint(`${name}_rShoulder`, torso);
  rightShoulder.position.set(shoulderOffX, shoulderOffY, 0);
  const rightUpperArm = tapered(
    `${name}_rUpperArm`,
    upperArmH,
    upperArmTop,
    upperArmBottom,
    bodyMat,
    new Vector3(1, 1, armDepthScale),
  );
  rightUpperArm.position.y = -upperArmH * s * 0.5;
  rightUpperArm.parent = rightShoulder;
  const rightElbow = joint(`${name}_rElbow`, rightShoulder);
  rightElbow.position.y = -upperArmH * s;
  const rightLowerArm = tapered(
    `${name}_rLowerArm`,
    lowerArmH,
    lowerArmTop,
    lowerArmBottom,
    skinMat,
    new Vector3(1, 1, armDepthScale * 0.92),
  );
  rightLowerArm.position.y = -lowerArmH * s * 0.5;
  rightLowerArm.parent = rightElbow;
  const rightHand = joint(`${name}_rHand`, rightElbow);
  rightHand.position.y = -lowerArmH * s;
  const rightHandMesh = mitt(`${name}_rHandM`, handDiameter, skinMat);
  rightHandMesh.position.set(0.01 * s, -handDiameter * s * 0.3, handDiameter * s * 0.08);
  rightHandMesh.parent = rightHand;

  // ─── Shoulder Caps (hide joint seams) ───
  // Wider than the sleeve top, so the cap shows as a rounded shoulder on the torso corner and not only a seam filler
  // On a breastplate the cap is small and flattened into its corner: a full ball there reads as a separate bead
  const shoulderCapDiam = upperArmTop * (options.showShoulderPads ? 1.1 : 1.3);
  const capScale = options.showShoulderPads ? new Vector3(1, 0.7, 1) : Vector3.One();
  const lShoulderCap = sphere(`${name}_lShoulderCap`, shoulderCapDiam, bodyMat, capScale, capSegments);
  lShoulderCap.parent = leftShoulder;
  const rShoulderCap = sphere(`${name}_rShoulderCap`, shoulderCapDiam, bodyMat, capScale, capSegments);
  rShoulderCap.parent = rightShoulder;

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
  const hipOffX = (torsoBottom * 0.28) * s;

  // Left leg
  const leftHipJ = joint(`${name}_lHip`, hip);
  leftHipJ.position.set(-hipOffX, 0, 0);
  const leftUpperLeg = tapered(
    `${name}_lUpperLeg`,
    upperLegH,
    upperLegTop,
    upperLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale),
  );
  leftUpperLeg.position.y = -upperLegH * s * 0.5;
  leftUpperLeg.parent = leftHipJ;
  const leftKnee = joint(`${name}_lKnee`, leftHipJ);
  leftKnee.position.y = -upperLegH * s;
  const leftLowerLeg = tapered(
    `${name}_lLowerLeg`,
    lowerLegH,
    lowerLegTop,
    lowerLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale * 0.94),
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
    upperLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale),
  );
  rightUpperLeg.position.y = -upperLegH * s * 0.5;
  rightUpperLeg.parent = rightHipJ;
  const rightKnee = joint(`${name}_rKnee`, rightHipJ);
  rightKnee.position.y = -upperLegH * s;
  const rightLowerLeg = tapered(
    `${name}_rLowerLeg`,
    lowerLegH,
    lowerLegTop,
    lowerLegBottom,
    bodyMat,
    new Vector3(1, 1, legDepthScale * 0.94),
  );
  rightLowerLeg.position.y = -lowerLegH * s * 0.5;
  rightLowerLeg.parent = rightKnee;
  const rightFoot = foot(`${name}_rFootM`);
  rightFoot.parent = rightKnee;

  // ─── Hip Caps (hide joint seams) ───
  const hipCapDiam = upperLegTop * 1.1;
  const lHipCap = sphere(`${name}_lHipCap`, hipCapDiam, bodyMat, Vector3.One(), capSegments);
  lHipCap.parent = leftHipJ;
  const rHipCap = sphere(`${name}_rHipCap`, hipCapDiam, bodyMat, Vector3.One(), capSegments);
  rHipCap.parent = rightHipJ;

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
