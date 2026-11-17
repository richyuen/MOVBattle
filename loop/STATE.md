# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 573   Batch: maps_2   Consecutive empty: 0   Done: 7/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 -++ o | ancient_1 --+ o | ancient_2 +-+ o | ancient_sandbox -++ o | viking +-+ o | viking_sandbox -++ o
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

## Focus (iter 573: maps_1+maps_2, 9 [S] + 1 [R]; BASE 509a4b40 after evidence 509a4b40 (ancient_1 battle pose))
- [R] map.farmer_snow.a blockers 1-3 lavender snow, corner trees, slate band (94ecffc7+cd93dfb2) APPROVE, struck a1-a3 (a PASS; CONFIRM passed: D)
- [S] map.viking.b blocker 2 raised snowbanks (264fb953) APPROVE, no strike
- [S] map.viking.a blocker 5 ice underside (c44dc74a) APPROVE, struck a5
- [S] map.viking.a blocker 6 frozen waterfall (f74d311d) APPROVE, struck a6 (a PASS; CONFIRM passed a, b)
- [S] map.ancient_sandbox.b blocker 1 outer shelves and headlands (d11426f4) APPROVE, struck b1
- [S] map.ancient_sandbox.b blocker 4 offshore islets (b82dd7b7) APPROVE, struck b4 (b PASS; CONFIRM passed b, failed a)
- [S] map.ancient_2.b blocker 1 world-space remap (f5374621) dropped: shelf unchanged, reverted 8231cf32
- [S] map.ancient_2.a blocker 4 earth drum (cc91f4d4) APPROVE, struck a4
- [S] map.ancient_2.a blocker 5 gate pavilions (0f5ada56) APPROVE, struck a5 (a PASS, pending CONFIRM)
- [S] map.ancient_1.a blocker 1 clear blue sky (61adfc2c) APPROVE, struck a1
- 9/10, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.farmer_snow (94ecffc7 + cd93dfb2)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a PASS   (previous: FAIL)
GAP: [S] map.viking (264fb953)
VERDICT: APPROVE
CRITERION: map.viking.b FAIL   (previous: FAIL)
GAP: [S] map.viking (c44dc74a)
VERDICT: APPROVE
CRITERION: map.viking.a FAIL   (previous: FAIL)
GAP: [S] map.viking (f74d311d)
VERDICT: APPROVE
CRITERION: map.viking.a PASS   (previous: FAIL)
GAP: [S] map.ancient_sandbox (d11426f4)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.b FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (b82dd7b7)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.b PASS   (previous: FAIL)
GAP: [S] map.ancient_2 (cc91f4d4)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_2 (0f5ada56)
VERDICT: APPROVE
CRITERION: map.ancient_2.a PASS   (previous: FAIL)
GAP: [S] map.ancient_1 (61adfc2c)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 573: 82+ shots, zero page errors, all script checks pass; maps_1 checkpoint: regression 12/12 GREEN, all 17 maps_1 stages re-judged a+c PASS. Farmer Snow done (CONFIRM passed a); maps_1 closed.
- [R] queue (plateau, oldest first): Viking Sandbox a, then Medieval 2 a. Viking b needs its bank to read from the top shot (shaded face, shore rocks).
- Ancient 2: find which mesh is the green apron past the wall with a probe before retrying b1 (the 573 world-space remap of ground/islandShelf changed nothing). Its a PASS awaits CONFIRM.
- Ancient 1 evidence first: the battle shot (509a4b40) looks down the south street but misses the skirmish armies (zones x +-40): re-aim it onto an army on a street before picking on b.
- Ancient Sandbox CONFIRM 573 failed a (beige sky, lawn too saturated, front boulder row, cloud over island, sea too saturated): that list is now a's blockers.
