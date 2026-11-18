# map.simulation
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (587: struck 1, 2, 4, 5): 3. Flat grey sky band above a beige horizon in map_simulation_island — TABS: pale cyan-blue sky fading to white haze at the horizon (ref: wiki/simulation.png)
b PASS (587 AUDIT x2)
c PASS (587 judge)

## Ranked gaps
1. [P] a sky hue — blocker 3, fallout of bafe8f20 (587): paleSky blue (.38,.68,.76) -> (.62,.86,.93), smoothstep span .57 -> .4 — ref: reference/maps/wiki/simulation.png — ours: map_simulation_ground.png

## Attempts (iter | gap | criterion | verdict)
587 | [S] grid floor b23e942c | a1 | APPROVE, struck a1, a4
587 | [S] empty centre 9fed27e5 (+40c4de96: the disc is the base's void hazard) | a2 | APPROVE, struck a2
587 | [S] pale sky bafe8f20 | a3 | APPROVE, struck a5 (hue left on a3)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/simulation.ts (587) dresses this map only; bridge, corridor, defend_the_castle, high_ground, low_ground still use the bare base. Export gridFloor/paleSky for them.
- Critic 587 minor: the red line steps in width at y~700 in map_simulation_island.
