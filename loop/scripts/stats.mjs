// Loop v2 criterion d: our numbers against the wiki's, normalised to tribal.clubber. Script-judged; the critic copies its line.
//   node loop/scripts/stats.mjs <id[,id]> | --batch <name> | --all   [--iter N] [--json <file>]
//   node loop/scripts/stats.mjs --roster        the STATE.md scoreboard lines and the batch list
// Ours comes from output/loop/ours.json, written by every capture.mjs run (game.listUnitDefinitions); wiki from loop/cards/_stats.json.
// Gated: cost (exact), hp, dmg, cd (ratios to the clubber within tolerance). Size and speed are printed as information only: the wiki's are
// multipliers on each unit's own base, not comparable across units (a Halfling is "1.00x" and half a man tall).
import fs from "node:fs";
import path from "node:path";
import { loadRoster, batches, batchByName, root } from "./lib/roster.mjs";

const args = process.argv.slice(2);
const opt = (n, f) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : f; };
const BASE = "tribal.clubber";
const TOL = { hp: 0.15, dmg: 0.2, cd: 0.2 };

const roster = loadRoster();
if (args.includes("--roster")) {
  const bs = batches(roster);
  process.stdout.write(bs.map((b) => `${b.name}: ${b.units.map((id) => id.split(".")[1] + " ???? q").join(" | ")}`).join("\n") + "\n");
  process.stdout.write(`batches: ${bs.map((b) => b.name).join(", ")}\n`);
  process.exit(0);
}

const wikiAll = JSON.parse(fs.readFileSync(path.join(root, "loop", "cards", "_stats.json"), "utf8"));
const oursFile = path.join(root, "output", "loop", "ours.json");
if (!fs.existsSync(oursFile)) { console.error(`no ${path.relative(root, oursFile)}: run capture.mjs once (any mode) to write it`); process.exit(2); }
const oursAll = Object.fromEntries(JSON.parse(fs.readFileSync(oursFile, "utf8")).map((r) => [r.id, r]));

let ids;
if (args.includes("--all")) ids = roster.map((u) => u.id);
else if (opt("--batch")) ids = batchByName(roster, opt("--batch")).units;
else ids = (args.find((a) => !a.startsWith("--") && !["--iter", "--json", "--batch"].includes(args[args.indexOf(a) - 1])) ?? "").split(",").filter(Boolean);
if (ids.length === 0) { console.error("name units, --batch <name>, --all or --roster"); process.exit(2); }

const iter = opt("--iter", null);
const jsonOut = opt("--json", iter ? path.join(root, "output", "loop", `iter-${iter}`, "stats.json") : path.join(root, "output", "loop", "look", "stats.json"));

const ours = (id) => {
  const r = oursAll[id];
  if (!r) return null;
  return { cost: r.cost, hp: r.maxHealth, dmg: r.damage * r.damageMultiplier, cd: r.cooldown * r.cooldownMultiplier, speed: r.moveSpeed, size: r.visualScale * r.giantScale, hm: r.healthMultiplier, dm: r.damageMultiplier, cm: r.cooldownMultiplier };
};
const wiki = (id) => {
  const w = wikiAll[id];
  if (!w) return null;
  return { cost: w.cost, hp: w.hp, dmg: w.main?.dmgAvg ?? null, cd: w.main?.cooldown ?? null, speed: w.speed, size: w.size, mainAbility: w.mainAbility };
};
const oB = ours(BASE), wB = wiki(BASE);
if (!oB || !wB) { console.error(`baseline ${BASE} missing from ours or wiki`); process.exit(2); }

const KNOB = { hp: "healthMultiplier", dmg: "damageMultiplier", cd: "cooldownMultiplier" };
const CUR = { hp: "hm", dmg: "dm", cd: "cm" };
const results = {};
const apply = {};
const lines = [`stats vs tabs.wiki.gg, ratios to ${BASE}; per-preset damage scalings in simulationSystem._tryAttack are not seen here`];
for (const id of ids) {
  const o = ours(id), w = wiki(id);
  if (!o || !w) { lines.push(`d ${id}: ${!o ? "not in ours.json" : "no wiki card"} => d FAIL`); results[id] = { pass: false, reason: "missing data" }; continue; }
  const fields = [];
  let pass = true;
  const costOk = w.cost !== null && o.cost === w.cost;
  if (w.cost !== null && !costOk) { pass = false; (apply[id] ??= {}).cost = w.cost; }
  fields.push(`cost ${o.cost}${w.cost === null ? " (wiki none)" : `${costOk ? "=" : "!="}${w.cost}`} ${w.cost === null || costOk ? "PASS" : "FAIL -> cost " + w.cost}`);
  const detail = { cost: { ours: o.cost, wiki: w.cost, pass: w.cost === null || costOk } };
  for (const f of ["hp", "dmg", "cd"]) {
    if (w[f] === null || w[f] === undefined || !(wB[f] > 0) || !(w[f] > 0)) {
      fields.push(`${f} ${o[f].toFixed(2)} (wiki ${f === "hp" ? "none" : w.mainAbility ? `ability ${w.mainAbility}` : "none"}, skipped)`);
      detail[f] = { ours: o[f], wiki: null, pass: true, skipped: true };
      continue;
    }
    const ro = o[f] / oB[f], rw = w[f] / wB[f];
    const err = ro / rw - 1;
    const ok = Math.abs(err) <= TOL[f];
    if (!ok) pass = false;
    const knob = ok ? "" : ` -> ${KNOB[f]} ${(o[CUR[f]] / (1 + err)).toFixed(2)}`;
    if (!ok) (apply[id] ??= {})[KNOB[f]] = Number((o[CUR[f]] / (1 + err)).toFixed(2));
    fields.push(`${f} ${ro.toFixed(2)}x vs ${rw.toFixed(2)}x (${err >= 0 ? "+" : ""}${Math.round(err * 100)}%) ${ok ? "PASS" : "FAIL"}${knob}`);
    detail[f] = { ours: o[f], wiki: w[f], ratioOurs: ro, ratioWiki: rw, err, pass: ok };
  }
  fields.push(`info: speed ${(o.speed / oB.speed).toFixed(2)}x (wiki ${w.speed ?? "?"}x), size ${o.size.toFixed(2)} (wiki ${w.size ?? "?"}x)`);
  lines.push(`d ${id}: ${fields.join(" | ")} => d ${pass ? "PASS" : "FAIL"}`);
  results[id] = { pass, ...detail };
}
if (Object.keys(apply).length) {
  lines.push("apply (rosterManifest.ts: the entry's cost number and its options; one stats commit, then rerun to confirm since hp follows cost):");
  for (const [id, knobs] of Object.entries(apply)) lines.push(`  ${id}: ${Object.entries(knobs).map(([k, v]) => `${k}: ${v}`).join(", ")}`);
}
if (args.includes("--all") || opt("--batch")) {
  const n = ids.length, p = Object.values(results).filter((r) => r.pass).length;
  lines.push(`d PASS ${p}/${n}`);
}
process.stdout.write(lines.join("\n") + "\n");
fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
fs.writeFileSync(jsonOut, JSON.stringify({ base: BASE, tolerance: TOL, lines, results, apply }, null, 1));
