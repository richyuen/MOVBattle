# legacy.peasant
Status: done   Audited: 457, 461 (RE-AUDIT lineup), 465 (CONFIRM: passed b, c, d; failed a), 466 (CONFIRM: passed a)   Done: 466
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (466: hood, fringe, team dress, rope belt, tan undersleeves to the wrist, cuffed pants, socks, shoes, lanky 1.00x; PEASANT_SLEEVES; CONFIRM 466)
b PASS (457 audit; CONFIRM 465)
c PASS (457 audit; CONFIRM 465)
d PASS (cost 30, hp 0.32x, dmg 0.25x, cd 0.75x; 466 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
457-458 | PEASANT_HOOD team cowl (863f64ea rejected; 2692a0f1 resubmit) | a | approved (struck 2)
459-461 | PEASANT_DRESS (b3a3379d), PEASANT_BELT (9012c361; [P] a4a2f336, spent), PEASANT_LEGS (a1d34191), PEASANT_FRINGE (5978f032) | a | approved (struck 4, 5, 6, 3)
465 | lanky 1.00x build, MINER_BUILD cut (af84fde5, shared) | a | approved (struck 1; CONFIRM failed a)
466 | PEASANT_SLEEVES tan undersleeves, flared cuff (07c88423, shared) | a | approved (struck 1; a PASS; CONFIRM passed)
## Rejected (last 4)
- PEASANT_HOOD [S] 1 - 457: team cowl with a peak and a neck collar - the arc's gap faced backward (rotation.y = PI/2 + PI*open), burying the face and eyes
## Notes (max 3 lines)
- 458: the hood gap faces the face with rotation.y = PI/2 + PI*open + PI (457 had no +PI and buried the face).
- 466 critic (minor): the cuff flare is modest next to TABS's bell cuff; 461: the fringe locks stand proud like blinkers.
