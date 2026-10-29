# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM), 408 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 408; the CONFIRM's list)
 1. torso in unit_ancient.minotaur_idle - TABS: a hulking barrel chest with massive hunched shoulder masses and a thick neck merging into the head; ours a narrow upright rectangular box, barely wider than the hips (ref: ancient.minotaur.blue.png)
 2. arms in unit_ancient.minotaur_idle - TABS: thick muscular forearms and upper arms ending in big mitt fists held in front of the belly; ours thin stick arms with small hands (ref: ancient.minotaur.red.png)
 3. legs in lineup_ancient - TABS: solid tapered thighs and shins under the belt; ours spindly stick legs that read as a gangly cow at lineup distance (ref: ancient.minotaur.blue.png)
 4. head in unit_ancient.minotaur_idle - TABS: a compact bull head on the thick neck, short broad muzzle just under the eyes, horns spreading level to both sides; ours a long box face whose beige snout block hangs down over the chest, horns lopsided (ref: ancient.minotaur.red.png)
b PASS (379; CONFIRM 403, 405, 408)
c PASS (387; CONFIRM 403, 405, 408)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the CONFIRM gave none: each criterion's first blocker)
1. [S] a torso - blocker 1: a barrel chest shell with hunched shoulder masses and a thick neck merging into the head (ancientDress dressMinotaur) - ref: .blue.png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-406 | [R] head low (cdc71a4); face upright (a92a9f9); MINO_SHELL (3c3a808); MINO_STRAP slab (946334f); head on a tall neck (73bf52a) | a | approved; CONFIRM 403, 405 failed a
407 | MINO_LEGS: thighs .7, shins .58, foot hidden, pastern + hock + cloven toes (8f84140) | a | approved (struck 4)
408 | MINO_STRAP foot seated on the girdle's measured top (f27b023) | a | approved (struck 3, a PASS); CONFIRM failed a (new list)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 408 CONFIRM: accessories (pad, sash, belt) all present and placed right; the fault is bulk. 407's thinned legs (MINO_LEGS .7/.58) now read spindly to it - widen the hooves' legs back in the bulk gap, keep the hooves.
- 406: head on a tall neck (BULL_HEAD drop -.4); the CONFIRM now wants a compact head on a thick neck.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
