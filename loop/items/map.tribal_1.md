# map.tribal_1
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (556: struck 1, 4): 2. grey cliff walls in map_tribal_1_top.png — TABS: tall grey faceted rock cliffs ring the back arc and the front-right edge behind the trees; ours has no cliffs at all (ref: reference/maps/wiki/tribal_1.png) 3. island slab in map_tribal_1_island.png — TABS: a layered orange earth underside with white stone flecks, in rounded tiers; ours has dark navy rock with black stalactite spikes (ref: reference/maps/autumn_tribal_1.png) 5. distant grey mountain range and second floating slab behind the island in map_tribal_1_island.png — TABS: open teal sky with only clouds around the island (ref: reference/maps/autumn_tribal_1.png) 6. campfire with dream catcher and stone dog in map_tribal_1_top.png — TABS: a campfire set piece on the far right edge (ref: loop/cards/maps/tribal_1.md Overview; reference/maps/wiki/tribal_1.png right edge)
b FAIL (555: struck 3): 1. field outline in map_tribal_1_top.png — TABS: a round island with the open orange field as a near-circle filling most of it, and the tree/cliff ring hugging the rim; ours is a rounded-rectangle slab with a wide bare orange margin outside the tree oval (ref: reference/maps/wiki/tribal_1.png) 2. short hills along the back and front edges in map_tribal_1_top.png — TABS: raised rock-and-tree ridges across the far back and the front, stretching left to right; ours has only a few flat orange mounds at the corners (ref: loop/cards/maps/tribal_1.md Overview; reference/maps/autumn_tribal_1.png)
c PASS (556 judge)
## Ranked gaps
1. [S] a — blocker 2: rimCliffs as a tall continuous faceted face behind the ring (back arc, front-right), not gapped posts
2. [S] b — blocker 2: raised rock-and-tree ridges along back and front (terrainMesh height)
3. [S] a — blocker 6: campfire with dream catcher and stone dog at the far right edge
## Attempts (iter | gap | criterion | verdict)
555 | [S] field cleared of boulders/walls/bales/stumps (a7a8f62e) | b3 | APPROVE struck 3
555 | [S] rim cliffs in three runs (aef862a5) | a2 | APPROVE (posts, not a face; stands)
556 | [S] birch kit: ball crowns on white trunks, low band recoloured (197aec95) | a1 | APPROVE struck 1, 4
## Rejected (last 4)
## Notes (max 3 lines)
- Builder web/src/map/tabs/tribal_1.ts on sandbox.tribal. Critic 556: crowns about half TABS size, ring reads as a thin dotted line.
