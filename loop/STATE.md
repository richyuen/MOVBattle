# Loop state (v11: maps then stages; solo mode for stuck items; locked-list CONFIRM before done)
Iteration: 605   Batch: maps_4+stages_adventure   Consecutive empty: 0   Done: 37/99   Parked: 0
Solo: map.fantasy_good   Queue: (empty)   Rounds: 0   Dry: 0
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
maps_4: fantasy_good --+ o | fantasy_evil +++ D | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ D | low_ground +++ D
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

## Focus (iter605 solo map.fantasy_evil, 2 rounds: 4 [R]; BASE 475b8176)
- r1 [R] b1 (fc3db046) REJECT, rejected-kept (edge chambers, centre solid); [R] a1,a2 (18965679) APPROVE, struck a2; CONFIRM a PASS, b FAIL
- r2 [R] b1 (89f441c4) APPROVE, struck1 (sunken central pit); [R] a1 (01db5cf0) APPROVE, struck1 (slab shrines on plinths); CONFIRM a,b PASS -> D
- 3/4, 3 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.fantasy_evil.b blocker 1 (89f441c4)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b PASS   (previous: FAIL)
GAP: [R] map.fantasy_evil.a blocker 1 (01db5cf0)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a PASS   (previous: FAIL)
REGRESSIONS: none. Criterion c stays PASS (605 judge).

## Notes for next iteration (max5lines)
- 605 solo fantasy_evil D in 2 rounds (iter-605/critic.md, confirm.md, critic-r2.md, confirm-r2.md); thumbnail refreshed. 602 pirate, 603 dynasty, 604 spooky_2 D.
- Next solo: map.fantasy_good (last in Queue), a and b plateau: [R] for each in round 1 (spec from its CONFIRM lists); well-count wording vs five PITS: reconcile in the R spec. Lists from CONFIRM: no glance.
- When fantasy_good is D or p: drop Solo, run the maps_4 checkpoint (step 8), batch mode resumes at stages_adventure (3 open).
- v11 (user, 2026-11-19): solo mode to D or Dry:6 park. CONFIRM notes on done maps live in their item files, not blockers.
