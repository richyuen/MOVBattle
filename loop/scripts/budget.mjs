// Enforces the context budget of the improvement loop's memory files (loop v10: maps and stages).
//   node loop/scripts/budget.mjs
// Exit 1 if any capped file is missing or over its cap, a card or item file is over its cap, a map or stage of _stages.json has no card, or a
// roster unit has no card. Caps are bytes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CAPS = {
  "loop/ITERATE.md": 19_600, // v7: +600 for CONFIRM beside the critic; v9: +400 for the context rules; v10: +300 for the map-picker thumbnail refresh, then -700 when the capture command, evidence pack and CONFIRM were each stated once; v11: +3000 for solo mode and the locked CONFIRM list
  "loop/STATE.md": 12_000,
  "loop/LEDGER.md": 16_000,
  "loop/LESSONS.md": 10_000,
  "loop/REFERENCE_DIGEST.md": 8_200,
  "loop/CRITIC.md": 15_500,
};
const CARD_CAP = 3_200;
const UNIT_CAP = 3_200;
const STATS_CAP = 60_000;
// What one iteration reads: the four memory files, plus up to a batch of item files and the cards of the items it picks gaps on
const PER_ITERATION = ["loop/ITERATE.md", "loop/STATE.md", "loop/LEDGER.md", "loop/LESSONS.md"];
const BATCH_UNITS = 15; // two batches overlap at a tail (ITERATE step 3: maps_4 has 9, a campaign 6); done items are not read
const PICKED_CARDS = 7;
const PER_ITERATION_WARN = 130_000;

let failed = false;
let perIteration = 0;
for (const [rel, cap] of Object.entries(CAPS)) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.log(`MISSING ${rel}`);
    failed = true;
    continue;
  }
  const bytes = fs.statSync(file).size;
  const lines = fs.readFileSync(file, "utf8").split("\n").length;
  const over = bytes > cap;
  if (over) failed = true;
  if (PER_ITERATION.includes(rel)) perIteration += bytes;
  console.log(`${over ? "OVER " : "ok   "} ${rel.padEnd(26)} ${String(bytes).padStart(6)} / ${cap} bytes, ${lines} lines`);
}

function dirCheck(rel, cap, label) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) { console.log(`ok    ${label.padEnd(26)} (no ${rel} yet)`); return { count: 0, max: 0 }; }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  let max = 0;
  const over = [];
  for (const f of files) {
    const bytes = fs.statSync(path.join(dir, f)).size;
    if (bytes > max) max = bytes;
    if (bytes > cap) over.push(`${f} ${bytes}`);
  }
  if (over.length) { failed = true; console.log(`OVER  ${label}: ${over.join(", ")} (cap ${cap})`); }
  else console.log(`ok    ${label.padEnd(26)} ${files.length} files, largest ${max} / ${cap} bytes`);
  return { count: files.length, max };
}
const cards = dirCheck("loop/cards", CARD_CAP, "loop/cards/*.md");
const units = dirCheck("loop/items", UNIT_CAP, "loop/items/*.md");
const mapCards = dirCheck("loop/cards/maps", CARD_CAP, "loop/cards/maps/*.md");
const stageCards = dirCheck("loop/cards/stages", CARD_CAP, "loop/cards/stages/*.md");
const worldFile = path.join(root, "loop", "cards", "_stages.json");
if (!fs.existsSync(worldFile)) { console.log("MISSING loop/cards/_stages.json (node loop/scripts/fetch-stage-cards.mjs)"); failed = true; }
else {
  const w = JSON.parse(fs.readFileSync(worldFile, "utf8"));
  const missing = [
    ...w.maps.filter((m) => !fs.existsSync(path.join(root, "loop", "cards", "maps", `${m.id}.md`))).map((m) => `map.${m.id}`),
    ...w.stages.filter((s) => !fs.existsSync(path.join(root, "loop", "cards", "stages", `${s.id}.md`))).map((s) => s.id),
  ];
  if (missing.length) failed = true;
  console.log(`${missing.length ? "MISS " : "ok   "} ${"loop/cards/_stages.json".padEnd(26)} ${w.maps.length} maps, ${w.stages.length} stages${missing.length ? `, NO CARD for ${missing.join(" ")}` : ""}`);
}
cards.max = Math.max(cards.max, mapCards.max, stageCards.max);
const statsFile = path.join(root, "loop", "cards", "_stats.json");
if (!fs.existsSync(statsFile)) { console.log("MISSING loop/cards/_stats.json"); failed = true; }
else {
  const bytes = fs.statSync(statsFile).size;
  const ids = Object.keys(JSON.parse(fs.readFileSync(statsFile, "utf8")));
  const missing = ids.filter((id) => !fs.existsSync(path.join(root, "loop", "cards", `${id}.md`)));
  const over = bytes > STATS_CAP;
  if (over || missing.length) failed = true;
  console.log(`${over ? "OVER " : "ok   "} ${"loop/cards/_stats.json".padEnd(26)} ${String(bytes).padStart(6)} / ${STATS_CAP} bytes, ${ids.length} units${missing.length ? `, NO CARD for ${missing.join(" ")}` : ""}`);
}
perIteration += Math.min(units.max, UNIT_CAP) * BATCH_UNITS + Math.min(cards.max, CARD_CAP) * PICKED_CARDS;
const warn = perIteration > PER_ITERATION_WARN ? ` (WARN: over ${PER_ITERATION_WARN})` : "";
console.log(`per-iteration read set (memory + ${BATCH_UNITS} item files + ${PICKED_CARDS} cards): ${perIteration} bytes${warn}`);
// [v5] A batch named on STATE's Batch line must still have an open (o) or queued (q) unit: when none is left, ITERATE step 8 owes its
// checkpoint and the name must go (the viking checkpoint was skipped at 418 because nothing checked).
try {
  const state = fs.readFileSync(path.join(root, "loop", "STATE.md"), "utf8");
  // [v10] the Batch value is one token (`maps_1`, `maps_4+stages_introduction`); the old [^\n(]+ ran on into "Consecutive empty: 0" and the
  // name, holding a colon, was skipped: this check never ran in v5-v9
  const batchLine = state.match(/^Iteration:.*?\bBatch:\s*(\S+)/m);
  const named = batchLine ? batchLine[1].split("+").map((s) => s.trim()).filter((s) => s && !s.includes(":")) : [];
  for (const name of named) {
    const row = state.match(new RegExp(`^${name.replace(/[^a-z0-9_]/gi, "")}:\\s*(.+)$`, "m"));
    if (!row) { console.log(`BATCH  ${name}: not in the Scoreboard`); failed = true; continue; }
    const open = row[1].split("|").filter((cell) => /\s[oq]\s*$/.test(cell)).length;
    if (open === 0) { console.log(`BATCH  ${name}: no open or queued unit left - run the checkpoint (ITERATE step 8) and drop it from Batch`); failed = true; }
    else console.log(`ok    batch ${name.padEnd(20)} ${open} open/queued`);
  }
} catch (e) { console.log(`BATCH  STATE.md unreadable: ${e.message}`); failed = true; }
if (failed) {
  console.log("BUDGET FAILED: compact the files marked OVER, create the MISSING ones, or settle the BATCH lines before continuing.");
  process.exit(1);
}
console.log("budget ok");
