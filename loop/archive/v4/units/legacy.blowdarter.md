# legacy.blowdarter
Status: done   Audited: 457, 462 (RE-AUDIT lineup), 468 (CONFIRM: passed b, c; failed a), 469 (CONFIRM: passed a)   Done: 469
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (469: solid tan V scarf with white feathers, team shorts with a tan fringed hem, a parted bob; BLOWDARTER_SCARF, BLOWDARTER_SHORTS, BLOWDARTER_HAIR; CONFIRM 469)
b PASS (463: a long tan banded blowgun at the mouth in both fists, crossed arms; BLOWGUN + BLOWGUN_HOLD; CONFIRM 468)
c PASS (467: dart from the blowgun at the mouth, the struck man dyed green and drained; BLOW_DART + POISON; CONFIRM 468)
d PASS (cost 220, hp 1.08x, dmg 0.16x, cd 0.90x; 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
462-467 | hair bob (a, approved), MOUTH_LAUNCH (c, rejected), BLOWGUN (b PASS), muzzle launch, BLOW_DART, POISON (c PASS) | a b c | see LEDGER history
468 | BLOWDARTER_SCARF tan V, 5 white feathers (6539168f, shared) | a | approved (none struck: seen edge-on)
468 | BLOWDARTER_PANTS brown thighs, team fringed hem (6539168f, shared) | a | rejected (hunk reverted a49b8e78)
469 | evidence: idle swing .4 rad, the chest to the camera (6eb6f1ea, bee62d6c) | a | -
469 | BLOWDARTER_SCARF rebuilt as one solid V, 7 feathers, shoulder wings (3495f889) | a | approved (struck 2)
469 | BLOWDARTER_SHORTS team shorts, tan fringed hem (9c5878c2) | a | approved (struck 1)
469 | BLOWDARTER_HAIR parted crown, flared locks, no lid (8c918f0e) | a | approved (struck 3; a PASS; D)
## Rejected (last 4)
- MOUTH_LAUNCH [S] 1 - 462: dart launched from the head-box front - still leaves at crown height, no pipe at the mouth
- BLOWDARTER_PANTS [S] 1 - 468: brown pants, team fringed hem - colours inverted against the renders (team shorts, tan fringe)
## Notes (max 3 lines)
- 468: the CONFIRM list replaced the 457 list; pants follow the renders (team shorts, tan fringe), not the card.
- Minor: the pipe lacks its red feather streamer; the poison dye stays on skin only.
