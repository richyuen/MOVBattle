# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.chieftain_idle wears a black cap with a yellow ring and red-green rods — TABS: a pale animal skull strapped on top of the head above a chestnut beard (ref: tribal.chieftain.blue.png)
 2. shoulders in unit_tribal.chieftain_idle are bare — TABS: an animal skull on each shoulder as a guard (ref: tribal.chieftain.red.png)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands a head and a half over the clubber — TABS: 1.15x, barely taller than the neighbours (ref: tribal.jpg; card Size 1.15x)
b PASS (319)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a animal-skull helmet — blocker 1: the (domed) SKULL_FACETED bone_mask seated over the crown above the beard, replacing the black cap, ring and rods — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
2. [S] a hide cape — blocker 3: the same rigid brown faceted cape wedge as the bone mage's, shoulders to the thigh — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | stone axe heads (41a51fe) | b | approved
317 | [P] stone size (3ce2f90) | b | approved
318 | lashed stone head (83bec0d + 069541b) | b | approved
319 | lashing bands (c7ea0cc + 8c16992) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: stone_axe, root "handle", both hands. 318: jittered flat icosphere AXE_HEAD 0.78 of L, squash 0.62/0.5, broad face in the handle's y-z plane. 319: AXE_LASH strips (bedded boxes, each diagonal cut to the chunk's rim at its ends, caps over the edges, sleeves on the handle); thin-axis jitter damped to AXE_LASH.bed.
- Critic 319 (minor, b passed): one cap strip stands clear of the rim where the jitter falls short; strips read as lath more than twine. Outside the gap: in _idle the axes hang at belly height, TABS stones above the shoulders.
- a: the helmet should reuse the protector's SKULL_FACETED once it is domed (the [P] on protector.a); hat slot is "feather_headdress" now.
