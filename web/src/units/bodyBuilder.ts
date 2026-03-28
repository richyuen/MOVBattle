import {
  Scene, TransformNode, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3,
} from "@babylonjs/core";

/**
 * All the joint TransformNodes and meshes that make up a TABS-style articulated body.
 * Joints are TransformNodes whose rotation drives the limb wobble.
 */
export interface ArticulatedBody {
  root: TransformNode;

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
}

const DEFAULT_PROPORTIONS: BodyProportions = {
  scale: 1.0,
  bulk: 1.0,
  headSize: 1.0,
  armLength: 1.0,
  legLength: 1.0,
};

export function buildArticulatedBody(
  scene: Scene,
  name: string,
  proportions: Partial<BodyProportions> = {},
  bodyColor: Color3,
): ArticulatedBody {
  const p = { ...DEFAULT_PROPORTIONS, ...proportions };
  const s = p.scale;

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

  function box(n: string, w: number, h: number, d: number, mat: StandardMaterial): Mesh {
    const m = MeshBuilder.CreateBox(n, { width: w * s, height: h * s, depth: d * s }, scene);
    m.material = mat;
    allMeshes.push(m);
    return m;
  }
  function sphere(n: string, diam: number, mat: StandardMaterial): Mesh {
    const m = MeshBuilder.CreateSphere(n, { diameter: diam * s, segments: 8 }, scene);
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

  // ─── Hip (root pivot for body) ───
  const hip = joint(`${name}_hip`, root);
  hip.position.y = (0.55 + 0.35 * p.legLength) * s;

  // ─── Torso ───
  const torso = joint(`${name}_torso`, hip);
  const torsoW = 0.35 * p.bulk;
  const torsoH = 0.45;
  const torsoD = 0.2 * p.bulk;
  const torsoMesh = box(`${name}_torsoM`, torsoW, torsoH, torsoD, bodyMat);
  torsoMesh.position.y = torsoH * s * 0.5;
  torsoMesh.parent = torso;

  // ─── Neck / Head ───
  const neck = joint(`${name}_neck`, torso);
  neck.position.y = torsoH * s;
  const headDiam = 0.25 * p.headSize;
  const headMesh = sphere(`${name}_headM`, headDiam, skinMat);
  headMesh.position.y = headDiam * s * 0.5;
  headMesh.parent = neck;

  const headTop = joint(`${name}_headTop`, neck);
  headTop.position.y = headDiam * s;

  // ─── Arms ───
  const armW = 0.08;
  const upperArmH = 0.22 * p.armLength;
  const lowerArmH = 0.2 * p.armLength;
  const shoulderOffX = (torsoW * 0.5 + armW * 0.5) * s;
  const shoulderOffY = (torsoH - 0.06) * s;

  // Left arm
  const leftShoulder = joint(`${name}_lShoulder`, torso);
  leftShoulder.position.set(-shoulderOffX, shoulderOffY, 0);
  const leftUpperArm = box(`${name}_lUpperArm`, armW, upperArmH, armW, bodyMat);
  leftUpperArm.position.y = -upperArmH * s * 0.5;
  leftUpperArm.parent = leftShoulder;
  const leftElbow = joint(`${name}_lElbow`, leftShoulder);
  leftElbow.position.y = -upperArmH * s;
  const leftLowerArm = box(`${name}_lLowerArm`, armW * 0.9, lowerArmH, armW * 0.9, skinMat);
  leftLowerArm.position.y = -lowerArmH * s * 0.5;
  leftLowerArm.parent = leftElbow;
  const leftHand = joint(`${name}_lHand`, leftElbow);
  leftHand.position.y = -lowerArmH * s;

  // Right arm
  const rightShoulder = joint(`${name}_rShoulder`, torso);
  rightShoulder.position.set(shoulderOffX, shoulderOffY, 0);
  const rightUpperArm = box(`${name}_rUpperArm`, armW, upperArmH, armW, bodyMat);
  rightUpperArm.position.y = -upperArmH * s * 0.5;
  rightUpperArm.parent = rightShoulder;
  const rightElbow = joint(`${name}_rElbow`, rightShoulder);
  rightElbow.position.y = -upperArmH * s;
  const rightLowerArm = box(`${name}_rLowerArm`, armW * 0.9, lowerArmH, armW * 0.9, skinMat);
  rightLowerArm.position.y = -lowerArmH * s * 0.5;
  rightLowerArm.parent = rightElbow;
  const rightHand = joint(`${name}_rHand`, rightElbow);
  rightHand.position.y = -lowerArmH * s;

  // ─── Legs ───
  const legW = 0.1 * p.bulk;
  const upperLegH = 0.25 * p.legLength;
  const lowerLegH = 0.22 * p.legLength;
  const hipOffX = (torsoW * 0.25) * s;

  // Left leg
  const leftHipJ = joint(`${name}_lHip`, hip);
  leftHipJ.position.set(-hipOffX, 0, 0);
  const leftUpperLeg = box(`${name}_lUpperLeg`, legW, upperLegH, legW, bodyMat);
  leftUpperLeg.position.y = -upperLegH * s * 0.5;
  leftUpperLeg.parent = leftHipJ;
  const leftKnee = joint(`${name}_lKnee`, leftHipJ);
  leftKnee.position.y = -upperLegH * s;
  const leftLowerLeg = box(`${name}_lLowerLeg`, legW * 0.9, lowerLegH, legW * 0.9, bodyMat);
  leftLowerLeg.position.y = -lowerLegH * s * 0.5;
  leftLowerLeg.parent = leftKnee;

  // Right leg
  const rightHipJ = joint(`${name}_rHip`, hip);
  rightHipJ.position.set(hipOffX, 0, 0);
  const rightUpperLeg = box(`${name}_rUpperLeg`, legW, upperLegH, legW, bodyMat);
  rightUpperLeg.position.y = -upperLegH * s * 0.5;
  rightUpperLeg.parent = rightHipJ;
  const rightKnee = joint(`${name}_rKnee`, rightHipJ);
  rightKnee.position.y = -upperLegH * s;
  const rightLowerLeg = box(`${name}_rLowerLeg`, legW * 0.9, lowerLegH, legW * 0.9, bodyMat);
  rightLowerLeg.position.y = -lowerLegH * s * 0.5;
  rightLowerLeg.parent = rightKnee;

  return {
    root, hip, torso, torsoMesh,
    neck, headMesh,
    leftShoulder, leftUpperArm, leftElbow, leftLowerArm,
    rightShoulder, rightUpperArm, rightElbow, rightLowerArm,
    leftHip: leftHipJ, leftUpperLeg, leftKnee, leftLowerLeg,
    rightHip: rightHipJ, rightUpperLeg, rightKnee, rightLowerLeg,
    rightHand, leftHand, headTop,
    allMeshes, allJoints,
  };
}
