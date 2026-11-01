# wild_west.lasso
Status: open   Audited: 444, 454 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 454; CONFIRM list)
  (struck 2, 1 at 455)
 3. rider shirt in lineup_wild_west (red rider) renders olive-brown, not red; the gunslinger's torso is red-mauve — TABS: a team-red shirt (ref: reference/units/wild_west.lasso.red.png; card Appearance "dark team colored shirt")
b PASS (451: big open tan loop held up over the fist, small coils in the fist; LASSO_RAISE; CONFIRM 454)
c PASS (445: rope thrown onto the man, hauled in low under the horse and run over; LASSO_DRAG; CONFIRM 454)
d PASS (cost 740, hp 6.77x; dmg/cd no wiki; 455 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shirt - blocker 3: LASSO_SHIRT, team cloth on every body-material mesh but the head and hands (as DYNAMITE_SHIRT), a darker team short-sleeve shell; judge on a red --noglow swatch - ref: red.png - ours: lineup_wild_west (critic 455)
## Attempts (iter | gap | criterion | verdict)
445 | LASSO_DRAG rope + loop to the drawn chest, haul, trample (cbd214cd, 7db56d0f) | c | approved (c PASS)
446-454 | PINTO_HEAD rebuilds, PINTO_BEAD eyes, pinto colours out of the glow, FLAT_HAT | a | approved (a PASS 454; CONFIRM failed a)
446-451 | LASSO_COIL, LASSO_RAISE | b | approved (b PASS)
455 | LASSO_MOUSTACHE dark bars with upturned ring curls (5517a3ff) | a | approved (struck 2)
455 | PINTO_LEGS slim round tapers, thin cannons, small dark hooves (e3f0ab28) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- A toppled man is drawn away from his root: the rope aims at man.body.torso's world position, not root + height.
- 453 probe: the coat read golden in the glow layer's bloom; codes past (1,.5,.16) / (1,.76,.54) wash to yellow / white.
- 455 critic: hooves a little smaller than TABS (not a blocker); 454: ears shorter than the reference (not a blocker).
