// Builders of the TABS maps (loop v10 maps phase), one file per map: ./<mapId>.ts exports `build<MapId>` and is listed here.
// A builder gets the scene and `base`, the build of the map's base (TABS_MAPS[id].base): it may call base() and dress the result, or
// build from scratch. It returns the zones, obstacles and hazards like any map. Shared helpers come from ../mapBuilder (exported there).
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { TabsMapId } from "../tabsMaps";
import { buildHill } from "./hill";
import { buildBridge } from "./bridge";
import { buildFarmer1 } from "./farmer_1";
import { buildFarmer2 } from "./farmer_2";
import { buildCorridor } from "./corridor";
import { buildTribal2 } from "./tribal_2";
import { buildTribal1 } from "./tribal_1";
import { buildViking } from "./viking";
import { buildLowGround } from "./low_ground";
import { buildTribalSandbox } from "./tribal_sandbox";
import { buildFarmerSnow } from "./farmer_snow";
import { buildMedieval2 } from "./medieval_2";
import { buildVikingSandbox } from "./viking_sandbox";
import { buildAncientSandbox } from "./ancient_sandbox";
import { buildAncient2 } from "./ancient_2";
import { buildMedieval1 } from "./medieval_1";
import { buildAncient1 } from "./ancient_1";
import { buildDynasty } from "./dynasty";
import { buildSpooky1 } from "./spooky_1";
import { buildLegacy } from "./legacy";
import { buildWildWest } from "./wild_west";
import { buildPirate } from "./pirate";
import { buildRenaissance } from "./renaissance";
import { buildSpooky2 } from "./spooky_2";
import { buildSimulation } from "./simulation";
import { buildHighGround } from "./high_ground";
import { buildDefendTheCastle } from "./defend_the_castle";
import { buildFantasyEvil } from "./fantasy_evil";
import { buildFantasyGood } from "./fantasy_good";

// Ground height is visual only (../terrain.ts): return `height` in the MapBuildResult and shape the ground with terrainMesh(); hill.ts is the example.
export type TabsMapBuilder = (scene: Scene, base: () => MapBuildResult) => MapBuildResult;

export const TABS_MAP_BUILDERS: Partial<Record<TabsMapId, TabsMapBuilder>> = {
  hill: buildHill,
  bridge: buildBridge,
  viking: buildViking,
  low_ground: buildLowGround,
  farmer_1: buildFarmer1,
  farmer_2: buildFarmer2,
  corridor: buildCorridor,
  tribal_2: buildTribal2,
  tribal_1: buildTribal1,
  tribal_sandbox: buildTribalSandbox,
  farmer_snow: buildFarmerSnow,
  medieval_2: buildMedieval2,
  viking_sandbox: buildVikingSandbox,
  ancient_sandbox: buildAncientSandbox,
  ancient_2: buildAncient2,
  medieval_1: buildMedieval1,
  ancient_1: buildAncient1,
  dynasty: buildDynasty,
  spooky_1: buildSpooky1,
  legacy: buildLegacy,
  wild_west: buildWildWest,
  pirate: buildPirate,
  renaissance: buildRenaissance,
  spooky_2: buildSpooky2,
  simulation: buildSimulation,
  high_ground: buildHighGround,
  defend_the_castle: buildDefendTheCastle,
  fantasy_evil: buildFantasyEvil,
  fantasy_good: buildFantasyGood,
};
