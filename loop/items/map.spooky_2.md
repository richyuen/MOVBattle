# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (587: struck 7): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview) 6. island sides in map_spooky_2_island — TABS: blue rock-column cliffs, not a stalactite slab (ref: reference/maps/spooky_2.png)
b FAIL (586: struck 2): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (587 judge)

## Ranked gaps
1. [S] a island sides — blocker 6: skirt of 5-sided blue rock columns replacing the stalactite slab (as dynasty columnCliffs, rotated) — ref: reference/maps/spooky_2.png — ours: map_spooky_2_island.png
2. [S] b field outline — blocker 4: square island with notched corners — ref: reference/maps/spooky_2.png — ours: map_spooky_2_top.png
3. [S] a last round tree — blocker 5: the base's lone round-crowned tree on the left side path replaced by a black twisted tree — ref: card Overview — ours: map_spooky_2_ground.png
4. [P] a thorn heaps — fallout of cb026095 (587): thornThickets vines 30 -> 60, root .95 -> 1.4, height 7-10 -> 4-6 m, colour (.1,.11,.19) -> (.16,.18,.3) — ours: map_spooky_2_top.png
5. [S] b outer loop path — blocker 1: cobble terrace loop path round the fog channels, Dynasty layout rotated — ref: wiki/spooky_2.png — ours: map_spooky_2_top.png

## Attempts (iter | gap | criterion | verdict)
587 | [S] thorn thickets cb026095 (+858d6a2e, 95f26b5d) | a3 | APPROVE, no strike (not legible from the top) (attempt 1)
587 | [S] dark torii 76101bad (+7189ff78, 9ad673bd) | a7 | APPROVE, struck a7
586 | [S] stone bridges 6afd6a09; black ring trees 974a3c2d | b2, a5 | 2 APPROVE, struck b2; a5 no strike (attempt 1)
585 | [S] shrine re-sited (14,38) 6ad3b2cd | a4 | APPROVE, no strike (attempts 2 on a4)
578-584 | [S] layout, sky, turf, grated court, shrine | a, b | APPROVE, struck a1, a2, b3

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror. Stone bridges x +-30; thickets at x +-44 (collider 3.5 x 7); torii (-40,33).
- Base "hill" mounds (red discs, 4) are parented: their position and bounds read 0 at build time; computeWorldMatrix(true) before the bounds test. The torii's mound (-40,30) still shows. a4 starvation 590.
