# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. chin in unit_tribal.chieftain_idle is bare team colour (320: the pale skull is on) — TABS: a chestnut beard under the skull (ref: tribal.chieftain.blue.png)
 2. shoulders in unit_tribal.chieftain_idle are bare — TABS: an animal skull on each shoulder as a guard (ref: tribal.chieftain.red.png)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands a head and a half over the clubber — TABS: 1.15x, barely taller than the neighbours (ref: tribal.jpg; card Size 1.15x)
b PASS (319)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skull pauldrons — blocker 2: a faceted animal skull (bone_mask mesh) strapped to each upper arm — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
2. [S] a beard — blocker 1: a faceted chestnut beard chunk under the skull — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
3. [S] a hide cape — blocker 3: the bone mage's dressTribalCape (TRIBAL_CAPE_UNITS), shoulders to the thigh, replacing the small "cape" special — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
317 | [P] stone size (3ce2f90) | b | approved
318 | lashed stone head (83bec0d + 069541b) | b | approved
319 | lashing bands (c7ea0cc + 8c16992) | b | approved
320 | animal-skull helmet (f86e35f) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: stone_axe, root "handle", both hands. 318: jittered flat icosphere AXE_HEAD; 319: AXE_LASH bedded strips.
- 320: hat bone_mask (unitVisuals; the hair mop drops under it). Special "cape" is propBuilder's shared small box (7 units use it): do not edit it, move the chieftain to dressTribalCape instead.
- _idle is from behind/side: a beard shows little there; an evidence commit for a frontal idle may be needed before the beard gap.
