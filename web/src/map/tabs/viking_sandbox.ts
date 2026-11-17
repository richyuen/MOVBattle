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
  // [R] 571 floor spec (wiki shot, pirate.arrows_and_arrow.png; CONFIRM 568/569): the floor is NOT one blue
  // patch inside a white ring. Blue ice reaches out to ~0.8 R, cut into polygon plates 7-12 m across by thin
  // white cracks that join into closed cells; across it lie large irregular snow shapes: 9 tongues running in
  // from the rim (14-24 m long, 5-10 m wide, lobed, reaching to ~0.3 R) and 7 snow islands (4-11 m) scattered
  // over the middle, so the blue reads as broken fields between snow. Snow shapes sit above the ice and cracks.
  const edge = (angle: number) => 0.8 + 0.05 * Math.sin(angle * 5) + 0.04 * Math.sin(angle * 11);
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
  // Plate network: jittered 9.5 m grid of nodes joined to right and back neighbours (a sixth left out) and
  // one diagonal per cell, so the cracks close into uneven polygon plates.
  const GRID = 9.5;
  const span = Math.ceil(ARENA_RADIUS / GRID) + 1;
  const node = (i: number, j: number): [number, number] => {
    const k = (i + 20) * 61 + (j + 20);
    return [i * GRID + (seeded(k, 61) - 0.5) * GRID * 0.7, j * GRID + (seeded(k, 62) - 0.5) * GRID * 0.7];
  };
  const crackLine = (a: [number, number], b: [number, number], k: number) => {
    const [ax, az] = a, [bx, bz] = b;
    const len = Math.hypot(bx - ax, bz - az);
    const push = (seeded(k, 63) - 0.5) * len * 0.3;
    const mx = (ax + bx) / 2 - ((bz - az) / len) * push, mz = (az + bz) / 2 + ((bx - ax) / len) * push;
    for (const [px, pz, qx, qz] of [[ax, az, mx, mz], [mx, mz, bx, bz]]) {
      if (!insideIce(px, pz) || !insideIce(qx, qz)) continue;
      const l = Math.hypot(qx - px, qz - pz);
      const c = MeshBuilder.CreateBox("vsIceCrack", { width: l + 0.1, height: 0.018, depth: 0.1 + seeded(k, 64) * 0.06 }, scene);
      c.rotation.y = -Math.atan2(qz - pz, qx - px);
      c.position.set((px + qx) / 2, 0.043, (pz + qz) / 2);
      cracks.push(c);
    }
  };
  for (let i = -span; i <= span; i++) {
    for (let j = -span; j <= span; j++) {
      const k = (i + 20) * 61 + (j + 20);
      if (seeded(k, 65) > 0.16) crackLine(node(i, j), node(i + 1, j), k * 3);
      if (seeded(k, 66) > 0.16) crackLine(node(i, j), node(i, j + 1), k * 3 + 1);
      if (seeded(k, 67) > 0.55) crackLine(node(i, j), node(i + 1, j + 1), k * 3 + 2);
    }
  }
  // Snow tongues and islands: lobed discs, stretched and turned.
  const snowMat = new StandardMaterial("vikingSandboxSnowDrift", scene);
  snowMat.diffuseColor = SNOW.clone();
  snowMat.emissiveColor = SNOW_SHADE.scale(1.25);
  snowMat.specularColor = new Color3(0.04, 0.04, 0.05);
  const drifts: Mesh[] = [];
  const drift = (x: number, z: number, length: number, width: number, yaw: number, k: number) => {
    const disc = MeshBuilder.CreateCylinder("vsSnowDrift", { diameter: 2, height: 0.05, tessellation: 40 }, scene);
    const pos = disc.getVerticesData("position")!;
    for (let v = 0; v < pos.length; v += 3) {
      const a = Math.atan2(pos[v + 2], pos[v]);
      if (Math.hypot(pos[v], pos[v + 2]) < 1e-6) continue;
      const r = 1 + 0.22 * Math.sin(a * 3 + k) + 0.14 * Math.sin(a * 7 + k * 2.3) + 0.08 * Math.cos(a * 13 + k);
      pos[v] *= r * length / 2;
      pos[v + 2] *= r * width / 2;
    }
    disc.setVerticesData("position", pos);
    disc.rotation.y = yaw;
    disc.position.set(x, 0.07 + (k % 5) * 0.004, z);
    drifts.push(disc);
  };
  for (let t = 0; t < 9; t++) {
    const a = (t / 9) * Math.PI * 2 + seeded(t, 71) * 0.5;
    const length = 14 + seeded(t, 72) * 10;
    const r = ARENA_RADIUS * 0.8 - length * 0.42;
    drift(Math.cos(a) * r, Math.sin(a) * r, length, 5 + seeded(t, 73) * 5, -a + (seeded(t, 74) - 0.5) * 0.5, t);
  }
  for (let s = 0; s < 7; s++) {
    const a = seeded(s, 75) * Math.PI * 2, r = 6 + seeded(s, 76) * 24;
    const size = 4 + seeded(s, 77) * 7;
    drift(Math.cos(a) * r, Math.sin(a) * r, size * 1.4, size, seeded(s, 78) * Math.PI, s + 20);
  }
  const driftMesh = Mesh.MergeMeshes(drifts, true);
  if (driftMesh) {
    driftMesh.name = "vikingSandboxSnowDrifts";
    driftMesh.material = snowMat;
    driftMesh.receiveShadows = true;
    driftMesh.isPickable = false;
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
      const along = 6.5 + seeded(k, 2) * 8.5;
      const h = tier.h0 + seeded(k, 3) * (tier.h1 - tier.h0);
      const yaw = -(d * Math.PI) / 180 - Math.PI / 2;
      const slab = MeshBuilder.CreateCylinder("vsIceBlock", { diameterTop: along * (0.66 + seeded(k, 4) * 0.52), diameterBottom: along, height: h, tessellation: 5 }, scene);
      slab.scaling.z = (4 + seeded(k, 5) * 2) / along;
      slab.rotation.set((seeded(k, 4) - 0.5) * 0.16, yaw + (seeded(k, 5) - 0.5) * 0.3, (seeded(k, 6) - 0.5) * 0.27);
      slab.position.set(x, h / 2 - 0.2, z);
      blocks.push(slab);
      if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 3.5 });
    }
    // [R] 571 wall spec (wiki shot; CONFIRM 568/569): no continuous narrow snow band per tier. Each tier's
    // snow is broken into separate ledges 9-24 degrees long, each with its own depth (1.5-6 m, a few broad
    // 7-9 m shelves) and its own height (-2..+1.2 m off the tier top), tilted a little; between ledges a
    // 3-7 degree break where a jutting ice column stands proud of the ledges (1.2-1.45x the tier height,
    // pushed 1.5-3 m inward). The gate gap (164..196 deg) stays open.
    let angle = (t * 7) % 11;
    let n = 0;
    while (angle < 360) {
      n += 1;
      const k = t * 1000 + n;
      const arc = 9 + seeded(k, 11) * 15;
      const end = Math.min(360, angle + arc);
      const broad = t > 0 && seeded(k, 12) > 0.75;
      const depth = (broad ? 7 + seeded(k, 13) * 2 : 1.5 + seeded(k, 13) * (t === 0 ? 2 : 4.5)) / ARENA_RADIUS;
      const lipDrop = broad ? tier.h1 - TIERS[t - 1].h1 : 1.4;
      const lift = -2 + seeded(k, 14) * 3.2;
      const tilt = (seeded(k, 15) - 0.5) * 1.6;
      const rows: Vector3[][] = [[], [], [], []];
      for (let a = angle; a <= end + 0.01; a += 2) {
        if (a > 164 && a < 196) continue;
        const f = (a - angle) / Math.max(1, end - angle);
        const y = tier.h1 + lift + tilt * (f - 0.5) + seeded(k * 7 + a, 9) * 0.3;
        const inner = tier.at - depth * (0.75 + 0.25 * Math.sin(f * Math.PI)) - seeded(k + a, 7) * 0.012;
        const [ix, iz] = rimPoint(a, inner);
        const [ox, oz] = rimPoint(a, tier.at + 0.05);
        rows[0].push(new Vector3(ix * 1.012, y - lipDrop, iz * 1.012));
        rows[1].push(new Vector3(ix, y - 0.1, iz));
        rows[2].push(new Vector3(ox, y + 0.3, oz));
        const foot = t === 0 ? -0.1 : TIERS[t - 1].h0 - 0.45;
        rows[3].push(new Vector3(ox, foot, oz));
      }
      if (rows[0].length >= 2) caps.push(MeshBuilder.CreateRibbon("vsIceShelf", { pathArray: rows, sideOrientation: Mesh.DOUBLESIDE }, scene));
      const gap = 3 + seeded(k, 16) * 4;
      const colAngle = end + gap / 2;
      if (colAngle < 360 && Math.abs(colAngle - 180) > 18) {
        const h = tier.h1 * (1.2 + seeded(k, 17) * 0.25);
        const [cx, cz] = rimPoint(colAngle, tier.at - (1.5 + seeded(k, 18) * 1.5) / ARENA_RADIUS);
        const width = 3.2 + seeded(k, 19) * 2.4;
        const column = MeshBuilder.CreateCylinder("vsIceColumn", { diameterTop: width * 0.55, diameterBottom: width, height: h, tessellation: 5 }, scene);
        column.position.set(cx, h / 2 - 0.2, cz);
        column.rotation.set((seeded(k, 20) - 0.5) * 0.18, seeded(k, 21) * Math.PI, (seeded(k, 22) - 0.5) * 0.18);
        blocks.push(column);
        if (t === 0) obstacles.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: width / 2 });
      }
      angle = end + gap;
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

function rimPeaks(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^mountain(Base|Cap|Root)/.test(mesh.name)) mesh.setEnabled(false);
  }
  const glacier = new StandardMaterial("vikingSandboxRimGlacier", scene);
  glacier.diffuseColor = new Color3(0.42, 0.72, 0.85);
  glacier.emissiveColor = glacier.diffuseColor.scale(0.34);
  const snow = scene.getMaterialByName("vikingSandboxSnow");
  for (const [axis, prominence] of [[11, 13], [63, 8], [113, 16], [246, 12], [310, 17]]) {
    for (let i = -1; i <= 1; i++) {
      const angle = axis + i * 5;
      const [x, z] = rimPoint(angle, 0.98 + i * 0.015);
      const height = prominence - Math.abs(i) * 4;
      const width = 7 + seeded(axis + i, 76) * 4;
      const peak = MeshBuilder.CreateCylinder("vikingSandboxRimPeak", {
        height, diameterTop: width * 0.16, diameterBottom: width, tessellation: 4, subdivisions: 2,
      }, scene);
      peak.position.set(x, 14 + height / 2, z);
      peak.rotation.set(0.12 + i * 0.14, angle * Math.PI / 180, i * 0.13);
      peak.scaling.z = 0.7;
      peak.convertToFlatShadedMesh();
      peak.material = i === 1 ? snow : glacier;
      peak.isPickable = false;
    }
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
  rimPeaks(scene, built);
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
