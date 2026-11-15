// Builders of the TABS maps (loop v10 maps phase), one file per map: ./<mapId>.ts exports `build<MapId>` and is listed here.
// A builder gets the scene and `base`, the build of the map's base (TABS_MAPS[id].base): it may call base() and dress the result, or
// build from scratch. It returns the zones, obstacles and hazards like any map. Shared helpers come from ../mapBuilder (exported there).
import type { Scene } from "@babylonjs/core";
import type { MapBuildResult } from "../mapBuilder";
import type { TabsMapId } from "../tabsMaps";

export type TabsMapBuilder = (scene: Scene, base: () => MapBuildResult) => MapBuildResult;

export const TABS_MAP_BUILDERS: Partial<Record<TabsMapId, TabsMapBuilder>> = {};
