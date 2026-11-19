# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 599   Batch: maps_3+maps_4   Consecutive empty: 0   Done: 30/99   Parked: 0
Batches, in order: maps_1, maps_2, maps_3, maps_4, stages_introduction, stages_adventure, stages_challenge, stages_dynasty, stages_renaissance, stages_pirate, stages_spooky, stages_simulation, stages_wild_west, stages_legacy, stages_fantasy_good, stages_fantasy_evil
<!-- Item file template, loop/items/<id>.md (map: map.<id>; stage: <campaign>.<id>):
# <id>
Status: open|done|parked   Audited: <N> (AUDIT x2)[, <N> (CONFIRM: passed a; failed b)]   Done: <N>
## Verdicts
a FAIL (0 since <N>): 1. <blocker verbatim> 2. ... (or a PASS (<N>: struck n; CONFIRM <N>))
b ...
c PASS (<N> judge) / c FAIL (<N> judge): <reasons>
## Ranked gaps
1. [S] <id>.<letter> <gap> — blocker <n>: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
Marks: one per criterion a b c (+ pass, - fail, ? unscored); map a look, b layout, c play; stage a army, b formation, c battle. -->

## Scoreboard (a b c as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
maps_1: tribal_1 +++ D | tribal_2 +++ D | tribal_sandbox +++ D | farmer_1 +++ D | farmer_2 +++ D | farmer_snow +++ D
maps_2: medieval_1 +++ D | medieval_2 +++ D | ancient_1 +++ D | ancient_2 +++ D | ancient_sandbox +++ D | viking +++ D | viking_sandbox +++ D
maps_3: dynasty -++ o | renaissance +++ D | pirate --+ o | spooky_1 +++ D | spooky_2 --+ o | wild_west +++ D | legacy +++ D
maps_4: fantasy_good -++ o | fantasy_evil --+ o | simulation +++ D | bridge +++ D | hill +++ D | corridor +++ D | defend_the_castle +++ D | high_ground +++ D | low_ground +++ D
stages_introduction: clubs +++ D | army +++ D | hay_and_pitchforks +++ D | basic_formation +++ D | ice_archers_only_almost +++ D | longships +++ D
stages_adventure: tree_tribe ??? q | the_tiniest_attack ??? q | sneaky_tribe ??? q | tree_mammoths ??? q | final_destination_wheelbarrow ??? q | a_fierce_rider ??? q
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

## Focus (iter 599: 9 [S] + 1 [P]; BASE 97ae691c)
Evidence: b378e600,97ae691c High Ground departure; b312e665 Basic Formation above roofs; 6864e50d Fantasy Evil full spire; 71731f5f Fantasy Good full gates. High Ground b freshly CONFIRMed -> D.
- [S] map.pirate.a blocker 2 (9b680d9d) APPROVE, struck a2; second failed a/b CONFIRM -> plateau
- [S] introduction.basic_formation.b blocker 3 (a144846a, 4ab2e5aa) APPROVE, struck b3; CONFIRM PASS -> D
- [S] introduction.ice_archers_only_almost.b blocker 3 (af027c37) APPROVE, struck b3; CONFIRM PASS -> D
- [S] map.fantasy_evil.a blocker 6 (f749b1d8) APPROVE, struck a6,a5; first CONFIRM a,b FAIL
- [S] map.fantasy_good.a blocker 5 (ab0886e6, e8517b58) APPROVE, struck a5
- [S] map.fantasy_good.b blocker 2 (368eeb98) APPROVE, struck b2
- [S] map.fantasy_good.a blocker 2 (9a80277f) APPROVE, no strike (scale/spires clauses cleared)
- [S] map.dynasty.a blocker 5 (e5a967e4) APPROVE, struck a5
- [S] map.dynasty.a blocker 4 (70907ec1) APPROVE, struck a4
- [P] introduction.army.b blocker 1 (e4e6e8d1) APPROVE, struck b1; CONFIRM PASS -> D
- 10/10, 10 struck

## Last verdicts (critic header lines verbatim)
GAP: [S] map.pirate.a blocker 2 (9b680d9d)
VERDICT: APPROVE
CRITERION: map.pirate.a PASS (previous: FAIL)
GAP: [S] introduction.basic_formation.b blocker 3 (a144846a, 4ab2e5aa)
VERDICT: APPROVE
CRITERION: introduction.basic_formation.b PASS (previous: FAIL)
GAP: [S] introduction.ice_archers_only_almost.b blocker 3 (af027c37)
VERDICT: APPROVE
CRITERION: introduction.ice_archers_only_almost.b PASS (previous: FAIL)
GAP: [S] map.fantasy_evil.a blocker 6 (f749b1d8)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a PASS (previous: FAIL)
RE-AUDIT: map.fantasy_evil.b PASS (previous: PASS); BLOCKERS b: none.
GAP: [S] map.fantasy_good.a blocker 5 (ab0886e6, e8517b58)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL (previous: FAIL)
GAP: [S] map.fantasy_good.b blocker 2 (368eeb98)
VERDICT: APPROVE
CRITERION: map.fantasy_good.b PASS (previous: FAIL)
GAP: [S] map.fantasy_good.a blocker 2 (9a80277f)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL (previous: FAIL)
GAP: [S] map.dynasty.a blocker 5 (e5a967e4)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL (previous: FAIL)
GAP: [S] map.dynasty.a blocker 4 (70907ec1)
VERDICT: APPROVE
CRITERION: map.dynasty.a FAIL (previous: FAIL)
GAP: [P] introduction.army.b blocker 1 (e4e6e8d1)
VERDICT: APPROVE
CRITERION: introduction.army.b PASS (previous: FAIL)
REGRESSIONS: none attributed to the reviewed gap commits after inspecting all 95 final PNGs and every supplied dependent-stage reference. Ancient 1 and Viking retain their confirmed geometry; High Ground a/b are copied PASS from the supplied independent confirmations and not re-audited.

## Notes for next iteration (max 5 lines)
- 599: 95 world PNGs, 49/49 script criteria PASS, zero page/console errors; 12/12 Introduction checkpoint scenarios PASS. Reports: iter-599/critic.md, confirm.md, regression-summary.json; world summary restored separately.
- New D: high_ground, introduction.army, basic_formation, ice_archers_only_almost; 30/99 done. Introduction checkpoint closed its batch. High Ground thumbnail PASS. Next tail overlap is stages_adventure when pickable S falls below9.
- Pirate a/b plateau after second failed CONFIRM: one waiting [R] takes600's slot, specified from both592 and599 lists (deep ornate ships/wreck/palms; ship-to-field scale, preserving deck placement).
- Fantasy Evil first CONFIRM failed a,b (fractured ground, winged monument, green mushrooms; platform network). Fantasy Good b PASS awaits CONFIRM; a1 underside and a2 ornate facades remain.
- Dynasty a1/a2 have2+ attempts, next a starvation604; shrub-cheek P eligible to600. Fantasy Good ledge/falls P to600. Spooky2 a4 starves601; b4 next starvation603 (attempts595,596,598 R).
