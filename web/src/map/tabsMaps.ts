// TABS maps (loop v10 maps phase). Ids and titles come from loop/cards/_stages.json (scaffold-stages.mjs). A map without its own
// builder in ./tabs/ is built by `base`, an older MOVBattle map of the nearest biome; the loop gives each one its own builder.
export type TabsMapId =
  | "tribal_1"
  | "farmer_2"
  | "ancient_1"
  | "viking"
  | "medieval_2"
  | "tribal_2"
  | "ancient_2"
  | "dynasty"
  | "medieval_1"
  | "renaissance"
  | "farmer_1"
  | "pirate"
  | "viking_sandbox"
  | "spooky_1"
  | "spooky_2"
  | "bridge"
  | "hill"
  | "corridor"
  | "defend_the_castle"
  | "high_ground"
  | "low_ground"
  | "wild_west"
  | "legacy"
  | "tribal_sandbox"
  | "ancient_sandbox"
  | "farmer_snow"
  | "fantasy_good"
  | "fantasy_evil"
  | "simulation";

export interface TabsMapEntry {
  /** The TABS map's name (its wiki page) */
  title: string;
  /** The MOVBattle map built while this one has no builder of its own */
  base: "sandbox.tribal" | `campaign.${string}`;
}

export const TABS_MAPS: Record<TabsMapId, TabsMapEntry> = {
  tribal_1: { title: "Tribal 1", base: "sandbox.tribal" },
  farmer_2: { title: "Farmer 2", base: "campaign.introduction" },
  ancient_1: { title: "Ancient 1", base: "campaign.challenge" },
  viking: { title: "Viking", base: "campaign.challenge" },
  medieval_2: { title: "Medieval 2", base: "campaign.adventure" },
  tribal_2: { title: "Tribal 2", base: "sandbox.tribal" },
  ancient_2: { title: "Ancient 2", base: "campaign.challenge" },
  dynasty: { title: "Dynasty", base: "campaign.dynasty" },
  medieval_1: { title: "Medieval 1", base: "campaign.introduction" },
  renaissance: { title: "Renaissance", base: "campaign.renaissance" },
  farmer_1: { title: "Farmer 1", base: "campaign.introduction" },
  pirate: { title: "Pirate", base: "campaign.pirate" },
  viking_sandbox: { title: "Viking Sandbox", base: "campaign.challenge" },
  spooky_1: { title: "Spooky 1", base: "campaign.spooky" },
  spooky_2: { title: "Spooky 2", base: "campaign.spooky" },
  bridge: { title: "Bridge", base: "campaign.simulation" },
  hill: { title: "Hill", base: "campaign.simulation" },
  corridor: { title: "Corridor", base: "campaign.simulation" },
  defend_the_castle: { title: "Defend The Castle", base: "campaign.simulation" },
  high_ground: { title: "High Ground", base: "campaign.simulation" },
  low_ground: { title: "Low Ground", base: "campaign.simulation" },
  wild_west: { title: "Wild West", base: "campaign.wild_west" },
  legacy: { title: "Legacy", base: "campaign.legacy" },
  tribal_sandbox: { title: "Tribal Sandbox", base: "sandbox.tribal" },
  ancient_sandbox: { title: "Ancient Sandbox", base: "campaign.challenge" },
  farmer_snow: { title: "Farmer Snow", base: "campaign.introduction" },
  fantasy_good: { title: "Fantasy Good", base: "campaign.fantasy_good" },
  fantasy_evil: { title: "Fantasy Evil", base: "campaign.fantasy_evil" },
  simulation: { title: "Simulation", base: "campaign.simulation" },
};
