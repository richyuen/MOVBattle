// Map picker thumbnails: every sandbox map (the default Tribal Hills and the 29 TABS maps) rendered empty from a high oblique fitted to each map (window.game.frameMapThumbnail),
// written as small JPEGs to web/public/maps/thumbs/<id>.jpg (the map id with its dot as an underscore: map.farmer_snow -> map_farmer_snow.jpg).
// The maps keep changing under the loop, so re-run this after map work to refresh the picker:
//   node loop/scripts/map-thumbs.mjs [--items map.a,map.b] [--port 4183]
// Same boot as capture-world.mjs: build, vite preview, headless Chrome on swiftshader, time only through window.advanceTime.
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const webDir = path.join(root, "web");
const outDir = path.join(webDir, "public", "maps", "thumbs");
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};
const port = Number(opt("--port", "4183"));
const only = opt("--items", "").split(",").map((s) => s.trim()).filter(Boolean);
const baseUrl = `http://127.0.0.1:${port}/MOVBattle/`;
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const log = (msg) => process.stdout.write(`[map-thumbs] ${msg}\n`);

let server = null;
function killServer() {
  if (!server) return;
  const pid = server.pid;
  server = null;
  try { execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" }); } catch { /* gone */ }
}
process.on("exit", killServer);

async function startServer() {
  server = spawn(process.execPath, [path.join(webDir, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: webDir, shell: false, stdio: ["ignore", "pipe", "pipe"] });
  server.stdout.on("data", () => {});
  server.stderr.on("data", (d) => process.stderr.write(`[vite] ${d}`));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try { if ((await fetch(baseUrl)).ok) return; } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`vite preview did not answer on ${baseUrl}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  log("building web/");
  execSync("npm run build", { cwd: webDir, stdio: "inherit", shell: true });
  await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(chromePath) ? chromePath : undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 640, height: 400 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.addInitScript(() => {
    window.requestAnimationFrame = () => 1;
    window.cancelAnimationFrame = () => {};
    let s = 0x4d4f5642;
    Math.random = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  let written = 0;
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.game && typeof window.game.loadMapForCapture === "function", undefined, { polling: 100, timeout: 60_000 });
    const ids = await page.evaluate(() => {
      window.game.skipTitleIntro();
      return window.game.listSandboxMaps().map((m) => m.id);
    });
    for (const id of only.length ? ids.filter((i) => only.includes(i)) : ids) {
      await page.evaluate((mapId) => {
        window.game.loadMapForCapture(mapId);
        document.body.classList.add("capture-mode");
        window.advanceTime(50);
      }, id);
      const framed = await page.evaluate(() => window.game.frameMapThumbnail());
      const state = await page.evaluate(() => document.body.classList.add("capture-mode") || window.game.renderWhenReady());
      if (!state?.ready) log(`${id}: scene not ready (${state?.unready?.join(", ")}), shot may miss`);
      await page.screenshot({ path: path.join(outDir, `${id.replace(".", "_")}.jpg`), type: "jpeg", quality: 78 });
      written++;
      log(`${id} radius ${framed.radius.toFixed(0)}`);
    }
  } finally {
    await browser.close();
    killServer();
  }
  log(`${written} thumbnails -> ${path.relative(root, outDir)}${errors.length ? `, ${errors.length} page errors: ${errors.slice(0, 3).join(" | ")}` : ""}`);
  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  killServer();
  process.exit(1);
});
