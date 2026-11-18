// TABS "Fantasy Evil" (Void, fantasy map): a broken plateau of dark slate basalt blocks lit by acid-green chasms, a chained Void
// Monarch statue and a gothic shrine, floating in a starless black void (reference/maps/wiki/fantasy_evil.png,
// reference/maps/void_evil.png; card loop/cards/maps/fantasy_evil.md). Built on campaign.fantasy_evil (base()), dressed here only.
//
// Void sky (590, blocker a1; wiki fantasy_evil.png: nothing behind the island but a near-black violet void, no clouds, no
// mountain range, no horizon glow). Spec: the shared sky dome, the base's clouds ("cloud*") and far range ("mountain*") are
// hidden; clear colour and fog colour become near-black violet (.02, .012, .035), so the field's far edge fades into the void
// rather than into daylight haze. Dome, clear and fog colours are put back on dispose.
import { Color3, Matrix, Mesh, MeshBuilder, Quaternion, StandardMaterial, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { HeightField } from "../terrain";

const VOID = new Color3(0.02, 0.012, 0.035);

function voidSky(scene: Scene, built: Set<unknown>): () => void {
  const dome = scene.getMeshByName("skyDome"), domeOn = dome?.isEnabled();
  dome?.setEnabled(false);
  for (const m of scene.meshes) if (built.has(m) && /^(mountain|cloud)/.test(m.name)) m.setEnabled(false);
  const oldFog = scene.fogColor.clone(), oldClear = scene.clearColor.clone();
  scene.fogColor.copyFrom(VOID);
  scene.clearColor.set(VOID.r, VOID.g, VOID.b, 1);
  return () => {
    dome?.setEnabled(domeOn ?? true);
    scene.fogColor.copyFrom(oldFog);
    scene.clearColor.copyFrom(oldClear);
  };
}

// Basalt floor (591, blocker a2; wiki fantasy_evil.png: the field is a floor of dark slate-teal rock blocks, square-cut tops at
// slightly different heights with darker seams, no grass anywhere). Spec: the base lawn ("ground", "centerGrass") and its grass
// (fieldBlades_*, grassTuft) are hidden; in their place a 2 m grid of square basalt blocks over the base island's oval (the
// superellipse 54 x 48, power 3, less 1 m), each 1.85 m across (0.15 m seams showing the dark bed below), tops 0.02..0.22 m up
// (under a unit's ankle: the sim stays flat), one thin-instance box mesh; lit slate-teal (.13,.2,.22) with a dim self-light
// (.025,.04,.045), each block's tone varied +-12% by an instance colour; a near-black bed (.02,.03,.035) under the seams.
// Seeded LCG, so the shots are the same every run.
// Broken plateau (592, blocker b1; wiki fantasy_evil.png: the field is not one floor but rock-block terraces at several levels,
// a low front level from which broad block stairs climb to a raised central plateau carrying the shrine, its edges walled by
// the blocks' sheer faces). Spec: plateau |x| <= 24, -6 <= z <= 34 at 3 m; round it the blocks fall in 0.75 m terraces, one
// per 2 m block, to the 0 m front level (z < -14), the two team ends (|x| > 32, where both armies place) and the rim; each
// block's height is read at its centre, so the terraces are square stairs, and each block reaches down to the bed so its
// faces read as walls. Visual height only (MapBuildResult.height, map/terrain.ts): every side of the plateau is a stair, so a
// unit crossing anywhere is drawn climbing; the base's small props are seated on the terrace under them.
const PLATEAU = { x: 24, z0: -6, z1: 34, top: 3, tread: 2, rise: 0.75 };

const blockLevel = (x: number, z: number) => {
  const dx = Math.max(0, Math.abs(x) - PLATEAU.x), dz = Math.max(0, PLATEAU.z0 - z, z - PLATEAU.z1);
  return Math.max(0, PLATEAU.top - PLATEAU.rise * Math.ceil(Math.max(dx, dz) / PLATEAU.tread));
};

// Chasms (593, blocker b4; wiki fantasy_evil.png: the plateau does not run out into the side ground but is cut off from it by
// narrow sheer crevices glowing acid green at their floors, and in front a crevice runs along its foot, crossed only by the
// two stair flights). Spec: crevices 4 m wide (two block cells), floor at the island top: one along the plateau's front foot
// (z -10..-6) from x -28 to 28, broken by two 4 m crossings at |x| 10..14 (the stair flights), and one down each side
// (|x| 24..28) from z 8 to the rim at z 44, leaving the side approaches at |z| < 8 (where the armies meet) whole. No block
// stands in a crevice; its floor is an acid-green self-lit plate (1.0 x (.15,.9,.2)) with a glow strip along the foot of
// each wall, out of the glow pass; each crevice is a void hazard, so nobody walks in.
// 595: the two crossings widen to the stair flights, |x| 8..16
const CHASMS = [
  { x0: -28, x1: -16, z0: -10, z1: -6 }, { x0: -8, x1: 8, z0: -10, z1: -6 }, { x0: 16, x1: 28, z0: -10, z1: -6 },
  { x0: -28, x1: -24, z0: 8, z1: 44 }, { x0: 24, x1: 28, z0: 8, z1: 44 },
];
const inChasm = (x: number, z: number) => CHASMS.some((c) => x > c.x0 && x < c.x1 && z > c.z0 && z < c.z1);

function chasms(scene: Scene): MapBuildResult["hazards"] {
  const acid = new StandardMaterial("voidChasmGlow", scene);
  acid.diffuseColor = Color3.Black();
  acid.emissiveColor = new Color3(0.15, 0.9, 0.2);
  acid.specularColor = Color3.Black();
  acid.disableLighting = true;
  const parts: Mesh[] = [];
  const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("voidChasmPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    parts.push(b);
  };
  for (const c of CHASMS) {
    const w = c.x1 - c.x0, d = c.z1 - c.z0, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
    box(w, 0.06, d, cx, 0.03, cz);
    box(w, 0.5, 0.08, cx, 0.25, c.z0 + 0.06);
    box(w, 0.5, 0.08, cx, 0.25, c.z1 - 0.06);
    box(0.08, 0.5, d, c.x0 + 0.06, 0.25, cz);
    box(0.08, 0.5, d, c.x1 - 0.06, 0.25, cz);
  }
  const glow = Mesh.MergeMeshes(parts, true, true);
  if (glow) {
    glow.name = "voidChasmGlow";
    glow.material = acid;
    glow.isPickable = false;
    scene.getGlowLayerByName("glow")?.addExcludedMesh(glow);
  }
  return CHASMS.map((c) => ({
    shape: "box" as const, kind: "void" as const,
    center: new Vector3((c.x0 + c.x1) / 2, 0, (c.z0 + c.z1) / 2), halfX: (c.x1 - c.x0) / 2, halfZ: (c.z1 - c.z0) / 2,
  }));
}

/** The terrace under a point: the level of the 2 m block it stands on (blocks are centred on odd metres). */
const blockCentre = (v: number) => 2 * Math.floor(v / 2) + 1;
export const fantasyEvilHeight: HeightField = (x, z) => stairLevel(x, z) ?? blockLevel(blockCentre(x), blockCentre(z));

// Stair flights (595, blocker b2; wiki fantasy_evil.png lower centre: two broad stone stairs climb from the front level, across
// the crevice, to the raised plateau, one each side of the shrine, many fine treads between stepped stone cheeks). Spec: flights
// 8 m wide at |x| 8..16, running z -16 (front level, 0 m) to z -6 (plateau edge, 3 m) in 12 treads of 0.25 m rise and 0.83 m
// going; no basalt block stands on them; a cheek wall 0.7 m thick along each side, its top stepped 0.7 m over the treads;
// treads paler slate (.2,.25,.27) than the blocks, nosings dark; drawn height follows the treads (visual only).
const STAIRS = { x0: 8, x1: 16, z0: -16, z1: -6, steps: 12 };
const inStair = (x: number, z: number) => Math.abs(x) > STAIRS.x0 && Math.abs(x) < STAIRS.x1 && z > STAIRS.z0 && z < STAIRS.z1;
function stairLevel(x: number, z: number): number | undefined {
  if (!inStair(x, z)) return undefined;
  const going = (STAIRS.z1 - STAIRS.z0) / STAIRS.steps;
  return (PLATEAU.top / STAIRS.steps) * Math.min(STAIRS.steps, Math.floor((z - STAIRS.z0) / going) + 1);
}

function stairFlights(scene: Scene): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const parts: Record<"tread" | "nose" | "cheek", Mesh[]> = { tread: [], nose: [], cheek: [] };
  const box = (k: keyof typeof parts, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const b = MeshBuilder.CreateBox("voidStairPart", { width: w, height: h, depth: d }, scene);
    b.position.set(x, y, z);
    b.bakeCurrentTransformIntoVertices();
    parts[k].push(b);
  };
  const going = (STAIRS.z1 - STAIRS.z0) / STAIRS.steps, rise = PLATEAU.top / STAIRS.steps, w = STAIRS.x1 - STAIRS.x0;
  for (const s of [-1, 1]) {
    const cx = s * (STAIRS.x0 + STAIRS.x1) / 2;
    for (let i = 0; i < STAIRS.steps; i++) {
      const top = rise * (i + 1), z = STAIRS.z0 + going * (i + 0.5);
      box("tread", w - 1.4, top + 0.5, going, cx, (top - 0.5) / 2, z);
      box("nose", w - 1.4, 0.06, 0.12, cx, top + 0.01, z - going / 2 + 0.06);
      for (const e of [STAIRS.x0 + 0.35, STAIRS.x1 - 0.35]) box("cheek", 0.7, top + 1.2, going + 0.02, s * e, (top + 0.7 - 0.5) / 2, z);
    }
  }
  const mats = { tread: mk("voidStairTread", new Color3(0.2, 0.25, 0.27), 0.18), nose: mk("voidStairNose", new Color3(0.03, 0.04, 0.05), 0.2), cheek: mk("voidStairCheek", new Color3(0.11, 0.15, 0.17), 0.2) };
  for (const k of Object.keys(parts) as Array<keyof typeof parts>) {
    const merged = Mesh.MergeMeshes(parts[k], true, true);
    if (!merged) continue;
    merged.name = `voidStairs_${k}`;
    merged.material = mats[k];
    merged.receiveShadows = true;
    merged.isPickable = false;
  }
}

function basaltFloor(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (m.name === "ground" || m.name === "centerGrass" || m.name === "grassTuft" || m.name.startsWith("fieldBlades_")) m.setEnabled(false);
  }
  let seed = 0x5a17;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const inside = (x: number, z: number) => Math.abs(x / 53) ** 3 + Math.abs(z / 47) ** 3 <= 1;
  const bedMat = new StandardMaterial("basaltBed", scene);
  bedMat.diffuseColor = new Color3(0.02, 0.03, 0.035);
  bedMat.specularColor = Color3.Black();
  // 594 [P]: lit, the seams read pale lilac (sun + fog on the bed); unlit near-black
  bedMat.disableLighting = true;
  bedMat.emissiveColor = new Color3(0.012, 0.018, 0.022);
  const block = MeshBuilder.CreateBox("basaltBlocks", { size: 1 }, scene);
  const mat = new StandardMaterial("basaltBlocks", scene);
  mat.diffuseColor = new Color3(0.13, 0.2, 0.22);
  mat.emissiveColor = new Color3(0.025, 0.04, 0.045);
  mat.specularColor = new Color3(0.04, 0.05, 0.05);
  block.material = mat;
  const mats: number[] = [], cols: number[] = [];
  const seamMats: number[] = [];
  for (let x = -53; x <= 53; x += 2) {
    for (let z = -47; z <= 47; z += 2) {
      if (!inside(x, z) || !inside(x + 1, z + 1) || !inside(x - 1, z - 1) || !inside(x + 1, z - 1) || !inside(x - 1, z + 1)) continue;
      if (inChasm(x, z) || inStair(x, z)) continue;
      const lift = blockLevel(x, z);
      const top = 0.02 + rnd() * 0.2 + lift, h = 0.5 + top;
      mats.push(...Matrix.Compose(new Vector3(1.85, h, 1.85), Quaternion.Identity(), new Vector3(x, top - h / 2, z)).asArray());
      const k = 0.88 + rnd() * 0.24;
      cols.push(k, k, k, 1);
      // the bed sits just under this block's own top, so seams show dark between blocks of one terrace
      seamMats.push(...Matrix.Compose(new Vector3(2, 0.1 + lift, 2), Quaternion.Identity(), new Vector3(x, (lift - 0.16) / 2, z)).asArray());
    }
  }
  block.thinInstanceSetBuffer("matrix", new Float32Array(mats), 16, true);
  block.thinInstanceSetBuffer("color", new Float32Array(cols), 4, true);
  block.receiveShadows = true;
  block.isPickable = false;
  // the seams' bed: one dark 2 m tile under each block (so it follows the oval), just below the block tops
  const seam = MeshBuilder.CreateBox("basaltSeams", { size: 1 }, scene);
  seam.material = bedMat;
  seam.thinInstanceSetBuffer("matrix", new Float32Array(seamMats), 16, true);
  seam.isPickable = false;
}

// Rock ring (593, blocker a3; wiki fantasy_evil.png: no trees anywhere; the field's edge is ringed by jagged dark rock
// columns, leaning basalt prisms in clumps of different heights, with here and there a broken square pillar). Spec: every
// base ring tree (an unparented "trunk", crowns its children) and the haze treeline are hidden, the trees' colliders kept;
// at each tree spot outside the crevices a clump of two or three five-sided prisms 1.4-2.6 m across, 4-10 m tall, leaning
// 0.05-0.25 rad, flat tops cut at a slant; every fourth spot a broken square pillar instead (1.6 m, 3-6 m, a tilted cap
// block); seated on the terrace under them; dark slate (.09,.12,.14) self (.02,.03,.035), flat shaded, in the glow pass.
function rockRing(scene: Scene, built: Set<unknown>): void {
  let seed = 0x7c3d;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const mat = new StandardMaterial("voidRockRing", scene);
  mat.diffuseColor = new Color3(0.09, 0.12, 0.14);
  mat.emissiveColor = new Color3(0.02, 0.03, 0.035);
  mat.specularColor = new Color3(0.03, 0.04, 0.04);
  const parts: Mesh[] = [];
  let k = 0;
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (m.name === "hazeTreeline") { m.setEnabled(false); continue; }
    if (m.name !== "trunk" || m.parent || !m.isEnabled()) continue;
    m.setEnabled(false);
    const { x, z } = m.position;
    if (inChasm(x, z)) continue;
    const y0 = fantasyEvilHeight(x, z) - 0.3;
    if (k++ % 4 === 3) {
      const h = 3 + rnd() * 3;
      const p = MeshBuilder.CreateBox("voidRockPart", { width: 1.6, depth: 1.6, height: h }, scene);
      p.rotation.set((rnd() - 0.5) * 0.12, rnd() * 3, (rnd() - 0.5) * 0.12);
      p.position.set(x, y0 + h / 2, z);
      p.bakeCurrentTransformIntoVertices();
      parts.push(p);
      const cap = MeshBuilder.CreateBox("voidRockPart", { width: 2.1, depth: 2.1, height: 0.5 }, scene);
      cap.rotation.set(0.35, rnd() * 3, 0.2);
      cap.position.set(x + 0.3, y0 + h + 0.1, z - 0.2);
      cap.bakeCurrentTransformIntoVertices();
      parts.push(cap);
      continue;
    }
    const n = 2 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) {
      const h = 4 + rnd() * 6, d = 1.4 + rnd() * 1.2, a = rnd() * 6.28, r = i === 0 ? 0 : 1.2 + rnd() * 0.8;
      const c = MeshBuilder.CreateCylinder("voidRockPart", { height: h, diameterTop: d * 0.8, diameterBottom: d, tessellation: 5 }, scene);
      c.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6.28, (rnd() - 0.5) * 0.5);
      c.position.set(x + Math.cos(a) * r, y0 + h / 2, z + Math.sin(a) * r);
      c.bakeCurrentTransformIntoVertices();
      parts.push(c);
    }
  }
  const merged = Mesh.MergeMeshes(parts, true, true);
  if (!merged) return;
  merged.name = "voidRockRing";
  merged.convertToFlatShadedMesh();
  merged.material = mat;
  merged.receiveShadows = true;
  merged.isPickable = false;
}

// Shrine (594, blocker b3; wiki fantasy_evil.png, void_evil.png: at the plateau's front, between the two stair flights, a raised
// round gothic shrine, a ring of dark stone wall pierced by tall pointed-arch windows between buttress pillars with spiked caps;
// behind it, a blue-glowing portal altar, a round stepped dais with a bright blue disc and blue crystal shards at its back).
// Spec: the base's void disc (cylinder hazard r 10 at 0,0, its overlay) with its plank ("Fantasy Evil Rift_box" at 0,0) and the
// base's void slot (box hazard at 0,24, its overlay) go. Shrine centre (0, 1) on the 3 m plateau: a 0.8 m dais r 7.4 with a
// darker floor, on it a ring wall r 6.2, 0.8 m thick, 4.5 m high, in 16 segments, the two facing +-x left open (the armies'
// lane runs through it); each segment carries a pointed-arch window (a near-black recess, a 45-degree turned box as its point)
// on its outer face, a 1 m buttress pillar 6.2 m high with a four-sided spike at every segment joint. Portal altar at (0, 12): two
// tiers r 3.2 and 2.4 (0.5 m each), a blue disc r 1.8 (unlit (.3,.75,1.4)), five blue crystal prisms 2.5-5.5 m behind it
// (unlit (.08,.4,.9)), two dark obelisks 4.5 m beside it. Stone (.2,.25,.27) self (.04,.05,.055), flat shaded, in the glow pass;
// the blue pieces out of it. Colliders: a cylinder per wall segment and pillar, one r 3.2 for the altar; drawn height +0.8 m
// inside the dais (+1 m on the altar).
const SHRINE = { x: 0, z: 1, dais: 7.4, r: 6.2, wall: 4.5, segs: 16 };
const ALTAR = { x: 0, z: 12 };
function shrine(scene: Scene, built: Set<unknown>, result: MapBuildResult): Pick<MapBuildResult, "hazards" | "obstacles"> {
  for (const m of scene.meshes) {
    if (!built.has(m)) continue;
    if (/^campaign_hazard_(cyl|box)_void$/.test(m.name)) m.setEnabled(false);
    if (m.name === "Fantasy Evil Rift_box" && Math.hypot(m.position.x, m.position.z) < 2) m.setEnabled(false);
  }
  const hazards = result.hazards.filter((h) => h.kind !== "void");
  const obstacles = result.obstacles.filter((o) => Math.hypot(o.center.x, o.center.z) > 2);
  const mk = (name: string, c: Color3, self: number, unlit = false) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = unlit ? Color3.Black() : c;
    m.emissiveColor = unlit ? c : c.scale(self);
    m.specularColor = Color3.Black();
    m.disableLighting = unlit;
    return m;
  };
  const mats = {
    stone: mk("voidShrineStone", new Color3(0.2, 0.25, 0.27), 0.2),
    floor: mk("voidShrineFloor", new Color3(0.08, 0.1, 0.12), 0.2),
    recess: mk("voidShrineRecess", new Color3(0.01, 0.012, 0.02), 0),
    portal: mk("voidShrinePortal", new Color3(0.3, 0.75, 1.4), 0, true),
    crystal: mk("voidShrineCrystal", new Color3(0.08, 0.4, 0.9), 0, true),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { stone: [], floor: [], recess: [], portal: [], crystal: [] };
  const put = (k: keyof typeof mats, m: Mesh) => { m.bakeCurrentTransformIntoVertices(); parts[k].push(m); };
  const top = PLATEAU.top, Y = top + 0.8;
  // dais and floor
  const dais = MeshBuilder.CreateCylinder("voidShrinePart", { diameter: SHRINE.dais * 2, height: 0.8 + 1, tessellation: 24 }, scene);
  dais.position.set(SHRINE.x, top - 0.5 + 0.4, SHRINE.z);
  put("stone", dais);
  const floor = MeshBuilder.CreateCylinder("voidShrinePart", { diameter: SHRINE.r * 2 - 0.6, height: 0.06, tessellation: 24 }, scene);
  floor.position.set(SHRINE.x, Y + 0.02, SHRINE.z);
  put("floor", floor);
  const step = (Math.PI * 2) / SHRINE.segs;
  const open = (a: number) => Math.abs(Math.cos(a)) > 0.93; // the two segments facing +-x
  for (let i = 0; i < SHRINE.segs; i++) {
    const a = (i + 0.5) * step, cx = SHRINE.x + Math.cos(a) * SHRINE.r, cz = SHRINE.z + Math.sin(a) * SHRINE.r;
    const len = 2 * SHRINE.r * Math.sin(step / 2) - 0.9;
    if (!open(a)) {
      const w = MeshBuilder.CreateBox("voidShrinePart", { width: 0.8, height: SHRINE.wall, depth: len }, scene);
      w.rotation.y = -a;
      w.position.set(cx, Y + SHRINE.wall / 2, cz);
      put("stone", w);
      // pointed-arch window on the outer face
      const ox = Math.cos(a) * 0.36, oz = Math.sin(a) * 0.36;
      const win = MeshBuilder.CreateBox("voidShrinePart", { width: 0.16, height: 2.4, depth: len * 0.42 }, scene);
      win.rotation.y = -a;
      win.position.set(cx + ox, Y + 0.9 + 1.2, cz + oz);
      put("recess", win);
      const turn = MeshBuilder.CreateBox("voidShrinePart", { width: 0.16, height: len * 0.3, depth: len * 0.3 }, scene);
      turn.rotation.set(Math.PI / 4, -a, 0); // pitch about its thickness axis (a diamond), then turned to face out
      turn.position.set(cx + ox, Y + 3.3, cz + oz);
      put("recess", turn);
      obstacles.push({ type: "cylinder", center: new Vector3(cx, 0, cz), radius: len / 2 + 0.2 });
    }
    // buttress pillar with a spike at the joint after this segment
    const pa = (i + 1) * step, px = SHRINE.x + Math.cos(pa) * (SHRINE.r + 0.15), pz = SHRINE.z + Math.sin(pa) * (SHRINE.r + 0.15);
    const pillar = MeshBuilder.CreateBox("voidShrinePart", { width: 1, height: 6.2, depth: 1 }, scene);
    pillar.rotation.y = -pa;
    pillar.position.set(px, Y + 3.1, pz);
    put("stone", pillar);
    const spike = MeshBuilder.CreateCylinder("voidShrinePart", { diameterBottom: 1.25, diameterTop: 0, height: 1.8, tessellation: 4 }, scene);
    spike.rotation.y = -pa + Math.PI / 4;
    spike.position.set(px, Y + 6.2 + 0.9, pz);
    put("stone", spike);
    obstacles.push({ type: "cylinder", center: new Vector3(px, 0, pz), radius: 0.7 });
  }
  // portal altar
  for (const [r, h, y] of [[3.2, 1.5, top - 0.25], [2.4, 0.5, top + 0.75]] as const) {
    const t = MeshBuilder.CreateCylinder("voidShrinePart", { diameter: r * 2, height: h, tessellation: 16 }, scene);
    t.position.set(ALTAR.x, y, ALTAR.z);
    put("stone", t);
  }
  const disc = MeshBuilder.CreateCylinder("voidShrinePart", { diameter: 3.6, height: 0.08, tessellation: 24 }, scene);
  disc.position.set(ALTAR.x, top + 1.04, ALTAR.z);
  put("portal", disc);
  for (const [dx, dz, h, tilt] of [[0, 2.2, 5.5, 0], [-1.3, 1.9, 4, 0.25], [1.3, 1.9, 4.2, -0.22], [-2.2, 1.2, 2.5, 0.4], [2.1, 1.3, 2.8, -0.38]] as const) {
    const c = MeshBuilder.CreateCylinder("voidShrinePart", { diameterBottom: 0.9, diameterTop: 0.15, height: h, tessellation: 6 }, scene);
    c.rotation.set(0.12, 0, tilt);
    c.position.set(ALTAR.x + dx, top + 1 + h / 2 - 0.2, ALTAR.z + dz);
    put("crystal", c);
  }
  for (const s of [-1, 1]) {
    const o = MeshBuilder.CreateCylinder("voidShrinePart", { diameterBottom: 1.1, diameterTop: 0.5, height: 4.5, tessellation: 4 }, scene);
    o.rotation.y = Math.PI / 4;
    o.position.set(ALTAR.x + s * 4, top + 2.25, ALTAR.z + 0.5);
    put("stone", o);
  }
  obstacles.push({ type: "cylinder", center: new Vector3(ALTAR.x, 0, ALTAR.z), radius: 3.2 });
  const glow = scene.getGlowLayerByName("glow");
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `voidShrine_${key}`;
    if (key === "stone") merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = key !== "portal" && key !== "crystal";
    merged.isPickable = false;
    if (key === "portal" || key === "crystal") glow?.addExcludedMesh(merged);
  }
  return { hazards, obstacles };
}

// Chained statue (594, blocker a5, and a6's spire; wiki fantasy_evil.png, void_evil.png: at the back of the plateau, behind the
// portal, a tall stone statue of the Void Monarch, a robed horned figure with great ragged wings, held by heavy chains that run
// up to a giant leaning rock spire standing beyond the right-hand crevice, taller than anything on the island). Spec: statue at
// (8, 26) facing the front (-z), on a two-step pedestal 5.5 / 4.2 m square, 2.4 m; a robe frustum 4 m to 1.8 m across, 6.5 m
// high; chest 2.8 x 2 x 1.7 m; a faceted head r 0.85 with two back-swept horns 1.8 m; arms raised outward to wrist manacles at
// 12 m; two wings of three ragged slabs each (7.5 / 6 / 4.5 m long, 0.25 m thick) fanned up and out behind the shoulders. Rock
// spire at (36, 40): a five-sided shaft 40 m long, 14 m across at the foot to 1.5 m, leaning 0.3 rad toward the field (-x) and
// 0.12 rad toward the front, foot sunk 6 m; two shards 18 and 12 m beside it. Chains of oval links (torus 1.3 m, 0.34 m thick,
// stretched 1.35x, every other link turned 90 degrees) from each wrist to a point 20 and 26 m up the spire, sagging 3.5 m.
// Statue and spire grey-teal stone (.26,.31,.33) self (.05,.06,.065), lighter than the floor so they read on the void; spire
// (.2,.24,.27); chains (.12,.13,.15); flat shaded, out of the glow pass. Colliders: pedestal, spire cylinder r 6.5.
// 596 (blocker a5, attempt 2: at (8, 26) it stood outside the ground frame): the statue moves to (18, 15), in the gap between
// the portal altar and the shrine ring as seen from the ground camera (x -30), is built 1.25x (about 16 m to the horn tips,
// wings 21 m across) and turned 1.27 rad so it faces the camera with its wings spread across the view, not edge-on.
const STATUE = { x: 18, z: 15, scale: 1.25, yaw: 1.27 };
const SPIRE = { x: 36, z: 40 };
function chainedStatue(scene: Scene, obstacles: MapBuildResult["obstacles"]): void {
  const mk = (name: string, c: Color3, self: number) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = c;
    m.emissiveColor = c.scale(self);
    m.specularColor = Color3.Black();
    return m;
  };
  const mats = {
    statue: mk("voidStatueStone", new Color3(0.26, 0.31, 0.33), 0.2),
    spire: mk("voidSpireRock", new Color3(0.2, 0.24, 0.27), 0.2),
    chain: mk("voidStatueChain", new Color3(0.22, 0.24, 0.27), 0.25),
  };
  const parts: Record<keyof typeof mats, Mesh[]> = { statue: [], spire: [], chain: [] };
  const top = PLATEAU.top, X = STATUE.x, Z = STATUE.z;
  // the statue is laid out facing -z at (X, top, Z), then scaled and turned about its foot
  const pose = Matrix.Translation(-X, -top, -Z)
    .multiply(Matrix.Scaling(STATUE.scale, STATUE.scale, STATUE.scale))
    .multiply(Matrix.RotationY(STATUE.yaw))
    .multiply(Matrix.Translation(X, top, Z));
  const put = (k: keyof typeof mats, m: Mesh) => {
    m.bakeCurrentTransformIntoVertices();
    if (k === "statue") m.bakeTransformIntoVertices(pose);
    parts[k].push(m);
  };
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
    const b = MeshBuilder.CreateBox("voidStatuePart", { width: w, height: h, depth: d }, scene);
    b.rotation.set(rx, ry, rz);
    b.position.set(X + x, y, Z + z);
    put("statue", b);
  };
  box(5.5, 1.4, 5.5, 0, top + 0.7, 0);
  box(4.2, 1, 4.2, 0, top + 1.9, 0);
  const foot = top + 2.4;
  const robe = MeshBuilder.CreateCylinder("voidStatuePart", { diameterBottom: 4, diameterTop: 1.8, height: 6.5, tessellation: 7 }, scene);
  robe.position.set(X, foot + 3.25, Z);
  put("statue", robe);
  box(2.8, 2, 1.7, 0, foot + 7.3, 0);
  const head = MeshBuilder.CreateIcoSphere("voidStatuePart", { radius: 0.85, subdivisions: 1 }, scene);
  head.position.set(X, foot + 9, Z - 0.1);
  put("statue", head);
  for (const s of [-1, 1]) {
    const horn = MeshBuilder.CreateCylinder("voidStatuePart", { diameterBottom: 0.45, diameterTop: 0.05, height: 1.8, tessellation: 4 }, scene);
    horn.rotation.set(-0.6, 0, -s * 0.5);
    horn.position.set(X + s * 0.6, foot + 10, Z + 0.3);
    put("statue", horn);
    // arms raised outward to the manacles
    box(0.7, 3.4, 0.7, s * 2.4, foot + 9, 0, 0, 0, -s * 0.7);
    box(0.95, 0.6, 0.95, s * 3.5, foot + 10.4, 0);
    // wings: three ragged slabs fanned up and out behind the shoulders
    for (const [len, lift, w] of [[7.5, 0.55, 2.2], [6, 0.95, 1.8], [4.5, 1.35, 1.4]] as const) {
      const slab = MeshBuilder.CreateBox("voidStatuePart", { width: len, height: w, depth: 0.25 }, scene);
      slab.rotation.set(0, 0, s * lift);
      slab.position.set(X + s * (0.9 + Math.cos(lift) * len / 2), foot + 7.6 + Math.sin(lift) * len / 2, Z + 1.1);
      put("statue", slab);
    }
  }
  obstacles.push({ type: "cylinder", center: new Vector3(X, 0, Z), radius: 3.9 });
  // the spire and its shards
  const shard = (h: number, d: number, x: number, z: number, rx: number, rz: number, sink: number) => {
    const c = MeshBuilder.CreateCylinder("voidSpirePart", { height: h, diameterBottom: d, diameterTop: d * 0.1, tessellation: 5 }, scene);
    c.rotation.set(rx, 0.4, rz);
    const axis = Vector3.TransformNormal(Vector3.Up(), Matrix.RotationYawPitchRoll(0.4, rx, rz));
    c.position.copyFrom(new Vector3(x, -sink, z).add(axis.scale(h / 2)));
    put("spire", c);
  };
  shard(40, 14, SPIRE.x, SPIRE.z, -0.12, 0.3, 6);
  shard(18, 7, SPIRE.x + 6, SPIRE.z - 7, -0.2, 0.15, 3);
  shard(12, 5, SPIRE.x - 4, SPIRE.z + 5, 0.1, 0.35, 2);
  obstacles.push({ type: "cylinder", center: new Vector3(SPIRE.x, 0, SPIRE.z), radius: 6.5 });
  // a point up the leaning spire's axis: the foot at -6 m, the axis turned by the shard's pitch and roll
  const onSpire = (up: number) => {
    const axis = Vector3.TransformNormal(new Vector3(0, 1, 0), Matrix.RotationYawPitchRoll(0.4, -0.12, 0.3));
    return new Vector3(SPIRE.x, -6, SPIRE.z).add(axis.scale(up + 6));
  };
  const link = MeshBuilder.CreateTorus("voidChainLink", { diameter: 1.3, thickness: 0.34, tessellation: 8 }, scene);
  for (const [s, up] of [[-1, 20], [1, 26]] as const) {
    const a = Vector3.TransformCoordinates(new Vector3(X + s * 3.5, foot + 10.4, Z), pose), b = onSpire(up);
    const n = Math.ceil(Vector3.Distance(a, b) / 1.0);
    for (let i = 0; i <= n; i++) {
      const t = i / n, p = Vector3.Lerp(a, b, t);
      p.y -= Math.sin(t * Math.PI) * 3.5;
      const q = Vector3.Lerp(a, b, t + 0.01);
      q.y -= Math.sin((t + 0.01) * Math.PI) * 3.5;
      const d = q.subtract(p).normalize();
      const side = Vector3.Cross(d, Vector3.Up()).normalize();
      const normal = i % 2 ? side : Vector3.Cross(side, d).normalize();
      const c = link.clone("voidChainLink");
      c.scaling.set(1.35, 1, 1);
      c.rotationQuaternion = Quaternion.RotationQuaternionFromAxis(d, normal, Vector3.Cross(d, normal));
      c.position.copyFrom(p);
      put("chain", c);
    }
  }
  link.dispose();
  for (const key of Object.keys(mats) as Array<keyof typeof mats>) {
    const merged = Mesh.MergeMeshes(parts[key], true, true);
    if (!merged) continue;
    merged.name = `voidStatue_${key}`;
    merged.convertToFlatShadedMesh();
    merged.material = mats[key];
    merged.receiveShadows = true;
    merged.isPickable = false;
    // 594.3b: in the glow pass the pale stone bloomed into a see-through ghost against the black void; nothing glows behind it
    scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  }
}

/** Drawn height with the shrine dais and the altar raised over the plateau. */
const shrineHeight: HeightField = (x, z) => {
  const base = fantasyEvilHeight(x, z);
  if (Math.hypot(x - ALTAR.x, z - ALTAR.z) < 3.2) return base + 1;
  if (Math.hypot(x - SHRINE.x, z - SHRINE.z) < SHRINE.dais) return base + 0.8;
  return base;
};

// Green-glow rim (595, blocker a4; wiki fantasy_evil.png: the island's edge is no smooth pale slab but a jagged ring of dark rock
// blocks, acid-green light glowing out of the cracks between them and along their lips, green glowing mushroom clusters on the
// edge). Spec: the base slab (islandUnder, islandShelf) hidden, its pale band gone; round the basalt oval (superellipse 53 x 47,
// power 3) every ~3 m of rim a dark five-sided rock 3.4-5 m across, its top 0.2-2.2 m over the floor (every fifth a 3-4 m
// tooth), reaching 7 m down, slate (.09,.12,.14) in the glow pass; in each crack an acid-green plate (.15,.9,.2) 0.3 m wide,
// 5 m tall on the outer face and a green lip strip on every second rock's top, unlit, out of the glow; six mushroom clusters
// (3-5 green self-lit caps on pale stems) on the rim. Drawn only (outside the field).
function greenRim(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) if (built.has(m) && (m.name === "islandUnder" || m.name === "islandShelf")) m.setEnabled(false);
  let seed = 0x3e11;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const edge = (a: number) => {
    const c = Math.cos(a), s = Math.sin(a), r = 1 / (Math.abs(c / 53) ** 3 + Math.abs(s / 47) ** 3) ** (1 / 3);
    return { x: c * r, z: s * r, nx: c, nz: s };
  };
  const rocks: Mesh[] = [], glows: Mesh[] = [], caps: Mesh[] = [], stems: Mesh[] = [];
  const N = 112;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, e = edge(a);
    const d = 3.4 + rnd() * 1.6, top = i % 5 === 0 ? 3 + rnd() : 0.2 + rnd() * 2, h = top + 7;
    const r = MeshBuilder.CreateCylinder("voidRimRock", { height: h, diameterTop: d * 0.8, diameterBottom: d * 0.55, tessellation: 5 }, scene);
    r.position.set(e.x + e.nx * 1.2, top - h / 2, e.z + e.nz * 1.2);
    r.rotation.set((rnd() - 0.5) * 0.2, rnd() * 6.28, (rnd() - 0.5) * 0.2);
    r.bakeCurrentTransformIntoVertices();
    rocks.push(r);
    // the crack after this rock: a green plate on the outer face, only in some cracks, of uneven size and lean (595.6b: one
    // in every crack read as an even green picket fence)
    if (rnd() < 0.35) {
      const b = edge(a + Math.PI / N), gh = 1.5 + rnd() * 4;
      const g = MeshBuilder.CreateBox("voidRimGlow", { width: 0.12 + rnd() * 0.25, height: gh, depth: 1.2 }, scene);
      g.rotation.set(0, -Math.atan2(b.nz, b.nx), 0);
      g.addRotation((rnd() - 0.5) * 0.6, 0, 0);
      g.position.set(b.x + b.nx * 2.9, -0.2 - gh / 2 - rnd() * 1.5, b.z + b.nz * 2.9);
      g.bakeCurrentTransformIntoVertices();
      glows.push(g);
    }
    if (i % 2 === 0) {
      const lip = MeshBuilder.CreateBox("voidRimLip", { width: 0.35, height: 0.12, depth: d * 0.7 }, scene);
      lip.position.set(e.x + e.nx * 2.6, top - 0.1, e.z + e.nz * 2.6);
      lip.rotation.y = -Math.atan2(e.nz, e.nx);
      lip.bakeCurrentTransformIntoVertices();
      glows.push(lip);
    }
  }
  for (let c = 0; c < 6; c++) {
    const e = edge(0.5 + c * 1.05), n = 3 + Math.floor(rnd() * 3);
    for (let j = 0; j < n; j++) {
      const ox = (rnd() - 0.5) * 2.4, oz = (rnd() - 0.5) * 2.4, tall = 0.5 + rnd() * 0.9, w = 0.7 + rnd() * 0.8;
      const x = e.x - e.nx * 1.5 + ox, z = e.z - e.nz * 1.5 + oz, y0 = fantasyEvilHeight(x, z) + 0.2;
      const stem = MeshBuilder.CreateCylinder("voidMushStem", { height: tall, diameter: 0.18, tessellation: 5 }, scene);
      stem.position.set(x, y0 + tall / 2, z);
      stem.bakeCurrentTransformIntoVertices();
      stems.push(stem);
      const cap = MeshBuilder.CreateSphere("voidMushCap", { diameter: w, segments: 4, slice: 0.5 }, scene);
      cap.scaling.y = 0.6;
      cap.position.set(x, y0 + tall, z);
      cap.bakeCurrentTransformIntoVertices();
      caps.push(cap);
    }
  }
  const rock = new StandardMaterial("voidRimRock", scene);
  rock.diffuseColor = new Color3(0.09, 0.12, 0.14);
  rock.emissiveColor = new Color3(0.02, 0.03, 0.035);
  rock.specularColor = Color3.Black();
  const acid = new StandardMaterial("voidRimGlow", scene);
  acid.diffuseColor = Color3.Black();
  acid.emissiveColor = new Color3(0.15, 0.9, 0.2);
  acid.specularColor = Color3.Black();
  acid.disableLighting = true;
  const stemMat = new StandardMaterial("voidMushStem", scene);
  stemMat.diffuseColor = Color3.Black();
  stemMat.emissiveColor = new Color3(0.55, 0.65, 0.5);
  stemMat.disableLighting = true;
  const glowLayer = scene.getGlowLayerByName("glow");
  for (const [parts, mat, name, flat, excl] of [[rocks, rock, "voidRimRocks", true, false], [glows, acid, "voidRimGlow", false, true], [caps, acid, "voidMushCaps", false, true], [stems, stemMat, "voidMushStems", false, true]] as const) {
    const merged = Mesh.MergeMeshes(parts, true, true);
    if (!merged) continue;
    merged.name = name;
    if (flat) merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.isPickable = false;
    merged.receiveShadows = flat;
    if (excl) glowLayer?.addExcludedMesh(merged);
  }
}

// Rock mass underside (595, blocker a6; void_evil.png and wiki fantasy_evil.png: the island is not a slab on black spikes but one
// heavy mass of dark rock below the rim, great blocky boulders heaped in a rough inverted cone, a few chains hanging off it).
// Spec: the base crags (islandCliff) hidden; under the island four rings of faceted rock (icosphere, subdivisions 1) shrinking
// inward as they go down: ring k at depth 4 + 7k m, radius 0.92 - 0.2k of the 53 x 47 oval, boulders 6-11 m across (smaller
// lower), squashed to 0.75 high; a core of three big boulders at the bottom (to ~32 m down, 0.3 of the width); slate
// (.09,.12,.14) self (.03,.04,.045), receiveShadows off, flat shaded, in the glow pass; four hanging chains of dark links off
// the front rim. Drawn only.
function rockMass(scene: Scene, built: Set<unknown>): void {
  for (const m of scene.meshes) if (built.has(m) && m.name.startsWith("islandCliff")) m.setEnabled(false);
  let seed = 0x1d0c;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const rocks: Mesh[] = [], links: Mesh[] = [];
  for (let k = 0; k < 4; k++) {
    const f = 0.92 - 0.2 * k, y = -4 - 7 * k, n = Math.round(28 - 5 * k);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + k * 0.4 + rnd() * 0.15, c = Math.cos(a), s = Math.sin(a);
      const r = 1 / (Math.abs(c / 53) ** 3 + Math.abs(s / 47) ** 3) ** (1 / 3);
      const size = (11 - k * 1.5) * (0.6 + rnd() * 0.4);
      const b = MeshBuilder.CreateIcoSphere("voidRockMass", { radius: size / 2, subdivisions: 1 }, scene);
      b.scaling.set(1 + rnd() * 0.3, 0.75, 1 + rnd() * 0.3);
      b.rotation.y = rnd() * 6.28;
      b.position.set(c * r * f, y - rnd() * 2, s * r * f);
      b.bakeCurrentTransformIntoVertices();
      rocks.push(b);
    }
  }
  for (const [x, z, rad] of [[-6, 3, 9], [7, -4, 8], [0, 8, 7]]) {
    const b = MeshBuilder.CreateIcoSphere("voidRockMass", { radius: rad, subdivisions: 1 }, scene);
    b.scaling.y = 0.9;
    b.position.set(x, -26 - rad * 0.5, z);
    b.bakeCurrentTransformIntoVertices();
    rocks.push(b);
  }
  for (const x of [-38, -14, 18, 36]) {
    const z = -47 * (1 - Math.abs(x / 53) ** 3) ** (1 / 3) - 1.5;
    const drop = 8 + rnd() * 10;
    for (let j = 0; j * 1.1 < drop; j++) {
      const l = MeshBuilder.CreateTorus("voidRimChain", { diameter: 1.1, thickness: 0.28, tessellation: 8 }, scene);
      l.rotation.set(0, j % 2 ? Math.PI / 2 : 0, Math.PI / 2);
      l.position.set(x, -1 - j * 1.1, z - 1);
      l.bakeCurrentTransformIntoVertices();
      links.push(l);
    }
  }
  const rock = new StandardMaterial("voidRockMass", scene);
  rock.diffuseColor = new Color3(0.09, 0.12, 0.14);
  rock.emissiveColor = new Color3(0.03, 0.04, 0.045);
  rock.specularColor = Color3.Black();
  const iron = new StandardMaterial("voidRimChain", scene);
  iron.diffuseColor = new Color3(0.16, 0.18, 0.2);
  iron.emissiveColor = new Color3(0.05, 0.055, 0.06);
  iron.specularColor = Color3.Black();
  for (const [parts, mat, name] of [[rocks, rock, "voidRockMass"], [links, iron, "voidRimChains"]] as const) {
    const merged = Mesh.MergeMeshes(parts, true, true);
    if (!merged) continue;
    merged.name = name;
    merged.convertToFlatShadedMesh();
    merged.material = mat;
    merged.receiveShadows = false;
    merged.isPickable = false;
  }
}

export function buildFantasyEvil(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  basaltFloor(scene, built);
  stairFlights(scene);
  greenRim(scene, built);
  rockMass(scene, built);
  rockRing(scene, built);
  // seat the base's small props (bones, crystals, rocks, ring trunks) on the terrace under them (drawn only; colliders unchanged)
  for (const m of scene.meshes) {
    if (!built.has(m) || m.parent || !m.isEnabled() || m.name === "basaltBlocks" || m.name === "basaltSeams") continue;
    const bb = m.getBoundingInfo().boundingBox;
    if (bb.extendSizeWorld.x > 6 || bb.extendSizeWorld.z > 6) continue;
    const lift = fantasyEvilHeight(bb.centerWorld.x, bb.centerWorld.z);
    if (lift > 0) { m.position.y += lift; m.computeWorldMatrix(true); }
  }
  const restoreSky = voidSky(scene, built);
  const shrined = shrine(scene, built, result);
  chainedStatue(scene, shrined.obstacles);
  const hazards = [...shrined.hazards, ...chasms(scene)];
  return { ...result, hazards, obstacles: shrined.obstacles, height: shrineHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
