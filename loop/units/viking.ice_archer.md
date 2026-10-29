# viking.ice_archer
Status: open   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 405; the CONFIRM's list, struck 1 at 408, 2 at 409)
 3. small black tube quiver on the back in lineup_viking - TABS: a large brown leather quiver slab hanging at the right hip (ref: .red.png, .blue.png)
 4. white fur bands at the knees in unit_viking.ice_archer_idle - TABS: khaki baggy leg wraps from knee to mid-shin over brown boots (ref: .red.png, viking.jpg)
  (struck 1 at 408: no ruff, snow lumps; struck 2 at 409: the team coat, belted, to mid-thigh)
b FAIL (3 since 405; the CONFIRM's list, struck 1 at 406, 3's first clause at 409)
 2. bow carriage in unit_viking.ice_archer_idle: held low, tip angled down and forward to the ground like a lance - TABS: upright and diagonal in the left hand across the body, upper tip above the hat (ref: .red.png, viking.jpg)
 3. no draw in unit_viking.ice_archer_windup (running, forward hand empty) - TABS: bow vertical at arm's length, the ice arrow drawn to the chest (ref: .jpg)
  (struck 1 at 406: a slender strung crystal bow; struck at 409: "no bow visible")
c PASS (401; CONFIRM 405)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a quiver - blocker 3: a large brown leather quiver slab hung at the right hip from the coat belt, arrow tips at its top - ref: .red.png - ours: lineup_viking.png
2. [S] b draw - blocker 3: the ice arrow nocked on a bent string, drawn to the chest (not above the shoulder) through the windup - ref: .jpg - ours: unit_viking.ice_archer_windup.png
## Attempts (iter | gap | criterion | verdict)
395-405 | ice crust; round cap; iceArrow; frost ribbon (399 rejected); icicle comb (c PASS); mantle; cap line; brawlerLegs; band [S] | a,c | approved; CONFIRM 405 failed a, b
406-407 | ICE_BOW recut (8dbee1a); ICE_UPRIGHT carry (1936db1 + a65dfd2) | b | approved (struck 1)
408 | ICE_ARCHER_SNOWCAP: ruff gone, snow lumps on the shoulders (ea60323) | a | approved (struck 1)
409 | ICE_ARCHER_COAT: team shell, full sleeves, leather belt, coat skirt (75774b2) | a | approved (struck 2)
409 | DRAWS_BEFORE_LOOSE: she looses from a full draw, throw at 1067 ms (8b44250) | b | approved (split 3)
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 409 critic: the windup bow is vertical at arm's length but no arrow is nocked, the string straight, the draw hand above the shoulder.
- 409: status:freeze is still logged at the decision (383 ms), ahead of the arrow (hit 1400 ms).
- 407 critic: ICE_UPRIGHT.tip is not re-nudgeable as [P]; the 3/4 camera flattens the stave's lean.
