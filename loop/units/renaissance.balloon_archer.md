# renaissance.balloon_archer
Status: done   Audited: 368 (re)   Done: 373
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (373)
b PASS (372)
c PASS (368)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
327-336 | hat, longbow, float, team ball, striped doublet [S]; longbow length [P] | a,b,c | approved
369 | balloon arrow in the draw fist, hidden at the loose (heldBalloonArrow, HELD_BALLOON_ARROW) [S] (1dafd49 +2c4f0d0) | b | approved
371 | solid doublet, tan placket + buttons, big slashed shoulder puffs (balloonArcherFront, ARCHER_FRONT) [S] (58d2ee9) | a | approved
372 | sleeve slashes laid flat: tan panes on the puff skin, tips down (ARCHER_FRONT rootLat..proud) [S] (25a752d) | a | approved
373 | flat-topped wide-brim hat: 10-sided crown, bevelled flat top, flat 1.9-head brim (BRIM_HAT) [S] (23dc915) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Float: BALLOON_ARROWS -> RuntimeUnit.floatOnBalloons; flying arrow's BALLOON_BALL hidden on the hit. Held arrow: renaissanceDress heldBalloonArrow on leftHand, sim _arrowsAway.
- dressBalloonArcher (ARCHER_DRESS) + renaissanceDress balloonArcherFront. Hat: propBuilder "brim_hat" (BRIM_HAT), his alone.
- Critic 373 minor: crown a little tall. 369: held ball near white-blue. 372: bow flatter than the render's steep diagonal.
