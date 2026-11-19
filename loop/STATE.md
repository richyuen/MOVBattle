# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 614   Batch: stages_renaissance+stages_pirate   Consecutive empty: 0   Done: 57/99   Parked: 0
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
stages_renaissance: a_new_art_wave +++ D | balloons +++ D | renaissance_fencer +-+ o | renaissance_vs_farmer_1 +++ D | renaissance_vs_ancient_2 +-+ o | renaissance_vs_dynasty_3 +++ D
stages_pirate: x_marks_the_spot +-+ o | a_rival_captain +-+ o | a_small_tribe +-+ o | you_won_t_make_us_walk_the_plank +-+ o | arrows_and_arrow +-+ o | boom_and_the_units_go_down +-+ o
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter614 batch stages_renaissance+stages_pirate; 9 [S]; BASE b44da324)
- [S] pirate: walk_plank.b1 09e189d5 APPROVE struck 1,2; walk_plank.b3 4dbbd64c+ff4b17f9 APPROVE struck 4; small_tribe.b1 a5ea15f0 APPROVE struck 1; small_tribe.b3 40345484 APPROVE struck 3,4; boom.b4 090d6a67 APPROVE; boom.b2 546a125c APPROVE struck 2
- [S] renaissance: fencer.b2 f135fc9e APPROVE; a_new_art_wave.b5 ccebe571 APPROVE struck 5; balloons.b4 85977a0e APPROVE struck 4
- CONFIRM 614 (early): passed b on a_new_art_wave (balloons b confirmed 613) -> both D; failed walk_plank b (3: the arch hides the +z archer line); passed small_tribe and boom b but the critic kept a blocker on each
- 9/9, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] pirate.you_won_t_make_us_walk_the_plank (09e189d5)
VERDICT: APPROVE
CRITERION: pirate.you_won_t_make_us_walk_the_plank.b FAIL   (previous: FAIL)
GAP: [S] pirate.you_won_t_make_us_walk_the_plank (4dbbd64c, follow-up ff4b17f9)
VERDICT: APPROVE
CRITERION: pirate.you_won_t_make_us_walk_the_plank.b FAIL   (previous: FAIL)
GAP: [S] pirate.a_small_tribe (a5ea15f0)
VERDICT: APPROVE
CRITERION: pirate.a_small_tribe.b FAIL   (previous: FAIL)
GAP: [S] pirate.a_small_tribe (40345484)
VERDICT: APPROVE
CRITERION: pirate.a_small_tribe.b FAIL   (previous: FAIL)
GAP: [S] pirate.boom_and_the_units_go_down (090d6a67)
VERDICT: APPROVE
CRITERION: pirate.boom_and_the_units_go_down.b FAIL   (previous: FAIL)
GAP: [S] pirate.boom_and_the_units_go_down (546a125c)
VERDICT: APPROVE
CRITERION: pirate.boom_and_the_units_go_down.b FAIL   (previous: FAIL)
GAP: [S] renaissance.renaissance_fencer (f135fc9e)
VERDICT: APPROVE
CRITERION: renaissance.renaissance_fencer.b FAIL   (previous: FAIL)
GAP: [S] renaissance.a_new_art_wave (ccebe571)
VERDICT: APPROVE
CRITERION: renaissance.a_new_art_wave.b PASS   (previous: FAIL)
GAP: [S] renaissance.balloons (85977a0e)
VERDICT: APPROVE
CRITERION: renaissance.balloons.b PASS   (previous: FAIL)
REGRESSIONS: none (judge.json: a and c PASS for all six touched stages; the struck blockers of the earlier items hold in their shots)

## Notes for next iteration (max5lines)
- 614: loop stopped by the user after this iteration. Next: renaissance zone over z -24..-5 (placementZones, ancient_1 pattern) clears fencer b2 and boom b4 together; re-check every renaissance stage after it.
- 614 open: walk_plank b3 (move the +z archer line out from behind plankArch), small_tribe b2 (irregular Chieftain scatter), vs_ancient_2 b6 (path scenery inside the zone), arrows_and_arrow b2/b3 (zone x>=27).
- stages_pirate audited in 613 (iter-613/audit.md, audit2.md); x_marks_the_spot may need an on-deck _army pose (evidence re-aim).
- Spans: "centred" means centred on the square; read the zone (renaissance x 19..43, z -5..29; viking_sandbox and ancient_2 x 27..61, |z| <= 20; tribal_1 x 0..54; medieval_1 x 5..75).
- Validate a re-lay with game.checkStage(campaign, id) on the dev server (5173) before committing, and again after the final coordinates.
