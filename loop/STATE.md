# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 584   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 13/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty +-+ o | renaissance --+ o | pirate --+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west -++ o | legacy +++ D
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

## Focus (iter 584: maps_2+maps_3, 1 [R] + 8 [S]; BASE fdac0bb4)
- [S] map.wild_west.b blocker 2 (40f76430) APPROVE, struck b2; CONFIRM b PASS
- [S] map.wild_west.a blocker 2 (397ce937, 5deb40d9, 86d685ef) APPROVE, struck a2; CONFIRM a FAIL (second) -> plateau
- [S] map.spooky_2.b blocker 3 (09c46949, 83d01f33) APPROVE, struck b3 (starvation)
- [S] map.legacy.a blocker 2 (9944d480) APPROVE, struck a2; CONFIRM a PASS -> D
- [R] map.spooky_1.a blockers 2, 4 (012614f9) APPROVE, struck a4; CONFIRM a PASS, critic a FAIL
- [S] map.renaissance.a blocker 1 (89c01adc) APPROVE, struck a1 (starvation)
- [S] map.renaissance.b blocker 6 (7813a271) APPROVE, no strike
- [S] map.pirate.a blocker 2 (5395195a) APPROVE, struck a2
- [S] map.spooky_2.a blocker 4 (96f80159) APPROVE, no strike (starvation)
- 9/9, 6 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.wild_west (40f76430)
VERDICT: APPROVE
CRITERION: map.wild_west.b PASS   (previous: FAIL)
GAP: [S] map.wild_west (397ce937, 5deb40d9, 86d685ef)
VERDICT: APPROVE
CRITERION: map.wild_west.a PASS   (previous: FAIL)
GAP: [S] map.spooky_2 (09c46949, 83d01f33)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.legacy (9944d480)
VERDICT: APPROVE
CRITERION: map.legacy.a PASS   (previous: FAIL)
GAP: [R] map.spooky_1 (012614f9)
VERDICT: APPROVE
CRITERION: map.spooky_1.a FAIL   (previous: FAIL)
GAP: [S] map.renaissance (89c01adc)
VERDICT: APPROVE
CRITERION: map.renaissance.a FAIL   (previous: FAIL)
GAP: [S] map.renaissance (7813a271)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (5395195a)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (96f80159)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 584: 81 shots, zero page/console errors, all 44 script criteria PASS (after 83d01f33 took the court's corner colliders off vicious_terror's candleheads); 9/9 approved, 6 struck; legacy D (13/99). No checkpoint.
- Two plateau [R]s wait, one per iteration, oldest first: 585 spooky_1 a (upper cliff tier as separate masses stepping in and out, close the dark gaps on the left front face), 586 wild_west a (near-side buildings' backs and roofs solid, sunset sky backdrop; spec from the 582 and 584 CONFIRM lists).
- Evidence first on renaissance b6: no shot shows the arcade hollow; add a pose or skirmish units under the palace and light the arcade floor and back wall.
- Spooky 2: re-site the shrine to the far edge right of centre (x 12..17, z 38); then dead ring trees (a5) and bridges (b2). Pirate: a translucent blue slab off the right rim to find and remove; b starving at 587.
- Unpickable: dynasty b3 until 588 (2 [S] attempts), ancient_2 a3 until 586 (3 attempts). Renaissance and pirate carry the most pickable [S].
