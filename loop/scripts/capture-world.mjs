// Evidence capture for the maps-and-stages phase (loop v10). The unit phase's capture.mjs is untouched; this shares its boot (build, vite
// preview, headless Chrome on swiftshader, seeded Math.random, time only through window.advanceTime) and shoots maps and stages instead.
//   node loop/scripts/capture-world.mjs --iter N --batch <maps_k|stages_<campaign>>   the batch's shot set into output/loop/iter-N/
//   node loop/scripts/capture-world.mjs --iter N --items a,b [--add]                  listed items (map.<id> or a stage id); --add keeps the rest
//   node loop/scripts/capture-world.mjs --items a,b | --batch <name>                  a look, into output/loop/look/
//   ... --check-only                                  layouts and stage checks alone, into output/loop/check/ (fast; fix-placements.mjs --check)
// Shots per map `map.<id>` (files map_<id>_*.png):
//   island  the whole floating island from the side, a little above (the level-select view in reference/maps/<biome>.png)
//   top     high oblique over the field (the wiki map shot's angle in reference/maps/wiki/<id>.png)
//   ground  the battle camera: low, behind the left half, looking across the field
//   battle  two small armies 5 s into a battle at that camera (where they walk, what blocks them)
// Shots per stage (files stage_<id>_*.png):
//   army    the locked enemy army at placement, low from the player's side (the angle of reference/stages/<id>.png)
//   field   the same army from high over the whole map (where on the map it stands)
//   battle  5 s into the battle against the game's suggested player army
// summary.json `items[<id>]`: a map's layout and skirmish result; a stage's checkStage report (map, budget, spawned army, misplaced units)
// and its battle result (ended, at ms, winner, units left in hazards). world-judge.mjs turns them into the script-judged criteria.
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { loadWorld, worldBatchByName } from "./lib/world.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const webDir = path.join(root, "web");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};
const iter = Number(opt("--iter", "0"));
// --check-only: no shots and no battles; maps report their layout, stages their checkStage (placement fixes: fix-placements.mjs)
const checkOnly = flag("--check-only");
const port = Number(opt("--port", "4182"));
const world = loadWorld();
const batchName = opt("--batch", "");
const items = batchName ? worldBatchByName(world, batchName).items : opt("--items", "").split(",").map((s) => s.trim()).filter(Boolean);
if (items.length === 0) throw new Error("usage: capture-world.mjs [--iter N] --batch <name> | --items a,b [--add]");
const outDir = checkOnly ? path.join(root, "output", "loop", "check") : iter === 0 ? path.join(root, "output", "loop", "look") : path.join(root, "output", "loop", `iter-${iter}`);
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const KEEP_ITERS = 10;
const BATTLE_LIMIT_MS = 120_000;
const stageById = Object.fromEntries(world.stages.map((s) => [s.id, s]));
const mapIds = new Set(world.maps.map((m) => `map.${m.id}`));
for (const it of items) if (!mapIds.has(it) && !stageById[it]) throw new Error(`unknown item ${it}`);
const prefix = (it) => (it.startsWith("map.") ? `map_${it.slice(4)}_` : `stage_${it}_`);

const log = (msg) => process.stdout.write(`[capture-world] ${msg}\n`);
const summary = { iter, startedAt: new Date().toISOString(), items: {}, screenshots: [], consoleErrors: [], pageErrors: [], notes: [] };

let server = null;
function killServer() {
  if (!server) return;
  const pid = server.pid;
  server = null;
  try { execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ }
}
process.on("exit", killServer);

async function startServer() {
  log(`starting vite preview on ${port}`);
  server = spawn(process.execPath, [path.join(webDir, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: false, stdio: ["ignore", "pipe", "pipe"] });
  server.stdout.on("data", () => {});
  server.stderr.on("data", (d) => process.stderr.write(`[vite] ${d}`));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try { if ((await fetch(baseUrl)).ok) return; } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`vite preview did not answer on ${baseUrl}`);
}

// Same guard as capture.mjs: prune only from the loop's own next iteration, never on a test number
function pruneOld() {
  if (iter <= 0) return;
  const parent = path.dirname(outDir);
  const stateIter = Number(/^Iteration:\s*(\d+)/m.exec(fs.readFileSync(path.join(root, "loop", "STATE.md"), "utf8"))?.[1] ?? 0);
  if (iter > stateIter + 1) { log(`no prune: iter ${iter} is past STATE's next iteration ${stateIter + 1}`); return; }
  for (const name of fs.readdirSync(parent)) {
    const m = /^iter-(\d+)$/.exec(name);
    if (!m || Number(m[1]) >= iter - KEEP_ITERS) continue;
    for (const f of fs.readdirSync(path.join(parent, name))) if (f !== "summary.json") fs.rmSync(path.join(parent, name, f), { recursive: true, force: true });
  }
}

async function shot(page, name) {
  // the game drops the HUD-hiding class on resets and loads: set it again for every shot
  const state = await page.evaluate(() => (document.body.classList.add("capture-mode"), Promise.race([
    window.game.renderWhenReady(),
    new Promise((r) => setTimeout(() => r({ ready: false, renders: -1, unready: ["timed out"] }), 120_000)),
  ])));
  if (!state || !state.ready) summary.notes.push(`${name}: scene not ready, shot may miss: ${state ? state.unready.join(", ") : "no state"}`);
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  if (!summary.screenshots.includes(`${name}.png`)) summary.screenshots.push(`${name}.png`);
  log(`shot ${name}.png`);
}

// Camera poses (ArcRotate: alpha around Y from +x, beta from straight down). -PI/2 looks from -z across both halves; PI from behind the left half.
const POSE = {
  island: { target: { x: 0, y: -10, z: 0 }, radius: 200, alpha: -Math.PI / 2, beta: 1.2 },
  top: { target: { x: 0, y: 0, z: 0 }, radius: 135, alpha: -Math.PI / 2, beta: 0.72 },
  ground: { target: { x: 12, y: 2, z: 0 }, radius: 42, alpha: Math.PI, beta: 1.38 },
};
const TRIBAL_SANDBOX_OVERVIEW = { island: 218, top: 176 };
// Hill: the default ground pose sits at the ramp's foot looking into its face, so the slope never shows; a low view from the
// left flat's front corner up the ramp to the crest, the block's -z side face in profile, as wiki hill.png (589)
const POSE_OVERRIDE = { "map.hill": { ground: { target: { x: 12, y: 6, z: 0 }, radius: 64, alpha: -2.8, beta: 1.4 } } };
const frame = (page, p) => page.evaluate((q) => window.game.frameCamera(q.target, q.radius, q.alpha, q.beta, q.radiusLimit), p);

/** Battle on to a result in 2 s steps; the state, the time, and anyone left standing in a hazard. */
async function runToResult(page, startMs) {
  return page.evaluate(({ limit, startMs }) => {
    const stateOf = () => JSON.parse(window.render_game_to_text());
    let ms = startMs;
    let s = stateOf();
    while (s.mode !== "Result" && ms < limit) {
      window.advanceTime(2000);
      ms += 2000;
      s = stateOf();
    }
    const living = (team) => s.units.filter((u) => u.team === team && u.alive && u.linkedParentId === null).length;
    return { ended: s.mode === "Result", atMs: ms, livingA: living(0), livingB: living(1), inHazardA: window.game.countUnitsInHazards(0), inHazardB: window.game.countUnitsInHazards(1) };
  }, { limit: BATTLE_LIMIT_MS, startMs });
}

async function mapScene(page, item) {
  const p = prefix(item);
  const layout = await page.evaluate((id) => { const r = window.game.loadMapForCapture(id); window.advanceTime(50); return r; }, item);
  const rec = { layout };
  if (layout.mapId !== item) summary.notes.push(`${item}: loaded ${layout.mapId} instead`);
  if (checkOnly) { summary.items[item] = rec; return; }
  for (const pose of ["island", "top", "ground"]) {
    const view = POSE_OVERRIDE[item]?.[pose] ?? POSE[pose];
    const radius = item === "map.tribal_sandbox" ? TRIBAL_SANDBOX_OVERVIEW[pose] : undefined;
    await frame(page, radius ? { ...view, radius, radiusLimit: radius } : view);
    await shot(page, `${p}${pose}`);
  }
  // Renaissance: the palace's walk-in ground arcade (card Appearance) shows in no pose; a low shot from the piazza at its front,
  // six clubbers standing in the bays, then a full reset before the skirmish (585)
  if (item === "map.renaissance") {
    await page.evaluate(() => { for (const x of [-11.25, -6.75, -2.25, 2.25, 6.75, 11.25]) window.game.spawnUnit("tribal.clubber", 0, { x, z: 32.6 }); window.advanceTime(50); });
    await frame(page, { target: { x: 0, y: 3, z: 33 }, radius: 24, alpha: -Math.PI / 2 - 0.25, beta: 1.42 });
    await shot(page, `${p}arcade`);
    await page.evaluate(() => { window.game.resetBattle(); window.advanceTime(50); });
  }
  // Pirate: the galleon decks (fighting ground in TABS) lie past the placement zones, so the skirmish never reaches them; a
  // shot from the beach at the +z galleon with eight clubbers standing on its deck and two on a gangplank, then a reset (587)
  if (item === "map.pirate") {
    await page.evaluate(() => {
      for (const [x, z] of [[-10, 36], [-6, 38], [-2, 36], [2, 38], [6, 36], [10, 38], [-4, 39.5], [4, 34.5], [0, 30], [0, 26]]) window.game.spawnUnit("tribal.clubber", 1, { x, z });
      window.advanceTime(50);
    });
    await frame(page, { target: { x: 0, y: 4, z: 36 }, radius: 30, alpha: -Math.PI / 2 - 0.3, beta: 1.2 });
    await shot(page, `${p}deck`);
    await page.evaluate(() => { window.game.resetBattle(); window.advanceTime(50); });
  }
  // Skirmish: 8 clubbers and 4 archers a side at each team's first zone centre, in two ranks
  const placed = await page.evaluate((zones) => {
    let ok = 0;
    for (const team of [0, 1]) {
      const z = zones.find((q) => q.team === team);
      if (!z) continue;
      const face = team === 0 ? 1 : -1;
      for (let k = 0; k < 12; k++) {
        const id = k < 8 ? "tribal.clubber" : "medieval.archer";
        const x = z.x + face * (k < 8 ? 6 : 2);
        const zz = z.z + ((k % 8) - (k < 8 ? 3.5 : 1.5)) * 1.8;
        if (window.game.spawnUnit(id, team, { x, z: zz })) ok++;
      }
    }
    window.game.startBattleImmediate();
    window.advanceTime(5000);
    return ok;
  }, layout.zones);
  // Ancient 1: the low pose sees only roofs; frame the player army's box from an elevated player-side diagonal (574)
  let battleView = POSE.ground;
  if (item === "map.ancient_1") {
    const box = await page.evaluate(() => {
      const us = window.game.listLiveUnits().filter((u) => u.team === 0);
      const xs = us.map((u) => u.position.x), zs = us.map((u) => u.position.z);
      return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cz: (Math.min(...zs) + Math.max(...zs)) / 2, w: Math.max(...zs) - Math.min(...zs), d: Math.max(...xs) - Math.min(...xs) };
    });
    battleView = { target: { x: box.cx, y: 1, z: box.cz }, radius: Math.max(24, Math.max(box.w, box.d) * 0.9 + 10), alpha: Math.PI + 0.42, beta: 0.85 };
  }
  await frame(page, battleView);
  await shot(page, `${p}battle`);
  rec.skirmish ={ placed, ...(await runToResult(page, 5000)) };
  summary.items[item] = rec;
}

async function stageScene(page, item) {
  const st = stageById[item];
  const p = prefix(item);
  const check = await page.evaluate(({ c, s }) => { const r = window.game.checkStage(c, s); window.advanceTime(50); return r; }, { c: st.campaign, s: item });
  const rec = { check };
  if (check.error) { summary.notes.push(`${item}: ${check.error}`); summary.items[item] = rec; return; }
  if (checkOnly) { summary.items[item] = rec; return; }
  // Frame the enemy army: its centroid, low from the player's side, far enough for its whole width
  const box = await page.evaluate(() => {
    const us = window.game.listLiveUnits().filter((u) => u.team === 1);
    const xs = us.map((u) => u.position.x), zs = us.map((u) => u.position.z);
    return { cx: (Math.min(...xs) + Math.max(...xs)) / 2, cz: (Math.min(...zs) + Math.max(...zs)) / 2, w: Math.max(...zs) - Math.min(...zs), d: Math.max(...xs) - Math.min(...xs) };
  });
  // Ancient 1's rooftop rooms can occlude the enemy from the player's side.
  // Stay on that side, using an elevated diagonal over the central street.
  const city = st.map === "ancient_1";
  await frame(page, {
    target: { x: box.cx, y: 1, z: box.cz },
    radius: Math.max(16, Math.max(box.w, box.d) * 1.25 + 8),
    alpha: city ? Math.PI + 0.42 : Math.PI,
    beta: city ? 0.77 : 1.2,
  });
  await shot(page, `${p}army`);
  await frame(page, POSE.top);
  await shot(page, `${p}field`);
  await page.evaluate(({ c, s }) => { window.game.runCampaignSmokeCheck(c, s, { advanceMs: 5000 }); }, { c: st.campaign, s: item });
  await frame(page, POSE.ground);
  await shot(page, `${p}battle`);
  rec.battle = await runToResult(page, 5000);
  summary.items[item] = rec;
}

async function main() {
  const prevFile = path.join(outDir, "summary.json");
  const prev = flag("--add") && fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, "utf8")) : null;
  if (!flag("--add")) fs.rmSync(outDir, { recursive: true, force: true });
  else if (fs.existsSync(outDir)) for (const f of fs.readdirSync(outDir)) if (items.some((it) => f.startsWith(prefix(it)))) fs.rmSync(path.join(outDir, f));
  fs.mkdirSync(outDir, { recursive: true });

  log("building web/");
  execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
  await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on("console", (msg) => { if (msg.type() === "error") summary.consoleErrors.push(msg.text()); });
  page.on("pageerror", (err) => summary.pageErrors.push(err.message));
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 1;
    window.cancelAnimationFrame = () => {};
    const SEED = 0x4d4f5642;
    let s = SEED;
    Math.random = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    window.reseed = () => { s = SEED; };
    window.__setupScale = 8;
  });
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.game && typeof window.game.checkStage === "function", undefined, { polling: 100, timeout: 60_000 });
    await page.evaluate(() => {
      const reset = window.game.resetBattle.bind(window.game);
      window.game.resetBattle = (...a) => { window.reseed(); const out = reset(...a); window.game.resetClock?.(); return out; };
      window.game.skipTitleIntro();
      document.body.classList.add("capture-mode");
      window.advanceTime(50);
    });
    for (const it of items) {
      log(`scene ${it}`);
      await page.evaluate(() => window.reseed());
      try {
        if (it.startsWith("map.")) await mapScene(page, it);
        else await stageScene(page, it);
      } catch (e) {
        summary.notes.push(`${it}: scene failed: ${String(e.message ?? e).slice(0, 300)}`);
      }
    }
  } finally {
    await browser.close();
    killServer();
  }
  if (prev) {
    summary.items = { ...prev.items, ...summary.items };
    summary.screenshots = [...new Set([...prev.screenshots.filter((f) => !items.some((it) => f.startsWith(prefix(it)))), ...summary.screenshots])];
    summary.notes = [...prev.notes.filter((n) => !items.some((it) => n.startsWith(`${it}:`))), ...summary.notes, `--add: re-shot ${items.join(", ")}`];
  }
  summary.finishedAt = new Date().toISOString();
  fs.writeFileSync(prevFile, JSON.stringify(summary, null, 1));
  pruneOld();
  log(`${summary.screenshots.length} shots, ${summary.pageErrors.length} page errors, ${summary.notes.length} notes -> ${path.relative(root, outDir)}`);
  if (summary.pageErrors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  killServer();
  process.exit(1);
});
