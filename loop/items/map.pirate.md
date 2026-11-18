# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (578: struck 3): 1. galleons in map_pirate_island — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 2. back mountain in map_pirate_island — TABS: a grassy rock mountain with palms, a waterfall and a hanging bell behind the beach (ref: card Overview; reference/maps/wiki/pirate.png) 4. sky in map_pirate_island — TABS: bright sky-blue haze with no grey mountain range (ref: reference/maps/pirate_beach.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png) 6. rock wall in map_pirate_top — TABS: no grey boulder chain along the front shore (ref: reference/maps/pirate_beach.png)
b FAIL (582: no strike): 2. gangplanks in map_pirate_top — TABS: three or four gangplanks run from each ship's deck down to the sand (ref: reference/maps/wiki/pirate.png) 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (582 judge)

## Ranked gaps
1. [S] a rear mountain — blocker 2: grassy palm-covered rock outcrop with waterfall and hanging bell — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png
2. [S] b exposed sand-spit boundary — blocker 3: remove the outer apron and make shore/dressing follow one hourglass boundary — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png
3. [S] b usable ship decks — blocker 5: standable artillery decks and matching draw height — ref: reference/stages/pirate.x_marks_the_spot.png — ours: map_pirate_battle.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] beach ca76875d, 013ff74f (starvation) | b3 | APPROVE, no strike (attempt 1)
576 | [S] galleons 40a26f12 | b | APPROVE, struck b1
577 | [S] lagoon drained 6141b061 | b | APPROVE, struck b4
577 | [P] stern timber d682afff | a | REJECT, reverted (cream sterns)
578 | [S] sand island bf7c4fb1, f692a7c9 | a | APPROVE, struck a3

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover stern tops; change did not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). a1 uses island shot since 577.
- 582: inset concave shore visible, but continuous palm-lined outer apron masks full hourglass. a starves at 583.
- Earlier: thin sand drum, floating blue panel at right; sterns need thin gold rims and a dark top; old lagoon foam remains.
