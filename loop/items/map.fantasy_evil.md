# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (593: struck 3): 4. No acid-green glow in map_fantasy_evil_island — TABS: glowing green crevices and rims along the island edges, plus green mushroom clusters (ref: wiki/fantasy_evil.png) 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. Grass slab with black spikes under it and a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b FAIL (594: struck 3): 2. No staircases in map_fantasy_evil_top — TABS: two broad stone stairs climbing from the front level to the central shrine (ref: wiki/fantasy_evil.png lower centre)
c PASS (594 judge)

## Ranked gaps
1. [S] b stairs — blocker 2: two broad stone flights ~8 m wide at |x| 10..14 from the front level to the 3 m plateau, flanking the shrine, height in fantasyEvilHeight — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
2. [S] a green-glow rim — blocker 4: jagged dark rock edge with acid-green glow seams and mushroom clusters replacing the pale lilac rim band — ref: wiki/fantasy_evil.png — ours: map_fantasy_evil_island.png
3. [P] a chained statue (fallout of b4c03bd0, to 597): STATUE (8,26) -> (0,24); links 1.3 -> 2.2 m, thick .34 -> .55, colour (.4,.42,.46); spire diffuse (.34,.36,.38) — ours: map_fantasy_evil_ground.png
4. [S] a underside — blocker 6: dark rock mass replacing the grass slab and black spikes — ref: void_evil.png — ours: map_fantasy_evil_island.png

## Attempts (iter | gap | criterion | verdict)
594 | [S] gothic shrine ring + blue portal altar, base void disc/plank gone a41b2f35 | b3 | APPROVE, struck b3
594 | [S] winged statue (8,26) chained to leaning spire (36,40) b4c03bd0 (+64abe9e0 glow) | a5 | APPROVE, no strike (statue off the ground shot, chains unseen) (attempt 1)
594 | [P] seam bed unlit near-black 932a5b35 | a | APPROVE (seams dark)
593 | [S] acid-green crevices 18fff580; rock ring a0acf189 | b4, a3 | APPROVE, struck both
590-592 | [S] own builder, void sky, basalt floor, 3 m plateau | a1, a2, b1 | APPROVE, struck all

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts: voidSky, basaltFloor, plateau, CHASMS, rockRing, shrine (SHRINE (0,1) r 6.2, ALTAR (0,12); base voids removed), chainedStatue; height shrineHeight. No stage here.
- Critic 594: shrine fills the battle frame; spire near-black silhouette; pale lilac rim band on the slab edge.
- The ground pose (from x -30 looking +x) frames z ~-20..20 at x 0: set pieces further back show only in top/island.
