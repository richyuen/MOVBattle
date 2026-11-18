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
import { bareField, centreLine, cloudBanks, gridBlock, gridMaterial, gridUVs, paleSky, voidAround, zonesOn, type Rect } from "./simKit";

const SHEET: Rect = { x0: -60, x1: 48, z0: -22, z1: 22 };
const RAMP = { foot: -24, top: 10, high: 12 };

// Wall ramps (590, blocker b3; card: "at the top, there are two ramps, which lead up to two walls"). Spec: behind each gate
// wall a 9 m wide ramp (8 <= |z| <= 17) climbs from the platform's back edge (x 48) to the wall top (7 m up) at the wall's back
// face (x 36), drawn in the sheet's own height field so its sides fall as grid faces; units walking there are drawn on it.
const WALL_RAMP = { z0: 8, z1: 17, x0: 36, x1: 48, rise: 7 };

// Wall tops (591, blocker b2; wiki high_ground.png: the defenders' catapults stand up on the two gate walls, their crews on top,
// reached by the wall ramps). Spec: the gate walls' tops are standable plateaus in the height field (strictly inside x 28..36,
// 5 < |z| < 20, at the walls' 7 m), so a unit there is drawn on the wall; the sheet is faceted at 1 m so the plateau's edge
// wedges stay inside the wall blocks. The walls' box colliders become thin face colliders: front (x 28), gate side (|z| 5),
// outer side (|z| 20), back beside the ramp (x 36 at |z| 5..8 and 17..20), and both sides of each wall ramp where it stands
// over 2 m (x 36..44), so the top is reached only up the ramps. A team-1 zone over the right wall top comes first, so the
// map's skirmish puts units up there.
const onWallTop = (x: number, az: number) => x > 28 && x < 36 && az > 5 && az < 20;

/** The drawn ground: low flat, ramp, platform, wall tops and wall ramps (the sheet mesh is shaped by this field). */
const sheetHeight: HeightField = (x, z) => {
  if (x <= RAMP.foot) return 0;
  if (x < RAMP.top) return ((x - RAMP.foot) / (RAMP.top - RAMP.foot)) * RAMP.high;
  const w = WALL_RAMP, az = Math.abs(z);
  if (onWallTop(x, az)) return RAMP.high + w.rise;
  if (az >= w.z0 && az <= w.z1 && x >= w.x0 && x <= w.x1) return RAMP.high + (w.rise * (w.x1 - x)) / (w.x1 - w.x0);
  return RAMP.high;
};

// Archers on the bar (598, blocker b2, starvation; wiki high_ground.png: a rank of seven archers stands along the top of the
// block over the gate, the catapults on the two lower wall tops either side). Spec: the gate block's crown (x 27..37,
// |z| <= 5.5, 24 m above the low flat) is a standable plateau for units: a unit inside the gate opening (x 27.5..36.5,
// |z| < 4.6, inside the walls' gate faces) is drawn on the crown, not on the sheet (the field is single-valued, so a unit
// walking through the gate is drawn up there while it passes: it climbs onto the bar to fight the archers there, as no melee
// reaches them in TABS). The sheet mesh keeps sheetHeight, so the opening stays open. A team-1 zone over the bar (x 28..36,
// |z| <= 4) comes first, so the map's skirmish puts its archers' rank up there (its clubbers' rank stands before the gate).
const BAR_TOP = { x0: 27.5, x1: 36.5, z: 4.6 };
const onBar = (x: number, az: number) => x > BAR_TOP.x0 && x < BAR_TOP.x1 && az < BAR_TOP.z;

export const highGroundHeight: HeightField = (x, z) => {
  if (onBar(x, Math.abs(z))) return RAMP.high + 11.5 + 0.5;
  return sheetHeight(x, z);
};

function wallFaceColliders(): MapBuildResult["obstacles"] {
  const t = 0.4, out: MapBuildResult["obstacles"] = [];
  const box = (x0: number, x1: number, z0: number, z1: number) =>
    out.push({ type: "box", center: new Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2), halfX: (x1 - x0) / 2, halfZ: (z1 - z0) / 2 });
  for (const s of [-1, 1]) {
    const zs = (a: number, b: number): [number, number] => (s > 0 ? [a, b] : [-b, -a]);
    box(28 - t, 28 + t, ...zs(5, 20));
    box(28, 36, ...zs(5 - t, 5 + t));
    box(28, 36, ...zs(20 - t, 20 + t));
    box(36 - t, 36 + t, ...zs(5, 8));
    box(36 - t, 36 + t, ...zs(17, 20));
    box(36, 44, ...zs(8 - t, 8 + t));
    box(36, 44, ...zs(17 - t, 17 + t));
  }
  return out;
}

// Gateway (589, blocker a2; wiki high_ground.png: on the platform two square grid blocks stand either side of a gate, each
// about as tall as the ramp's rise and twice as wide as the gate, and a thinner bar spans the gate between their tops, its
// underside about two thirds of the way up, so the gate reads as a square arch). Spec: walls x 28..36 (behind the catapults at
// x 20), |z| 5..20, top 7 m above the platform; bar |z| <= 5 from 4.5 m to 7 m up; the walls are box colliders, the gate open.
const GATE = { x0: 28, x1: 36, gate: 5, side: 20, wallH: 7, barUnder: 4.5 };

function gateWalls(scene: Scene): MapBuildResult["obstacles"] {
  const g = GATE, floor = RAMP.high;
  const walls: Rect[] = [-1, 1].map((s) => ({ x0: g.x0, x1: g.x1, z0: s > 0 ? g.gate : -g.side, z1: s > 0 ? g.side : -g.gate }));
  for (const r of walls) gridBlock(scene, "highGroundWall", r, floor + g.wallH, floor);
  gateBlock(scene, floor);
  return wallFaceColliders();
}

// Gate block (593, blocker a1; wiki high_ground.png: over the gate the bar is a taller block of its own, standing clearly above
// the two side walls and a little proud of their faces, so the gateway reads as a central keep between two lower wings).
// Spec: the bar becomes a block x 27..37 (1 m proud of the walls front and back), |z| <= 5.5 (0.5 m over each wall's gate
// end, short of the wall tops' first rank at |z| ~6), from 4.5 m (the opening's head, unchanged) to 11.5 m above the
// platform, 4.5 m over the 7 m walls; a 0.5 m crown slab 0.5 m proud of it all round. Drawn only: the height field and the
// colliders are unchanged (units walk under it through the gate, the field being single-valued).
const GATE_BLOCK = { x0: 27, x1: 37, z: 5.5, top: 11.5, crown: 0.5 };

function gateBlock(scene: Scene, floor: number): void {
  const b = GATE_BLOCK, under = floor + GATE.barUnder;
  gridBlock(scene, "highGroundGateBlock", { x0: b.x0, x1: b.x1, z0: -b.z, z1: b.z }, floor + b.top, under);
  const c = b.crown;
  gridBlock(scene, "highGroundGateCrown", { x0: b.x0 - c, x1: b.x1 + c, z0: -b.z - c, z1: b.z + c }, floor + b.top + c, floor + b.top);
}

export function buildHighGround(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const mat = gridMaterial(scene, "simKitGridCulled");
  mat.backFaceCulling = true;
  const sheet = terrainMesh(scene, "highGroundSheet", sheetHeight, {
    width: SHEET.x1 - SHEET.x0,
    depth: SHEET.z1 - SHEET.z0,
    cx: (SHEET.x0 + SHEET.x1) / 2,
    step: 1,
    skirt: 400,
    material: mat,
  });
  gridUVs(sheet);
  const obstacles = [...result.obstacles, ...gateWalls(scene)];
  centreLine(scene, SHEET.z0, SHEET.z1, sheetHeight(0, 0));
  const hazards = [...kept, ...voidAround([SHEET], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  // Defenders on the walls (592, blocker b2; wiki high_ground.png: the defenders' line stands up on both gate walls). The
  // team-1 zones over the walls now run from the wall front (x 28) back over each wall ramp to the platform's back edge (x 48),
  // so a rank placed at a zone's centre less 6 m and 2 m (the skirmish's two ranks) stands on the wall top (x 32) and the ramp
  // head (x 36), not on the flat before the wall; the right wall's zone first, the left wall's second.
  const placementZones = zonesOn([
    { ...SHEET, x1: -1, team: 0 },
    { x0: 28, x1: 36, z0: -4, z1: 4, team: 1 },
    { x0: 28, x1: 48, z0: 5, z1: 20, team: 1 },
    { x0: 28, x1: 48, z0: -20, z1: -5, team: 1 },
    { ...SHEET, x0: 1, team: 1 },
  ]);
  const restoreSky = paleSky(scene);
  // Clouds (590, blocker a4; wiki high_ground.png: large heaped white clouds left and right behind the platform): kit banks at
  // z 200-230 inside the island shot's sky band, as on Hill.
  cloudBanks(scene, [[-130, -16, 210, 180], [20, -22, 240, 120], [150, -12, 205, 190]]);
  return { ...result, obstacles, hazards, placementZones, height: highGroundHeight, dispose: () => { restoreSky(); result.dispose?.(); } };
}
