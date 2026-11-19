// Curated levels sometimes start actors on scenery. Presentation stays separate
// from flat deterministic battle coordinates and is removed whenever a level resets.
import { MeshBuilder, Vector3, type Mesh, type Scene } from "@babylonjs/core";
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
};
const PERCH_CROWNS = ["tribal1CrownOrange", "tribal1CrownRed", "tribal1CrownOrange2", "tribal1CrownYellow", "tribal1CrownRed2"];

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
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
