# map.farmer_1
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (559: struck 5): 2. watermill farmhouse in map_farmer_1_island.png — TABS: a large two-part timber farmhouse with a waterwheel straddling the river at the front (ref: reference/maps/farm_1.png) 4. dense dark-green round tree ring in map_farmer_1_top.png — TABS: a few sparse olive Scots-pine-like trees with tall thin trunks, mostly open rim; ours has a solid ring of dark green bushy trees on red trunks (ref: reference/maps/wiki/farmer_1.png)
b FAIL (558: struck 5): 3. field outline in map_farmer_1_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab inside a translucent box (ref: reference/maps/wiki/farmer_1.png)
c PASS (559 judge)
## Ranked gaps
1. [S] a — blocker 4: sparse olive Scots pines on tall thin trunks replacing the dense ring, most of the rim open — ours: map_farmer_1_top.png
2. [S] a — blocker 2: watermill as timber plank walls, a gabled upper storey and a big waterwheel in the river between the halves
3. [S] b — blocker 3: hide campaign_zone_overlay/border (as farmer_2 4cf35a90) and reshape the lawn and earthBowl round (islandOutline is the one function)
## Attempts (iter | gap | criterion | verdict)
555-558 | a: watermill, red houses, meadow + tracks, earth bowl | a | 4 APPROVE, struck 1, 3, 6 (wheel clause stands)
555-558 | b: river, bridge, totem out, walls, wheat strips | b | 5 APPROVE, struck 1, 2, 4, 5, 6
559 | [S] base ruins + colliders gone, pumpkin patch on tilled earth (74f42750) | a5 | APPROVE struck 5
## Rejected (last 4)
## Notes (max 3 lines)
- Builder web/src/map/tabs/farmer_1.ts on campaign.introduction; river |x|<4 (zones |x|>=5). earthBowl is only 22 m deep: the island camera shows ~7 m of it (deepen like tribal tiers).
- Critic 559: pumpkin patch is a bare dark disc (TABS: pumpkins in grass by a bush and a wall).
- Critic 557: grass a saturated lemon yellow; walls read lavender-grey and thin.
