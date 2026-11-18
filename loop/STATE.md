# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 592   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 23/99   Parked: 0
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
maps_3: dynasty --+ o | renaissance +++ D | pirate --+ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground --+ o | low_ground +++ D
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

## Focus (iter 592: maps_3+maps_4, 9 [S]; BASE 51fa27b6)
- [S] map.low_ground.a blocker 1, bank lighting normals (52bed45f) APPROVE, struck a1
- [S] map.defend_the_castle.b blocker 1, V chasms (9dcd3891) APPROVE, struck b1
- [S] map.defend_the_castle.a blocker 1, plain stepped walls (395d7f38) APPROVE, struck a1
- [S] map.pirate.b blocker 3, spit taper (af385087) APPROVE, struck b3
- [S] map.fantasy_good.b blocker 2, sunken pits (e1ab8d1b + feb60ff9) APPROVE, struck b2, b6
- [S] map.fantasy_evil.b blocker 1, block plateau (0ee4c12c) APPROVE, struck b1
- [S] map.high_ground.b blocker 2, wall zones (60051560) APPROVE, no strike
- [S] map.spooky_2.b blocker 1, cobble loop (4bbcf13d) APPROVE, struck loop clause
- [S] map.dynasty.a blocker 2, cobble loop (66229760) APPROVE, no strike
- 9/9, 9 struck; CONFIRM: low_ground, defend_the_castle -> D; pirate failed a, b (new lists); high_ground failed a (gate block), passed b

## Last verdicts (critic header lines verbatim)
GAP: [S] map.low_ground (52bed45f)
VERDICT: APPROVE
CRITERION: map.low_ground.a PASS   (previous: FAIL)
GAP: [S] map.defend_the_castle (9dcd3891)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.b PASS   (previous: FAIL)
GAP: [S] map.defend_the_castle (395d7f38)
VERDICT: APPROVE
CRITERION: map.defend_the_castle.a PASS   (previous: FAIL)
GAP: [S] map.pirate (af385087)
VERDICT: APPROVE
CRITERION: map.pirate.b PASS   (previous: FAIL)
GAP: [S] map.fantasy_good (e1ab8d1b + feb60ff9)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (0ee4c12c)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b FAIL   (previous: FAIL)
GAP: [S] map.high_ground (60051560)
VERDICT: APPROVE
CRITERION: map.high_ground.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (4bbcf13d)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.dynasty (66229760)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 592: 36/36 script criteria PASS, 0 page errors. Thumbs re-rendered for low_ground, defend_the_castle.
- Starving at 593: pirate a (CONFIRM list: hulls, rim; last a attempt 586). dynasty b starves at 594. high_ground b2 has 2 attempts: evidence first (0 s placement battle shot), then only its starvation pick or an [R].
- pirate a/b and high_ground a hold first CONFIRM lists: a 2nd CONFIRM fail makes the criterion plateau.
- Next [S]: fantasy_good plinth, towers, parapets; fantasy_evil chasms + two flights, rock ring, shrine; spooky_2 terraces, thickets; dynasty ring trees off the loop, pagoda; high_ground taller gate block; pirate dark curved hulls, ships per team.
