// Probe: the Skeleton Archer draw: state, attack motion, bow weight, arms and the bow stave axis over time (vs a squire 14 m off).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4191;
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
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
const unit = (process.argv.find((a) => a.startsWith("--unit=")) || "--unit=spooky.skeleton_archer").slice(7);
const out = await page.evaluate((unit) => {
  const game = window.game;
  game.skipTitleIntro();
  game.resetBattle();
  window.advanceTime(50);
  const a = game.spawnUnit(unit, 1, { x: 3.6, z: 0 });
  game.spawnUnit("medieval.squire", 0, { x: -3.6, z: 0 });
  game.startBattleImmediate();
  const r = (v) => +(+v).toFixed(2);
  const an = a.animator;
  const bow = a.body.rightHand.getChildren().find((n) => n.name === "bow");
  const lines = [`bow under rightHand: ${!!bow}; left: ${!!a.body.leftHand.getChildren().find((n) => n.name === "bow")}`];
  for (let i = 0; i < 30; i++) {
    window.advanceTime(33);
    let axis = "-";
    if (bow) { bow.computeWorldMatrix(true); const m = bow.getWorldMatrix().m; axis = [m[4], m[5], m[6]].map(r).join(","); }
    const wp=(n)=>{const c=[];for(let k=n;k;k=k.parent)c.unshift(k);for(const k of c)k.computeWorldMatrix(true);return n.getAbsolutePosition();}; const rm=a.body.root.getWorldMatrix().m; const P=(n)=>{const p=wp(n);return [p.x-a.position.x,p.y,p.z-a.position.z].map(r).join(",")}; if (i%5==4) lines.push(`  fwd ${[rm[8],rm[10]].map(r)} pos ${r(a.position.x)} rHand ${P(a.body.rightHand)} lHand ${P(a.body.leftHand)} head ${P(a.body.neck)} rSh ${P(a.body.rightShoulder)}`);
    lines.push(`${(i + 1) * 33}ms st ${an._state} mot ${an._attackMotion} prog ${r(an._attackTimer / (an._attackDuration || 1))} up ${r(an._bowUp)} limp ${r(an._limp)} rSh ${[a.body.rightShoulder.rotation.x, a.body.rightShoulder.rotation.z].map(r)} bowY ${axis}`);
  }
  document.body.classList.add("capture-mode");
  const p = a.body.root.getAbsolutePosition();
  game.frameCamera({ x: p.x, y: p.y + 1, z: p.z }, 4, a.body.root.rotation.y - Math.PI / 2 + (+(window.__yaw || 0)), Math.PI / 2 - 0.15);
  return lines;
}, unit);
await page.evaluate(() => window.game.renderWhenReady());
await page.screenshot({ path: "output/loop/probe_bowdraw.png" });
console.log(out.join("\n"));
await browser.close();
process.exit(0);
