# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. Mauve-brown daylight sky with white clouds in map_fantasy_evil_ground — TABS: near-black void with no clouds (ref: reference/maps/wiki/fantasy_evil.png) 2. Flat maroon-purple lawn in map_fantasy_evil_top — TABS: dark slate-teal blocky basalt rock floor (ref: wiki/fantasy_evil.png) 3. Ring of round pale-green trees in map_fantasy_evil_top — TABS: jagged dark rock columns and broken pillars, no tree ring (ref: wiki/fantasy_evil.png) 4. No acid-green glow in map_fantasy_evil_island — TABS: glowing green crevices and rims along the island edges, plus green mushroom clusters (ref: wiki/fantasy_evil.png) 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. Grass slab with black spikes under it and a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b FAIL (0 since 587): 1. Oval single-level meadow in map_fantasy_evil_top — TABS: a broken plateau of rock blocks at several levels (ref: wiki/fantasy_evil.png) 2. No staircases in map_fantasy_evil_top — TABS: two broad stone stairs climbing from the front level to the central shrine (ref: wiki/fantasy_evil.png lower centre) 3. Flat dark disc with a plank at centre in map_fantasy_evil_battle — TABS: a raised gothic shrine ring with a blue-glowing portal altar behind it (ref: wiki/fantasy_evil.png, void_evil.png) 4. No chasms in map_fantasy_evil_top — TABS: green-lit chasms split the field between plateaus (ref: wiki/fantasy_evil.png)
c PASS (587 judge)

## Ranked gaps
1. [S] a void builder — blocker 1: new web/src/map/tabs/fantasy_evil.ts: black void sky, base sky/range/clouds hidden — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_ground.png
2. [S] a basalt floor and rims — blockers 2-4: slate basalt blocks replacing lawn and tree ring, green-glow rims — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
3. [S] b levels and stairs — blockers 1, 2: plateaus at several levels joined by two broad stairs — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
4. [S] a chained statue on a rock spire — blocker 5 — ref: void_evil.png — ours: map_fantasy_evil_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Base campaign.fantasy_evil (oval meadow, tree ring). Audits 587: output/loop/iter-587/audit.md, audit2.md.
