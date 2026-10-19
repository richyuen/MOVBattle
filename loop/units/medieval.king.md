# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 355)
 3. body in unit_medieval.king_idle (half cleared 359: stockings knee to shoe): the puffed pantaloons don't read, the thighs hidden under a long team skirt with gold stripes; stockings pale grey-white with a team patch mid-shin; belt only at the back — TABS: short puffed blouse ending at a brown belt with gold buckle, puffy breeches to the knee, beige stockings knee to shoe, brown shoes (ref: medieval.king.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a blouse and breeches — blocker 3: end the team blouse at the waist with a brown belt and gold front buckle, drop or shorten the long tunic skirt so the lathed breeches show to the knee — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
2. [S] a stockings — blocker 3: one continuous beige stocking shell knee to shoe (no team gap mid-shin) in a warm beige that survives the lighting, brown shoes — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
353 | two-fisted Zweihander: zweiFists [S] (9e2fd04, reverted) | b | rejected
354 | two fists on the long grip (FISTS_ON_GRIP) [R] (331adbd) | b | approved
355 | fitted crown (ROYAL_CROWN) [S] (0535fe4) | a | approved
356 | beard (kingBeard, KING_BEARD) [S] (63043f4) | a | approved
357 | cape (medievalCape) [S] (377de2a +808aa53); beard [P] (8b73d7d) | a | approved
358 | royal dress (kingDress, KING_DRESS) [S] (ededbdd) | a | rejected-kept
359 | dress re-land: beard value restored, lathed pantaloons, full stockings (KING_PANTS) [S] (44f8443) | a | approved
359 | beard: own hair material, amber emissive, sideburns (kingHair, KING_HAIR) [S] (8801b8c) | a | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach
- royal dress [S] [1] — 358: ledger reversal (KING_BEARD nudged); pantaloons to mid-shin (code kept: revert conflicted)
## Notes (max 3 lines)
- king_idle's hilt at his face hides most of the beard; lineup_medieval shows it. Stockings may share the archer/squire light-cloth greying (359).
- critic 357: cape collar flap a flat board. Idle near profile, arms over beard and waist.
