// Enforces the context budget of the improvement loop's memory files (loop v2).
//   node loop/scripts/budget.mjs
// Exit 1 if any capped file is missing or over its cap, a card or unit file is over its cap, or a roster unit has no card. Caps are bytes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CAPS = {
  "loop/ITERATE.md": 10_000,
  "loop/STATE.md": 12_000,
  "loop/LEDGER.md": 14_000,
  "loop/REFERENCE_DIGEST.md": 8_200,
  "loop/CRITIC.md": 15_500,
};
const CARD_CAP = 3_200;
const UNIT_CAP = 2_000;
const STATS_CAP = 60_000;
// What one iteration reads: the three memory files, plus up to a batch of unit files and the cards of the units it picks gaps on
const PER_ITERATION = ["loop/ITERATE.md", "loop/STATE.md", "loop/LEDGER.md"];
const BATCH_UNITS = 10;
const PICKED_CARDS = 5;
const PER_ITERATION_WARN = 80_000;

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
const units = dirCheck("loop/units", UNIT_CAP, "loop/units/*.md");
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
console.log(`per-iteration read set (memory + ${BATCH_UNITS} unit files + ${PICKED_CARDS} cards): ${perIteration} bytes${warn}`);
if (failed) {
  console.log("BUDGET FAILED: compact the files marked OVER or create the MISSING ones before continuing.");
  process.exit(1);
}
console.log("budget ok");
