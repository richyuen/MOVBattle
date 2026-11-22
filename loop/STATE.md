# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 627   Batch: (none: every batch done)   Consecutive empty: 0   Done: 99/99   Parked: 0
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
stages_wild_west: leading_cacti +++ D | bullets_and_chains +++ D | lone_ranger_and_his_friends +++ D | laughing_knights +++ D | shogun_s_samurai +++ D | spooky_army +++ D
stages_legacy: siege +++ D | a_tank +++ D | the_war +++ D | thor_s_battle +++ D
stages_fantasy_good: colossal_spike +++ D | royal_archers +++ D | clash_of_warriors +++ D | chaotic_cavalry +++ D | vicious_terror +++ D | fortified_formation +++ D
stages_fantasy_evil: encircling_tribe +++ D | raze_the_homestead +++ D | farmer_uprising_evil +++ D | storm_the_fortress +++ D | blasted_skirmish +++ D | dismantle_the_spears +++ D

## Focus (iter627 wild_west; starvation pick; evidence 93bd0ced item-keyed _army pose; 1 [S]; BASE a9b62a86)
- [S] leading_cacti.b3 517aeff2 APPROVE struck 3 (s1, s2 re-judged on the new pose); CONFIRM D.
- 1/1 approved, 1 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] wild_west.leading_cacti (517aeff2) / VERDICT: APPROVE / CRITERION: wild_west.leading_cacti.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 627: 3 shots, 0 page errors, 2/2 script criteria PASS (judge-world.json/summary-world.json; summary.json is the regression run); critic.md, confirm.md saved. 99/99.
- Checkpoint 627: stages_wild_west all D; --regression-only GREEN 12/12; dropped from Batch. No batch is left in the list.
- Every map and stage is D: the next iteration's step 1 finds no open or queued item and writes STOP (v11 complete).
