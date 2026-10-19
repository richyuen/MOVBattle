# renaissance.fencer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368)
 1. cavalier hat in unit_renaissance.fencer_idle — TABS: dark team-felt broad brim to the brow, one piece with the crown, big team plume (ref: renaissance.fencer.red.png, .png); critic 371: now one dark felt piece, still open on the tall flat crown, the single flat pale plume blade, and the brow unseen (idle shows his back)
 2. doublet shoulders in unit_renaissance.fencer_idle: plain — TABS: tan-banded shoulder wings over team sleeves (ref: renaissance.fencer.red.png)
b PASS (368)
c PASS (371)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hat plume and crown — blocker 1: a fan of 5-7 narrow team feather strands sweeping back, a lower crown hidden by the upswept brim; re-aim the idle first (evidence) — ref: .red.png, .png — ours: unit_renaissance.fencer_idle.png
2. [S] a shoulder wings — blocker 2: tan-banded doublet shoulder wings over team sleeves (renaissanceDress) — ref: .red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap 0.12 s after the land (HOP_BACK) [S] (fbd58e7; a285bea reverted) | c | rejected-kept
370 | step back as part of the thrust: committed slide from _landMeleeBlow (FENCER_RECOVER) [S] (e2f2190) | c | approved
371 | cavalier hat as one felt lathe, left brim swept up (CAVALIER_FELT) [S] (47ab317 +4b357d0) | a | approved
371 | Fencer Dodge: sidestep slide when a swing goes up at him, blow on air (FENCER_DODGE, _tryDodge) [S] (c88c308) | c | approved
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap fired 317 ms after the hit — squire chased him and the gap closed
## Notes (max 3 lines)
- _lungeLegs is the last leg layer; dressFencer (FENCER_DRESS, FENCER_BOOTS, FENCER_ROLL). Hat: propBuilder cavalier branch (CAVALIER_FELT lathe + FEATHER_PIECES plume).
- Idle: face points at the default camera (probe 371: .24 rad off) but his braids and brim hide it; the 371 face rule does not flip him. Re-aim needs another rule (camera lower or opposite swing).
- Critic 371 minor: dodge reads mostly as a back-slide from the side-on camera.
