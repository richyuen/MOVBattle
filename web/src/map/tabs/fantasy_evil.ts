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
const CHASMS = [
  { x0: -28, x1: -14, z0: -10, z1: -6 }, { x0: -10, x1: 10, z0: -10, z1: -6 }, { x0: 14, x1: 28, z0: -10, z1: -6 },
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
export const fantasyEvilHeight: HeightField = (x, z) => blockLevel(blockCentre(x), blockCentre(z));

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
      if (inChasm(x, z)) continue;
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

/** Drawn height with the shrine dais and the altar raised over the plateau. */
const shrineHeight: HeightField = (x, z) => {
  const base = fantasyEvilHeight(x, z);
  if (Math.hypot(x - ALTAR.x, z - ALTAR.z) < 3.2) return base + 1;
  if (Math.hypot(x - SHRINE.x, z - SHRINE.z) < SHRINE.dais) return base + 0.8;
  return base;
};

export function buildFantasyEvil(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const prior = new Set(scene.meshes);
  const result = base();
  const built = new Set<unknown>(scene.meshes.filter((m) => !prior.has(m)));
  basaltFloor(scene, built);
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
  const hazards = [...shrined.hazards, ...chasms(scene)];
  return { ...result, hazards, obstacles: shrined.obstacles, height: shrineHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
