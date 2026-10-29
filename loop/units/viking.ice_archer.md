# viking.ice_archer
Status: open   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 405; the CONFIRM's list, struck 1 at 408)
 2. dull brown-mauve vest over the torso in lineup_viking (red team) - TABS: the whole coat team red down to mid-thigh, belted (ref: .red.png)
 3. small black tube quiver on the back in lineup_viking - TABS: a large brown leather quiver slab hanging at the right hip (ref: .red.png, .blue.png)
 4. white fur bands at the knees in unit_viking.ice_archer_idle - TABS: khaki baggy leg wraps from knee to mid-shin over brown boots (ref: .red.png, viking.jpg)
  (struck 1 at 408: no ruff, snow lumps on the shoulders)
b FAIL (2 since 405; the CONFIRM's list, struck 1 at 406)
 2. bow carriage in unit_viking.ice_archer_idle: held low, tip angled down and forward to the ground like a lance - TABS: upright and diagonal in the left hand across the body, upper tip above the hat (ref: .red.png, viking.jpg)
 3. no bow visible and no draw in unit_viking.ice_archer_windup (running, forward hand empty) - TABS: bow vertical at arm's length, the ice arrow drawn to the chest (ref: .jpg)
  (struck 1 at 406: a slender curved strung crystal bow, no spike fringe)
c PASS (401; CONFIRM 405)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a team coat - blocker 2: an ICE_ARCHER_COAT team shell over the trunk with a belted skirt to mid-thigh (the headbutter's 408 tunic cut) - ref: .red.png - ours: lineup_viking.png
2. [S] a hip quiver - blocker 3: a large brown leather quiver slab at the right hip in place of the back tube - ref: .red.png - ours: lineup_viking.png
3. [S] b windup draw - blocker 3: the bow raised vertical at arm's length with the ice arrow drawn to the chest - ref: .jpg - ours: unit_viking.ice_archer_windup.png
## Attempts (iter | gap | criterion | verdict)
395-405 | ice crust; round cap; iceArrow; frost ribbon (399 rejected); icicle comb (c PASS); mantle; cap line; brawlerLegs; band [S] | a,c | approved; CONFIRM 405 failed a, b
406 | ICE_BOW recut: slender recurve, flake crust, no fringe or snowball (8dbee1a) | b | approved (struck 1)
407 | ICE_UPRIGHT: upright carry across her front, iceBowCarry mark (1936db1 + a65dfd2) | b | approved (2 stands)
408 | ICE_ARCHER_SNOWCAP: ruff ring and teeth gone, snow lumps on each shoulder top (ea60323) | a | approved (struck 1)
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 407 critic: the stave crosses her front at ~45 deg on screen, upper tip at the hat band (TABS ~63 deg); ICE_UPRIGHT.tip is not re-nudgeable as [P].
- 405 CONFIRM: a.2 was a viking_fur trunk tint (red-team brown-mauve); the headbutter's 408 team tunic shell cleared the same fault.
- 403: head-hung caps are seated off the eye beads' tops (eyeTopInHead).
