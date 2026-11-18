# map.bridge
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 3): 5. Dark teal band across the upper sky in map_bridge_ground — TABS: light sky blue fading into pale haze (ref: stages/simulation.pit.png)
b PASS (589: struck 2; CONFIRM pending)
c PASS (589 judge)

## Ranked gaps
1. [P] a sky hue — blocker 5, fallout of fdee4e69 (588; eligible to 591): simKit.ts paleSky blue (.38,.68,.76) -> (.55,.78,.92), span .15 kept (one change for every kit map) — ref: stages/simulation.pit.png — ours: map_*_ground top third
2. [P] b square pillars (non-blocking, fallout of 07d52058, to 592): bridge.ts BLOCK |z| 23 -> 11 (stage army |z| <= 22 must move first: stage batch) — ours: map_bridge_top.png

## Attempts (iter | gap | criterion | verdict)
589 | [S] blocks 22 x 46 m 07d52058 | b2 | APPROVE, struck b2 (b PASS)
589 | [P] kit haze (.74,.93,.97) span .15 8d4fd3bc | a3 | APPROVE, struck a3; added a5 (teal zenith)
588 | [S] two grid blocks + 5 m bridge, void round (bridge.ts) fded3015 | b1 | APPROVE, struck b1, b3
588 | [S] pale sky fdee4e69 | a3 | APPROVE, no strike (a1, a2, a4 struck by fded3015)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/bridge.ts on simKit: blocks x +-18..40 |z|<=23, span |x|<18 |z|<=2.5, 400 m deep; void x +-90 z +-60. Stage: simulation.bridge_battle (x 20..27.2, |z|<=22).
- 589 early CONFIRM (unused, a open) would fail b: blocks twice as wide as deep, span shorter than a block's long side (H, not dumbbell); the CONFIRM after a5 clears needs square pillars. output/loop/iter-589/confirm.md.
