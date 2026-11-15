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

/**
 * Open sky (autumn_tribal_1.png): the island floats alone in a teal sky with only clouds round it; the base's far ridge range and the
 * floating rock roots under it (meshes mountainBase/Cap/Root) go, the clouds stay.
 */
function openSky(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  }
}

/**
 * Island underside (autumn_tribal_1.png): under the field the island is three stacked rounded tiers of orange earth, each narrower than the
 * one above with a deep crease between them, sparse white blocky stones set in their faces; the base's navy islandUnder/islandShelf/
 * islandCliff (the black spikes) go. Spec: the tiers follow the island outline (superellipse 54 x 48, power 3) at 1.0, 0.88 and 0.66 of
 * it; the tiers 16, 13 and 10 m tall (the reference's tiers stand about 0.19, 0.13 and 0.1 of the island's width), each side bulging 3%
 * at mid height and rounding in to 88% at its foot so the creases read; total depth about 41 m, the last tier closing in a rounded foot;
 * about 70 white boxes 1.2-2.4 m, flat against the faces, none in a crease.
 */
const TIERS = [{ s: 1, top: -0.02, h: 16 }, { s: 0.86, top: -16.6, h: 13 }, { s: 0.66, top: -30.2, h: 10 }];

function tierProfile(s: number, top: number, h: number, last: boolean): Array<[number, number]> {
  const p: Array<[number, number]> = [[s * (top > -0.1 ? 1 : 0.95), top], [s * 1.01, top - h * 0.2], [s * 1.03, top - h * 0.5], [s * 0.99, top - h * 0.8], [s * 0.88, top - h]];
  if (last) p.push([s * 0.6, top - h - 1.5], [s * 0.15, top - h - 2.2]);
  return p;
}

function earthTiers(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && ["islandUnder", "islandShelf", "islandCliff"].includes(mesh.name)) mesh.setEnabled(false);
  }
  const mk = (name: string, c: Color3, glow: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(glow);
    m.specularColor = Color3.Black();
    return m;
  };
  const earth = mk("tribal1UnderEarth", new Color3(0.88, 0.5, 0.2), 0.32);
  const fleck = mk("tribal1UnderFleck", new Color3(0.95, 0.93, 0.88), 0.5);
  const bands: Mesh[] = [];
  TIERS.forEach(({ s, top, h }, t) => {
    const prof = tierProfile(s, top, h, t === TIERS.length - 1);
    for (let i = 0; i < prof.length - 1; i++) {
      const [s0, y0] = prof[i], [s1, y1] = prof[i + 1];
      const band = MeshBuilder.CreateCylinder("tribal1Tier", { diameterTop: s0, diameterBottom: s1, height: y0 - y1, tessellation: 72 }, scene);
      const pos = band.getVerticesData("position")!;
      for (let v = 0; v < pos.length; v += 3) {
        const reach = Math.hypot(pos[v], pos[v + 2]) * 2;
        const [x, z] = rim((Math.atan2(pos[v + 2], pos[v]) * 180) / Math.PI);
        pos[v] = x * reach;
        pos[v + 2] = z * reach;
      }
      band.setVerticesData("position", pos);
      band.position.y = (y0 + y1) / 2;
      bands.push(band);
    }
  });
  const tiers = Mesh.MergeMeshes(bands, true);
  if (tiers) {
    tiers.name = "tribal1Tiers";
    tiers.material = earth;
    tiers.isPickable = false;
  }
  // White stones on the tier faces, at mid height where the face stands out furthest
  const flecks: Mesh[] = [];
  for (let k = 0; k < 70; k++) {
    const { s, top, h } = TIERS[k % TIERS.length];
    const deg = seeded(k, 31) * 360;
    const y = top - h * 0.3 - seeded(k, 32) * h * 0.4;
    const [ox, oz] = rim(deg);
    const w = 1.2 + seeded(k, 33) * 1.2;
    const box = MeshBuilder.CreateBox("tribal1Fleck", { width: w, height: w * (0.6 + seeded(k, 34) * 0.3), depth: 0.5 }, scene);
    box.rotation.set(0, Math.PI / 2 - (deg * Math.PI) / 180, (seeded(k, 35) - 0.5) * 0.4);
    box.position.set(ox * s * 1.025, y, oz * s * 1.025);
    flecks.push(box);
  }
  const set = Mesh.MergeMeshes(flecks, true);
  if (set) {
    set.name = "tribal1Flecks";
    set.material = fleck;
    set.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(set);
  }
}

/**
 * The campfire (card Overview, wiki shot right edge): on the far right of the field, just inside the ring, a ring of grey stones round
 * crossed logs with a tall orange-yellow flame, a dream-catcher post (a tall pole with a hoop, a web cross and hanging feathers) beside it
 * and a sitting stone dog facing the fire, two log benches. Spec: fire at 22 degrees on the ring, 9 m in from the field edge ((38, 12));
 * stone ring 3.6 m across, flame 2.6 m tall (self-lit), post 5.5 m with a 1.8 m hoop 3 m to the back, dog 2.2 m tall 3.5 m to the front.
 * One collider round the fire, one on the post, one on the dog.
 */
const FIRE = { x: 38, z: 12 };

function campfire(scene: Scene): Obstacle[] {
  const mk = (name: string, c: Color3, self: number, unlit = false) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = unlit ? Color3.Black() : c;
    m.emissiveColor = unlit ? c : c.scale(self);
    m.specularColor = Color3.Black();
    if (unlit) m.disableLighting = true;
    return m;
  };
  const stone = mk("tribal1FireStone", new Color3(0.5, 0.45, 0.41), 0.1);
  const wood = mk("tribal1FireLog", new Color3(0.2, 0.11, 0.055), 0.15);
  const flameOut = mk("tribal1Flame", new Color3(1.2, 0.42, 0.02), 0, true);
  const flameIn = mk("tribal1FlameCore", new Color3(1.2, 0.95, 0.25), 0, true);
  const hoopMat = mk("tribal1Hoop", new Color3(0.55, 0.33, 0.14), 0.2);
  const feather = mk("tribal1Feather", new Color3(0.92, 0.9, 0.85), 0.4);
  const { x, z } = FIRE;
  const stones: Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const t = (i / 9) * Math.PI * 2;
    const s = MeshBuilder.CreateIcoSphere("tribal1FireStone", { radius: 0.45 + seeded(i, 41) * 0.2, subdivisions: 1 }, scene);
    s.scaling.y = 0.7;
    s.position.set(x + Math.cos(t) * 1.8, 0.25, z + Math.sin(t) * 1.8);
    stones.push(s);
  }
  // The dog: haunches, upright chest, head with snout and ears, on a low plinth, sitting 3.5 m in front of the fire looking at it
  const dx = x - 1.5, dz = z - 3.5;
  const dogParts: Array<[number, number, number, number, number, number]> = [
    [0, 0.2, 0, 1.6, 0.4, 1.8], [0, 0.85, 0.35, 1.1, 0.9, 1.2], [0, 1.45, -0.05, 0.9, 1.3, 0.8],
    [0, 2.2, -0.15, 0.85, 0.75, 0.85], [0, 2.05, -0.7, 0.45, 0.4, 0.55], [-0.28, 2.7, -0.05, 0.22, 0.45, 0.2], [0.28, 2.7, -0.05, 0.22, 0.45, 0.2],
  ];
  const dog = dogParts.map(([ox, oy, oz, w, h, d]) => {
    const b = MeshBuilder.CreateBox("tribal1Dog", { width: w, height: h, depth: d }, scene);
    b.position.set(ox, oy, oz);
    return b;
  });
  const dogMesh = Mesh.MergeMeshes(dog, true)!;
  dogMesh.rotation.y = Math.atan2(x - dx, z - dz) + Math.PI;
  dogMesh.position.set(dx, 0, dz);
  dogMesh.scaling.setAll(1.1);
  dogMesh.bakeCurrentTransformIntoVertices();
  stones.push(dogMesh);
  const ring = Mesh.MergeMeshes(stones, true)!;
  ring.name = "tribal1FireStones";
  ring.convertToFlatShadedMesh();
  ring.material = stone;
  // Crossed logs and two benches
  const logs: Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const l = MeshBuilder.CreateCylinder("tribal1FireLog", { diameter: 0.35, height: 2.6, tessellation: 6 }, scene);
    l.rotation.set(Math.PI / 2 - 0.35, (i / 3) * Math.PI, 0);
    l.position.set(x, 0.45, z);
    logs.push(l);
  }
  for (const [bx, bz, ry] of [[x + 3.6, z + 0.5, 0.2], [x, z + 3.6, 1.6]]) {
    const b = MeshBuilder.CreateCylinder("tribal1Bench", { diameter: 0.6, height: 2.8, tessellation: 7 }, scene);
    b.rotation.set(0, ry, Math.PI / 2);
    b.position.set(bx, 0.3, bz);
    logs.push(b);
  }
  // The dream-catcher post with its hoop facing the field
  const px = x + 2.4, pz = z + 3.2;
  const pole = MeshBuilder.CreateCylinder("tribal1Post", { diameterTop: 0.22, diameterBottom: 0.32, height: 5.5, tessellation: 6 }, scene);
  pole.position.set(px, 2.75, pz);
  logs.push(pole);
  const logMesh = Mesh.MergeMeshes(logs, true)!;
  logMesh.name = "tribal1FireLogs";
  logMesh.material = wood;
  const hoopParts: Mesh[] = [MeshBuilder.CreateTorus("tribal1Hoop", { diameter: 1.8, thickness: 0.14, tessellation: 18 }, scene)];
  for (const r of [0, Math.PI / 3, -Math.PI / 3]) {
    const s = MeshBuilder.CreateBox("tribal1Web", { width: 1.75, height: 0.05, depth: 0.05 }, scene);
    s.rotation.y = r;
    hoopParts.push(s);
  }
  const hoop = Mesh.MergeMeshes(hoopParts, true)!;
  hoop.name = "tribal1Hoop";
  hoop.material = hoopMat;
  hoop.rotation.set(Math.PI / 2, Math.atan2(-px, -pz), 0);
  hoop.position.set(px, 4.6, pz);
  const feathers: Mesh[] = [];
  for (const ox of [-0.6, 0, 0.6]) {
    const f = MeshBuilder.CreateCylinder("tribal1Feather", { diameterTop: 0.05, diameterBottom: 0.3, height: 0.9, tessellation: 4 }, scene);
    f.rotation.set(Math.PI, Math.atan2(-px, -pz), 0);
    f.position.set(px + ox * Math.cos(Math.atan2(-px, -pz)), 3.3, pz - ox * Math.sin(Math.atan2(-px, -pz)));
    feathers.push(f);
  }
  const fMesh = Mesh.MergeMeshes(feathers, true)!;
  fMesh.name = "tribal1Feathers";
  fMesh.material = feather;
  // The flame: an outer orange cone and a yellow core, out of fog
  const outer = MeshBuilder.CreateCylinder("tribal1Flame", { diameterTop: 0, diameterBottom: 1.9, height: 2.6, tessellation: 7 }, scene);
  outer.position.set(x, 1.4, z);
  outer.material = flameOut;
  const core = MeshBuilder.CreateCylinder("tribal1FlameCore", { diameterTop: 0, diameterBottom: 1.1, height: 1.7, tessellation: 6 }, scene);
  core.position.set(x + 0.15, 1.1, z - 0.2);
  core.material = flameIn;
  for (const m of [ring, logMesh, hoop, fMesh, outer, core]) {
    m.isPickable = false;
    m.applyFog = false;
  }
  scene.getGlowLayerByName("glow")?.addExcludedMesh(ring);
  return [
    { type: "cylinder", center: new Vector3(x, 0, z), radius: 2.2 },
    { type: "cylinder", center: new Vector3(px, 0, pz), radius: 0.5 },
    { type: "cylinder", center: new Vector3(dx, 0, dz), radius: 1.1 },
  ];
}

/**
 * The ridges (card Overview "short hills on the far back and far front, stretching left to right"; autumn_tribal_1.png front edge):
 * raised benches of orange earth running along the rim across the back and the front, with a grey rock face toward the field and the ring
 * trees standing on top. Spec: back arc 35-145 degrees, front arc -165 to -15; each bench 3.6 m high and 13 m deep from the rim, its inner
 * edge wandering +-1.5 m, tapering to nothing over the last 12 degrees of each end; a rock block every 4 degrees along the inner face,
 * 0.5-2.5 m above the top; every tree, crown and haze crown standing on a bench is lifted onto it. The base's four flat corner mounds
 * ("hill") and their colliders go. Colliders every 5 degrees on the inner face where the bench stands over half its height.
 */
const RIDGES: Array<[number, number]> = [[35, 145], [-165, -15]];
const RIDGE = { h: 3.6, depth: 13, taper: 12 };

function ridgeAt(deg: number): number {
  for (const [from, to] of RIDGES) {
    if (deg < from || deg > to) continue;
    const e = Math.min(deg - from, to - deg) / RIDGE.taper;
    return e >= 1 ? 1 : e * e * (3 - 2 * e);
  }
  return 0;
}

function ridgeInner(deg: number, f: number): number {
  const [rx, rz] = rim(deg);
  return Math.hypot(rx, rz) - RIDGE.depth * Math.max(f, 0.15) + Math.sin(deg * 0.31) * 1.5 * f;
}

function ridges(scene: Scene, built: Set<unknown>): { obstacles: Obstacle[]; gone: Array<[number, number]> } {
  const earth = new StandardMaterial("tribal1Ridge", scene);
  earth.diffuseColor = new Color3(0.88, 0.5, 0.2);
  earth.emissiveColor = new Color3(0.2, 0.1, 0.03);
  earth.specularColor = Color3.Black();
  const rock = new StandardMaterial("tribal1RidgeRock", scene);
  rock.diffuseColor = new Color3(0.5, 0.44, 0.4);
  rock.emissiveColor = new Color3(0.07, 0.06, 0.055);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  // The flat corner mounds and their colliders
  const gone: Array<[number, number]> = [];
  for (const m of scene.meshes.filter((m) => built.has(m) && m.name === "hill")) {
    gone.push([m.position.x, m.position.z]);
    m.dispose();
  }
  const benches: Mesh[] = [];
  const blocks: Mesh[] = [];
  const obstacles: Obstacle[] = [];
  let k = 0;
  for (const [from, to] of RIDGES) {
    const paths: Vector3[][] = [[], [], [], []];
    for (let deg = from; deg <= to; deg += 2) {
      const [rx, rz] = rim(deg);
      const rr = Math.hypot(rx, rz), ux = rx / rr, uz = rz / rr;
      const f = ridgeAt(deg), h = RIDGE.h * f, ri = ridgeInner(deg, f);
      paths[0].push(new Vector3(ux * (ri - 1.8 * f), 0.03, uz * (ri - 1.8 * f)));
      paths[1].push(new Vector3(ux * ri, h + 0.03, uz * ri));
      paths[2].push(new Vector3(ux * (rr - 0.3), h + 0.03, uz * (rr - 0.3)));
      paths[3].push(new Vector3(ux * rr, -0.4, uz * rr));
    }
    benches.push(MeshBuilder.CreateRibbon("tribal1Ridge", { pathArray: paths }, scene));
    for (let deg = from + 4; deg <= to - 4; deg += 4) {
      k++;
      const f = ridgeAt(deg);
      if (f < 0.3) continue;
      const [rx, rz] = rim(deg);
      const rr = Math.hypot(rx, rz), ri = ridgeInner(deg, f);
      const hb = RIDGE.h * f + 0.5 + seeded(k, 51) * 2;
      const w = 4 + seeded(k, 52) * 2.5;
      const b = MeshBuilder.CreateCylinder("tribal1RidgeRock", { diameterTop: w * 0.75, diameterBottom: w, height: hb, tessellation: 6 }, scene);
      b.scaling.z = 0.6;
      b.position.set((rx / rr) * (ri + 0.6), hb / 2, (rz / rr) * (ri + 0.6));
      b.rotation.set((seeded(k, 53) - 0.5) * 0.12, -Math.atan2(rz, rx) + Math.PI / 2 + (seeded(k, 54) - 0.5) * 0.4, 0);
      blocks.push(b);
    }
    for (let deg = from; deg <= to; deg += 5) {
      const f = ridgeAt(deg);
      if (f < 0.5) continue;
      const [rx, rz] = rim(deg);
      const rr = Math.hypot(rx, rz), ri = ridgeInner(deg, f) + 2;
      obstacles.push({ type: "cylinder", center: new Vector3((rx / rr) * ri, 0, (rz / rr) * ri), radius: 2.8 });
    }
  }
  const bench = Mesh.MergeMeshes(benches, true);
  if (bench) {
    bench.name = "tribal1Ridges";
    bench.material = earth;
    bench.receiveShadows = true;
    bench.isPickable = false;
  }
  const face = Mesh.MergeMeshes(blocks, true);
  if (face) {
    face.name = "tribal1RidgeRocks";
    face.convertToFlatShadedMesh();
    face.material = rock;
    face.receiveShadows = true;
    face.isPickable = false;
  }
  // Trees standing on a bench go up onto it
  for (const m of scene.meshes) {
    if (!built.has(m) || !["trunk", "tribal1Crown", "hazeTreeline"].includes(m.name) || m.parent) continue;
    const deg = (Math.atan2(m.position.z, m.position.x) * 180) / Math.PI;
    const f = ridgeAt(deg);
    if (f > 0 && Math.hypot(m.position.x, m.position.z) >= ridgeInner(deg, f)) m.position.y += RIDGE.h * f;
  }
  return { obstacles, gone };
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
  obstacles.push(...campfire(scene));
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  openSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  earthTiers(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  const ridge = ridges(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  const kept = obstacles.filter((o) => !ridge.gone.some(([x, z]) => Math.abs(x - o.center.x) < 0.01 && Math.abs(z - o.center.z) < 0.01));
  return { ...result, obstacles: kept.concat(ridge.obstacles) };
}
