# ancient.ballista
Status: done   Audited: 378, a 388 (re-audit)   Done: 391
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (390)
b PASS (391)
c PASS (390)
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. none; a-d PASS, CONFIRM 4/4.
## Attempts (iter | gap | criterion | verdict)
384 | box frame, housings, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved
387 | crewman crouched beside the trough, arms up, iron helmet (BALLISTA_CREW) [S] (3b71139, reverted ce63321) | a | rejected
388 | crewman standing behind the trough's end, arms at the winch handles, iron helmet (BALLISTA_CREW, BALLISTA_HELM) [S] (44de2f1) | a | approved
389 | timber terracotta in linear space, plates two rows of four (BALLISTA_WOOD/PLATES) [S] (532010f) | a | approved
389 | loaded bolt: thick tapered shaft, socket, long flat black leaf head (BALLISTA_BOLT) [S] (246a014) | b | approved (struck b.2, narrowed b.1)
390 | frame top 1.7 m, trough/bolt/arms through the box at mid height (BALLISTA_FRAME top/beam, BALLISTA_STOCK y) [S] (0c52227) | a | approved (a PASS)
390 | flying bolt a copy of the loaded one (ballistaLoadedBolt, LOADED_BOLTS) [S] (cf436a3 +1d34d1a) | c | approved (c PASS)
391 | idle camera a high rear-side along the engine, the loaded leaf head past the frame front, crewman at the winch (capture.mjs evidence) [S] (03a5bdc) | b | approved (b PASS)
## Rejected (last 4)
- operator [S] [1] - 387: crouched at x .3 under the beam, hips .42 - head buried in the beam, hands off the stock
## Notes (max 3 lines)
- CONFIRM 391: 4/4. The side idle reads as the dark cage of slats on four spoked wheels, team caps, black leaf bolt and the operator at the stock.
- Stock top y ~1.0 (BALLISTA_STOCK.y), frame top 1.7, rear end z -1.55. Crew pose: BALLISTA_CREW callback in addOperator.
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team).
