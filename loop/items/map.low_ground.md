# map.low_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No dip in map_low_ground_island — TABS: the gridded field drops into a lower middle floor between sloped banks (ref: reference/maps/wiki/low_ground.png) 2. No slab side faces in map_low_ground_island — TABS: the field is a block with tall grey-blue shaded side faces dropping into the haze (ref: wiki/low_ground.png left) 3. No grid lines in map_low_ground_ground — TABS: grid on every face (ref: wiki/low_ground.png) 4. Grey sky band in map_low_ground_island — TABS: pale cyan haze (ref: wiki/low_ground.png)
b FAIL (0 since 587): 1. Flat middle in map_low_ground_top — TABS: a sunken central floor between the halves (ref: card Overview, wiki/low_ground.png) 2. No raised end at either side in map_low_ground_battle — TABS: each half has a high flat at its end above a slope (ref: stages/simulation.pit.png) 3. Endless plane in map_low_ground_top — TABS: a field of fixed width ending in sheer edges (ref: wiki/low_ground.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b trough builder — blocker 1: new web/src/map/tabs/low_ground.ts: terrainMesh height high-flat, slope down, low floor, slope up, high-flat along x — ref: reference/maps/wiki/low_ground.png — ours: map_low_ground_top.png
2. [S] b bounded slab — blocker 3: fixed-width strip with sheer grey grid side faces, void beyond — ref: wiki/low_ground.png — ours: map_low_ground_top.png
3. [S] a grid and sky — blockers 3, 4: simulation.ts's grid floor and pale sky — ref: wiki/low_ground.png — ours: map_low_ground_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Renders the bare campaign.simulation plane (no builder). Stage: simulation.pit.
