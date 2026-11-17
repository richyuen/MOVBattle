# map.ancient_2
Status: open   Audited: 562 (AUDIT x2), 574 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 574; CONFIRM failed 1x): 1. Flat beige/tan sky behind the island in map_ancient_2_island — TABS: pale blue sky with white puffy clouds (ref: reference/maps/greek_ancient_2.png) 2. Grey low-poly mountain range rising behind the temple complex in map_ancient_2_island — TABS: no mountains, the complex itself is the only mass against open sky (ref: reference/maps/greek_ancient_2.png) 3. Temple complex as two low terraces of identical small temples in an even grid in map_ancient_2_island — TABS: a tall, dense, tangled mound of temples, stairs, columns and overgrown green-topped terraces climbing to a crowning temple, the highest thing on the island (ref: reference/maps/wiki/ancient_2.png) 4. Saturated lime grass in map_ancient_2_ground — TABS: muted olive/yellow-green meadow (ref: reference/stages/renaissance.renaissance_vs_ancient_2.png)
b PASS (574: struck 1, 4; CONFIRM 574)
c PASS (574 judge)

## Ranked gaps
1. [S] a — sky — blocker 1: clear mid-blue sky and pale haze (as ancient_1/ancient_sandbox clearSky) — ref: reference/maps/greek_ancient_2.png — ours: map_ancient_2_island.png
2. [S] a — mountains — blocker 2: hide the base far range (mountainBase/Cap/Root) — ref: reference/maps/greek_ancient_2.png — ours: map_ancient_2_island.png
3. [S] a — temple mound — blocker 3: taller stepped mound with varied temples and green-topped terraces up to a crowning temple — ref: reference/maps/wiki/ancient_2.png — ours: map_ancient_2_island.png

## Attempts (iter | gap | criterion | verdict)
565-567 | [S] own builder, temples, stair, statues; field cleared; crossing paths | a, b | 3 APPROVE struck a2, b2, b3, b5
570-572 | [S] circular outline (18a7b03b); lawn (b70ca30a); ring wall (ed751363) | a, b | 3 APPROVE, struck a1, a3
573 | [S] world-space remap (f5374621) | b | dropped (GPU kept the old buffer)
573 | [S] earth drum (cc91f4d4); gate pavilions (0f5ada56) | a | 2 APPROVE, struck a4, a5 (a PASS)
574 | [S] floor trim re-uploaded, lawn out of glow (4f1be279+bff14f83) | b | APPROVE, struck b1
574 | [S] open front propylon (15c6c224) | b | APPROVE, struck b4 (b PASS); CONFIRM passed b, failed a

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it: challenge.zeus, renaissance.renaissance_vs_ancient_2 (team 1 at x 29..37, |z| <= 18; the complex starts at z 24).
- Critic 574: zone overlay rectangles stick out past the disc in top/island; gate plaster near white. Critic 572: wall plain.
