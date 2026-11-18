# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 583   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
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
maps_3: dynasty +-+ o | renaissance --+ o | pirate --+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west --+ o | legacy -++ o
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

## Focus (iter 583: maps_2+maps_3, 1 [R] + 8 [S]; BASE b5e4349a)
- [R] map.spooky_1.a blockers 1-3 (8094db6e) APPROVE, struck a1, a3; added a4
- [S] map.dynasty.b blocker 3 (4f1cb063) APPROVE, no strike
- [S] map.dynasty.b blocker 5 (bf9994ed) APPROVE, struck b5
- [S] map.legacy.a blocker 1 (92ad5b14) APPROVE, struck a1
- [S] map.legacy.a blocker 2 (414198c9) APPROVE, no strike
- [S] map.legacy.a blocker 3 (f8143bfb) APPROVE, struck a3
- [S] map.wild_west.a blocker 1 (17a180c4, b25c16e2) APPROVE, struck a1
- [S] map.wild_west.b blocker 1 (35137805) APPROVE, struck b1; added b2
- [S] map.pirate.a blocker 2 (1bac6c2d, 36dabe6f) APPROVE, no strike (starvation)
- 9/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.spooky_1 (8094db6e)
VERDICT: APPROVE
CRITERION: map.spooky_1.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (4f1cb063)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.dynasty (bf9994ed)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.legacy (92ad5b14)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
GAP: [S] map.legacy (414198c9)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
GAP: [S] map.legacy (f8143bfb)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
GAP: [S] map.wild_west (17a180c4, b25c16e2)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL   (previous: FAIL)
GAP: [S] map.wild_west (35137805)
VERDICT: APPROVE
CRITERION: map.wild_west.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (1bac6c2d, 36dabe6f)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
REGRESSIONS: none on a judged criterion or judge.json (all script criteria PASS: map c x5, stage a and c x15; no battle unended, no unit in a hazard). Not yet judged but harmed: stage_wild_west.leading_cacti / bullets_and_chains / lone_ranger_and_his_friends _army shots half hidden -> attributed to 35137805

## Notes for next iteration (max 5 lines)
- 583: 80 shots, zero page/console errors, all 35 script criteria PASS; 9/9 approved, 7 struck, no new D or checkpoint. Early CONFIRM (spooky_1, dynasty, legacy) unused: none ended would-be-done; its findings are in those items' Notes and output/loop/iter-583/confirm.md.
- Spooky 1 a stays plateau: 584's [R] rebuilds plateau() as few large stepped masses with a lower shelf and ragged depths, duskyMeadow as blade tufts, and darkens the fog channel and cliff glow.
- Wild West b2 first: the inner rank (z -23.5, x 2..23.4) hides three stages' army shots; move it west/inward or cut it to one building, then a2 (peach sand surface).
- Dynasty b3 has 2 [S] attempts (unpickable until starvation at 588); its a would fail a CONFIRM on lawn colour, paths, pagoda, blossom and cliffs. Legacy a2 (forest wall) is its last blocker; open the near-side mountains too.
- Starvation at 584: renaissance a (last 580), spooky_2 a and b (last 579). Pirate b last 582; ancient_2 a3 at 586.
