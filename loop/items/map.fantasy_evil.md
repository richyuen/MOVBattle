# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (596: a5 clause "a large statue at the back" cleared, no strike): 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b PASS (595: struck 2; CONFIRM pending; 596 early CONFIRM passed b, not counted: item not would-be-done)
c PASS (596 judge)

## Ranked gaps
1. [S] a6 backdrop — blocker 6: a crag mass behind the back-right rim (x 25..55, z 42..60) rising 15-35 m above the deck round the spire's foot, grey-teal (.2,.26,.32) self .3, spire lit the same, so both show in _island and _top — ref: void_evil.png
2. [P] a5 chains (fallout of f4eef72d, to 599): statue chain links 1.3 -> 2.2 m, thick .34 -> .55, (.22,.24,.27) -> (.34,.38,.42) self .5 — ours: map_fantasy_evil_island.png, _top
3. 596 early CONFIRM (not counted) also named: chain crag-to-statue, chains wrapped round the statue, pink discs on the field corners (zone overlays?), square paving grid.

## Attempts (iter | gap | criterion | verdict)
596 | [S] statue re-sited (18,15), 1.05x, turned to the ground camera, self-lit f4eef72d (+990ecde8) | a5 | APPROVE, no strike (statue clause cleared; chains/spire not seen) (attempt 2)
596 | [P] rock mass lit (.2,.26,.32), rim links 1.6 m da34040c | a6 | REJECT, reverted ce1a3756 (mass under the slab, unseen)
595 | [S] stair flights da55aaca; green-glow rim 27e30aa2 (+b9a45842); rock mass + chains 3b0cd8d4 | b2, a4, a6 | APPROVE, struck b2 (b PASS), a4, a6 slab clause
594 | [S] shrine + altar a41b2f35; statue + spire b4c03bd0 (+64abe9e0); [P] seams 932a5b35 | b3, a5 | APPROVE; struck b3; a5 no strike (attempt 1)
590-593 | [S] own builder, void sky, basalt floor, plateau, crevices, rock ring | a1-a3, b1, b4 | APPROVE, struck all

## Rejected (last 4)
596 | [P] a6 da34040c | relit rock mass sits under the slab, out of the island camera; change not visible

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts: voidSky, basaltFloor, STAIRS, greenRim, rockMass, plateau, CHASMS, rockRing, shrine (0,1), ALTAR (0,12), chainedStatue STATUE (18,15) scale 1.05 yaw 1.27, SPIRE (36,40). No stage.
- a5 has 2 attempts (starvation or [R] only after this); a: approved [S] 596 with no strike (595 struck).
- Ground pose (x -30 looking +x, target x 12) frames tan < .59 sideways; the spire (36,40) is out of it.
