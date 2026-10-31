# spooky.skeleton_warrior
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434)
  (struck 1 at 437, 3 at 439)
 2. bone colour in unit_spooky.skeleton_warrior_idle is cool grey — TABS: warm cream/tan bone (ref: spooky.skeleton_warrior.red.png)
 4. greaves in unit_spooky.skeleton_warrior_idle are grey boot boxes on the feet — TABS: team-coloured greaves over knee and shin, bare bone feet below (ref: spooky.skeleton_warrior.blue.png)
b PASS (436: short grey Stiffy Sword, studded team shield)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a greaves - blocker 4: spookyDress stiffyGreaves, a team knee dome + shin plate from the knee down the shin, the foot mesh back to bone, no boot box - ref: spooky.skeleton_warrior.blue.png - ours: unit_spooky.skeleton_warrior_idle (critic 439)
2. [S] a cream bone - blocker 2: dressSkeleton bone material cream (1,.86,.6) self-lit .3 as REAPER_LEGS - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_idle (critic 439)
## Attempts (iter | gap | criterion | verdict)
434 | STIFFY_SHIELD studded team board on the off arm (d65f38af) | b | approved (struck 1)
435 | STIFFY_FEAR purple skull + flee (c989b05a) | c | approved (struck 1; c PASS)
436 | STIFFY_SWORD short grey leaf blade, dark bar guard (63a08a9f) | b | approved (struck 2; b PASS)
437 | STIFFY_HELMET team bowl, cheek guards to the jaw, neck guard (ac15ce9c) | a | approved (struck 1)
439 | STIFFY_SHORTS baggy team shorts to the knee, rag hems, brown belt, no skirt (e3336ba6) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 439 critic: the two short legs merge into one wide tube in the front three-quarter (TABS a split between the knees), minor. Shorts spookyDress stiffyShorts/STIFFY_SHORTS.
- 437 critic: the helmet is a paler team shade than the skirt. Sword propBuilder STIFFY_SWORD; helmet spookyDress stiffyHelmet; dressSkeleton (unitFactory) skips his skirt.
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
