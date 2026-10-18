# farmer.farmer
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (348)
b FAIL (0 since 349) (plateau lifted: [R] 8407342 approved, blocker 1 struck)
 2. fork head droops to the grass in unit_farmer.farmer_idle and lineup_farmer: the shaft drops ~40 deg from the hip fist, tines on the ground by his off foot — TABS: shaft near level at upper-thigh height, head out past the off hip at hip height, tines forward (ref: farmer.farmer.red.png, farmer.farmer.blue.png)
c PASS (348)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b level low carry — blocker 2: lay the FORK_HOLD line level in world space (cancel root/hip pitch, match the prop's real shaft axis), head at hip height past the off hip, tines forward — ref: farmer.farmer.red.png — ours: lineup_farmer.png, unit_farmer.farmer_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | two-handed pitchfork carried low, curled grey tines (FORK) [S] (151102b) | b | approved
340 | liripipe hood, leaf-cut collar (LIRIPIPE) [S] (4ccaced) | a | approved
341 | white cuffed socks, brown slip-on shoes (FARMER_SOCK) [S] (3c6b4c5) | a | approved
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +2) | b | rejected
346 | forkShaft low carry (FORK_LOW) [S] (e75d76c) | b | dropped
347 | pitchfork stab on its own clock, hit held to the drive (FORK_STAB) [S] (31530f7 +2) | c | approved
348 | leaf-cut hem dags, strap belt (FARMER_SHIRT) [S] (84c655b) | a | approved
348 | back-step between stabs, logged "backstep" (FARMER_BACKSTEP) [S] (544512e +9ea0c08) | c | approved
349 | two-fisted low carry, both arms solved onto one line (FORK_HOLD) [R] (8407342) | b | approved
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude — off fist floats above the shaft, fork points forward like a couched lance, windup one-handed with tines in the dirt
## Notes (max 3 lines)
- 349 probe (fresh spawn, idle 0.5 s): shaft dir in his frame ~(-.77,-.15,.65), fists on it; the critic's 40 deg droop is in the battle shots: check hip/torso pitch and walk lean there, not the spawn pose.
- FORK_HOLD lives in _turnFork: weapon arm _armTo a seat at the hip, fork turned onto the line, off fist by _twoHandPole (POLE_GRIP.forkBar).
