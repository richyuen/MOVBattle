# legacy.boxer
Status: done   Audited: 457, 461 (RE-AUDIT lineup), 465 (CONFIRM: passed c, d; failed a, b), 466 (CONFIRM: passed a, b)   Done: 466
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (466: lanky 1.08x, bare team chest, padded headgear, dark shorts with a gold band, laced boots; boxerBareChest; CONFIRM 466)
b PASS (466: team gloves bigger than the head with a white palm patch; TEAM_GLOVE rebuilt; CONFIRM 466)
c PASS (464: straight jab from the guard, Backwards Dodge hop back logged "dodge"; BOXER_JAB + HOP_BACK; CONFIRM 465)
d PASS (cost 450, hp 3.66x, dmg 1.00x, cd 0.60x; 466 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
457-458 | TEAM_GLOVE team mitts, white band; [P] team x .5 (4e6b33f9, bc99e306, f7d4c129) | b | approved (b PASS 458)
459-461 | BOXER_HEADGEAR (17904d07), BOXER_SHORTS (37bcb6d4), BOXER_BOOTS (66d5aaff) | a | approved (struck 2, 5, 3, 4)
463-464 | BOXER_JAB (523ab3d2, 578ed136), HOP_BACK Backwards Dodge (f5c1b38a) | c | approved (struck 1, 2; c PASS)
465 | lanky 1.08x build, MINER_BUILD cut (af84fde5, shared) | a | approved (struck 1; CONFIRM failed a, b)
466 | boxerBareChest (07c88423, shared); TEAM_GLOVE wide .22, team x .8, white palm (7bac4615) | a, b | approved (struck 1 each; a, b PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- 466 critic (minor): gloves ~1.8x the head (TABS ~1.3x); the white wrist band shows as a disc to the camera; shorts read lighter than TABS's.
- 463 critic (minor): the trunk pitches ~35 deg forward over the jab (BOXER_JAB.lean); TABS stays upright.
