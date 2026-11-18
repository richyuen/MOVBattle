# map.wild_west
Status: open   Audited: 576 (AUDIT x2), 582 (CONFIRM: failed a, b), 584 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (plateau; 0 since 584): 1. the near row of five town buildings in map_wild_west_island (lower half of the frame) and map_wild_west_top (bottom of the frame) reads as sand-coloured, see-through boxes with dark smears, with no wall colour or solid roof — TABS: the near buildings are solid dark-wood blocks under slate-blue roofs, as crisp as the far row (ref: reference/maps/western.png, reference/maps/wiki/wild_west.png) 2. the sky and backdrop in map_wild_west_island and map_wild_west_ground are a drab grey-tan — TABS: a warm peach-orange sunset sky that lightens to cream-yellow around the sun (ref: reference/maps/western.png, reference/stages/wild_west.bullets_and_chains.png)
b PASS (584: struck 2; CONFIRM 584)
c PASS (584 judge)

## Ranked gaps
1. [R] a near-side block and sky — blockers 1, 2: rebuild the sand floor's lighting so the near block stands solid again (it veils the buildings since 584), give the block boarded back walls and slate roofs, and the sunset sky an own fog-free backdrop sphere, peach to cream round the sun — ref: reference/maps/western.png, reference/stages/wild_west.bullets_and_chains.png — ours: map_wild_west_island.png

## Attempts (iter | gap | criterion | verdict)
584 | [S] inner rank to x -22..-0.6 40f76430 | b2 | APPROVE, struck b2; CONFIRM b PASS
584 | [S] sand street 397ce937, 5deb40d9, 86d685ef | a2 | APPROVE, struck a2; CONFIRM a FAIL (second) -> plateau
583 | [S] timber storefronts 17a180c4, b25c16e2; inner rank 35137805 | a1, b1 | 2 APPROVE, struck a1, b1; added b2
582 | [S] crooked rock masses 61cfb0a4 | a3 | APPROVE, struck a3; first CONFIRM failed a,b
576-581 | [S] town rows, barricade, desert rim, sunset sky, chapel, base, mesa ridge, arches, street rows, round plaza | a, b | 11 APPROVE

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: wild_west.leading_cacti, bullets_and_chains, lone_ranger_and_his_friends (enemies x 28.6..35.5, z -25..-11). Zones x +-(27..61), z -27..-9 and 9..27.
- a is plateau (CONFIRM failed it at 582 and 584; lists in output/loop/iter-582/confirm.md, iter-584/confirm.md). The see-through near block is NEW in 584: solid purple in iter-583's island shot, tan and translucent after the sand commits (397ce937, 5deb40d9, 86d685ef). The [R] starts at the floor's self-light (.5,.3,.2) and its glow exclusion, not at a town rebuild.
- Critic 584 leftovers below a blocker: sand a shade pale, ripples read as straight strokes in the top shot.
