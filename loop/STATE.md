# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 564   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 2/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 -++ o | tribal_sandbox +-+ o | farmer_1 +++ D | farmer_2 -++ o (a plateau) | farmer_snow --+ o
maps_2: medieval_1 --+ o | medieval_2 --+ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox --+ o | viking --+ o | viking_sandbox --+ o
maps_3: dynasty ??? q | renaissance ??? q | pirate ??? q | spooky_1 ??? q | spooky_2 ??? q | wild_west ??? q | legacy ??? q
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

## Focus (iter 564: maps_1+maps_2, 1 [R] + 8 [S]; BASE 5f4bd642)
- [S] map.viking_sandbox.b blocker 4 base junk removed (617a5f5a) APPROVE, struck monolith clause of 4, and 2
- [S] map.viking_sandbox.a blocker 1 snow floor + teal ice patches + cracks (78fc3163) APPROVE, struck 1
- [S] map.ancient_sandbox.b blocker 5 base junk removed (d4443b87) APPROVE, struck monolith clause of 5
- [S] map.ancient_sandbox.a blocker 5 blue sea, shallows, foam (288ca462) APPROVE, struck 5
- [S] map.farmer_snow.a blocker 6 base slab + totem removed (79991c9b) APPROVE, struck 6
- [S] map.farmer_snow.b blocker 1 pine grove on the houses' bank (140782a1) APPROVE, struck 1
- [S] map.tribal_2.a blocker 1 massif as heaped faceted boulders, warm rock (6d29e353) APPROVE, struck 1, 2
- [S] map.tribal_2.a blocker 4 pale stone clusters + bone sticks (140833c3) APPROVE, struck 4
- [R] map.farmer_2.a blockers 1-3 grove groups, hedge, bush heaps, wheat (8992d360) APPROVE, critic struck 1-3 (PASS)
- Skipped: tribal_sandbox.b1 (1.4x scale needs the 120 m camera radius clamp lifted for that map's top/island shots: evidence commit first)
- CONFIRM: farmer_2 failed a (4th) -> stays open, plateau, CONFIRM 564 list replaces a
- 9/9, 12 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.viking_sandbox (617a5f5a) VERDICT: APPROVE CRITERION: map.viking_sandbox.b FAIL
GAP: [S] map.viking_sandbox (78fc3163) VERDICT: APPROVE CRITERION: map.viking_sandbox.a FAIL
GAP: [S] map.ancient_sandbox (d4443b87) VERDICT: APPROVE CRITERION: map.ancient_sandbox.b FAIL
GAP: [S] map.ancient_sandbox (288ca462) VERDICT: APPROVE CRITERION: map.ancient_sandbox.a FAIL
GAP: [S] map.farmer_snow (79991c9b) VERDICT: APPROVE CRITERION: map.farmer_snow.a FAIL
GAP: [S] map.farmer_snow (140782a1) VERDICT: APPROVE CRITERION: map.farmer_snow.b FAIL
GAP: [S] map.tribal_2 (6d29e353) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [S] map.tribal_2 (140833c3) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [R] map.farmer_2 (8992d360) VERDICT: APPROVE CRITERION: map.farmer_2.a PASS
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- [R] slot: farmer_2.a (plateau, CONFIRM failed 560/561/563/564); spec from the CONFIRM lists in its item file (rim discs, pale cottage, straw-gold wheat, green alley strip).
- tribal_sandbox.b1 needs an evidence commit first: cameraController upperRadiusLimit 120 clamps the top (135) and island (200) poses; lift it for that map's shots only, or every map's shots change.
- maps_2 untouched builders: medieval_1, medieval_2, ancient_1, ancient_2, viking (base campaign.challenge/adventure/introduction: never edit bases). Starving from iter 567 if still untouched.
- tribal_2 has one a blocker left (back-left rock ledge): striking it sends the item to CONFIRM.
- Critic 562 aside still open: stage_fantasy_evil.raze_the_homestead_field.png pale grey rectangle behind the island; check at the maps_1 checkpoint.
