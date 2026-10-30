// Probe: the wheelbarrow crew's hips, knees and feet in the rig's frame (--build first).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4186;
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
  const res = [];
  const vehicles = ["renaissance.da_vinci_tank", "pirate.cannon", "tribal.mammoth"];
  const v = vehicles.map((id, i) => game.spawnUnit(id, 0, { x: -4, z: -6 + i * 6 }));
  for (let i = 0; i < 6; i++) game.spawnUnit("medieval.knight", 1, { x: 2, z: -7 + i * 2.5 });
  for (let i = 0; i < 4; i++) game.spawnUnit("pirate.bomb_thrower", 1, { x: 8, z: -5 + i * 3 });
  game.startBattleImmediate();
  const stats = v.map(() => ({ maxPitch: 0, maxRoll: 0, minY: 9, states: new Set() }));
  for (let t = 0; t < 120; t++) {
    window.advanceTime(100);
    v.forEach((u, i) => {
      const r = u.body.root.rotation, s = stats[i];
      s.maxPitch = Math.max(s.maxPitch, Math.abs(r.x)); s.maxRoll = Math.max(s.maxRoll, Math.abs(r.z));
      s.minY = Math.min(s.minY, u.body.root.position.y); s.states.add(u.physicsState + (u.isDead ? "(dead)" : ""));
    });
  }
  return v.map((u, i) => `${vehicles[i]} maxPitch=${(stats[i].maxPitch*57.3).toFixed(1)}deg maxRoll=${(stats[i].maxRoll*57.3).toFixed(1)}deg minY=${stats[i].minY.toFixed(2)} states=${[...stats[i].states].join(",")}`);
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
