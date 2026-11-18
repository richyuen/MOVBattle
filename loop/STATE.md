# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 582   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item file template, loop/items/<id>.md (map: map.<id>; stage: <campaign>.<id>):
# <id>
Status: open|done|parked   Audited: <N> (AUDIT x2)[, <N> (CONFIRM: passed a; failed b)]   Done: <N>
## Verdicts
a FAIL (0 since <N>): 1. <blocker verbatim> 2. ... (or a PASS (<N>: struck n; CONFIRM <N>))
b ...
c PASS (<N> judge) / c FAIL (<N> judge): <reasons>
## Ranked gaps
1. [S] <id>.<letter> <gap> — blocker <n>: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
Marks: one per criterion a b c (+ pass, - fail, ? unscored); map a look, b layout, c play; stage a army, b formation, c battle. -->

## Scoreboard (a b c as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty +-+ o | renaissance --+ o | pirate --+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west --+ o | legacy -++ o
maps_4: fantasy_good ??? q | fantasy_evil ??? q | simulation ??? q | bridge ??? q | hill ??? q | corridor ??? q | defend_the_castle ??? q | high_ground ??? q | low_ground ??? q
stages_introduction: clubs ??? q | army ??? q | hay_and_pitchforks ??? q | basic_formation ??? q | ice_archers_only_almost ??? q | longships ??? q
stages_adventure: tree_tribe ??? q | the_tiniest_attack ??? q | sneaky_tribe ??? q | tree_mammoths ??? q | final_destination_wheelbarrow ??? q | a_fierce_rider ??? q
stages_challenge: ice_archer_and_friends ??? q | knights_and_priests ??? q | a_warm_welcome ??? q | zeus ??? q | twin_lords ??? q | big_brawl ??? q
stages_dynasty: samurai ??? q | art_of_war ??? q | area_of_effect ??? q | catapults ??? q | zeus_and_other_folks ??? q | viking_army ??? q
stages_renaissance: a_new_art_wave ??? q | balloons ??? q | renaissance_fencer ??? q | renaissance_vs_farmer_1 ??? q | renaissance_vs_ancient_2 ??? q | renaissance_vs_dynasty_3 ??? q
stages_pirate: x_marks_the_spot ??? q | a_rival_captain ??? q | a_small_tribe ??? q | you_won_t_make_us_walk_the_plank ??? q | arrows_and_arrow ??? q | boom_and_the_units_go_down ??? q
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter 582: maps_2+maps_3, 9 [S]; BASE f2ba379a)
- [S] map.legacy.a blocker 7 (bf604f4a, cd5ed429) APPROVE, struck a7; CONFIRM a FAIL, b PASS
- [S] map.wild_west.a blocker 3 (61cfb0a4) APPROVE, struck a3; CONFIRM a,b FAIL
- [S] map.pirate.b blocker 3 (ca76875d, 013ff74f) APPROVE, no strike (starvation)
- [S] map.spooky_1.a blocker 1 (fe776d2a) APPROVE, struck a1
- [S] map.spooky_1.a blocker 2 (1c4f83cd) APPROVE, struck a2; second failed a CONFIRM -> plateau
- [S] map.renaissance.b blocker 3 (b0840e69) APPROVE, struck b3
- [S] map.dynasty.a blocker 3 (229f9b4d) APPROVE, struck a3
- [S] map.dynasty.b blocker 3 (5b6181bc) REJECT, rejected-kept after conflicting revert; abort per step 7
- [S] map.dynasty.b blocker 4 (0c7d7a4e) APPROVE, struck b4
- 8/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.legacy.a blocker 7 (bf604f4a, cd5ed429)
VERDICT: APPROVE
CRITERION: map.legacy.a PASS (previous: FAIL)
GAP: [S] map.wild_west.a blocker 3 (61cfb0a4)
VERDICT: APPROVE
CRITERION: map.wild_west.a PASS (previous: FAIL)
GAP: [S] map.pirate.b blocker 3 (ca76875d, 013ff74f)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL (previous: FAIL)
GAP: [S] map.spooky_1.a blocker 1 (fe776d2a)
VERDICT: APPROVE
CRITERION: map.spooky_1.a FAIL (previous: FAIL)
GAP: [S] map.spooky_1.a blocker 2 (1c4f83cd)
VERDICT: APPROVE
CRITERION: map.spooky_1.a PASS (previous: FAIL)
GAP: [S] map.renaissance.b blocker 3 (b0840e69)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL (previous: FAIL)
GAP: [S] map.dynasty.a blocker 3 (229f9b4d)
VERDICT: APPROVE
CRITERION: map.dynasty.a PASS (previous: FAIL)
GAP: [S] map.dynasty.b blocker 3 (5b6181bc)
VERDICT: REJECT
CRITERION: map.dynasty.b FAIL (previous: FAIL)
GAP: [S] map.dynasty.b blocker 4 (0c7d7a4e)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL (previous: FAIL)
REGRESSIONS: none. All 84 final PNGs were inspected against the supplied TABS references; no regression attributable to these diffs was found. Script criteria copied from output/loop/iter-582/judge.json: all six map c criteria PASS; all twenty dependent stage a and c criteria PASS. Existing stage formation mismatches are not newly added map blockers.

## Notes for next iteration (max 5 lines)
- 582: 84 shots, zero page/console errors, all 46 script criteria PASS; 8/9 gaps approved, 7 struck, no new D or checkpoint. Reports: output/loop/iter-582/critic.md and confirm.md.
- Spooky 1 a is plateau after its second failed CONFIRM: iteration 583's [R] slot must rebuild grass, black gnarled trees and irregular cliff masses from both CONFIRM lists; preserve confirmed b.
- Legacy first CONFIRM failed a (grass/forest/church), passed b. Wild West first CONFIRM failed a,b (shops/street/town block). Dynasty early CONFIRM unused: not would-be-done.
- Dynasty b3 5b6181bc is rejected-kept because its revert conflicted with approved b4's later edit; revert was aborted per step 7. Cut existing lawn geometry to expose channels; b5 stairs also remains.
- Pirate a starves at 583; b3's apron still masks its inset beach. Ancient 2 a3 has 3 attempts and next starvation at 586. Renaissance b6 is its sole layout blocker.
