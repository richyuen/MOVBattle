# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 565   Batch: maps_1+maps_2   Consecutive empty: 0   Done: 3/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +-+ o | farmer_1 +++ D | farmer_2 -++ o (a plateau) | farmer_snow -++ o
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

## Focus (iter 565: maps_1+maps_2, 1 [R] + 7 [S]; BASE 93c67eaf)
- [S] map.viking_sandbox.b blocker 4 base field dressing + pits removed (6278850c) APPROVE, struck 4
- [S] map.ancient_sandbox.b blocker 5 base field dressing + pits removed (b149e156) APPROVE, struck 5
- [S] map.tribal_2.a blocker 3 two-tier ledge wall, ledge birches (e503d93f) APPROVE, struck 3 (PASS; CONFIRM passed -> D)
- [S] map.farmer_snow.b blocker 2 mill onto the +x bank, wheel in the ice (ca008f0d) APPROVE, struck 2 (b PASS)
- [S] map.viking.a blocker 1 own builder: ice lake + cracks, snow banks (4d8db327) APPROVE, struck a1, b1
- [S] map.medieval_2.b blocker 1 own builder: front pond, paths, lagoons/plank out (61b2ec07+4e086afe) APPROVE, struck 1, 2, 3
- [S] map.ancient_2.a blocker 2 own builder: temple complex (b364ac2a) APPROVE, struck a2, b2
- [R] map.farmer_2.a blockers 1-4 rim masses, pale cottage, straw wheat, alley (b84ba5a1) APPROVE, struck 1, 2, 4 (CONFIRM passed a; critic kept 3)
- Skipped: tribal_sandbox.b1 (evidence commit first), medieval_1, ancient_1 (starve at 567: take them first in 566)
- 8/8, 14 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.viking_sandbox (6278850c) VERDICT: APPROVE CRITERION: map.viking_sandbox.b FAIL
GAP: [S] map.ancient_sandbox (b149e156) VERDICT: APPROVE CRITERION: map.ancient_sandbox.b FAIL
GAP: [S] map.tribal_2 (e503d93f) VERDICT: APPROVE CRITERION: map.tribal_2.a PASS
GAP: [S] map.farmer_snow (ca008f0d) VERDICT: APPROVE CRITERION: map.farmer_snow.b PASS
GAP: [S] map.viking (4d8db327) VERDICT: APPROVE CRITERION: map.viking.a FAIL
GAP: [S] map.medieval_2 (61b2ec07 + 4e086afe) VERDICT: APPROVE CRITERION: map.medieval_2.b FAIL
GAP: [S] map.ancient_2 (b364ac2a) VERDICT: APPROVE CRITERION: map.ancient_2.a FAIL
GAP: [R] map.farmer_2 (b84ba5a1) VERDICT: APPROVE CRITERION: map.farmer_2.a FAIL plateau
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Starving at 567: medieval_1 (a, b) and ancient_1 (a, b) have no attempt since their 562 audit: give them own builders first in 566 (base campaign.introduction / campaign.challenge; never edit bases).
- [R] slot: farmer_2.a, one blocker left (wheat colour): lower the self-light (<= 0.15) at a warm gold-orange; CONFIRM 565 already passed a.
- tribal_sandbox.b1 needs an evidence commit first: cameraController upperRadiusLimit 120 clamps the top (135) and island (200) poses; lift it in capture-world.mjs for that map's shots only.
- The challenge-base junk clear (wallStone, boulder, hayBale, hill, stump, pits) is ranked for viking.b4 and ancient_2.b5: copy viking_sandbox's clearFieldDressing.
- Critic 562 aside still open: stage_fantasy_evil.raze_the_homestead_field.png pale grey rectangle behind the island; check at the maps_1 checkpoint.
