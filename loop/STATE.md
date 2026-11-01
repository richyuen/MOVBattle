# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 456   Batch: wild_west (12/14)   Consecutive empty: 0   Done: 69/139   Parked: 0
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
wild_west: dynamite_thrower ++++ D | miner -+++ o | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
456 (BASE a89c58e0): [S] deadeye c.1 receiver seated in the fist + overlay off + hip aim, aimed at the chest (65b9d4eb, b831338d) struck 1 | [S] deadeye c.2 recoil slide (da3c6b53) struck 2, c PASS; CONFIRM passed c; deadeye D | [S] lasso a.3 LASSO_SHIRT + hem (3956ccec, 14478070) struck 3, a PASS; CONFIRM passed a; lasso D | [R] dynamite a DYNAMITE_LOOK hat lift + bandanna (a089b2c5) struck 1, 2, a PASS; CONFIRM passed a; dynamite D - 4/4, 5 struck
455 (BASE fa4523ed): [S] deadeye c.1 levelledGun + hip aim (b5b86f36) rejected, reverted c6329a96 | [S] deadeye c.3 RIFLE_TRACER (a5310afa) struck 3 | [S] dynamite a.1-2 DYNAMITE_SHIRT (905d3fd4, 9e286699) struck 1, 2, a PASS; CONFIRM passed b, c, failed a (2 new; a plateau) | [S] miner a.2 MINER_LEGS (63a28bba, 8ad8d441) struck 2 | [S] miner a.4 MINER_SLEEVES (b906f385) struck 4, a PASS; CONFIRM passed b, c, failed a (2 new; a plateau) | [S] lasso a.2 LASSO_MOUSTACHE (5517a3ff) struck 2 | [S] lasso a.1 PINTO_LEGS (e3f0ab28) struck 1 - 6/7, 6 struck
454 (BASE 47cef1b6): evidence deadeye flightAt 3 ticks (087954a5) | [S] deadeye c.1 WINCHESTER_AIM + GUN_WARMUP (6a7b4719) approved, none struck | [S] dynamite a.3 WESTERN_BRAID (e92d6925) struck 3, a PASS; CONFIRM passed b, c, failed a (2 new) | [S] miner a.1 MINER_HAT (96109e64) struck 1 | [S] miner b.1 PICK_SHOULDER palm at the chin (aeb80c8a) struck 1, b PASS | [S] lasso a.1 PINTO_HEAD + PINTO_BEAD (641323cc) struck 1, a PASS; CONFIRM passed b, c, failed a (3 new) - 5/5, 4 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] wild_west.deadeye (65b9d4eb, b831338d) VERDICT: APPROVE CRITERION: wild_west.deadeye.c FAIL   (previous: FAIL)
- GAP: [S] wild_west.deadeye (da3c6b53) VERDICT: APPROVE CRITERION: wild_west.deadeye.c PASS   (previous: FAIL)
- GAP: [S] wild_west.lasso (3956ccec, 14478070) VERDICT: APPROVE CRITERION: wild_west.lasso.a PASS   (previous: FAIL)
- GAP: [R] wild_west.dynamite_thrower (a089b2c5) VERDICT: APPROVE CRITERION: wild_west.dynamite_thrower.a PASS   (previous: FAIL, plateau)
- REGRESSIONS: none
- CONFIRM 456: UNIT wild_west.deadeye: a PASS b PASS c PASS d PASS (4/4) | UNIT wild_west.dynamite_thrower: a PASS b PASS c PASS d PASS (4/4) | UNIT wild_west.lasso: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- Only the miner is open in wild_west: a is plateau (CONFIRM 452, 455), so its pick is one [R] - a slim lanky build (unitVisuals bulk 1.22 / scale 1.12, MINER_OVERALLS waist slab .over 1.06, legs to half the height) keeping hat, moustache, braces, dark legs, sleeves, gloves, boots.
- Tail overlap (step 2): wild_west has under 5 pickable [S] and legacy_1 is unaudited - audit legacy_1 next iteration and pick from both (Batch: wild_west+legacy_1).
- The default tunic hem is hung later in body.bodyMaterial (unitFactory): a unit re-dressed in team cloth needs its hem branch too (456 lasso).
- A gun held in the fist keeps the carry's offset in the hand when turned about its pivot: seat its receiver on the wrist joint (456 deadeye).
- Team cloth: teamColor x .55 reads as the pale team colour in the hazy idle; "dark team" wants x .3-.35.
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
