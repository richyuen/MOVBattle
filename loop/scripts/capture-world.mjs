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
const POSE_OVERRIDE = {
  // 605: the route level rose to 6 m (chambers sunk below it): the default ground camera (y 10, target y 2) skimmed the deck
  "map.fantasy_evil": {
    island: { target: { x: 0, y: 16, z: 0 }, radius: 230, alpha: -Math.PI / 2, beta: 1.2 }, top: { target: { x: 0, y: 12, z: 0 }, radius: 160, alpha: -Math.PI / 2, beta: 0.72 },
    ground: { target: { x: 12, y: 8, z: 0 }, radius: 44, alpha: Math.PI, beta: 1.32 },
    battle: { target: { x: 12, y: 8, z: 0 }, radius: 44, alpha: Math.PI, beta: 1.32 },
  },
  "map.fantasy_good": { island: { target: { x: 0, y: 8, z: 0 }, radius: 220, alpha: -Math.PI / 2, beta: 1.2 }, top: { target: { x: 0, y: 8, z: 0 }, radius: 165, alpha: -Math.PI / 2, beta: 0.72 } },
  "map.hill": { ground: { target: { x: 12, y: 6, z: 0 }, radius: 64, alpha: -2.8, beta: 1.4 } },
  // 602: the turned galleons lie along z at x +-29, so the default ground camera (x -30) stood inside team 0's hull; a low view
  // from the strip's near end up its centre line, both hulls framing the waist and the mountain beyond (ground, battle, stages)
  "map.pirate": {
    ground: { target: { x: 0, y: 3, z: 0 }, radius: 46, alpha: -Math.PI / 2 + 0.3, beta: 1.36 },
    battle: { target: { x: 0, y: 3, z: 0 }, radius: 46, alpha: -Math.PI / 2 + 0.3, beta: 1.36 },
  },
  // 591: the skirmish puts team 1 on the right gate wall top (19 m up): an elevated diagonal from the attackers side sees it
  "map.high_ground": { battle: { target: { x: 24, y: 12, z: 8 }, radius: 58, alpha: Math.PI + 0.35, beta: 0.95 } },
};
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
  // shot from the beach at the +z galleon with eight clubbers standing on its deck and two on a gangplank, then a reset (587).
  // 595: the +z galleon lies at x -17 (bow +x, stern x -30); the camera stands on the beach off its stern quarter so the stern
  // and the hull's run both show
  // 602: the galleons were turned to run along z and scaled 1.5x; team 0's lies at x -29 (keel), beach to +x, stern z -24: the
  // same deck-local spots and the same stern-quarter view from the beach
  if (item === "map.pirate") {
    await page.evaluate(() => {
      for (const [x, z] of [[-27.5, -19.5], [-30.5, -13.5], [-27.5, -7.5], [-30.5, -1.5], [-27.5, 4.5], [-30.5, 10.5], [-32.75, -10.5], [-25.25, 1.5], [-18.5, -4.5], [-12.5, -4.5]]) window.game.spawnUnit("tribal.clubber", 1, { x, z });
      window.advanceTime(50);
    });
    await frame(page, { target: { x: -27.5, y: 9.5, z: -10.5 }, radius: 48, alpha: -0.64, beta: 1.2 });
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
    return ok;
  }, layout.zones);
  // High Ground: the placed armies before the start (593), so the defenders show on the wall tops before they walk off
  if (item === "map.high_ground") {
    await frame(page, POSE_OVERRIDE[item].battle);
    await shot(page, `${p}placed`);
  }
  await page.evaluate(() => window.game.startBattleImmediate());
  let battleMs = 0;
  // Catch a defender leaving the crown before the ordinary 5 s battle frame.
  // Two adjacent seeded frames show the front edge from the same camera.
  if (item === "map.high_ground") {
    const edge = await page.evaluate(() => {
      for (let ms = 0; ms <= 5000; ms += 20) {
        const u = window.game.listLiveUnits().find(q => q.team === 1 && q.definition.id === "medieval.archer" && q.position.x > 27.5 && q.position.x < 28.1 && Math.abs(q.position.z) < 4.6);
        if (u) return { id: u.runtimeId, ms };
        window.advanceTime(20);
      }
      return { id: null, ms: 5020 };
    });
    battleMs = edge.ms;
    if (edge.id !== null) {
      await frame(page, { target: { x: 28, y: 18, z: 0 }, radius: 32, alpha: Math.PI + 0.5, beta: 1.2 });
      await shot(page, `${p}gate_before`);
      const crossingMs = await page.evaluate(id => {
        for (let ms = 0; ms <= 1000; ms += 20) {
          const u = window.game.listLiveUnits().find(q => q.runtimeId === id);
          if (u && u.position.x <= 27.5) return ms;
          window.advanceTime(20);
        }
        return 1020;
      }, edge.id);
      battleMs += crossingMs;
      await shot(page, `${p}gate`);
    } else summary.notes.push(`${item}: no bar archer reached the crown front in 5 s, gate shot skipped`);
  }
  if (battleMs < 5000) await page.evaluate(ms => window.advanceTime(ms), 5000 - battleMs);
  // Ancient 1: the low pose sees only roofs; frame the player army's box from an elevated player-side diagonal (574)
  let battleView = POSE_OVERRIDE[item]?.battle ?? POSE.ground;
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
  rec.skirmish ={ placed, ...(await runToResult(page, Math.max(5000, battleMs))) };
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
  const streets = item === "introduction.basic_formation";
  const archCart = item === "adventure.final_destination_wheelbarrow";
  // The ship's beach-side rail hides deck formations from the low shore pose.
  const deckArmy = item === "pirate.x_marks_the_spot";
  // Catapult Castle: look through the gateway at platform height as well as at
  // the wall batteries; the default target y1 looks into the ramp's face.
  const castleBattery = item === "simulation.catapult_castle";
  // Wall's ground reserves sit behind a seven-metre wall. Look over the
  // crown so the same frame resolves the slot and the separate rear body.
  const corridorArmy = item === "simulation.wall";
  // Laughing Knights' column runs end-on away from the camera along the land
  // bridge: from the low pose each pair hides the next. Look down the column.
  const bridgeColumn = item === "wild_west.laughing_knights";
  // 623: Legacy Siege's Kings stand on the raised back terrace behind the front walls: look down over the walls (wiki high oblique).
  const siegeTerrace = item === "legacy.siege";
  // 624: Lone Ranger's party stands south-west of the chapel (39,35) with a rear-street building west of the chapel:
  // look from the south-west so the chapel stands behind-left of the Quick Draw and the building falls to the left.
  const chapelBehind = item === "wild_west.lone_ranger_and_his_friends";
  // 625: item-keyed army poses. Chaotic Cavalry: on the plaza inside the west parapet, framing the ring round (-12,2).
  // Storm the Fortress: from the field (-z) looking at the castle gate behind the army. Encircling Tribe: the three groups
  // round the player's circle from high on the player's side. Dismantle the Spears: the two poles at a diagonal so each
  // file recedes and the two stand apart.
  const ARMY_POSE = {
    "fantasy_good.chaotic_cavalry": { target: { x: -12, y: 1, z: 2 }, radius: 24, alpha: Math.PI, beta: 0.85 },
    "fantasy_evil.storm_the_fortress": { alpha: -Math.PI / 2, beta: 1.1 },
    "fantasy_evil.encircling_tribe": { radius: 32, alpha: Math.PI, beta: 0.75 },
    "fantasy_evil.dismantle_the_spears": { alpha: Math.PI + 0.5, beta: 1.05 },
  };
  const armyPose = ARMY_POSE[item];
  if (armyPose) {
    await frame(page, {
      target: armyPose.target ?? { x: box.cx, y: 1, z: box.cz },
      radius: armyPose.radius ?? Math.max(16, Math.max(box.w, box.d) * 1.25 + 8),
      alpha: armyPose.alpha, beta: armyPose.beta,
    });
  } else await frame(page, {
    target: { x: box.cx, y: siegeTerrace ? 8 : castleBattery ? 12 : archCart ? 9 : st.map === "pirate" && item !== "pirate.a_rival_captain" ? 8.2 : 1, z: box.cz },
    radius: Math.max(archCart ? 32 : 16, Math.max(box.w, box.d) * 1.25 + 8),
    alpha: chapelBehind ? Math.PI + 0.6 : deckArmy ? Math.PI + 0.45 : city ? Math.PI + 0.42 : Math.PI,
    beta: siegeTerrace ? 0.8 : corridorArmy ? 0.55 : bridgeColumn ? 0.7 : castleBattery ? 1.4 : deckArmy ? 0.95 : archCart ? 1 : streets ? 0.24 : city ? 0.77 : 1.2,
  });
  await shot(page, `${p}army`);
  // 611: on the dynasty map the 135 m top view loses the army among the pagodas and canopies (AUDIT 610): frame the right half
  // round the army instead, from the same high oblique
  const dynastyField = st.map === "dynasty" ? { ...POSE.top, target: { x: box.cx, y: 0, z: box.cz }, radius: 70 } : null;
  // The Hill level reaches the far edge at x76. Centre its field evidence on
  // the defending half so the whole long rear line fits inside the frame.
  const hillField = item === "simulation.hill" ? { ...POSE.top, target: { x: 35, y: 5, z: 0 }, radius: 120 } : null;
  // The seven-metre wall occludes the slot floor from the usual oblique.
  const corridorField = corridorArmy ? { ...POSE.top, target: { x: 5, y: 0, z: 0 }, radius: 90, beta: 0.22 } : null;
  await frame(page, streets ? { ...POSE.top, beta: 0.2 } : corridorField ?? hillField ?? dynastyField ?? POSE.top);
  await shot(page, `${p}field`);
  await page.evaluate(({ c, s }) => { window.game.runCampaignSmokeCheck(c, s, { advanceMs: 5000 }); }, { c: st.campaign, s: item });
  await frame(page, st.map === "pirate" ? POSE_OVERRIDE["map.pirate"].battle : POSE.ground);
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
