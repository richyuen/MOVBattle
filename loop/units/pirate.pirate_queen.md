# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 440) plateau ([R] 444 QUEEN_LEGLINE rejected once; one more rejected [R] parks a)
  (struck 1 at 440)
 2. legs in unit_pirate.pirate_queen_idle are short stumps, the boots start at the skirt hem and no thigh shows — TABS: long slim legs, bare thigh between the skirt's front hem and the knee boots (ref: pirate.pirate_queen.red.png)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 444 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a leg line rebuild - blocker 2: pelvis box bottom up to ~.85 of the hip height, leg chain longer (legs .74 -> ~1) so the knee lands at ~.3 of her height, boot tops at the knee, skirt from the waist to ~.55 of her height; probe_bbox before the capture - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (critic 444)
## Attempts (iter | gap | criterion | verdict)
425-439 | CUTLASS ... QUEEN_DREADS; [R] QUEEN_BOOTS; QUEEN_UPRIGHT; QUEEN_FRAME; [P] tall, scale | a,b,c | approved (b, c PASS; CONFIRM 431, 434 failed a)
440 | [R] QUEEN_BUILD leg chain .74, trunk .76 (fba5bc29) | a | approved (struck 1; added 2)
441 | legs .9, neck x.82, trunk .66, skirt front cut, pelvis cut (72e9e80d, 52d68fdd) | a | rejected
442 | QUEEN_SKIRT wrap hem cut + pale pelvis (af6e49fd, 6eb18db0) | a | dropped (hidden behind the guards)
444 | [R] QUEEN_LEGLINE hem slant flipped (short on her left), wrap end on her right, pale pelvis, no tunic skirt, guards out .12/.24 (c71c375a, 9e30f921, c4daf42f) | a | rejected (reverted 4732b8ca, 7dcec775, cfaefef5)
## Rejected (last 4)
- long legs [S] [1] - 441: legs .9 + head/trunk cut + skirt front cut - boot tops still reach the pelvis; legs/tall a ledger reversal of 440
- leg line [R] [1] - 444: QUEEN_LEGLINE - no leg length between hem and boots: pelvis box foot .61, knee/boot top .56-.59, so the thigh sits inside pelvis and skirt; TABS hip at ~half her height, thighs ~25% of it
## Notes (max 3 lines)
- 444 probe (root frame): pelvis .62-1.01, thighs .34-1.0, knee .59, boot tops .40-.57; guards at out .12/drop .24 sat x +-.44..-.86 (clear of the legs). A close noglow shot showed a thin pale band only.
- The next [R] must change QUEEN_FRAME's leg chain (440's legs .74), justified by the 444 critic's NEXT (not a [P] reversal); keep her head top near the captain's by cutting the trunk instead.
- Spec of the [R]s at pirateDress QUEEN_BOOTS, QUEEN_FRAME (QUEEN_BUILD 440); stance QUEEN_UPRIGHT, guard QUEEN_GUARD.
