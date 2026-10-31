# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 439   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 56/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior -+++ o | skeleton_archer -+++ o | candlehead -+++ o | vampire -+-+ o | pumpkin_catapult -+++ o | swordcaster ++++ D | reaper -+-+ o
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
439 (BASE eb4676ee; no evidence commit): [S] skeleton_warrior a.3 shorts (e3336ba6) struck 3 | [S] skeleton_archer a.4 bracers + boots (bc447f44) struck 4, added 5 | [S] pumpkin_catapult a.3 skeleton operator (6e88e2f5) no strike | [S] candlehead a.2 robe + V bib (b10d272a) struck 2 | [S] vampire a.3 collar (09b87480, 3cdade49) struck 3 | [S] reaper a.2 hover legs (e97d690a) no strike | [S] vampire c.2 bite (65a0e9f5, 94797a8b) dropped (reverted 0ec49d76, a2a6e6db) | [P] queen a.1 scale 1.2 (65339e86) no strike | harpooner CONFIRM b passed -> D - 7/8, 4 struck
438 (BASE 21b12f07; no evidence commit): [S] harpooner b.1 off fist on the bar (da4b3767) struck 1, b PASS | [S] vampire a.1 slicked hair (16a75717) struck 1 | [S] vampire c.2 bite latch (29201909, e6949b0d) dropped (pose not in _release; reverted b4b1c75c, d41514a2) | [S] candlehead a.1 candle tower (584ca625) struck 1 | [S] pumpkin_catapult b.1 bone arm + crossbars (757d7237) struck 1, b PASS | [S] pumpkin_catapult a.2 banners (9dbd09aa) struck 2 | [S] skeleton_archer a.2 no skirt, belt + tassels (c24646b8) struck 2 | [P] queen a.1 QUEEN_FRAME tall .85 (2a71c0b0) no strike - 7/8, 6 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.skeleton_warrior (e3336ba6) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.a FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (bc447f44) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.a FAIL   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (6e88e2f5) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a FAIL   (previous: FAIL)
- GAP: [S] spooky.candlehead (b10d272a) VERDICT: APPROVE CRITERION: spooky.candlehead.a FAIL   (previous: FAIL)
- GAP: [S] spooky.vampire (09b87480, 3cdade49) VERDICT: APPROVE CRITERION: spooky.vampire.a FAIL   (previous: FAIL)
- GAP: [S] spooky.reaper (e97d690a) VERDICT: APPROVE CRITERION: spooky.reaper.a FAIL   (previous: FAIL)
- GAP: [P] pirate.pirate_queen (65339e86) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM pirate.harpooner: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- Queen a is plateau (CONFIRM failed a at 431 and 434): her next pick is one [R] on height and build (queenFrame torso and leg chain to the captain's height); the scale row spent its exception at 439.
- Vampire c bite dropped twice in a row (438, 439; attempts 2 counted as dropped): read its unit Notes and probe yaw/pitch before any third try.
- Shared fix worth first: cream self-lit bone in dressSkeleton clears warrior a.2 and archer a.3; the catapult operator's bones render team (re-tint after addOperator's callback).
- Starving: reaper c at 442 (last 436); its named shot _flight may need an evidence commit first.
- Captures run ~5 s a shot (8 units ~7 min): background them and wait with a node poll on the output file.
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
