# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (593: struck 1): 2. ship hull shape in map_pirate_deck.png is a flat-sided box with a square stern block — TABS: a curved, tapering galleon hull with a high ornate stern castle and rows of stern windows (ref: reference/maps/wiki/pirate.png) 3. the island's outer rim in map_pirate_island.png is a bare turquoise water disk with no visible slab side — TABS: the round island is closed by an outer sand-and-grass beach ring with palms, and the slab shows its sandy side (ref: reference/maps/pirate_beach.png)
b FAIL (0 since 592, CONFIRM list; critic 592 struck b3): 1. ship placement in map_pirate_top.png puts both ships on the north and south shores, each straddling the centre line — TABS: one ship moored on each team's side of the sand, red by one ship and blue by the other (ref: reference/maps/wiki/pirate.png, reference/maps/pirate_beach.png) 2. no team-1 ship deck to place on in stage_pirate.x_marks_the_spot_field.png; the enemy stands on open sand at the right end — TABS: the enemy army stands on its own ship's deck and gangplanks (ref: reference/stages/pirate.x_marks_the_spot.png, reference/stages/spooky.plunder.png)
c PASS (594 judge)

## Ranked gaps
1. [S] b ships per team — blocker 1: re-lay the galleons one per team side, hulls along z with sterns toward the camera side, team-1 deck as placing ground (b2 rides on it); re-aim map_pirate_deck on the stern quarter in the same iteration (evidence commit) — ref: wiki/pirate.png — ours: map_pirate_top.png
2. [S] a outer beach ring — blocker 3: sand-and-grass ring with palms closing the lagoon, sandy slab side — ref: pirate_beach.png — ours: map_pirate_island.png
3. [P] b palm prune (critic 592 fallout of af385087, to 595): re-run the outline + 1 m prune on the tapered stations — ours: map_pirate_top.png
4. a2 stern: 2 attempts (593 approve, 594 reject), only starvation or [R]; land the transom windows only where a shot faces them

## Attempts (iter | gap | criterion | verdict)
594 | [S] raked gold transom, 2 rows lit windows 29222f58 | a2 | REJECT, reverted b4a3cdd9 (attempt 2)
593 | [S] lofted curved hull shell c6dfd275 (+0a50ce06) | a2 | APPROVE, struck a1, a2 bow clause (attempt 1)
592 | [S] spit tapers to rounded points af385087 | b3 | APPROVE, struck b3; CONFIRM failed a, b (new lists)
576-587 | [S] galleons, lagoon, sand island, bell mountain, beach, gangplanks, shore, sky, golden sand, standable decks | a, b | struck a1-a6, b1-b5

## Rejected (last 4)
594 | [S] a2 29222f58 | transom windows face +-x, invisible in deck/top/island shots; stern still a square block side-on

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Hull loft u -13..15 (hullHalfBeam, hullDepth, hullV); decks y 3.6, rails split at plank mouths.
- A 2nd CONFIRM fail on a or b makes it plateau. Moving ships per team also moves the stage armies' decks (b2): keep those enemy x,z valid. Critic 593: pale glow halo round the dark hull.
