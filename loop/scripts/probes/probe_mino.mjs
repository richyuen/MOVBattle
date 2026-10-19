// Probe: where the potion seller's flasks are, tick by tick, through his first throws (no build; serves web/dist).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4185;
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
  const a = game.spawnUnit("ancient.minotaur", 1, { x: 6, z: 0 });
  window.advanceTime(200);
  const r = (v) => +v.toFixed(2);
  const wp = (n) => { n.computeWorldMatrix(true); const p = n.getAbsolutePosition(); return [r(p.x), r(p.y), r(p.z)]; };
  const an = a.animator;
  const b = a.body;
  return [`bullFists=${an.bullFists} state=${an._state} walk=${an.walkStyle} limp=${an._limp} charge=${an._charge}`,
    `hip=${wp(b.hip)} rS=${wp(b.rightShoulder)} lS=${wp(b.leftShoulder)} rH=${wp(b.rightHand)} lH=${wp(b.leftHand)}`,
    `rSrot=${[b.rightShoulder.rotation.x, b.rightShoulder.rotation.y, b.rightShoulder.rotation.z].map(r)} rE=${r(b.rightElbow.rotation.x)}`];
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
