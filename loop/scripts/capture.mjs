// Evidence capture for the TABS-fidelity improvement loop.
//   node loop/scripts/capture.mjs --iter N [--showcase-only] [--regression-only] [--port 4181]
//   node loop/scripts/capture.mjs --only shot[,shot]   quick look: only those showcase shots, to output/loop/look/
//   node loop/scripts/capture.mjs --iter N --focus [--shots a,b]   gap review: only the shots named in loop/STATE.md's FAIL blockers
//     and Ranked open gaps (plus --shots, plus each one's motion-pair partner), and the regression scenarios
// Scenes with no requested shot are skipped, not just left unsaved.
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
const list = (s) => s.split(",").map((n) => n.trim()).filter(Boolean);
const only = list(opt("--only", ""));
const focus = flag("--focus");
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

// Gallery-camera reads (UI hidden by design): a lineup, two mid-swing close-ups, one hero pair.
const GALLERY_SHOTS = [
  ["lineup_medieval", "gallery_faction_medieval"],
  ["lineup_tribal", "gallery_faction_tribal"],
  ["lineup_farmer", "gallery_faction_farmer"],
  ["lineup_ancient", "gallery_faction_ancient"],
  ["lineup_viking", "gallery_faction_viking"],
  ["lineup_dynasty", "gallery_faction_dynasty"],
  ["lineup_renaissance", "gallery_faction_renaissance"],
  ["lineup_pirate", "gallery_faction_pirate"],
  ["lineup_spooky", "gallery_faction_spooky"],
  ["lineup_wild_west", "gallery_faction_wild_west"],
  ["lineup_legacy", "gallery_faction_legacy"],
  ["lineup_good", "gallery_faction_good"],
  ["lineup_evil", "gallery_faction_evil"],
  ["lineup_secret", "gallery_faction_secret"],
  // The secret lineup's front rank runs out of frame past the shogun: its giants (tree, ice) are read here
  ["lineup_secret_giants", "gallery_secret_giants"],
  // The good lineup crops the sacred elephant: its trappings and rider are read here
  ["closeup_sacred_elephant", "gallery_sacred_elephant"],
  // The legacy lineup hides the chariot end-on in its back ranks: horse, wheels, car and driver are read here
  ["closeup_legacy_chariot", "gallery_legacy_chariot"],
  ["closeup_state_reads", "gallery_state_reads"],
  ["closeup_weapon_reads", "gallery_weapon_reads"],
  ["closeup_pair_zeus_thor", "gallery_pair_ancient_zeus_vs_legacy_thor"],
  // Side-on reads: the shield press from the flank, and bowmen at the loose.
  ["shield_wall_side", "gallery_shield_wall_side"],
  ["shield_wall_front", "gallery_shield_wall_front"],
  ["closeup_archer_loose", "gallery_archer_loose"],
  ["press_clubbers_side", "gallery_press_clubbers"],
  ["spell_dome", "gallery_spell_dome"],
];
const THROW_GROUPS = [["spears", 2], ["bombs", 3], ["casters", 3]];
const BIOME_MAPS = ["introduction", "adventure", "challenge", "dynasty", "renaissance", "pirate", "simulation"];

// Every shot a full run takes, for --focus to pick names out of STATE.md
const ALL_SHOTS = [
  "hud_placement", "ui_campaign_select",
  ...["400ms", "550ms", "1100ms", "1250ms", "3800ms"].map((t) => `war_machines_${t}`),
  ...GALLERY_SHOTS.map(([name]) => name), "press_clubbers_hit", "press_clubbers_blow",
  "throw_spears_harpoon", ...THROW_GROUPS.flatMap(([g]) => [`throw_${g}_release`, `throw_${g}_flight`]),
  "shield_wall_2500ms", "shield_wall_2650ms",
  ...["placement", "placement_ghost", "500ms", "2s", "2150ms", "5s", "9s", "result", "result_1s"].map((t) => `big_melee_${t}`),
  "melee_club_drop", ...BIOME_MAPS.map((m) => `biome_${m}`), "biome_spooky", "biome_spooky_battle",
];
// Motion pairs (CRITIC.md): asking for one frame brings its partner
const PAIRS = [
  ["war_machines_1100ms", "war_machines_1250ms"], ["big_melee_2s", "big_melee_2150ms"], ["shield_wall_2500ms", "shield_wall_2650ms"],
  ["big_melee_result", "big_melee_result_1s"], ...THROW_GROUPS.map(([g]) => [`throw_${g}_release`, `throw_${g}_flight`]),
];

// --focus: the shots named in STATE.md's FAIL blocker lines (the "- " lines of the Criteria block) and its Ranked open gaps
function focusShots() {
  const state = fs.readFileSync(path.join(root, "loop", "STATE.md"), "utf8");
  const section = (title) => {
    const m = new RegExp(`^## ${title}[^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(state);
    return m ? m[1] : "";
  };
  const text = section("Criteria").split(/\r?\n/).filter((l) => l.startsWith("- ")).join("\n") + "\n" + section("Ranked open gaps");
  const names = new Set(ALL_SHOTS.filter((s) => new RegExp(`(^|[^a-z0-9_])${s}(?![a-z0-9_])`).test(text)));
  for (const s of list(opt("--shots", ""))) names.add(s);
  for (const [a, b] of PAIRS) if (names.has(a) || names.has(b)) { names.add(a); names.add(b); }
  return [...names];
}
const wanted = only.length > 0 ? only : focus ? focusShots() : null;
// Whether any of these shots is to be taken (every shot, in a full run)
const wants = (...names) => wanted === null || names.some((n) => wanted.includes(n));
// --list: print the shots this run would take and stop
if (flag("--list")) {
  process.stdout.write(`${(wanted ?? ALL_SHOTS).join("\n")}\n`);
  process.exit(0);
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
  if (!wants(name)) return;
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

    if (doShowcase && wants("hud_placement", "ui_campaign_select")) {
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
      if (ALL_SHOTS.some((n) => n.startsWith("war_machines_") && wants(n))) {
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
      }

      for (const [shotName, scenario] of GALLERY_SHOTS) {
        if (!wants(shotName) && !(shotName === "press_clubbers_side" && wants("press_clubbers_hit", "press_clubbers_blow"))) continue;
        await page.evaluate((n) => {
          window.game.resetBattle();
          window.game.runScenarioGalleryValidation(n);
        }, scenario);
        await shot(page, shotName);
        if (shotName === "press_clubbers_side") {
          // Step a frame at a time until a clubber's blow lands, then shoot that very frame.
          const hit = await page.evaluate(() => {
            window.game.clearHitLog();
            for (let ms = 0; ms < 4000; ms += 16) {
              window.advanceTime(16);
              const h = window.game.getHitLog().find((e) => /clubber|chieftain/.test(e.attackerUnit));
              // Shoot 64 ms after the landing (club settled on the point it struck, before the sim walks the striker on), when the man it threw is in the
              // air, not on the land frame itself
              if (h) {
                for (let k = 0; k < 4; k++) window.advanceTime(16);
                return { ms, ...h };
              }
            }
            return null;
          });
          summary.notes.push(hit
            ? `press_clubbers_hit: ${hit.attackerUnit} -> ${hit.targetUnit} landed at +${hit.ms} ms, shot 64 ms after the landing`
            : "press_clubbers_hit: no clubber blow landed within 4 s, shot skipped");
          if (hit) {
            // Framed live, side-on to the blow itself (across the line from the striker to the man he hit), not down the wall's axis: a blow struck along
            // the line from the wall's end projects as a club pointing at the sky. The lens goes on whichever side of the blow has fewer men in front of it.
            await page.evaluate((h) => {
              const units = JSON.parse(window.render_game_to_text()).units.filter((u) => u.alive !== false);
              let dx = h.head.x - h.x, dz = h.head.z - h.z;
              const len = Math.hypot(dx, dz) || 1;
              dx /= len; dz /= len;
              let nx = -dz, nz = dx;
              const mid = { x: (h.x + h.head.x) / 2, z: (h.z + h.head.z) / 2 };
              const crowd = (sx, sz) => units.filter((u) => (u.x - mid.x) * sx + (u.z - mid.z) * sz > 0.6).length;
              if (crowd(nx, nz) > crowd(-nx, -nz)) { nx = -nx; nz = -nz; }
              window.game.frameCamera({ x: mid.x, y: 1.0, z: mid.z }, 3.8, Math.atan2(nz, nx), Math.PI / 2.05);
            }, hit);
            await shot(page, "press_clubbers_hit");
          }
          // 272 ms later (336 ms after the landing: the blow dwells on him BLOW_DWELL 0.12 s before the throw, and this is the top of it), framed on the struck
          // man where he is now, not where the club landed: found live as the highest man of the struck side near the blow, seen level down his wall's line
          // from his end of it.
          if (hit) {
            const struck = await page.evaluate((h) => {
              for (let k = 0; k < 17; k++) window.advanceTime(16);
              const units = JSON.parse(window.render_game_to_text()).units.filter((u) => u.alive !== false);
              const pool = units.filter((u) => u.id === h.targetUnit && Math.hypot(u.x - h.head.x, u.z - h.head.z) < 2.6);
              if (!pool.length) return null;
              const man = pool.reduce((a, b) => ((b.y ?? 0) > (a.y ?? 0) ? b : a));
              const mates = units.filter((u) => u !== man && u.team === man.team && Math.hypot(u.x - man.x, u.z - man.z) < 3.5);
              // His wall's line: the long axis of the mates still holding it (not of him: thrown a body out of it, he would skew a short line's axis)
              const all = mates.length >= 2 ? mates : [man, ...mates];
              const cx = all.reduce((s, u) => s + u.x, 0) / all.length, cz = all.reduce((s, u) => s + u.z, 0) / all.length;
              let sxx = 0, sxz = 0, szz = 0;
              for (const u of all) { sxx += (u.x - cx) ** 2; sxz += (u.x - cx) * (u.z - cz); szz += (u.z - cz) ** 2; }
              const theta = 0.5 * Math.atan2(2 * sxz, sxx - szz);
              let ax = Math.cos(theta), az = Math.sin(theta);
              if (ax * (man.x - cx) + az * (man.z - cz) < 0) { ax = -ax; az = -az; }
              let nx = -az, nz = ax;
              if (nx * (man.x - h.x) + nz * (man.z - h.z) < 0) { nx = -nx; nz = -nz; }
              // Side-on to his throw (straight down his wall's line, which runs across his facing), so his seat, thighs and head read in profile, from
              // whichever end of the line has fewer of his mates between him and the lens
              let ox = ax, oz = az;
              const onSide = (sx, sz) => mates.filter((u) => (u.x - man.x) * sx + (u.z - man.z) * sz > 0.2).length;
              if (onSide(ox, oz) > onSide(-ox, -oz)) { ox = -ox; oz = -oz; }
              // Aimed a little past his feet (the root) to his seat, which leads the throw
              window.game.frameCamera({ x: man.x + nx * 0.2, y: (man.y ?? 0) + 0.55, z: man.z + nz * 0.2 }, 3.6, Math.atan2(oz, ox), Math.PI / 2.05);
              return { id: man.id, y: man.y };
            }, hit);
            summary.notes.push(struck
              ? `press_clubbers_blow: struck man ${struck.id} framed 336 ms after the landing, ${(struck.y ?? 0).toFixed(2)} m up`
              : "press_clubbers_blow: no struck man near the blow, shot skipped");
            if (struck) await shot(page, "press_clubbers_blow");
          }
        }
      }
      // Throwers at the release (vfx tier 3, throw_<unit>): step the sim a frame at a time until every man in the group has let a missile go (one launch
      // per thrower, counted as rises in the missile count: a thrower who lets go at the end of his swing is later than one who fires at its start), shoot
      // that frame and the one 150 ms on, so the thing in flight can be read against the thing that was in the hand.
      for (const [group, throwers] of THROW_GROUPS) {
        if (!wants(`throw_${group}_release`, `throw_${group}_flight`) && !(group === "spears" && wants("throw_spears_harpoon"))) continue;
        await page.evaluate((n) => {
          window.game.resetBattle();
          window.game.runScenarioGalleryValidation(n);
        }, `gallery_throw_${group}`);
        // The harpooner fires at his swing's start, long before the javelin's let-go, and his harpoon is out of frame by the pair: shoot it 64 ms off the muzzle
        let fired = 0;
        if (group === "spears") {
          const firstMs = await page.evaluate(() => {
            for (let ms = 0; ms < 4000; ms += 16) {
              if (JSON.parse(window.render_game_to_text()).projectiles > 0) {
                window.advanceTime(64);
                return ms;
              }
              window.advanceTime(16);
            }
            return null;
          });
          if (firstMs !== null) {
            fired = 1;
            summary.notes.push(`throw_spears_harpoon: first missile at +${firstMs} ms, shot 64 ms on`);
            await shot(page, "throw_spears_harpoon");
          }
        }
        const spawnMs = await page.evaluate((n) => {
          const missiles = () => JSON.parse(window.render_game_to_text()).projectiles;
          let launches = 0;
          // Missiles already flying (the harpoon shot above) are not launches still to come
          let before = missiles();
          for (let ms = 0; ms < 4000; ms += 16) {
            const now = missiles();
            launches += Math.max(0, now - before);
            before = now;
            if (launches >= n) return ms;
            window.advanceTime(16);
          }
          return null;
        }, throwers - fired);
        summary.notes.push(spawnMs === null
          ? `throw_${group}: not every thrower let go within 4 s, pair skipped`
          : `throw_${group}: last thrower's missile at +${spawnMs} ms`);
        if (spawnMs === null) continue;
        await shot(page, `throw_${group}_release`);
        await page.evaluate(() => window.advanceTime(150));
        await shot(page, `throw_${group}_flight`);
      }
      await page.evaluate(() => {
        document.body.classList.remove("capture-mode");
        window.game.resetBattle();
        window.advanceTime(50);
      });

      // Shield lines in contact, and the same press 150 ms on.
      if (wants("shield_wall_2500ms", "shield_wall_2650ms")) {
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
      }

      // Big melee with the HUD visible.
      if (ALL_SHOTS.some((n) => n.startsWith("big_melee_") && wants(n))) {
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
      // To the result only when a result shot is wanted: it is most of a full run
      if (wants("big_melee_result", "big_melee_result_1s")) {
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
      // A pair 1 s apart, so the victory camera's drift and the survivors' motion can be judged.
      await page.evaluate(() => window.advanceTime(1000));
      await shot(page, "big_melee_result_1s");
      const finalState = await page.evaluate(() => window.render_game_to_text());
      fs.writeFileSync(path.join(outDir, "big_melee_final_state.json"), finalState);
      }
      }

      // Open-field clubbers on squires, no shield wall (battle-feel.e, a club coming down on a man): step a frame at a time to the first clubber blow after the lines meet,
      // and shoot it 32 ms after the landing, framed side-on to the blow, close.
      const clubHit = !wants("melee_club_drop") ? null : await page.evaluate(() => {
        window.game.resetBattle();
        window.advanceTime(50);
        for (const z of [-2.4, -1.2, 0, 1.2, 2.4]) {
          window.game.spawnUnit("tribal.clubber", 1, { x: 3, z });
          window.game.spawnUnit("medieval.squire", 0, { x: -3, z });
        }
        window.advanceTime(50);
        window.game.startBattleImmediate();
        window.advanceTime(1500);
        window.game.clearHitLog();
        for (let ms = 0; ms < 6000; ms += 16) {
          window.advanceTime(16);
          const h = window.game.getHitLog().find((e) => /clubber/.test(e.attackerUnit));
          if (h) {
            window.advanceTime(16);
            window.advanceTime(16);
            let dx = h.head.x - h.x, dz = h.head.z - h.z;
            const len = Math.hypot(dx, dz) || 1;
            dx /= len; dz /= len;
            // Camera off to the side of the blow line, on the side away from the field's centre line of men
            const side = Math.sign(-dz * h.x + dx * h.z) || 1;
            window.game.frameCamera({ x: (h.x + h.head.x) / 2, y: 0.9, z: (h.z + h.head.z) / 2 }, 3.4, Math.atan2(dx * side, -dz * side), Math.PI / 2.1);
            return { ms: ms + 1500, ...h };
          }
        }
        return null;
      });
      if (wants("melee_club_drop")) summary.notes.push(clubHit
        ? `melee_club_drop: ${clubHit.attackerUnit} -> ${clubHit.targetUnit} landed at ${clubHit.ms} ms, shot 32 ms after the landing`
        : "melee_club_drop: no clubber blow within 7.5 s, shot skipped");
      if (clubHit) await shot(page, "melee_club_drop");

      // Every other campaign map at the placement view: one shot per biome.
      for (const mapId of BIOME_MAPS) {
        if (!wants(`biome_${mapId}`)) continue;
        const loaded = await page.evaluate((id) => {
          try {
            window.game.resetBattle();
            window.game.loadCampaignScenario(id);
            window.advanceTime(50);
            return true;
          } catch (e) {
            return String(e);
          }
        }, mapId);
        if (loaded === true) await shot(page, `biome_${mapId}`);
        else summary.notes.push(`biome_${mapId}: campaign did not load: ${loaded}`);
      }
      if (wants("biome_spooky", "biome_spooky_battle")) {
      // Second biome: the spooky campaign map with its locked undead line, at the placement view.
      await page.evaluate(() => {
        window.game.resetBattle();
        window.game.loadCampaignScenario("spooky");
        window.advanceTime(50);
      });
      await shot(page, "biome_spooky");
      // The same map in battle, from the low battle camera: the biome's ground and ring with the team tints gone (they are placement guides).
      const spookyPlaced = await page.evaluate(() => {
        let ok = 0;
        for (let i = 0; i < 6; i++) {
          if (window.game.spawnUnit(i % 2 ? "medieval.squire" : "tribal.protector", 0, { x: -10 - (i % 2) * 1.5, z: -4 + i * 1.6 })) ok++;
        }
        window.game.startBattleImmediate();
        window.advanceTime(3000);
        return ok;
      });
      summary.notes.push(`biome_spooky_battle placed ${spookyPlaced}/6 units`);
      await shot(page, "biome_spooky_battle");
      }
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
      // UI flow: on the Levels screen, a clicked level then Sandbox opens an empty sandbox on that level's map; Sandbox with no level clicked, the default map
      const t0 = Date.now();
      const flow = await page.evaluate(() => {
        const state = () => JSON.parse(window.render_game_to_text());
        const click = (sel, i = 0) => {
          const el = document.querySelectorAll(sel)[i];
          if (!el) throw new Error(`no ${sel}[${i}]`);
          el.click();
          window.advanceTime(50);
        };
        const failures = [];
        try {
          window.game.resetBattle();
          window.advanceTime(50);
          const home = state();
          // The level nodes are built when the Levels screen opens
          window.game.openCampaignPicker();
          window.advanceTime(50);
          const nodes = document.querySelectorAll("#campaignList .campaign-item").length;
          let picked = null;
          for (let i = 0; i < nodes && !picked; i++) {
            window.game.openCampaignPicker();
            window.advanceTime(50);
            click("#campaignList .campaign-item", i);
            click("#campaignScenarioList .campaign-scenario-item", 0);
            const mapId = state().campaign?.mapId;
            if (mapId && mapId !== home.map.id) picked = { i, mapId };
          }
          if (!picked) return ["no level on a map other than the sandbox's"];
          // From inside that level's campaign, as a player would be: Levels, the level, Sandbox
          window.game.openCampaignPicker();
          window.advanceTime(50);
          click("#campaignList .campaign-item", picked.i);
          click("#btnLeaveCampaign");
          const s = state();
          if (s.map.id !== picked.mapId) failures.push(`map ${s.map.id}, expected the level's ${picked.mapId}`);
          if (s.campaign !== null) failures.push("still in campaign mode");
          if (s.units.length !== 0) failures.push(`${s.units.length} units on the field, expected none`);
          if (s.budgets.teamA !== home.budgets.teamA || s.budgets.teamB !== home.budgets.teamB) failures.push(`budgets ${s.budgets.teamA}/${s.budgets.teamB}, sandbox ${home.budgets.teamA}/${home.budgets.teamB}`);
          // No level clicked: the default sandbox map
          window.game.openCampaignPicker();
          window.advanceTime(50);
          click("#btnLeaveCampaign");
          if (state().map.id !== home.map.id) failures.push(`Sandbox with no level clicked opened ${state().map.id}, expected ${home.map.id}`);
        } catch (e) {
          failures.push(String(e));
        }
        return failures;
      });
      summary.scenarios.push({ name: "ui_levels_sandbox_map", passed: flow.length === 0, failures: flow, ms: Date.now() - t0 });
      log(`${flow.length === 0 ? "PASS" : "FAIL"} ui_levels_sandbox_map`);
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
