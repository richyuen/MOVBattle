// One-off scaffold of the maps-and-stages phase (loop v10) from loop/cards/_stages.json:
//   web/src/map/tabsMaps.ts                  the TABS map ids (`map.<id>`), each built on an existing MOVBattle map until it gets its own
//   web/src/campaign/stages/<campaign>.ts    the curated TABS levels of one campaign: map, budget, player units, enemy army with positions
// Enemy positions start as plain ranks inside the team-1 half (melee in front, ranged behind, artillery last); the loop re-authors them
// against each level's wiki image. Refuses to overwrite an existing file: after the scaffold these files belong to the loop.
//   node loop/scripts/scaffold-stages.mjs [--force <file>]
import fs from "node:fs";
import path from "node:path";
import { loadRoster, root } from "./lib/roster.mjs";

const args = process.argv.slice(2);
const forced = args.includes("--force") ? args[args.indexOf("--force") + 1] : null;
const data = JSON.parse(fs.readFileSync(path.join(root, "loop", "cards", "_stages.json"), "utf8"));
const roster = loadRoster();
const archetype = Object.fromEntries(roster.map((u) => [u.id, u.archetype]));
const cost = Object.fromEntries(roster.map((u) => [u.id, u.cost]));

function write(rel, text) {
  const file = path.join(root, rel);
  if (fs.existsSync(file) && forced !== rel) {
    console.log(`kept ${rel} (exists; pass --force ${rel} to replace it)`);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  console.log(`wrote ${rel}`);
}

// Map id -> the existing MOVBattle map it starts from (nearest biome)
const BASE = {
  tribal_1: "sandbox.tribal", tribal_2: "sandbox.tribal", tribal_sandbox: "sandbox.tribal",
  farmer_1: "campaign.introduction", farmer_2: "campaign.introduction", farmer_snow: "campaign.introduction",
  medieval_1: "campaign.introduction", medieval_2: "campaign.adventure",
  ancient_1: "campaign.challenge", ancient_2: "campaign.challenge", ancient_sandbox: "campaign.challenge",
  viking: "campaign.challenge", viking_sandbox: "campaign.challenge",
  dynasty: "campaign.dynasty", renaissance: "campaign.renaissance", pirate: "campaign.pirate",
  spooky_1: "campaign.spooky", spooky_2: "campaign.spooky", wild_west: "campaign.wild_west", legacy: "campaign.legacy",
  fantasy_good: "campaign.fantasy_good", fantasy_evil: "campaign.fantasy_evil", simulation: "campaign.simulation",
};
const baseOf = (id) => BASE[id] ?? "campaign.simulation";

const mapIds = data.maps.map((m) => m.id);
write("web/src/map/tabsMaps.ts", `// TABS maps (loop v10 maps phase). Ids and titles come from loop/cards/_stages.json (scaffold-stages.mjs). A map without its own
// builder in ./tabs/ is built by \`base\`, an older MOVBattle map of the nearest biome; the loop gives each one its own builder.
export type TabsMapId =
${mapIds.map((id) => `  | "${id}"`).join("\n")};

export interface TabsMapEntry {
  /** The TABS map's name (its wiki page) */
  title: string;
  /** The MOVBattle map built while this one has no builder of its own */
  base: "sandbox.tribal" | \`campaign.\${string}\`;
}

export const TABS_MAPS: Record<TabsMapId, TabsMapEntry> = {
${data.maps.map((m) => `  ${m.id}: { title: ${JSON.stringify(m.title.replace(/ \(Map\)$/, ""))}, base: "${baseOf(m.id)}" },`).join("\n")}
};
`);

const RANGED = new Set(["archer", "gunner", "shotgunner", "thrower", "summoner"]);
const fmt = (n) => String(Math.round(n * 10) / 10);
/** Ranks facing -x: melee nearest the centre, ranged behind, artillery last; a rank is at most 12 wide, 1.8 apart. */
function ranks(counts) {
  const groups = [[], [], []];
  for (const [id, n] of Object.entries(counts)) {
    const a = archetype[id];
    const g = a === "artillery" ? 2 : RANGED.has(a) ? 1 : 0;
    for (let k = 0; k < n; k++) groups[g].push(id);
  }
  const out = [];
  let x = 20;
  for (const g of groups) {
    for (let i = 0; i < g.length; i += 12) {
      const row = g.slice(i, i + 12);
      const gap = row.some((id) => archetype[id] === "artillery" || (cost[id] ?? 0) >= 1000) ? 4 : 1.8;
      row.forEach((id, k) => out.push([id, x, (k - (row.length - 1) / 2) * gap]));
      x += row.some((id) => (cost[id] ?? 0) >= 1000) ? 5 : 2.2;
    }
    if (g.length) x += 1.5;
  }
  return out;
}

const campaigns = [...new Set(data.stages.map((s) => s.campaign))];
for (const cid of campaigns) {
  const list = data.stages.filter((s) => s.campaign === cid);
  const body = list.map((s) => {
    const player = s.available.units.length ? `{ units: ${JSON.stringify(s.available.units)} }`
      : s.available.factions.length ? `{ factions: ${JSON.stringify(s.available.factions)} }`
      : `"all"`;
    const enemy = ranks(s.enemyCounts).map(([id, x, z]) => `      ["${id}", ${fmt(x)}, ${fmt(z)}],`).join("\n");
    return `  {
    id: "${s.id}",
    title: ${JSON.stringify(s.title)},
    tabsLevel: ${s.order},
    mapId: "map.${s.map}",
    budget: ${s.budget},
    playerUnits: ${player},
    enemy: [
${enemy}
    ],
  },`;
  }).join("\n");
  write(`web/src/campaign/stages/${cid}.ts`, `// ${cid} campaign: curated TABS levels (loop v10 stages phase). Card per stage: loop/cards/stages/<id>.md.
// enemy: [unitId, x, z] for team 1 (the right half, facing -x). Map, budget and army counts are checked by loop/scripts/stages.mjs.
import type { TabsStageDef } from "./types";

export const STAGES: TabsStageDef[] = [
${body}
];
`);
}

write("web/src/campaign/stages/types.ts", `import type { BattleMapId } from "../../map/mapBuilder";

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
`);

write("web/src/campaign/stages/index.ts", `import type { CampaignId } from "../campaignTypes";
import type { TabsStageDef } from "./types";
${campaigns.map((c) => `import { STAGES as ${c} } from "./${c}";`).join("\n")}

export type { TabsStageDef } from "./types";

export const TABS_STAGES: Record<CampaignId, TabsStageDef[]> = {
${campaigns.map((c) => `  ${c},`).join("\n")}
};
`);
