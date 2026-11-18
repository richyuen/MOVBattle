# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (590: struck 6): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview)
b FAIL (592: struck b1 clause "outer loop path"): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (592 judge)

## Ranked gaps
1. [S] b terraces — blocker 1: stone-faced lawn terraces with stairs between the fog channels (as dynasty.ts lawnTerraces), night stone — ref: wiki/spooky_2.png — ours: map_spooky_2_top.png
2. [S] a thickets — blocker 3 (attempt 2): massed thorn-hedge domes 8-10 m wide blocking the left and right paths, legible from the top — ref: wiki/spooky_2.png — ours: map_spooky_2_top.png
3. [S] a last round tree — blocker 5: remaining round leafy base trees replaced by black twisted trees — ref: card Overview — ours: map_spooky_2_ground.png
4. [S] b field outline — blocker 4: the cobble loop's three Chaikin passes make a near-ellipse (critic 592): one pass (rectangular loop, rounded corners) plus the square notched rim — ref: reference/maps/spooky_2.png — ours: map_spooky_2_top.png
5. [P] a rock tone (fallout of 19067a56, to 593): rockSkirt diffuse (.3,.34,.48) -> duller grey-blue — ours: map_spooky_2_island.png

## Attempts (iter | gap | criterion | verdict)
592 | [S] cobble loop: 5.5 m rounded ribbon, cobble texture 4bbcf13d | b1 | APPROVE, struck clause "outer loop path"
590 | [S] boulder rock skirt 19067a56 (+bb704a1c) | a6 | APPROVE, struck a6
587 | [S] thorn thickets cb026095 (+858d6a2e, 95f26b5d); dark torii 76101bad | a3, a7 | APPROVE, a3 no strike (attempt 1), struck a7
578-586 | [S] layout, sky, turf, grated court, shrine x2 (a4 attempts 2), stone bridges, black ring trees | a, b | struck a1, a2, b2, b3

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror. Bridges x +-30; thickets x +-44 (collider 3.5 x 7); torii (-40,33); cobbleLoop ribbon replaces the 578 path boxes.
- a4 has 2 attempts: only its starvation pick or an [R] remains. Critic 592: loop crosses the fog bands' ends with no bridge.
