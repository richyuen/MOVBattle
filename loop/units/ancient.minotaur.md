# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 403; the CONFIRM's list - the gap critic struck 4 and passed a at 403)
 1. shoulder pad in unit_ancient.minotaur_idle: a huge rounded team-coloured barrel, bigger than the head, riding over the shoulder and the back of the head - TABS: a flat, palm-sized wedge plate on the right shoulder with a lighter swirl, well below head height (ref: .blue.png, .red.png; card Appearance "patterned right shoulder pad")
 2. diagonal chest sash missing in unit_ancient.minotaur_idle - TABS: a wide brown strap with a grey square buckle running from the right shoulder across the chest (ref: .red.png, .png; card Appearance "brown belt-like sash")
b PASS (379; CONFIRM 403)
c PASS (387; CONFIRM 403)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a pauldron - blocker 1: rebuild the pauldron as a flat palm-sized wedge plate on the right shoulder with its lighter swirl, below head height (ancientDress MINO_SHELL) - ref: .blue.png - ours: unit_ancient.minotaur_idle.png
2. [S] a sash - blocker 2: a wide brown strap from the right shoulder across the chest with a grey square buckle (ancientDress) - ref: .png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402 | [R] bull head low and forward, 12-side girdle, pauldron scroll on top + front (cdc71a4) | a | approved (struck 2, 3; added 4)
403 | the bull face upright (tilt .15), a flat nose plate with level nostrils (a92a9f9) | a | approved (struck 4, a PASS); CONFIRM failed a (pauldron, sash)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 403 gap critic (not a blocker): the head sits low between the hunched shoulders (402 [R]), not on a neck above them as in .red.png.
- 402: the man's head block is hidden (dressMinotaur) under the dropped cranium. Gear ancientDress (MINO_*); head propBuilder bull_head; unitFactory skips the tunic skirt. Probe: probe_mino.mjs (--build).
- The scale stays 2.1 (unitVisuals); Body -x is his left.
