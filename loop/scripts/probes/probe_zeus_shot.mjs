// Probe: Zeus close-up screenshots with SSAO / bloom toggled (--build first). Writes output/loop/zeus_*.png
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4189;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const unit = (process.argv.find((a) => a.startsWith("--unit=")) || "--unit=ancient.zeus").slice(7);
const num = (k, d) => +((process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3));
const dist = num("dist", 3.2), yaw = num("yaw", 0), aim = (process.argv.find((a) => a.startsWith("--aim=")) || "--aim=torso").slice(6);
if (process.argv.includes("--build")) execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: true, stdio: "ignore" });
process.on("exit", () => { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ } });
for (let i = 0; i < 200; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 300)); }
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 600, height: 600 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.game && typeof window.game.runScenarioCheck === "function", undefined, { polling: 100, timeout: 60_000 });
await page.evaluate(([unit, dist, yaw, aim]) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(unit, 1, { x: 0, z: 0 });
  window.advanceTime(300);
  const root = a.body.root;
  const scene = root.getScene();
  const cam = scene.activeCamera;
  const node = aim === "head" ? a.body.headMesh : aim === "root" ? root : a.body.torso;
  const p = node.getAbsolutePosition().clone();
  const V = root.position.constructor;
  const f0 = root.getDirection(new V(0, 0, 1));
  const fwd = new V(f0.x * Math.cos(yaw) - f0.z * Math.sin(yaw), 0, f0.x * Math.sin(yaw) + f0.z * Math.cos(yaw));
  cam.lowerRadiusLimit = 0.05; cam.minZ = 0.05;
  cam.setTarget(p.clone());
  cam.setPosition(p.add(fwd.scale(dist)).add(new V(0, dist * 0.12, 0)));
  window.__z = { scene };
  window.advanceTime(16);
}, [unit, dist, yaw, aim]);
const set = async (ssao, bloom) => page.evaluate(([ssao, bloom]) => {
  const scene = window.__z.scene;
  for (const pl of scene.postProcessRenderPipelineManager.supportedPipelines) {
    if (pl._name === "ssao" || pl.name === "ssao") pl.totalStrength = ssao;
    if ((pl._name || pl.name) === "default") pl.bloomEnabled = bloom;
  }
  window.advanceTime(16);
}, [ssao, bloom]);
for (const [tag, s, b] of [["warm", 0.8, true], ["nossao", 0, true], ["base", 0.8, true], ["base2", 0.8, true]]) {
  await set(s, b);
  await page.screenshot({ path: `output/loop/zeus_${tag}.png` });
}
await browser.close();
process.exit(0);
