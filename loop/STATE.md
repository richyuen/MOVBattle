# Loop state (v10: maps then stages; dual audits; up to9 structural/rebuild gaps; fresh CONFIRM before done)
Iteration: 601   Batch: maps_3+maps_4+stages_adventure   Consecutive empty: 0   Done: 33/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item template: # <id>; Status: open|done|parked Audited: N(AUDIT x2),N(CONFIRM: passed a; failed b) Done: N
## Verdicts: a FAIL (0 since N): 1. <blocker verbatim> / a PASS(N: struck n; CONFIRM N); b likewise; c PASS(N judge) / c FAIL(N judge): <reasons>
## Ranked gaps: 1. [S|P|R] <id>.<letter> <gap> — blocker n: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict); ## Rejected (last4); ## Notes(max3lines).
Marks per a b c: + pass,- fail,? unscored. Status q queued,o open,D done,p parked. Map a look,b layout,c play; stage a army,b formation,c battle. -->

## Scoreboard
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty -++ o | renaissance +++ D | pirate --+ o | spooky_1 +++ D | spooky_2 +-+ o | wild_west +++ D | legacy +++ D
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

## Focus (iter601: 1 [R] +8 [S]; BASE91e9f830)
Evidence f6ef3f95: raised Wheelbarrow army targety9/r32. Rider two visibility followups; final seat follows head/crest world bounds.
- [R] map.pirate.b blocker1 (e0ec78a8) REJECT, reverted d62511b6; no strike
- [S] map.pirate.a blocker1 (632a9f8c) APPROVE, no strike
- [S] map.spooky_2.a blocker4 (bba97442) APPROVE, struck4; a PASS
- [S] map.fantasy_good.a blocker1 (9e419281) APPROVE, struck1; CONFIRM faileda,b
- [S] map.fantasy_evil.a blocker3 (e40ca4f6) APPROVE, struck3; CONFIRM faileda,b
- [S] map.fantasy_evil.b blocker1 (12ddab5e) APPROVE, struck1; CONFIRM faileda,b
- [S] adventure.the_tiniest_attack.b blocker1 (c283afb0) APPROVE, struck1; CONFIRM PASS -> D
- [S] adventure.a_fierce_rider.b blocker2 (a744ccde,c0d6c20a,799d316d) APPROVE, struck2; CONFIRM PASS -> D
- [S] adventure.final_destination_wheelbarrow.b blocker1 (5f92ad8a) APPROVE, struck1; CONFIRM PASS -> D
- 8/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.pirate.b (e0ec78a8)
VERDICT: REJECT
CRITERION: map.pirate.b FAIL (previous: FAIL)
GAP: [S] map.pirate.a (632a9f8c)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL (previous: FAIL)
GAP: [S] map.spooky_2.a (bba97442)
VERDICT: APPROVE
CRITERION: map.spooky_2.a PASS (previous: FAIL)
GAP: [S] map.fantasy_good.a (9e419281)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a PASS (previous: FAIL)
GAP: [S] map.fantasy_evil.a (e40ca4f6)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a PASS (previous: FAIL)
GAP: [S] map.fantasy_evil.b (12ddab5e)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b PASS (previous: FAIL)
GAP: [S] adventure.the_tiniest_attack.b (c283afb0)
VERDICT: APPROVE
CRITERION: adventure.the_tiniest_attack.b PASS (previous: FAIL)
GAP: [S] adventure.a_fierce_rider.b (a744ccde, c0d6c20a, 799d316d)
VERDICT: APPROVE
CRITERION: adventure.a_fierce_rider.b PASS (previous: FAIL)
GAP: [S] adventure.final_destination_wheelbarrow.b (5f92ad8a)
VERDICT: APPROVE
CRITERION: adventure.final_destination_wheelbarrow.b PASS (previous: FAIL)
REGRESSIONS: none. All 44 final PNGs were inspected. judge.json: map.pirate.c, map.spooky_2.c, map.fantasy_good.c, map.fantasy_evil.c PASS; a and c PASS for all nine captured stages (22/22 script criteria). summary.json has no console/page errors; its two --add notes only record recaptures. The absent full references for pirate.a_rival_captain and fantasy_good.vicious_terror were reviewed using their extant thumbs and cards.

## Notes for next iteration (max5lines)
- 601: 44PNGs,22/22scriptPASS,zero page/console errors; post-revert Pirate+3stages recaptured PASS; tsc/build/budget and four changed-map thumbnails PASS. Reviews iter-601/critic.md,confirm.md; reviewed pre-revert pack iter-601/reviewed/.
- Three Adventure stages confirmed D ->33/99; no batch checkpoint. Remaining Adventure: canopy tribe, cave tribe, canopy Mammoths (AUDIT600).
- Pirate b R rejected/revertedd62511b6, attempt1; oldest plateau since599 takes next R. Rebuild shore+ships together. a1 attempt2, next starvation606. Early Pirate CONFIRM unused.
- Good a/b second counted CONFIRM595/601 and Evil a/b599/601 ->plateau. New blocker lists in items; R specs need all respective CONFIRM lists. Good CONFIRM well-count wording sayssix, owning arrayfive: reconcile in spec.
- Spooky2 a PASS; b4 starves603. Dynasty a1/a2 remain2+attempts, next a starvation604. Next R priority: Pirate b before four new fantasy plateau criteria.
