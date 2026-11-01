# legacy.flag_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup), 462 (lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (4 since 457)
 4. boots in unit_legacy.flag_bearer_idle, team feet — TABS: white boots with gold tops (ref: legacy.flag_bearer.blue.png)
b PASS (464: a narrow team pennant with a gold saltire and pole rings, the pole plumb in both stacked fists; CHARGE_PENNANT + BEARER_HOLD)
c PASS (462: the hasted ally wears his own ring inside the bearer's; BEARER_RING radius 2.2)
d PASS (cost 500, hp 1.01x, dmg 1.00x, cd 3.00x; 465 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.flag_bearer.a boots — blocker 4: legacyDress FLAG_BOOTS white shafts with gold tops — ref: legacy.flag_bearer.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | CHARGE_FLAG + upright pole (3537400d, 35ba9eb6); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2; added 4)
459-461 | BEARER_RING (502c506c); scale 1.0 (f1844412); FLAG_HELMET (53a654d8); FLAG_JACKET (a397cd1f) | a, c | approved (a struck 1, 2, 5; c struck 2)
460-462 | BEARER_AURA haste (f1ecb6fc); [P] ring orange-gold (eb73db0b); 461 follow-ups dropped; [P] BEARER_RING radius 2.2 (d9f8f8c5) | c | approved (struck 3, 1; c PASS)
464 | CHARGE_PENNANT narrow pennant, saltire, rings (c0cb4ef3) | b | approved (struck 4)
464 | BEARER_HOLD pole plumb in both fists (70924ac8, shared) | b | approved (struck 3; b PASS)
465 | polearm_melee blow + BEARER_PULSE aura, stats knobs (545192dc, shared) | d | approved (d PASS)
466 | FLAG_CUFFS white cuffs banded in gold (07c88423, shared) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- BEARER_RING radius has had its one root-exception move: no further [P] on that row.
- 464 critic (minor): the pennant cloth reads pale near-white blue (cloth glow); TABS full team blue.
- 465-466 critic: the blow is a lunge with the pole plumb; in 466 _idle the near arm hangs off the pole (CONFIRM watch). Cuffs short (minor).
