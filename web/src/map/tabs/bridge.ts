// TABS "Bridge" (simulation map): two big square grid-ruled blocks, one per team, standing as tall pillars out of a pale haze and
// joined by one long narrow bridge (reference/maps/wiki/bridge.png, reference/stages/simulation.bridge_battle.png; card
// loop/cards/maps/bridge.md: "two large blocks for each team ... connected by a long and narrow bridge ... 53 unit footprints in
// length, around 5 of width"). Built on the bare campaign.simulation plane (base()), which is put away.
//
// Spec (588, blocker b1): each block 46 x 50 m (x 18..64 and -64..-18, |z| <= 25), its top at ground level, its grid-ruled sides
// dropping 400 m into the haze; the bridge 5 m wide (|z| <= 2.5) over |x| < 18, the same top, a thin 400 m deep wall. The
// bridge is shorter than the card's 53 because simulation.bridge_battle's army stands from x 20 (the team-1 block must hold
// it). Everything else round them is void (box hazards from x -90..90, z -60..60); each team places on its own block; the red
// line crosses the bridge only.
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import { bareField, centreLine, gridBlock, voidAround, zonesOn, type Rect } from "./simKit";

const DEPTH = 400;
const BLOCK: Rect = { x0: 18, x1: 64, z0: -25, z1: 25 };
const SPAN: Rect = { x0: -18, x1: 18, z0: -2.5, z1: 2.5 };

export function buildBridge(scene: Scene, base: () => MapBuildResult): MapBuildResult {
  const result = base();
  const kept = bareField(scene, result);
  const left: Rect = { x0: -BLOCK.x1, x1: -BLOCK.x0, z0: BLOCK.z0, z1: BLOCK.z1 };
  gridBlock(scene, "bridgeBlock", BLOCK, 0, -DEPTH);
  gridBlock(scene, "bridgeBlock", left, 0, -DEPTH);
  gridBlock(scene, "bridgeSpan", SPAN, 0, -DEPTH);
  centreLine(scene, SPAN.z0, SPAN.z1);
  const hazards = [...kept, ...voidAround([left, SPAN, BLOCK], { x0: -90, x1: 90, z0: -60, z1: 60 })];
  const placementZones = zonesOn([{ ...left, team: 0 }, { ...BLOCK, team: 1 }]);
  return { ...result, hazards, placementZones };
}
