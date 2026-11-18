# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 598   Batch: maps_3+maps_4+stages_introduction   Consecutive empty: 0   Done: 26/99   Parked: 0
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
maps_4: fantasy_good --+ o | fantasy_evil -++ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ o | low_ground +++ D
stages_introduction: clubs +++ D | army +-+ o | hay_and_pitchforks +++ D | basic_formation +-+ o | ice_archers_only_almost +-+ o | longships +++ D
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

## Focus (iter 598: 1 [R] + 9 [S] + 1 [P]; BASE 5d02a49e; evidence 598.0 f05c7b8e gate shot, did not fire)
- [R] map.spooky_2.b whole list, square rim + cuts + mouths (d4fd09be) APPROVE, struck b1 (plateau lifted)
- [S] map.high_ground.b blocker 2 (starving), bar crown standable (26e5a09e) APPROVE, struck b2 (b PASS); CONFIRM pending (gate shot missed)
- [S] introduction.clubs.b blocker 2, back by the treeline (7decadec) APPROVE, struck b2
- [S] introduction.clubs.b blocker 1, loose gathering (6f225d65) APPROVE, struck b1 (b PASS); CONFIRM passed -> D
- [S] introduction.hay_and_pitchforks.b blocker 3, into the wheat (023a7c90) APPROVE, struck b3
- [S] introduction.hay_and_pitchforks.b blocker 1, C of balers (aff6a657) APPROVE, struck b1
- [S] introduction.hay_and_pitchforks.b blocker 2, farmer block (e0b923c7) APPROVE, struck b2 (b PASS); CONFIRM passed -> D
- [S] introduction.basic_formation.b blocker 1, two groups (7e502bad) APPROVE, struck b1
- [S] introduction.basic_formation.b blocker 2, 2x2 blocks (2638f64f) APPROVE, struck b2
- [S] introduction.ice_archers_only_almost.b blocker 3, lines of four spread (edb92610) APPROVE, no strike (width clause cleared)
- [P] introduction.ice_archers_only_almost.b blocker 2, trio flip (3ba5d947) APPROVE, struck b2
- 11/11, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] introduction.clubs (7decadec)
VERDICT: APPROVE
CRITERION: introduction.clubs.b FAIL   (previous: FAIL)
GAP: [S] introduction.clubs (6f225d65)
VERDICT: APPROVE
CRITERION: introduction.clubs.b PASS   (previous: FAIL)
GAP: [S] introduction.hay_and_pitchforks (023a7c90)
VERDICT: APPROVE
CRITERION: introduction.hay_and_pitchforks.b FAIL   (previous: FAIL)
GAP: [S] introduction.hay_and_pitchforks (aff6a657)
VERDICT: APPROVE
CRITERION: introduction.hay_and_pitchforks.b FAIL   (previous: FAIL)
GAP: [S] introduction.hay_and_pitchforks (e0b923c7)
VERDICT: APPROVE
CRITERION: introduction.hay_and_pitchforks.b PASS   (previous: FAIL)
GAP: [S] introduction.basic_formation (7e502bad)
VERDICT: APPROVE
CRITERION: introduction.basic_formation.b FAIL   (previous: FAIL)
GAP: [S] introduction.basic_formation (2638f64f)
VERDICT: APPROVE
CRITERION: introduction.basic_formation.b FAIL   (previous: FAIL)
GAP: [S] introduction.ice_archers_only_almost (edb92610)
VERDICT: APPROVE
CRITERION: introduction.ice_archers_only_almost.b FAIL   (previous: FAIL)
GAP: [P] introduction.ice_archers_only_almost (3ba5d947)
VERDICT: APPROVE
CRITERION: introduction.ice_archers_only_almost.b FAIL   (previous: FAIL)
GAP: [S] map.high_ground (26e5a09e)
VERDICT: APPROVE
CRITERION: map.high_ground.b PASS   (previous: FAIL)
GAP: [R] map.spooky_2 (d4fd09be)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 598: 18/18 script criteria PASS, 0 page errors. Early CONFIRM (clubs, hay, basic, ice) counted for clubs and hay only; it failed ice b (in Notes there).
- First of 599: high_ground evidence commit (gate shot never fired: catch a bar archer stepping off the crown front instead), then a fresh CONFIRM on b with a named confirmed (deviation: the 593 CONFIRM predates the bar mechanism).
- Next [S]: basic b3 groups into the streets; ice b3 army off the rim; spooky_2 b4 square steps from OUTLINE (b4 attempts 595, 596, 598 [R]: starvation or a new plateau); fantasy_good a5, b2, a2; fantasy_evil a6; dynasty a5, a4.
- [P] eligible to 600: army spacing 1.15; fantasy_good falls past the ledge; dynasty shrub cheeks off the armies. To 599: fantasy_evil chains (a5 2 attempts: no).
- Starvation at 599: pirate a2 (last attempt 594). Dynasty stage armies stand in the stair-cheek shrubs (drawn only): fix before stages_dynasty audits.
