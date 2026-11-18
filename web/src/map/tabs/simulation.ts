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
import { Color3, DynamicTexture, StandardMaterial, Texture, type Scene } from "@babylonjs/core";
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

export function buildSimulation(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  gridFloor(scene);
  return result;
}
