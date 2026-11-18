# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 597   Batch: maps_3+maps_4+stages_introduction   Consecutive empty: 0   Done: 24/99   Parked: 0
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
maps_3: dynasty -++ o | renaissance +++ D | pirate -++ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil -++ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +-+ o | low_ground +++ D
stages_introduction: clubs +-+ o | army +-+ o | hay_and_pitchforks +-+ o | basic_formation +-+ o | ice_archers_only_almost +-+ o | longships +++ D
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

## Focus (iter 597: maps_3+maps_4 + stages_introduction audit (tail overlap), 1 [R] + 9 [S]; BASE 02fb3eef)
- [R] map.dynasty.a blockers 1-6, garden look rebuild (5e04109e) APPROVE, struck a3, a6
- [S] map.fantasy_evil.a blocker 6, backdrop crag (89b4f29e + 4818fb5b) APPROVE, rock-mass clause cleared, no strike
- [S] map.fantasy_good.a blocker 4, pit shafts (6bbd3b7d) APPROVE, struck a4
- [S] map.fantasy_good.a blocker 3, waterfalls (10bafbf2) APPROVE, struck a3
- [S] map.fantasy_good.b blocker 2, front ledge (cfe386c3) APPROVE, ledge clause cleared, no strike
- [S] introduction.army.b blocker 1, wall in front + block (426bae72) APPROVE, struck b2, b3
- [S] introduction.longships.b blocker 1, arrowhead (275c58c7 + a137190f) APPROVE, struck b1, b3
- [S] introduction.longships.b blocker 2, ship row (e141277b) APPROVE, struck b2 (b PASS); CONFIRM passed -> D
- [S] introduction.ice_archers_only_almost.b blocker 1, three groups (2a5b6349) APPROVE, struck b1
- [S] introduction.ice_archers_only_almost.b blocker 2, two trios (0ff32508) APPROVE, no strike (side mirrored)
- stages_introduction audit 597: all a, c PASS (no data commit); every b FAIL (clubs: one audit passed it)
- 10/10, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.dynasty (5e04109e)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (89b4f29e + 4818fb5b)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (6bbd3b7d)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (10bafbf2)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (cfe386c3)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL)
GAP: [S] introduction.army (426bae72)
VERDICT: APPROVE
CRITERION: introduction.army.b FAIL   (previous: FAIL)
GAP: [S] introduction.longships (275c58c7 + a137190f)
VERDICT: APPROVE
CRITERION: introduction.longships.b FAIL   (previous: FAIL)
GAP: [S] introduction.longships (e141277b)
VERDICT: APPROVE
CRITERION: introduction.longships.b PASS   (previous: FAIL)
GAP: [S] introduction.ice_archers_only_almost (2a5b6349)
VERDICT: APPROVE
CRITERION: introduction.ice_archers_only_almost.b FAIL   (previous: FAIL)
GAP: [S] introduction.ice_archers_only_almost (0ff32508)
VERDICT: APPROVE
CRITERION: introduction.ice_archers_only_almost.b FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 597: 23/23 script criteria PASS, 0 page errors. Dynasty a plateau cleared by the [R]'s strikes; spooky_2 b [R] is now the waiting plateau (takes the [R] slot at 598).
- Starvation: high_ground b2 at 598 (2 attempts, [R] only). 2 attempts: pirate a2, spooky_2 a4, fantasy_evil a5, dynasty a2.
- Next [S]: intro hay b1-b3, basic_formation b1-b2, clubs b1-b2, ice b3; fantasy_good a5 corruption, b2 back jog, a2 towers; fantasy_evil a6 spire + chains; dynasty a5 rim ring, a1 lawn, a4 cliff tone.
- [P] eligible to 600: army spacing 1.15; ice trio z flip; fantasy_good falls past the ledge; dynasty shrub cheeks off the armies. To 599: fantasy_evil chains (a5 2 attempts: no).
- Dynasty stage armies stand in the stair-cheek shrubs (drawn only): fix before stages_dynasty audits.
