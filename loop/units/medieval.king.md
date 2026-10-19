# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 355)
 4. stockings in unit_medieval.king_idle (also _windup): the knee-to-shoe shells (hose 1.32) are boot-thick, wider than the breeches' knee band, a blue team fleck at the front of the right shin, gold/blue specks at their top — TABS: slim beige stockings, clearly narrower than the puffed breeches, knee into brown shoes (ref: medieval.king.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a slim stockings — blocker 4: recolour the shin mesh to warmCloth and replace the 1.32 boot-thick shell with a slim ~1.05 one, unglowed; shoe and gold knee band stay separate — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
353 | two-fisted Zweihander: zweiFists [S] (9e2fd04, reverted) | b | rejected
354 | two fists on the long grip (FISTS_ON_GRIP) [R] (331adbd) | b | approved
355 | fitted crown (ROYAL_CROWN) [S] (0535fe4) | a | approved
356 | beard (kingBeard, KING_BEARD) [S] (63043f4) | a | approved
357 | cape (medievalCape) [S] (377de2a +808aa53); beard [P] (8b73d7d) | a | approved
358 | royal dress (kingDress, KING_DRESS) [S] (ededbdd) | a | rejected-kept
359 | dress re-land: lathed pantaloons, full stockings (KING_PANTS) [S] (44f8443) | a | approved
359 | beard: own hair material, sideburns (kingHair, KING_HAIR) [S] (8801b8c) | a | approved
360 | blouse/breeches/stockings: no skirt, stockings 1.32 warmCloth [S] (774e5c3 +0dd77b3) | a | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach
- royal dress [S] [1] — 358: ledger reversal (KING_BEARD nudged); pantaloons to mid-shin (code kept: revert conflicted)
## Notes (max 3 lines)
- critic 360: front belt buckle unjudgeable in king_idle (grip and blade cross the belt); re-aim by evidence commit if it is to count.
- king_idle's hilt at his face hides most of the beard; lineup_medieval shows it. critic 357: cape collar flap a flat board.
- Light warm cloth: warmCloth + unglow (360); the limb under a slim shell must be recoloured too or the team shows through hexagon flats.
