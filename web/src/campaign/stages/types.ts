import type { BattleMapId } from "../../map/mapBuilder";

/** One curated TABS campaign level. */
export interface TabsStageDef {
  /** <campaign>.<level slug>, frozen (loop/cards/_stages.json) */
  id: string;
  title: string;
  /** The level's position in its TABS campaign, 1-based */
  tabsLevel: number;
  mapId: BattleMapId;
  budget: number;
  /** What the player may place: every unit, whole factions, or a unit list */
  playerUnits: "all" | { factions: string[] } | { units: string[] };
  /** Team 1's locked army: [unitId, x, z] */
  enemy: Array<[string, number, number]>;
}
