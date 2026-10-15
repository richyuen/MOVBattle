// Download wiki files by title into a folder: node fetch-wiki.mjs <outDir> <File:Title> [<File:Title> ...]
// Resolves URLs through the MediaWiki API (batches of 50) and saves each as <sanitised title>.
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (reference-fetch for MOVBattle)";
const API = "https://totally-accurate-battle-simulator.fandom.com/api.php";
const [outDir, ...titles] = process.argv.slice(2);
if (!outDir || titles.length === 0) throw new Error("usage: fetch-wiki.mjs <outDir> <File:Title>...");
fs.mkdirSync(outDir, { recursive: true });

let saved = 0;
for (let i = 0; i < titles.length; i += 50) {
  const batch = titles.slice(i, i + 50);
  const url = `${API}?action=query&titles=${encodeURIComponent(batch.join("|"))}&prop=imageinfo&iiprop=url|size&format=json`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  for (const page of Object.values(json.query.pages)) {
    const info = page.imageinfo?.[0];
    if (!info) {
      console.log(`missing ${page.title}`);
      continue;
    }
    const name = page.title.replace(/^File:/, "").replace(/[^A-Za-z0-9._-]+/g, "_");
    const file = path.join(outDir, name);
    const img = await fetch(info.url, { headers: { "User-Agent": UA } });
    if (!img.ok) {
      console.log(`failed ${page.title} ${img.status}`);
      continue;
    }
    fs.writeFileSync(file, Buffer.from(await img.arrayBuffer()));
    saved++;
    console.log(`${name} ${info.width}x${info.height}`);
  }
}
console.log(`saved ${saved} of ${titles.length} to ${outDir}`);
