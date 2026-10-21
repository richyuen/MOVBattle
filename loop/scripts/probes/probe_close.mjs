// Probe: one close-up PNG of a unit's part, UI hidden (--build after a source change).
//   node loop/scripts/probes/probe_close.mjs --unit=viking.brawler --aim=head --dist=1.4 --yaw=0 --out=output/loop/close.png
// aim: head | torso | root | y:<root units>. dist in metres, yaw in radians off the unit's front, drop in radians below level.
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4196;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3);
const unit = arg("unit", "viking.brawler"), aim = arg("aim", "head"), out = arg("out", "output/loop/close.png");
const dist = +arg("dist", "1.6"), yaw = +arg("yaw", "0"), drop = +arg("drop", "0.15"), team = +arg("team", "1");
if (process.argv.includes("--build")) execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: true, stdio: "ignore" });
process.on("exit", () => { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ } });
for (let i = 0; i < 200; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 300)); }
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 640, height: 640 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.game && typeof window.game.runScenarioCheck === "function", undefined, { polling: 100, timeout: 60_000 });
const info = await page.evaluate(([unit, aim, dist, yaw, drop, team]) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  document.body.classList.add("capture-mode");
  window.advanceTime(50);
  const a = game.spawnUnit(unit, team, { x: 8, z: 0 });
  window.advanceTime(300);
  if (!a) return "spawn failed";
  const root = a.body ? a.body.root : a.root;
  const p = root.getAbsolutePosition().clone();
  const h = aim === "head" ? a.body.headMesh.getAbsolutePosition().y - p.y : aim === "torso" ? a.body.torso.getAbsolutePosition().y - p.y : aim === "root" ? 0.5 : +aim.slice(2);
  const alpha = root.rotation.y - Math.PI / 2 + yaw;
  game.frameCamera({ x: p.x, y: p.y + h, z: p.z }, dist, alpha, Math.PI / 2 - drop);
  return `aim y=${h.toFixed(2)} alpha=${alpha.toFixed(2)} pos=${p.x.toFixed(2)},${p.z.toFixed(2)}`;
}, [unit, aim, dist, yaw, drop, team]);
console.log(info);
await page.evaluate(() => window.game.renderWhenReady());
await page.screenshot({ path: out });
await browser.close();
process.exit(0);
