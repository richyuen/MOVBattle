# farmer.halfling
Status: open   Audited: 375 (re), a/b 383 (re-audit, new _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 383)
 2. legs in _idle: upright now, but the bare shin between cuff and fur is about half the shorts' length, and the feet stand under the hips — TABS: shins about as long as the shorts, feet planted well apart (ref: .blue.png) [387: _idle pitch lowered, 5b88632; re-audit pending]
 3. feet in _idle: foot fur a wide starburst of long spikes splayed past the feet — TABS: a compact brown tuft on top of each team foot (ref: .red.png)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a feet — blocker 3: compact brown tuft on top of each foot, no ground starburst (HALFLING_FEET) — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [P] a legs (fallout of fb699af) — NEXT: [P] proceduralAnimation HALFLING_STANCE spread .22 -> .32; shows in unit_farmer.halfling_idle.png, the feet further apart
## Attempts (iter | gap | criterion | verdict)
339-381 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves [S] | a,b,c | approved
382-383 | bushy mop (HALFLING_MOP) [S]; shorts cuff, foot fur low [S]; mop locks [P] | a | approved
386 | belt a dark ring under the coat, dark-grey buckle right, keeper (HALFLING_BELT) [S] (08cf903) | a | approved (narrowed a.1)
387 | stance: square on straight wide legs, arms hung, never sunk (HALFLING_STANCE) [S] (fb699af) | a | approved (narrowed a.2)
387 | HALFLING_BELT.bar .24 -> .14 [P] (a1902d7) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair farmerDress halflingMop. Stance proceduralAnimation HALFLING_STANCE (found by halflingShortsSeat). Probe: output/loop/probe_halfling.mjs.
- "metal" material renders black (no environment map): use cloth + glow for grey metal.
- _idle: small-rig pitch PI/2.45 (387), swapped side; the face check flips back instead of a second swing.
