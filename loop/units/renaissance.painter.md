# renaissance.painter
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. jabot in unit_renaissance.painter_idle is a thin grey neck ring — TABS: large cream ruffled jabot of stacked layers over the upper chest (ref: renaissance.painter.blue.png)
b PASS (331)
c PASS (332)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a jabot — blocker 2: cream jabot of 3 stacked faceted ruffle layers over the upper chest (dressPainter, unitFactory) — ref: renaissance.painter.blue.png — ours: unit_renaissance.painter_idle.png
2. [P] b palette further out (fallout of 331 palette [S]) — proceduralAnimation.ts PALETTE_OUT side .24->.3 — NEXT shot: unit_renaissance.painter_windup.png
## Attempts (iter | gap | criterion | verdict)
328 | kidney palette held at chest [S] (642eb06) | b | approved
329 | palette out [P] (a8a09e2) | b | rejected
331 | palette out and face-up [S] (413fb65) | b | approved
332 | paint splotches [S] (f7538a3) | c | approved
332 | long dark hair [S] (cfb3c57) | a | approved
## Rejected (last 4)
- palette out [P] [1] — 329: PALETTE_HOLD out/raise — no visible change; the euler swing does not take the arm out
## Notes (max 3 lines)
- _holdPalette solves the off hand (_offArmTo) onto a point beside the off shoulder and stands the board face-up (PALETTE_OUT). Splotches: spawnPaintSplotches from "brushPoint" in _landMeleeBlow.
- Critic 332 nits: splotches pale and gem-like (TABS soft saturated daubs); hair reads as thin strands (TABS a smoother mass; tribalDress long_dark).
- The side-on 1v1 camera looks down his off side; idle/struck/lineup show the chest best.
