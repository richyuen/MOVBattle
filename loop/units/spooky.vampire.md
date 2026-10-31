# spooky.vampire
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. head in unit_spooky.vampire_idle is bald team — TABS: dark brown slicked-back hair (ref: spooky.vampire.red.png)
 2. face in unit_spooky.vampire_idle bare — TABS: dark beard with two white fangs (ref: spooky.vampire.red.png)
 3. collar in unit_spooky.vampire_idle is a small dark-red wedge on the shoulders — TABS: tall spiked team collar rising behind the head over a short shoulder cape (ref: spooky.vampire.red.png)
 4. torso and arms in unit_spooky.vampire_idle plain team — TABS: team sleeveless vest with a V neck, white sleeves, dark belt (ref: spooky.vampire.red.png)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 437)
 2. bite in unit_spooky.vampire_release is an overhead swing of a star — TABS: latches onto the enemy and sucks blood (ref: card Characteristics, Vampire Bite)
d PASS (cost 200, hp 3.05x, cd 2.50x; 437 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Vampire Bite - blocker 2: latch onto the target, mouth at the neck, with a drain (target damage, self heal) in place of the overhead swing - ref: card Characteristics - ours: unit_spooky.vampire_release (critic 437)
2. [S] a slicked hair - blocker 1: dark brown slicked-back hair cap on the man's head (as on the bat) - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 437)
3. [S] a collar - blocker 3: tall spiked team collar behind the head over a shoulder cape - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 434)
## Attempts (iter | gap | criterion | verdict)
434 | VAMPIRE_CLAWS empty clawed hands, no weapon (b8e42cdb) | b | approved (struck 1; b PASS)
437 | VAMPIRE_BAT bat form during the swoop: team bat, slicked hair, bead eyes, beating wings (2c02833c) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 437 critic: the near wing seen edge-on reads as a dark block under the bat; the bat shows in _ability_after (the _ability shot is the take-off tick).
- Bat: spookyDress vampireBat/VAMPIRE_BAT (hidden on the root), RuntimeUnit startBatForm/_tendBatForm, set at the "swoop" log in simulationSystem.
