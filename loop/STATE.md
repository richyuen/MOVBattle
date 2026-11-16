# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 563   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 2/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 -++ o | tribal_sandbox +-+ o | farmer_1 +++ D | farmer_2 -++ o (a plateau) | farmer_snow --+ o
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

## Focus (iter 563: maps_1+maps_2, 1 [R] + 7 [S]; BASE 96344955)
- [S] map.farmer_snow.b blocker 6 snow hills tested at their radius (e6641d5a) APPROVE, struck 6
- [S] map.farmer_snow.a blocker 5 dense pine grove in the glow pass (5ac61480) APPROVE, struck 5
- [S] map.tribal_2.b blocker 1 massif over the right third (3524fafd) APPROVE, struck 1
- [S] map.tribal_2.b blocker 4 rubble on the new foot (0b30e30a) APPROVE, struck 4
- [S] map.tribal_sandbox.b blocker 2 cliff-block nooks with birches on top, new mechanism (74f9cb20) APPROVE, struck 2
- [R] map.farmer_2.a blockers 1-4 look rebuild (115b231d) APPROVE, struck 1, 2, 4
- [S] map.viking_sandbox.a blocker 2 own builder, three-tier ice wall (632026ad) APPROVE, struck 2
- [S] map.ancient_sandbox.a blocker 4 own builder, terracotta cliffs (a295aa5a) APPROVE, struck 4
- Skipped: tribal_sandbox.b1 (1.4x scale passes the capture frame; needs an evidence commit first)
- CONFIRM: farmer_snow failed a, b; tribal_2 passed b, failed a; farmer_2 failed a -> no item done, CONFIRM lists replace a/b
- 8/8, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.farmer_snow (e6641d5a) VERDICT: APPROVE CRITERION: map.farmer_snow.b PASS
GAP: [S] map.farmer_snow (5ac61480) VERDICT: APPROVE CRITERION: map.farmer_snow.a PASS
GAP: [S] map.tribal_2 (3524fafd) VERDICT: APPROVE CRITERION: map.tribal_2.b FAIL
GAP: [S] map.tribal_2 (0b30e30a) VERDICT: APPROVE CRITERION: map.tribal_2.b PASS
GAP: [S] map.tribal_sandbox (74f9cb20) VERDICT: APPROVE CRITERION: map.tribal_sandbox.b FAIL
GAP: [R] map.farmer_2 (115b231d) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
GAP: [S] map.viking_sandbox (632026ad) VERDICT: APPROVE CRITERION: map.viking_sandbox.a FAIL
GAP: [S] map.ancient_sandbox (a295aa5a) VERDICT: APPROVE CRITERION: map.ancient_sandbox.a FAIL
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- [R] slot: farmer_2.a (plateau, CONFIRM failed 560/561/563); spec from the three CONFIRM lists in its item file.
- tribal_sandbox.b1 (field size) needs an evidence commit first: top/island poses frame about +-70 m, a 1.4x island reaches ~76 m.
- maps_2 untouched builders: medieval_1, medieval_2, ancient_1, ancient_2, viking (base campaign.challenge/adventure/introduction: never edit bases). viking_sandbox and ancient_sandbox have builders now.
- Critic 563: viking_sandbox wall also meets b blocker 2; strike it at the next b review. Stage armies on tribal_2 stand at x <= 24.4, |z| <= 9.9.
- Critic 562 aside still open: stage_fantasy_evil.raze_the_homestead_field.png pale grey rectangle behind the island; check at the maps_1 checkpoint.
