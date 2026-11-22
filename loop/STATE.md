# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 623   Batch: stages_wild_west+stages_fantasy_good   Consecutive empty: 0   Done: 86/99   Parked: 0
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
stages_fantasy_good: colossal_spike +-+ o | royal_archers +++ D | clash_of_warriors +-+ o | chaotic_cavalry +-+ o | vicious_terror +-+ o | fortified_formation +-+ o
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter623 stages_wild_west+stages_legacy+stages_fantasy_good; tail-overlap AUDIT of fantasy_good (all 6 b FAIL, a/c PASS, no [D]); 9 [S] + 1 evidence; BASE 308b85e9)
- evidence 289dcb2b: siege _army high oblique APPROVE struck 4, CONFIRM D; lone_ranger _army swung to the chapel APPROVE no strike, CONFIRM failed b (3rd).
- [S] thor.b2 a824f386 APPROVE struck 2; CONFIRM D.
- [S] a_tank.b1 8c0b838f struck 1; b3 0859d60c struck 3,4; b2 73019b8f struck 2; all APPROVE; CONFIRM D.
- [S] royal_archers.b1 a4edc4b1 struck 1; b2 6b2294ae struck 2; APPROVE; CONFIRM D.
- [S] fortified.b1 4ed57ee6 struck 1; b2 d10c25d7 struck 2; APPROVE. [S] clash.b1 6d24fdca APPROVE struck 1,3.
- 10/10, 13 struck

## Last verdicts (critic header lines verbatim)
GAP: evidence legacy.siege (289dcb2b) / VERDICT: APPROVE / CRITERION: legacy.siege.b PASS   (previous: FAIL)
GAP: evidence wild_west.lone_ranger_and_his_friends (289dcb2b) / VERDICT: APPROVE / CRITERION: wild_west.lone_ranger_and_his_friends.b FAIL plateau   (previous: FAIL)
GAP: [S] legacy.thor_s_battle (a824f386) / VERDICT: APPROVE / CRITERION: legacy.thor_s_battle.b PASS   (previous: FAIL)
GAP: [S] legacy.a_tank (8c0b838f) / (0859d60c) / (73019b8f) / VERDICT: APPROVE x3 / CRITERION: legacy.a_tank.b FAIL / FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_good.royal_archers (a4edc4b1) / (6b2294ae) / VERDICT: APPROVE x2 / CRITERION: fantasy_good.royal_archers.b FAIL / PASS   (previous: FAIL)
GAP: [S] fantasy_good.fortified_formation (4ed57ee6) / (d10c25d7) / VERDICT: APPROVE x2 / CRITERION: fantasy_good.fortified_formation.b FAIL / FAIL   (previous: FAIL)
GAP: [S] fantasy_good.clash_of_warriors (6d24fdca) / VERDICT: APPROVE / CRITERION: fantasy_good.clash_of_warriors.b FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 623: 30 world shots, 0 page errors, 20/20 script criteria PASS; legacy checkpoint: regression 12/12 GREEN (smoke summary in iter-623/summary.smoke.json). Legacy batch closed (86/99).
- Picks next: fortified b3 (Pharaohs back to back), clash b2 (Valkyrie placement height), chaotic_cavalry b1/b2, colossal_spike b2/b3, vicious_terror b1/b3 (rings/flank groups need stage enemy zones in main.ts:checkStage, precedent spooky breakout 616).
- lone_ranger: plateau, the [R] re-lay toward the chapel takes this iteration's [R] slot (item file has the spec); return _army to alpha PI with it.
- Leading Cacti b3 (2 attempts, last 621) starves at 627: picked then.
- Validate formations with --check-only before committing; split one file's gaps with -U0 hunks (LESSONS).
