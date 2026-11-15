# map.farmer_1
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 555): 1. ground colour in map_farmer_1_top.png — TABS: warm yellow-green grass with tan dirt paths; ours is cool pale green-grey meadow with a pink/blue team tint (ref: reference/maps/wiki/farmer_1.png) 2. watermill farmhouse in map_farmer_1_island.png — TABS: a large two-part timber farmhouse with a waterwheel straddling the river at the front (ref: reference/maps/farm_1.png) 3. two red timber houses in map_farmer_1_top.png — TABS: two wooden red houses with balconies at the back edge (ref: reference/maps/wiki/farmer_1.png) 4. dense dark-green round tree ring in map_farmer_1_top.png — TABS: a few sparse olive Scots-pine-like trees with tall thin trunks, mostly open rim; ours has a solid ring of dark green bushy trees on red trunks (ref: reference/maps/wiki/farmer_1.png) 5. ruins and black pillar with gold ball in map_farmer_1_ground.png — TABS: no ruins; dry-stone walls, pumpkin patch, wheat field and hay carts dress the field (ref: reference/maps/wiki/farmer_1.png) 6. island slab in map_farmer_1_island.png — TABS: a dark brown-grey earth underside with rounded stone inlays; ours has a navy underside with black spikes and a mountain backdrop (ref: reference/maps/farm_1.png)
b FAIL (555: struck 1, 2): 3. field outline in map_farmer_1_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab inside a translucent box (ref: reference/maps/wiki/farmer_1.png) 4. dry-stone walls in map_farmer_1_top.png — TABS: low cobble walls along the river banks and around the houses' yard (ref: reference/maps/wiki/farmer_1.png) 5. no dirt tracks or wheat strip on the right half in map_farmer_1_top — TABS: diverging dirt paths and a golden wheat strip on the right (ref: reference/maps/wiki/farmer_1.png) 6. black box and dark pillar standing in the open field in map_farmer_1_ground — TABS: open grass with low furrows (ref: reference/stages/renaissance.renaissance_vs_farmer_1.png)
c PASS (555 judge)
## Ranked gaps
1. [S] a — blocker 3: two red timber houses with balconies at the back rim — ours: map_farmer_1_top.png
2. [S] b — blocker 4: dry-stone walls along the river banks and the houses' yard
3. [S] b — blocker 6: remove the black box and dark pillar from the field — ours: map_farmer_1_ground.png
4. [S] a — blocker 2: clear base trees from the river gap; wheel face-on to the island camera
5. [P] b BRIDGE deck hump (fallout of d76751b7) — map_farmer_1_ground.png
## Attempts (iter | gap | criterion | verdict)
555 | [S] river + waterfall, hazard with centre gap (9a6acff4) | b1 | APPROVE struck 1
555 | [S] stone bridge at the crossing (d76751b7) | b2 | APPROVE struck 2
555 | [S] watermill: two houses + wheel at front rim (6e9a1c3a) | a2 | APPROVE (wheel clause stands)
## Rejected (last 4)
## Notes (max 3 lines)
- Builder web/src/map/tabs/farmer_1.ts on campaign.introduction; river |x|<4 (zones |x|>=5).
