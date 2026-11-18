// Shared kit for the TABS simulation-family maps (bridge, corridor, hill, low ground, high ground, defend the castle): every one is
// a few big blocks floating in a pale haze, each face ruled with the simulation grid (reference/maps/wiki/<id>.png). Nothing here
// runs unless a builder calls it, so simulation.ts (which has its own copies) and the base campaign.simulation plane are untouched.
//
// gridMaterial: warm off-white (228, 222, 212) with 2 px grey lines (190, 186, 182) every metre and 3 px lines (172, 168, 165) every
// 5 m, one texture tile per 5 m of uv (gridUVs writes uvs in metres / 5, planar per face, so every face of any size shows a
// 1 m grid). gridBlock: a box from `bottom` to `top`, faces ruled so. bareField: puts away the endless base plane, its lawn,
// centre disc, its 8 m void hazard and its 1600 m red line (renamed, so the placement guides never bring it back).
// voidAround: box void hazards covering everything in `bounds` outside the walkable rectangles. paleSky: the simulation sky
// (an unlit backdrop sphere from cyan-blue overhead to near-white haze at the horizon), colours as simulation.ts unless given.
import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture, Vector3, VertexBuffer, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { PlacementZone } from "../placementValidator";

export const GRID_TILE_M = 5;
const TILE_PX = 512;

export interface Rect { x0: number; x1: number; z0: number; z1: number }

export function gridMaterial(scene: Scene, name = "simKitGrid"): StandardMaterial {
  const known = scene.getMaterialByName(name);
  if (known instanceof StandardMaterial) return known;
  const tex = new DynamicTexture(`${name}_tex`, { width: TILE_PX, height: TILE_PX }, scene, true, Texture.TRILINEAR_SAMPLINGMODE);
  const ctx = tex.getContext();
  ctx.fillStyle = "rgb(228,222,212)";
  ctx.fillRect(0, 0, TILE_PX, TILE_PX);
  const step = TILE_PX / GRID_TILE_M;
  for (let i = 0; i < GRID_TILE_M; i++) {
    const major = i === 0;
    ctx.fillStyle = major ? "rgb(172,168,165)" : "rgb(190,186,182)";
    const w = major ? 3 : 2;
    const at = Math.round(i * step);
    ctx.fillRect(at, 0, w, TILE_PX);
    ctx.fillRect(0, at, TILE_PX, w);
  }
  tex.update(true);
  tex.wrapU = Texture.WRAP_ADDRESSMODE;
  tex.wrapV = Texture.WRAP_ADDRESSMODE;
  tex.anisotropicFilteringLevel = 16;
  const mat = new StandardMaterial(name, scene);
  mat.diffuseTexture = tex;
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = new Color3(0.18, 0.17, 0.16);
  mat.specularColor = Color3.Black();
  mat.backFaceCulling = false;
  return mat;
}

/** Planar uvs in metres / GRID_TILE_M from each vertex's world position and normal (flat-shaded meshes with baked transforms). */
export function gridUVs(mesh: Mesh): void {
  const pos = mesh.getVerticesData(VertexBuffer.PositionKind) ?? [];
  const nrm = mesh.getVerticesData(VertexBuffer.NormalKind) ?? [];
  const uv: number[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    const ax = Math.abs(nrm[i] ?? 0), ay = Math.abs(nrm[i + 1] ?? 1), az = Math.abs(nrm[i + 2] ?? 0);
    if (ay >= ax && ay >= az) uv.push(x / GRID_TILE_M, z / GRID_TILE_M);
    else if (ax >= az) uv.push(z / GRID_TILE_M, y / GRID_TILE_M);
    else uv.push(x / GRID_TILE_M, y / GRID_TILE_M);
  }
  mesh.setVerticesData(VertexBuffer.UVKind, uv);
}

/** A grid-ruled block over [x0, x1] x [z0, z1] from `bottom` up to `top`. */
export function gridBlock(scene: Scene, name: string, r: Rect, top: number, bottom: number, mat = gridMaterial(scene)): Mesh {
  const box = MeshBuilder.CreateBox(name, { width: r.x1 - r.x0, height: top - bottom, depth: r.z1 - r.z0 }, scene);
  box.position.set((r.x0 + r.x1) / 2, (top + bottom) / 2, (r.z0 + r.z1) / 2);
  box.bakeCurrentTransformIntoVertices();
  gridUVs(box);
  box.material = mat;
  box.receiveShadows = true;
  return box;
}

/** Puts away the base plane and its dressing; returns the base hazards without its centre void. */
export function bareField(scene: Scene, result: MapBuildResult): MapBuildResult["hazards"] {
  for (const mesh of scene.meshes) {
    if (["barePlane", "ground", "centerGrass", "campaign_hazard_cyl_void"].includes(mesh.name)) mesh.setEnabled(false);
    if (mesh.name === "border") { mesh.name = "simKitBaseLineOff"; mesh.setEnabled(false); }
  }
  return result.hazards.filter((h) => !(h.kind === "void" && h.shape === "cylinder" && Math.hypot(h.center.x, h.center.z) < 1));
}

/** The thin red centre line across [z0, z1] at height y (named "border": a placement guide). */
export function centreLine(scene: Scene, z0: number, z1: number, y = 0): Mesh {
  const line = MeshBuilder.CreateGround("border", { width: 0.16, height: z1 - z0 }, scene);
  line.position.set(0, y + 0.04, (z0 + z1) / 2);
  const mat = new StandardMaterial("simKitLine", scene);
  mat.diffuseColor = Color3.Black();
  mat.emissiveColor = new Color3(0.78, 0.22, 0.3);
  mat.disableLighting = true;
  line.material = mat;
  line.isPickable = false;
  return line;
}

/** Void box hazards over every part of `bounds` outside the walkable rectangles (sweep over x slabs). */
export function voidAround(walk: Rect[], bounds: Rect): MapBuildResult["hazards"] {
  const xs = [...new Set([bounds.x0, bounds.x1, ...walk.flatMap((r) => [r.x0, r.x1])])]
    .filter((x) => x >= bounds.x0 && x <= bounds.x1).sort((a, b) => a - b);
  const out: MapBuildResult["hazards"] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1], mid = (a + b) / 2;
    const cover = walk.filter((r) => r.x0 <= mid && r.x1 >= mid).map((r) => [r.z0, r.z1]).sort((p, q) => p[0] - q[0]);
    let z = bounds.z0;
    const gap = (z0: number, z1: number) => {
      if (z1 - z0 > 0.01) out.push({ shape: "box", kind: "void", center: new Vector3(mid, 0, (z0 + z1) / 2), halfX: (b - a) / 2, halfZ: (z1 - z0) / 2 });
    };
    for (const [z0, z1] of cover) {
      if (z0 > z) gap(z, z0);
      z = Math.max(z, z1);
    }
    gap(z, bounds.z1);
  }
  return out;
}

/** Team zones clipped to rectangles: each rectangle that lies in a team's half becomes a placement zone of that team. */
export function zonesOn(rects: Array<Rect & { team: number }>): PlacementZone[] {
  return rects.map((r) => ({ team: r.team, center: new Vector3((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2), size: new Vector3(r.x1 - r.x0, 100, r.z1 - r.z0) }));
}

/** Soft cloud banks standing in the haze behind the field (wiki hill.png, high_ground.png: big heaped white clouds whose
 *  undersides shade to a cool grey-blue). The island shot's camera sits ~113 m in front of the field at ~33 m up, looking down
 *  0.37 rad, so its sky band spans elevations about -0.2..+0.03: a bank at z ~200 must stand between y ~-25 and ~35 to show
 *  above the field's far edge (589's banks at y 40-80, z 450+ were out of frame). Each bank `[x, y, z, width]`: a base row of
 *  overlapping flattened puffs, a smaller crown row heaped on its middle; unlit vertex colours white on top to (.8,.87,.93)
 *  at the base, fog-free, opaque, out of the glow. Its meshes go with the map build (trackMapBuild). */
export function cloudBanks(scene: Scene, banks: Array<[number, number, number, number]>): Mesh | null {
  const puffs: Mesh[] = [];
  const puff = (x: number, y: number, z: number, r: number) => {
    const m = MeshBuilder.CreateSphere("simKitCloudPuff", { diameter: 2 * r, segments: 12 }, scene);
    m.scaling.set(1.2, 0.62, 0.45);
    m.position.set(x, y, z);
    m.bakeCurrentTransformIntoVertices();
    puffs.push(m);
  };
  for (const [cx, cy, cz, w] of banks) {
    const n = Math.max(4, Math.round(w / 22));
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1) - 0.5;
      const r = (0.62 - Math.abs(t) * 0.7) * w * 0.32;
      puff(cx + t * w * 0.95, cy + r * 0.25, cz + (i % 2) * 6, r);
    }
    for (let i = 0; i < 3; i++) {
      const t = (i - 1) * 0.22;
      const r = w * (i === 1 ? 0.17 : 0.12);
      puff(cx + t * w + w * 0.04, cy + w * 0.13 + (i === 1 ? w * 0.05 : 0), cz - 4, r);
    }
  }
  const merged = Mesh.MergeMeshes(puffs, true, true);
  if (!merged) return null;
  const pos = merged.getVerticesData(VertexBuffer.PositionKind) ?? [];
  let lo = Infinity, hi = -Infinity;
  for (let i = 1; i < pos.length; i += 3) { lo = Math.min(lo, pos[i]); hi = Math.max(hi, pos[i]); }
  // 591: untoned like the sky, white tops (246,248,250) over cool grey-blue bases (196,208,220), so the banks stay brighter than
  // the horizon haze (216,228,227) they stand in (code white rendered (210,210,210), darker than the new haze)
  const top = untoned(246, 248, 250), low = untoned(196, 208, 220);
  const cols: number[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const t0 = Math.max(0, Math.min(1, (pos[i + 1] - lo) / Math.max(1, hi - lo) * 1.6));
    const t = t0 * t0 * (3 - 2 * t0);
    cols.push(low.r + (top.r - low.r) * t, low.g + (top.g - low.g) * t, low.b + (top.b - low.b) * t, 1);
  }
  merged.setVerticesData(VertexBuffer.ColorKind, cols);
  const mat = new StandardMaterial("simKitCloud", scene);
  mat.disableLighting = true;
  mat.diffuseColor = Color3.Black();
  mat.emissiveColor = Color3.White();
  mat.specularColor = Color3.Black();
  mat.fogEnabled = false;
  merged.name = "simKitClouds";
  merged.material = mat;
  merged.applyFog = false;
  merged.isPickable = false;
  merged.receiveShadows = false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(merged);
  return merged;
}

/** Untoned colour (591): the code value an unlit StandardMaterial emissive needs so the frame shows the sRGB `target` (0-255)
 *  after main.ts's image processing. That pipeline is a full-frame post-process, so no mesh can leave it; instead its chain is
 *  inverted. Forward chain: the material decodes code^2.2 (IMAGEPROCESSINGPOSTPROCESS), x exposure 1.05, ACES fitted (input
 *  matrix, RRT/ODT fit, output matrix, saturate), gamma 1/2.2, contrast 1.1 (mix toward smoothstep by .1). It reproduces the
 *  590 shots: code (.38,.68,.76) -> (82,156,172) (measured (78,148,164) under the vignette), white -> (210,210,210), which is
 *  why the kit zenith read teal and its clouds grey. A pale target needs code values a little over 1 (the pipeline is HDR). */
export function untoned(r: number, g: number, b: number): Color3 {
  const IN = [[0.59719, 0.35458, 0.04823], [0.076, 0.90834, 0.01566], [0.0284, 0.13383, 0.83777]];
  const OUT = [[1.60475, -0.53108, -0.07367], [-0.10208, 1.10813, -0.00605], [-0.00327, -0.07276, 1.07602]];
  const mul = (m: number[][], v: number[]) => m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);
  const fit = (v: number) => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081);
  const sat = (x: number) => Math.min(1, Math.max(0, x));
  const fwd = (lin: number[]) => mul(OUT, mul(IN, lin.map((x) => x * 1.05)).map(fit)).map(sat)
    .map((x) => sat(Math.pow(x, 1 / 2.2))).map((x) => x + (x * x * (3 - 2 * x) - x) * 0.1);
  const t = [r / 255, g / 255, b / 255];
  let lin = t.map((x) => Math.pow(x, 2.2));
  for (let it = 0; it < 200; it++) {
    const f = fwd(lin);
    lin = lin.map((x, i) => Math.max(0, x * Math.pow(Math.max(1e-4, t[i]) / Math.max(1e-4, f[i]), 2.2)));
  }
  return new Color3(...lin.map((x) => Math.pow(x, 1 / 2.2)) as [number, number, number]);
}

// Kit sky (591, [S]): colours are the frame's sRGB targets, untoned. Read off wiki hill.png / stages/simulation.pit.png: pale
// grey-cyan (188,207,209) overhead lightening to (216,228,227) at the horizon; the 589/590 code values went through ACES as a
// dark teal zenith (82,156,172). The fog and clear colour take the untoned haze, so the far floor melts into the horizon ring.
export function paleSky(scene: Scene, blueSrgb: [number, number, number] = [186, 207, 210], hazeSrgb: [number, number, number] = [216, 228, 227], span = 0.15): () => void {
  const blue = untoned(...blueSrgb), haze = untoned(...hazeSrgb);
  const dome = scene.getMeshByName("skyDome"), domeOn = dome?.isEnabled();
  dome?.setEnabled(false);
  const oldFog = scene.fogColor.clone(), oldClear = scene.clearColor.clone();
  scene.fogColor.copyFrom(haze);
  scene.clearColor.set(haze.r, haze.g, haze.b, 1);
  const sky = MeshBuilder.CreateSphere("simKitSky", { diameter: 1800, segments: 24, sideOrientation: Mesh.BACKSIDE }, scene);
  const pos = sky.getVerticesData("position") ?? [];
  const cols: number[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const up = pos[i + 1] / Math.hypot(pos[i], pos[i + 1], pos[i + 2]);
    const t0 = Math.max(0, Math.min(1, up / span));
    const t = t0 * t0 * (3 - 2 * t0);
    cols.push(haze.r + (blue.r - haze.r) * t, haze.g + (blue.g - haze.g) * t, haze.b + (blue.b - haze.b) * t, 1);
  }
  sky.setVerticesData("color", cols);
  const mat = new StandardMaterial("simKitSky", scene);
  mat.disableLighting = true;
  mat.diffuseColor = Color3.Black();
  mat.emissiveColor = Color3.White();
  mat.specularColor = Color3.Black();
  mat.fogEnabled = false;
  sky.material = mat;
  sky.infiniteDistance = true;
  sky.applyFog = false;
  sky.isPickable = false;
  scene.getGlowLayerByName("glow")?.addExcludedMesh(sky);
  return () => {
    dome?.setEnabled(domeOn ?? true);
    scene.fogColor.copyFrom(oldFog);
    scene.clearColor.copyFrom(oldClear);
  };
}
