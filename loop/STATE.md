# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 626   Batch: stages_wild_west   Consecutive empty: 0   Done: 98/99   Parked: 0
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
stages_fantasy_evil: encircling_tribe +++ D | raze_the_homestead +++ D | farmer_uprising_evil +++ D | storm_the_fortress +++ D | blasted_skirmish +++ D | dismantle_the_spears +++ D

## Focus (iter626 fantasy_evil; evidence acc913c9 item-keyed _army poses (+ blasted _field); 3 [S]; BASE 83f4ab02)
- [S] raze.b4 ea65bd91 APPROVE struck 1-4; CONFIRM D.
- [S] farmer_uprising.b4 0c928abc APPROVE struck 1-4; CONFIRM D (stage-only hill via stagePresentation SUMMITS; the_tiniest_attack re-shot, unchanged).
- [S] blasted.b4 885ba3a8 APPROVE struck 1-4; CONFIRM D.
- 3/3 approved, 12 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] fantasy_evil.raze_the_homestead (ea65bd91) / VERDICT: APPROVE / CRITERION: fantasy_evil.raze_the_homestead.b PASS   (previous: FAIL)
GAP: [S] fantasy_evil.farmer_uprising_evil (0c928abc) / VERDICT: APPROVE / CRITERION: fantasy_evil.farmer_uprising_evil.b PASS   (previous: FAIL)
GAP: [S] fantasy_evil.blasted_skirmish (885ba3a8) / VERDICT: APPROVE / CRITERION: fantasy_evil.blasted_skirmish.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 626: 12 shots, 0 page errors, 8/8 script criteria PASS (judge-world.json/summary-world.json; summary.json is the regression run); critic.md, confirm.md saved. 98/99.
- Checkpoint 626: stages_fantasy_evil all D; --regression-only GREEN 12/12; dropped from Batch.
- Last open item: wild_west.leading_cacti b3 (2 attempts, last 621): it starves at 627 and is picked then (item file: lanes before a facade row facing the _army camera, or an item-keyed _army pose).
- When leading_cacti is D, stages_wild_west is the last batch: step 8 checkpoint, then the Scoreboard has nothing open (step 1 writes STOP).
- Validate formations with --check-only before committing; checkStage ignores unit-unit overlap (space by collisionRadius).
