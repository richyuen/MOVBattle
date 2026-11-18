# map.spooky_1
Status: open   Audited: 576 (AUDIT x2), 581 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 581): 1. meadow surface in map_spooky_1_ground — TABS: dense dusky grass covers the banks, not broad smooth bare blue ground (ref: reference/stages/spooky.bone.png) 2. dead-tree silhouettes in map_spooky_1_ground — TABS: thick gnarled trunks with crooked spreading limbs, not a dense row of thin, repetitive Y-shaped forks (ref: reference/maps/wiki/spooky_1.png)
b PASS (581: struck 5; CONFIRM 581)
c PASS (581 judge)

## Ranked gaps
1. [S] a dusky meadow — blocker 1: dense small grass tufts across the plateau surfaces, preserving the chasm recess — ref: reference/stages/spooky.bone.png — ours: map_spooky_1_ground.png
2. [S] a gnarled dead trees — blocker 2: thick irregular trunks with spreading crooked limbs replacing the thin fork ring — ref: reference/maps/wiki/spooky_1.png — ours: map_spooky_1_ground.png

## Attempts (iter | gap | criterion | verdict)
581 | [S] recessed descent 8b37b4e3, b0f7dd32, 8800d66d | b5 | APPROVE, struck b5; CONFIRM b PASS, a FAIL
576 | [S] 4dd2d342 | a | APPROVE, struck a2
577 | [S] 6259e76b | a | APPROVE, struck a1 (a5 cleared by 479af4ee)
577 | [S] 479af4ee | b | APPROVE, struck b1, b3, b4
578 | [S] b84e8a52 | a | APPROVE, struck a3
578 | [S] 47539e05 | b | APPROVE, struck b2
579 | [S] lantern clusters (41ea07bb) | a | APPROVE, struck a4
579 | [S] left ramp (cf4fcec1; revert 9957f674) | b | dropped, cliff hid it

## Rejected (last 4)


## Notes (max 3 lines)
- Stage: spooky.bone (enemies x 20..22.2, |z| <= 9.9). Graveyard x 13..31, z 13..29.
- 581: ramp and doorway visible after recess/strip triangulation. First failed appearance CONFIRM: meadow and tree silhouette lists above.
