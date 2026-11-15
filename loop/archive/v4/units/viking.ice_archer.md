# viking.ice_archer
Status: done   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM), 411 (CONFIRM), 412 (CONFIRM)   Done: 412
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (411; CONFIRM 411, 412)
b PASS (412; CONFIRM 412)
c PASS (401; CONFIRM 405, 411, 412)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
395-405 | ice crust; round cap; iceArrow; frost ribbon (399 rejected); icicle comb (c PASS); mantle; cap line; brawlerLegs; band [S] | a,c | approved; CONFIRM 405 failed a, b
406-407 | ICE_BOW recut (8dbee1a); ICE_UPRIGHT carry (1936db1 + a65dfd2) | b | approved (struck 1)
408-409 | ICE_ARCHER_SNOWCAP (ea60323); ICE_ARCHER_COAT (75774b2) | a | approved (struck 1, 2)
409 | DRAWS_BEFORE_LOOSE: she looses from a full draw (8b44250) | b | approved (split 3)
410 | ICE_ARCHER_QUIVER: leather slab at the off hip, back tube off (d6fdbba) | a | approved (none struck: edge-on from the front)
410 | ICE_NOCK + _poseIceNock: drawn string halves, nocked ice arrow (742df8a) | b | approved (struck 3)
411 | LEG_WRAPS on her (4b4db5f) | a | approved (struck 4; 3 struck by lineup; a PASS)
411 | ICE_REST + _restIceBow, the stave posed in the world (e1dc03c) | b | approved (struck 2); CONFIRM 411 failed b: hands empty
412 | grip seated on the fist in the world (6ae7e0f + c508944) | b | approved (struck 1; b PASS); CONFIRM passed - done
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 412 CONFIRM (minor): paler skin than the render, thin knee wraps, no wrist cuffs; the off hand empty at rest.
- 410 critic: the draw hand rises beside the head while the nock stops at the shoulder; the lower string half passes through the trunk.
- 409: status:freeze is still logged at the decision (383 ms), ahead of the arrow (hit 1400 ms).
