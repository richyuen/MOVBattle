# map.farmer_2
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (556: struck 2): 1. ground colour in map_farmer_2_top.png — TABS: warm yellow-green grass; ours is cool pale green-grey (ref: reference/maps/wiki/farmer_2.png) 3. cobble walls in map_farmer_2_top.png — TABS: grey dry-stone walls cutting the field into sections (ref: reference/maps/wiki/farmer_2.png) 4. hay bale sheaves in map_farmer_2_top.png — TABS: tied straw sheaves scattered over the front-middle field (ref: reference/maps/wiki/farmer_2.png) 5. farmhouse in map_farmer_2_island.png — TABS: a single timber farmhouse at the back left among olive pines (ref: reference/maps/wiki/farmer_2.png) 6. ruins and black pillar with gold ball in map_farmer_2_ground.png — TABS: no ruins; bushes, pumpkins and olive pines (ref: reference/maps/wiki/farmer_2.png)
b FAIL (557: struck 6): 3. narrow alley with broken fence in map_farmer_2_top.png — TABS: a narrow alley left of the hay field, closed off from the pathway by a broken fence (ref: loop/cards/maps/farmer_2.md Overview) 4. field outline in map_farmer_2_island.png — TABS: a round island with a domed field; ours is a rounded-rectangle slab (ref: reference/maps/farm_2.png) 5. translucent rectangular slab extending past the island edge in map_farmer_2_top — TABS: nothing outside the island (ref: reference/maps/farm_2.png)
c PASS (557 judge)
## Ranked gaps
1. [S] a — blocker 1: warm meadow (farmer_1's warmMeadow, own copy, a more muted olive-ochre)
2. [P] a — blocker 4: SHEAVES z0 -44 -> -36, z1 -23 -> -16, scale x1.5 (fallout of 748358f1) — map_farmer_2_top.png
3. [S] b — blocker 3: fence thicker/taller, alley a grass strip to the x -26 wall, track ended inside the rim and out of the wall run
4. [S] a — blocker 5: single timber farmhouse at the back left among olive pines
## Attempts (iter | gap | criterion | verdict)
555 | [S] cobble walls, 6 runs with gaps (5403e24d) | b1 | APPROVE struck 1
556 | [S] golden wheat field on the right, thin instances (0653fc87) | a2 | APPROVE struck 2
556 | [S] left dirt pathway with ruts + broken fence (4d116cbc) | b2 | APPROVE struck 2 (fence on b3 progress)
557 | [S] base totem + barricade removed (bbba2e12) | b6 | APPROVE struck 6
557 | [S] straw sheaves in the front-left field (748358f1) | a4 | APPROVE (specks under the front trees; stands)
557 | [P] wheat cut to waist height (fec0a4e6) | a | APPROVE
## Rejected (last 4)
## Notes (max 3 lines)
- Team 1 armies stand in x 2..41, z -26..18 (inside the wheat). a4's shot re-aimed 557 to map_farmer_2_top (the ground camera looks across the wheat).
- Critic 557: translucent rectangular box still frames the island (b5).
