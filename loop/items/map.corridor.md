# map.corridor
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No tall block mass in map_corridor_island — TABS: a cross of tall grid-lined block columns standing out of the haze (ref: reference/maps/wiki/corridor.png) 2. No central wall block in map_corridor_ground — TABS: a thick wall block across the middle, taller than the team pads (ref: wiki/corridor.png, stages/simulation.wall.png) 3. No grid lines in map_corridor_ground — TABS: grid on every face (ref: wiki/corridor.png) 4. Grey sky band in map_corridor_island — TABS: pale cyan haze (ref: wiki/corridor.png)
b FAIL (0 since 587): 1. Endless plane in map_corridor_top — TABS: a lower square pad for each team (ref: wiki/corridor.png) 2. No wall splitting the halves in map_corridor_top — TABS: a wall block runs across the field between the pads (ref: stages/simulation.wall.thumb.png) 3. No corridor in map_corridor_battle — TABS: a narrow slot a few units wide cut through the wall, where the armies meet (ref: wiki/corridor.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b corridor builder — blocker 2: new web/src/map/tabs/corridor.ts: two lower team pads, a thick taller wall block across the middle with a narrow slot cut through it (wall faces as colliders, wall height drawn) — ref: reference/maps/wiki/corridor.png — ours: map_corridor_top.png
2. [S] a grid and sky — blockers 3, 4: simulation.ts's grid floor and pale sky — ref: wiki/corridor.png — ours: map_corridor_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Renders the bare campaign.simulation plane (no builder). Stage: simulation.wall.
