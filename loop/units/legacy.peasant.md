# legacy.peasant
Status: open   Audited: 457, 461 (RE-AUDIT lineup), 465 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 465, CONFIRM)
 1. bare team forearms below the short dress sleeves in unit_legacy.peasant_idle (and bare arms in unit_legacy.peasant_release) — TABS: tan/brown long undersleeves run from under the short team sleeve to the wrist, ending in a flared tan cuff, and read clearly against the team dress (ref: reference/units/legacy.peasant.red.png, .blue.png, legacy.peasant.jpg)
b PASS (457 audit; CONFIRM 465)
c PASS (457 audit; CONFIRM 465)
d PASS (cost 30, hp 0.32x, dmg 0.25x, cd 0.75x; 465 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.peasant.a undersleeves — blocker 1: legacyDress PEASANT_SLEEVES tan limbShell undersleeves from the dress sleeve to the wrist, a flared tan cuff — ref: legacy.peasant.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | PEASANT_HOOD team cowl (863f64ea rejected; 2692a0f1 resubmit) | a | approved (struck 2)
459-461 | PEASANT_DRESS (b3a3379d), PEASANT_BELT (9012c361; [P] a4a2f336, spent), PEASANT_LEGS (a1d34191), PEASANT_FRINGE (5978f032) | a | approved (struck 4, 5, 6, 3)
465 | lanky 1.00x build, MINER_BUILD cut (af84fde5, shared) | a | approved (struck 1; a PASS, CONFIRM failed a)
## Rejected (last 4)
- PEASANT_HOOD [S] 1 - 457: team cowl with a peak and a neck collar - the arc's gap faced backward (rotation.y = PI/2 + PI*open), burying the face and eyes
## Notes (max 3 lines)
- 458: the hood gap faces the face with rotation.y = PI/2 + PI*open + PI (457 had no +PI and buried the face).
- 461 critic (minor): the fringe locks stand proud of the face like blinkers; the socks read grey-khaki.
- CONFIRM 465: his idle is near side-on with a backward lean, and he stands half out of lineup_legacy's left edge (evidence watch).
