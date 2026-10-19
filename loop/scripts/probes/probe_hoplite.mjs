// Probe: the wheelbarrow crew's hips, knees and feet in the rig's frame (--build first).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4188;
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
  const a = game.spawnUnit("ancient.hoplite", 1, { x: 2.5, z: 0 });
  game.spawnUnit("medieval.squire", 0, { x: -2.5, z: 0 });
  window.advanceTime(50);
  game.startBattleImmediate();
  const r = (v) => +v.toFixed(2);
  const lines = [];
  const an = a.animator;
  for (let t = 0; t < 1100; t += 33) {
    window.advanceTime(33);
    const h = a.body.rightHand; h.computeWorldMatrix(true); const p = h.getAbsolutePosition();
    lines.push(`hits=${(game.getHitLog?.() ?? []).length} t=${t + 33} state=${an._state} motion=${an._attackMotion} timer=${r(an._attackTimer ?? -1)}/${r(an._attackDuration ?? -1)} dory=${an._dory ? "yes" : an._dory} q=${an._dory?.shaft?.rotationQuaternion ? "set" : "null"} hand=${[p.x, p.y, p.z].map(r)}`);
  }
  return lines;
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
