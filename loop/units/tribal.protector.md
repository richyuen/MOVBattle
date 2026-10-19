# tribal.protector
Status: open   Audited: 360 (a re-audited 367)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 367)
 1. skull face in the slab's window in lineup_tribal: tan fills the window's centre and the pink chin is gone, but a red sliver and grass show at the window's right edge and a small dark nub at its upper left — TABS: tan skull to the window's edges (ref: tribal.protector.red.png, .blue.png)
b PASS (362)
c PASS (360)
d PASS (cost 80, hp 0.89x, dmg 0.25x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a window fill — blocker 1: a tan plate parented to the slab inside its window (not the head), so it fills the hole whatever way the head turns — ref: tribal.protector.red.png — ours: lineup_tribal.png
## Attempts (iter | gap | criterion | verdict)
361-362 | slab held square, bash shove; faceted slab, seam, lip, moss [S] | b | approved
363 | skull helm re-seated (SKULL_FACETED) [S] (d6d6c79 +c60ed20) | a | approved
367 | skull face plate: rims, bridge, muzzle, cheeks (SKULL_FACE) [S] (8762812) | a | approved
368 | skull jaw; slab lip six-sided (SKULL_FACE.jaw, SLAB_LIP) [S] (b544fb9) | a | approved
369 | backing plate behind the face (SKULL_BACK) [S] (a321a18) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat bone_mask (also raptor_rider's: the face plate shows on him too).
- 361 hold: _holdSlab overrides _squareShield for slabshield every living frame. TRIBAL_TUNIC_UNITS (dressTribalTunic).
- Idle camera (59fcbb0) sits behind his shoulder: the critic judges the helm in lineup_tribal. Critic 369: the head is turned to the weapon side, so a head plate sits left of the window.
