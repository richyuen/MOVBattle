# renaissance.painter
Status: open   Audited: 368 (re; a, b re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 372)
 2. figure in unit_renaissance.painter_idle: doublet flares to mid-thigh over short grey-khaki legs (~40% of height) — TABS: lanky, sweater ends at the hip, khaki-tan legs over half his height (ref: .red.png)
b PASS (372)
c PASS (373)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a figure — blocker 2: the sweater ends at the hip, khaki-tan legs lengthen to over half his height (dressPainter + painter proportions) — ref: .red.png — ours: unit_renaissance.painter_idle.png
## Attempts (iter | gap | criterion | verdict)
328-335 | palette, splotches, hair, jabot folds, cravat [S] | a,b,c | approved
368 | stacked-tier jabot over the chin [S] (53e6e78, reverted) | a | rejected
369-372 | jabot under the jaw; puffed beret (BERET_PUFF); jabot as a front bib (PAINTER_JABOT) [S] | a | approved
373 | beret as a lumpy lathe tam, dark team shade (BERET_TAM) [S] (6b5ac3c) | a | approved
373 | Painter Dodge: sidestep off a missile .3 s out, missile lands on air (PAINTER_DODGE, incomingAt, loseTarget) [S] (89dc959; evidence 7c27b4e) | c | approved
373 | jabot gathered at the collar (PAINTER_JABOT step, tall, across, grow, bulge) [P] (b30db36) | a | approved
## Rejected (last 4)
- jabot colour [P] [1] — 334: no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: tiers over the chin read as a beard
## Notes (max 3 lines)
- dressPainter: jabot renaissanceDress painterJabot; _holdPalette (PALETTE_OUT). Beret: propBuilder "beret" (band + BERET_TAM lathe). His capture opponent is a medieval archer (7c27b4e).
- Cloth tans grey under the sky: raise glow or saturate. Idle camera swings to his face side (fac4c91).
- Critic 373 minor: tam top faces lighter than the sweater; jabot tiers read as faint fold lines.
