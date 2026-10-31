# spooky.skeleton_warrior
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 434)
  (struck 1 at 437, 3 at 439, 4 at 440, 5 at 441)
 2. bone colour in unit_spooky.skeleton_warrior_idle is cool grey — TABS: warm cream/tan bone (ref: spooky.skeleton_warrior.red.png)
b PASS (436: short grey Stiffy Sword, studded team shield)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 441 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bone cream - blocker 2: the shared SKELETON_BONE fix (see the archer's gap; one commit serves both and the reaper) - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_swatch.png (critic 441)
## Attempts (iter | gap | criterion | verdict)
434-436 | STIFFY_SHIELD, STIFFY_FEAR, STIFFY_SWORD | b,c | approved (b, c PASS)
437 | STIFFY_HELMET team bowl, cheek guards to the jaw, neck guard (ac15ce9c) | a | approved (struck 1)
439 | STIFFY_SHORTS baggy team shorts to the knee, rag hems, brown belt, no skirt (e3336ba6) | a | approved (struck 3)
440 | STIFFY_GREAVES team knee dome + shin tube, slim bone feet (7c68a9f4, 1cdbda83) | a | approved (struck 4; added 5)
441 | bone knee knob (patella) on the joint, shorts hem .72, greave from .34 (c2ca5852) | a | approved (struck 5)
## Rejected (last 4)
## Notes (max 3 lines)
- 441 critic (minor): the bare stretch is a knee knob only, the upper shin is still greave (TABS: knee + top third of the shin bare).
- Shorts spookyDress stiffyShorts; greaves + knee bone stiffyGreaves; helmet stiffyHelmet; dressSkeleton (unitFactory) skips his skirt. Sword propBuilder STIFFY_SWORD.
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
