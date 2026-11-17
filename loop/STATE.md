# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 577   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 12/99   Parked: 0
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
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty --+ o | renaissance --+ o | pirate --+ o | spooky_1 --+ o | spooky_2 --+ o | wild_west --+ o | legacy --+ o
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

## Focus (iter 577: maps_2+maps_3, 9 [S] + 1 [P]; BASE a57c443c)
- [S] map.pirate.b blocker 4 no lagoon (6141b061) APPROVE, struck b4
- [S] map.wild_west.b blocker 3 open street (fc2afb16) APPROVE, struck b3
- [S] map.legacy.a blocker 2 meadow (1d4cd558) APPROVE, no strike (palette cleared, tall-tuft clause stands)
- [S] map.spooky_1.a blocker 1 night grass (6259e76b) APPROVE, struck a1 (+a5 via 479af4ee)
- [S] map.dynasty.a blocker 5 mint sky (b1711009) APPROVE, struck a5
- [S] map.dynasty.b blocker 1 square notched island (83c9ca4a) APPROVE, struck b1
- [S] map.renaissance.b blocker 1 rectangular piazza (aa80ffb9) APPROVE, struck b1
- [P] map.pirate.a stern timber, fallout of 40a26f12 (d682afff) REJECT, reverted d682df5f
- [S] map.wild_west.a blocker 2 desert rim (4b99d78f) APPROVE, struck a2
- [S] map.spooky_1.b blocker 1 fog chasm (479af4ee) APPROVE, struck b1, b3, b4
- 9/10, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.pirate (6141b061)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [P] map.pirate (d682afff)
VERDICT: REJECT
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.wild_west (fc2afb16)
VERDICT: APPROVE
CRITERION: map.wild_west.b FAIL   (previous: FAIL)
GAP: [S] map.wild_west (4b99d78f)
VERDICT: APPROVE
CRITERION: map.wild_west.a FAIL   (previous: FAIL)
GAP: [S] map.legacy (1d4cd558)
VERDICT: APPROVE
CRITERION: map.legacy.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_1 (6259e76b)
VERDICT: APPROVE
CRITERION: map.spooky_1.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_1 (479af4ee)
VERDICT: APPROVE
CRITERION: map.spooky_1.b FAIL   (previous: FAIL)
GAP: [S] map.dynasty (b1711009)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL   (previous: FAIL)
GAP: [S] map.dynasty (83c9ca4a)
VERDICT: APPROVE
CRITERION: map.dynasty.b FAIL   (previous: FAIL)
GAP: [S] map.renaissance (aa80ffb9)
VERDICT: APPROVE
CRITERION: map.renaissance.b FAIL   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 577: 84 shots, zero page errors, all 46 script checks pass. critic.md in iter-577 condenses the unchanged blocker lists ("1-6 unchanged"); item files carry them verbatim.
- Ancient 2 a3 has 2 attempts: not pickable as [S] until starvation (last attempt 576) or a plateau [R]. maps_2 stays on Batch: until it closes.
- spooky_2 can start: dynasty's square outline landed (577); copy squareIsland into tabs/spooky_2.ts turned 180 deg (no import).
- Eligible [P] next iteration: legacy.a meadow tufts upright (fallout of 1d4cd558). Pirate sterns need an [S] (thin gold rims, dark top), not a colour swap.
- LEDGER rows of the 12 done maps were compacted to one line at 577 (budget).
