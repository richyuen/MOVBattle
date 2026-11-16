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

/**
 * Rim cliffs (wiki shot): a continuous wall of tall grey faceted rock stands behind the back tree line, from the back-left round the back to
 * the back-right, 7-11 m high, its face broken into leaning slabs that overlap with no gaps, a flat top behind it; a lower run closes the
 * left side. Spec: segments every 4 degrees along the island rim (superellipse a 54, b 48), pulled 3 m in; each segment two overlapping
 * slabs 7-10 m wide and a capstone. Angles from +x toward +z.
 */
const RIM = { a: 54, b: 48, round: 3 };
const CLIFFS: Array<[number, number, number]> = [[30, 150, 1], [155, 205, 0.7]]; // [from, to, height factor]

function rimPoint(deg: number): [number, number] {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const r = (Math.abs(c / RIM.a) ** RIM.round + Math.abs(s / RIM.b) ** RIM.round) ** (-1 / RIM.round);
  return [c * r, s * r];
}

function backCliffs(scene: Scene, obstacles: Obstacle[]): void {
  const rock = new StandardMaterial("tribalSandboxCliff", scene);
  rock.diffuseColor = new Color3(0.6, 0.55, 0.52);
  rock.emissiveColor = new Color3(0.09, 0.07, 0.06);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  let k = 0;
  for (const [from, to, tall] of CLIFFS) {
    for (let deg = from; deg <= to; deg += 4) {
      k++;
      const [rx, rz] = rimPoint(deg);
      const pull = 1 - 3 / Math.hypot(rx, rz);
      const x = rx * pull, z = rz * pull;
      const face = -Math.atan2(z, x) + Math.PI / 2;
      const h = (7 + seeded(k, 41) * 4) * tall;
      for (let j = 0; j < 2; j++) {
        const w = 7 + seeded(k * 2 + j, 42) * 3;
        const hj = h * (1 - j * 0.18);
        const slab = MeshBuilder.CreateCylinder("tsCliff", { diameterTop: w * 0.75, diameterBottom: w, height: hj, tessellation: 5 }, scene);
        slab.scaling.z = 0.55;
        slab.position.set(x * (1 + j * 0.03) + (seeded(k * 2 + j, 43) - 0.5) * 1.5, hj / 2, z * (1 + j * 0.03) + (seeded(k * 2 + j, 44) - 0.5) * 1.5);
        slab.rotation.set((seeded(k * 2 + j, 45) - 0.5) * 0.1, face + (seeded(k * 2 + j, 46) - 0.5) * 0.35, 0);
        parts.push(slab);
      }
      const cap = MeshBuilder.CreateCylinder("tsCliffCap", { diameterTop: 5.5, diameterBottom: 7, height: 1.4, tessellation: 5 }, scene);
      cap.scaling.z = 0.6;
      cap.position.set(x * 1.04, h - 0.3, z * 1.04);
      cap.rotation.set(0, face + seeded(k, 47), (seeded(k, 48) - 0.5) * 0.15);
      parts.push(cap);
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 3 });
    }
  }
  const cliffs = Mesh.MergeMeshes(parts, true);
  if (cliffs) {
    cliffs.name = "tribalSandboxCliffs";
    cliffs.convertToFlatShadedMesh();
    cliffs.material = rock;
    cliffs.receiveShadows = true;
    cliffs.isPickable = false;
  }
}

/**
 * Autumn birches (wiki shot; tribal_1's birch kit, this map's own copy): every ring tree is one faceted ball crown on a tall thin white
 * trunk, crowns red, orange and yellow (about 2:2:1), 2.8-4.4 m across the ball; the low band of ball crowns behind the ring (which read
 * as olive hedges) takes the red and orange too. Crowns are lit by their own colour and kept out of fog, glow and the canopy haze.
 */
const BIRCH_CROWNS: Array<[string, Color3]> = [
  ["tribalSandboxCrownRed", new Color3(0.72, 0.12, 0.05)],
  ["tribalSandboxCrownOrange", new Color3(0.82, 0.3, 0.05)],
  ["tribalSandboxCrownRed2", new Color3(0.66, 0.16, 0.06)],
  ["tribalSandboxCrownOrange2", new Color3(0.78, 0.38, 0.07)],
  ["tribalSandboxCrownYellow", new Color3(0.7, 0.55, 0.08)],
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
  const bark = new StandardMaterial("tribalSandboxBirch", scene);
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
    const r = 1.4 + seeded(i, 21) * 0.8 + h * 0.1;
    const ball = MeshBuilder.CreateIcoSphere("tribalSandboxCrown", { radius: r, subdivisions: 1 }, scene);
    ball.scaling.y = 1.08;
    ball.rotation.y = seeded(i, 22) * Math.PI;
    ball.position.set(top.x, top.y + r * 0.7, top.z);
    ball.convertToFlatShadedMesh();
    ball.material = crowns[Math.floor(seeded(i, 23) * crowns.length)];
    ball.applyFog = false;
    ball.isPickable = false;
    glow?.addExcludedMesh(ball);
  });
  scene.meshes.filter((m) => built.has(m) && m.name === "hazeTreeline").forEach((m, i) => {
    m.material = crowns[i % 2 === 0 ? 0 : 1];
    m.applyFog = false;
  });
}

// The open plain (wiki shot): no dry-stone walls cross it; the base's wall stones inside the ellipse |x| < 47, |z| < 32 go with their colliders
const FIELD = { rx: 47, rz: 32 };
const inField = (x: number, z: number, margin = 0) => (x / (FIELD.rx + margin)) ** 2 + (z / (FIELD.rz + margin)) ** 2 < 1;

function clearFieldWalls(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const gone: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && m.name === "wallStone")) {
    if (!inField(mesh.position.x, mesh.position.z, 2)) continue;
    gone.push([mesh.position.x, mesh.position.z]);
    mesh.dispose();
  }
  result.obstacles = result.obstacles.filter((o) => !(inField(o.center.x, o.center.z, 2)
    && gone.some(([x, z]) => Math.abs(x - o.center.x) < 0.01 && Math.abs(z - o.center.z) < 0.01)));
}

/**
 * Rock nooks (wiki shot; cliff blocks since 563, spec in rockNooks): along the right and back of the ring, clusters of rock with birches growing out of them stand
 * into the plain, each a horseshoe open toward the centre so it holds a pocket a squad can hide in. Spec: four nooks at (34, 24), (44, -6),
 * (28, -28), (6, 33); each six boulders 3-5.5 m on an arc of 7 m radius, 200 degrees wide, its open side facing the island centre, the
 * middle ones stacked a second boulder high; two or three birches (white trunk, ball crown in the ring's colours) stand among the rocks.
 * One collider per boulder.
 */
const NOOKS: Array<[number, number]> = [[25.8, 18.2], [34.1, -4.7], [20.9, -20.9], [4.2, 23.2]];

function rockNooks(scene: Scene, obstacles: Obstacle[]): void {
  // 563: cliff-block outcrops (wiki shot: stacked flat-topped faceted rock blocks with birches growing on their tops), not round boulders.
  // Each nook is five upright faceted blocks (5-6 sided, flat tops, 4.5-7 m across) on the 200-degree horseshoe, 3-7.5 m tall and tallest at
  // the back of the arc, each block with a thinner flat slab set on its top at an offset; the birches stand on the tops of the two tallest.
  const rock = new StandardMaterial("tribalSandboxNook", scene);
  rock.diffuseColor = new Color3(0.62, 0.53, 0.46);
  rock.emissiveColor = new Color3(0.1, 0.08, 0.065);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const bark = scene.getMaterialByName("tribalSandboxBirch");
  const crowns = BIRCH_CROWNS.map(([name]) => scene.getMaterialByName(name)).filter((m) => m !== null);
  const glow = scene.getGlowLayerByName("glow");
  const boulders: Mesh[] = [];
  NOOKS.forEach(([cx, cz], n) => {
    const open = Math.atan2(-cz, -cx); // the open side faces the centre
    const tops: Array<[number, number, number]> = [];
    for (let i = 0; i < 5; i++) {
      const k = n * 10 + i;
      const a = open + Math.PI + ((i / 4) - 0.5) * (200 * Math.PI / 180);
      const d = 4.5 + seeded(k, 51) * 2.5;
      const back = 1 - Math.abs(i - 2) / 2; // 1 at the back of the arc, 0 at the tips
      const h = 3 + back * 3.5 + seeded(k, 52) * 1;
      const x = cx + Math.cos(a) * 7, z = cz + Math.sin(a) * 7;
      const block = MeshBuilder.CreateCylinder("tsNookBlock", { diameterTop: d * 0.86, diameterBottom: d, height: h, tessellation: 5 + (i % 2) }, scene);
      block.rotation.set((seeded(k, 53) - 0.5) * 0.08, seeded(k, 54) * Math.PI, (seeded(k, 55) - 0.5) * 0.08);
      block.position.set(x, h / 2 - 0.1, z);
      boulders.push(block);
      const slab = MeshBuilder.CreateCylinder("tsNookSlab", { diameterTop: d * 0.62, diameterBottom: d * 0.7, height: 1, tessellation: 5 }, scene);
      slab.rotation.set(0, seeded(k, 56) * Math.PI, 0);
      slab.position.set(x + (seeded(k, 57) - 0.5) * 1.2, h + 0.4, z + (seeded(k, 58) - 0.5) * 1.2);
      boulders.push(slab);
      tops.push([x, z, h + 0.9]);
      obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: d * 0.48 });
    }
    // Birches growing on the tops of the tallest blocks
    tops.sort((p, q) => q[2] - p[2]);
    const trees = 2;
    for (let t = 0; t < trees; t++) {
      const k = n * 10 + t;
      const [x, z, y0] = tops[t];
      const h = 5 + seeded(k, 59) * 2.5;
      const trunk = MeshBuilder.CreateCylinder("tsNookBirch", { diameterTop: 0.22, diameterBottom: 0.32, height: h, tessellation: 5 }, scene);
      trunk.position.set(x, y0 + h / 2, z);
      if (bark) trunk.material = bark;
      trunk.isPickable = false;
      const r = 1.6 + seeded(k, 60) * 0.8;
      const ball = MeshBuilder.CreateIcoSphere("tsNookCrown", { radius: r, subdivisions: 1 }, scene);
      ball.scaling.y = 1.08;
      ball.position.set(x, y0 + h + r * 0.6, z);
      ball.convertToFlatShadedMesh();
      if (crowns.length) ball.material = crowns[Math.floor(seeded(k, 61) * crowns.length)];
      ball.applyFog = false;
      ball.isPickable = false;
      glow?.addExcludedMesh(ball);
    }
  });
  const merged = Mesh.MergeMeshes(boulders, true);
  if (merged) {
    merged.name = "tribalSandboxNooks";
    merged.convertToFlatShadedMesh();
    merged.material = rock;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

/**
 * Plain boulders (wiki shot): the rocks lying loose on the plain are big warm grey faceted boulders, angular with flat faces, 3-5 m across
 * and about two thirds as high, not the base's small dark navy round stones. Spec: every base "boulder" mesh goes with its collider and a
 * warm grey dodecahedron boulder stands in its place, 3-4.8 m across, squashed to 0.6-0.8 of its width in height, sunk a fifth into the
 * ground and turned at random; one collider per boulder at 0.45 of its width. Warm grey with red well over blue (lavender otherwise).
 */
function plainBoulders(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const spots: Array<[number, number]> = [];
  for (const mesh of scene.meshes.filter((m) => built.has(m) && m.name === "boulder")) {
    const p = mesh.getAbsolutePosition();
    spots.push([p.x, p.z]);
    mesh.dispose();
  }
  const kept = obstacles.filter((o) => !spots.some(([x, z]) => Math.abs(o.center.x - x) < 0.01 && Math.abs(o.center.z - z) < 0.01));
  const stone = new StandardMaterial("tribalSandboxBoulder", scene);
  stone.diffuseColor = new Color3(0.7, 0.6, 0.5);
  stone.emissiveColor = new Color3(0.11, 0.09, 0.07);
  stone.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  spots.forEach(([x, z], i) => {
    const d = 3 + seeded(i, 71) * 1.8;
    const b = MeshBuilder.CreatePolyhedron("tsBoulder", { type: 2, size: d / 2.6 }, scene);
    const h = 0.6 + seeded(i, 72) * 0.2;
    b.scaling.set(1 + seeded(i, 73) * 0.25, h, 1);
    b.rotation.set((seeded(i, 74) - 0.5) * 0.3, seeded(i, 75) * Math.PI * 2, (seeded(i, 76) - 0.5) * 0.3);
    b.position.set(x, d * h * 0.3, z);
    parts.push(b);
    kept.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: d * 0.45 });
  });
  const merged = Mesh.MergeMeshes(parts, true);
  if (merged) {
    merged.name = "tribalSandboxBoulders";
    merged.convertToFlatShadedMesh();
    merged.material = stone;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  return kept;
}

/**
 * Open sky with far spires (autumn_tribal_sandbox.png): past the back tree line there is only teal sky and a few tall thin grey rock spires,
 * no ridge range. The base's range and its floating roots (mountainBase/Cap/Root) go; clouds stay. Spec: five faceted stacks 6-9 m across
 * and 16-26 m above the lawn, rising out of the haze below the island, 64-80 m out behind the back and back-right rim, leaning a little.
 */
const SPIRES: Array<[number, number, number, number]> = [[-28, 66, 7, 18], [-6, 74, 8, 26], [14, 70, 6.5, 21], [36, 64, 9, 17], [58, 46, 7.5, 23]];

function openSky(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) {
    if (built.has(mesh) && mesh.name.startsWith("mountain")) mesh.setEnabled(false);
  }
  const stone = new StandardMaterial("tribalSandboxSpire", scene);
  stone.diffuseColor = new Color3(0.6, 0.55, 0.52);
  stone.emissiveColor = new Color3(0.12, 0.11, 0.11);
  stone.specularColor = Color3.Black();
  const parts: Mesh[] = [];
  SPIRES.forEach(([x, z, w, h], i) => {
    const depth = 30;
    const spire = MeshBuilder.CreateCylinder("tsSpire", { diameterTop: w * 0.6, diameterBottom: w, height: h + depth, tessellation: 5 }, scene);
    spire.position.set(x, (h - depth) / 2, z);
    spire.rotation.set((seeded(i, 81) - 0.5) * 0.12, seeded(i, 82) * Math.PI, (seeded(i, 83) - 0.5) * 0.12);
    const tip = MeshBuilder.CreateCylinder("tsSpireTip", { diameterTop: w * 0.2, diameterBottom: w * 0.55, height: w * 0.6, tessellation: 5 }, scene);
    tip.position.set(x + (seeded(i, 84) - 0.5) * 0.6, h + w * 0.25, z);
    tip.rotation.y = seeded(i, 85) * Math.PI;
    parts.push(spire, tip);
  });
  const spires = Mesh.MergeMeshes(parts, true);
  if (spires) {
    spires.name = "tribalSandboxSpires";
    spires.convertToFlatShadedMesh();
    spires.material = stone;
    spires.isPickable = false;
  }
}

/**
 * Red shrubs (wiki tribal_sandbox.png): low crinkly red and red-orange bushes are scattered at the feet of the ring birches and tucked
 * against the rock nooks and outcrops. Spec read off the wiki shot: about one ring birch in three has a clump 1-2 m in front of it on the
 * field side, and each nook, the outcrop and the heap have two; a clump is 2-4 bumpy balls 0.9-1.6 m across (finer facets than the
 * crowns), in crimson (linear (0.7, 0.07, 0.04)) and red-orange (0.78, 0.2, 0.05), self-lit, out of fog and glow. Any base bushes go.
 * Drawn only: units push through.
 */
function redShrubs(scene: Scene, built: Set<unknown>): void {
  for (const mesh of scene.meshes) if (built.has(mesh) && (mesh.name === "bush" || mesh.name === "bushLump")) mesh.setEnabled(false);
  const mats = [new Color3(0.7, 0.07, 0.04), new Color3(0.78, 0.2, 0.05)].map((c, i) => {
    const m = new StandardMaterial(`tribalSandboxShrub${i}`, scene);
    m.diffuseColor = c.scale(0.6);
    m.emissiveColor = c.scale(0.5);
    m.specularColor = Color3.Black();
    return m;
  });
  const spots: Array<[number, number]> = [];
  const trunks = scene.meshes.filter((m) => built.has(m) && m.name === "trunk" && m.isEnabled());
  trunks.forEach((t, i) => {
    if (i % 3 !== 0) return;
    const p = t.getAbsolutePosition();
    const l = Math.hypot(p.x, p.z) || 1;
    const d = 1 + seeded(i, 121);
    spots.push([p.x - (p.x / l) * d, p.z - (p.z / l) * d]);
  });
  for (const [x, z] of [...NOOKS, [OUTCROP.x, OUTCROP.z] as [number, number], [HEAP.x, HEAP.z] as [number, number]]) {
    const l = Math.hypot(x, z) || 1;
    for (const side of [-1, 1]) spots.push([x - (x / l) * 5 + (-z / l) * side * 3.5, z - (z / l) * 5 + (x / l) * side * 3.5]);
  }
  const groups: Mesh[][] = [[], []];
  spots.forEach(([x, z], s) => {
    const n = 2 + Math.floor(seeded(s, 122) * 3);
    for (let b = 0; b < n; b++) {
      const k = s * 10 + b;
      const r = (0.45 + seeded(k, 123) * 0.35) * 2.5;
      const ball = MeshBuilder.CreateIcoSphere("tsShrub", { radius: r, subdivisions: 2 }, scene);
      const a = seeded(k, 124) * Math.PI * 2, off = b === 0 ? 0 : (0.6 + seeded(k, 125) * 0.4) * 2;
      ball.scaling.y = 0.85;
      ball.position.set(x + Math.cos(a) * off, r * 0.75, z + Math.sin(a) * off);
      groups[seeded(k, 126) < 0.6 ? 0 : 1].push(ball);
    }
  });
  const glow = scene.getGlowLayerByName("glow");
  groups.forEach((list, i) => {
    const merged = list.length ? Mesh.MergeMeshes(list, true) : null;
    if (!merged) return;
    merged.name = `tribalSandboxShrubs${i}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[i];
    merged.applyFog = false;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  });
}

/**
 * Raised rock tops at the rim (card Overview: "enemies can be hidden behind or on top of the mountains"; autumn_tribal_sandbox.png): broad
 * flat-topped mesas stand into the ring at the front-left, front-right and right, standing over the birch crowns. Spec: at 215, 300 and 335
 * degrees, 0.8 of the rim; each a six-sided block 13 m across at the foot, 11 m at its 10 m top, a flat cap slab 0.9 m thick and 12 m
 * across lying on it, and a 5 m step block on its field side; the warm grey of the cliffs (r well over b). The ring birches within 9 m go
 * with their colliders; one 6 m collider per mesa.
 */
const MESAS = [215, 300, 335];

function rimMesas(scene: Scene, built: Set<unknown>, obstacles: Obstacle[]): Obstacle[] {
  const rock = new StandardMaterial("tribalSandboxMesa", scene);
  rock.diffuseColor = new Color3(0.62, 0.53, 0.46);
  rock.emissiveColor = new Color3(0.1, 0.08, 0.065);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  const spots: Array<[number, number]> = [];
  MESAS.forEach((deg, i) => {
    const [rx, rz] = rimPoint(deg);
    const x = rx * 0.8, z = rz * 0.8;
    spots.push([x, z]);
    const l = Math.hypot(x, z);
    const body = MeshBuilder.CreateCylinder("tsMesa", { diameterTop: 11, diameterBottom: 13, height: 10, tessellation: 6 }, scene);
    body.position.set(x, 5, z);
    body.rotation.y = seeded(i, 131) * Math.PI;
    const cap = MeshBuilder.CreateCylinder("tsMesaCap", { diameterTop: 11.4, diameterBottom: 12, height: 0.9, tessellation: 7 }, scene);
    cap.position.set(x + 0.3, 10.2, z - 0.2);
    cap.rotation.set((seeded(i, 132) - 0.5) * 0.06, seeded(i, 133) * Math.PI, (seeded(i, 134) - 0.5) * 0.06);
    const step = MeshBuilder.CreateCylinder("tsMesaStep", { diameterTop: 6.5, diameterBottom: 8, height: 5, tessellation: 5 }, scene);
    step.position.set(x - (x / l) * 6, 2.5, z - (z / l) * 6);
    step.rotation.y = seeded(i, 135) * Math.PI;
    parts.push(body, cap, step);
    obstacles.push({ type: "cylinder", center: new Vector3(x, 0, z), radius: 6 });
    obstacles.push({ type: "cylinder", center: new Vector3(x - (x / l) * 6, 0, z - (z / l) * 6), radius: 3.5 });
  });
  const merged = Mesh.MergeMeshes(parts, true);
  if (merged) {
    merged.name = "tribalSandboxMesas";
    merged.convertToFlatShadedMesh();
    merged.material = rock;
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
  const gone: Array<[number, number]> = [];
  for (const trunk of scene.meshes.filter((m) => built.has(m) && m.name === "trunk")) {
    const p = trunk.getAbsolutePosition();
    if (!spots.some(([x, z]) => Math.hypot(p.x - x, p.z - z) < 9)) continue;
    gone.push([p.x, p.z]);
    trunk.dispose();
  }
  return obstacles.filter((o) => !gone.some(([x, z]) => Math.hypot(o.center.x - x, o.center.z - z) < 0.5));
}

export function buildTribalSandbox(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  clearFieldWalls(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), result);
  const rock = new StandardMaterial("tribalSandboxRock", scene);
  rock.diffuseColor = new Color3(0.62, 0.57, 0.56);
  rock.emissiveColor = new Color3(0.08, 0.07, 0.07);
  rock.specularColor = new Color3(0.03, 0.03, 0.03);
  const parts: Mesh[] = [];
  const obstacles: Obstacle[] = plainBoulders(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), [...result.obstacles]);

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
  backCliffs(scene, obstacles);
  const kept = rimMesas(scene, new Set(scene.meshes.filter((m) => !prior.has(m))), obstacles);
  obstacles.length = 0;
  obstacles.push(...kept);
  birchRing(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  openSky(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));
  rockNooks(scene, obstacles);
  redShrubs(scene, new Set(scene.meshes.filter((m) => !prior.has(m))));

  // Enlarge the arena in the ground plane and keep the navigation footprint in the same coordinates.
  const spread = 1.45;
  const footprint = new Vector3(spread, 1, spread);
  const island = new Mesh("tribalSandboxFootprint", scene);
  for (const mesh of scene.meshes) {
    if (mesh !== island && !mesh.parent && !prior.has(mesh) && !/^cloud/.test(mesh.name)) mesh.parent = island;
  }
  island.scaling.copyFrom(footprint);
  island.isPickable = false;
  const expandZones = (zones: MapBuildResult["zones"]): MapBuildResult["zones"] =>
    zones.map((zone) => ({ ...zone, center: zone.center.multiply(footprint), size: zone.size.multiply(footprint) }));
  const expandBox = <T extends { center: Vector3; halfX: number; halfZ: number }>(box: T): T =>
    ({ ...box, center: box.center.multiply(footprint), halfX: box.halfX * spread, halfZ: box.halfZ * spread });
  return {
    ...result,
    zones: expandZones(result.zones),
    placementZones: result.placementZones && expandZones(result.placementZones),
    obstacles: obstacles.map((obstacle) => obstacle.type === "box"
      ? expandBox(obstacle)
      : { ...obstacle, center: obstacle.center.multiply(footprint), radius: obstacle.radius * spread }),
    hazards: result.hazards.map((hazard) => hazard.shape === "box"
      ? expandBox(hazard)
      : { ...hazard, center: hazard.center.multiply(footprint), radius: hazard.radius * spread }),
  };
}
