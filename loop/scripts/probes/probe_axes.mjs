// Probe: each mesh matching --pat= (--unit=, --frame=root|torso, --build first): its parent, origin and local x/y/z axes in the frame, and its local bbox.
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
    const wm = m.getWorldMatrix().multiply(inv);
    const o = V.TransformCoordinates(new V(0, 0, 0), wm);
    const ax = ["x", "y", "z"].map((k, i) => { const u = V.TransformNormal(new V(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0), wm); return `${k}->(${r(u.x)},${r(u.y)},${r(u.z)})`; });
    const bb = m.getBoundingInfo().boundingBox;
    lines.push(`${m.name} parent=${m.parent && m.parent.name} origin (${r(o.x)},${r(o.y)},${r(o.z)}) ${ax.join(" ")} localbox ${[bb.minimum.x, bb.minimum.y, bb.minimum.z].map(r)}..${[bb.maximum.x, bb.maximum.y, bb.maximum.z].map(r)}`);
  }
  return lines;
}, [unit, pat, frame, ylo, yhi]);
console.log(out.join("\n"));
await browser.close();
process.exit(0);
