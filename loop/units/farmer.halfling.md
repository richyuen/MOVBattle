# farmer.halfling
Status: open   Audited: 375 (re), a 379 (re-aimed _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 379)
 2. belt in _idle: a thin dark band with a grey buckle now shows, but the shorts' waist swallows the buckle's lower half (reads as a small clip), band a third of TABS height — TABS: broad dark belt, big grey square-frame buckle fully on the light vest (ref: .red.png, .blue.png). Vest fixed 381.
 3. legs in _idle: shorts show now, shins barely visible above the hairy feet — TABS: dark knee shorts clear below the hem, bare shins (ref: .blue.png, factions/farmer.jpg)
 4. hair in _idle: smooth mid-brown slab bob — TABS: bushy spiky dark reddish-brown locks past ears and jaw (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bushy hair — blocker 4: spiky splayed lock clumps, dark reddish-brown (farmerDress) — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [P] a belt — blocker 2: HALFLING_BELT up .08->.2, tall .13->.2, buckle .3->.38; shows in unit_farmer.halfling_idle as a full square buckle clear of the shorts (fallout of 8cb455f)
## Attempts (iter | gap | criterion | verdict)
339-345 | mitts, mop, jacket/vest/shirt, shorts + belt, hairy feet, Jump, Grab [S] | a,b,c | approved
375-376 | hanging locks (SHAGGY); open coat (HALFLING_COAT) [S] | a | approved
377 | belt glow, buckle proud [P] (ee71b48, reverted) | a | dropped (waist unreadable)
380 | jacket shell + yoke, sleeves to the wrist, hem .1 (HALFLING_SLEEVED) [S] (b0e0351 +b52f817) | a | approved (struck a.1)
381 | dark team belt, grey square-frame cloth buckle + pin (HALFLING_BELT) [S] (8cb455f) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts (seat top at waist +.06H) + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket. Probe: output/loop/probe_halfling.mjs.
- "metal" material renders black (no environment map): use cloth + glow for grey metal.
- Critic 380 minor: a raised shell edge shows behind the neck on his left shoulder (TABS flat folded collar).
