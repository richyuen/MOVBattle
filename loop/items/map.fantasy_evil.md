# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (591: struck 1, 2): 3. Ring of round pale-green trees in map_fantasy_evil_top — TABS: jagged dark rock columns and broken pillars, no tree ring (ref: wiki/fantasy_evil.png) 4. No acid-green glow in map_fantasy_evil_island — TABS: glowing green crevices and rims along the island edges, plus green mushroom clusters (ref: wiki/fantasy_evil.png) 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. Grass slab with black spikes under it and a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b FAIL (0 since 587): 1. Oval single-level meadow in map_fantasy_evil_top — TABS: a broken plateau of rock blocks at several levels (ref: wiki/fantasy_evil.png) 2. No staircases in map_fantasy_evil_top — TABS: two broad stone stairs climbing from the front level to the central shrine (ref: wiki/fantasy_evil.png lower centre) 3. Flat dark disc with a plank at centre in map_fantasy_evil_battle — TABS: a raised gothic shrine ring with a blue-glowing portal altar behind it (ref: wiki/fantasy_evil.png, void_evil.png) 4. No chasms in map_fantasy_evil_top — TABS: green-lit chasms split the field between plateaus (ref: wiki/fantasy_evil.png)
c PASS (591 judge)

## Ranked gaps
1. [S] b plateau — blocker 1 (STARVING at 592): rock-block terraces at several levels in the height field, walled step faces — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
2. [S] a rock ring — blocker 3: hide the tree ring, jagged dark basalt columns and broken pillars — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
3. [S] a green-glow rims — blocker 4: acid-green emissive crevices along the island edges, mushroom clusters — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_island.png
4. [P] a seam tone (fallout of 15ca3a31, to 594): basaltSeams read pale lilac — bed (.02,.03,.035) darker/unlit, out of fog — ours: map_fantasy_evil_ground.png

## Attempts (iter | gap | criterion | verdict)
591 | [S] lawn hidden, basalt block floor (thin instances, seams) 15ca3a31 | a2 | APPROVE, struck a2
590 | [S] own builder, void sky 9bfb373f | a1 | APPROVE, struck a1

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts on campaign.fantasy_evil (oval, tree ring): voidSky; basaltFloor 2 m blocks inside superellipse 53 x 47 p3, tops .02-.22 m. No stage here.
- Critic 591: pale lavender lip rings the oval outside the blocks; zone/spawn discs still tint the floor.
