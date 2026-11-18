# map.bridge
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (588: struck 1, 2, 4): 3. Grey sky band in map_bridge_island — TABS: pale cyan haze all round (ref: wiki/bridge.png, stages/simulation.bridge_battle.thumb.png)
b FAIL (588: struck 1, 3): 2. No bridge in map_bridge_top — TABS: a long track about 5 units wide and 53 long linking the two blocks (ref: card Layout, wiki/bridge.png)
c PASS (588 judge)

## Ranked gaps
1. [S] b bridge length — blocker 2: re-proportion the blocks to x 18..40 (army at x 20-27.2, |z| <= 22) so the 36 m span reads longer than a block — ref: reference/maps/wiki/bridge.png — ours: map_bridge_top.png
2. [P] a sky hue — blocker 3, fallout of fdee4e69 (588; eligible to 591): simKit.ts paleSky default haze (.86,.9,.9) -> (.78,.9,.92), span .57 -> .15 (moves corridor, low_ground and hill skies too) — ours: map_bridge_island.png

## Attempts (iter | gap | criterion | verdict)
588 | [S] two grid blocks + 5 m bridge, void round (bridge.ts) fded3015 | b1 | APPROVE, struck b1, b3 (CLOSER also named b2's width cleared; length stands)
588 | [S] pale sky fdee4e69 | a3 | APPROVE, no strike (a1, a2, a4 struck by fded3015)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/bridge.ts on tabs/simKit.ts: blocks x +-18..64 |z|<=25, span |x|<18 |z|<=2.5, 400 m deep; void box hazards x +-90 z +-60. Stage: simulation.bridge_battle (x 20..27.2).
