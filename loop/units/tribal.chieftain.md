# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.chieftain_idle wears a black cap with a yellow ring and red-green rods — TABS: a pale animal skull strapped on top of the head above a chestnut beard (ref: tribal.chieftain.blue.png)
 2. shoulders in unit_tribal.chieftain_idle are bare — TABS: an animal skull on each shoulder as a guard (ref: tribal.chieftain.red.png)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands a head and a half over the clubber — TABS: 1.15x, barely taller than the neighbours (ref: tribal.jpg; card Size 1.15x)
b FAIL (1 since 315)
 1. (struck 316: stone axe heads)
 2. stone in unit_tribal.chieftain_release is a fat faceted chunk now but about two-thirds of his head across (half, at lineup distance) — TABS: as wide as the head, skull cap included (ref: tribal.chieftain.red.png; tribal.chieftain.png larger still)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b lashed stone head — blocker 2: the stone rebuilt head-wide (AXE_HEAD anew at ~0.75 of AXE_LONG) with crossed rope lashing onto the handle top — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_release.png (flips b)
2. [S] a animal-skull helmet — blocker 1: a pale skull chunk strapped on top of the head over a chestnut beard, replacing the cap, ring and rods — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | stone axe heads (41a51fe) | b | approved
317 | [P] stone size (3ce2f90) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: WeaponType stone_axe (heavy_swing family), root "handle" so the animator turns it; both hands (offhandWeapon). 317 [P]: AXE_HEAD 0.55, AXE_HEAD_SQUASH 0.8/0.6 approved; a further [P] on those rows is a re-nudge within 20 iterations, so the remaining size goes through the [S] above.
- Critic: the off-hand stone hides under the forearm in windup (carry pose, not a blocker).
