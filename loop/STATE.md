# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 621   Batch: stages_wild_west+stages_legacy   Consecutive empty: 0   Done: 80/99   Parked: 0
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
stages_wild_west: leading_cacti +-+ o | bullets_and_chains +++ D | lone_ranger_and_his_friends +-+ o | laughing_knights +-+ o | shogun_s_samurai +++ D | spooky_army +++ D
stages_legacy: siege +-+ o | a_tank +-+ o | the_war +-+ o | thor_s_battle +-+ o
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter621 stages_wild_west, tail overlap audit of stages_legacy; 8 [S]; BASE 295790e3)
- [S] wild_west.leading_cacti.b3 5d526992 APPROVE, no strike (facades beside, not behind, in _army); CONFIRM621 passed b; open.
- [S] wild_west.laughing_knights.b5 c264f57d APPROVE struck 2,3,5; CONFIRM621 passed b; 4 open (Healers hidden behind Executioners).
- [S] wild_west.lone_ranger_and_his_friends.b2 5ccadfa6 APPROVE struck 2; b3 5239e243 APPROVE struck 3,4; b1 b9af7403 APPROVE struck 1; CONFIRM621 failed b (5: Quick Draw hidden by a map saguaro).
- [S] wild_west.spooky_army.b1 923f743a APPROVE struck 1,5; b2 59f6339e APPROVE struck 2; b3 e180a29d APPROVE struck 3,4; CONFIRM621 passed b; D.
- stages_legacy audited (AUDIT x2): a,c PASS all four; b FAIL all four (siege 5, a_tank 4, the_war 2, thor_s_battle 3 blockers); no [D] fixes.
- 8/8, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] wild_west.leading_cacti (5d526992)
VERDICT: APPROVE
CRITERION: wild_west.leading_cacti.b FAIL   (previous: FAIL)
GAP: [S] wild_west.laughing_knights (c264f57d)
VERDICT: APPROVE
CRITERION: wild_west.laughing_knights.b FAIL   (previous: FAIL)
GAP: [S] wild_west.lone_ranger_and_his_friends (5ccadfa6)
VERDICT: APPROVE
CRITERION: wild_west.lone_ranger_and_his_friends.b FAIL   (previous: FAIL)
GAP: [S] wild_west.lone_ranger_and_his_friends (5239e243)
VERDICT: APPROVE
CRITERION: wild_west.lone_ranger_and_his_friends.b FAIL   (previous: FAIL)
GAP: [S] wild_west.lone_ranger_and_his_friends (b9af7403)
VERDICT: APPROVE
CRITERION: wild_west.lone_ranger_and_his_friends.b FAIL   (previous: FAIL)
GAP: [S] wild_west.spooky_army (923f743a)
VERDICT: APPROVE
CRITERION: wild_west.spooky_army.b PASS   (previous: FAIL)
GAP: [S] wild_west.spooky_army (59f6339e)
VERDICT: APPROVE
CRITERION: wild_west.spooky_army.b PASS   (previous: FAIL)
GAP: [S] wild_west.spooky_army (e180a29d)
VERDICT: APPROVE
CRITERION: wild_west.spooky_army.b PASS   (previous: FAIL)
REGRESSIONS: none

## Notes for next iteration (max5lines)
- 621: 12 legacy shots + 12 wild_west re-shots, 0 page errors, 16/16 script criteria PASS; legacy audit summary/judge kept as iter-621/legacy-summary.json, legacy-judge.json. Spooky Army CONFIRMed D (80/99).
- Picks next: legacy ranked gaps (item files) plus Lone Ranger b5 (shift formation clear of the saguaro over (35.5,-18)) and Laughing Knights b4 (Healers clear of the Executioners). Leading Cacti b3 has 2 attempts: not pickable in batch mode.
- legacy.siege shares simulation.siege's map and Survey: reuse its placements, checkStage zone and crown seats.
- Stage-only checkStage zones now also cover leading_cacti (24.75,-17.9 11x11) and laughing_knights (2,1 14x6, the land bridge).
- Validate formations with --check-only on the working tree before committing (never while another capture is mid-run: it rebuilds dist).
