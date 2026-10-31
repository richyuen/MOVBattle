# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 440) plateau (442: the thigh gap spent, attempts 2 - next pick one [R] at the legs/skirt/sword-rest; plateau from CONFIRM 431/434 spent by the [R] 440)
  (struck 1 at 440)
 2. legs in unit_pirate.pirate_queen_idle are short stumps, the boots start at the skirt hem and no thigh shows — TABS: long slim legs, bare thigh between the skirt's front hem and the knee boots (ref: pirate.pirate_queen.red.png)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 441 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a long legs, bare thigh - blocker 2: one rebuild of hem, pelvis seat and boot top together, AND the crossed-blade rest (QUEEN_GUARD) lifted so the hem-to-knee band is not behind the guards in the idle; QUEEN_FRAME legs/tall untouched - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (worker 442)
## Attempts (iter | gap | criterion | verdict)
425-434 | CUTLASS, CUTLASS_SLASH, BOMB_SPIN, QUEEN_BANDANA, QUEEN_SASH, QUEEN_HAIR, QUEEN_CUTLASS, QUEEN_GUARD, QUEEN_SKIRT, QUEEN_SHIRT, QUEEN_DREADS | a,b,c | approved (b, c PASS; CONFIRM 431, 434 failed a)
435-439 | [R] QUEEN_BOOTS build; QUEEN_UPRIGHT; QUEEN_FRAME; [P] tall .85; [P] scale 1.2 | a | approved
440 | [R] QUEEN_BUILD leg chain .74, trunk .76: head top 2.31 -> 1.96 m vs captain 1.87 (fba5bc29) | a | approved (struck 1; added 2)
441 | legs .9, neck x.82, trunk .66, skirt front cut up, pelvis cut .5 (72e9e80d, 52d68fdd) | a | rejected (reverted 6f6d8b79, f7540111)
442 | QUEEN_SKIRT wrap hem cut up over her right front + pelvis in the pale trousers (af6e49fd, 6eb18db0) | a | dropped (reverted 6e37a0f6, bd2a59f2: band hidden behind the sword guards in _idle, smoke in the side shots)
## Rejected (last 4)
- long legs [S] [1] - 441: legs .9 + head/trunk cut + skirt front cut - boot tops still reach the pelvis, no thigh shows; legs/tall a ledger reversal of 440's QUEEN_BUILD
## Notes (max 3 lines)
- 442 probe (root frame): skirt .14-1.0 m all round (hem ~.56, front-left .26), pelvis box .63-1.01 in the dark body shade, knee .59, boot top .59, thighs already pale (QUEEN_SKIRT pants). The cut wrap + pale pelvis changed nothing in _idle: her bowl guards sit over that band.
- Spec of the [R]s at pirateDress QUEEN_BOOTS, QUEEN_FRAME (QUEEN_BUILD 440); queenFrame runs before her dress in unitFactory; stance QUEEN_UPRIGHT, guard QUEEN_GUARD. The scale row is spent.
