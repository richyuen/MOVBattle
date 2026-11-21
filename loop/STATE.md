# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 620   Batch: stages_wild_west   Consecutive empty: 0   Done: 79/99   Parked: 0
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
stages_spooky: bone +++ D | war +++ D | cave +++ D | turtle +++ D | breakout +++ D | plunder +++ D
stages_simulation: bridge_battle +++ D | hill +++ D | wall +++ D | siege +++ D | catapult_castle +++ D | pit +++ D
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +++ D | lone_ranger_and_his_friends +-+ o | laughing_knights +-+ o | shogun_s_samurai +++ D | spooky_army +-+ o
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter620 stages_simulation+stages_wild_west; 9 [S]; BASE e48b926b)
- [S] simulation.pit.b4 8674b5d5 APPROVE struck 4; CONFIRM620 passed b; D.
- [S] wild_west.bullets_and_chains.b3 ad0443c7 APPROVE struck 3; b1 8ee2b715+c24888e0 APPROVE struck 1; b2 1224a336 APPROVE struck 2; CONFIRM620 passed b; D.
- [S] wild_west.shogun_s_samurai.b1 ff99df57+54fc4f85 APPROVE struck 1; b2 d4030188+1b3afdb5 APPROVE struck 2; b3 0f419a14 APPROVE struck 3; CONFIRM620 passed b; D.
- [S] wild_west.laughing_knights.b1 86f90f10 APPROVE struck 1.
- [S] wild_west.leading_cacti.b3 9dac8173+155eb43f+29d441ac dropped (a Miner on a street prop after 2 follow-ups; reverted 8825d378,49f2cacf,52da4e2d).
- 8/9, 8 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] simulation.pit (8674b5d5)
VERDICT: APPROVE
CRITERION: simulation.pit.b PASS   (previous: FAIL)
GAP: [S] wild_west.bullets_and_chains (ad0443c7)
VERDICT: APPROVE
CRITERION: wild_west.bullets_and_chains.b PASS   (previous: FAIL)
GAP: [S] wild_west.bullets_and_chains (8ee2b715 + c24888e0)
VERDICT: APPROVE
CRITERION: wild_west.bullets_and_chains.b PASS   (previous: FAIL)
GAP: [S] wild_west.bullets_and_chains (1224a336)
VERDICT: APPROVE
CRITERION: wild_west.bullets_and_chains.b PASS   (previous: FAIL)
GAP: [S] wild_west.laughing_knights (86f90f10)
VERDICT: APPROVE
CRITERION: wild_west.laughing_knights.b FAIL   (previous: FAIL)
GAP: [S] wild_west.shogun_s_samurai (ff99df57 + 54fc4f85)
VERDICT: APPROVE
CRITERION: wild_west.shogun_s_samurai.b PASS   (previous: FAIL)
GAP: [S] wild_west.shogun_s_samurai (d4030188 + 1b3afdb5)
VERDICT: APPROVE
CRITERION: wild_west.shogun_s_samurai.b PASS   (previous: FAIL)
GAP: [S] wild_west.shogun_s_samurai (0f419a14)
VERDICT: APPROVE
CRITERION: wild_west.shogun_s_samurai.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 620: 15 shots + 6 re-shot, 0 page errors, 10/10 script criteria PASS after the Shogun guard follow-up; world summary kept as iter-620/world-summary.json.
- Pit, Bullets and Chains, Shogun's Samurai CONFIRMed D (79/99). stages_simulation checkpoint regression GREEN 12/12, no page errors; Batch now stages_wild_west.
- Open: Laughing Knights b2-b5 (column onto the land bridge first), Leading Cacti b3 (probe the street with --check-only before laying), Lone Ranger b1-b5, Spooky Army b1-b5.
- Stage-only validator zones in main.ts checkStage now also cover bullets_and_chains (38,0 6x18) and shogun_s_samurai (27,-13.5 10x29).
- Leading Cacti street props lie near z -25..-28, x 18..28; army camera ~21 m west of the centroid (keep centroid x >= 22).
