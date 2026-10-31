// Probe: the Reaper's impale (simulationSystem REAPER_IMPALE): reaper and squire world positions, the reaper's facing and head height, the squire's
// height off the ground, at a few times after the battle starts (--build first). The capture's reaper scene: reaper x=+6, squire x=-6.
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4189;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
if (process.argv.includes("--build")) execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: true, stdio: "ignore" });
process.on("exit", () => { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ } });
for (let i = 0; i < 200; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 300)); }
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.game && typeof window.game.runScenarioCheck === "function", undefined, { polling: 100, timeout: 60_000 });
const out = await page.evaluate(() => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit("spooky.reaper", 1, { x: 6, z: 0 });
  const t = game.spawnUnit("medieval.squire", 0, { x: -6, z: 0 });
  game.startBattleImmediate();
  const r = (v) => +v.toFixed(2);
  const wp = (n) => { const c = []; for (let k = n; k; k = k.parent) c.unshift(k); for (const k of c) k.computeWorldMatrix(true); return n.getAbsolutePosition(); };
  const lines = [];
  for (const ms of [800, 200, 50, 50, 100, 150, 300]) {
    window.advanceTime(ms);
    const ah = wp(a.body.headTop), th = wp(t.body.headTop);
    lines.push(`t+${ms}: reaper pos ${[a.position.x, a.position.y, a.position.z].map(r)} rotY ${r(a.body.root.rotation.y)} quat ${!!a.body.root.rotationQuaternion} scale ${r(a.body.root.scaling.y)} head ${r(ah.y)} metricsH ${r(a.body.metrics.overallHeight)} | squire pos ${[t.position.x, t.position.y, t.position.z].map(r)} head ${r(th.y)} dead ${t.isDead} hp ${r(t.currentHealth)}`);
  }
  return lines;
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
