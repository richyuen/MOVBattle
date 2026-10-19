# farmer.halfling
Status: open   Audited: 375 (re), a/b 383 (re-audit, new _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 383)
 1. belt in unit_farmer.halfling_idle: a thin pale band, buckle a small white bar on the shorts' waistline — TABS: broad dark belt, big grey square-frame buckle on the light vest (ref: .red.png, .blue.png)
 2. legs in _idle: deep crouch, knees bent, shins a sliver between the cuff and the fur — TABS: upright stance, bare shins knee to ankle about as long as the shorts (ref: .blue.png, factions/farmer.jpg)
 3. feet in _idle: foot fur a wide starburst of long spikes splayed on the ground past the feet — TABS: a compact brown tuft on top of each team foot (ref: .red.png)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
0. evidence: _idle looks down ~45 deg (383 pitch PI/2.9 for the small rig), foreshortening his legs (part of blocker 2) — lower toward eye level, keep the boulder off his head (capture.mjs)
1. [S] a belt — blocker 1: broad dark belt band on the vest above the shorts, big grey square-frame buckle fully on the vest (farmerDress HALFLING_BELT) — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [P] a feet (fallout of d9365dd) — NEXT: [P] unitFactory.ts HALFLING_FEET long .55 -> .3, splay 1.0 -> .6; shows in unit_farmer.halfling_idle.png, the fur starburst shrinks to a tuft on each foot
## Attempts (iter | gap | criterion | verdict)
339-381 | mitts, mop, jacket/vest/shirt, shorts + belt, feet, Jump, Grab; coat; sleeves; belt [S] | a,b,c | approved
382 | bushy mop: 46 flat locks on a cap (HALFLING_MOP) [S] (1a97f99 +fd22501) | a | approved
383 | shorts end in a lighter cuff at .78 of the thigh, foot fur low (HALFLING_SHORTS, HALFLING_FEET) [S] (d9365dd) | a | approved
383 | mop locks 40% shorter, 50% wider, more droop (HALFLING_MOP) [P] (e8852bb) | a | approved (struck hair)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair farmerDress halflingMop. Probe: output/loop/probe_halfling.mjs.
- "metal" material renders black (no environment map): use cloth + glow for grey metal.
- 383 evidence: _idle face check flips back instead of a second swing; small rig pitch PI/2.9 (boulder off his head).
