# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 434)
  (struck 1 at 437, 2 at 438, 4 at 439, 5 at 440)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 441 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bone cream - blocker 3: SKELETON_BONE re-chosen off palette.png to a saturated warm cream (toward (1,.72,.4)) and/or more self-light, judged on the --noglow swatch (shins near 220/195/160) - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_swatch.png (critic 441; one commit serves warrior a.2, reaper a.3)
## Attempts (iter | gap | criterion | verdict)
434-436 | FIRE_ARROW, BURN status, BONE_BOW | b,c | approved (b, c PASS)
437 | SKELETON_HOOD team hood round the skull, back peak, ragged capelet (a3202b9b) | a | approved (struck 1)
438 | SKELETON_BELT no skirt: bone pelvis, brown buckled belt, four team tassels (c24646b8) | a | approved (struck 2)
439 | ARCHER_KIT team forearm bracers, brown boot boxes + shin cuffs (bc447f44) | a | approved (struck 4; added 5)
440 | BOOT_SHAFT per-foot brown shafts to mid-shin + cuffs, no slab (335a51ae) | a | approved (struck 5)
441 | SKELETON_BONE shared self-lit bone helper, (1,.86,.6) glow .3 (00099cf7) | a | rejected-kept (revert conflicted)
## Rejected (last 4)
- shared bone [S] [1] - 441: one self-lit bone material for both skeletons + reaper - swatch shins ~166/161/156, neutral grey; TABS warm cream ~222/195/165
## Notes (max 3 lines)
- 441: the "cloth" preset desaturates (1,.86,.6) to grey even self-lit .3; the helper skeletonBone() in spookyDress (SKELETON_BONE) stays and is the one place to fix the hue. Read palette.png's right wall (tan x1 185/167/145, gold x1 208/188/113).
- Burn: runtimeUnit applyBurn/BURN. Bow: propBuilder BONE_BOW. Hood, belt, kit: spookyDress skeletonArcherHood, skeletonArcherBelt, skeletonArcherKit (ARCHER_KIT, BOOT_SHAFT).
- dressSkeleton (unitFactory) is shared with the warrior and takes the unit id: per-unit changes key on it (the archer's skirt is skipped there).
