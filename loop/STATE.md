# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 616   Batch: stages_spooky   Consecutive empty: 0   Done: 68/99   Parked: 0
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
stages_spooky: bone +++ D | war +-+ o | cave +++ D | turtle +-+ o | breakout +++ D | plunder +-+ o
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter616 stages_pirate+stages_spooky; 9 [S]; BASE 9071b022)
- [S] pirate.arrows_and_arrow.b2 995853ac APPROVE struck 2; b3 fefdffcd APPROVE struck 3
- [S] spooky.cave.b1 d4648d25 APPROVE struck 1; b2 ebca0cfd+bbcb3192 APPROVE struck 2
- [S] spooky.breakout.b1 daec95d3+dcdff888 APPROVE struck 1; b2 9b61be07 APPROVE struck 2
- [S] spooky.bone.b1 f6a98d2d APPROVE struck 1; b2 58221731+e4ec548f APPROVE struck 2
- [S] spooky.plunder.b1 24dca1bb APPROVE struck 1
- CONFIRM 616: Pirate arrows, Cave, Breakout and Bone passed b and became D.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] pirate.arrows_and_arrow (995853ac)
VERDICT: APPROVE
CRITERION: pirate.arrows_and_arrow.b FAIL (previous: FAIL)
GAP: [S] pirate.arrows_and_arrow (fefdffcd)
VERDICT: APPROVE
CRITERION: pirate.arrows_and_arrow.b PASS (previous: FAIL)
GAP: [S] spooky.cave (d4648d25)
VERDICT: APPROVE
CRITERION: spooky.cave.b FAIL (previous: FAIL)
GAP: [S] spooky.cave (ebca0cfd, bbcb3192)
VERDICT: APPROVE
CRITERION: spooky.cave.b PASS (previous: FAIL)
GAP: [S] spooky.breakout (daec95d3, dcdff888)
VERDICT: APPROVE
CRITERION: spooky.breakout.b FAIL (previous: FAIL)
GAP: [S] spooky.breakout (9b61be07)
VERDICT: APPROVE
CRITERION: spooky.breakout.b PASS (previous: FAIL)
GAP: [S] spooky.bone (f6a98d2d)
VERDICT: APPROVE
CRITERION: spooky.bone.b FAIL (previous: FAIL)
GAP: [S] spooky.bone (58221731, e4ec548f)
VERDICT: APPROVE
CRITERION: spooky.bone.b PASS (previous: FAIL)
GAP: [S] spooky.plunder (24dca1bb)
VERDICT: APPROVE
CRITERION: spooky.plunder.b FAIL (previous: FAIL)
REGRESSIONS: none. All 25 iter-616 PNGs inspected. The changed Viking Sandbox placement zones introduce no visible geometry/layout regression; map c and every captured stage a/c PASS in judge.json (15/15). Summary has no page or console errors and only the --add re-shot annotation. Untouched War and Turtle retain their audit evidence.

## Notes for next iteration (max5lines)
- 616: 25 screenshots, 15/15 world-script criteria, no page/console errors or evidence trouble. Pirate batch checkpoint GREEN 12/12.
- Pirate batch closed; 68/99 done after four independent confirmations.
- Spooky remaining: Plunder b2/b3, Turtle b1/b2, War b1/b2/b3/b4; unchanged blocker text is in each item file.
- Breakout's locked enemy ring uses a stage-only validation zone; sandbox map zones remain unchanged.
- World evidence in summary.json/world-summary.json; checkpoint results retained in regression-summary.json.
