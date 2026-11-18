# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 586   Batch: maps_3   Consecutive empty: 0   Done: 16/99   Parked: 0
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
maps_3: dynasty +-+ o | renaissance +++ D | pirate +-+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west +++ D | legacy +++ D
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

## Focus (iter 586: maps_2+maps_3, 1 [R] + 7 [S]; BASE 766bce84)
- [R] map.wild_west.a blockers 1, 2 (f70a3686) APPROVE, struck a1, a2; CONFIRM a PASS -> D
- [S] map.ancient_2.a blocker 3, starvation (1932bf22) APPROVE, struck a3 -> D
- [S] map.renaissance.a blocker 5 (531d6ed4) APPROVE, struck a5
- [S] map.renaissance.a blocker 3 (36ee3119) APPROVE, struck a3; CONFIRM a, b PASS -> D
- [S] map.pirate.a blocker 5 (05e50f52 + bb77a558) APPROVE, struck a5
- [S] map.spooky_2.b blocker 2 (6afd6a09) APPROVE, struck b2
- [S] map.spooky_2.a blocker 5 (974a3c2d) APPROVE, no strike (one round tree left)
- [S] map.pirate.a blocker 1 (f49048a8 + f3ee1295) APPROVE, struck a1 (critic a PASS)
- 8/8, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.wild_west (f70a3686)
VERDICT: APPROVE
CRITERION: map.wild_west.a PASS   (previous: FAIL, plateau)
GAP: [S] map.ancient_2 (1932bf22)
VERDICT: APPROVE
CRITERION: map.ancient_2.a PASS   (previous: FAIL)
GAP: [S] map.renaissance (531d6ed4)
VERDICT: APPROVE
CRITERION: map.renaissance.a FAIL   (previous: FAIL)
GAP: [S] map.renaissance (36ee3119)
VERDICT: APPROVE
CRITERION: map.renaissance.a PASS   (previous: FAIL)
GAP: [S] map.pirate (05e50f52 + bb77a558)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (6afd6a09)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (974a3c2d)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.pirate (f49048a8 + f3ee1295)
VERDICT: APPROVE
CRITERION: map.pirate.a PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 586: 69+ shots, zero page errors, all 37 step-5 script criteria PASS; 8/8 approved; wild_west, ancient_2, renaissance D (CONFIRM passed). maps_2 checkpoint: regression 12/12 green, its 23 stages 46/46 PASS; maps_2 dropped from Batch.
- 587: spooky_1 a plateau [R] (far-rim watchtower, broken pillar, red ground discs; 585 confirm.md). maps_3 has under 9 pickable [S] (pirate b3, b5; spooky_2 a3, a7, b1, a5): tail overlap - audit maps_4 in step 2 and pick from both.
- Pirate a PASS awaits CONFIRM (would-be-done only when b passes): remove the blue slab off the right rim (base waterfall prop at (58,0)?) first. b5 decks need zones or an evidence re-aim to show units on a deck. [P] ripple tone is eligible fallout of 05e50f52.
- Unpickable: dynasty b3 until 588 (starvation), spooky_2 a4 (2 attempts; starvation 590). Dynasty early CONFIRM list (583) in its item Notes.
- A capture-world --add run rewrites summary.json with its own items only (PNGs kept): judge step 5 before any later --add capture.
