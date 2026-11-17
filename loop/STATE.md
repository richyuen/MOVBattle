# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 572   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 6/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow -++ o
maps_2: medieval_1 +++ D | medieval_2 -++ o | ancient_1 --+ o | ancient_2 --+ o | ancient_sandbox +-+ o | viking --+ o | viking_sandbox -++ o
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

## Focus (iter 572: maps_1+maps_2, 9 [S] + 1 [R]; BASE cf80e6fe)
- [R] map.farmer_snow.a blockers 1 and 3 rock caps and mill-bank shade (2cf0d365) APPROVE, struck a1, a3 (a PASS; CONFIRM failed a)
- [S] map.medieval_2.a blocker 3 multi-depth castle-foot oaks (afbebfe0) APPROVE, struck a3 (a PASS; CONFIRM failed a, passed b)
- [S] map.viking_sandbox.a blocker 3 grounded ledge caps (17023fc0) APPROVE, struck a3 (a PASS; CONFIRM failed a)
- [S] map.ancient_1.a blocker 6 lighthouse (b49c9e06) APPROVE, struck a6
- [S] map.ancient_1.b blocker 2 two streets (86b2096b) APPROVE, struck b2 (b PASS; CONFIRM failed b)
- [S] map.ancient_1.a blocker 4 pebbled brown underside (650af264) APPROVE, struck a4 (a PASS; CONFIRM failed a)
- [S] map.ancient_2.a blocker 3 beige ring wall (ed751363) APPROVE, struck a3
- [S] map.ancient_sandbox.b blocker 3 spiral mountain (72b505d7) APPROVE, struck b3 and a3
- [S] map.viking.a blocker 3 cyan haze and snowfall (30beeb4b+b35b008f) APPROVE, struck a3
- [S] map.ancient_sandbox.a blocker 2 hamlets and cypresses (686f2456) APPROVE, struck a2 (a PASS, pending CONFIRM)
- 10/10, 12 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.farmer_snow (2cf0d365)
VERDICT: APPROVE
CRITERION: map.farmer_snow.a PASS   (previous: FAIL)
GAP: [S] map.medieval_2 (afbebfe0)
VERDICT: APPROVE
CRITERION: map.medieval_2.a PASS   (previous: FAIL)
GAP: [S] map.viking_sandbox (17023fc0)
VERDICT: APPROVE
CRITERION: map.viking_sandbox.a PASS   (previous: FAIL)
GAP: [S] map.ancient_1 (b49c9e06)
VERDICT: APPROVE
CRITERION: map.ancient_1.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_1 (86b2096b)
VERDICT: APPROVE
CRITERION: map.ancient_1.b PASS   (previous: FAIL)
GAP: [S] map.ancient_1 (650af264)
VERDICT: APPROVE
CRITERION: map.ancient_1.a PASS   (previous: FAIL)
GAP: [S] map.ancient_2 (ed751363)
VERDICT: APPROVE
CRITERION: map.ancient_2.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (72b505d7)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.b FAIL   (previous: FAIL)
GAP: [S] map.viking (30beeb4b+b35b008f)
VERDICT: APPROVE
CRITERION: map.viking.a FAIL   (previous: FAIL)
GAP: [S] map.ancient_sandbox (686f2456)
VERDICT: APPROVE
CRITERION: map.ancient_sandbox.a PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 572 capture: 82 shots, zero page errors; all 43 script checks passed across seven maps and 18 stages. Critic approved 10/10.
- Early CONFIRMs failed a on Farmer Snow, Medieval 2 and Viking Sandbox (their lists are now the blockers): all three are plateau. One [R] per iteration, oldest first: Farmer Snow, then Viking Sandbox, then Medieval 2.
- Ancient 1 CONFIRM 572 failed a and b (6 + 5 blockers). Evidence first: its battle camera now sits over the middle band roofs (b3); re-aim that pose onto a street or plaza before picking on b.
- Ancient Sandbox a PASS awaits CONFIRM; its b needs the larger irregular outline and islets. The pale rectangle in stage_fantasy_evil.raze_the_homestead_field.png remains an open note from 562.
