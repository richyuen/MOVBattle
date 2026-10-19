# tribal.stoner
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 360; 1 [S] rejected)
 4. hip garment in unit_tribal.stoner_windup: front and sides now hang as torn tongues to mid-thigh, but a dark square box stands off behind the buttock at the band's height, straight edges, a lighter vertical rim — TABS: a reddish-brown skirt close all round, nothing standing off behind (ref: tribal.stoner.red.png)
b PASS (360)
c PASS (360)
d PASS (cost 160, hp 0.63x, dmg 1.66x, cd 4.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a rear box — blocker 4: find the mesh jutting behind the buttock in the windup (the bodice's low back hem "tunicWrap"/"tunicHem", or the far arm) and seat it on the pelvis or cut it — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_windup.png
## Attempts (iter | gap | criterion | verdict)
318-322 | forward toss; boulder, garment, lump, hair; bone necklace | a,b,c | approved
361-363 | dreadlock mop [S]; one-strap hide dress [S]; curved strap [S] | a | approved
364 | close-hung skirt: hip band + torn tongues, no kilt (HIDE_SKIRT) [S] (6ebde62, reverted) | a | rejected
365 | skirt per thigh: waist band + torn hip-joint panels (HIDE_SKIRT) [S] (8db2654) | a | approved
366 | strap: solid dark band proud of the shoulder, rolled hem (HIDE_EDGE) [S] (d06e5d0) | a | approved
367 | skirt: ring of 12 torn tongues, rear on the pelvis, band on the pelvis (SKIRT_TONGUES) [S] (de2744b +df9a744) | a | approved
## Rejected (last 4)
- close-hung skirt [S] [1] — 364: pelvis-box depth (zk) made a deep hip-rigid box jutting out behind; too short
## Notes (max 3 lines)
- 362: dressTribalHideDress; strap "tunicStrap", hem "tunicHem", band "tunicSkirt" (on body.hip since 367), tongues "tunicSkirtTongue" (367).
- 367 look: the dark box behind in _windup was there in 366 too and did not move when the band or rear tongues moved: not the skirt. Try the bodice (torso) or a colour probe (paint one mesh team colour) first.
- 319: _carryBoulder. 361 hair "dreads". 322: necklace "bones".
