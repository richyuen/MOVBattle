# map.spooky_1
Status: open   Audited: 576 (AUDIT x2), 581 (CONFIRM: passed b; failed a), 582 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (plateau; 583: struck 1, 3): 2. Island cliff silhouette in map_spooky_1_island.png — TABS: irregular bulky rock masses form stepped, broken cliff faces and an uneven underside; ours has long repetitive vertical columns forming smooth, regular cliff bands (ref: reference/maps/spooky_1.png). 4. Tussock drifts in stage_spooky.bone_army.png — TABS: the banks carry soft grass tufts, not flat pale hexagonal slabs that read as cobble paving (ref: reference/maps/wiki/spooky_1.png)
b PASS (581: struck 5; CONFIRM 581, copied 582)
c PASS (583 judge)

## Ranked gaps
1. [R] a cliffs and tussocks — blockers 2, 4: rebuild plateau() rock tiers as few large stepped masses (8-14 m) with a projecting lower shelf and depths varying 8 m or more, and duskyMeadow as blade tufts — ref: reference/maps/spooky_1.png — ours: map_spooky_1_island.png

## Attempts (iter | gap | criterion | verdict)
583 | [R] bank rebuild 8094db6e | a1-3 | APPROVE, struck a1, a3; added a4 (R attempt 1)
582 | [S] dusky meadow fe776d2a; crooked trees 1c4f83cd | a | 2 APPROVE; second failed a CONFIRM -> plateau
581 | [S] descent 8b37b4e3, b0f7dd32, 8800d66d | b5 | APPROVE, struck b5; CONFIRM b PASS, a FAIL
576-579 | [S] sky, grass, chasm, trees, graveyard, lanterns (one ramp dropped) | a, b | 7 APPROVE, struck a1-a5, b1-b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stage: spooky.bone (enemies x 20..22.2, |z| <= 9.9). Graveyard x13..31 z13..29. Preserve confirmed b and the descent.
- 583 early CONFIRM unused (not would-be-done); it named one thing: the fog channel is the brightest band in top/ground and washes the cliffs near-white (TABS: ravine darker than the ground). Fold it into the next [R]: darker fog sheets, less cliff glow.
- 582's white trees were an unmerged mesh (16-bit merge overflow), fixed in 8094db6e with 32-bit indices.
