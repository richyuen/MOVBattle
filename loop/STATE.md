# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 453   Batch: wild_west (9/14)   Consecutive empty: 0   Done: 66/139   Parked: 0
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
wild_west: dynamite_thrower -+++ o | miner --++ o | cactus ++++ D | gunslinger ++++ D | lasso -+++ o | deadeye ++-+ o | quick_draw ++++ D
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
453 (BASE 9a3ab6a1): [S] quick_draw a.2 no tunic skirt (f1e7c5e9) struck 2, a PASS; CONFIRM passed a; quick_draw D | [S] dynamite a.4 DYNAMITE_BOOTS (7d3f3350) struck 4 | [S] gunslinger a.4 GUNSLINGER_SHOES (de84002b) struck 4, a PASS; CONFIRM passed a; gunslinger D | [S] deadeye a.4 WESTERN_BRAID (ca4802eb) struck 4, a PASS; CONFIRM passed a, b, failed c (3 new) | [S] miner a.3 MINER_UPRIGHT (8e7167ae) struck 3 | [S] miner b.1 PICK_SHOULDER (0a616333) approved, none struck | [S] lasso a.2 pinto colours out of the glow (37b8faec) struck 2 | [P] dynamite DYNAMITE_SKIRT.teamGlow 0 (13a8ccd3) approved - 8/8, 6 struck
452 (BASE 8a086de6): [S] dynamite b.1 DYNAMITE_HOLD resubmit + throwWindupCap (8326af8e) struck 1, b PASS | [S] dynamite a.2 DYNAMITE_SKIRT (d87b2f79) struck 2 | [S] quick_draw a.1 QUICK_DRAW_VEST (1da9827a) struck 1 | [S] gunslinger a.2 GUNSLINGER_REST (608df0a6) struck 2 | [S] deadeye a.3 GUN_BELT pouches (f7038a83) struck 3 | [S] miner a.4 MINER_BOOTS (e0e391fd) struck 4, a PASS; CONFIRM failed a, b (5 new), passed c | [S] cactus a.3 tan spikes + hood ring (81fef625) struck 3, a PASS; CONFIRM passed a, b, c; cactus D - 7/7, 7 struck
451 (BASE 3ac8ee79): [S] dynamite b.1 DYNAMITE_HOLD (c3d7f4df) rejected (no throw, c regression), reverted by hand 8a086de6 | [S] lasso b.1 LASSO_RAISE (363add1b) struck 1, b PASS | [S] miner c.2 _aimPick (1a48b2d8) struck 2, c PASS | [S] gunslinger a.3 GUN_BELT (709dbc19) struck 3 | [S] quick_draw a.3 GUN_BELT (1e4fd4d6) struck 3, a PASS; CONFIRM failed a (2 new), passed b, c | [S] deadeye a.2 DEADEYE_SHIRT (09138420) struck 2 | [R] cactus a CACTUS_ROBE (1a160cdf) struck 2, 4, plateau cleared - 6/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] wild_west.quick_draw (f1e7c5e9) VERDICT: APPROVE CRITERION: wild_west.quick_draw.a PASS   (previous: FAIL)
- GAP: [S] wild_west.dynamite_thrower (7d3f3350) VERDICT: APPROVE CRITERION: wild_west.dynamite_thrower.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.gunslinger (de84002b) VERDICT: APPROVE CRITERION: wild_west.gunslinger.a PASS   (previous: FAIL)
- GAP: [S] wild_west.deadeye (ca4802eb) VERDICT: APPROVE CRITERION: wild_west.deadeye.a PASS   (previous: FAIL)
- GAP: [S] wild_west.miner (8e7167ae) VERDICT: APPROVE CRITERION: wild_west.miner.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.miner (0a616333) VERDICT: APPROVE CRITERION: wild_west.miner.b FAIL   (previous: FAIL)
- GAP: [S] wild_west.lasso (37b8faec) VERDICT: APPROVE CRITERION: wild_west.lasso.a FAIL   (previous: FAIL)
- GAP: [P] wild_west.dynamite_thrower (13a8ccd3) VERDICT: APPROVE CRITERION: wild_west.dynamite_thrower.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 453: UNIT wild_west.quick_draw: a PASS b PASS c PASS d PASS (4/4) | UNIT wild_west.gunslinger: a PASS b PASS c PASS d PASS (4/4) | UNIT wild_west.deadeye: a PASS b PASS c FAIL d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Deadeye c (CONFIRM 453): she fires from the shoulder carry; TABS levels the Winchester at the chest in both hands through the shot (the musketeer's _aimMusket). Blocker 3 (bullet streak) needs evidence first: fire at 17 ms, target hurt at 100 ms, no bullet in flight in the pair.
- Miner b: PICK_SHOULDER approved without a strike (fists at the chest, haft foot at the hip); the resubmit lands the palm at the chin and the off fist on the haft. Miner a: MINER_HAT, overall legs, sleeves.
- Dynamite a: only the braid left - westernBraid(scene, body, -1) is built (WESTERN_BRAID). Lasso a: only the horse head (PINTO_HEAD rebuild), plus the [P] lighter coat.
- Pinto colours (453): the glow layer's bloom washed the coat to yellow; it and the patches are now cloth out of the glow. Big lit barrels wash high-green codes to yellow.
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
