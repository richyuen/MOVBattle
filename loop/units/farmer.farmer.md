# farmer.farmer
Status: done   Audited: 339   Done: 350
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (348)
b PASS (350)
c PASS (348)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none; fallout if revisited: [P] FORK_HOLD.up .04 -> .12, head to upper thigh, shows in unit_farmer.farmer_idle)
## Attempts (iter | gap | criterion | verdict)
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +2) | b | rejected
346 | forkShaft low carry (FORK_LOW) [S] (e75d76c) | b | dropped
347 | pitchfork stab on its own clock, hit held to the drive (FORK_STAB) [S] (31530f7 +2) | c | approved
348 | leaf-cut hem dags, strap belt (FARMER_SHIRT) [S] (84c655b) | a | approved
348 | back-step between stabs, logged "backstep" (FARMER_BACKSTEP) [S] (544512e +9ea0c08) | c | approved
349 | two-fisted low carry, both arms solved onto one line (FORK_HOLD) [R] (8407342) | b | approved
350 | fork head at hip height on a world chord, tines rolled forward and down (FORK_HOLD) [S] (aecb1d9) | b | approved
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude — off fist floats above the shaft, fork points forward like a couched lance, windup one-handed with tines in the dirt
## Notes (max 3 lines)
- FORK_HOLD lives in _turnFork: weapon arm _armTo a seat at the hip, shaft laid fist -> head seat in the world, curl roll set, off fist by _twoHandPole.
