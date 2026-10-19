# medieval.king
Status: done   Audited: 355   Done: 365
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (365)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
357 | cape (medievalCape) [S] (377de2a +808aa53); beard [P] (8b73d7d) | a | approved
358 | royal dress (kingDress, KING_DRESS) [S] (ededbdd) | a | rejected-kept
359 | dress re-land (KING_PANTS) [S] (44f8443); beard hair (kingHair) [S] (8801b8c) | a | approved
360 | no skirt, stockings 1.32 warmCloth [S] (774e5c3 +0dd77b3) | a | approved
361 | slim stockings: shin recoloured, hose 1.06 [S] (e7c3c5c, reverted) | a | rejected
364 | legs [R]: breeches past the knee stub (3d7e9c8 +675c79f +ea41917, reverted) | a | rejected
365 | legs [R] #2: thigh ends at the hinge, shin = stocking slim .84, low squashed shoe (endAtHinge, KING_LEGS) (b1fa1af +09dfc00) | a | approved
## Rejected (last 4)
- royal dress [S] [1] — 358: ledger reversal (KING_BEARD nudged); pantaloons to mid-shin (code kept: revert conflicted)
- slim stockings [S] [1] — 361: shell still boot-like; the team thigh knee-end pokes out under the slimmer shell
- legs [R] [1] — 364: hem past the thigh's long knee stub covers knee and upper shin; tall dark shoe meshes eat the lower shin
## Notes (max 3 lines)
- 365 legs: endAtHinge scales the thigh from its top to the knee hinge; shin.material warmCloth, scaled x/z KING_LEGS.slim; foot squashed about its sole (KING_LEGS.shoe).
- critic 365 (minor): shoes dark grey-brown and a little chunky, buckle proud. critic 360: belt buckle unjudgeable in king_idle.
