# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2), 563 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (564: struck 6): 1. A closed ring of pale fog-washed broadleaf trees round the whole rim in map_farmer_snow_top.png — TABS: open snow edge with only a few tall snow-capped trees at the corners (ref: reference/maps/wiki/farmer_snow.png) 2. Watermill shown as two brown gabled barns with string lights in map_farmer_snow_island.png — TABS: tall dark-blue timber mill towers with a water wheel and a balcony on one bank (ref: reference/maps/wiki/farmer_snow.png) 3. Large snow-capped boulder in the front field missing in map_farmer_snow_top.png — TABS: a big faceted rock with snow cap on the field's front-right (ref: reference/maps/wiki/farmer_snow.png) 4. Snow-covered crop furrows by the bridge missing in map_farmer_snow_top.png — TABS: rows of snowy furrow ridges beside the bridge on the field side (ref: reference/maps/wiki/farmer_snow.png) 5. Snowy wooden carts and wagons missing in map_farmer_snow_ground.png — TABS: two snow-laden carts and log piles on the near field (ref: reference/maps/wiki/farmer_snow.png)
b FAIL (564: struck 1): 2. Watermill straddling the river at the island's front edge in map_farmer_snow_top.png — TABS: the mill stands on one bank at the river's end, its wheel in the water (ref: reference/maps/wiki/farmer_snow.png)
c PASS (564 judge)
## Ranked gaps
1. [S] b — blocker 2: mill moved onto one bank at the river's front end, its wheel in the ice (snowBuildings)
2. [S] a — blocker 1: ring trees hidden all round the rim but three or four tall snowy trees at the corners (the round snow edge left open)
3. [S] a — blocker 2: mill as tall dark-blue timber towers with a water wheel and a balcony
## Attempts (iter | gap | criterion | verdict)
555-559 | river, snow cover, bridge, night sky, grove, navy bowl, stones | a, b | 6 APPROVE, struck a1, a2, a6, b1, b2, b4, b6
561-562 | [S] houses + mill, round outline, bulb strings, dark mill (cb41584c, e9d95cfa, d7b02859, 23817396+452f35d3) | a, b | 4 APPROVE struck b5, b3, a3, a4
563 | [S] snow hills at their radius (e6641d5a); dense pine grove (5ac61480) | b6, a5 | 2 APPROVE struck b6, a5
564 | [S] base slab + totem (Introduction Grounds_box/_cyl/_totem_top) removed (79991c9b) | a6 | APPROVE struck 6
564 | [S] pine grove moved to the houses' bank, x -47..-27, z 8..40 (140782a1) | b1 | APPROVE struck 1
## Rejected (last 4)
## Notes (max 3 lines)
- No stages. Builder: ice course, bridge, houses (-26,36),(-11,39), mill z -41, lights, pineGrove x -47..-27 z 8..40.
- Critic 564: a big black sphere sits on the left field (top 390-440,630-680; island 360-420,385-425), source unknown: find it by name and hide.
- Critic 563: pale ghost block at the left edge of map_farmer_snow_ground (base tower/ruin).
