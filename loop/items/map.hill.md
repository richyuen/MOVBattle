# map.hill
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (588: struck 2): 1. No grid lines on the ramp in map_hill_ground — TABS: grid lines over the ramp and the flat, with brighter bands across the slope (ref: reference/maps/wiki/hill.png) 3. Grey sky band in map_hill_island — TABS: pale-blue sky with large soft white clouds (ref: wiki/hill.png)
b FAIL (588: struck 2, 3): 1. Left half on an endless plane in map_hill_island — TABS: the low flat is part of one block that ends in a sheer drop to the void (ref: wiki/hill.png, stages/simulation.hill.png)
c PASS (588 judge)

## Ranked gaps
0. [E] evidence first — a1's shot map_hill_ground shows only the flat (no ramp in frame): re-aim it at the slope in capture-world.mjs before any pick on hill
1. [S] b bounded block — blocker 1: bareField + voidAround round the ridge sheet, 400 m grid skirt (as low_ground.ts); team-1 zone ends at the sheet (x 76) — ref: wiki/hill.png — ours: map_hill_island.png
2. [S] a cross-slope bands — blocker 1: brighter bands across the ramp facets every 5 m of rise — ref: wiki/hill.png — ours: map_hill_ground.png (re-aimed)
3. [S] a clouds — blocker 3: large soft white cloud banks in the pale sky — ref: wiki/hill.png — ours: map_hill_island.png

## Attempts (iter | gap | criterion | verdict)
588 | [S] crest x 22-28, fall to 4 m flat (hill.ts) ec25b08c | b2 | APPROVE, struck b2, b3
588 | [S] grid ridge + plane, pale sky 1eb72e07 (+cfd5d291 lilac disc hidden) | a1 | APPROVE, struck a2 (a1 not judgeable in its shot; sky out of scope)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/hill.ts: foot -24, ramp to 10 m at x 22, crest to 28, down to 4 m at 40, flat to 76; sheet |z|<=28. Stage: simulation.hill (x 20..25.9, on the crest).
