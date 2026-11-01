# wild_west.lasso
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
 1. horse head in unit_wild_west.lasso_idle: long thin box snout, pink cube nose, no ears — TABS: big rounded head, tall pink-lined ears, big eyes (ref: red.png, .blue.png)
 2. horse colour in unit_wild_west.lasso_idle: yellow-tan with white patches — TABS: orange with peach patches (ref: lasso.jpg; card Appearance)
 3. hat in unit_wild_west.lasso_idle: brown tall-crown hat three heads wide — TABS: small team flat-crown hat (ref: red.png)
 4. moustache in unit_wild_west.lasso_idle: none — TABS: black handlebar moustache (ref: red.png; card Appearance)
b FAIL (1 since 444)
 1. lasso in unit_wild_west.lasso_windup: rein hand holds a short dark stick, grey loop at the horse's flank away from the hand — TABS: coiled tan rope loop held up in the rider's hand (ref: lasso.jpg; red.png) [shot: evidence commit first, re-aim to unit_wild_west.lasso_idle]
c PASS (445: rope thrown onto the man's chest, hauled in low under the horse and run over; LASSO_DRAG)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 446 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
0. EVIDENCE first (outside the 7): re-aim b blocker 1 to unit_wild_west.lasso_idle (the coil hides while the thrown rope is out, so _windup cannot show it) (critic 446)
1. [S] b coil held up - blocker 1: LASSO_COIL big loop raised above and beside the fist (tip toward upright, rise larger), coils off his chin - ref: lasso.jpg - ours: unit_wild_west.lasso_idle (critic 446)
2. [S] a horse head - blocker 1: PINTO_HEAD shorter and fatter (long ~.6, wide ~.48), blaze flush, ears broad leaves (earWide ~.3, earFlat ~.6), eyes bigger - ref: red.png - ours: unit_wild_west.lasso_idle (critic 446)
9. [S] a hat - blocker 3: small team flat-crown hat in wildWestDress - ref: red.png - ours: unit_wild_west.lasso_idle (critic 446)
10. [P] a horse colour - blocker 2: PINTO_COAT/PINTO_GLOW to render orange (fallout of 2a2551a9) - ref: lasso.jpg - ours: unit_wild_west.lasso_idle (critic 446)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop (wildWestDress LASSO_ROPE) to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (struck 1; c PASS)
446 | PINTO_HEAD sphere skull, cream muzzle ball + nostrils, ears .5 leaves, eyes .11 (2a2551a9) | a | approved (nose/ears clauses cleared, none struck)
446 | LASSO_COIL in the fist on the whip node, flank ring gone, hidden while the rope is out (39f31f9f, 467a8f23) | b | approved (named shot cannot show it, none struck)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- The coil replaces the whip's children under the "whip" node (buildHorse pinto branch); simulationSystem _showLassoCoil hides it while a lasso is out.
