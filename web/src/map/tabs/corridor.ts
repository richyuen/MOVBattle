// TABS "Corridor" (simulation map): a small field split in two by a thick wall with one narrow corridor cut through it; each team
// stands on a lower square pad either side and the armies meet in the slot (reference/maps/wiki/corridor.png,
// reference/stages/simulation.wall.png; card loop/cards/maps/corridor.md). Built on the bare campaign.simulation plane (base()),
// which is put away.
//
// Spec (588, blocker b2; the wiki shot is a cross of tall grid blocks: two square pads along the battle axis and a thicker wall
// block across the middle, wider than the pads and standing about a quarter of a pad's width above them, a slot a few units
// wide cut down to pad level through its middle). Pads 30 x 30 m (x 8..38 and -38..-8, |z| <= 15), top at ground level; wall
// 16 m thick (|x| <= 8) and 52 m long (|z| <= 26), top 7 m up; slot 4 m wide (|z| <= 2) with its floor at pad level. All grid
// blocks dropping 400 m into the haze. The two wall halves are box colliders; everything off the pads and the slot is void;
// each team places on its own pad; the red line crosses the slot.
import { Vector3, type Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { bareField, centreLine, gridBlock, voidAround, zonesOn, type Rect } from "./simKit";

const DEPTH = 400, WALL_H = 7, PAD: Rect = { x0: 8, x1: 38, z0: -15, z1: 15 };
const WALL = { half: 8, len: 26, slot: 2 };

export function buildCorridor(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const left: Rect = { x0: -PAD.x1, x1: -PAD.x0, z0: PAD.z0, z1: PAD.z1 };
  const slot: Rect = { x0: -WALL.half, x1: WALL.half, z0: -WALL.slot, z1: WALL.slot };
  gridBlock(scene, "corridorPad", PAD, 0, -DEPTH);
  gridBlock(scene, "corridorPad", left, 0, -DEPTH);
  gridBlock(scene, "corridorSlotFloor", slot, 0, -DEPTH);
  for (const s of [-1, 1]) {
    const z0 = s > 0 ? WALL.slot : -WALL.len, z1 = s > 0 ? WALL.len : -WALL.slot;
    gridBlock(scene, "corridorWall", { x0: -WALL.half, x1: WALL.half, z0, z1 }, WALL_H, -DEPTH);
  }
  centreLine(scene, slot.z0, slot.z1);
  const half = (WALL.len - WALL.slot) / 2;
  const obstacles = [
    ...result.obstacles,
    ...[-1, 1].map((s) => ({ type: "box" as const, center: new Vector3(0, 0, s * (WALL.slot + half)), halfX: WALL.half, halfZ: half })),
  ];
  const hazards = [...kept, ...voidAround([left, slot, PAD], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([{ ...left, team: 0 }, { ...PAD, team: 1 }]);
  return { ...result, obstacles, hazards, placementZones };
}
