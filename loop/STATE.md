# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 500   Batch: evil+secret_1   Consecutive empty: 0   Done: 98/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh ++++ D | wizard ++++ D | chariot ++++ D | thor ++++ D | tank ++++ D | super_boxer ++++ D | dark_peasant ++++ D | super_peasant ++++ D
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin ++++ D | divine_arbiter ++++ D | sacred_elephant ++++ D | chronomancer ++++ D
evil: shadow_walker ++++ D | exiled_sentinel ++++ D | mad_mechanic ++++ D | void_cultist ++++ D | tempest_lich ++++ D | death_bringer -+++ o | void_monarch ---+ o
secret_1: ballooner ---+ o | bomb_on_a_stick ---+ o | fan_bearer ---+ o | raptor ---+ o | the_teacher ---+ o | jester ---+ o | ball_n_chain ---+ o | chu_ko_nu ---+ o | executioner -+-+ o | shouter -+-+ o
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 500; BASE b4d5ff95; secret_1 audited (tail overlap) and stats b4d5ff95, d PASS 10/10)
1. [R] evil.tempest_lich.a blocker 1 (fd7a3c00, 3b39c687) APPROVE, struck 1; a PASS; CONFIRM passed all: D.
2. [S] evil.death_bringer.a blocker 5 (5483a3d7) APPROVE, struck 5.
3. [S] evil.death_bringer.a blocker 6 (6e0424e3, 8643adb8) APPROVE, struck 6; critic a PASS, CONFIRM failed a (4 new).
4. [S] evil.void_monarch.a blocker 2 (ce31248d, 2b00b363) APPROVE, struck 2; critic a PASS, CONFIRM failed a, b, c.
5. [S] secret.executioner.b blocker 1 (e6fa1e1f) APPROVE, struck 1; b PASS.
6. [S] secret.shouter.a blocker 1 (62fb739c) APPROVE, struck 1.
7. [S] secret.fan_bearer.b blocker 1 (69b5ae21) APPROVE, struck 1.
- 7/7, 7 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] evil.tempest_lich (fd7a3c00, 3b39c687) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.a PASS   (previous: FAIL)
- GAP: [S] evil.death_bringer (5483a3d7) | VERDICT: APPROVE | CRITERION: evil.death_bringer.a FAIL   (previous: FAIL; flips to PASS with gap 3, see below)
- GAP: [S] evil.death_bringer (6e0424e3, 8643adb8) | VERDICT: APPROVE | CRITERION: evil.death_bringer.a PASS   (previous: FAIL)
- GAP: [S] evil.void_monarch (ce31248d, 2b00b363) | VERDICT: APPROVE | CRITERION: evil.void_monarch.a PASS   (previous: FAIL)
- GAP: [S] secret.executioner (e6fa1e1f) | VERDICT: APPROVE | CRITERION: secret.executioner.b PASS   (previous: FAIL)
- GAP: [S] secret.shouter (62fb739c) | VERDICT: APPROVE | CRITERION: secret.shouter.a FAIL   (previous: FAIL)
- GAP: [S] secret.fan_bearer (69b5ae21) | VERDICT: APPROVE | CRITERION: secret.fan_bearer.b FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT evil.tempest_lich: a PASS b PASS c PASS d PASS (4/4); UNIT evil.death_bringer: a FAIL b PASS c PASS d PASS (3/4); UNIT evil.void_monarch: a FAIL b FAIL c FAIL d PASS (1/4)

## Notes for next iteration (max 5 lines)
- Open evil: death bringer a (CONFIRM 500 list: leg build, hair, mask, bib); monarch a, b, c (CONFIRM 500: bone colour/yoke, beak mask, broad swords, demon form not reading). Both fail-once on CONFIRM.
- Evidence first: lineup_secret is a dense crowd, the critic could not place secret units in it (critic 500): re-aim the secret lineup in capture.mjs before a-blocker picks rely on it.
- Monarch c: DEMON_FORM at ~4.9 s shows him tipping in the pile; check the _ability pair frames the float before a mechanic change.
- secret_1 audit 500 (audit.md, audit2.md): raptor body wants a rebuild-sized change; ballooner/jester carry leftover shuriken props.
- Stats 13/13 d PASS (500).
