# farmer.halfling
Status: open   Audited: 375 (re), a 379 (re-aimed _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 379)
 2. belt and vest in _idle: no belt or buckle; a plain light panel with a white V — TABS: lighter team vest under the V, dark belt, big grey square buckle (ref: .red.png, .blue.png)
 3. legs in _idle: shorts show now, shins barely visible above the hairy feet — TABS: dark knee shorts clear below the hem, bare shins (ref: .blue.png, factions/farmer.jpg)
 4. hair in _idle: smooth mid-brown slab bob — TABS: bushy spiky dark reddish-brown locks past ears and jaw (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt and vest — blocker 2: dark belt band, big grey square buckle at the opening, lighter vest panel under the V (farmerDress halflingJacket) — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [S] a bushy hair — blocker 4: spiky splayed lock clumps, dark reddish-brown — ref: .red.png — ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | mitts, mop, jacket/vest/shirt, shorts + belt, hairy feet, Jump, Grab [S] | a,b,c | approved
375-376 | hanging locks (SHAGGY); open coat (HALFLING_COAT) [S] | a | approved
377 | belt glow, buckle proud [P] (ee71b48, reverted) | a | dropped (waist unreadable)
380 | jacket shell + yoke from the shoulders, sleeves to the wrist, hem .1 (HALFLING_SLEEVED) [S] (b0e0351 +b52f817) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket. The existing belt mesh does not read in _idle.
- Babylon cylinder arc runs from +x round through -z; its gap is centred pi (1 - arc) past +x.
- Critic 380 minor: a raised shell edge shows behind the neck on his left shoulder (TABS flat folded collar).
