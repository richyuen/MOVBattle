# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 593   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 23/99   Parked: 0
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

## Focus (iter 593: maps_3+maps_4, 8 [S]; BASE 5848b4ac; evidence 5848b4ac high_ground placed shot)
- [S] map.high_ground.a blocker 1, gate block (738ad5c3) APPROVE, struck a1 (a PASS); b2 wall-top clause struck
- [S] map.fantasy_good.b blocker 4, open centre medallion (1f3aa7be) APPROVE, struck b4, a6
- [S] map.fantasy_good.a blocker 2, parapets (4b047cbf + 9319c5b6) APPROVE, struck a2
- [S] map.pirate.a blocker 2, lofted dark hull (c6dfd275 + 0a50ce06) APPROVE, struck a1 (bow clause of a2 cleared)
- [S] map.fantasy_evil.b blocker 4, chasms (18fff580) APPROVE, struck b4
- [S] map.dynasty.a blocker 2, loop clear (0097f9bc) APPROVE, no strike
- [S] map.spooky_2.a blocker 5, dead prop trees (84011b8a) APPROVE, struck a5
- [S] map.fantasy_evil.a blocker 3, rock ring (a0acf189) APPROVE, struck a3
- 8/8, 7 struck; CONFIRM high_ground passed a, b (critic still fails b: archers on the bar)

## Last verdicts (critic header lines verbatim)
GAP: [S] map.high_ground.a blocker 1 (738ad5c3)
VERDICT: APPROVE
CRITERION: map.high_ground.a PASS   (previous: FAIL)
CRITERION: map.high_ground.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good.b blocker 4 (1f3aa7be)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good.a blocker 2 (4b047cbf + 9319c5b6)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [S] map.pirate.a blocker 2 (c6dfd275 + 0a50ce06)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil.b blocker 4 (18fff580)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b FAIL   (previous: FAIL)
GAP: [S] map.dynasty.a blocker 2 (0097f9bc)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2.a blocker 5 (84011b8a)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil.a blocker 3 (a0acf189)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 593: 28/28 script criteria PASS (6 maps + 11 stages), 0 page errors. high_ground: a PASS (both critics), b needs archers on the bar (b2 has 2 attempts: starvation or [R]).
- Starving at 594: dynasty b (last b attempt 588): pagoda over the north canal; check-only the four dynasty stages after the commit.
- dynasty a: 2 approved [S] in a row without a strike (592, 593); a third makes it plateau. pirate a/b hold first CONFIRM lists.
- Next [S]: fantasy_evil shrine, statue + spire, stairs; fantasy_good gate towers, sky, islets; pirate stern castle, ships per team, beach ring; spooky_2 terraces, thickets.
