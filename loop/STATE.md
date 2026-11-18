# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 585   Batch: maps_2+maps_3   Consecutive empty: 0   Done: 13/99   Parked: 0
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
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 -++ o | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty +-+ o | renaissance -++ o | pirate --+ o | spooky_1 -++ o | spooky_2 --+ o | wild_west -++ o | legacy +++ D
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

## Focus (iter 585: maps_2+maps_3, 1 [R] + 7 [S] + 1 evidence re-aim; BASE a67a7d56)
- [E] map.renaissance.b blocker 6 shot re-aimed to map_renaissance_arcade (a67a7d56) APPROVE, struck b6 -> b PASS
- [R] map.spooky_1.a blocker 2 (d6e6dbce) APPROVE, struck a2 (critic a PASS); CONFIRM a FAIL with a fresh list -> plateau
- [S] map.renaissance.a blocker 6 (7325dec5) APPROVE, struck a6
- [S] map.renaissance.a blocker 4 (2cfb1cf0) APPROVE, struck a4
- [S] map.pirate.b blocker 2 (07e0b708) APPROVE, struck b2
- [S] map.pirate.a blocker 6 (26b8a6d7) APPROVE, struck a6
- [S] map.pirate.a blocker 4 (8f023e21) APPROVE, struck a4
- [S] map.spooky_2.a blocker 4 (6ad3b2cd) APPROVE, no strike
- [S] map.spooky_2.b blocker 2 (45cc5ae9) APPROVE, stair clause struck
- 9/9, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.spooky_1 (d6e6dbce)
VERDICT: APPROVE
CRITERION: map.spooky_1.a PASS   (previous: FAIL)
GAP: [S] map.renaissance (7325dec5)
VERDICT: APPROVE
CRITERION: map.renaissance.a FAIL   (previous: FAIL)
GAP: [S] map.renaissance (2cfb1cf0)
VERDICT: APPROVE
CRITERION: map.renaissance.a FAIL   (previous: FAIL)
GAP: [S] map.pirate (07e0b708)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (26b8a6d7)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.pirate (8f023e21)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (6ad3b2cd)
VERDICT: APPROVE
CRITERION: map.spooky_2.a FAIL   (previous: FAIL)
GAP: [S] map.spooky_2 (45cc5ae9)
VERDICT: APPROVE
CRITERION: map.spooky_2.b FAIL   (previous: FAIL)
GAP: [E] map.renaissance (a67a7d56)
VERDICT: APPROVE
CRITERION: map.renaissance.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 585: 53 shots, zero page/console errors, all 28 script criteria PASS; 9/9 approved, 8 struck; renaissance b PASS (CONFIRM pending until renaissance is would-be-done). No checkpoint.
- Plateau [R]s, one per iteration: 586 wild_west a (near block see-through since 584's sand: floor self-light and glow exclusion first, then the sky backdrop; 582/584 CONFIRM lists), 587 spooky_1 a (far-rim watchtower, broken pillar, red ground discs; 585 confirm.md).
- Renaissance a: cream flagstone checker (a3) and facade kit (a5); square off the oval floor drum's lavender lip on the plinth. Pirate: galleon rebuild (a1), golden rippled sand (a5), standable decks (b5); darker plank material is eligible [P] fallout of 07e0b708.
- Spooky 2: black twisted ring trees (a5), thorn thickets (a3), stone bridges inboard |x|~30 with 3 m arch and darker stone (b2); a4 has 2 attempts (starvation 590).
- Unpickable: dynasty b3 until 588, ancient_2 a3 starves at 586 (takes a slot), spooky_2 a4 (2 attempts).
