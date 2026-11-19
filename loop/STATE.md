# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 602   Batch: maps_3+maps_4+stages_adventure   Consecutive empty: 0   Done: 34/99   Parked: 0
Solo: map.dynasty   Queue: map.spooky_2, map.fantasy_evil, map.fantasy_good   Rounds: 0   Dry: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item template: # <id>; Status: open|done|parked Audited: N(AUDIT x2),N(CONFIRM: passed a; failed b) Done: N
## Verdicts: a FAIL (0 since N; list from AUDIT|CONFIRM N): 1. <blocker verbatim> s2. <element> in <shot> (struck N) / a PASS(N: struck n; CONFIRM N); b likewise; c PASS(N judge) / c FAIL(N judge): <reasons>
## Ranked gaps: 1. [S|P|R] <id>.<letter> <gap> — blocker n: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict); ## Rejected (last4); ## Notes(max3lines).
Marks per a b c: + pass,- fail,? unscored. Status q queued,o open,D done,p parked. Map a look,b layout,c play; stage a army,b formation,c battle. -->

## Scoreboard
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty -++ o | renaissance +++ D | pirate +++ D | spooky_1 +++ D | spooky_2 +-+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good --+ o | fantasy_evil --+ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ D | low_ground +++ D
stages_introduction: clubs +++ D | army +++ D | hay_and_pitchforks +++ D | basic_formation +++ D | ice_archers_only_almost +++ D | longships +++ D
stages_adventure: tree_tribe +-+ o | the_tiniest_attack +++ D | sneaky_tribe +-+ o | tree_mammoths +-+ o | final_destination_wheelbarrow +++ D | a_fierce_rider +++ D
stages_challenge: ice_archer_and_friends ??? q | knights_and_priests ??? q | a_warm_welcome ??? q | zeus ??? q | twin_lords ??? q | big_brawl ??? q
stages_dynasty: samurai ??? q | art_of_war ??? q | area_of_effect ??? q | catapults ??? q | zeus_and_other_folks ??? q | viking_army ??? q
stages_renaissance: a_new_art_wave ??? q | balloons ??? q | renaissance_fencer ??? q | renaissance_vs_farmer_1 ??? q | renaissance_vs_ancient_2 ??? q | renaissance_vs_dynasty_3 ??? q
stages_pirate: x_marks_the_spot ??? q | a_rival_captain ??? q | a_small_tribe ??? q | you_won_t_make_us_walk_the_plank ??? q | arrows_and_arrow ??? q | boom_and_the_units_go_down ??? q
stages_spooky: bone ??? q | war ??? q | cave ??? q | turtle ??? q | breakout ??? q | plunder ??? q
stages_simulation: bridge_battle ??? q | hill ??? q | wall ??? q | siege ??? q | catapult_castle ??? q | pit ??? q
stages_wild_west: leading_cacti ??? q | bullets_and_chains ??? q | lone_ranger_and_his_friends ??? q | laughing_knights ??? q | shogun_s_samurai ??? q | spooky_army ??? q
stages_legacy: siege ??? q | a_tank ??? q | the_war ??? q | thor_s_battle ??? q
stages_fantasy_good: colossal_spike ??? q | royal_archers ??? q | clash_of_warriors ??? q | chaotic_cavalry ??? q | vicious_terror ??? q | fortified_formation ??? q
stages_fantasy_evil: encircling_tribe ??? q | raze_the_homestead ??? q | farmer_uprising_evil ??? q | storm_the_fortress ??? q | blasted_skirmish ??? q | dismantle_the_spears ??? q

## Focus (iter602 solo map.pirate, 2 rounds: 1 [R] +2 [S]; BASE e2870814 + v11 rules 7d1dbd41)
Evidence a499d822 (deck shot on the turned team-0 ship), 8a51d844 (ground/battle cam up the strip centre line, also stage battle shots).
- r1 [R] map.pirate.b blocker1 (92afd9c8) APPROVE, struck1; critic added b2 (base palms left on the turned strip)
- r1 [S] map.pirate.a blocker1 (264c9d94, 36a587e7) APPROVE, struck1; a PASS; CONFIRM a PASS
- r2 [S] map.pirate.b blocker2 (c3b103ee) APPROVE, struck2; b PASS; CONFIRM b PASS -> D
- 3/3, 3 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.pirate (92afd9c8)
VERDICT: APPROVE
CRITERION: map.pirate.b FAIL   (previous: FAIL)
GAP: [S] map.pirate (264c9d94, follow-up 36a587e7)
VERDICT: APPROVE
CRITERION: map.pirate.a PASS   (previous: FAIL)
GAP: [S] map.pirate (c3b103ee)
VERDICT: APPROVE
CRITERION: map.pirate.b PASS   (previous: FAIL)
REGRESSIONS: none. judge.json: map.pirate.c and all three stages' a and c PASS (x_marks_the_spot, a_rival_captain, spooky.plunder; armies moved onto the +x deck). CONFIRM (locked list) passed a in r1, b in r2.

## Notes for next iteration (max5lines)
- 602 solo pirate D in 2 rounds (reviews iter-602/critic.md, critic-r2.md, confirm.md, confirm-r2.md); thumbnail refreshed. Next solo: map.dynasty (a FAIL a1 turf, a2 cobble loop, list from CONFIRM 588: no glance; b PASS not kept: glance allowed).
- Dynasty has a waiting [P] fallout (shrub cheeks in stage armies) and stages dynasty.samurai, art_of_war, renaissance_vs_dynasty_3, wild_west.shogun_s_samurai to capture with it.
- v11 (user, 2026-11-19): solo mode, maps one at a time to D or Dry:6 park; adventure stages wait for the empty Queue. Locked list: fantasy a/b lists from CONFIRM (no glance); spooky_2 a not kept (glance only), b from AUDIT.
- Pirate CONFIRM notes (not blockers): mirror-symmetric ships, cylinder sails, straight strip, rubble rows on the strip.
