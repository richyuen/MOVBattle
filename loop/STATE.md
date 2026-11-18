# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 580   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
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
maps_3: dynasty --+ o | renaissance --+ o | pirate --+ o | spooky_1 +-+ o | spooky_2 --+ o | wild_west --+ o | legacy --+ o
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

## Focus (iter 580: maps_2+maps_3, 9 [S]; BASE 6193aede)
- [S] map.wild_west.a blocker 5 (07b08bd1) APPROVE, struck a5
- [S] map.wild_west.b blocker 2 (514d0cf8) APPROVE, struck b2
- [S] map.wild_west.a blocker 6 (cd907413) APPROVE, struck a6
- [S] map.legacy.b blocker 2 (f5d5ce85) APPROVE, struck b2
- [S] map.legacy.a blocker 4 (bfb1c703) APPROVE, struck a4
- [S] map.legacy.a blocker 5 (9a3f5024, 2fc231cb) APPROVE, struck a5
- [S] map.renaissance.b blocker 2 (eae680b0) APPROVE, struck b2
- [S] map.renaissance.a blocker 3 (304cb24f) APPROVE, no strike
- [S] map.renaissance.b blocker 5 (19ca5178) APPROVE, struck b5
- 9/9, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.wild_west.a blocker 5 (07b08bd1)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL (previous: FAIL)
GAP: [S] map.wild_west.b blocker 2 (514d0cf8)
VERDICT: APPROVE
CRITERION: map.wild_west.b FAIL (previous: FAIL)
GAP: [S] map.wild_west.a blocker 6 (cd907413)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL (previous: FAIL)
GAP: [S] map.legacy.b blocker 2 (f5d5ce85)
VERDICT: APPROVE
CRITERION: map.legacy.b FAIL (previous: FAIL)
GAP: [S] map.legacy.a blocker 4 (bfb1c703)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL (previous: FAIL)
GAP: [S] map.legacy.a blocker 5 (9a3f5024, follow-up 2fc231cb)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL (previous: FAIL)
GAP: [S] map.renaissance.b blocker 2 (eae680b0)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL (previous: FAIL)
GAP: [S] map.renaissance.a blocker 3 (304cb24f)
VERDICT: APPROVE
CRITERION: map.renaissance.a FAIL (previous: FAIL)
GAP: [S] map.renaissance.b blocker 5 (19ca5178)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL (previous: FAIL)
REGRESSIONS: none. All 48 final PNGs were inspected; no regression attributable to these commits was identified in the twelve dependent stages.

## Notes for next iteration (max 5 lines)
- 580: 48 final shots; zero page/console errors; all 27 script criteria PASS. One --add note records the Legacy refresh. No item proposed done; no CONFIRM or checkpoint due.
- Legacy now has only a7 sky and b3 broad glade; Wild West has a3 arches and b1/b4 streets/outline. Neither is done.
- Renaissance a3 remains: paving paler but cool-grey and continuously seamed; cream checker uncleared. Canal and open centre struck b2/b5.
- Ancient 2 a3 last attempted 576: it starves at 581 and must be picked then despite its 2 attempts. Spooky 1 b5 ramp remains; carve the recess first.
- Critic ranked gaps: output/loop/iter-580/critic.md. LESSONS near cap; merge before adding. Pirate b last attempted 577 (starves 582); a last 578 (583).
