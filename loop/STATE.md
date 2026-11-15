# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 558   Batch: maps_1   Consecutive empty: 0   Done: 0/99   Parked: 0
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

## Focus (iter 558: maps_1, 9 [S] + 1 [P]; BASE d49311b6)
- [S] map.tribal_1.a blocker 5 open sky, range hidden (cce131b2) APPROVE, struck 5
- [S] map.tribal_2.a blocker 5 open sky, range hidden (78418c38) APPROVE, struck 5
- [S] map.tribal_sandbox.a blocker 4 open sky + far rock stacks (2394adb1, f9f9f72a) APPROVE, struck 4
- [S] map.farmer_1.b blocker 5 wheat strips + stubble (2d04d016, 2acd436e) APPROVE, struck 5
- [S] map.farmer_1.a blocker 6 earth bowl underside (84bfd3eb) APPROVE, struck 6
- [S] map.farmer_2.a blocker 1 olive meadow + furrows (d9949729) APPROVE, struck 1
- [S] map.farmer_snow.b blocker 4 snowy pine grove (2ec1ca47) APPROVE, struck 4
- [S] map.tribal_sandbox.b blocker 2 boulder nooks (5e406f86) APPROVE, not struck
- [S] map.farmer_2.b blocker 3 alley + fence (110fbe0a) APPROVE, struck 3
- [P] map.farmer_2.a blocker 4 sheaves forward x1.5 (4a375df6) APPROVE, struck 4
- 10/10, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.tribal_1 (cce131b2) VERDICT: APPROVE CRITERION: map.tribal_1.a FAIL
GAP: [S] map.tribal_2 (78418c38) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [S] map.tribal_sandbox (2394adb1 + f9f9f72a) VERDICT: APPROVE CRITERION: map.tribal_sandbox.a FAIL
GAP: [S] map.farmer_1 (2d04d016 + 2acd436e) VERDICT: APPROVE CRITERION: map.farmer_1.b FAIL
GAP: [S] map.farmer_1 (84bfd3eb) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.farmer_2 (d9949729) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
GAP: [S] map.farmer_snow (2ec1ca47) VERDICT: APPROVE CRITERION: map.farmer_snow.b FAIL
GAP: [S] map.tribal_sandbox (5e406f86) VERDICT: APPROVE CRITERION: map.tribal_sandbox.b FAIL
GAP: [S] map.farmer_2 (110fbe0a) VERDICT: APPROVE CRITERION: map.farmer_2.b FAIL
GAP: [P] map.farmer_2 (4a375df6) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Every maps_1 map has its own self-contained builder in web/src/map/tabs/. farmer_1's earthBowl (hides islandUnder/Shelf/Cliff + mountain*) is the underside kit: copy it per map (tribal: three orange tiers with white flecks; snow: navy with snowy stones). farmer_2 still shows the mountain* range.
- The translucent box (farmer_1/2/snow b) is the placement guide campaign_zone_overlay_*/campaign_zone_border_* (a map mesh): a builder may hide it by name; zones stay in data.
- Stage armies on tribal_2/farmer_1/farmer_2 stand in x 2..41, z -26..18 (team 1); tribal_1 armies within 27 m of centre. A footprint must keep clear or the judge fails c.
- iter-558 critic.md is saved; no CONFIRM ran (no item near done). Step-5 capture of 6 maps + 17 stages: run in the background (~12 min).
