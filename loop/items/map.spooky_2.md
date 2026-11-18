# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (596: struck 3): 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png)
b FAIL (598 [R]: struck 1; plateau lifted; b4 oval clause cleared, square-step not): 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (598 judge)

## Ranked gaps
1. [S] b4 square steps (b4 attempts 595, 596 [S] + 598 [R]: starvation pick or [R] only; next [R] would follow a new plateau): deck top and sides built from OUTLINE (extruded polygon, or vertices inserted at every cut's inner corner) so each notch and mouth is a right-angled step — ref: spooky_2.png — ours: map_spooky_2_top.png
2. a4 shrine (2 attempts: starvation pick or [R] only): large jack-o-lantern on a raised dead-tree mound at the pagoda's spot, gnarled tree arching over, pumpkins and candles round the base, reading at top-shot scale

## Attempts (iter | gap | criterion | verdict)
598 | [R] hard square rim, 12 m corner cuts, canal mouths, bare cuts, skirt on the outline, fog spill d4fd09be | b | APPROVE, struck b1; corners render as chamfers
596 | [S] corner notches + mitred loop 24225dd9; thickets 703a2a26 | b4, a3 | APPROVE; b4 no strike (attempt 2), struck a3
595 | [S] ring onto squared rim 1d0481dd | b4 | APPROVE, no strike (attempt 1)
578-594 | [S] layout, sky, turf, court, shrine x2 (a4 2), bridges, trees, thickets, torii, skirt, terraces, loop | a, b | struck a1, a2, a5-a7, b2, b3, b1 clauses

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror. CUTS: big (36,30) pad 2, corners |x|>42 |z|>36, mouths |x|>47.5 z 7..17; RIM 54 x 48 max-norm; OUTLINE polygon; outOfCuts pushes to nearest inner edge (bevels the corners).
- Loop steps to x +-39.25 / z +-33.25 at the corner cuts; ring trees within 3 m of a cut dropped with colliders.
- Critic 598: the octagon read comes from radial floor vertices never landing on a cut's inner corner.
