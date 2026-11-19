// Curated levels sometimes start actors on scenery. Presentation stays separate
// from flat deterministic battle coordinates and is removed whenever a level resets.
import { Vector3, type Scene } from "@babylonjs/core";
import { markStatic, setActiveHeightField, terrainMesh, type HeightField } from "../map/terrain";
import type { RuntimeUnit } from "../units/runtimeUnit";

let cleanup: (() => void) | null = null;
export function clearStagePresentation(): void {
  cleanup?.();
  cleanup = null;
}

export function applyStagePresentation(scene: Scene, id: string, units: RuntimeUnit[], base: HeightField | null): void {
  clearStagePresentation();
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
      host.body.torso.computeWorldMatrix(true);
      const seat = Vector3.TransformCoordinates(new Vector3(0, 0.72, -0.12), host.body.torso.getWorldMatrix());
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
