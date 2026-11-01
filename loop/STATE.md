# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 452   Batch: wild_west (8/14)   Consecutive empty: 0   Done: 64/139   Parked: 0
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
wild_west: dynamite_thrower -+++ o | miner --++ o | cactus ++++ D | gunslinger -+++ o | lasso -+++ o | deadeye -+++ o | quick_draw -+++ o
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
452 (BASE 8a086de6): [S] dynamite b.1 DYNAMITE_HOLD resubmit + throwWindupCap (8326af8e) struck 1, b PASS | [S] dynamite a.2 DYNAMITE_SKIRT (d87b2f79) struck 2 | [S] quick_draw a.1 QUICK_DRAW_VEST (1da9827a) struck 1 | [S] gunslinger a.2 GUNSLINGER_REST (608df0a6) struck 2 | [S] deadeye a.3 GUN_BELT pouches (f7038a83) struck 3 | [S] miner a.4 MINER_BOOTS (e0e391fd) struck 4, a PASS; CONFIRM failed a, b (5 new), passed c | [S] cactus a.3 tan spikes + hood ring (81fef625) struck 3, a PASS; CONFIRM passed a, b, c; cactus D - 7/7, 7 struck
451 (BASE 3ac8ee79): [S] dynamite b.1 DYNAMITE_HOLD (c3d7f4df) rejected (no throw, c regression), reverted by hand 8a086de6 | [S] lasso b.1 LASSO_RAISE (363add1b) struck 1, b PASS | [S] miner c.2 _aimPick (1a48b2d8) struck 2, c PASS | [S] gunslinger a.3 GUN_BELT (709dbc19) struck 3 | [S] quick_draw a.3 GUN_BELT (1e4fd4d6) struck 3, a PASS; CONFIRM failed a (2 new), passed b, c | [S] deadeye a.2 DEADEYE_SHIRT (09138420) struck 2 | [R] cactus a CACTUS_ROBE (1a160cdf) struck 2, 4, plateau cleared - 6/7, 7 struck
450 (BASE a8ee9d95; the user reopened the parked queen and asked for her alone): [R] queen a QUEEN_LEGLINE hip .5, hem .42 slanting to her right, slim pale legs, slim knee boots, no tunicSkirt, fists at the hips (e97878d5) + follow-up no cape (b5bd76ed) struck 2, a PASS; CONFIRM passed a; queen D; pirate checkpoint 12/12 green, pirate dropped from Batch - 1/1, 1 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] wild_west.dynamite_thrower.b blocker 1 (8326af8e) VERDICT: APPROVE CRITERION: wild_west.dynamite_thrower.b PASS   (previous: FAIL)
- GAP: [S] wild_west.dynamite_thrower.a blocker 2 (d87b2f79) VERDICT: APPROVE CRITERION: wild_west.dynamite_thrower.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.quick_draw.a blocker 1 (1da9827a) VERDICT: APPROVE CRITERION: wild_west.quick_draw.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.gunslinger.a blocker 2 (608df0a6) VERDICT: APPROVE CRITERION: wild_west.gunslinger.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.deadeye.a blocker 3 (f7038a83) VERDICT: APPROVE CRITERION: wild_west.deadeye.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.miner.a blocker 4 (e0e391fd) VERDICT: APPROVE CRITERION: wild_west.miner.a PASS   (previous: FAIL)
- GAP: [S] wild_west.cactus.a blocker 3 (81fef625) VERDICT: APPROVE CRITERION: wild_west.cactus.a PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 452: UNIT wild_west.miner: a FAIL b FAIL c PASS d PASS (2/4) | UNIT wild_west.cactus: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- STARVATION at 453: lasso a (last attempt 448) takes a slot - its 448 list (horse head, horse colour).
- Miner (CONFIRM 452): he shows his back in unit_wild_west.miner_idle and lineup_wild_west (no face) - evidence first: find why he faces away before his a face gap; b wants the _windup two-hand shoulder carry held at rest.
- Team garments: QUICK_DRAW_VEST (team cloth x.9 on the body cloth, head/hands kept) clears the brown wildwest_leather vest; the deadeye vest and the dynamite trunk still wear it (critic 452 defects, not blockers).
- quick_draw a: only blocker 2 left - the flared tunic hem under the belt (gate the hangSkirt branch off). gunslinger a: only shoes. deadeye a: only the braid.
- Red-team wild_west body cloth reads tan (faction tint + warm hue shift); team-coloured garments need explicit team cloth, not body.bodyMaterial.
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
