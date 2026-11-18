# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (584: struck 2): 1. galleons in map_pirate_island — TABS: large brown-and-gold galleons with tiered sterns, rigged masts and long white furled sails, not black boxes with square sails (ref: reference/maps/wiki/pirate.png) 4. sky in map_pirate_island — TABS: bright sky-blue haze with no grey mountain range (ref: reference/maps/pirate_beach.png) 5. sand colour in map_pirate_ground — TABS: warm golden sand with wave ripples, not pale pink-white (ref: reference/maps/wiki/pirate.png) 6. rock wall in map_pirate_top — TABS: no grey boulder chain along the front shore (ref: reference/maps/pirate_beach.png)
b FAIL (582: no strike): 2. gangplanks in map_pirate_top — TABS: three or four gangplanks run from each ship's deck down to the sand (ref: reference/maps/wiki/pirate.png) 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png) 5. ship decks in map_pirate_battle — TABS: the decks are standable fighting ground with cannon batteries (ref: card Overview; reference/stages/pirate.x_marks_the_spot.png)
c PASS (584 judge)

## Ranked gaps
1. [S] a grey mountain range in the sky — blocker 4: hide the range, sky-blue haze — ref: reference/maps/pirate_beach.png — ours: map_pirate_island.png
2. [S] a grey boulder chain on the front shore — blocker 6: remove the chain and its colliders, leave scattered palms and crates — ref: reference/maps/pirate_beach.png — ours: map_pirate_top.png
3. [S] a box-hull ships — blocker 1: galleon builder with curved brown-and-gold hull, tiered stern, rigged masts, long white furled sails — ref: reference/maps/wiki/pirate.png — ours: map_pirate_island.png

## Attempts (iter | gap | criterion | verdict)
584 | [S] bell mountain re-sited to (34,38) 5395195a | a2 | APPROVE, struck a2
583 | [S] bell mountain 1bac6c2d, 36dabe6f (starvation) | a2 | APPROVE, no strike
582 | [S] beach ca76875d, 013ff74f (starvation) | b3 | APPROVE, no strike (attempt 1)
576-578 | [S] galleons, lagoon drained, sand island; [P] stern (rejected) | a, b | 3 APPROVE, struck b1, b4, a3

## Rejected (last 4)
577 | [P] stern material (0.2,0.11,0.055) | attempts 1 | full-width gold cap slabs cover stern tops; change did not show

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain at (34,38), collider r 10.5.
- 584 critic: a translucent blue slab stands off the right rim in the island and top shots (the base's waterfall prop at (58,0)?): find and remove it. Fall reads as a haze; the bell stands above the summit like a tower.
- b's last attempt 582: starving at 587.
