# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM), 408 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 408; the CONFIRM's list, struck 1 at 409)
 2. arms in unit_ancient.minotaur_idle - TABS: thick muscular forearms and upper arms ending in big mitt fists held in front of the belly; ours thin stick arms with small hands (ref: ancient.minotaur.red.png)
 3. legs in lineup_ancient - TABS: solid tapered thighs and shins under the belt; ours spindly stick legs that read as a gangly cow at lineup distance (ref: ancient.minotaur.blue.png)
 4. head in unit_ancient.minotaur_idle - TABS: a compact bull head on the thick neck, short broad muzzle just under the eyes, horns spreading level to both sides; ours a long box face whose beige snout block hangs down over the chest, horns lopsided (ref: ancient.minotaur.red.png)
  (struck 1 at 409: a barrel chest with a hump and thick neck)
b PASS (379; CONFIRM 403, 405, 408)
c PASS (387; CONFIRM 403, 405, 408)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a arms - blocker 2: fur upper and lower arm shells (limbShell style) plus big faceted mitt fists in front of the belly (dressMinotaur) - ref: .red.png - ours: unit_ancient.minotaur_idle.png
2. [S] a legs - blocker 3: solid tapered fur thigh and shin shells under the belt, keeping the hooves - ref: .blue.png - ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-406 | [R] head low; face upright; MINO_SHELL; MINO_STRAP slab; head on a tall neck | a | approved; CONFIRM 403, 405 failed a
407 | MINO_LEGS: thighs .7, shins .58, pastern + hock + cloven toes (8f84140) | a | approved (struck 4)
408 | MINO_STRAP foot over the girdle's measured top (f27b023) | a | approved (a PASS); CONFIRM failed a (new list)
409 | MINO_BARREL: trunk 1.35 wide 1.8 deep, shoulders out, lathe barrel, hump, thick neck (506c4c3) | a | approved (struck 1)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 409 critic: the bulky barrel makes the stick arms and legs read thinner; 408 CONFIRM: pad, sash, belt all right - the fault is bulk.
- 409: MINO_BARREL runs first in dressMinotaur, scaling the trunk box + yoke (hidden) so trunkBand-sized gear follows; 407's MINO_LEGS .7/.58 read spindly.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
