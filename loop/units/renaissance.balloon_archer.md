# renaissance.balloon_archer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 368)
 3. hat in unit_renaissance.balloon_archer_idle: round bowler dome, narrow brim — TABS: flat-topped black hat, wide flat brim (ref: renaissance.balloon_archer.jpg)
b PASS (372)
c PASS (368)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a flat-topped wide-brim hat — blocker 3: short flat-topped crown (level lid) on a flat black brim ~2 head widths (401d70e holds such a cut, reverted unreviewed 372: cherry-pick it) — ref: .jpg — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-336 | hat, longbow, float, team ball, striped doublet [S]; longbow length [P] | a,b,c | approved
369 | balloon arrow in the draw fist, hidden at the loose (heldBalloonArrow, HELD_BALLOON_ARROW) [S] (1dafd49 +2c4f0d0) | b | approved
371 | solid doublet, tan placket + buttons, big slashed shoulder puffs (balloonArcherFront, ARCHER_FRONT) [S] (58d2ee9) | a | approved
372 | sleeve slashes laid flat: tan panes on the puff skin, tips down (ARCHER_FRONT rootLat..proud) [S] (25a752d) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Float: BALLOON_ARROWS -> RuntimeUnit.floatOnBalloons; flying arrow's BALLOON_BALL hidden on the hit. Held arrow: renaissanceDress heldBalloonArrow on leftHand, sim _arrowsAway.
- dressBalloonArcher (ARCHER_DRESS) + renaissanceDress balloonArcherFront (placket, puffs, flush slash panes as VertexData). Hat: propBuilder "brim_hat" (BRIM_HAT), his alone.
- Critic 369 minor: held ball near white-blue (glow .25), TABS saturated team colour. 372: bow flatter than the render's steep diagonal (b passed).
