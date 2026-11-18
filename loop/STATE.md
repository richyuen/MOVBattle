# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 578   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item file template, loop/items/<id>.md (map: map.<id>; stage: <campaign>.<level>):
# <id>
Status: open|done|parked   Audited: <N> (AUDIT x2)[, <N> (CONFIRM: passed a; failed b)]   Done: <N>
## Verdicts
a FAIL (0 since <N>): 1. <blocker verbatim> 2. ...      (or: a PASS (<N>: struck n; CONFIRM <N>); script criteria: c PASS (<N> judge) / c FAIL (<N> judge): <reasons>)
b ...
c ...
## Ranked gaps
1. [S] <id>.<letter> <gap> — blocker <n>: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
Marks below: one per criterion a b c (+ pass, - fail, ? unscored); map a look, b layout, c play; stage a army, b formation, c battle. -->

## Scoreboard (a b c as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty --+ o | renaissance --+ o | pirate --+ o | spooky_1 --+ o | spooky_2 --+ o | wild_west --+ o | legacy --+ o
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

## Focus (iter 578: maps_2+maps_3, 9 [S] + 1 [P]; BASE ba7bad7e)
- [S] map.legacy.b blocker 5 open glade (5adcb485) APPROVE, struck b5
- [S] map.dynasty.b blocker 2 central courtyard (61f64ff8, d3dab59a) APPROVE, no strike (court and pit cleared; N/S water, stairs missing)
- [S] map.spooky_2.b blocker 1 own builder, Dynasty layout (43348d28) APPROVE, no strike (fog, loop path cleared; no courtyard/terraces)
- [S] map.spooky_1.a blocker 3 dead trees (b84e8a52) APPROVE, struck a3
- [S] map.spooky_1.b blocker 2 graveyard (47539e05) APPROVE, struck b2
- [S] map.pirate.a blocker 3 island base (bf7c4fb1, f692a7c9) APPROVE, struck a3
- [S] map.wild_west.a blocker 4 sky and light (f0db546c) APPROVE, struck a4
- [S] map.renaissance.b blocker 4 front terrace (0de40749) APPROVE, struck b4
- [S] map.legacy.a blocker 3 church (486e6428) APPROVE, struck a3
- [P] map.legacy.a meadow tufts, fallout of 1d4cd558 (30f467e1) APPROVE, struck a2
- 10/10, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.legacy (5adcb485)
VERDICT: APPROVE
CRITERION: map.legacy.b FAIL   (previous: FAIL)
GAP: [S] map.dynasty (61f64ff8, follow-up d3dab59a)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (43348d28)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_1 (b84e8a52)
VERDICT: APPROVE
CRITERION: map.spooky_1.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_1 (47539e05)
VERDICT: APPROVE
CRITERION: map.spooky_1.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (bf7c4fb1, follow-up f692a7c9)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.wild_west (f0db546c)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL   (previous: FAIL)
GAP: [S] map.renaissance (0de40749)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL   (previous: FAIL)
GAP: [S] map.legacy (486e6428)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
GAP: [P] map.legacy (30f467e1)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 578: 97 shots, zero page errors, all 53 script checks pass. spooky_1 is down to 2 blockers (a4 lanterns, b5 left ramp): pick both first.
- Ancient 2 a3 has 2 attempts, last 576: it starves at 581 (then picked as its ranked [S]). maps_2 stays on Batch: until it closes.
- Eligible [P] next iteration: spooky_2 kerbs/path out of glow, dulled (fallout of 43348d28, shows in map_spooky_2_top); dynasty N/S canal colour is a2 ([S]).
- critic.md in iter-578 also ranks 12 next gaps across the batch (spooky_2 night palette and sky first).
- LESSONS is near its 10000-byte cap: merge before appending.
