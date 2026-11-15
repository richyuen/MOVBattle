# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (559: struck 6): 3. string lights on the houses in map_farmer_snow_island.png — TABS: warm yellow string lights between the two back houses and on the mill, plus a lit Christmas tree (ref: reference/maps/wiki/farmer_snow.png) 4. snow-capped watermill house in map_farmer_snow_island.png — TABS: the timber watermill house on the left with snowy roofs (ref: reference/maps/farm_snow.png) 5. evergreen grove in map_farmer_snow_top.png — TABS: a group of snowy evergreen pines at the upper right where Farmer 1's hay field is (ref: loop/cards/maps/farmer_snow.md Overview)
b FAIL (559: struck 6): 3. field outline in map_farmer_snow_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab ringed by dense trees (ref: reference/maps/wiki/farmer_snow.png) 5. no buildings on the back rim and front-left in map_farmer_snow_top — TABS: houses at the back and the mill at front-left bound the field (ref: reference/maps/wiki/farmer_snow.png)
c PASS (559 judge)
## Ranked gaps
1. [S] b — blocker 5: snowy houses at the back rim and the mill at the front-left (own copies of farmer_1's)
2. [S] a — blocker 4: timber watermill house with snowy roofs on the left (with b5's mill)
3. [S] a — blocker 3: warm string lights between the back houses and on the mill, lit cone Christmas tree, out of fog (needs b5's houses first)
4. [P] a — blocker 5: pineGrove needle emissive 0.35 -> 0.1 (fallout of 2ec1ca47; check the glow/haze too) — map_farmer_snow_top.png
## Attempts (iter | gap | criterion | verdict)
555-558 | river, snow cover, bridge, night sky, pine grove | a, b | 5 APPROVE, struck a1, a2, b1, b2, b4
559 | [S] deep navy earth bowl, snow-capped stones, spikes + placement slabs hidden (398e8db4, 29cc3e5a) | a6 | APPROVE struck a6, b6
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Builder tabs/farmer_snow.ts keeps its own copy of farmer_1's river course and bridge; nightSky restores hemi/dir lights in dispose.
- Critic 559: bowl middle nearly black, stones only on the flanks (want mid-navy with bands, stones all round).
- Critic 557/558: snow and ring glow milky white with a haze; grove reads pale grey.
