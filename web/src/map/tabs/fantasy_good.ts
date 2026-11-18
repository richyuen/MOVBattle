// TABS "Fantasy Good" (Heaven, fantasy map): a rectangular deck of white marble paving trimmed in gold, sunk with four planted
// pits, guarded by two white-and-gold gate towers with waterfalls, floating in a pale sky among cloud banks
// (reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png; card loop/cards/maps/fantasy_good.md). Built on
// campaign.fantasy_good (base()), dressed here only.
//
// Marble deck (591, blocker a1; wiki fantasy_good.png: the whole field is paved with white marble slabs laid in running bond,
// the seams a pale blue-grey, here and there a pale teal tile; every edge of the deck carries a gold-yellow kerb). Spec: the
// base lawn ("ground", "centerGrass") and its grass (fieldBlades_*, grassTuft) are hidden; a 104 x 80 m slab (x +-52, z +-40),
// top at 0, 4 m deep, is laid in their place, its top textured with a 512 px tile per 4 x 4 m: 1 x 0.5 m pavers in running bond,
// white (236,240,244) varied by +-3 levels, 3 px seams (196,208,220), one pavers in ~14 a pale teal (176,222,226); its sides
// plain white stone. A gold kerb 0.7 m wide, 0.35 m high runs round the deck's top edge, gold (.78,.62,.1) lit with a warm
// self-light (.22,.17,.02). The deck's corners overhang the base island's oval (drawn only; the base's hazards are unchanged).
import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture, Vector3, VertexBuffer, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { cloudBanks, paleSky } from "./simKit";

const DECK = { x: 52, z: 40, depth: 4, tileM: 4, tilePx: 512, kerbW: 0.7, kerbH: 0.35 };

function marbleMaterial(scene: Scene): StandardMaterial {
  const px = DECK.tilePx, perM = px / DECK.tileM;
  const tex = new DynamicTexture("heavenMarble_tex", { width: px, height: px }, scene, true, Texture.TRILINEAR_SAMPLINGMODE);
  const ctx = tex.getContext();
  ctx.fillStyle = "rgb(196,208,220)";
  ctx.fillRect(0, 0, px, px);
  let seed = 0x2b3f;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const w = perM, h = perM / 2, seam = 3;
  for (let row = 0; row < DECK.tileM * 2; row++) {
    const shift = row % 2 ? w / 2 : 0;
    for (let i = -1; i < DECK.tileM + 1; i++) {
      const teal = rnd() < 0.07;
      const v = Math.round((rnd() - 0.5) * 6);
      ctx.fillStyle = teal ? "rgb(176,222,226)" : `rgb(${236 + v},${240 + v},${244 + v})`;
      ctx.fillRect(Math.round(i * w + shift) + seam, Math.round(row * h) + seam, Math.round(w) - seam, Math.round(h) - seam);
    }
  }
  tex.update(true);
  tex.wrapU = Texture.WRAP_ADDRESSMODE;
  tex.wrapV = Texture.WRAP_ADDRESSMODE;
  tex.uScale = (2 * DECK.x) / DECK.tileM;
  tex.vScale = (2 * DECK.z) / DECK.tileM;
  tex.anisotropicFilteringLevel = 16;
  const mat = new StandardMaterial("heavenMarble", scene);
  mat.diffuseTexture = tex;
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = new Color3(0.22, 0.23, 0.25);
  mat.specularColor = new Color3(0.08, 0.08, 0.09);
  return mat;
}

// Sunken pits (592, blocker b2; wiki fantasy_good.png: four deep rectangular pits are cut into the deck, one in each quarter,
// their walls sheer white stone edged in gold, their floors far below in blue shade holding teal trees and white spires, so
// the paving left between them is a cross of broad walkways). Spec: pits x 6..30 and z 9..30 mirrored into all four quarters
// (a 12 m walkway along z = 0's cross street |x| < 6, an 18 m one along x |z| < 9, 10 m round the rim and the team zones'
// ends |x| > 30 untouched), 10 m deep: the deck top is laid as the paving left between them (world-planar uvs, so the bond
// runs on unbroken), the deck body becomes a 12 m deep rim wall; each pit has white inner walls, a slate-blue floor
// (.24,.3,.42) self (.06,.08,.12), a gold rim kerb, two teal low-poly trees and one white spire rising above the deck.
// Every base mesh standing in a pit (crystals, bridges) is hidden with its collider; the base's two water pools (x +-18,
// z 11..25) go, and each pit is a box collider instead, so nobody walks over the drop (the sim stays flat).
const PITS: Array<{ x0: number; x1: number; z0: number; z1: number }> = [];
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  const xs = [6 * sx, 30 * sx].sort((a, b) => a - b), zs = [9 * sz, 30 * sz].sort((a, b) => a - b);
  PITS.push({ x0: xs[0], x1: xs[1], z0: zs[0], z1: zs[1] });
}
const PIT_DEPTH = 10;
const inPit = (x: number, z: number, pad = 0) => PITS.some((p) => x > p.x0 - pad && x < p.x1 + pad && z > p.z0 - pad && z < p.z1 + pad);

// Stepped edge (595, blocker b1; wiki fantasy_good.png: the deck's long sides do not run straight but step in and out in
// square notches, the gold kerb and the crenellated parapet following every step). Spec: along the front (z -40) the edge
// steps in 4 m over x -36..-20, -4..12 and 28..44 (16 m bays, 16 m apart), the back edge the same turned 180 degrees; the
// corners and the tower legs (z 27..33) and pits (to z 30) untouched; deck top, rim wall, kerb and parapet follow the steps;
// each notch is a box collider (nobody walks onto the air), outside both zones (|z| <= 20).
const EDGE_STEPS: Array<[number, number, number]> = [[-36, -20, 4], [-4, 12, 4], [28, 44, 4]];
/** How far the long edge on side s (-1 front, +1 back) steps in at x. */
const notchDepth = (s: number, x: number) => { const u = s < 0 ? x : -x; return EDGE_STEPS.find(([a, b]) => u > a && u < b)?.[2] ?? 0; };
const EDGE_XS = [...new Set([-DECK.x, DECK.x, ...EDGE_STEPS.flatMap(([a, b]) => [a, b, -a, -b])])].sort((a, b) => a - b);
/** The long side s's outline: runs along x at the edge's z, and steps across z at the x where the depth changes. */
function edgeSegments(s: number): Array<{ x0: number; x1: number; z0: number; z1: number }> {
  const out: Array<{ x0: number; x1: number; z0: number; z1: number }> = [];
  for (let i = 0; i < EDGE_XS.length - 1; i++) {
    const x0 = EDGE_XS[i], x1 = EDGE_XS[i + 1], z = s * (DECK.z - notchDepth(s, (x0 + x1) / 2));
    out.push({ x0, x1, z0: z, z1: z });
    if (i < EDGE_XS.length - 2) {
      const zn = s * (DECK.z - notchDepth(s, (x1 + EDGE_XS[i + 2]) / 2));
      if (zn !== z) out.push({ x0: x1, x1, z0: Math.min(z, zn), z1: Math.max(z, zn) });
    }
  }
  return out;
}

/** Deck top pieces around the pits: x bands split at the pits' edges, each band's z runs outside every pit. */
function deckPieces(): Array<{ x0: number; x1: number; z0: number; z1: number }> {
  const xs = [...new Set([-30, -6, 6, 30, ...EDGE_XS])].sort((a, b) => a - b), out: Array<{ x0: number; x1: number; z0: number; z1: number }> = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i], x1 = xs[i + 1], mid = (x0 + x1) / 2;
    const cuts = PITS.filter((p) => p.x0 < mid && p.x1 > mid).map((p) => [p.z0, p.z1]).sort((a, b) => a[0] - b[0]);
    let z = -DECK.z + notchDepth(-1, mid);
    const end = DECK.z - notchDepth(1, mid);
    for (const [a, b] of cuts) { if (a > z) out.push({ x0, x1, z0: z, z1: a }); z = Math.max(z, b); }
    if (z < end) out.push({ x0, x1, z0: z, z1: end });
  }
  return out;
}

/** Boxes along a long side's outline, `w` thick, its outer face on the outline (horizontal runs) or centred on the step. */
function alongEdge(s: number, w: number, inset: number): Array<{ w: number; d: number; x: number; z: number }> {
  return edgeSegments(s).map((g) => g.z0 === g.z1
    ? { w: g.x1 - g.x0 + (g.x0 === -DECK.x || g.x1 === DECK.x ? 0 : w), d: w, x: (g.x0 + g.x1) / 2, z: g.z0 - s * inset }
    : { w, d: g.z1 - g.z0, x: g.x0, z: (g.z0 + g.z1) / 2 });
}

function pits(scene: Scene, built: Set<unknown>, result: MapBuildResult, stone: StandardMaterial, gold: StandardMaterial): MapBuildResult {
  for (const m of scene.meshes) {
    if (!built.has(m) || !m.isEnabled()) continue;
    // the base island's top slab and shelf lie at the deck's top and would lid the pits (592.5b)
    if (m.name === "islandUnder" || m.name === "islandShelf") { m.setEnabled(false); continue; }
    m.computeWorldMatrix(true);
    const bb = m.getBoundingInfo().boundingBox, c = bb.centerWorld;
    // the base pools' water sheets and bridges (x +-18, z 11..25) would lie over the cross walkway
    const inPool = Math.abs(c.x) <= 18 && Math.abs(c.z) >= 10 && Math.abs(c.z) <= 26 && bb.extendSizeWorld.x < 25 && bb.extendSizeWorld.z < 25;
    if (!inPit(c.x, c.z, 1) && !inPool) continue;
    m.setEnabled(false);
  }
  const pool = (x: number, z: number) => Math.abs(x) <= 18 && Math.abs(z) >= 10 && Math.abs(z) <= 26;
  const obstacles = result.obstacles.filter((o) => !inPit(o.center.x, o.center.z, 1) && !pool(o.center.x, o.center.z));
  const hazards = result.hazards.filter((h) => !(h.kind === "water" && Math.abs(h.center.x) < 1 && Math.abs(Math.abs(h.center.z) - 18) < 1));
  const floorMat = new StandardMaterial("heavenPitFloor", scene);
  floorMat.diffuseColor = new Color3(0.24, 0.3, 0.42);
  floorMat.emissiveColor = new Color3(0.06, 0.08, 0.12);
  floorMat.specularColor = Color3.Black();
  const leaf = new StandardMaterial("heavenPitLeaf", scene);
  leaf.diffuseColor = new Color3(0.2, 0.55, 0.5);
  leaf.emissiveColor = new Color3(0.05, 0.16, 0.15);
  leaf.specularColor = Color3.Black();
  const bark = new StandardMaterial("heavenPitBark", scene);
  bark.diffuseColor = new Color3(0.3, 0.2, 0.13);
  bark.specularColor = Color3.Black();
  const walls: Mesh[] = [], kerbs: Mesh[] = [], leaves: Mesh[] = [], trunks: Mesh[] = [], spires: Mesh[] = [];
  const box = (into: Mesh[], w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("heavenPitPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    into.push(b);
    return b;
  };
  const t = 0.6, d = PIT_DEPTH, k = 0.6;
  PITS.forEach((p, i) => {
    const cx = (p.x0 + p.x1) / 2, cz = (p.z0 + p.z1) / 2, w = p.x1 - p.x0, dz = p.z1 - p.z0;
    box(walls, w, d, t, cx, -d / 2, p.z0 + t / 2);
    box(walls, w, d, t, cx, -d / 2, p.z1 - t / 2);
    box(walls, t, d, dz, p.x0 + t / 2, -d / 2, cz);
    box(walls, t, d, dz, p.x1 - t / 2, -d / 2, cz);
    const floor = MeshBuilder.CreateBox("heavenPitFloor", { width: w, height: 0.4, depth: dz }, scene);
    floor.position.set(cx, -d - 0.2, cz);
    floor.material = floorMat;
    floor.receiveShadows = true;
    box(kerbs, w + 2 * k, 0.35, k, cx, 0.175, p.z0 - k / 2);
    box(kerbs, w + 2 * k, 0.35, k, cx, 0.175, p.z1 + k / 2);
    box(kerbs, k, 0.35, dz, p.x0 - k / 2, 0.175, cz);
    box(kerbs, k, 0.35, dz, p.x1 + k / 2, 0.175, cz);
    // two teal trees in the pit's outer half, one spire near its inner corner
    const sx = Math.sign(cx), sz = Math.sign(cz);
    for (const [ox, oz, s] of [[0.32, 0.28, 1], [0.05, -0.25, 0.8]] as Array<[number, number, number]>) {
      const tx = cx + sx * ox * w, tz = cz + sz * oz * dz;
      const trunk = MeshBuilder.CreateCylinder("heavenPitTrunk", { height: 7 * s, diameterTop: 0.5, diameterBottom: 0.9, tessellation: 6 }, scene);
      trunk.position.set(tx, -d + 3.5 * s, tz);
      trunk.bakeCurrentTransformIntoVertices();
      trunks.push(trunk);
      for (const [lx, ly, lz, r] of [[0, 7.5, 0, 3.4], [1.8, 6.4, 1.2, 2.6], [-1.6, 6.6, -1.1, 2.5], [0.4, 9, -0.6, 2.2]]) {
        const crown = MeshBuilder.CreateIcoSphere("heavenPitCrown", { radius: r * s, subdivisions: 1 }, scene);
        crown.position.set(tx + lx * s, -d + ly * s, tz + lz * s);
        crown.bakeCurrentTransformIntoVertices();
        leaves.push(crown);
      }
    }
    const spx = cx - sx * 0.3 * w, spz = cz - sz * 0.25 * dz;
    box(spires, 3, 2, 3, spx, -d + 1, spz);
    const shaft = MeshBuilder.CreateCylinder("heavenPitSpire", { height: 15, diameterTop: 0.2, diameterBottom: 2, tessellation: 4 }, scene);
    shaft.position.set(spx, -d + 2 + 7.5, spz);
    shaft.rotation.y = Math.PI / 4 + i * 0.1;
    shaft.bakeCurrentTransformIntoVertices();
    spires.push(shaft);
    const halo = MeshBuilder.CreateTorus("heavenPitHalo", { diameter: 3.2, thickness: 0.22, tessellation: 20 }, scene);
    halo.position.set(spx, -d + 2 + 12, spz);
    halo.rotation.x = Math.PI / 2;
    halo.bakeCurrentTransformIntoVertices();
    kerbs.push(halo);
    obstacles.push({ type: "box", center: new Vector3(cx, 0, cz), halfX: w / 2, halfZ: dz / 2 });
  });
  const merge = (parts: Mesh[], name: string, mat: StandardMaterial) => {
    const m = Mesh.MergeMeshes(parts, true, true);
    if (m) { m.name = name; m.material = mat; m.receiveShadows = true; }
  };
  merge(walls, "heavenPitWalls", stone);
  merge(spires, "heavenPitSpires", stone);
  merge(kerbs, "heavenPitKerbs", gold);
  merge(leaves, "heavenPitCrowns", leaf);
  merge(trunks, "heavenPitTrunks", bark);
  return { ...result, obstacles, hazards };
}

function marbleDeck(scene: Scene, built: Set<unknown>): { stone: StandardMaterial; gold: StandardMaterial } {
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (m.name === "ground" || m.name === "centerGrass" || m.name === "grassTuft" || m.name.startsWith("fieldBlades_")) m.setEnabled(false);
  }
  // 592: the top is the paving left round the pits, uvs in world metres / tile (the texture repeats once per uv unit)
  const tiles = deckPieces().map((r) => {
    const g = MeshBuilder.CreateGround("heavenDeckTop", { width: r.x1 - r.x0, height: r.z1 - r.z0 }, scene);
    g.position.set((r.x0 + r.x1) / 2, 0.005, (r.z0 + r.z1) / 2);
    g.bakeCurrentTransformIntoVertices();
    const pos = g.getVerticesData(VertexBuffer.PositionKind) ?? [];
    const uv: number[] = [];
    for (let i = 0; i < pos.length; i += 3) uv.push(pos[i] / DECK.tileM, pos[i + 2] / DECK.tileM);
    g.setVerticesData(VertexBuffer.UVKind, uv);
    return g;
  });
  const top = Mesh.MergeMeshes(tiles, true, true);
  const marble = marbleMaterial(scene);
  (marble.diffuseTexture as Texture).uScale = 1;
  (marble.diffuseTexture as Texture).vScale = 1;
  if (top) { top.name = "heavenDeckTop"; top.material = marble; top.receiveShadows = true; }
  const stone = new StandardMaterial("heavenStone", scene);
  stone.diffuseColor = new Color3(0.86, 0.89, 0.93);
  stone.emissiveColor = new Color3(0.2, 0.21, 0.24);
  stone.specularColor = Color3.Black();
  // the deck body: a rim wall 12 m deep round the deck's edge (its top would cover the pits), a floor plate under the pits
  const deep = PIT_DEPTH + 2, rim = 1;
  // 595: the long rims follow the stepped edge
  const body = Mesh.MergeMeshes([
    ...[-1, 1].flatMap((s) => alongEdge(s, rim, rim / 2).map((r) => [r.w, r.d, r.x, r.z])),
    [rim, 2 * DECK.z, DECK.x - rim / 2, 0], [rim, 2 * DECK.z, -DECK.x + rim / 2, 0],
  ].map(([w, dd, x, z]) => {
    const b = MeshBuilder.CreateBox("heavenDeckBody", { width: w, height: deep, depth: dd }, scene);
    b.position.set(x, -deep / 2, z);
    b.bakeCurrentTransformIntoVertices();
    return b;
  }).concat([(() => {
    const b = MeshBuilder.CreateBox("heavenDeckBody", { width: 2 * DECK.x, height: 1, depth: 2 * DECK.z - 8 }, scene);
    b.position.y = -deep - 0.5;
    b.bakeCurrentTransformIntoVertices();
    return b;
  })()]), true, true);
  if (body) { body.name = "heavenDeckBody"; body.material = stone; }
  const gold = new StandardMaterial("heavenGold", scene);
  gold.diffuseColor = new Color3(0.78, 0.62, 0.1);
  gold.emissiveColor = new Color3(0.22, 0.17, 0.02);
  gold.specularColor = new Color3(0.2, 0.18, 0.08);
  const k = DECK.kerbW, kh = DECK.kerbH;
  const kerbs = [
    ...alongEdge(1, k, k / 2),
    ...alongEdge(-1, k, k / 2),
    { w: k, d: 2 * DECK.z - 2 * k, x: DECK.x - k / 2, z: 0 },
    { w: k, d: 2 * DECK.z - 2 * k, x: -DECK.x + k / 2, z: 0 },
  ].map((r, i) => {
    const b = MeshBuilder.CreateBox(`heavenKerb${i}`, { width: r.w, height: kh, depth: r.d }, scene);
    b.position.set(r.x, kh / 2, r.z);
    b.bakeCurrentTransformIntoVertices();
    return b;
  });
  const kerb = Mesh.MergeMeshes(kerbs, true, true);
  if (kerb) { kerb.name = "heavenKerb"; kerb.material = gold; }
  return { stone, gold };
}

// Open centre (593, blocker b4; wiki fantasy_good.png centre: where the two cross walkways meet the paving runs on open and
// flat, no block standing on it, only a gold-ringed medallion let into the marble). Spec: the base temple (two
// "Fantasy Good Sanctum_box" slabs at 0,0) is hidden with its collider; in its place, flush with the deck, a round inlay 9 m
// across: a gold ring 0.5 m wide, a white marble disc inside it, a gold eight-point star 6 m across on the disc (two squares
// turned 45 degrees), all 1-3 cm proud, no collider (units walk over it).
function openCentre(scene: Scene, built: Set<unknown>, result: MapBuildResult, stone: StandardMaterial, gold: StandardMaterial): MapBuildResult {
  for (const m of scene.meshes) {
    if (!built.has(m) || !m.name.endsWith("_box")) continue;
    m.computeWorldMatrix(true);
    const c = m.getBoundingInfo().boundingBox.centerWorld;
    if (Math.hypot(c.x, c.z) < 2) m.setEnabled(false);
  }
  const obstacles = result.obstacles.filter((o) => Math.hypot(o.center.x, o.center.z) >= 2);
  const ring = MeshBuilder.CreateTorus("heavenMedallionRing", { diameter: 8.5, thickness: 0.5, tessellation: 48 }, scene);
  ring.scaling.y = 0.06;
  ring.position.y = 0.02;
  ring.material = gold;
  const disc = MeshBuilder.CreateCylinder("heavenMedallionDisc", { diameter: 8.2, height: 0.02, tessellation: 48 }, scene);
  disc.position.y = 0.012;
  disc.material = stone;
  const star = [0, Math.PI / 4].map((a) => {
    const s = MeshBuilder.CreateBox("heavenMedallionStar", { width: 4.2, depth: 4.2, height: 0.03 }, scene);
    s.rotation.y = a;
    s.position.y = 0.03;
    s.bakeCurrentTransformIntoVertices();
    return s;
  });
  const starMesh = Mesh.MergeMeshes(star, true, true);
  if (starMesh) { starMesh.name = "heavenMedallionStar"; starMesh.material = gold; }
  for (const m of [ring, disc, starMesh]) if (m) m.receiveShadows = true;
  return { ...result, obstacles };
}

// Parapets (593, blocker a2; wiki fantasy_good.png: no trees close the field; its deck edges are lined by low white parapet walls
// crenellated in gold, a row of square gold merlons standing on a white wall). Spec: every base ring tree (an unparented
// "trunk" with its crown children) is hidden and its collider dropped; along all four deck edges, on the gold kerb, a white
// wall 0.8 m thick and 1.2 m high, then gold merlons 1.2 m wide, 0.8 m deep, 0.7 m high every 2.4 m. Drawn only (the base
// zones reach past the deck edge; the island's hazards are unchanged).
function parapets(scene: Scene, built: Set<unknown>, result: MapBuildResult, stone: StandardMaterial, gold: StandardMaterial): MapBuildResult {
  const gone: Array<{ x: number; z: number }> = [];
  for (const m of scene.meshes) {
    // 593.3b: the green ball band along both long edges is the base's merged haze treeline (no colliders): it goes whole
    if (built.has(m) && m.name === "hazeTreeline") { m.setEnabled(false); continue; }
    if (!built.has(m) || m.parent || m.name !== "trunk" || !m.isEnabled()) continue;
    m.computeWorldMatrix(true);
    const c = m.getBoundingInfo().boundingBox.centerWorld;
    gone.push({ x: c.x, z: c.z });
    m.setEnabled(false);
  }
  const obstacles = result.obstacles.filter((o) => !gone.some((g) => Math.hypot(o.center.x - g.x, o.center.z - g.z) < 0.6));
  const t = 0.8, h = 1.2, mw = 1.2, mh = 0.7, pitch = 2.4, inset = DECK.kerbW / 2;
  const walls: Mesh[] = [], merlons: Mesh[] = [];
  const box = (into: Mesh[], w: number, hh: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("heavenParapetPart", { width: w, height: hh, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    into.push(b);
  };
  for (const s of [-1, 1]) {
    const x = s * (DECK.x - inset);
    // 595: the long walls follow the stepped edge, merlons every pitch along each run and step
    for (const r of alongEdge(s, t, inset)) {
      box(walls, r.w, h, r.d, r.x, h / 2, r.z);
      const runX = r.w >= r.d, len = runX ? r.w : r.d, n = Math.max(1, Math.round(len / pitch));
      for (let i = 0; i < n; i++) {
        const u = -len / 2 + (i + 0.5) * (len / n);
        if (runX) box(merlons, mw, mh, t, r.x + u, h + mh / 2, r.z);
        else box(merlons, t, mh, mw, r.x, h + mh / 2, r.z + u);
      }
      // the notch is air: a collider fills it
      if (!runX) continue;
      const depth = notchDepth(s, r.x);
      if (depth > 0) obstacles.push({ type: "box", center: new Vector3(r.x, 0, s * (DECK.z - depth / 2)), halfX: r.w / 2, halfZ: depth / 2 });
    }
    box(walls, t, h, 2 * DECK.z, x, h / 2, 0);
    for (let u = -DECK.z + pitch / 2; u <= DECK.z - pitch / 2 + 1e-6; u += pitch) box(merlons, t, mh, mw, x, h + mh / 2, u);
  }
  const wall = Mesh.MergeMeshes(walls, true, true);
  if (wall) { wall.name = "heavenParapet"; wall.material = stone; wall.receiveShadows = true; }
  const merl = Mesh.MergeMeshes(merlons, true, true);
  if (merl) { merl.name = "heavenMerlons"; merl.material = gold; merl.receiveShadows = true; }
  return { ...result, obstacles };
}

// Gate towers (594, blocker b3 and a3; wiki fantasy_good.png, heaven_good.png: at the far corner of each half stands a huge white
// gate: two square tower legs joined high up by a round arch, all trimmed with gold bands and a gold-crenellated top, a tall
// arched stained-glass window (gold frame, warm pale glass) on each leg's outer faces, and a bright blue water channel running
// along the top of the arch and pouring down the outer side of each leg as a waterfall into a small pool; a white spire with a
// gold ring stands on one leg). Spec: towers at (+-40, 30) on the back corners (outside both zones, which end at z 20), the arch
// spanning x, opening along z; legs 6 x 6 m, 19 m high, 6 m apart (gate 18 m wide); arch body x 6 m, from 12.5 to 17.5 m, its
// underside a half-disc opening r 3 (stepped boxes); gold bands 0.4 m at 5, 12 and 19 m, gold merlons 1.1 m every 2 m round both
// leg tops and the arch top; windows 1.8 x 6 m on the legs' -z and outer faces (gold frame 0.25 m, glass unlit (1,.9,.6) with a
// pointed top); water channel 1.6 m wide, 0.4 m deep, along the arch top and down each leg's outer face to a 4 x 3 m pool at its
// foot (2 x 4 m; unlit blue (.3,.7,1.1), out of the glow); a spire 9 m (four-sided, white) with a gold ring on the outer leg. White
// (.93,.95,.98) self .3, gold the kerb's material. Colliders: one box per leg and pool; the gate passage stays open.
const TOWERS = [-40, 40];
function gateTowers(scene: Scene, result: MapBuildResult, stone: StandardMaterial, gold: StandardMaterial): MapBuildResult {
  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.specularColor = Color3.Black();
    m.disableLighting = true;
    return m;
  };
  const white = new StandardMaterial("heavenTowerWhite", scene);
  white.diffuseColor = new Color3(0.93, 0.95, 0.98);
  white.emissiveColor = new Color3(0.28, 0.29, 0.3);
  white.specularColor = Color3.Black();
  const mats = { white, gold, glass: mk("heavenTowerGlass", new Color3(1, 0.9, 0.6)), water: mk("heavenTowerWater", new Color3(0.3, 0.7, 1.1)) };
  const parts: Record<keyof typeof mats, Mesh[]> = { white: [], gold: [], glass: [], water: [] };
  const obstacles = [...result.obstacles];
  const Z = 30, LEG = 6, GAP = 6, H = 19;
  for (const tx of TOWERS) {
    const out = Math.sign(tx);
    const box = (k: keyof typeof mats, w: number, h: number, d: number, x: number, y: number, z: number, ry = 0) => {
      const b = MeshBuilder.CreateBox("heavenTowerPart", { width: w, height: h, depth: d }, scene);
      b.rotation.y = ry;
      b.position.set(tx + x, y, Z + z);
      b.bakeCurrentTransformIntoVertices();
      parts[k].push(b);
    };
    for (const side of [-1, 1]) {
      const lx = side * (GAP + LEG) / 2;
      box("white", LEG, H, LEG, lx, H / 2, 0);
      for (const y of [5, 12, H]) box("gold", LEG + 0.3, 0.4, LEG + 0.3, lx, y, 0);
      for (let u = -LEG / 2 + 0.55; u <= LEG / 2 - 0.5; u += 2) {
        for (const s of [-1, 1]) {
          box("gold", 1.1, 1, 0.5, lx + u, H + 0.7, s * (LEG / 2 - 0.25));
          box("gold", 0.5, 1, 1.1, lx + s * (LEG / 2 - 0.25), H + 0.7, u);
        }
      }
      // stained-glass windows on the front (-z) face and the outer face of the outer leg
      const faces: Array<[number, number, number]> = [[lx, -LEG / 2 - 0.08, 0]];
      if (side === out) faces.push([lx + out * (LEG / 2 + 0.08), 0, Math.PI / 2]);
      for (const [fx, fz, ry] of faces) {
        box("gold", 2.3, 6.5, 0.12, fx, 9, fz, ry);
        box("glass", 1.8, 5.8, 0.16, fx, 8.8, fz, ry);
        for (const s of [-1, 1]) {
          const tip = MeshBuilder.CreateBox("heavenTowerPart", { width: 1.3, height: 0.25, depth: 0.2 }, scene);
          tip.rotation.set(0, ry, s * 0.75);
          tip.position.set(tx + fx + (ry ? 0 : s * 0.45), 12, Z + fz + (ry ? s * 0.45 : 0));
          tip.bakeCurrentTransformIntoVertices();
          parts.gold.push(tip);
        }
      }
      // 595 [P]: a 1.2 m waterfall down each leg's front (-z) face, beside the window
      box("water", 1.2, H, 0.3, lx + Math.sign(lx) * 2.2, H / 2, -LEG / 2 - 0.2);
      obstacles.push({ type: "box", center: new Vector3(tx + lx, 0, Z), halfX: LEG / 2, halfZ: LEG / 2 });
    }
    // the arch body over the gate, its underside a stepped half-disc
    const n = 12, r = GAP / 2;
    for (let i = 0; i < n; i++) {
      const u = -r + (i + 0.5) * (2 * r / n), under = 12.5 - 3 + Math.sqrt(Math.max(0, r * r - u * u));
      box("white", 2 * r / n + 0.02, 17.5 - under, LEG, u, (17.5 + under) / 2, 0);
    }
    box("white", GAP + 0.2, 1.5, LEG, 0, 18.25, 0);
    box("gold", GAP + 0.3, 0.4, LEG + 0.3, 0, 17.5, 0);
    for (let u = -GAP / 2 + 0.5; u <= GAP / 2; u += 2) for (const s of [-1, 1]) box("gold", 1.1, 1, 0.5, u, 19.5, s * (LEG / 2 - 0.25));
    // the water channel: along the arch top and down the outer leg's outer face into a pool
    box("water", GAP + LEG * 2 - 1, 0.4, 1.6, 0, H + 0.25, 0);
    const ox = out * (GAP / 2 + LEG + 0.25);
    box("water", 0.5, H, 1.6, ox, H / 2, 0);
    box("white", 2, 0.6, 4, ox + out * 0.9, 0.3, 0);
    box("water", 1.5, 0.08, 3.4, ox + out * 0.9, 0.62, 0);
    obstacles.push({ type: "box", center: new Vector3(tx + ox + out * 0.9, 0, Z), halfX: 1, halfZ: 2 });
    // white spire with a gold ring on the outer leg
    const sx = tx + out * (GAP + LEG) / 2;
    const spire = MeshBuilder.CreateCylinder("heavenTowerPart", { diameterBottom: 2.4, diameterTop: 0.1, height: 9, tessellation: 4 }, scene);
    spire.rotation.y = Math.PI / 4;
    spire.position.set(sx, H + 4.5, Z);
    spire.bakeCurrentTransformIntoVertices();
    parts.white.push(spire);
    const ring = MeshBuilder.CreateTorus("heavenTowerPart", { diameter: 3.2, thickness: 0.18, tessellation: 20 }, scene);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(sx, H + 7, Z);
    ring.bakeCurrentTransformIntoVertices();
    parts.gold.push(ring);
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `heavenTower_${key}`;
    merged.material = mats[key];
    merged.receiveShadows = key === "white" || key === "gold";
    merged.isPickable = false;
    if (key === "glass" || key === "water") glow?.addExcludedMesh(merged);
  }
  void stone;
  return { ...result, obstacles };
}

// Heaven sky (594, blocker a5; heaven_good.png, wiki fantasy_good.png: a clear, fairly saturated pale-blue sky, paler toward the
// horizon, with big heaped white cloud banks standing round and below the island; no grey haze, no mountain range or second
// island behind it). Spec: the base's far range and second slab ("mountain*") and its small clouds ("cloud*") hidden; the kit
// sky (simKit paleSky: untoned gradient sphere, fog and clear colour the horizon tone) with zenith sRGB (112,182,228) and horizon
// (198,224,240) over 0.3 rad; five kit cloud banks behind and beside the field at z 160-230, y -30..0 (in the island shot's sky
// band), 150-210 m wide. Fog and clear colour are put back on dispose.
function heavenSky(scene: Scene, built: Set<unknown>): () => void {
  for (const m of scene.meshes) if (built.has(m) && /^(mountain|cloud)/.test(m.name)) m.setEnabled(false);
  const restore = paleSky(scene, [112, 182, 228], [198, 224, 240], 0.3);
  cloudBanks(scene, [[-170, -18, 200, 180], [10, -6, 230, 210], [180, -22, 195, 170], [-260, -28, 90, 150], [260, -30, 100, 150]]);
  return restore;
}

// Viaduct underside (595, blocker a4; wiki fantasy_good.png lower left, heaven_good.png: under the deck's edge no dark spikes
// hang; the rim is a white viaduct, a row of tall round-arched bays in shade along every face, and below it clusters of pale
// grey basalt columns hang in steps, teal trees growing out of their sides). Spec: the base crags (islandCliff) hidden; on the
// rim wall's outer face (12 m deep) a bay every 6 m: an arch opening 4 m wide, 6.5 m tall with a round head, cool shade
// (.36,.44,.58) self .35, 6 cm proud of the face, its top 1.6 m under the deck; under the deck floor (y -12.5) clusters of
// six-sided columns 2-3.4 m across, 3-15 m long, longest toward the middle, grey (.62,.66,.72) self .25, flat shaded; teal
// low-poly crowns on eight of the clusters' outer columns. Drawn only.
function viaductUnderside(scene: Scene, built: Set<unknown>, stone: StandardMaterial): void {
  for (const m of scene.meshes) if (built.has(m) && m.name.startsWith("islandCliff")) m.setEnabled(false);
  const shade = new StandardMaterial("heavenArchShade", scene);
  shade.diffuseColor = new Color3(0.36, 0.44, 0.58);
  shade.emissiveColor = new Color3(0.36, 0.44, 0.58).scale(0.35);
  shade.specularColor = Color3.Black();
  const basalt = new StandardMaterial("heavenBasalt", scene);
  basalt.diffuseColor = new Color3(0.62, 0.66, 0.72);
  basalt.emissiveColor = new Color3(0.62, 0.66, 0.72).scale(0.25);
  basalt.specularColor = Color3.Black();
  const leaf = new StandardMaterial("heavenUnderLeaf", scene);
  leaf.diffuseColor = new Color3(0.2, 0.62, 0.58);
  leaf.emissiveColor = new Color3(0.06, 0.2, 0.19);
  leaf.specularColor = Color3.Black();
  const arches: Mesh[] = [], cols: Mesh[] = [], crowns: Mesh[] = [];
  const W = 4, H = 6.5, top = -1.6;
  /** Arch bays along a run from (x0,z0) to (x1,z1), facing outward along (nx,nz). */
  const run = (x0: number, z0: number, x1: number, z1: number, nx: number, nz: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(len / 6);
    if (n < 1) return;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t + nx * 0.06, z = z0 + (z1 - z0) * t + nz * 0.06, yaw = Math.atan2(nx, nz);
      const body = MeshBuilder.CreateBox("heavenArch", { width: W, height: H - W / 2, depth: 0.1 }, scene);
      body.rotation.y = yaw;
      body.position.set(x, top - W / 2 - (H - W / 2) / 2, z);
      body.bakeCurrentTransformIntoVertices();
      const head = MeshBuilder.CreateCylinder("heavenArch", { diameter: W, height: 0.1, tessellation: 16, arc: 0.5 }, scene);
      head.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      head.bakeCurrentTransformIntoVertices();
      head.rotation.y = yaw;
      head.position.set(x, top - W / 2, z);
      head.bakeCurrentTransformIntoVertices();
      arches.push(body, head);
    }
  };
  for (const s of [-1, 1]) {
    for (const g of edgeSegments(s)) if (g.z0 === g.z1) run(g.x0, g.z0, g.x1, g.z1, 0, s);
    run(s * DECK.x, -DECK.z, s * DECK.x, DECK.z, s, 0);
  }
  let seed = 0x6a77;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const floorY = -PIT_DEPTH - 2.5;
  let k = 0;
  for (let cx = -44; cx <= 44; cx += 11) for (let cz = -30; cz <= 30; cz += 12) {
    const inner = 1 - Math.max(Math.abs(cx) / 52, Math.abs(cz) / 40);
    const n = 3 + Math.floor(rnd() * 3);
    for (let j = 0; j < n; j++, k++) {
      const d = 2 + rnd() * 1.4, len = 3 + inner * 9 + rnd() * 4;
      const x = cx + (rnd() - 0.5) * 7, z = cz + (rnd() - 0.5) * 7;
      const c = MeshBuilder.CreateCylinder("heavenBasaltCol", { height: len, diameterTop: d, diameterBottom: d * 0.85, tessellation: 6 }, scene);
      c.position.set(x, floorY - len / 2 + 0.4, z);
      c.rotation.y = rnd();
      c.bakeCurrentTransformIntoVertices();
      cols.push(c);
      if (j === 0 && (Math.abs(cx) > 40 || Math.abs(cz) > 26) && crowns.length < 24) {
        const ox = Math.sign(cx || 1) * 1.6, oz = Math.sign(cz || 1) * 1.6;
        for (let b = 0; b < 3; b++) {
          const crown = MeshBuilder.CreateIcoSphere("heavenUnderCrown", { radius: 1.4 + rnd(), subdivisions: 1 }, scene);
          crown.position.set(x + ox + (rnd() - 0.5) * 2, floorY - 1.5 - b * 0.8, z + oz + (rnd() - 0.5) * 2);
          crown.bakeCurrentTransformIntoVertices();
          crowns.push(crown);
        }
      }
    }
  }
  for (const [parts, mat, name] of [[arches, shade, "heavenArches"], [cols, basalt, "heavenBasaltColumns"], [crowns, leaf, "heavenUnderCrowns"]] as const) {
    const merged = Mesh.MergeMeshes(parts, true, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.isPickable = false;
  }
  void stone;
}

// Side islets (595, blocker b5; card Overview, heaven_good.png top left: small floating islands drift beside the main deck, each
// a little paved white platform with a gold kerb on a hanging cone of pale basalt, a teal tree or a white spire on it). Spec:
// five islets 9-15 m across beside the deck (x -74 z 18, x -70 z -26, x 76 z -12, x 70 z 30, x -20 z 64 behind), tops 2-9 m
// above or below the deck, each an eight-sided marble slab 1.2 m thick with a gold kerb, a basalt cone under it 0.9 of its
// width reaching 0.9 of its width down, flat shaded; a teal tree (two crowns) on three, a white spire on two. Drawn only.
function sideIslets(scene: Scene, stone: StandardMaterial, gold: StandardMaterial): void {
  const basalt = new StandardMaterial("heavenIsletBasalt", scene);
  basalt.diffuseColor = new Color3(0.62, 0.66, 0.72);
  basalt.emissiveColor = new Color3(0.62, 0.66, 0.72).scale(0.25);
  basalt.specularColor = Color3.Black();
  const leaf = new StandardMaterial("heavenIsletLeaf", scene);
  leaf.diffuseColor = new Color3(0.2, 0.62, 0.58);
  leaf.emissiveColor = new Color3(0.06, 0.2, 0.19);
  leaf.specularColor = Color3.Black();
  const parts: { slab: Mesh[]; kerb: Mesh[]; rock: Mesh[]; leaf: Mesh[] } = { slab: [], kerb: [], rock: [], leaf: [] };
  const put = (k: keyof typeof parts, m: Mesh, x: number, y: number, z: number) => { m.position.set(x, y, z); m.bakeCurrentTransformIntoVertices(); parts[k].push(m); };
  for (const [x, y, z, w, tree] of [[-74, 4, 18, 13, 1], [-70, -7, -26, 10, 0], [76, 6, -12, 15, 1], [70, -4, 30, 9, 0], [-20, 9, 64, 12, 1]] as const) {
    put("slab", MeshBuilder.CreateCylinder("heavenIslet", { diameter: w, height: 1.2, tessellation: 8 }, scene), x, y - 0.6, z);
    put("kerb", MeshBuilder.CreateCylinder("heavenIsletKerb", { diameter: w + 0.4, height: 0.35, tessellation: 8 }, scene), x, y - 1.25, z);
    put("rock", MeshBuilder.CreateCylinder("heavenIsletCone", { diameterTop: w * 0.9, diameterBottom: w * 0.12, height: w * 0.9, tessellation: 7 }, scene), x, y - 1.4 - w * 0.45, z);
    if (tree) {
      put("rock", MeshBuilder.CreateCylinder("heavenIsletTrunk", { diameterTop: 0.35, diameterBottom: 0.6, height: 4, tessellation: 5 }, scene), x, y + 2, z);
      put("leaf", MeshBuilder.CreateIcoSphere("heavenIsletCrown", { radius: 2.4, subdivisions: 1 }, scene), x, y + 4.6, z);
      put("leaf", MeshBuilder.CreateIcoSphere("heavenIsletCrown", { radius: 1.7, subdivisions: 1 }, scene), x + 1.6, y + 3.4, z - 1);
    } else {
      put("slab", MeshBuilder.CreateCylinder("heavenIsletSpire", { diameterTop: 0, diameterBottom: 1.6, height: 9, tessellation: 4 }, scene), x, y + 4.5, z);
    }
  }
  const mats = { slab: stone, kerb: gold, rock: basalt, leaf };
  for (const k of Object.keys(parts) as Array<keyof typeof parts>) {
    const merged = Mesh.MergeMeshes(parts[k], true, true);
    if (!merged) continue;
    merged.name = `heavenIslets_${k}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[k];
    merged.isPickable = false;
  }
}

export function buildFantasyGood(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const restoreSky = heavenSky(scene, built);
  const { stone, gold } = marbleDeck(scene, built);
  viaductUnderside(scene, built, stone);
  sideIslets(scene, stone, gold);
  const opened = openCentre(scene, built, result, stone, gold);
  const walled = parapets(scene, built, opened, stone, gold);
  const done = gateTowers(scene, pits(scene, built, walled, stone, gold), stone, gold);
  return { ...done, dispose: () => { restoreSky(); done.dispose?.(); } };
}
