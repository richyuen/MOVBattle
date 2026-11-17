# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 575   Batch: maps_2   Consecutive empty: 0   Done: 11/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 -++ o | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
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

## Focus (iter 575: maps_2, 9 [S] + 1 [P] + 1 [R]; BASE 23a0052b)
- [S] map.viking.b blocker 2 faceted snow-slab shore lip and rocks (f625c54e+cfcf192a+a551c647) APPROVE, struck b2 (b PASS; CONFIRM: D)
- [R] map.medieval_2.a blockers 1-3 keep vine, grey rock underside, side rim oaks (894c4560+214cd90a+32646705) APPROVE, struck a1-a3 (CONFIRM passed: D)
- [S] map.ancient_2.a blocker 1 clear sky (01f55292) APPROVE, struck a1
- [S] map.ancient_2.a blocker 2 far range hidden (68327b4c) APPROVE, struck a2
- [S] map.ancient_2.a blocker 3 four-terrace mound (07ed1f71) APPROVE, no strike
- [S] map.ancient_sandbox.a blocker 4 front clouds moved behind (463f1de9) APPROVE, struck a4
- [S] map.ancient_sandbox.a blocker 2 olive meadow (80685728+74532b9b) APPROVE, struck a2 (CONFIRM passed: D)
- [S] map.ancient_1.b blocker 4 harbour bay (8b0caf9f) APPROVE, struck b4 (b PASS)
- [S] map.ancient_1.a blocker 5 raised cypress planters (dc064a4b) APPROVE, struck a5
- [S] map.ancient_1.a blocker 4 parapet with blue tiles (fb150da1) APPROVE, struck a4
- [P] map.ancient_1.a blocker 7 pavement 0.4 (0560a79a) APPROVE, struck a7
- 11/11, 14 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.viking (f625c54e + cfcf192a + a551c647)
VERDICT: APPROVE
CRITERION: map.viking.b PASS   (previous: FAIL)
GAP: [R] map.medieval_2 (894c4560 + 214cd90a + 32646705)
VERDICT: APPROVE
CRITERION: map.medieval_2.a PASS   (previous: FAIL)
GAP: [S] map.ancient_2 (01f55292)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_2 (68327b4c)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_2 (07ed1f71)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (463f1de9)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (80685728 + 74532b9b)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a PASS   (previous: FAIL)
GAP: [S] map.ancient_1 (8b0caf9f)
VERDICT: APPROVE
CRITERION: map.ancient_1.b PASS   (previous: FAIL)
GAP: [S] map.ancient_1 (dc064a4b)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (fb150da1)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [P] map.ancient_1 (0560a79a)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 575: 71 shots, zero page errors, all script checks pass. Viking, Medieval 2, Ancient Sandbox done (CONFIRM); thumbnails re-rendered.
- maps_2 has 2 open items (Ancient 1 a6, Ancient 2 a3 a4): tail overlap applies next iteration (audit maps_3 too, Batch: maps_2+maps_3).
- Ancient 1 b PASS is not yet confirmed: its CONFIRM comes with a's. Ancient 1 pavement row is spent for [P].
- Ancient 2: a pale translucent sheet shows behind the island (critic 575); mound still a mirrored grid with charcoal walls.
- Capture --add for map.viking also wipes map_viking_sandbox_* (filename prefix match): re-shoot both together.
