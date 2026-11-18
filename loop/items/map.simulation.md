# map.simulation
Status: open   Audited: 587 (AUDIT x2), 588 (CONFIRM: passed a, b)   Done: -
## Verdicts
a FAIL (587: struck 1, 2, 4, 5; CONFIRM 588 passed a, critic 588 FAIL): 3. Flat grey sky band above a beige horizon in map_simulation_island — TABS: pale cyan-blue sky fading to white haze at the horizon (ref: wiki/simulation.png)
b PASS (587 AUDIT x2; CONFIRM 588)
c PASS (588 judge)

## Ranked gaps
1. [P] a sky hue — blocker 3, fallout of bafe8f20 (587; eligible to 590): paleSky haze (.86,.9,.9) -> (.78,.9,.92), span .57 -> .15 (attempt 2 on the row; a second reject spends it) — ref: reference/maps/wiki/simulation.png — ours: map_simulation_island.png (top band y 0-80)

## Attempts (iter | gap | criterion | verdict)
588 | [P] sky blue (.62,.86,.93) span .4 a7eceb90 | a3 | REJECT, reverted (paler, not cyan; island shot sees only the haze) (attempt 1 on the row)
587 | [S] grid floor b23e942c | a1 | APPROVE, struck a1, a4
587 | [S] empty centre 9fed27e5 (+40c4de96: the disc is the base's void hazard) | a2 | APPROVE, struck a2
587 | [S] pale sky bafe8f20 | a3 | APPROVE, struck a5 (hue left on a3)

## Rejected (last 4)
588 | [P] a3 a7eceb90 | attempts 1 | lighter, not more cyan; the island camera sees only the horizon haze

## Notes (max 3 lines)
- Builder tabs/simulation.ts dresses this map only; the other sim-family maps use tabs/simKit.ts (588), whose paleSky defaults equal simulation.ts's.
- A CONFIRM passed a and b (588): the next CONFIRM names them confirmed; the critic must pass a3 first.
- Critic 587 minor: the red line steps in width at y~700 in map_simulation_island.
