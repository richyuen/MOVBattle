# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2), 563 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (567: struck 2): 3. Large snow-capped boulder in the front field missing in map_farmer_snow_top.png — TABS: a big faceted rock with snow cap on the field's front-right (ref: reference/maps/wiki/farmer_snow.png) 4. Snow-covered crop furrows by the bridge missing in map_farmer_snow_top.png — TABS: rows of snowy furrow ridges beside the bridge on the field side (ref: reference/maps/wiki/farmer_snow.png) 5. Snowy wooden carts and wagons missing in map_farmer_snow_ground.png — TABS: two snow-laden carts and log piles on the near field (ref: reference/maps/wiki/farmer_snow.png)
b PASS (565: struck 2; critic only, CONFIRM it when the item would be done)
c PASS (567 judge)

## Ranked gaps
1. [S] a — blocker 3: angular dark boulder with an asymmetric snow cap — ref: reference/maps/wiki/farmer_snow.png — ours: map_farmer_snow_top.png
2. [S] a — blocker 4: parallel snow ridges by the bridge — ref: reference/maps/wiki/farmer_snow.png — ours: map_farmer_snow_top.png
3. [S] a — blocker 3: big faceted snow-capped boulder on the front-right field

## Attempts (iter | gap | criterion | verdict)
555-559 | river, snow cover, bridge, night sky, grove, navy bowl, stones | a, b | 6 APPROVE, struck a1, a2, a6, b1, b2, b4, b6
561-562 | [S] houses + mill, round outline, bulb strings, dark mill (cb41584c, e9d95cfa, d7b02859, 23817396+452f35d3) | a, b | 4 APPROVE struck b5, b3, a3, a4
563 | [S] snow hills at their radius (e6641d5a); dense pine grove (5ac61480) | b6, a5 | 2 APPROVE struck b6, a5
564 | [S] base slab + totem removed (79991c9b); pine grove to the houses' bank (140782a1) | a6, b1 | 2 APPROVE struck a6, b1
565 | [S] mill off the river onto the +x bank, halves in a row along the ice, wheel in the ice (ca008f0d) | b2 | APPROVE struck 2 (b PASS)
566 | [S] open snow rim with a few corner pines (ae2ad902) | a1 | APPROVE struck a1
567 | [S] blue watermill towers and balconies (d32c689e+cd4783d7) | a2 | APPROVE struck a2

## Rejected (last 4)

## Notes (max 3 lines)
- No stages. Builder: ice course, bridge, houses (-26,36),(-11,39), mill halves at x ~8 z -41 / -28.2 with the wheel at z -34.6, lights, pineGrove.
- Critic 564: a big black sphere sits on the left field (top 390-440,630-680), source unknown: find it by name (probe) and hide.
- Critic 563: pale ghost block at the left edge of map_farmer_snow_ground (base tower/ruin).
