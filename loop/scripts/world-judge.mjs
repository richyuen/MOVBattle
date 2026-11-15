// The script-judged criteria of the maps-and-stages phase (loop v10), from a capture-world.mjs summary and loop/cards/_stages.json:
//   map   c play    the map loads as itself with a zone per team; a 12-a-side skirmish places all 24 and ends inside 120 s with nobody
//                   left in a hazard; every stage fought on it that is in the same capture has no misplaced unit
//   stage a army    map, budget, enemy army (unit by unit, exact counts) and player units as the card says
//   stage c battle  no enemy placed outside the team-1 zone, in a hazard or on an obstacle; the battle against the suggested player army
//                   ends inside 120 s with nobody left in a hazard
//   node loop/scripts/world-judge.mjs --iter N [item ...]      (default: every item in that capture) -> prints and writes iter-N/judge.json
// Prints one line per criterion: `PASS <item>.<c>` or `FAIL <item>.<c>: <reasons>`. Exit 0 always: verdicts are data, not errors.
import fs from "node:fs";
import path from "node:path";
import { loadRoster, root } from "./lib/roster.mjs";
import { loadWorld } from "./lib/world.mjs";

const args = process.argv.slice(2);
const iArg = args.indexOf("--iter");
const iter = iArg >= 0 ? Number(args[iArg + 1]) : 0;
const only = args.filter((a, i) => !a.startsWith("--") && (iArg < 0 || i !== iArg + 1));
// --check: the fast check-only run in output/loop/check/ (no battles there, so only placement and army verdicts mean anything)
const dir = path.join(root, "output", "loop", args.includes("--check") ? "check" : iter ? `iter-${iter}` : "look");
const summary = JSON.parse(fs.readFileSync(path.join(dir, "summary.json"), "utf8"));
const world = loadWorld();
const roster = loadRoster();
const stageById = Object.fromEntries(world.stages.map((s) => [s.id, s]));
const items = only.length ? only : Object.keys(summary.items);
const out = {};

function battleTrouble(b, what) {
  const r = [];
  if (!b) return [`no ${what} result`];
  if (!b.ended) r.push(`${what} still running at ${b.atMs} ms`);
  if (b.inHazardA || b.inHazardB) r.push(`${what}: ${b.inHazardA}+${b.inHazardB} units left in a hazard`);
  return r;
}

for (const item of items) {
  const rec = summary.items[item];
  if (!rec) { out[item] = { error: "not in this capture" }; continue; }
  if (item.startsWith("map.")) {
    const r = [];
    if (rec.layout?.mapId !== item) r.push(`loaded ${rec.layout?.mapId}`);
    for (const t of [0, 1]) if (!rec.layout?.zones.some((z) => z.team === t)) r.push(`no team ${t} zone`);
    if (rec.skirmish?.placed !== 24) r.push(`skirmish placed ${rec.skirmish?.placed}/24`);
    r.push(...battleTrouble(rec.skirmish, "skirmish"));
    for (const [sid, srec] of Object.entries(summary.items)) {
      if (stageById[sid] && `map.${stageById[sid].map}` === item && srec.check?.misplaced?.length) r.push(`${sid} has ${srec.check.misplaced.length} misplaced`);
    }
    out[`${item}.c`] = r;
  } else {
    const card = stageById[item];
    const ck = rec.check ?? {};
    const a = [];
    if (ck.error) a.push(ck.error);
    if (ck.mapId !== `map.${card.map}`) a.push(`map ${ck.mapId}, card map.${card.map}`);
    if (ck.budget !== card.budget) a.push(`budget ${ck.budget}, card ${card.budget}`);
    const ids = new Set([...Object.keys(card.enemyCounts), ...Object.keys(ck.spawned ?? {})]);
    for (const id of ids) {
      const want = card.enemyCounts[id] ?? 0, got = ck.spawned?.[id] ?? 0;
      if (want !== got) a.push(`${id} ${got}, card ${want}`);
    }
    const allowed = new Set(ck.allowedUnitIds ?? []);
    const av = card.available;
    if (av.units.length) {
      const want = new Set(av.units);
      const extra = [...allowed].filter((u) => !want.has(u)), missing = [...want].filter((u) => !allowed.has(u));
      if (extra.length || missing.length) a.push(`player units +${extra.join(",")} -${missing.join(",")}`);
    } else if (av.factions.length) {
      const want = roster.filter((u) => av.factions.includes(u.faction)).map((u) => u.id);
      const missing = want.filter((u) => !allowed.has(u)), extra = [...allowed].filter((u) => !av.factions.some((f) => u.startsWith(`${f}.`)));
      if (extra.length || missing.length) a.push(`player factions: +${extra.length} units outside ${av.factions.join(",")}, ${missing.length} missing`);
    } else if (allowed.size < roster.length) a.push(`player units ${allowed.size}, card: all (${roster.length})`);
    out[`${item}.a`] = a;
    const c = [];
    if (ck.misplaced?.length) c.push(`${ck.misplaced.length} misplaced (${ck.misplaced.slice(0, 3).join("; ")})`);
    c.push(...battleTrouble(rec.battle, "battle"));
    out[`${item}.c`] = c;
  }
}
for (const [k, r] of Object.entries(out)) console.log(Array.isArray(r) ? (r.length ? `FAIL ${k}: ${r.join("; ")}` : `PASS ${k}`) : `SKIP ${k}: ${r.error}`);
fs.writeFileSync(path.join(dir, "judge.json"), JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, r]) => [k, Array.isArray(r) ? (r.length ? { verdict: "FAIL", reasons: r } : { verdict: "PASS" }) : { verdict: "SKIP", reasons: [r.error] }])), null, 1));
