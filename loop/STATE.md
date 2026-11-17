# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 570   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 5/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow -++ o
maps_2: medieval_1 -++ o | medieval_2 -++ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox --+ o | viking --+ o | viking_sandbox -++ o
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

## Focus (iter 570: maps_1+maps_2, 9 [S] + 1 [R]; BASE 06b627f1)
- [R] map.farmer_snow.a blocker 1–3 winter lighting and field dressing (1371524f+24937b53) APPROVE, struck a2
- [S] map.medieval_1.a blocker 5 inherited monolith removal (48dacf98+59b30f57) APPROVE, struck a5
- [S] map.medieval_1.b blocker 5 inlet ramp and landfall door (9767224d+8b7cf263+7094ea34) APPROVE, struck b5
- [S] map.medieval_1.a blocker 6 meadow tufts and orange flowers (2980c8ce+ca101d74) APPROVE
- [S] map.medieval_2.b blocker 1 front pond to the island lip (4e079a16) APPROVE, struck b1
- [S] map.medieval_2.a blocker 2 open sky behind the castle (4df6e5f8) APPROVE, struck a2
- [S] map.ancient_1.a blocker 3 white perimeter and cypress planters (1a2024e4) APPROVE, struck a3
- [S] map.ancient_2.b blocker 1 circular temple island outline (18a7b03b) APPROVE
- [S] map.ancient_sandbox.b blocker 2 stepped rear temple hills (c8566daa) APPROVE, struck b2
- [S] map.viking.a blocker 2 layered snow pines (23af4ed0) APPROVE, struck a2
- 10/10, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.farmer_snow (1371524f+24937b53)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a FAIL   (previous: FAIL)
GAP: [S] map.medieval_1 (48dacf98+59b30f57)
VERDICT: APPROVE
CRITERION: map.medieval_1.a FAIL   (previous: FAIL)
GAP: [S] map.medieval_1 (9767224d+8b7cf263+7094ea34)
VERDICT: APPROVE
CRITERION: map.medieval_1.b PASS   (previous: FAIL)
GAP: [S] map.medieval_1 (2980c8ce+ca101d74)
VERDICT: APPROVE
CRITERION: map.medieval_1.a FAIL   (previous: FAIL)
GAP: [S] map.medieval_2 (4e079a16)
VERDICT: APPROVE
CRITERION: map.medieval_2.b PASS   (previous: FAIL)
GAP: [S] map.medieval_2 (4df6e5f8)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (1a2024e4)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_2 (18a7b03b)
VERDICT: APPROVE
CRITERION: map.ancient_2.b FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (c8566daa)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.b FAIL   (previous: FAIL)
GAP: [S] map.viking (23af4ed0)
VERDICT: APPROVE
CRITERION: map.viking.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 570 capture produced 94 shots with zero page or console errors. All 51 script checks passed across seven maps and 22 stages.
- Farmer Snow’s rebuild cleared the tower. Snow-cap contrast and broad mill-bank shadows remain; Viking Sandbox takes the next rebuild slot.
- Medieval 1 and Medieval 2 cleared their layout blockers. Their appearances remain open, so the early CONFIRM did not apply.
- The higher player-side army camera exposes all four Ancient 1 formations, including the Wheelbarrow.
- The pale rectangle in stage_fantasy_evil.raze_the_homestead_field.png remains an open note from 562.
