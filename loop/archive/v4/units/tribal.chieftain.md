# tribal.chieftain
Status: done   Audited: 360   Done: 367
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (367)
b PASS (364)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
320-324 | skull helm, pauldrons, beard, cape, [P] scale | a | approved
361-362 | off axe stood up (OFF_AXE) [S]; stone axe re-hafted (STONE_AXE) [S] | b | approved
363 | beast skull helm (BEAST_SKULL) [S] (03e92ab +e52aaa4) | a | approved
364 | hide wrap and hip tusks (CHIEF_LOIN) [S]; main axe upright (MAIN_AXE) [S] | a,b | approved
365 | skull helm re-seated level, eyes top-front (BEAST_SKULL.sink/eye*) [S] (7d98745) | a | approved
366 | pauldrons: head-wide tan beast skulls, googly eye (PAULDRON) [S] (0a99945 +d78d6f7 +65e6573) | a | approved
367 | full beard: sideburns, jaw mass, chest bib, moustache (chieftainBeard, CHIEF_BEARD) [S] (6c66d85) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat "beast_skull". _standMainAxe mirrors the off arm outside attacks. Beard: chieftainBeard (his own; tribalBeard stays for clubber/wheelbarrow).
- critic 364/366 (minor): wrap a short tutu, tusks near-white; pauldron muzzle short. critic 367 (minor): sideburns read as posts, beard a shade caramel.
- Never bakeCurrentTransformIntoVertices after parenting: it bakes the world matrix (the 366 muzzle flew off).
