# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 576): 1. galleons in map_pirate_island — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 2. back mountain in map_pirate_island — TABS: a grassy rock mountain with palms, a waterfall and a hanging bell behind the beach (ref: card Overview; reference/maps/wiki/pirate.png) 3. island base in map_pirate_island — TABS: a sandy disc set in a turquoise shallow sea ring, not a stalactite slab (ref: reference/maps/pirate_beach.png) 4. sky in map_pirate_island — TABS: bright sky-blue haze with no grey mountain range (ref: reference/maps/pirate_beach.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png) 6. rock wall in map_pirate_top — TABS: no grey boulder chain along the front shore (ref: reference/maps/pirate_beach.png)
b FAIL (577: struck 4): 2. gangplanks in map_pirate_top — TABS: three or four gangplanks run from each ship's deck down to the sand (ref: reference/maps/wiki/pirate.png) 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (577 judge)

## Ranked gaps
1. [S] a island base — blocker 3: sandy disc in a turquoise shallow-sea ring instead of the stalactite slab — ref: reference/maps/pirate_beach.png — ours: map_pirate_island.png
2. [S] b beach outline — blocker 3: hourglass sand spit narrowing toward the back mountain — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] galleons moored broadside along the long sides, gangplanks, cannons (40a26f12) | b | APPROVE, struck b1
577 | [S] lagoon drained: z +-24 water hazards and sheets gone (6141b061) | b | APPROVE, struck b4
577 | [P] stern castles dark timber (d682afff) | a | REJECT, reverted (sterns still read cream)

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover the stern tops; the change does not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (enemies x 29..41.4, |z| <= 9.9). a1 re-aimed to map_pirate_island in 577 (ground cannot show the ships).
- Critic 577: thin pale-blue foam lines still trace the old lagoon shores; sterns need thin gold rim strips and a dark top, not a material swap.
