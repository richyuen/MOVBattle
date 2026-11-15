// Moves misplaced stage armies onto valid ground, from a capture-world summary (loop v10, a [D] data fix: no critic).
//   (--check reads output/loop/check/, the fast `capture-world.mjs --check-only` run, instead of iter-N or look/)
//   node loop/scripts/fix-placements.mjs [--iter N] --shift [stage ...]   whole army: the front rank to 2 m inside the map's team-1 zone, the
//                                                                          army centred on the zone across; keeps the formation's shape
//   node loop/scripts/fix-placements.mjs [--iter N] --moves [stage ...]   each still-misplaced unit to the nearest valid spot game.checkStage found
// Default stages: every stage in the summary with a misplaced unit. Needs the map's layout in the same summary for --shift (capture the map too).
// Edits web/src/campaign/stages/<campaign>.ts in place; recapture and judge after.
import fs from "node:fs";
import path from "node:path";
import { root } from "./lib/roster.mjs";
import { loadWorld } from "./lib/world.mjs";

const args = process.argv.slice(2);
const iArg = args.indexOf("--iter");
const iter = iArg >= 0 ? Number(args[iArg + 1]) : 0;
const mode = args.includes("--shift") ? "shift" : args.includes("--moves") ? "moves" : null;
if (!mode) throw new Error("usage: fix-placements.mjs [--iter N] --shift|--moves [stage ...]");
const named = args.filter((a, i) => !a.startsWith("--") && (iArg < 0 || i !== iArg + 1));
const dir = path.join(root, "output", "loop", args.includes("--check") ? "check" : iter ? `iter-${iter}` : "look");
const summary = JSON.parse(fs.readFileSync(path.join(dir, "summary.json"), "utf8"));
const world = loadWorld();
const stageById = Object.fromEntries(world.stages.map((s) => [s.id, s]));
const stages = named.length ? named : Object.keys(summary.items).filter((id) => stageById[id] && summary.items[id].check?.misplaced?.length);
const r1 = (v) => Math.round(v * 10) / 10;

for (const id of stages) {
  const st = stageById[id];
  const file = path.join(root, "web", "src", "campaign", "stages", `${st.campaign}.ts`);
  const src = fs.readFileSync(file, "utf8");
  const at = src.indexOf(`id: "${id}"`);
  const open = src.indexOf("enemy: [", at);
  const close = src.indexOf("\n    ],", open);
  if (at < 0 || open < 0 || close < 0) { console.log(`skip ${id}: entry not found`); continue; }
  const block = src.slice(open, close);
  const re = /\["([a-z0-9_.]+)", (-?[\d.]+), (-?[\d.]+)\]/g;
  const rows = [...block.matchAll(re)].map((m) => ({ text: m[0], id: m[1], x: Number(m[2]), z: Number(m[3]) }));
  let next = rows.map((r) => [r.x, r.z]);
  if (mode === "shift") {
    const layout = summary.items[`map.${st.map}`]?.layout;
    const zone = layout?.zones.filter((z) => z.team === 1).sort((a, b) => b.w * b.d - a.w * a.d)[0];
    if (!zone) { console.log(`skip ${id}: no layout of map.${st.map} in this summary`); continue; }
    const minX = Math.min(...rows.map((r) => r.x)), maxX = Math.max(...rows.map((r) => r.x));
    const minZ = Math.min(...rows.map((r) => r.z)), maxZ = Math.max(...rows.map((r) => r.z));
    const dx = zone.x - zone.w / 2 + 2 - minX;
    // an army deeper than the zone keeps its front 2 m in and runs back as far as it goes; across, it is centred on the zone
    const dz = zone.z - (minZ + maxZ) / 2;
    const squeeze = maxZ - minZ > zone.d - 4 ? (zone.d - 4) / (maxZ - minZ) : 1;
    next = rows.map((r) => [r1(r.x + dx), r1(zone.z + (r.z + dz - zone.z) * squeeze)]);
    if (maxX + dx > zone.x + zone.w / 2) console.log(`note ${id}: army ${r1(maxX - minX)} m deep, zone ${zone.w} m: back ranks past the zone`);
  } else {
    const moves = summary.items[id]?.check?.moves ?? [];
    for (const mv of moves) if (mv.to && next[mv.index]) next[mv.index] = mv.to;
  }
  let k = 0;
  const fixed = block.replace(re, (whole, uid) => { const [x, z] = next[k++]; return `["${uid}", ${x}, ${z}]`; });
  if (fixed === block) { console.log(`same ${id}`); continue; }
  fs.writeFileSync(file, src.slice(0, open) + fixed + src.slice(close));
  console.log(`${mode} ${id}: ${rows.length} units`);
}
