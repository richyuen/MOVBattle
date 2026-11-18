# map.bridge
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No tall pillars in map_bridge_island — TABS: two tall grid-lined square block columns dropping far into the haze (ref: reference/maps/wiki/bridge.png) 2. No grid lines in map_bridge_ground — TABS: grid on every block face (ref: wiki/bridge.png) 3. Grey sky band in map_bridge_island — TABS: pale cyan haze all round (ref: wiki/bridge.png, stages/simulation.bridge_battle.thumb.png) 4. Grey disc at centre in map_bridge_top — TABS: the middle is the narrow bridge over the void (ref: wiki/bridge.png)
b FAIL (0 since 587): 1. Endless plane under both halves in map_bridge_top — TABS: one square block per team (ref: wiki/bridge.png) 2. No bridge in map_bridge_top — TABS: a long track about 5 units wide and 53 long linking the two blocks (ref: card Layout, wiki/bridge.png) 3. No drop-off in map_bridge_battle — TABS: void around both blocks and along both sides of the bridge (ref: stages/simulation.bridge_battle.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b bridge builder — blocker 1: new web/src/map/tabs/bridge.ts: two tall square grid blocks (one per team zone), a 5 m x ~53 m bridge between them, void hazard everywhere else (check simulation.bridge_battle's enemy positions stay on a block) — ref: reference/maps/wiki/bridge.png — ours: map_bridge_top.png
2. [S] a grid and sky — blockers 2, 3: reuse simulation.ts's grid floor and pale sky (export them) — ref: wiki/bridge.png — ours: map_bridge_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Renders the bare campaign.simulation plane (no builder). Stage: simulation.bridge_battle.
