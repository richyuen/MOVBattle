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
import { Color3, Mesh, MeshBuilder, StandardMaterial, Vector3, VertexData, type Scene } from "@babylonjs/core";
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

function snowPines(scene: Scene, built: Set<unknown>, obstacles: MapBuildResult["obstacles"]): void {
  const needles = new StandardMaterial("vikingPineNeedles", scene);
  needles.diffuseColor = new Color3(0.075, 0.31, 0.33);
  needles.emissiveColor = needles.diffuseColor.scale(0.18);
  const snow = new StandardMaterial("vikingPineSnow", scene);
  snow.diffuseColor = new Color3(0.79, 0.86, 0.94);
  snow.emissiveColor = snow.diffuseColor.scale(0.21);
  const bark = new StandardMaterial("vikingPineBark", scene);
  bark.diffuseColor = new Color3(0.16, 0.15, 0.15);
  const feet: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh)) continue;
    if (/^(hazeTreeline|oakCrown|oakBole)/.test(mesh.name)) mesh.setEnabled(false);
    if (mesh.name !== "trunk" || mesh.parent || !mesh.isEnabled()) continue;
    feet.push(mesh.position.clone());
    mesh.setEnabled(false);
  }
  const roots = feet.map(({ x, z }) => new Vector3(x, 0, z));
  for (let i = 0; i < 40; i++) {
    const angle = 2 * Math.PI * (i + seeded(i, 49) * 0.7) / 40;
    const x = Math.cos(angle) * (47 + seeded(i, 78) * 3);
    const z = Math.sin(angle) * (41 + seeded(i, 83) * 3);
    if (inLake(x, z, 1) || roots.some((p) => Math.hypot(x - p.x, z - p.z) < 2.55)) continue;
    roots.push(new Vector3(x, 0, z));
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 0.37 });
  }
  for (const [i, root] of roots.entries()) {
    // Pines stand on the raised snowbank (bankHeight); none where the waterfall outcrop stands
    if (Math.abs(root.x - FALL.x) < 10.5 && root.z > 39.5) continue;
    const lift = bankHeight(root.x, root.z);
    const height = 4.8 + seeded(i, 101) * 4.2;
    const width = height * (0.46 + seeded(i, 109) * 0.12);
    const trunk = MeshBuilder.CreateCylinder("vikingPineTrunk", { height: height * 0.74, diameter: width * 0.14, tessellation: 6 }, scene);
    trunk.position.set(root.x, lift + height * 0.37, root.z);
    trunk.material = bark;
    for (let tier = 0; tier < 4; tier++) {
      const y = lift + height * (0.31 + tier * 0.155);
      const w = width * (1 - tier * 0.21);
      const h = height * 0.43;
      const options = { height: h, diameterBottom: w, diameterTop: 0.045, tessellation: 7 };
      const bough = MeshBuilder.CreateCylinder("vikingPineBough", options, scene);
      bough.position.set(root.x, y, root.z);
      bough.rotation.y = seeded(i * 4 + tier, 119) * Math.PI;
      bough.material = needles;
      const cap = MeshBuilder.CreateCylinder("vikingPineSnowTier", {
        ...options, height: h * 0.83, diameterBottom: w * 0.94,
      }, scene);
      cap.position.set(root.x, y + h * 0.105, root.z);
      cap.rotation.y = bough.rotation.y;
      cap.material = snow;
    }
  }
}

// Frozen ship (571, card Overview: "to the left, there is a pirate ship that is frozen in ice"): a wooden
// ship locked into the lake by the left shore, listing a little, its hull sunk to the waterline in heaped
// pale ice, snow on its deck, one mast with a yard and a torn pale sail. Spec: hull 22 m long, 6.4 m beam,
// 3.4 m from the ice to the rail, bow and stern rising 1.6 m; centred (-39, 13) with its length along z
// (yaw 0.18); mast 13 m. One box collider over the hull.
const SHIP = { x: -39, z: 13, yaw: 0.18, length: 22, beam: 6.4 };
function frozenShip(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const wood = new StandardMaterial("vikingShipWood", scene);
  wood.diffuseColor = new Color3(0.36, 0.2, 0.11);
  wood.emissiveColor = wood.diffuseColor.scale(0.25);
  wood.backFaceCulling = false;
  const snow = new StandardMaterial("vikingShipSnow", scene);
  snow.diffuseColor = SNOW.clone();
  snow.emissiveColor = SNOW_SHADE.clone();
  const iceMat = new StandardMaterial("vikingShipIce", scene);
  iceMat.diffuseColor = new Color3(0.62, 0.84, 0.95);
  iceMat.emissiveColor = iceMat.diffuseColor.scale(0.35);
  const sailMat = new StandardMaterial("vikingShipSail", scene);
  sailMat.diffuseColor = new Color3(0.84, 0.8, 0.7);
  sailMat.emissiveColor = sailMat.diffuseColor.scale(0.25);
  sailMat.backFaceCulling = false;
  const root = new Mesh("vikingShip", scene);
  root.position.set(SHIP.x, 0, SHIP.z);
  root.rotation.set(0, SHIP.yaw, 0.1);
  const sections: Vector3[][] = [];
  for (let s = 0; s <= 16; s++) {
    const t = s / 16;
    const z = (t - 0.5) * SHIP.length;
    const w = (SHIP.beam / 2) * Math.sin(Math.PI * Math.min(0.999, Math.max(0.001, t))) ** 0.55;
    const sheer = 1.6 * (2 * t - 1) ** 4;
    const path: Vector3[] = [];
    for (let k = 0; k <= 8; k++) {
      const theta = Math.PI + (Math.PI * k) / 8;
      path.push(new Vector3(w * Math.cos(theta), 2.6 + sheer + 4 * Math.sin(theta) * (0.4 + 0.6 * Math.sin(Math.PI * t)), z));
    }
    sections.push(path);
  }
  const hull = MeshBuilder.CreateRibbon("vikingShipHull", { pathArray: sections, sideOrientation: Mesh.DOUBLESIDE }, scene);
  hull.parent = root;
  hull.material = wood;
  hull.convertToFlatShadedMesh();
  for (const side of [-1, 1]) {
    const rail = MeshBuilder.CreateBox("vikingShipRail", { width: 0.28, height: 0.3, depth: SHIP.length * 0.78 }, scene);
    rail.parent = root;
    rail.position.set(side * SHIP.beam * 0.49, 2.75, 0);
    rail.material = wood;
  }
  const deck = MeshBuilder.CreateBox("vikingShipDeckSnow", { width: SHIP.beam * 0.86, height: 0.3, depth: SHIP.length * 0.74 }, scene);
  deck.parent = root;
  deck.position.y = 2.2;
  deck.material = snow;
  const mast = MeshBuilder.CreateCylinder("vikingShipMast", { height: 13, diameter: 0.45, tessellation: 8 }, scene);
  mast.parent = root;
  mast.position.set(0, 2.2 + 6.5, -1);
  mast.material = wood;
  const yard = MeshBuilder.CreateCylinder("vikingShipYard", { height: 8, diameter: 0.28, tessellation: 6 }, scene);
  yard.parent = root;
  yard.rotation.z = Math.PI / 2 + 0.12;
  yard.position.set(0, 13.2, -1);
  yard.material = wood;
  const sail = MeshBuilder.CreateBox("vikingShipSail", { width: 7, height: 5.2, depth: 0.08 }, scene);
  sail.parent = root;
  sail.position.set(0.2, 10.4, -0.85);
  sail.rotation.set(0.12, 0, 0.12);
  sail.material = sailMat;
  for (const [z, h] of [[-SHIP.length / 2 - 0.4, 4.6], [SHIP.length / 2 + 0.4, 4.2]]) {
    const post = MeshBuilder.CreateCylinder("vikingShipStem", { height: h, diameterTop: 0.25, diameterBottom: 0.6, tessellation: 6 }, scene);
    post.parent = root;
    post.position.set(0, 3.2 + h / 3, z);
    post.rotation.x = z < 0 ? -0.35 : 0.35;
    post.material = wood;
  }
  // The ice collar the hull is locked in.
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const lump = MeshBuilder.CreateIcoSphere("vikingShipIce", { radius: 1.3 + seeded(i, 141) * 1.1, subdivisions: 1, flat: true }, scene);
    lump.parent = root;
    lump.position.set(Math.cos(a) * (SHIP.beam / 2 + 0.6), 0.25, Math.sin(a) * (SHIP.length / 2 + 0.4));
    lump.scaling.y = 0.45 + seeded(i, 142) * 0.3;
    lump.material = iceMat;
  }
  obstacles.push({ type: "box", center: new Vector3(SHIP.x, 0, SHIP.z), halfX: SHIP.beam / 2 + 1.6, halfZ: SHIP.length / 2 + 1 });
}

// Winter haze (572, wiki shot viking.png): the sky is a pale cyan-white blizzard, not the base's warm beige; the far
// pines fade into a thick pale cyan fog and big flakes hang in the air over the whole field. Spec: clear colour
// (0.58,0.86,0.91), fog (0.7,0.9,0.93), two drawn mist walls, base clouds hidden; 320 unlit white flakes (0.07-0.17 m,
// stretched 2x along the wind) seeded over 130 x 110 m from 0.8 to 26 m up. Returns the restore for dispose.
function winterHaze(scene: Scene, built: Set<unknown>): () => void {
  const oldClear = scene.clearColor.clone();
  const oldFog = scene.fogColor.clone();
  const oldDensity = scene.fogDensity;
  scene.clearColor.set(0.58, 0.86, 0.91, 1);
  scene.fogColor = new Color3(0.7, 0.9, 0.93);
  scene.fogDensity = 0.016;
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name === "cloud") mesh.setEnabled(false);
  }
  const flakes: Mesh[] = [];
  for (let i = 0; i < 320; i++) {
    const flake = MeshBuilder.CreateIcoSphere("vikingFlake", { radius: 0.07 + seeded(i, 310) * 0.1, subdivisions: 1 }, scene);
    flake.position.set((seeded(i, 311) - 0.5) * 130, 0.8 + seeded(i, 312) * 25, (seeded(i, 313) - 0.5) * 110);
    flake.scaling.set(2, 0.6, 1);
    flake.rotation.y = 0.4;
    flakes.push(flake);
  }
  const flurry = Mesh.MergeMeshes(flakes, true);
  if (flurry) {
    const mat = new StandardMaterial("vikingFlurry", scene);
    mat.disableLighting = true;
    mat.emissiveColor = new Color3(0.96, 0.99, 1);
    flurry.material = mat;
    flurry.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(flurry);
  }
  // The scene fog is linear and re-keyed every frame by main.ts, so the blizzard haze is drawn: two inside-facing
  // translucent mist walls (radii 46 and 53, on the island's 54 x 48 ellipse) veil the far pines toward the sky.
  for (const [r, alpha] of [[46, 0.22], [53, 0.4]] as const) {
    const wall = MeshBuilder.CreateCylinder("vikingMistWall", { diameter: r * 2, height: 24, tessellation: 48, cap: Mesh.NO_CAP, sideOrientation: Mesh.BACKSIDE }, scene);
    wall.scaling.z = 48 / 54;
    wall.position.y = 10;
    const mat = new StandardMaterial("vikingMist", scene);
    mat.disableLighting = true;
    mat.emissiveColor = new Color3(0.72, 0.9, 0.93);
    mat.alpha = alpha;
    mat.backFaceCulling = true;
    wall.material = mat;
    wall.isPickable = false;
    wall.applyFog = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(wall);
  }
  return () => {
    scene.clearColor.copyFrom(oldClear);
    scene.fogColor.copyFrom(oldFog);
    scene.fogDensity = oldDensity;
  };
}

// Icy underside (573, reference/maps/winter_viking.png: under the snow the island is a rounded white-blue ice
// bowl, no dark rock or stalactites). Spec: the base's islandUnder/islandShelf/islandCliff go; a faceted bowl
// follows the island rim (superellipse 54 x 48, power 3) down to a rounded point 26 m below (scale 1, 1, .97,
// .9, .78, .6, .36, .08 at 0, -2, -6, -11, -16, -20, -23, -26 m), each ring's vertices pushed in and out by up
// to 1.6 m for low-poly facets; pale ice (0.6,0.8,0.92) self-lit 0.55, under a 2 m snow band at the top.
const UNDER: Array<[number, number]> = [[1, 0], [1, -2], [0.97, -6], [0.9, -11], [0.78, -16], [0.6, -20], [0.36, -23], [0.08, -26]];
const rimR = (a: number) => (Math.abs(Math.cos(a) / 54) ** 3 + Math.abs(Math.sin(a) / 48) ** 3) ** (-1 / 3);

function icyUnderside(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.12, 0.14, 0.16);
    return m;
  };
  const ice = mk("vikingUnderIce", new Color3(0.6, 0.8, 0.92), 0.55);
  const snow = mk("vikingUnderSnow", SNOW, 0.5);
  const N = 40;
  const rings = UNDER.map(([s, y], j) => {
    const ring: Vector3[] = [];
    for (let i = 0; i <= N; i++) {
      const a = ((i % N) / N) * Math.PI * 2;
      const jag = j === 0 || j === 1 ? 0 : (seeded((i % N) + j * 53, 401) - 0.5) * 3.2;
      const r = rimR(a) * s + jag;
      ring.push(new Vector3(Math.cos(a) * r, y + (j > 1 ? (seeded((i % N) + j * 53, 402) - 0.5) * 1.2 : 0), Math.sin(a) * r));
    }
    return ring;
  });
  for (const [name, paths, mat] of [["vikingUnderSnow", rings.slice(0, 2), snow], ["vikingUnderIce", rings.slice(1), ice]] as const) {
    const mesh = MeshBuilder.CreateRibbon(name, { pathArray: paths, sideOrientation: Mesh.DOUBLESIDE }, scene);
    mesh.convertToFlatShadedMesh();
    mesh.material = mat;
    mesh.isPickable = false;
    mesh.applyFog = false;
  }
}

// Frozen waterfall (573, card Overview: "a frozen waterfall around the top area of the map"): at the back of the
// lake (+z, the top of the top shot) a craggy outcrop of snow-capped grey-blue rock 12-14 m high stands on the bank
// among the pines, and a broad cascade of pale ice pours from a notch near its top down four steps into a frozen
// plunge pool on the lake edge, hung with icicles. Spec: outcrop of 8 faceted rocks over x -9..9, z 41..47 on the
// bank (lifted by bankHeight); cascade 6-8 m wide in four tilted slabs from 12 m down to the pool at (0, 35), pool
// 13 x 8 m. One box collider over the outcrop (no stage army stands past z 18).
const FALL = { x: 0, z: 44, pool: 35 };
function frozenWaterfall(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = new Color3(0.2, 0.22, 0.25);
    return m;
  };
  const rockMat = mk("vikingFallRock", new Color3(0.3, 0.36, 0.44), 0.2);
  const capMat = mk("vikingFallSnow", SNOW, 0.35);
  const iceMat = mk("vikingFallIce", new Color3(0.62, 0.9, 0.98), 0.5);
  const lift = bankHeight(FALL.x, FALL.z);
  const rocks: Mesh[] = [], caps: Mesh[] = [], ice: Mesh[] = [];
  const crag: Array<[number, number, number, number]> = [
    [-6.5, 45, 4.2, 9], [-3, 46.2, 4, 13], [3.2, 46, 4.2, 12.5], [6.8, 44.8, 4, 8.5], [-8.6, 42.6, 3, 5], [8.8, 42.4, 3.2, 5.5], [-4.6, 42.6, 3, 6.5], [4.8, 42.4, 3, 6],
  ];
  crag.forEach(([x, z, w, h], k) => {
    const rock = MeshBuilder.CreatePolyhedron("vikingFallRock", { type: 2, sizeX: w * 0.6, sizeY: h * 0.55, sizeZ: w * 0.55 }, scene);
    rock.position.set(x, lift + h * 0.45, z);
    rock.rotation.set((seeded(k, 411) - 0.5) * 0.3, seeded(k, 412) * Math.PI, (seeded(k, 413) - 0.5) * 0.3);
    rocks.push(rock);
    const cap = MeshBuilder.CreatePolyhedron("vikingFallSnow", { type: 2, sizeX: w * 0.55, sizeY: h * 0.13, sizeZ: w * 0.5 }, scene);
    cap.position.set(x, lift + h * 0.45 + h * 0.43, z);
    cap.rotation.copyFrom(rock.rotation);
    caps.push(cap);
  });
  // Cascade: four tilted slabs stepping from the notch (12 m) to the pool, each wider than the one above
  const steps: Array<[number, number, number, number]> = [[12, 43.4, 9.5, 5.6], [9.5, 41.6, 6.6, 6.4], [6.6, 39.6, 3.6, 7.2], [3.6, 37.4, 0.4, 8]];
  steps.forEach(([top, zFrom, bottom, wide], k) => {
    const yTop = lift + top, yBot = k === steps.length - 1 ? bottom : lift + bottom;
    const zTo = k === steps.length - 1 ? FALL.pool + 2 : steps[k + 1][1];
    const len = Math.hypot(yTop - yBot, zFrom - zTo);
    const slab = MeshBuilder.CreateBox("vikingFallIce", { width: wide, height: 0.9, depth: len }, scene);
    slab.position.set(FALL.x, (yTop + yBot) / 2, (zFrom + zTo) / 2);
    slab.rotation.x = -Math.atan2(yTop - yBot, zFrom - zTo);
    ice.push(slab);
    for (let i = 0; i < 5; i++) {
      const long = 1.2 + seeded(k * 5 + i, 414) * 2.2;
      const icicle = MeshBuilder.CreateCylinder("vikingFallIce", { diameterTop: 0.55, diameterBottom: 0.04, height: long, tessellation: 5 }, scene);
      icicle.position.set(FALL.x - wide / 2 + 0.6 + i * ((wide - 1.2) / 4), yBot - long / 2 + 0.3, zTo + 0.4);
      ice.push(icicle);
    }
  });
  const pool = MeshBuilder.CreateCylinder("vikingFallIce", { diameter: 13, height: 0.3, tessellation: 9 }, scene);
  pool.scaling.z = 8 / 13;
  pool.position.set(FALL.x, 0.12, FALL.pool);
  ice.push(pool);
  for (const [list, mat, name] of [[rocks, rockMat, "vikingFallRocks"], [caps, capMat, "vikingFallSnow"], [ice, iceMat, "vikingFallIce"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  obstacles.push({ type: "box", center: new Vector3(FALL.x, 0, 44.5), halfX: 9.5, halfZ: 3 });
}

// Raised snowbanks (573, reference/stages/introduction.ice_archers_only_almost.png: the lake sits in a hollow, its
// shores rising as white snowbanks that carry the pine forest). Spec: the ground rises from the lake edge + 1 m to
// 2.4 m over 5 m (smoothstep) and stays up to the rim, dropping back near the frozen ship (fade 13-19 m from it) so
// the hull stays seated; drawn as one faceted snow sheet over the bank (12 radial rings x 96 around), its outer edge
// skirted down to the island top; the pines and the waterfall stand on it, and units are lifted by it (height).
const BANK = { top: 2.4, inner: 1, ramp: 5 };
function bankHeight(x: number, z: number): number {
  const t = Math.min(1, Math.max(0, (Math.hypot(x, z) - lakeR(Math.atan2(z, x)) - BANK.inner) / BANK.ramp));
  const fade = Math.min(1, Math.max(0, (Math.hypot(x - SHIP.x, z - SHIP.z) - 13) / 6));
  return BANK.top * t * t * (3 - 2 * t) * fade;
}

function snowbankSheet(scene: Scene): void {
  const mat = new StandardMaterial("vikingBank", scene);
  mat.diffuseColor = SNOW.clone();
  mat.emissiveColor = SNOW_SHADE.clone();
  mat.specularColor = new Color3(0.05, 0.05, 0.06);
  const N = 96, R = 12;
  const paths: Vector3[][] = [];
  for (let j = 0; j <= R; j++) {
    const path: Vector3[] = [];
    for (let i = 0; i <= N; i++) {
      const a = ((i % N) / N) * Math.PI * 2;
      const from = lakeR(a) + 0.3, to = rimR(a) - 0.2;
      const r = from + (to - from) * (j / R) ** 1.3;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      path.push(new Vector3(x, bankHeight(x, z) + 0.03, z));
    }
    paths.push(path);
  }
  paths.push(paths[R].map((p) => new Vector3(p.x * 1.004, -0.2, p.z * 1.004)));
  const sheet = MeshBuilder.CreateRibbon("vikingBank", { pathArray: paths, sideOrientation: Mesh.DOUBLESIDE }, scene);
  sheet.convertToFlatShadedMesh();
  sheet.material = mat;
  sheet.receiveShadows = true;
  sheet.isPickable = false;
}

// Bank face and shore rocks (574, wiki viking.png and ice_archers_only_almost.png: from above, the lake's raised shore
// reads by its shaded blue-grey slope and a broken line of grey rocks with snow caps at its foot). Spec: a faceted sheet
// over the ramp (lake edge + 0.3 m to + 6.5 m, 7 rings x 96 around) lying 4 cm over the bank, vertex-coloured from
// white to a shaded blue-grey (0.36, 0.45, 0.6) by the ramp's steepness (darkest mid-slope, white where the bank fades
// by the ship); 44 grey boulders (0.42, 0.44, 0.48), 1-2.3 m, flattened and faceted, each with a white snow cap, along
// the shore at lake edge + 1.6 m seated on the bank height, none within 20 m of the ship or 10 m of the waterfall; a
// 0.4x-size collider each (all outside the lake, clear of the stage armies at x 29..40, |z| <= 18).
function bankFace(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const shade = new Color3(0.36, 0.45, 0.6);
  const N = 96, R = 7;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  for (let j = 0; j <= R; j++) {
    for (let i = 0; i <= N; i++) {
      const a = ((i % N) / N) * Math.PI * 2;
      const r = lakeR(a) + 0.3 + (j / R) * 6.2;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const t = Math.min(1, Math.max(0, (r - lakeR(a) - BANK.inner) / BANK.ramp));
      const fade = Math.min(1, Math.max(0, (Math.hypot(x - SHIP.x, z - SHIP.z) - 13) / 6));
      const k = Math.min(1, 6 * t * (1 - t) * fade * 0.85 + (t > 0 && t < 0.15 ? 0.2 * fade : 0));
      const c = Color3.Lerp(SNOW, shade, k);
      pos.push(x, bankHeight(x, z) + 0.07, z);
      col.push(c.r, c.g, c.b, 1);
      if (j < R && i < N) {
        const p = j * (N + 1) + i, q = p + N + 1;
        idx.push(p, p + 1, q, p + 1, q + 1, q);
      }
    }
  }
  const sheet = new Mesh("vikingBankFace", scene);
  const data = new VertexData();
  data.positions = pos;
  data.indices = idx;
  data.colors = col;
  const nrm: number[] = [];
  VertexData.ComputeNormals(pos, idx, nrm);
  data.normals = nrm;
  data.applyToMesh(sheet);
  sheet.convertToFlatShadedMesh();
  const mat = new StandardMaterial("vikingBankFace", scene);
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = SNOW_SHADE.scale(0.8);
  mat.specularColor = new Color3(0.05, 0.05, 0.06);
  mat.backFaceCulling = false;
  sheet.material = mat;
  sheet.receiveShadows = true;
  sheet.isPickable = false;
  const rockMat = new StandardMaterial("vikingShoreRock", scene);
  rockMat.diffuseColor = new Color3(0.42, 0.44, 0.48);
  rockMat.emissiveColor = new Color3(0.1, 0.11, 0.13);
  rockMat.specularColor = Color3.Black();
  const capMat = new StandardMaterial("vikingShoreRockSnow", scene);
  capMat.diffuseColor = SNOW.clone();
  capMat.emissiveColor = SNOW_SHADE.clone();
  capMat.specularColor = Color3.Black();
  const rocks: Mesh[] = [], caps: Mesh[] = [];
  for (let n = 0; n < 44; n++) {
    const a = ((n + seeded(n, 81) * 0.6) / 44) * Math.PI * 2;
    const r = lakeR(a) + 1.6 + seeded(n, 82) * 0.8;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (Math.hypot(x - SHIP.x, z - SHIP.z) < 20 || Math.hypot(x - FALL.x, z - 44) < 10) continue;
    const s = 1 + seeded(n, 83) * 1.3;
    const y = bankHeight(x, z);
    const rock = MeshBuilder.CreateIcoSphere("vikingShoreRock", { radius: s / 2, subdivisions: 1, flat: true }, scene);
    rock.scaling.set(1.2, 0.7, 1);
    rock.rotation.y = seeded(n, 84) * Math.PI;
    rock.position.set(x, y + s * 0.18, z);
    rocks.push(rock);
    const cap = MeshBuilder.CreateIcoSphere("vikingShoreRockSnow", { radius: s * 0.42, subdivisions: 1, flat: true }, scene);
    cap.scaling.set(1.2, 0.35, 1);
    cap.rotation.y = rock.rotation.y;
    cap.position.set(x, y + s * 0.42, z);
    caps.push(cap);
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: s * 0.4 });
  }
  for (const [list, m, name] of [[rocks, rockMat, "vikingShoreRocks"], [caps, capMat, "vikingShoreRockSnow"]] as const) {
    const merged = Mesh.MergeMeshes([...list], true);
    if (!merged) continue;
    merged.name = name;
    merged.material = m;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

export function buildViking(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const debris = new Set(["wallStone", "boulder", "hayBale", "hill", "stump", "campaign_hazard_box_pit"]);
  const removed: Vector3[] = [];
  for (const mesh of scene.meshes) {
    if (!built.has(mesh) || !(debris.has(mesh.name) || mesh.name.startsWith("Challenge Bluffs_"))) continue;
    if (mesh.name !== "campaign_hazard_box_pit") removed.push(mesh.position.clone());
    mesh.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter(({ center }) => !removed.some((p) =>
    (p.x / 54) ** 2 + (p.z / 48) ** 2 < 0.8 ** 2 && Math.hypot(center.x - p.x, center.z - p.z) < 3.4));
  result.hazards = result.hazards.filter((hazard) => hazard.kind !== "pit");
  snowBanks(scene, built);
  snowPines(scene, built, result.obstacles);
  frozenLake(scene);
  frozenShip(scene, result.obstacles);
  snowbankSheet(scene);
  bankFace(scene, result.obstacles);
  icyUnderside(scene, built);
  frozenWaterfall(scene, result.obstacles);
  const restoreSky = winterHaze(scene, built);
  return { ...result, height: bankHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
