# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 360)
 1. body in unit_tribal.mammoth_windup, lineup_tribal: flat boxy slabs, straight back — TABS: rounded faceted barrel body, round belly, hump behind the head, dark mane (ref: tribal.mammoth.red.png, .jpg)
 2. legs in unit_tribal.mammoth_windup: brown nine-sided pillars, no caps, flat dots, near-flush stripes now, but fat straight drums as wide as the head — TABS: stubby legs about half the body's depth, tapering to a slightly flared foot (ref: tribal.mammoth.blue.png)
 3. ears not visible in unit_tribal.mammoth_windup — TABS: a small rounded flap behind each eye (ref: tribal.mammoth.red.png)
b FAIL (0 since 360)
 1. tusks in unit_tribal.mammoth_windup glowing ivory-white, plain team tip — TABS: bone-tan, team tip, tan gap, stripe (ref: tribal.mammoth.blue.png)
 2. trunk in unit_tribal.mammoth_windup near-black, raised team knobs — TABS: body brown, reaching the ground, flat painted dots (ref: tribal.mammoth.red.png, .jpg)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a barrel body — blocker 1: rounded faceted barrel hull, round belly, hump behind the head, dark mane chunk — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_windup.png
2. [S] b trunk — blocker 2: trunk in body brown, reaching the ground, flat painted dots — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_release.png
3. [P] a leg taper (fallout of 5d518c2) — blocker 2: MAMMOTH_LEG thigh .37 -> .28, shin .3 -> .22 (radii x.75); NEXT shows in unit_tribal.mammoth_idle as legs tapering under the body
## Attempts (iter | gap | criterion | verdict)
323-326 | fur, mane, ankle bands, face paint | a | approved
323 | Mammoth Charge (7d01e90) | c | approved
363 | fur pillar legs (MAMMOTH_LEG) [S] (5d518c2 +7c6a257 +9b9ed17) | a | approved
363 | charge pose + sprite dust (CHARGE_POSE, MAMMOTH_DUST) [S] (baea514 +d0548b0) | c | approved
364 | trample ring: dust ring, band, earth clods (spawnTrampleRing, TRAMPLE_RING) [S] (96d2c06) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Particles never show in the capture: use sprites (spawnKickDust, spawnTrampleRing). Legs mammoth only (elephant keeps old); pose set by the sim (_chargePosed).
- critic 364 (minor): the trample ring reads as low haze more than a distinct ring.
- 326 face: FACE_PAINT.
