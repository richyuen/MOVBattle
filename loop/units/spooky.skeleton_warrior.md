# spooky.skeleton_warrior
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 434)
  (struck 1 at 437, 3 at 439, 4 at 440; 5 added at 440)
 2. bone colour in unit_spooky.skeleton_warrior_idle is cool grey — TABS: warm cream/tan bone (ref: spooky.skeleton_warrior.red.png)
 5. legs in unit_spooky.skeleton_warrior_idle are one team column from the belt to the ankle, no bare bone between the shorts' hem and the greave — TABS: bone knee and upper shin bare between the ragged shorts and the greave (ref: spooky.skeleton_warrior.blue.png)
b PASS (436: short grey Stiffy Sword, studded team shield)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 440 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bone knee gap - blocker 5: raise the shorts' hem above the knee joint (stiffyShorts) or start the greave a full knee-height lower, so a bone knee band shows - ref: spooky.skeleton_warrior.blue.png - ours: unit_spooky.skeleton_warrior_idle (critic 440)
2. [S] a cream bone - blocker 2: shared cream self-lit skeleton bone material in dressSkeleton (as REAPER_LEGS) - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_idle (critic 440)
## Attempts (iter | gap | criterion | verdict)
434-436 | STIFFY_SHIELD, STIFFY_FEAR, STIFFY_SWORD | b,c | approved (b, c PASS)
437 | STIFFY_HELMET team bowl, cheek guards to the jaw, neck guard (ac15ce9c) | a | approved (struck 1)
439 | STIFFY_SHORTS baggy team shorts to the knee, rag hems, brown belt, no skirt (e3336ba6) | a | approved (struck 3)
440 | STIFFY_GREAVES team knee dome + shin tube, slim bone feet (7c68a9f4, 1cdbda83) | a | approved (struck 4; added 5)
## Rejected (last 4)
## Notes (max 3 lines)
- 440: greaves start .14 of the shin under the knee and the shorts' hem is .86 of the thigh under the hip: no visible bone between at the idle angle; open it from the shorts' side (STIFFY_SHORTS.hem).
- Shorts spookyDress stiffyShorts; greaves stiffyGreaves; helmet stiffyHelmet; dressSkeleton (unitFactory) skips his skirt. Sword propBuilder STIFFY_SWORD.
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
