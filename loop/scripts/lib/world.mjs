// The maps-and-stages phase (loop v10) as the loop scripts see it, read from loop/cards/_stages.json (fetch-stage-cards.mjs).
//   loadWorld() -> { maps: [{ id, title, view, images, usedBy }], stages: [{ id, campaign, map, budget, enemyCounts, available, ... }] }
//   worldBatches(world) -> [{ name, kind: "maps"|"stages", items: [ids] }]   maps first (stages are fought on them), in TABS order
//   worldBatchByName(world, name)
// Item ids: a map is `map.<id>` (its BattleMapId), a stage is `<campaign>.<level slug>` (its scenario id).
import fs from "node:fs";
import path from "node:path";
import { root } from "./roster.mjs";

// TABS order: the faction maps, the themed fantasy and simulation maps, then the one-off simulation maps
export const MAP_BATCHES = [
  ["maps_1", ["tribal_1", "tribal_2", "tribal_sandbox", "farmer_1", "farmer_2", "farmer_snow"]],
  ["maps_2", ["medieval_1", "medieval_2", "ancient_1", "ancient_2", "ancient_sandbox", "viking", "viking_sandbox"]],
  ["maps_3", ["dynasty", "renaissance", "pirate", "spooky_1", "spooky_2", "wild_west", "legacy"]],
  ["maps_4", ["fantasy_good", "fantasy_evil", "simulation", "bridge", "hill", "corridor", "defend_the_castle", "high_ground", "low_ground"]],
];
export const CAMPAIGN_ORDER = ["introduction", "adventure", "challenge", "dynasty", "renaissance", "pirate", "spooky", "simulation", "wild_west", "legacy", "fantasy_good", "fantasy_evil"];

export function loadWorld() {
  const file = path.join(root, "loop", "cards", "_stages.json");
  if (!fs.existsSync(file)) throw new Error("no loop/cards/_stages.json: run node loop/scripts/fetch-stage-cards.mjs");
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  return { maps: j.maps, stages: j.stages };
}

export function worldBatches(world) {
  const known = new Set(world.maps.map((m) => m.id));
  const listed = new Set(MAP_BATCHES.flatMap(([, ids]) => ids));
  const stray = [...known].filter((id) => !listed.has(id));
  const out = MAP_BATCHES.map(([name, ids]) => ({ name, kind: "maps", items: ids.filter((id) => known.has(id)).map((id) => `map.${id}`) }));
  // A map fetched later (a refresh added one) goes into the last map batch rather than nowhere
  if (stray.length) out[out.length - 1].items.push(...stray.map((id) => `map.${id}`));
  for (const c of CAMPAIGN_ORDER) {
    const items = world.stages.filter((s) => s.campaign === c).map((s) => s.id);
    if (items.length) out.push({ name: `stages_${c}`, kind: "stages", items });
  }
  return out;
}

export function worldBatchByName(world, name) {
  const b = worldBatches(world).find((x) => x.name === name);
  if (!b) throw new Error(`no world batch named ${name}; batches: ${worldBatches(world).map((x) => x.name).join(", ")}`);
  return b;
}

/** Card path of an item: loop/cards/maps/<id>.md or loop/cards/stages/<id>.md */
export function cardOf(item) {
  return item.startsWith("map.") ? `loop/cards/maps/${item.slice(4)}.md` : `loop/cards/stages/${item}.md`;
}
