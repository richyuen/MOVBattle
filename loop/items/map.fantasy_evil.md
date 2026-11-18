# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (597: a6 clause "a dark rock mass" cleared, no strike; 596 a5 clause "a large statue at the back" cleared): 5. No chained Void Monarch statue in map_fantasy_evil_ground — TABS: a large statue at the back, chained to a giant rock spire (ref: wiki/fantasy_evil.png, void_evil.png) 6. a mountain backdrop in map_fantasy_evil_island — TABS: a dark rock mass with a giant leaning rock spire and hanging chains (ref: reference/maps/void_evil.png)
b PASS (595: struck 2; CONFIRM pending; 596 early CONFIRM passed b, not counted)
c PASS (597 judge)

## Ranked gaps
1. [S] a6 spire and chains (fallout of 89b4f29e, to 600): one lone 45 m leaning slab over the crag toward the field, two catenary chains of 1.6 m links from its upper face to the statue plinth; a cool rim light on the crag (it reads near black at self .35) — ref: void_evil.png — ours: map_fantasy_evil_island.png, _top
2. a5 (2 attempts: starvation or [R] only): statue at the spire's foot, chained to it

## Attempts (iter | gap | criterion | verdict)
597 | [S] backdrop crag heaped round the spire, ledge chains 89b4f29e (+4818fb5b glow-excluded) | a6 | APPROVE, no strike (rock-mass clause cleared) (attempt 1)
596 | [S] statue re-sited (18,15) f4eef72d (+990ecde8) | a5 | APPROVE, no strike (attempt 2); [P] rock mass lit da34040c REJECT
595 | [S] stairs da55aaca; green rim 27e30aa2; rock mass + chains 3b0cd8d4 | b2, a4, a6 | APPROVE, struck b2 (b PASS), a4, a6 slab clause
590-594 | [S] builder, void sky, basalt floor, plateau, crevices, rock ring, shrine, statue + spire | a1-a3, b1, b3, b4, a5 | APPROVE, struck all but a5

## Rejected (last 4)
596 | [P] a6 da34040c | relit rock mass sits under the slab, out of the island camera; change not visible

## Notes (max 3 lines)
- Builder tabs/fantasy_evil.ts: ... chainedStatue STATUE (18,15), SPIRE (36,40); backdropCrag (597) after it re-lights voidStatue_spire with the crag material. No stage.
- Critic 597: spire merges into the crag's black mass; crag chains hang behind it, unseen.
- Ground pose (x -30 looking +x, target x 12) frames tan < .59 sideways; the spire (36,40) is out of it.
