# map.low_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 4): 5. Dark teal band across the upper sky in map_low_ground_ground — TABS: light sky blue fading into pale haze (ref: stages/simulation.pit.png)
b PASS (588: struck 1, 2, 3; CONFIRM pending)
c PASS (589 judge)

## Ranked gaps
1. [P] a sky hue — blocker 5, fallout of 98ebf959 (588; eligible to 591): simKit.ts paleSky blue (.38,.68,.76) -> (.55,.78,.92) (see map.bridge) — ours: map_low_ground_ground.png top third
2. [S] b bank shading — fallout of ae6ad36b (critic 588): the left bank reads like the floor in map_low_ground_top; darker bank facets so both slopes read (589 CONFIRM: the right bank reads lavender-blue, TABS both banks warm beige, only darker)

## Attempts (iter | gap | criterion | verdict)
589 | [P] kit haze (.74,.93,.97) span .15 8d4fd3bc (via map.bridge) | a4 | APPROVE, struck a4; added a5 (teal zenith)
588 | [S] bounded grid slab with trough (low_ground.ts) ae6ad36b | b1 | APPROVE, struck b1, b2, b3 (b PASS)
588 | [S] pale sky 98ebf959 | a4 | APPROVE, no strike (a1-a3 struck by ae6ad36b)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/low_ground.ts: slab x +-60 |z|<=22, floor |x|<=10 at 0, banks to 7 m at |x| 20, 400 m skirt (culled grid material). Stage: simulation.pit (x 20..27.4).
- 589 early CONFIRM (unused, a open) passed b, failed a: teal zenith, and the right bank lavender-blue in map_low_ground_top (output/loop/iter-589/confirm.md). Once a5 clears: CONFIRM.
