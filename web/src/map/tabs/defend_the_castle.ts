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
// (|z| <= 4), side walls |z| 27..30, walls top 18 m (592: plain, stepped, no merlons); back terrace x 54..64 top 14 m with a 6 m
// stair block rising to it at z -16..-10. Walls and terrace are box colliders; everything off the sheet is void; team 0 places
// on the attackers' flat, team 1 on the forecourt; the red line crosses the ramp at its height.
import { Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { terrainMesh, type HeightField } from "../terrain";
import { bareField, centreLine, gridBlock, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const SHEET: Rect = { x0: -60, x1: 64, z0: -30, z1: 30 };
const APPROACH = { foot: -22, top: 14, high: 10 };
const CASTLE = { x0: 36, wall: 3, gate: 4, top: 18, terrace0: 54, terraceTop: 14 };

// Three ramps (590, blocker b2; wiki defend_the_castle.png: separate ramps climb from the attackers' ground to the forecourt,
// split by deep V chasms whose grid walls fall sheer). Spec: over the approach (x -22..14) the sheet keeps three 12 m ramps at
// |z| <= 6 and 14 <= |z| <= 26; between and beside them it drops 40 m (chasms 8 m wide at |z| 6..14, 4 m at the outer edges).
// The chasms are box colliders, so armies climb the three ramps only (sim stays flat; nobody walks over the drop).
// Lower platforms (591, blocker b3; wiki defend_the_castle.png foreground: the attackers' ground is not one floor but three
// separate blocks, a wide middle one carrying the centre ramp and one each side, split by the same sheer gaps running on to the
// front edge). Spec: over the attackers' flat (x -60..-22) the sheet drops 40 m in 6 m gaps at |z| 8..14 (even metres: the sheet is a 2 m grid) and at the outer
// edges |z| 26..30, leaving a 16 m middle platform (|z| <= 8, wide enough for a skirmish rank 12.6 m across) and two 12 m side
// platforms (|z| 14..26); the gaps narrow by 2 m into the ramp chasms (|z| 6..14) at x -22. Box colliders as on the approach; team 0
// places on the three platforms only (middle first).
// V chasms (592, blocker b1; wiki defend_the_castle.png: the ramps are ridges and the chasms between them are wide wedges whose
// grid walls lean in and meet far below, a dark V pointing down, legible from above). Spec: the lanes between the ramps widen
// to 11 m (|z| 5..16, leaving a 10 m middle ramp and 10 m side ramps |z| 16..26, 4 m chasms at the outer edges), the front gaps
// to 7 m (|z| 8..15: 16 m middle platform, 11 m side platforms |z| 15..26); every chasm is a V in cross-section, its walls
// falling from the ridge's own height at the lane edge to -40 m on the lane's centre line (an 82 deg lean, so both walls show
// from the top shot). The sheet is faceted at 1 m so a wall carries 5 facets. Box colliders over each whole lane as before.
const CHASM = {
  depth: -40,
  lanes: [[-16, -5], [5, 16], [-30, -26], [26, 30]] as Array<[number, number]>,
  front: [[-15, -8], [8, 15], [-30, -26], [26, 30]] as Array<[number, number]>,
};

/** The lane [a, b] a point falls in, if any. */
const chasmAt = (x: number, z: number): [number, number] | undefined => {
  if (x > SHEET.x0 && x <= APPROACH.foot) return CHASM.front.find(([a, b]) => z > a && z < b);
  if (x > APPROACH.foot && x < APPROACH.top) return CHASM.lanes.find(([a, b]) => z > a && z < b);
  return undefined;
};

const ridgeHeight = (x: number) => {
  if (x <= APPROACH.foot) return 0;
  if (x >= APPROACH.top) return APPROACH.high;
  return ((x - APPROACH.foot) / (APPROACH.top - APPROACH.foot)) * APPROACH.high;
};

export const castleHeight: HeightField = (x, z) => {
  const ridge = ridgeHeight(x);
  const lane = chasmAt(x, z);
  if (!lane) return ridge;
  const [a, b] = lane;
  // outer edge lanes run off the sheet: their V centres on the sheet edge, so they fall from the ridge outward
  const centre = a <= SHEET.z0 ? SHEET.z0 : b >= SHEET.z1 ? SHEET.z1 : (a + b) / 2;
  const half = a <= SHEET.z0 || b >= SHEET.z1 ? b - a : (b - a) / 2;
  const t = Math.min(1, (half - Math.abs(z - centre)) / half);
  return ridge + (CHASM.depth - ridge) * Math.max(0, t);
};

function chasmColliders(): MapBuildResult["obstacles"] {
  const box = (x0: number, x1: number) => ([a, b]: [number, number]) => ({
    type: "box" as const,
    center: new Vector3((x0 + x1) / 2, 0, (a + b) / 2),
    halfX: (x1 - x0) / 2,
    halfZ: (b - a) / 2,
  });
  return [...CHASM.lanes.map(box(APPROACH.foot, APPROACH.top)), ...CHASM.front.map(box(SHEET.x0, APPROACH.foot))];
}

/** The castle's walls, terrace and stair as grid blocks standing on the 10 m floor; returns their box colliders. */
function buildCastle(scene: Scene): MapBuildResult["obstacles"] {
  const floor = APPROACH.high, c = CASTLE, x1 = SHEET.x1, zEdge = SHEET.z1;
  const solids: Rect[] = [
    { x0: c.x0, x1: c.x0 + c.wall, z0: -zEdge, z1: -c.gate },
    { x0: c.x0, x1: c.x0 + c.wall, z0: c.gate, z1: zEdge },
    { x0: c.x0 + c.wall, x1, z0: -zEdge, z1: -zEdge + c.wall },
    { x0: c.x0 + c.wall, x1, z0: zEdge - c.wall, z1: zEdge },
  ];
  // Plain stepped walls (592, blocker a1; wiki defend_the_castle.png, stages/simulation.siege.thumb.png: the walls are thick
  // plain grid blocks with flat tops, no crenellations; their tops step down in broad notches, the front wall lower beside the
  // gate and each side wall dropping a storey along its middle). Spec: the merlons are gone; each wall is drawn as runs of
  // flat-topped blocks: front walls 18 m from the corner to |z| 12, 15 m from |z| 12 to the gate; side walls 18 m at both
  // ends, 15 m over x 44..52. The colliders keep the walls' whole footprints.
  const runs: Array<[Rect, number]> = [];
  for (const s of [-1, 1]) {
    const zs = (a: number, b: number) => (s > 0 ? { z0: a, z1: b } : { z0: -b, z1: -a });
    runs.push([{ x0: c.x0, x1: c.x0 + c.wall, ...zs(12, zEdge) }, c.top]);
    runs.push([{ x0: c.x0, x1: c.x0 + c.wall, ...zs(c.gate, 12) }, c.top - 3]);
    const side = zs(zEdge - c.wall, zEdge);
    runs.push([{ x0: c.x0 + c.wall, x1: 44, ...side }, c.top]);
    runs.push([{ x0: 44, x1: 52, ...side }, c.top - 3]);
    runs.push([{ x0: 52, x1, ...side }, c.top]);
  }
  for (const [r, top] of runs) gridBlock(scene, "castleWall", r, top, floor);
  const terrace: Rect = { x0: c.terrace0, x1, z0: -zEdge + c.wall, z1: zEdge - c.wall };
  gridBlock(scene, "castleTerrace", terrace, c.terraceTop, floor);
  // inner stair: four 1 m treads climbing from the courtyard to the terrace along its front face
  for (let i = 0; i < 4; i++) {
    gridBlock(scene, "castleStair", { x0: c.terrace0 - 6 + i * 1.5, x1: c.terrace0, z0: -16, z1: -10 }, floor + i + 1, floor);
  }
  return [...solids, terrace].map((r) => ({
    type: "box" as const,
    center: new Vector3((r.x0 + r.x1) / 2, 0, (r.z0 + r.z1) / 2),
    halfX: (r.x1 - r.x0) / 2,
    halfZ: (r.z1 - r.z0) / 2,
  }));
}

// Archer poles (589, blocker a2; wiki defend_the_castle.png and stages/simulation.siege.thumb.png: two tall square grid pillars
// stand on the forecourt before the gate, a little apart, each about a third as wide as tall, tops above the castle walls'
// height). Spec: 3 x 3 m pillars at (29, +-12), between the siege armies' ranks (nearest unit 3.6 m away), rising 11 m above
// the forecourt to 21 m; box colliders.
function archerPoles(scene: Scene): MapBuildResult["obstacles"] {
  return [-1, 1].map((s) => {
    const r: Rect = { x0: 27.5, x1: 30.5, z0: s * 12 - 1.5, z1: s * 12 + 1.5 };
    gridBlock(scene, "castlePole", r, APPROACH.high + 11, APPROACH.high);
    return { type: "box" as const, center: new Vector3(29, 0, s * 12), halfX: 1.5, halfZ: 1.5 };
  });
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
    step: 1,
    skirt: 400,
    material: mat,
  });
  gridUVs(sheet);
  const obstacles = [...result.obstacles, ...buildCastle(scene), ...archerPoles(scene), ...chasmColliders()];
  centreLine(scene, SHEET.z0, SHEET.z1, castleHeight(0, 0));
  const hazards = [...kept, ...voidAround([SHEET], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([
    { x0: SHEET.x0, x1: APPROACH.foot, z0: -8, z1: 8, team: 0 },
    { x0: SHEET.x0, x1: APPROACH.foot, z0: -26, z1: -15, team: 0 },
    { x0: SHEET.x0, x1: APPROACH.foot, z0: 15, z1: 26, team: 0 },
    { ...SHEET, x0: APPROACH.top, x1: CASTLE.x0, team: 1 },
  ]);
  const restoreSky = paleSky(scene);
  return { ...result, obstacles, hazards, placementZones, height: castleHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
