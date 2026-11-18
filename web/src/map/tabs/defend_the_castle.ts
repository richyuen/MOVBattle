// TABS "Defend The Castle" (simulation map): the attackers' low ground, an approach climbing to a raised forecourt, and behind it
// a big grid-ruled castle block with a walled courtyard and crenellated parapets at the defenders' end
// (reference/maps/wiki/defend_the_castle.png, reference/stages/simulation.siege.png; card loop/cards/maps/defend_the_castle.md:
// "a large castle that units can defend ... ramps and elevated positions"). Visual height only (map/terrain.ts): the sim fights
// on the flat. Built on the bare campaign.simulation plane (base()), which is put away.
//
// Castle (589, blocker b1; wiki defend_the_castle.png: a square castle block as wide as the field, a courtyard walled on three
// sides with a broad parapet wall 3 m thick, a raised terrace across its back reached by an inner stair, a gate gap in the front
// wall facing the forecourt; stages/simulation.siege.png: the defenders stand on the forecourt in front of it). Spec: one sheet
// |z| <= 30 from x -60 to 64: attackers' flat at 0 to x -22, one approach ramp up to 10 m at x 14, forecourt and castle floor at
// 10 m (both siege stages stand at x 20..31.5, |z| <= 22, on the forecourt). Castle x 36..64: front wall x 36..39 with an 8 m gate
// (|z| <= 4), side walls |z| 27..30, walls top 18 m with 1.2 m merlons every 3 m; back terrace x 54..64 top 14 m with a 6 m
// stair block rising to it at z -16..-10. Walls and terrace are box colliders; everything off the sheet is void; team 0 places
// on the attackers' flat, team 1 on the forecourt; the red line crosses the ramp at its height.
import { Mesh, Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";
import { bareField, centreLine, gridBlock, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const SHEET: Rect = { x0: -60, x1: 64, z0: -30, z1: 30 };
const APPROACH = { foot: -22, top: 14, high: 10 };
const CASTLE = { x0: 36, wall: 3, gate: 4, top: 18, terrace0: 54, terraceTop: 14, merlon: 1.2 };

export const castleHeight: HeightField = (x) => {
  if (x <= APPROACH.foot) return 0;
  if (x >= APPROACH.top) return APPROACH.high;
  return ((x - APPROACH.foot) / (APPROACH.top - APPROACH.foot)) * APPROACH.high;
};

/** The castle's walls, terrace and stair as grid blocks standing on the 10 m floor; returns their box colliders. */
function buildCastle(scene: Scene): MapBuildResult["obstacles"] {
  const floor = APPROACH.high, c = CASTLE, x1 = SHEET.x1, zEdge = SHEET.z1;
  const solids: Rect[] = [
    { x0: c.x0, x1: c.x0 + c.wall, z0: -zEdge, z1: -c.gate },
    { x0: c.x0, x1: c.x0 + c.wall, z0: c.gate, z1: zEdge },
    { x0: c.x0 + c.wall, x1, z0: -zEdge, z1: -zEdge + c.wall },
    { x0: c.x0 + c.wall, x1, z0: zEdge - c.wall, z1: zEdge },
  ];
  for (const r of solids) gridBlock(scene, "castleWall", r, c.top, floor);
  const terrace: Rect = { x0: c.terrace0, x1, z0: -zEdge + c.wall, z1: zEdge - c.wall };
  gridBlock(scene, "castleTerrace", terrace, c.terraceTop, floor);
  // inner stair: four 1 m treads climbing from the courtyard to the terrace along its front face
  for (let i = 0; i < 4; i++) {
    gridBlock(scene, "castleStair", { x0: c.terrace0 - 6 + i * 1.5, x1: c.terrace0, z0: -16, z1: -10 }, floor + i + 1, floor);
  }
  // crenellations: merlons every 3 m along the outer edge of each wall top
  const merlons: Mesh[] = [];
  const m = c.merlon;
  for (let z = -zEdge + 0.5; z < zEdge - 0.5; z += 3) {
    if (Math.abs(z + m / 2) < c.gate) continue;
    merlons.push(gridBlock(scene, "castleMerlon", { x0: c.x0, x1: c.x0 + m, z0: z, z1: z + m }, c.top + m, c.top));
  }
  for (let x = c.x0 + 0.5; x < x1 - 0.5; x += 3) {
    for (const s of [-1, 1]) {
      const z0 = s > 0 ? zEdge - m : -zEdge;
      merlons.push(gridBlock(scene, "castleMerlon", { x0: x, x1: x + m, z0, z1: z0 + m }, c.top + m, c.top));
    }
  }
  const merged = Mesh.MergeMeshes(merlons, true, true);
  if (merged) merged.name = "castleMerlons";
  return [...solids, terrace].map((r) => ({
    type: "box" as const,
    center: new Vector3((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2),
    halfX: (r.x1 - r.x0) / 2,
    halfZ: (r.z1 - r.z0) / 2,
  }));
}

export function buildDefendTheCastle(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const mat = gridMaterial(scene, "simKitGridCulled");
  mat.backFaceCulling = true;
  const sheet = terrainMesh(scene, "castleSheet", castleHeight, {
    width: SHEET.x1 - SHEET.x0,
    depth: SHEET.z1 - SHEET.z0,
    cx: (SHEET.x0 + SHEET.x1) / 2,
    step: 2,
    skirt: 400,
    material: mat,
  });
  gridUVs(sheet);
  const obstacles = [...result.obstacles, ...buildCastle(scene)];
  centreLine(scene, SHEET.z0, SHEET.z1, castleHeight(0, 0));
  const hazards = [...kept, ...voidAround([SHEET], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([
    { ...SHEET, x1: APPROACH.foot, team: 0 },
    { ...SHEET, x0: APPROACH.top, x1: CASTLE.x0, team: 1 },
  ]);
  const restoreSky = paleSky(scene);
  return { ...result, obstacles, hazards, placementZones, height: castleHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
