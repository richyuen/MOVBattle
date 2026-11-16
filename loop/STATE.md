# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 566   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 4/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox --+ o | farmer_1 +++ D | farmer_2 +++ D | farmer_snow -++ o
maps_2: medieval_1 --+ o | medieval_2 --+ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox --+ o | viking --+ o | viking_sandbox --+ o
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

## Focus (iter 566: maps_1+maps_2, 9 [S] + 1 [R]; BASE 21a8a59d)
- Evidence: Tribal Sandbox camera limit and framing (21a8a59d+9704ba46), re-AUDIT x2 reopened a and b.
- [S] map.medieval_1.b blocker 2 split plateaus, inlet and stone bridge (70777289+20b7df96) APPROVE, struck a2, b1, b2, b3
- [S] map.ancient_1.b blocker 1 rectangular paved slab, two streets and central arch (29f15c87+fb977c70) APPROVE, struck a1, b1, b3, b5
- [S] map.tribal_sandbox.b blocker 1 expand island, placement and collision footprint 1.45x (49d2750c) APPROVE, struck b1
- [R] map.farmer_2.a blocker 3 swept wheat, separated warm heads and stems (1e5f5680+e6c89ac4) APPROVE, struck a3 (a PASS; CONFIRM -> D)
- [S] map.farmer_snow.a blocker 1 open snow rim with a few corner pines (ae2ad902) APPROVE, struck a1
- [S] map.medieval_2.a blocker 1 crenellated castle facade, ivy and arched gate (373e0c1c+c3ddcf73) APPROVE, struck a1
- [S] map.ancient_2.b blocker 5 clear inherited field obstacles and pits (13fa8e2a) APPROVE, struck b5
- [S] map.viking.b blocker 4 clear inherited obstacles and pits off the lake (1e70afc3) APPROVE, struck b4
- [S] map.ancient_sandbox.a blocker 1 green meadow with brown clay paths (9358dcce) APPROVE, struck a1
- [S] map.viking_sandbox.a blocker 4 cyan sky and airborne snow (b2df5dd6) APPROVE, struck a4
- 10/10, 16 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.medieval_1 (70777289 + 20b7df96)
VERDICT: APPROVE
CRITERION: map.medieval_1.b FAIL (previous: FAIL)
GAP: [S] map.ancient_1 (29f15c87 + fb977c70)
VERDICT: APPROVE
CRITERION: map.ancient_1.b FAIL (previous: FAIL)
GAP: [S] map.tribal_sandbox (49d2750c)
VERDICT: APPROVE
CRITERION: map.tribal_sandbox.b FAIL (previous: FAIL)
GAP: [R] map.farmer_2 (1e5f5680 + e6c89ac4)
VERDICT: APPROVE
CRITERION: map.farmer_2.a PASS (previous: FAIL)
GAP: [S] map.farmer_snow (ae2ad902)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a FAIL (previous: FAIL)
GAP: [S] map.medieval_2 (373e0c1c + c3ddcf73)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL (previous: FAIL)
GAP: [S] map.ancient_2 (13fa8e2a)
VERDICT: APPROVE
CRITERION: map.ancient_2.b FAIL (previous: FAIL)
GAP: [S] map.viking (1e70afc3)
VERDICT: APPROVE
CRITERION: map.viking.b FAIL (previous: FAIL)
GAP: [S] map.ancient_sandbox (9358dcce)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL (previous: FAIL)
GAP: [S] map.viking_sandbox (b2df5dd6)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.a FAIL (previous: FAIL)
REGRESSIONS: none. Judge passes c for all 10 maps and a/c for all 26 stages.

## Notes for next iteration (max 5 lines)
- Medieval 1 and Ancient 1 had their first layout attempts. Prioritize their appearance gaps (stepped cliffs and white city frontage).
- Tribal Sandbox's enlarged footprint cleared b1. Re-audit a1/a2 and b2 remain on the rock stacks, crowns and regular back wall.
- Farmer 2 confirmed and map-picker thumbnail refreshed. Both map batches still have open items.
- 566 final capture: 118 shots, zero page errors, 10 map c and 52 stage a/c checks passed. Local commits ready; automatic approval review blocked the push to origin/main because external publication authorization and destination trust were unverified.
- Critic 562 aside still open: stage_fantasy_evil.raze_the_homestead_field.png pale grey rectangle behind the island; check at the maps_1 checkpoint.
