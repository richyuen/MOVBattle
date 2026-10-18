# farmer.farmer
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (348)
b FAIL (1 since 339) plateau
 1. pitchfork in unit_farmer.farmer_idle/_windup in one fist at the butt, off hand off the shaft — TABS: both fists on the shaft at rest, held low across the front (ref: farmer.farmer.red.png)
c PASS (348)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] b two-fisted low pitchfork carry — blocker 1: rebuild the rest/windup grip, both fists on the shaft, low across the front, tines forward, kept through the back-step (critic 348: "rebuild the grip, don't nudge it"; reuse _turnFork) — ref: farmer.farmer.red.png — ours: unit_farmer.farmer_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | two-handed pitchfork carried low, curled grey tines (FORK) [S] (151102b) | b | approved
340 | liripipe hood, leaf-cut collar (LIRIPIPE) [S] (4ccaced) | a | approved
341 | white cuffed socks, brown slip-on shoes (FARMER_SOCK) [S] (3c6b4c5) | a | approved
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +2) | b | rejected
346 | forkShaft low carry (FORK_LOW) [S] (e75d76c) | b | dropped
347 | pitchfork stab on its own clock, hit held to the drive (FORK_STAB) [S] (31530f7 +2) | c | approved
348 | leaf-cut hem dags, strap belt (FARMER_SHIRT) [S] (84c655b) | a | approved
348 | back-step between stabs, logged "backstep" (FARMER_BACKSTEP) [S] (544512e +9ea0c08) | c | approved
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude — off fist floats above the shaft, fork points forward like a couched lance, windup one-handed with tines in the dirt
## Notes (max 3 lines)
- b plateau (348): 2 failed [S] (342 rejected, 346 dropped); next pick is one [R] on the carry pose (fork mesh "shaft" is not a carry node; turn it in the fist, 347 _turnFork).
- 348 critic: hem dags tilt out into a spiky star (FARMER_SHIRT.tilt .32; TABS flat); tines point behind him while backing off (part of b).
