# wild_west.miner
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 1 at 447; 3 at 448; 2 at 449)
 4. boots in unit_wild_west.miner_idle: plain team feet — TABS: dark brown knee boots (ref: red.png)
b PASS (446: long pick, both fists on the haft)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 451 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a knee boots - blocker 4: wildWestDress minerBoots, dark brown knee boots shell on the shins and feet (CACTUS_BOOTS limbShell pattern) - ref: red.png - ours: unit_wild_west.miner_idle (critic 449, 451)
10. [P] a MINER_OVERALLS.lift .35 -> .15, waist band to team (fallout of dbef099f) - ref: red.png - ours: unit_wild_west.miner_idle trunk (critic 448)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft (47f7fe76, 83e52a4f) | b | approved (b PASS)
447 | MINER_CAP wildWestDress team cap, dome .72 of the head, front peak (e7018233, b579c896) | a | approved (struck 1)
447 | MINER_BLAST spawnExplosionBurst .85 at the landed blow, splash 2.5 (1796e237) | c | approved (struck 1)
448 | MINER_OVERALLS lighter team shirt, two dark braces, waist band, no tunic skirt (dbef099f) | a | approved (struck 3)
448 | [P] MINER_BLAST.scale .85 -> .5 (a0f3a4b7) | c | approved (further moves are a ledger reversal)
449 | MINER_MOUSTACHE black handlebar bars + tip lumps, long .8 thick .28 (85c21cb8) | a | approved (struck 2)
451 | _aimPick lays the "pickaxe" holder's haft along _aimBlow's _aimTip while the blow is aimed, points in the swing plane, before _twoHandPole (1a48b2d8) | c | approved (struck 2; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 451 probe: at the logged hit _aimBlow had the fist ~2.7 rad overhead and the pick (not in _carryProp's node regex) rode it pointing back; _aimPick fixes the attitude only.
- 451 critic: the haft passes through his cap with the fists above and behind the head (TABS fists before the chest) - not a blocker.
- 448 critic: the waist band renders shirt-pale, the braces thin and black (TABS a darker team shade).
