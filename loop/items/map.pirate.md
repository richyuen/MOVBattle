# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (593: struck 1; 595 deck shot re-aimed on the stern quarter, a2 rankable there): 2. ship hull shape in map_pirate_deck.png is a flat-sided box with a square stern block — TABS: a curved, tapering galleon hull with a high ornate stern castle and rows of stern windows (ref: reference/maps/wiki/pirate.png) 3. the island's outer rim in map_pirate_island.png is a bare turquoise water disk with no visible slab side — TABS: the round island is closed by an outer sand-and-grass beach ring with palms, and the slab shows its sandy side (ref: reference/maps/pirate_beach.png)
b FAIL (595: struck 1): 2. no team-1 ship deck to place on in stage_pirate.x_marks_the_spot_field.png; the enemy stands on open sand at the right end — TABS: the enemy army stands on its own ship's deck and gangplanks (ref: reference/stages/pirate.x_marks_the_spot.png, reference/stages/spooky.plunder.png)
c PASS (595 judge)

## Ranked gaps
1. [S] b team-1 deck — blocker 2: team-1 placement zone over the -z galleon's deck and gangplanks (x 2..32, z -41..-20), stage armies (x_marks_the_spot, a_rival_captain, spooky.plunder) authored on it — ref: stages/pirate.x_marks_the_spot.png — ours: stage_pirate.x_marks_the_spot_field.png
2. [S] a outer beach ring — blocker 3: sand-and-grass ring with palms closing the lagoon, sandy slab side — ref: pirate_beach.png — ours: map_pirate_island.png
3. a2 stern (2 attempts, starvation or [R] only): raked gold-framed transom with stern windows, now facing map_pirate_deck (stern quarter at x -30)

## Attempts (iter | gap | criterion | verdict)
595 | [S] one galleon per team side (x -17 / +17) b3ba566f; evidence deck shot 637bc25c | b1 | APPROVE, struck b1 (attempt 1)
594 | [S] raked gold transom, 2 rows lit windows 29222f58 | a2 | REJECT, reverted b4a3cdd9 (attempt 2)
593 | [S] lofted curved hull shell c6dfd275 (+0a50ce06) | a2 | APPROVE, struck a1, a2 bow clause (attempt 1)
592 | [S] spit tapers to rounded points af385087 | b3 | APPROVE, struck b3; CONFIRM failed a, b (new lists)
576-587 | [S] galleons, lagoon, sand island, bell mountain, beach, gangplanks, shore, sky, golden sand, standable decks | a, b | struck a1-a6, b1-b5

## Rejected (last 4)
594 | [S] a2 29222f58 | transom windows face +-x, invisible in deck/top/island shots; stern still a square block side-on

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (enemy x29..41.4, |z|<=9.9). SHIPS {x -17, z 37, bow 1}, {x 17, z -37, bow -1}; hull loft u -13..15; decks y 3.6, rails split at plank mouths.
- A 2nd CONFIRM fail on a or b makes it plateau. Critic 595: deck shot shows a three-tier box stern castle with square windows on its side face.
