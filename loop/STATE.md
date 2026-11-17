# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 571   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 6/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 -++ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox --+ o | viking --+ o | viking_sandbox -++ o
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

## Focus (iter 571: maps_1+maps_2, 9 [S] + 1 [R]; BASE 71f06248)
- [S] map.medieval_1.a blocker 6 bushy grass clumps (2c30c0f9) APPROVE, struck a6 (a PASS, CONFIRM passed: done)
- [S] map.medieval_2.a blocker 1 drum towers and spired keep (b3ebd6d4) APPROVE, struck a1
- [S] map.medieval_2.a blocker 3 layered castle-foot oaks (c12b2649) APPROVE
- [S] map.medieval_2.a blocker 4 grass swathes with lawn lanes (a1735190) APPROVE, struck a4
- [S] map.ancient_2.a blocker 1 green lawn and flower drifts (b70ca30a) APPROVE, struck a1
- [S] map.ancient_1.b blocker 4 bay and rocky headland (f162a716) APPROVE, struck b4
- [S] map.ancient_1.a blocker 5 hoplite statue (11ef65f1) APPROVE, struck a5
- [S] map.ancient_sandbox.a blocker 6 ruins (8699ce12) APPROVE, struck a6
- [S] map.viking.b blocker 3 frozen ship (d5caaf8b) APPROVE, struck b3 and a4
- [R] map.viking_sandbox.a blockers 1-2 plated floor and broken ledges (c47c5fef) APPROVE, struck a1, a2; added a3
- 10/10, 11 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.medieval_1.a blocker 6 (2c30c0f9)
VERDICT: APPROVE
CRITERION: map.medieval_1.a PASS   (previous: FAIL)
GAP: [S] map.medieval_2.a blocker 1 (b3ebd6d4)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL   (previous: FAIL)
GAP: [S] map.medieval_2.a blocker 3 (c12b2649)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL   (previous: FAIL)
GAP: [S] map.medieval_2.a blocker 4 (a1735190)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_2.a blocker 1 (b70ca30a)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1.b blocker 4 (f162a716)
VERDICT: APPROVE
CRITERION: map.ancient_1.b FAIL   (previous: FAIL)
GAP: [S] map.ancient_1.a blocker 5 (11ef65f1)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox.a blocker 6 (8699ce12)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a FAIL   (previous: FAIL)
GAP: [S] map.viking.b blocker 3 (d5caaf8b)
VERDICT: APPROVE
CRITERION: map.viking.b FAIL   (previous: FAIL)
GAP: [R] map.viking_sandbox.a blockers 1 and 2 (c47c5fef)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 571 capture produced 97 shots with zero page errors; all 53 script checks passed across seven maps and 23 stages.
- Medieval 1 is done (CONFIRM 571 passed a and b); its map-picker thumb was re-rendered.
- Farmer Snow a is the only plateau left: it takes the next [R] slot (rock caps and broad mill-bank shadow).
- Early CONFIRM lists for Medieval 2 and Viking Sandbox (not counted) are in their item Notes and output/loop/iter-571/confirm.md: expect them at the next CONFIRM.
- Ancient 2.b and Ancient Sandbox.b were last attempted 570; Viking.b and Ancient 1.b in 571. The pale rectangle in stage_fantasy_evil.raze_the_homestead_field.png remains an open note from 562.
