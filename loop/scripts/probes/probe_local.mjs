// Probe: the sarissa's kit meshes (belt, dagger, bracers): enabled, visible, world position and size (--build first).
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
const id = process.argv.find((a) => a.startsWith("--unit="))?.slice(7) ?? "ancient.sarissa";
const pat = process.argv.find((a) => a.startsWith("--pat="))?.slice(6) ?? "sarissa";
const out = await page.evaluate(([id, pat]) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(id, 1, { x: 0, z: 0 });
  window.advanceTime(100);
  const r = (v) => +v.toFixed(3);
  const re = new RegExp(pat, "i");
  const lines = [];
  for (const m of a.body.root.getChildMeshes(false)) {
    if (!re.test(m.name)) continue;
    m.computeWorldMatrix(true);
    const bb = m.getBoundingInfo().boundingBox;
    lines.push(`${m.name} en=${m.isEnabled()} vis=${m.isVisible} mat=${m.material?.name} min=${[bb.minimumWorld.x, bb.minimumWorld.y, bb.minimumWorld.z].map(r)} max=${[bb.maximumWorld.x, bb.maximumWorld.y, bb.maximumWorld.z].map(r)}`);
  }
  const T = a.body.torso; T.computeWorldMatrix(true); const inv = T.getWorldMatrix().clone().invert(); for (const m of [a.body.torsoMesh, ...a.body.torso.getChildMeshes(true)]) { const loc = m.computeWorldMatrix(true).multiply(inv); const v = m.getVerticesData('position') ?? []; let mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9]; for (let i=0;i<v.length;i+=3){ const M = loc.m; const x=v[i],y=v[i+1],z=v[i+2]; const q=[x*M[0]+y*M[4]+z*M[8]+M[12], x*M[1]+y*M[5]+z*M[9]+M[13], x*M[2]+y*M[6]+z*M[10]+M[14]]; for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],q[k]);mx[k]=Math.max(mx[k],q[k]);} } lines.push('LOCAL '+m.name+' '+mn.map(r)+' .. '+mx.map(r)); }
  const t = a.body.torsoMesh; t.computeWorldMatrix(true);
  const tb = t.getBoundingInfo().boundingBox;
  lines.push(`torso min=${[tb.minimumWorld.x, tb.minimumWorld.y, tb.minimumWorld.z].map(r)} max=${[tb.maximumWorld.x, tb.maximumWorld.y, tb.maximumWorld.z].map(r)}`);
  for (const m of a.body.root.getChildMeshes(false)) {
    if (!/skirt|tunic|cape/i.test(m.name)) continue;
    const b = m.getBoundingInfo().boundingBox;
    lines.push(`${m.name} min=${[b.minimumWorld.x, b.minimumWorld.y, b.minimumWorld.z].map(r)} max=${[b.maximumWorld.x, b.maximumWorld.y, b.maximumWorld.z].map(r)}`);
  }
  return lines;
}, [id, pat]);
console.log(out.join("\n"));
await browser.close();
process.exit(0);
