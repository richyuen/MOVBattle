# tribal.protector
Status: open   Audited: 360 (a re-audited 367)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 367)
 1. skull face in the slab's window in lineup_tribal: tan face plate with socket rims, ridge and muzzle now, but pink skin under the muzzle at the chin/jaw and dark brown arcs down both sides of the face — TABS: the window filled edge to edge with tan skull, no pink, nothing dark round it (ref: tribal.protector.red.png, .blue.png)
b PASS (362)
c PASS (360)
d PASS (cost 80, hp 0.89x, dmg 0.25x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skull face — blocker 1: a lower jaw plate under the muzzle and cheeks down to the chin; find and drop or retint the brown arcs at the face's sides (skullFacePlate) — ref: tribal.protector.red.png — ours: lineup_tribal.png
## Attempts (iter | gap | criterion | verdict)
317-318 | no back spear; moss chunks | b | approved
319-321 | skull helmet, [P] domed cranium; one-shoulder garment; critter-skull necklace | a | approved
361 | slab held square in front, bash shove (_holdSlab, SLAB_FRONT) [S] (fe4efa7) | b | approved
362 | stone slab: faceted columns, seam, round lip, 3 moss (SLAB_FACETS) [S] (27256cd +d38d4b0) | b | approved
363 | skull helm re-seated: tan dome on the brow, sockets, brows, snout ridge (SKULL_FACETED) [S] (d6d6c79 +c60ed20) | a | approved
367 | skull face plate: socket rims round his eyes, bridge, muzzle, cheeks (skullFacePlate, SKULL_FACE) [S] (8762812) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Hat bone_mask (also raptor_rider's: the face plate shows on him too). The brown arcs may be the slab hole's rim or the mop-less dome's cheek boxes (bskullCheek): check before cutting.
- 361 hold: _holdSlab overrides _squareShield for slabshield every living frame. TRIBAL_TUNIC_UNITS (dressTribalTunic).
- Idle camera (59fcbb0, 1.35 rad) sits behind his shoulder: the critic judges the helm in lineup_tribal; .6, .9-1.0, -.9 tried.
