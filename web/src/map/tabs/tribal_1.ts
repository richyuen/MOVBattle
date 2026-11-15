// TABS "Tribal 1" (tribal map): a wide open orange field ringed by autumn trees and grey cliffs, props kept out at the ring
// (reference/maps/wiki/tribal_1.png, reference/stages/introduction.clubs.png).
// Spec read off the wiki shot: nothing stands in the open field; the boulders, dry-stone walls, bales and stumps the base map scatters over
// it go (meshes and colliders), and only the ring and its edge mounds stay. The field is the ellipse |x| < 47, |z| < 32. Built on sandbox.tribal (base()).
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const FIELD = { rx: 47, rz: 32 };
const FIELD_PROPS = new Set(["boulder", "wallStone", "hayBale", "stump"]);

const inField = (x: number, z: number, margin = 0) => (x / (FIELD.rx + margin)) ** 2 + (z / (FIELD.rz + margin)) ** 2 < 1;

export function buildTribal1(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  // Each prop's collider sits at its (main) mesh's own spot: the trees' colliders in the ring are kept
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => !prior.has(m) && FIELD_PROPS.has(m.name))) {
    if (!inField(mesh.position.x, mesh.position.z, 2)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.dispose();
  }
  const obstacles = result.obstacles.filter((o) => !(inField(o.center.x, o.center.z)
    && gone.some(([x, z]) => Math.abs(x - o.center.x) < 0.01 && Math.abs(z - o.center.z) < 0.01)));
  return { ...result, obstacles };
}
