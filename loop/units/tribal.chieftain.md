# tribal.chieftain
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. helmet in unit_tribal.chieftain_idle: a large smooth white blob — TABS: tan animal skull over the brow, sockets, beaked snout (ref: tribal.chieftain.red.png, .png)
 2. shoulder guards in unit_tribal.chieftain_idle: small white skulls, black sockets — TABS: big tan skulls over the whole upper arm, white bead eye (ref: tribal.chieftain.red.png)
 3. waist in unit_tribal.chieftain_idle: near-black skirt band, no hip tusks — TABS: tan ragged hide loincloth, rope belt, large curved tusks at each hip (ref: tribal.chieftain.red.png)
 4. beard in unit_tribal.chieftain_idle, lineup_tribal: a wisp at the chin — TABS: full chestnut beard cheek to chest (ref: tribal.chieftain.red.png)
b FAIL (2 since 360)
 3. off-hand axe in unit_tribal.chieftain_idle: the longer dark-red haft lies flat across his chest, the stone by his right hip — TABS: the second axe held at his side, haft upright (ref: tribal.chieftain.png)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skull helm — blocker 1: a tan animal-skull helm over the brow with eye sockets and a beaked snout — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
2. [S] b off-hand hold — blocker 3: grip the off-hand haft upright beside the off hip, stone up and out (proceduralAnimation OFF_AXE) — ref: tribal.chieftain.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
320 | animal-skull helmet (f86e35f) | a | approved
322 | skull pauldrons (dfa7bbc) | a | approved
323 | chestnut beard (a743b12) | a | approved
324 | hide cape (74de196) | a | approved
324 | [P] scale 1.35 -> 1.15 (d2396d7) | a | approved
361 | off-hand Stone Axe stood up (_standOffhandAxe, OFF_AXE) [S] (e919c23) | b | approved
362 | stone axe re-hafted: charcoal, long red haft, X cords (STONE_AXE) [S] (c174af8) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 362: chieftain_idle now shows him front three-quarter (the 360 shot defect no longer holds). STONE_AXE replaces AXE_LONG/AXE_GRIP/AXE_HEAD/AXE_LASH.
- critic 361: in _windup/_release the off axe's stone sits in front of his chest over the shoulder skull (TABS: out at his side).
- Hat bone_mask; dressTribalPauldrons (PAULDRON); tribalBeard (CHESTNUT); TRIBAL_CAPE_UNITS (dressTribalCape).
