# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 624   Batch: stages_wild_west+stages_fantasy_good+stages_fantasy_evil   Consecutive empty: 0   Done: 89/99   Parked: 0
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
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +++ D | lone_ranger_and_his_friends +-+ o | laughing_knights +++ D | shogun_s_samurai +++ D | spooky_army +++ D
stages_legacy: siege +++ D | a_tank +++ D | the_war +++ D | thor_s_battle +++ D
stages_fantasy_good: colossal_spike +++ D | royal_archers +++ D | clash_of_warriors +++ D | chaotic_cavalry +-+ o | vicious_terror +++ D | fortified_formation +-+ o
stages_fantasy_evil: encircling_tribe +-+ o | raze_the_homestead +-+ o | farmer_uprising_evil +-+ o | storm_the_fortress +-+ o | blasted_skirmish +-+ o | dismantle_the_spears +-+ o

## Focus (iter624 wild_west+fantasy_good; tail-overlap AUDIT of fantasy_evil (all 6 b FAIL, a/c PASS, no [D]); 8 [S] + 1 [R]; BASE 396e20cc)
- [R] lone_ranger.b5 3caf1182+bd2eb57c APPROVE struck 5; CONFIRM failed b (QD legs hidden in the chapel's red mound).
- [S] clash.b2 d8f85176 APPROVE struck 2; CONFIRM D. [S] colossal.b2 7722b347 struck 1,2; b3 86735c1b struck 3; CONFIRM D.
- [S] vicious.b1 7d4cd947 struck 1,2; b3 9ab380dc struck 3; CONFIRM D.
- [S] chaotic.b1 8af831d3 APPROVE no strike; b2 9652eeb2 struck 3; CONFIRM failed b (_army behind parapet). [S] fortified.b3 f2a5226e APPROVE struck 3; CONFIRM failed b (pair on camera axis).
- 9/9 approved, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] wild_west.lone_ranger_and_his_friends (3caf1182 + bd2eb57c) / VERDICT: APPROVE / CRITERION: wild_west.lone_ranger_and_his_friends.b PASS   (previous: FAIL plateau)
GAP: [S] fantasy_good.clash_of_warriors (d8f85176) / VERDICT: APPROVE / CRITERION: fantasy_good.clash_of_warriors.b PASS   (previous: FAIL)
GAP: [S] fantasy_good.chaotic_cavalry (8af831d3) / (9652eeb2) / VERDICT: APPROVE x2 / CRITERION: fantasy_good.chaotic_cavalry.b FAIL / FAIL   (previous: FAIL)
GAP: [S] fantasy_good.colossal_spike (7722b347) / (86735c1b) / VERDICT: APPROVE x2 / CRITERION: fantasy_good.colossal_spike.b FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_good.vicious_terror (7d4cd947) / (9ab380dc) / VERDICT: APPROVE x2 / CRITERION: fantasy_good.vicious_terror.b FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_good.fortified_formation (f2a5226e) / VERDICT: APPROVE / CRITERION: fantasy_good.fortified_formation.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 624: 48 shots in iter-624, 0 page errors, 24/24 script criteria PASS; audit.md/audit2.md (fantasy_evil), critic.md, confirm.md saved. 89/99.
- First: chaotic_cavalry evidence commit (own _army pose on the plaza, e.g. target(-12,1,2) r22 beta1.0) before any pick on it; fortified b3 turn the Pharaohs across the camera axis.
- lone_ranger: plateau, [R] slot: QD + rear trio off the chapel's red mound (item file). fantasy_evil items are audited and pickable (12 ranked [S]).
- Leading Cacti b3 (2 attempts, last 621) starves at 627: picked then.
- Validate formations with --check-only before committing; checkStage ignores unit-unit overlap (space by collisionRadius).
