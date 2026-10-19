# farmer.farmer
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 375)
 1. hood in unit_farmer.farmer_windup (also lineup_farmer, _ability): a round ball round the head topped by a thin curled spike — TABS: tall faceted hood tapering from the shoulders into a long liripipe cone flopping back, open face (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tall cone hood with liripipe — blocker 1: faceted hood tapering from the shoulders into a long cone flopping back, open face — ref: .png — ours: unit_farmer.farmer_ability.png. Critic: _idle is shot from behind; re-aim to front three-quarter (evidence) before judging the hood front
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
