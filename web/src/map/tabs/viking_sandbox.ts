// TABS "Viking Sandbox" (viking map): a big flat icy arena closed on every side by a giant tiered ice-cliff wall, a great gate in its left
// side (reference/maps/wiki/viking_sandbox.png, reference/maps/winter_viking_sandbox.png). Built on campaign.challenge (base(); the base is
// shared with four other maps: never edit it, dress its build here).
//
// Ice wall: three stepped tiers of leaning ice buttresses, each joined at the top by long fractured snow shelves.
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
const ARENA_RADIUS = 51;

function rimPoint(deg: number, f: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * ARENA_RADIUS * f, Math.sin(a) * ARENA_RADIUS * f];
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
    if (n === "ground" || n.startsWith("campaign_zone_") || n.startsWith("fieldBlades_") || n.startsWith("fieldTufts_") || n === "grassTuft" || n === "centerGrass" || n === "flowerDot") mesh.setEnabled(false);
  }
  const ground = MeshBuilder.CreateCylinder("vikingSandboxCircularFloor", {
    diameter: ARENA_RADIUS * 2, height: 0.16, tessellation: 96,
  }, scene);
  ground.position.y = -0.08;
  ground.material = scene.getMaterialByName("groundMat");
  ground.receiveShadows = true;
  const iceMat = new StandardMaterial("vikingSandboxFloorIce", scene);
  iceMat.diffuseColor = ICE_PATCH;
  iceMat.emissiveColor = ICE_PATCH.scale(0.4);
  iceMat.specularColor = new Color3(0.15, 0.18, 0.2);
  const crackMat = new StandardMaterial("vikingSandboxCrack", scene);
  crackMat.diffuseColor = new Color3(0.9, 0.95, 1);
  crackMat.emissiveColor = new Color3(0.45, 0.5, 0.55);
  crackMat.specularColor = Color3.Black();
  const edge = (angle: number) => 0.72 + 0.085 * Math.sin(angle * 5) + 0.09 * Math.sin(angle * 11) + 0.047 * Math.cos(angle * 23);
  const ice = MeshBuilder.CreateCylinder("vikingSandboxIceSheet", { diameter: ARENA_RADIUS * 2, height: 0.045, tessellation: 96 }, scene);
  const vertices = ice.getVerticesData("position")!;
  for (let i = 0; i < vertices.length; i += 3) {
    const reach = edge(Math.atan2(vertices[i + 2], vertices[i]));
    vertices[i] *= reach;
    vertices[i + 2] *= reach;
  }
  ice.setVerticesData("position", vertices);
  ice.refreshBoundingInfo();
  ice.position.y = 0.015;
  ice.material = iceMat;
  ice.receiveShadows = true;
  ice.isPickable = false;
  const cracks: Mesh[] = [];
  const insideIce = (x: number, z: number) => Math.hypot(x, z) < ARENA_RADIUS * edge(Math.atan2(z, x)) - 0.8;
  for (let i = 0; i < 60; i++) {
    const a = seeded(i, 41) * Math.PI * 2;
    const [x, z] = rimPoint((a * 180) / Math.PI, Math.sqrt(seeded(i, 42)) * 0.7);
    if (!insideIce(x, z)) continue;
    let px = x, pz = z, yaw = seeded(i, 43) * Math.PI;
    for (let s = 0; s < 3; s++) {
      const len = (s === 2 ? 2 : 4) + seeded(i * 3 + s, 44) * 5;
      const heading = s === 2 ? yaw - 1.15 : yaw;
      const dx = Math.cos(heading) * len / 2, dz = -Math.sin(heading) * len / 2;
      if (!insideIce(px + dx * 2, pz + dz * 2)) continue;
      const c = MeshBuilder.CreateBox("vsIceCrack", { width: len, height: 0.018, depth: s === 2 ? 0.065 : 0.11 }, scene);
      c.rotation.y = heading;
      c.position.set(px + dx, 0.043, pz + dz);
      cracks.push(c);
      if (s === 0) {
        px += dx * 2;
        pz += dz * 2;
      }
      yaw += (seeded(i * 2 + s, 45) - 0.5) * 1.6;
    }
  }
  const merged = Mesh.MergeMeshes(cracks, true);
  if (merged) {
    merged.name = "vikingSandboxIceCracks";
    merged.material = crackMat;
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
      if (Math.abs(d - 180) < 14) continue;
      const [x, z] = rimPoint(d, tier.at);
      const along = 5 + seeded(k, 2) * 9;
      const h = tier.h0 + seeded(k, 3) * (tier.h1 - tier.h0);
      const yaw = -(d * Math.PI) / 180 - Math.PI / 2;
      const slab = MeshBuilder.CreateCylinder("vsIceBlock", { diameterTop: along * (0.66 + seeded(k, 4) * 0.52), diameterBottom: along, height: h, tessellation: 5 }, scene);
      slab.scaling.z = (4 + seeded(k, 5) * 2) / along;
      slab.rotation.set((seeded(k, 4) - 0.5) * 0.16, yaw + (seeded(k, 5) - 0.5) * 0.3, (seeded(k, 6) - 0.5) * 0.27);
      slab.position.set(x, h / 2 - 0.2, z);
      blocks.push(slab);
      if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 3.5 });
    }
    for (const [start, end] of [[0, 164], [196, 360]]) {
      const rows: Vector3[][] = [[], [], [], []];
      for (let angle = start; angle <= end; angle += 2) {
        const i = angle + t * 400;
        const y = tier.h1 - 0.1 + Math.sin(angle * 0.18) * 0.63 + seeded(i, 9) * 0.38;
        const [ix, iz] = rimPoint(angle, tier.at - 0.05 - seeded(i, 7) * 0.028);
        const [ox, oz] = rimPoint(angle, tier.at + 0.044 + seeded(i, 8) * 0.018);
        rows[0].push(new Vector3(ix * 1.014, y - 1.25, iz * 1.014));
        rows[1].push(new Vector3(ix, y - 0.1, iz));
        rows[2].push(new Vector3(ox, y + 0.24, oz));
        rows[3].push(new Vector3(ox, y - 1.28, oz));
      }
      const shelf = MeshBuilder.CreateRibbon("vsIceShelf", { pathArray: rows, sideOrientation: Mesh.DOUBLESIDE }, scene);
      caps.push(shelf);
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
  const gateX = -48;
  const relief = mk("vikingSandboxGateRelief", new Color3(0.28, 0.62, 0.72), 0.45);
  const gateBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat: StandardMaterial) => {
    const part = MeshBuilder.CreateBox("vikingSandboxGate", { width: w, height: h, depth: d }, scene);
    part.position.set(x, y, z);
    part.material = mat;
    part.receiveShadows = true;
    return part;
  };
  for (const z of [-9, 9]) {
    gateBox(6.4, 18.7, 4.7, gateX, 9.35, z, ice);
    gateBox(7.2, 1, 5.2, gateX, 18.9, z, snow);
    gateBox(7, 1.5, 5.2, gateX, 0.75, z, snow);
  }
  gateBox(6, 2, 20, gateX, 17.3, 0, snow);
  for (const z of [-3.45, 3.45]) {
    gateBox(2.9, 16.4, 6.8, gateX - 1.05, 8.2, z, ice);
    for (const y of [4, 11.1]) {
      gateBox(0.25, 3.3, 3.3, gateX + 0.54, y, z, relief).rotation.x = Math.PI / 4;
      gateBox(0.27, 2.66, 2.66, gateX + 0.62, y, z, ice).rotation.x = Math.PI / 4;
    }
  }
  const links: Mesh[] = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const link = MeshBuilder.CreateTorus("vikingSandboxChainLink", { diameter: 0.88, thickness: 0.16, tessellation: 8 }, scene);
    link.position.set(gateX + 2.7, 18.5 - 2.6 * 4 * t * (1 - t), -9 + 18 * t);
    link.rotation.z = i % 2 === 0 ? Math.PI / 2 : 0;
    links.push(link);
  }
  const chain = Mesh.MergeMeshes(links, true);
  if (chain) chain.material = relief;
  obstacles.push({ type: "box", center: new Vector3(gateX, 0, 0), halfX: 3.2, halfZ: 13 });
}

function iceBody(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^island(Under|Shelf|Cliff)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const ice = new StandardMaterial("vikingSandboxGlacier", scene);
  ice.diffuseColor = new Color3(0.63, 0.88, 0.95);
  ice.emissiveColor = ice.diffuseColor.scale(0.62);
  ice.specularColor = Color3.Black();
  const crystal = new StandardMaterial("vikingSandboxCrystal", scene);
  crystal.diffuseColor = new Color3(0.21, 0.62, 0.82);
  crystal.emissiveColor = crystal.diffuseColor.scale(0.54);
  crystal.specularColor = Color3.Black();
  const rings = [[-0.12, 1.03], [-8, 0.98], [-18, 0.82], [-26, 0.52], [-28, 0]];
  const pathArray = rings.map(([y, scale], tier) => Array.from({ length: 61 }, (_, i) => {
    const k = i % 60;
    const [x, z] = rimPoint(k * 6 + tier * 2.3, scale * (1 + 0.035 * (seeded(k, 311) - 0.5)));
    return new Vector3(x, y - (tier === 0 || scale === 0 ? 0 : seeded(k, 312) * 2.5), z);
  }));
  const body = MeshBuilder.CreateRibbon("vikingSandboxIceBody", { pathArray, sideOrientation: Mesh.DOUBLESIDE }, scene);
  body.convertToFlatShadedMesh();
  body.material = ice;
  body.isPickable = false;
  const facets: Mesh[] = [];
  for (let i = 0; i < 25; i++) {
    const [x, z] = rimPoint(i * (360 / 25) + seeded(i, 315) * 7, 0.9 + seeded(i, 316) * 0.06);
    const height = 4 + seeded(i, 317) * 7;
    const shard = MeshBuilder.CreateCylinder("vikingSandboxIceShard", {
      height, diameterTop: 3.8 + seeded(i, 318) * 3, diameterBottom: 0.25, tessellation: 4,
    }, scene);
    shard.position.set(x, -8 - height / 2, z);
    shard.rotation.set(0.45 * Math.sin(i * 2), i * 0.77, 0.42 * Math.cos(i * 2));
    facets.push(shard);
  }
  const shards = Mesh.MergeMeshes(facets, true);
  if (shards) {
    shards.convertToFlatShadedMesh();
    shards.material = crystal;
    shards.isPickable = false;
  }
}

export function buildVikingSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const cleared = clearFieldDressing(scene, built, result, clearFieldJunk(scene, built, clearTreeRing(scene, built, [...result.obstacles])));
  const obstacles = cleared.obstacles;
  snowAndIce(scene, built);
  iceBody(scene, built);
  iceWall(scene, obstacles);
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  const oldDensity = scene.fogDensity;
  scene.clearColor.set(0.52, 0.78, 0.83, 1);
  scene.fogColor = new Color3(0.62, 0.82, 0.86);
  scene.fogDensity = 0.012;
  const flakes: Mesh[] = [];
  for (let i = 0; i < 155; i++) {
    const flake = MeshBuilder.CreateIcoSphere("vikingSandboxFlake", { radius: 0.045 + seeded(i, 290) * 0.08, subdivisions: 1 }, scene);
    flake.position.set((seeded(i, 291) - 0.5) * 115, 1 + seeded(i, 292) * 22, (seeded(i, 293) - 0.5) * 100);
    flake.scaling.set(1.8, 0.6, 1);
    flakes.push(flake);
  }
  const flurry = Mesh.MergeMeshes(flakes, true);
  if (flurry) {
    const snow = new StandardMaterial("vikingSandboxFlurry", scene);
    snow.disableLighting = true;
    snow.emissiveColor = new Color3(0.94, 0.98, 1);
    flurry.material = snow;
    flurry.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(flurry);
  }
  const placementZones = (result.placementZones ?? result.zones).map((zone) => {
    const x0 = Math.max(zone.center.x - zone.size.x / 2, -INSIDE_X), x1 = Math.min(zone.center.x + zone.size.x / 2, INSIDE_X);
    return { ...zone, center: new Vector3((x0 + x1) / 2, zone.center.y, zone.center.z), size: new Vector3(x1 - x0, zone.size.y, zone.size.z) };
  });
  return {
    ...result, obstacles, hazards: cleared.hazards, placementZones,
    dispose: () => {
      scene.clearColor.copyFrom(oldClear);
      scene.fogColor.copyFrom(oldFog);
      scene.fogDensity = oldDensity;
      result.dispose?.();
    },
  };
}
