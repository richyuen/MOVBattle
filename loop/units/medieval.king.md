# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 355)
 2. beard in unit_medieval.king_idle khaki/olive, darker in shade — TABS: warm dirty-blonde/tan beard (ref: medieval.king.red.png)
 3. body in unit_medieval.king_idle (kingDress kept, rejected 358): pantaloons straight tubes to mid-shin, stockings a short pale band, belt hidden — TABS: puffed short-sleeve team blouse, gold stripes and collar, puffy breeches to the knee, beige stockings knee to shoe, brown belt gold buckle, brown shoes (ref: medieval.king.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a royal dress — blocker 3: medievalDress kingDress re-landed: KING_BEARD back to (.88,.62,.28) glow .12, pantaloons ended at the knee, stockings knee to shoe — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
2. [S] a beard — blocker 2: rebuild the beard with its own self-lit hair material (like TONSURE grey) so tan reads; no KING_BEARD value nudge — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Zweihander variant [S] (4c91ec8, reverted) | b | rejected
353 | two-fisted Zweihander: zweiFists [S] (9e2fd04, reverted) | b | rejected
354 | two fists on the long grip (FISTS_ON_GRIP) [R] (331adbd) | b | approved
355 | fitted crown (ROYAL_CROWN) [S] (0535fe4) | a | approved
356 | beard (kingBeard, KING_BEARD) [S] (63043f4) | a | approved
357 | cape: cream off the shoulders (medievalCape) [S] (377de2a +808aa53) | a | approved
357 | beard fallout (KING_BEARD) [P] (8b73d7d) | a | approved
358 | royal dress: puffed gold-folded sleeves, collar V, belt+buckle, pantaloons, stockings, shoes; beard tint (kingDress, KING_DRESS) [S] (ededbdd) | a | rejected-kept
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach; hand floats by the guard
- royal dress [S] [1] — 358: ledger reversal (KING_BEARD.blonde nudged, row closed 357); pantaloons to mid-shin (code kept: revert conflicted)
## Notes (max 3 lines)
- The live code still carries KING_BEARD (.84,.54,.2) glow .2 (rejected-kept): the re-land must set it back to (.88,.62,.28) glow .12.
- critic 357: cape collar flap a flat board. Idle near profile, arms over beard and waist.
