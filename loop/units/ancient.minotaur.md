# ancient.minotaur
Status: open   Audited: 378, 396, 402, CONFIRM 403, 405, 408, 415   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 415; the CONFIRM's list; 408 list all struck by 415.1) [plateau: CONFIRM failed 403, 405, 408, 415]
 1. chest sash in unit_ancient.minotaur_idle is a deep tan box, about a forearm thick, sitting across the chest like a held crate - TABS: a thin flat brown strap running diagonally from the left shoulder down to the right hip, lying flat on the chest (ref: ancient.minotaur.red.png / .blue.png)
 2. waist belt in unit_ancient.minotaur_idle: only a small team-blue patch shows at the crotch - TABS: a wide team-coloured band with a lighter scroll pattern and dark rims all round the waist, the brightest element of the figure (ref: ancient.minotaur.blue.png, card Appearance "patterned iron belt")
 3. shoulder pad in unit_ancient.minotaur_idle runs as a long blue plank from the shoulder forward over the chest, and in _windup/_ability a big slab over the shoulder and back - TABS: a compact curved pad capping one shoulder only, about the width of the upper arm (ref: ancient.minotaur.blue.png)
 4. scale in lineup_ancient: about 1.75x the Zeus beside him, 2x the hoplites (rig 3.12 m; size 2.10 vs wiki 1.2x) - TABS: about 1.2x his neighbours, hunched (ref: reference/factions/ancient.jpg, card Infobox Size 1.20x)
b PASS (379; CONFIRM 403, 405, 408, 415)
c PASS (387; CONFIRM 403, 405, 408, 415)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a dressMinotaur + scale rebuilt from a spec read off the renders (plateau: 4 CONFIRM lists): size toward 1.2x the hoplite (card Size 1.20x; 396's 1.92 still towered), a thin flat diagonal strap with a grey buckle in place of the MINO_STRAP slab, a wide team scrolled girdle all round the hips with dark rims, one compact arm-wide cap on one shoulder in place of the MINO_SHELL plank - ref: ancient.minotaur.red.png, reference/factions/ancient.jpg - ours: unit_ancient.minotaur_idle.png, lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash, Charge, bull head, pauldron, girdle, Big Headbutt (c PASS 387) [S] | a,b,c | approved (388 rejected)
396-408 | [R] 1.92 build (396 rejected); head, MINO_SHELL, MINO_STRAP, MINO_LEGS | a | approved; CONFIRM 403, 405, 408 failed a
409-411 | MINO_BARREL, MINO_ARMS, leg sleeves, BULL_MUZZLE | a | approved (struck 1, 2, 4)
415 | MINO_LATHE lathed legs (57ec2652) | a | approved (a PASS); CONFIRM 415 failed a (4 new)
## Rejected (last 4)
- [R] 396: 1.92 with flat inlays and a front pauldron scroll - still towered, a box off the left flank
## Notes (max 3 lines)
- 415 CONFIRM: 4th fail on a; legs, chest, arms, head read. Buckle team-blue vs grey iron (colour only).
- 409: MINO_BARREL runs first in dressMinotaur, scaling the trunk box + yoke so trunkBand-sized gear follows.
