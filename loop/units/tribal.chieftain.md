# tribal.chieftain
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 360)
 4. beard in unit_tribal.chieftain_idle, lineup_tribal: a wisp at the chin — TABS: full chestnut beard cheek to chest (ref: tribal.chieftain.red.png)
b PASS (364)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard — blocker 4: a full faceted jittered chestnut beard, sideburn to sideburn over the cheeks and hanging to the upper chest under the muzzle (tribalDress.ts) — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
320-324 | skull helm, pauldrons, beard, cape, [P] scale | a | approved
361-362 | off axe stood up (OFF_AXE) [S]; stone axe re-hafted (STONE_AXE) [S] | b | approved
363 | beast skull helm (BEAST_SKULL) [S] (03e92ab +e52aaa4) | a | approved
364 | hide wrap and hip tusks (CHIEF_LOIN) [S]; main axe upright (MAIN_AXE) [S] | a,b | approved
365 | skull helm re-seated level, eyes top-front (BEAST_SKULL.sink/eye*) [S] (7d98745) | a | approved
366 | pauldrons: head-wide tan beast skulls, googly eye (PAULDRON) [S] (0a99945 +d78d6f7 +65e6573) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat "beast_skull" (363, re-seated 365). _standMainAxe mirrors the off arm outside attacks. Pauldron meshes pauldronSkull*/pauldronRope on the shoulder joints.
- critic 364 (minor): wrap stands off like a short tutu; tusks near-white. critic 366 (minor): pauldron muzzle a little short of the elbow, surface smooth.
- Never bakeCurrentTransformIntoVertices after parenting: it bakes the world matrix (the 366 muzzle flew off).
