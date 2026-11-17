# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 576): 1. galleons in map_pirate_ground — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 2. back mountain in map_pirate_island — TABS: a grassy rock mountain with palms, a waterfall and a hanging bell behind the beach (ref: card Overview; reference/maps/wiki/pirate.png) 3. island base in map_pirate_island — TABS: a sandy disc set in a turquoise shallow sea ring, not a stalactite slab (ref: reference/maps/pirate_beach.png) 4. sky in map_pirate_island — TABS: bright sky-blue haze with no grey mountain range (ref: reference/maps/pirate_beach.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png) 6. rock wall in map_pirate_top — TABS: no grey boulder chain along the front shore (ref: reference/maps/pirate_beach.png)
b FAIL (576: struck 1): 2. gangplanks in map_pirate_top — TABS: three or four gangplanks run from each ship's deck down to the sand (ref: reference/maps/wiki/pirate.png) 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 4. front lagoon in map_pirate_top — TABS: no water band across the front of the field (ref: reference/maps/pirate_beach.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (576 judge)

## Ranked gaps
1. [S] b no lagoon — blocker 4: drop the base's z +-24 water bands so the gangplanks land on the sand — ref: reference/maps/pirate_beach.png — ours: map_pirate_top.png
2. [P] a stern castles (fallout of 40a26f12): stern material cream to dark brown (0.36,0.22,0.12), gold trim kept; shows in map_pirate_island.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] galleons moored broadside along the long sides, gangplanks, cannons (40a26f12) | b | APPROVE, struck b1

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, pirate.a_rival_captain, spooky.plunder (enemies x 29..41.4, |z| <= 9.9). Base zones x +-(27..61) |z| <= 17 plus x +-(10..26) |z| 19..29; water hazards z +-24, |x| <= 22.
- Critic 576: ships out of frame in map_pirate_ground (judge a1 in _island); front galleon sits on the rim rocks, not afloat.
