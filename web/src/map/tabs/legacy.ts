// TABS "Legacy" (legacy map): a round yellow-green glade in a valley, closed in by dense dark pine forest under snowy mountains, a spired
// stone church at the back with its graveyard, tent camps at both ends (reference/maps/wiki/legacy.png, reference/maps/legacy.png; card
// loop/cards/maps/legacy.md). Built on campaign.legacy (base(); never edit the base, dress its build here).
//
// Pine forest (576, wiki legacy.png and legacy.the_war.png: the glade is walled in by a dense band of tall dark-green conifers, no round
// leafy trees). Spec: every base ring tree (an unparented "trunk" with its crown as children) goes, its collider kept; in its place a pine
// 9-14 m tall, a short brown trunk under four stacked seven-sided cones, dark green (0.1, 0.27, 0.12) with a lighter tier
// (0.15, 0.35, 0.15) every other cone; beside each, two more pines 1.8-3.8 m along the ring and up to 2.5 m in or 1 m out (drawn
// only) so the band reads dense; all merged
// per material, in the glow pass (dark solids), receiving shadows.
import { Color3, Mesh, MeshBuilder, StandardMaterial, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function pineForest(scene: Scene, built: Set<unknown>): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    dark: mk("legacyPineDark", new Color3(0.1, 0.27, 0.12), 0.3),
    light: mk("legacyPineLight", new Color3(0.15, 0.35, 0.15), 0.3),
    bark: mk("legacyPineBark", new Color3(0.36, 0.24, 0.15), 0.3),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { dark: [], light: [], bark: [] };
  const spots: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    spots.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  let k = 0;
  const pine = (x: number, z: number) => {
    k++;
    const tall = 9 + seeded(k, 21) * 5, wide = tall * (0.36 + seeded(k, 22) * 0.06);
    const trunk = MeshBuilder.CreateCylinder("legacyPineTrunk", { height: tall * 0.2, diameter: wide * 0.14, tessellation: 6 }, scene);
    trunk.position.set(x, tall * 0.1, z);
    parts.bark.push(trunk);
    for (let t = 0; t < 4; t++) {
      const f = 1 - t * 0.2;
      const h = tall * 0.34 * (0.85 + t * 0.05);
      const cone = MeshBuilder.CreateCylinder("legacyPineCone", { height: h, diameterBottom: wide * f, diameterTop: wide * f * 0.08, tessellation: 7 }, scene);
      cone.rotation.y = seeded(k * 4 + t, 23) * 6.28;
      cone.position.set(x, tall * 0.15 + t * tall * 0.19 + h / 2, z);
      parts[t % 2 ? "light" : "dark"].push(cone);
    }
  };
  for (const [x, z] of spots) {
    pine(x, z);
    const out = Math.hypot(x, z) || 1;
    for (let j = 0; j < 2; j++) {
      // along the ring and a little in or out (never far out: the ring stands near the rim)
      const d = -2.5 + seeded(k, 31 + j) * 3.5, side = (j ? 1 : -1) * (1.8 + seeded(k, 33 + j) * 2);
      pine(x + (x / out) * d - (z / out) * side, z + (z / out) * d + (x / out) * side);
    }
  }
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true);
    if (!merged) continue;
    merged.name = `legacyPines_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

export function buildLegacy(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  pineForest(scene, built);
  return result;
}
