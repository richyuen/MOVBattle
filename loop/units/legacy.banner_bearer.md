# legacy.banner_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (461: shako, coatee with epaulettes and white belts, white cuffs; BANNER_CUFFS)
b PASS (464: Stay banner on a plumb pole in both fists at the chest; STAY_BANNER + BEARER_HOLD)
c PASS (462: the held ally wears a cyan ring inside the bearer's; BEARER_RING radius 2.2)
d FAIL (cost 100, hp 1.15x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.d pole blow — a Stay Banner melee swing (6 s cooldown, range 3.6) logged as a melee hit so dmg is not 0 — ref: card Weapons — ours: _release
## Attempts (iter | gap | criterion | verdict)
457-458 | STAY_BANNER cross-beam and banners (c372d09e, 3244f182, 20dbf14b); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2, 4)
459-461 | SHAKO (44da9220), BANNER_COATEE (16dedb8c), BANNER_CUFFS (e0b0812b) | a | approved (a PASS 461)
459-462 | BEARER_RING (502c506c); BEARER_AURA stay (f1ecb6fc); 461 follow-ups dropped; [P] BEARER_RING radius 2.2 (d9f8f8c5) | c | approved (struck 2, 1; c PASS)
464 | BEARER_HOLD pole plumb in both fists (70924ac8, shared) | b | approved (struck 3; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM watch: a grey-mauve tunic hem under the white waist belt (461); idle trunk leans off the pole, and outside Idle/Walking (_struck) the hold lets go, one arm up (464).
- d: dmg 0 needs a plain blow logged as a melee hit, an [S], not a stats knob; a-c PASS, so d is the last criterion.
