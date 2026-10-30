# dynasty.hwacha
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 411)
 2. timber colour in unit_dynasty.hwacha_idle: near-black - TABS: light orange-brown wood (ref: dynasty.hwacha.red.png)
  (struck 1 at 416: lattice; 3 at 418: wheels; 4 at 419: brown shafts, timber bed)
b PASS (416: rocket heads in the grid facing the target, by 50d2eac3)
c PASS (419: white faceted launch smoke off the rack, eab9d337)
d PASS (cost 1500, hp 2.52x, dmg 2.24x, cd 3.51x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a timber - blocker 2 (colour-only: judged on a --noglow swatch): a dedicated light orange-brown HWACHA_TIMBER for rack, bed and wheels, picked from output/loop/palette.png - ref: dynasty.hwacha.red.png - ours: unit_dynasty.hwacha_idle.png
## Attempts (iter | gap | criterion | verdict)
416 | HWACHA_RACK: upright light-wood lattice, 10x6 diamond heads (50d2eac3) | a | approved (struck 1; b PASS)
416 | HWACHA_ROCKET: banded tube, dark point, unlit flame, smoke (65915a61) | c | approved (struck 1)
418 | HWACHA_WHEEL octagonal rim, 8 spokes, dark hub (914ede94) | a | approved (struck 3)
419 | LAUNCH_SMOKE cloud off the rack (eab9d337) | c | approved (c PASS)
419 | HWACHA_SHAFT shafts + timber bed, hidden team core (3d8cd05d) | a | approved (struck 4)
## Rejected (last 4)
## Notes (max 3 lines)
- 419 critic: the shafts' front ends stub up through the bed front; TABS shafts curve up at the rear; smoke half rack size (LAUNCH_SMOKE.to .9 if needed).
- 416 critic: rocket flames thin and pale, puff reads brown (TABS long bright jets); rack wood displays grey-taupe.
- 411 audit: the volley fires and explodes in _struck, which reads.
