# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 437   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 55/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner --++ o | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior -+++ o | skeleton_archer -+++ o | candlehead -+++ o | vampire -+-+ o | pumpkin_catapult --++ o | swordcaster ++++ D | reaper -+-+ o
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
437 (BASE 204abad4; no evidence commit): [S] swordcaster a.3 skirt (20cb7a7d, f6be7769) struck 3, a PASS, CONFIRM 4/4 -> D | [S] skeleton_warrior a.1 Roman helmet (ac15ce9c) struck 1 | [S] skeleton_archer a.1 hood + capelet (a3202b9b) struck 1 | [S] queen a.1 QUEEN_FRAME narrow (b5120813) width clause of 1 struck | [R] harpooner b gun carry (0799890a) struck 2 | [S] vampire c.1 bat form (2c02833c) struck 1 | [S] pumpkin_catapult b.2 rib cradle (3c42103f) struck 2 - 7/7, 7 struck
436 (BASE 29e883f3; evidence 29e883f3 archer burn on the struck man): [S] harpooner b.2 hip carry (b4465c82) struck 2, b PASS; CONFIRM failed a, b (both plateau) | [S] skeleton_warrior b.2 sword (63a08a9f) struck 2, b PASS | [S] skeleton_archer b.1 bone bow (b5fd9a36) struck 1, b PASS | [S] candlehead b.1 candle arms (4202591b) struck 1, b PASS | [S] swordcaster a.2 cuirass (89b8eb03) struck 2, 4 | [S] reaper c.1 shockwave (30c492bd) struck 1 | [S] queen a.1 upright stance (bdf2f44d) struck 3 - 7/7, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.swordcaster (20cb7a7d, f6be7769) VERDICT: APPROVE CRITERION: spooky.swordcaster.a PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_warrior (ac15ce9c) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.a FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (a3202b9b) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.a FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (b5120813) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- GAP: [R] pirate.harpooner (0799890a) VERDICT: APPROVE CRITERION: pirate.harpooner.b FAIL   (previous: FAIL)
- GAP: [S] spooky.vampire (2c02833c) VERDICT: APPROVE CRITERION: spooky.vampire.c FAIL   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (3c42103f) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.b FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT spooky.swordcaster: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- Harpooner: a is plateau (next pick one [R] from every CONFIRM a list); b back to [S]: the off fist falls short of HARPOON_OFF_GRIP at rest.
- Queen a: only the height clause left; [P] fallout QUEEN_FRAME trunk-height cut ~.85 (do not touch the 435 scale row).
- Starving at 439: vampire a, pumpkin_catapult a, candlehead a (no attempt since 434/436). Reaper a.2 legs and c.2 impale untouched since 436.
- Skeleton skirt/bones live in unitFactory dressSkeleton, shared by warrior and archer: per-unit changes key on the unit id.
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
