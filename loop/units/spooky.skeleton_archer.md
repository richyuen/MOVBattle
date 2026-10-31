# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 1 at 437)
 2. blue skirt block in unit_spooky.skeleton_archer_idle from the ribs to mid-thigh — TABS: no skirt; bare pelvis with a belt and small team tassels (ref: spooky.skeleton_archer.blue.png)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
 4. limbs in unit_spooky.skeleton_archer_idle bare grey to grey boxy feet — TABS: team bracers on the forearms and brown boots on the feet (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 437 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a no skirt - blocker 2: drop the skirt block; a pelvis belt with small team tassels, bone legs bare - ref: spooky.skeleton_archer.blue.png - ours: unit_spooky.skeleton_archer_idle (critic 437)
2. [S] a bracers and boots - blocker 4: team forearm bracers and brown boots on the feet - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 437)
## Attempts (iter | gap | criterion | verdict)
434 | FIRE_ARROW flame tongues on the arrow head (9c6221b2) | c | approved (struck 1)
435 | BURN status: flames on trunk/head/arms, tick + spread (d50527c4) | c | approved (struck 2; c PASS)
436 | BONE_BOW cream femur, knob ends, team wraps, upright carry (b5fd9a36) | b | approved (struck 1; b PASS)
437 | SKELETON_HOOD team hood round the skull, back peak, ragged capelet (a3202b9b) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 437 critic: the hood is a square box with its point standing up off the crown like a horn (TABS rounded, the soft point falling back).
- Burn: runtimeUnit applyBurn/BURN, simulationSystem _stepBurning/BURN_STATUS. Bow: propBuilder buildBoneBow/BONE_BOW. Hood: spookyDress skeletonArcherHood.
- The skirt is unitFactory dressSkeleton (shared with the warrior): drop it per unit id, not for both.
