# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 360)
 1. body in unit_tribal.mammoth_windup (also _ability): back runs straight mane to rump, flat flank and underside — TABS: rounded barrel, round sagging belly, hump behind the head (ref: tribal.mammoth.red.png, .jpg). Critic 366: those shots crop the topline, hump cannot be judged: re-aim first (evidence commit, a side frame pulled back to the whole hull)
 2. legs in unit_tribal.mammoth_windup: fat straight drums as wide as the head — TABS: stubby legs about half the body's depth, tapering to a slightly flared foot (ref: tribal.mammoth.blue.png)
 3. ears not visible in unit_tribal.mammoth_windup — TABS: a small rounded flap behind each eye (ref: tribal.mammoth.red.png)
 4. leg tops in unit_tribal.mammoth_ability_after (also _windup): rounded fur domes now, but still bulging out in front of the flank like pillars pressed on — TABS: the flank's fur drapes over the leg roots, no top shows (ref: tribal.mammoth.red.png)
b PASS (366)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a ears — blocker 3: a small rounded faceted fur flap behind each eye on the head sides (buildMammoth) — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_windup.png
2. [S] a leg tops — blocker 4: a fur hem of jittered lobes off the lower flank hanging over the thigh roots (mammothBarrel) — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_ability_after.png
## Attempts (iter | gap | criterion | verdict)
323-326 | fur, mane, ankles, face paint; Charge | a,c | approved
363-364 | pillar legs [S]; charge pose + dust [S]; trample ring [S] | a,c | approved
365 | barrel body (MAMMOTH_BARREL) [S] (50ae24c); trunk (MAMMOTH_TRUNK) [S] (0a02077) | a,b | approved
366 | tusk paint: matte tan, tip/gap/stripe (MAMMOTH_TUSK) [S] (ef98856 +ef94f97) | b | approved
366 | skewed hump, haunch flank, domed thigh tops (MAMMOTH_BARREL, MAMMOTH_LEG.thigh) [S] (4bc74c3 +940f9b1) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Particles never show in capture. Body/trunk/tusk paint mammoth only (elephant keeps its own).
- critic 365 (minor): trunk hangs nearly straight down then stops (TABS: reaches forward, last third along the ground). critic 366 (minor): tusk tan a shade pale.
- Tusk/antler tans on "bone"/"wood" PBR read grey under the sky: use "cloth" (matte).
