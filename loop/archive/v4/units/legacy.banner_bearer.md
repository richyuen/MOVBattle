# legacy.banner_bearer
Status: done   Audited: 457, 461 (RE-AUDIT c, lineup), 465 (CONFIRM: passed a, c, d; failed b), 466 (CONFIRM: passed b)   Done: 466
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (461: shako, coatee with epaulettes and white belts, white cuffs; BANNER_CUFFS; CONFIRM 465)
b PASS (466: thick warm-brown pole with gold collars, cross block and butt cap; gold crenellated arch with a team doorway; gold ray fan under each banner; BANNER_POLE, BANNER_ARCH, BANNER_FAN; CONFIRM 466)
c PASS (462: the held ally wears a cyan ring inside the bearer's; BEARER_RING radius 2.2; BEARER_PULSE 465; CONFIRM 465)
d PASS (cost 100, hp 1.00x, dmg 1.00x, cd 3.00x; 466 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
457-458 | STAY_BANNER cross-beam and banners (c372d09e, 3244f182, 20dbf14b); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2, 4)
459-461 | SHAKO (44da9220), BANNER_COATEE (16dedb8c), BANNER_CUFFS (e0b0812b) | a | approved (a PASS 461)
459-462 | BEARER_RING (502c506c); BEARER_AURA stay (f1ecb6fc); 461 follow-ups dropped; [P] BEARER_RING radius 2.2 (d9f8f8c5) | c | approved (struck 2, 1; c PASS)
464 | BEARER_HOLD pole plumb in both fists (70924ac8, shared) | b | approved (struck 3; b PASS)
465 | polearm_melee blow + BEARER_PULSE aura, stats knobs (545192dc, shared; evidence 2b229594) | d | approved (d PASS)
466 | BANNER_POLE (c3045bf2), BANNER_ARCH (39c35a54), BANNER_FAN (13b2b797) | b | approved (struck 3, 2, 1; b PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- 466 critic (minor): fan rays are thin spikes (TABS broad trapezoid tabs); the arch is a solid block (TABS an outline with a keyhole); pole a touch thin.
- 465 critic: the blow is a lunge with the pole plumb (BEARER_HOLD), not a swung chop. Team feet where TABS has white shoes (minor).
