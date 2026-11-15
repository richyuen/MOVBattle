// TABS "Farmer 2" (farmer map): grey dry-stone walls cut the island into fields (reference/maps/wiki/farmer_2.png; the card counts eight
// sections): a long wall down the front of the centre line between the sheaf field and the wheat, a cross wall closing the front-left sheaf
// field, a yard wall along the back past the farmhouse, a wall down the left side that makes the open pathway and its alley, and two short
// walls closing the back-right and front-right corners. Each wall has one gap a man can walk through.
// Spec: walls are axis-aligned runs of rough cobbles, knee high (0.5-0.8 m), 1 m thick, one box obstacle per stretch. They keep clear of the
// stage armies fought here (team 1 stands in x 2..41, z -26..18). Built on campaign.introduction (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

/** [x0, z0, x1, z1, gap centre along the run (0..1)] */
const WALLS: Array<[number, number, number, number, number]> = [
  [-2.5, -46, -2.5, -22, 0.55],   // front centre: sheaf field | wheat
  [-44, -20, -6, -20, 0.3],       // front-left sheaf field's back wall
  [-40, 24, 40, 24, 0.5],         // back yard wall
  [-26, -16, -26, 20, 0.6],       // left pathway | alley
  [22, 24, 22, 44, 0.45],         // back-right corner
  [8, -31, 46, -31, 0.4],         // front-right corner
];
const GAP = 4;
const THICK = 1.0;

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function cobbleWall(scene: Scene, mat: StandardMaterial, [x0, z0, x1, z1, gapAt]: (typeof WALLS)[number], w: number, obstacles: Obstacle[]): void {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const ux = (x1 - x0) / len, uz = (z1 - z0) / len;
  const gapFrom = gapAt * len - GAP / 2, gapTo = gapAt * len + GAP / 2;
  const stones: Mesh[] = [];
  let k = 0;
  for (let along = 0.4; along < len; along += 0.75) {
    if (along > gapFrom && along < gapTo) continue;
    for (let layer = 0; layer < 2; layer++) {
      for (const side of [-0.25, 0.25]) {
        k++;
        if (layer === 1 && seeded(k + w * 500, 3) < 0.25) continue; // a broken top line
        const size = 0.42 + seeded(k + w * 500, 4) * 0.22;
        const stone = MeshBuilder.CreatePolyhedron("farmer2Cobble", { type: 1, size }, scene);
        stone.scaling.set(1, 0.7, 1);
        const jitter = (seeded(k + w * 500, 5) - 0.5) * 0.3;
        const ax = along + jitter;
        stone.position.set(x0 + ux * ax - uz * side, 0.22 + layer * 0.38, z0 + uz * ax + ux * side);
        stone.rotation.set(seeded(k, 6) * 3, seeded(k, 7) * 3, seeded(k, 8) * 3);
        stones.push(stone);
      }
    }
  }
  const merged = Mesh.MergeMeshes(stones, true);
  if (merged) {
    merged.name = "farmer2Wall";
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  // Two stretches either side of the gap, each one box
  for (const [a, b] of [[0, gapFrom], [gapTo, len]]) {
    if (b - a < 0.5) continue;
    const mid = (a + b) / 2;
    obstacles.push({
      type: "box",
      center: new Vector3(x0 + ux * mid, 0, z0 + uz * mid),
      halfX: Math.abs(ux) * (b - a) / 2 + Math.abs(uz) * THICK / 2,
      halfZ: Math.abs(uz) * (b - a) / 2 + Math.abs(ux) * THICK / 2,
    });
  }
}

export function buildFarmer2(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const stone = new StandardMaterial("farmer2WallStone", scene);
  stone.diffuseColor = new Color3(0.62, 0.62, 0.6);
  stone.emissiveColor = new Color3(0.07, 0.07, 0.08);
  stone.specularColor = new Color3(0.04, 0.04, 0.04);
  const obstacles = [...result.obstacles];
  WALLS.forEach((wall, w) => cobbleWall(scene, stone, wall, w, obstacles));
  return { ...result, obstacles };
}
