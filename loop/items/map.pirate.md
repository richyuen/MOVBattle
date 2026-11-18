# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (578: struck 3): 1. galleons in map_pirate_island — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 2. back mountain in map_pirate_island — TABS: a grassy rock mountain with palms, a waterfall and a hanging bell behind the beach (ref: card Overview; reference/maps/wiki/pirate.png) 4. sky in map_pirate_island — TABS: bright sky-blue haze with no grey mountain range (ref: reference/maps/pirate_beach.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png) 6. rock wall in map_pirate_top — TABS: no grey boulder chain along the front shore (ref: reference/maps/pirate_beach.png)
b FAIL (582: no strike): 2. gangplanks in map_pirate_top — TABS: three or four gangplanks run from each ship's deck down to the sand (ref: reference/maps/wiki/pirate.png) 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (583 judge)

## Ranked gaps
1. [S] a back mountain — blocker 2: re-site bellMountain inside the sea ring at the island shot's back (far side, beside the far ship's bow), tan rock, grass cap on every upper boulder, opaque white fall, bell 6 m — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png
2. [S] a galleons — blocker 1: curved brown-gold hulls with tiered sterns and furled white sails on yards — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png
3. [S] b gangplanks — blocker 2: three wide plank ramps from each deck to the sand — ref: reference/maps/wiki/pirate.png — ours: map_pirate_top.png

## Attempts (iter | gap | criterion | verdict)
583 | [S] bell mountain 1bac6c2d, 36dabe6f (starvation) | a2 | APPROVE, no strike (attempt 1)
582 | [S] beach ca76875d, 013ff74f (starvation) | b3 | APPROVE, no strike (attempt 1)
576-578 | [S] galleons, lagoon drained, sand island; [P] stern (rejected) | a, b | 3 APPROVE, struck b1, b4, a3

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover stern tops; change did not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain now at (60,0), collider r 10.5.
- 583: mountain reads grey, half off the island at the +x rim, fall a teal haze, bell a tenth of the heap. b's last attempt 582.
