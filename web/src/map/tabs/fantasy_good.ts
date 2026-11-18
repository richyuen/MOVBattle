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

/** Deck top pieces around the pits: x bands split at the pits' edges, each band's z runs outside every pit. */
function deckPieces(): Array<{ x0: number; x1: number; z0: number; z1: number }> {
  const xs = [-DECK.x, -30, -6, 6, 30, DECK.x], out: Array<{ x0: number; x1: number; z0: number; z1: number }> = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i], x1 = xs[i + 1], mid = (x0 + x1) / 2;
    const cuts = PITS.filter((p) => p.x0 < mid && p.x1 > mid).map((p) => [p.z0, p.z1]).sort((a, b) => a[0] - b[0]);
    let z = -DECK.z;
    for (const [a, b] of cuts) { if (a > z) out.push({ x0, x1, z0: z, z1: a }); z = Math.max(z, b); }
    if (z < DECK.z) out.push({ x0, x1, z0: z, z1: DECK.z });
  }
  return out;
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
  const body = Mesh.MergeMeshes([
    [2 * DECK.x, rim, 0, DECK.z - rim / 2], [2 * DECK.x, rim, 0, -DECK.z + rim / 2],
    [rim, 2 * DECK.z, DECK.x - rim / 2, 0], [rim, 2 * DECK.z, -DECK.x + rim / 2, 0],
  ].map(([w, dd, x, z]) => {
    const b = MeshBuilder.CreateBox("heavenDeckBody", { width: w, height: deep, depth: dd }, scene);
    b.position.set(x, -deep / 2, z);
    b.bakeCurrentTransformIntoVertices();
    return b;
  }).concat([(() => {
    const b = MeshBuilder.CreateBox("heavenDeckBody", { width: 2 * DECK.x, height: 1, depth: 2 * DECK.z }, scene);
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
    { w: 2 * DECK.x, d: k, x: 0, z: DECK.z - k / 2 },
    { w: 2 * DECK.x, d: k, x: 0, z: -DECK.z + k / 2 },
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

export function buildFantasyGood(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  const { stone, gold } = marbleDeck(scene, built);
  return pits(scene, built, result, stone, gold);
}
