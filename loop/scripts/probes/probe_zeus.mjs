// Probe: every Zeus mesh (alpha, group, material) + scene layers and post-processes (--build first).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4188;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const unit = (process.argv.find((a) => a.startsWith("--unit=")) || "--unit=ancient.zeus").slice(7);
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
const out = await page.evaluate((unit) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(unit, 1, { x: 6, z: 0 });
  window.advanceTime(200);
  const r = (v) => +(+v).toFixed(3);
  const root = a.body.root;
  const scene = root.getScene();
  const lines = [];
  lines.push(`effectLayers: ${(scene.effectLayers || []).map((l) => `${l.name}/${l.getClassName()} int=${l.intensity}`).join(", ")}`);
  lines.push(`postProcesses: ${(scene.postProcesses || []).map((p) => p.name).join(", ")}; pipelines: ${scene.postProcessRenderPipelineManager ? scene.postProcessRenderPipelineManager.supportedPipelines.map((p) => p._name || p.name).join(",") : "-"}`);
  const ps = scene.particleSystems.filter((p) => { const e = p.emitter; return e && e.getAbsolutePosition && e.getAbsolutePosition().subtract(root.getAbsolutePosition()).length() < 4; });
  lines.push(`particles near: ${ps.map((p) => `${p.name} cap=${p.getCapacity()} active=${p.isStarted()}`).join(", ") || "none"}`);
  for (const m of root.getChildMeshes(false)) {
    const mt = m.material;
    const col = mt && (mt.baseColor || mt.diffuseColor || mt.albedoColor);
    const em = mt && mt.emissiveColor;
    const ext = m.getBoundingInfo().boundingBox.extendSizeWorld;
    const vis = m.isVisible && m.isEnabled();
    if (!vis) continue;
    lines.push(`${m.name} vis=${r(m.visibility)} ext=${[ext.x, ext.y, ext.z].map(r)} grp=${m.renderingGroupId} mat=${mt && mt.name}/${mt && mt.getClassName()} alpha=${mt ? r(mt.alpha) : "-"} blend=${mt ? mt.needAlphaBlending() : "-"} col=${col ? [col.r, col.g, col.b].map(r) : "-"} em=${em ? [em.r, em.g, em.b].map(r) : "-"} unlit=${mt && (mt.disableLighting || mt.unlit)}`);
  }
  return lines;
}, unit);
console.log(out.join("\n"));
await browser.close();
process.exit(0);
