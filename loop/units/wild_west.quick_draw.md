# wild_west.quick_draw
Status: open   Audited: 444, 451 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 451; CONFIRM list)
 1. vest in lineup_wild_west (red Quick Draw, far right) is a desaturated brown (sampled ~115,83,75 / 93,65,58), not the team red the pants show (~143,61,67) — TABS: buttoned team-colour vest, a saturated crimson matching the hat and pants (sampled ~195,80,94) (ref: wild_west.quick_draw.red.png; card Appearance "buttoned team color vest")
 2. brown flared panel hanging below the belt over the hips like a short skirt in lineup_wild_west — TABS: the vest stops at the belt and team-colour pants run straight down from it (ref: wild_west.quick_draw.red.png, wild_west.quick_draw.blue.png)
b PASS (446: one dark long-barrel revolver, off hand empty; CONFIRM 451)
c PASS (447: dodge sidestep off the missile's line; one-handed single revolver shots .2 s apart, small flash, arm out; QUICK_FAN; CONFIRM 451)
d PASS (cost 1200, hp 1.36x, dmg 1.67x, cd 0.10x; 451 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a team vest - blocker 1: drop the wildwest_leather preset and give the trunk an explicit team cloth vest (GUNSLINGER_SUIT pattern, LESSONS 449), buttons down its front; swatch the red team --noglow - ref: red.png - ours: lineup_wild_west (CONFIRM 451)
2. [S] a no tunic skirt - blocker 2: the tunic skirt off (unitFactory gate, as the miner's and the queen's), team trousers from the belt down - ref: red.png, blue.png - ours: lineup_wild_west (CONFIRM 451; critic 451 DEFECT)
## Attempts (iter | gap | criterion | verdict)
445 | off hand emptied, one gun (58b22c60) | b | approved (struck 1)
445 | painter dodge extended to quick_draw (094a18a8) | c | rejected (reverted dc736ab6)
446 | painter dodge on the held-camera pair (70728e04) + revolver (dc21c4c6) | c, b | approved (b PASS)
447 | QUICK_FAN six single shots .2 s apart, quickdraw_smoke dropped (df90098f) | c | approved (struck 2; c PASS)
447 | FLAT_HAT wildWestDress team flat-crown hat, black band (8440b9e4) | a | approved (struck 1; 4 by lineup)
448 | QUICK_DRAW_SHIRT beige sleeves rolled past the elbow + collar V (3ca4f7f6) | a | approved (struck 2)
451 | GUN_BELT wildWestDress gunBelt belt, gun-hip holster, slanting brass pouch (1e4fd4d6) | a | approved (struck 3; a PASS, then CONFIRM failed a)
## Rejected (last 4)
- projectile dodge [S] [1] - 445: _painterDodges for quick_draw (logged dodge 1900 ms) - smoke blankets him and the camera re-frames between the pair: no sidestep readable
## Notes (max 3 lines)
- Capture scene (445 evidence): he spars with an archer plus four archers in a file behind; 446: his dodge pair is one camera held at the dodge tick, gun smoke/flash hidden.
- The vest is the brown wildwest_leather preset (448 critic flag; CONFIRM 451 blocker 1); the blue team reads navy, so swatch red.
- 447 critic: the 150 ms pair shows one shot; the fanning rhythm is not seen in any shot (not a blocker).
