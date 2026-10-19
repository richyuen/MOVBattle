# farmer.halfling
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 375)
 2. jacket in unit_farmer.halfling_idle: open coat, vest and white V now present, but the coat reads as a stiff box standing off the trunk and the belt shows tan-ochre with no grey buckle visible — TABS: long open team jacket past the belt over a lighter vest, white collared shirt, dark belt with grey buckle (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a jacket — blocker 2 (fallout of e8d2448): HALFLING_COAT belt colour dark brown with a lower glow, buckle proud of the vest — NEXT shot: lineup_farmer, unit_farmer.halfling_idle (the waist)
## Attempts (iter | gap | criterion | verdict)
339-345 | mitts, mop, jacket/vest/shirt, shorts + belt, hairy feet, Jump, Grab [S] | a,b,c | approved
375 | mop of hanging locks in two tiers to the jaw and nape (SHAGGY) [S] (d04eef6) | a | approved
376 | open coat: walls, hinged fronts, lapels, vest, V, belt + buckle (farmerDress HALFLING_COAT) [S] (e8d2448) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- He is tiny in unit_farmer.halfling_idle (rig .69 m, camera s clamps at 1); lineup_farmer shows the coat best.
- Critic 375 minor: fringe low enough to clip the top of the eyes. 345: he floats against the man rather than gripping (_holdClings).
- dressHalfling (unitFactory) keeps only the shorts and feet; coat, vest, V, belt are farmerDress halflingJacket.
