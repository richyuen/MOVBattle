# map.spooky_1
Status: open   Audited: 576 (AUDIT x2), 581 (CONFIRM: passed b; failed a), 582 (CONFIRM: passed b; failed a), 585 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (plateau; 0 since 585, CONFIRM list): 1. ruined dark stone watchtower with lit yellow windows on the far rim in map_spooky_1_top — TABS: a tall dark tower with glowing windows stands on the far side of the field, right of centre, among the dead trees (ref: reference/maps/wiki/spooky_1.png, centre-right) 2. broken standing stone pillar on the far rim in map_spooky_1_ground — TABS: a tall grey broken stone column rises above the treeline left of centre (ref: reference/maps/wiki/spooky_1.png, upper centre-left; a dark tall structure also stands at the left edge of reference/stages/spooky.bone.png) 3. large soft red translucent discs on the grass under the tree ring in map_spooky_1_top — TABS: the only light pools are small warm orange-yellow glows around candles and jack-o-lanterns; no red patches lie on the ground (ref: reference/maps/wiki/spooky_1.png, left rim candle glows)
b PASS (581: struck 5; CONFIRM 581, copied 582, 585)
c PASS (585 judge)

## Ranked gaps
1. [R] a far-rim set pieces and light pools — blockers 1-3: one rim-dressing rebuild (spec from the 581, 582 and 585 CONFIRM lists): a dark stone watchtower with lit windows on the far rim right of centre, a broken grey stone pillar left of centre, the red ground discs found by name and removed (zone slabs or glow pools), candle glows kept small and orange — ref: reference/maps/wiki/spooky_1.png — ours: map_spooky_1_top.png

## Attempts (iter | gap | criterion | verdict)
585 | [R] upper tier stepped masses, inset skirt, descent face d6e6dbce | a2 | APPROVE, struck a2 (critic a PASS); CONFIRM failed a (third) with a fresh list -> plateau
584 | [R] stepped masses, shelf, roots, blade turf, dim mist 012614f9 | a2, a4 | APPROVE, struck a4
583 | [R] bank rebuild 8094db6e | a1-3 | APPROVE, struck a1, a3; added a4
582 | [S] dusky meadow fe776d2a; crooked trees 1c4f83cd | a | 2 APPROVE; second failed a CONFIRM -> plateau
576-581 | [S] sky, grass, chasm, trees, graveyard, lanterns, descent (one ramp dropped) | a, b | 8 APPROVE, struck a1-a5, b1-b5

## Rejected (last 4)

## Notes (max 3 lines)
- Stage: spooky.bone (enemies x 20..22.2, |z| <= 9.9). Graveyard x13..31 z13..29. Preserve confirmed b, the descent and the 585 cliffs (critic passed them).
- Cliff masses passed the critic at 585; the CONFIRM failed a on rim set pieces it had not listed before. Report: output/loop/iter-585/confirm.md.
- [R] slot order: wild_west a at 586, then spooky_1 a at 587.
