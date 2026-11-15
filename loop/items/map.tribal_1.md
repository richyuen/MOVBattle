# map.tribal_1
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (559: struck 3): 6. campfire with dream catcher and stone dog in map_tribal_1_top.png — TABS: a campfire set piece on the far right edge (ref: loop/cards/maps/tribal_1.md Overview; reference/maps/wiki/tribal_1.png right edge)
b FAIL (555: struck 3): 1. field outline in map_tribal_1_top.png — TABS: a round island with the open orange field as a near-circle filling most of it, and the tree/cliff ring hugging the rim; ours is a rounded-rectangle slab with a wide bare orange margin outside the tree oval (ref: reference/maps/wiki/tribal_1.png) 2. short hills along the back and front edges in map_tribal_1_top.png — TABS: raised rock-and-tree ridges across the far back and the front, stretching left to right; ours has only a few flat orange mounds at the corners (ref: loop/cards/maps/tribal_1.md Overview; reference/maps/autumn_tribal_1.png)
c PASS (559 judge)
## Ranked gaps
1. [S] a — blocker 6: campfire set piece (log ring with flames, dream-catcher post, stone dog) on the far right rim — ours: map_tribal_1_top.png
2. [S] b — blocker 2: raised rock-and-tree ridges across the far back and the front (rock bands on the rim; terrain height would sink the cliffs and trees seated at y 0) — ours: map_tribal_1_top.png
3. [S] b — blocker 1: round island outline (the earthTiers rim() is the one outline function to swap)
## Attempts (iter | gap | criterion | verdict)
555-558 | a: cliffs, birch kit, cliff mass, open sky | a | 4 APPROVE, struck 1, 2, 4, 5
555 | [S] field cleared of boulders/walls/bales/stumps (a7a8f62e) | b3 | APPROVE struck 3
559 | [S] three stacked orange earth tiers + white flecks (be5d20e9, ecbd58a9) | a3 | APPROVE struck 3
## Rejected (last 4)
## Notes (max 3 lines)
- Builder web/src/map/tabs/tribal_1.ts on sandbox.tribal. Stages here keep their armies within 27 m of centre.
- Critic 559: only two tiers read (third crease lost in shade), flecks sparse at the back.
- b untouched since 555: starves at 561 unless picked.
