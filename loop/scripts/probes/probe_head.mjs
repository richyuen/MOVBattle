// Probe: the wheelbarrow crew's hips, knees and feet in the rig's frame (--build first).
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
  const a = game.spawnUnit("ancient.sarissa", 1, { x: 6, z: 0 });
  window.advanceTime(200);
  const r = (v) => +v.toFixed(3);
  const root = a.body.root;
  root.computeWorldMatrix(true);
  const inv = root.getWorldMatrix().clone().invert();
  const BV = root.position.constructor;
  const rp = (n) => { n.computeWorldMatrix(true); const p = BV.TransformCoordinates(n.getAbsolutePosition(), inv); return `[${r(p.x)},${r(p.y)},${r(p.z)}]`; };
  const lines = [];
  const top = a.body.headTop;
  top.computeWorldMatrix(true);
  const tinv = top.getWorldMatrix().clone().invert();
  // every vertex of a mesh in the head-top frame: its extents
  const ext = (m) => {
    m.computeWorldMatrix(true);
    const wm = m.getWorldMatrix(); const v = m.getVerticesData("position"); if (!v) return "none";
    let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    for (let i = 0; i < v.length; i += 3) { const p = BV.TransformCoordinates(BV.TransformCoordinates(new BV(v[i], v[i + 1], v[i + 2]), wm), tinv); [p.x, p.y, p.z].forEach((c, k) => { lo[k] = Math.min(lo[k], c); hi[k] = Math.max(hi[k], c); }); }
    return `x ${r(lo[0])}..${r(hi[0])} y ${r(lo[1])}..${r(hi[1])} z ${r(lo[2])}..${r(hi[2])}`;
  };
  lines.push(`headTop scaling=${[top.scaling.x, top.scaling.y, top.scaling.z].map(r)} abs=${[top.absoluteScaling.x].map(r)}`);
  lines.push(`headMesh: ${ext(a.body.headMesh)}`);
  for (const m of top.getChildMeshes(false)) lines.push(`${m.name}: ${ext(m)}`);
  for (const e of [a.body.leftEye, a.body.rightEye]) if (e) { const ms = e.getChildMeshes ? [e, ...e.getChildMeshes(false)] : [e]; for (const m of ms) if (m.getVerticesData) lines.push(`eye ${m.name}: ${ext(m)}`); }
  return lines;
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
