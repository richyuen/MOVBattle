# farmer.halfling
Status: open   Audited: 375 (re), a 379 (re-aimed _idle)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 379)
 1. jacket in unit_farmer.halfling_idle: rigid open-topped box off the trunk, rim showing at the neck, bare arms outside it — TABS: team jacket fitted on the shoulders, sleeves to the wrist, lapels, open to just past the belt (ref: .red.png, .blue.png)
 2. belt and vest in _idle: no belt or buckle; a flat light slab with a white V, no vest — TABS: lighter team vest under the V, dark belt, big grey square buckle (ref: .red.png)
 3. legs in _idle: hem near the knee, shorts and shins barely show — TABS: dark knee shorts clear below the hem, bare shins (ref: .blue.png, factions/farmer.jpg)
 4. hair in _idle: smooth mid-brown slab bob — TABS: bushy spiky dark reddish-brown locks past ears and jaw (ref: .red.png)
b PASS (375)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a sleeved fitted jacket, shorter hem — blockers 1+3: replace HALFLING_COAT box walls (farmerDress) with shoulder-hung panels + sleeve tubes on the arm joints, lapels kept — ref: .red.png — ours: unit_farmer.halfling_idle.png
2. [S] a vest, belt and buckle — blocker 2: lighter vest chunk under the V, dark belt + grey square buckle between the fronts — ref: .red.png — ours: unit_farmer.halfling_idle.png
3. [S] a bushy hair — blocker 4: spiky splayed tufts, dark reddish-brown — ref: .red.png — ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict)
339-345 | mitts, mop, jacket/vest/shirt, shorts + belt, hairy feet, Jump, Grab [S] | a,b,c | approved
375-376 | hanging locks (SHAGGY d04eef6); open coat (HALFLING_COAT e8d2448) [S] | a | approved
377 | belt glow, buckle proud [P] (ee71b48, reverted) | a | dropped (waist unreadable)
## Rejected (last 4)
## Notes (max 3 lines)
- Re-audit 379: scale right (rig 0.69 m); failure is cloth shape. A [P] drop/flare nudge on HALFLING_COAT is a ledger reversal; gap 1 replaces it.
- dressHalfling (unitFactory) keeps shorts + feet; coat, vest, V, belt are farmerDress halflingJacket.
