// TABS "Ancient Sandbox" (ancient map): a very large green island with terracotta cliffs dropping into a blue sea, a spiral rock mountain on
// the back centre line, ruins and white houses round the edges (reference/maps/wiki/ancient_sandbox.png, reference/maps/greek_ancient_sandbox.png).
// No stages are fought here. Built on campaign.challenge (base(); the base is shared with four other maps: never edit it, dress its build here).
//
// Terracotta cliffs (563), spec read off greek_ancient_sandbox.png: the island's sides are a sheer wall of warm terracotta rock, broken into
// big flat-faced vertical facets (each 6-10 m wide, leaning out a little), about 12 m tall (a fifth of the island's depth as seen), standing
// straight down from a thin grass lip; the base's navy underside (islandUnder, islandShelf, islandCliff: the black spikes) goes. Spec: a facet
// every 5 degrees along the base rim (superellipse 54 x 48, power 3), 7-10 m along it and 4 m deep, 10-14 m tall, its outer face at the rim,
// alternate facets set 0.6 m out; a closing floor slab at -12 m following the rim at 0.97 (the sea will meet it). Terracotta linear
// (0.72, 0.32, 0.17), half self-lit since the faces look away from the sun; the floor a darker brown. Drawn only (outside the field).
import { Color3, Mesh, MeshBuilder, StandardMaterial, VertexData, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const RIM = { a: 54, b: 48, round: 3 };
const FLOOR_Y = -12;

function rimAt(angle: number): [number, number] {
  const c = Math.cos(angle), s = Math.sin(angle);
  const r = (Math.abs(c / RIM.a) ** RIM.round + Math.abs(s / RIM.b) ** RIM.round) ** (-1 / RIM.round);
  return [c * r, s * r];
}

function terracottaCliffs(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const rock = mk("ancientSandboxCliff", new Color3(0.72, 0.32, 0.17), 0.5);
  const floorMat = mk("ancientSandboxCliffFloor", new Color3(0.4, 0.2, 0.11), 0.5);
  const facets: Mesh[] = [];
  for (let k = 0; k < 72; k++) {
    const deg = k * 5 + (seeded(k, 1) - 0.5) * 2;
    const a = (deg * Math.PI) / 180;
    const [rx, rz] = rimAt(a);
    const r = Math.hypot(rx, rz);
    const out = k % 2 === 0 ? 0.6 : 0;
    // The facet's centre sits 2 m in from its outer face
    const f = (r - 2 + out) / r;
    const along = 7 + seeded(k, 2) * 3;
    const h = 10 + seeded(k, 3) * 4;
    const facet = MeshBuilder.CreateBox("asCliffFacet", { width: along, height: h, depth: 4 }, scene);
    facet.position.set(rx * f, -h / 2 - 0.15, rz * f);
    // Its long side runs along the rim (the tangent of the outline at this angle)
    const [tx, tz] = rimAt(a + 0.01);
    // Its local x runs along the rim, so a small rotation.x leans it in or out
    facet.rotation.set((seeded(k, 4) - 0.5) * 0.12, -Math.atan2(tz - rz, tx - rx), 0);
    facets.push(facet);
  }
  const cliffs = Mesh.MergeMeshes(facets, true);
  if (cliffs) {
    cliffs.name = "ancientSandboxCliffs";
    cliffs.convertToFlatShadedMesh();
    cliffs.material = rock;
    cliffs.applyFog = false;
    cliffs.isPickable = false;
  }
  const floor = MeshBuilder.CreateCylinder("ancientSandboxCliffFloor", { diameter: 2, height: 1, tessellation: 64 }, scene);
  const pos = floor.getVerticesData("position")!;
  for (let v = 0; v < pos.length; v += 3) {
    const reach = Math.hypot(pos[v], pos[v + 2]);
    if (reach < 1e-6) continue;
    const [x, z] = rimAt(Math.atan2(pos[v + 2], pos[v]));
    pos[v] = x * 0.97 * reach;
    pos[v + 2] = z * 0.97 * reach;
  }
  floor.setVerticesData("position", pos);
  floor.refreshBoundingInfo();
  floor.position.y = FLOOR_Y;
  floor.material = floorMat;
  floor.isPickable = false;
}

// Sea (564), spec read off greek_ancient_sandbox.png: the island stands in open blue water reaching to the horizon; the cliffs drop into
// it about 11 m below the grass, a band of pale turquoise shallows and white foam hugging their foot. A flat sea disc 900 m across at
// y -11 (just over the closing floor), medium blue, self-lit so the far water stays blue, no fog wash; a ragged foam ring at 1.02-1.06 of the
// rim and a turquoise shallows ring out to 1.18 just above it. Drawn only (outside the field).
const SEA_Y = -11;

function sea(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.12, 0.14, 0.16);
    return m;
  };
  const water = MeshBuilder.CreateCylinder("ancientSandboxSea", { diameter: 900, height: 0.2, tessellation: 64 }, scene);
  water.position.y = SEA_Y - 0.1;
  water.material = mk("ancientSandboxSeaWater", new Color3(0.08, 0.3, 0.62), 0.55);
  water.applyFog = false;
  water.isPickable = false;
  const ring = (name: string, inner: number, outer: number, y: number, mat: StandardMaterial, jag: number) => {
    const n = 144;
    const pos: number[] = [], idx: number[] = [], nrm: number[] = [];
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * Math.PI * 2;
      const [x, z] = rimAt(a);
      const wob = 1 + (seeded(k % n, 9) - 0.5) * jag;
      pos.push(x * inner, y, z * inner, x * outer * wob, y, z * outer * wob);
      nrm.push(0, 1, 0, 0, 1, 0);
      if (k < n) {
        const b = k * 2;
        idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    }
    const mesh = new Mesh(name, scene);
    const data = new VertexData();
    data.positions = pos;
    data.indices = idx;
    data.normals = nrm;
    data.applyToMesh(mesh);
    // Normals point up whatever the winding: draw both sides so the ring shows from above either way
    mat.backFaceCulling = false;
    mesh.material = mat;
    mesh.applyFog = false;
    mesh.isPickable = false;
  };
  ring("ancientSandboxShallows", 0.98, 1.18, SEA_Y + 0.03, mk("ancientSandboxShallowsMat", new Color3(0.2, 0.62, 0.7), 0.55), 0.06);
  ring("ancientSandboxFoam", 0.98, 1.04, SEA_Y + 0.06, mk("ancientSandboxFoamMat", new Color3(0.85, 0.93, 0.95), 0.6), 0.04);
}

// The base's field junk (Challenge Bluffs: two dark barricade slabs, the ruin block with its pillar, the ball-topped totem) goes with its
// colliders: TABS's field is wide open. Every one of those is a "<displayName>_box|_cyl|_totem_top" mesh; a collider goes when its centre
// sits under a removed mesh.
function clearFieldJunk(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (!/^Challenge Bluffs_(box|cyl|totem_top)$/.test(mesh.name)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

export function buildAncientSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  terracottaCliffs(scene, built);
  sea(scene);
  const obstacles = clearFieldJunk(scene, built, [...result.obstacles]);
  return { ...result, obstacles };
}
