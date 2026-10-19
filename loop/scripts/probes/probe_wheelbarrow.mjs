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
  const a = game.spawnUnit("farmer.wheelbarrow", 1, { x: 6, z: 0 });
  window.advanceTime(200);
  const r = (v) => +v.toFixed(3);
  const root = a.body.root;
  root.computeWorldMatrix(true);
  const inv = root.getWorldMatrix().clone().invert();
  const BV = root.position.constructor;
  const rp = (n) => { n.computeWorldMatrix(true); const p = BV.TransformCoordinates(n.getAbsolutePosition(), inv); return `[${r(p.x)},${r(p.y)},${r(p.z)}]`; };
  const crew = root.metadata.wheelbarrowCrew;
  const lines = [];
  for (const k of ["farmer", "thrower"]) {
    const m = crew[k];
    lines.push(`${k} hipL=${rp(m.leftHip)} hipR=${rp(m.rightHip)} kneeL=${rp(m.leftKnee)} kneeR=${rp(m.rightKnee)}`);
  }
  return lines;
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
