# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 618   Batch: stages_simulation   Consecutive empty: 0   Done: 74/99   Parked: 0
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
stages_simulation: bridge_battle +++ D | hill +++ D | wall +-+ o | siege +-+ o | catapult_castle +++ D | pit +-+ o
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter618 stages_spooky+stages_simulation; 9 [S]; BASE a655cd95)
- [S] spooky.war.b3 6f7fc7cf APPROVE struck 3
- [S] simulation.bridge_battle.b1 b8026b2a APPROVE struck 1; b2 2a9b7b0f APPROVE struck 2; b3 43b24f31 APPROVE struck 3
- [S] simulation.hill.b1 88752814 APPROVE struck 1; b2 b5282674 APPROVE struck 2; b3 e9a5f4e6+8f911699 APPROVE struck 3
- [S] simulation.wall.b2 0bea9c00+87255cd9 APPROVE struck 2; b3 defa4af0 APPROVE struck 3; wall-top blocker 1 remains.
- Evidence 1547b2af re-aimed Wall army; follow-ups re-aimed Hill/Wall field. Both b criteria re-opened and AUDITed x2.
- CONFIRM618 passed War, Bridge Battle and Hill; all three D. Spooky checkpoint 12/12 GREEN; Batch advances to Simulation alone.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] spooky.war (6f7fc7cf)
VERDICT: APPROVE
CRITERION: spooky.war.b PASS (previous: FAIL)
GAP: [S] simulation.bridge_battle (b8026b2a)
VERDICT: APPROVE
CRITERION: simulation.bridge_battle.b FAIL (previous: FAIL)
GAP: [S] simulation.bridge_battle (2a9b7b0f)
VERDICT: APPROVE
CRITERION: simulation.bridge_battle.b FAIL (previous: FAIL)
GAP: [S] simulation.bridge_battle (43b24f31)
VERDICT: APPROVE
CRITERION: simulation.bridge_battle.b PASS (previous: FAIL)
GAP: [S] simulation.hill (88752814)
VERDICT: APPROVE
CRITERION: simulation.hill.b FAIL (previous: FAIL)
GAP: [S] simulation.hill (b5282674)
VERDICT: APPROVE
CRITERION: simulation.hill.b FAIL (previous: FAIL)
GAP: [S] simulation.hill (e9a5f4e6,8f911699)
VERDICT: APPROVE
CRITERION: simulation.hill.b PASS (previous: FAIL)
GAP: [S] simulation.wall (0bea9c00,87255cd9)
VERDICT: APPROVE
CRITERION: simulation.wall.b FAIL (previous: FAIL)
GAP: [S] simulation.wall (defa4af0)
VERDICT: APPROVE
CRITERION: simulation.wall.b FAIL (previous: FAIL)
REGRESSIONS: none. All 12 supplied iteration PNGs and all eight reference PNGs inspected. All nine gaps are structural formation relocations within their assigned units; follow-ups change only the relevant evidence pose. No reviewed diff changes shared map geometry, counts, budgets or allowed player armies. All eight army/battle script criteria PASS in judge.json. World evidence has no page or console errors and only the Wall --add annotation.

## Notes for next iteration (max5lines)
- 618: 12 screenshots,8/8 world-script criteria PASS; no page/console errors or evidence trouble (one --add annotation).
- War, Bridge Battle and Hill independently CONFIRMed D; 74/99 done. Spooky checkpoint 12/12 GREEN, saved in regression-summary.json; world summary restored.
- Simulation Wall retains only b1: five Berserkers on each wall crown, stage-scoped height and valid departures. Ground phalanx and reserve are struck.
- Simulation Siege and Pit retain their locked lists unchanged; next ranked gaps are Wall's crowns, then Siege's wall/gate/royal parties.
- Capture preview child readiness failed on4182/4190; a separately started local preview on4191 served all successful captures and checkpoint.
