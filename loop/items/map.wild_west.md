# map.wild_west
Status: open   Audited: 576 (AUDIT x2), 582 (CONFIRM: failed a, b)   Done: -
## Verdicts
a FAIL (0 since 582): 1. Storefront architecture in map_wild_west_island.png — TABS: substantial dark timber facades have distinct window grids, porch posts and varied false fronts; ours reads as a row of small pale boxes with broad white window bands (ref: reference/maps/wiki/wild_west.png). 2. Ground palette in map_wild_west_ground.png — TABS: the street is light peach sand under the warm sunset; ours is a dark, strongly rust-red surface dominating the frame (ref: reference/stages/wild_west.leading_cacti.png).
b FAIL (0 since 582): 1. Near-side town block in map_wild_west_top.png — TABS: a deep, offset cluster of buildings projects into the island and creates alleyways beside the main street; ours has only three shallow buildings at the outer rim, leaving a broad empty arena instead of the reference's built-up street layout (ref: reference/maps/western.png).
c PASS (582 judge)

## Ranked gaps
1. [S] a timber storefronts — blocker 1: substantial dark timber shop fronts with window grids and porch posts — ref: reference/maps/wiki/wild_west.png — ours: map_wild_west_island.png
2. [S] b deep town block — blocker 1: offset near-side buildings extending inward, with alleys — ref: reference/maps/western.png — ours: map_wild_west_top.png
3. [S] a sandy street — blocker 2: replace the dark rust field surface with a peach sand mechanism — ref: reference/stages/wild_west.leading_cacti.png — ours: map_wild_west_ground.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] crooked rock masses 61cfb0a4 | a3 | APPROVE, struck a3; first CONFIRM failed a,b
581 | [S] arches dc051619 | a3 | APPROVE, no strike
581 | [S] street rows c305d702 | b1 | APPROVE, struck b1
581 | [S] round plaza 1f0d6c88 | b4 | APPROVE, struck b4
580 | [S] chapel 07b08bd1; base cd907413 | a | APPROVE, struck a5, a6
580 | [S] mesa ridge 514d0cf8 | b | APPROVE, struck b2
576 | [S] town rows ea5d9883 | a | APPROVE, struck a1
577 | [S] centre barricade removed fc2afb16 | b | APPROVE, struck b3
577 | [S] desert rim 4b99d78f | a | APPROVE, struck a2
578 | [S] sunset sky f0db546c | a | APPROVE, struck a4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: wild_west.leading_cacti, bullets_and_chains, lone_ranger_and_his_friends (enemies x 28.6..35.5, z -25..-11). Zones x +-(27..61), z -27..-9 and 9..27.
- 582 CONFIRM replaced a and reopened b with the lists above; no done claim.
- Critic 578: shadows short/soft, sky tan, bright windows; 577: dense cactus ring and small round mesas.
