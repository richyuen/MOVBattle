# Comprehensive Visual Parity Matrix

## Status
- Non-Secret roster coverage is now fully explicit or curated-preset driven. No non-Secret unit should fall back to `inferUnitVisual(...)`.
- Secret remains preset-driven by design, with no Secret fallback allowed.
- Validation source of truth is the deterministic gallery suite in [`web/src/testing/scenarios.ts`](C:/Git/MOVBattle/web/src/testing/scenarios.ts).
- Bespoke must-match cues for the current tranche are tracked in [`web/BESPOKE_VISUAL_TARGETS.md`](C:/Git/MOVBattle/web/BESPOKE_VISUAL_TARGETS.md).
- Full per-unit reference rows are tracked in [`web/TABS_REFERENCE_MATRIX.md`](C:/Git/MOVBattle/web/TABS_REFERENCE_MATRIX.md).
- Validation status is carried by the gallery scenarios below plus passing type/build verification; there is no separate per-unit tracker anymore.

## Matrix
### Tribal
- `explicit`: `tribal.clubber`, `tribal.protector`, `tribal.spear_thrower`, `tribal.stoner`, `tribal.bone_mage`, `tribal.chieftain`
- `preset`: `tribal.mammoth`
- `validation`: `gallery_faction_tribal`, `gallery_giants_colossals`

### Farmer
- `explicit`: `farmer.halfling`, `farmer.farmer`, `farmer.hay_baler`, `farmer.potion_seller`, `farmer.harvester`, `farmer.wheelbarrow`
- `preset`: `farmer.scarecrow`
- `validation`: `gallery_faction_farmer`, `gallery_war_machines_composites`

### Medieval
- `explicit`: `medieval.bard`, `medieval.squire`, `medieval.archer`, `medieval.healer`, `medieval.knight`, `medieval.catapult`, `medieval.king`
- `preset`: none
- `validation`: `gallery_faction_medieval`, `gallery_war_machines_composites`

### Ancient
- `explicit`: `ancient.shield_bearer`, `ancient.sarissa`, `ancient.hoplite`, `ancient.snake_archer`, `ancient.ballista`, `ancient.minotaur`
- `preset`: `ancient.zeus`
- `validation`: `gallery_faction_ancient`, `gallery_iconic_heroes_bosses`, `gallery_war_machines_composites`, `gallery_giants_colossals`

### Viking
- `explicit`: `viking.headbutter`, `viking.ice_archer`, `viking.brawler`, `viking.berserker`, `viking.valkyrie`, `viking.longship`, `viking.jarl`
- `preset`: none
- `validation`: `gallery_faction_viking`

### Dynasty
- `explicit`: `dynasty.samurai`, `dynasty.firework_archer`, `dynasty.monk`, `dynasty.ninja`, `dynasty.dragon`
- `preset`: `dynasty.hwacha`, `dynasty.monkey_king`
- `validation`: `gallery_faction_dynasty`, `gallery_iconic_heroes_bosses`, `gallery_war_machines_composites`

### Renaissance
- `explicit`: `renaissance.painter`, `renaissance.fencer`, `renaissance.balloon_archer`, `renaissance.musketeer`, `renaissance.halberd`, `renaissance.jouster`
- `preset`: `renaissance.da_vinci_tank`
- `validation`: `gallery_faction_renaissance`, `gallery_war_machines_composites`

### Pirate
- `explicit`: `pirate.flintlock`, `pirate.blunderbuss`, `pirate.bomb_thrower`, `pirate.harpooner`, `pirate.cannon`, `pirate.captain`
- `preset`: `pirate.pirate_queen`
- `validation`: `gallery_faction_pirate`, `gallery_iconic_heroes_bosses`, `gallery_war_machines_composites`

### Spooky
- `explicit`: `spooky.skeleton_warrior`, `spooky.skeleton_archer`, `spooky.candlehead`, `spooky.vampire`, `spooky.pumpkin_catapult`, `spooky.swordcaster`
- `preset`: `spooky.reaper`
- `validation`: `gallery_faction_spooky`, `gallery_iconic_heroes_bosses`, `gallery_state_reads`

### Wild West
- `explicit`: `wild_west.dynamite_thrower`, `wild_west.miner`, `wild_west.cactus`, `wild_west.gunslinger`, `wild_west.lasso`, `wild_west.deadeye`
- `preset`: `wild_west.quick_draw`
- `validation`: `gallery_faction_wild_west`, `gallery_iconic_heroes_bosses`, `gallery_state_reads`

### Legacy
- `explicit`: `legacy.peasant`, `legacy.banner_bearer`, `legacy.poacher`, `legacy.blowdarter`, `legacy.pike`, `legacy.barrel_roller`, `legacy.boxer`, `legacy.flag_bearer`, `legacy.pharaoh`, `legacy.wizard`, `legacy.chariot`, `legacy.super_boxer`
- `preset`: `legacy.thor`, `legacy.tank`, `legacy.dark_peasant`, `legacy.super_peasant`
- `validation`: `gallery_faction_legacy`, `gallery_iconic_heroes_bosses`, `gallery_war_machines_composites`, `gallery_giants_colossals`, `gallery_state_reads`

### Good
- `explicit`: `good.devout_gauntlet`, `good.celestial_aegis`, `good.radiant_glaive`, `good.righteous_paladin`, `good.divine_arbiter`, `good.sacred_elephant`
- `preset`: `good.chronomancer`
- `validation`: `gallery_faction_good`, `gallery_iconic_heroes_bosses`, `gallery_giants_colossals`, `gallery_state_reads`

### Evil
- `explicit`: `evil.shadow_walker`, `evil.exiled_sentinel`, `evil.mad_mechanic`, `evil.void_cultist`, `evil.tempest_lich`, `evil.death_bringer`, `evil.void_monarch`
- `preset`: none
- `validation`: `gallery_faction_evil`, `gallery_iconic_heroes_bosses`, `gallery_giants_colossals`, `gallery_state_reads`

### Secret
- `explicit`: none
- `preset`: `secret.ballooner`, `secret.bomb_on_a_stick`, `secret.fan_bearer`, `secret.raptor`, `secret.the_teacher`, `secret.jester`, `secret.ball_n_chain`, `secret.chu_ko_nu`, `secret.executioner`, `secret.shouter`, `secret.taekwondo`, `secret.raptor_rider`, `secret.cheerleader`, `secret.cupid`, `secret.mace_spinner`, `secret.clams`, `secret.present_elf`, `secret.ice_mage`, `secret.infernal_whip`, `secret.bank_robbers`, `secret.witch`, `secret.banshee`, `secret.necromancer`, `secret.solar_architect`, `secret.wheelbarrow_dragon`, `secret.skeleton_giant`, `secret.bomb_cannon`, `secret.cavalry`, `secret.vlad`, `secret.gatling_gun`, `secret.blackbeard`, `secret.samurai_giant`, `secret.ullr`, `secret.lady_red_jade`, `secret.sensei`, `secret.shogun`, `secret.tree_giant`, `secret.artemis`, `secret.ice_giant`
- `validation`: `gallery_faction_secret`, `gallery_iconic_heroes_bosses`, `gallery_war_machines_composites`, `gallery_giants_colossals`

## Acceptance Notes
- `explicit` means the unit is authored directly in [`web/src/units/unitVisuals.ts`](C:/Git/MOVBattle/web/src/units/unitVisuals.ts).
- `preset` means the unit resolves through curated manifest-driven preset handling in [`web/src/units/unitVisuals.ts`](C:/Git/MOVBattle/web/src/units/unitVisuals.ts).
- Final acceptance requires the gallery scenes plus build/type validation to pass together.
