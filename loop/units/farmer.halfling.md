# farmer.halfling
Status: open   Audited: 375 (re), a/b 383 (re-audit, new _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 383)
 1. buckle in unit_farmer.halfling_idle: the belt is broad and dark now, but the buckle reads as a solid grey plate with a thin slit — TABS: open dark-grey square frame with a centre bar (ref: .red.png)
 2. legs in _idle: deep crouch, knees bent, shins a sliver between the cuff and the fur — TABS: upright stance, bare shins knee to ankle about as long as the shorts (ref: .blue.png, factions/farmer.jpg)
 3. feet in _idle: foot fur a wide starburst of long spikes splayed past the feet — TABS: a compact brown tuft on top of each team foot (ref: .red.png)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
0. evidence: _idle looks down ~45 deg (pitch PI/2.9 for the small rig), foreshortening his legs (part of blocker 2) — lower toward eye level (capture.mjs)
1. [S] a stance — blocker 2: upright legs, shins as long as the shorts — ref: .blue.png — ours: unit_farmer.halfling_idle.png
2. [S] a feet — blocker 3: compact brown tuft on top of each foot, no ground starburst (HALFLING_FEET) — ref: .red.png — ours: unit_farmer.halfling_idle.png
3. [P] a buckle (fallout of 08cf903) — NEXT: [P] farmerDress.ts HALFLING_BELT.bar .24 -> .14; shows in unit_farmer.halfling_idle.png, the buckle an open frame
## Attempts (iter | gap | criterion | verdict)
339-381 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves [S] | a,b,c | approved
382 | bushy mop: 46 flat locks on a cap (HALFLING_MOP) [S] (1a97f99 +fd22501) | a | approved
383 | shorts cuff at .78 of the thigh, foot fur low (HALFLING_SHORTS, HALFLING_FEET) [S] (d9365dd) | a | approved
383 | mop locks shorter, wider, more droop (HALFLING_MOP) [P] (e8852bb) | a | approved (struck hair)
386 | belt a dark ring under the coat, dark-grey buckle right, keeper (HALFLING_BELT) [S] (08cf903) | a | approved (narrowed a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair farmerDress halflingMop. Probe: output/loop/probe_halfling.mjs.
- "metal" material renders black (no environment map): use cloth + glow for grey metal.
- 383 evidence: _idle face check flips back instead of a second swing; small rig pitch PI/2.9.
