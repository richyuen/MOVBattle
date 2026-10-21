# ancient.minotaur
Status: open   Audited: 378, 396   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 378; 1 rejected [S] since 378; 1 rejected [R] since 396) [plateau]
 2. gear in unit_ancient.minotaur_idle: the girdle a tall team band with a dark foot rim now, but its scrolls darker blue 3D curls standing off the face, the left flank a separate boxy flap; no pauldron scroll from the front - TABS: lighter flat scrolls on the band face, one continuous belt, a scroll on the pauldron (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) - TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: ancient.jpg)
b PASS (379)
c PASS (387)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a height and girdle - blockers 2/3: rebuild the visual height to Zeus in lineup_ancient (the head and horns, not another scale nudge) and one girdle band whose front face carries the two lighter scrolls, no side box, the pauldron scroll on the plate facing the camera - ref: ancient.minotaur.red.png, ancient.jpg - ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-379 | fur body, gear, sash; Charge (MINOTAUR_CHARGE); bare fists (BULL_FISTS) [S] | a,b,c | approved
382-385 | bull head (BULL_HEAD); gear (MINO_GEAR); pauldron shell, chest tuft (MINO_SHELL) [S] | a | approved
386 | girdle .24 tall, rims, outlined ram's-horn scrolls; no tunic skirt (MINO_SCROLL) [S] (20a8ed6 +ab2eb1a) | a | approved (narrowed a.2)
387 | Big Headbutt (BIG_HEADBUTT) [S] (72be3fb +720dffe) | c | approved (c PASS)
388 | sash foot raised to his right flank + wrap piece, off the girdle (MINO_SASH_FOOT) [S] (8b1943a, reverted 55b56d1) | a | rejected
389 | girdle round the pelvis on the hip joint, navel to crotch, flared, scrolls on its face (MINO_GIRDLE) [S] (f835112) | a | approved (narrowed a.2)
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
## Rejected (last 4)
- girdle face [S] [1] — 388: sash ended on the flank with a side wrap — the girdle itself stayed a thin strip with dangling curls; the wrap read as a loose tan slab on the flank
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towers (the head and horns, not the body scale, make the height), a box still sticks off the left flank and the pauldron scroll does not read from the front
## Notes (max 3 lines)
- 396 critic's recipe: the height must come from the head and horns, not another scale nudge; the girdle must be one band with no side box; the pauldron scroll must face the camera in _idle.
- Body -x is his left. Gear ancientDress (MINO_*); head propBuilder bull_head; unitFactory skips the tunic skirt. Probe: loop/scripts/probes/probe_mino.mjs (--build).
- Probe close-up: probe_zeus_shot.mjs --unit=ancient.minotaur --aim=torso --dist=2.4 (writes output/loop/zeus_base.png).
