// TABS "Tribal 1" (tribal map): a wide open orange field ringed by autumn trees and grey cliffs, props kept out at the ring
// (reference/maps/wiki/tribal_1.png, reference/stages/introduction.clubs.png).
// Spec read off the wiki shot: nothing stands in the open field; the boulders, dry-stone walls, bales and stumps the base map scatters over
// it go (meshes and colliders), and only the ring and its edge mounds stay. The field is the ellipse |x| < 47, |z| < 32. Built on sandbox.tribal (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

// The cliffs: grey faceted rock walls standing just inside the rim behind the trees, 5-9 m tall, in three runs read off the wiki shot: the
// back arc (left of centre to right of centre), the back-left corner down the left side, and the front-right. Angles from +x toward +z.
const ISLAND = { a: 54, b: 48, round: 3 };
const CLIFF_RUNS: Array<[number, number]> = [[55, 125], [140, 195], [-75, -25]];
const CLIFF_STEP = 7; // degrees between cliff segments

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

function rim(deg: number): [number, number] {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const r = (Math.abs(c / ISLAND.a) ** ISLAND.round + Math.abs(s / ISLAND.b) ** ISLAND.round) ** (-1 / ISLAND.round);
  return [c * r, s * r];
}

/**
 * The cliff mass (wiki shot): each run is one deep continuous wall of rock, not a row of posts. Spec: a back rank of tall blocks on the
 * rim (pulled 1 m in) and a lower front rank 4 m further in, a block every 3 degrees, 7-10 m wide and 5-7 m deep so neighbours overlap;
 * heights follow a lumpy profile (a slow swell plus a per-block jitter) between 5 and 13 m, the front rank 55-75% of the back, and every
 * third back block carries a leaning crag on top so the skyline is broken. Colliders stay one per 7 degrees, 3.5 m in, as before.
 */
function cliffHeight(deg: number, k: number): number {
  return 8 + 3 * Math.sin(deg * 0.11) + 1.5 * Math.sin(deg * 0.37 + 1) + (seeded(k, 1) - 0.5) * 3;
}

function rimCliffs(scene: Scene): Obstacle[] {
  const rock = new StandardMaterial("tribal1Cliff", scene);
  rock.diffuseColor = new Color3(0.52, 0.49, 0.52);
  rock.emissiveColor = new Color3(0.07, 0.06, 0.07);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  const obstacles: Obstacle[] = [];
  let k = 0;
  for (const [from, to] of CLIFF_RUNS) {
    for (let deg = from; deg <= to; deg += 3) {
      k++;
      const [rx, rz] = rim(deg);
      const rr = Math.hypot(rx, rz);
      const face = -Math.atan2(rz, rx) + Math.PI / 2;
      const h = cliffHeight(deg, k);
      for (const [pull, tall, row] of [[1, 1, 0], [5, 0.55 + seeded(k, 2) * 0.2, 1]] as const) {
        const x = rx * (1 - pull / rr), z = rz * (1 - pull / rr);
        const w = 7 + seeded(k * 2 + row, 3) * 3;
        const hb = h * tall;
        const block = MeshBuilder.CreateCylinder("tribal1Cliff", {
          diameterTop: w * 0.78, diameterBottom: w, height: hb, tessellation: 6,
        }, scene);
        block.scaling.z = 0.7;
        block.position.set(x + (seeded(k * 2 + row, 4) - 0.5) * 1.2, hb / 2, z + (seeded(k * 2 + row, 5) - 0.5) * 1.2);
        block.rotation.set((seeded(k * 2 + row, 6) - 0.5) * 0.1, face + (seeded(k * 2 + row, 7) - 0.5) * 0.3, (seeded(k * 2 + row, 8) - 0.5) * 0.08);
        parts.push(block);
      }
      if (k % 3 === 0) {
        const x = rx * (1 - 2 / rr), z = rz * (1 - 2 / rr);
        const crag = MeshBuilder.CreateCylinder("tribal1Crag", { diameterTop: 1.2, diameterBottom: 4.5, height: 3 + seeded(k, 9) * 3, tessellation: 5 }, scene);
        crag.position.set(x, h + 1, z);
        crag.rotation.set((seeded(k, 10) - 0.5) * 0.4, seeded(k, 11) * Math.PI, (seeded(k, 12) - 0.5) * 0.4);
        parts.push(crag);
      }
    }
    for (let deg = from; deg <= to; deg += CLIFF_STEP) {
      const [rx, rz] = rim(deg);
      const pull = 1 - 3.5 / Math.hypot(rx, rz);
      obstacles.push({ type: "cylinder", center: new Vector3(rx * pull, 0, rz * pull), radius: 2.6 });
    }
  }
  const cliffs = Mesh.MergeMeshes(parts, true);
  if (cliffs) {
    cliffs.name = "tribal1Cliffs";
    cliffs.convertToFlatShadedMesh();
    cliffs.material = rock;
    cliffs.receiveShadows = true;
    cliffs.isPickable = false;
  }
  return obstacles;
}

/**
 * Autumn birches (wiki shot): every ring tree is one faceted ball crown high on a tall thin white trunk, crowns in three saturated colours
 * (red, orange, yellow, about 2:2:1), 1.6-2.8 m across the ball. The base's lumpy crowns go; its trunks are stretched 1.5x and whitened.
 * The crowns are lit mostly by their own colour (out of fog, glow and the canopy haze) so they stay saturated and do not wash to pink.
 */
const BIRCH_CROWNS: Array<[string, Color3]> = [
  ["tribal1CrownRed", new Color3(0.72, 0.12, 0.05)],
  ["tribal1CrownOrange", new Color3(0.82, 0.3, 0.05)],
  ["tribal1CrownRed2", new Color3(0.66, 0.16, 0.06)],
  ["tribal1CrownOrange2", new Color3(0.78, 0.38, 0.07)],
  ["tribal1CrownYellow", new Color3(0.7, 0.55, 0.08)],
];
const BIRCH_STRETCH = 1.5;

function birchRing(scene: Scene, built: Set<unknown>): void {
  const crowns = BIRCH_CROWNS.map(([name, c]) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c.scale(0.55);
    m.emissiveColor = c.scale(0.55);
    m.specularColor = Color3.Black();
    return m;
  });
  const bark = new StandardMaterial("tribal1Birch", scene);
  bark.diffuseColor = new Color3(0.9, 0.88, 0.84);
  bark.emissiveColor = new Color3(0.4, 0.39, 0.37);
  bark.specularColor = Color3.Black();
  const glow = scene.getGlowLayerByName("glow");
  const trunks = scene.meshes.filter((m): m is Mesh => built.has(m) && m.name === "trunk" && m instanceof Mesh);
  trunks.forEach((trunk, i) => {
    for (const child of trunk.getChildMeshes()) if (child.name === "canopy") child.dispose();
    const h = trunk.getBoundingInfo().boundingBox.extendSize.y * 2;
    trunk.scaling.set(0.7, BIRCH_STRETCH, 0.7);
    trunk.position.y = (h * BIRCH_STRETCH) / 2 - 0.15;
    trunk.material = bark;
    trunk.computeWorldMatrix(true);
    const top = Vector3.TransformCoordinates(new Vector3(0, h / 2, 0), trunk.getWorldMatrix());
    const r = 0.8 + seeded(i, 21) * 0.6 + h * 0.08;
    const ball = MeshBuilder.CreateIcoSphere("tribal1Crown", { radius: r, subdivisions: 1 }, scene);
    ball.scaling.y = 1.08;
    ball.rotation.y = seeded(i, 22) * Math.PI;
    ball.position.set(top.x, top.y + r * 0.75, top.z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 23) * crowns.length)];
    ball.applyFog = false;
    ball.isPickable = false;
    glow?.addExcludedMesh(ball);
  });
  // The low band of ball crowns behind the ring takes the same colours
  scene.meshes.filter((m) => built.has(m) && m.name === "hazeTreeline").forEach((m, i) => {
    m.material = crowns[i % 2 === 0 ? 0 : 1];
    m.applyFog = false;
  });
}

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
  obstacles.push(...rimCliffs(scene));
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  return { ...result, obstacles };
}
