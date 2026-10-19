# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 360; 1 [S] rejected)
 1. body in unit_tribal.mammoth_windup (also _ability): flat flank and back — TABS: rounded barrel, sagging belly, hump behind the head (ref: tribal.mammoth.red.png, .jpg). Those shots crop the topline: re-aim first (evidence commit, a side frame pulled back to the whole hull)
 2. legs in unit_tribal.mammoth_windup: fat straight drums as wide as the head — TABS: stubby legs about half the body's depth, tapering to a slightly flared foot (ref: tribal.mammoth.blue.png)
 4. leg tops in unit_tribal.mammoth_ability_after (also _windup): fur domes bulging out in front of the flank like pillars pressed on — TABS: the flank's fur drapes over the leg roots, no top shows (ref: tribal.mammoth.red.png)
b PASS (366)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a leg tops — blocker 4: extend the barrel's own lower rings down and out over the leg stations as one continuous faceted skirt, no separate lobes (mammothBarrel) — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_idle.png
2. [S] a legs — blocker 2: leg lathe tapering, narrower than the head, about half the body's depth, slightly flared foot (MAMMOTH_LEG) — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323-326 | fur, mane, ankles, face paint; Charge | a,c | approved
363-364 | pillar legs [S]; charge pose + dust [S]; trample ring [S] | a,c | approved
365 | barrel body (MAMMOTH_BARREL) [S]; trunk (MAMMOTH_TRUNK) [S] | a,b | approved
366 | tusk paint (MAMMOTH_TUSK) [S]; skewed hump, haunch, domed thighs [S] | a,b | approved
367 | ears: shaggy flap behind the eye (MAMMOTH_EAR) [S] (0d9c3d0 +b40c498) | a | approved
367 | fur hem: flank lobe row + half ring per thigh (MAMMOTH_HEM) [S] (c69689e +d55dff7, reverted) | a | rejected
## Rejected (last 4)
- fur hem over the leg roots [S] [1] — 367: separate jittered lobes — read as stacked balls/boulders heaped on the leg tops
## Notes (max 3 lines)
- Particles never show in capture. Body/trunk/tusk/ear paint mammoth only (elephant keeps its own). Ear in coat fur lay flush and vanished.
- critic 365/366 (minor): trunk hangs straight then stops; tusk tan pale.
- Tusk/antler tans on "bone"/"wood" PBR read grey under the sky: use "cloth" (matte).
