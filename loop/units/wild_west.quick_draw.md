# wild_west.quick_draw
Status: done   Audited: 444, 451 (CONFIRM: passed b, c; failed a), 453 (CONFIRM: passed a, b, c)   Done: 453
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: team vest stopping at the belt over straight team trousers, flat hat, beige rolled sleeves, gun belt; CONFIRM 453)
b PASS (446: one dark long-barrel revolver, off hand empty; CONFIRM 451)
c PASS (447: dodge sidestep off the missile's line; one-handed single revolver shots .2 s apart, small flash, arm out; QUICK_FAN; CONFIRM 451)
d PASS (cost 1200, hp 1.36x, dmg 1.67x, cd 0.10x; 453 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
445 | off hand emptied, one gun (58b22c60) | b | approved (struck 1)
445 | painter dodge extended to quick_draw (094a18a8) | c | rejected (reverted dc736ab6)
446 | painter dodge on the held-camera pair (70728e04) + revolver (dc21c4c6) | c, b | approved (b PASS)
447 | QUICK_FAN six single shots .2 s apart, quickdraw_smoke dropped (df90098f) | c | approved (struck 2; c PASS)
447 | FLAT_HAT wildWestDress team flat-crown hat, black band (8440b9e4) | a | approved (struck 1; 4 by lineup)
448 | QUICK_DRAW_SHIRT beige sleeves rolled past the elbow + collar V (3ca4f7f6) | a | approved (struck 2)
451 | GUN_BELT wildWestDress gunBelt belt, gun-hip holster, slanting brass pouch (1e4fd4d6) | a | approved (struck 3; a PASS, then CONFIRM failed a)
452 | QUICK_DRAW_VEST team cloth x.9 on the body cloth (head, hands kept), four grey buttons, tunic hem in it (1da9827a) | a | approved (struck 1, red swatch)
453 | no tunic skirt, unitFactory gate (f1e7c5e9) | a | approved (struck 2; a PASS; CONFIRM passed)
## Rejected (last 4)
- projectile dodge [S] [1] - 445: _painterDodges for quick_draw (logged dodge 1900 ms) - smoke blankets him and the camera re-frames between the pair: no sidestep readable
## Notes (max 3 lines)
- Capture scene (445 evidence): he spars with an archer plus four archers in a file behind; 446: his dodge pair is one camera held at the dodge tick, gun smoke/flash hidden.
- CONFIRM 453: shoes read team-blue (TABS black), no dark hair under the brim; 453 critic: idle revolver up at the shoulder (TABS low at the thigh) - not blockers.
- 447 critic: the 150 ms pair shows one shot; the fanning rhythm is not seen in any shot (not a blocker).
