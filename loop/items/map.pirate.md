# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (585: struck 4, 6): 1. galleons in map_pirate_island — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png)
b FAIL (585: struck 2): 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (585 judge)

## Ranked gaps
1. [S] a galleons — blocker 1: galleon rebuild (brown hull with gold trim, tiered stern castle, rigged masts, long white furled sails) — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png
2. [S] a sand colour — blocker 5: golden sand material with drawn wave-ripple strips — ref: reference/maps/wiki/pirate.png — ours: map_pirate_ground.png
3. [S] b ship decks — blocker 5: standable deck platform with cannon batteries, zone reach onto it, collider swapped for deck edges — ref: reference/stages/pirate.x_marks_the_spot.png — ours: map_pirate_battle.png

## Attempts (iter | gap | criterion | verdict)
585 | [S] gangplanks 07e0b708 | b2 | APPROVE, struck b2
585 | [S] open shore 26b8a6d7; tropic sky 8f023e21 | a6, a4 | 2 APPROVE, struck a6, a4
584 | [S] bell mountain re-sited to (34,38) 5395195a | a2 | APPROVE, struck a2
583 | [S] bell mountain 1bac6c2d, 36dabe6f (starvation) | a2 | APPROVE, no strike
582 | [S] beach ca76875d, 013ff74f (starvation) | b3 | APPROVE, no strike (attempt 1)
576-578 | [S] galleons, lagoon drained, sand island; [P] stern (rejected) | a, b | 3 APPROVE, struck b1, b4, a3

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover stern tops; change did not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain at (34,38), collider r 10.5.
- A translucent blue slab still floats off the right rim (x ~58-60: the base's waterfall prop at (58,0)?): find and remove. Gangplanks take the cream deck material (read as ladders): a [P] darker plank is eligible fallout of 07e0b708.
- Crates at the shore are too small to read from the top shot.
