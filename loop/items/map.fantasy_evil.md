# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (595: struck 4, a6 clause "grass slab with black spikes under it"): 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b PASS (595: struck 2; CONFIRM pending)
c PASS (595 judge)

## Ranked gaps
1. [P] a rock mass (fallout of 3b0cd8d4, to 598): voidRockMass diffuse (.09,.12,.14) -> (.2,.26,.32), emissive -> (.07,.09,.11); chain links 1.1 -> 1.6 m — ours: map_fantasy_evil_island.png under the rim
2. [S] a chained statue — blocker 5 (attempt 2): the winged statue placed and scaled to stand in the ground frame (|z| < ~20 at x 0, e.g. (12,16), 14 m), chains to the spire legible — ref: void_evil.png — ours: map_fantasy_evil_ground.png
3. [P] a statue (fallout of b4c03bd0, to 597): STATUE (8,26) -> (0,24); links 1.3 -> 2.2 m, thick .34 -> .55

## Attempts (iter | gap | criterion | verdict)
595 | [S] stair flights |x| 8..16, crossings widened da55aaca | b2 | APPROVE, struck b2 (b PASS)
595 | [S] jagged rock rim, green cracks/lips, mushrooms, pale slab gone 27e30aa2 (+b9a45842) | a4 | APPROVE, struck a4
595 | [S] heaped rock mass + rim chains, crags gone 3b0cd8d4 | a6 | APPROVE, a6 slab clause struck (mass unseen against the void)
594 | [S] shrine ring + portal altar a41b2f35; winged statue + spire b4c03bd0 (+64abe9e0) | b3, a5 | APPROVE, struck b3; a5 no strike (attempt 1)
594 | [P] seam bed unlit near-black 932a5b35 | a | APPROVE
590-593 | [S] own builder, void sky, basalt floor, plateau, crevices, rock ring | a1-a3, b1, b4 | APPROVE, struck all

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts: voidSky, basaltFloor, STAIRS (|x| 8..16, z -16..-6, 12 treads), greenRim, rockMass, plateau, CHASMS, rockRing, shrine, chainedStatue; height shrineHeight. No stage here.
- Critic 595: stair treads uniform, no landing; glow only thin slashes on the outer face.
- The ground pose (from x -30 looking +x) frames z ~-20..20 at x 0: set pieces further back show only in top/island.
