# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 355)
 2. face in unit_medieval.king_idle has no beard — TABS: dirty-blonde full beard and moustache (ref: medieval.king.red.png)
 3. body in unit_medieval.king_idle plain team with a skirt flare — TABS: puffed short-sleeve team blouse, gold stripes and collar, puffy pantaloons, beige stockings, brown belt gold buckle, brown shoes (ref: medieval.king.red.png)
 4. cape in unit_medieval.king_idle a dark navy wedge behind the neck — TABS: cream cape off the shoulders, gold clasps (ref: medieval.king.jpg)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard — blocker 2: dirty-blonde faceted beard and moustache (medievalDress) — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
2. [S] a cape — blocker 4: cream cape off the shoulders, gold clasps — ref: medieval.king.jpg — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Zweihander variant (ZWEI, POLE_GRIP.zweiGrip) [S] (4c91ec8, reverted ce15b46) | b | rejected
352 | Zweihander retry: slab cut ZWEI, own mount, no marker [S] (519c8af) | b | approved
353 | two-fisted Zweihander: zweiFists, off fist .5 grip below [S] (9e2fd04, reverted c9dd189) | b | rejected
354 | two fists on the long grip (FISTS_ON_GRIP) [R] (331adbd) | b | approved
355 | fitted crown: gold band low on the brow, 8 points, team gems (royal_crown, ROYAL_CROWN) [S] (0535fe4) | a | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first (zweiGrip pole carry)
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach; hand floats by the guard
## Notes (max 3 lines)
- critic 355: crown points shorter and the crown lower than TABS (points about half a head high).
- critic 355 (b PASS): hilt black, not grey (minor). The release swing trails the blade down behind him (c PASS).
- 355 capture: king's first melee hit moved 850 -> 1150 ms (no attack code touched this iteration).
