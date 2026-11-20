# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 617   Batch: stages_spooky+stages_simulation   Consecutive empty: 0   Done: 71/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item template: # <id>; Status: open|done|parked Audited: N(AUDIT x2),N(CONFIRM: passed a; failed b) Done: N
## Verdicts: a FAIL (0 since N; list from AUDIT|CONFIRM N): 1. <blocker verbatim> s2. <element> in <shot> (struck N) / a PASS(N: struck n; CONFIRM N); b likewise; c PASS(N judge) / c FAIL(N judge): <reasons>
## Ranked gaps: 1. [S|P|R] <id>.<letter> <gap> — blocker n: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict); ## Rejected (last4); ## Notes(max3lines).
Marks per a b c: + pass,- fail,? unscored. Status q queued,o open,D done,p parked. Map a look,b layout,c play; stage a army,b formation,c battle. -->

## Scoreboard
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty +++ D | renaissance +++ D | pirate +++ D | spooky_1 +++ D | spooky_2 +++ D | wild_west +++ D | legacy +++ D
maps_4: fantasy_good +++ D | fantasy_evil +++ D | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ D | low_ground +++ D
stages_introduction: clubs +++ D | army +++ D | hay_and_pitchforks +++ D | basic_formation +++ D | ice_archers_only_almost +++ D | longships +++ D
stages_adventure: tree_tribe +++ D | the_tiniest_attack +++ D | sneaky_tribe +++ D | tree_mammoths +++ D | final_destination_wheelbarrow +++ D | a_fierce_rider +++ D
stages_challenge: ice_archer_and_friends +++ D | knights_and_priests +++ D | a_warm_welcome +++ D | zeus +++ D | twin_lords +++ D | big_brawl +++ D
stages_dynasty: samurai +++ D | art_of_war +++ D | area_of_effect +++ D | catapults +++ D | zeus_and_other_folks +++ D | viking_army +++ D
stages_renaissance: a_new_art_wave +++ D | balloons +++ D | renaissance_fencer +++ D | renaissance_vs_farmer_1 +++ D | renaissance_vs_ancient_2 +++ D | renaissance_vs_dynasty_3 +++ D
stages_pirate: x_marks_the_spot +++ D | a_rival_captain +++ D | a_small_tribe +++ D | you_won_t_make_us_walk_the_plank +++ D | arrows_and_arrow +++ D | boom_and_the_units_go_down +++ D
stages_spooky: bone +++ D | war +-+ o | cave +++ D | turtle +++ D | breakout +++ D | plunder +++ D
stages_simulation: bridge_battle +-+ o | hill +-+ o | wall +-+ o | siege +-+ o | catapult_castle +++ D | pit +-+ o
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter617 stages_spooky+stages_simulation; 9 [S]; BASE d2090735)
- [S] spooky.plunder.b2 2b5c4799 APPROVE struck 2; b3 611811bb+5639eb60 APPROVE struck 3
- [S] spooky.turtle.b1 0dcb4ead+63569070 APPROVE struck 1; b2 0604b51b APPROVE struck 2
- [S] spooky.war.b1 3ad84c80 APPROVE struck 1; b2 62623681 APPROVE struck 2; b4 d5cbbe24+59c1b039+b1d3d11a APPROVE struck 4
- [S] simulation.catapult_castle.b1 a0e3e596 APPROVE struck 1; b2 66b970e2 APPROVE struck 2
- Evidence a8a7a44c re-aimed Catapult Castle army; AUDIT617 b re-opened and independently CONFIRMed.
- CONFIRM617: Plunder, Turtle and Catapult Castle passed b and became D.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] spooky.plunder (2b5c4799)
VERDICT: APPROVE
CRITERION: spooky.plunder.b FAIL (previous: FAIL)
GAP: [S] spooky.plunder (611811bb, 5639eb60)
VERDICT: APPROVE
CRITERION: spooky.plunder.b PASS (previous: FAIL)
GAP: [S] spooky.turtle (0dcb4ead, 63569070)
VERDICT: APPROVE
CRITERION: spooky.turtle.b FAIL (previous: FAIL)
GAP: [S] spooky.turtle (0604b51b)
VERDICT: APPROVE
CRITERION: spooky.turtle.b PASS (previous: FAIL)
GAP: [S] spooky.war (3ad84c80)
VERDICT: APPROVE
CRITERION: spooky.war.b FAIL (previous: FAIL)
GAP: [S] spooky.war (62623681)
VERDICT: APPROVE
CRITERION: spooky.war.b FAIL (previous: FAIL)
GAP: [S] spooky.war (d5cbbe24, 59c1b039, b1d3d11a)
VERDICT: APPROVE
CRITERION: spooky.war.b FAIL (previous: FAIL)
GAP: [S] simulation.catapult_castle (a0e3e596)
VERDICT: APPROVE
CRITERION: simulation.catapult_castle.b FAIL (previous: FAIL)
GAP: [S] simulation.catapult_castle (66b970e2)
VERDICT: APPROVE
CRITERION: simulation.catapult_castle.b PASS (previous: FAIL)
REGRESSIONS: none. All 27 iter-617 PNGs inspected. No reviewed diff changes the five untouched Simulation formations or shared map geometry. All 18 army/battle script criteria PASS in judge.json; summary has no page or console errors and only three --add annotations. The Catapult Castle camera re-aim makes its gateway group and crown battery visible together.

## Notes for next iteration (max5lines)
- 617: 27 screenshots,18/18 world-script criteria PASS; no page/console errors or evidence trouble (only --add annotations).
- Three independent confirmations bring done to71/99; no batch checkpoint triggered because War and five Simulation stages remain open.
- Spooky War has only b3 left: spread the two Catapults at the front stair approach; locked text is unchanged in its item file.
- Simulation AUDIT x2 complete; five open stages retain their closed blocker lists and ranked structural gaps.
- War rear stair and Catapult Castle gate height are stage-only; Turtle's opposite-bank validation does not change sandbox zones.
