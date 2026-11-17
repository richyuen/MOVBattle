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
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
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

// The rest of the base's field dressing (565, named by a probe of the built set): the low dark dry-stone wall runs ("wallStone", the black
// block row of the battle shot), navy boulder clusters ("boulder"), gold hay bales ("hayBale"), grass mounds ("hill"), stumps ("stump"),
// and the two pits (a dark see-through box overlay each, with its hazard). TABS's field is wide open: all of them go, and every base
// collider standing on them (inside 0.8 of the rim, where only that dressing stands; the ring trees stand further out).
const FIELD_DRESSING = new Set(["wallStone", "boulder", "hayBale", "hill", "stump", "campaign_hazard_box_pit"]);

function clearFieldDressing(scene: Scene, built: Set<unknown>, result: MapBuildResult, obstacles: Obstacle[]): { obstacles: Obstacle[]; hazards: MapBuildResult["hazards"] } {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !FIELD_DRESSING.has(mesh.name)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  const inside = (x: number, z: number) => (x / 54) ** 2 + (z / 48) ** 2 < 0.8 ** 2;
  return {
    obstacles: obstacles.filter((o) => !(inside(o.center.x, o.center.z) && gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 4))),
    hazards: result.hazards.filter((h) => h.kind !== "pit"),
  };
}

function hillsideTerraces(scene: Scene, obstacles: Obstacle[]): void {
  const makeMaterial = (name: string, color: Color3) => {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = color;
    material.emissiveColor = color.scale(0.15);
    return material;
  };
  const earth = makeMaterial("ancientSandboxTerraceEarth", new Color3(0.49, 0.30, 0.23));
  const turf = makeMaterial("ancientSandboxTerraceTurf", new Color3(0.5, 0.64, 0.25));
  const lime = makeMaterial("ancientSandboxTerraceLime", new Color3(0.84, 0.8, 0.65));
  const tile = makeMaterial("ancientSandboxTerraceTile", new Color3(0.28, 0.42, 0.6));
  for (const [x, z, radius, height] of [[-24, 36, 12, 10], [23, 36, 13, 13]]) {
    for (let tier = 0; tier < 3; tier++) {
      const r = radius * (1 - tier * 0.23);
      const h = height / 3;
      const pz = z + tier * 1.5;
      const mound = MeshBuilder.CreateCylinder("ancientSandboxTerraceCliff", { height: h, diameterTop: r * 1.72, diameterBottom: r * 2, tessellation: 8 }, scene);
      mound.position.set(x + tier * 0.55, (tier + 0.5) * h, pz);
      mound.scaling.z = 0.8;
      mound.rotation.y = Math.PI / 8;
      mound.material = earth;
      const cap = MeshBuilder.CreateCylinder("ancientSandboxTerraceLawn", { height: 0.36, diameterTop: r * 1.76, diameterBottom: r * 1.72, tessellation: 8 }, scene);
      cap.position.set(mound.position.x, (tier + 1) * h, pz);
      cap.scaling.z = 0.8;
      cap.rotation.y = mound.rotation.y;
      cap.material = turf;
      for (let step = 0; step < 7; step++) {
        const top = tier * h + h * (step + 1) / 7;
        const stair = MeshBuilder.CreateBox("ancientSandboxTerraceStep", { width: 3.4, height: 0.56, depth: 0.59 }, scene);
        stair.position.set(x - 2.7, top - 0.27, pz - r * 0.75 + (step - 3) * 0.51);
        stair.material = lime;
      }
    }
    const temple = MeshBuilder.CreateBox("ancientSandboxTerraceTemple", { width: 4.9, height: 2.5, depth: 4.4 }, scene);
    temple.position.set(x + 1.3, height + 1.4, z + 3.2);
    temple.material = lime;
    for (const dx of [-1.85, -0.63, 0.63, 1.85]) {
      const column = MeshBuilder.CreateCylinder("ancientSandboxTempleColumn", { height: 2.65, diameter: 0.47, tessellation: 7 }, scene);
      column.position.set(temple.position.x + dx, height + 1.5, z + 0.42);
      column.material = lime;
    }
    const roof = MeshBuilder.CreateCylinder("ancientSandboxTemplePediment", { height: 5.4, diameter: 6.35, tessellation: 3 }, scene);
    roof.rotation.set(Math.PI / 2, 0, 0);
    roof.scaling.x = 0.89;
    roof.scaling.z = 0.25;
    roof.position.set(temple.position.x, height + 3.2, z + 2.7);
    roof.material = tile;
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: radius * 0.79 });
  }
}

// Ruins (571, wiki shot): around the open clearing stand isolated pieces of a ruined classical site in pale
// limestone: broken fluted columns of uneven height (3-6 m) in small groups with drums lying at their feet,
// whole columns fallen flat in the grass, and two ruined gateways (a post-and-lintel arch still standing
// with a lintel block fallen beside it, and one whose lintel leans down from a single post). Spec: groups at
// the back-left, front-left, front-centre, front-right and right edges of the clearing, clear of the trails
// and the terrace hills; standing pieces get colliders, lying pieces are knee-high and get small ones.
function ruins(scene: Scene, obstacles: Obstacle[]): void {
  const lime = new StandardMaterial("ancientSandboxRuinStone", scene);
  lime.diffuseColor = new Color3(0.86, 0.8, 0.66);
  lime.emissiveColor = lime.diffuseColor.scale(0.18);
  const column = (x: number, z: number, height: number, i: number) => {
    const shaft = MeshBuilder.CreateCylinder("ancientSandboxRuinColumn", { height, diameterTop: 0.95, diameterBottom: 1.1, tessellation: 10 }, scene);
    shaft.position.set(x, height / 2 + 0.35, z);
    shaft.material = lime;
    shaft.receiveShadows = true;
    const plinth = MeshBuilder.CreateBox("ancientSandboxRuinPlinth", { width: 1.6, height: 0.5, depth: 1.6 }, scene);
    plinth.position.set(x, 0.25, z);
    plinth.material = lime;
    const broken = MeshBuilder.CreateCylinder("ancientSandboxRuinBreak", { height: 0.5, diameterTop: 0.5, diameterBottom: 0.95, tessellation: 7 }, scene);
    broken.position.set(x + 0.15, height + 0.55, z);
    broken.rotation.z = 0.35 * (seeded(i, 21) - 0.5);
    broken.material = lime;
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.85 });
  };
  const fallen = (x: number, z: number, length: number, yaw: number, i: number) => {
    const shaft = MeshBuilder.CreateCylinder("ancientSandboxRuinFallen", { height: length, diameter: 1.05, tessellation: 10 }, scene);
    shaft.rotation.set(0, yaw, Math.PI / 2);
    shaft.position.set(x, 0.5, z);
    shaft.material = lime;
    shaft.receiveShadows = true;
    for (let k = 0; k < 2; k++) {
      const drum = MeshBuilder.CreateCylinder("ancientSandboxRuinDrum", { height: 0.8, diameter: 1.05, tessellation: 10 }, scene);
      const d = length / 2 + 1 + k * 1.3;
      drum.position.set(x + Math.cos(-yaw) * d, 0.52, z + Math.sin(-yaw) * d);
      drum.rotation.set(0.2 * k, yaw + 0.6 * seeded(i, k), Math.PI / 2 - 0.3 * k);
      drum.material = lime;
    }
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 1.0 });
  };
  const block = (x: number, y: number, z: number, w: number, h: number, d: number, rx: number, rz: number) => {
    const b = MeshBuilder.CreateBox("ancientSandboxRuinBlock", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.set(rx, 0, rz);
    b.material = lime;
    b.receiveShadows = true;
    return b;
  };
  // Back-left colonnade remnant and front-left pair.
  column(-36, 22, 5.2, 1); column(-32.5, 24.5, 3.1, 2); column(-39, 18.5, 4.1, 3);
  fallen(-31, 19, 6.5, 0.5, 4);
  column(-40, -28, 4.6, 5); column(-36, -32, 2.6, 6);
  fallen(-14, -38, 7.5, 0.1, 7);
  fallen(10, -40, 5.5, -0.4, 8);
  // Front-right gateway: two posts with a lintel, one lintel block fallen at its foot.
  for (const dx of [-2.6, 2.6]) {
    block(31 + dx, 3.1, -33, 1.3, 6.2, 1.3, 0, 0);
    obstacles.push({ type: "box", center: new Vector3(31 + dx, 0, -33), halfX: 0.7, halfZ: 0.7 });
  }
  block(31, 6.6, -33, 7.4, 1.0, 1.5, 0, 0);
  block(35.5, 0.55, -30.5, 4.2, 1.0, 1.4, 0.1, 0.12).rotation.y = 0.7;
  // Right edge: a single post with its lintel leaning down onto the grass.
  block(45, 3, 21, 1.3, 6, 1.3, 0, 0);
  block(42.4, 3.1, 21.3, 6.4, 1.0, 1.4, 0, -0.8);
  obstacles.push({ type: "box", center: new Vector3(44, 0, 21), halfX: 2, halfZ: 0.8 });
  // Scattered fragments.
  for (let i = 0; i < 12; i++) {
    const a = seeded(i, 31) * Math.PI * 2;
    const [rx, rz] = rimAt(a);
    const f = 0.7 + seeded(i, 32) * 0.12;
    block(rx * f, 0.25, rz * f, 0.9 + seeded(i, 33), 0.5, 0.7 + seeded(i, 34) * 0.6, 0, 0.2 * seeded(i, 35)).rotation.y = a;
  }
}

// Spiral mountain (572, card Overview + greek_ancient_sandbox.png): on the north centreline, between the two
// terrace hills at the back rim, a tall terracotta rock tower rises ~32 m, tapering from a 9 m to a 4.5 m radius
// in eight faceted drums turned against each other, with a green-topped ledge winding up it 2.5 turns and a
// small columned shrine on the summit. Collider at the foot.
const SPIRAL = { x: 0, z: 41, height: 32, r0: 9, r1: 4.5 };
function spiralMountain(scene: Scene, obstacles: Obstacle[]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const rock = mk("ancientSandboxSpiralRock", new Color3(0.62, 0.33, 0.22), 0.2);
  const turf = mk("ancientSandboxSpiralTurf", new Color3(0.5, 0.64, 0.25), 0.15);
  const lime = mk("ancientSandboxSpiralShrine", new Color3(0.86, 0.82, 0.68), 0.2);
  const { x, z, height, r0, r1 } = SPIRAL;
  const radiusAt = (y: number) => r0 + (r1 - r0) * (y / height);
  const drums: Mesh[] = [];
  const sections = 8;
  for (let i = 0; i < sections; i++) {
    const y0 = (i / sections) * height, y1 = ((i + 1) / sections) * height;
    const drum = MeshBuilder.CreateCylinder("ancientSandboxSpiralDrum", {
      height: y1 - y0 + 0.4, diameterBottom: radiusAt(y0) * 2, diameterTop: radiusAt(y1) * 2 * 0.94, tessellation: 7,
    }, scene);
    drum.position.set(x + (seeded(i, 81) - 0.5) * 0.8, (y0 + y1) / 2, z + (seeded(i, 82) - 0.5) * 0.8);
    drum.rotation.y = seeded(i, 83) * Math.PI;
    drums.push(drum);
  }
  const ledges: Mesh[] = [], lips: Mesh[] = [];
  const turns = 2.5, steps = 80;
  for (let s = 0; s < steps; s++) {
    const f = s / steps;
    const a = f * turns * Math.PI * 2 - Math.PI / 2;
    const y = 1.5 + f * (height - 4);
    const r = radiusAt(y) + 1.1;
    const block = MeshBuilder.CreateBox("ancientSandboxSpiralLedge", { width: 2.4, height: 1.2, depth: 2.6 }, scene);
    block.position.set(x + Math.cos(a) * r, y - 0.6, z + Math.sin(a) * r);
    block.rotation.y = -a;
    lips.push(block);
    const grass = MeshBuilder.CreateBox("ancientSandboxSpiralGrass", { width: 2.5, height: 0.2, depth: 2.7 }, scene);
    grass.position.set(block.position.x, y + 0.08, block.position.z);
    grass.rotation.y = -a;
    ledges.push(grass);
  }
  for (const [list, mat, name] of [[[...drums, ...lips], rock, "ancientSandboxSpiralMountain"], [ledges, turf, "ancientSandboxSpiralPath"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
  }
  const cap = MeshBuilder.CreateCylinder("ancientSandboxSpiralSummit", { height: 0.4, diameter: r1 * 2 * 0.95, tessellation: 7 }, scene);
  cap.position.set(x, height + 0.2, z);
  cap.material = turf;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const column = MeshBuilder.CreateCylinder("ancientSandboxSpiralColumn", { height: 3, diameter: 0.45, tessellation: 7 }, scene);
    column.position.set(x + Math.cos(a) * 2, height + 1.9, z + Math.sin(a) * 2);
    column.material = lime;
  }
  const roof = MeshBuilder.CreateCylinder("ancientSandboxSpiralRoof", { height: 0.5, diameter: 5.2, tessellation: 12 }, scene);
  roof.position.set(x, height + 3.6, z);
  roof.material = lime;
  obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: r0 + 1 });
}

// Edge dressing (572, wiki shot ancient_sandbox.png): the clearing is ringed by Greek houses and cypresses, not
// autumn trees. Spec: the base's ring trees go (unparented trunks with their crowns and colliders). Five small
// hamlets near the rim (left, right, back-right, front-left, front-right) of 1-2 whitewashed cube houses each
// (5-6.5 m, 3.6-5 m high, some with an upper room), blue doors, window shutters and roof band, each fronted by a
// low white wall with blue tile coping; slim cypress clusters (2-4 cones 4.5-7 m) beside every hamlet and at
// eight more spots along the rim.
function edgeVillage(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.setEnabled(false);
  }
  const kept = obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const white = mk("ancientSandboxHouseWhite", new Color3(0.95, 0.94, 0.88), 0.24);
  const blue = mk("ancientSandboxHouseBlue", new Color3(0.2, 0.4, 0.78), 0.26);
  const leaves = mk("ancientSandboxCypress", new Color3(0.3, 0.48, 0.15), 0.18);
  const box = (name: string, x: number, y: number, z: number, w: number, h: number, d: number, yaw: number, mat: StandardMaterial) => {
    const b = MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.rotation.y = yaw;
    b.material = mat;
    b.receiveShadows = true;
    return b;
  };
  const cypresses = (x: number, z: number, n: number, k: number) => {
    for (let j = 0; j < n; j++) {
      const h = 4.5 + seeded(k * 5 + j, 91) * 2.5;
      const px = x + (j - (n - 1) / 2) * 1.5, pz = z + (seeded(k * 5 + j, 92) - 0.5) * 1.6;
      const cone = MeshBuilder.CreateCylinder("ancientSandboxCypressTree", { height: h, diameterTop: 0.1, diameterBottom: 1.3, tessellation: 7 }, scene);
      cone.position.set(px, h / 2 + 0.3, pz);
      cone.material = leaves;
      kept.push({ type: "cylinder", center: new Vector3(px, 0, pz), radius: 0.55 });
    }
  };
  // [x, z, yaw (house front faces the clearing), houses]
  const hamlets: Array<[number, number, number, number]> = [
    [-47, 4, -Math.PI / 2, 2], [47, -8, Math.PI / 2, 2], [41, 32, 0.9, 1], [-26, -42, Math.PI, 2], [22, -43, Math.PI, 1],
  ];
  hamlets.forEach(([hx, hz, yaw, count], k) => {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    for (let i = 0; i < count; i++) {
      const along = (i - (count - 1) / 2) * 7.5;
      const x = hx + c * along, z = hz - s * along;
      const w = 5 + seeded(k * 3 + i, 93) * 1.5, h = 3.6 + seeded(k * 3 + i, 94) * 1.4;
      box("ancientSandboxHouse", x, h / 2, z, w, h, 5.4, yaw, white);
      box("ancientSandboxHouseBand", x, h - 0.2, z, w + 0.2, 0.3, 5.6, yaw, blue);
      box("ancientSandboxHouseParapet", x, h + 0.15, z, w + 0.35, 0.3, 5.75, yaw, white);
      // Door and two shutters on the face toward the clearing (local -z).
      const fx = x + s * -2.72, fz = z + c * -2.72;
      box("ancientSandboxHouseDoor", fx, 1.05, fz, 1.1, 2.1, 0.12, yaw, blue);
      for (const off of [-1.7, 1.7]) box("ancientSandboxHouseShutter", fx + c * off, 2.3, fz - s * off, 0.8, 0.9, 0.12, yaw, blue);
      if (seeded(k * 3 + i, 95) > 0.4) {
        box("ancientSandboxHouseUpper", x + c * 1, h + 1.25, z - s * 1, 3, 2.2, 3, yaw, white);
        box("ancientSandboxHouseUpperBand", x + c * 1, h + 2.4, z - s * 1, 3.2, 0.25, 3.2, yaw, blue);
      }
      kept.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: w / 2 + 0.6 });
    }
    // Low wall with blue tile coping in front of the hamlet.
    const wx = hx + s * -5.2, wz = hz + c * -5.2, length = count * 7.5 + 3;
    box("ancientSandboxTileWall", wx, 0.55, wz, length, 1.1, 0.6, yaw, white);
    box("ancientSandboxTileCoping", wx, 1.2, wz, length + 0.2, 0.22, 0.95, yaw, blue);
    cypresses(hx + c * (length / 2 + 1.5), hz - s * (length / 2 + 1.5), 3, k);
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.3;
    const [rx, rz] = rimAt(a);
    if (rz > 30 && Math.abs(rx) < 36) continue;
    cypresses(rx * 0.86, rz * 0.86, 2 + (i % 3), 20 + i);
  }
  return kept;
}

// Outer cliff terraces (573, greek_ancient_sandbox.png: the island is very large and irregular, its edge stepping down in lower green
// shelves and jutting headlands, each with its own sheer terracotta face into the sea). Spec: eight lobes past the base rim, each a band of
// grass 8-22 m out from the rim over 26-60 degrees, shaped as a ragged bump (reach ~ sin^0.6 with +-15% facet jag per 4 degrees), its top
// at -2.5 to -7 m (two lobes carry a second, lower step further out), its outer face a sheer flat-shaded terracotta wall down into the sea at
// -11.5 m. Drawn only (past the rim, nothing walks there).
const SHELVES: Array<{ deg: number; span: number; reach: number; top: number }> = [
  { deg: 200, span: 48, reach: 16, top: -3 }, { deg: 205, span: 30, reach: 24, top: -6.5 },
  { deg: 245, span: 40, reach: 13, top: -4.5 }, { deg: 290, span: 26, reach: 10, top: -2.5 },
  { deg: 325, span: 52, reach: 18, top: -5 }, { deg: 340, span: 28, reach: 25, top: -7 },
  { deg: 20, span: 44, reach: 14, top: -3.5 }, { deg: 150, span: 60, reach: 12, top: -4 },
  { deg: 110, span: 34, reach: 9, top: -2.5 }, { deg: 60, span: 30, reach: 11, top: -5.5 },
];

function outerTerraces(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const grass = mk("ancientSandboxShelfGrass", new Color3(0.51, 0.66, 0.23), 0.18);
  const rock = mk("ancientSandboxShelfCliff", new Color3(0.72, 0.32, 0.17), 0.5);
  SHELVES.forEach(({ deg, span, reach, top }, n) => {
    const steps = Math.max(8, Math.round(span / 4));
    const inner: Vector3[] = [], outer: Vector3[] = [], foot: Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const a = ((deg - span / 2 + span * t) * Math.PI) / 180;
      const [rx, rz] = rimAt(a);
      const r = Math.hypot(rx, rz);
      const jag = i === 0 || i === steps ? 1 : 0.85 + seeded(n * 31 + i, 501) * 0.3;
      const out = r + 0.5 + reach * Math.sin(Math.PI * t) ** 0.6 * jag;
      inner.push(new Vector3((rx / r) * (r - 2), top, (rz / r) * (r - 2)));
      outer.push(new Vector3((rx / r) * out, top, (rz / r) * out));
      foot.push(new Vector3((rx / r) * (out + 0.8), SEA_Y - 0.5, (rz / r) * (out + 0.8)));
    }
    const lawn = MeshBuilder.CreateRibbon("ancientSandboxShelf", { pathArray: [inner, outer], sideOrientation: Mesh.DOUBLESIDE }, scene);
    lawn.convertToFlatShadedMesh();
    lawn.material = grass;
    lawn.receiveShadows = true;
    lawn.isPickable = false;
    const face = MeshBuilder.CreateRibbon("ancientSandboxShelfCliff", { pathArray: [outer, foot], sideOrientation: Mesh.DOUBLESIDE }, scene);
    face.convertToFlatShadedMesh();
    face.material = rock;
    face.applyFog = false;
    face.isPickable = false;
  });
}

// Offshore islets (573, card Overview: "a few smaller islands off in the distance"): five small terracotta rock islands standing out of the
// sea 75-150 m from the centre, each a tapered faceted drum 5-10 m across rising 4-9 m above the water, a grass cap on top and two to four
// dark cypress spires. Drawn only.
const ISLETS: Array<[number, number, number, number]> = [[-105, 70, 9, 7], [-150, 12, 6, 5], [118, 92, 7, 6], [152, 36, 10, 9], [78, 138, 5, 4]];

function offshoreIslets(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const rockMat = mk("ancientSandboxIsletRock", new Color3(0.72, 0.32, 0.17), 0.5);
  const grassMat = mk("ancientSandboxIsletGrass", new Color3(0.51, 0.66, 0.23), 0.2);
  const treeMat = mk("ancientSandboxIsletCypress", new Color3(0.07, 0.22, 0.08), 0.2);
  const rocks: Mesh[] = [], caps: Mesh[] = [], trees: Mesh[] = [];
  ISLETS.forEach(([x, z, wide, tall], k) => {
    const rock = MeshBuilder.CreateCylinder("ancientSandboxIslet", { diameterTop: wide * 0.8, diameterBottom: wide * 1.15, height: tall + 1, tessellation: 7 }, scene);
    rock.position.set(x, SEA_Y + (tall + 1) / 2 - 0.5, z);
    rock.rotation.y = seeded(k, 511) * Math.PI;
    rocks.push(rock);
    const cap = MeshBuilder.CreateCylinder("ancientSandboxIsletCap", { diameter: wide * 0.84, height: 0.5, tessellation: 7 }, scene);
    cap.position.set(x, SEA_Y + tall + 0.2, z);
    cap.rotation.y = rock.rotation.y;
    caps.push(cap);
    const n = 2 + Math.floor(seeded(k, 512) * 3);
    for (let i = 0; i < n; i++) {
      const a = seeded(k * 7 + i, 513) * Math.PI * 2, d = seeded(k * 7 + i, 514) * wide * 0.28;
      const h = 4 + seeded(k * 7 + i, 515) * 3;
      const tree = MeshBuilder.CreateCylinder("ancientSandboxIsletCypress", { diameterTop: 0, diameterBottom: 1.3, height: h, tessellation: 6 }, scene);
      tree.position.set(x + Math.cos(a) * d, SEA_Y + tall + 0.4 + h / 2, z + Math.sin(a) * d);
      trees.push(tree);
    }
  });
  for (const [list, mat, name] of [[rocks, rockMat, "ancientSandboxIslets"], [caps, grassMat, "ancientSandboxIsletCaps"], [trees, treeMat, "ancientSandboxIsletCypresses"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.applyFog = false;
    merged.isPickable = false;
  }
}

export function buildAncientSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  terracottaCliffs(scene, built);
  sea(scene);
  outerTerraces(scene);
  offshoreIslets(scene);
  const cleared = clearFieldDressing(scene, built, result, clearFieldJunk(scene, built, [...result.obstacles]));
  const lawn = new Color3(0.51, 0.66, 0.23);
  for (const name of ["groundMat", "grass", "dryGrass", "grassBladeDark", "grassBladeLight"]) {
    const mat = scene.getMaterialByName(name);
    if (!(mat instanceof StandardMaterial)) continue;
    mat.diffuseColor = lawn.scale(name === "grassBladeDark" ? 0.76 : 1);
    mat.emissiveColor = mat.diffuseColor.scale(0.13);
  }
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && /^fieldTufts/.test(mesh.name)) mesh.setEnabled(false);
  }
  const clay = new StandardMaterial("ancientSandboxClayPaths", scene);
  clay.diffuseColor = new Color3(0.57, 0.34, 0.23);
  clay.emissiveColor = clay.diffuseColor.scale(0.12);
  const trails = [
    [[-48, -8], [-42, 4], [-43, 15], [-36, 27], [-23, 31], [-8, 30]],
    [[46, -25], [40, -12], [43, 6], [37, 20], [27, 29], [12, 32], [-8, 30]],
  ];
  for (const trail of trails) {
    for (let i = 1; i < trail.length; i++) {
      const [x0, z0] = trail[i - 1], [x1, z1] = trail[i];
      const segment = MeshBuilder.CreateBox("ancientSandboxPath", {
        width: Math.hypot(x1 - x0, z1 - z0) + 1, height: 0.03, depth: 2.15,
      }, scene);
      segment.position.set((x0 + x1) / 2, 0.055 + i * 0.001, (z0 + z1) / 2);
      segment.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
      segment.material = clay;
      segment.receiveShadows = true;
      segment.isPickable = false;
    }
  }
  hillsideTerraces(scene, cleared.obstacles);
  ruins(scene, cleared.obstacles);
  spiralMountain(scene, cleared.obstacles);
  const obstacles = edgeVillage(scene, built, cleared.obstacles);
  return { ...result, obstacles, hazards: cleared.hazards };
}
