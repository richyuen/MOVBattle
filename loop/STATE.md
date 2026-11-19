# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 612   Batch: stages_renaissance   Consecutive empty: 0   Done: 55/99   Parked: 0
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
stages_renaissance: a_new_art_wave +-+ o | balloons +-+ o | renaissance_fencer +-+ o | renaissance_vs_farmer_1 +++ D | renaissance_vs_ancient_2 +-+ o | renaissance_vs_dynasty_3 +++ D
stages_pirate: x_marks_the_spot ??? q | a_rival_captain ??? q | a_small_tribe ??? q | you_won_t_make_us_walk_the_plank ??? q | arrows_and_arrow ??? q | boom_and_the_units_go_down ??? q
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter612 batch stages_dynasty (+ stages_renaissance AUDIT x2, tail overlap); 9 [S]; BASE 7ff2c066)
- [S] dynasty: samurai.b4 d4881493 APPROVE struck 4; zeus_and_other_folks.b4 38cd6195 APPROVE struck 4; catapults.b1 01ec6438 APPROVE struck 1,2; catapults.b3 25d54b72 APPROVE struck 3; art_of_war.b1 d90f4a8b APPROVE struck 1-4
- [S] renaissance: fencer.b3 1bf29290 APPROVE struck 3 (+farmer_1 b2, ancient_2 b5); vs_ancient_2.b1 90b49f49 APPROVE struck 1-4; vs_dynasty_3.b1 0683b60e APPROVE struck 1-3; vs_farmer_1.b3 3393211e APPROVE struck 1,3
- CONFIRM 612 passed b on samurai, zeus_and_other_folks, catapults, art_of_war (confirm.md), vs_dynasty_3, vs_farmer_1 (confirm2.md) -> D
- 9/9, 24 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] renaissance.renaissance_vs_farmer_1 (3393211e)
VERDICT: APPROVE
CRITERION: renaissance.renaissance_vs_farmer_1.b PASS   (previous: FAIL)
REGRESSIONS: none (judge.json passes every a and c, including the untouched renaissance.a_new_art_wave and renaissance.balloons; their _army shots are unchanged in layout and show no balloon or formation damage)

## Notes for next iteration (max5lines)
- 612: stages_dynasty all D; checkpoint smoke GREEN 12/12 (iter-612/summary.smoke.json); dropped from Batch. stages_renaissance audited (iter-612/audit.md, audit2.md).
- Open renaissance: a_new_art_wave b1-5 (numeral-2 path), balloons b1-4 (three clusters + back line), fencer b1-2 (Fencers in the corner building, Musketeers spread), vs_ancient_2 b6 (to the white path).
- Stage scenery lives in stagePresentation.ts (samuraiPath, zeusHouse); it is drawn only. Enemy tuples take an optional yaw (degrees).
- Validate a re-lay with game.checkStage(campaign, id) on the dev server (5173) before committing; it suggests moves.
- v11 (user, 2026-11-19): solo mode to D or Dry:6 park. CONFIRM notes on done items live in their item files, not blockers.
