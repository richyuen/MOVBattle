# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (590: struck 6): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview)
b FAIL (586: struck 2): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (590 judge)

## Ranked gaps
1. [S] a thickets — blocker 3 (attempt 2): massed thorn-hedge domes 8-10 m wide blocking the left and right paths, legible from the top — ref: wiki/spooky_2.png — ours: map_spooky_2_top.png
2. [S] a last round tree — blocker 5: remaining round leafy base trees replaced by black twisted trees — ref: card Overview — ours: map_spooky_2_ground.png
3. [S] b field outline — blocker 4: look at map_spooky_2_top first (squareIsland power 8 since 578, no strike): what still reads oval — ref: reference/maps/spooky_2.png — ours: map_spooky_2_top.png
4. [P] a rock tone (fallout of 19067a56, to 593): rockSkirt diffuse (.3,.34,.48) -> duller grey-blue; masses under the front corners with gaps — ours: map_spooky_2_island.png
5. [S] b outer loop path — blocker 1 — ref: wiki/spooky_2.png — ours: map_spooky_2_top.png

## Attempts (iter | gap | criterion | verdict)
590 | [S] boulder rock skirt, base underside hidden 19067a56 (+bb704a1c out of glow) | a6 | APPROVE, struck a6
587 | [S] thorn thickets cb026095 (+858d6a2e, 95f26b5d) | a3 | APPROVE, no strike (attempt 1)
587 | [S] dark torii 76101bad (+7189ff78, 9ad673bd) | a7 | APPROVE, struck a7
586 | [S] stone bridges 6afd6a09; black ring trees 974a3c2d | b2, a5 | APPROVE, struck b2; a5 no strike (attempt 1)
578-585 | [S] layout, sky, turf, grated court, shrine x2 (a4 attempts 2: not pickable) | a, b | APPROVE, struck a1, a2, b3

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror. Stone bridges x +-30; thickets at x +-44 (collider 3.5 x 7); torii (-40,33). Rock skirt: 4 courses of icospheres, out of glow (in the glow pass it bloomed white).
- Base "hill" mounds (red discs, 4): hiding by name worked on spooky_1. The torii's mound (-40,30) still shows. a4 has 2 attempts: only its starvation pick or an [R] remains.
