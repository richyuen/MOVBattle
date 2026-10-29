# viking.ice_archer
Status: open   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM), 411 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (411; CONFIRM 411)
b FAIL (0 since 411; the CONFIRM's list)
 1. bow not gripped (both hands float forward empty while the ice bow stands leaning on its own beside him) in unit_viking.ice_archer_idle - TABS: ice bow held in the main hand diagonally across the body, arrow nocked, off hand at the string (ref: reference/units/viking.ice_archer.red.png, .blue.png)
c PASS (401; CONFIRM 405, 411)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b bow in hand - blocker 1: keep the upright diagonal stave of ICE_REST but seat its grip in her fist (solve the bow arm onto the stave grip, or pose the stave about the fist instead of the world) - ref: .red.png - ours: unit_viking.ice_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
395-405 | ice crust; round cap; iceArrow; frost ribbon (399 rejected); icicle comb (c PASS); mantle; cap line; brawlerLegs; band [S] | a,c | approved; CONFIRM 405 failed a, b
406-407 | ICE_BOW recut (8dbee1a); ICE_UPRIGHT carry (1936db1 + a65dfd2) | b | approved (struck 1)
408-409 | ICE_ARCHER_SNOWCAP (ea60323); ICE_ARCHER_COAT (75774b2) | a | approved (struck 1, 2)
409 | DRAWS_BEFORE_LOOSE: she looses from a full draw (8b44250) | b | approved (split 3)
410 | ICE_ARCHER_QUIVER: leather slab at the off hip, back tube off (d6fdbba) | a | approved (none struck: edge-on from the front)
410 | ICE_NOCK + _poseIceNock: drawn string halves, nocked ice arrow (742df8a) | b | approved (struck 3)
411 | LEG_WRAPS on her (4b4db5f) | a | approved (struck 4; 3 struck by lineup; a PASS)
411 | ICE_REST + _restIceBow, the stave posed in the world (e1dc03c) | b | approved (struck 2); CONFIRM 411 failed b: hands empty
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 410 critic: the draw hand rises beside the head while the nock stops at the shoulder; the lower string half passes through the trunk.
- 409: status:freeze is still logged at the decision (383 ms), ahead of the arrow (hit 1400 ms).
- 411 CONFIRM: _restIceBow poses the stave in the world, so it floats beside her empty fists; minor: no wrist fur cuffs, shin bands narrow.
