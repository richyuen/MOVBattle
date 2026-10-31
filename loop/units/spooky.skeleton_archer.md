# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 434)
  (struck 1 at 437, 2 at 438, 4 at 439)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
 5. boots in unit_spooky.skeleton_archer_idle are one low wide brown slab under both feet that reads as a plinth he stands on — TABS: tall narrow brown boots to mid-shin with a turned cuff, each on its own foot (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a boot shafts - blocker 5: in skeletonArcherKit replace the archerBoot slab with a per-foot boot, a narrow brown shaft from the foot to mid-shin with its cuff, a toe block no wider than 1.1x the foot - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 439)
2. [S] a cream bone - blocker 3: dressSkeleton bone material cream self-lit (shared with the warrior's gap) - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 439)
## Attempts (iter | gap | criterion | verdict)
434-435 | FIRE_ARROW flame tongues; BURN status (9c6221b2, d50527c4) | c | approved (c PASS)
436 | BONE_BOW cream femur, knob ends, team wraps, upright carry (b5fd9a36) | b | approved (struck 1; b PASS)
437 | SKELETON_HOOD team hood round the skull, back peak, ragged capelet (a3202b9b) | a | approved (struck 1)
438 | SKELETON_BELT no skirt: bone pelvis, brown buckled belt, four team tassels (c24646b8) | a | approved (struck 2)
439 | ARCHER_KIT team forearm bracers, brown boot boxes + shin cuffs (bc447f44) | a | approved (struck 4; added 5)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 critic: belt and tassels barely read behind the bow (minor). 437: the hood is a square box with its point standing up like a horn.
- Burn: runtimeUnit applyBurn/BURN. Bow: propBuilder BONE_BOW. Hood, belt, kit: spookyDress skeletonArcherHood, skeletonArcherBelt, skeletonArcherKit (ARCHER_KIT).
- dressSkeleton (unitFactory) is shared with the warrior and takes the unit id: per-unit changes key on it (the archer's skirt is skipped there).
