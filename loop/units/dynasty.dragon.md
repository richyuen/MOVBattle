# dynasty.dragon
Status: open   Audited: 411, 419 (CONFIRM), 420 (RE-AUDIT a, b, c after the mesh-top camera)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 420)
 2. body in lineup_dynasty: a straight rectangular slab of nine box segments with black cone spikes along its top - TABS: a flat paper ribbon with a scalloped frill edge and team-coloured fins running the spine (ref: dynasty.dragon.jpg)
 3. carrier clothing in unit_dynasty.dragon_idle: plain team boxes, no trim - TABS: a Chinese tunic and trousers edged orange at collar, cuffs and hem (ref: dynasty.dragon.blue.png)
 4. muzzle in unit_dynasty.dragon_idle: a smooth team ball sitting on a flat box jaw, plain pink from brow to lip - TABS: a squared snout with a tan rim along the upper lip and gold diamond markings on the cheeks (ref: dynasty.dragon.red.png)
  (struck 1 at 420: carrier heads with eyes and buns)
b FAIL (0 since 420)
 1. rear poles in unit_dynasty.dragon_idle: end in black stumps on the headless torsos, no hands on them - TABS: each carrier grips his pole with both hands at chest height (ref: dynasty.dragon.jpg)
 2. front pole in unit_dynasty.dragon_windup: hangs beside the running carrier, both his arms swinging free of it - TABS: he keeps a two-handed hold on it as he walks (ref: dynasty.dragon.jpg)
 3. front pole in unit_dynasty.dragon_idle: team blue - TABS: orange-red with a dark wrapped grip like the three behind it (ref: dynasty.dragon.jpg)
c FAIL (0 since 420)
 1. breath in unit_dynasty.dragon_release: a straight-edged translucent orange tube running level from the mouth to the man, the grass visible through it - TABS: a billowing opaque flame plume, near-white core with a yellow rim, swelling wider than the head as it leaves the mouth (ref: dynasty.dragon.jpg, factions/dynasty.jpg)
d PASS (cost 1000, hp 18.78x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c breath - blocker 1: FLAME_JET's translucent tube replaced by an opaque billowing plume, a chain of flat-shaded spheres swelling from the mouth, near-white core, yellow rim - ref: dynasty.dragon.jpg - ours: unit_dynasty.dragon_release.png
2. [S] a body - blocker 2: DRAGON_FORM ribbon as a flat scalloped paper band with team fins along the spine, the box segments and cones off - ref: dynasty.dragon.jpg - ours: lineup_dynasty.png
3. [P] b.1 fists (fallout of 0f7dd79c): DRAGON_CARRIER fists in the skin material, .fist .09 -> .12, .arm .075 -> .1, seen at the grips beside the rear heads in unit_dynasty.dragon_idle
## Attempts (iter | gap | criterion | verdict)
416-417 | FLAME_JET, DRAGON_FORM head/ribbon, size 2, DRAGON_CARRIER (799cefaa, 3ac0c32c, eaed1d92, 1f9d50d6) | a,b,c | approved
418-419 | [P] poles (e5fcbad5), BODY_FLAMES (70c80e29), tongue (aff1befb) | a,b,c | approved; CONFIRM 419 failed a, b, c
420 | DRAGON_CARRIER heads with eyes and buns, poles beside the heads, fists on the grips (0f7dd79c) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 420 critic: fists and grip one dark mass, the skin-coloured arms vanish against the trunk (b.1 stands: give the fists the skin material, thicker arms).
- 420: the capture frames him by his mesh top (rig 5.70 m): head, ribbon and carriers in the idle; the breath tube runs level to the man.
- 416-417 critics: jet thin and orange at the mouth (TABS fat white-yellow); jaw a flat shelf.
