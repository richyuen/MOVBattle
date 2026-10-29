# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 405; the CONFIRM's list, struck 1+2 at 406, 4 at 407)
 3. team patterned waist belt not readable in unit_ancient.minotaur_idle or lineup_ancient (hidden behind the hung muzzle) - TABS: a wide team belt with lighter swirls round the waist, the brightest element of the unit (ref: .red.png, card Appearance)
  (struck 1 at 406: the head up on a tall neck; struck 2 at 406: no hand on the head, fists at belly height; struck 4 at 407: slim legs on split hooves)
b PASS (379; CONFIRM 403, 405)
c PASS (387; CONFIRM 403, 405)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt - blocker 3: the girdle brought proud of the muzzle's drop line and widened, bright team swirls on its front (ancientDress dressMinotaur MINO_GIRDLE) - ref: ancient.minotaur.red.png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-404 | [R] head low + forward, 12-side girdle (cdc71a4); face upright, nose plate (a92a9f9); MINO_SHELL wedge plate (3c3a808) | a | approved; CONFIRM 403 failed a
405 | MINO_STRAP: the sash a wide slab to the right hip, buckle on its lower run (946334f) | a | approved (a PASS); CONFIRM failed a (head, arms, belt, legs)
406 | BULL_HEAD up on a tall neck (drop -.4, face .86, neck 1.0) + dewlap (73bf52a) | a | approved (struck 1, 2)
407 | MINO_LEGS: thighs .7, shins .58, foot hidden, pastern + hock knob + two cloven toes (8f84140) | a | approved (struck 4)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 407 critic: the muzzle hangs over the waist and hides the belt in lineup_ancient; the near hoof reads as a flat dark plate about a foot long (minor).
- 406 critic: in the idle the girdle reads under the shell slab; in lineup_ancient the slab still covers it.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
