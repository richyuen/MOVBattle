# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 360; 1 [S] rejected)
 1. body in unit_tribal.mammoth_windup (also _ability): flat flank and back — TABS: rounded barrel, sagging belly, hump behind the head (ref: .red.png, .jpg). Shots crop the topline: re-aim first (evidence)
 2. legs in unit_tribal.mammoth_windup, _ability_after (critic 372): taper with a flared pad, but still pillars nearly the body's depth, dome wider than the head — TABS: stubby legs half the body's depth, slightly flared foot (ref: .blue.png)
 4. leg tops in unit_tribal.mammoth_ability_after (also _windup): fur domes bulging in front of the flank — TABS: the flank's fur drapes over the leg roots, no top shows (ref: .red.png)
b PASS (366)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a leg tops — blocker 4 (+2): sink the thigh into the hull, the barrel's lower rings run down over the leg stations as one faceted skirt over the dome (no lobes), visible leg half the body's depth — ref: .red.png — ours: unit_tribal.mammoth_windup.png
2. [S] a body — blocker 1: evidence commit first (side frame on the whole hull) — ref: .jpg — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323-366 | fur, mane, ankles, paint, Charge; pillar legs, charge pose, trample; barrel, trunk; tusk paint, hump, domed thighs [S] | a,b,c | approved
367 | ears: shaggy flap behind the eye (MAMMOTH_EAR) [S] (0d9c3d0 +b40c498) | a | approved
367 | fur hem: flank lobe row + half ring per thigh (MAMMOTH_HEM) [S] (c69689e +d55dff7, reverted) | a | rejected
372 | tapering legs, separate flared foot lathe (MAMMOTH_LEG thigh, shin, foot) [S] (721d839) | a | approved
## Rejected (last 4)
- fur hem over the leg roots [S] [1] — 367: separate jittered lobes — read as stacked balls/boulders heaped on the leg tops
## Notes (max 3 lines)
- Particles never show in capture. Body/trunk/tusk/ear paint mammoth only (elephant keeps its own). Tans: "cloth" (matte), not bone/wood PBR.
- critic 365/366 (minor): trunk hangs straight then stops; tusk tan pale.
- Critic 372: a further radius-only change to MAMMOTH_LEG is a ledger reversal.
