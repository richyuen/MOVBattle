// Evidence capture for the TABS-fidelity improvement loop.
//   node loop/scripts/capture.mjs --iter N [--showcase-only] [--regression-only] [--port 4181]
// Builds web/, serves it with vite preview, drives the game headlessly with time advanced ONLY
// through window.advanceTime (requestAnimationFrame is stubbed so the real-time render loop never
// runs), runs the regression scenario set, captures showcase screenshots, and writes
//   output/loop/iter-N/summary.json    compact: per-scenario pass/fail, console errors, png list
//   output/loop/iter-N/full-state.json complete scenario results (debugging only)
// Exit code 1 on any scenario failure, page error, or capture failure.
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
const doRegression = !flag("--showcase-only");
const doShowcase = !flag("--regression-only");
const outDir = path.join(root, "output", "loop", `iter-${iter}`);
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

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
  const file = path.join(outDir, `${name}.png`);
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
    }

    if (doRegression) {
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

    if (doShowcase) {
      // War machines mid-fire.
      await page.evaluate(() => {
        window.game.resetBattle();
        window.game.runScenario("war_machine_cannon_compare");
      });
      await shot(page, "war_machines_2400ms");
      await page.evaluate(() => window.advanceTime(1600));
      await shot(page, "war_machines_4000ms");

      // Gallery-camera reads (UI hidden by design): a lineup, two mid-swing close-ups, one hero pair.
      const galleryShots = [
        ["lineup_medieval", "gallery_faction_medieval"],
        ["closeup_state_reads", "gallery_state_reads"],
        ["closeup_weapon_reads", "gallery_weapon_reads"],
        ["closeup_pair_zeus_thor", "gallery_pair_ancient_zeus_vs_legacy_thor"],
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
      await page.evaluate(() => {
        window.game.startBattleImmediate();
        window.advanceTime(2000);
      });
      await shot(page, "big_melee_2s");
      await page.evaluate(() => window.advanceTime(3000));
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
      await page.evaluate(() => window.advanceTime(300));
      await shot(page, "big_melee_result");
      const finalState = await page.evaluate(() => window.render_game_to_text());
      fs.writeFileSync(path.join(outDir, "big_melee_final_state.json"), finalState);
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
}

main().catch((err) => {
  console.error(err);
  killServer();
  process.exit(1);
});
