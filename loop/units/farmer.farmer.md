# farmer.farmer
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. shirt in unit_farmer.farmer_idle lacks leaf-cut collar/hem and strap belt (ref: farmer.farmer.blue.png)
b FAIL (1 since 339)
 1. pitchfork in unit_farmer.farmer_idle/_windup carried low and level but in one fist at the butt, off hand off the shaft (two hands only mid-swing) — TABS: both fists on the shaft at rest, held low across the front (ref: farmer.farmer.red.png)
c FAIL (0 since 339)
 1. blow in unit_farmer.farmer_release/_flight is a bare-handed shove — TABS: swing and stab with the pitchfork (ref: card Characteristics)
 2. missing: back-up then lunging stab (ref: card Characteristics)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b off fist solved onto the shaft and the carry held through the windup — blocker 1: _twoHandPole/carry, shaft across the hips, tines past the off hip, off the ground — ref: farmer.farmer.png — ours: unit_farmer.farmer_idle.png
2. [S] c pitchfork swing-and-stab in place of the hand shove — blocker 1 — ref: card Characteristics — ours: unit_farmer.farmer_release.png
3. [S] a shirt — blocker 3: leaf-dagged hem, dagged collar, brown strap belt — ref: farmer.farmer.blue.png — ours: unit_farmer.farmer_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | two-handed pitchfork carried low, curled grey tines (FORK) [S] (151102b) | b | approved
340 | liripipe hood, leaf-cut collar (LIRIPIPE, pointed_cowl rebuilt) [S] (4ccaced) | a | approved
341 | white cuffed socks, brown slip-on shoes (FARMER_SOCK) [S] (3c6b4c5) | a | approved
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +576a2bf +ee4bf48) | b | rejected
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude, shaft "shaft" turned by the carry — off fist floats above the shaft, fork points forward like a couched lance, windup one-handed with tines in the dirt
## Notes (max 3 lines)
- The fork's root mesh is named "shaft" (not in the carry's turnable-prop regex), so the carry tip never turns it; it rides the fist's angle. 342 found carry +z is forward.
- 340 critic: liripipe tapers to a thin horn-like hook; TABS a fat sausage tail near the crown width along most of it.
- 341 critic: shoes read grey-white at lineup distance (TABS brown), sock tops a bit bulky.
