# wild_west.gunslinger
Status: open   Audited: 444, 448 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 448; CONFIRM list)
 1. jacket colour in lineup_wild_west (red team) — ours: the coat, sleeves and coat skirts are tan/khaki and the red shows only on the legs and face; TABS: the whole suit jacket is team red, the same tone as the trousers (ref: wild_west.gunslinger.red.png; card Appearance "jacket ... that is team colored")
 2. arm pose in unit_wild_west.gunslinger_idle — ours: both arms held straight out to the sides at shoulder height, scarecrow-like; TABS: the arms hang down, a little out from the hips, with the revolvers held low beside the thighs (ref: red.png, .blue.png; wild_west.jpg centre figure)
 3. gun belt in unit_wild_west.gunslinger_idle — ours: no belt or holsters at the waist; TABS: a dark brown belt with two dark holsters on the hips, just below the jacket's buttons (ref: red.png; card Appearance "two empty gun holsters")
 4. footwear in unit_wild_west.gunslinger_idle — ours: chunky blue-grey cuffed boots in the trouser tone; TABS: small black shoes under straight trouser legs (ref: blue.png; card Appearance "black shoes")
b PASS (446: two dark revolvers in each fist; CONFIRM 448)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts; CONFIRM 448)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 448 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a team jacket - blocker 1: gunslingerJacket sleeves, lapels and the tunic skirt in team cloth, not body.bodyMaterial (wildwest_leather blend reads tan on red) - ref: red.png - ours: lineup_wild_west (CONFIRM 448, critic 446)
2. [S] a gun belt - blocker 3: dark brown belt with two dark holsters on the hips (share a QUICK_DRAW_BELT-style piece) - ref: red.png - ours: unit_wild_west.gunslinger_idle (CONFIRM 448)
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
445 | REVOLVER + BOWLER (4a52867e, e2029795; 6e54d4ad, b5e033d5) | b, a | approved (struck 1 each)
446 | REVOLVER pair (39b50bf9) + GUNSLINGER_JACKET (75a14901) | b, a | approved (b PASS)
447 | GUNSLINGER_TIE violet knot + widening blade down the shirt V (28aec26d) | a | approved (struck 3; 2 by lineup)
448 | GUNSLINGER_SIDEBURNS black bushy lumps down both cheeks (7082f6e9) | a | approved (struck 4; a PASS, then CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- c fallout (critic 444): the falling streak is not caught in any shot and the blast is a large white glow (BULLET_RAIN.blast .6 -> ~.35).
- CONFIRM 448 extra misses (not on the list): the coat skirt reaches mid-thigh (TABS to the hip); no pink pocket square.
- The idle arms-out pose is the "gunner" posePreset; the revolvers held low beside the thighs needs its own rest pose.
