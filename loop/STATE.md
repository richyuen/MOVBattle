# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 596   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 23/99   Parked: 0
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
maps_3: dynasty -++ o | renaissance +++ D | pirate -++ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
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

## Focus (iter 596: maps_3+maps_4, 9 [S] + 1 [P]; BASE 1c11cae8)
- [S] map.fantasy_evil.a blocker 5, statue into the ground frame (f4eef72d + 990ecde8) APPROVE, statue clause cleared, no strike
- [S] map.pirate.b blocker 2, team-1 deck zone + stage armies on it (ca380e64) APPROVE, struck b2 (b PASS)
- [S] map.pirate.a blocker 3, outer beach ring (ffb7e7ad + 8e8d3c20) APPROVE, struck a3
- [S] map.spooky_2.b blocker 4, corner notches + square loop (24225dd9 + 7e3e49bc) APPROVE, no strike (b plateau)
- [S] map.spooky_2.a blocker 3, bramble heaps (703a2a26) APPROVE, struck a3
- [S] map.dynasty.a blocker 5, cherry grove (2fb7605e) APPROVE, no strike
- [S] map.dynasty.a blocker 4, boulder cliffs (534e1920) APPROVE, no strike (a plateau)
- [S] map.fantasy_good.b blocker 1, five staggered pits (65479838) APPROVE, struck b1
- [S] map.fantasy_good.a blocker 6, clean deck + inlays (788ad169) APPROVE, struck a6
- [P] map.fantasy_evil.a blocker 6, rock mass lit (da34040c) REJECT, reverted ce1a3756
- early CONFIRM map.fantasy_evil: a FAIL, b PASS (not counted: item not would-be-done)
- 9/10, 5 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.fantasy_evil (f4eef72d + 990ecde8)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
GAP: [S] map.pirate (ca380e64)
VERDICT: APPROVE
CRITERION: map.pirate.b PASS   (previous: FAIL)
GAP: [S] map.pirate (ffb7e7ad + 8e8d3c20)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (24225dd9 + 7e3e49bc)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (703a2a26)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (2fb7605e)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (534e1920)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (65479838)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b FAIL   (previous: FAIL)
GAP: [S] map.fantasy_good (788ad169)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL   (previous: FAIL)
GAP: [P] map.fantasy_evil (da34040c)
VERDICT: REJECT
CRITERION: map.fantasy_evil.a FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 596: 25/25 script criteria PASS (5 maps + 10 stages), 0 page errors. Plateau: dynasty a (takes the [R] slot at 597), spooky_2 b (its [R] waits; one [R] per iteration, oldest first).
- Starvation: high_ground b2 at 598 (2 attempts, [R] only). 2 attempts: pirate a2, spooky_2 a4, fantasy_evil a5, dynasty a2. Pirate b and dynasty/fantasy_evil b critic-PASS, CONFIRM due when the item would be done.
- Next [S]: fantasy_good b2 front ledge + back jog, a4 dark pit shafts, a3 waterfalls, a5 corruption; fantasy_evil a6 backdrop crag above the deck behind the back-right rim.
- [P] eligible: fantasy_evil statue chains 2.2 m (to 599); fantasy_good arch heads (to 598). Dynasty fallouts (cherry hue, moss) only via its [R].
