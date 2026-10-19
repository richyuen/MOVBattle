# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 360)
 1. body in unit_tribal.mammoth_windup (also _ability): a 14-sided barrel now, rump round in lineup_tribal, but from the side the back runs straight from the mane to the rump, no hump, flat-faced flank and underside — TABS: rounded barrel, round sagging belly, hump behind the head (ref: tribal.mammoth.red.png, .jpg)
 2. legs in unit_tribal.mammoth_windup: fat straight drums as wide as the head — TABS: stubby legs about half the body's depth, tapering to a slightly flared foot (ref: tribal.mammoth.blue.png)
 3. ears not visible in unit_tribal.mammoth_windup — TABS: a small rounded flap behind each eye (ref: tribal.mammoth.red.png)
 4. leg tops in unit_tribal.mammoth_ability (also _windup): flat cut drum tops stand clear of the hull where the barrel narrows — TABS: legs grow out of the body under the fur (ref: tribal.mammoth.red.png)
b FAIL (1 since 360)
 1. tusks in unit_tribal.mammoth_windup glowing ivory-white, plain team tip — TABS: bone-tan, team tip, tan gap, stripe (ref: tribal.mammoth.blue.png)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b tusks — blocker 1: an unglowing bone-tan tusk material, team tip / tan gap / team stripe bands — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_windup.png
2. [S] a hump and leg roots — blockers 1+4: hump peak set back behind the mane and taller, hull kept full over the leg roots (mammothBarrel, shrink per end) — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323-326 | fur, mane, ankles, face paint; Charge | a,c | approved
363 | pillar legs [S]; charge pose + dust [S] | a,c | approved
364 | trample ring (spawnTrampleRing, TRAMPLE_RING) [S] (96d2c06) | c | approved
365 | barrel body (mammothBarrel, MAMMOTH_BARREL) [S] (50ae24c) | a | approved
365 | trunk: fur tube to the ground, flat dots (mammothTrunk, MAMMOTH_TRUNK) [S] (0a02077) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Particles never show in capture: sprites. Body/trunk mammoth only (elephant keeps ellipsoid, hump, ridge, hem, trunk pieces).
- critic 365 (minor): trunk hangs nearly straight down then stops (TABS: reaches forward, last third along the ground); mane covers the hump.
- critic 364 (minor): trample ring reads as low haze.
