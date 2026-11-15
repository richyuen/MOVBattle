# wild_west.lasso
Status: done   Audited: 444, 454 (CONFIRM: passed b, c; failed a), 456 (CONFIRM: passed a)   Done: 456
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (456: flat team hat, curled moustache, team shirt with short dark sleeves, orange-and-peach pinto, round head, bead eyes, slim legs; LASSO_SHIRT; CONFIRM 456)
b PASS (451: big open tan loop held up over the fist, small coils in the fist; LASSO_RAISE; CONFIRM 454)
c PASS (445: rope thrown onto the man, hauled in low under the horse and run over; LASSO_DRAG; CONFIRM 454)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 456 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (c PASS)
446-454 | PINTO_HEAD rebuilds, PINTO_BEAD eyes, pinto colours out of the glow, FLAT_HAT | a | approved (a PASS 454; CONFIRM failed a)
446-451 | LASSO_COIL, LASSO_RAISE | b | approved (b PASS)
455 | LASSO_MOUSTACHE (5517a3ff), PINTO_LEGS (e3f0ab28) | a | approved (struck 2, 1)
456 | LASSO_SHIRT team shirt, trousers, hem in lassoShirtCloth, short dark sleeves (3956ccec, 14478070) | a | approved (struck 3; a PASS; CONFIRM passed a; D)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- The default tunic hem is hung later in body.bodyMaterial (unitFactory): a unit re-dressed in team cloth needs its hem branch too (456).
- 456 critic: the red render shows a tan chest panel under the moustache (polish); hooves a little small (455).
