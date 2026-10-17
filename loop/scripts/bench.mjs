// Pose bench for battle-feel work outside the loop: one attacker on one target in the open, numbers checked against a spec read off the reference.
//   npm run build --prefix web, then: node loop/scripts/bench.mjs [--targets a,b] [--attacker id] [--frames] [--tag x_] [--at ms,ms] [--trace]
// Writes output/bench/<tag>results.json and, with --frames, side-on pngs at land-144, land, +144 and +336 ms. Non-perturbing. Pass 0 steps the duel reading only the hit log and plain properties (root positions, animator state), which
// do not force world matrices; every measurement is then a fresh seeded replay to that frame, measured (and shot) once, so a read never feeds back
// into the frames it describes. Spec read off reference/frames/trailer_3_sheet_01.jpg r2c3:
//   thrown (+336 ms): trunk 45-65 deg from upright toward the flight; head above hip; kicked knee 0-35 deg under hip level, toward the striker
//   >= .5 thigh; trailing foot well below the hip
//   strike: at land-144 club head above the striker's crown; at land club head on the man (within .3 m of his crown, or on his top half
//   within .15 m of the pinned contact); at +144 lower than at land; roots a club's length apart at the land (>= 1.0 m)
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const opt = (n, f) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : f; };
const port = Number(opt("--port", "4199"));
const frames = args.includes("--frames");
const targets = opt("--targets", "medieval.squire,ancient.hoplite").split(",");
const attacker = opt("--attacker", "tribal.clubber");
const tag = opt("--tag", "");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = path.join(root, "output", "bench");
fs.mkdirSync(outDir, { recursive: true });
const base = `http://127.0.0.1:${port}/MOVBattle/`;

const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: path.join(root, "web"), shell: true, stdio: "ignore" });
const kill = () => { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
process.on("exit", kill);
for (let i = 0; i < 200; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 300)); }

const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.on("pageerror", (e) => console.error("pageerror", e.message));
await page.addInitScript(() => {
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
  const SEED = 0x4d4f5642; let s = SEED;
  Math.random = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  window.reseed = () => { s = SEED; };
});
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.game && window.game.spawnUnit, undefined, { polling: 100, timeout: 60000 });
await page.evaluate(() => {
  window.game.skipTitleIntro();
  window.advanceTime(50);
  const r2 = (v) => ({ x: +v.x.toFixed(3), y: +v.y.toFixed(3), z: +v.z.toFixed(3) });
  window.__wp = (n) => { const c = []; for (let k = n; k; k = k.parent) c.unshift(k); for (const k of c) k.computeWorldMatrix(true); return r2(n.getAbsolutePosition()); };
  window.__far = (mesh, from) => { window.__wp(mesh); const bb = mesh.getBoundingInfo().boundingBox; let best = null, bd = -1; for (const v of bb.vectorsWorld) { const d = (v.x - from.x) ** 2 + (v.y - from.y) ** 2 + (v.z - from.z) ** 2; if (d > bd) { bd = d; best = r2(v); } } return best; };
  window.__clubHead = (u) => { const b = u.body; const hand = window.__wp(b.rightHand); let best = hand, bd = -1; for (const m of b.rightHand.getChildMeshes(false)) { const p = window.__far(m, hand); const d = (p.x - hand.x) ** 2 + (p.y - hand.y) ** 2 + (p.z - hand.z) ** 2; if (d > bd) { bd = d; best = p; } } return best; };
  window.__pose = (u) => { const b = u.body; const P = window.__wp; const kneeL = P(b.leftKnee), kneeR = P(b.rightKnee);
    return { root: P(b.root), hip: P(b.hip), neck: P(b.neck), top: P(b.headTop), hipL: P(b.leftHip), hipR: P(b.rightHip), kneeL, kneeR, footL: window.__far(b.leftLowerLeg, kneeL), footR: window.__far(b.rightLowerLeg, kneeR), thrownW: u.animator._thrownWeight ? u.animator._thrownWeight() : -1, y: u.position.y }; };
  window.__strike = (a, t) => { const an = a.animator; return { club: window.__clubHead(a), hand: window.__wp(a.body.rightHand), shoulder: window.__wp(a.body.rightShoulder), crownA: window.__wp(a.body.headTop), crownT: window.__wp(t.body.headTop), state: an._state, motion: an._attackMotion, aimW: an._aimWeight, struck: an._blowStruck ? { head: r2(an._blowStruck.head), contact: r2(an._blowStruck.contact) } : null }; };
  window.__start = (attacker, target) => {
    window.game.resetBattle(); window.reseed(); window.game.resetClock(); window.advanceTime(50);
    const a = window.game.spawnUnit(attacker, 1, { x: 2.5, z: 0 }); const t = window.game.spawnUnit(target, 0, { x: -2.5, z: 0 });
    window.__a = a; window.__t = t;
    window.advanceTime(50); window.game.startBattleImmediate(); window.game.clearHitLog();
  };
  window.__frame = (side) => {
    const a = window.__a, t = window.__t;
    const pa = a.body.root.position, pt = t.body.root.position;
    let fx = pt.x - pa.x, fz = pt.z - pa.z; const l = Math.hypot(fx, fz) || 1; fx /= l; fz /= l;
    const mid = { x: (pa.x + pt.x) / 2, y: 1.0, z: (pa.z + pt.z) / 2 };
    window.game.frameCamera(mid, 5.5, Math.atan2(fx * side, -fz * side), Math.PI / 2.1);
  };
});

async function shoot(name) {
  await page.evaluate(() => window.game.renderWhenReady());
  await page.screenshot({ path: path.join(outDir, `${tag}${name}.png`) });
}
// Replay to `ms` after the start, measure, optionally shoot
async function at(attacker, target, ms, name) {
  const m = await page.evaluate(({ attacker, target, ms }) => {
    window.__start(attacker, target);
    for (let s = 16; s <= ms; s += 16) window.advanceTime(16);
    return { s: window.__strike(window.__a, window.__t), pose: window.__pose(window.__t), hits: window.game.getHitLog().filter((h) => h.attackerUnit === attacker).length };
  }, { attacker, target, ms });
  if (frames && name) { await page.evaluate(() => window.__frame(1)); await shoot(name); }
  return m;
}

if (opt("--at", "")) {
  for (const target of targets) for (const ms of opt("--at", "").split(",").map(Number)) {
    await at(attacker, target, ms, `${target}_t${ms}`);
    console.log("shot", target, ms);
  }
  await browser.close(); kill(); process.exit(0);
}
const results = [];
for (const target of targets) {
  // Pass 0: no world-matrix reads. When the striker's swing starts (animator state Attacking, 2) and when the blow lands
  const p0 = await page.evaluate(({ attacker, target, trace }) => {
    window.__trace = trace ? [] : null;
    window.__start(attacker, target);
    const a = window.__a, t = window.__t;
    let swingAt = null, swingDist = null, prev = a.animator._state;
    for (let ms = 16; ms < 9000; ms += 16) {
      window.advanceTime(16);
      const st = a.animator._state;
      const d = Math.hypot(a.body.root.position.x - t.body.root.position.x, a.body.root.position.z - t.body.root.position.z);
      if (st === 2 && prev !== 2) { swingAt = ms; swingDist = +d.toFixed(2); }
      if (window.__trace && ms % 48 === 0) window.__trace.push([ms, +d.toFixed(2), st, t.animator._state, window.game.getHitLog().length, +a.horizontalSpeed.toFixed(2), +t.horizontalSpeed.toFixed(2), +(a._nextAttackAt ?? -1).toFixed(2), +(a._staggerTimer ?? 0).toFixed(2), (() => { const now = a.constructor.timeNowSeconds(); return [+now.toFixed(2), a.hasCapability("attack", now), +(a._attackInterruptedUntil ?? -1).toFixed(2), +(a._recoveringUntil ?? -1).toFixed(2), +(a._toppledUntil ?? -1).toFixed(2), a._grounded, +a.position.y.toFixed(3), a.isStaggered]; })()]);
      prev = st;
      if (window.game.getHitLog().some((h) => h.attackerUnit === attacker)) return { landMs: ms, swingAt, swingDist, landDist: +d.toFixed(2), motion: a.animator._attackMotion, trace: window.__trace };
    }
    return null;
  }, { attacker, target, trace: args.includes("--trace") });
  if (p0?.trace) { console.log("trace [ms, dist, stateA, stateT, hits, knockA, knockT, nextAttackAt, stagger, [now, canAttack, interruptedUntil, recoveringUntil, toppledUntil, grounded, y, staggered]]:", JSON.stringify(p0.trace)); delete p0.trace; }
  if (!p0) { console.log(target, "no hit by attacker in 9 s"); continue; }
  const pre = await at(attacker, target, p0.landMs - 144, `${target}_pre144`);
  const land = await at(attacker, target, p0.landMs, `${target}_land`);
  const a144 = await at(attacker, target, p0.landMs + 144, `${target}_144`);
  const a336 = await at(attacker, target, p0.landMs + 336, `${target}_336`);
  const P = a336.pose;
  const A = land.s.shoulder;
  let fx = P.root.x - A.x, fz = P.root.z - A.z; const fl = Math.hypot(fx, fz) || 1; fx /= fl; fz /= fl;
  const loc = (q) => ({ f: (q.x - P.hip.x) * fx + (q.z - P.hip.z) * fz, up: q.y - P.hip.y });
  const thigh = Math.hypot(P.kneeL.x - P.hipL.x, P.kneeL.y - P.hipL.y, P.kneeL.z - P.hipL.z);
  const tr = loc(P.neck); const tilt = Math.atan2(tr.f, tr.up) * 180 / Math.PI;
  const kL = loc(P.kneeL), kR = loc(P.kneeR), fL = loc(P.footL), fR = loc(P.footR);
  const kicked = kL.up > kR.up ? "L" : "R";
  const kk = kicked === "L" ? kL : kR, tf = kicked === "L" ? fR : fL;
  const r3 = (v) => Math.round(v * 100) / 100;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  const g = { thrownW: r3(P.thrownW), air: r3(P.y), tilt: Math.round(tilt), headUp: r3(loc(P.top).up), kicked, kneeUp: r3(kk.up / thigh), kneeBack: r3(-kk.f / thigh), trailFootUp: r3(tf.up / thigh) };
  const c = land.s.struck?.contact;
  const onContact = c ? dist(land.s.club, c) : 9;
  const e = { ...p0, hitsAtLand: land.hits, preClubOverCrown: r3(pre.s.club.y - pre.s.crownA.y), clubToCrown: r3(dist(land.s.club, land.s.crownT)), clubToContact: r3(onContact), contactY: c ? r3(c.y) : null, crownY: r3(land.s.crownT.y), handY: r3(land.s.hand.y), clubY: r3(land.s.club.y), club144Y: r3(a144.s.club.y) };
  const pass = {
    g_tilt: tilt >= 45 && tilt <= 65, g_headUp: g.headUp > 0, g_knee: g.kneeUp >= -0.6 && g.kneeUp <= 0.2 && g.kneeBack >= 0.5, g_trail: g.trailFootUp < -0.8,
    e_spacing: p0.landDist >= 1.0, e_cocked: e.preClubOverCrown > 0, e_onHim: e.clubToCrown <= 0.3 || (onContact <= 0.15 && c && c.y >= e.crownY - 0.5), e_follow: e.club144Y < e.clubY,
  };
  results.push({ target, e, g, pass });
  console.log(JSON.stringify({ target, e, g, pass }));
}
fs.writeFileSync(path.join(outDir, `${tag}results.json`), JSON.stringify(results, null, 1));
await browser.close();
kill();
process.exit(0);
