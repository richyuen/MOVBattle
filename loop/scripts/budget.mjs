// Enforces the context budget of the improvement loop's memory files.
//   node loop/scripts/budget.mjs
// Exit 1 if any file is missing or over its cap. Caps are bytes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CAPS = {
  "loop/ITERATE.md": 9_000,
  "loop/STATE.md": 14_000,
  "loop/LEDGER.md": 14_000,
  "loop/REFERENCE_DIGEST.md": 8_200,
  "loop/CRITIC.md": 15_500,
};
const PER_ITERATION = ["loop/ITERATE.md", "loop/STATE.md", "loop/LEDGER.md", "loop/REFERENCE_DIGEST.md"];
const PER_ITERATION_WARN = 46_000;

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
const warn = perIteration > PER_ITERATION_WARN ? ` (WARN: over ${PER_ITERATION_WARN})` : "";
console.log(`per-iteration read set: ${perIteration} bytes${warn}`);
if (failed) {
  console.log("BUDGET FAILED: compact the files marked OVER or create the MISSING ones before continuing.");
  process.exit(1);
}
console.log("budget ok");
