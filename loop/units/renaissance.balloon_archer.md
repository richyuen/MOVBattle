# renaissance.balloon_archer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368)
 1. sleeves in unit_renaissance.balloon_archer_idle: tight — TABS: big puffed shoulder sleeves with tan slashes (ref: renaissance.balloon_archer.red.png, .jpg); critic 371: puffs now big, tan points stand out as spikes, not flush slashes
 3. hat in unit_renaissance.balloon_archer_idle: round bowler dome, narrow brim — TABS: flat-topped black hat, wide flat brim (ref: .jpg)
b FAIL (1 since 368)
 2. bow level across the hips in unit_renaissance.balloon_archer_idle — TABS: diagonal across the chest, upper limb by the shoulder (ref: .red.png); critic 369: the idle already shows it hip to opposite shoulder, re-judge
c PASS (368)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a lay the sleeve slashes flat — blocker 1: tan panes flush on the puff surface, tips down, in place of the radial cone spikes (renaissanceDress balloonArcherFront) — ref: .red.png — ours: unit_renaissance.balloon_archer_idle.png
2. [S] a flat-topped wide-brim hat — blocker 3: black hat, low flat crown, wide flat brim in place of the bowler dome — ref: .jpg — ours: unit_renaissance.balloon_archer_idle.png
3. [S] b bow pose — blocker 2 (re-judge first) — ref: .red.png — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-336 | hat, longbow, float, team ball, striped doublet [S]; longbow length [P] | a,b,c | approved
369 | balloon arrow in the draw fist, hidden at the loose (heldBalloonArrow, HELD_BALLOON_ARROW) [S] (1dafd49 +2c4f0d0) | b | approved
371 | solid doublet, tan placket + buttons, big slashed shoulder puffs (balloonArcherFront, ARCHER_FRONT) [S] (58d2ee9) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Float: BALLOON_ARROWS -> RuntimeUnit.floatOnBalloons; flying arrow's BALLOON_BALL hidden on the hit. Held arrow: renaissanceDress heldBalloonArrow on leftHand, sim _arrowsAway.
- dressBalloonArcher (ARCHER_DRESS) + renaissanceDress balloonArcherFront (placket, puffs: points are cones on pivots round the puff's waist).
- Critic 369 minor: held ball near white-blue (glow .25), TABS saturated team colour.
