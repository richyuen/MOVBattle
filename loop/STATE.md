# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 587   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 17/99   Parked: 0
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
maps_3: dynasty +-+ o | renaissance +++ D | pirate +-+ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation -++ o | bridge --+ o | hill --+ o | corridor --+ o | defend_the_castle --+ o | high_ground --+ o | low_ground --+ o
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

## Focus (iter 587: maps_3+maps_4 (tail overlap, maps_4 audited), 1 [R] + 7 [S]; BASE 8a9d2327)
- [R] map.spooky_1.a blockers 1-3 (7542093c + 80297d4f) APPROVE, struck a1, a2, a3; CONFIRM a PASS -> D
- [S] map.pirate.b blocker 5 (22ba62eb; evidence fc94485f map_pirate_deck) APPROVE, struck b5
- [S] map.pirate.b blocker 3 (4ace43d4) APPROVE, no strike; early CONFIRM unused (b still FAIL)
- [S] map.spooky_2.a blocker 3 (cb026095 + 858d6a2e + 95f26b5d) APPROVE, no strike
- [S] map.spooky_2.a blocker 7 (76101bad + 7189ff78 + 9ad673bd) APPROVE, struck a7
- [S] map.simulation.a blocker 1 (b23e942c) APPROVE, struck a1, a4
- [S] map.simulation.a blocker 2 (9fed27e5 + 40c4de96) APPROVE, struck a2
- [S] map.simulation.a blocker 3 (bafe8f20) APPROVE, struck a5
- 8/8, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.spooky_1 (7542093c, 80297d4f)
VERDICT: APPROVE
CRITERION: map.spooky_1.a PASS   (previous: FAIL)
GAP: [S] map.pirate (22ba62eb, evidence fc94485f)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (4ace43d4)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (cb026095, 858d6a2e, 95f26b5d)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (76101bad, 7189ff78, 9ad673bd)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.simulation (b23e942c)
VERDICT: APPROVE
CRITERION: map.simulation.a FAIL   (previous: FAIL)
GAP: [S] map.simulation (9fed27e5, 40c4de96)
VERDICT: APPROVE
CRITERION: map.simulation.a FAIL   (previous: FAIL)
GAP: [S] map.simulation (bafe8f20)
VERDICT: APPROVE
CRITERION: map.simulation.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 587: maps_4 audited (output/loop/iter-587/audit.md, audit2.md): all 9 maps c PASS; simulation b PASS; the five plane maps (bridge, corridor, defend_the_castle, high_ground, low_ground) have no builder and render the bare simulation plane; fantasy_good/evil are the old meadow ovals.
- 587 step 5: 26/26 script criteria PASS, zero page errors; spooky_1 D (CONFIRM passed a, b). Pirate's early CONFIRM unused (b still FAIL) but would fail a and b (ships rotated 90 deg, hulls, sand drum, sky): see its Notes.
- Eligible [P] (fallout within 3 iterations): simulation paleSky hue (bafe8f20), spooky_2 thorn heaps (cb026095). Simulation a has one blocker left: its [P] could finish it, then CONFIRM.
- Spooky_2: the base "hill" mound under the torii still shows (the bounds test missed it, cause unverified: probe its parent/position; hiding by name worked on spooky_1); all four mounds are red discs.
- Unpickable: dynasty b3 until 588 (starvation), spooky_2 a4 (starvation 590), pirate b3 (2 attempts; starvation 592). Pirate [P] ripple tone eligible to 589.
