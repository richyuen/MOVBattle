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

export function paleSky(scene: Scene, blue = new Color3(0.38, 0.68, 0.76), haze = new Color3(0.86, 0.9, 0.9), span = 0.57): () => void {
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
