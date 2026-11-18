# map.spooky_1
Status: open   Audited: 576 (AUDIT x2), 581 (CONFIRM: passed b; failed a), 582 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (plateau; 0 since 582): 1. Perimeter tree bark in map_spooky_1_ground.png — TABS: bare trees have predominantly black trunks and branches; ours forms a conspicuous bright blue-white thicket around the field (ref: reference/maps/wiki/spooky_1.png). 2. Island cliff silhouette in map_spooky_1_island.png — TABS: irregular bulky rock masses form stepped, broken cliff faces and an uneven underside; ours has long repetitive vertical columns forming smooth, regular cliff bands (ref: reference/maps/spooky_1.png). 3. Field surface in map_spooky_1_ground.png — TABS: the fighting ground reads as dark ground with low scattered dressing; ours is carpeted with dense upright blue polygonal clumps across the whole field (ref: reference/stages/spooky.bone.png).
b PASS (581: struck 5; CONFIRM 581, copied 582)
c PASS (582 judge)

## Ranked gaps
1. [R] a bank appearance — blockers 1-3: rebuild grass, dead trees and cliff faces from both CONFIRM lists: low dusky grass instead of smooth ground/stone-like clumps; thick gnarled black crooked trunks instead of Y forks/bright thicket; stepped irregular cliff masses instead of regular column bands — ref: reference/stages/spooky.bone.png, reference/maps/wiki/spooky_1.png, reference/maps/spooky_1.png — ours: map_spooky_1_ground.png, map_spooky_1_island.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] dusky meadow fe776d2a | a1 | APPROVE, struck a1
582 | [S] crooked trees 1c4f83cd | a2 | APPROVE, struck a2; second failed a CONFIRM -> plateau
581 | [S] descent 8b37b4e3, b0f7dd32, 8800d66d | b5 | APPROVE, struck b5; CONFIRM b PASS, a FAIL
576 | [S] 4dd2d342 | a | APPROVE, struck a2
577 | [S] 6259e76b | a | APPROVE, struck a1 (a5 cleared by 479af4ee)
577 | [S] 479af4ee | b | APPROVE, struck b1, b3, b4
578 | [S] b84e8a52 | a | APPROVE, struck a3
578 | [S] 47539e05 | b | APPROVE, struck b2
579 | [S] lanterns 41ea07bb | a | APPROVE, struck a4
579 | [S] ramp cf4fcec1; revert 9957f674 | b | dropped, cliff hid it

## Rejected (last 4)

## Notes (max 3 lines)
- Stage: spooky.bone (enemies x 20..22.2, |z| <= 9.9). Graveyard x13..31 z13..29.
- a plateau after two failed CONFIRMs: oldest waiting [R] takes iteration 583's rebuild slot. Preserve confirmed b and the descent.
- R spec must cover both 581's grass/tree silhouettes and 582's bark/cliffs/surface lists; reports in iter-581/confirm.md and iter-582/confirm.md.
