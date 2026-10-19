# tribal.chieftain
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. helmet in unit_tribal.chieftain_idle: a large smooth white blob — TABS: tan animal skull over the brow, sockets, beaked snout (ref: tribal.chieftain.red.png, .png)
 2. shoulder guards in unit_tribal.chieftain_idle: small white skulls, black sockets — TABS: big tan skulls over the whole upper arm, white bead eye (ref: tribal.chieftain.red.png)
 3. waist in unit_tribal.chieftain_idle: near-black skirt band, no hip tusks — TABS: tan ragged hide loincloth, rope belt, large curved tusks at each hip (ref: tribal.chieftain.red.png)
 4. beard in unit_tribal.chieftain_idle, lineup_tribal: a wisp at the chin — TABS: full chestnut beard cheek to chest (ref: tribal.chieftain.red.png)
b FAIL (1 since 360)
 2. axe in unit_tribal.chieftain_idle: light-grey head in a square dark frame, short haft — TABS: charcoal head with crossed X cords on a long dark-red haft, head as large as his head (ref: tribal.chieftain.png)
c PASS (360)
d PASS (cost 400, hp 3.31x, dmg 2.07x, cd 0.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b axe head — blocker 2: charcoal stone lashed with crossed X cords on a long dark-red haft, no square frame — ref: tribal.chieftain.png — ours: unit_tribal.chieftain_idle.png
2. [S] a skull helm — blocker 1: a tan beaked animal skull strapped over the brow, with sockets — ref: tribal.chieftain.red.png — ours: unit_tribal.chieftain_idle.png
## Attempts (iter | gap | criterion | verdict)
320 | animal-skull helmet (f86e35f) | a | approved
322 | skull pauldrons (dfa7bbc) | a | approved
323 | chestnut beard (a743b12) | a | approved
324 | hide cape (74de196) | a | approved
324 | [P] scale 1.35 -> 1.15 (d2396d7) | a | approved
361 | off-hand Stone Axe stood up (_standOffhandAxe, OFF_AXE) [S] (e919c23) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 360 DEFECT: unit_tribal.chieftain_idle is shot from behind his weapon side (face unjudgeable): re-aim front three-quarter.
- critic 361: in _windup/_release the off axe's stone and frame sit in front of his chest over the shoulder skull (TABS: out at his side).
- Hat bone_mask; dressTribalPauldrons (PAULDRON); tribalBeard (CHESTNUT); TRIBAL_CAPE_UNITS (dressTribalCape).
