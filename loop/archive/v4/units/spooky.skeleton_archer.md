# spooky.skeleton_archer
Status: done   Audited: 434, 442 (CONFIRM: passed a, c; failed b), 443 (CONFIRM: passed a, b, c)   Done: 443
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (442: warm cream unlit bone, hood + capelet, belt, bracers, boots; CONFIRM 442)
b PASS (443: bone bow held out at the target, two-handed draw at the windup; CONFIRM 443)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread; CONFIRM 442)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 443 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
434-436 | FIRE_ARROW, BURN status, BONE_BOW | b,c | approved (b, c PASS)
437-440 | SKELETON_HOOD, SKELETON_BELT, ARCHER_KIT, BOOT_SHAFT | a | approved (struck 1, 2, 4, 5)
441 | SKELETON_BONE shared self-lit bone helper, (1,.86,.6) glow .3 (00099cf7) | a | rejected-kept (revert conflicted)
442 | SKELETON_BONE flat unlit cream (1.1,.78,.4), unglowBone (21f0bc9a) | a | approved (struck 3; a PASS; CONFIRM passed a, c, failed b)
443 | DRAWS_BEFORE_LOOSE: Fire Arrow loosed off the full draw, so _windup shows the draw (3471ec43) | b | approved (struck 1; b PASS; CONFIRM 443 passed all: D)
## Rejected (last 4)
- shared bone [S] [1] - 441: one self-lit bone material for both skeletons + reaper - swatch shins ~166/161/156, neutral grey; TABS warm cream ~222/195/165
## Notes (max 3 lines)
- Bone: spookyDress SKELETON_BONE / skeletonBone() unlit + unglowBone (called in unitFactory after the spooky dress); swatch shins 215/199/164 (442).
- Burn: runtimeUnit applyBurn/BURN. Bow: propBuilder BONE_BOW (bows rest via _restIceBow, LESSONS 26). Hood, belt, kit: spookyDress skeletonArcherHood, skeletonArcherBelt, skeletonArcherKit.
- dressSkeleton (unitFactory) is shared with the warrior and takes the unit id: per-unit changes key on it (the archer's skirt is skipped there).
