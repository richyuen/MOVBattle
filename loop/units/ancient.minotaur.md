# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 405; the CONFIRM's list, struck 1+2 at 406)
 3. team patterned waist belt not readable in unit_ancient.minotaur_idle or lineup_ancient (hidden behind the hung muzzle) - TABS: a wide team belt with lighter swirls round the waist, the brightest element of the unit (ref: .red.png, card Appearance)
 4. thick pillar legs with large block feet in unit_ancient.minotaur_idle - TABS: slim digitigrade legs ending in small split hooves (ref: .red.png, .blue.png)
  (struck 1 at 406: the head up on a tall neck; struck 2 at 406: no hand on the head, fists at belly height)
b PASS (379; CONFIRM 403, 405)
c PASS (387; CONFIRM 403, 405)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs - blocker 4: digitigrade legs with reversed hock, thin shank and small split hooves - ref: ancient.minotaur.red.png - ours: unit_ancient.minotaur_idle.png
2. [S] a belt - blocker 3: the girdle clear of the shell slab (slab hung higher or narrower), the swirls bright - ref: ancient.minotaur.red.png - ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-404 | [R] head low + forward, 12-side girdle (cdc71a4); face upright, nose plate (a92a9f9); MINO_SHELL wedge plate (3c3a808) | a | approved; CONFIRM 403 failed a
405 | MINO_STRAP: the sash a wide slab .32 hx proud to the right hip, buckle on its lower run (946334f) | a | approved (struck 2, a PASS); CONFIRM failed a (head, arms, belt, legs)
406 | BULL_HEAD up on a tall neck (drop -.4, face .86, neck 1.0) + dewlap (73bf52a) | a | approved (struck 1, 2)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 406 critic: 3's "hidden behind the muzzle" clause cleared in the idle (the girdle reads under the shell slab); in lineup_ancient the slab still covers it. Head and neck read as one wide pillar (not a blocker).
- 406: the "hand on head" was the fists (carried at belly height) meeting the 402 low-hung muzzle; raising the head cleared both.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
