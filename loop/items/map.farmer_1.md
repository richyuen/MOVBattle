# map.farmer_1
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (558: struck 6): 2. watermill farmhouse in map_farmer_1_island.png — TABS: a large two-part timber farmhouse with a waterwheel straddling the river at the front (ref: reference/maps/farm_1.png) 4. dense dark-green round tree ring in map_farmer_1_top.png — TABS: a few sparse olive Scots-pine-like trees with tall thin trunks, mostly open rim; ours has a solid ring of dark green bushy trees on red trunks (ref: reference/maps/wiki/farmer_1.png) 5. ruins and black pillar with gold ball in map_farmer_1_ground.png — TABS: no ruins; dry-stone walls, pumpkin patch, wheat field and hay carts dress the field (ref: reference/maps/wiki/farmer_1.png)
b FAIL (558: struck 5): 3. field outline in map_farmer_1_top.png — TABS: a round island with the field running to the rim; ours is a rounded-rectangle slab inside a translucent box (ref: reference/maps/wiki/farmer_1.png)
c PASS (558 judge)
## Ranked gaps
1. [S] a — blocker 5: hide the base ruins (one stands inside the wheat strip), add a pumpkin patch — ours: map_farmer_1_ground.png
2. [S] a — blocker 2: watermill as timber plank walls, a gabled upper storey and a big waterwheel in the river between the halves
3. [S] b — blocker 3: hide the campaign_zone_overlay/border boxes (placement guides, mapBuilder createPlacementGuides) and reshape the lawn round
4. [S] a — blocker 4: sparse olive Scots pines on tall thin trunks replacing the dense ring
## Attempts (iter | gap | criterion | verdict)
555 | [S] river + waterfall, hazard with centre gap (9a6acff4) | b1 | APPROVE struck 1
555 | [S] stone bridge at the crossing (d76751b7) | b2 | APPROVE struck 2
555 | [S] watermill: two houses + wheel at front rim (6e9a1c3a) | a2 | APPROVE (wheel clause stands)
556 | [S] two red houses with balconies at the back rim (781d89bf) | a3 | APPROVE struck 3
556 | [S] base totem pillar + barricade box removed (ffe9661a) | b6 | APPROVE struck 6
557 | [S] cobble walls on the river banks and the yard (2a626789) | b4 | APPROVE struck 4
557 | [S] warm meadow + tan tracks off the bridge (dd302114) | a1 | APPROVE struck 1
558 | [S] two wheat strips back right + stubble patches (2d04d016, 2acd436e) | b5 | APPROVE struck 5
558 | [S] earth bowl underside with set stones, range hidden (84bfd3eb) | a6 | APPROVE struck 6
## Rejected (last 4)
## Notes (max 3 lines)
- Builder web/src/map/tabs/farmer_1.ts on campaign.introduction; river |x|<4 (zones |x|>=5). earthBowl is the underside kit to copy.
- Critic 557: grass a saturated lemon yellow (TABS muted olive-ochre); walls read lavender-grey and thin.
- Critic 558: bowl reads shallow, stones only in its top band; wheat strips small.
