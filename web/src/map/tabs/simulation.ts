// TABS "Simulation" (simulation map): an endless flat plane split by a thin red line, its floor ruled with a fine grid, under a pale
// sky (reference/maps/wiki/simulation.png, reference/maps/simulation.png; card loop/cards/maps/simulation.md). Built on the bare
// campaign.simulation plane (base()); the other simulation-family maps build on that base too, so this file dresses only this map.
//
// Grid floor (587, blocker a1; wiki simulation.png: a warm off-white floor ruled everywhere with thin grey lines 1 m apart, a
// slightly darker line every 5 m, running on into the haze). Spec: the base lawn ("ground", which sat flush over the plane and
// would show plain) is hidden; the bare plane takes its own material, a 512 px tile covering 5 x 5 m: warm off-white
// (228, 222, 212) with 2 px grey lines (190, 186, 182) every metre and 3 px lines (172, 168, 165) on the 5 m lines, repeated 320
// times across the 1600 m plane, trilinear with 16x anisotropy so the far grid fades into an even tone; lit, with a small
// warm self-light (0.18, 0.17, 0.16) so the floor reads off-white, not lilac.
import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, Texture, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";

const PLANE = 1600, TILE_M = 5, TILE_PX = 512;

function gridFloor(scene: Scene): void {
  for (const mesh of scene.meshes) if (mesh.name === "ground") mesh.setEnabled(false);
  const plane = scene.getMeshByName("barePlane");
  if (!plane) return;
  const tex = new DynamicTexture("simulationGrid", { width: TILE_PX, height: TILE_PX }, scene, true, Texture.TRILINEAR_SAMPLINGMODE);
  const ctx = tex.getContext();
  ctx.fillStyle = "rgb(228,222,212)";
  ctx.fillRect(0, 0, TILE_PX, TILE_PX);
  const step = TILE_PX / TILE_M;
  for (let i = 0; i < TILE_M; i++) {
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
  tex.uScale = PLANE / TILE_M;
  tex.vScale = PLANE / TILE_M;
  tex.anisotropicFilteringLevel = 16;
  const mat = new StandardMaterial("simulationGridFloor", scene);
  mat.diffuseTexture = tex;
  mat.diffuseColor = Color3.White();
  mat.emissiveColor = new Color3(0.18, 0.17, 0.16);
  mat.specularColor = Color3.Black();
  plane.material = mat;
}

// Empty centre (587, blocker a2; reference/maps/simulation.png: nothing stands on the plane but the red line). Spec: the base's
// kept centre disc ("centerGrass", a darker grey lawn disc at the origin) is hidden; the line runs uninterrupted through it.
function emptyCentre(scene: Scene): void {
  for (const mesh of scene.meshes) if (mesh.name === "centerGrass") mesh.setEnabled(false);
}

// Pale sky (587, blocker a3; wiki simulation.png: a clear pale cyan-blue sky overhead fading to a white haze at the horizon,
// where the floor melts into it with no edge or band). Spec: the shared sky dome (a flat grey band over a beige horizon) is
// switched off and in its place an unlit, fog-free backdrop sphere 1800 m across, inside-facing, whose vertex colours run from
// cyan-blue (0.38, 0.68, 0.76) overhead to near-white haze (0.86, 0.9, 0.9) at and below the horizon (smoothstep over the
// lowest 35 degrees), out of the glow; the fog colour becomes that haze, so the plane fades into the horizon colour. Dome and
// fog colour are put back on dispose.
function paleSky(scene: Scene): () => void {
  const dome = scene.getMeshByName("skyDome"), domeOn = dome?.isEnabled();
  dome?.setEnabled(false);
  const oldFog = scene.fogColor.clone(), oldClear = scene.clearColor.clone();
  const haze = new Color3(0.86, 0.9, 0.9), blue = new Color3(0.38, 0.68, 0.76);
  scene.fogColor.copyFrom(haze);
  scene.clearColor.set(haze.r, haze.g, haze.b, 1);
  const sky = MeshBuilder.CreateSphere("simulationSky", { diameter: 1800, segments: 24, sideOrientation: Mesh.BACKSIDE }, scene);
  const pos = sky.getVerticesData("position") ?? [];
  const cols: number[] = [];
  for (let i = 0; i < pos.length; i += 3) {
    const up = pos[i + 1] / Math.hypot(pos[i], pos[i + 1], pos[i + 2]);
    const t0 = Math.max(0, Math.min(1, up / 0.57));
    const t = t0 * t0 * (3 - 2 * t0);
    cols.push(haze.r + (blue.r - haze.r) * t, haze.g + (blue.g - haze.g) * t, haze.b + (blue.b - haze.b) * t, 1);
  }
  sky.setVerticesData("color", cols);
  const mat = new StandardMaterial("simulationSky", scene);
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

export function buildSimulation(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  gridFloor(scene);
  emptyCentre(scene);
  const restoreSky = paleSky(scene);
  return { ...result, dispose: () => { restoreSky(); result.dispose?.(); } };
}
