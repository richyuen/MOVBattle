# spooky.skeleton_warrior
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 1 at 437)
 2. bone colour in unit_spooky.skeleton_warrior_idle is cool grey — TABS: warm cream/tan bone (ref: spooky.skeleton_warrior.red.png)
 3. shorts in unit_spooky.skeleton_warrior_idle are a straight blue skirt block hung from the ribs — TABS: baggy team shorts to the knee with a brown belt at the pelvis and ragged hems around each leg (ref: spooky.skeleton_warrior.red.png, card Appearance "ragged shorts")
 4. greaves in unit_spooky.skeleton_warrior_idle are grey boot boxes on the feet — TABS: team-coloured greaves over knee and shin, bare bone feet below (ref: spooky.skeleton_warrior.blue.png)
b PASS (436: short grey Stiffy Sword, studded team shield)
c PASS (435: Stiffy Fear, purple skull over the struck man who runs off)
d PASS (cost 80, hp 0.62x, dmg 1.00x, cd 1.00x; 437 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shorts - blocker 3: baggy two-leg team shorts to the knee, a brown belt at the pelvis, ragged hems round each leg, in place of the skirt block - ref: spooky.skeleton_warrior.red.png - ours: unit_spooky.skeleton_warrior_idle (critic 437)
2. [S] a greaves - blocker 4: team greaves over knee and shin, bare bone feet in place of the grey boot boxes - ref: spooky.skeleton_warrior.blue.png - ours: unit_spooky.skeleton_warrior_idle (critic 437)
## Attempts (iter | gap | criterion | verdict)
434 | STIFFY_SHIELD studded team board on the off arm (d65f38af) | b | approved (struck 1)
435 | STIFFY_FEAR purple skull + flee (c989b05a) | c | approved (struck 1; c PASS)
436 | STIFFY_SWORD short grey leaf blade, dark bar guard (63a08a9f) | b | approved (struck 2; b PASS)
437 | STIFFY_HELMET team bowl, cheek guards to the jaw, neck guard (ac15ce9c) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 437 critic: the helmet is a paler team shade than the skirt (TABS a deep team shade). The skirt is unitFactory dressSkeleton (shared with the archer).
- Sword: propBuilder buildLeafSword/STIFFY_SWORD. Helmet: spookyDress stiffyHelmet (hides dressSkeleton's _hood).
- Fear: runtimeUnit applyFear/FEAR_SKULL, simulationSystem STIFFY_FEAR (every 2nd blow) + flee in _processUnitDecision.
