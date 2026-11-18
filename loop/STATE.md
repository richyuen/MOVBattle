# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 579   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
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


## Focus (iter 579: maps_2+maps_3, 9 [S]; BASE a0eab91a)
- [S] map.spooky_1.a blocker 4 (41ea07bb) APPROVE, struck a4; a PASS, awaiting CONFIRM when b closes
- [S] map.spooky_1.b blocker 5 (cf4fcec1) DROPPED, hidden by cliff; reverted 9957f674
- [S] map.spooky_2.a blocker 2 (d8e18d58) APPROVE, struck a2
- [S] map.spooky_2.b blocker 3 (ca88f7b3, 6d6941ac, ac19ef0d) DROPPED after two follow-ups; reverted daa2da54, 2a571893, fc6bf11f
- [S] map.spooky_2.a blocker 1 (b20691d0) APPROVE, struck a1
- [S] map.dynasty.a blocker 2 (d888588d, b326fec0) APPROVE, struck a2
- [S] map.dynasty.b blocker 6 (6fce1036) APPROVE, struck b6
- [S] map.legacy.b blocker 4 (0167e0b6) APPROVE, struck b1, b4
- [S] map.legacy.a blocker 6 (2f5b6c6f) APPROVE, struck a6
- 7/9, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.spooky_1 (41ea07bb)
VERDICT: APPROVE
CRITERION: map.spooky_1.a PASS   (previous: FAIL)
GAP: [S] map.spooky_2 (d8e18d58)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (b20691d0)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (d888588d, follow-up b326fec0)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (6fce1036)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.legacy (0167e0b6)
VERDICT: APPROVE
CRITERION: map.legacy.b FAIL   (previous: FAIL)
GAP: [S] map.legacy (2f5b6c6f)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
REGRESSIONS: none. All four map c criteria and all twelve dependent stages' a/c criteria PASS in judge.json; no attributed visual regression on a previously passed criterion is visible.

## Notes for next iteration (max 5 lines)
- 579: 52 final shots, zero page/console errors, all 28 script checks PASS. Two --add notes record clean re-shoots. No item proposed done; no CONFIRM or checkpoint due.
- Spooky 1: a PASS; b5 ramp remains. 579 ramp dropped (cliff hid it); next attempt must carve a recess and show the descent in its named shot.
- Spooky 2: grate dropped after two follow-ups (ember stayed black); validate its light in a small look before rebuilding. Night sky/turf approved.
- Ancient 2 a3 has 2 attempts, last 576: it starves at 581 (then picked as its ranked [S]). maps_2 remains until it closes.
- Next gaps: critic.md in iter-579. LESSONS remains near its cap; merge before adding.
