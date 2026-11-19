# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 609   Batch: stages_challenge   Consecutive empty: 0   Done: 44/99   Parked: 0
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
stages_challenge: ice_archer_and_friends +++ D | knights_and_priests +++ D | a_warm_welcome +-+ o | zeus +-+ o | twin_lords +-+ o | big_brawl +++ D
stages_dynasty: samurai ??? q | art_of_war ??? q | area_of_effect ??? q | catapults ??? q | zeus_and_other_folks ??? q | viking_army ??? q
stages_renaissance: a_new_art_wave ??? q | balloons ??? q | renaissance_fencer ??? q | renaissance_vs_farmer_1 ??? q | renaissance_vs_ancient_2 ??? q | renaissance_vs_dynasty_3 ??? q
stages_pirate: x_marks_the_spot ??? q | a_rival_captain ??? q | a_small_tribe ??? q | you_won_t_make_us_walk_the_plank ??? q | arrows_and_arrow ??? q | boom_and_the_units_go_down ??? q
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter609 batch stages_adventure+stages_challenge (tail overlap, AUDIT x2 of challenge); 7 [S]; BASE 74d02f74)
- [S] tree_mammoths.b1 08421589 (+c3b30ff4) APPROVE struck 1; tree_tribe.b1 ff209a0c (+093c86aa) APPROVE struck 1; sneaky_tribe.b1 55676eea APPROVE struck 1
- [S] ice_archer_and_friends.b1 fceec30c APPROVE struck 1-4; zeus.b4 4e382b32 (+29e3a14d) APPROVE struck 2,4; big_brawl.b1 aaf6e1bf APPROVE struck 1-7; knights_and_priests.b1 3dc7a176 APPROVE struck 1-3
- CONFIRM 609 passed b on all six would-be-done items -> D
- 7/7, 21 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] challenge.zeus (4e382b32, follow-up 29e3a14d)
VERDICT: APPROVE
CRITERION: challenge.zeus.b FAIL   (previous: FAIL)
REGRESSIONS: none (all script a/c PASS in judge.json; the untouched batch items a_warm_welcome and twin_lords are unchanged in scope)

## Notes for next iteration (max5lines)
- 609: six stages D (iter-609/critic.md, confirm.md). stages_adventure checkpoint: regression-only GREEN 12/12 (iter-609/summary.smoke.json); dropped from Batch.
- stages_challenge open: zeus (b1,3,5: steeper slant ~45 deg, hinged hoplites, tighter shields), a_warm_welcome (cave: tribal_2's mouth is a one-man notch; may need a drawn cave like adventure.sneaky_tribe), twin_lords (move under the castle, re-lay).
- Stage scenery goes in web/src/campaign/stagePresentation.ts keyed by stage id (perchCrowns, tribeCave are the examples).
- In node execSync on Windows, cmd eats `^`: write `sha~1`, not `sha^` (609's diff files were empty at first).
- v11 (user, 2026-11-19): solo mode to D or Dry:6 park. CONFIRM notes on done items live in their item files, not blockers.
