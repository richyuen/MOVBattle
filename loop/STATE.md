# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 434   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 54/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner +-++ o | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior ---+ o | skeleton_archer ---+ o | candlehead ---+ o | vampire -+-+ o | pumpkin_catapult ---+ o | swordcaster -+++ o | reaper -+-+ o
wild_west: dynamite_thrower ???? q | miner ???? q | cactus ???? q | gunslinger ???? q | lasso ???? q | deadeye ???? q | quick_draw ???? q
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
434 (BASE 673afe9f; tail overlap, spooky audited, stats 33bb56af): [S] harpooner a.3 shoe shell (10346a0f, 8c62322b) struck 3, a PASS; CONFIRM passed a, failed b | [S] queen a.3 dreads (2f1f2b92) struck 3, a PASS; CONFIRM failed a (2nd: plateau) | [S] vampire b.1 claws (b8e42cdb) struck 1, b PASS | [S] skeleton_warrior b.1 shield (d65f38af) struck 1 | [S] pumpkin_catapult c.1 pumpkin (008ebd5c) struck 1 | [S] skeleton_archer c.1 fire arrow (9c6221b2) struck 1 | [S] candlehead c.1 spirit fire (7ae6e9c8) struck 1 - 7/7, 7 struck
433 (BASE 96b937e4; plateau [R] monkey_king a): [R] monkey_king a.3 leg cut off the knee joint (d21e71e8, 890391e8) struck 3, a PASS; CONFIRM passed, D | [S] captain a.2 peaked tricorn (1543b25e) struck 2 | [S] captain a.3 shirt+vest+sash (5033a559) struck 3, a PASS; CONFIRM passed, D | [S] harpooner a.3 shoes+socks (ad0be350, 17ca01c7) approved, none struck | [S] queen a.1 skirt front + slim pants (c521e5f2) struck 1 | [S] queen a.2 shirt+sleeves (c9dcb0cd, c4ad8740) struck 2 - 6/6, 5 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.harpooner (10346a0f, 8c62322b) VERDICT: APPROVE CRITERION: pirate.harpooner.a PASS   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (2f1f2b92) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a PASS   (previous: FAIL)
- GAP: [S] spooky.vampire (b8e42cdb) VERDICT: APPROVE CRITERION: spooky.vampire.b PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_warrior (d65f38af) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.b FAIL   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (008ebd5c) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.c FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (9c6221b2) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.c FAIL   (previous: FAIL)
- GAP: [S] spooky.candlehead (7ae6e9c8) VERDICT: APPROVE CRITERION: spooky.candlehead.c FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT pirate.harpooner: a PASS b FAIL c PASS d PASS (3/4) | UNIT pirate.pirate_queen: a FAIL b PASS c PASS d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Batch pirate+spooky: pirate open harpooner b (bayonet, low carry; CONFIRM 434 list), queen a plateau: one [R] (slim build, red-brown boots, bomb sash) next.
- Spooky audited 434 (stats d 7/7, 33bb56af); swordcaster and reaper unattempted; new dress goes in web/src/units/spookyDress.ts (created 434).
- Shared 434: "stiffy" ShieldType (round branch), "pumpkin" + "spirit_fire" ProjectileShapes, FIRE_ARROWS set (simulationSystem) + _dressFireArrow.
- Captures with 4+ units run 15-25 min: run in the background, wait with an until-loop.
## Unit file template (loop/units/<id>.md, cap 3200 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> - TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] <criterion> <gap> - blocker <n>: <mechanism> - ref: <file> - ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] - iter: what - critic's top defect)
## Notes (max 3 lines)
```
