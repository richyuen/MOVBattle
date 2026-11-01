# wild_west.lasso
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 444)
  (struck 4 by lineup at 447)
 1. horse head in unit_wild_west.lasso_idle: long thin box snout, pink cube nose, no ears — TABS: big rounded head, tall pink-lined ears, big eyes (ref: red.png, .blue.png)
 2. horse colour in unit_wild_west.lasso_idle: yellow-tan with white patches — TABS: orange with peach patches (ref: lasso.jpg; card Appearance)
 3. hat in unit_wild_west.lasso_idle: brown tall-crown hat three heads wide — TABS: small team flat-crown hat (ref: red.png)
b FAIL (1 since 444)
 1. lasso in unit_wild_west.lasso_idle: rein hand holds a short dark stick, grey loop at the horse's flank away from the hand — TABS: coiled tan rope loop held up in the rider's hand (ref: lasso.jpg; red.png) [shot re-aimed 447 from _windup: the coil hides while the thrown rope is out]
c PASS (445: rope thrown onto the man's chest, hauled in low under the horse and run over; LASSO_DRAG)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 447 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a horse head - blocker 1: a flattened white eye disc with a black pupil set into each side of the skull, the skull wider than a cream (not white) muzzle (buildHorse pinto) - ref: red.png - ours: unit_wild_west.lasso_idle (critic 447)
6. [S] a hat - blocker 3: small team flat-crown hat (reuse wildWestDress buildFlatHat) - ref: red.png - ours: unit_wild_west.lasso_idle (critic 447)
7. [S] b coil held up - blocker 1: LASSO_COIL big loop raised above and beside the fist, coils off his chin - ref: lasso.jpg - ours: unit_wild_west.lasso_idle (critic 446, 447)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop (wildWestDress LASSO_ROPE) to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (struck 1; c PASS)
446 | PINTO_HEAD sphere skull, cream muzzle ball + nostrils, ears .5 leaves, eyes .11 (2a2551a9) | a | approved (nose/ears clauses cleared, none struck)
446 | LASSO_COIL in the fist on the whip node, flank ring gone, hidden while the rope is out (39f31f9f, 467a8f23) | b | approved (named shot cannot show it, none struck)
447 | PINTO_HEAD pinched-leaf ears, flush blaze lens, skull .66 x .46, eyes .14 (1db23f8a) | a | approved (struck 4 by lineup; 1 stands: eyes, skull)
447 | [P] PINTO_COAT/CREAM on cloth, peach patches (c082222c) | a | dropped (no visible change; reverted cbd79d83)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- The coil replaces the whip's children under the "whip" node (buildHorse pinto branch); simulationSystem _showLassoCoil hides it while a lasso is out.
- 447: the horse colour did not move on "cloth" + new codes: probe_mat the barrel first (the patches may be vertex colours or another material).
