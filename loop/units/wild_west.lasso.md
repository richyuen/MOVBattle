# wild_west.lasso
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 4 by lineup at 447; 3 at 448)
 1. horse head in unit_wild_west.lasso_idle: long thin box snout, pink cube nose, no ears — TABS: big rounded head, tall pink-lined ears, big eyes (ref: red.png, .blue.png)
 2. horse colour in unit_wild_west.lasso_idle: yellow-tan with white patches — TABS: orange with peach patches (ref: lasso.jpg; card Appearance)
b PASS (451: big open tan loop held up over the fist, small coils in the fist; LASSO_RAISE)
c PASS (445: rope thrown onto the man's chest, hauled in low under the horse and run over; LASSO_DRAG)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 451 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
9. [S] a horse colour - blocker 2: pinto coat with an orange base and peach patch chunks (probe_mat the barrel first) - ref: lasso.jpg - ours: unit_wild_west.lasso_idle (critic 448, 451)
10. [S] a horse head - blocker 1: big rounded head, tall pink-lined upright ears; white eye discs with a black pupil set into each side of a skull wider than a cream muzzle - ref: red.png - ours: unit_wild_west.lasso_idle (critic 447, 451)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop (wildWestDress LASSO_ROPE) to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (struck 1; c PASS)
446 | PINTO_HEAD sphere skull, cream muzzle ball + nostrils, ears .5 leaves, eyes .11 (2a2551a9) | a | approved (nose/ears clauses cleared, none struck)
446 | LASSO_COIL in the fist on the whip node, flank ring gone, hidden while the rope is out (39f31f9f, 467a8f23) | b | approved (named shot cannot show it, none struck)
447 | PINTO_HEAD pinched-leaf ears, flush blaze lens, skull .66 x .46, eyes .14 (1db23f8a) | a | approved (struck 4 by lineup; 1 stands: eyes, skull)
447 | [P] PINTO_COAT/CREAM on cloth, peach patches (c082222c) | a | dropped (no visible change; reverted cbd79d83)
448 | FLAT_HAT (wildWestDress, the Quick Draw's) on the rider (fac00c2d) | a | approved (struck 3)
451 | LASSO_RAISE _raiseLassoCoil stands the coil in the world each frame, +y up, out .45 back .15 face -.6 (363add1b) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- 451 critic: the held loop stands a head and a half over the shoulder (TABS shoulder or hip height) - not a blocker; LASSO_RAISE.back/out or a shorter LASSO_COIL.rise if it ever is.
- 447: the horse colour did not move on "cloth" + new codes: probe_mat the barrel first (the patches may be vertex colours or another material).
