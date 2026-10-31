# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 438   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 55/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner -+++ o | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
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
438 (BASE 21b12f07; no evidence commit): [S] harpooner b.1 off fist on the bar (da4b3767) struck 1, b PASS | [S] vampire a.1 slicked hair (16a75717) struck 1 | [S] vampire c.2 bite latch (29201909, e6949b0d) dropped (pose not in _release; reverted b4b1c75c, d41514a2) | [S] candlehead a.1 candle tower (584ca625) struck 1 | [S] pumpkin_catapult b.1 bone arm + crossbars (757d7237) struck 1, b PASS | [S] pumpkin_catapult a.2 banners (9dbd09aa) struck 2 | [S] skeleton_archer a.2 no skirt, belt + tassels (c24646b8) struck 2 | [P] queen a.1 QUEEN_FRAME tall .85 (2a71c0b0) no strike - 7/8, 6 struck
437 (BASE 204abad4; no evidence commit): [S] swordcaster a.3 skirt (20cb7a7d, f6be7769) struck 3, a PASS, CONFIRM 4/4 -> D | [S] skeleton_warrior a.1 Roman helmet (ac15ce9c) struck 1 | [S] skeleton_archer a.1 hood + capelet (a3202b9b) struck 1 | [S] queen a.1 QUEEN_FRAME narrow (b5120813) width clause of 1 struck | [R] harpooner b gun carry (0799890a) struck 2 | [S] vampire c.1 bat form (2c02833c) struck 1 | [S] pumpkin_catapult b.2 rib cradle (3c42103f) struck 2 - 7/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.harpooner (da4b3767) VERDICT: APPROVE CRITERION: pirate.harpooner.b PASS   (previous: FAIL)
- GAP: [S] spooky.vampire (16a75717) VERDICT: APPROVE CRITERION: spooky.vampire.a FAIL   (previous: FAIL)
- GAP: [S] spooky.candlehead (584ca625) VERDICT: APPROVE CRITERION: spooky.candlehead.a FAIL   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (757d7237) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.b PASS   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (9dbd09aa) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (c24646b8) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.a FAIL   (previous: FAIL)
- GAP: [P] pirate.pirate_queen (2a71c0b0) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- REGRESSIONS: none
## Notes for next iteration (max 5 lines)
- Harpooner a is plateau and starves at 440 (no a attempt since 434): one [R] from every CONFIRM a list (spec in its Ranked gaps).
- Vampire c bite dropped at 438 (sim latch worked, the pose did not show: he leaned back facing away); see its unit Notes and git show 29201909 before retrying.
- Starving: reaper a at 441 and c at 442 (last 435/436); skeleton_warrior a.3 shorts and a.4 greaves still open from 437.
- [P] fallouts open: pumpkin_catapult a.1 near-black frame, skeleton_archer a.3 cream bone (critic 438, fallout of 438 [S]).
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
