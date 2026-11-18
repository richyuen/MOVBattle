# map.simulation
Status: open   Audited: 587 (AUDIT x2), 588 (CONFIRM: passed a, b)   Done: -
## Verdicts
a FAIL (587: struck 1, 2, 4, 5; CONFIRM 588 passed a, critic 588/590 FAIL): 3. Flat grey sky band above a beige horizon in map_simulation_island — TABS: pale cyan-blue sky fading to white haze at the horizon (ref: wiki/simulation.png)
b PASS (587 AUDIT x2; CONFIRM 588)
c PASS (590 judge)

## Ranked gaps
1. [S] a sky — blocker 3: simulation.ts paleSky sphere out of image processing (it is already unlit, fog-free, out of the glow; ACES turns (.68,.9,1) into muted grey-teal) — ref: wiki/simulation.png — ours: map_simulation_island.png, map_simulation_ground.png

## Attempts (iter | gap | criterion | verdict)
590 | [P] haze (.74,.93,.97), span .15, blue (.68,.9,1) c576c21c + 519e11df | a3 | APPROVE, no strike (attempt 2 on the row; numbers exhausted: next is [S])
588 | [P] sky blue (.62,.86,.93) span .4 a7eceb90 | a3 | REJECT, reverted (paler, not cyan)
587 | [S] grid floor b23e942c; empty centre 9fed27e5 (+40c4de96); pale sky bafe8f20 | a1, a2, a3 | APPROVE, struck a1, a4, a2, a5

## Rejected (last 4)
588 | [P] a3 a7eceb90 | attempts 1 | lighter, not more cyan; the island camera sees only the horizon haze

## Notes (max 3 lines)
- Builder tabs/simulation.ts dresses this map only; the other sim-family maps use tabs/simKit.ts, whose paleSky haze/span now match (blue differs: kit .38,.68,.76).
- A CONFIRM passed a and b (588): the next CONFIRM names them confirmed; the critic must pass a3 first.
- Critic 587 minor: the red line steps in width at y~700 in map_simulation_island.
