import {
  Scene, TransformNode, Mesh, MeshBuilder, Color3, Quaternion, Vector3, Ray, Matrix,
  PBRMetallicRoughnessMaterial,
} from "@babylonjs/core";
import { buildArticulatedBody, crewProportions } from "./bodyBuilder";
import type { ArticulatedBody, BodyMetrics, VehicleSocketSet } from "./bodyBuilder";
import { getMaterialFactory } from "./materialFactory";
import { jitterVertices } from "./tribalDress";
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
    // A small man in the cut of the infantry: his own height, head and limb lengths, their shirt and trouser widths
    crewProportions({
      scale: 0.46,
      headSize: 1.04,
      armLength: 0.9,
      legLength: 0.92,
      headLength: 1.28,
      headWidth: 0.82,
      torsoRoundness: 1.1,
      handSize: 1.06,
      footLength: 1.1,
      footWidth: 0.94,
      footHeight: 0.86,
    }),
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
// A siege machine stands over the men beside it: built at man height, then the whole rig is scaled under the root
const CATAPULT_SCALE = 1.4;
function buildCatapult(scene: Scene, color: Color3, options: { spooky?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("catapult_root", scene);
  const rig = new TransformNode("catapult_rig", scene);
  rig.parent = root;
  rig.scaling.setAll(CATAPULT_SCALE);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = getMaterialFactory().get("wood", new Color3(0.36, 0.13, 0.09), { emissive: new Color3(0.08, 0.04, 0.035) }); // the cannon carriage's dark red-brown timber: the old tan went khaki-olive under the sky light
  const metal = makeMat(scene, new Color3(0.45, 0.45, 0.5));
  const wheelWood = makeMat(scene, new Color3(0.2, 0.14, 0.09)); // the cannon's dark wheel timber, so the wheels stand off the frame
  const pumpkinMat = makeMat(scene, new Color3(0.88, 0.42, 0.12));

  // Base platform (longer along Z = firing axis)
  const base = MeshBuilder.CreateBox("base", { width: 1.0, height: 0.2, depth: 1.6 }, scene);
  base.position.y = 0.4; base.parent = rig; base.material = wood; allMeshes.push(base);

  // Wheels (on the sides, X axis): as tall as the deck and thick, standing clear of its edges
  for (const xOff of [-0.58, 0.58]) {
    for (const zOff of [-0.5, 0.5]) {
      const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.08, diameter: 0.7, tessellation: 12 }, scene); // thinner than the rim round it, so the rim stands proud of the face
      wheel.position.set(xOff, 0.35, zOff);
      wheel.rotation.z = Math.PI / 2;
      wheel.parent = rig; wheel.material = wood; allMeshes.push(wheel); // the face is the frame's timber: the dark is the rim and hub on it, as on the cannon
      const wheelRim = MeshBuilder.CreateTorus("wheelRim", { diameter: 0.64, thickness: 0.12, tessellation: 12 }, scene);
      wheelRim.position.set(xOff, 0.35, zOff);
      wheelRim.rotation.z = Math.PI / 2;
      wheelRim.parent = rig; wheelRim.material = wheelWood; allMeshes.push(wheelRim);
      const wheelHub = MeshBuilder.CreateCylinder("wheelHub", { height: 0.24, diameter: 0.2, tessellation: 8 }, scene);
      wheelHub.position.set(xOff, 0.35, zOff);
      wheelHub.rotation.z = Math.PI / 2;
      wheelHub.parent = rig; wheelHub.material = wheelWood; allMeshes.push(wheelHub);
    }
  }

  // Upright frame (straddles the base, perpendicular to firing direction)
  for (const xOff of [-0.35, 0.35]) {
    const post = MeshBuilder.CreateBox("post", { width: 0.16, height: 1.0, depth: 0.16 }, scene);
    post.position.set(xOff, 1.0, 0);
    post.parent = rig; post.material = wood; allMeshes.push(post);
  }
  const crossbar = MeshBuilder.CreateBox("crossbar", { width: 0.86, height: 0.16, depth: 0.16 }, scene); // as thick as the posts it caps
  crossbar.position.set(0, 1.5, 0);
  crossbar.parent = rig; crossbar.material = wood; allMeshes.push(crossbar);

  // Throwing arm (pivots at crossbar, extends along Z)
  const arm = MeshBuilder.CreateBox("arm", { width: 0.16, height: 0.16, depth: 1.8 }, scene);
  arm.position.set(0, 1.65, 0.2);
  arm.rotation.x = -0.1; // near level, bucket end a little up toward +Z (a positive turn about X drops the +Z end), lying on the crossbar: at -0.4 the raised arm set the height of the machine and it stood up like a goalpost
  arm.parent = rig; arm.material = wood; allMeshes.push(arm);

  // Bucket on the tip of the arm (+Z): a wide tray three arms across with the shot lying in it, not a small empty box partway down
  const bucket = MeshBuilder.CreateBox("bucket", { width: 0.5, height: 0.16, depth: 0.45 }, scene);
  bucket.position.set(0, 1.78, 0.99);
  bucket.rotation.x = -0.1;
  bucket.parent = rig; bucket.material = wood; allMeshes.push(bucket); // the arm's own timber: in iron it was a blue-grey slab

  if (options.spooky) {
    const pumpkin = MeshBuilder.CreateSphere("pumpkinPayload", { diameter: 0.45, segments: 8 }, scene);
    pumpkin.position.set(0, 2.03, 0.965);
    pumpkin.parent = rig;
    pumpkin.material = pumpkinMat;
    allMeshes.push(pumpkin);
  } else {
    const boulder = MeshBuilder.CreateSphere("boulderPayload", { diameter: 0.65, segments: 2 }, scene); // wider than the tray it lies in: at 0.45 it was a small ball on a slab
    boulder.position.set(0, 2.13, 0.955);
    boulder.parent = rig;
    boulder.material = makeMat(scene, new Color3(0.2, 0.19, 0.2));
    allMeshes.push(boulder);
  }

  // Counterweight at back end (-Z), hung under the arm: a big dark block of the wheels' timber. As the tinted main mesh it was a pale team-coloured card between the posts
  const cw = MeshBuilder.CreateBox("cw", { width: 0.36, height: 0.44, depth: 0.4 }, scene);
  cw.position.set(0, 1.28, -0.5);
  cw.parent = rig; cw.material = wheelWood; allMeshes.push(cw);

  // Axle under the deck: the body mesh that takes the team tint, as on the cannon, so the timber keeps its own colours
  const axle = MeshBuilder.CreateCylinder("axle", { height: 1.1, diameter: 0.08, tessellation: 6 }, scene);
  axle.position.y = 0.35;
  axle.rotation.z = Math.PI / 2;
  axle.parent = rig; axle.material = teamPrimary; allMeshes.push(axle);

  // Operator sitting beside, behind the frame
  // Dressed as a gun crewman: bare, he was a washed mannequin beside the machine
  const operator = addOperator(scene, rig, allMeshes, 0.4, 0.72, -0.5, color, (body) => {
    dressCannonCrew(scene, body, color);
  });

  const vehicleSockets: VehicleSocketSet = {
    primaryMuzzle: makeSocket(scene, rig, "catapult_bucket_socket", new Vector3(0, 2.03, 0.965)),
    impactOrigin: makeSocket(scene, rig, "catapult_impact_socket", new Vector3(0, 1.78, 0.99)),
  };

  return wrapAsBody(
    scene,
    root,
    axle,
    allMeshes,
    operator.headMesh,
    makeBodyMetrics(operator.headTopY * CATAPULT_SCALE, 0.8 * CATAPULT_SCALE, 0.45 * CATAPULT_SCALE, 0.8 * CATAPULT_SCALE),
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

function buildCannon(scene: Scene, color: Color3, options: { showOperators?: boolean } = {}): ArticulatedBody {
  const root = new TransformNode("cannon_root", scene);
  const allMeshes: Mesh[] = [];
  const teamPrimary = makeMat(scene, color);
  const wood = getMaterialFactory().get("wood", new Color3(0.36, 0.13, 0.09), { emissive: new Color3(0.08, 0.04, 0.035) }); // dark red-brown wood, a little self-lit so the shaded side stays wood and not black
  const metal = makeMat(scene, new Color3(0.55, 0.50, 0.46)); // iron grey, a little warm against the blue sky light, under which a cool dark grey went navy
  const wheelWood = makeMat(scene, new Color3(0.2, 0.14, 0.09));

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
  const axle = MeshBuilder.CreateCylinder("axle", { height: 0.56, diameter: 0.06, tessellation: 6 }, scene);
  axle.position.y = 0.24;
  axle.rotation.z = Math.PI / 2;
  axle.parent = root; axle.material = teamPrimary; allMeshes.push(axle);

  // Wheels (on sides, X axis): dark, and 0.44 across, so the rims come to the crew's waist and the barrel rides over them: at 0.58 a rim stood to a crewman's shoulder and the gun dwarfed the men serving it.
  // An open rim on eight thick spokes, with daylight between them, not a solid slab
  for (const xOff of [-0.3, 0.3]) {
    const wheel = MeshBuilder.CreateTorus("wheel", { diameter: 0.44, thickness: 0.1, tessellation: 14 }, scene);
    wheel.position.set(xOff, 0.24, 0);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = wheelWood; allMeshes.push(wheel);

    // Hub: a fat block on the axle where the spokes meet
    const wheelHub = MeshBuilder.CreateCylinder("wheelHub", { height: 0.1, diameter: 0.12, tessellation: 8 }, scene);
    wheelHub.position.set(xOff, 0.24, 0);
    wheelHub.rotation.z = Math.PI / 2;
    wheelHub.parent = root; wheelHub.material = wheelWood; allMeshes.push(wheelHub);

    // Spokes: four bars across the full rim, turned about the axle
    for (let i = 0; i < 4; i++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: 0.05, height: 0.4, depth: 0.05 }, scene);
      spoke.position.set(xOff, 0.24, 0);
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
  // two raised bands and a knob on the back end. Its axis is 0.44 up, under the top of the rims, so it lies down between the wheels in the bed: at 0.52 it rode perched above the rims
  const barrel = MeshBuilder.CreateCylinder("barrel", { height: 0.8, diameterTop: 0.22, diameterBottom: 0.28, tessellation: 8 }, scene);
  barrel.position.set(0, 0.44, 0.35);
  barrel.rotation.x = Math.PI / 2; // along Z
  barrel.parent = root; barrel.material = metal; allMeshes.push(barrel);
  for (const [z, d] of [[0.08, 0.33], [0.45, 0.29]]) {
    const band = MeshBuilder.CreateCylinder("barrelBand", { height: 0.07, diameter: d, tessellation: 8 }, scene);
    band.position.set(0, 0.44, z);
    band.rotation.x = Math.PI / 2;
    band.parent = root; band.material = metal; allMeshes.push(band);
  }
  const knob = MeshBuilder.CreateSphere("breechKnob", { diameter: 0.14, segments: 3 }, scene);
  knob.position.set(0, 0.44, -0.1);
  knob.parent = root; knob.material = metal; allMeshes.push(knob);

  // Muzzle flare at front (+Z end)
  const muzzle = MeshBuilder.CreateCylinder("muzzle", { height: 0.08, diameterTop: 0.3, diameterBottom: 0.22, tessellation: 8 }, scene);
  muzzle.position.set(0, 0.44, 0.75);
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
    primaryMuzzle: makeSocket(scene, root, "cannon_muzzle_socket", new Vector3(0, 0.44, 0.86)),
    smokeSocket: makeSocket(scene, root, "cannon_smoke_socket", new Vector3(0, 0.44, 0.78)),
    impactOrigin: makeSocket(scene, root, "cannon_impact_socket", new Vector3(0, 0.44, 0.7)),
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
  // The drum (330, card Characteristics "the machine spins around, launching cannonballs from the cannons"): the hull, its cannons, their muzzles and the
  // viewport ride one node that RuntimeUnit spins about the upright while the tank fights (DRUM_SPIN); the base, the wheels and Da Vinci stay put
  const drum = new TransformNode("davinci_spin", scene);
  drum.parent = root;

  // Conical hull
  const hull = MeshBuilder.CreateCylinder("hull", {
    height: 0.9, diameterTop: 0.15, diameterBottom: 2.0, tessellation: 16,
  }, scene);
  hull.position.y = 0.6; hull.parent = drum; hull.material = teamPrimary; allMeshes.push(hull);

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
    barrel.parent = drum; barrel.material = metal; allMeshes.push(barrel);
    muzzleSequence.push(makeSocket(scene, drum, `davinci_muzzle_${i}`, new Vector3(Math.cos(angle) * 1.08, 0.3, Math.sin(angle) * 1.08)));
  }

  // Top viewport
  const viewport = MeshBuilder.CreateCylinder("viewport", { height: 0.15, diameter: 0.3, tessellation: 8 }, scene);
  viewport.position.y = 1.1; viewport.parent = drum; viewport.material = metal; allMeshes.push(viewport);

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
const MAMMOTH_MANE_COLOR = new Color3(0.2, 0.1, 0.06);
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
  const tuskMat = getMaterialFactory().get("bone", new Color3(1.0, 0.82, 0.58), { emissive: new Color3(0.22, 0.16, 0.09) });
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
  const torsoMesh = MeshBuilder.CreateSphere("torso", { diameter: 2, segments: 4 }, scene);
  torsoMesh.position.set(0, BODY_LIFT, BODY_BACK);
  torsoMesh.scaling.copyFrom(BODY_RADII);
  torsoMesh.parent = torso; torsoMesh.material = fur; allMeshes.push(torsoMesh);
  // The mammoth's coat is lumpy fur, not a smooth balloon: every vertex pushed in or out by its own hashed share (the same mesh every spawn)
  if (mammoth) jitterVertices(torsoMesh, MAMMOTH_FUR.jitter, 41.7);

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
  maneBall("dome", new Vector3(0.48, 0.3, 0.58), new Vector3(0, 0.52, 0.25), 3.3);
  maneBall("crest", new Vector3(0.42, 0.36, 0.56), new Vector3(0, 0.5, -0.2), 5.9);
  for (const [x, y, z, h, lean] of [[0, 0.82, 0.12, 0.55, 0.35], [-0.16, 0.72, 0.0, 0.44, 0.1], [0.16, 0.72, 0.0, 0.44, 0.1]]) {
    const tuft = maneBall("topknot", new Vector3(h * 0.5, h * 0.42, h * 0.5), new Vector3(x, y, z), 7.1 + x * 10);
    tuft.rotation.x = lean;
    tuft.rotation.z = -x * 1.6;
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
        const dot = MeshBuilder.CreateSphere("trunkDot", { diameter: FACE_PAINT.dot, segments: 4 }, scene);
        dot.scaling.set(0.3, 1, 1);
        dot.position.set(side * at.radius * 0.97, at.centre.y, at.centre.z);
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

  // Map to ArticulatedBody: front legs = arms, back legs = legs
  const rHand = dummyJoint("m_rhand", frKnee, scene);
  const lHand = dummyJoint("m_lhand", flKnee, scene);
  const headTop = dummyJoint("m_headtop", neck, scene);

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
