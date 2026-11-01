// Probe: the wheelbarrow crew's hips, knees and feet in the rig's frame (--build first).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4187;
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
// Probe (462): does a bearer's aura reach the ally beside him? --unit (default legacy.flag_bearer). Prints the ally's aura fields over 1 s.
const unit = (process.argv.find((a) => a.startsWith("--unit=")) || "--unit=legacy.flag_bearer").slice(7);
const out = await page.evaluate((unit) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(unit, 1, { x: 4.8, z: 0 });
  game.spawnUnit("medieval.squire", 0, { x: -10, z: 0 });
  const ally = game.spawnUnit("medieval.squire", 1, { x: 6.8, z: 1.2 });
  ally.applyDamage(ally.maxHealth * 0.6, ally.position.scale(0));
  const lines = [`bearer team=${a.team} ally team=${ally.team} anchored=${ally._isAnchoredActor} H=${a.body.metrics.overallHeight} rootScale=${a.body.root.scaling.x} units=${window.game.simulation?._units?.length}`];
  game.startBattleImmediate(); game.clearAbilityLog();
  for (let k = 0; k < 6; k++) {
    window.advanceTime(200);
    const d = Math.hypot(a.position.x - ally.position.x, a.position.z - ally.position.z);
    const ring = ally._auraRing;
    lines.push(`t${k} d=${d.toFixed(2)} kind=${ally._auraKind} until=${ally._auraUntil?.toFixed?.(2)} now=${game.getWorldTime().toFixed(2)} ring=${!!ring} enabled=${ring?.isEnabled()} mat=${ring?.material?.name} log=${JSON.stringify((game.getAbilityLog?.() ?? []).slice(-1))}`);
  }
  return lines;
}, unit);
console.log(out.join("\n"));
await browser.close();
process.exit(0);
