// The roster as the loop scripts see it, read straight out of web/src/data/rosterManifest.ts with a regex (no TypeScript import, so the
// fetcher works before the game builds). Order is the manifest's: faction by faction in TABS order, roster order within a faction.
//   loadRoster() -> [{ id, faction, slug, name, cost, archetype }]
//   batches(roster) -> [{ name, faction, units: [ids] }]   a faction, or a slice of at most BATCH_MAX units for the big ones (legacy_1, secret_3 ...)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const BATCH_MAX = 10;

export function loadRoster() {
  const src = fs.readFileSync(path.join(root, "web", "src", "data", "rosterManifest.ts"), "utf8");
  const roster = [];
  const head = /makeFaction\(FactionId\.(\w+),\s*"([a-z_]+)",\s*\[/g;
  let m;
  while ((m = head.exec(src))) {
    const faction = m[2];
    // Scan to the matching close of the entries array
    let depth = 1;
    let i = head.lastIndex;
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === "[") depth++;
      else if (src[i] === "]") depth--;
    }
    const body = src.slice(head.lastIndex, i - 1);
    const entry = /^\s*\["([a-z0-9_]+)",\s*"([^"]+)",\s*(\d+),\s*"(\w+)"/gm;
    let e;
    while ((e = entry.exec(body))) {
      roster.push({ id: `${faction}.${e[1]}`, faction, slug: e[1], name: e[2], cost: Number(e[3]), archetype: e[4] });
    }
    head.lastIndex = i;
  }
  if (roster.length === 0) throw new Error("no makeFaction entries found in rosterManifest.ts");
  return roster;
}

export function factionsOf(roster) {
  const out = [];
  for (const u of roster) if (!out.includes(u.faction)) out.push(u.faction);
  return out;
}

export function batches(roster) {
  const out = [];
  for (const faction of factionsOf(roster)) {
    const ids = roster.filter((u) => u.faction === faction).map((u) => u.id);
    if (ids.length <= BATCH_MAX) {
      out.push({ name: faction, faction, units: ids });
      continue;
    }
    const n = Math.ceil(ids.length / BATCH_MAX);
    const size = Math.ceil(ids.length / n);
    for (let k = 0; k < n; k++) out.push({ name: `${faction}_${k + 1}`, faction, units: ids.slice(k * size, (k + 1) * size) });
  }
  return out;
}

export function batchByName(roster, name) {
  const b = batches(roster).find((x) => x.name === name);
  if (!b) throw new Error(`no batch named ${name}; batches: ${batches(roster).map((x) => x.name).join(", ")}`);
  return b;
}
