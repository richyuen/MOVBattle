# wild_west.quick_draw
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 444)
  (struck 1, 4 at 447; 2 at 448)
 3. gun belt in unit_wild_west.quick_draw_idle: none — TABS: dark belt with a holster and a diagonal ammo pouch (ref: red.png)
b PASS (446: one dark long-barrel revolver, off hand empty)
c PASS (447: dodge sidestep off the missile's line; one-handed single revolver shots .2 s apart, small flash, arm out; QUICK_FAN)
d PASS (cost 1200, hp 1.36x, dmg 1.67x, cd 0.10x; 448 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
5. [S] a gun belt - blocker 3: wildWestDress QUICK_DRAW_BELT dark belt round the waist, a holster on the gun hip, a diagonal ammo pouch on the other - ref: red.png - ours: unit_wild_west.quick_draw_idle (critic 447, 448)
## Attempts (iter | gap | criterion | verdict)
445 | off hand emptied, one gun (58b22c60) | b | approved (struck 1)
445 | painter dodge extended to quick_draw (094a18a8) | c | rejected (reverted dc736ab6)
446 | painter dodge on the held-camera pair (70728e04) + revolver (dc21c4c6) | c, b | approved (b PASS)
447 | QUICK_FAN six single shots .2 s apart, quickdraw_smoke dropped (df90098f) | c | approved (struck 2; c PASS)
447 | FLAT_HAT wildWestDress team flat-crown hat, black band (8440b9e4) | a | approved (struck 1; 4 by lineup)
448 | QUICK_DRAW_SHIRT beige sleeves rolled past the elbow + collar V (3ca4f7f6) | a | approved (struck 2)
## Rejected (last 4)
- projectile dodge [S] [1] - 445: _painterDodges for quick_draw (logged dodge 1900 ms) - smoke blankets him and the camera re-frames between the pair: no sidestep readable
## Notes (max 3 lines)
- Capture scene (445 evidence): he spars with an archer plus four archers in a file behind; 446: his dodge pair is one camera held at the dodge tick, gun smoke/flash hidden.
- 447 critic: the 150 ms pair shows one shot; the fanning rhythm is not seen in any shot (not a blocker).
- 448 critic (flag for audit): the vest is the brown wildwest leather preset, not team colour - TABS: team V vest with buttons.
