# renaissance.fencer
Status: open   Audited: 368 (re; a, b re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 372)
 4. skirt tabs in unit_renaissance.fencer_idle (added 373 by 8669b5c): they flare to about twice the hip's width as stiff fins, a tutu standing off the breeches, the left one jutting sideways past the hip — TABS: short tabs hanging close over the top of the striped breeches, only a little flared (ref: .red.png, .blue.png)
b PASS (372)
c PASS (371)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tabs — blocker 4: thigh rolls start a tab-length below the belt so the tabs hang near-straight over them (FENCER_ROLL top, FENCER_TRIM skirtFoot about 1.35) — ref: .red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap 0.12 s after the land (HOP_BACK) [S] (fbd58e7; a285bea reverted) | c | rejected-kept
370-371 | recover slide (FENCER_RECOVER); Fencer Dodge (FENCER_DODGE); cavalier felt hat (CAVALIER_FELT) [S] | a,c | approved
372 | hat re-seated higher, cocked, rounded crown, team feather clump plume (CAVALIER_FELT raise..plumeOut) [S] (a8b654e) | a | approved
373 | rolled shoulder wings + tan band, dark belt, flared skirt of 8 tabs (renaissanceDress fencerTrim, FENCER_TRIM) [S] (909da65 +a7d213f +8669b5c) | a | approved
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap fired 317 ms after the hit — squire chased him and the gap closed
## Notes (max 3 lines)
- dressFencer (unitFactory): doublet box, FENCER_ROLL rolls (huge: .38 m out, .25 ahead, from the hip joint), FENCER_BOOTS; trim in renaissanceDress fencerTrim. Hat: propBuilder cavalier.
- The cup hilt sits over his waist front in the idle: belt and tabs show only beside it. Idle camera level with the head (ce8fa88).
- Critic 371 minor: dodge reads mostly as a back-slide. 372 minor: plume a rounded lump.
