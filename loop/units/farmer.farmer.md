# farmer.farmer
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 375)
 1. hood in unit_farmer.farmer_windup (also lineup_farmer, _idle): now a tall faceted cone open at the face, but it ends in a needle-sharp near-upright spike — TABS: tall faceted hood tapering from the shoulders into a long blunt liripipe cone flopping back, open face (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hood — blocker 1: liripipe as a bent two-segment blunt tail flopping back off the cone — ref: .png — ours: unit_farmer.farmer_windup.png
2. [P] a hood — blocker 1 (fallout of 5162e03): TALL_HOOD tip lean .7 -> 1.2, blunt tip radius — NEXT shot: unit_farmer.farmer_windup (the cone's tip)
## Attempts (iter | gap | criterion | verdict)
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +2) | b | rejected
346 | forkShaft low carry (FORK_LOW) [S] (e75d76c) | b | dropped
347-350 | fork stab, leaf hem + strap belt, back-step, two-fisted low carry [R], fork head at hip [S] | a,b,c | approved
376 | tall hood: one lathe shoulders to cone, oval face window (TALL_HOOD) [S] (5162e03) | a | approved
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude — off fist floats above the shaft, fork points forward like a couched lance
## Notes (max 3 lines)
- 376: _idle IS his front (face test right); the old sphere hood hid the face, so it looked like his back. No evidence change needed.
- FORK_HOLD lives in _turnFork. TALL_HOOD is the pointed_cowl (also the wheelbarrow's Farmer); LIRIPIPE keeps the leaf collar.
