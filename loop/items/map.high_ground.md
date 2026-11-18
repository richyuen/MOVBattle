# map.high_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No ramp in map_high_ground_island — TABS: a long grid-lined ramp climbing to a high platform with a sheer grey side (ref: reference/maps/wiki/high_ground.png) 2. No gateway walls in map_high_ground_ground — TABS: two block walls on the platform joined by a bar into a gate arch (ref: wiki/high_ground.png, stages/simulation.catapult_castle.png) 3. No grid lines in map_high_ground_ground — TABS: grid on every face (ref: wiki/high_ground.png) 4. Grey sky band in map_high_ground_island — TABS: blue sky with soft white clouds (ref: wiki/high_ground.png)
b FAIL (0 since 587): 1. No elevated team-1 platform in map_high_ground_top — TABS: the defenders' half is a raised platform reached by the ramp (ref: card Overview) 2. Placement only on the flat ground in map_high_ground_battle — TABS: catapults stand on the wall tops and archers on the bar (ref: wiki/high_ground.png) 3. No small ramps up to the walls in map_high_ground_top — TABS: two ramps lead from the platform onto the walls (ref: card Overview)
c PASS (587 judge)

## Ranked gaps
1. [S] b platform builder — blocker 1: new web/src/map/tabs/high_ground.ts: low flat, long ramp, high team-1 platform (drawn height) — ref: reference/maps/wiki/high_ground.png — ours: map_high_ground_island.png
2. [S] a gate walls — blocker 2: two block walls joined by a bar on the platform, small ramps onto them — ref: wiki/high_ground.png — ours: map_high_ground_ground.png
3. [S] a grid and sky — blockers 3, 4: simulation.ts's grid floor and pale sky — ref: wiki/high_ground.png — ours: map_high_ground_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Renders the bare campaign.simulation plane (no builder). Stage: simulation.catapult_castle (close-ups only).
