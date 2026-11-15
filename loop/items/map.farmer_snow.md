# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 555): 1. snow ground in map_farmer_snow_top.png — TABS: the whole field covered in white-blue snow; ours is green grass (ref: reference/maps/wiki/farmer_snow.png) 2. night sky in map_farmer_snow_island.png — TABS: a deep navy starry night sky with falling snow; ours has a pale grey-blue day sky with clouds and a mountain range (ref: reference/maps/farm_snow.png) 3. string lights on the houses in map_farmer_snow_island.png — TABS: warm yellow string lights between the two back houses and on the mill, plus a lit Christmas tree (ref: reference/maps/wiki/farmer_snow.png) 4. snow-capped watermill house in map_farmer_snow_island.png — TABS: the timber watermill house on the left with snowy roofs (ref: reference/maps/farm_snow.png) 5. evergreen grove in map_farmer_snow_top.png — TABS: a group of snowy evergreen pines at the upper right where Farmer 1's hay field is (ref: loop/cards/maps/farmer_snow.md Overview) 6. island slab in map_farmer_snow_island.png — TABS: a dark navy earth underside with snow-capped stone inlays; ours has black spikes under a translucent box (ref: reference/maps/farm_snow.png)
b FAIL (555: struck 1): 2. stone bridge in map_farmer_snow_top.png — TABS: an arched snowy bridge over the frozen river at the centre (ref: reference/maps/wiki/farmer_snow.png) 3. field outline in map_farmer_snow_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab ringed by dense trees (ref: reference/maps/wiki/farmer_snow.png) 4. no evergreen grove in the upper-right corner in map_farmer_snow_top — TABS: cluster of snowy pines where Farmer 1's hay field was (ref: loop/cards/maps/farmer_snow.md Overview) 5. no buildings on the back rim and front-left in map_farmer_snow_top — TABS: houses at the back and the mill at front-left bound the field (ref: reference/maps/wiki/farmer_snow.png) 6. translucent rectangular slab extending past the island edge in map_farmer_snow_top — TABS: nothing outside the island (ref: reference/maps/farm_snow.png)
c PASS (555 judge)
## Ranked gaps
1. [S] a — blocker 1: snow ground (snow sheet over the field) — ours: map_farmer_snow_top.png
2. [S] b — blocker 2: snowy stone bridge over the ice at the centre
3. [S] a — blocker 2: navy starry night sky — ours: map_farmer_snow_island.png
## Attempts (iter | gap | criterion | verdict)
555 | [S] frozen walkable river + icefall, no hazard (d9f9862b) | b1 | APPROVE struck 1
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Builder tabs/farmer_snow.ts keeps its own copy of farmer_1's river course.
