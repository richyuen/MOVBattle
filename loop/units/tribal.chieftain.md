# tribal.chieftain
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 360)
 1. helmet in unit_tribal.chieftain_idle: tan-grey beast skull with beak now, but it sits low and pitched nose-down, the beak covering the middle of his face; one googly eye shows — TABS: tan skull resting above the brow, snout jutting forward, two googly eyes, face fully visible (ref: tribal.chieftain.red.png, .png)
 2. shoulder guards in unit_tribal.chieftain_idle: small white skulls, black sockets — TABS: big tan skulls over the whole upper arm, white bead eye (ref: tribal.chieftain.red.png)
 4. beard in unit_tribal.chieftain_idle, lineup_tribal: a wisp at the chin — TABS: full chestnut beard cheek to chest (ref: tribal.chieftain.red.png)
b PASS (364)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a helmet — blocker 1: skull helm seated above the brow, snout jutting forward, two googly eyes, face clear (BEAST_SKULL mechanism, not a [P] nudge of the 363 row) — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
2. [S] a shoulder guards — blocker 2: big tan skulls covering the whole upper arm, white bead eye — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
320-324 | skull helm, pauldrons, beard, cape, [P] scale | a | approved
361 | off axe stood up (OFF_AXE) [S] (e919c23) | b | approved
362 | stone axe re-hafted (STONE_AXE) [S] (c174af8) | b | approved
363 | beast skull helm (BEAST_SKULL) [S] (03e92ab +e52aaa4) | a | approved
364 | hide wrap and hip tusks (chieftainLoin, CHIEF_LOIN) [S] (61aea7d +85d9e0a) | a | approved
364 | main axe upright at his side (_standMainAxe, MAIN_AXE) [S] (bee41ad) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat "beast_skull" (363). The flat axe in idle was the MAIN hand (364): _standMainAxe mirrors the off arm outside attacks.
- critic 364 (minor): wrap stands off like a short tutu (TABS: front flap to mid-thigh); tusks near-white, modest (TABS: large grey-tan).
- Dark mass behind his head in idle = background rocks.
