// Probe: root-frame bounding boxes of a unit's meshes matching --pat= (--unit=, --build first). x: body x, y up, z forward (root frame).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4190;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3);
const unit = arg("unit", "ancient.minotaur"), pat = arg("pat", "."), frame = arg("frame", "root"), ylo = +arg("ylo", "-99"), yhi = +arg("yhi", "99");
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
const out = await page.evaluate(([unit, pat, frame, ylo, yhi]) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(unit, 1, { x: 6, z: 0 });
  window.advanceTime(200);
  const r = (v) => +(+v).toFixed(3);
  const root = a.body ? a.body.root : a.root;
  const ref = frame === "torso" ? a.body.torso : root;
  ref.computeWorldMatrix(true);
  const inv = ref.getWorldMatrix().clone().invert();
  const V = root.position.constructor;
  const lines = [];
  for (const m of root.getChildMeshes(false)) {
    if (!new RegExp(pat, "i").test(m.name)) continue;
    m.computeWorldMatrix(true);
    const raw = m.getVerticesData("position") || [];
    const wm = m.getWorldMatrix();
    const pts = [];
    for (let k = 0; k < raw.length; k += 3) pts.push(V.TransformCoordinates(V.TransformCoordinates(new V(raw[k], raw[k + 1], raw[k + 2]), wm), inv));
    const kept = pts.filter((p) => p.y >= ylo && p.y <= yhi);
    if (!kept.length) continue;
    pts.length = 0; pts.push(...kept);
    const lo = [0, 1, 2].map((k) => Math.min(...pts.map((p) => [p.x, p.y, p.z][k])));
    const hi = [0, 1, 2].map((k) => Math.max(...pts.map((p) => [p.x, p.y, p.z][k])));
    const c = m.material && (m.material.baseColor || m.material.diffuseColor);
    lines.push(`${m.name} vis=${m.isVisible && m.isEnabled()} x ${r(lo[0])}..${r(hi[0])} y ${r(lo[1])}..${r(hi[1])} z ${r(lo[2])}..${r(hi[2])} col=${c ? [c.r, c.g, c.b].map(r) : "-"}`);
  }
  return lines;
}, [unit, pat, frame, ylo, yhi]);
console.log(out.join("\n"));
await browser.close();
process.exit(0);
