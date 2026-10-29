# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 405; the CONFIRM's list)
 1. head hung forward below the shoulder line in unit_ancient.minotaur_idle and lineup_ancient, muzzle pointing at the ground over the chest - TABS: head held up on a tall thick neck above the shoulders, face to the front (ref: .red.png, .blue.png)
 2. one arm raised with the hand clamped on top of the head in unit_ancient.minotaur_idle and lineup_ancient - TABS: both arms bent, fists hanging forward at belly height (ref: .red.png)
 3. team patterned waist belt not readable in unit_ancient.minotaur_idle or lineup_ancient (hidden behind the hung muzzle) - TABS: a wide team belt with lighter swirls round the waist, the brightest element of the unit (ref: .red.png, card Appearance)
 4. thick pillar legs with large block feet in unit_ancient.minotaur_idle - TABS: slim digitigrade legs ending in small split hooves (ref: .red.png, .blue.png)
b PASS (379; CONFIRM 403, 405)
c PASS (387; CONFIRM 403, 405)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the CONFIRM gave none: the first blockers)
1. [S] a head - blocker 1: the idle carries the bull head up on a tall neck above the shoulders, face to the front (BULL_HEAD drop/forward/tilt for the standing pose; the charge keeps its low head) - ref: .red.png - ours: unit_ancient.minotaur_idle.png
2. [S] a arms - blocker 2: an idle arm pose with both fists hanging forward at belly height, no hand on the head - ref: .red.png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402-404 | [R] head low + forward, 12-side girdle (cdc71a4); face upright, nose plate (a92a9f9); MINO_SHELL wedge plate (3c3a808) | a | approved; CONFIRM 403 failed a
405 | MINO_STRAP: the sash a wide slab .32 hx proud to the right hip, buckle on its lower run (946334f) | a | approved (struck 2, a PASS); CONFIRM failed a (head, arms, belt, legs)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 405 CONFIRM: in the side shots (_flight) he stands upright, head up, belt showing - the trouble is the idle pose (head drop + hand on head). Raising the head also clears the sash's upper run and the belt.
- 405 gap critic (minor): the strap a thick proud box; TABS lays it flat. BULL_HEAD drop .72 forward .28 is the 402 [R]'s low head.
- Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
