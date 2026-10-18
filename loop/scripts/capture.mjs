// Evidence capture for the TABS-fidelity improvement loop.
//   node loop/scripts/capture.mjs --iter N --units a,b | --batch <name>   loop v2: each unit's shot set (idle, windup, release, flight, struck,
//       ability pair when one fires) in a seeded one-on-one against a squire, plus lineup_<faction> once per faction; no scenarios
//   node loop/scripts/capture.mjs --units a,b | --batch <name>             the same as a look, to output/loop/look/
//   node loop/scripts/capture.mjs --iter N --regression-only               the scenario suite alone (loop v2 batch checkpoint)
//   node loop/scripts/capture.mjs --iter N [--showcase-only]               loop v1's showcase set (kept for reference)
//   node loop/scripts/capture.mjs --only shot[,shot]                       quick look at v1 showcase shots, to output/loop/look/
// Every run also writes output/loop/ours.json (game.listUnitDefinitions) for loop/scripts/stats.mjs.
// Deterministic: Math.random is a seeded PRNG reseeded, and the world clock restarted from zero (window.game.resetClock), at every resetBattle, so
// a scene plays the same frames in a look and in an iteration run, whatever ran before it (time is stepped through window.advanceTime only).
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
import { loadRoster, batchByName } from "./lib/roster.mjs";

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
const batchName = opt("--batch", "");
const batch = batchName ? batchByName(loadRoster(), batchName) : null;
const unitIds = batch ? batch.units : list(opt("--units", ""));
const unitMode = unitIds.length > 0;
const doRegression = flag("--regression-only") || (!flag("--showcase-only") && only.length === 0 && !unitMode);
const doShowcase = !flag("--regression-only") && !unitMode;
const outDir = only.length > 0 || (unitMode && iter === 0) ? path.join(root, "output", "loop", "look") : path.join(root, "output", "loop", `iter-${iter}`);
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

// Every shot a v1 full run takes (--only picks from these)
const ALL_SHOTS = [
  "hud_placement", "ui_campaign_select",
  ...["400ms", "550ms", "1100ms", "1250ms", "3800ms"].map((t) => `war_machines_${t}`),
  ...GALLERY_SHOTS.map(([name]) => name), "press_clubbers_hit", "press_clubbers_blow",
  "throw_spears_harpoon", ...THROW_GROUPS.flatMap(([g]) => [`throw_${g}_release`, `throw_${g}_flight`]),
  "shield_wall_2500ms", "shield_wall_2650ms",
  ...["placement", "placement_ghost", "500ms", "2s", "2150ms", "5s", "9s", "result", "result_1s"].map((t) => `big_melee_${t}`),
  "melee_club_drop_pre", "melee_club_drop", "duel_club_land", "duel_club_thrown", ...BIOME_MAPS.map((m) => `biome_${m}`), "biome_spooky", "biome_spooky_battle",
];
// Motion pairs (CRITIC.md): asking for one frame brings its partner
const PAIRS = [
  ["war_machines_1100ms", "war_machines_1250ms"], ["big_melee_2s", "big_melee_2150ms"], ["shield_wall_2500ms", "shield_wall_2650ms"],
  ["big_melee_result", "big_melee_result_1s"], ["melee_club_drop_pre", "melee_club_drop"], ["duel_club_land", "duel_club_thrown"], ...THROW_GROUPS.map(([g]) => [`throw_${g}_release`, `throw_${g}_flight`]),
];

const wanted = only.length > 0 ? only : null;
// Whether any of these shots is to be taken (every shot, in a full run)
const wants = (...names) => wanted === null || names.some((n) => wanted.includes(n));
// Loop v2: the shot set of one unit (the ability pair only when a second mechanic fires)
const UNIT_SHOTS = (id) => ["idle", "windup", "release", "flight", "struck", "ability", "ability_after", ...(RELOAD_SHOT[id] ? ["reload"] : [])].map((s) => `unit_${id}_${s}`);
// A unit whose reload is a pose of its own (the scarecrow's A-pose after the volley): one more shot, on the unit alone, this many ticks past the release
const RELOAD_SHOT = { "farmer.scarecrow": 72 };
void PAIRS;
// --list: print the shots this run would take and stop
if (flag("--list")) {
  const names = unitMode ? [...unitIds.flatMap(UNIT_SHOTS), ...new Set(unitIds.map((id) => `lineup_${id.split(".")[0]}`))] : (wanted ?? ALL_SHOTS);
  process.stdout.write(`${names.join("\n")}\n`);
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
  units: {},
};
const full = { scenarios: [] };

async function shot(page, name) {
  if (!wants(name)) return;
  const file = path.join(outDir, `${name}.png`);
  // A cold frame draws props and shadows but no bodies: redraw until every shader is compiled.
  // No sim time passes.
  const state = await page.evaluate(() => Promise.race([
    window.game.renderWhenReady(),
    // The game's loop is bounded at 40 renders x (50 ms + a swiftshader frame), which can pass 30 s on a crowded scene; the race only guards a hung promise.
    new Promise((r) => setTimeout(() => r({ ready: false, renders: -1, unready: ["timed out"] }), 120_000)),
  ]));
  if (!state || !state.ready) {
    const what = state ? state.unready.join(", ") : "no state";
    summary.notes.push(`${name}: scene not ready after ${state ? state.renders : "?"} renders, shot may miss: ${what}`);
  }
  await page.screenshot({ path: file });
  // A shot taken again over itself (a candidate pair) is listed once
  if (!summary.screenshots.includes(`${name}.png`)) summary.screenshots.push(`${name}.png`);
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
    // Seeded randomness (mulberry32): wobble phases, thrown poses, fall directions and hit spread all draw from Math.random, so without
    // this no two runs of a scene land the same blow at the same frame. window.reseed() restarts the sequence; resetBattle calls it below.
    const SEED = 0x4d4f5642;
    let s = SEED;
    Math.random = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    window.reseed = () => { s = SEED; };
  });

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => window.game && typeof window.game.runScenarioCheck === "function",
      undefined,
      { polling: 100, timeout: 60_000 },
    );
    await page.evaluate(() => {
      // Every scene starts with resetBattle: reseed there so each scene's frames are the same whichever scenes ran before it.
      const reset = window.game.resetBattle.bind(window.game);
      window.game.resetBattle = (...args) => { window.reseed(); const out = reset(...args); window.game.resetClock?.(); return out; };
      window.game.skipTitleIntro();
      window.advanceTime(50);
    });

    // Every run writes the roster's resolved numbers for loop/scripts/stats.mjs
    const ours = await page.evaluate(() => window.game.listUnitDefinitions());
    fs.mkdirSync(path.join(root, "output", "loop"), { recursive: true });
    fs.writeFileSync(path.join(root, "output", "loop", "ours.json"), JSON.stringify(ours));
    const oursById = Object.fromEntries(ours.map((r) => [r.id, r]));

    // Loop v2: one unit against a squire in the open. The scene is seeded and replayed from reset to every shot's frame (bench.mjs's pattern), so a
    // measurement never feeds back into a frame. The release is the first plain attack event the sim records for the unit (a landed blow, a missile,
    // a throw or cast, a burst or volley); a second, special mechanic (teleport, leap, heal, summon, lightning, slam, status) is the ability pair.
    if (unitMode) {
      await page.evaluate(() => {
        const r2 = (v) => ({ x: +v.x.toFixed(3), y: +v.y.toFixed(3), z: +v.z.toFixed(3) });
        window.__wp = (n) => { const c = []; for (let k = n; k; k = k.parent) c.unshift(k); for (const k of c) k.computeWorldMatrix(true); return r2(n.getAbsolutePosition()); };
        // Place the unit (team 1, +x) and its sparring squire (team 0, -x). `support` adds a hurt ally beside the unit and puts the enemy far off, so
        // the first event is the heal or buff.
        window.__unitPlace = (id, d, support) => {
          const game = window.game;
          game.resetBattle();
          document.body.classList.add("capture-mode");
          window.advanceTime(50);
          const a = game.spawnUnit(id, 1, { x: d, z: 0 });
          const t = game.spawnUnit("medieval.squire", 0, { x: support ? -10 : -d, z: 0 });
          let ally = null;
          if (support) {
            ally = game.spawnUnit("medieval.squire", 1, { x: d + 2, z: 1.2 });
            if (ally) ally.applyDamage(ally.maxHealth * 0.6, ally.position.scale(0));
          }
          window.__ua = a; window.__ut = t; window.__ually = ally;
          window.advanceTime(50);
          return Boolean(a && t);
        };
        window.__unitStart = (id, d, support) => {
          if (!window.__unitPlace(id, d, support)) return false;
          window.game.startBattleImmediate();
          window.game.clearHitLog();
          window.game.clearAbilityLog();
          window.__t0 = window.game.getWorldTime();
          return true;
        };
        // Times are sim ticks (1/60 s). advanceTime(ms) runs round(ms / 16.67) ticks and renders once, so a replay to a frame is one call and
        // one swiftshader render, not one per tick.
        window.__unitAt = (id, d, support, ticks) => {
          if (!window.__unitStart(id, d, support)) return false;
          if (ticks > 0) window.advanceTime(ticks * 1000 / 60);
          return true;
        };
        // Rig height, root to head top, for the camera's distance (a giant needs a wider frame)
        // A war machine (vehicle sockets) by the top of its meshes too, not its crewman's head: a catapult's arm stands twice his height when thrown upright
        window.__rig = (u) => {
          try {
            const base = window.__wp(u.body.root).y;
            let top = window.__wp(u.body.headTop).y;
            if (u.body.vehicleSockets) {
              for (const m of u.body.root.getChildMeshes(false)) {
                if (!m.isEnabled() || !m.isVisible) continue;
                window.__wp(m);
                top = Math.max(top, m.getBoundingInfo().boundingBox.maximumWorld.y);
              }
            }
            return Math.max(0.6, top - base);
          } catch { return 1.8; }
        };
        // Frame across the line between the two men, level. `on`: 0 the midpoint, 1 the unit alone, 2 the struck man (the ally for a support unit),
        // 3 the unit and the first metres of its missile's path (a ranged unit's target is far off; the man and what leaves his hand are the evidence).
        window.__unitFrame = (on, s) => {
          const a = window.__ua, t = on === 2 && window.__ually ? window.__ually : window.__ut;
          const pa = a.body.root.position, pt = t.body.root.position;
          let fx = pt.x - pa.x, fz = pt.z - pa.z; const l = Math.hypot(fx, fz) || 1; fx /= l; fz /= l;
          // 4: the struck man where he is now, up in the air too (a float), wider so his balloons stay in frame
          if (on === 4) { window.game.frameCamera({ x: pt.x, y: pt.y + 0.55 * s + 0.85, z: pt.z }, 5.2 * s, Math.atan2(fx, -fz), Math.PI / 2.1); return; }
          const c = on === 1 ? { x: pa.x, z: pa.z } : on === 2 ? { x: pt.x, z: pt.z } : on === 3 ? { x: pa.x + fx * 1.4 * s, z: pa.z + fz * 1.4 * s } : { x: (pa.x + pt.x) / 2, z: (pa.z + pt.z) / 2 };
          const radius = (on === 1 || on === 2 ? 3.8 : on === 3 ? 5.2 : 5.5) * s;
          window.game.frameCamera({ x: c.x, y: (on === 3 ? 0.8 : 0.55) * s + 0.45, z: c.z }, radius, Math.atan2(fx, -fz), on === 3 ? Math.PI / 2.2 : Math.PI / 2.1);
        };
      });
      const PLAIN = /^(missile|melee hit|fire|throw|cast|burst|volley|shotgun)/;
      const TICK = 1000 / 60;
      const lineupsDone = new Set();
      for (const id of unitIds) {
        const def = oursById[id];
        if (!def) { summary.notes.push(`unit_${id}: not in the roster`); continue; }
        const abilities = new Set(def.abilities);
        const charger = def.archetype === "charge_melee" || abilities.has("charge_impact") || abilities.has("jump_charge") || abilities.has("leap_attack");
        const support = def.archetype === "support_heal" || def.archetype === "support_buff";
        const d = def.archetype === "artillery" ? 9 : charger ? 8 : Math.min(8, Math.max(2.5, def.engageRange * 0.6));
        // Detection steps 6 ticks (one render) at a time; a logged event's frame comes from its world-time stamp, exact to the tick. Only the
        // projectile-count fallback (a missile with no fire log) is 6 ticks coarse.
        const det = await page.evaluate(({ id, d, support }) => {
          if (!window.__unitStart(id, d, support)) return { error: "spawn failed", events: [], rig: 1.8 };
          const rig = window.__rig(window.__ua);
          const game = window.game;
          const t0 = window.__t0;
          const tickOf = (t) => Math.max(1, Math.round((t - t0) * 60));
          const missiles = () => JSON.parse(window.render_game_to_text()).projectiles;
          let before = missiles();
          const events = [];
          const seen = new Set();
          let hits = 0, logged = 0;
          const plain = (k) => /^(missile|melee hit|fire|throw|cast|burst|volley|shotgun)/.test(k);
          const special = (k) => !plain(k) && k !== "impact";
          // The struck man's first loss of health: a missile's landing (a blow's landing is the hit log)
          const victim = window.__ut;
          const hp0 = victim.currentHealth;
          for (let tick = 6; tick <= 540; tick += 6) {
            window.advanceTime(100);
            if (!seen.has("impact") && (victim.currentHealth < hp0 || victim.isDead)) { events.push({ kind: "impact", tick }); seen.add("impact"); }
            const h = game.getHitLog().filter((e) => e.attackerUnit === id);
            if (h.length > hits && !seen.has("melee hit")) { events.push({ kind: "melee hit", tick: tickOf(h[hits].t) }); seen.add("melee hit"); }
            hits = h.length;
            const ab = game.getAbilityLog().filter((e) => e.unit === id);
            for (const e of ab.slice(logged)) if (!seen.has(e.kind)) { events.push({ kind: e.kind, tick: tickOf(e.t) }); seen.add(e.kind); }
            logged = ab.length;
            const now = missiles();
            if (now > before && !seen.has("missile") && !seen.has("fire") && !seen.has("throw") && !seen.has("cast")) { events.push({ kind: "missile", tick }); seen.add("missile"); }
            before = now;
            // Done once a plain attack, its impact and a special mechanic are all seen, or 3 s after the first event
            if (events.some((e) => plain(e.kind)) && events.some((e) => special(e.kind)) && seen.has("impact")) break;
            if (events.length && tick >= Math.min(...events.map((e) => e.tick)) + 180) break;
          }
          events.sort((a, b) => a.tick - b.tick);
          return { events, rig };
        }, { id, d, support });
        // A thrower or caster logs "fire" at the decision and "throw"/"cast" at the let-go: the let-go is the release
        const release = det.events.find((e) => /^(throw|cast)/.test(e.kind)) ?? det.events.find((e) => PLAIN.test(e.kind)) ?? det.events[0] ?? null;
        const ability = det.events.find((e) => !PLAIN.test(e.kind) && e.kind !== "impact" && e !== release) ?? null;
        const impact = det.events.find((e) => e.kind === "impact") ?? null;
        // The struck frame: 20 ticks (336 ms) after a blow, the top of the thrown man's arc; for a missile, 6 ticks after it first costs the target health.
        // A short throw (the stoner's boulder at a man who has closed in, landing inside 15 ticks of the let-go): 9 ticks after the landing, and framed from
        // the far rig (`far`, the thrower and the metres ahead of him) rather than the 2 m camera on the struck man, which sat inside the impact dust while
        // the thrown man left its frame (critic 318)
        const shortThrow = Boolean(release && release.kind === "throw" && impact && impact.tick - release.tick < 15);
        const struckTick = release ? (shortThrow ? impact.tick + 9 : impact && impact.tick > release.tick + 20 ? impact.tick + 6 : release.tick + 20) : null;
        const s = Math.min(4, Math.max(1, det.rig / 1.8));
        const ms = (e) => Math.round(e.tick * TICK);
        summary.units[id] = { release: release && { ...release, ms: ms(release) }, ability: ability && { ...ability, ms: ms(ability) }, impact: impact && { ...impact, ms: ms(impact) }, events: det.events, rigHeight: +det.rig.toFixed(2), d, s: +s.toFixed(2), support };
        summary.notes.push(det.error ? `unit_${id}: ${det.error}` : release
          ? `unit_${id}: release = ${release.kind} at ${ms(release)} ms${ability ? `; ability ${ability.kind} at ${ms(ability)} ms` : ""}${impact ? `; target hurt at ${ms(impact)} ms` : "; target never hurt within the window"} (rig ${det.rig.toFixed(2)} m, d ${d.toFixed(1)} m)`
          : `unit_${id}: nothing within 9 s (rig ${det.rig.toFixed(2)} m, d ${d.toFixed(1)} m)`);
        if (det.error) continue;
        const take = async (name, ticks, on) => {
          const ok = await page.evaluate(({ id, d, support, ticks, on, s }) => {
            const r = ticks === null ? window.__unitPlace(id, d, support) : window.__unitAt(id, d, support, ticks);
            if (r) window.__unitFrame(on, s);
            return r;
          }, { id, d, support, ticks, on, s });
          if (ok) await shot(page, name);
          else summary.notes.push(`${name}: spawn failed`);
        };
        // A support unit's enemy stands far off: frame the unit and the ally beside it; a ranged unit: the unit and its missile's first metres
        const far = support ? 1 : d >= 6 ? 3 : 0;
        await take(`unit_${id}_idle`, null, 1);
        if (release) {
          // 9 ticks = 150 ms (the motion pair), 20 ticks = 336 ms (the top of a struck man's throw)
          if (release.tick > 9) await take(`unit_${id}_windup`, release.tick - 9, far);
          await take(`unit_${id}_release`, release.tick, far);
          // A thrown missile at a man who has closed in (the stoner's boulder at 3 m) lands inside the motion pair's 9 ticks: its flight shot is taken
          // under half way to the hit instead, so the missile is still in the air and not yet its impact dust
          const flightAt = shortThrow ? Math.max(3, Math.floor((impact.tick - release.tick) * 0.45)) : 9;
          await take(`unit_${id}_flight`, release.tick + flightAt, far);
          await take(`unit_${id}_struck`, struckTick, shortThrow ? far : 2);
          if (RELOAD_SHOT[id]) await take(`unit_${id}_reload`, release.tick + RELOAD_SHOT[id], 1);
          // A running mechanic (the bard's Banjo Walk circles) shows over seconds, not in the motion pair: one more shot 90 ticks (1.5 s) on, both men framed
          const walk = /^banjo_walk/.test(release.kind) ? release : ability && /^banjo_walk/.test(ability.kind) ? ability : null;
          if (walk) await take(`unit_${id}_walk`, walk.tick + 90, 0);
        }
        if (ability) {
          // A float (a balloon arrow's man rising under his balloons) is slow: its after shot is 60 ticks (1 s) on, framed on the struck man
          const slow = /^float/.test(ability.kind);
          await take(`unit_${id}_ability`, ability.tick, slow ? 4 : far);
          await take(`unit_${id}_ability_after`, ability.tick + (slow ? 60 : 9), slow ? 4 : far);
        }
        const faction = id.split(".")[0];
        if (!lineupsDone.has(faction)) {
          lineupsDone.add(faction);
          await page.evaluate((n) => {
            window.game.resetBattle();
            window.game.runScenarioGalleryValidation(n);
          }, `gallery_faction_${faction}`);
          await shot(page, `lineup_${faction}`);
        }
      }
      await page.evaluate(() => {
        document.body.classList.remove("capture-mode");
        window.game.resetBattle();
        window.advanceTime(50);
      });
    }

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
          // Clubber blows are taken in turn, each one's pair shot over the last, until one whose struck man has flown clear of his mates 336 ms after
          // the landing (a man struck at the wall's end and thrown along it into his mates is buried in the pile and shows nothing of the throw); the
          // scene is not rerun (seeded, but a rerun would cost a reset), so a candidate is only ever a blow landing after the last one's 336 ms. The pair of the last
          // candidate stands when none clears within 4 s.
          await page.evaluate(() => window.game.clearHitLog());
          let taken = 0;
          let ms = 0;
          let candidates = 0;
          let last = null;
          while (ms < 4000) {
            // Step a frame at a time until the next clubber's blow lands, then shoot that very frame.
            const hit = await page.evaluate(({ ms0, taken }) => {
              for (let ms = ms0; ms < 4000; ms += 16) {
                window.advanceTime(16);
                const hits = window.game.getHitLog().filter((e) => /clubber|chieftain/.test(e.attackerUnit));
                // Shoot 64 ms after the landing (club settled on the point it struck, before the sim walks the striker on), when the man it threw is in the
                // air, not on the land frame itself
                if (hits.length > taken) {
                  for (let k = 0; k < 4; k++) window.advanceTime(16);
                  return { ms: ms + 16, taken: hits.length, ...hits[hits.length - 1] };
                }
              }
              return { ms: 4000, taken };
            }, { ms0: ms, taken });
            ms = hit.ms + 64;
            taken = hit.taken;
            if (hit.attackerUnit === undefined) break;
            candidates++;
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
            // 272 ms later (336 ms after the landing: the blow dwells on him BLOW_DWELL 0.12 s before the throw, and this is the top of it), framed on the struck
            // man where he is now, not where the club landed: found live as the highest man of the struck side near the blow, seen level down his wall's line
            // from his end of it.
            const struck = await page.evaluate((h) => {
              for (let k = 0; k < 17; k++) window.advanceTime(16);
              const units = JSON.parse(window.render_game_to_text()).units.filter((u) => u.alive !== false);
              const pool = units.filter((u) => u.id === h.targetUnit && Math.hypot(u.x - h.head.x, u.z - h.head.z) < 2.6);
              if (!pool.length) return null;
              const man = pool.reduce((a, b) => ((b.y ?? 0) > (a.y ?? 0) ? b : a));
              const mates = units.filter((u) => u !== man && u.team === man.team && Math.hypot(u.x - man.x, u.z - man.z) < 3.5);
              // Clear of the pile: in the air and no mate within half a stride of him
              const clear = (man.y ?? 0) >= 0.25 && mates.every((u) => Math.hypot(u.x - man.x, u.z - man.z) > 0.55);
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
              // his right-hand end of the line (his board, flung out on his left arm, hides him from his left) unless that end has two more of his
              // mates between him and the lens than the other
              let ox = ax, oz = az;
              const onSide = (sx, sz) => mates.filter((u) => (u.x - man.x) * sx + (u.z - man.z) * sz > 0.2).length;
              const fl = Math.hypot(h.x - man.x, h.z - man.z) || 1;
              const rx = (h.z - man.z) / fl, rz = -(h.x - man.x) / fl;
              if (ox * rx + oz * rz < 0) { ox = -ox; oz = -oz; }
              if (onSide(ox, oz) > onSide(-ox, -oz) + 1) { ox = -ox; oz = -oz; }
              // Aimed a little past his feet (the root) to his seat, which leads the throw
              window.game.frameCamera({ x: man.x + nx * 0.2, y: (man.y ?? 0) + 0.55, z: man.z + nz * 0.2 }, 3.6, Math.atan2(oz, ox), Math.PI / 2.05);
              return { id: man.id, y: man.y, clear };
            }, hit);
            ms += 272;
            if (struck) await shot(page, "press_clubbers_blow");
            last = { hit, struck, candidates };
            if (struck && struck.clear) break;
          }
          summary.notes.push(last
            ? `press_clubbers_hit: ${last.hit.attackerUnit} -> ${last.hit.targetUnit} landed at +${last.hit.ms} ms (candidate blow ${last.candidates}), shot 64 ms after the landing`
            : "press_clubbers_hit: no clubber blow landed within 4 s, shot skipped");
          if (last) summary.notes.push(last.struck
            ? `press_clubbers_blow: struck man ${last.struck.id} framed 336 ms after the landing, ${(last.struck.y ?? 0).toFixed(2)} m up, ${last.struck.clear ? "clear of his mates" : "NOT clear of his mates (no candidate cleared within 4 s)"}`
            : "press_clubbers_blow: no struck man near the blow, shot skipped");
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
      // Placement ghost: the selected tray unit held over open ground ahead of team A's (red, left) front rank, as the cursor would hold it.
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
      // and shoot it 32 ms after the landing, framed side-on to the blow, a little above the men (4.6 m, pitched down ~17 deg) so a blow in mid-line reads over the near file.
      const clubHit = !wants("melee_club_drop", "melee_club_drop_pre") ? null : await page.evaluate(() => {
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
            window.game.frameCamera({ x: (h.x + h.head.x) / 2, y: 0.9, z: (h.z + h.head.z) / 2 }, 4.6, Math.atan2(dx * side, -dz * side), Math.PI / 2.45);
            return { ms: ms + 1500, ...h };
          }
        }
        return null;
      });
      if (wants("melee_club_drop", "melee_club_drop_pre")) summary.notes.push(clubHit
        ? `melee_club_drop: ${clubHit.attackerUnit} -> ${clubHit.targetUnit} landed at ${clubHit.ms} ms, shot 32 ms after the landing`
        : "melee_club_drop: no clubber blow within 7.5 s, shot skipped");
      if (clubHit) await shot(page, "melee_club_drop");
      // Its motion pair: the same scene replayed (seeded, clock restarted, so the same frames) to 144 ms before that frame, same lens: the club on its
      // way down onto the man, not only resting on him.
      if (clubHit && wants("melee_club_drop_pre")) {
        await page.evaluate((h) => {
          window.game.resetBattle();
          window.advanceTime(50);
          for (const z of [-2.4, -1.2, 0, 1.2, 2.4]) {
            window.game.spawnUnit("tribal.clubber", 1, { x: 3, z });
            window.game.spawnUnit("medieval.squire", 0, { x: -3, z });
          }
          window.advanceTime(50);
          window.game.startBattleImmediate();
          window.advanceTime(1500);
          const steps = (h.ms - 1500) / 16 + 1 + 2 - 9;
          for (let k = 0; k < steps; k++) window.advanceTime(16);
          let dx = h.head.x - h.x, dz = h.head.z - h.z;
          const len = Math.hypot(dx, dz) || 1;
          dx /= len; dz /= len;
          const side = Math.sign(-dz * h.x + dx * h.z) || 1;
          window.game.frameCamera({ x: (h.x + h.head.x) / 2, y: 0.9, z: (h.z + h.head.z) / 2 }, 4.6, Math.atan2(dx * side, -dz * side), Math.PI / 2.45);
        }, clubHit);
        await shot(page, "melee_club_drop_pre");
      }

      // One clubber on one hoplite in the open (battle-feel.e and g, the pose bench's duel): the blow side-on at the frame it lands, and the struck man
      // 336 ms later at the top of his throw, nobody in front of either. Framed across the line between the two men, level, so the club's fall and the
      // thrown man's trunk and legs read in profile.
      if (wants("duel_club_land", "duel_club_thrown")) {
        const frameDuel = () => page.evaluate(() => {
          const [a, t] = window.__duel;
          const pa = a.body.root.position, pt = t.body.root.position;
          let fx = pt.x - pa.x, fz = pt.z - pa.z; const l = Math.hypot(fx, fz) || 1; fx /= l; fz /= l;
          window.game.frameCamera({ x: (pa.x + pt.x) / 2, y: 1.0, z: (pa.z + pt.z) / 2 }, 5.5, Math.atan2(fx, -fz), Math.PI / 2.1);
        });
        const duel = await page.evaluate(() => {
          window.game.resetBattle();
          window.advanceTime(50);
          window.__duel = [window.game.spawnUnit("tribal.clubber", 1, { x: 2.5, z: 0 }), window.game.spawnUnit("ancient.hoplite", 0, { x: -2.5, z: 0 })];
          window.advanceTime(50);
          window.game.startBattleImmediate();
          window.game.clearHitLog();
          for (let ms = 16; ms < 9000; ms += 16) {
            window.advanceTime(16);
            if (window.game.getHitLog().some((h) => h.attackerUnit === "tribal.clubber")) return ms;
          }
          return null;
        });
        summary.notes.push(duel ? `duel_club: tribal.clubber -> ancient.hoplite landed at ${duel} ms` : "duel_club: no clubber blow within 9 s, shots skipped");
        if (duel) {
          await frameDuel();
          await shot(page, "duel_club_land");
          await page.evaluate(() => { for (let k = 0; k < 21; k++) window.advanceTime(16); });
          await frameDuel();
          await shot(page, "duel_club_thrown");
        }
      }

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
