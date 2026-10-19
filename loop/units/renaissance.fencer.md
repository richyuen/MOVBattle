# renaissance.fencer
Status: done   Audited: 368 (re; a, b re-audited 372)   Done: 374
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (374)
b PASS (372)
c PASS (371)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap 0.12 s after the land (HOP_BACK) [S] (fbd58e7; a285bea reverted) | c | rejected-kept
370-373 | recover slide; Fencer Dodge; cavalier felt hat, re-seated; wings, belt, tabs (FENCER_TRIM) [S] | a,c | approved
374 | tabs bent near-straight (hip .6, hipOut 1.1, foot 1.32), thigh rolls dropped .24 (FENCER_TRIM, FENCER_ROLL drop) [S] (0118f84) | a | approved
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap fired 317 ms after the hit — squire chased him and the gap closed
## Notes (max 3 lines)
- dressFencer (unitFactory): doublet box, FENCER_ROLL rolls, FENCER_BOOTS; trim in renaissanceDress fencerTrim. Hat: propBuilder cavalier. Idle camera level with the head (ce8fa88).
- Critic 374 (for the next renaissance:re): the striped thigh rolls read as round pumpkin globes wider than the hips — TABS: boxy panel breeches hanging straight to the knee.
- Critic 371 minor: dodge reads mostly as a back-slide. 372 minor: plume a rounded lump.
