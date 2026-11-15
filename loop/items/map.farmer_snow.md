# map.farmer_snow
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (557: struck 2): 3. string lights on the houses in map_farmer_snow_island.png — TABS: warm yellow string lights between the two back houses and on the mill, plus a lit Christmas tree (ref: reference/maps/wiki/farmer_snow.png) 4. snow-capped watermill house in map_farmer_snow_island.png — TABS: the timber watermill house on the left with snowy roofs (ref: reference/maps/farm_snow.png) 5. evergreen grove in map_farmer_snow_top.png — TABS: a group of snowy evergreen pines at the upper right where Farmer 1's hay field is (ref: loop/cards/maps/farmer_snow.md Overview) 6. island slab in map_farmer_snow_island.png — TABS: a dark navy earth underside with snow-capped stone inlays; ours has black spikes under a translucent box (ref: reference/maps/farm_snow.png)
b FAIL (558: struck 4): 3. field outline in map_farmer_snow_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab ringed by dense trees (ref: reference/maps/wiki/farmer_snow.png) 5. no buildings on the back rim and front-left in map_farmer_snow_top — TABS: houses at the back and the mill at front-left bound the field (ref: reference/maps/wiki/farmer_snow.png) 6. translucent rectangular slab extending past the island edge in map_farmer_snow_top — TABS: nothing outside the island (ref: reference/maps/farm_snow.png)
c PASS (558 judge)
## Ranked gaps
1. [P] a — blocker 5: pineGrove needle emissive 0.35 -> 0.1 (fallout of 2ec1ca47; applyFog is already false, so check the glow/haze too) — map_farmer_snow_top.png
2. [S] a — blocker 6: dark navy earth bowl with snow-capped stone inlays (farmer_1's earthBowl, own copy)
3. [S] b — blocker 5: snowy houses at the back rim and the mill at the front-left (own copies of farmer_1's)
4. [S] a — blocker 3: warm string lights between the back houses and on the mill, lit cone Christmas tree (needs b5's houses first)
## Attempts (iter | gap | criterion | verdict)
555 | [S] frozen walkable river + icefall, no hazard (d9f9862b) | b1 | APPROVE struck 1
556 | [S] snow cover: ground/grass materials, blades hidden, drifts (21889d91) | a1 | APPROVE struck 1
556 | [S] snowy arched stone bridge at the centre (5d00d620) | b2 | APPROVE struck 2
557 | [S] night sky: navy, stars, flakes, mountains/clouds hidden, moonlight (d588c550) | a2 | APPROVE struck 2
558 | [S] grove of 15 dark snow-capped pines back right (2ec1ca47) | b4 | APPROVE struck 4
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Builder tabs/farmer_snow.ts keeps its own copy of farmer_1's river course and bridge; nightSky restores hemi/dir lights in dispose.
- Critic 557: snow and ring glow milky white with a haze, not moonlit blue; ring trees still green broadleaf.
- Critic 558: the grove reads pale grey under the white haze, not dark evergreens.
