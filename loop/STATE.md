# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 590   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 17/99   Parked: 0
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

## Focus (iter 590: maps_3+maps_4, 6 [S] + 1 [P]; BASE 1f0bfe7b)
- [S] map.hill.a blocker 3, simKit cloudBanks (e8ee5a82) APPROVE, struck a3
- [S] map.defend_the_castle.b blocker 2, three ramps + chasms (5f1ae860) APPROVE, struck b2
- [P] map.simulation.a blocker 3, paleSky (c576c21c + 519e11df) APPROVE, no strike
- [S] map.high_ground.b blocker 3, wall ramps (b1715d8e) APPROVE, struck b3
- [S] map.spooky_2.a blocker 6, rock skirt (19067a56 + bb704a1c) APPROVE, struck a6
- [S] map.high_ground.a blocker 4, clouds (bbb9869d) APPROVE, struck a4
- [S] map.fantasy_evil.a blocker 1, own builder + void sky (9bfb373f) APPROVE, struck a1
- 7/7, 6 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.hill (e8ee5a82)
VERDICT: APPROVE
CRITERION: map.hill.a FAIL   (previous: FAIL)
GAP: [S] map.defend_the_castle (5f1ae860)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.b FAIL   (previous: FAIL)
GAP: [P] map.simulation (c576c21c + 519e11df)
VERDICT: APPROVE
CRITERION: map.simulation.a FAIL   (previous: FAIL)
GAP: [S] map.high_ground (b1715d8e)
VERDICT: APPROVE
CRITERION: map.high_ground.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (19067a56 + bb704a1c)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.high_ground (bbb9869d)
VERDICT: APPROVE
CRITERION: map.high_ground.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (9bfb373f)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 590: 20/20 script criteria PASS, 0 page errors; no item would-be-done, no CONFIRM. Critic: the kit/simulation sky spheres are unlit and fog-free but ACES still darkens the blue to teal: one [S] taking the sky sphere out of image processing (simKit paleSky) clears a5 on six kit maps (then CONFIRM bridge, corridor, low_ground); simulation.ts a3 needs the same as its own [S].
- Starving at 592: fantasy_good a, b (no builder yet), fantasy_evil b; pirate b3 (2 attempts) starves at 592.
- Dynasty: a2 cobble loop not attempted (path at x+-46 z+-35 sits under the ring trees: clear them or move it); a 2nd CONFIRM fail makes a/b plateau.
- Next [S]: kit sky out of image processing; castle b3 lower platforms (extend chasm to x -60); high_ground b2 units on walls; spooky_2 a3 thickets, a5 trees; fantasy_evil basalt floor and rock ring.
