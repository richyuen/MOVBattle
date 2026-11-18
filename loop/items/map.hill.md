# map.hill
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 1 on the re-aimed ground shot): 3. Grey sky band in map_hill_island — TABS: pale-blue sky with large soft white clouds (ref: wiki/hill.png) 4. Dark teal band across the upper sky in map_hill_ground — TABS: light sky blue with white clouds (ref: wiki/hill.png)
b PASS (589: struck 1)
c PASS (589 judge)

## Ranked gaps
1. [S] a cloud banks that render — blocker 3: simKit cloudBanks at z 180-250, y 40-80 (inside the camera's far clip), disposed in the map's dispose — ref: wiki/hill.png — ours: map_hill_island.png
2. [P] a sky hue — blocker 4 (kit paleSky blue, see map.bridge) — ours: map_hill_ground.png top third
3. [S] a slope bands (critic NEXT, not a blocker): brighter 5 m bands across the ramp through a hill-only grid material — ours: map_hill_ground.png

## Attempts (iter | gap | criterion | verdict)
589 | [E] ground shot re-aimed 00cf09ce + cc5ef659 (low from the left flat's corner up the ramp) | a1 | re-audit struck a1
589 | [S] bounded block, void round, zones (hill.ts) 90341a4e | b1 | APPROVE, struck b1 (b PASS)
589 | [S] cloud banks z 450-540 de48f83f | a3 | REJECT, reverted 5093c46c (attempt 1 on a3)
588 | [S] crest ec25b08c; grid ridge + pale sky 1eb72e07 (+cfd5d291) | b2, a1 | APPROVE, struck b2, b3, a2

## Rejected (last 4)
589 | [S] a3 de48f83f | attempts 1 | clouds never rendered (past the camera's far clip, z 450-540); not disposed with the map

## Notes (max 3 lines)
- Builder tabs/hill.ts: sheet x -60..76 |z|<=28 (foot -24, 10 m at 22, crest to 28, 4 m flat from 40), 400 m skirt, void x -90..100 z +-60; zones x<-1 / x>1. Stage: simulation.hill (x 20..25.9).
- map_hill_ground pose: capture-world.mjs POSE_OVERRIDE (target (12,6,0), radius 64, alpha -2.8, beta 1.4).
