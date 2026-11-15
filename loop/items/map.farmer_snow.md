# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (559: struck 6): 3. string lights on the houses in map_farmer_snow_island.png — TABS: warm yellow string lights between the two back houses and on the mill, plus a lit Christmas tree (ref: reference/maps/wiki/farmer_snow.png) 4. snow-capped watermill house in map_farmer_snow_island.png — TABS: the timber watermill house on the left with snowy roofs (ref: reference/maps/farm_snow.png) 5. evergreen grove in map_farmer_snow_top.png — TABS: a group of snowy evergreen pines at the upper right where Farmer 1's hay field is (ref: loop/cards/maps/farmer_snow.md Overview)
b FAIL (561: struck 5): 3. field outline in map_farmer_snow_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab ringed by dense trees (ref: reference/maps/wiki/farmer_snow.png)
c PASS (561 judge)
## Ranked gaps
1. [S] b — blocker 3: round island outline (ellipse 54 x 48; farmer_1's remap kit, own copy, bowl and ice follow) with the side tree ring thinned so the snow runs to the rim
2. [S] a — blocker 3: warm bulb strings between the back houses (SNOW_HOUSES) and on the mill, a lit cone Christmas tree between the houses, out of fog
3. [S] a — blocker 4: mill walls dark timber boards with framing, lifted clear of the front hedge line and out of the fog band (it renders washed-out white in the island shot)
4. [P] a — blocker 5: pineGrove needle emissive 0.35 -> 0.1 (fallout of 2ec1ca47; check the glow/haze too) — map_farmer_snow_top.png
## Attempts (iter | gap | criterion | verdict)
555-558 | river, snow cover, bridge, night sky, pine grove | a, b | 5 APPROVE, struck a1, a2, b1, b2, b4
559 | [S] deep navy earth bowl, snow-capped stones, spikes + placement slabs hidden (398e8db4, 29cc3e5a) | a6 | APPROVE struck a6, b6
561 | [S] two snow-roofed timber houses (back rim) + two-halved mill with wheel over the ice (cb41584c) | b5 | APPROVE struck 5
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Builder tabs/farmer_snow.ts: own river course, bridge, snowBuildings (houses (-26,36),(-11,39); mill z -41); nightSky restores lights in dispose.
- Critic 559: bowl middle nearly black, stones only on the flanks. Critic 557/558: snow and ring glow milky white with a haze; grove reads pale grey.
