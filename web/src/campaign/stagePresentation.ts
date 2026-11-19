// Curated levels sometimes start actors on scenery. Presentation stays separate
// from flat deterministic battle coordinates and is removed whenever a level resets.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene, type ShadowGenerator } from "@babylonjs/core";
import { markStatic, setActiveHeightField, terrainMesh, type HeightField } from "../map/terrain";
import type { RuntimeUnit } from "../units/runtimeUnit";

let cleanup: (() => void) | null = null;

/**
 * Survey "perched on the trees" (reference/stages/adventure.tree_mammoths.png): every enemy starts on its own big ball crown on a white
 * birch trunk, the tribal_1 ring's crowns at perch size, set along the enemy arc of the ring. Spec: one crown under each team-1 unit's
 * spawn, radius r, its standing top at y top..top+vary (seeded per unit). The height field is flat over the crown (flat m from its
 * centre) and ramps to the ground by r + ramp, so a unit that walks off slides down the crown. Drawn only: the battle stays flat.
 */
interface Perch { r: number; top: number; vary: number; flat: number; ramp: number }
const PERCHES: Record<string, Perch> = {
  "adventure.tree_mammoths": { r: 3.6, top: 6.5, vary: 1.5, flat: 2.4, ramp: 3.2 },
  // reference/stages/adventure.tree_tribe.png: the tribe stands one man to a crown, crowns 3-4 m across at 5-7.5 m, three loose rows
  "adventure.tree_tribe": { r: 1.6, top: 5, vary: 2.5, flat: 0.9, ramp: 1.6 },
};
const PERCH_CROWNS = ["tribal1CrownOrange", "tribal1CrownRed", "tribal1CrownOrange2", "tribal1CrownYellow", "tribal1CrownRed2"];

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

/**
 * Survey "a dim cave ... hiding inside, enjoying the fire" (reference/stages/adventure.sneaky_tribe.png): a dark mouth in a wall of
 * faceted grey rock, a boulder either side of it and flat slabs on the ground before it. Spec: the tribe stands 6 x 6 at 1.4 m in
 * x 19..26, z -23.5..-16.5 (adventure.ts), on the front-right ridge's foot; round it a rock shell open to -x (the player): side walls at
 * z -26 and -14 (6-7 m), a back wall at x 30, a 1.8 m roof over x 16..32 whose lip hangs to 3.4 m at the mouth, a crag on top, the
 * inside lined near-black and the roof casting shadow, a fire at the back. Drawn only: no colliders, the battle stays flat.
 */
function tribeCave(scene: Scene): void {
  const rock = scene.getMaterialByName("tribal1Cliff");
  const dark = new StandardMaterial("caveDark", scene);
  dark.diffuseColor = new Color3(0.07, 0.055, 0.055);
  dark.emissiveColor = new Color3(0.02, 0.015, 0.015);
  dark.specularColor = Color3.Black();
  const flame = new StandardMaterial("caveFire", scene);
  flame.diffuseColor = Color3.Black();
  flame.emissiveColor = new Color3(1.2, 0.5, 0.08);
  flame.disableLighting = true;
  const parts: Mesh[] = [];
  const block = (w: number, h: number, d: number, x: number, y: number, z: number, k: number) => {
    const b = MeshBuilder.CreateCylinder("caveRock", { diameterTop: w * 0.82, diameterBottom: w, height: h, tessellation: 6 }, scene);
    b.scaling.z = d / w;
    b.position.set(x, y, z);
    b.rotation.set((seeded(k, 71) - 0.5) * 0.12, (seeded(k, 72) - 0.5) * 0.5, (seeded(k, 73) - 0.5) * 0.1);
    parts.push(b);
  };
  let k = 0;
  // side walls: three masses each, stepping down toward the mouth
  for (const side of [-1, 1]) {
    const z = -20 + side * 6.3;
    for (const [x, h] of [[18, 5.6], [23, 6.6], [28, 7]] as const) block(5.6, h, 3.2, x, h / 2, z + side * seeded(++k, 74) * 0.6, k);
  }
  // back wall and the roof slab with its lip, a crag on top
  block(5, 7.4, 13.5, 30.6, 3.7, -20, ++k);
  const roof = MeshBuilder.CreateBox("caveRoof", { width: 16, height: 1.8, depth: 14.5 }, scene);
  roof.position.set(24, 5.3, -20);
  roof.rotation.set(0.04, 0, -0.06);
  parts.push(roof);
  block(4, 1.6, 13.5, 16.6, 4.2, -20, ++k);
  block(5.5, 4.5, 5, 26, 8.2, -21.5, ++k);
  block(3.5, 3, 3.5, 21, 7, -17, ++k);
  // a boulder either side of the mouth, flat slabs before it
  for (const [x, z, r] of [[15.2, -25.4, 1.7], [15.6, -14.8, 1.4]] as const) {
    const b = MeshBuilder.CreateIcoSphere("caveRock", { radius: r, subdivisions: 1 }, scene);
    b.position.set(x, r * 0.6, z);
    b.scaling.y = 0.8;
    parts.push(b);
  }
  for (const [x, z, w, d, yaw] of [[12.5, -21.5, 3.2, 2.2, 0.4], [14, -17.8, 2.6, 1.8, -0.3], [10.8, -18.6, 2, 1.5, 0.9]] as const) {
    const s = MeshBuilder.CreateCylinder("caveRock", { diameter: w, height: 0.35, tessellation: 5 }, scene);
    s.scaling.z = d / w;
    s.position.set(x, 0.1, z);
    s.rotation.set(0.05, yaw, 0.04);
    parts.push(s);
  }
  const shell = Mesh.MergeMeshes(parts, true);
  const meshes: Mesh[] = [];
  if (shell) {
    shell.name = "tribeCave";
    shell.convertToFlatShadedMesh();
    shell.material = rock;
    meshes.push(shell);
  }
  // the dark inside: a liner on the back wall, both side walls and under the roof
  const liner = [
    MeshBuilder.CreatePlane("caveLiner", { width: 12, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 12.5, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 12.5, height: 6 }, scene),
    MeshBuilder.CreatePlane("caveLiner", { width: 14, height: 11.5 }, scene),
  ];
  liner[0].position.set(28.05, 3, -20);
  liner[0].rotation.y = Math.PI / 2;
  liner[1].position.set(22.5, 3, -24.6);
  liner[2].position.set(22.5, 3, -15.4);
  liner[2].rotation.y = Math.PI;
  liner[3].position.set(23, 4.35, -20);
  liner[3].rotation.x = -Math.PI / 2;
  for (const m of liner) {
    m.material = dark;
    m.sideOrientation = Mesh.DOUBLESIDE;
    meshes.push(m);
  }
  // the fire at the back
  const fire = MeshBuilder.CreateCylinder("caveFire", { diameterTop: 0, diameterBottom: 0.9, height: 1.1, tessellation: 5 }, scene);
  fire.position.set(27.3, 0.55, -20);
  fire.material = flame;
  meshes.push(fire);
  const shadows = scene.lights.map((l) => l.getShadowGenerator() as ShadowGenerator | null).find((g) => g);
  for (const m of meshes) {
    m.isPickable = false;
    m.receiveShadows = m !== fire;
    if (m !== fire) shadows?.addShadowCaster(m);
  }
  markStatic(meshes);
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    for (const mat of [dark, flame]) mat.dispose();
  };
}

function perchCrowns(scene: Scene, units: RuntimeUnit[], base: HeightField | null, p: Perch): void {
  const crowns = PERCH_CROWNS.map((n) => scene.getMaterialByName(n));
  const bark = scene.getMaterialByName("tribal1Birch");
  const glow = scene.getGlowLayerByName("glow");
  const seats: Array<{ x: number; z: number; h: number }> = [];
  const meshes: Mesh[] = [];
  units.filter((u) => u.team === 1 && !u.linkedParent).forEach((u, i) => {
    const x = u.position.x, z = u.position.z;
    const h = p.top + seeded(i, 61) * p.vary;
    const centre = h - p.r * 0.8;
    const trunk = MeshBuilder.CreateCylinder("perchTrunk", { height: centre, diameterTop: 0.3 + p.r * 0.06, diameterBottom: 0.45 + p.r * 0.1, tessellation: 6 }, scene);
    trunk.position.set(x, centre / 2, z);
    trunk.material = bark;
    const ball = MeshBuilder.CreateIcoSphere("perchCrown", { radius: p.r, subdivisions: 1 }, scene);
    ball.scaling.y = 0.92;
    ball.rotation.y = seeded(i, 62) * Math.PI;
    ball.position.set(x, centre, z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 63) * crowns.length)];
    ball.applyFog = false;
    glow?.addExcludedMesh(ball);
    for (const m of [trunk, ball]) {
      m.receiveShadows = true;
      m.isPickable = false;
      meshes.push(m);
    }
    seats.push({ x, z, h });
  });
  markStatic(meshes);
  const reach = p.r + p.ramp;
  const perched: HeightField = (x, z) => {
    let best = 0;
    for (const s of seats) {
      const dx = x - s.x, dz = z - s.z;
      if (Math.abs(dx) > reach || Math.abs(dz) > reach) continue;
      const d = Math.hypot(dx, dz);
      if (d >= reach) continue;
      const e = d <= p.flat ? 1 : 1 - (d - p.flat) / (reach - p.flat);
      best = Math.max(best, s.h * e * e * (3 - 2 * e));
    }
    return best;
  };
  setActiveHeightField((x, z) => Math.max(base?.(x, z) ?? 0, perched(x, z)));
  cleanup = () => {
    for (const m of meshes) if (!m.isDisposed()) m.dispose();
    setActiveHeightField(base);
  };
}
export function clearStagePresentation(): void {
  cleanup?.();
  cleanup = null;
}

export function applyStagePresentation(scene: Scene, id: string, units: RuntimeUnit[], base: HeightField | null): void {
  clearStagePresentation();
  if (id === "adventure.final_destination_wheelbarrow") {
    const cart = units.find(unit => unit.team === 1 && unit.definition.id === "farmer.wheelbarrow");
    if (!cart) return;
    // The existing arch spans the back street at (0,10), its apex at y7.2.
    // A contiguous 8 x 3.6 m crown gives the cart a full-width standing approach
    // before the statue, with the pavement below remaining available to passers.
    const cap = MeshBuilder.CreateBox("wheelbarrowArchCrown", { width: 8, height: 0.5, depth: 3.6 }, scene);
    cap.position.set(1.2, 7.15, 10);
    cap.material = scene.getMaterialByName("ancient1Whitewash");
    cap.receiveShadows = true;
    markStatic([cap]);
    const crew = units.filter(unit => unit === cart || unit.linkedParent === cart);
    const heights = new Map<RuntimeUnit, number>();
    const before = scene.onBeforeRenderObservable.add(() => {
      if (cart.isDead || cart.body.root.isDisposed()) return;
      const p = cart.position;
      if (p.x < -2.8 || p.x > 5.2 || Math.abs(p.z - 10) > 1.8) return;
      for (const unit of crew) {
        if (unit.body.root.isDisposed()) continue;
        heights.set(unit, unit.position.y);
        unit.position.y += 7.4;
      }
    });
    const restore = () => {
      for (const [unit, y] of heights) {
        if (unit.body.root.isDisposed()) continue;
        unit.position.y = y;
        unit.body.root.computeWorldMatrix(true);
        for (const node of unit.body.root.getDescendants(false)) node.computeWorldMatrix(true);
      }
      heights.clear();
    };
    const after = scene.onAfterRenderObservable.add(restore);
    cleanup = () => {
      restore();
      scene.onBeforeRenderObservable.remove(before);
      scene.onAfterRenderObservable.remove(after);
      if (!cap.isDisposed()) cap.dispose();
    };
    return;
  }
  if (id === "adventure.a_fierce_rider") {
    const host = units.find(unit => unit.team === 1 && unit.definition.id === "tribal.mammoth");
    const rider = units.find(unit => unit.team === 1 && unit.definition.id === "farmer.halfling");
    if (!host || !rider) return;
    // One scripted Halfling sits astride the leader's shoulder, the knees bent
    // down either side of the hide. Draw placement tracks the animated host;
    // restore every transform before simulation reads attack origins or bounds.
    const body = rider.body;
    const joints = [body.leftHip, body.rightHip, body.leftKnee, body.rightKnee];
    const rotations = joints.map(joint => joint.rotation.clone());
    const saved = new Vector3(), facing = new Vector3();
    let mounted = false;
    const before = scene.onBeforeRenderObservable.add(() => {
      if (host.isDead || rider.isDead || body.root.isDisposed() || host.body.root.isDisposed()) return;
      saved.copyFrom(body.root.position);
      facing.copyFrom(body.root.rotation);
      joints.forEach((joint, i) => rotations[i].copyFrom(joint.rotation));
      // Anchor to the actual enlarged head and mane bounds. The torso-space
      // shoulder is behind the projecting skull and occludes a tiny Halfling
      // even at its nominal crown height. Seat the pelvis on the visible crest.
      host.body.headMesh.computeWorldMatrix(true);
      const seat = host.body.headMesh.getAbsolutePosition().clone();
      let crown = -Infinity;
      for (const mesh of host.body.allMeshes) {
        if (mesh !== host.body.headMesh && mesh.name !== "crest") continue;
        mesh.computeWorldMatrix(true);
        crown = Math.max(crown, mesh.getBoundingInfo().boundingBox.maximumWorld.y);
      }
      seat.y = crown + 0.08;
      body.root.position.copyFrom(seat);
      body.root.position.y -= body.hip.position.y;
      body.root.rotation.copyFrom(host.body.root.rotation);
      for (const joint of [body.leftHip, body.rightHip]) joint.rotation.x = -1.05;
      body.leftHip.rotation.z = -0.5;
      body.rightHip.rotation.z = 0.5;
      for (const joint of [body.leftKnee, body.rightKnee]) joint.rotation.x = 1.35;
      mounted = true;
    });
    const restore = () => {
      if (!mounted || body.root.isDisposed()) return;
      body.root.position.copyFrom(saved);
      body.root.rotation.copyFrom(facing);
      joints.forEach((joint, i) => joint.rotation.copyFrom(rotations[i]));
      body.root.computeWorldMatrix(true);
      for (const node of body.root.getDescendants(false)) node.computeWorldMatrix(true);
      mounted = false;
    };
    const after = scene.onAfterRenderObservable.add(restore);
    cleanup = () => {
      restore();
      scene.onBeforeRenderObservable.remove(before);
      scene.onAfterRenderObservable.remove(after);
    };
    return;
  }
  if (id === "adventure.sneaky_tribe") {
    tribeCave(scene);
    return;
  }
  const perch = PERCHES[id];
  if (perch) {
    perchCrowns(scene, units, base, perch);
    return;
  }
  if (id !== "adventure.the_tiniest_attack") return;
  // Reference: a lone Farmer silhouettes the rounded crest above surrounding
  // wheat. An 18 x 16 m pasture hill rises 6.5 m, with smooth walkable shoulders.
  const hill: HeightField = (x, z) => {
    const r = Math.hypot((x - 20) / 9, (z + 9.9) / 8);
    return r >= 1 ? 0 : 6.5 * Math.pow(1 - r * r, 2);
  };
  const mound = terrainMesh(scene, "tiniestSummit", hill, { width: 18, depth: 16, step: 1, cx: 20, cz: -9.9 });
  mound.material = scene.getMaterialByName("grass");
  mound.receiveShadows = true;
  markStatic([mound]);
  setActiveHeightField((x, z) => Math.max(base?.(x, z) ?? 0, hill(x, z)));
  cleanup = () => {
    if (!mound.isDisposed()) mound.dispose();
    setActiveHeightField(base);
  };
}
