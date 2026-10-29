# ancient.minotaur
Status: open   Audited: 378, 396, 402, 403 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 403; the CONFIRM's list, struck 1 at 404)
 2. diagonal chest sash missing in unit_ancient.minotaur_idle - TABS: a wide brown strap with a grey square buckle running from the right shoulder across the chest (ref: .red.png, .png; card Appearance "brown belt-like sash")
  (struck 1 at 404: the pauldron, now a flat wedge plate)
b PASS (379; CONFIRM 403)
c PASS (387; CONFIRM 403)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a sash - blocker 2: rebuild the sash as a wide brown slab from the plate's root across the chest to the opposite hip, standing proud of the chest so the hunched head does not hide it, with a grey square buckle at mid-chest (dressMinotaur) - ref: .red.png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-389 | fur body, gear, sash; Charge; bare fists; bull head; pauldron shell; scrolled girdle; Big Headbutt (c PASS 387); sash foot (388 rejected); girdle on the hip joint [S] | a,b,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402 | [R] bull head low and forward, 12-side girdle, pauldron scroll on top + front (cdc71a4) | a | approved (struck 2, 3; added 4)
403 | the bull face upright (tilt .15), a flat nose plate with level nostrils (a92a9f9) | a | approved (struck 4, a PASS); CONFIRM failed a (pauldron, sash)
404 | MINO_SHELL a flat wedge plate: frustum .85 hx long, a bent lip, dark rim bar, light swirl on top (3c3a808 + 53b63d0) | a | approved (struck 1)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered, a box still stuck off the left flank
## Notes (max 3 lines)
- 404: the existing minoSash + buckle sit on the chest's front under the dropped bull head and its raised forearms - hidden in _idle; a sash fix must stand proud of the head's foot (or move with a raised head). The swirl reads faint (minor).
- 403 gap critic (not a blocker): the head sits low between the hunched shoulders (402 [R]), not on a neck above them as in .red.png.
- 402: the man's head block is hidden under the bull cranium. Gear ancientDress (MINO_*); head propBuilder bull_head. Scale 2.1; body -x is his left.
