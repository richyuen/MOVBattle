// TABS wiki images for every roster unit, into reference/units/ (gitignored). Never overwrites a file that exists.
//   node loop/scripts/fetch-units.mjs            one action shot per unit from the hand-picked UNITS table -> <unitId>.<ext>
//   node loop/scripts/fetch-units.mjs --renders  the red and blue studio renders every unit page embeds -> <unitId>.red.png, <unitId>.blue.png
//   node loop/scripts/fetch-units.mjs --missing  an action shot for every unit the table leaves out, the first Gallery image of its page
// --renders and --missing read output/wiki/gallery.json, written by fetch-unit-cards.mjs: the File titles are taken from the pages, never
// built from the unit's name (the wiki is inconsistent: "Red King.png", "Blu Mammoth.png").
import fs from "node:fs";
import path from "node:path";
import { loadRoster, root } from "./lib/roster.mjs";

const UA = "Mozilla/5.0 (reference-fetch for MOVBattle)";
const API = "https://tabs.wiki.gg/api.php";
const outDir = path.join(root, "reference", "units");
fs.mkdirSync(outDir, { recursive: true });
const args = process.argv.slice(2);

// unit id -> wiki file title (checked against the faction pages' image lists)
const UNITS = {
  "tribal.clubber": "Clubber1.jpg", "tribal.protector": "Protector_parrying_spears.png", "tribal.spear_thrower": "Spearthrower1.jpg",
  "tribal.stoner": "Stoner2.jpg", "tribal.bone_mage": "Bone_deer_guy.png", "tribal.chieftain": "Chieftain_hitting_a_poor_clubber.png", "tribal.mammoth": "Mammoth3.jpg",
  "farmer.farmer": "Farmer_epic_pose.png", "farmer.hay_baler": "Farmer13.jpg",
  "medieval.bard": "The_bard_and_his_fans.png", "medieval.squire": "Squire-1.jpg", "medieval.archer": "Archertower.jpg", "medieval.healer": "Healer3.jpg",
  "medieval.knight": "Knight_pushing.png", "medieval.catapult": "Catapult-1.jpg", "medieval.king": "Theking2.jpg", "secret.executioner": "Executionerr.jpg",
  "ancient.shield_bearer": "Sheildwall.jpg", "ancient.sarissa": "Epic_sarissa.png", "ancient.hoplite": "Hoplite2.jpg", "ancient.snake_archer": "Snake_guy.png",
  "ancient.ballista": "Ballista_shooting.png", "ancient.minotaur": "Minotaur_and_brawlers.png", "ancient.zeus": "Zeus_throwing_THUNDEEER.png",
  "viking.headbutter": "Poor_peasant.png", "viking.ice_archer": "Icearcher2.jpg", "viking.brawler": "Brawler2.jpg", "viking.berserker": "Berserker4.jpg",
  "viking.valkyrie": "Valkyrie_flying.png", "viking.longship": "Longship2.jpg", "viking.jarl": "Jarl4.jpg",
  "dynasty.samurai": "Samrurai2.jpg", "dynasty.firework_archer": "Firework_archer.jpg", "dynasty.monk": "Monk2.jpg", "dynasty.ninja": "Ninja_without_watermark.png",
  "dynasty.dragon": "Dragon1.jpg", "dynasty.hwacha": "Hwacha2.jpg", "dynasty.monkey_king": "Monke_king.jpg",
  "renaissance.painter": "Ppainter.jpg", "renaissance.fencer": "Don't_worry,_this_is_authentic_fencing.png", "renaissance.balloon_archer": "Balloonarcher.jpg",
  "renaissance.musketeer": "Musket_teer.jpg", "renaissance.halberd": "Halberdline.jpg", "renaissance.jouster": "¡joust!.png", "renaissance.da_vinci_tank": "Davincitank.jpg",
  "pirate.flintlock": "FLINLOCK.jpg", "pirate.blunderbuss": "Blunderbussssssssssssssss.jpg", "pirate.bomb_thrower": "Bombthrower.jpg", "pirate.harpooner": "Harpooooner.jpg",
  "pirate.cannon": "Canoon.jpg", "pirate.captain": "Captain2.jpg", "pirate.pirate_queen": "Pirate_queen_with_bombs.png",
  "spooky.skeleton_warrior": "Skeleton_blow.png", "spooky.skeleton_archer": "Skeletoarcher.jpg", "spooky.candlehead": "Candlehead2.jpg", "spooky.vampire": "Guy_that_drinks_ketchup.png",
  "spooky.pumpkin_catapult": "20191030202332_1.jpg", "spooky.swordcaster": "20191030183825_1.jpg", "spooky.reaper": "R3aper.jpg",
  "wild_west.dynamite_thrower": "Dynamitethrower.jpg", "wild_west.miner": "Gold!.png", "wild_west.cactus": "Spikes_-D.png", "wild_west.gunslinger": "20200527114146_1.jpg",
  "wild_west.lasso": "Lasso_men.jpg", "wild_west.deadeye": "Sharp_shooter.png", "wild_west.quick_draw": "Quick_draw.jpg",
  "legacy.peasant": "Pezeant.jpg", "legacy.banner_bearer": "Banner_Bearer.jpg", "legacy.poacher": "Poacherr.jpg", "legacy.pike": "Poke.jpg", "legacy.boxer": "BOXING_PUNCH.png",
  "legacy.flag_bearer": "Flagbearer.jpg", "legacy.wizard": "Wizard_hit.png", "legacy.chariot": "Chariott.jpg", "legacy.thor": "Thor2.jpg", "legacy.tank": "SHOOOT_TAAANK.png",
  "legacy.super_boxer": "Souper_boxer.jpg", "legacy.dark_peasant": "Dork_peasant.jpg", "legacy.super_peasant": "Souper_peasant.jpg",
  "good.devout_gauntlet": "Gauntlet.jpg", "good.righteous_paladin": "Righteouspala.jpg", "good.divine_arbiter": "Divine.jpg", "good.sacred_elephant": "Elepaht.jpg",
  "good.chronomancer": "Chronomancer_blinking_XD.png", "secret.solar_architect": "Solar_guy_without_watermark.png",
  "evil.shadow_walker": "Shadow_guy_teleportating.png", "evil.exiled_sentinel": "Ex.jpg", "evil.void_cultist": "Cult.jpg", "evil.tempest_lich": "Tempest.jpg",
  "evil.death_bringer": "Death.jpg", "evil.void_monarch": "Void.jpg",
  "secret.artemis": "Atremis.jpg", "secret.bank_robbers": "Bank_robbed!!.png", "secret.blackbeard": "Blackbeard2.jpg", "secret.bomb_cannon": "Bomb_cannon.jpg",
  "secret.bomb_on_a_stick": "Explosion_on_a_stick.png", "secret.cavalry": "Cavalry_moment.png", "secret.chu_ko_nu": "Chukonu.jpg", "secret.clams": "Clams_guy_throwing_things.png",
  "secret.gatling_gun": "Machinegungating.jpg", "secret.ice_giant": "Icegiant2.jpg", "secret.necromancer": "20201207132421_1.jpg", "secret.raptor_rider": "Raptorrider.jpg",
  "secret.sensei": "Senset.jpg", "secret.shogun": "Shogun_dash_epic.png", "secret.tree_giant": "Treegiant3.jpg", "secret.ullr": "Ullrr.jpg", "secret.vlad": "Vlad1.jpg",
  "secret.wheelbarrow_dragon": "Wheelbarrowdragon.jpg", "secret.witch": "Witch_magic_-O.png", "secret.samurai_giant": "Giant_samurai_pointing_at_you.png",
  "secret.skeleton_giant": "Skeletonginat.jpg", "secret.jester": "Jester_backflip.png", "secret.taekwondo": "Taekwondod.jpg", "secret.fan_bearer": "Fanbearer2.jpg",
};
// --missing: a better Gallery pick than the page's first image, by unit id
const MISSING_OVERRIDES = {};

const norm = (t) => t.replace(/^File:/, "").replace(/ /g, "_");
const extOf = (file) => (path.extname(file).toLowerCase() === ".png" ? ".png" : ".jpg");

/** Download [{ file: wiki File title, dest: path }] in batches of 50 title lookups. */
async function download(jobs) {
  let saved = 0;
  for (let i = 0; i < jobs.length; i += 50) {
    const batch = jobs.slice(i, i + 50);
    const titles = batch.map((j) => "File:" + j.file).join("|");
    const res = await fetch(`${API}?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size&format=json`, { headers: { "User-Agent": UA } });
    const json = await res.json();
    const byTitle = new Map();
    for (const page of Object.values(json.query?.pages ?? {})) byTitle.set(norm(page.title), page);
    for (const n of json.query?.normalized ?? []) {
      const page = Object.values(json.query.pages).find((p) => p.title === n.to);
      if (page) byTitle.set(norm(n.from), page);
    }
    for (const j of batch) {
      const page = byTitle.get(norm(j.file));
      const info = page?.imageinfo?.[0];
      if (!info) { console.log(`missing ${j.label} <- ${j.file}`); continue; }
      const img = await fetch(info.url, { headers: { "User-Agent": UA } });
      if (!img.ok) { console.log(`failed ${j.label} ${img.status}`); continue; }
      fs.writeFileSync(j.dest, Buffer.from(await img.arrayBuffer()));
      saved++;
      console.log(`${j.label} ${info.width}x${info.height}`);
    }
  }
  return saved;
}

const roster = loadRoster();
const hasShot = (id) => fs.readdirSync(outDir).some((f) => f.startsWith(id + ".") && !/\.(red|blue)\.png$/.test(f));
let jobs = [];
if (args.includes("--renders") || args.includes("--missing")) {
  const galleryFile = path.join(root, "output", "wiki", "gallery.json");
  if (!fs.existsSync(galleryFile)) { console.error("run fetch-unit-cards.mjs first (writes output/wiki/gallery.json)"); process.exit(2); }
  const gallery = JSON.parse(fs.readFileSync(galleryFile, "utf8"));
  for (const u of roster) {
    const g = gallery[u.id];
    if (!g) { console.log(`no gallery entry ${u.id}`); continue; }
    if (args.includes("--renders")) {
      for (const [side, title] of [["red", g.red], ["blue", g.blue]]) {
        const dest = path.join(outDir, `${u.id}.${side}.png`);
        if (!title) { console.log(`no ${side} render title ${u.id}`); continue; }
        if (fs.existsSync(dest)) continue;
        jobs.push({ file: title, dest, label: `${u.id}.${side}` });
      }
    }
    if (args.includes("--missing") && !hasShot(u.id)) {
      const pick = MISSING_OVERRIDES[u.id] ?? g.gallery.find((t) => /\.(png|jpe?g)$/i.test(t));
      if (!pick) { console.log(`missing ${u.id}: no gallery image on its page`); continue; }
      jobs.push({ file: pick, dest: path.join(outDir, u.id + extOf(pick)), label: u.id });
    }
  }
} else {
  for (const [unit, file] of Object.entries(UNITS)) {
    const dest = path.join(outDir, unit + extOf(file));
    if (fs.existsSync(dest)) continue;
    jobs.push({ file, dest, label: unit });
  }
}
const saved = await download(jobs);
console.log(`saved ${saved} of ${jobs.length}`);
