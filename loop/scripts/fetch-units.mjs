// Download one TABS wiki action screenshot per MOVBattle unit into reference/units/<unitId>.<ext>.
import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (reference-fetch for MOVBattle)";
const API = "https://totally-accurate-battle-simulator.fandom.com/api.php";
const outDir = "reference/units";
fs.mkdirSync(outDir, { recursive: true });

// unit id -> wiki file title (checked against the faction pages' image lists)
const UNITS = {
  "tribal.clubber": "Clubber1.jpg", "tribal.protector": "Protector_parrying_spears.png", "tribal.spear_thrower": "Spearthrower1.jpg",
  "tribal.stoner": "Stoner2.jpg", "tribal.bone_mage": "Bone_deer_guy.png", "tribal.chieftain": "Chieftain_hitting_a_poor_clubber.png", "tribal.mammoth": "Mammoth3.jpg",
  "farmer.farmer": "Farmer_epic_pose.png", "farmer.hay_baler": "Farmer13.jpg",
  "medieval.bard": "The_bard_and_his_fans.png", "medieval.squire": "Squire-1.jpg", "medieval.archer": "Archertower.jpg", "medieval.healer": "Healer3.jpg",
  "medieval.knight": "Knight_pushing.png", "medieval.catapult": "Catapult-1.jpg", "medieval.king": "Theking2.jpg", "medieval.executioner": "Executionerr.jpg",
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
  "good.chronomancer": "Chronomancer_blinking_XD.png", "good.solar_architect": "Solar_guy_without_watermark.png",
  "evil.shadow_walker": "Shadow_guy_teleportating.png", "evil.exiled_sentinel": "Ex.jpg", "evil.void_cultist": "Cult.jpg", "evil.tempest_lich": "Tempest.jpg",
  "evil.death_bringer": "Death.jpg", "evil.void_monarch": "Void.jpg",
  "secret.artemis": "Atremis.jpg", "secret.bank_robbers": "Bank_robbed!!.png", "secret.blackbeard": "Blackbeard2.jpg", "secret.bomb_cannon": "Bomb_cannon.jpg",
  "secret.bomb_on_a_stick": "Explosion_on_a_stick.png", "secret.cavalry": "Cavalry_moment.png", "secret.chu_ko_nu": "Chukonu.jpg", "secret.clams": "Clams_guy_throwing_things.png",
  "secret.gatling_gun": "Machinegungating.jpg", "secret.ice_giant": "Icegiant2.jpg", "secret.necromancer": "20201207132421_1.jpg", "secret.raptor_rider": "Raptorrider.jpg",
  "secret.sensei": "Senset.jpg", "secret.shogun": "Shogun_dash_epic.png", "secret.tree_giant": "Treegiant3.jpg", "secret.ullr": "Ullrr.jpg", "secret.vlad": "Vlad1.jpg",
  "secret.wheelbarrow_dragon": "Wheelbarrowdragon.jpg", "secret.witch": "Witch_magic_-O.png", "secret.samurai_giant": "Giant_samurai_pointing_at_you.png",
  "secret.skeleton_giant": "Skeletonginat.jpg", "secret.jester": "Jester_backflip.png", "secret.taekwondo": "Taekwondod.jpg", "secret.fan_bearer": "Fanbearer2.jpg",
};

const entries = Object.entries(UNITS);
let saved = 0;
for (let i = 0; i < entries.length; i += 50) {
  const batch = entries.slice(i, i + 50);
  const titles = batch.map(([, f]) => "File:" + f).join("|");
  const res = await fetch(`${API}?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size&format=json`, { headers: { "User-Agent": UA } });
  const json = await res.json();
  const byTitle = new Map();
  for (const page of Object.values(json.query.pages)) byTitle.set(page.title.replace(/^File:/, "").replace(/ /g, "_"), page);
  for (const norm of json.query.normalized ?? []) {
    const page = Object.values(json.query.pages).find((p) => p.title === norm.to);
    if (page) byTitle.set(norm.from.replace(/^File:/, ""), page);
  }
  for (const [unit, file] of batch) {
    const page = byTitle.get(file) ?? byTitle.get(file.replace(/ /g, "_"));
    const info = page?.imageinfo?.[0];
    if (!info) { console.log(`missing ${unit} <- ${file}`); continue; }
    const ext = path.extname(file).toLowerCase() === ".png" ? ".png" : ".jpg";
    const img = await fetch(info.url, { headers: { "User-Agent": UA } });
    if (!img.ok) { console.log(`failed ${unit} ${img.status}`); continue; }
    fs.writeFileSync(path.join(outDir, unit + ext), Buffer.from(await img.arrayBuffer()));
    saved++;
    console.log(`${unit} ${info.width}x${info.height}`);
  }
}
console.log(`saved ${saved} of ${entries.length}`);
