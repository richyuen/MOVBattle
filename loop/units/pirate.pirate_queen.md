# pirate.pirate_queen
Status: parked   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 440) parked (449: second rejected [R] QUEEN_LEGLINE)
  (struck 1 at 440)
 2. legs in unit_pirate.pirate_queen_idle are short stumps, the boots start at the skirt hem and no thigh shows — TABS: long slim legs, bare thigh between the skirt's front hem and the knee boots (ref: pirate.pirate_queen.red.png)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 449 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none: a parked. If reopened: [R] leg line from red.png's shares, hip ~.5 and boot tops ~.27 of her height, hip raised and boot shafts shortened, not more skirt cuts - critic 449)
## Attempts (iter | gap | criterion | verdict)
425-439 | CUTLASS ... QUEEN_DREADS; [R] QUEEN_BOOTS; QUEEN_UPRIGHT; QUEEN_FRAME; [P] tall, scale | a,b,c | approved (b, c PASS; CONFIRM 431, 434 failed a)
440 | [R] QUEEN_BUILD leg chain .74, trunk .76 (fba5bc29) | a | approved (struck 1; added 2)
441 | legs .9, neck x.82, trunk .66, skirt front cut, pelvis cut (72e9e80d, 52d68fdd) | a | rejected
442 | QUEEN_SKIRT wrap hem cut + pale pelvis (af6e49fd, 6eb18db0) | a | dropped (hidden behind the guards)
444 | [R] QUEEN_LEGLINE hem slant flipped, wrap end on her right, pale pelvis, no tunic skirt, guards out (c71c375a, 9e30f921, c4daf42f) | a | rejected (reverted)
449 | [R] QUEEN_LEGLINE pelvis cut .5, front hem rise .62, wrap flap at the side (b27052fd) | a | rejected (reverted aeadca2f); a parked
## Rejected (last 4)
- long legs [S] [1] - 441: legs .9 + head/trunk cut + skirt front cut - boot tops still reach the pelvis; legs/tall a ledger reversal of 440
- leg line [R] [1] - 444: QUEEN_LEGLINE - no leg length between hem and boots: pelvis box foot .61, knee/boot top .56-.59
- leg line [R] [2] - 449: pelvis cut + front hem rise - the thigh shows as a wedge under half a head tall; boot shafts (QUEEN_BOOTS top 1.7) and the crouched stance keep the leg short
## Notes (max 3 lines)
- 449 probe (root frame): pelvis .79-1.03, front hem ~.74-.80, thighs .34-1.0, boot tops ~.56. Skirt cuts alone cannot make leg length; the hip and the boot shafts set it.
- Spec of the [R]s at pirateDress QUEEN_BOOTS, QUEEN_FRAME (QUEEN_BUILD 440); stance QUEEN_UPRIGHT, guard QUEEN_GUARD.
