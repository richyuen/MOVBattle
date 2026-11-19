# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 611   Batch: stages_dynasty   Consecutive empty: 0   Done: 49/99   Parked: 0
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
stages_dynasty: samurai +-+ o | art_of_war +-+ o | area_of_effect +++ D | catapults +-+ o | zeus_and_other_folks +-+ o | viking_army +++ D
stages_renaissance: a_new_art_wave ??? q | balloons ??? q | renaissance_fencer ??? q | renaissance_vs_farmer_1 ??? q | renaissance_vs_ancient_2 ??? q | renaissance_vs_dynasty_3 ??? q
stages_pirate: x_marks_the_spot ??? q | a_rival_captain ??? q | a_small_tribe ??? q | you_won_t_make_us_walk_the_plank ??? q | arrows_and_arrow ??? q | boom_and_the_units_go_down ??? q
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter611 batch stages_dynasty; 6 [S]; evidence 611.0 dynasty field pose 70 m)
- [S] area_of_effect.b1 9abb8611 APPROVE struck 1-5; viking_army.b1 034b8c68 APPROVE struck 1-4; CONFIRM 611 passed b on both -> D
- [S] zeus_and_other_folks.b1 f8dcc5b9 APPROVE struck 1-3; samurai.b1 ac07417e+71cdb10a APPROVE struck 1-3; catapults.b1 6faa88dd APPROVE no strike
- [S] art_of_war.b1 611.6 (+6b, 6c) dropped (reverted 5c379617, 6fad0f3b, cd4bc664)
- 5/6, 12 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] dynasty.samurai (ac07417e, follow-up 71cdb10a)
VERDICT: APPROVE
CRITERION: dynasty.samurai.b FAIL   (previous: FAIL)
REGRESSIONS: none (judge.json PASSes a and c for all six stages, including dynasty.art_of_war on the touched map.dynasty)

## Notes for next iteration (max5lines)
- 611: area_of_effect, viking_army D (iter-611/critic.md, confirm.md). Open: samurai b4 (path/torii), zeus_and_other_folks b4 (building behind), catapults b1-3, art_of_war b1-4.
- Dynasty team-1 zone is x>=29; the canal spur near (31.5,7.9) is a hazard. art_of_war re-lay must stay in the zone: run game.checkStage on coords before committing.
- Catapults facing needs a per-unit yaw on the stage enemy tuple (structural).
- Stage scenery goes in web/src/campaign/stagePresentation.ts keyed by stage id. In execSync on Windows write sha~1, not sha^.
- v11 (user, 2026-11-19): solo mode to D or Dry:6 park. CONFIRM notes on done items live in their item files, not blockers.
