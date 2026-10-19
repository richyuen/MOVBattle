# farmer.halfling
Status: open   Audited: 375 (re), a 379 (re-aimed _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 379)
 2. belt in _idle: thin band, buckle half swallowed by the shorts' waist — TABS: broad dark belt, big grey square-frame buckle fully on the light vest (ref: .red.png, .blue.png)
 3. legs in _idle: shins barely visible above the hairy feet — TABS: dark knee shorts clear below the hem, bare shins (ref: .blue.png, factions/farmer.jpg)
 4. hair in _idle: now a dark-brown spiky mop, but long thin spikes radiating out about twice the head's width, crown locks bursting up — TABS: bushy clumped locks hugging the head, past ears to the jaw, shaggy not spiky (ref: .red.png, .blue.png)
b PASS (375)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
0. evidence: unit_farmer.halfling_idle shows him turned away (critic 382) — re-aim it to the front three-quarter before a/b gaps (capture.mjs)
1. [P] a hair — blocker 4: HALFLING_MOP lock length ~-40%, width +50%, more droop; shows in unit_farmer.halfling_idle hair outline (fallout of 1a97f99)
2. [S] a shorts/shins — blocker 3: shorts hem to the knee, bare shins clear — ref: .blue.png — ours: unit_farmer.halfling_idle.png
3. [P] a belt — blocker 2: HALFLING_BELT up .08->.2, tall .13->.2, buckle .3->.38; shows in _idle as a full square buckle clear of the shorts (fallout of 8cb455f)
## Attempts (iter | gap | criterion | verdict)
339-376 | mitts, mop, jacket/vest/shirt, shorts + belt, feet, Jump, Grab; locks (SHAGGY); open coat [S] | a,b,c | approved
377 | belt glow, buckle proud [P] (ee71b48, reverted) | a | dropped (waist unreadable)
380 | jacket shell + yoke, sleeves to the wrist (HALFLING_SLEEVED) [S] (b0e0351 +b52f817) | a | approved (struck a.1)
381 | dark team belt, grey square-frame buckle + pin (HALFLING_BELT) [S] (8cb455f) | a | approved
382 | bushy mop: 46 flat locks on a cap, splayed out, droop (HALFLING_MOP) [S] (1a97f99 +fd22501) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; hair farmerDress halflingMop. Probe: output/loop/probe_halfling.mjs.
- "metal" material renders black (no environment map): use cloth + glow for grey metal.
- 381/382 _idle frames him from behind after the leap at 17 ms (rig .69).
