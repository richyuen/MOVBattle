# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 315)
 1. (struck 323: chestnut beard)
 2. (struck 322: skull pauldrons)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands taller than the neighbours — TABS: 1.15x, barely taller (ref: tribal.jpg; card Size 1.15x)
b PASS (319)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hide cape — blocker 3: the bone mage's HIDE_CAPE (dressTribalCape, TRIBAL_CAPE_UNITS) to the thigh, replacing the small "cape" special and the dark collar — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
2. [P] a scale — blocker 4: unitVisuals.ts tribal.chieftain proportions.scale down so he reads ~1.15x (stats show 1.35), head level with the bone mage's in lineup_tribal; critic 323 fallout of a743b12 (pickable through 326) — ref: reference/factions/tribal.jpg — ours: lineup_tribal.png
## Attempts (iter | gap | criterion | verdict)
318 | lashed stone head (83bec0d + 069541b) | b | approved
319 | lashing bands (c7ea0cc + 8c16992) | b | approved
320 | animal-skull helmet (f86e35f) | a | approved
322 | skull pauldrons (dfa7bbc) | a | approved
323 | chestnut beard (a743b12) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 320: hat bone_mask (the mop drops under it). Special "cape" is propBuilder's shared small box (7 units): do not edit it, move him to dressTribalCape.
- 322: dressTribalPauldrons (PAULDRON). Critic 322: skull too white, big round sockets; fur collar still on (TABS critter-skull and fangs necklace, not listed).
- 323: HAIR_STYLES "beard" (tribalBeard, CHESTNUT); shows in lineup_tribal, not the from-behind _idle.
