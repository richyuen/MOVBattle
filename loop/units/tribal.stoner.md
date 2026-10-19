# tribal.stoner
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 360; 1 [S] rejected)
 3. strap in unit_tribal.stoner_idle: the plank is gone, a narrow strap hugs the shoulder but is mostly hidden by the locks; the bodice's slanted top barely reads against the skin — TABS: a narrow hide strap from the bodice front over the right shoulder, the diagonal top edge plain (ref: tribal.stoner.red.png)
 4. skirt in unit_tribal.stoner_idle (also _windup): a stiff dark panel flaring wide like a lampshade, no torn hem showing (364 try: a short stiff box round the hips, jutting far behind in the windup) — TABS: a reddish-brown skirt hanging close to mid-thigh with a ragged hem (ref: tribal.stoner.red.png)
b PASS (360)
c PASS (360)
d PASS (cost 160, hp 0.63x, dmg 1.66x, cd 4.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skirt — blocker 4: tongues hung per thigh (front and back panels on each upper leg, sized to the thigh, not the pelvis box), long enough to reach mid-thigh, clear torn points — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_windup.png
2. [S] a strap — blocker 3: a wider hide strap laid outside the locks from the bodice front over the right shoulder, the bodice's diagonal top as a contrasting edge band — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
319-321 | boulder, one-shoulder garment, charcoal lump, long hair | a,b | approved
322 | bone necklace (55b683b) | a | approved
361 | dreadlock mop (dreadMop, DREAD_MOP) [S] (a7be412) | a | approved
362 | one-strap hide dress (dressTribalHideDress, HIDE_DRESS) [S] (3834142) | a | approved
363 | curved shoulder strap (HIDE_DRESS.strap*) [S] (205e839) | a | approved
364 | close-hung skirt: hip band + torn tongues, no kilt (HIDE_SKIRT) [S] (6ebde62, reverted) | a | rejected
## Rejected (last 4)
- close-hung skirt [S] [1] — 364: pelvis-box depth (zk) made a deep hip-rigid box jutting out behind; too short (ended at the thigh top)
## Notes (max 3 lines)
- 362: dressTribalHideDress replaces the tunic; strap = ribbons "tunicStrap"/"tunicStrapInner"; skirt = sleeve "tunicSkirt" on the torso.
- unitFactory hangs a skin "hideKilt" (flare 1.45) under her: a close skirt must drop it (364 used wearsHideDress in the skirt block's condition).
- 319: _carryBoulder. 361 hair "dreads". 322: necklace "bones".
