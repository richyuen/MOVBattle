# tribal.protector
Status: done   Audited: 360 (a re-audited 367)   Done: 373
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (373)
b PASS (362)
c PASS (360)
d PASS (cost 80, hp 0.89x, dmg 0.25x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
361-362 | slab held square, bash shove; faceted slab, seam, lip, moss [S] | b | approved
363-369 | skull helm re-seated; face plate; jaw + six-sided lip; backing plate (SKULL_FACETED, SKULL_FACE, SLAB_LIP, SKULL_BACK) [S] | a | approved
370 | six-sided tan bone ring on the slab behind the window (SLAB_WINDOW_BONE) [S] (37d76c7) | a | approved
373 | solid bone face plate in the window, own googly eyes + nose; ring outer 1.3 (SLAB_WINDOW_FACE) [S] (41cba1a) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat bone_mask (also raptor_rider's). Slab: propBuilder "slabshield" (slabEye lip, slabWindowBone ring, slabWindowFace plate with its own eyes: hides his head's eyes).
- 361 hold: _holdSlab overrides _squareShield for slabshield every living frame. TRIBAL_TUNIC_UNITS (dressTribalTunic).
- Idle camera sits behind his shoulder: the critic judges the helm in lineup_tribal. Critic 373 minor: face plate flat, no recess shading.
