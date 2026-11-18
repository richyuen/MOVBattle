# map.spooky_1
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a PASS (579: struck 4; CONFIRM pending)
b FAIL (578: struck 2): 5. Left ramp in map_spooky_1_top — TABS: a ramp runs down the left side to the room under the bridge; ours has none (ref: card Secrets)
c PASS (579 judge)

## Ranked gaps
1. [S] map.spooky_1.b left descent — blocker 5: carve a recess in the left chasm face and place a wall-sided ramp to the broken room doorway, visible in the top shot — ref: loop/cards/maps/spooky_1.md Secrets — ours: output/loop/iter-579/map_spooky_1_top.png

## Attempts (iter | gap | criterion | verdict)
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
- 579 ramp was hidden by merged cliff columns; carve a bank recess before the next descent attempt. a awaits CONFIRM when b closes.
