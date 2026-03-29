import {
  Scene, TransformNode, Mesh, MeshBuilder, StandardMaterial, Color3, Vector3,
} from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";

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
): ArticulatedBody {
  const hip = dummyJoint("v_hip", root, scene);
  hip.position.y = 0.5;
  const torso = dummyJoint("v_torso", hip, scene);
  const neck = dummyJoint("v_neck", torso, scene);

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

  const hd = headMesh ?? mainMesh;
  const allJoints = [hip, torso, neck, lShoulder, lElbow, rShoulder, rElbow, lHip, lKnee, rHip, rKnee];

  return {
    root, hip, torso, torsoMesh: mainMesh, neck, headMesh: hd,
    leftShoulder: lShoulder, leftUpperArm: mainMesh, leftElbow: lElbow, leftLowerArm: mainMesh,
    rightShoulder: rShoulder, rightUpperArm: mainMesh, rightElbow: rElbow, rightLowerArm: mainMesh,
    leftHip: lHip, leftUpperLeg: mainMesh, leftKnee: lKnee, leftLowerLeg: mainMesh,
    rightHip: rHip, rightUpperLeg: mainMesh, rightKnee: rKnee, rightLowerLeg: mainMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}

// Helper to add an operator (small person) at a given position
function addOperator(
  scene: Scene, root: TransformNode, allMeshes: Mesh[],
  x: number, y: number, z: number, color: Color3,
): Mesh {
  const skinMat = makeMat(scene, new Color3(0.85, 0.72, 0.6));
  const opHead = MeshBuilder.CreateSphere("ophead", { diameter: 0.18, segments: 6 }, scene);
  opHead.position.set(x, y + 0.23, z);
  opHead.parent = root; opHead.material = skinMat; allMeshes.push(opHead);
  const opBody = MeshBuilder.CreateBox("opbody", { width: 0.18, height: 0.25, depth: 0.12 }, scene);
  opBody.position.set(x, y, z);
  opBody.parent = root; opBody.material = makeMat(scene, color); allMeshes.push(opBody);
  return opHead;
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
  const opHead = addOperator(scene, root, allMeshes, 0.4, 0.72, -0.5, color);

  return wrapAsBody(scene, root, base, allMeshes, opHead);
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
  const opHead = addOperator(scene, root, allMeshes, 0.25, 0.72, -0.5, color);

  return wrapAsBody(scene, root, base, allMeshes, opHead);
}

// ═══════════════════════ HWACHA ═══════════════════════
// TABS-style hwacha: wide wooden cart with large tilted rack of many rocket arrows.
function buildHwacha(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("hwacha_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const darkWood = makeMat(scene, new Color3(0.35, 0.22, 0.1));
  const red = makeMat(scene, new Color3(0.7, 0.15, 0.1));
  const shaft = makeMat(scene, new Color3(0.6, 0.5, 0.3));

  // Cart base - wider and sturdier
  const base = MeshBuilder.CreateBox("base", { width: 1.0, height: 0.12, depth: 1.1 }, scene);
  base.position.y = 0.32; base.parent = root; base.material = wood; allMeshes.push(base);

  // Cross beam under base
  const crossBeam = MeshBuilder.CreateBox("xbeam", { width: 1.1, height: 0.06, depth: 0.08 }, scene);
  crossBeam.position.set(0, 0.22, 0); crossBeam.parent = root; crossBeam.material = darkWood; allMeshes.push(crossBeam);

  // Wheels (larger, with spokes)
  for (const xOff of [-0.45, 0.45]) {
    const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.07, diameter: 0.5, tessellation: 14 }, scene);
    wheel.position.set(xOff, 0.25, -0.15);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = darkWood; allMeshes.push(wheel);
    // Spokes
    for (let s = 0; s < 6; s++) {
      const spoke = MeshBuilder.CreateBox("spoke", { width: 0.02, height: 0.22, depth: 0.02 }, scene);
      spoke.position.set(xOff, 0.25, -0.15);
      spoke.rotation.set(0, 0, s * Math.PI / 6);
      spoke.parent = root; spoke.material = wood; allMeshes.push(spoke);
    }
  }

  // Rack frame - open wooden frame tilted ~35° forward
  const rackPivot = new TransformNode("rackPivot", scene);
  rackPivot.position.set(0, 0.4, 0.05);
  rackPivot.rotation.x = 0.6; // ~35° tilt forward
  rackPivot.parent = root;

  // Side rails of the rack
  for (const xOff of [-0.38, 0.38]) {
    const rail = MeshBuilder.CreateBox("rail", { width: 0.05, height: 0.7, depth: 0.06 }, scene);
    rail.position.set(xOff, 0.35, 0);
    rail.parent = rackPivot; rail.material = darkWood; allMeshes.push(rail);
  }
  // Top and bottom cross bars
  for (const yOff of [0.02, 0.68]) {
    const bar = MeshBuilder.CreateBox("bar", { width: 0.76, height: 0.04, depth: 0.06 }, scene);
    bar.position.set(0, yOff, 0);
    bar.parent = rackPivot; bar.material = darkWood; allMeshes.push(bar);
  }
  // Middle shelf
  const shelf = MeshBuilder.CreateBox("shelf", { width: 0.72, height: 0.03, depth: 0.12 }, scene);
  shelf.position.set(0, 0.35, 0);
  shelf.parent = rackPivot; shelf.material = wood; allMeshes.push(shelf);

  // Rocket arrows in rack (5 columns × 4 rows = 20 arrows)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const arrowShaft = MeshBuilder.CreateCylinder("arr", { height: 0.6, diameter: 0.025, tessellation: 4 }, scene);
      arrowShaft.position.set(-0.28 + col * 0.14, 0.08 + row * 0.17, 0.1);
      arrowShaft.rotation.x = Math.PI / 2; // point forward out of rack
      arrowShaft.parent = rackPivot; arrowShaft.material = shaft; allMeshes.push(arrowShaft);
      // Red tip
      const tip = MeshBuilder.CreateCylinder("tip", { height: 0.08, diameterTop: 0, diameterBottom: 0.04, tessellation: 4 }, scene);
      tip.position.set(-0.28 + col * 0.14, 0.08 + row * 0.17, 0.42);
      tip.rotation.x = Math.PI / 2;
      tip.parent = rackPivot; tip.material = red; allMeshes.push(tip);
    }
  }

  // Rear support legs (A-frame bracing)
  for (const xOff of [-0.25, 0.25]) {
    const leg = MeshBuilder.CreateBox("leg", { width: 0.04, height: 0.5, depth: 0.04 }, scene);
    leg.position.set(xOff, 0.5, -0.35);
    leg.rotation.x = -0.3;
    leg.parent = root; leg.material = darkWood; allMeshes.push(leg);
  }

  // Operator behind (-Z)
  const opHead = addOperator(scene, root, allMeshes, 0.2, 0.68, -0.65, color);

  return wrapAsBody(scene, root, base, allMeshes, opHead);
}

// ═══════════════════════ CANNON ═══════════════════════
// Fires FORWARD (+Z). Barrel points along +Z. Trail extends back (-Z).
function buildCannon(scene: Scene, color: Color3): ArticulatedBody {
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
  const opHead = addOperator(scene, root, allMeshes, 0.2, 0.57, -0.6, color);

  return wrapAsBody(scene, root, barrel, allMeshes, opHead);
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

  return wrapAsBody(scene, root, hull, allMeshes);
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
  const skinMat = makeMat(scene, new Color3(0.85, 0.72, 0.6));
  const opHead = MeshBuilder.CreateSphere("ophead", { diameter: 0.2, segments: 6 }, scene);
  opHead.position.set(0, 1.2, -0.55);
  opHead.parent = root; opHead.material = skinMat; allMeshes.push(opHead);
  const opTorso = MeshBuilder.CreateBox("optorso", { width: 0.22, height: 0.3, depth: 0.14 }, scene);
  opTorso.position.set(0, 0.95, -0.55);
  opTorso.parent = root; opTorso.material = makeMat(scene, color); allMeshes.push(opTorso);
  // Arms reaching forward to handles
  for (const xOff of [-0.12, 0.12]) {
    const arm = MeshBuilder.CreateCylinder("arm", { height: 0.3, diameter: 0.05, tessellation: 6 }, scene);
    arm.position.set(xOff, 0.85, -0.4);
    arm.rotation.x = -0.6; // reaching forward
    arm.parent = root; arm.material = skinMat; allMeshes.push(arm);
  }
  // Legs
  for (const xOff of [-0.08, 0.08]) {
    const leg = MeshBuilder.CreateCylinder("leg", { height: 0.35, diameter: 0.06, tessellation: 6 }, scene);
    leg.position.set(xOff, 0.57, -0.55);
    leg.parent = root; leg.material = makeMat(scene, color); allMeshes.push(leg);
  }

  return wrapAsBody(scene, root, tray, allMeshes, opHead);
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
    root, hip, torso: torsoJoint, torsoMesh: bodyMesh, neck: neckJoint, headMesh,
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
    root, hip, torso, torsoMesh, neck, headMesh,
    leftShoulder: flHip, leftUpperArm: torsoMesh, leftElbow: flKnee, leftLowerArm: torsoMesh,
    rightShoulder: frHip, rightUpperArm: torsoMesh, rightElbow: frKnee, rightLowerArm: torsoMesh,
    leftHip: blHip, leftUpperLeg: torsoMesh, leftKnee: blKnee, leftLowerLeg: torsoMesh,
    rightHip: brHip, rightUpperLeg: torsoMesh, rightKnee: brKnee, rightLowerLeg: torsoMesh,
    rightHand: rHand, leftHand: lHand, headTop,
    allMeshes, allJoints,
  };
}
