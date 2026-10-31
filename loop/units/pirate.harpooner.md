# pirate.harpooner
Status: open   Audited: 422, 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed a, c; failed b), 436 (CONFIRM: failed a, b; a restored by the 438 review)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (434 CONFIRM; the 438 review restored it: 436's CONFIRM re-failed the same lean, see Notes)
b PASS (438: both fists on the gun, the off fist across the body on the carry bar; awaits CONFIRM)
c PASS (426: shoot, reel, kick; CONFIRM 431, 434, 436)
d PASS (cost 300, hp 3.38x, dmg 0.29x, cd 1.80x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
423-434 | HARPOON_BREECH, OFF_GRIP, TRICORN_BROWN, reel, OPEN_COAT, KICK, BAYONET, BEARD, scale, PANTS, SHOES | a,b,c | approved (c PASS)
435-436 | HARPOON_BAYONET spike (1026d70e); HARPOON_REST hip carry (b4465c82) | b | approved (struck 1, 2; CONFIRM 436 failed a, b)
437 | [R] gun carry: team drum main mass, short fat grey muzzle, long carry bar, both fists (0799890a) | b | approved (struck 2)
438 | off fist settled onto the carry bar (_gripHarpoon settle 2) (da4b3767) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Proposed done at the 438 review: CONFIRM b alone at 439 (a, c confirmed). 436's a list, kept as a hint only: upright slim body, orange/tan lapel and cuff trim, three-point tricorn, beige pants.
- 438 critic: the off fist is on the bar at the belly, not a raised top handle (minor).
- Gun: propBuilder case harpoon (HARPOON_BREECH [R] 437 spec); anim _restHarpoon, _gripHarpoon; sim _reelIn, _landKicks.
