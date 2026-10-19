# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 355) plateau ([R] rejected 1)
 4. stockings in unit_medieval.king_idle (also _windup): boot-thick shells, wider than the breeches' knee band; 364 [R] showed the breeches past the knee to the shin and tall dark boot shells eating the lower shin — TABS: breeches gathered at the knee (about 40% of the leg), slim beige stockings knee to ankle (about 50%), low brown shoes (ref: medieval.king.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a legs — blocker 4: breeches ending at the knee hinge (the thigh's knee stub shortened, or folded into the stocking-coloured shin), stockings knee to ankle as the slim shin itself, low ankle shoes in place of the tall boot shells — ref: medieval.king.red.png — ours: unit_medieval.king_windup.png
## Attempts (iter | gap | criterion | verdict)
357 | cape (medievalCape) [S] (377de2a +808aa53); beard [P] (8b73d7d) | a | approved
358 | royal dress (kingDress, KING_DRESS) [S] (ededbdd) | a | rejected-kept
359 | dress re-land (KING_PANTS) [S] (44f8443); beard hair (kingHair) [S] (8801b8c) | a | approved
360 | no skirt, stockings 1.32 warmCloth [S] (774e5c3 +0dd77b3) | a | approved
361 | slim stockings: shin recoloured, hose 1.06 [S] (e7c3c5c, reverted) | a | rejected
364 | legs [R]: thigh in breeches cloth, breeches past the knee stub, shin as stocking (3d7e9c8 +675c79f +ea41917, reverted) | a | rejected
## Rejected (last 4)
- royal dress [S] [1] — 358: ledger reversal (KING_BEARD nudged); pantaloons to mid-shin (code kept: revert conflicted)
- slim stockings [S] [1] — 361: shell still boot-like; the team thigh knee-end pokes out under the slimmer shell
- legs [R] [1] — 364: hem past the thigh's long knee stub (0.11 m below the hinge) covers knee and upper shin; tall dark shoe meshes eat the lower shin
## Notes (max 3 lines)
- Headless (364): thigh mesh 0.776 tall incl. a ~0.11 knee stub below the hinge; foot _lFootM 0.41 tall (the "tall boots"). Hem at the hinge leaves the stub showing.
- critic 360: front belt buckle unjudgeable in king_idle (grip and blade cross the belt).
- Light warm cloth: warmCloth + unglow (360); the shin recoloured beige reads slim and clean (364).
