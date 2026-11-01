# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 452; CONFIRM list)
  (struck 3 at 453, 1 at 454)
 2. trouser legs in unit_wild_west.miner_idle: bare team skin from a thin navy waistband down to the boots — TABS: dark team-shade overall legs running into the boots (ref: wild_west.miner.blue.png)
 4. sleeves in unit_wild_west.miner_idle: bare skin arms — TABS: dark team-colour sleeves ending in tan glove cuffs (ref: wild_west.miner.red.png)
b PASS (454: pick shouldered upright past the hat, fist at the chin, two-handed in the windup; PICK_SHOULDER; needs CONFIRM, CONFIRM 452 failed b)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 454 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a trousers - blocker 2: minerOveralls dark team-shade trouser legs from the waist into the boot tops (limbShell on the thighs/shins) - ref: blue.png - ours: unit_wild_west.miner_idle (critic 454)
2. [S] a sleeves - blocker 4: dark team sleeves on both arms ending in tan glove cuffs - ref: red.png - ours: unit_wild_west.miner_idle (critic 454)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-449 | MINER_CAP, MINER_OVERALLS, MINER_MOUSTACHE | a | approved (struck 1, 3, 2)
447-451 | MINER_BLAST burst; _aimPick haft along _aimTip | c | approved (c PASS)
452 | MINER_BOOTS dark brown knee boots, turned top, dark feet (e0e391fd) | a | approved (struck 4; a PASS, then CONFIRM failed a, b)
453 | MINER_UPRIGHT idle stance: no crouch, chin up .06 (8e7167ae) | a | approved (struck 3)
453 | PICK_SHOULDER rest in _aimPick: palm before the shoulder, haft up leant back .3 out .12 (0a616333) | b | approved (none struck)
454 | MINER_HAT tall 8-sided team crown tipped back .14, sloped brim 1.85 all round (96109e64) | a | approved (struck 1)
454 | PICK_SHOULDER palm up 1.25 shoulder heights, side .15, front .5 (aeb80c8a) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 454 critic: the crown is near-straight with a flat top, brim narrow, a little top-hat-like (TABS tapers, wider sloped brim) - not a blocker; idle off hand at the lower chest, not on the haft.
- 452 critic: boots chunky, about twice the shin's width (MINER_BOOTS.out 1.25 -> 1.1 [P]); shirt reads pale lilac-white.
- 453 probe: the sunk idle stance (crouch, chin -.22) bowed the head - that was the "back of the head" (not a camera turn).
