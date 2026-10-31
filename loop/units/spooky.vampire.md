# spooky.vampire
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 434)
  (struck 1 at 438, 3 at 439, 2 at 440; 4's arms clause at 441)
 4. torso in unit_spooky.vampire_idle plain team — TABS: team sleeveless vest with a V neck, white sleeves, dark belt (ref: spooky.vampire.red.png)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 437)
 2. bite in unit_spooky.vampire_release is an overhead swing of a star — TABS: latches onto the enemy and sucks blood (ref: card Characteristics, Vampire Bite)
d PASS (cost 200, hp 3.05x, cd 2.50x; 442 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a torso vest - blocker 4: keep a front cape gap, but a SHORT white V (vLong ~.28 of H, vWide ~.5, point at mid-chest) on a team vest slab proud of the trunk; the cape's cut faces (enclose) out of the opening - ref: spooky.vampire.red.png - ours: unit_spooky.vampire_idle (critic 442; attempts 1)
2. [S] c latch bite - blocker 2: hold on the man at the neck, drain over time, logged "bite", a new approach - ref: card Characteristics - ours: unit_spooky.vampire_release (attempts 2: not pickable; starves at 444)
## Attempts (iter | gap | criterion | verdict)
434 | VAMPIRE_CLAWS empty clawed hands, no weapon (b8e42cdb) | b | approved (struck 1; b PASS)
437 | VAMPIRE_BAT bat form during the swoop (2c02833c) | c | approved (struck 1)
438-440 | VAMPIRE_HAIR, VAMPIRE_COLLAR, VAMPIRE_BEARD | a | approved (struck 1, 3, 2)
438-439 | VAMPIRE_BITE latch + BITE_POSE, retry (29201909, 65a0e9f5) | c | dropped x2 (pose not visible in _release)
441 | VAMPIRE_VEST white self-lit sleeves, white V slab, dark belt (76405fb2) | a | approved (4's arms clause struck)
442 | cape cut open down the front (arc gap, enclose), V .64 wide to the belt (8e29a2cb) | a | rejected (reverted 9ef221d0)
## Rejected (last 4)
- white V [S] [1] - 442: cape arc gap + V .64 of W, .86 of H - chest reads as a white shirt in an open jacket; TABS a short V notch a quarter down on a team vest; team wedge (cape cut faces) in the neck opening
## Notes (max 3 lines)
- Bite c: 2 dropped attempts (not pickable as [S]; starves at 444, then takes a slot). 439: +.45 pitch reared him back; -.45 folded him away from the man. Probe root yaw vs the man and torso world pitch at the hit first (git show 29201909, 65a0e9f5).
- 441: the idle rest pose puts a hand to the face, the forearm across the chest; the V must clear it. Collar vampireCollar (cape: CreateCylinder arc opens from +x toward +z; rotation.y = PI*gap - PI/2 put it at the front, 442); vest vampireVest.
