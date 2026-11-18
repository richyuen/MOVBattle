// TABS "Low Ground" (simulation map): one long grid-ruled slab of fixed width floating in the haze; each end is a high flat, the
// field falls down a slope from it to a sunken floor in the middle and climbs again to the other high flat (reference/maps/wiki/
// low_ground.png, reference/stages/simulation.pit.png; card loop/cards/maps/low_ground.md: "the middle area being a dip. Each side
// has a high ground and each side has a low ground"). Visual height only (map/terrain.ts): the sim fights on the flat.
//
// Spec (588, blockers b1-b3; the wiki shot: the floor runs about two slope-lengths between the banks, each bank climbing about a
// third of the floor's width, the slab's sides sheer and grid-ruled into the haze). Slab x -60..60, |z| <= 22. Low floor |x| <= 10
// at 0; banks |x| 10..20 rising to 7 m; high flats |x| >= 20 (simulation.pit's army stands on team 1's from x 20). Faceted
// terrainMesh at 2 m steps with a 400 m skirt, ruled with the grid; the base plane put away and everything round the slab void;
// each team places on its own half; the red line crosses the floor.
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";
import { bareField, centreLine, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const SLAB: Rect = { x0: -60, x1: 60, z0: -22, z1: 22 };
const TROUGH = { floor: 10, bank: 20, high: 7 };

const height: HeightField = (x) => {
  const ax = Math.abs(x);
  if (ax <= TROUGH.floor) return 0;
  if (ax >= TROUGH.bank) return TROUGH.high;
  return ((ax - TROUGH.floor) / (TROUGH.bank - TROUGH.floor)) * TROUGH.high;
};

export function buildLowGround(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  // terrainMesh's skirt carries both windings: culled, so only the outward face of each shows
  const mat = gridMaterial(scene, "simKitGridCulled");
  mat.backFaceCulling = true;
  const slab = terrainMesh(scene, "lowGroundSlab", height, {
    width: SLAB.x1 - SLAB.x0,
    depth: SLAB.z1 - SLAB.z0,
    step: 2,
    skirt: 400,
    material: mat,
  });
  gridUVs(slab);
  centreLine(scene, SLAB.z0, SLAB.z1);
  const hazards = [...kept, ...voidAround([SLAB], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([{ ...SLAB, x1: -1, team: 0 }, { ...SLAB, x0: 1, team: 1 }]);
  // Pale haze (588, blocker a4; wiki low_ground.png: pale cyan haze beyond the slab's edges): the simulation sky
  const restoreSky = paleSky(scene);
  return { ...result, hazards, placementZones, height, dispose: () => { restoreSky(); result.dispose?.(); } };
}
