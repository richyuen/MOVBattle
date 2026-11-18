# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 589   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 17/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty --+ o | renaissance +++ D | pirate +-+ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation -++ o | bridge -++ o | hill -++ o | corridor -++ o | defend_the_castle --+ o | high_ground --+ o | low_ground -++ o
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

## Focus (iter 589: maps_4, 7 [S] + 1 [P]; BASE 00cf09ce; evidence 00cf09ce + cc5ef659 re-aimed map_hill_ground)
- [S] map.bridge.b blocker 2 (07d52058) APPROVE, struck b2 (b PASS)
- [S] map.hill.b blocker 1 (90341a4e) APPROVE, struck b1 (b PASS); re-audit struck a1
- [S] map.high_ground.b blocker 1 (41f10807) APPROVE, struck b1, a1, a3
- [S] map.defend_the_castle.b blocker 1 (f2467ab3) APPROVE, struck b1, b4, a1, a3
- [S] map.high_ground.a blocker 2 (2177a9ad) APPROVE, struck a2
- [S] map.defend_the_castle.a blocker 2 (57155431) APPROVE, struck a2
- [P] map.bridge.a blocker 3, simKit sky (8d4fd3bc) APPROVE, struck bridge a3, corridor a4, low_ground a4, castle a4; added teal-zenith a5 on six kit maps
- [S] map.hill.a blocker 3 (de48f83f) REJECT, reverted (5093c46c)
- 7/8, 15 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.bridge (07d52058)
VERDICT: APPROVE
CRITERION: map.bridge.b PASS   (previous: FAIL)
GAP: [S] map.hill (90341a4e)
VERDICT: APPROVE
CRITERION: map.hill.b PASS   (previous: FAIL)
GAP: [S] map.high_ground (41f10807)
VERDICT: APPROVE
CRITERION: map.high_ground.b FAIL   (previous: FAIL)
GAP: [S] map.defend_the_castle (f2467ab3)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.b FAIL   (previous: FAIL)
GAP: [S] map.high_ground (2177a9ad)
VERDICT: APPROVE
CRITERION: map.high_ground.a FAIL   (previous: FAIL)
GAP: [S] map.defend_the_castle (57155431)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.a FAIL   (previous: FAIL)
GAP: [P] map.bridge (8d4fd3bc)
VERDICT: APPROVE
CRITERION: map.bridge.a FAIL   (previous: FAIL)
GAP: [S] map.hill (de48f83f)
VERDICT: REJECT
CRITERION: map.hill.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 589: 20/20 script criteria PASS, 0 page errors. One [P] (kit paleSky blue (.38,.68,.76) -> (.55,.78,.92), fallout of fdee4e69, to 591) is the last a blocker of corridor and low_ground and bridge: then CONFIRM them (early CONFIRM 589 unused: bridge b would fail, blocks not square: output/loop/iter-589/confirm.md).
- Hill clouds: retry inside the far clip (z 180-250), disposed with the map; high_ground reuses the helper.
- Dynasty: a 2nd CONFIRM fail makes a/b plateau. Spooky_2 a4 starves at 590; pirate b3 at 592; fantasy_good, fantasy_evil (no builder yet) starve at 592.
- Next [S] candidates: high_ground b3 wall ramps, b2 units on walls; castle b2 three ramps, b3 split ground (watch c); dynasty b1 pagoda, a2 cobble loop (widen perimeterFlagstones).
