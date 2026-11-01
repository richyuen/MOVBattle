# wild_west.gunslinger
Status: open   Audited: 444, 448 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 448; CONFIRM list)
  (struck 1 at 449)
 2. arm pose in unit_wild_west.gunslinger_idle — ours: both arms held straight out to the sides at shoulder height, scarecrow-like; TABS: the arms hang down, a little out from the hips, with the revolvers held low beside the thighs (ref: red.png, .blue.png; wild_west.jpg centre figure)
 3. gun belt in unit_wild_west.gunslinger_idle — ours: no belt or holsters at the waist; TABS: a dark brown belt with two dark holsters on the hips, just below the jacket's buttons (ref: red.png; card Appearance "two empty gun holsters")
 4. footwear in unit_wild_west.gunslinger_idle — ours: chunky blue-grey cuffed boots in the trouser tone; TABS: small black shoes under straight trouser legs (ref: blue.png; card Appearance "black shoes")
b PASS (446: two dark revolvers in each fist; CONFIRM 448)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts; CONFIRM 448)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 449 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a gun belt - blocker 3: wildWestDress gunslingerBelt, dark brown belt with two dark holsters on the hips under the buttons - ref: red.png - ours: unit_wild_west.gunslinger_idle (CONFIRM 448, critic 449)
2. [S] a arm pose - blocker 2: arms hanging low with the revolvers beside the thighs at rest (own rest pose, not "gunner") - ref: blue.png - ours: unit_wild_west.gunslinger_idle (critic 449)
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
445-446 | REVOLVER, BOWLER, REVOLVER pair, GUNSLINGER_JACKET (4a52867e ... 75a14901) | a, b | approved (b PASS)
447 | GUNSLINGER_TIE violet knot + widening blade down the shirt V (28aec26d) | a | approved (struck 3; 2 by lineup)
448 | GUNSLINGER_SIDEBURNS black bushy lumps down both cheeks (7082f6e9) | a | approved (struck 4; a PASS, then CONFIRM failed a)
449 | no wildwest_leather preset + GUNSLINGER_SUIT team cloth x.8 on every bodyMaterial mesh and the coat skirts (b52941b5, 129f319c) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 449: red-team wild_west body cloth reads tan (faction tint + warm hue shift in unitFactory's clothed recolour), not only the leather preset.
- 449 critic: blue-team jacket reads pale grey-blue (TABS navy); face and hands now share the suit tone (bodyMaterial on the head too) - notes, not blockers.
- CONFIRM 448 extra misses: coat skirt to mid-thigh (TABS to the hip); no pink pocket square. The arms-out idle is the "gunner" posePreset.
