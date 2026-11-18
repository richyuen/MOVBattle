# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (596: struck 3): 2. ship hull shape in map_pirate_deck.png is a flat-sided box with a square stern block — TABS: a curved, tapering galleon hull with a high ornate stern castle and rows of stern windows (ref: reference/maps/wiki/pirate.png)
b PASS (596: struck 2; CONFIRM pending)
c PASS (596 judge)

## Ranked gaps
1. a2 stern (2 attempts: starvation pick or [R] only): loft the stern castle as a tapered, raked shell continuing the hull's superellipse, two window rows on its sides and quarter, seen in map_pirate_deck — ref: wiki/pirate.png

## Attempts (iter | gap | criterion | verdict)
596 | [S] team-1 deck zone, castle tops standable, 3 stage armies on the -z deck ca380e64 | b2 | APPROVE, struck b2 (b PASS)
596 | [S] outer sand ring with palm clumps and sandy drum side ffb7e7ad (+8e8d3c20) | a3 | APPROVE, struck a3
595 | [S] one galleon per team side (x -17 / +17) b3ba566f; evidence deck shot 637bc25c | b1 | APPROVE, struck b1
594 | [S] raked gold transom, 2 rows lit windows 29222f58 | a2 | REJECT, reverted b4a3cdd9 (attempt 2)
593 | [S] lofted curved hull shell c6dfd275 (+0a50ce06) | a2 | APPROVE, struck a1, a2 bow clause (attempt 1)
576-592 | [S] galleons, lagoon, sand island, bell mountain, beach, gangplanks, shore, sky, golden sand, decks, spit | a, b | struck a1-a6, b1-b5; CONFIRM 592 failed a, b

## Rejected (last 4)
594 | [S] a2 29222f58 | transom windows face +-x, invisible in deck/top/island shots; stern still a square block side-on

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder: now on the -z deck (keel z -37, x 8..26, plank heads z -30.5). SHIPS {x -17, z 37, bow 1}, {x 17, z -37, bow -1}; deck zone x 2..32 z -41..-20 appended after base zones.
- Critic 596: the deck crews hide under the sail rolls in the _field shots (stage b work). A 2nd CONFIRM fail on a or b makes it plateau.
