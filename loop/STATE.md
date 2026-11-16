# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 562   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 2/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +-+ o | tribal_sandbox +-+ o | farmer_1 +++ D | farmer_2 -++ o (a plateau) | farmer_snow --+ o
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

## Focus (iter 562: maps_1+maps_2 (tail overlap: maps_2 audited), 1 [R] + 6 [S] + 1 [P]; BASE 8c3be574)
- [R] map.farmer_1.a blockers 1-4 look rebuild (170c7a00) APPROVE, struck 1-4
- [S] map.tribal_2.a blocker 6 stone dog shrine (317a5b85) APPROVE, struck 6
- [S] map.farmer_snow.b blocker 3 round outline, ring thinned (e9d95cfa) APPROVE, struck 3, added 6
- [S] map.farmer_snow.a blocker 3 bulb strings + Christmas tree (d7b02859) APPROVE, struck 3
- [S] map.farmer_snow.a blocker 4 dark timber mill + glow fix (23817396, 452f35d3) APPROVE, struck 4
- [S] map.tribal_2.b blocker 2 round outline, birches to the rim (e08c4278) APPROVE, struck 2
- [S] map.tribal_sandbox.b blocker 3 rim mesas (22bf0f3a) APPROVE, struck 3
- [P] map.tribal_sandbox.a blocker 5 shrubs x2.5 (61d4fb96) APPROVE, struck 5
- CONFIRM: farmer_1 a passed -> farmer_1 D (thumbnail re-rendered)
- 8/8, 11 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.farmer_1 (170c7a00) VERDICT: APPROVE CRITERION: map.farmer_1.a PASS
GAP: [S] map.tribal_2 (317a5b85) VERDICT: APPROVE CRITERION: map.tribal_2.a PASS
GAP: [S] map.farmer_snow (e9d95cfa) VERDICT: APPROVE CRITERION: map.farmer_snow.b FAIL
GAP: [S] map.farmer_snow (d7b02859) VERDICT: APPROVE CRITERION: map.farmer_snow.a FAIL
GAP: [S] map.farmer_snow (23817396 + 452f35d3) VERDICT: APPROVE CRITERION: map.farmer_snow.a FAIL
GAP: [S] map.tribal_2 (e08c4278) VERDICT: APPROVE CRITERION: map.tribal_2.b FAIL
GAP: [S] map.tribal_sandbox (22bf0f3a) VERDICT: APPROVE CRITERION: map.tribal_sandbox.b FAIL
GAP: [P] map.tribal_sandbox (61d4fb96) VERDICT: APPROVE CRITERION: map.tribal_sandbox.a PASS
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- [R] slot: farmer_2.a (plateau 561) is next; spec it from both CONFIRM lists in its item file.
- maps_2 (audited 562): none of its 7 maps has a builder; each first gap is its own tabs/<id>.ts on a SHARED base (campaign.challenge for 5, campaign.adventure for medieval_2: never edit those bases). Pick from maps_1 and maps_2 together.
- Stage armies on tribal_2/farmer_1/farmer_2 stand in x 2..41, z -26..18 (team 1); a footprint must keep clear or the judge fails c.
- Critic 562 aside: stage_fantasy_evil.raze_the_homestead_field.png shows a pale grey rectangle behind the island (not in map_farmer_1_top): check it at the maps_1 checkpoint.
- Step-5 capture of 4 maps + 5 stages ran ~8 min in the background; critic and CONFIRM ran in parallel.
