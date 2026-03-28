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
// Fires FORWARD (+Z). Arrow rack angles toward +Z.
function buildHwacha(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("hwacha_root", scene);
  const allMeshes: Mesh[] = [];
  const wood = makeMat(scene, new Color3(0.5, 0.35, 0.18));
  const red = makeMat(scene, new Color3(0.7, 0.15, 0.1));

  // Cart base (longer along Z)
  const base = MeshBuilder.CreateBox("base", { width: 0.7, height: 0.15, depth: 1.0 }, scene);
  base.position.y = 0.35; base.parent = root; base.material = wood; allMeshes.push(base);

  // Wheels (on sides)
  for (const xOff of [-0.3, 0.3]) {
    const wheel = MeshBuilder.CreateCylinder("wheel", { height: 0.06, diameter: 0.4, tessellation: 12 }, scene);
    wheel.position.set(xOff, 0.2, -0.2);
    wheel.rotation.z = Math.PI / 2;
    wheel.parent = root; wheel.material = wood; allMeshes.push(wheel);
  }

  // Arrow rack (box angled upward toward +Z)
  const rack = MeshBuilder.CreateBox("rack", { width: 0.5, height: 0.5, depth: 0.8 }, scene);
  rack.position.set(0, 0.7, 0.1);
  rack.rotation.x = 0.3; // tilted forward
  rack.parent = root; rack.material = wood; allMeshes.push(rack);

  // Arrows protruding from rack (pointing +Z)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const arrow = MeshBuilder.CreateCylinder("arrow", { height: 0.5, diameter: 0.02, tessellation: 4 }, scene);
      arrow.position.set(-0.12 + col * 0.08, 0.7 + row * 0.12, 0.4 + col * 0.02);
      arrow.rotation.x = Math.PI / 2 + 0.3; // pointing forward+up
      arrow.parent = root; arrow.material = red; allMeshes.push(arrow);
    }
  }

  // Operator behind (-Z)
  const opHead = addOperator(scene, root, allMeshes, 0.2, 0.68, -0.55, color);

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

// ═══════════════════════ MINOTAUR (BULL) ═══════════════════════
// Quadruped bull body. Faces +Z. Large horns, muscular torso, four legs, tail.
function buildMinotaur(scene: Scene, color: Color3): ArticulatedBody {
  const root = new TransformNode("minotaur_root", scene);
  const allMeshes: Mesh[] = [];
  const fur = makeMat(scene, new Color3(0.4, 0.22, 0.12));
  const darkFur = makeMat(scene, new Color3(0.28, 0.15, 0.08));
  const hornMat = makeMat(scene, new Color3(0.85, 0.8, 0.65));
  const noseMat = makeMat(scene, new Color3(0.55, 0.3, 0.25));

  // Main torso (large barrel shape, elongated along Z)
  const torso = MeshBuilder.CreateCylinder("torso", {
    height: 1.4, diameter: 0.9, tessellation: 12,
  }, scene);
  torso.position.set(0, 0.85, 0);
  torso.rotation.x = Math.PI / 2; // elongated along Z
  torso.parent = root; torso.material = fur; allMeshes.push(torso);

  // Shoulder hump (muscular)
  const hump = MeshBuilder.CreateSphere("hump", { diameter: 0.7, segments: 8 }, scene);
  hump.position.set(0, 1.1, 0.35);
  hump.scaling.set(0.9, 0.7, 0.8);
  hump.parent = root; hump.material = fur; allMeshes.push(hump);

  // Head (forward, at +Z)
  const head = MeshBuilder.CreateBox("head", { width: 0.45, height: 0.4, depth: 0.5 }, scene);
  head.position.set(0, 1.0, 0.95);
  head.parent = root; head.material = fur; allMeshes.push(head);

  // Snout
  const snout = MeshBuilder.CreateBox("snout", { width: 0.3, height: 0.22, depth: 0.25 }, scene);
  snout.position.set(0, 0.85, 1.2);
  snout.parent = root; snout.material = noseMat; allMeshes.push(snout);

  // Nostrils (two small dark spheres)
  for (const xOff of [-0.08, 0.08]) {
    const nostril = MeshBuilder.CreateSphere("nostril", { diameter: 0.06, segments: 4 }, scene);
    nostril.position.set(xOff, 0.82, 1.33);
    nostril.parent = root; nostril.material = darkFur; allMeshes.push(nostril);
  }

  // Eyes
  const eyeMat = makeMat(scene, new Color3(0.9, 0.15, 0.1)); // red eyes
  for (const xOff of [-0.15, 0.15]) {
    const eye = MeshBuilder.CreateSphere("eye", { diameter: 0.08, segments: 6 }, scene);
    eye.position.set(xOff, 1.08, 1.1);
    eye.parent = root; eye.material = eyeMat; allMeshes.push(eye);
  }

  // Horns (large, curving outward and forward)
  for (const side of [-1, 1]) {
    // Base segment (goes up and out)
    const hornBase = MeshBuilder.CreateCylinder("hornBase", {
      height: 0.35, diameterTop: 0.06, diameterBottom: 0.1, tessellation: 8,
    }, scene);
    hornBase.position.set(side * 0.25, 1.25, 0.85);
    hornBase.rotation.z = side * -0.8;
    hornBase.rotation.x = -0.2;
    hornBase.parent = root; hornBase.material = hornMat; allMeshes.push(hornBase);

    // Tip segment (curves forward)
    const hornTip = MeshBuilder.CreateCylinder("hornTip", {
      height: 0.25, diameterTop: 0.02, diameterBottom: 0.06, tessellation: 6,
    }, scene);
    hornTip.position.set(side * 0.42, 1.42, 0.92);
    hornTip.rotation.z = side * -1.2;
    hornTip.rotation.x = 0.4;
    hornTip.parent = root; hornTip.material = hornMat; allMeshes.push(hornTip);
  }

  // Ears
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateBox("ear", { width: 0.12, height: 0.06, depth: 0.08 }, scene);
    ear.position.set(side * 0.28, 1.15, 0.82);
    ear.rotation.z = side * 0.3;
    ear.parent = root; ear.material = fur; allMeshes.push(ear);
  }

  // Four legs
  const legPositions = [
    { x: -0.25, z: 0.4 },  // front left
    { x: 0.25, z: 0.4 },   // front right
    { x: -0.25, z: -0.4 }, // back left
    { x: 0.25, z: -0.4 },  // back right
  ];
  for (const lp of legPositions) {
    // Upper leg
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.45, diameterTop: 0.14, diameterBottom: 0.12, tessellation: 8,
    }, scene);
    upper.position.set(lp.x, 0.5, lp.z);
    upper.parent = root; upper.material = fur; allMeshes.push(upper);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.3, diameterTop: 0.11, diameterBottom: 0.08, tessellation: 8,
    }, scene);
    lower.position.set(lp.x, 0.15, lp.z);
    lower.parent = root; lower.material = darkFur; allMeshes.push(lower);

    // Hoof
    const hoof = MeshBuilder.CreateCylinder("hoof", {
      height: 0.06, diameter: 0.1, tessellation: 6,
    }, scene);
    hoof.position.set(lp.x, 0.03, lp.z);
    hoof.parent = root; hoof.material = darkFur; allMeshes.push(hoof);
  }

  // Tail (extends back from -Z)
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.5, diameterTop: 0.02, diameterBottom: 0.06, tessellation: 6,
  }, scene);
  tail.position.set(0, 0.75, -0.8);
  tail.rotation.x = -0.6;
  tail.parent = root; tail.material = darkFur; allMeshes.push(tail);

  // Tail tuft
  const tuft = MeshBuilder.CreateSphere("tuft", { diameter: 0.1, segments: 4 }, scene);
  tuft.position.set(0, 0.55, -1.0);
  tuft.parent = root; tuft.material = darkFur; allMeshes.push(tuft);

  return wrapAsBody(scene, root, torso, allMeshes, head);
}

function buildMammoth(scene: Scene, _color: Color3): ArticulatedBody {
  const root = new TransformNode("mammoth_root", scene);
  const allMeshes: Mesh[] = [];
  const fur = makeMat(scene, new Color3(0.45, 0.3, 0.18));
  const shaggyFur = makeMat(scene, new Color3(0.38, 0.24, 0.14));
  const tuskMat = makeMat(scene, new Color3(0.92, 0.88, 0.78));
  const darkMat = makeMat(scene, new Color3(0.25, 0.18, 0.12));
  const earMat = makeMat(scene, new Color3(0.5, 0.32, 0.2));

  // ── Main body (massive barrel along Z) ──
  const torso = MeshBuilder.CreateCylinder("torso", {
    height: 2.2, diameter: 1.5, tessellation: 14,
  }, scene);
  torso.position.set(0, 1.4, 0);
  torso.rotation.x = Math.PI / 2;
  torso.parent = root; torso.material = fur; allMeshes.push(torso);

  // Shoulder hump (mammoths have a prominent back hump)
  const hump = MeshBuilder.CreateSphere("hump", { diameter: 1.2, segments: 8 }, scene);
  hump.position.set(0, 1.85, 0.3);
  hump.scaling.set(0.8, 0.6, 0.7);
  hump.parent = root; hump.material = fur; allMeshes.push(hump);

  // Shaggy fur underbelly
  const belly = MeshBuilder.CreateBox("belly", { width: 1.1, height: 0.35, depth: 1.6 }, scene);
  belly.position.set(0, 0.9, 0);
  belly.parent = root; belly.material = shaggyFur; allMeshes.push(belly);

  // ── Head ──
  const head = MeshBuilder.CreateSphere("head", { diameter: 0.9, segments: 8 }, scene);
  head.position.set(0, 1.6, 1.25);
  head.scaling.set(0.85, 1, 0.8);
  head.parent = root; head.material = fur; allMeshes.push(head);

  // Forehead dome
  const dome = MeshBuilder.CreateSphere("dome", { diameter: 0.6, segments: 6 }, scene);
  dome.position.set(0, 1.85, 1.2);
  dome.parent = root; dome.material = fur; allMeshes.push(dome);

  // Eyes (small, dark)
  for (const xOff of [-0.22, 0.22]) {
    const eye = MeshBuilder.CreateSphere("eye", { diameter: 0.08, segments: 6 }, scene);
    eye.position.set(xOff, 1.65, 1.55);
    eye.parent = root; eye.material = darkMat; allMeshes.push(eye);
  }

  // ── Trunk (segmented, curving downward and forward) ──
  const trunkSegments = 5;
  for (let i = 0; i < trunkSegments; i++) {
    const t = i / (trunkSegments - 1);
    const diam = 0.28 - t * 0.14; // tapers from thick to thin
    const seg = MeshBuilder.CreateCylinder("trunk", {
      height: 0.28, diameterTop: diam * 0.85, diameterBottom: diam, tessellation: 8,
    }, scene);
    // Trunk curves downward then slightly forward
    const zOff = 1.55 + t * 0.3;
    const yOff = 1.3 - t * 0.35;
    seg.position.set(0, yOff, zOff);
    seg.rotation.x = -0.3 + t * 0.5; // progressively tilts forward/down
    seg.parent = root; seg.material = fur; allMeshes.push(seg);
  }

  // Trunk tip curl (small sphere)
  const trunkTip = MeshBuilder.CreateSphere("trunkTip", { diameter: 0.12, segments: 4 }, scene);
  trunkTip.position.set(0, 0.15, 1.85);
  trunkTip.parent = root; trunkTip.material = darkMat; allMeshes.push(trunkTip);

  // ── Tusks (large, curving outward and forward then inward) ──
  for (const side of [-1, 1]) {
    // Base (goes down and out from jaw)
    const tuskBase = MeshBuilder.CreateCylinder("tuskBase", {
      height: 0.6, diameterTop: 0.08, diameterBottom: 0.12, tessellation: 8,
    }, scene);
    tuskBase.position.set(side * 0.25, 1.1, 1.4);
    tuskBase.rotation.z = side * 0.3;
    tuskBase.rotation.x = 0.4;
    tuskBase.parent = root; tuskBase.material = tuskMat; allMeshes.push(tuskBase);

    // Mid (curves forward and outward)
    const tuskMid = MeshBuilder.CreateCylinder("tuskMid", {
      height: 0.5, diameterTop: 0.05, diameterBottom: 0.08, tessellation: 8,
    }, scene);
    tuskMid.position.set(side * 0.38, 0.72, 1.65);
    tuskMid.rotation.z = side * 0.1;
    tuskMid.rotation.x = 1.0;
    tuskMid.parent = root; tuskMid.material = tuskMat; allMeshes.push(tuskMid);

    // Tip (curves upward)
    const tuskTip = MeshBuilder.CreateCylinder("tuskTip", {
      height: 0.35, diameterTop: 0.02, diameterBottom: 0.05, tessellation: 6,
    }, scene);
    tuskTip.position.set(side * 0.35, 0.6, 2.0);
    tuskTip.rotation.z = side * -0.2;
    tuskTip.rotation.x = 1.4;
    tuskTip.parent = root; tuskTip.material = tuskMat; allMeshes.push(tuskTip);
  }

  // ── Ears (large, flat, hanging down from sides of head) ──
  for (const side of [-1, 1]) {
    const ear = MeshBuilder.CreateBox("ear", { width: 0.5, height: 0.6, depth: 0.06 }, scene);
    ear.position.set(side * 0.52, 1.45, 1.1);
    ear.rotation.z = side * 0.4;
    ear.rotation.y = side * 0.2;
    ear.parent = root; ear.material = earMat; allMeshes.push(ear);
  }

  // ── Four thick legs ──
  const legPositions = [
    { x: -0.4, z: 0.55 },  // front left
    { x: 0.4, z: 0.55 },   // front right
    { x: -0.4, z: -0.55 }, // back left
    { x: 0.4, z: -0.55 },  // back right
  ];
  for (const lp of legPositions) {
    // Upper leg (thick, pillar-like)
    const upper = MeshBuilder.CreateCylinder("uleg", {
      height: 0.65, diameterTop: 0.28, diameterBottom: 0.24, tessellation: 10,
    }, scene);
    upper.position.set(lp.x, 0.75, lp.z);
    upper.parent = root; upper.material = fur; allMeshes.push(upper);

    // Lower leg
    const lower = MeshBuilder.CreateCylinder("lleg", {
      height: 0.45, diameterTop: 0.22, diameterBottom: 0.18, tessellation: 10,
    }, scene);
    lower.position.set(lp.x, 0.3, lp.z);
    lower.parent = root; lower.material = shaggyFur; allMeshes.push(lower);

    // Foot (flat, wide)
    const foot = MeshBuilder.CreateCylinder("foot", {
      height: 0.08, diameter: 0.24, tessellation: 8,
    }, scene);
    foot.position.set(lp.x, 0.04, lp.z);
    foot.parent = root; foot.material = darkMat; allMeshes.push(foot);
  }

  // ── Tail (short, thin, with tuft) ──
  const tail = MeshBuilder.CreateCylinder("tail", {
    height: 0.5, diameterTop: 0.03, diameterBottom: 0.06, tessellation: 6,
  }, scene);
  tail.position.set(0, 1.2, -1.15);
  tail.rotation.x = -0.7;
  tail.parent = root; tail.material = darkMat; allMeshes.push(tail);

  const tuft = MeshBuilder.CreateSphere("tuft", { diameter: 0.1, segments: 4 }, scene);
  tuft.position.set(0, 0.95, -1.35);
  tuft.parent = root; tuft.material = darkMat; allMeshes.push(tuft);

  return wrapAsBody(scene, root, torso, allMeshes, head);
}
