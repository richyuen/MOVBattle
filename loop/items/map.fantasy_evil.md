# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (593: struck 3): 4. No acid-green glow in map_fantasy_evil_island — TABS: glowing green crevices and rims along the island edges, plus green mushroom clusters (ref: wiki/fantasy_evil.png) 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. Grass slab with black spikes under it and a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b FAIL (593: struck 4): 2. No staircases in map_fantasy_evil_top — TABS: two broad stone stairs climbing from the front level to the central shrine (ref: wiki/fantasy_evil.png lower centre) 3. Flat dark disc with a plank at centre in map_fantasy_evil_battle — TABS: a raised gothic shrine ring with a blue-glowing portal altar behind it (ref: wiki/fantasy_evil.png, void_evil.png)
c PASS (593 judge)

## Ranked gaps
1. [S] b shrine — blocker 3: raised gothic shrine ring with a blue portal altar replacing the plank (base bridge at 0,0) — ref: void_evil.png — ours: map_fantasy_evil_battle.png
2. [S] a chained statue — blocker 5 (and a6): statue at the back chained to a giant leaning rock spire — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_ground.png
3. [S] b stairs — blocker 2: two broad stone flights at the crossings |x| 10..14 from the front level to the plateau — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
4. [S] a green-glow rims — blocker 4: acid-green crevices along the island edges, mushroom clusters — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_island.png
5. [P] a seam tone (fallout of 15ca3a31, to 594): basaltSeams read pale lilac — ours: map_fantasy_evil_ground.png

## Attempts (iter | gap | criterion | verdict)
593 | [S] acid-green crevices, front foot + sides, two crossings 18fff580 | b4 | APPROVE, struck b4
593 | [S] rock ring: basalt column clumps + broken pillars, haze treeline hidden a0acf189 | a3 | APPROVE, struck a3
592 | [S] 3 m plateau, 0.75 m terraces 0ee4c12c | b1 | APPROVE, struck b1
590-591 | [S] own builder, void sky; basalt block floor | a1, a2 | APPROVE, struck both

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts: voidSky, basaltFloor, blockLevel plateau, CHASMS (void hazards, drawn), rockRing; fantasyEvilHeight is the MapBuildResult height. No stage here.
- Critic 593: columns near-black and dense (TABS dark teal-grey, gaps); pink-red disc patches (base zone/prop) on the floor corners.
