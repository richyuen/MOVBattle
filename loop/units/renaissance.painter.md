# renaissance.painter
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. jabot in lineup_renaissance and unit_renaissance.painter_windup reads pale grey-white and hangs as a broad bib to mid-chest like a beard — TABS: tan-cream cravat wrapped at the throat, ending in a point over the upper chest (ref: renaissance.painter.blue.png)
b PASS (331)
c PASS (332)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cravat — blocker 2: self-lit tan cravat knotted at the throat, tapering to a point over the upper chest — ref: renaissance.painter.blue.png — ours: unit_renaissance.painter_windup.png
## Attempts (iter | gap | criterion | verdict)
328 | kidney palette held at chest [S] (642eb06) | b | approved
329 | palette out [P] (a8a09e2) | b | rejected
331 | palette out and face-up [S] (413fb65) | b | approved
332 | paint splotches [S] (f7538a3) | c | approved
332 | long dark hair [S] (cfb3c57) | a | approved
333 | jabot: three stacked folds [S] (b8f9dd8 + d307b07) | a | approved
334 | jabot colour PAINTER_RUFF_COLOR [P] (135a0e6) | a | rejected
## Rejected (last 4)
- palette out [P] [1] — 329: PALETTE_HOLD out/raise — no visible change; the euler swing does not take the arm out
- jabot colour [P] [1] — 334: PAINTER_RUFF_COLOR (0.85, 0.68, 0.42) — no visible change, the cloth renders neutral grey (85, 80, 84)
## Notes (max 3 lines)
- dressPainter: one ruff wrap + PAINTER_JABOT folds (PAINTER_RUFF_COLOR via getCloth) on the torso; _holdPalette solves the off hand beside the shoulder (PALETTE_OUT).
- getCloth tints grey out under this light: a colour needs a self-lit material (mat(..., glow) as HORSE_DRAPE) to read warm.
- The side-on 1v1 camera looks down his off side; idle/struck/lineup show the chest best.
