# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 452; CONFIRM list)
  (struck 3 at 453)
 1. hat in unit_wild_west.miner_idle: a rounded skullcap with a short front bill — TABS: a tall faceted team-colour crown with a wide brim all round (ref: wild_west.miner.red.png, wild_west.miner.blue.png)
 2. trouser legs in unit_wild_west.miner_idle: bare team skin from a thin navy waistband down to the boots — TABS: dark team-shade overall legs running into the boots (ref: wild_west.miner.blue.png)
 4. sleeves in unit_wild_west.miner_idle: bare skin arms — TABS: dark team-colour sleeves ending in tan glove cuffs (ref: wild_west.miner.red.png)
b FAIL (1 since 452; CONFIRM list)
 1. pickaxe carry in unit_wild_west.miner_idle: held one-handed low at the hip, the shaft trailing out diagonally to the left with the head at head height away from the body — TABS: gripped two-handed and shouldered, the shaft upright past the head (ref: wild_west.miner.red.png, card Characteristics "over its shoulder")
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 453 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b shouldered pick resubmit - blocker 1: PICK_SHOULDER palm actually at the chin (453: fists at the chest, haft foot at the hip), off fist on the haft under it in the rest (_twoHandPole minerHaft) - ref: red.png - ours: unit_wild_west.miner_idle (critic 453)
2. [S] a hat - blocker 1: MINER_HAT tall faceted team crown narrowing a little upward, wide flat brim all round, in place of MINER_CAP - ref: blue.png - ours: unit_wild_west.miner_idle (critic 453)
3. [S] a trousers - blocker 2: dark team-shade overall legs into the boots (limbShell on the thighs/shins) - ref: blue.png (CONFIRM 452)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-449 | MINER_CAP, MINER_OVERALLS, MINER_MOUSTACHE | a | approved (struck 1, 3, 2)
447-448 | MINER_BLAST burst at the landed blow, scale .5 | c | approved
451 | _aimPick haft along _aimBlow's _aimTip while aimed (1a48b2d8) | c | approved (struck 2; c PASS)
452 | MINER_BOOTS dark brown knee boots, turned top, dark feet (e0e391fd) | a | approved (struck 4; a PASS, then CONFIRM failed a, b)
453 | MINER_UPRIGHT idle stance: no crouch, chin up .06 (8e7167ae) | a | approved (struck 3)
453 | PICK_SHOULDER rest in _aimPick: palm reached before the shoulder, haft up leant back .3 out .12 (0a616333) | b | approved (none struck: fists at the chest, haft foot at the hip)
## Rejected (last 4)
## Notes (max 3 lines)
- 452 critic: boots chunky, about twice the shin's width (MINER_BOOTS.out 1.25 -> 1.1 [P]); shirt reads pale lilac-white, a short olive hem at the waist over bare thighs.
- 453 probe: the sunk idle stance (crouch, chin -.22) pitched his chest .4 rad and bowed the head - that was the "back of the head" (not a camera turn).
