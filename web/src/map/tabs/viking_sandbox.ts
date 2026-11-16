// TABS "Viking Sandbox" (viking map): a big flat icy arena closed on every side by a giant tiered ice-cliff wall, a great gate in its left
// side (reference/maps/wiki/viking_sandbox.png, reference/maps/winter_viking_sandbox.png). Built on campaign.challenge (base(); the base is
// shared with four other maps: never edit it, dress its build here).
//
// Ice wall (563), spec read off the wiki shot: the wall rings the whole field as three stepped tiers of faceted ice blocks, each tier a run of
// leaning upright slabs with flat snowy tops, the lowest tier nearest the field: tier 1 at 0.86 of the island rim (ellipse 54 x 48) 5-7 m
// high, tier 2 at 0.93 9-12 m, tier 3 at 0.99 14-18 m; a slab every 6 degrees per tier, 8-11 m along the rim and 5 m deep, turned along it;
// each slab carries a thin white snow slab on its top. Pale cyan ice (r well under g and b), the snow near white, both a little self-lit.
// The base's autumn tree ring (every "trunk" with its canopy, the haze band) goes with its colliders; one 3.5 m collider per tier-1 slab;
// placement stays inside the wall (placementZones clipped to |x| <= 44). The stage army (pirate.arrows_and_arrow) stands at x 29..36, |z| <= 10.
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { Obstacle } from "../obstacles";

function seeded(i: number, seed: number): number {
  const raw = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

const TIERS = [
  { at: 0.86, h0: 5, h1: 7 },
  { at: 0.93, h0: 9, h1: 12 },
  { at: 0.99, h0: 14, h1: 18 },
];
const STEP = 6;
const INSIDE_X = 44;

function rimPoint(deg: number, f: number): [number, number] {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const r = ((c / 54) ** 2 + (s / 48) ** 2) ** -0.5 * f;
  return [c * r, s * r];
}

function clearTreeRing(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (mesh.name === "hazeTreeline") mesh.setEnabled(false);
    else if (mesh.name === "trunk" && !mesh.parent) {
      gone.push([mesh.position.x, mesh.position.z]);
      mesh.setEnabled(false);
    }
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

function iceWall(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.2, 0.22, 0.25);
    return m;
  };
  const ice = mk("vikingSandboxIce", new Color3(0.55, 0.82, 0.9), 0.35);
  const snow = mk("vikingSandboxSnow", new Color3(0.88, 0.94, 0.98), 0.35);
  const blocks: Mesh[] = [], caps: Mesh[] = [];
  TIERS.forEach((tier, t) => {
    for (let deg = 0; deg < 360; deg += STEP) {
      const k = t * 100 + deg / STEP;
      const d = deg + (t % 2) * (STEP / 2) + (seeded(k, 1) - 0.5) * 2;
      const [x, z] = rimPoint(d, tier.at);
      const along = 8 + seeded(k, 2) * 3;
      const h = tier.h0 + seeded(k, 3) * (tier.h1 - tier.h0);
      const yaw = -(d * Math.PI) / 180 - Math.PI / 2;
      const slab = MeshBuilder.CreateCylinder("vsIceBlock", { diameterTop: along * 0.8, diameterBottom: along, height: h, tessellation: 5 }, scene);
      slab.scaling.z = 5 / along;
      slab.rotation.set((seeded(k, 4) - 0.5) * 0.08, yaw + (seeded(k, 5) - 0.5) * 0.3, (seeded(k, 6) - 0.5) * 0.08);
      slab.position.set(x, h / 2 - 0.2, z);
      blocks.push(slab);
      const cap = MeshBuilder.CreateCylinder("vsIceSnow", { diameterTop: along * 0.72, diameterBottom: along * 0.8, height: 0.5, tessellation: 5 }, scene);
      cap.scaling.z = 4.6 / along;
      cap.rotation.set(0, slab.rotation.y, 0);
      cap.position.set(x, h - 0.05, z);
      caps.push(cap);
      if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 3.5 });
    }
  });
  for (const [list, m, name] of [[blocks, ice, "vikingSandboxIceWall"], [caps, snow, "vikingSandboxIceSnow"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

export function buildVikingSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const obstacles = clearTreeRing(scene, built, [...result.obstacles]);
  iceWall(scene, obstacles);
  const placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const x0 = Math.max(zone.center.x - zone.size.x / 2, -INSIDE_X), x1 = Math.min(zone.center.x + zone.size.x / 2, INSIDE_X);
    return { ...zone, center: new Vector3((x0 + x1) / 2, zone.center.y, zone.center.z), size: new Vector3(x1 - x0, zone.size.y, zone.size.z) };
  });
  return { ...result, obstacles, placementZones };
}
