# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 434)
  (struck 1 at 437, 2 at 438, 4 at 439, 5 at 440)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 440 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cream bone - blocker 3: shared cream self-lit skeleton bone material in dressSkeleton (as REAPER_LEGS does), shared with the warrior - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 440)
## Attempts (iter | gap | criterion | verdict)
434-436 | FIRE_ARROW, BURN status, BONE_BOW | b,c | approved (b, c PASS)
437 | SKELETON_HOOD team hood round the skull, back peak, ragged capelet (a3202b9b) | a | approved (struck 1)
438 | SKELETON_BELT no skirt: bone pelvis, brown buckled belt, four team tassels (c24646b8) | a | approved (struck 2)
439 | ARCHER_KIT team forearm bracers, brown boot boxes + shin cuffs (bc447f44) | a | approved (struck 4; added 5)
440 | BOOT_SHAFT per-foot brown shafts to mid-shin + cuffs, no slab (335a51ae) | a | approved (struck 5)
## Rejected (last 4)
## Notes (max 3 lines)
- 440 critic: boots still a little wide for the thin legs (minor). 438: belt and tassels barely read behind the bow; 437: the hood a square box, its point standing up like a horn.
- Burn: runtimeUnit applyBurn/BURN. Bow: propBuilder BONE_BOW. Hood, belt, kit: spookyDress skeletonArcherHood, skeletonArcherBelt, skeletonArcherKit (ARCHER_KIT, BOOT_SHAFT).
- dressSkeleton (unitFactory) is shared with the warrior and takes the unit id: per-unit changes key on it (the archer's skirt is skipped there). Bone: SKELETON_BONE.
