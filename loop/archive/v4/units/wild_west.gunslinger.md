# wild_west.gunslinger
Status: done   Audited: 444, 448 (CONFIRM: passed b, c; failed a), 453 (CONFIRM: passed a, b, c)   Done: 453
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: team suit, bowler, sideburns, purple tie, gun belt, revolvers low by the thighs, small black shoes; CONFIRM 453)
b PASS (446: two dark revolvers in each fist; CONFIRM 448)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts; CONFIRM 448)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 453 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
445-446 | REVOLVER, BOWLER, REVOLVER pair, GUNSLINGER_JACKET (4a52867e ... 75a14901) | a, b | approved (b PASS)
447 | GUNSLINGER_TIE violet knot + widening blade down the shirt V (28aec26d) | a | approved (struck 3; 2 by lineup)
448 | GUNSLINGER_SIDEBURNS black bushy lumps down both cheeks (7082f6e9) | a | approved (struck 4; a PASS, then CONFIRM failed a)
449 | no wildwest_leather preset + GUNSLINGER_SUIT team cloth x.8 on every bodyMaterial mesh and the coat skirts (b52941b5, 129f319c) | a | approved (struck 1)
451 | GUN_BELT wildWestDress gunBelt dark belt at the trunk's foot, holster each hip (709dbc19) | a | approved (struck 3)
452 | GUNSLINGER_REST _aimPistol low rest in Idle/Walking for a revolverTwin gun: fists by the thighs, barrels dipped .75 (608df0a6) | a | approved (struck 2)
453 | GUNSLINGER_SHOES small black shoes, feet cut .82, low shoe top (de84002b) | a | approved (struck 4; a PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- 449: red-team wild_west body cloth reads tan (faction tint + warm hue shift in unitFactory's clothed recolour), not only the leather preset.
- 451 critic: the belt sits at the trunk's foot with the coat skirt below it (TABS on the trousers' top) - not a blocker. CONFIRM 448 extra: coat skirt to mid-thigh (TABS to the hip); no pink pocket square.
- 452 critic: the rest barrels point 60-70 deg down (TABS ~45 deg, splayed out; GUNSLINGER_REST.dip) - not a blocker.
