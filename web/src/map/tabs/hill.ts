// TABS "Hill" (simulation map): the left half's flat ground runs into a long straight ramp that climbs to a crest near the middle
// where the right half's front stands on the edge; past the crest the ridge falls again to a lower flat behind it
// (reference/maps/wiki/hill.png, reference/stages/simulation.hill.png; card: "both sides ... small, flat areas leading up to a
// point in the middle"). Visual height only (map/terrain.ts): the sim fights on the flat. Built on the bare simulation plane (base()).
//
// Crest (588, blockers b2, b3; wiki hill.png: the ramp climbs to a narrow crest where the blue army stands on the edge, and the
// block's far side shows the ground falling away again behind it; stages/simulation.hill.png: the army on the crest's edge).
// Spec: flat at 0 to x -24, a straight ramp up to 10 m at x 22 (simulation.hill's front rank stands at x 20-26), a 6 m crest to
// x 28, then down to 4 m at x 40 and a flat at 4 m on to the zone's end (x 76); the sheet is 56 m deep with plain block sides.
import type { Mesh, Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";
import { bareField, centreLine, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const RIDGE = { foot: -24, crest0: 22, crest1: 28, back: 40, top: 10, low: 4, end: 76, depth: 56, step: 2 };

const height: HeightField = (x) => {
  const r = RIDGE;
  if (x <= r.foot) return 0;
  if (x < r.crest0) return ((x - r.foot) / (r.crest0 - r.foot)) * r.top;
  if (x <= r.crest1) return r.top;
  if (x < r.back) return r.top - ((x - r.crest1) / (r.back - r.crest1)) * (r.top - r.low);
  return r.low;
};

// Grid and sky (588, blockers a1-a3; wiki hill.png: the ramp and the flat ruled with the 1 m simulation grid, warm off-white on
// top with cool grey-blue shaded side faces, under a pale blue sky). Spec: the ridge sheet takes the kit's grid material with
// planar uvs per face (its skirt culled to its outward faces), the base lawn is hidden and the endless plane takes the same grid
// tiled 320 times over its 1600 m; the simulation sky replaces the grey band.
function gridAndSky(scene: Scene, ridge: Mesh): () => void {
  const mat = gridMaterial(scene, "hillGridCulled");
  mat.backFaceCulling = true;
  ridge.material = mat;
  gridUVs(ridge);
  return paleSky(scene);
}

// Bounded block (589, blocker b1; wiki hill.png and stages/simulation.hill.png: the ramp, the crest and the low flat are one block
// whose sides drop sheer into the haze, no endless plane round it). Spec: the sheet runs from a 36 m left flat (x -60) to the
// right flat's end (x 76), |z| <= 28, its grid-ruled skirt 400 m deep; the base plane, lawn, centre disc and its void put away
// (bareField); everything off the sheet is void (box hazards x -90..100, z -60..60); team 0 places on the left flat and the ramp
// (x -60..-1), team 1 from x 1 to the sheet's end; the red line crosses the ramp at its height there.
const SHEET: Rect = { x0: -60, x1: RIDGE.end, z0: -RIDGE.depth / 2, z1: RIDGE.depth / 2 };

export function buildHill(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const ridge = terrainMesh(scene, "hill_ramp", height, {
    width: SHEET.x1 - SHEET.x0,
    depth: SHEET.z1 - SHEET.z0,
    cx: (SHEET.x0 + SHEET.x1) / 2,
    step: RIDGE.step,
    skirt: 400,
  });
  const restoreSky = gridAndSky(scene, ridge);
  centreLine(scene, SHEET.z0, SHEET.z1, height(0, 0));
  const hazards = [...kept, ...voidAround([SHEET], { x0: -90, x1: 100, z0: -60, z1: 60 })];
  const placementZones = zonesOn([{ ...SHEET, x1: -1, team: 0 }, { ...SHEET, x0: 1, team: 1 }]);
  return { ...result, hazards, placementZones, height, dispose: () => { restoreSky(); result.dispose?.(); } };
}
