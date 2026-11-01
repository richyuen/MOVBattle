# legacy.flag_bearer
Status: done   Audited: 457, 461 (RE-AUDIT c, lineup), 462 (lineup), 467 (CONFIRM: passed a, b, c, d)   Done: 467
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (467: white crested helmet, team jacket with gold placket and collar, white gold-banded cuffs, white boots with gold tops; FLAG_BOOTS; CONFIRM 467)
b PASS (464: a narrow team pennant with a gold saltire and pole rings, the pole plumb in both stacked fists; CHARGE_PENNANT + BEARER_HOLD; CONFIRM 467)
c PASS (462: the hasted ally wears his own ring inside the bearer's; BEARER_RING radius 2.2; BEARER_PULSE 465; CONFIRM 467)
d PASS (cost 500, hp 1.01x, dmg 1.00x, cd 3.00x; 467 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
457-464 | CHARGE_FLAG, POLE_GRIP.bearerPole, CHARGE_PENNANT (c0cb4ef3), BEARER_HOLD (70924ac8) | b | approved (b PASS 464)
459-461 | BEARER_RING (502c506c); scale 1.0 (f1844412); FLAG_HELMET (53a654d8); FLAG_JACKET (a397cd1f) | a, c | approved (a struck 1, 2, 5; c struck 2)
460-462 | BEARER_AURA haste (f1ecb6fc); [P] ring orange-gold (eb73db0b); [P] BEARER_RING radius 2.2 (d9f8f8c5) | c | approved (c PASS)
465 | polearm_melee blow + BEARER_PULSE aura, stats knobs (545192dc, shared) | d | approved (d PASS)
466 | FLAG_CUFFS white cuffs banded in gold (07c88423, shared) | a | approved (struck 3)
467 | FLAG_BOOTS white boots, gold tops (c676cf71, shared) | a | approved (struck 4; a PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM 467 (minor): the pennant's emblem is a white saltire (TABS a gold sword); the pole thinner and darker than TABS's orange shaft.
- 467 critic (minor): a thin dark rod stands off the helmet at eye level in _idle; 464: pennant cloth pale near-white blue.
