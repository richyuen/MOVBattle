# TABS Reference Matrix

Source of truth: TABS Units wiki and unit pages. Each row locks the must-match read for acceptance.

Format: `must-match` = silhouette/loadout/posture cues that must survive gameplay distance. `not-like` = the closest collision that this unit must avoid.

## Tribal
- `tribal.clubber`: must-match oversized head, crude one-club fighter, bare primitive stance; not-like `farmer.farmer`
- `tribal.protector`: must-match round shield mass, tribal spear, masked defender read; not-like `ancient.hoplite`
- `tribal.spear_thrower`: must-match light thrower silhouette, single spear read, lean primitive body; not-like `ancient.sarissa`
- `tribal.stoner`: must-match stone-throw heft, bulky upper body, no formal armor; not-like `farmer.potion_seller`
- `tribal.bone_mage`: must-match bone staff, bone/mask head cue, ritual caster posture; not-like `evil.void_cultist`
- `tribal.chieftain`: must-match feathered leader, heavier club, bossy tribal mass; not-like `viking.jarl`
- `tribal.mammoth`: must-match tusks, woolly bulk, beast silhouette with no humanoid read; not-like `good.sacred_elephant`

## Farmer
- `farmer.halfling`: must-match tiny body, pan/flop comedy read, oversized head; not-like `legacy.peasant`
- `farmer.farmer`: must-match pitchfork, rustic hat/cloth, basic peasant proportions; not-like `legacy.peasant`
- `farmer.hay_baler`: must-match hay mass, straw hat, bulky bale-forward silhouette; not-like `good.celestial_aegis`
- `farmer.potion_seller`: must-match bottle thrower, hooded merchant read, support posture; not-like `wild_west.dynamite_thrower`
- `farmer.harvester`: must-match black-clad reaper-lite farmer, scythe dominance, menacing lean; not-like `spooky.reaper`
- `farmer.wheelbarrow`: must-match pusher plus cart, improvised farm vehicle, forward rush silhouette; not-like `secret.wheelbarrow_dragon`
- `farmer.scarecrow`: must-match scarecrow post, wide hat, summon/crow identity, lanky body; not-like `spooky.swordcaster`

## Medieval
- `medieval.bard`: must-match lute, floppy minstrel read, soft noncombat silhouette; not-like `renaissance.painter`
- `medieval.squire`: must-match simple sword, bucket/great helm, plain armored infantry; not-like `legacy.pike`
- `medieval.archer`: must-match bow plus quiver, slim hooded archer stance; not-like `spooky.skeleton_archer`
- `medieval.healer`: must-match staff, robed support read, soft upright posture; not-like `good.chronomancer`
- `medieval.knight`: must-match plated bulk, kite shield, mounted-era armor read even on foot; not-like `good.righteous_paladin`
- `medieval.catapult`: must-match timber siege arm, bucket thrower silhouette, operator-hidden machine mass; not-like `spooky.pumpkin_catapult`
- `medieval.king`: must-match crown, heavy sword, royal plated hero; not-like `legacy.pharaoh`

## Ancient
- `ancient.shield_bearer`: must-match tower shield wall read, short sword, bronze infantry; not-like `good.celestial_aegis`
- `ancient.sarissa`: must-match very long spear, disciplined phalanx stance, less shield mass; not-like `legacy.pike`
- `ancient.hoplite`: must-match round shield, spear, plumed bronze soldier silhouette; not-like `tribal.protector`
- `ancient.snake_archer`: must-match bow archer with exotic ancient headgear, snake/poison identity; not-like `medieval.archer`
- `ancient.ballista`: must-match bolt launcher frame, torsion weapon silhouette, ancient siege wood; not-like `medieval.catapult`
- `ancient.minotaur`: must-match bull head, horns, hulking beast-man, no armor clutter; not-like `tribal.mammoth`
- `ancient.zeus`: must-match laurel, lightning in hand, divine elder-caster silhouette; not-like `legacy.thor`

## Viking
- `viking.headbutter`: must-match huge horned head cue, low-cost rusher body, minimal weapon read; not-like `tribal.clubber`
- `viking.ice_archer`: must-match bow, cold palette/read, viking/fur archer identity; not-like `secret.ullr`
- `viking.brawler`: must-match axe plus shield, fur/leather bulk, grounded melee read; not-like `pirate.captain`
- `viking.berserker`: must-match dual-axe leap energy, horned aggression, less shield mass; not-like `viking.brawler`
- `viking.valkyrie`: must-match wings, shield, sword, divine viking flyer silhouette; not-like `secret.cupid`
- `viking.longship`: must-match boat hull, shields on sides, mast/prow ship read; not-like `legacy.chariot`
- `viking.jarl`: must-match horned elite leader, cape/fur hero mass, heavy nordic sword read; not-like `tribal.chieftain`

## Dynasty
- `dynasty.samurai`: must-match samurai helmet, katana, disciplined armored swordsman; not-like `secret.shogun`
- `dynasty.firework_archer`: must-match conical hat, bow, fireworks payload read; not-like `medieval.archer`
- `dynasty.monk`: must-match robe/body-wrap, open-hand martial silhouette, temple-fighter posture; not-like `secret.the_teacher`
- `dynasty.ninja`: must-match masked teleporting light body, shuriken-first silhouette; not-like `secret.sensei`
- `dynasty.dragon`: must-match dragon-winged ranged form, fantasy creature read over human read; not-like `secret.wheelbarrow_dragon`
- `dynasty.hwacha`: must-match wide rocket rack, rolling cart, exposed rear operator; not-like `ancient.ballista`
- `dynasty.monkey_king`: must-match staff hero, simian/royal cue, clone-boss silhouette; not-like `ancient.minotaur`

## Renaissance
- `renaissance.painter`: must-match beret, brush, eccentric artist silhouette; not-like `medieval.bard`
- `renaissance.fencer`: must-match rapier, slim duelist posture, plume/renaissance uniform; not-like `wild_west.quick_draw`
- `renaissance.balloon_archer`: must-match balloon lift plus bow, floating ranged silhouette; not-like `secret.ballooner`
- `renaissance.musketeer`: must-match long musket, plume hat, uniformed gunner; not-like `wild_west.deadeye`
- `renaissance.halberd`: must-match polearm guard, renaissance armor mass, infantry discipline; not-like `ancient.sarissa`
- `renaissance.jouster`: must-match horse plus lance, tournament armor silhouette; not-like `secret.cavalry`
- `renaissance.da_vinci_tank`: must-match enclosed conical wood tank, radial gun ports, hidden pilot; not-like `legacy.tank`

## Pirate
- `pirate.flintlock`: must-match one pistol, tricorn, pirate gunner silhouette; not-like `wild_west.gunslinger`
- `pirate.blunderbuss`: must-match flared shotgun barrel, pirate coat/hat read, compact gunner mass; not-like `renaissance.musketeer`
- `pirate.bomb_thrower`: must-match bomb in hand, pirate explosives identity, powder-bag silhouette; not-like `farmer.potion_seller`
- `pirate.harpooner`: must-match harpoon pole/gun read, seafarer silhouette, hook identity; not-like `ancient.spear_thrower`
- `pirate.cannon`: must-match naval cannon carriage, open artillery crew read, pirate wood/iron mass; not-like `secret.bomb_cannon`
- `pirate.captain`: must-match captain hat, cutlass, broader command silhouette than gunner units; not-like `secret.blackbeard`
- `pirate.pirate_queen`: must-match hero pirate silhouette, pistol plus blade, premium captain read; not-like `pirate.captain`

## Spooky
- `spooky.skeleton_warrior`: must-match bony body, light sword, undead infantry read; not-like `legacy.peasant`
- `spooky.skeleton_archer`: must-match skeleton bones plus bow, undead archer silhouette; not-like `medieval.archer`
- `spooky.candlehead`: must-match flame on head, haunted torso, ember read; not-like `legacy.wizard`
- `spooky.vampire`: must-match batlike leaper, collar/cape cue, lighter vampire silhouette; not-like `secret.vlad`
- `spooky.pumpkin_catapult`: must-match catapult with pumpkin payload, harvest-horror artillery cue; not-like `medieval.catapult`
- `spooky.swordcaster`: must-match spectral caster with sword magic identity, hooded horror read; not-like `evil.void_cultist`
- `spooky.reaper`: must-match giant scythe, torn spectral cloak, sweeping doom silhouette; not-like `evil.void_monarch`

## Wild West
- `wild_west.dynamite_thrower`: must-match dynamite, cowboy gear, short-range thrower silhouette; not-like `pirate.bomb_thrower`
- `wild_west.miner`: must-match pickaxe, miner hat/lamp, compact laborer brute; not-like `wild_west.dynamite_thrower`
- `wild_west.cactus`: must-match cactus body, no normal humanoid torso, prickly tank silhouette; not-like `tribal.stoner`
- `wild_west.gunslinger`: must-match dual pistols, cowboy hat, lean fast-shooter silhouette; not-like `wild_west.quick_draw`
- `wild_west.lasso`: must-match mounted cowboy puller, horse + whip/lasso read; not-like `renaissance.jouster`
- `wild_west.deadeye`: must-match long rifle, grounded sniper silhouette, western leather read; not-like `renaissance.musketeer`
- `wild_west.quick_draw`: must-match larger hero cowboy, smoke-heavy dual-pistol stance, stronger hat silhouette; not-like `wild_west.gunslinger`

## Legacy
- `legacy.peasant`: must-match tiny toybox peasant, near-featureless body, comedic simplicity; not-like `farmer.halfling`
- `legacy.banner_bearer`: must-match support banner, classic toybox unit, smaller standard silhouette; not-like `legacy.flag_bearer`
- `legacy.poacher`: must-match classic hooded archer, rustic legacy read, lighter than medieval archer; not-like `medieval.archer`
- `legacy.blowdarter`: must-match blowgun, poison support/ranged silhouette, oddball toybox identity; not-like `legacy.poacher`
- `legacy.pike`: must-match very long pike, planted infantry posture, no shield mass; not-like `ancient.sarissa`
- `legacy.barrel_roller`: must-match barrel-forward body, rolling explosive comedy silhouette; not-like `pirate.bomb_thrower`
- `legacy.boxer`: must-match gloves/fists, squat bare-knuckle body, tiny classic fighter; not-like `legacy.super_boxer`
- `legacy.flag_bearer`: must-match larger flag support silhouette, stronger banner authority cue; not-like `legacy.banner_bearer`
- `legacy.pharaoh`: must-match pharaoh headdress, staff/control pose, ancient-legacy mashup boss read; not-like `ancient.zeus`
- `legacy.wizard`: must-match tall wizard hat, classic caster body, exaggerated old-school magic silhouette; not-like `good.divine_arbiter`
- `legacy.chariot`: must-match horse + cart + rider composite, antique war-cart read; not-like `viking.longship`
- `legacy.thor`: must-match hammer, horned nordic hero body, storm bruiser read; not-like `ancient.zeus`
- `legacy.tank`: must-match armored tracked hull, large cannon barrel, enclosed modern war-machine silhouette; not-like `renaissance.da_vinci_tank`
- `legacy.super_boxer`: must-match upgraded boxer silhouette, larger heroic torso/arms, premium champion cue; not-like `legacy.boxer`
- `legacy.dark_peasant`: must-match shadow mass, orbiting dark entities, nonhuman boss silhouette; not-like `evil.void_monarch`
- `legacy.super_peasant`: must-match bright super-body, cape/hero aura, flying impact silhouette; not-like `legacy.super_boxer`

## Good
- `good.devout_gauntlet`: must-match holy melee gauntlet/mace silhouette, bright disciplined knightly read; not-like `legacy.boxer`
- `good.celestial_aegis`: must-match tower shield plus holy armor, defensive bright silhouette; not-like `ancient.shield_bearer`
- `good.radiant_glaive`: must-match elegant glaive/polearm, polished divine infantry read; not-like `renaissance.halberd`
- `good.righteous_paladin`: must-match heavy holy knight mass, greatsword + shield hero read; not-like `medieval.knight`
- `good.divine_arbiter`: must-match lightning hero, halo and tall divine silhouette, stronger thunder mass; not-like `good.chronomancer`
- `good.sacred_elephant`: must-match elephant body plus altar/canopy, sacred trim, holy beast read; not-like `tribal.mammoth`
- `good.chronomancer`: must-match slimmer time mage, ring/orbit read, less mass than Arbiter; not-like `good.divine_arbiter`

## Evil
- `evil.shadow_walker`: must-match hooded assassin with void/spectral accent, teleporting light body; not-like `spooky.vampire`
- `evil.exiled_sentinel`: must-match dark shield knight, exiled heavy infantry, oppressive but grounded silhouette; not-like `good.celestial_aegis`
- `evil.mad_mechanic`: must-match hammer-and-bomb tinkerer, scrappy dark engineer silhouette; not-like `wild_west.miner`
- `evil.void_cultist`: must-match hooded summoner staff, void cult magic read, orbit/summon posture; not-like `spooky.swordcaster`
- `evil.tempest_lich`: must-match undead lightning caster, skeletal or void-lich read, taller than cultist; not-like `legacy.wizard`
- `evil.death_bringer`: must-match huge dark blade, demonic boss mass, reaper-adjacent but sword-first; not-like `spooky.reaper`
- `evil.void_monarch`: must-match crown/cape void boss, orbiting darkness, tall summoner silhouette; not-like `legacy.dark_peasant`

## Secret
- `secret.ballooner`: must-match oversized balloon and tiny suspended fighter; not-like `renaissance.balloon_archer`
- `secret.bomb_on_a_stick`: must-match bomb-first suicidal oddball silhouette; not-like `pirate.bomb_thrower`
- `secret.fan_bearer`: must-match large fan, gust support pose, slim ceremonial read; not-like `good.chronomancer`
- `secret.raptor`: must-match fast raptor body, no rider or armor clutter; not-like `ancient.minotaur`
- `secret.the_teacher`: must-match austere robe and katana master silhouette; not-like `dynasty.monk`
- `secret.jester`: must-match jester cap, dual tiny blades, unstable nimble body; not-like `secret.cheerleader`
- `secret.ball_n_chain`: must-match flail/ball weight, hooded brute silhouette; not-like `secret.executioner`
- `secret.chu_ko_nu`: must-match repeating crossbow, compact ranged body, visible back bolts; not-like `medieval.archer`
- `secret.executioner`: must-match giant axe, hooded heavy body, executioner menace; not-like `secret.ball_n_chain`
- `secret.shouter`: must-match huge voice/shout posture, open-chest windup silhouette; not-like `good.divine_arbiter`
- `secret.taekwondo`: must-match kicker silhouette, no weapon, martial jump posture; not-like `legacy.boxer`
- `secret.raptor_rider`: must-match rider clearly mounted on raptor, hybrid beast-rider silhouette; not-like `secret.cavalry`
- `secret.cheerleader`: must-match pom-poms, tiny support frame, cheer posture; not-like `secret.jester`
- `secret.cupid`: must-match tiny winged archer, romantic/angelic flyer read; not-like `viking.valkyrie`
- `secret.mace_spinner`: must-match rotating dual-mace brute silhouette; not-like `secret.ball_n_chain`
- `secret.clams`: must-match giant shell and pearl core, comedy artillery shell-body; not-like `secret.bank_robbers`
- `secret.present_elf`: must-match gift box and festive support silhouette; not-like `farmer.potion_seller`
- `secret.ice_mage`: must-match staff caster with cold read, not a plain wizard; not-like `good.chronomancer`
- `secret.infernal_whip`: must-match whip and fire trail identity; not-like `wild_west.lasso`
- `secret.bank_robbers`: must-match safe + robber group, asymmetrical carried-safe silhouette; not-like `secret.clams`
- `secret.witch`: must-match pointed hat and summoner posture; not-like `secret.necromancer`
- `secret.banshee`: must-match pale floating wraith body, trailing ghost silhouette; not-like `spooky.vampire`
- `secret.necromancer`: must-match bone staff, pale undead caster, revival identity; not-like `secret.witch`
- `secret.solar_architect`: must-match halo + staff, holy mage geometry, premium support mage read; not-like `good.chronomancer`
- `secret.wheelbarrow_dragon`: must-match wheelbarrow base + dragon head hybrid; not-like `farmer.wheelbarrow`
- `secret.skeleton_giant`: must-match giant bony shoulders and undead giant crown; not-like `secret.tree_giant`
- `secret.bomb_cannon`: must-match heavy bomb artillery with exposed pirate gunner; not-like `pirate.cannon`
- `secret.cavalry`: must-match horse + elite rider + lance, royal mounted silhouette; not-like `renaissance.jouster`
- `secret.vlad`: must-match regal spear and vampire collar noble silhouette; not-like `secret.blackbeard`
- `secret.gatling_gun`: must-match exposed crank gun and barrel cluster, pirate-industrial carriage; not-like `secret.bomb_cannon`
- `secret.blackbeard`: must-match captain hat, pistol + cutlass, broad pirate boss mass; not-like `secret.vlad`
- `secret.samurai_giant`: must-match giant samurai armor and oversized katana; not-like `secret.shogun`
- `secret.ullr`: must-match archer-hunter silhouette with bow and secondary axe cue; not-like `secret.artemis`
- `secret.lady_red_jade`: must-match red royal duelist silhouette, elite sword hero pose; not-like `secret.shogun`
- `secret.sensei`: must-match lighter throwing-master robe/hat silhouette; not-like `secret.shogun`
- `secret.shogun`: must-match bannered samurai commander mass, heavier than Sensei; not-like `dynasty.samurai`
- `secret.tree_giant`: must-match bark/branch giant body, nature colossal read; not-like `secret.ice_giant`
- `secret.artemis`: must-match radiant hero halo + bow-forward premium archer silhouette; not-like `secret.ullr`
- `secret.ice_giant`: must-match crystalline horns/shards, blue brute colossal silhouette; not-like `secret.tree_giant`
