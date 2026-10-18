# renaissance.painter
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 327)
 1. no hair under the beret in unit_renaissance.painter_idle — TABS: long dark-brown hair from under the beret to the shoulders (ref: renaissance.painter.red.png)
 2. jabot in unit_renaissance.painter_idle is a thin grey neck ring — TABS: large cream ruffled jabot of stacked layers over the upper chest (ref: renaissance.painter.blue.png)
b FAIL (2 since 327)
 3. palette in unit_renaissance.painter_windup/_release is held square before the chest and face like a buckler, brush hand tucked behind it — TABS: palette out to the off side at shoulder height, tilted face-up, body and brush clear (ref: renaissance.painter.jpg)
c FAIL (0 since 327)
 1. missing: paint splotches flying from the brush in unit_renaissance.painter_release/_flight (ref: card Appearance)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b palette out and face-up — blocker 3: _offArmTo onto a world point beside the off shoulder (out ~0.5 m, chest height), palette face turned to world up — ref: renaissance.painter.jpg — ours: unit_renaissance.painter_windup.png
2. [S] c paint splotches — blocker 1: team paint blobs flung from the brush tip on each swing — ref: card Appearance — ours: unit_renaissance.painter_release.png
## Attempts (iter | gap | criterion | verdict)
327 | short one-handed brush [S] (34e0270 + 362af93) | b | approved
328 | kidney palette held at chest [S] (642eb06) | b | approved
328 | brush girth [P] (67edb37) | b | approved
329 | palette out [P] (a8a09e2) | b | rejected
## Rejected (last 4)
- palette out [P] [1] — 329: PALETTE_HOLD out -0.55->-1.2, raise -1.0->-0.6 — no visible change in _idle/_windup/_release; the euler swing does not take the arm out, face stays vertical
## Notes (max 3 lines)
- The hand's +y runs up the forearm: a one-handed prop built along +y lies along the arm; the brush is turned end over end (rotation.x = PI).
- Probe 329: out -1.2 does put the idle hand 0.37 m out to the side; in the shots something later (the swing pose) keeps it before the chest.
