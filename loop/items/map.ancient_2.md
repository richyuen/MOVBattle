# map.ancient_2
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a PASS (573: struck 4, 5; pending CONFIRM)
b FAIL (567: struck 3): 1. Island outline in map_ancient_2_top is a rounded rectangle — TABS: circular disc (ref: reference/maps/wiki/ancient_2.png) 4. Front gate pavilion on the centre line absent in map_ancient_2_island — TABS: columned gate at the front wall (ref: reference/maps/greek_ancient_2.png)
c PASS (573 judge)

## Ranked gaps
1. [S] b — green apron past the wall — blocker 1: grass top and slabs trimmed to the 51 m wall circle (find the mesh that projects first; the 573 world-space remap of ground/islandShelf changed nothing) — ref: reference/maps/wiki/ancient_2.png — ours: map_ancient_2_top.png
2. [S] b — open front gate — blocker 4: open columned propylon at the 250-degree path end, the path running through it — ref: reference/maps/greek_ancient_2.png — ours: map_ancient_2_island.png

## Attempts (iter | gap | criterion | verdict)
565-567 | [S] own builder, temples, stair, statues; field cleared; crossing paths | a, b | 3 APPROVE struck a2, b2, b3, b5
570 | [S] circular temple island outline (18a7b03b) | b | APPROVE
571 | [S] green lawn with clumps and pink-violet flower drifts (b70ca30a) | a | APPROVE, struck a1
572 | [S] low beige plastered ring wall with cypress clusters (ed751363) | a | APPROVE, struck a3
573 | [S] world-space remap of the top onto the 51 m circle (f5374621) | b | dropped (shelf unchanged in the shots; reverted 8231cf32)
573 | [S] brown earth drum with grey stones (cc91f4d4); gate pavilions at the path ends (0f5ada56) | a | 2 APPROVE, struck a4, a5 (a PASS)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it: challenge.zeus, renaissance.renaissance_vs_ancient_2 (team 1 at x 29..37, |z| <= 18; the complex starts at z 24).
- Critic 573: front gate a solid gabled box the path stops at. Critic 572: wall plain, TABS has darker panel inlays. Critic 571: lawn paler lime than TABS olive.
