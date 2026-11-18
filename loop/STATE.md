# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 591   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 21/99   Parked: 0
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
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle --+ o | high_ground +-+ o | low_ground -++ o
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

## Focus (iter 591: maps_3+maps_4, 7 [S]; BASE b6e9d2f4)
- [S] map.hill.a blocker 4, kit sky + clouds untoned (eadae3e9) APPROVE, struck hill a4 + a5 on bridge, corridor, low_ground, castle, high_ground
- [S] map.simulation.a blocker 3, sky untoned (dd6f6429) APPROVE, struck a3
- [S] map.defend_the_castle.b blocker 3, front platforms (e417622a) APPROVE, struck b3
- [S] map.high_ground.b blocker 2, standable wall tops (7abd9cdd, evidence 336cbba3) APPROVE, no strike
- [S] map.low_ground.a bank tone (c8082cb0 + 51f659a2 + f37f2aeb) dropped, reverted (lighter than the flats)
- [S] map.fantasy_evil.a blocker 2, basalt floor (15ca3a31) APPROVE, struck a2
- [S] map.fantasy_good.a blocker 1, own builder + marble deck (21913c7f) APPROVE, struck a1
- 6/7, 11 struck; CONFIRM: hill, bridge, corridor, simulation -> D; low_ground failed a (lilac bank); defend_the_castle failed a (merlons), b (chasms read as steps)

## Last verdicts (critic header lines verbatim)
GAP: [S] map.hill (eadae3e9)
VERDICT: APPROVE
CRITERION: map.hill.a PASS   (previous: FAIL)
GAP: [S] map.simulation (dd6f6429)
VERDICT: APPROVE
CRITERION: map.simulation.a PASS   (previous: FAIL)
GAP: [S] map.defend_the_castle (e417622a)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.b PASS   (previous: FAIL)
GAP: [S] map.high_ground (7abd9cdd)
VERDICT: APPROVE
CRITERION: map.high_ground.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (15ca3a31)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (21913c7f)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 591: 23/23 script criteria PASS, 0 page errors. simKit untoned() (inverse of the post-process chain) now drives every sim-family sky; use it for any colour that must hit an sRGB target.
- Starving at 592: fantasy_good b (pits), fantasy_evil b (plateau), pirate b3 (spit, 2 attempts: starvation pick). Dynasty a2 cobble loop still unattempted.
- low_ground a and defend_the_castle a/b hold CONFIRM lists: a 2nd CONFIRM fail on any makes it plateau. high_ground: a PASS (CONFIRM pending), b2 next: bar plateau + zones on both walls and bar.
- Next [S]: fantasy_good parapets/pits/towers; fantasy_evil rock ring, plateau, green rims; castle wide V chasms, plain walls; spooky_2 a5 trees, a3 thickets.
