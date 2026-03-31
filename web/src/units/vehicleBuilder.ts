import {
  Scene, TransformNode, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3,
} from "@babylonjs/core";
import { buildArticulatedBody } from "./bodyBuilder";
import type { ArticulatedBody, BodyMetrics } from "./bodyBuilder";

/**
 * IDs of units that should be built as vehicles/equipment rather than humanoids.
 */
export const VEHICLE_UNIT_IDS = new Set([
  "medieval.catapult",
  "ancient.ballista",
  "dynasty.hwacha",
  "pirate.cannon",
  "renaissance.da_vinci_tank",
  "farmer.wheelbarrow",
  "ancient.minotaur",
  "tribal.mammoth",
  "spooky.pumpkin_catapult",
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
    case "dynasty.hwacha": return buildHwacha(scene, bodyColor);
    case "pirate.cannon": return buildCannon(scene, bodyColor);
    case "renaissance.da_vinci_tank": return buildDaVinciTank(scene, bodyColor);
    case "farmer.wheelbarrow": return buildWheelbarrow(scene, bodyColor);
    case "ancient.minotaur": return buildMinotaur(scene, bodyColor);
    case "tribal.mammoth": return buildMammoth(scene, bodyColor);
    case "spooky.pumpkin_catapult": return buildCatapult(scene, bodyColor);
    case "legacy.tank": return buildLegacyTank(scene, bodyColor);
    case "secret.bomb_cannon": return buildBombCannon(scene, bodyColor, options);
    case "secret.gatling_gun": return buildGatlingGun(scene, bodyColor, options);
    case "good.sacred_elephant": return buildMammoth(scene, bodyColor);
    default: return buildCatapult(scene, bodyColor);
  }
}

function makeMat(scene: Scene, color: Color3): StandardMaterial {
  const m = new StandardMaterial("vmat", scene);
  m.diffuseColor = color;
  m.specularColor = new Color3(0.15, 0.15, 0.15);
  return m;
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
): ArticulatedBody {
  const bodyMaterial = (mainMesh.material as StandardMaterial) ?? makeMat(scene, new Color3(0.55, 0.45, 0.35));
  const skinMaterial = (headMesh?.material as StandardMaterial) ?? bodyMaterial;
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
    allMeshes, allJoints,
  };
}

interface VehicleOperator {
  headMesh: Mesh;
  headTopY: number;
}

// Helper to add an operator (small person) at a given position
function addOperator(
  scene: Scene, root: TransformNode, allMeshes: Mesh[],
  x: number, y: number, z: number, color: Color3,
): VehicleOperator {
  const operator = buildArticulatedBody(
    scene,
    `vehicle_operator_${Math.random().toString(36).slice(2, 6)}`,
    {
      scale: 0.46,
      bulk: 0.72,
      headSize: 1.04,
      armLength: 0.9,
      legLength: 0.92,
      headLength: 1.28,
      headWidth: 0.82,
      torsoWidth: 0.82,
      torsoDepth: 0.78,
      torsoRoundness: 1.1,
      upperArmWidth: 0.82,
      lowerArmWidth: 0.74,
      upperLegWidth: 0.9,
      lowerLegWidth: 0.76,
      limbTaper: 1.08,
      handSize: 1.06,
      footLength: 1.1,
      footWidth: 0.94,
      footHeight: 0.86,
    },
    color,
    { detailLevel: "operator" },
  );
  operator.root.parent = root;
  operator.root.position.set(x, y, z);
  allMeshes.push(...operator.allMeshes);
  return {
    headMesh: operator.headMesh,
    headTopY: operator.root.position.y + operator.metrics.headTopY,
  };
}

// ═══════════════════════ CATAPULT ═══════════════════════
// Fires FORWARD (+Z). Arm swings over the top toward +Z.
function buildCatapult(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("catapult_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));

  // Base platform (longer along Z = firing axis)
  const base = MeshBuilder.CreateBox("base", { width: 1.0, height: 0.2, depth: 1.6 }, scene);
  base.position.y = 0.4; base.parent = root; base.material = wood; allMeshes.push(base);

  // Wheels (on the sides, X axis)
  for (const xOff of [-0.45, 0.45]) {
    for (const zOff of [-0.5, 0.5]) {
      const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.08, diameter: 0.5, tessellation: 12 }, scene);
      wheel.position.set(xOff, 0.25, zOff);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);
    }
  }

  // Upright frame (straddles the base, perpendicular to firing direction)
  for (const xOff of [-0.35, 0.35]) {
    const post = MeshBuilder.CreateBox("post", { width: 0.1, height: 1.0, depth: 0.1 }, scene);
    post.position.set(xOff, 1.0, 0);
    post.parent = root; post.material = wood; allMeshes.push(post);
  }
  const crossbar = MeshBuilder.CreateBox("crossbar", { width: 0.8, height: 0.1, depth: 0.1 }, scene);
  crossbar.position.set(0, 1.5, 0);
  crossbar.parent = root; crossbar.material = wood; allMeshes.push(crossbar);

  // Throwing arm (pivots at crossbar, extends along Z)
  const arm = MeshBuilder.CreateBox("arm", { width: 0.08, height: 0.08, depth: 1.8 }, scene);
  arm.position.set(0, 1.55, 0.2);
  arm.rotation.x = 0.4; // tilted: bucket end up toward +Z
  arm.parent = root; arm.material = wood; allMeshes.push(arm);

  // Bucket at front end of arm (+Z)
  const bucket = MeshBuilder.CreateBox("bucket", { width: 0.25, height: 0.12, depth: 0.2 }, scene);
  bucket.position.set(0, 2.0, 0.7);
  bucket.parent = root; bucket.material = metal; allMeshes.push(bucket);

  // Counterweight at back end (-Z)
  const cw = MeshBuilder.CreateBox("cw", { width: 0.2, height: 0.2, depth: 0.2 }, scene);
  cw.position.set(0, 1.0, -0.5);
  cw.parent = root; cw.material = metal; allMeshes.push(cw);

  // Operator sitting beside, behind the frame
  const operator = addOperator(scene, root, allMeshes, 0.4, 0.72, -0.5, color);

  return wrapAsBody(scene, root, base, allMeshes, operator.headMesh, makeBodyMetrics(operator.headTopY, 0.8, 0.45, 0.8));
}

function buildBombCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const body = buildCannon(scene, color, options);
  const root = body.root;
  const barrel = MeshBuilder.CreateCylinder("bombBarrel", { height: 1.0, diameter: 0.26, tessellation: 16 }, scene);
  barrel.position.set(0, 0.86, 0.4);
  barrel.rotation.x = Math.PI / 2 - 0.18;
  barrel.parent = root;
  barrel.material = makeMat(scene, new Color3(0.22, 0.22, 0.26));
  body.allMeshes.push(barrel);
  const bomb = MeshBuilder.CreateSphere("bombRound", { diameter: 0.22, segments: 8 }, scene);
  bomb.position.set(0, 0.92, 0.75);
  bomb.parent = root;
  bomb.material = makeMat(scene, new Color3(0.12, 0.12, 0.12));
  body.allMeshes.push(bomb);
  return body;
}

function buildGatlingGun(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("gatling_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.45, 0.32, 0.18));
  const metal = makeMat(scene, new Color3(0.32, 0.34, 0.38));

  const chassis = MeshBuilder.CreateBox("gatlingChassis", { width: 0.9, height: 0.18, depth: 1.2 }, scene);
  chassis.position.y = 0.45;
  chassis.parent = root;
  chassis.material = wood;
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
  return wrapAsBody(
    scene,
    root,
    chassis,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.62, 0.8, 0.48, 0.84),
  );
}

// ═══════════════════════ BALLISTA ═══════════════════════
// Fires FORWARD (+Z). Bolt points along +Z. Bow arms at the front.
function buildBallista(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("ballista_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));

  // Base (longer along Z)
  const base = MeshBuilder.CreateBox("base", { width: 0.8, height: 0.15, depth: 1.2 }, scene);
  base.position.y = 0.35; base.parent = root; base.material = wood; allMeshes.push(base);

  // Wheels (on sides, X axis)
  for (const xOff of [-0.35, 0.35]) {
    const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.07, diameter: 0.45, tessellation: 12 }, scene);
    wheel.position.set(xOff, 0.22, -0.2);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);
  }

  // Track/rail along Z
  const rail = MeshBuilder.CreateBox("rail", { width: 0.1, height: 0.08, depth: 1.4 }, scene);
  rail.position.set(0, 0.52, 0);
  rail.parent = root; rail.material = wood; allMeshes.push(rail);

  // Bow arms at the front (+Z), angling outward on X
  for (const side of [-1, 1]) {
    const bowArm = MeshBuilder.CreateBox("bowarm", { width: 0.5, height: 0.06, depth: 0.06 }, scene);
    bowArm.position.set(side * 0.15, 0.7, 0.5);
    bowArm.rotation.y = side * 0.3;
    bowArm.parent = root; bowArm.material = wood; allMeshes.push(bowArm);
  }

  // String (horizontal across bow arms, along X)
  const string = MeshBuilder.CreateCylinder("string", { height: 0.65, diameter: 0.015, tessellation: 4 }, scene);
  string.position.set(0, 0.55, 0.45);
  string.rotation.z = Math.PI / 2; // along X
  string.parent = root; string.material = makeMat(scene, new Color3(0.7, 0.6, 0.4)); allMeshes.push(string);

  // Loaded bolt (points along +Z)
  const bolt = MeshBuilder.CreateCylinder("bolt", { height: 0.8, diameter: 0.04, tessellation: 4 }, scene);
  bolt.position.set(0, 0.58, 0.1);
  bolt.rotation.x = Math.PI / 2; // along Z
  bolt.parent = root; bolt.material = metal; allMeshes.push(bolt);

  // Operator behind (-Z)
  const operator = addOperator(scene, root, allMeshes, 0.25, 0.72, -0.5, color);

  return wrapAsBody(scene, root, base, allMeshes, operator.headMesh, makeBodyMetrics(operator.headTopY, 0.72, 0.4, 0.78));
}

// ═══════════════════════ HWACHA ═══════════════════════
// TABS-style hwacha: wide wooden cart with large, steeply-tilted rack of tube holes
// filled with rocket arrows pointing upward. Big spoked wheels, cart handles behind.
function buildHwacha(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("hwacha_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const darkWood = makeMat(scene, new Color3(0.35, 0.22, 0.1));
  const red = makeMat(scene, new Color3(0.72, 0.18, 0.12));
  const shaft = makeMat(scene, new Color3(0.6, 0.5, 0.3));
  const tubeMat = makeMat(scene, new Color3(0.42, 0.28, 0.14));

  // ─── Cart base ───
  const base = MeshBuilder.CreateBox("base", { width: 1.3, height: 0.1, depth: 1.2 }, scene);
  base.position.y = 0.4; base.parent = root; base.material = wood; allMeshes.push(base);

  // Side rails along the cart
  for (const xOff of [-0.6, 0.6]) {
    const sideRail = MeshBuilder.CreateBox("srail", { width: 0.06, height: 0.08, depth: 1.2 }, scene);
    sideRail.position.set(xOff, 0.45, 0);
    sideRail.parent = root; sideRail.material = darkWood; allMeshes.push(sideRail);
  }

  // ─── Large spoked wheels ───
  for (const xOff of [-0.6, 0.6]) {
    const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.08, diameter: 0.7, tessellation: 16 }, scene);
    wheel.position.set(xOff, 0.35, -0.1);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = darkWood; allMeshes.push(wheel);
    // Hub
    const hub = MeshBuilder.CreateCylinder("hub", { height: 0.1, diameter: 0.12, tessellation: 8 }, scene);
    hub.position.set(xOff, 0.35, -0.1);
    hub.rotation.z = Math.PI / 2;
    hub.parent = root; hub.material = wood; allMeshes.push(hub);
    // Spokes
    for (let s = 0; s < 8; s++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: 0.025, height: 0.3, depth: 0.025 }, scene);
      spoke.position.set(xOff, 0.35, -0.1);
      spoke.rotation.set(0, 0, s * Math.PI / 8);
      spoke.parent = root; spoke.material = wood; allMeshes.push(spoke);
    }
  }

  // ─── Cart handles extending behind (-Z) ───
  for (const xOff of [-0.2, 0.2]) {
    const handle = MeshBuilder.CreateBox("handle", { width: 0.05, height: 0.05, depth: 0.7 }, scene);
    handle.position.set(xOff, 0.38, -0.85);
    handle.parent = root; handle.material = darkWood; allMeshes.push(handle);
  }

  // ─── Arrow rack - steeply tilted (~65° from horizontal) ───
  const rackPivot = new TransformNode("rackPivot", scene);
  rackPivot.position.set(0, 0.45, 0.15);
  rackPivot.rotation.x = -1.15; // ~65° tilt — arrows point upward and forward
  rackPivot.parent = root;

  // Main rack box (wide, tall front face with depth for tubes)
  const rackBody = MeshBuilder.CreateBox("rackBody", { width: 1.1, height: 0.9, depth: 0.45 }, scene);
  rackBody.position.set(0, 0.45, 0);
  rackBody.parent = rackPivot; rackBody.material = wood; allMeshes.push(rackBody);

  // Frame edges around the rack face
  for (const xOff of [-0.55, 0.55]) {
    const vFrame = MeshBuilder.CreateBox("vf", { width: 0.06, height: 0.95, depth: 0.5 }, scene);
    vFrame.position.set(xOff, 0.45, 0);
    vFrame.parent = rackPivot; vFrame.material = darkWood; allMeshes.push(vFrame);
  }
  for (const yOff of [0.0, 0.9]) {
    const hFrame = MeshBuilder.CreateBox("hf", { width: 1.16, height: 0.06, depth: 0.5 }, scene);
    hFrame.position.set(0, yOff, 0);
    hFrame.parent = rackPivot; hFrame.material = darkWood; allMeshes.push(hFrame);
  }

  // ─── Tube holes + arrows (6 cols × 5 rows = 30) ───
  const cols = 6, rows = 5;
  const spacingX = 0.15, spacingY = 0.14;
  const startX = -(cols - 1) * spacingX / 2;
  const startY = 0.12;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = startX + col * spacingX;
      const cy = startY + row * spacingY;
      // Tube hole (dark cylinder recessed into rack face)
      const tube = MeshBuilder.CreateCylinder("tube", { height: 0.46, diameter: 0.07, tessellation: 8 }, scene);
      tube.position.set(cx, cy, 0);
      tube.rotation.x = Math.PI / 2;
      tube.parent = rackPivot; tube.material = tubeMat; allMeshes.push(tube);
      // Arrow shaft poking out
      const arr = MeshBuilder.CreateCylinder("arr", { height: 0.5, diameter: 0.02, tessellation: 4 }, scene);
      arr.position.set(cx, cy, 0.35);
      arr.rotation.x = Math.PI / 2;
      arr.parent = rackPivot; arr.material = shaft; allMeshes.push(arr);
      // Red arrowhead
      const tip = MeshBuilder.CreateCylinder("tip", { height: 0.07, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, scene);
      tip.position.set(cx, cy, 0.62);
      tip.rotation.x = Math.PI / 2;
      tip.parent = rackPivot; tip.material = red; allMeshes.push(tip);
    }
  }

  // ─── Rear support struts (angled braces from base to rack back) ───
  for (const xOff of [-0.35, 0.35]) {
    const strut = MeshBuilder.CreateBox("strut", { width: 0.05, height: 0.6, depth: 0.05 }, scene);
    strut.position.set(xOff, 0.6, -0.3);
    strut.rotation.x = -0.4;
    strut.parent = root; strut.material = darkWood; allMeshes.push(strut);
  }

  // ─── Operator behind (-Z) ───
  const operator = addOperator(scene, root, allMeshes, 0.22, 0.7, -0.75, color);

  return wrapAsBody(scene, root, base, allMeshes, operator.headMesh, makeBodyMetrics(operator.headTopY, 0.95, 0.52, 0.76));
}

// ═══════════════════════ CANNON ═══════════════════════
// Fires FORWARD (+Z). Barrel points along +Z. Trail extends back (-Z).
function buildCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("cannon_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.45, 0.3, 0.15));
  const metal = makeMat(scene, new Color3(0.3, 0.3, 0.35));

  // Carriage (longer along Z)
  const carriage = MeshBuilder.CreateBox("carriage", { width: 0.5, height: 0.12, depth: 0.9 }, scene);
  carriage.position.y = 0.3; carriage.parent = root; carriage.material = wood; allMeshes.push(carriage);

  // Wheels (on sides, X axis)
  for (const xOff of [-0.3, 0.3]) {
    const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.08, diameter: 0.55, tessellation: 14 }, scene);
    wheel.position.set(xOff, 0.28, 0);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);

    // Spokes
    for (let i = 0; i < 6; i++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: 0.02, height: 0.24, depth: 0.02 }, scene);
      spoke.position.set(xOff, 0.28, 0);
      spoke.rotation.set(0, 0, i * Math.PI / 6);
      spoke.parent = root; spoke.material = wood; allMeshes.push(spoke);
    }
  }

  // Trail handle extending back (-Z)
  const trail = MeshBuilder.CreateBox("trail", { width: 0.08, height: 0.06, depth: 0.8 }, scene);
  trail.position.set(0, 0.22, -0.7);
  trail.parent = root; trail.material = wood; allMeshes.push(trail);

  // Barrel (along +Z)
  const barrel = MeshBuilder.CreateCylinder("barrel", { height: 1.1, diameter: 0.2, tessellation: 14 }, scene);
  barrel.position.set(0, 0.52, 0.2);
  barrel.rotation.x = Math.PI / 2; // along Z
  barrel.parent = root; barrel.material = metal; allMeshes.push(barrel);

  // Muzzle flare at front (+Z end)
  const muzzle = MeshBuilder.CreateCylinder("muzzle", { height: 0.08, diameterTop: 0.26, diameterBottom: 0.2, tessellation: 14 }, scene);
  muzzle.position.set(0, 0.52, 0.75);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.parent = root; muzzle.material = metal; allMeshes.push(muzzle);

  // Operator behind cannon (-Z)
  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, root, allMeshes, 0.2, 0.57, -0.6, color);
  }

  return wrapAsBody(
    scene,
    root,
    barrel,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.34, 0.7, 0.4, 0.68),
  );
}

// ═══════════════════════ DA VINCI TANK ═══════════════════════
// Symmetrical design, fires in all directions, so orientation matters less.
function buildDaVinciTank(scene: Scene, _color: Color3): ArticulatedBody {
  const root = new TransformNode("tank_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.55, 0.42, 0.25));
  const metal = makeMat(scene, new Color3(0.4, 0.4, 0.45));

  // Conical hull
  const hull = MeshBuilder.CreateCylinder("hull", {
    height: 0.9, diameterTop: 0.15, diameterBottom: 2.0, tessellation: 16,
  }, scene);
  hull.position.y = 0.6; hull.parent = root; hull.material = wood; allMeshes.push(hull);

  // Base plate
  const basePlate = MeshBuilder.CreateCylinder("basePlate", { height: 0.1, diameter: 2.1, tessellation: 16 }, scene);
  basePlate.position.y = 0.15; basePlate.parent = root; basePlate.material = wood; allMeshes.push(basePlate);

  // Cannons poking out from sides (8 around the perimeter)
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI * 2 / 8;
    const barrel = MeshBuilder.CreateCylinder("tbarrel", { height: 0.4, diameter: 0.08, tessellation: 8 }, scene);
    const rx = Math.cos(angle) * 0.9;
    const rz = Math.sin(angle) * 0.9;
    barrel.position.set(rx, 0.3, rz);
    // Point barrel outward radially
    barrel.rotation.x = Math.PI / 2;
    barrel.rotation.y = -angle + Math.PI / 2;
    barrel.parent = root; barrel.material = metal; allMeshes.push(barrel);
  }

  // Top viewport
  const viewport = MeshBuilder.CreateCylinder("viewport", { height: 0.15, diameter: 0.3, tessellation: 8 }, scene);
  viewport.position.y = 1.1; viewport.parent = root; viewport.material = metal; allMeshes.push(viewport);

  // Wheels (4, peeking out from base)
  for (const x of [-0.6, 0.6]) {
    for (const z of [-0.6, 0.6]) {
      const wheel = MeshBuilder.CreateCylinder("twheel", { height: 0.06, diameter: 0.35, tessellation: 10 }, scene);
      wheel.position.set(x, 0.1, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);
    }
  }

  return wrapAsBody(scene, root, hull, allMeshes, undefined, makeBodyMetrics(1.8, 0.8, 0.5, 0.7));
}

function buildLegacyTank(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("legacy_tank_root", scene);
  const allMeshes: Mesh[] = [];
  const hullMat = makeMat(scene, new Color3(0.42, 0.52, 0.34));
  const trackMat = makeMat(scene, new Color3(0.24, 0.26, 0.22));
  const metal = makeMat(scene, new Color3(0.38, 0.4, 0.42));

  const body = MeshBuilder.CreateBox("tankBody", { width: 1.8, height: 0.62, depth: 2.4 }, scene);
  body.position.y = 0.62;
  body.parent = root;
  body.material = hullMat;
  allMeshes.push(body);

  const upperHull = MeshBuilder.CreateBox("tankUpper", { width: 1.25, height: 0.45, depth: 1.3 }, scene);
  upperHull.position.set(0, 1.0, -0.05);
  upperHull.parent = root;
  upperHull.material = hullMat;
  allMeshes.push(upperHull);

  const turret = MeshBuilder.CreateCylinder("tankTurret", { height: 0.36, diameter: 0.82, tessellation: 14 }, scene);
  turret.position.set(0, 1.15, 0.18);
  turret.parent = root;
  turret.material = metal;
  allMeshes.push(turret);

  const barrel = MeshBuilder.CreateCylinder("tankBarrel", { height: 1.7, diameter: 0.18, tessellation: 14 }, scene);
  barrel.position.set(0, 1.12, 1.25);
  barrel.rotation.x = Math.PI / 2;
  barrel.parent = root;
  barrel.material = metal;
  allMeshes.push(barrel);

  const muzzle = MeshBuilder.CreateCylinder("tankMuzzle", { height: 0.12, diameterTop: 0.24, diameterBottom: 0.18, tessellation: 14 }, scene);
  muzzle.position.set(0, 1.12, 2.04);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.parent = root;
  muzzle.material = metal;
  allMeshes.push(muzzle);

  for (const side of [-1, 1]) {
    const track = MeshBuilder.CreateBox("tankTrack", { width: 0.32, height: 0.48, depth: 2.65 }, scene);
    track.position.set(side * 0.92, 0.38, 0);
    track.parent = root;
    track.material = trackMat;
    allMeshes.push(track);

    for (const z of [-0.9, -0.3, 0.3, 0.9]) {
      const wheel = MeshBuilder.CreateCylinder("tankWheel", { height: 0.12, diameter: 0.34, tessellation: 12 }, scene);
      wheel.position.set(side * 0.92, 0.2, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = root;
      wheel.material = metal;
      allMeshes.push(wheel);
    }
  }

  const operator = addOperator(scene, root, allMeshes, 0, 0.98, -0.28, color);
  return wrapAsBody(scene, root, body, allMeshes, operator.headMesh, makeBodyMetrics(operator.headTopY, 1.2, 0.9, 0.95));
}

// ═══════════════════════ WHEELBARROW ═══════════════════════
// Pushed FORWARD (+Z). Wheel at front (+Z), pusher at back (-Z).
function buildWheelbarrow(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("wheelbarrow_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const metalMat = makeMat(scene, new Color3(0.45, 0.45, 0.5));

  // Tray
  const tray = MeshBuilder.CreateBox("tray", { width: 0.4, height: 0.15, depth: 0.5 }, scene);
  tray.position.set(0, 0.45, 0.15);
  tray.parent = root; tray.material = metalMat; allMeshes.push(tray);

  // Sides of tray
  for (const xOff of [-0.18, 0.18]) {
    const side = MeshBuilder.CreateBox("side", { width: 0.03, height: 0.15, depth: 0.5 }, scene);
    side.position.set(xOff, 0.55, 0.15);
    side.parent = root; side.material = wood; allMeshes.push(side);
  }
  const front = MeshBuilder.CreateBox("front", { width: 0.4, height: 0.15, depth: 0.03 }, scene);
  front.position.set(0, 0.55, 0.4);
  front.parent = root; front.material = wood; allMeshes.push(front);

  // Wheel at front (+Z)
  const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.06, diameter: 0.4, tessellation: 12 }, scene);
  wheel.position.set(0, 0.2, 0.45);
  wheel.rotation.z = Math.PI / 2;
  wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);

  // Handles extending back toward pusher (-Z)
  for (const xOff of [-0.15, 0.15]) {
    const handle = MeshBuilder.CreateCylinder("handle", { height: 0.7, diameter: 0.03, tessellation: 6 }, scene);
    handle.position.set(xOff, 0.5, -0.25);
    handle.rotation.x = -0.25; // angled back
    handle.parent = root; handle.material = wood; allMeshes.push(handle);
  }

  // Pusher (the farmer, at -Z)
  const operator = addOperator(scene, root, allMeshes, 0, 0.72, -0.55, color);

  return wrapAsBody(scene, root, tray, allMeshes, operator.headMesh, makeBodyMetrics(operator.headTopY, 0.55, 0.34, 0.8));
}

// ═══════════════════════ MINOTAUR ═══════════════════════
// Cute, upright, squat minotaur with big bull head, curved horns,
// pointed ears, lighter belly, stubby limbs with hooves, tufted tail.
function buildMinotaur(scene: Scene, _color: Color3): ArticulatedBody {
  const root = new TransformNode("minotaur_root", scene);
  const allMeshes: Mesh[] = [];
  const darkBrown = makeMat(scene, new Color3(0.32, 0.20, 0.13));
  const medBrown = makeMat(scene, new Color3(0.42, 0.28, 0.16));
  const lightBelly = makeMat(scene, new Color3(0.65, 0.52, 0.38));
  const hornMat = makeMat(scene, new Color3(0.88, 0.82, 0.68));
  const hoofMat = makeMat(scene, new Color3(0.22, 0.15, 0.10));
  const eyeWhite = makeMat(scene, new Color3(0.95, 0.95, 0.95));
  const pupilMat = makeMat(scene, new Color3(0.1, 0.1, 0.1));
  const noseMat = makeMat(scene, new Color3(0.50, 0.30, 0.22));

  // ── Joint hierarchy ──
  const hip = dummyJoint("mino_hip", root, scene);
  hip.position.set(0, 0.55, 0);
  const torsoJoint = dummyJoint("mino_torso", hip, scene);
  const neckJoint = dummyJoint("mino_neck", torsoJoint, scene);
  neckJoint.position.set(0, 0.55, 0.05);

  // Arm joints (stubby)
  const lShoulder = dummyJoint("mino_ls", torsoJoint, scene);
  lShoulder.position.set(-0.38, 0.35, 0);
  const lElbow = dummyJoint("mino_le", lShoulder, scene);
  lElbow.position.set(0, -0.22, 0);
  const rShoulder = dummyJoint("mino_rs", torsoJoint, scene);
  rShoulder.position.set(0.38, 0.35, 0);
  const rElbow = dummyJoint("mino_re", rShoulder, scene);
  rElbow.position.set(0, -0.22, 0);

  // Leg joints
  const lHip = dummyJoint("mino_lh", hip, scene);
  lHip.position.set(-0.18, -0.05, 0);
  const lKnee = dummyJoint("mino_lk", lHip, scene);
  lKnee.position.set(0, -0.28, 0);
  const rHip = dummyJoint("mino_rh", hip, scene);
  rHip.position.set(0.18, -0.05, 0);
  const rKnee = dummyJoint("mino_rk", rHip, scene);
  rKnee.position.set(0, -0.28, 0);

  // ── Body — big round belly (parented to torso joint) ──
  const bodyMesh = MeshBuilder.CreateSphere("body", { diameter: 0.85, segments: 10 }, scene);
  bodyMesh.position.set(0, 0.1, 0);
  bodyMesh.scaling.set(1.0, 0.95, 0.85);
  bodyMesh.parent = torsoJoint; bodyMesh.material = darkBrown; allMeshes.push(bodyMesh);

  // Lighter belly patch (front)
  const bellyPatch = MeshBuilder.CreateSphere("belly", { diameter: 0.6, segments: 8 }, scene);
  bellyPatch.position.set(0, -0.02, 0.18);
  bellyPatch.scaling.set(0.75, 0.8, 0.5);
  bellyPatch.parent = torsoJoint; bellyPatch.material = lightBelly; allMeshes.push(bellyPatch);

  // ── Head — oversized bull head (parented to neck joint) ──
  const headMesh = MeshBuilder.CreateSphere("head", { diameter: 0.7, segments: 8 }, scene);
  headMesh.position.set(0, 0.15, 0.05);
  headMesh.scaling.set(1.0, 0.9, 0.85);
  headMesh.parent = neckJoint; headMesh.material = darkBrown; allMeshes.push(headMesh);

  // Brow ridge (heavy, overhanging)
  const brow = MeshBuilder.CreateSphere("brow", { diameter: 0.45, segments: 6 }, scene);
  brow.position.set(0, 0.28, 0.12);
  brow.scaling.set(1.2, 0.4, 0.8);
  brow.parent = neckJoint; brow.material = darkBrown; allMeshes.push(brow);

  // Snout / muzzle (wide, protruding)
  const snout = MeshBuilder.CreateSphere("snout", { diameter: 0.38, segments: 6 }, scene);
  snout.position.set(0, -0.02, 0.3);
  snout.scaling.set(1.0, 0.7, 0.8);
  snout.parent = neckJoint; snout.material = noseMat; allMeshes.push(snout);

  // Nostrils
  for (const xOff of [-0.08, 0.08]) {
    const nostril = MeshBuilder.CreateSphere("nostril", { diameter: 0.06, segments: 4 }, scene);
    nostril.position.set(xOff, -0.05, 0.46);
    nostril.parent = neckJoint; nostril.material = hoofMat; allMeshes.push(nostril);
  }

  // Eyes (cute, with white sclera and dark pupils — peeking under brow)
  for (const side of [-1, 1]) {
    const sclera = MeshBuilder.CreateSphere("eye", { diameter: 0.1, segments: 6 }, scene);
    sclera.position.set(side * 0.18, 0.18, 0.28);
    sclera.parent = neckJoint; sclera.material = eyeWhite; allMeshes.push(sclera);

    const pupil = MeshBuilder.CreateSphere("pupil", { diameter: 0.06, segments: 4 }, scene);
    pupil.position.set(side * 0.18, 0.17, 0.33);
    pupil.parent = neckJoint; pupil.material = pupilMat; allMeshes.push(pupil);
  }

  // ── Horns — large, curving upward and outward then inward ──
  for (const side of [-1, 1]) {
    // Base (thick, goes up and out from top of head)
    const hornBase = MeshBuilder.CreateCylinder("hornBase", {
      height: 0.3, diameterTop: 0.07, diameterBottom: 0.11, tessellation: 8,
    }, scene);
    hornBase.position.set(side * 0.22, 0.42, 0.0);
    hornBase.rotation.z = side * -0.6;
    hornBase.parent = neckJoint; hornBase.material = hornMat; allMeshes.push(hornBase);

    // Mid (curves outward)
    const hornMid = MeshBuilder.CreateCylinder("hornMid", {
      height: 0.22, diameterTop: 0.05, diameterBottom: 0.07, tessellation: 8,
    }, scene);
    hornMid.position.set(side * 0.38, 0.55, -0.02);
    hornMid.rotation.z = side * -1.1;
    hornMid.rotation.x = -0.3;
    hornMid.parent = neckJoint; hornMid.material = hornMat; allMeshes.push(hornMid);

    // Tip (curves forward/inward — the classic minotaur hook)
    const hornTip = MeshBuilder.CreateCylinder("hornTip", {
      height: 0.18, diameterTop: 0.02, diameterBottom: 0.05, tessellation: 6,
    }, scene);
    hornTip.position.set(side * 0.46, 0.62, 0.06);
    hornTip.rotation.z = side * -1.6;
    hornTip.rotation.x = 0.5;
    hornTip.parent = neckJoint; hornTip.material = hornMat; allMeshes.push(hornTip);
  }

  // ── Pointed ears (large, drooping outward like the reference) ──
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateCylinder("ear", {
      diameterTop: 0, diameterBottom: 0.14, height: 0.2, tessellation: 4,
    }, scene);
    ear.position.set(side * 0.32, 0.15, -0.02);
    ear.rotation.z = side * 1.3; // point outward/down
    ear.rotation.x = -0.2;
    ear.parent = neckJoint; ear.material = medBrown; allMeshes.push(ear);
  }

  // ── Arms (stubby, with hoof-like hands) ──
  for (const [shoulder, elbow] of [[lShoulder, lElbow], [rShoulder, rElbow]] as [TransformNode, TransformNode][]) {
    // Upper arm
    const upper = MeshBuilder.CreateCylinder("uarm", {
      height: 0.22, diameterTop: 0.12, diameterBottom: 0.1, tessellation: 8,
    }, scene);
    upper.position.set(0, -0.1, 0);
    upper.parent = shoulder; upper.material = darkBrown; allMeshes.push(upper);

    // Lower arm / hand (hoof-like)
    const lower = MeshBuilder.CreateCylinder("larm", {
      height: 0.18, diameterTop: 0.09, diameterBottom: 0.07, tessellation: 8,
    }, scene);
    lower.position.set(0, -0.08, 0);
    lower.parent = elbow; lower.material = medBrown; allMeshes.push(lower);

    // Hoof hand
    const hoof = MeshBuilder.CreateCylinder("hoof", {
      height: 0.05, diameter: 0.09, tessellation: 6,
    }, scene);
    hoof.position.set(0, -0.2, 0);
    hoof.parent = elbow; hoof.material = hoofMat; allMeshes.push(hoof);
  }

  // ── Legs (thick, sturdy with hooves) ──
  for (const [hipJoint, kneeJoint] of [[lHip, lKnee], [rHip, rKnee]] as [TransformNode, TransformNode][]) {
    // Upper leg
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.28, diameterTop: 0.14, diameterBottom: 0.12, tessellation: 8,
    }, scene);
    upper.position.set(0, -0.14, 0);
    upper.parent = hipJoint; upper.material = darkBrown; allMeshes.push(upper);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.22, diameterTop: 0.11, diameterBottom: 0.09, tessellation: 8,
    }, scene);
    lower.position.set(0, -0.1, 0);
    lower.parent = kneeJoint; lower.material = medBrown; allMeshes.push(lower);

    // Hoof
    const hoof = MeshBuilder.CreateCylinder("hoof", {
      height: 0.06, diameter: 0.12, tessellation: 6,
    }, scene);
    hoof.position.set(0, -0.23, 0);
    hoof.parent = kneeJoint; hoof.material = hoofMat; allMeshes.push(hoof);
  }

  // ── Tail (thin, with arrow-shaped tuft) ──
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.4, diameterTop: 0.02, diameterBottom: 0.05, tessellation: 6,
  }, scene);
  tail.position.set(0, 0.0, -0.38);
  tail.rotation.x = -0.8;
  tail.parent = torsoJoint; tail.material = darkBrown; allMeshes.push(tail);

  // Arrow-shaped tail tuft
  const tuft = MeshBuilder.CreateCylinder("tuft", {
    diameterTop: 0, diameterBottom: 0.12, height: 0.1, tessellation: 4,
  }, scene);
  tuft.position.set(0, -0.2, -0.55);
  tuft.rotation.x = -0.8;
  tuft.parent = torsoJoint; tuft.material = hoofMat; allMeshes.push(tuft);

  // ── Map to ArticulatedBody ──
  const rHand = dummyJoint("mino_rhand", rElbow, scene);
  const lHand = dummyJoint("mino_lhand", lElbow, scene);
  const headTop = dummyJoint("mino_headtop", neckJoint, scene);

  const allJoints = [hip, torsoJoint, neckJoint, lShoulder, lElbow, rShoulder, rElbow, lHip, lKnee, rHip, rKnee];

  return {
    root, bodyMaterial: darkBrown, skinMaterial: medBrown, metrics: makeBodyMetrics(1.4, 0.76, 0.36, 0.48), hip, torso: torsoJoint, torsoMesh: bodyMesh, neck: neckJoint, headMesh,
    leftShoulder: lShoulder, leftUpperArm: bodyMesh, leftElbow: lElbow, leftLowerArm: bodyMesh,
    rightShoulder: rShoulder, rightUpperArm: bodyMesh, rightElbow: rElbow, rightLowerArm: bodyMesh,
    leftHip: lHip, leftUpperLeg: bodyMesh, leftKnee: lKnee, leftLowerLeg: bodyMesh,
    rightHip: rHip, rightUpperLeg: bodyMesh, rightKnee: rKnee, rightLowerLeg: bodyMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}

function buildMammoth(scene: Scene, _color: Color3): ArticulatedBody {
  const root = new TransformNode("mammoth_root", scene);
  const allMeshes: Mesh[] = [];
  const fur = makeMat(scene, new Color3(0.45, 0.3, 0.18));
  const shaggyFur = makeMat(scene, new Color3(0.38, 0.24, 0.14));
  const tuskMat = makeMat(scene, new Color3(0.92, 0.88, 0.78));
  const darkMat = makeMat(scene, new Color3(0.25, 0.18, 0.12));
  const earMat = makeMat(scene, new Color3(0.5, 0.32, 0.2));

  // ── Joint hierarchy for animation ──
  // hip sits at body center; torso pivots on hip; neck pivots on torso
  const hip = dummyJoint("m_hip", root, scene);
  hip.position.set(0, 1.4, 0);
  const torso = dummyJoint("m_torso", hip, scene);
  const neck = dummyJoint("m_neck", torso, scene);
  neck.position.set(0, 0.2, 1.0);

  // Front-left leg joints
  const flHip = dummyJoint("m_fl_hip", hip, scene);
  flHip.position.set(-0.4, -0.35, 0.55);
  const flKnee = dummyJoint("m_fl_knee", flHip, scene);
  flKnee.position.set(0, -0.45, 0);

  // Front-right leg joints
  const frHip = dummyJoint("m_fr_hip", hip, scene);
  frHip.position.set(0.4, -0.35, 0.55);
  const frKnee = dummyJoint("m_fr_knee", frHip, scene);
  frKnee.position.set(0, -0.45, 0);

  // Back-left leg joints
  const blHip = dummyJoint("m_bl_hip", hip, scene);
  blHip.position.set(-0.4, -0.35, -0.55);
  const blKnee = dummyJoint("m_bl_knee", blHip, scene);
  blKnee.position.set(0, -0.45, 0);

  // Back-right leg joints
  const brHip = dummyJoint("m_br_hip", hip, scene);
  brHip.position.set(0.4, -0.35, -0.55);
  const brKnee = dummyJoint("m_br_knee", brHip, scene);
  brKnee.position.set(0, -0.45, 0);

  // ── Main body (parented to torso joint) ──
  const torsoMesh = MeshBuilder.CreateCylinder("torso", {
    height: 2.2, diameter: 1.5, tessellation: 14,
  }, scene);
  torsoMesh.position.set(0, 0, 0);
  torsoMesh.rotation.x = Math.PI / 2;
  torsoMesh.parent = torso; torsoMesh.material = fur; allMeshes.push(torsoMesh);

  // Shoulder hump
  const hump = MeshBuilder.CreateSphere("hump", { diameter: 1.2, segments: 8 }, scene);
  hump.position.set(0, 0.45, 0.3);
  hump.scaling.set(0.8, 0.6, 0.7);
  hump.parent = torso; hump.material = fur; allMeshes.push(hump);

  // Shaggy fur underbelly
  const belly = MeshBuilder.CreateBox("belly", { width: 1.1, height: 0.35, depth: 1.6 }, scene);
  belly.position.set(0, -0.5, 0);
  belly.parent = torso; belly.material = shaggyFur; allMeshes.push(belly);

  // ── Head (parented to neck joint) ──
  const headMesh = MeshBuilder.CreateSphere("head", { diameter: 0.9, segments: 8 }, scene);
  headMesh.position.set(0, 0, 0.25);
  headMesh.scaling.set(0.85, 1, 0.8);
  headMesh.parent = neck; headMesh.material = fur; allMeshes.push(headMesh);

  // Forehead dome
  const dome = MeshBuilder.CreateSphere("dome", { diameter: 0.6, segments: 6 }, scene);
  dome.position.set(0, 0.25, 0.2);
  dome.parent = neck; dome.material = fur; allMeshes.push(dome);

  // Eyes
  for (const xOff of [-0.22, 0.22]) {
    const eye = MeshBuilder.CreateSphere("eye", { diameter: 0.08, segments: 6 }, scene);
    eye.position.set(xOff, 0.05, 0.55);
    eye.parent = neck; eye.material = darkMat; allMeshes.push(eye);
  }

  // ── Trunk (parented to neck) ──
  const trunkSegments = 5;
  for (let i = 0; i < trunkSegments; i++) {
    const t = i / (trunkSegments - 1);
    const diam = 0.28 - t * 0.14;
    const seg = MeshBuilder.CreateCylinder("trunk", {
      height: 0.28, diameterTop: diam * 0.85, diameterBottom: diam, tessellation: 8,
    }, scene);
    const zOff = 0.55 + t * 0.3;
    const yOff = -0.3 - t * 0.35;
    seg.position.set(0, yOff, zOff);
    seg.rotation.x = -0.3 + t * 0.5;
    seg.parent = neck; seg.material = fur; allMeshes.push(seg);
  }

  // Trunk tip
  const trunkTip = MeshBuilder.CreateSphere("trunkTip", { diameter: 0.12, segments: 4 }, scene);
  trunkTip.position.set(0, -1.25, 0.85);
  trunkTip.parent = neck; trunkTip.material = darkMat; allMeshes.push(trunkTip);

  // ── Tusks (parented to neck) ──
  for (const side of [-1, 1]) {
    const tuskBase = MeshBuilder.CreateCylinder("tuskBase", {
      height: 0.6, diameterTop: 0.08, diameterBottom: 0.12, tessellation: 8,
    }, scene);
    tuskBase.position.set(side * 0.25, -0.5, 0.4);
    tuskBase.rotation.z = side * 0.3;
    tuskBase.rotation.x = 0.4;
    tuskBase.parent = neck; tuskBase.material = tuskMat; allMeshes.push(tuskBase);

    const tuskMid = MeshBuilder.CreateCylinder("tuskMid", {
      height: 0.5, diameterTop: 0.05, diameterBottom: 0.08, tessellation: 8,
    }, scene);
    tuskMid.position.set(side * 0.38, -0.88, 0.65);
    tuskMid.rotation.z = side * 0.1;
    tuskMid.rotation.x = 1.0;
    tuskMid.parent = neck; tuskMid.material = tuskMat; allMeshes.push(tuskMid);

    const tuskTipMesh = MeshBuilder.CreateCylinder("tuskTip", {
      height: 0.35, diameterTop: 0.02, diameterBottom: 0.05, tessellation: 6,
    }, scene);
    tuskTipMesh.position.set(side * 0.35, -1.0, 1.0);
    tuskTipMesh.rotation.z = side * -0.2;
    tuskTipMesh.rotation.x = 1.4;
    tuskTipMesh.parent = neck; tuskTipMesh.material = tuskMat; allMeshes.push(tuskTipMesh);
  }

  // ── Ears (parented to neck) ──
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateBox("ear", { width: 0.5, height: 0.6, depth: 0.06 }, scene);
    ear.position.set(side * 0.52, 0.05, 0.1);
    ear.rotation.z = side * 0.4;
    ear.rotation.y = side * 0.2;
    ear.parent = neck; ear.material = earMat; allMeshes.push(ear);
  }

  // ── Legs (parented to leg joints) ──
  const legJoints: [TransformNode, TransformNode][] = [
    [flHip, flKnee], [frHip, frKnee], [blHip, blKnee], [brHip, brKnee],
  ];

  for (const [hipJoint, kneeJoint] of legJoints) {
    // Upper leg
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.55, diameterTop: 0.28, diameterBottom: 0.24, tessellation: 10,
    }, scene);
    upper.position.set(0, -0.22, 0);
    upper.parent = hipJoint; upper.material = fur; allMeshes.push(upper);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.45, diameterTop: 0.22, diameterBottom: 0.18, tessellation: 10,
    }, scene);
    lower.position.set(0, -0.18, 0);
    lower.parent = kneeJoint; lower.material = shaggyFur; allMeshes.push(lower);

    // Foot
    const foot = MeshBuilder.CreateCylinder("foot", {
      height: 0.08, diameter: 0.24, tessellation: 8,
    }, scene);
    foot.position.set(0, -0.4, 0);
    foot.parent = kneeJoint; foot.material = darkMat; allMeshes.push(foot);
  }

  // ── Tail (parented to torso) ──
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.5, diameterTop: 0.03, diameterBottom: 0.06, tessellation: 6,
  }, scene);
  tail.position.set(0, -0.2, -1.15);
  tail.rotation.x = -0.7;
  tail.parent = torso; tail.material = darkMat; allMeshes.push(tail);

  const tuft = MeshBuilder.CreateSphere("tuft", { diameter: 0.1, segments: 4 }, scene);
  tuft.position.set(0, -0.45, -1.35);
  tuft.parent = torso; tuft.material = darkMat; allMeshes.push(tuft);

  // Map to ArticulatedBody: front legs = arms, back legs = legs
  const rHand = dummyJoint("m_rhand", frKnee, scene);
  const lHand = dummyJoint("m_lhand", flKnee, scene);
  const headTop = dummyJoint("m_headtop", neck, scene);

  const allJoints = [hip, torso, neck, flHip, flKnee, frHip, frKnee, blHip, blKnee, brHip, brKnee];

  return {
    root, bodyMaterial: fur, skinMaterial: earMat, metrics: makeBodyMetrics(2.35, 0.8, 0.8, 0.62), hip, torso, torsoMesh, neck, headMesh,
    leftShoulder: flHip, leftUpperArm: torsoMesh, leftElbow: flKnee, leftLowerArm: torsoMesh,
    rightShoulder: frHip, rightUpperArm: torsoMesh, rightElbow: frKnee, rightLowerArm: torsoMesh,
    leftHip: blHip, leftUpperLeg: torsoMesh, leftKnee: blKnee, leftLowerLeg: torsoMesh,
    rightHip: brHip, rightUpperLeg: torsoMesh, rightKnee: brKnee, rightLowerLeg: torsoMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}
