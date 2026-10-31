# spooky.vampire
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434)
  (struck 1 at 438, 3 at 439)
 2. face in unit_spooky.vampire_idle bare — TABS: dark beard with two white fangs (ref: spooky.vampire.red.png)
 4. torso and arms in unit_spooky.vampire_idle plain team — TABS: team sleeveless vest with a V neck, white sleeves, dark belt (ref: spooky.vampire.red.png)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 437)
 2. bite in unit_spooky.vampire_release is an overhead swing of a star — TABS: latches onto the enemy and sucks blood (ref: card Characteristics, Vampire Bite)
d PASS (cost 200, hp 3.05x, cd 2.50x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard and fangs - blocker 2: spookyDress vampireBeard, a dark-brown faceted beard round the jaw and chin up to the ears, two white fang wedges at the mouth line - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 439)
2. [S] a vest - blocker 4: team V-neck sleeveless vest, white sleeves, dark belt - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 439)
3. [S] c latch bite - blocker 2: latch onto the target, mouth at the neck, drain - ref: card Characteristics - ours: unit_spooky.vampire_release (attempts 2: next is the last; see Notes)
## Attempts (iter | gap | criterion | verdict)
434 | VAMPIRE_CLAWS empty clawed hands, no weapon (b8e42cdb) | b | approved (struck 1; b PASS)
437 | VAMPIRE_BAT bat form during the swoop (2c02833c) | c | approved (struck 1)
438 | VAMPIRE_HAIR slicked-back cap, swept ridge, widow's peak (16a75717) | a | approved (struck 1)
438 | VAMPIRE_BITE latch + BITE_POSE + BLOOD_DRAIN (29201909, e6949b0d) | c | dropped (pose not visible in _release)
439 | VAMPIRE_COLLAR pointed team cape + spike fan behind the head (09b87480, 3cdade49) | a | approved (struck 3)
439 | VAMPIRE_BITE retry: holdHeading on the man, pitch flipped (65a0e9f5, 94797a8b) | c | dropped (reverted 0ec49d76, a2a6e6db)
## Rejected (last 4)
## Notes (max 3 lines)
- Bite 439: latch logs fine (bite 3633 ms, hit 3900). +.45 pitch reared him back, arms overhead; -.45 folded him over AWAY from the man, arms reaching back to the neck. Probe his root yaw vs the man and the torso's world pitch at the hit before a third try (git show 29201909, 65a0e9f5).
- 439 critic: collar spikes are thin slivers edge-on (TABS broad leaves facing forward), minor. Collar spookyDress vampireCollar; unitVisuals special none.
- Hair spookyDress VAMPIRE_HAIR; bat spookyDress VAMPIRE_BAT, RuntimeUnit startBatForm/_tendBatForm, set at the "swoop" log.
