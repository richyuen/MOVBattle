# legacy.banner_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup), 465 (CONFIRM: passed a, c, d; failed b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (461: shako, coatee with epaulettes and white belts, white cuffs; BANNER_CUFFS)
b FAIL (0 since 465, CONFIRM)
 1. banner bottom edge in unit_legacy.banner_bearer_idle (both banners, upper left and upper right of the shako) ends in a straight gold-framed edge — TABS: each banner's field ends in a fan of gold rays or tabs hanging below it (ref: reference/units/legacy.banner_bearer.blue.png, reference/factions/legacy.jpg)
 2. banner emblem in unit_legacy.banner_bearer_idle is a small gold tower glyph in the middle of a plain pale field — TABS: a large gold arch/keyhole emblem with three crenels fills most of each banner (ref: reference/units/legacy.banner_bearer.red.png)
 3. pole in unit_legacy.banner_bearer_idle (and _windup) is a thin dark-brown shaft with a gold spear tip on top — TABS: a thick warm-brown pole with gold square collars, a gold cross fitting at the beam, a gold butt cap, and no point (ref: reference/units/legacy.banner_bearer.blue.png, card Appearance)
c PASS (462: the held ally wears a cyan ring inside the bearer's; BEARER_RING radius 2.2)
d PASS (cost 100, hp 1.00x, dmg 1.00x, cd 3.00x; 465 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.b banner fan — blocker 1: a fan of gold rays hanging below each STAY_BANNER field — ref: legacy.banner_bearer.blue.png — ours: _idle
2. [S] legacy.banner_bearer.b emblem — blocker 2: a large gold crenellated arch emblem filling each banner — ref: legacy.banner_bearer.red.png — ours: _idle
3. [S] legacy.banner_bearer.b pole — blocker 3: a thick warm-brown pole, gold collars, cross fitting and butt cap, no spear tip — ref: legacy.banner_bearer.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | STAY_BANNER cross-beam and banners (c372d09e, 3244f182, 20dbf14b); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2, 4)
459-461 | SHAKO (44da9220), BANNER_COATEE (16dedb8c), BANNER_CUFFS (e0b0812b) | a | approved (a PASS 461)
459-462 | BEARER_RING (502c506c); BEARER_AURA stay (f1ecb6fc); 461 follow-ups dropped; [P] BEARER_RING radius 2.2 (d9f8f8c5) | c | approved (struck 2, 1; c PASS)
464 | BEARER_HOLD pole plumb in both fists (70924ac8, shared) | b | approved (struck 3; b PASS)
465 | polearm_melee blow + BEARER_PULSE aura, stats knobs (545192dc, shared; evidence 2b229594) | d | approved (d PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM watch: a grey-mauve tunic hem under the white waist belt (461); idle trunk leans off the pole (464).
- 465 critic: the blow is a lunge with the pole plumb (BEARER_HOLD), not a swung chop; CONFIRM 465 passed c. Team feet where TABS has white shoes (minor).
