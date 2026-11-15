# map.farmer_2
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (556: struck 2): 1. ground colour in map_farmer_2_top.png — TABS: warm yellow-green grass; ours is cool pale green-grey (ref: reference/maps/wiki/farmer_2.png) 3. cobble walls in map_farmer_2_top.png — TABS: grey dry-stone walls cutting the field into sections (ref: reference/maps/wiki/farmer_2.png) 4. hay bale sheaves in map_farmer_2_ground.png — TABS: tied straw sheaves scattered over the front-middle field (ref: reference/maps/wiki/farmer_2.png) 5. farmhouse in map_farmer_2_island.png — TABS: a single timber farmhouse at the back left among olive pines (ref: reference/maps/wiki/farmer_2.png) 6. ruins and black pillar with gold ball in map_farmer_2_ground.png — TABS: no ruins; bushes, pumpkins and olive pines (ref: reference/maps/wiki/farmer_2.png)
b FAIL (556: struck 2): 3. narrow alley with broken fence in map_farmer_2_top.png — TABS: a narrow alley left of the hay field, closed off from the pathway by a broken fence (ref: loop/cards/maps/farmer_2.md Overview) 4. field outline in map_farmer_2_island.png — TABS: a round island with a domed field; ours is a rounded-rectangle slab (ref: reference/maps/farm_2.png) 5. translucent rectangular slab extending past the island edge in map_farmer_2_top — TABS: nothing outside the island (ref: reference/maps/farm_2.png) 6. black box and dark pillar in the open field in map_farmer_2_battle — TABS: open plots separated only by walls (ref: reference/maps/wiki/farmer_2.png)
c PASS (556 judge)
## Ranked gaps
1. [S] a — blocker 4: tied straw sheaves over the front-middle field left of the centre line
2. [S] b — blocker 6: remove the base totem (22,0) and barricade (10,16), meshes and colliders (farmer_1's 556 pattern)
3. [S] b — blocker 3: fence thicker/taller, alley a grass strip to the x -26 wall, track ended inside the rim and out of the wall run
4. [P] a wheat height to waist (fallout of 0653fc87) — stage_introduction.hay_and_pitchforks_army.png
## Attempts (iter | gap | criterion | verdict)
555 | [S] cobble walls, 6 runs with gaps (5403e24d) | b1 | APPROVE struck 1
556 | [S] golden wheat field on the right, thin instances (0653fc87) | a2 | APPROVE struck 2
556 | [S] left dirt pathway with ruts + broken fence (4d116cbc) | b2 | APPROVE struck 2 (fence on b3 progress)
## Rejected (last 4)
## Notes (max 3 lines)
- Team 1 armies stand in x 2..41, z -26..18 (inside the wheat). Critic 556: wheat about unit height hides the armies; TABS waist high.
