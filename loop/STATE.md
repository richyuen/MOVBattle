# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 451   Batch: wild_west (7/14)   Consecutive empty: 0   Done: 63/139   Parked: 0
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
wild_west: dynamite_thrower --++ o | miner -+++ o | cactus -+++ o | gunslinger -+++ o | lasso -+++ o | deadeye -+++ o | quick_draw -+++ o
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
451 (BASE 3ac8ee79): [S] dynamite b.1 DYNAMITE_HOLD (c3d7f4df) rejected (no throw, c regression), reverted by hand 8a086de6 | [S] lasso b.1 LASSO_RAISE (363add1b) struck 1, b PASS | [S] miner c.2 _aimPick (1a48b2d8) struck 2, c PASS | [S] gunslinger a.3 GUN_BELT (709dbc19) struck 3 | [S] quick_draw a.3 GUN_BELT (1e4fd4d6) struck 3, a PASS; CONFIRM failed a (2 new), passed b, c | [S] deadeye a.2 DEADEYE_SHIRT (09138420) struck 2 | [R] cactus a CACTUS_ROBE (1a160cdf) struck 2, 4, plateau cleared - 6/7, 7 struck
450 (BASE a8ee9d95; the user reopened the parked queen and asked for her alone): [R] queen a QUEEN_LEGLINE hip .5, hem .42 slanting to her right, slim pale legs, slim knee boots, no tunicSkirt, fists at the hips (e97878d5) + follow-up no cape (b5bd76ed) struck 2, a PASS; CONFIRM passed a; queen D; pirate checkpoint 12/12 green, pirate dropped from Batch - 1/1, 1 struck
449 (BASE e8d950ab): [R] queen a QUEEN_LEGLINE (b27052fd) rejected, reverted aeadca2f, a parked, queen p | [S] dynamite b.2 DYNAMITE_WIRES (3adeea7c) struck 2 | [S] deadeye a.1 PEAK_HAT (33c4d5f0) struck 1 | [S] dynamite a.1 PEAK_HAT (221f3f5a) struck 1 | [S] cactus a.2 CACTUS_BOOTS resubmit (a4b9b357) rejected, reverted 54cb5a91, a plateau | [S] gunslinger a.1 GUNSLINGER_SUIT (b52941b5, 129f319c) struck 1 | [S] miner a.2 MINER_MOUSTACHE (85c21cb8) struck 2; quick_draw belt not picked - 5/7, 5 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] wild_west.dynamite_thrower (c3d7f4df) VERDICT: REJECT CRITERION: wild_west.dynamite_thrower.b FAIL   (previous: FAIL)
- GAP: [S] wild_west.lasso (363add1b) VERDICT: APPROVE CRITERION: wild_west.lasso.b PASS   (previous: FAIL)
- GAP: [S] wild_west.miner (1a48b2d8) VERDICT: APPROVE CRITERION: wild_west.miner.c PASS   (previous: FAIL)
- GAP: [S] wild_west.gunslinger (709dbc19) VERDICT: APPROVE CRITERION: wild_west.gunslinger.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.quick_draw (1e4fd4d6) VERDICT: APPROVE CRITERION: wild_west.quick_draw.a PASS   (previous: FAIL)
- GAP: [S] wild_west.deadeye (09138420) VERDICT: APPROVE CRITERION: wild_west.deadeye.a FAIL   (previous: FAIL)
- GAP: [R] wild_west.cactus (1a160cdf) VERDICT: APPROVE CRITERION: wild_west.cactus.a FAIL   (previous: FAIL)
- REGRESSIONS: wild_west.dynamite_thrower.c -> attributed to c3d7f4df (reverted)
- CONFIRM 451: UNIT wild_west.quick_draw: a FAIL b PASS c PASS d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Dynamite: her throw windup is cd x .36 (~30 s at cd 49.5x), so the capture never sees a throw ("target never hurt" 449, 451). The b hold resubmit must release on the fire, and her c needs a short throw (card warm-up 1 s) to show; with the hold reverted the bundle covers her head in the idle again (evidence item back).
- quick_draw a (CONFIRM 451): the brown wildwest_leather vest on red (team cloth vest, GUNSLINGER_SUIT pattern) and the tunic skirt under the belt (gate it off). The deadeye wears the same leather vest (critic 451 defect).
- cactus a: only blocker 3 left - tan broad spikes (pick off palette.png, the spine cloth reads maroon) and a hood ring + sleeve rows in the grid.
- Red-team wild_west body cloth reads tan (faction tint + warm hue shift); team-coloured garments need explicit team cloth (GUNSLINGER_SUIT pattern), not body.bodyMaterial.
- STARVATION check at 452: lasso a (last 448), gunslinger a arm pose (448 list), miner a boots (last 449).
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
