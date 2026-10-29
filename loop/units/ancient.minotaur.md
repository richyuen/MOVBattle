# ancient.minotaur
Status: open   Audited: 378, 396, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 402; the 402 [R] struck 2 and 3 and added 4)
 4. head pitch in unit_ancient.minotaur_idle: the muzzle tipped down-forward so the snout points at the ground ahead of the feet, the eyes on the crown's top - TABS: the face upright with a level muzzle under the eyes, looking ahead (ref: .red.png, ancient.jpg) (added 402, introduced by cdc71a4 at propBuilder.ts:buildFittedHat - BULL_HEAD tilt .72 with drop .72)
b PASS (379)
c PASS (387)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a head pitch - blocker 4: the bull face upright with a level muzzle at the dropped cranium (BULL_HEAD tilt back to about .15, drop .72 / forward .28 kept) - ref: ancient.minotaur.red.png - ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378-379 | fur body, gear, sash; Charge (MINOTAUR_CHARGE); bare fists (BULL_FISTS) [S] | a,b,c | approved
382-385 | bull head (BULL_HEAD); gear (MINO_GEAR); pauldron shell, chest tuft (MINO_SHELL) [S] | a | approved
386-389 | scrolled girdle (MINO_SCROLL); Big Headbutt (c PASS 387); sash foot (388 rejected, reverted); girdle on the hip joint (MINO_GIRDLE) [S] | a,c | approved
396 | [R] 1.92 build, flat ribbon inlays, flush rims, front pauldron scroll (a76c891, reverted 32577c2) | a | rejected
402 | [R] bull head low and forward (drop .72, forward .28, tilt .72, level horns, neck .42), 12-side girdle hugging 1.03/1.1 with half-sunk light scrolls, pauldron scroll on top + front (cdc71a4) | a | approved (struck 2, 3; added 4)
## Rejected (last 4)
- girdle face [S] [1] - 388: sash ended on the flank with a side wrap - the girdle itself stayed a thin strip with dangling curls; the wrap read as a loose tan slab on the flank
- height and girdle [R] [1] - 396: 1.92 with flat inlays and a front pauldron scroll - he still towered (the head and horns, not the body scale, make the height), a box still stuck off the left flank
## Notes (max 3 lines)
- 402: the man's head block is hidden (dressMinotaur, headMesh.isVisible false) under the dropped cranium; his crown now sits about level with Zeus's hair in lineup_ancient. The critic: the muzzle points down-forward at ~41 degrees (tilt .72) - set it upright; the ears do not read (not a blocker).
- Body -x is his left. Gear ancientDress (MINO_*); head propBuilder bull_head; unitFactory skips the tunic skirt. Probe: loop/scripts/probes/probe_mino.mjs (--build); probe_zeus_shot.mjs --unit=ancient.minotaur --aim=torso --dist=2.4.
- The scale stays 2.1 (unitVisuals); the pauldron's front-face scroll (minoPauldronScrollFront) is what reads from the idle camera.
