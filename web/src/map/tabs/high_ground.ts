// TABS "High Ground" (simulation map): a flat low ground for the attackers, a long straight ramp climbing to a high platform
// with sheer grid-ruled sides, where the defenders stand (reference/maps/wiki/high_ground.png, stages/simulation.catapult_castle;
// card loop/cards/maps/high_ground.md: "an area of flat land at the bottom with a ramp leading up to an elevated platform").
// Visual height only (map/terrain.ts): the sim fights on the flat. Built on the bare campaign.simulation plane (base()), put away.
//
// Platform (589, blocker b1; wiki high_ground.png: the ramp is as wide as the platform, about twice as long as it is high,
// and runs straight into the platform's front edge; the block's side is one sheer grid wall). Spec: one sheet |z| <= 22 from
// x -60 to 48: low flat at 0 to x -24, ramp up to 12 m at x 10, platform at 12 m to x 48 (simulation.catapult_castle's nine
// catapults stand at x 20, |z| <= 16); faceted terrainMesh at 2 m steps, 400 m grid skirt; everything off the sheet void;
// team 0 places on the low flat and the ramp's foot (x < -1), team 1 from x 1; the red line crosses the ramp at its height.
import { Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";
import { bareField, centreLine, gridBlock, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const SHEET: Rect = { x0: -60, x1: 48, z0: -22, z1: 22 };
const RAMP = { foot: -24, top: 10, high: 12 };

export const highGroundHeight: HeightField = (x) => {
  if (x <= RAMP.foot) return 0;
  if (x >= RAMP.top) return RAMP.high;
  return ((x - RAMP.foot) / (RAMP.top - RAMP.foot)) * RAMP.high;
};

// Gateway (589, blocker a2; wiki high_ground.png: on the platform two square grid blocks stand either side of a gate, each
// about as tall as the ramp's rise and twice as wide as the gate, and a thinner bar spans the gate between their tops, its
// underside about two thirds of the way up, so the gate reads as a square arch). Spec: walls x 28..36 (behind the catapults at
// x 20), |z| 5..20, top 7 m above the platform; bar |z| <= 5 from 4.5 m to 7 m up; the walls are box colliders, the gate open.
const GATE = { x0: 28, x1: 36, gate: 5, side: 20, wallH: 7, barUnder: 4.5 };

function gateWalls(scene: Scene): MapBuildResult["obstacles"] {
  const g = GATE, floor = RAMP.high;
  const walls: Rect[] = [-1, 1].map((s) => ({ x0: g.x0, x1: g.x1, z0: s > 0 ? g.gate : -g.side, z1: s > 0 ? g.side : -g.gate }));
  for (const r of walls) gridBlock(scene, "highGroundWall", r, floor + g.wallH, floor);
  gridBlock(scene, "highGroundBar", { x0: g.x0, x1: g.x1, z0: -g.gate, z1: g.gate }, floor + g.wallH, floor + g.barUnder);
  return walls.map((r) => ({
    type: "box" as const,
    center: new Vector3((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2),
    halfX: (r.x1 - r.x0) / 2,
    halfZ: (r.z1 - r.z0) / 2,
  }));
}

export function buildHighGround(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const mat = gridMaterial(scene, "simKitGridCulled");
  mat.backFaceCulling = true;
  const sheet = terrainMesh(scene, "highGroundSheet", highGroundHeight, {
    width: SHEET.x1 - SHEET.x0,
    depth: SHEET.z1 - SHEET.z0,
    cx: (SHEET.x0 + SHEET.x1) / 2,
    step: 2,
    skirt: 400,
    material: mat,
  });
  gridUVs(sheet);
  const obstacles = [...result.obstacles, ...gateWalls(scene)];
  centreLine(scene, SHEET.z0, SHEET.z1, highGroundHeight(0, 0));
  const hazards = [...kept, ...voidAround([SHEET], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([{ ...SHEET, x1: -1, team: 0 }, { ...SHEET, x0: 1, team: 1 }]);
  const restoreSky = paleSky(scene);
  return { ...result, obstacles, hazards, placementZones, height: highGroundHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
