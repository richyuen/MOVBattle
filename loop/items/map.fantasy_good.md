# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (591: struck 1): 2. Ring of round pale-green trees closing the field in map_fantasy_good_top — TABS: white crenellated parapet walls with gold battlements along the deck edges (ref: wiki/fantasy_good.png) 3. No gate towers in map_fantasy_good_island — TABS: two huge white-and-gold arched gate towers with stained-glass windows and blue waterfall channels (ref: reference/maps/heaven_good.png) 4. Dark stalactite spikes under the island in map_fantasy_good_island — TABS: white arcaded viaduct arches over grey basalt column cliffs with teal trees (ref: wiki/fantasy_good.png lower left) 5. Grey haze sky with a floating mountain-range island behind in map_fantasy_good_island — TABS: clear pale-blue sky with big white cloud banks, no mountains (ref: heaven_good.png) 6. Black-and-white box plinth at centre in map_fantasy_good_ground — TABS: white obelisk spires with gold halo rings (ref: wiki/fantasy_good.png)
b FAIL (592: struck 2, 6): 1. Rounded oval lawn outline in map_fantasy_good_top — TABS: rectangular paved deck with stepped, zig-zag edges (ref: wiki/fantasy_good.png) 3. No gate towers at the back corners of each half in map_fantasy_good_top — TABS: a gate tower stands at the far corner of each half (ref: wiki/fantasy_good.png) 4. Raised plinth block in the middle of the open ground in map_fantasy_good_battle — TABS: open paved walkway at centre (ref: wiki/fantasy_good.png centre) 5. No side islets in map_fantasy_good_island — TABS: several small floating islands beside the main deck (ref: card Overview, heaven_good.png top left)
c PASS (592 judge)

## Ranked gaps
1. [S] b centre plinth — blocker 4 (and a6): hide the base temple plinth and its collider, pave the cross centre — ref: wiki/fantasy_good.png — ours: map_fantasy_good_battle.png
2. [S] a parapets — blocker 2: hide the base tree ring, white parapet walls with gold merlons on the deck edges — ref: wiki/fantasy_good.png — ours: map_fantasy_good_top.png
3. [S] b gate towers — blocker 3 (and a3): white-and-gold arched tower at the far corner of each half — ref: heaven_good.png — ours: map_fantasy_good_top.png
4. [S] a sky — blocker 5: blue sky, cloud banks (simKit cloudBanks + untoned), no mountains — ref: heaven_good.png — ours: map_fantasy_good_island.png

## Attempts (iter | gap | criterion | verdict)
592 | [S] four 10 m pits, cross walkways, pools gone e1ab8d1b (+feb60ff9 islandUnder lid) | b2 | APPROVE, struck b2, b6
591 | [S] own builder, white marble deck with gold kerb 21913c7f | a1 | APPROVE, struck a1

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_good.ts on campaign.fantasy_good: deck x +-52 z +-40, pits x 6..30 z 9..30 mirrored (box colliders), islandUnder/Shelf hidden (they lidded the pits). No stage here.
- Critic 592: pit floors read as bright shallow water (want dark shade); zone slabs show past the deck edges.
