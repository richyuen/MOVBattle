// TABS "Tribal Sandbox" (tribal map): a big orange plain with grey rock formations standing into its edges — a mushroom-shaped rock pillar
// and a tall outcrop on the left, a heap of piled boulders at the front-left, lone slab rocks scattered over the plain
// (reference/maps/wiki/tribal_sandbox.png).
// Spec read off the wiki shot: the pillar is about 9 m tall, a narrow faceted stem under a broad flat cap 8 m across; the outcrop is a
// 7 m flat-topped block of leaning slabs 12 m across; the boulder heap is six rounded boulders 3-5 m; the lone rocks are 2-4 m flat slabs.
// All warm grey. No stages are fought here. Built on sandbox.tribal (base()).
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const PILLAR = { x: -40, z: 4, height: 9, cap: 8 };
const OUTCROP = { x: -34, z: 25, width: 12, height: 7 };
const HEAP = { x: -30, z: -24 };
const SLABS: Array<[number, number, number]> = [[-16, -12, 3.2], [-6, 22, 2.6], [16, 28, 3.4], [36, 8, 2.8], [30, -20, 2.4], [-22, 8, 2.2]];

export function buildTribalSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const rock = new StandardMaterial("tribalSandboxRock", scene);
  rock.diffuseColor = new Color3(0.62, 0.57, 0.56);
  rock.emissiveColor = new Color3(0.08, 0.07, 0.07);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  const obstacles: Obstacle[] = [...result.obstacles];

  // Mushroom pillar: stem, then a broad slab cap leaning a little
  const stem = MeshBuilder.CreateCylinder("tsPillarStem", { diameterTop: 2.6, diameterBottom: 3.6, height: PILLAR.height - 1.6, tessellation: 6 }, scene);
  stem.position.set(PILLAR.x, (PILLAR.height - 1.6) / 2, PILLAR.z);
  stem.rotation.z = 0.08;
  const cap = MeshBuilder.CreateCylinder("tsPillarCap", { diameterTop: PILLAR.cap * 0.8, diameterBottom: PILLAR.cap, height: 2, tessellation: 6 }, scene);
  cap.scaling.z = 0.75;
  cap.position.set(PILLAR.x + 0.6, PILLAR.height - 0.8, PILLAR.z);
  cap.rotation.set(0.12, 0.5, -0.1);
  const foot = MeshBuilder.CreateCylinder("tsPillarFoot", { diameterTop: 3.4, diameterBottom: 5.5, height: 1.6, tessellation: 6 }, scene);
  foot.position.set(PILLAR.x, 0.8, PILLAR.z);
  parts.push(stem, cap, foot);
  obstacles.push({ type: "cylinder", center: new Vector3(PILLAR.x, 0, PILLAR.z), radius: 2.6 });

  // Outcrop: leaning flat-topped slabs packed into one block
  for (let i = 0; i < 6; i++) {
    const w = 4 + seeded(i, 1) * 3;
    const h = OUTCROP.height * (0.7 + seeded(i, 2) * 0.3);
    const slab = MeshBuilder.CreateCylinder("tsOutcrop", { diameterTop: w * 0.85, diameterBottom: w, height: h, tessellation: 5 }, scene);
    const a = (i / 6) * Math.PI * 2;
    slab.position.set(OUTCROP.x + Math.cos(a) * OUTCROP.width * 0.25, h / 2, OUTCROP.z + Math.sin(a) * OUTCROP.width * 0.2);
    slab.rotation.set((seeded(i, 3) - 0.5) * 0.2, seeded(i, 4) * Math.PI, (seeded(i, 5) - 0.5) * 0.2);
    parts.push(slab);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(OUTCROP.x, 0, OUTCROP.z), radius: OUTCROP.width * 0.45 });

  // Boulder heap: rounded faceted boulders piled two high
  for (let i = 0; i < 6; i++) {
    const d = 3 + seeded(i, 6) * 2;
    const b = MeshBuilder.CreateIcoSphere("tsHeap", { radius: d / 2, subdivisions: 1 }, scene);
    const a = (i / 5) * Math.PI * 2;
    const up = i === 5;
    b.position.set(HEAP.x + (up ? 0 : Math.cos(a) * 2.6), up ? 3.6 : d * 0.4, HEAP.z + (up ? 0 : Math.sin(a) * 2.2));
    b.scaling.set(1, 0.85, 1.05);
    b.rotation.y = seeded(i, 7) * Math.PI;
    parts.push(b);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(HEAP.x, 0, HEAP.z), radius: 4.6 });

  // Lone flat slab rocks on the plain
  SLABS.forEach(([x, z, s], i) => {
    const r = MeshBuilder.CreateCylinder("tsSlab", { diameterTop: s * 0.7, diameterBottom: s, height: s * 0.6, tessellation: 5 }, scene);
    r.position.set(x, s * 0.25, z);
    r.rotation.set((seeded(i, 8) - 0.5) * 0.5, seeded(i, 9) * Math.PI, (seeded(i, 10) - 0.5) * 0.4);
    parts.push(r);
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: s * 0.5 });
  });

  const rocks = Mesh.MergeMeshes(parts, true);
  if (rocks) {
    rocks.name = "tribalSandboxRocks";
    rocks.convertToFlatShadedMesh();
    rocks.material = rock;
    rocks.receiveShadows = true;
    rocks.isPickable = false;
  }
  return { ...result, obstacles };
}
