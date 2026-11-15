# pirate.pirate_queen
Status: done   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a), 450 (CONFIRM: passed a)   Done: 450
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (450: [R] QUEEN_LEGLINE - hip at .5 of her height, beaded hem at .42 over pale slim thighs, slim knee boots, fists at the hips; CONFIRM 450)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 450 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none: done)
## Attempts (iter | gap | criterion | verdict)
425-439 | CUTLASS ... QUEEN_DREADS; [R] QUEEN_BOOTS; QUEEN_UPRIGHT; QUEEN_FRAME; [P] tall, scale | a,b,c | approved (b, c PASS; CONFIRM 431, 434 failed a)
440 | [R] QUEEN_BUILD leg chain .74, trunk .76 (fba5bc29) | a | approved (struck 1; added 2)
441-449 | legs .9 + cuts (441); QUEEN_SKIRT wrap hem cut (442, dropped); [R] QUEEN_LEGLINE hem flip + pale pelvis (444); [R] pelvis cut + front rise (449) | a | rejected x3, dropped x1; a parked 449
450 | [R] QUEEN_LEGLINE hip .5, hem .42 slanting to her right, slim pale legs, slim knee boots from under the knee, no tunicSkirt, no cape, fists at the hips (e97878d5, b5bd76ed) | a | approved (struck 2, a PASS; CONFIRM 450 passed a)
## Rejected (last 4)
- long legs [S] [1] - 441: legs .9 + head/trunk cut + skirt front cut - boot tops still reach the pelvis; legs/tall a ledger reversal of 440
- leg line [R] [1] - 444: QUEEN_LEGLINE - no leg length between hem and boots: pelvis box foot .61, knee/boot top .56-.59
- leg line [R] [2] - 449: pelvis cut + front hem rise - the thigh shows as a wedge under half a head tall; boot shafts (QUEEN_BOOTS top 1.7) and the crouched stance keep the leg short
## Notes (max 3 lines)
- 450 (what the three rejections missed): the skirt's SIDES hung to .09 of her height and the boot cuff sat above the knee; the probe showed no crouch (knees .1-.17 rad, hip sink 0) - the leg line was the hem length, the cuff height and the cape/tunic band, not the stance.
- Critic 450 notes (below the lineup bar, not blockers): the hem is level at .42 (ref falls to .33 on her right), the wrap's loose end hides behind the sabre guard, the boots are a little blocky.
- Specs: pirateDress QUEEN_SKIRT ([R] 450 QUEEN_LEGLINE), QUEEN_BOOTS, QUEEN_FRAME; stance QUEEN_UPRIGHT, guard QUEEN_GUARD (drop is a share of the pre-cut metrics.overallHeight 2.41).
