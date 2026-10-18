# tribal.chieftain
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. chin in unit_tribal.chieftain_idle is bare team colour (320: the pale skull is on) — TABS: a chestnut beard under the skull (ref: tribal.chieftain.blue.png)
 2. (struck 322: skull pauldrons)
 3. back in unit_tribal.chieftain_idle is bare — TABS: a brown hide cape to the thigh (ref: tribal.chieftain.blue.png, card Appearance)
 4. scale in lineup_tribal: ours stands taller than the neighbours — TABS: 1.15x, barely taller (ref: tribal.jpg; card Size 1.15x)
b PASS (319)
c PASS (315)
d PASS (stats 317: cost 400=400, hp 0%, dmg -1%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a chestnut beard — blocker 1: the clubber's BEARD chunk (940436d) in chestnut under the skull helm — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
2. [S] a hide cape — blocker 3: the bone mage's dressTribalCape (TRIBAL_CAPE_UNITS) to the thigh, replacing the small "cape" special — ref: tribal.chieftain.blue.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | lashed stone head (83bec0d + 069541b) | b | approved
319 | lashing bands (c7ea0cc + 8c16992) | b | approved
320 | animal-skull helmet (f86e35f) | a | approved
322 | skull pauldrons (dfa7bbc) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 320: hat bone_mask (the mop drops under it). Special "cape" is propBuilder's shared small box (7 units): do not edit it, move him to dressTribalCape.
- 322: dressTribalPauldrons (tribalDress.ts, PAULDRON, on the shoulder joints). Critic 322: skull too white with big round sockets (cow read), TABS tan, small eye, long snout; fur collar still on (TABS critter-skull and fangs necklace, not listed).
- _idle is from behind/side: the beard shows in lineup_tribal (frontal), as the clubber's did.
