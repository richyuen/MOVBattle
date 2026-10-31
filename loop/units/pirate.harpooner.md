# pirate.harpooner
Status: done   Audited: 422, 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed a, c; failed b), 436 (CONFIRM: failed a, b; a restored by the 438 review), 439 (CONFIRM: passed b; a, c confirmed)   Done: 439
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (434 CONFIRM; the 438 review restored it)
b PASS (438; CONFIRM 439: two-handed carry, team drum, grey ribbed muzzle down-forward, harpoon out of it)
c PASS (426: shoot, reel, kick; CONFIRM 431, 434, 436)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
423-434 | HARPOON_BREECH, OFF_GRIP, TRICORN_BROWN, reel, OPEN_COAT, KICK, BAYONET, BEARD, scale, PANTS, SHOES | a,b,c | approved (c PASS)
435-438 | HARPOON_BAYONET spike; HARPOON_REST hip carry; [R] gun carry (0799890a); off fist on the bar (da4b3767) | b | approved (b PASS 438)
439 | CONFIRM b passed | b | done
## Rejected (last 4)
## Notes (max 3 lines)
- Gun: propBuilder case harpoon (HARPOON_BREECH [R] 437 spec); anim _restHarpoon, _gripHarpoon; sim _reelIn, _landKicks.
- CONFIRM 439: the gun body reaches the chest (render: the waist), minor; the bayonet does not read at this distance.
