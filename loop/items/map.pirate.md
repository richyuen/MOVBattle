# map.pirate
Status: open   Audited: 576 (AUDIT x2), 592 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 592, CONFIRM list): 1. ship hulls in map_pirate_deck.png and map_pirate_top.png are bright orange-tan — TABS: dark chocolate-brown planked hulls with gold/ochre trim (ref: reference/maps/wiki/pirate.png) 2. ship hull shape in map_pirate_deck.png is a flat-sided box with a square stern block — TABS: a curved, tapering galleon hull with a high ornate stern castle and rows of stern windows (ref: reference/maps/wiki/pirate.png) 3. the island's outer rim in map_pirate_island.png is a bare turquoise water disk with no visible slab side — TABS: the round island is closed by an outer sand-and-grass beach ring with palms, and the slab shows its sandy side (ref: reference/maps/pirate_beach.png)
b FAIL (0 since 592, CONFIRM list; critic 592 struck b3): 1. ship placement in map_pirate_top.png puts both ships on the north and south shores, each straddling the centre line — TABS: one ship moored on each team's side of the sand, red by one ship and blue by the other (ref: reference/maps/wiki/pirate.png, reference/maps/pirate_beach.png) 2. no team-1 ship deck to place on in stage_pirate.x_marks_the_spot_field.png; the enemy stands on open sand at the right end — TABS: the enemy army stands on its own ship's deck and gangplanks (ref: reference/stages/pirate.x_marks_the_spot.png, reference/stages/spooky.plunder.png)
c PASS (592 judge)

## Ranked gaps
1. [S] a hulls — blockers 1-2: dark chocolate hull (.2,.11,.055) small self-light, curved tapering courses, high stern castle with windows (LESSONS: lit timber) — ref: wiki/pirate.png — ours: map_pirate_deck.png
2. [S] b ships per team — blocker 1: each galleon moored beside one team's half (x -/+), gangplanks onto its own sand — ref: wiki/pirate.png — ours: map_pirate_top.png
3. [S] a outer beach ring — blocker 3: sand-and-grass ring with palms closing the lagoon, sandy slab side — ref: pirate_beach.png — ours: map_pirate_island.png
4. [P] b palm prune (critic 592 fallout of af385087, to 595): re-run the outline + 1 m prune on the tapered stations — ours: map_pirate_top.png

## Attempts (iter | gap | criterion | verdict)
592 | [S] spit tapers to rounded points (stations -61..61) af385087 | b3 | APPROVE, struck b3 (critic b PASS); CONFIRM failed a, b (new lists)
587 | [S] standable decks 22ba62eb; hourglass bared 4ace43d4 | b5, b3 | APPROVE, struck b5
576-586 | [S] galleons (rebuilt 586), lagoon, sand island, bell mountain, beach, gangplanks, shore, sky, golden sand | a, b | struck a1-a6, b1, b2, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain (34,38) r 10.5. Decks y 3.6, rails split at plank mouths. Spit stations in hourglassBeach.
- A 2nd CONFIRM fail on a or b makes it plateau. Moving ships per team also moves the stage armies' decks (b2).
