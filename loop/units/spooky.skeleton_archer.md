# spooky.skeleton_archer
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434)
  (struck 1 at 437, 2 at 438)
 3. bone colour in unit_spooky.skeleton_archer_idle is grey — TABS: cream bone (ref: spooky.skeleton_archer.red.png)
 4. limbs in unit_spooky.skeleton_archer_idle bare grey to grey boxy feet — TABS: team bracers on the forearms and brown boots on the feet (ref: spooky.skeleton_archer.red.png)
b PASS (436: long cream bone bow, knob ends, team wraps)
c PASS (435: Fire Arrow flies burning; the struck man is set alight, flames tick and spread)
d PASS (cost 180, hp 0.65x, dmg 0.11x, cd 2.50x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bracers and boots - blocker 4: team forearm bracers and brown faceted boots over the feet - ref: spooky.skeleton_archer.red.png - ours: unit_spooky.skeleton_archer_idle (critic 438)
2. [P] a cream bone - blocker 3: the archer's bone material to cream (~1,.86,.6, gated to the archer), fallout of c24646b8 - shows in unit_spooky.skeleton_archer_idle ribs and limbs (critic 438)
## Attempts (iter | gap | criterion | verdict)
434 | FIRE_ARROW flame tongues on the arrow head (9c6221b2) | c | approved (struck 1)
435 | BURN status: flames on trunk/head/arms, tick + spread (d50527c4) | c | approved (struck 2; c PASS)
436 | BONE_BOW cream femur, knob ends, team wraps, upright carry (b5fd9a36) | b | approved (struck 1; b PASS)
437 | SKELETON_HOOD team hood round the skull, back peak, ragged capelet (a3202b9b) | a | approved (struck 1)
438 | SKELETON_BELT no skirt: bone pelvis, brown buckled belt, four team tassels (c24646b8) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 critic: belt and tassels barely read behind the bow (minor). 437: the hood is a square box with its point standing up like a horn.
- Burn: runtimeUnit applyBurn/BURN. Bow: propBuilder BONE_BOW. Hood + belt: spookyDress skeletonArcherHood, skeletonArcherBelt.
- dressSkeleton (unitFactory) is shared with the warrior and now takes the unit id: per-unit changes key on it (the archer's skirt is skipped there).
