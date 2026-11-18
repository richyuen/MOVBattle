# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 588   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 17/99   Parked: 0
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
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation -++ o | bridge --+ o | hill --+ o | corridor -++ o | defend_the_castle --+ o | high_ground --+ o | low_ground -++ o
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

## Focus (iter 588: maps_3+maps_4, 9 [S] + 1 [P]; BASE 22b0c206; support commit 5c3f2c62 simKit.ts, no pixels)
- [S] map.dynasty.b blocker 3 (334b790d) APPROVE, struck b3 (starvation pick); CONFIRM failed a, b
- [S] map.bridge.b blocker 1 (fded3015) APPROVE, struck b1, b3, a1, a2, a4
- [S] map.corridor.b blocker 2 (c20c50bb) APPROVE, struck b1, b2, b3, a1, a2, a3
- [S] map.low_ground.b blocker 1 (ae6ad36b) APPROVE, struck b1, b2, b3, a1, a2, a3
- [S] map.hill.b blocker 2 (ec25b08c) APPROVE, struck b2, b3
- [S] map.bridge.a blocker 3 (fdee4e69) APPROVE, no strike
- [S] map.corridor.a blocker 4 (5e870bb6) APPROVE, no strike
- [S] map.low_ground.a blocker 4 (98ebf959) APPROVE, no strike
- [S] map.hill.a blocker 1 (1eb72e07 + cfd5d291) APPROVE, struck a2
- [P] map.simulation.a blocker 3 (a7eceb90) REJECT, reverted (f6be35ba)
- 9/10, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.dynasty (334b790d)
VERDICT: APPROVE
CRITERION: map.dynasty.b PASS   (previous: FAIL)
GAP: [S] map.bridge (fded3015)
VERDICT: APPROVE
CRITERION: map.bridge.b FAIL   (previous: FAIL)
GAP: [S] map.corridor (c20c50bb)
VERDICT: APPROVE
CRITERION: map.corridor.b PASS   (previous: FAIL)
GAP: [S] map.low_ground (ae6ad36b)
VERDICT: APPROVE
CRITERION: map.low_ground.b PASS   (previous: FAIL)
GAP: [S] map.hill (ec25b08c)
VERDICT: APPROVE
CRITERION: map.hill.b FAIL   (previous: FAIL)
GAP: [S] map.bridge (fdee4e69)
VERDICT: APPROVE
CRITERION: map.bridge.a FAIL   (previous: FAIL)
GAP: [S] map.corridor (5e870bb6)
VERDICT: APPROVE
CRITERION: map.corridor.a FAIL   (previous: FAIL)
GAP: [S] map.low_ground (98ebf959)
VERDICT: APPROVE
CRITERION: map.low_ground.a FAIL   (previous: FAIL)
GAP: [S] map.hill (1eb72e07 + cfd5d291)
VERDICT: APPROVE
CRITERION: map.hill.a FAIL   (previous: FAIL)
GAP: [P] map.simulation (a7eceb90)
VERDICT: REJECT
CRITERION: map.simulation.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 588: 22/22 script criteria PASS, 0 page errors. Dynasty's first CONFIRM failed a (6) and b (2): new lists in its item file (output/loop/iter-588/confirm.md); a second CONFIRM fail makes it plateau. Simulation: CONFIRM passed a, b; critic still fails a3.
- One [P] clears four sky blockers: simKit.ts paleSky haze (.78,.9,.92) span .15 (fallout of bridge fdee4e69, to 591): bridge a3, corridor a4, low_ground a4 (then CONFIRM corridor and low_ground). Simulation.ts sky row: 2nd [P] spends it.
- Hill: evidence first (map_hill_ground shows no ramp; re-aim it), then b1 bounded block (bareField + voidAround as low_ground).
- Unpickable: pirate b3 (starvation 592), spooky_2 a4 (starvation 590). Not yet attempted since the 587 audit: fantasy_good, fantasy_evil, defend_the_castle, high_ground (starve at 592).
- Eligible [P]: kit sky (to 591), simulation sky (to 590), corridor WALL_H 7 -> 10 (to 591), spooky_2 thorn heaps (to 590), pirate ripple (to 589).
