# renaissance.painter
Status: done   Audited: 327   Done: 335
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (335)
b PASS (331)
c PASS (332)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
328 | kidney palette held at chest [S] (642eb06) | b | approved
329 | palette out [P] (a8a09e2) | b | rejected
331 | palette out and face-up [S] (413fb65) | b | approved
332 | paint splotches [S] (f7538a3) | c | approved
332 | long dark hair [S] (cfb3c57) | a | approved
333 | jabot: three stacked folds [S] (b8f9dd8 + d307b07) | a | approved
334 | jabot colour PAINTER_RUFF_COLOR [P] (135a0e6) | a | rejected
335 | cravat: self-lit tan wrap, knot, pointed tail [S] (15c41f6 + 6dfd9bc) | a | approved
## Rejected (last 4)
- palette out [P] [1] — 329: PALETTE_HOLD out/raise — no visible change; the euler swing does not take the arm out
- jabot colour [P] [1] — 334: PAINTER_RUFF_COLOR (0.85, 0.68, 0.42) — no visible change, the cloth renders neutral grey (85, 80, 84)
## Notes (max 3 lines)
- dressPainter: PAINTER_CRAVAT (self-lit wrap, knot, tail) on the torso; _holdPalette solves the off hand beside the shoulder (PALETTE_OUT).
- Critic 335 nit: the wrap is narrow and hidden by the hair side-on; TABS's cravat is broad, near shoulder to shoulder.
