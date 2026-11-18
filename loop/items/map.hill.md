# map.hill
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No grid lines on the ramp in map_hill_ground — TABS: grid lines over the ramp and the flat, with brighter bands across the slope (ref: reference/maps/wiki/hill.png) 2. Lilac ramp top and dark-purple side face in map_hill_island — TABS: warm off-white top with a cool grey-blue gridded side face (ref: wiki/hill.png right) 3. Grey sky band in map_hill_island — TABS: pale-blue sky with large soft white clouds (ref: wiki/hill.png)
b FAIL (0 since 587): 1. Left half on an endless plane in map_hill_island — TABS: the low flat is part of one block that ends in a sheer drop to the void (ref: wiki/hill.png, stages/simulation.hill.png) 2. Long flat plateau holding the whole right half in map_hill_top — TABS: the slope rises to a crest at the middle where team 1 stands on the edge (ref: card Overview, stages/simulation.hill.thumb.png) 3. the far-side descent from the crest down to team 1's low flat is missing in map_hill_island (ours stays high to x 62) — TABS: the ridge falls again past the crest (ref: wiki/hill.png; card Overview)
c PASS (587 judge)

## Ranked gaps
1. [S] b crest — blockers 2, 3: replace rampAlongX's long flat top in tabs/hill.ts with a ridge: up from team 0's flat to a crest near mid-field, down to team 1's flat — ref: reference/stages/simulation.hill.png — ours: map_hill_top.png
2. [S] b bounded block — blocker 1: hide the endless plane round the hill, sheer grey grid side faces into the haze (team 1 zone runs to x 75, ramp ends at x 62: check) — ref: wiki/hill.png — ours: map_hill_island.png
3. [S] a grid, side face and sky — blockers 1-3: simulation.ts's grid floor and pale sky — ref: wiki/hill.png — ours: map_hill_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/hill.ts (one rampAlongX -8..30, top 8). Stage: simulation.hill.
