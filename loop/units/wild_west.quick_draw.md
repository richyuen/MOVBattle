# wild_west.quick_draw
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. hat in unit_wild_west.quick_draw_idle: black top hat with a yellow disc badge — TABS: team flat-crown wide-brim hat with a black band (ref: red.png; card Appearance)
 2. shirt in unit_wild_west.quick_draw_idle: bare team arms — TABS: beige shirt with rolled-up sleeves (ref: red.png; card Appearance)
 3. gun belt in unit_wild_west.quick_draw_idle: none — TABS: dark belt with a holster and a diagonal ammo pouch (ref: red.png)
 4. hair in unit_wild_west.quick_draw_idle: none — TABS: dark grey hair under the hat (ref: red.png)
b PASS (446: one dark long-barrel revolver, off hand empty)
c FAIL (1 since 444)
  (struck 1 at 446)
 2. fire in unit_wild_west.quick_draw_release: both pistols fire one burst with a big smoke puff — TABS: rapid one-handed revolver shots, arm extended (ref: card cooldown 0.2 s; quick_draw.jpg)
d PASS (cost 1200, hp 1.36x, dmg 1.67x, cd 0.10x; 446 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hat - blocker 1: wildWestDress team flat-crown wide-brim hat with a black band, replacing captain_hat - ref: red.png - ours: unit_wild_west.quick_draw_idle (critic 446)
2. [S] c fire - blocker 2: one-arm rapid 0.2 s revolver shots with a small muzzle spark, the big quickdraw_smoke ball dropped - ref: quick_draw.jpg - ours: unit_wild_west.quick_draw_release (critic 446)
## Attempts (iter | gap | criterion | verdict)
445 | off hand emptied, one gun (58b22c60) | b | approved (struck 1)
445 | painter dodge extended to quick_draw (094a18a8) | c | rejected (reverted dc736ab6)
446 | painter dodge resubmitted on the held-camera, smoke-free pair (70728e04; evidence 496e9a7b, d3426b02) | c | approved (struck 1)
446 | weaponVariant "revolver" (dc21c4c6) | b | approved (struck 2; b PASS)
## Rejected (last 4)
- projectile dodge [S] [1] - 445: _painterDodges for quick_draw (logged dodge 1900 ms) - smoke blankets him and the camera re-frames between the pair: no sidestep readable
## Notes (max 3 lines)
- Capture scene (445 evidence): he spars with an archer plus four archers in a file behind (one archer alone dies at .4 s before loosing).
- 446 evidence: his dodge pair is one camera held at the dodge tick (on 5, .9 rad behind his side) with gun smoke/flash meshes hidden.
