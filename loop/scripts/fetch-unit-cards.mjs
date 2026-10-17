// Loop v2 reference cards: one markdown card per roster unit from the TABS wiki (tabs.wiki.gg), plus loop/cards/_stats.json for stats.mjs
// and output/wiki/gallery.json for fetch-units.mjs --renders / --missing.
//   node loop/scripts/fetch-unit-cards.mjs [--refresh] [--only <unitId[,unitId]>]
// Raw API responses are cached under output/wiki/raw/ (untrusted text: parsed with JSON.parse and regex only). Exit 1 when a unit page has
// no UnitInfo block (listed as `missing <id> <slug>`: add the slug to EXCEPTIONS).
import fs from "node:fs";
import path from "node:path";
import { loadRoster, root } from "./lib/roster.mjs";
import { extractTemplates, targets, clean, sections, prose, fileTitles, num, range, mult } from "./lib/wikitext.mjs";

const API = "https://tabs.wiki.gg/api.php";
const UA = "Mozilla/5.0 (reference-fetch for MOVBattle)";
const CARD_CAP = 3200;
const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const onlyArg = args.indexOf("--only");
const only = onlyArg >= 0 ? args[onlyArg + 1].split(",") : null;

const rawDir = path.join(root, "output", "wiki", "raw");
const cardsDir = path.join(root, "loop", "cards");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(cardsDir, { recursive: true });

// unit id -> wiki page title where the title-cased display name is not the page
const EXCEPTIONS = {
  "medieval.king": "The King",
  "secret.clams": "CLAMS",
  "secret.the_teacher": "The Teacher",
  "secret.ball_n_chain": "Ball 'n' Chain",
  "secret.bomb_on_a_stick": "Bomb on a Stick",
  "farmer.potion_seller": "Potionseller",
  "secret.chu_ko_nu": "Chu Ko Nu",
};
const slugFor = (u) => EXCEPTIONS[u.id] ?? u.name;
const safe = (title) => title.replace(/[^a-z0-9]+/gi, "_");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Page wikitext by title (batched 50 per call, cached). Returns Map<title, text|null>. */
async function fetchPages(titles) {
  const out = new Map();
  const todo = [];
  for (const t of titles) {
    const file = path.join(rawDir, safe(t) + ".json");
    if (!refresh && fs.existsSync(file)) {
      const j = JSON.parse(fs.readFileSync(file, "utf8"));
      out.set(t, j.text ?? null);
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
    // normalized (underscores, case) and redirects map the asked title to the answered one
    const alias = new Map();
    for (const n of json.query?.normalized ?? []) alias.set(n.from, n.to);
    for (const r of json.query?.redirects ?? []) alias.set(r.from, r.to);
    for (const t of batch) {
      let k = t;
      for (let hop = 0; hop < 4 && alias.has(k); hop++) k = alias.get(k);
      const text = byTitle.has(k) ? byTitle.get(k) : null;
      out.set(t, text);
      fs.writeFileSync(path.join(rawDir, safe(t) + ".json"), JSON.stringify({ title: t, resolved: k, text }));
    }
    process.stdout.write(`fetched ${Math.min(i + 50, todo.length)}/${todo.length} pages\n`);
    if (i + 50 < todo.length) await sleep(250);
  }
  return out;
}

const roster = loadRoster().filter((u) => !only || only.includes(u.id));
const report = [];
const pages = await fetchPages(roster.map(slugFor));

// Pass 1: unit infoboxes and the weapon/ability pages they name
const units = [];
const weaponTitles = new Set();
for (const u of roster) {
  const text = pages.get(slugFor(u));
  const blocks = text ? extractTemplates(text, "UnitInfo") : [];
  if (blocks.length === 0) {
    report.push(`missing ${u.id} ${slugFor(u)}`);
    continue;
  }
  const secs = text ? sections(text) : {};
  const info = blocks.map(({ params }) => {
    const hand = (k) => targets(params[k] ?? "");
    const w = { main: hand("Main Hand"), off: hand("Off Hand"), abilities: [...new Set([...hand("Abilities"), ...hand("Animal Abilities")])] };
    for (const t of [...w.main, ...w.off, ...w.abilities]) weaponTitles.add(t);
    return { params, weapons: w };
  });
  units.push({ u, text, blocks: info, secs });
}
const weaponPages = await fetchPages([...weaponTitles]);

/** A weapon page's numbers, or an ability's one-line description. */
function describeWeapon(title) {
  const text = weaponPages.get(title);
  if (!text) return { name: title, kind: "unknown" };
  const w = extractTemplates(text, "WeaponInfo")[0]?.params;
  const secs = sections(text);
  const line = prose(secs.Characteristics ?? text.replace(/\{\{[\s\S]*?\}\}/, ""), 160);
  if (!w || !w.Damage || num(w.Damage) === null) return { name: title, kind: "ability", text: line };
  const g = (k) => (w[k] && clean(w[k]) ? clean(w[k]) : null);
  const dmg = range(w.Damage);
  return {
    name: title,
    kind: "weapon",
    type: g("Weapon Type"),
    dmg,
    cooldown: g("Cooldown") ? num(w.Cooldown) : null,
    range: g("Range") ? num(w.Range) : null,
    warmUp: g("Warm-Up") ? num(w["Warm-Up"]) : null,
    force: g("Force on Hit") ? num(w["Force on Hit"]) : null,
    projectile: g("Projectile"),
    count: g("Count") ? num(w.Count) : null,
    shootDelay: g("Shoot Delay"),
    explRadius: g("Expl. Radius") ? num(w["Expl. Radius"]) : null,
    projSpeed: g("Proj. Speed") ? num(w["Proj. Speed"]) : null,
    text: line,
  };
}
const fmtWeapon = (slot, d) => {
  if (d.kind === "ability") return `- ${slot} ${d.name} (ability): ${d.text}`;
  if (d.kind === "unknown") return `- ${slot} ${d.name}: (no wiki page)`;
  const parts = [d.type];
  if (d.dmg) parts.push(`damage ${d.dmg.min === d.dmg.max ? d.dmg.min : `${d.dmg.min}-${d.dmg.max} (avg ${d.dmg.avg})`}`);
  if (d.cooldown !== null) parts.push(`cooldown ${d.cooldown} s`);
  if (d.range !== null) parts.push(`range ${d.range}`);
  if (d.warmUp !== null) parts.push(`warm-up ${d.warmUp} s`);
  if (d.force !== null) parts.push(`force ${d.force}`);
  if (d.projectile) parts.push(`projectile ${d.projectile}`);
  if (d.count !== null) parts.push(`count ${d.count}`);
  if (d.shootDelay) parts.push(`shoot delay ${d.shootDelay}`);
  if (d.explRadius !== null) parts.push(`explosion radius ${d.explRadius}`);
  if (d.projSpeed !== null) parts.push(`projectile speed ${d.projSpeed}`);
  return `- ${slot} ${d.name}: ${parts.filter(Boolean).join("; ")}`;
};

// Pass 2: cards, stats, gallery
const stats = {};
const gallery = {};
const today = new Date().toISOString().slice(0, 10);
const INFOBOX_KEYS = ["Cost", "Hitpoints", "Size", "Weight", "Speed", "Weapon Type", "Main Hand", "Off Hand", "Abilities", "Attack Type", "Animal Damage Rng.", "Animal Damage Avg.", "Cooldown", "Animal DPS", "Animal Abilities", "Movement", "Targeting"];
for (const { u, blocks, secs, text } of units) {
  const slug = slugFor(u);
  const first = blocks[0].params;
  const shots = fs.existsSync(path.join(root, "reference", "units")) ? fs.readdirSync(path.join(root, "reference", "units")).filter((f) => f.startsWith(u.id + ".")) : [];
  const action = shots.find((f) => !/\.(red|blue)\.png$/.test(f));
  const renders = fileTitles(first.Image ?? "");
  const galleryTitles = fileTitles(secs.Gallery ?? "").filter((t) => !renders.includes(t));
  gallery[u.id] = { red: renders[0] ?? null, blue: renders[1] ?? null, gallery: galleryTitles };

  const lines = [];
  lines.push(`# ${u.id} — ${clean(first.Title ?? u.name)} (${u.faction})`);
  lines.push(`Source: https://tabs.wiki.gg/wiki/${encodeURIComponent(slug.replace(/ /g, "_"))} (${today}). Renders: reference/units/${u.id}.red.png, .blue.png. Shot: ${action ? `reference/units/${action}` : "none"}. Lineup: reference/factions/${u.faction}.jpg`);
  let mainDesc = null;
  for (const [bi, b] of blocks.entries()) {
    const p = b.params;
    const title = clean(p.Title ?? (bi === 0 ? u.name : `block ${bi + 1}`));
    lines.push(blocks.length > 1 ? `## Infobox (${title})` : "## Infobox");
    lines.push(INFOBOX_KEYS.filter((k) => p[k] !== undefined && clean(p[k]) !== "").map((k) => `${k} ${clean(p[k])}`).join(" | "));
    lines.push(blocks.length > 1 ? `## Weapons (${title})` : "## Weapons");
    const w = b.weapons;
    const seen = new Set();
    for (const [slot, list] of [["main", w.main], ["off", w.off], ["ability", w.abilities]]) {
      for (const t of list) {
        if (seen.has(`${slot}:${t}`)) continue;
        seen.add(`${slot}:${t}`);
        const d = describeWeapon(t);
        if (d.kind === "unknown") report.push(`weapon-missing ${u.id} ${t}`);
        lines.push(fmtWeapon(slot, d));
        if (bi === 0 && slot === "main" && !mainDesc) mainDesc = d;
      }
    }
    if (p["Animal Damage Rng."] || p["Animal Damage Avg."]) {
      lines.push(`- animal: ${["Attack Type", "Animal Damage Rng.", "Animal Damage Avg.", "Cooldown", "Animal DPS"].filter((k) => p[k] && clean(p[k])).map((k) => `${k} ${clean(p[k])}`).join("; ")}`);
      if (bi === 0 && !mainDesc) {
        const r = range(p["Animal Damage Rng."] ?? p["Animal Damage Avg."]);
        mainDesc = { name: "animal", kind: "weapon", dmg: r, cooldown: p.Cooldown ? num(p.Cooldown) : null, range: null };
      }
    }
    if (w.main.length + w.off.length + w.abilities.length === 0 && !(p["Animal Damage Rng."] || p["Animal Damage Avg."])) lines.push("- (none listed)");
  }
  const charac = prose(secs.Characteristics ?? "", 900);
  const appear = prose(secs.Appearance ?? "", 900);
  const head = lines.join("\n");
  // Fit the cap: prose shrinks first, Characteristics before Appearance
  let cLen = charac.length, aLen = appear.length;
  const build = () => `${head}\n## Characteristics\n${prose(charac, cLen) || "(none on the wiki)"}\n## Appearance\n${prose(appear, aLen) || "(none on the wiki)"}\n`;
  let card = build();
  let trimmed = false;
  while (Buffer.byteLength(card, "utf8") > CARD_CAP && (cLen > 200 || aLen > 200)) {
    if (cLen >= aLen && cLen > 200) cLen -= 50; else aLen -= 50;
    card = build();
    trimmed = true;
  }
  if (trimmed) report.push(`trimmed ${u.id} ${Buffer.byteLength(card, "utf8")}`);
  fs.writeFileSync(path.join(cardsDir, `${u.id}.md`), card);

  stats[u.id] = {
    slug,
    name: clean(first.Title ?? u.name),
    cost: first.Cost ? num(first.Cost) : null,
    hp: first.Hitpoints ? num(first.Hitpoints) : null,
    size: first.Size ? mult(first.Size) : null,
    weight: first.Weight ? mult(first.Weight) : null,
    speed: first.Speed ? mult(first.Speed) : null,
    weaponType: first["Weapon Type"] ? clean(first["Weapon Type"]) : null,
    movement: first.Movement ? clean(first.Movement) : null,
    main: mainDesc && mainDesc.kind === "weapon" ? { name: mainDesc.name, dmgAvg: mainDesc.dmg?.avg ?? null, dmgMin: mainDesc.dmg?.min ?? null, dmgMax: mainDesc.dmg?.max ?? null, cooldown: mainDesc.cooldown, range: mainDesc.range } : null,
    mainAbility: mainDesc && mainDesc.kind !== "weapon" ? mainDesc.name : null,
    off: blocks[0].weapons.off,
    abilities: blocks[0].weapons.abilities,
    blocks: blocks.length,
  };
}

// One unit per line keeps the file diffable and small
const perLine = (obj) => `{\n${Object.entries(obj).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n")}\n}\n`;
const sp = path.join(cardsDir, "_stats.json"), gp = path.join(root, "output", "wiki", "gallery.json");
if (!only) {
  fs.writeFileSync(sp, perLine(stats));
  fs.writeFileSync(gp, perLine(gallery));
} else {
  // merge into the existing files
  const s0 = fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, "utf8")) : {};
  const g0 = fs.existsSync(gp) ? JSON.parse(fs.readFileSync(gp, "utf8")) : {};
  fs.writeFileSync(sp, perLine({ ...s0, ...stats }));
  fs.writeFileSync(gp, perLine({ ...g0, ...gallery }));
}
fs.writeFileSync(path.join(root, "output", "wiki", "report.txt"), report.join("\n") + "\n");
for (const line of report) process.stdout.write(line + "\n");
process.stdout.write(`cards: ${units.length}/${roster.length}; report lines: ${report.length}\n`);
if (report.some((l) => l.startsWith("missing "))) process.exit(1);
