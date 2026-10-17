// Debug aid: node loop/scripts/inspect-prop.mjs <unitId> [--no-build]
// Serves web/dist with vite preview, spawns the unit alone, and prints every mesh under both hands (name, enabled, visible, world extent).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(here, "..", "..", "web");
const id = process.argv[2];
const port = 4183;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
if (!process.argv.includes("--no-build")) execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: true, stdio: "ignore" });
process.on("exit", () => { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ } });
for (let i = 0; i < 200; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* wait */ } await new Promise((r) => setTimeout(r, 300)); }
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.addInitScript(() => { window.requestAnimationFrame = () => 1; window.cancelAnimationFrame = () => {}; });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.game && typeof window.game.runScenarioCheck === "function", undefined, { polling: 100, timeout: 60_000 });
const out = await page.evaluate((id) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const u = game.spawnUnit(id, 1, { x: 0, z: 0 });
  window.advanceTime(50);
  if (!u) return { error: "spawn failed" };
  const rows = [];
  const r = (v) => +v.toFixed(3);
  for (const hand of [u.body.rightHand, u.body.leftHand]) {
    for (const n of hand.getDescendants(false)) {
      const m = n;
      let ext = null;
      if (typeof m.getBoundingInfo === "function") {
        m.computeWorldMatrix(true);
        const b = m.getBoundingInfo().boundingBox;
        ext = [r(b.extendSizeWorld.x * 2), r(b.extendSizeWorld.y * 2), r(b.extendSizeWorld.z * 2)];
      }
      rows.push({ hand: hand.name, name: m.name, parent: m.parent?.name, enabled: m.isEnabled(), visible: m.isVisible, ext, scaling: [r(m.scaling.x), r(m.scaling.y), r(m.scaling.z)], mat: m.material?.baseColor ? [r(m.material.baseColor.r), r(m.material.baseColor.g), r(m.material.baseColor.b)] : null });
    }
  }
  const h = u.body.metrics;
  return { height: r(h.overallHeight), rows };
}, id);
console.log(JSON.stringify(out, null, 1));
for (const [k, yaw] of [["front", 0], ["side", Math.PI / 2]]) {
  await page.evaluate(({ yaw }) => {
    window.game.frameCamera({ x: 0, y: 1.0, z: 0 }, 3.2, yaw, Math.PI / 2.2);
    return window.game.renderWhenReady();
  }, { yaw });
  await page.screenshot({ path: path.resolve(here, "..", "..", "output", "loop", `inspect_${id}_${k}.png`) });
}
await browser.close();
process.exit(0);
