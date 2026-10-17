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
 2. swung weapon in unit_tribal.chieftain_release has a flat grey lens of a stone well under his head across — TABS: a fat grey stone the size of the man's head on the wrist-thin handle (ref: tribal.chieftain.png)
c PASS (315)
d PASS (stats 315: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a animal-skull helmet — blocker 1: a pale skull chunk strapped on top of the head replacing the cap and rods — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
2. [P] b stone size — blocker 2: AXE_HEAD 0.42 -> 0.55 plus a new row for the stone squash (0.62, 0.4 -> 0.8, 0.6), fallout of stone axe heads (41a51fe, 316); NEXT: shows in unit_tribal.chieftain_release as a stone the size of his head — ref: tribal.chieftain.png — ours: unit_tribal.chieftain_release.png
## Attempts (iter | gap | criterion | verdict)
316 | stone axe heads (41a51fe) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: new WeaponType stone_axe (heavy_swing family), root named "handle" so the animator turns it; chieftain has it in both hands (offhandWeapon).
- Critic: the off-hand stone hides under the forearm in windup (carry pose, not a blocker); the squash (1, 0.62, 0.4) is what makes the stone a lens.
