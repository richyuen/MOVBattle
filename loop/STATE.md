# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 622   Batch: stages_wild_west+stages_legacy   Consecutive empty: 0   Done: 82/99   Parked: 0
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
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +++ D | lone_ranger_and_his_friends +-+ o | laughing_knights +++ D | shogun_s_samurai +++ D | spooky_army +++ D
stages_legacy: siege +-+ o | a_tank +-+ o | the_war +++ D | thor_s_battle +-+ o
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter622 stages_wild_west+stages_legacy; 9 [S] + 1 evidence; BASE b70ba4db)
- evidence b70ba4db: laughing_knights _army beta .7 down the bridge column; critic struck 4; CONFIRM622 passed b; D.
- [S] lone_ranger.b5 33be5f30+60af33c0 APPROVE, no strike (QD visible, no church behind); CONFIRM622 failed b again: plateau.
- [S] the_war.b2 9f80578c APPROVE struck 2; b1 dc76524d APPROVE struck 1; CONFIRM622 passed b; D.
- [S] thor.b1 99579d89 APPROVE struck 1; b3 dd0754c0 APPROVE struck 3; b2 6d13b695 APPROVE struck 2; CONFIRM622 reopened 2.
- [S] siege.b1 a83f7ac8 APPROVE struck 1; b4 1ba824d1 APPROVE struck 4,5; b2 1ba77b68 APPROVE struck 2,3; CONFIRM622 reopened 4.
- 9/9, 11 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] wild_west.lone_ranger_and_his_friends (33be5f30, follow-up 60af33c0)
VERDICT: APPROVE
CRITERION: wild_west.lone_ranger_and_his_friends.b FAIL   (previous: FAIL)
GAP: evidence wild_west.laughing_knights (b70ba4db)
VERDICT: APPROVE
CRITERION: wild_west.laughing_knights.b PASS   (previous: FAIL)
GAP: [S] legacy.the_war (9f80578c) / (dc76524d)
VERDICT: APPROVE / APPROVE
CRITERION: legacy.the_war.b FAIL / PASS   (previous: FAIL)
GAP: [S] legacy.thor_s_battle (99579d89) / (dd0754c0) / (6d13b695)
VERDICT: APPROVE / APPROVE / APPROVE
CRITERION: legacy.thor_s_battle.b FAIL / FAIL / PASS   (previous: FAIL)
GAP: [S] legacy.siege (a83f7ac8) / (1ba824d1) / (1ba77b68)
VERDICT: APPROVE / APPROVE / APPROVE
CRITERION: legacy.siege.b FAIL / FAIL / PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 622: 15 shots, 0 page errors, 10/10 script criteria PASS. Laughing Knights and The War CONFIRMed D (82/99).
- Evidence first next: legacy.siege _army high oblique so the terrace Kings show (CONFIRM: no formation change); lone_ranger _army re-aim so the church is behind the Quick Draw (its _battle shot already shows it).
- Picks next: thor b2 (Peasants up level with Thor, gap to the pikes), a_tank b1-b3 (unattempted), lone_ranger [R] if the re-aim fails. Leading Cacti b3 has 2 attempts: not pickable in batch mode.
- legacy.siege shares simulation.siege's branch in stagePresentation.ts and main.ts checkStage; lone_ranger has its own stage zone (32,2) 10x15.
- Validate formations with --check-only on the working tree before committing (never while another capture is mid-run: it rebuilds dist).
