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
import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture, Vector3, VertexBuffer, VertexData, type Scene } from "@babylonjs/core";
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
// Staggered pits (596, blocker b1; wiki fantasy_good.png: not four equal squares round a plus-shaped cross but five pits of
// different sizes along the two long rims, a large tree pit at the front left, a large open pit at the front right, small
// obelisk pits between and behind, so the paving between them runs as a zigzag walkway). Spec: front rim (z < 0) a tree pit
// x -34..-12 z -32..-12 (22 x 20), an obelisk pit x 2..12 z -30..-19 (10 x 11), an open pit x 22..40 z -32..-15 (18 x 17);
// back rim a tree pit x -26..-8 z 13..30 (18 x 17) and an obelisk pit x 6..16 z 19..31 (10 x 12); all at least 4 m inside
// the stepped edges and clear of the tower legs (x +-31..49, z 27..33). Tree pits keep two teal trees and a spire, open and
// obelisk pits one spire on a plinth. The walkway between them steps from 24 m wide (x -12..2) to 31 m (x 12..22).
type Pit = { x0: number; x1: number; z0: number; z1: number; kind: "tree" | "obelisk" | "open" };
// [R] Quadrant wells (606, b plateau; CONFIRM 595/601 b1 "four large quadrant wells leaving a defined cross of walkways,
// rather than six small holes surrounded by a broad continuous plaza" (the 596 layout had five); b2 "gates occupy opposing ends
// of the field across the well-and-walkway layout"; wiki fantasy_good.png: big sunken wells fill the quarters, the paving left
// is a cross of walkways and a rim, a gate at the back-left and another at the front-right). Spec: four wells, one per
// quarter, |x| 6..27, |z| 6..31 (21 x 25 m, 10 m deep): the cross walkways are 12 m wide (|x| < 6 and |z| < 6), the rim
// 9 m and more; both zones (|x| 29..59, |z| <= 20) stay paving. Back-left and front-left tree wells, back-right obelisk,
// front-right open (the corrupted obelisk). The gates move to opposite corners (-40, 30) and (40, -30); their channels
// run to the nearest well, the front spills from the front wells to the front edge.
const PITS: Pit[] = [
  { x0: -27, x1: -6, z0: -31, z1: -6, kind: "tree" },
  { x0: 6, x1: 27, z0: -31, z1: -6, kind: "open" },
  { x0: -27, x1: -6, z0: 6, z1: 31, kind: "tree" },
  { x0: 6, x1: 27, z0: 6, z1: 31, kind: "obelisk" },
];
const PIT_DEPTH = 10;
const inPit = (x: number, z: number, pad = 0) => PITS.some((p) => x > p.x0 - pad && x < p.x1 + pad && z > p.z0 - pad && z < p.z1 + pad);

// Stepped edge (595, blocker b1; wiki fantasy_good.png: the deck's long sides do not run straight but step in and out in
// square notches, the gold kerb and the crenellated parapet following every step). Spec: along the front (z -40) the edge
// steps in 4 m over x -36..-20, -4..12 and 28..44 (16 m bays, 16 m apart), the back edge the same turned 180 degrees; the
// corners and the tower legs (z 27..33) and pits (to z 30) untouched; deck top, rim wall, kerb and parapet follow the steps;
// each notch is a box collider (nobody walks onto the air), outside both zones (|z| <= 20).
const EDGE_STEPS: Array<[number, number, number]> = [[-36, -20, 4], [-4, 12, 4], [28, 44, 4]];
/** How far the long edge on side s (-1 front, +1 back) steps in at x. */
const notchDepth = (s: number, x: number) => { if(s>0&&x>=12&&x<=28)return 0; const u = s < 0 ? x : -x; return EDGE_STEPS.find(([a, b]) => u > a && u < b)?.[2] ?? 0; };
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
  const xs = [...new Set([...PITS.flatMap((p) => [p.x0, p.x1]), ...EDGE_XS])].sort((a, b) => a - b), out: Array<{ x0: number; x1: number; z0: number; z1: number }> = [];
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
    const trees: Array<[number, number, number]> = p.kind === "tree" ? [[0.28, 0.26, 1], [-0.12, -0.22, 0.85]] : [];
    for (const [ox, oz, s] of trees) {
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
    // a tree pit's spire stands by its inner corner, an obelisk or open pit's in its middle
    const spx = p.kind === "tree" ? cx - sx * 0.3 * w : cx, spz = p.kind === "tree" ? cz - sz * 0.25 * dz : cz;
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
    const b = MeshBuilder.CreateBox("heavenDeckBody", { width: w, height: 1.6, depth: dd }, scene);
    b.position.set(x, -0.8, z);
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
// [R] Multi-bay gates (606, a plateau; CONFIRM 601 a1 "massive multi-bay white-and-gold gates with substantial stepped buttresses
// and broad gold arch faces, rather than thin single-opening rectangular portals"; b2 "gates occupy opposing ends of the field
// across the well-and-walkway layout, rather than both portals standing together along the same rear edge"; wiki
// fantasy_good.png: one gate at the back-left, the other at the front-right, each a broad white gatehouse of a tall central
// arch between lower side arches, heavy piers, stepped buttresses at its ends, every arch framed in broad gold, a raised
// crenellated centre with a gold gable, crystal spires over the piers, water running off it). Spec: gates at (-40, 30) and
// (40, -30) (diagonally opposite, outside both zones), each spanning 25 m along x, 7 m deep: a centre bay 6.4 m wide, 15 m to
// its springing, round head; inner piers 2 m; side bays 2.8 m, 10 m to the springing; outer piers 2 m; at each end a stepped
// buttress (1.5 m x 16 m, then 1 m x 8 m, each a metre deeper); body 24 m high, the centre raised to 27 m with two nested gold
// gable crests; broad gold arch rings (tube r .45) round every opening on both faces with gold jambs; gold bands at 8 and 24 m on
// the piers; gold merlons along every top; a stained-glass lancet on each outer pier's two faces; a crystal spire pair and a
// gold halo on each outer pier; a water channel along the top that pours down the field face of the pier nearest its well
// (waterfalls() carries it on to the well). Colliders: piers and buttresses; the three bays stay open.
const GATES = [{ x: -40, z: 30 }, { x: 40, z: -30 }];
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
  const mats = { white, gold, glass: mk("heavenTowerGlass", new Color3(1, 0.9, 0.6)), water: mk("heavenTowerWater", new Color3(0.05, 0.55, 0.9)), crystal: mk("heavenTowerCrystal", new Color3(0.25, 0.62, 1.05)), foam: mk("heavenTowerFoam", new Color3(0.92, 0.97, 1)) };
  // 606 r2: the water and foam keep their colour through the pale fog, so they read saturated from across the map
  mats.water.fogEnabled = false;
  mats.foam.fogEnabled = false;
  const parts: Record<keyof typeof mats, Mesh[]> = { white: [], gold: [], glass: [], water: [], crystal: [], foam: [] };
  const obstacles = [...result.obstacles];
  const D = 7, H = 24, HC = 27;
  for (const g of GATES) {
    const field = -Math.sign(g.z), well = -Math.sign(g.x);
    const box = (k: keyof typeof mats, w: number, h: number, d: number, u: number, y: number, v: number) => {
      const b = MeshBuilder.CreateBox("heavenTowerPart", { width: w, height: h, depth: d }, scene);
      b.position.set(g.x + u, y, g.z + v);
      b.bakeCurrentTransformIntoVertices();
      parts[k].push(b);
    };
    const tube = (k: keyof typeof mats, pts: Array<[number, number]>, v: number, r: number) => {
      const t = MeshBuilder.CreateTube("heavenGateGold", { path: pts.map(([u, y]) => new Vector3(g.x + u, y, g.z + v)), radius: r, tessellation: 4, cap: Mesh.CAP_ALL }, scene);
      t.bakeCurrentTransformIntoVertices();
      parts[k].push(t);
    };
    /** an arch bay between u0 and u1: the body over it with a stepped round head, gold ring and jambs on both faces */
    const bay = (u0: number, u1: number, spring: number, top: number) => {
      const r = (u1 - u0) / 2, c = (u0 + u1) / 2, n = 10;
      for (let i = 0; i < n; i++) {
        const u = -r + (i + 0.5) * (2 * r / n), under = spring + Math.sqrt(Math.max(0, r * r - u * u));
        box("white", 2 * r / n + 0.02, top - under, D, c + u, (top + under) / 2, 0);
      }
      for (const v of [-D / 2 - 0.12, D / 2 + 0.12]) {
        tube("gold", Array.from({ length: 15 }, (_, j) => { const a = Math.PI * j / 14; return [c + Math.cos(a) * (r + 0.3), spring + Math.sin(a) * (r + 0.3)] as [number, number]; }), v, 0.45);
        for (const s of [-1, 1]) tube("gold", [[c + s * (r + 0.3), 0.2], [c + s * (r + 0.3), spring]], v, 0.35);
      }
    };
    // piers
    for (const s of [-1, 1]) {
      for (const [uc, w] of [[s * 4.2, 2], [s * 9, 2]] as const) {
        box("white", w, H, D, uc, H / 2, 0);
        for (const y of [8, H]) box("gold", w + 0.3, 0.45, D + 0.3, uc, y, 0);
        obstacles.push({ type: "box", center: new Vector3(g.x + uc, 0, g.z), halfX: w / 2, halfZ: D / 2 });
      }
      // stepped buttress at the end
      box("white", 1.5, 16, D + 1, s * 10.75, 8, 0);
      box("gold", 1.8, 0.4, D + 1.3, s * 10.75, 16, 0);
      box("white", 1, 8, D + 2, s * 12, 4, 0);
      box("gold", 1.3, 0.4, D + 2.3, s * 12, 8, 0);
      obstacles.push({ type: "box", center: new Vector3(g.x + s * 11.25, 0, g.z), halfX: 1.25, halfZ: D / 2 + 1 });
      // side bay
      bay(s > 0 ? 5.2 : -8, s > 0 ? 8 : -5.2, 10, H);
      // lancet on the outer pier's two faces
      for (const v of [-D / 2 - 0.1, D / 2 + 0.1]) {
        box("glass", 1.2, 8, 0.12, s * 9, 15, v);
        tube("gold", [[s * 9 - 0.75, 11], [s * 9 - 0.75, 19], [s * 9, 20.4], [s * 9 + 0.75, 19], [s * 9 + 0.75, 11], [s * 9 - 0.75, 11]], v + Math.sign(v) * 0.06, 0.16);
      }
      // crystal spires and a halo on the outer pier
      for (const [du, h, d] of [[0, 14, 2.2], [s * 0.9, 8, 1.3]] as const) {
        const sp = MeshBuilder.CreateCylinder("heavenTowerPart", { diameterBottom: d, diameterTop: 0, height: h, tessellation: 5 }, scene);
        sp.position.set(g.x + s * 9 + du, H + 0.4 + h / 2, g.z);
        sp.rotation.y = Math.PI / 4;
        sp.bakeCurrentTransformIntoVertices();
        parts.crystal.push(sp);
      }
      const ring = MeshBuilder.CreateTorus("heavenTowerPart", { diameter: 2.8, thickness: 0.16, tessellation: 20 }, scene);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(g.x + s * 9, H + 11, g.z);
      ring.bakeCurrentTransformIntoVertices();
      parts.gold.push(ring);
    }
    // centre bay, raised centre and its gold gables
    bay(-3.2, 3.2, 15, HC);
    box("white", 10.4, HC - H, D, 0, (H + HC) / 2, 0);
    box("gold", 10.7, 0.45, D + 0.3, 0, HC, 0);
    for (const v of [-D / 2 - 0.15, D / 2 + 0.15]) for (const dy of [0, -1.3]) tube("gold", [[-5.6, HC + dy + 0.3], [0, HC + 4.5 + dy], [5.6, HC + dy + 0.3]], v, 0.3);
    // merlons along the tops (outer runs at H, centre at HC)
    for (let u = -10 + 0.6; u <= 10; u += 2) {
      const top = Math.abs(u) < 5.2 ? HC : H;
      for (const v of [-D / 2 + 0.25, D / 2 - 0.25]) box("gold", 1.1, 1, 0.5, u, top + 0.7, v);
    }
    // water: a channel along the top, pouring down the field face of the pier on the well side
    // 607 [R] a2 (CRITIC 606 r3: crest hidden between the merlons, curtains read as pale glass, falls not seen in _top): the
    // water rides on top of the merlons of the well-side half as an opaque cyan strip with foam edges, runs past the end
    // buttress and drops the gate's height as a curtain beside it; a second sheet runs down the camera-facing (-z) face of the
    // end buttress. Opaque deep cyan (emissive .05,.55,.9), unlit, out of the fog; foam edges define every sheet.
    box("water", 8, 0.3, 3, well * 9, H + 1.45, 0);
    for (const e of [-1.6, 1.6]) box("foam", 8, 0.35, 0.3, well * 9, H + 1.5, e);
    box("water", 0.35, H + 1.6, 3, well * 13.1, (H + 1.6) / 2, 0);
    box("foam", 0.6, 0.4, 3.4, well * 13.1, H + 1.6, 0);
    for (const e of [-1.6, 1.6]) box("foam", 0.45, H + 1.6, 0.25, well * 13.1, (H + 1.6) / 2, e);
    // 608 [R] a2 (CRITIC 607 r3: the stream must leave the gate where it starts): a 3 m sheet down the end buttress's field-side
    // face straight into the deck channel's head (waterfalls()), so gate, channel and cascade read as one stream; the right
    // gate keeps a second sheet on its camera-facing (-z) face. Foam only at the lips.
    for (const v of field < 0 ? [-1] : [1, -1]) {
      box("water", 3, H, 0.3, well * 11.8, H / 2, v * (D / 2 + 1.25));
      box("foam", 3.4, 0.45, 0.7, well * 11.8, H + 0.2, v * (D / 2 + 1.2));
      box("foam", 3.4, 0.2, 0.9, well * 11.8, 0.12, v * (D / 2 + 1.5));
    }
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `heavenTower_${key}`;
    merged.material = mats[key];
    merged.receiveShadows = key === "white" || key === "gold";
    merged.isPickable = false;
    // 608: every gate part out of the glow pass: the white and gold stone's bloom laid a pale veil over the gate water
    glow?.addExcludedMesh(merged);
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
  // 600 a1: real open bays, not dark arch silhouettes pasted on a solid rim.
  // Each 7m bay has a 5.4m opening, semicircular stone head and two piers
  // down to -12.5m. Basalt fingers hang a further 12-27m, like the references.
  const arches: Mesh[] = [], cols: Mesh[] = [], crowns: Mesh[] = [];
  const W = 5.4;
  /** Arch bays along a run from (x0,z0) to (x1,z1), facing outward along (nx,nz). */
  const run = (x0: number, z0: number, x1: number, z1: number, nx: number, nz: number, top = -1.6) => {
    const spring = top - W / 2, foot = top - 10.9;
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.floor(len / 7));
    if (n < 1) return;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t + nx * 0.06, z = z0 + (z1 - z0) * t + nz * 0.06, yaw = Math.atan2(nx, nz);
      const tangent = new Vector3(nz, 0, -nx), centre = new Vector3(x, spring, z);
      for (const side of [-1, 1]) {
        const p = centre.add(tangent.scale(side * (W / 2 + 0.55)));
        const pier = MeshBuilder.CreateBox("heavenArcadePier", { width: 1.1, height: spring - foot, depth: 1.3 }, scene);
        pier.rotation.y = yaw; pier.position.set(p.x, (spring + foot) / 2, p.z);
        pier.bakeCurrentTransformIntoVertices(); arches.push(pier);
      }
      const path = Array.from({ length: 13 }, (_, j) => {
        const a = Math.PI * j / 12;
        return centre.add(tangent.scale(Math.cos(a) * (W / 2 + 0.25))).add(new Vector3(0, Math.sin(a) * W / 2, 0));
      });
      const head = MeshBuilder.CreateTube("heavenArcadeHead", { path, radius: 0.65, tessellation: 4, cap: Mesh.CAP_ALL }, scene);
      head.bakeCurrentTransformIntoVertices(); arches.push(head);
    }
  };
  for (const s of [-1, 1]) {
    // The lower front walkway masks a deck-edge arch head. Its own outside
    // edge now owns the complete arcade: crown under the slab at -2.6m,
    // spring at -5.9m and piers reaching -14.1m, six metres forward.
    if (s > 0) for (const g of edgeSegments(s)) if (g.z0 === g.z1) run(g.x0, g.z0, g.x1, g.z1, 0, s);
    run(s * DECK.x, -DECK.z, s * DECK.x, DECK.z, s, 0);
    run(s * DECK.x, -DECK.z - 6, s * DECK.x, -DECK.z, s, 0, -3.2);
  }
  run(-DECK.x, -DECK.z - 6, DECK.x, -DECK.z - 6, 0, -1, -3.2);
  let seed = 0x6a77;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const floorY = -PIT_DEPTH - 2.5;
  let k = 0;
  for (let cx = -44; cx <= 44; cx += 11) for (let cz = -30; cz <= 30; cz += 12) {
    const inner = 1 - Math.max(Math.abs(cx) / 52, Math.abs(cz) / 40);
    const n = 3 + Math.floor(rnd() * 3);
    for (let j = 0; j < n; j++, k++) {
      const d = 2.4 + rnd() * 2, len = 12 + inner * 10 + rnd() * 5;
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
  for (const [parts, mat, name] of [[arches, stone, "heavenArches"], [cols, basalt, "heavenBasaltColumns"], [crowns, leaf, "heavenUnderCrowns"]] as const) {
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

// Pit shafts (597, blocker a4; wiki fantasy_good.png: each pit is a deep dark shaft, its walls navy in shadow, and out of its
// depths rise clusters of grey basalt columns of mixed heights, the trees and obelisks standing on them; not a shallow box with
// a bright flat floor). Spec: the floor material dark (.08,.1,.16) self (.02,.025,.04); a navy liner (.16,.2,.3) self .08 10 cm
// inside each wall from the kerb down to the floor; per pit 6-10 six-sided columns (r 1-2.1 m, slightly tapered, flat tops)
// clustered round the pit's trees (tree pits) or its spire (others), 1.5-4.5 m from them, tops 1.2-6.5 m below the deck,
// pale grey-blue (.55,.62,.72) self .3, flat shaded. Drawn only (the pit collider is unchanged).
function pitShafts(scene: Scene): void {
  const floor = scene.getMaterialByName("heavenPitFloor") as StandardMaterial | null;
  if (floor) { floor.diffuseColor = new Color3(0.08, 0.1, 0.16); floor.emissiveColor = new Color3(0.02, 0.025, 0.04); }
  const navy = new StandardMaterial("heavenPitLiner", scene);
  navy.diffuseColor = new Color3(0.16, 0.2, 0.3);
  navy.emissiveColor = navy.diffuseColor.scale(0.08);
  navy.specularColor = Color3.Black();
  const basalt = new StandardMaterial("heavenPitBasalt", scene);
  basalt.diffuseColor = new Color3(0.55, 0.62, 0.72);
  basalt.emissiveColor = basalt.diffuseColor.scale(0.3);
  basalt.specularColor = Color3.Black();
  let seed = 0x51a7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const liners: Mesh[] = [], cols: Mesh[] = [];
  const d = PIT_DEPTH, t = 0.6, e = 0.1;
  for (const p of PITS) {
    const cx = (p.x0 + p.x1) / 2, cz = (p.z0 + p.z1) / 2, w = p.x1 - p.x0, dz = p.z1 - p.z0;
    for (const [lw, ld, lx, lz] of [
      [w - 2 * t, 0.05, cx, p.z0 + t + e], [w - 2 * t, 0.05, cx, p.z1 - t - e],
      [0.05, dz - 2 * t, p.x0 + t + e, cz], [0.05, dz - 2 * t, p.x1 - t - e, cz],
    ]) {
      const b = MeshBuilder.CreateBox("heavenPitLiner", { width: lw, height: d - 0.4, depth: ld }, scene);
      b.position.set(lx, -d / 2 - 0.2, lz);
      b.bakeCurrentTransformIntoVertices();
      liners.push(b);
    }
    // the cluster's centres: the trees' feet (as pits() places them) or the spire
    const sx = Math.sign(cx), sz = Math.sign(cz);
    const hubs: Array<[number, number]> = p.kind === "tree"
      ? [[cx + sx * 0.28 * w, cz + sz * 0.26 * dz], [cx - sx * 0.12 * w, cz - sz * 0.22 * dz]]
      : [[cx, cz]];
    const n = Math.min(10, Math.max(6, Math.round((w * dz) / 40)));
    for (let i = 0; i < n; i++) {
      const [hx, hz] = hubs[i % hubs.length];
      const a = rnd() * 6.28, rr = 1.5 + rnd() * 3;
      const r = 1 + rnd() * 1.1;
      const x = Math.max(p.x0 + t + r, Math.min(p.x1 - t - r, hx + Math.cos(a) * rr));
      const z = Math.max(p.z0 + t + r, Math.min(p.z1 - t - r, hz + Math.sin(a) * rr));
      const top = -1.2 - rnd() * 5.3, h = d + top;
      const c = MeshBuilder.CreateCylinder("heavenPitBasalt", { height: h, diameterTop: 2 * r * 0.9, diameterBottom: 2 * r, tessellation: 6 }, scene);
      c.rotation.y = rnd() * 1.05;
      c.position.set(x, -d + h / 2, z);
      c.bakeCurrentTransformIntoVertices();
      cols.push(c);
    }
  }
  for (const [parts, mat, name] of [[liners, navy, "heavenPitLiners"], [cols, basalt, "heavenPitBasalt"]] as const) {
    const m = Mesh.MergeMeshes(parts, true, true);
    if (!m) continue;
    m.name = name;
    m.convertToFlatShadedMesh();
    m.material = mat;
    m.receiveShadows = true;
    m.isPickable = false;
  }
}

// Waterfalls (597, blocker a3; wiki fantasy_good.png, card Overview "several waterfalls": bright blue water runs in channels
// down the gate faces and across the paving, pouring over the lips of the pits and off the deck's edge). Spec: from the foot of
// each gate's inner-leg waterfall (x +-31.8, z 26.8) a channel 1.8 m wide, 3 cm proud between 15 cm white lips, runs -z then
// across to the nearest back pit (left: z 22 to the tree pit's x -26; right: z 24 to the obelisk pit's x 16) and falls 2.4 m
// wide down that pit's inner wall to its floor; at the front three channels run from the front pits' kerbs (x -24, 7, 31) to
// the stepped edge (z -36) and fall 30 m down the rim wall's face (2.6 m wide, a white foam lip at the top). Water unlit
// (.25,.62,1.05), foam (.9,.96,1), both out of the glow. Drawn only: no hazards, units walk over the channels.
function waterfalls(scene: Scene): void {
  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.Black();
    m.emissiveColor = c;
    m.specularColor = Color3.Black();
    m.disableLighting = true;
    return m;
  };
  // 606 r2 [R] a2: saturated cyan, out of the fog (it read pale sky-blue against the marble)
  const water = mk("heavenFallWater", new Color3(0.05, 0.55, 0.9)), foam = mk("heavenFallFoam", new Color3(0.92, 0.97, 1));
  water.fogEnabled = false;
  foam.fogEnabled = false;
  const lipMat = scene.getMaterialByName("heavenStone") as StandardMaterial;
  const parts: { water: Mesh[]; foam: Mesh[]; lip: Mesh[]; rock: Mesh[] } = { water: [], foam: [], lip: [], rock: [] };
  const box = (k: keyof typeof parts, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("heavenFallPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    if (k === "water") {
      const p = b.getVerticesData(VertexBuffer.PositionKind) ?? [], colours: number[] = [];
      for (let i = 0; i < p.length; i += 3) colours.push(1, 1, 1, Math.max(0, Math.min(1, (p[i + 1] + 30) / 6)));
      b.setVerticesData(VertexBuffer.ColorKind, colours); b.hasVertexAlpha = true;
    }
    parts[k].push(b);
  };
  /** A deck channel from (x0,z0) to (x1,z1), axis-aligned. */
  const channel = (x0: number, z0: number, x1: number, z1: number, W = 1.8) => {
    const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0), len = alongX ? Math.abs(x1 - x0) : Math.abs(z1 - z0);
    const mx = (x0 + x1) / 2, mz = (z0 + z1) / 2;
    box("water", alongX ? len + W : W, 0.06, alongX ? W : len + W, mx, 0.03, mz);
    for (const s of [-1, 1]) box("lip", alongX ? len + W : 0.2, 0.15, alongX ? 0.2 : len + W, mx + (alongX ? 0 : s * (W / 2 + 0.1)), 0.075, mz + (alongX ? s * (W / 2 + 0.1) : 0));
  };
  // 606 [R] a2: from each gate's spill a 3.5 m channel runs to the nearest well and drops down a wall of it as a 6 m cascade:
  // one unbroken sheet (606 r2: the foam ledges read as a white stair), a foam lip at the top and a cyan pool spreading on the well floor. Left gate:
  // down the back-left well's outer (x -27) wall; right gate: along the cross walkway to the front-right well's far (z -6)
  // wall, which faces the cameras.
  /** a cascade down a well wall: ax the wall's fixed axis, at its coordinate, s the step into the well, c the centre along it */
  const cascade = (ax: "x" | "z", at: number, s: number, c: number, W = 6) => {
    const put = (k: "water" | "foam", n: number, h: number, w: number, off: number, y: number) =>
      ax === "x" ? box(k, n, h, w, at + s * off, y, c) : box(k, w, h, n, c, y, at + s * off);
    put("water", 0.14, PIT_DEPTH, W, 0.68, -PIT_DEPTH / 2);
    for (const e of [-W / 2, W / 2]) {
      if (ax === "x") box("foam", 0.24, PIT_DEPTH, 0.3, at + s * 0.6, -PIT_DEPTH / 2, c + e);
      else box("foam", 0.3, PIT_DEPTH, 0.24, c + e, -PIT_DEPTH / 2, at + s * 0.6);
    }
    put("foam", 0.4, 0.35, W + 0.4, 0.45, 0.08);
    put("water", 7, 0.1, W + 3, 3.9, -PIT_DEPTH + 0.06);
    put("foam", 1.4, 0.14, W + 0.6, 1.3, -PIT_DEPTH + 0.12);
  };
  // 607 r3 [R] a2 (CRITIC 607 r2: the wall-sheet falls read as flat cyan panels from above; wiki fantasy_good.png lower right:
  // beside the gate a cyan stream pours off the gate's base and steps down a cluster of hex rock columns into the well, white
  // foam at every step). Spec: per gate a 3 m channel from its end buttress's field-side foot along the deck strip beside the
  // well to a rim crossing, then four ledges of hex columns (each 4 m along the flow, 5 m across, tops 1.5, 4, 6.5 and 9 m
  // down) stepping into the well away from the gate's side wall, each with a cyan pool on its top, a cyan drop face at its
  // upstream edge, a foam lip over it and a foam cap at its foot, then a last drop to a pool on the floor. The flow runs across
  // the camera (left gate east at z 17, right gate west at z -11.5), so its drop faces turn toward the top camera and every
  // ledge stands in the well's open back half, clear of the trees and thorn vines. The 607 r1 end curtains stay.
  box("water", 0.35, PIT_DEPTH, 4, 26.3, -PIT_DEPTH / 2, -28.8);
  for (const e of [-2.1, 2.1]) box("foam", 0.45, PIT_DEPTH, 0.25, 26.2, -PIT_DEPTH / 2, -28.8 + e);
  box("water", 6, 0.1, 6, 23.4, -PIT_DEPTH + 0.06, -27.5);
  const steps = (rim: number, dir: number, zc: number) => {
    const L = 4, Wd = 5, tops = [-1.5, -4, -6.5, -9];
    let prev = 0;
    tops.forEach((top, i) => {
      const xa = rim + dir * L * i, xc = xa + dir * L / 2;
      for (const [dx, dz, r] of [[-0.9, -1.3, 1.5], [0.8, 0.2, 1.7], [-0.6, 1.5, 1.4], [1, -1.6, 1.2]] as const) {
        const h = top + PIT_DEPTH - 0.05;
        const col = MeshBuilder.CreateCylinder("heavenCascadeRock", { height: h, diameterTop: 2 * r, diameterBottom: 2 * r * 1.1, tessellation: 6 }, scene);
        col.position.set(xc + dx, -PIT_DEPTH + h / 2, zc + dz);
        col.rotation.y = i * 0.6 + dx;
        col.bakeCurrentTransformIntoVertices();
        parts.rock.push(col);
      }
      box("water", L + 0.6, 0.12, Wd + 0.8, xc, top + 0.06, zc);
      box("water", 0.16, prev - top, Wd, xa + dir * 0.1, (prev + top) / 2, zc);
      box("foam", 0.3, 0.3, Wd + 0.3, xa + dir * 0.15, prev + 0.08, zc);
      box("foam", 0.35, 0.18, Wd + 0.2, xa + dir * 0.45, top + 0.14, zc);
      prev = top;
    });
    const xe = rim + dir * L * tops.length;
    box("water", 0.16, PIT_DEPTH + prev, Wd, xe + dir * 0.1, (prev - PIT_DEPTH) / 2, zc);
    box("foam", 0.5, 0.3, Wd + 0.3, xe + dir * 0.15, prev + 0.08, zc);
    box("water", 6, 0.1, Wd + 2, xe + dir * 3, -PIT_DEPTH + 0.06, zc);
    box("foam", 1.2, 0.14, Wd + 1, xe + dir * 0.8, -PIT_DEPTH + 0.12, zc);
  };
  channel(-28.2, 25.3, -28.2, 17, 3); channel(-28.2, 17, -27, 17, 3); steps(-27, 1, 17);
  channel(28.2, -25.3, 28.2, -11.5, 3); channel(28.2, -11.5, 27, -11.5, 3); steps(27, -1, -11.5);
  // front: well kerb -> front edge, falling down the rim wall's face
  for (const [x, z0] of [[-17, -31.6], [17, -31.6]] as const) {
    const edge = -(DECK.z - notchDepth(-1, x));
    channel(x, z0, x, edge + 0.9);
    const spill = -DECK.z - 6.35;
    box("water", 2.6, 2, 0.12, x, -1, edge - 0.15);
    box("water", 2.6, 0.08, edge - spill, x, -1.94, (edge + spill) / 2);
    box("water", 2.6, 22, 0.12, x, -13, spill);
    box("water", 2.6, 6, 0.12, x, -27, spill);
    box("foam", 2.9, 0.35, 0.5, x, 0.1, edge - 0.1);
  }
  const glow = scene.getGlowLayerByName("glow");
  const rockMat = new StandardMaterial("heavenCascadeRock", scene);
  // 608: mid-grey basalt, so the cyan pools read against it
  rockMat.diffuseColor = new Color3(0.4, 0.45, 0.52);
  rockMat.emissiveColor = rockMat.diffuseColor.scale(0.22);
  rockMat.specularColor = Color3.Black();
  const rocks = Mesh.MergeMeshes(parts.rock, true, true);
  if (rocks) { rocks.name = "heavenCascadeRocks"; rocks.convertToFlatShadedMesh(); rocks.material = rockMat; rocks.receiveShadows = true; rocks.isPickable = false; }
  for (const [k, mat] of [["water", water], ["foam", foam], ["lip", lipMat]] as const) {
    const m = Mesh.MergeMeshes(parts[k], true, true);
    if (!m) continue;
    m.name = `heavenFall_${k}`;
    m.material = mat;
    m.hasVertexAlpha = k === "water";
    m.isPickable = false;
    if (k !== "lip") glow?.addExcludedMesh(m); else m.receiveShadows = true;
  }
}

// Front ledge (597, blocker b2; wiki fantasy_good.png bottom left, heaven_good.png: below the deck's front rim runs a lower
// walkway, a ledge a storey down with its own gold-kerbed parapet, reached by stairs, so the outline steps twice, not one
// flat rectangle). Spec: a 6 m ledge along the whole front (x -52..52, z -46..-40), its top 2 m below the deck, a 0.6 m
// white slab on corbels (1.2 x 1.6 m, 3 m deep) every 6 m, a gold kerb and gold merlons (0.9 m every 2.4 m) on its outer
// edge; the deck's notched bays stay open above it. Two stairs down to it in the plain stretches (x -50..-44 and 14..20),
// 2.4 m wide against the rim, 6 treads. Drawn only: the sim's field ends at the deck (zones and colliders unchanged).
function frontLedge(scene: Scene): void {
  // own materials, matching marbleDeck's stone and gold (this runs before it)
  const white = new StandardMaterial("heavenLedgeStone", scene);
  white.diffuseColor = new Color3(0.86, 0.89, 0.93);
  white.emissiveColor = new Color3(0.2, 0.21, 0.24);
  white.specularColor = Color3.Black();
  const gold = new StandardMaterial("heavenLedgeGold", scene);
  gold.diffuseColor = new Color3(0.78, 0.62, 0.1);
  gold.emissiveColor = new Color3(0.22, 0.17, 0.02);
  gold.specularColor = new Color3(0.2, 0.18, 0.08);
  const parts: { white: Mesh[]; gold: Mesh[] } = { white: [], gold: [] };
  const box = (k: keyof typeof parts, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("heavenLedgePart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    parts[k].push(b);
  };
  const Y = -2, z0 = -DECK.z, z1 = -DECK.z - 6, W = 2 * DECK.x;
  box("white", W, 0.6, 6, 0, Y - 0.3, (z0 + z1) / 2);
  for (let x = -DECK.x + 3; x <= DECK.x - 3 + 1e-6; x += 6) box("white", 1.2, 3, 1.6, x, Y - 2.1, z0 - 0.8);
  box("gold", W, 0.35, 0.6, 0, Y + 0.175, z1 + 0.3);
  for (let x = -DECK.x + 1.2; x <= DECK.x - 1; x += 2.4) box("gold", 0.9, 0.6, 0.5, x, Y + 0.65, z1 + 0.3);
  for (const s of [-1, 1]) box("gold", 0.6, 0.35, 6, s * (DECK.x - 0.3), Y + 0.175, (z0 + z1) / 2);
  for (const xa of [-50, 14]) {
    for (let i = 0; i < 6; i++) {
      const top = -(i + 1) * (2 / 6);
      box("white", 1, top - Y + 0.05, 2.4, xa + i + 0.5, (top + Y) / 2, z0 - 1.2);
    }
  }
  for (const [k, mat] of [["white", white], ["gold", gold]] as const) {
    const m = Mesh.MergeMeshes(parts[k], true, true);
    if (!m) continue;
    m.name = `heavenLedge_${k}`;
    m.material = mat;
    m.receiveShadows = true;
    m.isPickable = false;
  }
}

export function buildFantasyGood(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const restoreSky = heavenSky(scene, built);
  frontLedge(scene);
  const { stone, gold } = marbleDeck(scene, built);
  viaductUnderside(scene, built, stone);
  waterfalls(scene);
  sideIslets(scene, stone, gold);
  const opened = openCentre(scene, built, result, stone, gold);
  const walled = parapets(scene, built, opened, stone, gold);
  const done = gateTowers(scene, pits(scene, built, walled, stone, gold), stone, gold);
  cleanDeck(scene, built, done);
  pitShafts(scene);
  corruptedPits(scene);
  rearJog(scene,done);
  return { ...done, dispose: () => { restoreSky(); done.dispose?.(); } };
}

// 608: all of it moved into the back-right obelisk well, out of the two gate cascades (critic 607 r3).
// 599 a5: black thorn tendrils and a fractured dark obelisk beside the light
// statues (wiki overview). Root all pieces inside the existing pit hazards.
function corruptedPits(scene: Scene): void {
  const dark=new StandardMaterial("heavenCorruption",scene);
  dark.diffuseColor.set(0.035,0.025,0.055);dark.emissiveColor.set(0.018,0.012,0.027);dark.specularColor=Color3.Black();
  const obelisk=MeshBuilder.CreateCylinder("heavenCorruptObelisk",{height:17,diameterBottom:2.8,diameterTop:1.4,tessellation:4},scene);
  obelisk.position.set(20,-0.5,22);obelisk.rotation.y=Math.PI/4;obelisk.material=dark;
  for(const [dx,h,tilt]of [[-0.6,3,-0.18],[0.6,4.5,0.22]]){
    const shard=MeshBuilder.CreateCylinder("heavenBrokenBlackCap",{height:h,diameterBottom:1.8,diameterTop:0,tessellation:4},scene);
    shard.position.set(20+dx,8+h/2,22);shard.rotation.z=tilt;shard.material=dark;
  }
  for(const [i,[x,z]]of [[10,12],[23,11],[11,27],[24,26]].entries()){
    for(let branch=0;branch<3;branch++){
      const path:Vector3[]=[];
      for(let j=0;j<=10;j++){
        const t=j/10;
        path.push(new Vector3(x+Math.sin(t*4+branch)*1.8+branch*0.5,-4+t*(15+branch),z+Math.sin(t*3+i)*2));
      }
      const vine=MeshBuilder.CreateTube("heavenBlackThornVine",{path,radius:0.28+branch*0.05,tessellation:5,cap:Mesh.CAP_ALL},scene);vine.material=dark;
      for(let j=2;j<10;j+=2){
        const thorn=MeshBuilder.CreateCylinder("heavenBlackThorn",{height:1.3,diameterBottom:0.4,diameterTop:0,tessellation:4},scene);
        thorn.position.copyFrom(path[j]);thorn.rotation.z=(j%4?1:-1)*0.9;thorn.material=dark;
      }
    }
  }
}

// 599 b2, heaven_good: the back rim has an angled jog. All edge owners are
// split at x12/28 by EDGE_XS, then their shared z32..40 band is sheared inward
// by six metres at x12, tapering to zero at x28. Pits and gate legs stay fixed.
function rearJog(scene: Scene,result:MapBuildResult):void{
  const inset=(x:number)=>x>=12&&x<=28?6*(28-x)/16:0;
  for(const mesh of scene.meshes){
    if(!(mesh instanceof Mesh)||!/^heaven(Deck|Kerb|Parapet|Merlon|Arch|Viaduct|Basalt|Under)/.test(mesh.name))continue;
    mesh.computeWorldMatrix(true);
    const world=mesh.getWorldMatrix(),inv=world.clone().invert(),pos=mesh.getVerticesData(VertexBuffer.PositionKind);
    if(!pos)continue;let changed=false;
    for(let i=0;i<pos.length;i+=3){
      const p=Vector3.TransformCoordinates(new Vector3(pos[i],pos[i+1],pos[i+2]),world),d=inset(p.x);
      if(d===0||p.z<=32)continue;
      p.z-=d*Math.min(1,(p.z-32)/8);
      const q=Vector3.TransformCoordinates(p,inv);pos[i]=q.x;pos[i+1]=q.y;pos[i+2]=q.z;changed=true;
    }
    if(changed){const normals:number[]=[];VertexData.ComputeNormals(pos,mesh.getIndices()??[],normals);mesh.setVerticesData(VertexBuffer.PositionKind,pos,false);mesh.setVerticesData(VertexBuffer.NormalKind,normals,false);mesh.refreshBoundingInfo();}
  }
  for(let x=12.25;x<28;x+=0.5){const d=inset(x);result.obstacles.push({type:"box",center:new Vector3(x,0,40-d/2),halfX:0.26,halfZ:d/2});}
}

// Clean deck (596, blocker a6; wiki fantasy_good.png: the marble deck is clean blue-grey paving with small teal inlay tiles
// set into it in clusters; no rocks, mounds or rubble lie on it). Spec: the base campaign dressing on the island (the dark
// "boulder"s, the khaki "hill" mound discs, the brown "wallStone" rubble rows, "pebble", "stump", "hayBale" and the theme's
// "Fantasy Good Sanctum_box|_cyl" junk) is hidden and its colliders go. Inlays: 16 seeded patches on the open paving (never
// over a pit or within 3 m of one, clear of the centre ring r 9), each a 4 x 3 grid of 1 m tiles of which about half are
// teal (.2,.62,.6) self .35 and a few a paler aqua (.45,.78,.76) self .35, 1.2 cm proud of the deck, flat, out of the glow.
function cleanDeck(scene: Scene, built: Set<unknown>, result: MapBuildResult): void {
  const junk = /^(boulder|hill|wallStone|pebble|stump|hayBale|Fantasy Good Sanctum_(box|cyl))$/;
  const gone: Vector3[] = [];
  for (const m of scene.meshes) {
    if (!built.has(m) || !m.isEnabled() || !junk.test(m.name)) continue;
    gone.push(m.getAbsolutePosition().clone());
    m.setEnabled(false);
  }
  result.obstacles = result.obstacles.filter((o) => !gone.some((p) => Math.hypot(o.center.x - p.x, o.center.z - p.z) < 0.6));
  let seed = 0x7a11;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const mk = (name: string, c: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(0.35);
    m.specularColor = Color3.Black();
    return m;
  };
  const teal: Mesh[] = [], aqua: Mesh[] = [];
  let placed = 0;
  for (let tries = 0; tries < 400 && placed < 16; tries++) {
    const cx = (rnd() - 0.5) * 2 * (DECK.x - 8), cz = (rnd() - 0.5) * 2 * (DECK.z - 10);
    if (inPit(cx, cz, 5) || Math.hypot(cx, cz) < 11) continue;
    placed++;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
      const r = rnd();
      if (r > 0.6) continue;
      const tile = MeshBuilder.CreateBox("heavenInlay", { width: 0.94, height: 0.024, depth: 0.94 }, scene);
      tile.position.set(Math.round(cx) + i - 1.5, 0.012, Math.round(cz) + j - 1);
      tile.bakeCurrentTransformIntoVertices();
      (r < 0.12 ? aqua : teal).push(tile);
    }
  }
  const glow = scene.getGlowLayerByName("glow");
  for (const [list, mat, name] of [[teal, mk("heavenInlayTeal", new Color3(0.2, 0.62, 0.6)), "heavenInlaysTeal"], [aqua, mk("heavenInlayAqua", new Color3(0.45, 0.78, 0.76)), "heavenInlaysAqua"]] as const) {
    const merged = Mesh.MergeMeshes(list, true);
    if (!merged) continue;
    merged.name = name;
    merged.material = mat;
    merged.receiveShadows = true;
    merged.isPickable = false;
    glow?.addExcludedMesh(merged);
  }
}
