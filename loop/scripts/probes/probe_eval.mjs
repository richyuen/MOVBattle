// Probe: spawn a unit and run a JS expression file against it in the page (u = the unit), printing the JSON result (--build after a source change).
//   node loop/scripts/probes/probe_eval.mjs --unit=evil.void_cultist --expr=path/to/expr.js
// The expression file is a function body that sees `u` (the RuntimeUnit), `game` and `scene`, and returns a JSON-able value.
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4197;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).slice(k.length + 3);
const unit = arg("unit", "evil.void_cultist"), body = fs.readFileSync(arg("expr", ""), "utf8"), team = +arg("team", "1"), wait = +arg("wait", "300");
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
const out = await page.evaluate(([unit, body, team, wait]) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const u = game.spawnUnit(unit, team, { x: 6, z: 0 });
  window.advanceTime(wait);
  if (!u) return "spawn failed";
  return new Function("u", "game", "scene", body)(u, game, u.body.root.getScene());
}, [unit, body, team, wait]);
console.log(JSON.stringify(out, null, 1));
await browser.close();
process.exit(0);
