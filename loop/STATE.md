# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 557   Batch: maps_1   Consecutive empty: 0   Done: 0/99   Parked: 0
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
maps_1: tribal_1 --+ o | tribal_2 --+ o | tribal_sandbox --+ o | farmer_1 --+ o | farmer_2 --+ o | farmer_snow --+ o
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

## Focus (iter 557: maps_1, 9 [S] + 1 [P]; BASE ebdaabc8)
- [S] map.farmer_snow.a blocker 2 night sky (d588c550) APPROVE, struck 2
- [S] map.farmer_1.b blocker 4 bank + yard walls (2a626789) APPROVE, struck 4
- [S] map.tribal_1.a blocker 2 continuous cliff mass (41e533fa) APPROVE, struck 2
- [S] map.farmer_1.a blocker 1 warm meadow + tracks (dd302114) APPROVE, struck 1
- [S] map.farmer_2.b blocker 6 totem + box removed (bbba2e12) APPROVE, struck 6
- [S] map.farmer_2.a blocker 4 straw sheaves (748358f1) APPROVE, not struck
- [S] map.tribal_2.a blocker 1 birch ring (b4f7e9e0) APPROVE, struck 1
- [S] map.tribal_sandbox.b blocker 4 field walls cleared (5ef24499) APPROVE, struck 4
- [S] map.tribal_sandbox.a blocker 1 birch ring (d88bbd91) APPROVE, struck 1
- [P] map.farmer_2.a wheat to waist height (fec0a4e6) APPROVE
- 10/10, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.farmer_snow (d588c550) VERDICT: APPROVE CRITERION: map.farmer_snow.a FAIL
GAP: [S] map.farmer_1 (2a626789) VERDICT: APPROVE CRITERION: map.farmer_1.b FAIL
GAP: [S] map.tribal_1 (41e533fa) VERDICT: APPROVE CRITERION: map.tribal_1.a FAIL
GAP: [S] map.farmer_1 (dd302114) VERDICT: APPROVE CRITERION: map.farmer_1.a FAIL
GAP: [S] map.farmer_2 (bbba2e12) VERDICT: APPROVE CRITERION: map.farmer_2.b FAIL
GAP: [S] map.farmer_2 (748358f1) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
GAP: [S] map.tribal_2 (b4f7e9e0) VERDICT: APPROVE CRITERION: map.tribal_2.a FAIL
GAP: [S] map.tribal_sandbox (5ef24499) VERDICT: APPROVE CRITERION: map.tribal_sandbox.b FAIL
GAP: [S] map.tribal_sandbox (d88bbd91) VERDICT: APPROVE CRITERION: map.tribal_sandbox.a FAIL
GAP: [P] map.farmer_2 (fec0a4e6) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Every maps_1 map has its own self-contained builder in web/src/map/tabs/. The far mountain range + second slab (base meshes mountainBase/Cap/Root) is a standing blocker on tribal_1/2/sandbox/farmer_1: farmer_snow's nightSky hides them by name; copy that per map.
- Shared standing blockers: navy spiked underside (islandUnder/crags), translucent zone box (capture-side zone overlay? check before touching), rounded-rectangle outline.
- Stage armies on tribal_2/farmer_1/farmer_2 stand in x 2..41, z -26..18 (team 1); tribal_1 armies within 27 m of centre. A footprint must keep clear or the judge fails c.
- iter-557 critic.md is saved; no CONFIRM ran (no item near done). Step-5 capture: 75 shots, ~12 min, run in the background.
