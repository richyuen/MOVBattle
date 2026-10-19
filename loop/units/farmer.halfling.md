# farmer.halfling
Status: open   Audited: 375 (re), a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 388)
 1. legs in unit_farmer.halfling_idle: the bare shin between the shorts cuff and the foot fur about half the shorts' length, feet almost under the hips - TABS: shins about as long as the shorts, feet well apart (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
 2. foot fur in _idle: a compact dark-brown tuft now, but small and on the outer side of the ankle - TABS: a tuft across the top of each foot, about its width (ref: .red.png)
 3. vest in _idle: team now, but the V a short grey-white triangle to mid-chest on a grey square bib, vest the jacket's blue - TABS: a deep V nearly to the belt, vest lighter (ref: .red.png)
 4. shorts in _idle: light team, near the jacket's - TABS: dark team shorts, clearly darker (ref: .blue.png; card)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a vest - blocker 3: deep V to the belt, lighter vest panels - ref: .red.png - ours: unit_farmer.halfling_idle.png
2. [P] a foot fur (fallout of cd0bed8) - NEXT: HALFLING_TUFT inX .45 -> 0, clump .6 -> .8; tuft centred on the foot top in _idle
3. [P] a vest (fallout of ad8de9a) - NEXT: HALFLING_COAT veeDeep .46 -> deeper, bib narrowed to the V; in _idle
## Attempts (iter | gap | criterion | verdict)
339-383 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff [S] | a,b,c | approved
386-387 | belt ring + buckle (HALFLING_BELT) [S]; stance square on straight legs (HALFLING_STANCE) [S]; belt bar [P] | a | approved
388 | vest cut in a deep V: lower block + two shoulder panels, plain team x .97 (HALFLING_VEST_CUT) [S] (ad8de9a +e1a75a4 +c549a26) | a | approved (narrowed a.3)
389 | foot fur a compact dark tuft inside the foot, farmerDress (HALFLING_TUFT) [S] (cd0bed8 +b505810) | a | approved (narrowed a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair halflingMop. Stance proceduralAnimation HALFLING_STANCE. Probes: loop/scripts/probes/probe_halfling.mjs, probe_mat.mjs <unit> <name regex>.
- 388 probe: vest (.41,.58,.95) vs coat (.36,.51,.83): the front light washes the flat lower block; a lighter vest needs more contrast than x .97 vs x .85.
- "metal" renders black: use cloth + glow.
