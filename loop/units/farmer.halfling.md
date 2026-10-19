# farmer.halfling
Status: open   Audited: 375 (re), a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 388)
 1. legs in unit_farmer.halfling_idle: the bare shin between the shorts cuff and the foot fur is about half the shorts' length, the feet almost under the hips — TABS: shins about as long as the shorts, feet planted well apart (ref: .blue.png, .red.png) [[S] on leg proportions only; no [P] re-splay]
 2. foot fur in _idle: a wide starburst of long tan-brown spikes splayed past each foot — TABS: a compact dark-brown tuft on top of each team foot (ref: .red.png)
 3. vest in _idle: team-coloured now, but the V a short grey-white triangle to mid-chest on a grey square bib, vest the jacket's blue — TABS: a deep V nearly to the belt, shirt only at collar and V top, vest clearly lighter (ref: .red.png, .blue.png)
 4. shorts in _idle: light team, near the jacket's — TABS: dark team shorts, clearly darker (ref: .blue.png; card Appearance)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a foot fur — blocker 2: a compact low faceted dark-brown tuft of a few short clumps on top of each foot, inside its outline (HALFLING_FEET) — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [P] a vest (fallout of ad8de9a) — NEXT: [P] farmerDress HALFLING_COAT veeDeep .46 -> deeper (V point near the belt), the shirt bib narrowed to the V; shows in unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict)
339-383 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff [S] | a,b,c | approved
386-387 | belt ring + buckle (HALFLING_BELT) [S]; stance square on straight legs (HALFLING_STANCE) [S]; belt bar [P] | a | approved
388 | vest cut in a deep V: lower block + two shoulder panels, plain team x .97 (HALFLING_VEST_CUT) [S] (ad8de9a +e1a75a4 +c549a26) | a | approved (narrowed a.3)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair halflingMop. Stance proceduralAnimation HALFLING_STANCE. Probes: output/loop/probe_halfling.mjs, probe_mat.mjs <unit> <name regex>.
- 388 probe: vest (.41,.58,.95) vs coat (.36,.51,.83): the front light washes the flat lower block; a lighter vest needs more contrast than x .97 vs x .85.
- "metal" renders black: use cloth + glow.
