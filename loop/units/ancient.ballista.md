# ancient.ballista
Status: open   Audited: 378, a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (390)
b FAIL (1 since 378)
 1. loaded bolt in _idle: the thick tapered shaft reads, but the leaf head hides behind the far housing cap, and in _windup it is edge-on, a thin spike - TABS: a big black leaf head reading past the frame's front (ref: .red.png)
c PASS (390)
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b loaded bolt - blocker 1: evidence re-aim of the idle half to unit_ancient.ballista_windup (the idle camera sits behind the engine, so the frame's back hides the head), or turn the engine so its muzzle faces the idle camera - ref: .red.png - ours: unit_ancient.ballista_idle.png
2. [S] b loaded bolt - blocker 1: an open bolt slot in the box's front face (front slats parted at mid height) so the head reads past the frame front from three-quarter angles - ref: .red.png - ours: unit_ancient.ballista_idle.png
## Attempts (iter | gap | criterion | verdict)
384 | box frame, housings, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved
387 | crewman crouched beside the trough, arms up, iron helmet (BALLISTA_CREW) [S] (3b71139, reverted ce63321) | a | rejected
388 | crewman standing behind the trough's end, arms at the winch handles, iron helmet (BALLISTA_CREW, BALLISTA_HELM) [S] (44de2f1) | a | approved (struck a.3)
389 | timber terracotta in linear space, plates two rows of four (BALLISTA_WOOD/PLATES) [S] (532010f) | a | approved (struck a.2)
389 | loaded bolt: thick tapered shaft, socket, long flat black leaf head (BALLISTA_BOLT) [S] (246a014) | b | approved (struck b.2, narrowed b.1)
390 | frame top 1.02 -> 1.7 m, trough/bolt/arms through the box at mid height on cross beams (BALLISTA_FRAME top/beam, BALLISTA_STOCK y) [S] (0c52227) | a | approved (struck a.1, a PASS)
390 | flying bolt a copy of the loaded one (ballistaLoadedBolt, LOADED_BOLTS), hidden half the reload; upright leaf copy (1d34d1a) [S] (cf436a3 +1d34d1a) | c | approved (struck c.1, c PASS)
## Rejected (last 4)
- operator [S] [1] — 387: crouched at x .3 under the beam, hips .42 — head buried in the beam, hands off the stock
## Notes (max 3 lines)
- 390 critic: the upright leaf copy cleared b.1's edge-on half (_windup reads a broad diamond past the front); the idle half stands only because _idle is shot from behind the engine: next is an evidence commit (capture.mjs), not geometry.
- Stock top y ~1.0 now (BALLISTA_STOCK.y), frame top 1.7, rear end z -1.55. Crew pose: BALLISTA_CREW callback in addOperator, arms by aimLimb.
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team).
