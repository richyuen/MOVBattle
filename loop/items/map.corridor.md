# map.corridor
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 4): 5. Dark teal band across the upper sky in map_corridor_ground — TABS: light sky blue fading into pale haze (ref: stages/simulation.pit.png)
b PASS (588: struck 1, 2, 3; CONFIRM pending)
c PASS (589 judge)

## Ranked gaps
1. [P] a sky hue — blocker 5, fallout of 5e870bb6 (588; eligible to 591): simKit.ts paleSky blue (.38,.68,.76) -> (.55,.78,.92), span .15 kept (one change for every kit map; see map.bridge) — ours: map_corridor_ground.png top third
2. [P] b wall height — fallout of c20c50bb (588, to 591): corridor.ts WALL_H 7 -> 10, shows in map_corridor_top as a step at the wall's edges

## Attempts (iter | gap | criterion | verdict)
589 | [P] kit haze (.74,.93,.97) span .15 8d4fd3bc (via map.bridge) | a4 | APPROVE, struck a4; added a5 (teal zenith)
588 | [S] pads, wall, 4 m slot, void (corridor.ts) c20c50bb | b2 | APPROVE, struck b1, b2, b3 (b PASS)
588 | [S] pale sky 5e870bb6 | a4 | APPROVE, no strike (a1-a3 struck by c20c50bb)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/corridor.ts on simKit: pads x +-8..38 |z|<=15, wall |x|<=8 |z|<=26 top 7 m (two box colliders), slot |z|<=2. Stage: simulation.wall (x 20..26.6).
- 589 early CONFIRM (unused, a open) passed b and failed a on the teal zenith only (output/loop/iter-589/confirm.md). Once a5 clears: CONFIRM.
