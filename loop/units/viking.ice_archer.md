# viking.ice_archer
Status: open   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 405; the CONFIRM's list, struck 1 at 408, 2 at 409)
 3. small black tube quiver on the back in lineup_viking - TABS: a large brown leather quiver slab hanging at the right hip (ref: .red.png, .blue.png)
 4. white fur bands at the knees in unit_viking.ice_archer_idle - TABS: khaki baggy leg wraps from knee to mid-shin over brown boots (ref: .red.png, viking.jpg)
  (struck 1 at 408: no ruff, snow lumps; struck 2 at 409: the team coat, belted, to mid-thigh)
b FAIL (4 since 405; the CONFIRM's list, struck 1 at 406, 3 at 409-410)
 2. bow carriage in unit_viking.ice_archer_idle: held low, tip angled down and forward to the ground like a lance - TABS: upright and diagonal in the left hand across the body, upper tip above the hat (ref: .red.png, viking.jpg)
  (struck 1 at 406: a slender strung crystal bow; struck 3 at 410: the draw with the ice arrow nocked)
c PASS (401; CONFIRM 405)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a knee wraps - blocker 4: brawlerLegs(..., { wrap: 1 }) LEG_WRAPS khaki shin wraps in place of the fur cuffs (as the jarl got at 410) - ref: .red.png - ours: unit_viking.ice_archer_idle.png
2. [S] b bow carriage - blocker 2: the idle carry with the bow upright and diagonal across the body, upper tip above the hat - ref: .red.png - ours: unit_viking.ice_archer_idle.png
3. [P] a quiver, fallout of 410.4: ICE_ARCHER_QUIVER broad face forward (swap width/depth, yaw ~.6 rad), a lighter brown, so it reads in unit_viking.ice_archer_idle and lineup_viking
## Attempts (iter | gap | criterion | verdict)
395-405 | ice crust; round cap; iceArrow; frost ribbon (399 rejected); icicle comb (c PASS); mantle; cap line; brawlerLegs; band [S] | a,c | approved; CONFIRM 405 failed a, b
406-407 | ICE_BOW recut (8dbee1a); ICE_UPRIGHT carry (1936db1 + a65dfd2) | b | approved (struck 1)
408-409 | ICE_ARCHER_SNOWCAP (ea60323); ICE_ARCHER_COAT (75774b2) | a | approved (struck 1, 2)
409 | DRAWS_BEFORE_LOOSE: she looses from a full draw (8b44250) | b | approved (split 3)
410 | ICE_ARCHER_QUIVER: leather slab at the off hip, back tube off (d6fdbba) | a | approved (none struck: edge-on from the front)
410 | ICE_NOCK + _poseIceNock: drawn string halves, nocked ice arrow (742df8a) | b | approved (struck 3)
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 410 critic: the draw hand rises beside the head while the nock stops at the shoulder; the lower string half passes through the trunk.
- 409: status:freeze is still logged at the decision (383 ms), ahead of the arrow (hit 1400 ms).
- 407: ICE_UPRIGHT.tip is not re-nudgeable as [P] (approved 407); the 3/4 camera flattens the stave's lean.
