// Loop v10 reference cards for the maps-and-stages phase, from the TABS wiki (tabs.wiki.gg):
//   loop/cards/stages/<stageId>.md   one card per curated campaign level (map, budget, enemy army with counts, survey, player units)
//   loop/cards/maps/<mapId>.md       one card per TABS map a curated level is fought on, plus the sandbox maps
//   loop/cards/_stages.json          machine data for stages.mjs (the script-judged criterion d)
//   reference/stages/<stageId>.png   the level's wiki image (its enemy army at the placement view)
//   reference/maps/wiki/<mapId>.png  the map page's wiki image(s): <mapId>.png, <mapId>.2.png ...
//   node loop/scripts/fetch-stage-cards.mjs [--refresh] [--no-images] [--per <n>]
// Curation: each of the 12 TABS campaigns keeps PER levels (default 6), evenly spaced over its wiki level list with its first and last
// level always in. The pick is deterministic, so a rerun gives the same stage ids. Raw API responses are cached under output/wiki/raw/
// (untrusted text: parsed with JSON.parse and regex only).
import fs from "node:fs";
import path from "node:path";
import { loadRoster, root } from "./lib/roster.mjs";
import { extractTemplates, targets, clean, sections, prose, fileTitles, num } from "./lib/wikitext.mjs";

const API = "https://tabs.wiki.gg/api.php";
const UA = "Mozilla/5.0 (reference-fetch for MOVBattle)";
const CARD_CAP = 3200;
const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const noImages = args.includes("--no-images");
const perArg = args.indexOf("--per");
const PER = perArg >= 0 ? Number(args[perArg + 1]) : 6;
const repick = args.includes("--repick");
const frozenFile = path.join(root, "loop", "cards", "_stages.json");
const frozen = fs.existsSync(frozenFile) ? JSON.parse(fs.readFileSync(frozenFile, "utf8")) : null;

const rawDir = path.join(root, "output", "wiki", "raw");
const stageCards = path.join(root, "loop", "cards", "stages");
const mapCards = path.join(root, "loop", "cards", "maps");
const stageImgs = path.join(root, "reference", "stages");
const mapImgs = path.join(root, "reference", "maps", "wiki");
for (const d of [rawDir, stageCards, mapCards, stageImgs, mapImgs]) fs.mkdirSync(d, { recursive: true });

// Our CampaignId -> the campaign's wiki page, in TABS menu order
export const CAMPAIGNS = [
  ["introduction", "The Introduction"],
  ["adventure", "The Adventure"],
  ["challenge", "The Challenge"],
  ["dynasty", "Dynasty (Campaign)"],
  ["renaissance", "Renaissance (Campaign)"],
  ["pirate", "Pirate (Campaign)"],
  ["spooky", "Spooky (Campaign)"],
  ["simulation", "Simulation (Campaign)"],
  ["wild_west", "Wild West (Campaign)"],
  ["legacy", "Legacy (Campaign)"],
  ["fantasy_good", "Fantasy Good (Campaign)"],
  ["fantasy_evil", "Fantasy Evil (Campaign)"],
];
// Themed maps covered even when no curated level is fought on them: the sandboxes and the maps with a placement view in reference/maps/.
// One-off Simulation maps (Arena, Maze, Port ...) are in only when a curated stage is fought there.
const EXTRA_MAPS = ["Tribal Sandbox", "Ancient Sandbox", "Viking Sandbox", "Farmer Snow", "Fantasy Good (Map)", "Fantasy Evil (Map)", "Simulation (Map)"];
// Map id -> its placement-view image in reference/maps/ (the TABS level-select view, 512px), the capture's framing target
const VIEWS = {
  tribal_1: "autumn_tribal_1", tribal_2: "autumn_tribal_2", tribal_sandbox: "autumn_tribal_sandbox", farmer_1: "farm_1", farmer_2: "farm_2",
  farmer_snow: "farm_snow", medieval_1: "meadow_medieval_1", medieval_2: "meadow_medieval_2", ancient_1: "greek_ancient_1",
  ancient_2: "greek_ancient_2", ancient_sandbox: "greek_ancient_sandbox", viking: "winter_viking", viking_sandbox: "winter_viking_sandbox",
  dynasty: "dynasty", renaissance: "renaissance_town", pirate: "pirate_beach", spooky_1: "spooky_1", spooky_2: "spooky_2",
  wild_west: "western", legacy: "legacy", fantasy_good: "heaven_good", fantasy_evil: "void_evil", simulation: "simulation",
};

const safe = (title) => title.replace(/[^a-z0-9]+/gi, "_");
const slug = (title) => title.toLowerCase().replace(/\((level|campaign|map|simulation)\)/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPages(titles) {
  const out = new Map();
  const todo = [];
  for (const t of titles) {
    const file = path.join(rawDir, "page_" + safe(t) + ".json");
    if (!refresh && fs.existsSync(file)) {
      const j = JSON.parse(fs.readFileSync(file, "utf8"));
      out.set(t, j);
    } else todo.push(t);
  }
  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50);
    const url = `${API}?action=query&prop=revisions&rvprop=content&rvslots=main&redirects=1&formatversion=2&format=json&titles=${encodeURIComponent(batch.join("|"))}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`wiki ${res.status} for ${batch[0]}...`);
    const json = await res.json();
    const byTitle = new Map();
    for (const p of json.query?.pages ?? []) byTitle.set(p.title, p.missing ? null : p.revisions?.[0]?.slots?.main?.content ?? null);
    const alias = new Map();
    for (const n of json.query?.normalized ?? []) alias.set(n.from, n.to);
    for (const r of json.query?.redirects ?? []) alias.set(r.from, r.to);
    for (const t of batch) {
      let k = t;
      for (let hop = 0; hop < 4 && alias.has(k); hop++) k = alias.get(k);
      const j = { title: t, resolved: k, text: byTitle.has(k) ? byTitle.get(k) : null };
      out.set(t, j);
      fs.writeFileSync(path.join(rawDir, "page_" + safe(t) + ".json"), JSON.stringify(j));
    }
    process.stdout.write(`fetched ${Math.min(i + 50, todo.length)}/${todo.length} pages\n`);
    if (i + 50 < todo.length) await sleep(250);
  }
  return out;
}

/** File title -> saved path, through imageinfo (batched); skips files already on disk unless --refresh. */
async function fetchImages(jobs) {
  const todo = jobs.filter((j) => refresh || !fs.existsSync(j.out));
  let saved = 0;
  const missing = [];
  for (let i = 0; i < todo.length; i += 50) {
    const batch = todo.slice(i, i + 50);
    const titles = batch.map((j) => "File:" + j.file);
    const url = `${API}?action=query&prop=imageinfo&iiprop=url&redirects=1&formatversion=2&format=json&titles=${encodeURIComponent(titles.join("|"))}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const json = await res.json();
    const alias = new Map();
    for (const n of json.query?.normalized ?? []) alias.set(n.from, n.to);
    for (const r of json.query?.redirects ?? []) alias.set(r.from, r.to);
    const urls = new Map();
    for (const p of json.query?.pages ?? []) if (p.imageinfo?.[0]?.url) urls.set(p.title, p.imageinfo[0].url);
    for (const j of batch) {
      let k = "File:" + j.file;
      for (let hop = 0; hop < 4 && alias.has(k); hop++) k = alias.get(k);
      const u = urls.get(k);
      if (!u) { missing.push(j.file); continue; }
      const img = await fetch(u, { headers: { "User-Agent": UA } });
      if (!img.ok) { missing.push(`${j.file} (${img.status})`); continue; }
      fs.writeFileSync(j.out, Buffer.from(await img.arrayBuffer()));
      saved++;
      await sleep(80);
    }
  }
  return { saved, missing };
}

// Wiki unit name -> roster id (display names, the card fetcher's page exceptions, plurals)
const roster = loadRoster();
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const NAME_EXCEPTIONS = { potionseller: "farmer.potion_seller", theking: "medieval.king", king: "medieval.king", clams: "secret.clams", theteacher: "secret.the_teacher", ballnchain: "secret.ball_n_chain", sarrisa: "ancient.sarissa", cacti: "wild_west.cactus", valyrie: "viking.valkyrie", haybaler: "farmer.hay_baler" };
const byName = new Map(roster.map((u) => [norm(u.name), u.id]));
for (const [k, v] of Object.entries(NAME_EXCEPTIONS)) byName.set(k, v);
function unitId(name) {
  const n = norm(name);
  for (const cand of [n, n.replace(/ies$/, "y"), n.replace(/es$/, ""), n.replace(/s$/, ""), n.replace(/men$/, "man")]) if (byName.has(cand)) return byName.get(cand);
  return null;
}

/** "11 Hay Balers, 4 Potionsellers" (the Survey's Total units line) -> { counts: {id: n}, unknown: [names] } */
function totalUnits(surveyRaw) {
  const m = /Total units'*\s*:?'*\s*(?:<br\s*\/?>)?\s*([\s\S]*?)(?:\n\s*\n|\n==|$)/i.exec(surveyRaw ?? "");
  const counts = {};
  const unknown = [];
  if (!m || !/\d/.test(clean(m[1]))) return proseCounts(surveyRaw);
  const raw = clean(m[1]).replace(/\n/g, " ");
  for (const part of raw.split(/,|\band\b|;/)) {
    const p = /(\d+)\s*[x×]?\s*([A-Za-z][A-Za-z' .&-]*)/.exec(part.trim());
    if (!p) continue;
    const id = unitId(p[2].trim());
    if (id) counts[id] = (counts[id] ?? 0) + Number(p[1]);
    else unknown.push(p[2].trim());
  }
  return { counts, unknown, raw };
}

// No Total units line: counts written into the Survey prose ("seven [[Clubber]]s, eleven [[Protector]]s", "a [[Chieftain]]")
const WORDS = { a: 1, an: 1, one: 1, single: 1, lone: 1, two: 2, pair: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50 };
function proseCounts(surveyRaw) {
  const counts = {};
  const unknown = [];
  const re = /\b(\d+|[A-Za-z]+(?:-[a-z]+)?)\s+(?:more\s+|other\s+)?\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  let m;
  while ((m = re.exec(surveyRaw ?? ""))) {
    const w = m[1].toLowerCase();
    const n = /^\d+$/.test(w) ? Number(w) : w.includes("-") ? (WORDS[w.split("-")[0]] ?? 0) + (WORDS[w.split("-")[1]] ?? 0) : WORDS[w];
    if (!n) continue;
    const id = unitId(m[2]);
    if (id) counts[id] = (counts[id] ?? 0) + n;
  }
  return { counts, unknown, raw: Object.keys(counts).length ? "(counted from the survey prose)" : "" };
}

const FACTION_WORDS = { tribal: "tribal", farmer: "farmer", medieval: "medieval", ancient: "ancient", viking: "viking", dynasty: "dynasty", renaissance: "renaissance", pirate: "pirate", spooky: "spooky", "wild west": "wild_west", legacy: "legacy", good: "good", evil: "evil", secret: "secret" };
/** available_units raw -> { factions: [...], units: [ids], text } */
function available(raw) {
  const text = clean(raw ?? "").replace(/\n/g, " ");
  const factions = [];
  const units = [];
  for (const t of targets(raw ?? "")) {
    const f = /^(.*?)\s*(?:\(Faction\)|Faction)$/i.exec(t);
    if (f && FACTION_WORDS[f[1].toLowerCase().trim()]) factions.push(FACTION_WORDS[f[1].toLowerCase().trim()]);
    else { const id = unitId(t); if (id) units.push(id); }
  }
  const hd = /\{\{\s*HDIcons?\s*\|([^}]*)\}\}/g;
  let m;
  while ((m = hd.exec(raw ?? ""))) for (const n of m[1].split("|")) { const id = unitId(n.trim()); if (id) units.push(id); }
  return { factions: [...new Set(factions)], units: [...new Set(units)], text };
}

function evenPick(list, n) {
  if (list.length <= n) return list.map((_, i) => i);
  const out = new Set();
  for (let k = 0; k < n; k++) out.add(Math.round((k * (list.length - 1)) / (n - 1)));
  return [...out];
}

// 1. Campaign pages -> ordered level lists
const campaignPages = await fetchPages(CAMPAIGNS.map(([, t]) => t));
const levelLists = new Map();
for (const [cid, title] of CAMPAIGNS) {
  const text = campaignPages.get(title)?.text ?? "";
  const seen = new Set();
  const list = [];
  const re = /\[\[File:([^\]|]+)\|[^\]]*?link=([^\]|]+)\]\]/g;
  let m;
  while ((m = re.exec(text))) {
    const level = m[2].trim();
    if (seen.has(level) || level === title) continue;
    seen.add(level);
    list.push({ level, thumb: m[1].trim() });
  }
  levelLists.set(cid, list);
}

// 2. Every level page (all of them, so the curation can be audited), then the curated pick
const allLevels = [...levelLists.values()].flat().map((l) => l.level);
const levelPages = await fetchPages(allLevels);
const stages = [];
const report = [];
function parseStage(cid, list, p) {
  const box = p.box;
  const sec = sections(p.page.text);
  const tu = totalUnits(sec["Survey"]);
  const enemyTypes = [];
  const hd = /\{\{\s*HDIcons?\s*\|([^}]*)\}\}/g;
  let m;
  while ((m = hd.exec(box.enemy_units ?? ""))) for (const n of m[1].split("|")) { const id = unitId(n.trim()); if (id) enemyTypes.push(id); else if (n.trim()) tu.unknown.push(n.trim()); }
  for (const t of targets(box.enemy_units ?? "")) { const id = unitId(t); if (id) enemyTypes.push(id); }
  // Prose counting also catches riders and drivers ("a Farmer in his wheelbarrow"): keep only the types the infobox names
  if (tu.raw.startsWith("(") && enemyTypes.length) for (const k of Object.keys(tu.counts)) if (!enemyTypes.includes(k)) delete tu.counts[k];
  // A type the infobox names with no count is an undercount: take its number from the survey prose, else the level is not curated
  let uncounted = [...new Set(enemyTypes)].filter((t) => !tu.counts[t]);
  if (uncounted.length) {
    const pc = proseCounts(sec["Survey"]);
    for (const t of uncounted) if (pc.counts[t]) tu.counts[t] = pc.counts[t];
    uncounted = uncounted.filter((t) => !tu.counts[t]);
  }
  const mapTitle = targets(box.map ?? "")[0] ?? clean(box.map);
  return {
    id: `${cid}.${slug(box.title1 ?? p.level)}`,
    campaign: cid,
    order: p.index + 1,
    of: list.length,
    title: clean(box.title1 ?? p.level),
    page: p.page.resolved,
    map: null,
    mapTitle,
    budget: num(box.budget),
    enemyTypes: [...new Set(enemyTypes)],
    enemyCounts: tu.counts,
    enemyTotal: Object.values(tu.counts).reduce((a, b) => a + b, 0),
    unknownUnits: [...new Set(tu.unknown)],
    uncounted,
    totalLine: tu.raw,
    available: available(box.available_units),
    objective: clean(box.objective ?? ""),
    survey: prose(sec["Survey"]?.split(/Total units/i)[0] ?? "", 700),
    image: box.image1 ? clean(box.image1) : null,
    thumb: p.thumb,
  };
}
for (const [cid] of CAMPAIGNS) {
  const list = levelLists.get(cid);
  const parsed = list.map((l, index) => {
    const page = levelPages.get(l.level);
    const text = page?.text ?? "";
    const box = (extractTemplates(text, "Levels")[0] ?? extractTemplates(text, "LevelInfo")[0] ?? extractTemplates(text, "Level")[0])?.params ?? null;
    return { ...l, index, page, box };
  });
  // Curated only from levels the wiki fully describes: a map that exists, a budget, an enemy army with counts
  const described = parsed.filter((p) => p.box && p.box.map && !/TBA/i.test(p.box.map)).map((p) => parseStage(cid, list, p));
  const usable = described.filter((s) => s.budget && s.enemyTotal > 0 && s.uncounted.length === 0 && s.unknownUnits.length === 0);
  report.push(`${cid}: ${list.length} levels, ${described.length} with a level box, ${usable.length} with budget and a fully counted army`);
  // Stage ids are frozen: once _stages.json exists the same wiki pages are kept (a page that lost its data is reported, not replaced);
  // --repick redoes the even spread
  const frozenPages = frozen?.stages.filter((s) => s.campaign === cid).map((s) => s.page);
  if (frozenPages && !repick) {
    for (const pg of frozenPages) {
      const s = described.find((d) => d.page === pg);
      if (s) stages.push(s);
      else report.push(`FROZEN STAGE LOST: ${cid} ${pg} (no longer described on the wiki; kept out of the cards, its game data stands)`);
    }
  } else for (const i of evenPick(usable, PER)) stages.push(usable[i]);
}

// 3. Maps: every map a curated stage is fought on, plus the extras
const askedTitles = [...new Set([...stages.map((s) => s.mapTitle), ...EXTRA_MAPS])];
const mapPages = await fetchPages(askedTitles);
// Redirects (Viking 1 -> Viking (Map)) collapse to one map, keyed by the resolved page
const resolvedOf = (t) => mapPages.get(t)?.resolved ?? t;
for (const st of stages) { st.mapTitle = resolvedOf(st.mapTitle); st.map = slug(st.mapTitle); }
const mapTitles = [...new Set(askedTitles.map(resolvedOf))];
const maps = [];
for (const t of mapTitles) {
  const page = mapPages.get(askedTitles.find((a) => resolvedOf(a) === t));
  const text = page?.text ?? "";
  const sec = sections(text);
  const lead = text.split(/^==/m)[0];
  const box = extractTemplates(text, "Map")[0]?.params ?? extractTemplates(text, "Infobox Map")[0]?.params ?? null;
  // The lead image only: later gallery files are trivia shots, bug reports and concept art
  const files = fileTitles(lead).filter((f) => !/icon|logo/i.test(f)).slice(0, 1);
  if (!files.length) files.push(...fileTitles(text).filter((f) => !/icon|logo/i.test(f)).slice(0, 1));
  if (box?.image) files.unshift(clean(box.image));
  const usedBy = stages.filter((s) => s.mapTitle === t).map((s) => s.id);
  maps.push({
    id: slug(t),
    title: t,
    page: page?.resolved ?? t,
    found: Boolean(text),
    description: prose(lead, 600),
    sections: Object.fromEntries(Object.entries(sec).filter(([k]) => !/gallery|trivia|navbox|levels/i.test(k)).slice(0, 4).map(([k, v]) => [k, prose(v, 500)])),
    images: [...new Set(files)].slice(0, 1),
    view: VIEWS[slug(t)] ? `reference/maps/${VIEWS[slug(t)]}.png` : null,
    usedBy,
  });
}

// 4. Cards
const date = new Date().toISOString().slice(0, 10);
const FACTION_OF = Object.fromEntries(roster.map((u) => [u.id, u.faction]));
function cap(s) { return s.length <= CARD_CAP ? s : s.slice(0, CARD_CAP - 20).replace(/\s+\S*$/, "") + "\n(card cut at cap)\n"; }
for (const s of stages) {
  const army = Object.entries(s.enemyCounts).map(([id, n]) => `${n} ${id}`).join(", ") || "(no Total units line)";
  const card = [
    `# ${s.id} — ${s.title} (${s.campaign} level ${s.order} of ${s.of})`,
    `Source: https://tabs.wiki.gg/wiki/${encodeURIComponent(s.page.replace(/ /g, "_"))} (${date}). Image: reference/stages/${s.id}.png. Map: loop/cards/maps/${s.map}.md`,
    "## Level",
    `Map ${s.mapTitle} (${s.map}) | Budget ${s.budget ?? "?"} | Objective ${s.objective || "defeat the enemy"}`,
    `Enemy army: ${army}${s.enemyTotal ? ` (total ${s.enemyTotal})` : ""}`,
    `Enemy unit types: ${s.enemyTypes.join(", ") || "?"}${s.unknownUnits.length ? ` | unmatched names: ${s.unknownUnits.join(", ")}` : ""}`,
    `Player units: ${s.available.text || "?"}${s.available.factions.length ? ` (factions ${s.available.factions.join(", ")})` : ""}${s.available.units.length ? ` (units ${s.available.units.join(", ")})` : ""}`,
    "## Survey (enemy formation)",
    s.survey || "(none on the wiki)",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(stageCards, `${s.id}.md`), cap(card));
}
for (const mp of maps) {
  const card = [
    `# map.${mp.id} — ${mp.title}`,
    `Source: https://tabs.wiki.gg/wiki/${encodeURIComponent(mp.page.replace(/ /g, "_"))} (${date}). Wiki shot: ${mp.images.length ? `reference/maps/wiki/${mp.id}.png` : "none"}. Placement view: ${mp.view ?? "none (judge from the wiki shot and the stage images)"}`,
    `Stages fought here: ${mp.usedBy.join(", ") || "none (sandbox)"}`,
    "## Description",
    mp.description || "(no lead text on the wiki)",
    ...Object.entries(mp.sections).flatMap(([k, v]) => (v ? [`## ${k}`, v] : [])),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(mapCards, `${mp.id}.md`), cap(card));
}
fs.writeFileSync(path.join(root, "loop", "cards", "_stages.json"), JSON.stringify({
  fetched: date,
  per: PER,
  stages: stages.map(({ survey, thumb, ...rest }) => rest),
  maps: maps.map(({ description, sections: _s, ...rest }) => rest),
}, null, 1));

// 5. Images
if (!noImages) {
  const jobs = [];
  for (const s of stages) {
    if (s.image) jobs.push({ file: s.image, out: path.join(stageImgs, `${s.id}.png`) });
    if (s.thumb) jobs.push({ file: s.thumb, out: path.join(stageImgs, `${s.id}.thumb.png`) });
  }
  for (const mp of maps) mp.images.forEach((f, k) => jobs.push({ file: f, out: path.join(mapImgs, `${mp.id}${k ? `.${k + 1}` : ""}.png`) }));
  const r = await fetchImages(jobs);
  report.push(`images: saved ${r.saved}, missing ${r.missing.length}${r.missing.length ? `: ${r.missing.join(", ")}` : ""}`);
}

for (const l of report) console.log(l);
console.log(`${stages.length} stages over ${maps.length} maps: ${maps.map((m) => `${m.id}(${m.usedBy.length})`).join(" ")}`);
const unmatched = stages.filter((s) => s.unknownUnits.length || !s.enemyTotal);
if (unmatched.length) console.log(`check: ${unmatched.map((s) => `${s.id}[${s.enemyTotal ? s.unknownUnits.join("/") : "no total"}]`).join(" ")}`);
const missingMaps = maps.filter((m) => !m.found);
if (missingMaps.length) console.log(`map pages missing: ${missingMaps.map((m) => m.title).join(", ")}`);
