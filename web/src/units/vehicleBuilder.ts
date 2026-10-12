import {
  Scene, TransformNode, Mesh, MeshBuilder, Color3, Vector3,
  PBRMetallicRoughnessMaterial,
} from "@babylonjs/core";
import { buildArticulatedBody } from "./bodyBuilder";
import type { ArticulatedBody, BodyMetrics, VehicleSocketSet } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";

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
  "ancient.minotaur",
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
    case "ancient.minotaur": return buildMinotaur(scene, bodyColor);
    case "tribal.mammoth": return buildMammoth(scene, bodyColor);
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
}

// Helper to add an operator (small person) at a given position
function addOperator(
  scene: Scene, root: TransformNode, allMeshes: Mesh[],
  x: number, y: number, z: number, color: Color3,
  pose?: (body: ArticulatedBody) => void,
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
  pose?.(operator);
  allMeshes.push(...operator.allMeshes);
  return {
    headMesh: operator.headMesh,
    headTopY: operator.root.position.y + operator.metrics.headTopY,
  };
}

// ═══════════════════════ CATAPULT ═══════════════════════
// Fires FORWARD (+Z). Arm swings over the top toward +Z.
function buildCatapult(scene: Scene, color: Color3, options: { spooky?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("catapult_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));
  const pumpkinMat = makeMat(scene, new Color3(0.88, 0.42, 0.12));

  // Base platform (longer along Z = firing axis)
  const base = MeshBuilder.CreateBox("base", { width: 1.0, height: 0.2, depth: 1.6 }, scene);
  base.position.y = 0.4; base.parent = root; base.material = teamPrimary; allMeshes.push(base);

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

  if (options.spooky) {
    const pumpkin = MeshBuilder.CreateSphere("pumpkinPayload", { diameter: 0.22, segments: 8 }, scene);
    pumpkin.position.set(0, 2.08, 0.7);
    pumpkin.parent = root;
    pumpkin.material = pumpkinMat;
    allMeshes.push(pumpkin);
  }

  // Counterweight at back end (-Z)
  const cw = MeshBuilder.CreateBox("cw", { width: 0.2, height: 0.2, depth: 0.2 }, scene);
  cw.position.set(0, 1.0, -0.5);
  cw.parent = root; cw.material = metal; allMeshes.push(cw);

  // Operator sitting beside, behind the frame
  const operator = addOperator(scene, root, allMeshes, 0.4, 0.72, -0.5, color);

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "catapult_bucket_socket", new Vector3(0, 2.08, 0.82)),
    impactOrigin: makeSocket(scene, root, "catapult_impact_socket", new Vector3(0, 2.0, 0.7)),
  };

  return wrapAsBody(
    scene,
    root,
    base,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY, 0.8, 0.45, 0.8),
    vehicleSockets,
  );
}

function buildBombCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const body = buildCannon(scene, color, options);
  const root = body.root;
  // One fat tapered mortar barrel: the field gun's own barrel comes off, so there are not two tubes stacked
  for (const name of ["barrel", "barrelBand", "breechKnob", "muzzle"]) {
    for (let i = body.allMeshes.length - 1; i >= 0; i--) {
      if (body.allMeshes[i].name === name) body.allMeshes.splice(i, 1)[0].dispose();
    }
  }
  // Short and stubby, 0.7 long with the muzzle where it was, and hooped by two raised bands
  const barrelMat = makeMat(scene, new Color3(0.22, 0.22, 0.26));
  const barrel = MeshBuilder.CreateCylinder("bombBarrel", { height: 0.7, diameterTop: 0.3, diameterBottom: 0.38, tessellation: 8 }, scene);
  barrel.position.set(0, 0.69, 0.55);
  barrel.rotation.x = Math.PI / 2 - 0.18;
  barrel.parent = root;
  barrel.material = barrelMat;
  body.allMeshes.push(barrel);
  for (const [along, d] of [[-0.2, 0.43], [0.16, 0.39]]) {
    const band = MeshBuilder.CreateCylinder("bombBand", { height: 0.08, diameter: d, tessellation: 8 }, scene);
    band.position.set(0, 0.69 + Math.sin(0.18) * along, 0.55 + Math.cos(0.18) * along);
    band.rotation.x = Math.PI / 2 - 0.18;
    band.parent = root;
    band.material = barrelMat;
    body.allMeshes.push(band);
  }
  const bomb = MeshBuilder.CreateSphere("bombRound", { diameter: 0.22, segments: 8 }, scene);
  bomb.position.set(0, 0.72, 0.75);
  bomb.parent = root;
  bomb.material = makeMat(scene, new Color3(0.12, 0.12, 0.12));
  body.allMeshes.push(bomb);
  body.vehicleSockets = {
    primaryMuzzle: makeSocket(scene, root, "bomb_cannon_muzzle_socket", new Vector3(0, 0.78, 0.96)),
    smokeSocket: makeSocket(scene, root, "bomb_cannon_smoke_socket", new Vector3(0, 0.76, 0.9)),
    impactOrigin: makeSocket(scene, root, "bomb_cannon_impact_socket", new Vector3(0, 0.72, 0.78)),
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
function buildBallista(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("ballista_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));

  // Base (longer along Z)
  const base = MeshBuilder.CreateBox("base", { width: 0.8, height: 0.15, depth: 1.2 }, scene);
  base.position.y = 0.35; base.parent = root; base.material = teamPrimary; allMeshes.push(base);

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

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "ballista_bolt_socket", new Vector3(0, 0.58, 0.54)),
    impactOrigin: makeSocket(scene, root, "ballista_impact_socket", new Vector3(0, 0.58, 0.3)),
  };

  return wrapAsBody(
    scene,
    root,
    base,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY, 0.72, 0.4, 0.78),
    vehicleSockets,
  );
}

// ═══════════════════════ HWACHA ═══════════════════════
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
  base.position.y = 0.4; base.parent = root; base.material = teamPrimary; allMeshes.push(base);

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
  rackBody.parent = rackPivot; rackBody.material = teamPrimary; allMeshes.push(rackBody);

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
  const muzzleSequence: TransformNode[] = [];
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
      if (muzzleSequence.length < 14) {
        muzzleSequence.push(makeSocket(scene, rackPivot, `hwacha_muzzle_${row}_${col}`, new Vector3(cx, cy, 0.72)));
      }
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
  const operator = options.showOperators !== false
    ? addOperator(scene, root, allMeshes, 0.22, 0.7, -0.75, color)
    : null;

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: muzzleSequence[0],
    muzzleSequence,
    impactOrigin: makeSocket(scene, rackPivot, "hwacha_impact_socket", new Vector3(0, 0.42, 0.68)),
  };

  return wrapAsBody(
    scene,
    root,
    base,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.58, 0.95, 0.52, 0.76),
    vehicleSockets,
  );
}

// ═══════════════════════ CANNON ═══════════════════════
// Fires FORWARD (+Z). Barrel points along +Z. Trail extends back (-Z).
/** Pirate gun crew clothes on an operator body: mauve hoops round the team-coloured shirt, brown trousers and shoes, a dark peaked cap */
export function dressCannonCrew(scene: Scene, body: ArticulatedBody, color: Color3, cap = true): void {
  const hoopMat = makeMat(scene, new Color3(0.5, 0.42, 0.52));
  const trouserMat = makeMat(scene, new Color3(0.42, 0.24, 0.14));
  const capMat = makeMat(scene, darken(color, 0.45));
  const add = (mesh: Mesh, parent: TransformNode, material: PBRMetallicRoughnessMaterial): void => {
    mesh.parent = parent; mesh.material = material; body.allMeshes.push(mesh);
  };

  // Trousers: everything hung off the hip and knee joints, feet included
  const legJoints = new Set<unknown>([body.leftHip, body.leftKnee, body.rightHip, body.rightKnee]);
  for (const mesh of body.allMeshes) {
    if (legJoints.has(mesh.parent)) mesh.material = trouserMat;
  }

  // Shirt hoops: three bands a little proud of the torso, following its taper from waist to chest
  const chest = body.torsoMesh.getBoundingInfo().boundingBox.extendSize;
  const girth = (t: number): number => Math.max(chest.x, chest.z) * 2 * (0.76 + 0.26 * t) * 1.1;
  for (const t of [0.12, 0.4, 0.68]) {
    const hoop = MeshBuilder.CreateCylinder("crewHoop", {
      height: chest.y * 0.28, diameterTop: girth(t + 0.14), diameterBottom: girth(t), tessellation: 6,
    }, scene);
    hoop.position.y = chest.y * 2 * (t + 0.07);
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

function buildCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("cannon_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.24, 0.14));
  const metal = makeMat(scene, new Color3(0.3, 0.3, 0.35));
  const wheelWood = makeMat(scene, new Color3(0.2, 0.14, 0.09));

  // Carriage (longer along Z)
  const carriage = MeshBuilder.CreateBox("carriage", { width: 0.5, height: 0.12, depth: 0.9 }, scene);
  carriage.position.y = 0.3; carriage.parent = root; carriage.material = wood; allMeshes.push(carriage);

  // Axle under the bed: the body mesh that takes the team tint, so the iron barrel and the wooden carriage keep their own colours
  const axle = MeshBuilder.CreateCylinder("axle", { height: 0.56, diameter: 0.06, tessellation: 6 }, scene);
  axle.position.y = 0.29;
  axle.rotation.z = Math.PI / 2;
  axle.parent = root; axle.material = teamPrimary; allMeshes.push(axle);

  // Wheels (on sides, X axis): dark, and 0.58 across, so the rims stand as tall as the gun they carry.
  // An open rim on eight thick spokes, with daylight between them, not a solid slab
  for (const xOff of [-0.3, 0.3]) {
    const wheel = MeshBuilder.CreateTorus("wheel", { diameter: 0.58, thickness: 0.1, tessellation: 14 }, scene);
    wheel.position.set(xOff, 0.29, 0);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = wheelWood; allMeshes.push(wheel);

    // Hub: a fat block on the axle where the spokes meet
    const wheelHub = MeshBuilder.CreateCylinder("wheelHub", { height: 0.1, diameter: 0.12, tessellation: 8 }, scene);
    wheelHub.position.set(xOff, 0.29, 0);
    wheelHub.rotation.z = Math.PI / 2;
    wheelHub.parent = root; wheelHub.material = wheelWood; allMeshes.push(wheelHub);

    // Spokes: four bars across the full rim, turned about the axle
    for (let i = 0; i < 4; i++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: 0.05, height: 0.54, depth: 0.05 }, scene);
      spoke.position.set(xOff, 0.29, 0);
      spoke.rotation.set(i * Math.PI / 4, 0, 0);
      spoke.parent = root; spoke.material = wheelWood; allMeshes.push(spoke);
    }
  }

  // Trail handle extending back (-Z)
  const trail = MeshBuilder.CreateBox("trail", { width: 0.08, height: 0.06, depth: 0.8 }, scene);
  trail.position.set(0, 0.22, -0.7);
  trail.parent = root; trail.material = wood; allMeshes.push(trail);

  // Barrel (along +Z)
  // A short stout tube, 0.8 long with the muzzle where it was, tapering a little from breech to muzzle, faceted, with
  // two raised bands and a knob on the back end
  const barrel = MeshBuilder.CreateCylinder("barrel", { height: 0.8, diameterTop: 0.22, diameterBottom: 0.28, tessellation: 8 }, scene);
  barrel.position.set(0, 0.52, 0.35);
  barrel.rotation.x = Math.PI / 2; // along Z
  barrel.parent = root; barrel.material = metal; allMeshes.push(barrel);
  for (const [z, d] of [[0.08, 0.33], [0.45, 0.29]]) {
    const band = MeshBuilder.CreateCylinder("barrelBand", { height: 0.07, diameter: d, tessellation: 8 }, scene);
    band.position.set(0, 0.52, z);
    band.rotation.x = Math.PI / 2;
    band.parent = root; band.material = metal; allMeshes.push(band);
  }
  const knob = MeshBuilder.CreateSphere("breechKnob", { diameter: 0.14, segments: 3 }, scene);
  knob.position.set(0, 0.52, -0.1);
  knob.parent = root; knob.material = metal; allMeshes.push(knob);

  // Muzzle flare at front (+Z end)
  const muzzle = MeshBuilder.CreateCylinder("muzzle", { height: 0.08, diameterTop: 0.3, diameterBottom: 0.22, tessellation: 8 }, scene);
  muzzle.position.set(0, 0.52, 0.75);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.parent = root; muzzle.material = metal; allMeshes.push(muzzle);

  // Operator stands on the ground beside the wheel, turned in to it, and shoves it: both hands flat on the wheel's
  // outer face, back straight in one line with the braced rear leg, lead knee bent. Sunk 0.03 so both feet are on the ground
  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, root, allMeshes, 0.6, -0.03, -0.2, color, (body) => {
      body.root.rotation.y = -1.2;
      body.torso.rotation.x = 0.5;
      body.neck.rotation.x = -0.3;
      body.leftShoulder.rotation.x = -1.9;
      body.leftElbow.rotation.x = -0.1;
      body.rightShoulder.rotation.x = -1.9;
      body.rightElbow.rotation.x = -0.1;
      body.leftHip.rotation.x = -0.75;
      body.leftHip.rotation.z = -0.16;
      body.leftKnee.rotation.x = 0.9;
      body.rightHip.rotation.x = 0.5;
      body.rightHip.rotation.z = 0.16;
      body.rightKnee.rotation.x = 0;
      dressCannonCrew(scene, body, color);
    });
  }

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, root, "cannon_muzzle_socket", new Vector3(0, 0.52, 0.86)),
    smokeSocket: makeSocket(scene, root, "cannon_smoke_socket", new Vector3(0, 0.52, 0.78)),
    impactOrigin: makeSocket(scene, root, "cannon_impact_socket", new Vector3(0, 0.52, 0.7)),
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
// Symmetrical design, fires in all directions, so orientation matters less.
function buildDaVinciTank(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("tank_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.55, 0.42, 0.25));
  const metal = makeMat(scene, new Color3(0.4, 0.4, 0.45));

  // Conical hull
  const hull = MeshBuilder.CreateCylinder("hull", {
    height: 0.9, diameterTop: 0.15, diameterBottom: 2.0, tessellation: 16,
  }, scene);
  hull.position.y = 0.6; hull.parent = root; hull.material = teamPrimary; allMeshes.push(hull);

  // Base plate
  const basePlate = MeshBuilder.CreateCylinder("basePlate", { height: 0.1, diameter: 2.1, tessellation: 16 }, scene);
  basePlate.position.y = 0.15; basePlate.parent = root; basePlate.material = teamPrimary; allMeshes.push(basePlate);

  const muzzleSequence: TransformNode[] = [];
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
    muzzleSequence.push(makeSocket(scene, root, `davinci_muzzle_${i}`, new Vector3(Math.cos(angle) * 1.08, 0.3, Math.sin(angle) * 1.08)));
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

  let operator: VehicleOperator | null = null;
  if (options.showOperators !== false) {
    operator = addOperator(scene, root, allMeshes, 0, 1.08, -0.02, color);
  }

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: muzzleSequence[0],
    muzzleSequence,
    smokeSocket: makeSocket(scene, root, "davinci_smoke_socket", new Vector3(0, 0.32, 1.02)),
    impactOrigin: makeSocket(scene, root, "davinci_impact_socket", new Vector3(0, 0.3, 0.92)),
  };

  return wrapAsBody(
    scene,
    root,
    hull,
    allMeshes,
    operator?.headMesh,
    makeBodyMetrics(operator?.headTopY ?? 1.8, 0.8, 0.5, 0.7),
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
function buildWheelbarrow(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("wheelbarrow_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));

  // Tray
  const tray = MeshBuilder.CreateBox("tray", { width: 0.4, height: 0.15, depth: 0.5 }, scene);
  tray.position.set(0, 0.45, 0.15);
  tray.parent = root; tray.material = teamPrimary; allMeshes.push(tray);

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

  const vehicleSockets: VehicleSocketSet = {
    impactOrigin: makeSocket(scene, root, "wheelbarrow_impact_socket", new Vector3(0, 0.45, 0.38)),
  };

  return wrapAsBody(
    scene,
    root,
    tray,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY, 0.55, 0.34, 0.8),
    vehicleSockets,
  );
}

function buildLongship(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("longship_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.46, 0.3, 0.16));
  const darkWood = makeMat(scene, new Color3(0.3, 0.18, 0.1));
  const shieldMat = makeMat(scene, brighten(color, 0.08));
  const sailMat = makeMat(scene, new Color3(0.86, 0.82, 0.7));

  const hull = MeshBuilder.CreateBox("longshipHull", { width: 1.05, height: 0.34, depth: 2.7 }, scene);
  hull.position.set(0, 0.4, 0);
  hull.parent = root;
  hull.material = teamPrimary;
  allMeshes.push(hull);

  const deck = MeshBuilder.CreateBox("longshipDeck", { width: 0.9, height: 0.05, depth: 2.4 }, scene);
  deck.position.set(0, 0.6, 0);
  deck.parent = root;
  deck.material = darkWood;
  allMeshes.push(deck);

  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const shield = MeshBuilder.CreateCylinder("longshipShield", { height: 0.05, diameter: 0.28, tessellation: 14 }, scene);
      shield.position.set(side * 0.58, 0.56, -0.84 + i * 0.56);
      shield.rotation.z = Math.PI / 2;
      shield.parent = root;
      shield.material = i % 2 === 0 ? shieldMat : makeMat(scene, new Color3(0.56, 0.44, 0.2));
      allMeshes.push(shield);
    }
  }

  const mast = MeshBuilder.CreateCylinder("longshipMast", { height: 1.65, diameter: 0.08, tessellation: 10 }, scene);
  mast.position.set(0, 1.28, -0.05);
  mast.parent = root;
  mast.material = darkWood;
  allMeshes.push(mast);

  const sail = MeshBuilder.CreatePlane("longshipSail", { width: 1.2, height: 1.0 }, scene);
  sail.position.set(0, 1.22, 0.08);
  sail.rotation.y = Math.PI;
  sail.parent = root;
  sail.material = sailMat;
  allMeshes.push(sail);

  for (const zOff of [-1.32, 1.34]) {
    const post = MeshBuilder.CreateCylinder("longshipPost", { height: 0.7, diameter: 0.1, tessellation: 8 }, scene);
    post.position.set(0, 0.78, zOff);
    post.rotation.x = zOff > 0 ? -0.45 : 0.32;
    post.parent = root;
    post.material = darkWood;
    allMeshes.push(post);
  }

  const prow = MeshBuilder.CreateCylinder("longshipProw", { height: 0.48, diameterTop: 0, diameterBottom: 0.12, tessellation: 8 }, scene);
  prow.position.set(0, 1.0, 1.48);
  prow.rotation.x = -0.58;
  prow.parent = root;
  prow.material = darkWood;
  allMeshes.push(prow);

  const stern = MeshBuilder.CreateCylinder("longshipStern", { height: 0.36, diameterTop: 0, diameterBottom: 0.1, tessellation: 8 }, scene);
  stern.position.set(0, 0.96, -1.46);
  stern.rotation.x = 0.42;
  stern.parent = root;
  stern.material = darkWood;
  allMeshes.push(stern);

  const operator = addOperator(scene, root, allMeshes, 0, 0.76, -0.42, color);

  return wrapAsBody(
    scene,
    root,
    hull,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY, 0.92, 0.56, 0.84),
    { impactOrigin: makeSocket(scene, root, "longship_impact_socket", new Vector3(0, 0.72, 1.28)) },
  );
}

function buildChariot(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("chariot_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = makeMat(scene, new Color3(0.54, 0.36, 0.18));
  const metal = makeMat(scene, new Color3(0.62, 0.58, 0.48));
  const horseMat = makeMat(scene, darken(color, 0.26));

  const cart = MeshBuilder.CreateBox("chariotCart", { width: 0.78, height: 0.22, depth: 0.68 }, scene);
  cart.position.set(0, 0.56, -0.16);
  cart.parent = root;
  cart.material = teamPrimary;
  allMeshes.push(cart);

  for (const side of [-1, 1]) {
    const wheel = MeshBuilder.CreateCylinder("chariotWheel", { height: 0.08, diameter: 0.74, tessellation: 16 }, scene);
    wheel.position.set(side * 0.5, 0.36, -0.12);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root;
    wheel.material = wood;
    allMeshes.push(wheel);
  }

  const yoke = MeshBuilder.CreateBox("chariotYoke", { width: 0.12, height: 0.08, depth: 1.3 }, scene);
  yoke.position.set(0, 0.5, 0.52);
  yoke.parent = root;
  yoke.material = wood;
  allMeshes.push(yoke);

  const horseBody = MeshBuilder.CreateBox("chariotHorseBody", { width: 0.48, height: 0.52, depth: 0.98 }, scene);
  horseBody.position.set(0, 0.6, 1.24);
  horseBody.parent = root;
  horseBody.material = horseMat;
  allMeshes.push(horseBody);

  const horseNeck = MeshBuilder.CreateCylinder("chariotHorseNeck", { height: 0.42, diameter: 0.16, tessellation: 8 }, scene);
  horseNeck.position.set(0, 0.82, 1.72);
  horseNeck.rotation.x = -0.88;
  horseNeck.parent = root;
  horseNeck.material = horseMat;
  allMeshes.push(horseNeck);

  const horseHead = MeshBuilder.CreateBox("chariotHorseHead", { width: 0.2, height: 0.24, depth: 0.34 }, scene);
  horseHead.position.set(0, 0.94, 1.94);
  horseHead.parent = root;
  horseHead.material = horseMat;
  allMeshes.push(horseHead);

  for (const side of [-1, 1]) {
    for (const zOff of [0.92, 1.46]) {
      const leg = MeshBuilder.CreateCylinder("chariotHorseLeg", { height: 0.48, diameter: 0.1, tessellation: 8 }, scene);
      leg.position.set(side * 0.16, 0.24, zOff);
      leg.parent = root;
      leg.material = horseMat;
      allMeshes.push(leg);
    }
  }

  const plume = MeshBuilder.CreateBox("chariotPlume", { width: 0.08, height: 0.28, depth: 0.14 }, scene);
  plume.position.set(0, 1.16, 1.92);
  plume.parent = root;
  plume.material = metal;
  allMeshes.push(plume);

  const operator = addOperator(scene, root, allMeshes, 0, 0.88, -0.18, color);

  return wrapAsBody(
    scene,
    root,
    cart,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY, 0.84, 0.5, 0.86),
    { impactOrigin: makeSocket(scene, root, "chariot_impact_socket", new Vector3(0, 0.82, 1.66)) },
  );
}

// ═══════════════════════ MINOTAUR ═══════════════════════
// Cute, upright, squat minotaur with big bull head, curved horns,
// pointed ears, lighter belly, stubby limbs with hooves, tufted tail.
function buildMinotaur(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("minotaur_root", scene);
  const allMeshes: Mesh[] = [];
  const darkBrown = makeMat(scene, darken(color, 0.24));
  const medBrown = makeMat(scene, darken(color, 0.12));
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

const MAMMOTH_SCALE = 1.8;

const MAMMOTH_HIDE = new Color3(0.3, 0.19, 0.11);

function buildMammoth(scene: Scene, color: Color3, hide: Color3 = MAMMOTH_HIDE): ArticulatedBody {
  const root = new TransformNode("mammoth_root", scene);
  const allMeshes: Mesh[] = [];
  // The hide keeps its own colour: only the war paint is the team's. applyMaterialPreset()
  // repaints bodyMaterial/skinMaterial with the team tint, so those point at the paint.
  const fur = makeMat(scene, Color3.Lerp(hide, color, 0.12));
  const shaggyFur = makeMat(scene, Color3.Lerp(hide, new Color3(0.08, 0.06, 0.05), 0.45));
  const tuskMat = makeMat(scene, new Color3(1.0, 0.9, 0.68));
  const darkMat = makeMat(scene, new Color3(0.25, 0.18, 0.12));
  const paintMat = getMaterialFactory().createUnique("cloth", color);

  // ── Joint hierarchy for animation ──
  // hip sits at body center; torso pivots on hip; neck pivots on torso
  // Giants are several human heights tall: scale the whole rig under the root
  const bulk = dummyJoint("m_bulk", root, scene);
  bulk.scaling.setAll(MAMMOTH_SCALE);
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
  // Tapered barrel: deep chest and shoulders, lower narrower rump.
  const torsoMesh = MeshBuilder.CreateCylinder("torso", {
    height: 1.9, diameterTop: 1.6, diameterBottom: 1.25, tessellation: 8,
  }, scene);
  torsoMesh.position.set(0, 0, 0);
  torsoMesh.rotation.x = Math.PI / 2;
  torsoMesh.parent = torso; torsoMesh.material = fur; allMeshes.push(torsoMesh);

  // Rounded rump and chest close the barrel, so neither end reads as a flat plate
  for (const [z, diameter] of [[-0.93, 1.27], [0.91, 1.6]]) {
    const cap = MeshBuilder.CreateSphere("barrelCap", { diameter, segments: 3 }, scene);
    cap.position.set(0, 0, z);
    cap.scaling.z = 0.7;
    cap.parent = torso; cap.material = fur; allMeshes.push(cap);
  }

  // War paint: team-coloured bands around the barrel
  for (const z of [0.5, -0.1, -0.7]) {
    const girth = 1.425 + 0.184 * z + 0.04;
    const band = MeshBuilder.CreateCylinder("paintBand", {
      height: 0.16, diameterTop: girth + 0.013, diameterBottom: girth - 0.013, tessellation: 8,
    }, scene);
    band.position.set(0, 0, z);
    band.rotation.x = Math.PI / 2;
    band.parent = torso; band.material = paintMat; allMeshes.push(band);
  }

  // Shaggy shoulder hump, standing well above the back line
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

  // Shaggy fur underbelly
  const belly = MeshBuilder.CreateSphere("belly", { diameter: 1, segments: 3 }, scene);
  belly.position.set(0, -0.42, -0.05);
  belly.scaling.set(1.2, 0.8, 1.85);
  belly.parent = torso; belly.material = shaggyFur; allMeshes.push(belly);

  // Fur skirts hanging off the flanks: faceted lobes, thick at the shoulder and thinning to the rump
  for (const side of [-1, 1]) {
    const skirt = MeshBuilder.CreateCylinder("furSkirt", {
      height: 1.65, diameterTop: 0.85, diameterBottom: 0.55, tessellation: 5,
    }, scene);
    skirt.position.set(side * 0.62, -0.3, 0);
    skirt.rotation.x = Math.PI / 2;
    skirt.scaling.x = 0.45;
    skirt.parent = torso; skirt.material = shaggyFur; allMeshes.push(skirt);

    // Belly fringe: a row of fur points hanging below the skirt, longest under the chest
    for (let i = 0; i < 5; i++) {
      const drop = 0.4 + i * 0.05;
      const lock = MeshBuilder.CreateCylinder("furFringe", {
        height: drop, diameterTop: 0.38, diameterBottom: 0, tessellation: 4,
      }, scene);
      lock.position.set(side * 0.5, -0.62 - drop / 2, -0.72 + i * 0.36);
      lock.scaling.x = 0.6;
      lock.parent = torso; lock.material = shaggyFur; allMeshes.push(lock);
    }
  }

  // ── Head (parented to neck joint) ──
  const headMesh = MeshBuilder.CreateSphere("head", { diameter: 1.4, segments: 4 }, scene);
  headMesh.position.set(0, 0, 0.25);
  headMesh.scaling.set(0.85, 1, 0.8);
  headMesh.parent = neck; headMesh.material = fur; allMeshes.push(headMesh);

  // Forehead dome and the crest behind it: one near-black fur cap from the brow back over the skull to the hump
  const crestMat = makeMat(scene, Color3.Lerp(hide, new Color3(0.04, 0.03, 0.03), 0.45));
  const dome = MeshBuilder.CreateSphere("dome", { diameter: 0.75, segments: 3 }, scene);
  dome.position.set(0, 0.36, 0.2);
  dome.parent = neck; dome.material = crestMat; allMeshes.push(dome);
  const crest = MeshBuilder.CreateSphere("crest", { diameter: 1, segments: 3 }, scene);
  crest.position.set(0, 0.5, -0.18);
  crest.scaling.set(0.72, 0.62, 0.95);
  crest.parent = neck; crest.material = crestMat; allMeshes.push(crest);
  // Shaggy topknot: three fat blunt fur tufts standing off the crown, wider than tall and flat-topped, the middle one
  // tallest and tipped forward, so the skull line is a lumpy mop and not a smooth dome or a row of spikes
  for (const [x, y, z, h, lean] of [[0, 0.82, 0.12, 0.55, 0.35], [-0.22, 0.72, 0.0, 0.42, 0.1], [0.22, 0.72, 0.0, 0.42, 0.1]]) {
    const tuft = MeshBuilder.CreateSphere("topknot", { diameter: 1, segments: 3 }, scene);
    tuft.scaling.set(h * 1.5, h * 0.8, h * 1.5);
    tuft.position.set(x, y, z);
    tuft.rotation.x = lean;
    tuft.rotation.z = -x * 1.6;
    tuft.parent = neck; tuft.material = crestMat; allMeshes.push(tuft);
  }

  // War paint stripe across the brow
  const browPaint = MeshBuilder.CreateBox("browPaint", { width: 0.62, height: 0.13, depth: 0.2 }, scene);
  browPaint.position.set(0, 0.3, 0.68);
  browPaint.parent = neck; browPaint.material = paintMat; allMeshes.push(browPaint);

  // Face paint: a slab down each cheek under the eye, turned to lie on the skull
  for (const side of [-1, 1]) {
    const cheekPaint = MeshBuilder.CreateBox("cheekPaint", { width: 0.2, height: 0.34, depth: 0.14 }, scene);
    cheekPaint.position.set(side * 0.37, -0.2, 0.615);
    cheekPaint.rotation.y = side * 0.55;
    cheekPaint.parent = neck; cheekPaint.material = paintMat; allMeshes.push(cheekPaint);
  }

  // Eyes: big white beads with black pupils set back into the brow, plain to see against the dark fur
  const eyeWhite = makeMat(scene, new Color3(0.95, 0.95, 0.95));
  const pupilMat = makeMat(scene, new Color3(0.03, 0.03, 0.03));
  for (const xOff of [-0.3, 0.3]) {
    const eye = MeshBuilder.CreateSphere("eye", { diameter: 0.2, segments: 6 }, scene);
    eye.position.set(xOff, 0.08, 0.67);
    eye.parent = neck; eye.material = eyeWhite; allMeshes.push(eye);
    const pupil = MeshBuilder.CreateSphere("pupil", { diameter: 0.11, segments: 4 }, scene);
    pupil.position.set(xOff * 1.04, 0.07, 0.75);
    pupil.parent = neck; pupil.material = pupilMat; allMeshes.push(pupil);
  }

  // ── Trunk (parented to neck) ──
  const trunkSegments = 7;
  for (let i = 0; i < trunkSegments; i++) {
    const t = i / (trunkSegments - 1);
    // A thick trunk half as long again as it was, 0.4 across at the face and still half that at the tip
    const diam = 0.4 - t * 0.2;
    const seg = MeshBuilder.CreateCylinder("trunk", {
      height: 0.28, diameterTop: diam * 0.85, diameterBottom: diam, tessellation: 8,
    }, scene);
    const zOff = 0.55 + t * 0.42;
    const yOff = -0.3 - t * 0.53;
    seg.position.set(0, yOff, zOff);
    seg.rotation.x = -0.3 + t * 0.5;
    seg.parent = neck; seg.material = fur; allMeshes.push(seg);
  }

  // Trunk tip
  const trunkTip = MeshBuilder.CreateSphere("trunkTip", { diameter: 0.12, segments: 4 }, scene);
  trunkTip.position.set(0, -0.98, 0.94);
  trunkTip.parent = neck; trunkTip.material = darkMat; allMeshes.push(trunkTip);

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
      // The last two pieces are painted: a short team-coloured tusk tip
      seg.parent = neck; seg.material = i >= tuskPieces - 2 ? tuskTipMat : tuskMat; allMeshes.push(seg);
      start.copyFrom(end);
    }
  }

  // ── Ears (parented to neck): faceted fur fans flaring off the skull, not team slabs ──
  for (const side of [-1, 1]) {
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
    // Upper leg
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.55, diameterTop: 0.76, diameterBottom: 0.66, tessellation: 6,
    }, scene);
    upper.position.set(0, -0.22, 0);
    upper.parent = hipJoint; upper.material = fur; allMeshes.push(upper);

    // Shaggy cuff over the thigh, so the leg leaves the body through fur rather than as a bare post
    const cuff = MeshBuilder.CreateCylinder("legCuff", {
      height: 0.42, diameterTop: 0.9, diameterBottom: 0.78, tessellation: 6,
    }, scene);
    cuff.position.set(0, -0.14, 0);
    cuff.parent = hipJoint; cuff.material = shaggyFur; allMeshes.push(cuff);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.45, diameterTop: 0.62, diameterBottom: 0.6, tessellation: 6,
    }, scene);
    lower.position.set(0, -0.18, 0);
    lower.parent = kneeJoint; lower.material = shaggyFur; allMeshes.push(lower);

    // Foot
    const foot = MeshBuilder.CreateCylinder("foot", {
      height: 0.08, diameter: 0.68, tessellation: 6,
    }, scene);
    foot.position.set(0, -0.4, 0);
    foot.parent = kneeJoint; foot.material = darkMat; allMeshes.push(foot);
  }

  // ── Tail (parented to torso) ──
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.5, diameterTop: 0.03, diameterBottom: 0.06, tessellation: 6,
  }, scene);
  tail.position.set(0, -0.2, -1.0);
  tail.rotation.x = -0.7;
  tail.parent = torso; tail.material = darkMat; allMeshes.push(tail);

  const tuft = MeshBuilder.CreateSphere("tuft", { diameter: 0.1, segments: 4 }, scene);
  tuft.position.set(0, -0.45, -1.2);
  tuft.parent = torso; tuft.material = darkMat; allMeshes.push(tuft);

  // Map to ArticulatedBody: front legs = arms, back legs = legs
  const rHand = dummyJoint("m_rhand", frKnee, scene);
  const lHand = dummyJoint("m_lhand", flKnee, scene);
  const headTop = dummyJoint("m_headtop", neck, scene);

  // Faceted low-poly read instead of smooth cylinders
  for (const mesh of allMeshes) mesh.convertToFlatShadedMesh();

  const allJoints = [hip, torso, neck, flHip, flKnee, frHip, frKnee, blHip, blKnee, brHip, brKnee];

  return {
    root, bodyMaterial: paintMat, skinMaterial: paintMat, metrics: makeBodyMetrics(2.35 * MAMMOTH_SCALE, 0.8 * MAMMOTH_SCALE, 0.8 * MAMMOTH_SCALE, 0.62 * MAMMOTH_SCALE), hip, torso, torsoMesh, neck, headMesh,
    leftShoulder: flHip, leftUpperArm: torsoMesh, leftElbow: flKnee, leftLowerArm: torsoMesh,
    rightShoulder: frHip, rightUpperArm: torsoMesh, rightElbow: frKnee, rightLowerArm: torsoMesh,
    leftHip: blHip, leftUpperLeg: torsoMesh, leftKnee: blKnee, leftLowerLeg: torsoMesh,
    rightHip: brHip, rightUpperLeg: torsoMesh, rightKnee: brKnee, rightLowerLeg: torsoMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}

function buildSacredElephant(scene: Scene, color: Color3): ArticulatedBody {
  const body = buildMammoth(scene, color, new Color3(0.46, 0.44, 0.42));
  const shrineWood = makeMat(scene, brighten(color, 0.22));
  const shrineGold = makeMat(scene, brighten(color, 0.34));
  const cloth = makeMat(scene, brighten(color, 0.42));

  const platform = MeshBuilder.CreateBox("sacredElephantPlatform", { width: 0.9, height: 0.12, depth: 0.68 }, scene);
  platform.parent = body.torso;
  platform.position.set(0, 0.62, -0.02);
  platform.material = shrineWood;
  body.allMeshes.push(platform);

  for (const xOff of [-0.32, 0.32]) {
    for (const zOff of [-0.2, 0.2]) {
      const post = MeshBuilder.CreateCylinder("sacredElephantPost", { height: 0.42, diameter: 0.06, tessellation: 10 }, scene);
      post.parent = body.torso;
      post.position.set(xOff, 0.86, zOff);
      post.material = shrineGold;
      body.allMeshes.push(post);
    }
  }

  const canopy = MeshBuilder.CreateCylinder("sacredElephantCanopy", { height: 0.24, diameterTop: 0.42, diameterBottom: 1.02, tessellation: 12 }, scene);
  canopy.parent = body.torso;
  canopy.position.set(0, 1.18, -0.02);
  canopy.material = cloth;
  body.allMeshes.push(canopy);

  const halo = MeshBuilder.CreateTorus("sacredElephantHalo", { diameter: 0.84, thickness: 0.04, tessellation: 24 }, scene);
  halo.parent = body.torso;
  halo.position.set(0, 1.36, -0.02);
  halo.rotation.x = Math.PI / 2;
  halo.material = shrineGold;
  body.allMeshes.push(halo);

  const frontalCloth = MeshBuilder.CreatePlane("sacredElephantFrontalCloth", { width: 0.64, height: 0.82 }, scene);
  frontalCloth.parent = body.neck;
  frontalCloth.position.set(0, -0.06, 0.22);
  frontalCloth.rotation.x = -0.18;
  frontalCloth.material = cloth;
  body.allMeshes.push(frontalCloth);

  return body;
}
