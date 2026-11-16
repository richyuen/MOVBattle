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

// The base's field junk (Challenge Bluffs: two dark barricade slabs, the ruin block with its pillar, the ball-topped totem) goes with its
// colliders: TABS's arena floor is flat open ice. Every one of those is a "<displayName>_box|_cyl|_totem_top" mesh; a collider goes when its
// centre sits under a removed mesh.
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

// The rest of the base's field dressing (565, named by a probe of the built set): the low dark dry-stone wall runs ("wallStone", the black
// block row of the battle shot), navy boulder clusters ("boulder"), gold hay bales ("hayBale"), grass mounds ("hill"), stumps ("stump"),
// and the two pits (a dark see-through box overlay each, with its hazard). TABS's arena floor is flat open ice: all of them go, and every
// base collider standing inside 0.8 of the rim with them (the ice wall's own colliders are added after).
const FIELD_DRESSING = new Set(["wallStone", "boulder", "hayBale", "hill", "stump", "campaign_hazard_box_pit"]);

function clearFieldDressing(scene: Scene, built: Set<unknown>, result: MapBuildResult, obstacles: Obstacle[]): { obstacles: Obstacle[]; hazards: MapBuildResult["hazards"] } {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && FIELD_DRESSING.has(mesh.name)) mesh.setEnabled(false);
  }
  const inside = (x: number, z: number) => (x / 54) ** 2 + (z / 48) ** 2 < 0.8 ** 2;
  return {
    obstacles: obstacles.filter((o) => !inside(o.center.x, o.center.z)),
    hazards: result.hazards.filter((h) => h.kind !== "pit"),
  };
}

// Snow and cracked ice floor (564), spec read off the wiki shot: the arena floor is pale blue-white snow; over it lie big blotchy patches of
// darker teal-blue ice (each 6-16 m across, ragged lobed outlines, about 45% of the floor, larger towards the middle), and thin white crack
// lines (3-9 m, a few joined at angles) run across the ice. The base's autumn colours go: ground and grass materials turn to snow, the tuft
// clumps and grass blades are hidden. All drawn only (flat, 3-8 cm high), nothing in the way.
const SNOW = new Color3(0.8, 0.86, 0.95);
const SNOW_SHADE = new Color3(0.3, 0.36, 0.44);
const ICE_PATCH = new Color3(0.36, 0.62, 0.72);

function snowAndIce(scene: Scene, built: Set<unknown>): void {
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
  const iceMat = new StandardMaterial("vikingSandboxFloorIce", scene);
  iceMat.diffuseColor = ICE_PATCH;
  iceMat.emissiveColor = ICE_PATCH.scale(0.4);
  iceMat.specularColor = new Color3(0.15, 0.18, 0.2);
  const crackMat = new StandardMaterial("vikingSandboxCrack", scene);
  crackMat.diffuseColor = new Color3(0.9, 0.95, 1);
  crackMat.emissiveColor = new Color3(0.45, 0.5, 0.55);
  crackMat.specularColor = Color3.Black();
  const patches: Mesh[] = [];
  for (let i = 0; i < 46; i++) {
    const a = seeded(i, 31) * Math.PI * 2;
    const reach = Math.sqrt(seeded(i, 32)) * 0.78;
    const [rx, rz] = rimPoint((a * 180) / Math.PI, reach);
    const size = 6 + (1 - reach) * 6 + seeded(i, 33) * 4;
    const p = MeshBuilder.CreateCylinder("vsIcePatch", { diameter: 1, height: 0.05, tessellation: 14 }, scene);
    // A lobed ragged outline: each of the 14 rim directions pushed in or out by its own amount
    const lobes = Array.from({ length: 14 }, (_, k) => 0.55 + seeded(i * 14 + k, 34) * 0.9);
    const pos = p.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const r = Math.hypot(pos[v], pos[v + 2]);
      if (r < 1e-6) continue;
      const ang = (Math.atan2(pos[v + 2], pos[v]) + Math.PI * 2) % (Math.PI * 2);
      const f = lobes[Math.round((ang / (Math.PI * 2)) * 14) % 14];
      pos[v] *= f;
      pos[v + 2] *= f;
    }
    p.setVerticesData("position", pos);
    p.scaling.set(size, 1, size * (0.6 + seeded(i, 35) * 0.5));
    p.rotation.y = seeded(i, 36) * Math.PI;
    p.position.set(rx, 0.025 + (i % 3) * 0.005, rz);
    patches.push(p);
  }
  const cracks: Mesh[] = [];
  for (let i = 0; i < 60; i++) {
    const a = seeded(i, 41) * Math.PI * 2;
    const [x, z] = rimPoint((a * 180) / Math.PI, Math.sqrt(seeded(i, 42)) * 0.76);
    let px = x, pz = z, yaw = seeded(i, 43) * Math.PI;
    for (let s = 0; s < 2; s++) {
      const len = 3 + seeded(i * 2 + s, 44) * 6;
      const c = MeshBuilder.CreateBox("vsIceCrack", { width: len, height: 0.04, depth: 0.16 }, scene);
      c.rotation.y = yaw;
      const dx = Math.cos(yaw) * len / 2, dz = -Math.sin(yaw) * len / 2;
      c.position.set(px + dx, 0.07, pz + dz);
      cracks.push(c);
      px += dx * 2;
      pz += dz * 2;
      yaw += (seeded(i * 2 + s, 45) - 0.5) * 1.6;
    }
  }
  for (const [list, m, name] of [[patches, iceMat, "vikingSandboxIcePatches"], [cracks, crackMat, "vikingSandboxIceCracks"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
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
  const cleared = clearFieldDressing(scene, built, result, clearFieldJunk(scene, built, clearTreeRing(scene, built, [...result.obstacles])));
  const obstacles = cleared.obstacles;
  snowAndIce(scene, built);
  iceWall(scene, obstacles);
  const placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const x0 = Math.max(zone.center.x - zone.size.x / 2, -INSIDE_X), x1 = Math.min(zone.center.x + zone.size.x / 2, INSIDE_X);
    return { ...zone, center: new Vector3((x0 + x1) / 2, zone.center.y, zone.center.z), size: new Vector3(x1 - x0, zone.size.y, zone.size.z) };
  });
  return { ...result, obstacles, hazards: cleared.hazards, placementZones };
}
