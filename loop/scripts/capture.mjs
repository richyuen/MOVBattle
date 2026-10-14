// Evidence capture for the TABS-fidelity improvement loop.
//   node loop/scripts/capture.mjs --iter N [--showcase-only] [--regression-only] [--port 4181]
//   node loop/scripts/capture.mjs --only shot[,shot]   quick look: only those showcase shots, to output/loop/look/
// Builds web/, serves it with vite preview, drives the game headlessly with time advanced ONLY
// through window.advanceTime (requestAnimationFrame is stubbed so the real-time render loop never
// runs), runs the regression scenario set, captures showcase screenshots, and writes
//   output/loop/iter-N/summary.json    compact: per-scenario pass/fail, console errors, png list
//   output/loop/iter-N/full-state.json complete scenario results (debugging only)
// Exit code 1 on any scenario failure, page error, or capture failure.
// Iterations older than KEEP_ITERS are pruned down to summary.json after each run.
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const webDir = path.join(root, "web");

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const iter = Number(opt("--iter", "0"));
const port = Number(opt("--port", "4181"));
const only = opt("--only", "").split(",").map((n) => n.trim()).filter(Boolean);
const doRegression = !flag("--showcase-only") && only.length === 0;
const doShowcase = !flag("--regression-only");
const outDir = only.length > 0 ? path.join(root, "output", "loop", "look") : path.join(root, "output", "loop", `iter-${iter}`);
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const KEEP_ITERS = 10;

const REGRESSION_SCENARIOS = [
  "physics_hit_launch_guard",
  "physics_death_launch_guard",
  "crowd_topple_clubber_vs_protector",
  "battlefeel_shield_wall_vs_light_swarm",
  "battlefeel_attack_interrupt_charge",
  "battlefeel_downed_lane_block",
  "battlefeel_spillover_chain",
  "composite_bomb_cannon",
  "nonsecret_legacy_tank_roles",
  "battle_recap_result_legacy_tank_shell",
  "gallery_team_color_blue_red_validation",
];

// 30 v 31 sandbox melee in 3 tight ranks: the closest analogue to the reference screenshots.
const BIG_MELEE = [];
const RANK_Z = [-2.7, -2.1, -1.5, -0.9, -0.3, 0.3, 0.9, 1.5, 2.1, 2.7];
function line(team, ids, xs) {
  let i = 0;
  for (const x of xs) {
    for (const z of RANK_Z) {
      if (i >= ids.length) return;
      BIG_MELEE.push({ unitId: ids[i++], team, position: { x, z } });
    }
  }
}
line(0, [
  "medieval.knight", "medieval.squire", "ancient.hoplite", "medieval.squire", "medieval.knight",
  "medieval.knight", "medieval.squire", "ancient.hoplite", "medieval.squire", "medieval.knight",
  "ancient.hoplite", "medieval.squire", "ancient.hoplite", "medieval.squire", "ancient.hoplite",
  "ancient.hoplite", "medieval.squire", "ancient.hoplite", "medieval.squire", "ancient.hoplite",
  "medieval.archer", "medieval.squire", "medieval.archer", "medieval.squire", "medieval.archer",
  "medieval.archer", "medieval.squire", "medieval.archer", "medieval.squire", "medieval.archer",
], [-6, -6.9, -7.8]);
line(1, [
  "tribal.protector", "tribal.clubber", "tribal.protector", "tribal.clubber", "tribal.protector",
  "tribal.protector", "tribal.clubber", "tribal.protector", "tribal.clubber", "tribal.protector",
  "tribal.clubber", "farmer.halfling", "tribal.clubber", "farmer.halfling", "tribal.clubber",
  "tribal.clubber", "farmer.halfling", "tribal.clubber", "farmer.halfling", "tribal.clubber",
  "farmer.farmer", "tribal.clubber", "farmer.farmer", "tribal.clubber", "tribal.chieftain",
  "tribal.clubber", "farmer.farmer", "tribal.clubber", "farmer.farmer", "tribal.clubber",
], [6, 6.9, 7.8]);
BIG_MELEE.push({ unitId: "tribal.mammoth", team: 1, position: { x: 11, z: 0 } });

// Two cannons against a squire block, close enough that muzzle, shot and impact share one frame.
const WAR_MACHINES = [
  { unitId: "pirate.cannon", team: 0, position: { x: -5, z: -1.5 } },
  { unitId: "secret.bomb_cannon", team: 0, position: { x: -5, z: 1.5 } },
];
for (const x of [4, 5]) {
  for (const z of [-2.4, -1.2, 0, 1.2, 2.4]) {
    WAR_MACHINES.push({ unitId: "medieval.squire", team: 1, position: { x, z } });
  }
}

// Two lines of shield carriers meeting head on with no giant between them: the reference shield wall (tabs_screenshot_06).
const SHIELD_WALL = [];
for (let i = 0; i < 8; i++) {
  const z = -2.8 + i * 0.8;
  SHIELD_WALL.push({ unitId: "ancient.hoplite", team: 0, position: { x: -4, z } });
  SHIELD_WALL.push({ unitId: "tribal.protector", team: 1, position: { x: 4, z } });
}
for (let i = 0; i < 6; i++) {
  SHIELD_WALL.push({ unitId: "medieval.squire", team: 0, position: { x: -5, z: -2 + i * 0.8 } });
}
// A second rank of boards behind red's wall, a clear rank depth back.
for (let i = 0; i < 6; i++) {
  SHIELD_WALL.push({ unitId: "tribal.protector", team: 1, position: { x: 5.3, z: -2 + i * 0.8 } });
}

// Keep only summary.json for iterations older than KEEP_ITERS: the PNGs run to ~10 MB a turn.
function pruneOld() {
  if (iter <= 0 || only.length > 0) return;
  const parent = path.dirname(outDir);
  if (!fs.existsSync(parent)) return;
  let pruned = 0;
  for (const name of fs.readdirSync(parent)) {
    const m = /^iter-(\d+)$/.exec(name);
    if (!m || Number(m[1]) >= iter - KEEP_ITERS) continue;
    const dir = path.join(parent, name);
    for (const f of fs.readdirSync(dir)) {
      if (f === "summary.json") continue;
      fs.rmSync(path.join(dir, f), { recursive: true, force: true });
      pruned++;
    }
  }
  if (pruned > 0) log(`pruned ${pruned} file(s) from iterations before ${iter - KEEP_ITERS}`);
}

function log(msg) {
  process.stdout.write(`[capture] ${msg}\n`);
}

function gitClean() {
  const out = execSync("git status --porcelain", { cwd: root, encoding: "utf8" });
  return out.trim() === "";
}

function build() {
  log("building web/");
  execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
}

let server = null;
function killServer() {
  if (!server) return;
  const pid = server.pid;
  server = null;
  try {
    execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" });
  } catch {
    /* already gone */
  }
}
process.on("exit", killServer);

async function startServer() {
  log(`starting vite preview on ${port}`);
  server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: webDir,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", () => {});
  server.stderr.on("data", (d) => process.stderr.write(`[vite] ${d}`));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`vite preview did not answer on ${baseUrl} within 60 s`);
}

const summary = {
  iter,
  startedAt: new Date().toISOString(),
  scenarios: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  notes: [],
};
const full = { scenarios: [] };

async function shot(page, name) {
  if (only.length > 0 && !only.includes(name)) return;
  const file = path.join(outDir, `${name}.png`);
  // A cold frame draws props and shadows but no bodies: redraw until every shader is compiled.
  // No sim time passes.
  const state = await page.evaluate(() => Promise.race([
    window.game.renderWhenReady(),
    new Promise((r) => setTimeout(() => r({ ready: false, renders: -1, unready: ["timed out"] }), 30_000)),
  ]));
  if (!state || !state.ready) {
    const what = state ? state.unready.join(", ") : "no state";
    summary.notes.push(`${name}: scene not ready after ${state ? state.renders : "?"} renders, shot may miss: ${what}`);
  }
  await page.screenshot({ path: file });
  summary.screenshots.push(`${name}.png`);
  log(`shot ${name}.png`);
}

async function main() {
  if (iter === 0 && !gitClean()) {
    summary.notes.push("working tree was dirty during iter 0 capture");
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  build();
  await startServer();

  const browser = await chromium.launch({
    headless: true,
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on("console", (msg) => {
    if (msg.type() === "error") summary.consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => summary.pageErrors.push(err.message));

  // Freeze real time: Babylon's render loop never fires, so only window.advanceTime steps the
  // simulation (fixed 1/60 s) and renders. Headless swiftshader frames are far too slow for
  // real-dt stepping to be meaningful.
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 1;
    window.cancelAnimationFrame = () => {};
  });

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => window.game && typeof window.game.runScenarioCheck === "function",
      undefined,
      { polling: 100, timeout: 60_000 },
    );
    await page.evaluate(() => {
      window.game.skipTitleIntro();
      window.advanceTime(50);
    });

    if (doShowcase) {
      await page.evaluate(() => {
        window.game.resetBattle();
        window.advanceTime(50);
      });
      await shot(page, "hud_placement");
      // Campaign select: the level list over the placement view.
      await page.evaluate(() => {
        window.game.openCampaignPicker();
        window.advanceTime(50);
      });
      await shot(page, "ui_campaign_select");
      await page.evaluate(() => {
        window.game.closeCampaignPicker();
        window.advanceTime(50);
      });
    }

    if (doShowcase) {
      // War machines mid-fire.
      // Spawned inside the battle camera's ~12 m wide frame: the cannon_compare scenario's
      // 22 m gap puts both ends off screen.
      const machinesPlaced = await page.evaluate((units) => {
        window.game.resetBattle();
        let ok = 0;
        for (const u of units) {
          if (window.game.spawnUnit(u.unitId, u.team, u.position)) ok++;
        }
        window.game.startBattleImmediate();
        window.advanceTime(400);
        return ok;
      }, WAR_MACHINES);
      summary.notes.push(`war_machines placed ${machinesPlaced}/${WAR_MACHINES.length} units`);
      // Shots in flight: the first salvo is in the air from 0 to ~0.83 s, so the 1100/1250 pair never holds one.
      await shot(page, "war_machines_400ms");
      await page.evaluate(() => window.advanceTime(150));
      await shot(page, "war_machines_550ms");
      await page.evaluate(() => window.advanceTime(550));
      // Probed in 50 ms steps: blasts land at ~0.83 s and ~3.58 s and bodies peak ~0.3 s later.
      await shot(page, "war_machines_1100ms");
      // Motion pair: 150 ms later, so flung bodies and shots in flight can be judged as arcs.
      await page.evaluate(() => window.advanceTime(150));
      await shot(page, "war_machines_1250ms");
      await page.evaluate(() => window.advanceTime(2550));
      await shot(page, "war_machines_3800ms");

      // Gallery-camera reads (UI hidden by design): a lineup, two mid-swing close-ups, one hero pair.
      const galleryShots = [
        ["lineup_medieval", "gallery_faction_medieval"],
        ["closeup_state_reads", "gallery_state_reads"],
        ["closeup_weapon_reads", "gallery_weapon_reads"],
        ["closeup_pair_zeus_thor", "gallery_pair_ancient_zeus_vs_legacy_thor"],
        // Side-on reads: the shield press from the flank, and bowmen at the loose.
        ["shield_wall_side", "gallery_shield_wall_side"],
        ["shield_wall_front", "gallery_shield_wall_front"],
        ["closeup_archer_loose", "gallery_archer_loose"],
      ];
      for (const [shotName, scenario] of galleryShots) {
        await page.evaluate((n) => {
          window.game.resetBattle();
          window.game.runScenarioGalleryValidation(n);
        }, scenario);
        await shot(page, shotName);
      }
      await page.evaluate(() => {
        document.body.classList.remove("capture-mode");
        window.game.resetBattle();
        window.advanceTime(50);
      });

      // Shield lines in contact, and the same press 150 ms on.
      const wallPlaced = await page.evaluate((units) => {
        let ok = 0;
        for (const u of units) {
          if (window.game.spawnUnit(u.unitId, u.team, u.position)) ok++;
        }
        window.game.startBattleImmediate();
        window.advanceTime(2500);
        return ok;
      }, SHIELD_WALL);
      summary.notes.push(`shield_wall placed ${wallPlaced}/${SHIELD_WALL.length} units`);
      await shot(page, "shield_wall_2500ms");
      await page.evaluate(() => window.advanceTime(150));
      await shot(page, "shield_wall_2650ms");
      await page.evaluate(() => {
        window.game.resetBattle();
        window.advanceTime(50);
      });

      // Big melee with the HUD visible.
      const placed = await page.evaluate((units) => {
        let ok = 0;
        for (const u of units) {
          if (window.game.spawnUnit(u.unitId, u.team, u.position)) ok++;
        }
        window.advanceTime(50);
        return ok;
      }, BIG_MELEE);
      summary.notes.push(`big_melee placed ${placed}/${BIG_MELEE.length} units`);
      await shot(page, "big_melee_placement");
      // Placement ghost: the selected tray unit held over open ground ahead of blue's front rank, as the cursor would hold it.
      await page.evaluate(() => window.game.previewPlacementAtGround(-3, 1));
      await shot(page, "big_melee_placement_ghost");
      await page.evaluate(() => window.game.clearPlacementPreview());
      await page.evaluate(() => {
        window.game.startBattleImmediate();
        window.advanceTime(500);
      });
      // Mid-swoop: the camera on its way down from the placement oblique to the battle view.
      await shot(page, "big_melee_500ms");
      await page.evaluate(() => window.advanceTime(1500));
      await shot(page, "big_melee_2s");
      // Motion pair for the shove: arm swing, lean and topple read from the two frames.
      await page.evaluate(() => window.advanceTime(150));
      await shot(page, "big_melee_2150ms");
      await page.evaluate(() => window.advanceTime(2850));
      await shot(page, "big_melee_5s");
      await page.evaluate(() => window.advanceTime(4000));
      await shot(page, "big_melee_9s");
      let simMs = 9000;
      let mode = "";
      while (simMs < 60_000) {
        mode = await page.evaluate(() => {
          window.advanceTime(1000);
          return JSON.parse(window.render_game_to_text()).mode;
        });
        simMs += 1000;
        if (mode !== "Simulation") break;
      }
      summary.notes.push(`big_melee ended in mode ${mode} at ${simMs} ms`);
      await page.evaluate(() => window.advanceTime(2500)); // past the 2 s victory-shot drift
      await shot(page, "big_melee_result");
      const finalState = await page.evaluate(() => window.render_game_to_text());
      fs.writeFileSync(path.join(outDir, "big_melee_final_state.json"), finalState);

      // Second biome: the spooky campaign map with its locked undead line, at the placement view.
      await page.evaluate(() => {
        window.game.resetBattle();
        window.game.loadCampaignScenario("spooky");
        window.advanceTime(50);
      });
      await shot(page, "biome_spooky");
    }
    // After the showcase, so the showcase scenes start from the same state in a full run as in a --only look.
    if (doRegression) {
      // On a fresh page: the showcase leaves a campaign loaded and its own random draws behind.
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForFunction(
        () => window.game && typeof window.game.runScenarioCheck === "function",
        undefined,
        { polling: 100, timeout: 60_000 },
      );
      await page.evaluate(() => {
        window.game.skipTitleIntro();
        window.advanceTime(50);
      });
      for (const name of REGRESSION_SCENARIOS) {
        const t0 = Date.now();
        const result = await page.evaluate((n) => {
          const out = window.game.runScenarioCheck(n);
          return out ? JSON.parse(JSON.stringify(out)) : null;
        }, name);
        const passed = Boolean(result?.passed);
        summary.scenarios.push({
          name,
          passed,
          failures: result ? result.failures : ["scenario not found"],
          ms: Date.now() - t0,
        });
        full.scenarios.push({ name, result });
        log(`${passed ? "PASS" : "FAIL"} ${name}`);
      }
    }
  } finally {
    await browser.close();
    killServer();
  }

  const failed = summary.scenarios.filter((s) => !s.passed);
  summary.passed = failed.length === 0 && summary.pageErrors.length === 0;
  summary.failedScenarios = failed.map((s) => s.name);
  summary.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(outDir, "full-state.json"), JSON.stringify(full, null, 2));
  const verdict = summary.passed ? "GREEN" : "RED";
  log(`${verdict}: ${summary.scenarios.length - failed.length}/${summary.scenarios.length} scenarios passed, ${summary.pageErrors.length} page errors, ${summary.screenshots.length} screenshots -> ${path.relative(root, outDir)}`);
  if (!summary.passed) process.exitCode = 1;
  pruneOld();
}

main().catch((err) => {
  console.error(err);
  killServer();
  process.exit(1);
});
