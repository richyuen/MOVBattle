# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 619   Batch: stages_simulation+stages_wild_west   Consecutive empty: 0   Done: 76/99   Parked: 0
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
stages_simulation: bridge_battle +++ D | hill +++ D | wall +++ D | siege +++ D | catapult_castle +++ D | pit +-+ o
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +-+ o | lone_ranger_and_his_friends +-+ o | laughing_knights +-+ o | shogun_s_samurai +-+ o | spooky_army +-+ o
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter619 stages_simulation+stages_wild_west; 9 [S]; BASE c4ff484b)
- [S] simulation.wall.b1 3153a700 APPROVE struck 1; CONFIRM619 passed b; D.
- [S] simulation.siege.b1 cd82a8b2 APPROVE struck 1; b2 314b86b2 APPROVE struck 2; b3 fbeb343d APPROVE struck 3; CONFIRM619 passed b; D.
- [S] simulation.pit.b1 5ee94eae APPROVE struck 1; b2 08ce63c5 APPROVE struck 2; b3 910dcfba APPROVE struck 3.
- [S] wild_west.leading_cacti.b1 2bbbde3d APPROVE struck 1; b2 33e6a0ad APPROVE struck 2.
- Wild West tail AUDIT x2: six b FAIL lists recorded; all a/c PASS. No evidence camera changes or reverts.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] simulation.wall (3153a700)
VERDICT: APPROVE
CRITERION: simulation.wall.b PASS (previous: FAIL)
GAP: [S] simulation.siege (cd82a8b2)
VERDICT: APPROVE
CRITERION: simulation.siege.b FAIL (previous: FAIL)
GAP: [S] simulation.siege (314b86b2)
VERDICT: APPROVE
CRITERION: simulation.siege.b FAIL (previous: FAIL)
GAP: [S] simulation.siege (fbeb343d)
VERDICT: APPROVE
CRITERION: simulation.siege.b PASS (previous: FAIL)
GAP: [S] simulation.pit (5ee94eae)
VERDICT: APPROVE
CRITERION: simulation.pit.b FAIL (previous: FAIL)
GAP: [S] simulation.pit (08ce63c5)
VERDICT: APPROVE
CRITERION: simulation.pit.b FAIL (previous: FAIL)
GAP: [S] simulation.pit (910dcfba)
VERDICT: APPROVE
CRITERION: simulation.pit.b FAIL (previous: FAIL)
GAP: [S] wild_west.leading_cacti (2bbbde3d)
VERDICT: APPROVE
CRITERION: wild_west.leading_cacti.b FAIL (previous: FAIL)
GAP: [S] wild_west.leading_cacti (33e6a0ad)
VERDICT: APPROVE
CRITERION: wild_west.leading_cacti.b FAIL (previous: FAIL)
REGRESSIONS: none. All 27 iteration PNGs, eight touched-item reference PNGs, and Laughing Knights' two reference PNGs inspected. Reviewed diffs are scoped formation relocations and their seating/validation mechanisms; no map builder, army count, budget or player roster changed. All 18 supplied army/battle script criteria PASS in judge.json. summary.json has no page or console errors; its sole note is the --add re-shot annotation. Wall and Siege's locked formation lists are clear, subject to independent CONFIRM. Pit retains blocker 4 and Leading Cacti retains blocker 3. No new blocker introduced by a reviewed hunk is visible.

## Notes for next iteration (max5lines)
- 619: 27 screenshots,18/18 world-script criteria PASS; no page/console errors or evidence trouble; only --add annotation. TypeScript and production build passed.
- Wall and Siege independently CONFIRMed D, no glance blockers; 76/99 done. Pit remains open, so no batch checkpoint yet.
- Next: Pit b4, put one Hwacha at each end of the rear Archer row; Leading Cacti b3, move intact lanes from perimeter props to open shopfront ground.
- Wild West's other five locked AUDIT lists remain open. Laughing Knights includes AUDIT2's bridge-placement blocker; all six stages' army/battle scripts PASS.
- Actor-only crown/terrace seats preserve clear flat departure points and solid obstacles. Captures on4192 succeeded without preview readiness trouble.
