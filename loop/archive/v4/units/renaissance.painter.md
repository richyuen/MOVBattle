# renaissance.painter
Status: done   Audited: 368 (re; a, b re-audited 372)   Done: 374
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (374)
b PASS (372)
c PASS (373)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
328-335 | palette, splotches, hair, jabot folds, cravat [S] | a,b,c | approved
368 | stacked-tier jabot over the chin [S] (53e6e78, reverted) | a | rejected
369-373 | jabot under the jaw; puffed beret; jabot bib (PAINTER_JABOT); lathe tam (BERET_TAM); Painter Dodge (PAINTER_DODGE) [S]; jabot gathered [P] | a,c | approved
374 | sweater ends at the hip in a darker ribbed band, legs 1.2x, bulk .85 (PAINTER_SWEATER, painterSweaterRib) [S] (0ee7192) | a | approved
## Rejected (last 4)
- jabot colour [P] [1] — 334: no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: tiers over the chin read as a beard
## Notes (max 3 lines)
- dressPainter: jabot painterJabot; sweater hem is unitFactory's skirt branch "painterSweaterHem" + renaissanceDress painterSweaterRib. Beret: propBuilder "beret". Capture opponent: medieval archer (7c27b4e).
- Cloth tans grey under the sky: raise glow or saturate. Idle camera swings to his face side (fac4c91).
- Critic 374 minor: the hem foot shows small ragged tags, not a clean ribbed band.
