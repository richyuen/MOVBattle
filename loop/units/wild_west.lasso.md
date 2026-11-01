# wild_west.lasso
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. horse head in unit_wild_west.lasso_idle: long thin box snout, pink cube nose, no ears — TABS: big rounded head, tall pink-lined ears, big eyes (ref: red.png, .blue.png)
 2. horse colour in unit_wild_west.lasso_idle: yellow-tan with white patches — TABS: orange with peach patches (ref: lasso.jpg; card Appearance)
 3. hat in unit_wild_west.lasso_idle: brown tall-crown hat three heads wide — TABS: small team flat-crown hat (ref: red.png)
 4. moustache in unit_wild_west.lasso_idle: none — TABS: black handlebar moustache (ref: red.png; card Appearance)
b FAIL (0 since 444)
 1. lasso in unit_wild_west.lasso_windup: rein hand holds a short dark stick, grey loop at the horse's flank away from the hand — TABS: coiled tan rope loop held up in the rider's hand (ref: lasso.jpg; red.png)
c PASS (445: rope thrown onto the man's chest, hauled in low under the horse and run over; LASSO_DRAG)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 445 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
5. [S] b lasso coil - blocker 1: tan coiled rope loop held up in the rider's right fist, grey flank ring removed - ref: lasso.jpg - ours: unit_wild_west.lasso_windup (critic 445)
6. [S] a horse head - blocker 1: rounded head, tall pink-lined ears, big eyes, replacing the box snout - ref: red.png - ours: unit_wild_west.lasso_idle
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop (wildWestDress LASSO_ROPE) to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
