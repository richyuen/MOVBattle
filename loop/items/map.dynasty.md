# map.dynasty
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (579: struck 2): 3. island slab sides in map_dynasty_island — TABS: blue-grey faceted rock columns with green tufts, not a dark stalactite underside (ref: reference/maps/dynasty.png) 4. ground palette in map_dynasty_ground — TABS: saturated green lawn blocks edged by grey flagstone paths, not olive-brown dirt (ref: reference/stages/wild_west.shogun_s_samurai.png) 6. arched stone bridges in map_dynasty_ground — TABS: grey arched bridges with parapets crossing the canals (ref: reference/stages/dynasty.art_of_war.png)
b FAIL (579: struck 6): 2. central courtyard in map_dynasty_top — TABS: a square courtyard with a square bottomless pit, ringed by water and reached by bridges and stairs on all four sides (ref: card Overview; reference/maps/wiki/dynasty.png) 3. canal network in map_dynasty_top — TABS: canals cut the field into raised lawn terraces joined by stairs, not two straight grey bands (ref: reference/maps/wiki/dynasty.png) 4. outer flagstone loop path in map_dynasty_top — TABS: a stone path runs around the outer lawn ring (ref: reference/maps/wiki/dynasty.png) 5. stair flights between terraces in map_dynasty_battle — TABS: wide stone stairs climb between lawn levels (ref: reference/stages/wild_west.shogun_s_samurai.png)
c PASS (579 judge)

## Ranked gaps
1. [S] map.dynasty.a lawn terraces — blocker 4: saturated green lawn blocks edged by grey flagstone paths — ref: reference/stages/wild_west.shogun_s_samurai.png — ours: output/loop/iter-579/map_dynasty_ground.png
2. [S] map.dynasty.b canal network — blocker 3: water branches around raised lawn blocks connected by broad stairs — ref: reference/maps/wiki/dynasty.png — ours: output/loop/iter-579/map_dynasty_top.png
3. [S] map.dynasty.b courtyard stairs — blocker 2: finish the north/south water ring with stone bridges and stair approaches on all four sides — ref: reference/maps/wiki/dynasty.png — ours: output/loop/iter-579/map_dynasty_top.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] 83a6bd2f | a | APPROVE, struck a1
577 | [S] b1711009 | a | APPROVE, struck a5
577 | [S] 83c9ca4a | b | APPROVE, struck b1
578 | [S] 61f64ff8, d3dab59a | b | APPROVE, no strike (court and pit cleared; N/S water and stairs missing)
579 | [S] canals (d888588d, b326fec0) | a | APPROVE, struck a2
579 | [S] rim torii (6fce1036) | b | APPROVE, struck b6

## Rejected (last 4)


## Notes (max 3 lines)
- Stages: dynasty.samurai, dynasty.art_of_war, renaissance.renaissance_vs_dynasty_3, wild_west.shogun_s_samurai (x 30..34.9, |z| <= 6.6).
- Canals z +-12, 10 m deep; court |x|,|z| <= 7. b2 still needs court stairs. Rim torii (-43,28), (40,-33).
