# dynasty.hwacha
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 2. timber colour in unit_dynasty.hwacha_idle: near-black - TABS: light orange-brown wood (ref: dynasty.hwacha.red.png)
 3. wheels in unit_dynasty.hwacha_idle: a solid dark disc - TABS: two spoked octagonal wooden wheels (ref: dynasty.hwacha.jpg)
 4. shafts in unit_dynasty.hwacha_idle: a flat team-blue tray - TABS: two long brown shafts with team-coloured end caps (ref: dynasty.hwacha.red.png)
  (struck 1 at 416: an upright 10x6 lattice)
b PASS (416: rocket heads in the grid facing the target, by 50d2eac3)
c FAIL (1 since 411)
 2. launch smoke in unit_dynasty.hwacha_release: none - TABS: a white smoke cloud billowing from the rack as the volley leaves (ref: dynasty.hwacha.jpg)
  (struck 1 at 416: banded rocket tubes with flame trails)
d PASS (cost 1500, hp 2.52x, dmg 2.24x, cd 3.51x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a timber - blocker 2: HWACHA_RACK.wood (.72,.45,.24) -> a brighter orange-brown from palette.png so the frame reads orange (fallout of 50d2eac3) - shows in unit_dynasty.hwacha_idle
2. [S] a wheels - blocker 3: two spoked octagonal wooden wheels (8-segment rim, 8 spokes, hub) in place of the solid disc - ref: dynasty.hwacha.jpg - ours: unit_dynasty.hwacha_idle.png
3. [S] c launch smoke - blocker 2: a white faceted smoke cloud swelling from the rack face through the volley - ref: dynasty.hwacha.jpg - ours: unit_dynasty.hwacha_release.png
4. [S] a shafts - blocker 4: two long brown shafts with team end caps in place of the team tray - ref: dynasty.hwacha.red.png - ours: unit_dynasty.hwacha_idle.png
## Attempts (iter | gap | criterion | verdict)
416 | HWACHA_RACK: upright light-wood lattice, 10x6 diamond heads (50d2eac3) | a | approved (struck 1; b PASS)
416 | HWACHA_ROCKET: banded tube, dark point, unlit flame, smoke (65915a61) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 416 critic: rocket flames thin and pale, puff reads brown (TABS long bright jets); rack wood displays grey-taupe.
- 411 audit: the volley fires and explodes in _struck, which reads.
