# tribal.chieftain
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 360)
 1. helmet in unit_tribal.chieftain_idle: tan-grey beast skull with beak now, but it sits low and pitched nose-down, the beak covering the middle of his face; one googly eye shows — TABS: tan skull resting above the brow, snout jutting forward, two googly eyes, face fully visible (ref: tribal.chieftain.red.png, .png)
 2. shoulder guards in unit_tribal.chieftain_idle: small white skulls, black sockets — TABS: big tan skulls over the whole upper arm, white bead eye (ref: tribal.chieftain.red.png)
 3. waist in unit_tribal.chieftain_idle: near-black skirt band, no hip tusks — TABS: tan ragged hide loincloth, rope belt, large curved tusks at each hip (ref: tribal.chieftain.red.png)
 4. beard in unit_tribal.chieftain_idle, lineup_tribal: a wisp at the chin — TABS: full chestnut beard cheek to chest (ref: tribal.chieftain.red.png)
b FAIL (2 since 360)
 3. off-hand axe in unit_tribal.chieftain_idle: the longer dark-red haft lies flat across his chest, the stone by his right hip — TABS: the second axe held at his side, haft upright (ref: tribal.chieftain.png)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hide loincloth and hip tusks — blocker 3: tan ragged loincloth on a rope belt, a large curved tusk at each hip (tribalDress) — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
2. [S] b off-hand hold — blocker 3: grip the off-hand haft upright beside the off hip, stone up and out (proceduralAnimation OFF_AXE) — ref: tribal.chieftain.png — ours: unit_tribal.chieftain_idle.png
3. [P] a skull seat (fallout of 03e92ab) — blocker 1: BEAST_SKULL.lift .08 -> .3, pitch .12 -> 0; NEXT shows in unit_tribal.chieftain_idle as the skull clearing his eyes
## Attempts (iter | gap | criterion | verdict)
320-324 | skull helm, pauldrons, beard, cape, [P] scale | a | approved
361 | off axe stood up (OFF_AXE) [S] (e919c23) | b | approved
362 | stone axe re-hafted (STONE_AXE) [S] (c174af8) | b | approved
363 | beast skull helm (BEAST_SKULL) [S] (03e92ab +e52aaa4) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat "beast_skull" (363; protector keeps bone_mask). Dark mass behind his head in idle = background rocks.
- critic 361: in _windup the off axe's stone sits in front of his chest (TABS: out at his side).
