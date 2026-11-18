// TABS "Fantasy Evil" (Void, fantasy map): a broken plateau of dark slate basalt blocks lit by acid-green chasms, a chained Void
// Monarch statue and a gothic shrine, floating in a starless black void (reference/maps/wiki/fantasy_evil.png,
// reference/maps/void_evil.png; card loop/cards/maps/fantasy_evil.md). Built on campaign.fantasy_evil (base()), dressed here only.
//
// Void sky (590, blocker a1; wiki fantasy_evil.png: nothing behind the island but a near-black violet void, no clouds, no
// mountain range, no horizon glow). Spec: the shared sky dome, the base's clouds ("cloud*") and far range ("mountain*") are
// hidden; clear colour and fog colour become near-black violet (.02, .012, .035), so the field's far edge fades into the void
// rather than into daylight haze. Dome, clear and fog colours are put back on dispose.
import { Color3, Matrix, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const VOID = new Color3(0.02, 0.012, 0.035);

function voidSky(scene: Scene, built: Set<unknown>): () => void {
  const dome = scene.getMeshByName("skyDome"), domeOn = dome?.isEnabled();
  dome?.setEnabled(false);
  for (const m of scene.meshes) if (built.has(m) && /^(mountain|cloud)/.test(m.name)) m.setEnabled(false);
  const oldFog = scene.fogColor.clone(), oldClear = scene.clearColor.clone();
  scene.fogColor.copyFrom(VOID);
  scene.clearColor.set(VOID.r, VOID.g, VOID.b, 1);
  return () => {
    dome?.setEnabled(domeOn ?? true);
    scene.fogColor.copyFrom(oldFog);
    scene.clearColor.copyFrom(oldClear);
  };
}

// Basalt floor (591, blocker a2; wiki fantasy_evil.png: the field is a floor of dark slate-teal rock blocks, square-cut tops at
// slightly different heights with darker seams, no grass anywhere). Spec: the base lawn ("ground", "centerGrass") and its grass
// (fieldBlades_*, grassTuft) are hidden; in their place a 2 m grid of square basalt blocks over the base island's oval (the
// superellipse 54 x 48, power 3, less 1 m), each 1.85 m across (0.15 m seams showing the dark bed below), tops 0.02..0.22 m up
// (under a unit's ankle: the sim stays flat), one thin-instance box mesh; lit slate-teal (.13,.2,.22) with a dim self-light
// (.025,.04,.045), each block's tone varied +-12% by an instance colour; a near-black bed (.02,.03,.035) under the seams.
// Seeded LCG, so the shots are the same every run.
function basaltFloor(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (m.name === "ground" || m.name === "centerGrass" || m.name === "grassTuft" || m.name.startsWith("fieldBlades_")) m.setEnabled(false);
  }
  let seed = 0x5a17;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const inside = (x: number, z: number) => Math.abs(x / 53) ** 3 + Math.abs(z / 47) ** 3 <= 1;
  const bedMat = new StandardMaterial("basaltBed", scene);
  bedMat.diffuseColor = new Color3(0.02, 0.03, 0.035);
  bedMat.specularColor = Color3.Black();
  const block = MeshBuilder.CreateBox("basaltBlocks", { size: 1 }, scene);
  const mat = new StandardMaterial("basaltBlocks", scene);
  mat.diffuseColor = new Color3(0.13, 0.2, 0.22);
  mat.emissiveColor = new Color3(0.025, 0.04, 0.045);
  mat.specularColor = new Color3(0.04, 0.05, 0.05);
  block.material = mat;
  const mats: number[] = [], cols: number[] = [];
  const seamMats: number[] = [];
  for (let x = -53; x <= 53; x += 2) {
    for (let z = -47; z <= 47; z += 2) {
      if (!inside(x, z) || !inside(x + 1, z + 1) || !inside(x - 1, z - 1) || !inside(x + 1, z - 1) || !inside(x - 1, z + 1)) continue;
      const top = 0.02 + rnd() * 0.2, h = 0.5 + top;
      mats.push(...Matrix.Compose(new Vector3(1.85, h, 1.85), Quaternion.Identity(), new Vector3(x, top - h / 2, z)).asArray());
      const k = 0.88 + rnd() * 0.24;
      cols.push(k, k, k, 1);
      seamMats.push(...Matrix.Compose(new Vector3(2, 0.1, 2), Quaternion.Identity(), new Vector3(x, -0.08, z)).asArray());
    }
  }
  block.thinInstanceSetBuffer("matrix", new Float32Array(mats), 16, true);
  block.thinInstanceSetBuffer("color", new Float32Array(cols), 4, true);
  block.receiveShadows = true;
  block.isPickable = false;
  // the seams' bed: one dark 2 m tile under each block (so it follows the oval), just below the block tops
  const seam = MeshBuilder.CreateBox("basaltSeams", { size: 1 }, scene);
  seam.material = bedMat;
  seam.thinInstanceSetBuffer("matrix", new Float32Array(seamMats), 16, true);
  seam.isPickable = false;
}

export function buildFantasyEvil(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  basaltFloor(scene, built);
  const restoreSky = voidSky(scene, built);
  return { ...result, dispose: () => { restoreSky(); result.dispose?.(); } };
}
