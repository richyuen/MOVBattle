# wild_west.quick_draw
Status: open   Audited: 444, 451 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 451; CONFIRM list)
  (struck 1 at 452)
 2. brown flared panel hanging below the belt over the hips like a short skirt in lineup_wild_west — TABS: the vest stops at the belt and team-colour pants run straight down from it (ref: wild_west.quick_draw.red.png, wild_west.quick_draw.blue.png)
b PASS (446: one dark long-barrel revolver, off hand empty; CONFIRM 451)
c PASS (447: dodge sidestep off the missile's line; one-handed single revolver shots .2 s apart, small flash, arm out; QUICK_FAN; CONFIRM 451)
d PASS (cost 1200, hp 1.36x, dmg 1.67x, cd 0.10x; 452 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a no tunic hem - blocker 2: unitFactory hangSkirt branch for quick_draw - drop the tunic hem (gate it off, as the miner's and the queen's), or hang it flush with no flare, so the pants start at the belt - ref: red.png, blue.png - ours: unit_wild_west.quick_draw_idle (CONFIRM 451; critic 452)
## Attempts (iter | gap | criterion | verdict)
445 | off hand emptied, one gun (58b22c60) | b | approved (struck 1)
445 | painter dodge extended to quick_draw (094a18a8) | c | rejected (reverted dc736ab6)
446 | painter dodge on the held-camera pair (70728e04) + revolver (dc21c4c6) | c, b | approved (b PASS)
447 | QUICK_FAN six single shots .2 s apart, quickdraw_smoke dropped (df90098f) | c | approved (struck 2; c PASS)
447 | FLAT_HAT wildWestDress team flat-crown hat, black band (8440b9e4) | a | approved (struck 1; 4 by lineup)
448 | QUICK_DRAW_SHIRT beige sleeves rolled past the elbow + collar V (3ca4f7f6) | a | approved (struck 2)
451 | GUN_BELT wildWestDress gunBelt belt, gun-hip holster, slanting brass pouch (1e4fd4d6) | a | approved (struck 3; a PASS, then CONFIRM failed a)
452 | QUICK_DRAW_VEST team cloth x.9 on the body cloth (head, hands kept), four grey buttons, tunic hem in it (1da9827a) | a | approved (struck 1, red swatch)
## Rejected (last 4)
- projectile dodge [S] [1] - 445: _painterDodges for quick_draw (logged dodge 1900 ms) - smoke blankets him and the camera re-frames between the pair: no sidestep readable
## Notes (max 3 lines)
- Capture scene (445 evidence): he spars with an archer plus four archers in a file behind; 446: his dodge pair is one camera held at the dodge tick, gun smoke/flash hidden.
- 452: the hem is team cloth now, so it blends toward the pants, but it is still a flared skirt shape (critic 452).
- 447 critic: the 150 ms pair shows one shot; the fanning rhythm is not seen in any shot (not a blocker).
