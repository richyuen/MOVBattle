# Loop state (v10: maps then stages; two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 600   Batch: maps_3+maps_4+stages_adventure   Consecutive empty: 0   Done: 30/99   Parked: 0
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
stages_adventure: tree_tribe +-+ o | the_tiniest_attack +-+ o | sneaky_tribe +-+ o | tree_mammoths +-+ o | final_destination_wheelbarrow +-+ o | a_fierce_rider +-+ o
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

## Focus (iter 600: 1 [R] + 7 [S] + 1 [P]; BASE b16719a0)
Evidence: 685f65a9 Evil full winged island silhouette/platform view; ce687e96 Pirate army camera follows raised deck. Adventure AUDIT x2: six b FAIL, all a/c PASS.
- [R] map.pirate.a blockers 1-3 (f99eb4fd) APPROVE, struck a2,a3; a plateau lifted, b plateau waits
- [S] map.fantasy_good.a blocker 1 (4834759a) APPROVE, no strike (stub pillars clause cleared)
- [S] map.fantasy_good.a blocker 2 (79aae0c6) APPROVE, struck a2
- [S] map.fantasy_evil.b blocker 1 (bb5ee8bb) APPROVE, no strike (one-platform clause cleared)
- [S] map.fantasy_evil.a blocker 2 (d0fccfc5) APPROVE, struck a2
- [S] map.fantasy_evil.a blocker 1 (ff505e0b,b79bc009) APPROVE, struck a1
- [S] adventure.a_fierce_rider.b blocker 1 (d4289c91) APPROVE, struck b1
- [S] adventure.the_tiniest_attack.b blocker 2 (ffe2e899,defaf4dd) APPROVE, struck b2
- [P] map.fantasy_good.a fallout (a44979d1) APPROVE, no strike
- 9/9, 7 struck

## Last verdicts (critic header lines verbatim)
GAP: [R] map.pirate.a blockers 1-3 (f99eb4fd)
VERDICT: APPROVE
CRITERION: map.pirate.a FAIL (previous: FAIL)
GAP: [S] map.fantasy_good.a blocker 1 (4834759a)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL (previous: FAIL)
GAP: [S] map.fantasy_good.a blocker 2 (79aae0c6)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL (previous: FAIL)
GAP: [S] map.fantasy_evil.b blocker 1 (bb5ee8bb)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.b FAIL (previous: FAIL)
GAP: [S] map.fantasy_evil.a blocker 2 (d0fccfc5)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL (previous: FAIL)
GAP: [S] map.fantasy_evil.a blocker 1 (ff505e0b, b79bc009)
VERDICT: APPROVE
CRITERION: map.fantasy_evil.a FAIL (previous: FAIL)
GAP: [S] adventure.a_fierce_rider.b blocker 1 (d4289c91)
VERDICT: APPROVE
CRITERION: adventure.a_fierce_rider.b FAIL (previous: FAIL)
GAP: [S] adventure.the_tiniest_attack.b blocker 2 (ffe2e899, defaf4dd)
VERDICT: APPROVE
CRITERION: adventure.the_tiniest_attack.b FAIL (previous: FAIL)
GAP: [P] map.fantasy_good.a fallout (a44979d1)
VERDICT: APPROVE
CRITERION: map.fantasy_good.a FAIL (previous: FAIL)
REGRESSIONS: none attributed to the reviewed gaps after inspecting all 40 final PNGs. Evidence ce687e96 resolves the Pirate deck-camera clipping; all three dependent stages retain their script army/placement/battle passes. Existing rooftop/tree/cave/rider mismatches in queued formations are not introduced regressions.

## Notes for next iteration (max 5 lines)
- 600: 40 PNGs, 21/21 script criteria PASS, zero page/console errors; tsc/build/budget and all3 changed-map thumbnails PASS. Reports iter-600/audit.md, audit2.md, critic.md, confirm.md.
- No new D (30/99), no batch checkpoint. Early Good CONFIRM a/b FAIL is unused because Good remains a FAIL after gap review; no failure count increment or new b list applied.
- Pirate a R cleared wreck/palms and lifted a plateau; a1 stern remains. Pirate b plateau since599 takes601 R, preserving deck armies/zones and gangplanks.
- Good a1 exposed lower arcade remains (attempt1); a2 gates cleared, b retains PASS pending CONFIRM. Evil a3 mushrooms unattempted; b1 cliff network attempt1, regular grid and winged silhouette cleared.
- Spooky2 a4 starves601; b4 next603. Dynasty a1/a2 2+ attempts, next a starvation604; cheek P expired600. Adventure6 audited: next cheapest summit Farmer/rider standing surfaces; canopy/cave/roof formations remain.
