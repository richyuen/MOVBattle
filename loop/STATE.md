# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 581   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
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
maps_3: dynasty --+ o | renaissance --+ o | pirate --+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west -++ o | legacy -++ o
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

## Focus (iter 581: maps_2+maps_3, 9 [S]; BASE b5efbd6a)
- [S] map.ancient_2.a blocker 3 (7ced1c3e) APPROVE, no strike (starvation)
- [S] map.legacy.a blocker 7 (4ca22ba3) APPROVE, no strike
- [S] map.legacy.b blocker 3 (5a649e0c) APPROVE, struck b3
- [S] map.spooky_1.b blocker 5 (8b37b4e3, b0f7dd32, 8800d66d) APPROVE, struck b5
- [S] map.wild_west.a blocker 3 (dc051619) APPROVE, no strike
- [S] map.wild_west.b blocker 1 (c305d702) APPROVE, struck b1
- [S] map.wild_west.b blocker 4 (1f0d6c88) APPROVE, struck b4
- [S] map.dynasty.a blocker 4 (9a58d04e) APPROVE, struck a4
- [S] map.dynasty.b blocker 2 (63de26e1) APPROVE, struck b2 and collateral a6
- 9/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.ancient_2.a blocker 3 (7ced1c3e)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL (previous: FAIL)
GAP: [S] map.legacy.a blocker 7 (4ca22ba3)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL (previous: FAIL)
GAP: [S] map.legacy.b blocker 3 (5a649e0c)
VERDICT: APPROVE
CRITERION: map.legacy.b PASS (previous: FAIL)
GAP: [S] map.spooky_1.b blocker 5 (8b37b4e3, b0f7dd32, 8800d66d)
VERDICT: APPROVE
CRITERION: map.spooky_1.b PASS (previous: FAIL)
GAP: [S] map.wild_west.a blocker 3 (dc051619)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL (previous: FAIL)
GAP: [S] map.wild_west.b blocker 1 (c305d702)
VERDICT: APPROVE
CRITERION: map.wild_west.b FAIL (previous: FAIL)
GAP: [S] map.wild_west.b blocker 4 (1f0d6c88)
VERDICT: APPROVE
CRITERION: map.wild_west.b PASS (previous: FAIL)
GAP: [S] map.dynasty.a blocker 4 (9a58d04e)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL (previous: FAIL)
GAP: [S] map.dynasty.b blocker 2 (63de26e1)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL (previous: FAIL)
REGRESSIONS: none. All 62 final PNGs were inspected, including every dependent-stage army/field/battle shot; no regression attributable to these commits was identified. All 33 script criteria PASS. The missing reference/stages/fantasy_good.fortified_formation.png was checked via its available .thumb.png fallback and the other Legacy references.

## Notes for next iteration (max 5 lines)
- 581: 62 final shots; zero page/console errors; all 33 script criteria PASS. Expected --add note for Spooky 1 refresh. No batch checkpoint or new D.
- Spooky 1 b passed CONFIRM; a failed its first CONFIRM (grass and tree silhouettes). Only Spooky 1 was would-be-done; other early CONFIRM answers unused.
- Legacy a7 sky and Wild West a3 natural rock silhouettes remain; both b PASS await applicable CONFIRM. Dynasty a3 cliff sides and b3/b4/b5 remain.
- Ancient 2 a3 attempt 3 approved, no strike; next starvation at 586. Pirate b starves at 582 and a at 583; Renaissance a3 checker still open.
- Critic/CONFIRM: output/loop/iter-581/critic.md, confirm.md. LESSONS near cap; merge before adding. No criterion newly plateaued or parked.
