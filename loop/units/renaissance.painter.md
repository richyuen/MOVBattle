# renaissance.painter
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 327)
 1. no hair under the beret in unit_renaissance.painter_idle — TABS: long dark-brown hair from under the beret to the shoulders (ref: renaissance.painter.red.png)
 2. jabot in unit_renaissance.painter_idle is a thin grey neck ring — TABS: large cream ruffled jabot of stacked layers over the upper chest (ref: renaissance.painter.blue.png)
b PASS (331)
c FAIL (0 since 327)
 1. missing: paint splotches flying from the brush in unit_renaissance.painter_release/_flight (ref: card Appearance)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c paint splotches — blocker 1: on the brush's melee hit, 4-6 faceted paint blobs in palette colours flying off the brush head along the swing — ref: card Appearance, renaissance.painter.jpg — ours: unit_renaissance.painter_release.png/_flight.png
2. [S] a hair — blocker 1: long dark-brown faceted hair chunk from under the beret to the shoulders — ref: renaissance.painter.red.png — ours: unit_renaissance.painter_idle.png
3. [P] b palette further out (fallout of 331 palette [S]) — proceduralAnimation.ts PALETTE_OUT side .24->.3 — NEXT shot: unit_renaissance.painter_windup.png
## Attempts (iter | gap | criterion | verdict)
327 | short one-handed brush [S] (34e0270 + 362af93) | b | approved
328 | kidney palette held at chest [S] (642eb06) | b | approved
329 | palette out [P] (a8a09e2) | b | rejected
331 | palette out and face-up [S] (413fb65) | b | approved
## Rejected (last 4)
- palette out [P] [1] — 329: PALETTE_HOLD out/raise — no visible change; the euler swing does not take the arm out
## Notes (max 3 lines)
- _holdPalette solves the off hand (_offArmTo) onto a point in the body's frame beside the off shoulder and stands the board face-up in the world (PALETTE_OUT).
- The side-on 1v1 camera looks down his off side: "out to the side" projects onto the chest there; idle/struck/lineup show it best.
