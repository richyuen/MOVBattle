# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 594   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 23/99   Parked: 0
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
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +-+ o | low_ground +++ D
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

## Focus (iter 594: maps_3+maps_4, 7 [S] + 1 [P]; BASE 5cceedb8)
- [S] map.dynasty.b blocker 1 (starving), pagoda over the north canal (4612ee6b) APPROVE, struck b1
- [S] map.fantasy_evil.b blocker 3, shrine ring + portal altar (a41b2f35) APPROVE, struck b3
- [S] map.fantasy_evil.a blocker 5, chained statue + spire (b4c03bd0 + 64abe9e0) APPROVE, no strike
- [S] map.fantasy_good.b blocker 3, gate towers (b993ae0a) APPROVE, struck b3
- [S] map.fantasy_good.a blocker 5, heaven sky (7b828924) APPROVE, struck a5
- [S] map.pirate.a blocker 2, stern transom (29222f58) REJECT, reverted b4a3cdd9
- [S] map.spooky_2.b blocker 1, terraces (db5cd84b) APPROVE, no strike (terraces clause cleared)
- [P] map.fantasy_evil.a seam bed unlit (932a5b35) APPROVE
- 7/8, 4 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.dynasty (4612ee6b)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (a41b2f35)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (b4c03bd0 + 64abe9e0)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (b993ae0a)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (7b828924)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [S] map.pirate (29222f58)
VERDICT: REJECT
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (db5cd84b)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [P] map.fantasy_evil (932a5b35)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 594: 25/25 script criteria PASS (5 maps + 10 stages), 0 page errors. No CONFIRM (no item would be done).
- high_ground b2 (2 attempts, last 593) starves at 598; until then [R] only. pirate a2, spooky_2 a4 and b1, dynasty a2: 2 attempts each.
- Next [S]: pirate b1 ships per team (re-aim map_pirate_deck on the stern quarter alongside), fantasy_evil b2 stairs + a4 green rim, fantasy_good b1 stepped edge + a4 viaduct, dynasty b2 canal outlets, spooky_2 b4 square outline.
- [P] eligible to 597: fantasy_evil statue to (0,24) + heavier lit chains; fantasy_good waterfalls on the legs' front faces. pirate palm prune to 595.
