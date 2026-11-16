// TABS "Viking" (viking map): a large island whose middle is a giant frozen lake used as the battlefield, snowy banks with pine forest on
// the sides, a pirate ship frozen in the ice on the left and a frozen waterfall at the top (reference/maps/wiki/viking.png,
// reference/maps/winter_viking.png; card loop/cards/maps/viking.md). Built on campaign.challenge (base(); the base is shared with four
// other maps: never edit it, dress its build here).
//
// Frozen lake (565), spec read off the wiki shot: the battlefield is one sheet of mid-blue ice (a clear sky blue, darker than the snow and
// far more saturated, not cyan-white) filling the field to within a few metres of the ring, its edge a ragged lobed line where white snow
// banks begin; over the ice runs a network of white cracks, wide bands (0.5-0.9 m) that join at angles into irregular cells 10-16 m across,
// each band kinked along its length. Spec: lake an ellipse 44 x 38 m with its edge pushed in and out by 0-3 m in 24 lobes, 4 cm above the
// ground; cracks on a jittered 13 m grid of nodes inside the lake, each node joined to its right and back neighbours by a band of two kinked
// segments, a quarter of the joins left out so the cells are uneven; the base's autumn lawn and tuft colours turn to snow and its grass
// tufts and blades go. All drawn only (flat), nothing in the way.
import { Color3, Mesh, MeshBuilder, StandardMaterial, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const SNOW = new Color3(0.8, 0.86, 0.95);
const SNOW_SHADE = new Color3(0.3, 0.36, 0.44);
const LAKE = { rx: 44, rz: 38, lobes: 24, wobble: 3, y: 0.04 };
const LAKE_ICE = new Color3(0.16, 0.46, 0.7);
const CRACK_GRID = 13;

function lakeR(angle: number): number {
  const c = Math.cos(angle), s = Math.sin(angle);
  const r = ((c / LAKE.rx) ** 2 + (s / LAKE.rz) ** 2) ** -0.5;
  const t = ((angle / (Math.PI * 2)) * LAKE.lobes + LAKE.lobes) % LAKE.lobes;
  const k = Math.floor(t), f = t - k;
  const w = (i: number) => seeded(i % LAKE.lobes, 51) * LAKE.wobble;
  return r - (w(k) * (1 - f) + w(k + 1) * f);
}

function inLake(x: number, z: number, margin = 0): boolean {
  return Math.hypot(x, z) < lakeR(Math.atan2(z, x)) - margin;
}

function snowBanks(scene: Scene, built: Set<unknown>): void {
  for (const name of ["groundMat", "grass", "dryGrass", "grassBladeDark", "grassBladeLight"]) {
    const m = scene.getMaterialByName(name) as StandardMaterial | null;
    if (!m) continue;
    m.diffuseColor = SNOW.clone();
    m.emissiveColor = SNOW_SHADE.clone();
    m.specularColor = new Color3(0.05, 0.05, 0.06);
  }
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    const n = mesh.name;
    if (n.startsWith("fieldBlades_") || n.startsWith("fieldTufts_") || n === "grassTuft" || n === "centerGrass" || n === "flowerDot") mesh.setEnabled(false);
  }
}

function frozenLake(scene: Scene): void {
  const ice = new StandardMaterial("vikingLakeIce", scene);
  ice.diffuseColor = LAKE_ICE;
  ice.emissiveColor = LAKE_ICE.scale(0.35);
  ice.specularColor = new Color3(0.18, 0.2, 0.24);
  const crackMat = new StandardMaterial("vikingLakeCrack", scene);
  crackMat.diffuseColor = new Color3(0.9, 0.95, 1);
  crackMat.emissiveColor = new Color3(0.5, 0.55, 0.6);
  crackMat.specularColor = Color3.Black();
  // The sheet: a disc whose rim vertices are pulled to the lobed lake edge
  const lake = MeshBuilder.CreateCylinder("vikingLake", { diameter: 2, height: 0.06, tessellation: 96 }, scene);
  const pos = lake.getVerticesData("position")!;
  for (let v = 0; v < pos.length; v += 3) {
    const reach = Math.hypot(pos[v], pos[v + 2]);
    if (reach < 1e-6) continue;
    const r = lakeR(Math.atan2(pos[v + 2], pos[v]));
    pos[v] *= r;
    pos[v + 2] *= r;
  }
  lake.setVerticesData("position", pos);
  lake.refreshBoundingInfo();
  lake.position.y = LAKE.y;
  lake.material = ice;
  lake.receiveShadows = true;
  lake.isPickable = false;
  // The crack network: jittered nodes joined right and back by kinked bands
  const nx = Math.ceil((LAKE.rx * 2) / CRACK_GRID) + 1, nz = Math.ceil((LAKE.rz * 2) / CRACK_GRID) + 1;
  const node = (i: number, j: number): [number, number] => {
    const k = i * 31 + j;
    return [-LAKE.rx + i * CRACK_GRID + (seeded(k, 61) - 0.5) * CRACK_GRID * 0.6, -LAKE.rz + j * CRACK_GRID + (seeded(k, 62) - 0.5) * CRACK_GRID * 0.6];
  };
  const bands: Mesh[] = [];
  const band = (ax: number, az: number, bx: number, bz: number, k: number) => {
    // Two segments with a kink pushed sideways off the midpoint
    const mx = (ax + bx) / 2, mz = (az + bz) / 2, len = Math.hypot(bx - ax, bz - az);
    const push = (seeded(k, 63) - 0.5) * len * 0.35;
    const kx = mx + (-(bz - az) / len) * push, kz = mz + ((bx - ax) / len) * push;
    const width = 0.5 + seeded(k, 64) * 0.4;
    for (const [px, pz, qx, qz] of [[ax, az, kx, kz], [kx, kz, bx, bz]]) {
      if (!inLake(px, pz, 0.5) || !inLake(qx, qz, 0.5)) continue;
      const l = Math.hypot(qx - px, qz - pz);
      const seg = MeshBuilder.CreateBox("vikingCrack", { width: l + width * 0.6, height: 0.04, depth: width }, scene);
      seg.rotation.y = -Math.atan2(qz - pz, qx - px);
      seg.position.set((px + qx) / 2, LAKE.y + 0.05, (pz + qz) / 2);
      bands.push(seg);
    }
  };
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const [ax, az] = node(i, j);
      const k = i * 31 + j;
      if (i + 1 < nx && seeded(k, 65) > 0.25) band(ax, az, ...node(i + 1, j), k * 2);
      if (j + 1 < nz && seeded(k, 66) > 0.25) band(ax, az, ...node(i, j + 1), k * 2 + 1);
    }
  }
  const merged = Mesh.MergeMeshes(bands, true);
  if (merged) {
    merged.name = "vikingLakeCracks";
    merged.material = crackMat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

export function buildViking(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  snowBanks(scene, built);
  frozenLake(scene);
  return result;
}
