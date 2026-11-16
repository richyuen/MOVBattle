// Builders of the TABS maps (loop v10 maps phase), one file per map: ./<mapId>.ts exports `build<MapId>` and is listed here.
// A builder gets the scene and `base`, the build of the map's base (TABS_MAPS[id].base): it may call base() and dress the result, or
// build from scratch. It returns the zones, obstacles and hazards like any map. Shared helpers come from ../mapBuilder (exported there).
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { TabsMapId } from "../tabsMaps";
import { buildHill } from "./hill";
import { buildFarmer1 } from "./farmer_1";
import { buildFarmer2 } from "./farmer_2";
import { buildTribal2 } from "./tribal_2";
import { buildTribal1 } from "./tribal_1";
import { buildViking } from "./viking";
import { buildTribalSandbox } from "./tribal_sandbox";
import { buildFarmerSnow } from "./farmer_snow";
import { buildMedieval2 } from "./medieval_2";
import { buildVikingSandbox } from "./viking_sandbox";
import { buildAncientSandbox } from "./ancient_sandbox";

// Ground height is visual only (../terrain.ts): return `height` in the MapBuildResult and shape the ground with terrainMesh(); hill.ts is the example.
export type TabsMapBuilder = (scene: Scene, base: () => MapBuildResult) => MapBuildResult;

export const TABS_MAP_BUILDERS: Partial<Record<TabsMapId, TabsMapBuilder>> = {
  hill: buildHill,
  viking: buildViking,
  farmer_1: buildFarmer1,
  farmer_2: buildFarmer2,
  tribal_2: buildTribal2,
  tribal_1: buildTribal1,
  tribal_sandbox: buildTribalSandbox,
  farmer_snow: buildFarmerSnow,
  medieval_2: buildMedieval2,
  viking_sandbox: buildVikingSandbox,
  ancient_sandbox: buildAncientSandbox,
};
