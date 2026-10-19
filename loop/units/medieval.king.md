# medieval.king
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 355)
 2. beard in unit_medieval.king_idle wide but a pale khaki-grey beige — TABS: warm dirty-blonde/tan beard (ref: medieval.king.red.png)
 3. body in unit_medieval.king_idle plain team with a skirt flare — TABS: puffed short-sleeve team blouse, gold stripes and collar, puffy pantaloons, beige stockings, brown belt gold buckle, brown shoes (ref: medieval.king.red.png)
b PASS (355)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a royal dress — blocker 3: puffed blouse with gold stripes and collar, pantaloons, beige stockings, belt and gold buckle, brown shoes (beard tint as a warm material in that pass, not a [P]) — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Zweihander variant (ZWEI, POLE_GRIP.zweiGrip) [S] (4c91ec8, reverted ce15b46) | b | rejected
352 | Zweihander retry: slab cut ZWEI, own mount, no marker [S] (519c8af) | b | approved
353 | two-fisted Zweihander: zweiFists [S] (9e2fd04, reverted c9dd189) | b | rejected
354 | two fists on the long grip (FISTS_ON_GRIP) [R] (331adbd) | b | approved
355 | fitted crown (ROYAL_CROWN) [S] (0535fe4) | a | approved
356 | beard: faceted, blunt point, drooping moustache (kingBeard, KING_BEARD) [S] (63043f4) | a | approved
357 | cape: cream off the shoulders, flaps, gold buttons (medievalCape, MEDIEVAL_CAPE) [S] (377de2a +808aa53) | a | approved
357 | beard fallout: wide 1.6, deep .9, warmer blonde (KING_BEARD) [P] (8b73d7d) | a | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin, swung pommel-first (zweiGrip pole carry)
- two-fisted Zweihander [S] [1] — 353: off-fist target beyond the off arm's reach; hand floats by the guard
## Notes (max 3 lines)
- critic 357: front lineup shows the cape collar flap as a flat white board on the shoulder top (minor). No more [P] on KING_BEARD.
- critic 355: crown points short, crown low. His idle is near profile, fists at the jaw: the beard reads side-on.
