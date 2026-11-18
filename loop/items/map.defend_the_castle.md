# map.defend_the_castle
Status: open   Audited: 587 (AUDIT x2), 591 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 591, CONFIRM list; critic 591 struck a5): 1. merlon rows (square crenellations) along every castle wall top in map_defend_the_castle_ground.png and _island.png — TABS: the castle walls are thick plain grey-box blocks with flat tops and stepped notches, no crenellations anywhere (ref: reference/maps/wiki/defend_the_castle.png, reference/stages/simulation.siege.thumb.png)
b FAIL (0 since 591, CONFIRM list; critic 591 struck b3): 1. the three approach paths in map_defend_the_castle_top.png are flat strips divided only by narrow step faces on one slab top — TABS: three separate ramps climb to the castle plateau as ridges with wide, deep V-shaped chasms between them dropping into the fog (ref: reference/maps/wiki/defend_the_castle.png, card Overview "three platforms and paths that lead up to the castle")
c PASS (591 judge)

## Ranked gaps
1. [S] b chasms — blocker 1: wide V chasms (8-12 m at the top, narrowing as they drop) between the three ramps and front platforms, dark faces in the fog; the drop must read from the top shot (castleHeight lanes widened, V profile) — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_top.png
2. [S] a plain walls — blocker 1: merlons removed; wall tops flat with stepped notches as the wiki's courtyard blocks — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_ground.png

## Attempts (iter | gap | criterion | verdict)
591 | [S] front platforms: gaps |z| 8..14 and 26..30 to x -60, three team-0 zones e417622a | b3 | APPROVE, struck b3 (critic b PASS); CONFIRM failed a, b
591 | [S] kit sky untoned eadae3e9 (via map.hill) | a5 | APPROVE, struck a5
590 | [S] three 12 m ramps split by 40 m chasms 5f1ae860 | b2 | APPROVE, struck b2
589 | [S] castle block f2467ab3; archer pillars 57155431 | b1, a2 | APPROVE, struck b1, b4, a1-a3

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/defend_the_castle.ts on simKit: sheet x -60..64 |z|<=30; chasms on the approach |z| 6..14, 26..30; front gaps |z| 8..14, 26..30 to x -60. Stages: simulation.siege, legacy.siege.
- A 2nd CONFIRM fail on a or b makes it plateau.
