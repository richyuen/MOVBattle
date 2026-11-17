# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2), 563 (CONFIRM: passed none; failed a, b), 569 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 569; plateau): 1. Dark spheres scattered across the snow in map_farmer_snow_top.png — TABS: faceted, snow-capped field rocks (ref: reference/maps/wiki/farmer_snow.png). 2. A freestanding stone tower on the far bank in map_farmer_snow_top.png — TABS: an open snowy verge beyond the decorated cottages (ref: reference/maps/wiki/farmer_snow.png). 3. Flat chalk-white light across the island in map_farmer_snow_island.png — TABS: a blue-lit night field with deep blue shadow across the mill bank (ref: reference/maps/farm_snow.png).
b PASS (569: CONFIRM)
c PASS (569 judge)

## Ranked gaps
1. [R] a — rebuild inherited field dressing and night lighting from both CONFIRM lists (563 and 569) — ref: reference/maps/wiki/farmer_snow.png and reference/maps/farm_snow.png — ours: map_farmer_snow_top.png and map_farmer_snow_island.png

## Attempts (iter | gap | criterion | verdict)
555-559 | river, snow cover, bridge, night sky, grove, navy bowl, stones | a, b | 6 APPROVE, struck a1, a2, a6, b1, b2, b4, b6
561-562 | [S] houses + mill, round outline, bulb strings, dark mill (cb41584c, e9d95cfa, d7b02859, 23817396+452f35d3) | a, b | 4 APPROVE struck b5, b3, a3, a4
563 | [S] snow hills at their radius (e6641d5a); dense pine grove (5ac61480) | b6, a5 | 2 APPROVE struck b6, a5
564 | [S] base slab + totem removed (79991c9b); pine grove to the houses' bank (140782a1) | a6, b1 | 2 APPROVE struck a6, b1
565 | [S] mill off the river onto the +x bank, halves in a row along the ice, wheel in the ice (ca008f0d) | b2 | APPROVE struck 2 (b PASS)
566 | [S] open snow rim with a few corner pines (ae2ad902) | a1 | APPROVE struck a1
567 | [S] blue watermill towers and balconies (d32c689e+cd4783d7) | a2 | APPROVE struck a2
568 | [S] front snow-capped boulder (0c5f8a08) | a3 | APPROVE, struck a3
568 | [S] snowy bridge-side furrows (a7c6dc9f) | a4 | APPROVE, struck a4
569 | [S] snowy carts and log piles (6ddcdd19) | a5 | APPROVE, struck a5

## Rejected (last 4)

## Notes (max 3 lines)
- Sandbox map. Both CONFIRM lists remain in output/loop/iter-563/confirm.md and output/loop/iter-569/confirm.md.
