# map.farmer_2
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (558: struck 1, 4): 3. cobble walls in map_farmer_2_top.png — TABS: grey dry-stone walls cutting the field into sections (ref: reference/maps/wiki/farmer_2.png) 5. farmhouse in map_farmer_2_island.png — TABS: a single timber farmhouse at the back left among olive pines (ref: reference/maps/wiki/farmer_2.png) 6. ruins and black pillar with gold ball in map_farmer_2_ground.png — TABS: no ruins; bushes, pumpkins and olive pines (ref: reference/maps/wiki/farmer_2.png)
b FAIL (558: struck 3): 4. field outline in map_farmer_2_island.png — TABS: a round island with a domed field; ours is a rounded-rectangle slab (ref: reference/maps/farm_2.png) 5. translucent rectangular slab extending past the island edge in map_farmer_2_top — TABS: nothing outside the island (ref: reference/maps/farm_2.png)
c PASS (558 judge)
## Ranked gaps
1. [S] a — blocker 6: hide the base ruin arch/pillars and the far mountain* range, bushes and pumpkins in their place — ours: map_farmer_2_ground.png
2. [S] b — blocker 5: hide the campaign_zone_overlay/border boxes (placement guides; zones stay in data) — ours: map_farmer_2_top.png
3. [S] a — blocker 5: single timber farmhouse at the back left among olive pines
4. [S] a — blocker 3: walls as big rounded warm-grey stones (r well over b), not thin lilac lines
## Attempts (iter | gap | criterion | verdict)
555 | [S] cobble walls, 6 runs with gaps (5403e24d) | b1 | APPROVE struck 1
556 | [S] golden wheat field on the right, thin instances (0653fc87) | a2 | APPROVE struck 2
556 | [S] left dirt pathway with ruts + broken fence (4d116cbc) | b2 | APPROVE struck 2
557 | [S] base totem + barricade removed (bbba2e12) | b6 | APPROVE struck 6
557 | [S] straw sheaves in the front-left field (748358f1) | a4 | APPROVE (stands)
557 | [P] wheat cut to waist height (fec0a4e6) | a | APPROVE
558 | [S] olive meadow + furrows in the middle field (d9949729) | a1 | APPROVE struck 1
558 | [S] alley grass strip, taller 3-rail fence, track stops at yard wall (110fbe0a) | b3 | APPROVE struck 3
558 | [P] sheaves forward and 1.5x (4a375df6) | a4 | APPROVE struck 4
## Rejected (last 4)
## Notes (max 3 lines)
- Team 1 armies stand in x 2..41, z -26..18 (inside the wheat).
- Critic 558: sheaves still small next to TABS chest-high bundles.
