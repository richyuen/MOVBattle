# map.high_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 1, 2, 3): 4. Grey sky band in map_high_ground_island — TABS: blue sky with soft white clouds (ref: wiki/high_ground.png) 5. Dark teal band across the upper sky in map_high_ground_ground — TABS: light sky blue fading into pale haze (ref: wiki/high_ground.png)
b FAIL (589: struck 1): 2. Placement only on the flat ground in map_high_ground_battle — TABS: catapults stand on the wall tops and archers on the bar (ref: wiki/high_ground.png) 3. No small ramps up to the walls in map_high_ground_top — TABS: two ramps lead from the platform onto the walls (ref: card Overview)
c PASS (589 judge)

## Ranked gaps
1. [S] b wall ramps — blocker 3: two 3 m ramps along the walls' outer ends from the platform up to the wall tops — ref: card Overview — ours: map_high_ground_top.png
2. [S] b units on walls and bar — blocker 2: wall tops and bar in highGroundHeight, colliders swapped for edge walls, team-1 zone over them — ref: wiki/high_ground.png — ours: map_high_ground_battle.png
3. [S] a clouds — blocker 4: kit cloud banks once hill's render — ref: wiki/high_ground.png — ours: map_high_ground_island.png
4. [P] a sky hue — blocker 5 (kit paleSky blue, see map.bridge)

## Attempts (iter | gap | criterion | verdict)
589 | [S] flat, ramp, 12 m platform (high_ground.ts) 41f10807 | b1 | APPROVE, struck b1, a1, a3
589 | [S] gate walls + bar 2177a9ad | a2 | APPROVE, struck a2

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts on simKit: sheet x -60..48 |z|<=22, flat to -24, ramp to 12 m at x 10; gate walls x 28..36 |z| 5..20 top +7, bar |z|<=5 from +4.5. Stage: simulation.catapult_castle (9 catapults x 20, |z|<=16).
- Critic 589: gateway sits 18 m back (TABS at the ramp's head), bar flush with the walls (TABS taller).
