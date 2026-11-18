# map.corridor
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (588: struck 1, 2, 3): 4. Grey sky band in map_corridor_island — TABS: pale cyan haze (ref: wiki/corridor.png)
b PASS (588: struck 1, 2, 3; CONFIRM pending)
c PASS (588 judge)

## Ranked gaps
1. [P] a sky hue — blocker 4, fallout of 5e870bb6 (588; eligible to 591): simKit.ts paleSky haze (.86,.9,.9) -> (.78,.9,.92), span .57 -> .15 (one change for every kit map; see map.bridge) — ours: map_corridor_island.png
2. [P] b wall height — fallout of c20c50bb (588): corridor.ts WALL_H 7 -> 10, shows in map_corridor_top as a step at the wall's edges

## Attempts (iter | gap | criterion | verdict)
588 | [S] pads, wall, 4 m slot, void (corridor.ts) c20c50bb | b2 | APPROVE, struck b1, b2, b3 (b PASS)
588 | [S] pale sky 5e870bb6 | a4 | APPROVE, no strike (a1-a3 struck by c20c50bb)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/corridor.ts on simKit: pads x +-8..38 |z|<=15, wall |x|<=8 |z|<=26 top 7 m (two box colliders), slot |z|<=2. Stage: simulation.wall (x 20..26.6).
- Once a4 clears: CONFIRM (a and b).
