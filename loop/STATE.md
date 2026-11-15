# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 555   Batch: maps_1   Consecutive empty: 0   Done: 0/99   Parked: 0
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
maps_1: tribal_1 --+ o | tribal_2 --+ o | tribal_sandbox --+ o | farmer_1 --+ o | farmer_2 --+ o | farmer_snow --+ o
maps_2: medieval_1 ??? q | medieval_2 ??? q | ancient_1 ??? q | ancient_2 ??? q | ancient_sandbox ??? q | viking ??? q | viking_sandbox ??? q
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

## Focus (iter 555: maps_1 audit, then 9 [S]; BASE f8000891)
- [S] map.farmer_1.b blocker 1 river + waterfall (9a6acff4) APPROVE, struck 1
- [S] map.farmer_2.b blocker 1 cobble walls (5403e24d) APPROVE, struck 1
- [S] map.tribal_2.a blocker 2 mountain + cave (eee10129, 91f31445) APPROVE, struck 2
- [S] map.farmer_1.b blocker 2 stone bridge (d76751b7) APPROVE, struck 2
- [S] map.tribal_1.b blocker 3 field cleared (a7a8f62e) APPROVE, struck 3
- [S] map.tribal_1.a blocker 2 rim cliffs (aef862a5) APPROVE, stands
- [S] map.tribal_sandbox.a blocker 2 rock formations (ac1122a0) APPROVE, struck 2
- [S] map.farmer_1.a blocker 2 watermill (6e9a1c3a) APPROVE, stands (wheel clause)
- [S] map.farmer_snow.b blocker 1 frozen river (d9f9862b) APPROVE, struck 1
- 9/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.farmer_1 (9a6acff4) VERDICT: APPROVE CRITERION: map.farmer_1.b FAIL
GAP: [S] map.farmer_2 (5403e24d) VERDICT: APPROVE CRITERION: map.farmer_2.b FAIL
GAP: [S] map.tribal_2 (eee10129 + 91f31445) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [S] map.farmer_1 (d76751b7) VERDICT: APPROVE CRITERION: map.farmer_1.b FAIL
GAP: [S] map.tribal_1 (a7a8f62e) VERDICT: APPROVE CRITERION: map.tribal_1.b FAIL
GAP: [S] map.tribal_1 (aef862a5) VERDICT: APPROVE CRITERION: map.tribal_1.a FAIL
GAP: [S] map.tribal_sandbox (ac1122a0) VERDICT: APPROVE CRITERION: map.tribal_sandbox.a FAIL
GAP: [S] map.farmer_1 (6e9a1c3a) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.farmer_snow (d9f9862b) VERDICT: APPROVE CRITERION: map.farmer_snow.b FAIL
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Every maps_1 map now has its own builder in web/src/map/tabs/ (self-contained, no cross-imports); the shared look blockers (pink canopies, navy spiked underside, mountain backdrop + cloud slab, translucent zone box) are base-map elements each builder must replace for itself.
- iter-555 audit.md/audit2.md were wiped by the step-5 capture (run without --add); the merged lists live in the item files. critic.md is saved.
- Stage armies on tribal_2/farmer_1/farmer_2 stand in x 2..41, z -26..18 (team 1): a footprint must keep clear or the judge fails c.
