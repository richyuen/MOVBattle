# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 568   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 5/99   Parked: 0
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
maps_2: medieval_1 --+ o | medieval_2 --+ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox --+ o | viking --+ o | viking_sandbox -++ o
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

## Focus (iter 568: maps_1+maps_2, 9 [S]; BASE 5841697f)
- [S] map.tribal_sandbox.a blocker 1 taller pale trunks and rounded autumn crowns (45084eee) APPROVE, struck a1
- [S] map.tribal_sandbox.a blocker 2 fractured near-rim crags (ee8ea992) APPROVE, struck a2
- [S] map.tribal_sandbox.a blocker 3 low rim outcrops in place of distant spires (d8ff6642) APPROVE, struck a3
- [S] map.farmer_snow.a blocker 3 front snow-capped boulder (0c5f8a08) APPROVE, struck a3
- [S] map.farmer_snow.a blocker 4 snowy bridge-side furrows (a7c6dc9f) APPROVE, struck a4
- [S] map.viking_sandbox.a blocker 5 faceted glacier underside and blue shards (da540cdb) APPROVE, struck a5
- [S] map.viking_sandbox.b blocker 1 circular arena floor and rim (3da0c3ba) APPROVE, struck b1
- [S] map.medieval_1.a blocker 4 crenellated right-bank ruins and orange-capped pillar (7b27f51b) APPROVE, struck a4
- [S] map.medieval_2.a blocker 4 collapsed red-roof cottages and fallen tower (6d892fbe) APPROVE, struck a4
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.tribal_sandbox (45084eee)
VERDICT: APPROVE
CRITERION: map.tribal_sandbox.a FAIL (previous: FAIL)
GAP: [S] map.tribal_sandbox (ee8ea992)
VERDICT: APPROVE
CRITERION: map.tribal_sandbox.a FAIL (previous: FAIL)
GAP: [S] map.tribal_sandbox (d8ff6642)
VERDICT: APPROVE
CRITERION: map.tribal_sandbox.a PASS (previous: FAIL)
GAP: [S] map.farmer_snow (0c5f8a08)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a FAIL (previous: FAIL)
GAP: [S] map.farmer_snow (a7c6dc9f)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a FAIL (previous: FAIL)
GAP: [S] map.viking_sandbox (da540cdb)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.a PASS (previous: FAIL)
GAP: [S] map.viking_sandbox (3da0c3ba)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.b PASS (previous: FAIL)
GAP: [S] map.medieval_1 (7b27f51b)
VERDICT: APPROVE
CRITERION: map.medieval_1.a FAIL (previous: FAIL)
GAP: [S] map.medieval_2 (6d892fbe)
VERDICT: APPROVE
CRITERION: map.medieval_2.a FAIL (previous: FAIL)
REGRESSIONS: none on scored criteria. All five map c and nine stage a/c pairs pass in judge.json.

## Notes for next iteration (max 5 lines)
- Tribal Sandbox is done. Viking Sandbox layout passed CONFIRM, which reopened appearance for the ice shelves, connected floor ice, and detached mountain shelf.
- Before Ancient 1 stage formation review, re-aim army shots obscured by buildings, especially adventure.final_destination_wheelbarrow.
- 568 capture produced 47 shots, zero page or console errors, and 23/23 script checks passed across five maps and nine stages.
- Both map batches have open items. The pale rectangle in stage_fantasy_evil.raze_the_homestead_field.png remains an open note from 562.
