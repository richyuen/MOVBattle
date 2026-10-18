# medieval.king
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. crown in unit_medieval.king_idle is an oversized flat yellow torus floating like a halo, red balls on spikes — TABS: fitted gold band on the head, tall gold points, inset gems (ref: medieval.king.red.png, .jpg)
 2. no beard in unit_medieval.king_idle — TABS: dirty-blonde beard and moustache (ref: medieval.king.blue.png)
 3. body plain team in unit_medieval.king_idle — TABS: puffed short-sleeve team blouse with gold stripes and collar, pantaloons, beige stockings, brown belt gold buckle (ref: medieval.king.red.png)
 4. cape a narrow yellow strip in unit_medieval.king_idle — TABS: cream cape off the shoulders, gold clasps (ref: medieval.king.jpg)
b PASS (354)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a fitted crown — blocker 1: gold band seated on the head, tall points, inset gems, replacing the floating torus — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
2. [S] a beard — blocker 2: faceted dirty-blonde beard and moustache chunk — ref: medieval.king.blue.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Zweihander variant (ZWEI, POLE_GRIP.zweiGrip) [S] (4c91ec8, reverted ce15b46) | b | rejected
352 | Zweihander retry: slab cut ZWEI, own mount, no marker [S] (519c8af) | b | approved
353 | two-fisted Zweihander: zweiFists, off fist .5 grip below [S] (9e2fd04, reverted c9dd189) | b | rejected
354 | two fists on the long grip: ZWEI seated, mounted on its line, reach-solved off fist, weapon fist drawn in (FISTS_ON_GRIP) [R] (331adbd) | b | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first (zweiGrip pole carry)
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach; hand floats by the guard
## Notes (max 3 lines)
- critic 354 (b PASS): in _windup the far fist hides behind the body; in idle the blade lies back over his shoulder (TABS upright diagonal before him).
- The release swing trails the blade down behind him (pre-354 too; c territory, c PASS).
