# tribal.stoner
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 360; 1 [S] rejected)
 3. strap in unit_tribal.stoner_idle: a narrow strap hugs the shoulder but is mostly hidden by the locks; the bodice's slanted top barely reads against the skin — TABS: a narrow hide strap from the bodice front over the right shoulder, the diagonal top edge plain (ref: tribal.stoner.red.png)
 4. skirt in unit_tribal.stoner_idle (also _windup): close brown sleeve per thigh to about mid-thigh now, but a stiff square box, no torn hem showing, its rear edge standing off the buttock in the windup — TABS: a reddish-brown skirt hanging close to mid-thigh with a ragged hem (ref: tribal.stoner.red.png)
b PASS (360)
c PASS (360)
d PASS (cost 160, hp 0.63x, dmg 1.66x, cd 4.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a strap — blocker 3: a hide strap from the bodice over the right shoulder, standing out from the locks, and a plain diagonal top edge on the bodice — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_idle.png
2. [P] a skirt (fallout of 8db2654) — blocker 4: HIDE_SKIRT.panelOut 1.45 -> 1.2; NEXT shows in unit_tribal.stoner_windup as the rear edge tucked to the leg
## Attempts (iter | gap | criterion | verdict)
318-322 | forward toss; boulder, garment, lump, hair; bone necklace | a,b,c | approved
361 | dreadlock mop (dreadMop, DREAD_MOP) [S] (a7be412) | a | approved
362 | one-strap hide dress (dressTribalHideDress, HIDE_DRESS) [S] (3834142) | a | approved
363 | curved shoulder strap (HIDE_DRESS.strap*) [S] (205e839) | a | approved
364 | close-hung skirt: hip band + torn tongues, no kilt (HIDE_SKIRT) [S] (6ebde62, reverted) | a | rejected
365 | skirt per thigh: waist band + torn panel on each hip joint, no kilt (HIDE_SKIRT, wearsHideDress) [S] (8db2654) | a | approved
## Rejected (last 4)
- close-hung skirt [S] [1] — 364: pelvis-box depth (zk) made a deep hip-rigid box jutting out behind; too short (ended at the thigh top)
## Notes (max 3 lines)
- 362: dressTribalHideDress replaces the tunic; strap = ribbons "tunicStrap"/"tunicStrapInner"; waist band "tunicSkirt", thigh panels "tunicSkirtPanel" (365).
- critic 365 (minor): hem tears (HIDE_DRESS.rag .16) do not read at capture distance.
- 319: _carryBoulder. 361 hair "dreads". 322: necklace "bones".
