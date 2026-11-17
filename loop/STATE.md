# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 574   Batch: maps_2   Consecutive empty: 0   Done: 8/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item file template, loop/items/<id>.md (map: map.<id>; stage: <campaign>.<level>):
# <id>
Status: open|done|parked   Audited: <N> (AUDIT x2)[, <N> (CONFIRM: passed a; failed b)]   Done: <N>
## Verdicts
a FAIL (0 since <N>): 1. <blocker verbatim> 2. ...      (or: a PASS (<N>: struck n; CONFIRM <N>); script criteria: c PASS (<N> judge) / c FAIL (<N> judge): <reasons>)
b ...
c ...
## Ranked gaps
1. [S] <id>.<letter> <gap> — blocker <n>: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
Marks below: one per criterion a b c (+ pass, - fail, ? unscored); map a look, b layout, c play; stage a army, b formation, c battle. -->

## Scoreboard (a b c as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 -++ o | ancient_1 --+ o | ancient_2 -++ o | ancient_sandbox -++ o | viking +-+ o | viking_sandbox +++ D
maps_3: dynasty ??? q | renaissance ??? q | pirate ??? q | spooky_1 ??? q | spooky_2 ??? q | wild_west ??? q | legacy ??? q
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

## Focus (iter 574: maps_2, 9 [S] + 1 [P] + 1 [R]; BASE ae94bb09 after evidence ae94bb09 (ancient_1 battle framed on the player army))
- [S] map.ancient_2.b blocker 1 floor trim via fresh buffer, lawn out of glow (4f1be279+bff14f83) APPROVE, struck b1
- [S] map.ancient_2.b blocker 4 open front propylon (15c6c224) APPROVE, struck b4 (b PASS; CONFIRM passed b, failed a)
- [S] map.ancient_sandbox.a blocker 1 clear sky (a472ad38) APPROVE, struck a1
- [S] map.ancient_sandbox.a blocker 3 sandstone rocks and steps (ae0499eb) APPROVE, struck a3
- [S] map.ancient_sandbox.a blocker 5 hazy graded sea (452ef25d+7ac51041) APPROVE, struck a5
- [S] map.ancient_1.b blocker 1 outer house rows (536b4f76) APPROVE, struck b1, b3, b5
- [S] map.ancient_1.a blocker 3 separate houses and alley stairs (422bf815) APPROVE, struck a3 and b2
- [S] map.ancient_1.a blocker 2 flagstone paving (e03012d5+e3d80f84) APPROVE, struck a2; added a7 (too dark)
- [S] map.viking.b blocker 2 bank face and shore rocks (fdb5043b) REJECT, reverted 3e63a5aa
- [P] map.viking.b blocker 2 BANK.top 4.5 (dc64fad6) REJECT, reverted 8e0d0a0c
- [R] map.viking_sandbox.a blockers 1-3 gate, skyline, floor (ef7ca1e5) APPROVE, struck a1-a3 (CONFIRM passed: D)
- 9/11, 14 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.ancient_2 (4f1be279 + bff14f83)
VERDICT: APPROVE
CRITERION: map.ancient_2.b FAIL   (previous: FAIL)
GAP: [S] map.ancient_2 (15c6c224)
VERDICT: APPROVE
CRITERION: map.ancient_2.b PASS   (previous: FAIL)
GAP: [S] map.ancient_sandbox (a472ad38)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (ae0499eb)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (452ef25d + 7ac51041)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (536b4f76)
VERDICT: APPROVE
CRITERION: map.ancient_1.b FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (422bf815)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (e03012d5 + e3d80f84)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.viking (fdb5043b)
VERDICT: REJECT
CRITERION: map.viking.b FAIL   (previous: FAIL)
GAP: [P] map.viking (dc64fad6)
VERDICT: REJECT
CRITERION: map.viking.b FAIL   (previous: FAIL)
GAP: [R] map.viking_sandbox (ef7ca1e5)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.a PASS   (previous: FAIL)
REGRESSIONS: map.viking.a (PASS) -> attributed to fdb5043b and dc64fad6 (both reverted)

## Notes for next iteration (max 5 lines)
- 574: 65 shots, zero page errors, all script checks pass (viking re-shot alone after the reverts). Viking Sandbox done (CONFIRM passed a).
- [R] slot: Medieval 2 a (plateau, waiting since 572) takes it next iteration.
- Viking b: bankFace went near black (normals/double-sided, weak emissive); retry with upward normals and pale vertex colours, BANK.top stays 2.4.
- Ancient 2 a now carries the 574 CONFIRM list (beige sky, far mountains, flat temple grid, lime grass); b PASS confirmed.
- Capture --add for map.viking also wipes map_viking_sandbox_* (filename prefix match): re-shoot both together (574 did).
