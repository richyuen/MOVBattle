# renaissance.fencer
Status: open   Audited: 368 (re; a, b re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 372)
 2. doublet in unit_renaissance.fencer_idle: flat plain chest slab, a thin tan band on one upper arm, no shoulder wings, no waist tabs — TABS: rolled shoulder wings with tan bands over team sleeves, belted doublet with skirt tabs over the striped breeches (ref: .red.png)
b PASS (372)
c PASS (371)
d PASS (cost 150, hp 0.82x vs 0.88x, dmg 0.67x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a doublet — blocker 2: rolled shoulder wings (half-torus over each shoulder top, tan band), a belt and 6-8 skirt tabs from the waist over the breeches (renaissanceDress.ts) — ref: .red.png — ours: unit_renaissance.fencer_idle.png
## Attempts (iter | gap | criterion | verdict)
327-337 | hat, back slab, lunge, cup hilt, point-first, lunge legs, doublet, hair, boots, thigh rolls [S] | a,b,c | approved
369 | step back: leap 0.12 s after the land (HOP_BACK) [S] (fbd58e7; a285bea reverted) | c | rejected-kept
370 | step back as part of the thrust: committed slide from _landMeleeBlow (FENCER_RECOVER) [S] (e2f2190) | c | approved
371 | cavalier hat as one felt lathe, left brim swept up (CAVALIER_FELT) [S] (47ab317 +4b357d0) | a | approved
371 | Fencer Dodge: sidestep slide when a swing goes up at him, blow on air (FENCER_DODGE, _tryDodge) [S] (c88c308) | c | approved
372 | hat re-seated higher, cocked, rounded crown, team feather clump plume (CAVALIER_FELT raise..plumeOut) [S] (a8b654e) | a | approved
## Rejected (last 4)
- step back [S] [1] — 369: HOP_BACK leap fired 317 ms after the hit — squire chased him and the gap closed
## Notes (max 3 lines)
- _lungeLegs is the last leg layer; dressFencer (FENCER_DRESS, FENCER_BOOTS, FENCER_ROLL). Hat: propBuilder cavalier branch (CAVALIER_FELT lathe + FEATHER_PIECES plume).
- Idle camera level with the head since ce8fa88 (372): face and moustache show under the brim.
- Critic 371 minor: dodge reads mostly as a back-slide. 372 minor: plume a rounded lump, no feather barbs or backward sweep.
