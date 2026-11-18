# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 595   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 23/99   Parked: 0
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
maps_3: dynasty -++ o | renaissance +++ D | pirate --+ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil -++ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +-+ o | low_ground +++ D
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

## Focus (iter 595: maps_3+maps_4, 9 [S] + 1 [P]; BASE a6fcdaaa; evidence 637bc25c)
- [S] map.pirate.b blocker 1, one galleon per team side (b3ba566f) APPROVE, struck b1
- [S] map.fantasy_evil.b blocker 2, stair flights (da55aaca) APPROVE, struck b2 (b PASS)
- [S] map.spooky_2.b blocker 4, ring + loop squared (1d0481dd) APPROVE, no strike (corners chamfered)
- [S] map.fantasy_good.b blocker 1, stepped long edges (3ea9ae23) APPROVE, struck b1
- [S] map.dynasty.b blocker 2, canal outlets + waterfalls (65195d10) APPROVE, struck b2 (b PASS)
- [S] map.fantasy_evil.a blocker 4, green-glow rock rim (27e30aa2 + b9a45842) APPROVE, struck a4
- [S] map.fantasy_good.a blocker 4, viaduct underside (d777e226) APPROVE, stalactite clause cleared
- [S] map.fantasy_evil.a blocker 6, rock mass + chains (3b0cd8d4) APPROVE, slab clause struck
- [S] map.fantasy_good.b blocker 5, side islets (79c9305c) APPROVE, struck b5
- [P] map.fantasy_good.a blocker 3, leg-front waterfalls (725faf2f) APPROVE, struck a3
- CONFIRM map.fantasy_good: failed a, b (new lists, 0 since 595)
- 10/10, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.pirate (b3ba566f; evidence 637bc25c)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (da55aaca)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b PASS   (previous: FAIL)
GAP: [S] map.spooky_2 (1d0481dd)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (3ea9ae23)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL; flips to PASS with 79c9305c below)
GAP: [S] map.dynasty (65195d10)
VERDICT: APPROVE
CRITERION: map.dynasty.b PASS   (previous: FAIL)
GAP: [S] map.fantasy_evil (27e30aa2 + b9a45842)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (d777e226)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_evil (3b0cd8d4)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (79c9305c)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b PASS   (previous: FAIL)
GAP: [P] map.fantasy_good (725faf2f)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 595: 25/25 script criteria PASS (5 maps + 10 stages), 0 page errors. CONFIRM fantasy_good failed a, b (1st; critic b PASS overridden). dynasty b, fantasy_evil b critic-PASS, CONFIRM due when the item would be done.
- high_ground b2 (2 attempts, last 593) starves at 598; until then [R] only. pirate a2, spooky_2 a4 and b1, dynasty a2: 2 attempts each. spooky_2 b: 2 approved [S] in a row without a strike.
- Next [S]: pirate b2 team-1 deck zone + stage armies on it, a3 beach ring; fantasy_evil a5 statue into the ground frame; spooky_2 b4 corner notches, a3 thickets; dynasty a5 trees, a4 underside; fantasy_good a6 dressing, a5 corruption, b1 pits, b2 front ledge.
- [P] eligible to 598: fantasy_good viaduct arch heads (rotation PI/2,0,0) + longer columns; fantasy_evil rockMass lit (.2,.26,.32)/(.07,.09,.11). fantasy_evil statue [P] to 597.
