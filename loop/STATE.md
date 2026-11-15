# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 561   Batch: maps_1   Consecutive empty: 0   Done: 1/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 --+ o | tribal_sandbox --+ o | farmer_1 -++ o (a plateau) | farmer_2 -++ o (a plateau) | farmer_snow --+ o
maps_2: medieval_1 ??? q | medieval_2 ??? q | ancient_1 ??? q | ancient_2 ??? q | ancient_sandbox ??? q | viking ??? q | viking_sandbox ??? q
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

## Focus (iter 561: maps_1, 9 [S]; BASE 88bbb07c)
- [S] map.farmer_2.a blocker 1 warm earth bowl with pale stones (037cd776, 4b5e0fae) APPROVE, struck 1
- [S] map.farmer_2.a blocker 2 olive crowns on the oaks (b382569f, ceafd4a0, 0792aa93) APPROVE, struck 2
- [S] map.farmer_1.a blocker 1 blades off river/deck (5f83a159) APPROVE, struck 1
- [S] map.farmer_1.a blocker 2 humped arched bridge (37c2368f, dc06adf4) APPROVE, struck 2
- [S] map.farmer_1.a blocker 3 ragged stream + bank boulders (b23c5f33, 48c5b110) APPROVE, kept (course straight)
- [S] map.tribal_2.a blocker 3 back-left cliff run + front boulder piles (81facedd) APPROVE, struck 3
- [S] map.tribal_2.b blocker 4 foot rubble line (2a0f2cce) APPROVE, kept (hidden under trees)
- [S] map.tribal_sandbox.a blocker 5 red shrub clumps (6142c5b2) APPROVE, kept (too small)
- [S] map.farmer_snow.b blocker 5 houses + watermill (cb41584c) APPROVE, struck 5
- CONFIRM: farmer_1 a and farmer_2 a failed again (new 4-blocker lists) -> both a plateau ([R] next)
- 9/9, 6 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.farmer_2 (037cd776 + 4b5e0fae) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
GAP: [S] map.farmer_2 (b382569f + ceafd4a0 + 0792aa93) VERDICT: APPROVE CRITERION: map.farmer_2.a PASS
GAP: [S] map.farmer_1 (5f83a159) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.farmer_1 (37c2368f + dc06adf4) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.farmer_1 (b23c5f33 + 48c5b110) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.tribal_2 (81facedd) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [S] map.tribal_2 (2a0f2cce) VERDICT: APPROVE CRITERION: map.tribal_2.b FAIL
GAP: [S] map.tribal_sandbox (6142c5b2) VERDICT: APPROVE CRITERION: map.tribal_sandbox.a FAIL
GAP: [S] map.farmer_snow (cb41584c) VERDICT: APPROVE CRITERION: map.farmer_snow.b FAIL
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- [R] slot: farmer_1.a and farmer_2.a both plateau at 561 (oldest first: take one per iteration; spec each from both CONFIRM lists in its item file).
- Round outline kit (560): tribal_1/farmer_1/farmer_2 remap base slabs to the ellipse 54 x 48; tribal_2 b2 and farmer_snow b3 are ranked to copy it (own copy per builder).
- Stage armies on tribal_2/farmer_1/farmer_2 stand in x 2..41, z -26..18 (team 1); a footprint must keep clear or the judge fails c (561 cliffs/piles at 0.9-0.92 of the rim passed).
- Step-5 capture of 5 maps + 8 stages ran ~10 min in the background; critic and CONFIRM ran in parallel.
- Autoloop was switched off by the user during 561.
