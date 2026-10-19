// Probe: shield board extent vs body; was: where the potion seller's flasks are, tick by tick, through his first throws (no build; serves web/dist).
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(path.resolve("loop/scripts/package.json"));
const { chromium } = require("playwright");
const webDir = path.resolve("web");
const port = 4185;
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
  const a = game.spawnUnit("ancient.shield_bearer", 1, { x: 6, z: 0 });
  window.advanceTime(400);
  const r = (v) => +v.toFixed(3);
  const wp = (n) => { n.computeWorldMatrix(true); const p = n.getAbsolutePosition(); return r(p.y); };
  const b = a.body;
  const root = a.body.root;
  const sh = root.getChildMeshes(false).filter(m=>{let n=m;while(n){if(n.name==='scutumshield'||n.name==='aspisshield'||n.name==='aspis')return true;n=n.parent;}return false;});
  let lo=1e9,hi=-1e9;for(const m of sh){m.computeWorldMatrix(true);const bb=m.getBoundingInfo().boundingBox;lo=Math.min(lo,bb.minimumWorld.y);hi=Math.max(hi,bb.maximumWorld.y);}
  const all=root.getChildMeshes(false);let top=-1e9;for(const m of all){if(sh.includes(m))continue;m.computeWorldMatrix(true);top=Math.max(top,m.getBoundingInfo().boundingBox.maximumWorld.y);}
  return ['meshes='+sh.length+' board lo='+r(lo)+' hi='+r(hi)+' bodyTop='+r(top),
    'eye='+wp(b.leftEye??b.neck)+' neck='+wp(b.neck)+' torso='+wp(b.torso)+' hip='+wp(b.hip)+' knee='+wp(b.leftKnee)+' foot='+wp(b.leftFoot??b.leftKnee)+' lHand='+wp(b.leftHand)+' rHand='+wp(b.rightHand)];
});
console.log(out.join("\n"));
await browser.close();
process.exit(0);
