# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 625   Batch: stages_wild_west+stages_fantasy_evil   Consecutive empty: 0   Done: 95/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item template: # <id>; Status: open|done|parked Audited: N(AUDIT x2),N(CONFIRM: passed a; failed b) Done: N
## Verdicts: a FAIL (0 since N; list from AUDIT|CONFIRM N): 1. <blocker verbatim> s2. <element> in <shot> (struck N) / a PASS(N: struck n; CONFIRM N); b likewise; c PASS(N judge) / c FAIL(N judge): <reasons>
## Ranked gaps: 1. [S|P|R] <id>.<letter> <gap> — blocker n: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict); ## Rejected (last4); ## Notes(max3lines).
Marks per a b c: + pass,- fail,? unscored. Status q queued,o open,D done,p parked. Map a look,b layout,c play; stage a army,b formation,c battle. -->

## Scoreboard
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty +++ D | renaissance +++ D | pirate +++ D | spooky_1 +++ D | spooky_2 +++ D | wild_west +++ D | legacy +++ D
maps_4: fantasy_good +++ D | fantasy_evil +++ D | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ D | low_ground +++ D
stages_introduction: clubs +++ D | army +++ D | hay_and_pitchforks +++ D | basic_formation +++ D | ice_archers_only_almost +++ D | longships +++ D
stages_adventure: tree_tribe +++ D | the_tiniest_attack +++ D | sneaky_tribe +++ D | tree_mammoths +++ D | final_destination_wheelbarrow +++ D | a_fierce_rider +++ D
stages_challenge: ice_archer_and_friends +++ D | knights_and_priests +++ D | a_warm_welcome +++ D | zeus +++ D | twin_lords +++ D | big_brawl +++ D
stages_dynasty: samurai +++ D | art_of_war +++ D | area_of_effect +++ D | catapults +++ D | zeus_and_other_folks +++ D | viking_army +++ D
stages_renaissance: a_new_art_wave +++ D | balloons +++ D | renaissance_fencer +++ D | renaissance_vs_farmer_1 +++ D | renaissance_vs_ancient_2 +++ D | renaissance_vs_dynasty_3 +++ D
stages_pirate: x_marks_the_spot +++ D | a_rival_captain +++ D | a_small_tribe +++ D | you_won_t_make_us_walk_the_plank +++ D | arrows_and_arrow +++ D | boom_and_the_units_go_down +++ D
stages_spooky: bone +++ D | war +++ D | cave +++ D | turtle +++ D | breakout +++ D | plunder +++ D
stages_simulation: bridge_battle +++ D | hill +++ D | wall +++ D | siege +++ D | catapult_castle +++ D | pit +++ D
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +++ D | lone_ranger_and_his_friends +++ D | laughing_knights +++ D | shogun_s_samurai +++ D | spooky_army +++ D
stages_legacy: siege +++ D | a_tank +++ D | the_war +++ D | thor_s_battle +++ D
stages_fantasy_good: colossal_spike +++ D | royal_archers +++ D | clash_of_warriors +++ D | chaotic_cavalry +++ D | vicious_terror +++ D | fortified_formation +++ D
stages_fantasy_evil: encircling_tribe +++ D | raze_the_homestead +-+ o | farmer_uprising_evil +-+ o | storm_the_fortress +++ D | blasted_skirmish +-+ o | dismantle_the_spears +++ D

## Focus (iter625 wild_west+fantasy_good+fantasy_evil; evidence 5ba3d529+bd653803 item-keyed _army poses; 8 [S] + 1 [R]; BASE 98eb143d)
- [R] lone_ranger.b5 1db6aa8a APPROVE struck 5; CONFIRM D. [S] fortified.b3 52026c59 APPROVE struck 3; CONFIRM D.
- chaotic (evidence re-aim only): re-audit struck 1,2; CONFIRM D.
- [S] dismantle.b1 6747ed8c struck 1; b2 050471d4 struck 2,3; CONFIRM D.
- [S] storm.b4 8f567c2f struck 4,2; b1 3821714c struck 1; b3 8a5bedf6 struck 3; CONFIRM D. [S] encircling.b1 3fd4836b struck 1,2,4; b3 51b0e532 struck 3,5; CONFIRM D.
- 9/9 approved, 17 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] wild_west.lone_ranger_and_his_friends (1db6aa8a) / VERDICT: APPROVE / CRITERION: wild_west.lone_ranger_and_his_friends.b PASS   (previous: FAIL plateau)
GAP: [S] fantasy_good.fortified_formation (52026c59) / VERDICT: APPROVE / CRITERION: fantasy_good.fortified_formation.b PASS   (previous: FAIL)
GAP: (re-audit, no gap) fantasy_good.chaotic_cavalry (evidence 5ba3d529) / VERDICT: APPROVE (re-audit of open blockers on the re-aimed _army) / CRITERION: fantasy_good.chaotic_cavalry.b PASS   (previous: FAIL)
GAP: [S] fantasy_evil.dismantle_the_spears (6747ed8c) / (050471d4) / VERDICT: APPROVE x2 / CRITERION: fantasy_evil.dismantle_the_spears.b FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_evil.storm_the_fortress (8f567c2f) / (3821714c) / (8a5bedf6) / VERDICT: APPROVE x3 / CRITERION: fantasy_evil.storm_the_fortress.b FAIL / FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_evil.encircling_tribe (3fd4836b) / (51b0e532) / VERDICT: APPROVE x2 / CRITERION: fantasy_evil.encircling_tribe.b FAIL / PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 625: 18 shots, 0 page errors, 12/12 script criteria PASS (judge-world.json/summary-world.json; summary.json is the regression run); critic.md, confirm.md saved. 95/99. Iteration 625 was finished in a resumed session (steps 6-9).
- Checkpoint 625: stages_fantasy_good all D; --regression-only GREEN 12/12; dropped from Batch.
- Open: wild_west.leading_cacti, fantasy_evil.raze_the_homestead, farmer_uprising_evil, blasted_skirmish (critic 625 ranked 8 [S] on them; see output/loop/iter-625/critic.md RANKED GAPS).
- Leading Cacti b3 (2 attempts, last 621) starves at 627: picked then.
- Validate formations with --check-only before committing; checkStage ignores unit-unit overlap (space by collisionRadius).
