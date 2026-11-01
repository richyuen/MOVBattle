# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 448   Batch: pirate+wild_west (6/14)   Consecutive empty: 0   Done: 62/139   Parked: 0
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
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower --++ o | miner -+-+ o | cactus -+++ o | gunslinger -+++ o | lasso --++ o | deadeye -+++ o | quick_draw -+++ o
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
448 (BASE 2779a649): [S] lasso a.3 FLAT_HAT (fac00c2d) struck 3 | [S] gunslinger a.4 GUNSLINGER_SIDEBURNS (7082f6e9) struck 4, a PASS; CONFIRM failed a (4 new), passed b, c | [S] cactus a.2 CACTUS_BOOTS (2f5a4704) rejected-kept (revert conflicted) | [S] deadeye b.1 WINCHESTER (2d87dded) struck 1, b PASS | [S] quick_draw a.2 QUICK_DRAW_SHIRT (3ca4f7f6) struck 2 | [S] miner a.3 MINER_OVERALLS (dbef099f) struck 3 | [P] miner MINER_BLAST.scale .5 (a0f3a4b7) approved; miner c pick swing not picked (halberd chop rig shared with his idle grip); queen [R] deferred - 6/7, 5 struck
447 (BASE 76731ee0; evidence 50b415b5 lasso b.1 re-aimed to _idle): [S] quick_draw c.2 QUICK_FAN (df90098f) struck 2, c PASS | [S] quick_draw a.1 FLAT_HAT (8440b9e4) struck 1+4 | [S] miner a.1 MINER_CAP (e7018233, b579c896) struck 1 | [S] miner c.1 MINER_BLAST (1796e237) struck 1 | [S] gunslinger a.3 GUNSLINGER_TIE (28aec26d) struck 3+2 | [S] lasso a.1 PINTO_HEAD (1db23f8a) approved, struck 4 | [S] cactus a.1 CACTUS_SLEEVE (f263e7a6) struck 1 | [P] lasso PINTO_COAT (c082222c) dropped, invisible (reverted cbd79d83); lasso b coil not picked; queen [R] deferred - 7/8, 9 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] wild_west.lasso (fac00c2d) VERDICT: APPROVE CRITERION: wild_west.lasso.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.gunslinger (7082f6e9) VERDICT: APPROVE CRITERION: wild_west.gunslinger.a PASS   (previous: FAIL)
- GAP: [S] wild_west.cactus (2f5a4704) VERDICT: REJECT CRITERION: wild_west.cactus.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.deadeye (2d87dded) VERDICT: APPROVE CRITERION: wild_west.deadeye.b PASS   (previous: FAIL)
- GAP: [S] wild_west.quick_draw (3ca4f7f6) VERDICT: APPROVE CRITERION: wild_west.quick_draw.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.miner (dbef099f) VERDICT: APPROVE CRITERION: wild_west.miner.a FAIL   (previous: FAIL)
- GAP: [P] wild_west.miner (a0f3a4b7) VERDICT: APPROVE CRITERION: wild_west.miner.c FAIL   (previous: FAIL)
- REGRESSIONS: none; CONFIRM 448: UNIT wild_west.gunslinger: a FAIL b PASS c PASS d PASS (3/4)
## Notes for next iteration (max 5 lines)
- STARVATION 449: queen a [R] is forced this iteration (rejected once at 444; one more reject parks a): rebuild the leg chain per the 444 critic NEXT in her unit file (pelvis foot up, legs ~1, knee ~.3 of height, boots at the knee, skirt to ~.55); probe_bbox first.
- dynamite_thrower a and b, and deadeye a, have no attempt since their 444 audit: they starve at 450, so pick their top blockers at 449.
- cactus boots are rejected-kept in the code: the resubmit edits CACTUS_BOOTS in place (critic 448 NEXT: out ~1.15, cuff ~1.35, from ~.55).
- miner c pick swing: the halberd chop ("haxe" marker) also drives the rest carry; give the pick its own chop path in _animateHeavySwing. Lasso b coil: the fist's +y points down and out (probe_axes 447).
- Captures run ~5 s a shot: background 4+ units and wait with an until-loop on the log; never end the turn while waiting on a background agent.
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
