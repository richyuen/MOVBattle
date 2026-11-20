# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 615   Batch: stages_pirate   Consecutive empty: 0   Done: 64/99   Parked: 0
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
stages_pirate: x_marks_the_spot +++ D | a_rival_captain +++ D | a_small_tribe +++ D | you_won_t_make_us_walk_the_plank +++ D | arrows_and_arrow +-+ o | boom_and_the_units_go_down +++ D
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter615 stages_renaissance+stages_pirate; 9 [S]; BASE 084a4206)
- [S] renaissance.renaissance_fencer.b2 5ff25056+b7d24ea3 APPROVE struck 2
- [S] pirate.boom_and_the_units_go_down.b4 8375f571 APPROVE struck 4
- [S] pirate.a_small_tribe.b2 a1363de3 APPROVE struck 2
- [S] pirate.you_won_t_make_us_walk_the_plank.b3 cd65ec9e APPROVE struck 3
- [S] pirate.x_marks_the_spot.b1 6d676fc0+97df2916 APPROVE struck 1,4; b2 c0e3830c+70807a69 APPROVE struck 2,3
- [S] renaissance.renaissance_vs_ancient_2.b6 b7a1342a APPROVE struck 6
- [S] pirate.a_rival_captain.b1 f8b8b9b7 APPROVE struck 1; b4 b7a228e2 APPROVE struck 2,3,4,5
- Evidence 084a4206+8c8d80a0: X above rail/below sail, rival army at ground height; both open Pirate-map army b views re-opened and passed.
- CONFIRM 615: all seven b lists passed, including earlier strikes; all seven D.
- 9/9, 14 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] renaissance.renaissance_fencer (5ff25056, b7d24ea3)
VERDICT: APPROVE
CRITERION: renaissance.renaissance_fencer.b PASS (previous: FAIL)
GAP: [S] pirate.boom_and_the_units_go_down (8375f571)
VERDICT: APPROVE
CRITERION: pirate.boom_and_the_units_go_down.b PASS (previous: FAIL)
GAP: [S] pirate.a_small_tribe (a1363de3)
VERDICT: APPROVE
CRITERION: pirate.a_small_tribe.b PASS (previous: FAIL)
GAP: [S] pirate.you_won_t_make_us_walk_the_plank (cd65ec9e)
VERDICT: APPROVE
CRITERION: pirate.you_won_t_make_us_walk_the_plank.b PASS (previous: FAIL)
GAP: [S] pirate.x_marks_the_spot (6d676fc0, 97df2916)
VERDICT: APPROVE
CRITERION: pirate.x_marks_the_spot.b FAIL (previous: FAIL)
GAP: [S] pirate.x_marks_the_spot (c0e3830c, 70807a69)
VERDICT: APPROVE
CRITERION: pirate.x_marks_the_spot.b PASS (previous: FAIL)
GAP: [S] renaissance.renaissance_vs_ancient_2 (b7a1342a)
VERDICT: APPROVE
CRITERION: renaissance.renaissance_vs_ancient_2.b PASS (previous: FAIL)
GAP: [S] pirate.a_rival_captain (f8b8b9b7)
VERDICT: APPROVE
CRITERION: pirate.a_rival_captain.b FAIL (previous: FAIL)
GAP: [S] pirate.a_rival_captain (b7a228e2)
VERDICT: APPROVE
CRITERION: pirate.a_rival_captain.b PASS (previous: FAIL)
REGRESSIONS: none. Inspected every iter-615 PNG. The confirmed Renaissance map a/b remain PASS; its facade ring, paving, open square and canal retain their roles. The three regression-stage army groups remain readable and their field/battle shots show no change attributable to the placement-zone or hazard correction.

## Notes for next iteration (max5lines)
- 615: 35 screenshots, 21/21 world-script criteria, no page errors or capture trouble; Renaissance batch checkpoint GREEN 12/12. World evidence in world-summary.json/summary.json; smoke results in regression-summary.json.
- Renaissance batch closed. Only pirate.arrows_and_arrow.b2/b3 remains open in stages_pirate (off-cliff placement and right-flank file).
- arrows_and_arrow: team-1 zone starts at x27 on viking_sandbox; the prior forward-move gap needs a valid inner-ice zone mechanism before re-laying the army. Its item file retains the original blockers.
- stages_spooky is unaudited; apply the tail-overlap rule when picking the next batch iteration.
