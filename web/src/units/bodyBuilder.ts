import {
  Scene, TransformNode, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3,
} from "@babylonjs/core";

/**
 * All the joint TransformNodes and meshes that make up a TABS-style articulated body.
 * Joints are TransformNodes whose rotation drives the limb wobble.
 */
export interface ArticulatedBody {
  root: TransformNode;
  bodyMaterial: StandardMaterial;
  skinMaterial: StandardMaterial;
  metrics: BodyMetrics;

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

  // All meshes for material assignment
  allMeshes: Mesh[];
  // All joints for animation
  allJoints: TransformNode[];
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
}

const DEFAULT_PROPORTIONS: BodyProportions = {
  scale: 1.0,
  bulk: 1.0,
  headSize: 1.0,
  armLength: 1.0,
  legLength: 1.0,
  headLength: 1.22,
  headWidth: 0.86,
  headDepth: 0.82,
  torsoWidth: 0.92,
  torsoDepth: 0.9,
  torsoRoundness: 1.0,
  upperArmWidth: 0.95,
  lowerArmWidth: 0.82,
  upperLegWidth: 1.0,
  lowerLegWidth: 0.82,
  limbTaper: 1.0,
  handSize: 1.0,
  footLength: 1.0,
  footWidth: 1.0,
  footHeight: 1.0,
};

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
  const radialSegments = detailLevel === "hero" ? 14 : detailLevel === "operator" ? 8 : 10;
  const sphereSegments = detailLevel === "hero" ? 14 : detailLevel === "operator" ? 8 : 12;

  const allMeshes: Mesh[] = [];
  const allJoints: TransformNode[] = [];

  // Shared body material
  const bodyMat = new StandardMaterial(`${name}_body`, scene);
  bodyMat.diffuseColor = bodyColor;
  bodyMat.specularColor = new Color3(0.15, 0.15, 0.15);

  // Skin material (slightly lighter for head/hands)
  const skinMat = new StandardMaterial(`${name}_skin`, scene);
  skinMat.diffuseColor = new Color3(0.85, 0.72, 0.6);
  skinMat.specularColor = new Color3(0.1, 0.1, 0.1);

  function sphere(
    n: string,
    diameter: number,
    mat: StandardMaterial,
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
    mat: StandardMaterial,
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
  const torsoH = 0.46;
  const torsoD = 0.21 * Math.max(0.75, p.bulk * 0.92) * (p.torsoDepth ?? 1.0);
  const torsoRoundness = Math.max(0.6, p.torsoRoundness ?? 1.0);
  const torsoTop = torsoW * (0.86 + torsoRoundness * 0.04);
  const torsoBottom = torsoW * (0.96 + torsoRoundness * 0.08);

  const headHeight = 0.27 * p.headSize * (p.headLength ?? 1.0);
  const headWidth = 0.24 * p.headSize * (p.headWidth ?? 1.0);
  const headDepth = 0.22 * p.headSize * (p.headDepth ?? 1.0);
  const headBase = Math.max(headHeight, headWidth, headDepth);

  const upperArmH = 0.24 * p.armLength;
  const lowerArmH = 0.22 * p.armLength;
  const upperArmTop = 0.09 * Math.max(0.8, p.bulk * 0.95) * (p.upperArmWidth ?? 1.0);
  const upperArmBottom = upperArmTop * Math.max(0.62, 0.82 - limbTaper * 0.12);
  const lowerArmTop = upperArmBottom * 0.92;
  const lowerArmBottom = lowerArmTop * Math.max(0.58, 0.8 - limbTaper * 0.14) * (p.lowerArmWidth ?? 1.0);
  const handDiameter = 0.1 * Math.max(0.8, p.headSize * 0.9) * (p.handSize ?? 1.0);

  const upperLegH = 0.28 * p.legLength;
  const lowerLegH = 0.25 * p.legLength;
  const upperLegTop = 0.12 * p.bulk * (p.upperLegWidth ?? 1.0);
  const upperLegBottom = upperLegTop * Math.max(0.72, 0.9 - limbTaper * 0.1);
  const lowerLegTop = upperLegBottom * 0.96;
  const lowerLegBottom = lowerLegTop * Math.max(0.58, 0.8 - limbTaper * 0.14) * (p.lowerLegWidth ?? 1.0);
  const footLength = 0.18 * Math.max(0.85, p.bulk * 0.92) * (p.footLength ?? 1.0);
  const footWidth = 0.11 * Math.max(0.85, p.bulk * 0.95) * (p.footWidth ?? 1.0);
  const footHeight = 0.07 * (p.footHeight ?? 1.0);
  const footBase = Math.max(footLength, footWidth, footHeight);
  const footBottomOffset = footHeight * 0.82;

  // ─── Hip (root pivot for body) ───
  const hip = joint(`${name}_hip`, root);
  hip.position.y = (upperLegH + lowerLegH + footBottomOffset) * s;

  // ─── Torso ───
  const torso = joint(`${name}_torso`, hip);
  const torsoMesh = tapered(
    `${name}_torsoM`,
    torsoH,
    torsoTop,
    torsoBottom,
    bodyMat,
    new Vector3(1, 1, torsoD / Math.max(torsoTop, torsoBottom, 0.001)),
  );
  torsoMesh.position.y = torsoH * s * 0.5;
  torsoMesh.parent = torso;

  // ─── Neck / Head ───
  const neck = joint(`${name}_neck`, torso);
  neck.position.y = torsoH * s;
  const headMesh = sphere(
    `${name}_headM`,
    headBase,
    skinMat,
    new Vector3(
      headWidth / Math.max(headBase, 0.001),
      headHeight / Math.max(headBase, 0.001),
      headDepth / Math.max(headBase, 0.001),
    ),
  );
  headMesh.position.y = headHeight * s * 0.5;
  headMesh.parent = neck;

  const headTop = joint(`${name}_headTop`, neck);
  headTop.position.y = headHeight * s;

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
  const leftHandMesh = sphere(
    `${name}_lHandM`,
    handDiameter,
    skinMat,
    new Vector3(0.88, 0.78, 1.08),
    Math.max(6, sphereSegments - 2),
  );
  leftHandMesh.position.set(-0.01 * s, -handDiameter * s * 0.08, handDiameter * s * 0.08);
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
  const rightHandMesh = sphere(
    `${name}_rHandM`,
    handDiameter,
    skinMat,
    new Vector3(0.88, 0.78, 1.08),
    Math.max(6, sphereSegments - 2),
  );
  rightHandMesh.position.set(0.01 * s, -handDiameter * s * 0.08, handDiameter * s * 0.08);
  rightHandMesh.parent = rightHand;

  // ─── Legs ───
  const legDepthScale = 0.92;
  const hipOffX = (Math.max(torsoTop, torsoBottom) * 0.22) * s;

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
  const leftFoot = sphere(
    `${name}_lFootM`,
    footBase,
    bodyMat,
    new Vector3(
      footWidth / Math.max(footBase, 0.001),
      footHeight / Math.max(footBase, 0.001),
      footLength / Math.max(footBase, 0.001),
    ),
    Math.max(6, sphereSegments - 2),
  );
  leftFoot.position.set(0, -(lowerLegH + footHeight * 0.32) * s, footLength * s * 0.18);
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
  const rightFoot = sphere(
    `${name}_rFootM`,
    footBase,
    bodyMat,
    new Vector3(
      footWidth / Math.max(footBase, 0.001),
      footHeight / Math.max(footBase, 0.001),
      footLength / Math.max(footBase, 0.001),
    ),
    Math.max(6, sphereSegments - 2),
  );
  rightFoot.position.set(0, -(lowerLegH + footHeight * 0.32) * s, footLength * s * 0.18);
  rightFoot.parent = rightKnee;

  const metrics: BodyMetrics = {
    overallHeight: hip.position.y + torsoH * s + headHeight * s,
    headTopY: hip.position.y + torsoH * s + headHeight * s,
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
    allMeshes, allJoints,
  };
}
