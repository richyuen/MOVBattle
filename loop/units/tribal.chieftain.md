# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.chieftain_idle wears a black cap with a yellow ring and red-green rods — TABS: a pale animal skull strapped on top of the head above a chestnut beard (ref: tribal.chieftain.blue.png)
 2. shoulders in unit_tribal.chieftain_idle are bare — TABS: an animal skull on each shoulder as a guard (ref: tribal.chieftain.red.png)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands a head and a half over the clubber — TABS: 1.15x, barely taller than the neighbours (ref: tribal.jpg; card Size 1.15x)
b FAIL (2 since 315)
 1. (struck 316: stone axe heads)
 2. (struck 318: lashed stone head)
 3. rope in unit_tribal.chieftain_windup and _idle is a loose hoop standing off the stone (idle: a ring hanging in the air beside the chunk; windup: an ellipse wider than the chunk across its face) — TABS: twine bound tight over the stone and round the handle top, crossing in an X at the joint, hugging the surfaces (ref: tribal.chieftain.red.png)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b lashing bands — blocker 3: flat rope strips laid on the chunk's broad faces crossing in an X, joined over the top and bottom edges and wrapped round the handle top, replacing the tori — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_windup.png
2. [S] a animal-skull helmet — blocker 1: a pale skull chunk strapped on top of the head over a chestnut beard, replacing the cap, ring and rods — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | stone axe heads (41a51fe) | b | approved
317 | [P] stone size (3ce2f90) | b | approved
318 | lashed stone head (83bec0d + 069541b) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: stone_axe, root "handle", both hands. 318: jittered flat icosphere AXE_HEAD 0.78 of L, squash 0.62/0.5, rotation (0.1, PI/2, 0) so the broad face is the handle's y-z (swing) plane, centre +z 0.24*AXE_HEAD*L; two tori AXE_LASH at z 0.05 L.
- Critic 318: head-wide now. Outside the gap: in _idle the axes hang at belly height, TABS stones above the shoulders (carry pose).
