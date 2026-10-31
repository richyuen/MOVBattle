# spooky.vampire
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 1 at 438)
 2. face in unit_spooky.vampire_idle bare — TABS: dark beard with two white fangs (ref: spooky.vampire.red.png)
 3. collar in unit_spooky.vampire_idle is a small dark-red wedge on the shoulders — TABS: tall spiked team collar rising behind the head over a short shoulder cape (ref: spooky.vampire.red.png)
 4. torso and arms in unit_spooky.vampire_idle plain team — TABS: team sleeveless vest with a V neck, white sleeves, dark belt (ref: spooky.vampire.red.png)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 437)
 2. bite in unit_spooky.vampire_release is an overhead swing of a star — TABS: latches onto the enemy and sucks blood (ref: card Characteristics, Vampire Bite)
d PASS (cost 200, hp 3.05x, cd 2.50x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a collar - blocker 3: VAMPIRE_COLLAR spiked team wedges rising behind the head over a faceted shoulder cape - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 438)
2. [S] c latch bite - blocker 2: latch onto the target, mouth at the neck, and drain in place of the overhead swing - ref: card Characteristics - ours: unit_spooky.vampire_release (critic 438; see Notes for the 438 drop)
## Attempts (iter | gap | criterion | verdict)
434 | VAMPIRE_CLAWS empty clawed hands, no weapon (b8e42cdb) | b | approved (struck 1; b PASS)
437 | VAMPIRE_BAT bat form during the swoop (2c02833c) | c | approved (struck 1)
438 | VAMPIRE_HAIR slicked-back cap, swept ridge, widow's peak (16a75717) | a | approved (struck 1)
438 | VAMPIRE_BITE latch + BITE_POSE + BLOOD_DRAIN (29201909, e6949b0d) | c | dropped (pose not visible in _release)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 bite drop: the latch worked in the sim (bite logged, pinned 1.4 s), but in _release he leaned BACK, arms over his head, face away from the man: faceTarget alone did not turn him (try holdHeading as the fencer recover does) and the dagger swing state ran under it. Code: git show 29201909.
- 438 critic: the hair reads as a flat-topped box (TABS a back-swept pointed ridge), minor. Hair spookyDress vampireHair/VAMPIRE_HAIR.
- Bat: spookyDress vampireBat/VAMPIRE_BAT, RuntimeUnit startBatForm/_tendBatForm, set at the "swoop" log in simulationSystem.
