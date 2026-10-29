# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM), 408 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 408; the CONFIRM's list, struck 1 at 409, 2 at 410)
 3. legs in lineup_ancient - TABS: solid tapered thighs and shins under the belt; ours spindly stick legs that read as a gangly cow at lineup distance (ref: ancient.minotaur.blue.png)
 4. head in unit_ancient.minotaur_idle - TABS: a compact bull head on the thick neck, short broad muzzle just under the eyes, horns spreading level to both sides; ours a long box face whose beige snout block hangs down over the chest, horns lopsided (ref: ancient.minotaur.red.png)
  (struck 1 at 409: the barrel chest; struck 2 at 410: thick arms and big fists)
b PASS (379; CONFIRM 403, 405, 408)
c PASS (387; CONFIRM 403, 405, 408)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a head - blocker 4: a compact bull head, short broad muzzle right under the eyes, horns spreading level both sides (propBuilder bull_head / BULL_HEAD) - ref: .red.png - ours: unit_ancient.minotaur_idle.png
2. [S] a legs - blocker 3: lathed tapered fur legs (wide at the hip, narrow at the knee, a calf bulge into the slim pastern, no hem step) replacing the 410 straight limbShell sleeves - ref: .blue.png - ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-408 | [R] head low; face upright; MINO_SHELL; MINO_STRAP slab; tall neck; MINO_LEGS (407); strap foot (408) | a | approved; CONFIRM 403, 405, 408 failed a
409 | MINO_BARREL: trunk 1.35 wide 1.8 deep, shoulders out, lathe barrel, hump, thick neck (506c4c3) | a | approved (struck 1)
410 | MINO_ARMS: fur sleeves 1.6/1.85, mitts x1.75 (cfb6510) | a | approved (struck 2)
410 | leg sleeves: thigh 1.95, calf 2.0 to .6 (bd87426) | a | approved (none struck: straight boxes, a hem step)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 410 critic: the free fist rests akimbo on the hip in the idle, not forward at the belly; the leg sleeves read as baggy shorts.
- 409: MINO_BARREL runs first in dressMinotaur, scaling the trunk box + yoke (hidden) so trunkBand-sized gear follows.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
