# wild_west.miner
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 1 at 447; 3 at 448; 2 at 449)
 4. boots in unit_wild_west.miner_idle: plain team feet — TABS: dark brown knee boots (ref: red.png)
b PASS (446: long pick, both fists on the haft)
c FAIL (1 since 444)
  (struck 1 at 447)
 2. pick swing in unit_wild_west.miner_release: pick head hidden behind the hat, reads as a head-butt — TABS: the iron head comes down in front of the body (ref: miner.png)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 449 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a knee boots - blocker 4: wildWestDress minerBoots, dark brown knee boots (reuse the cactusBoots shaft mesh) - ref: red.png - ours: unit_wild_west.miner_idle (critic 449)
2. [S] c pick comes down in front - blocker 2: the attack pose drives the haft through to the front-down so the iron head is ahead of the chest at the hit (proceduralAnimation) - ref: miner.png - ours: unit_wild_west.miner_release (critic 447-449)
10. [P] a MINER_OVERALLS.lift .35 -> .15, waist band to team (fallout of dbef099f) - ref: red.png - ours: unit_wild_west.miner_idle trunk (critic 448)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft (47f7fe76, 83e52a4f) | b | approved (b PASS)
447 | MINER_CAP wildWestDress team cap, dome .72 of the head, front peak (e7018233, b579c896) | a | approved (struck 1)
447 | MINER_BLAST spawnExplosionBurst .85 at the landed blow, splash 2.5 (1796e237) | c | approved (struck 1)
448 | MINER_OVERALLS lighter team shirt, two dark braces, waist band, no tunic skirt (dbef099f) | a | approved (struck 3)
448 | [P] MINER_BLAST.scale .85 -> .5 (a0f3a4b7) | c | approved (further moves are a ledger reversal)
449 | MINER_MOUSTACHE black handlebar bars + tip lumps, long .8 thick .28 (85c21cb8) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- The pick swing: the halberd chop (_animateHalberdChop, found by a "haxe" child) also drives the halberd's rest carry; marking the pick would change his idle grip (b PASS). Give the pick its own chop path under _animateHeavySwing.
- 447: a .29-of-head dome read as a flat cap; the capture's mesh-top rule is .3 of the UNIT's height, not the head's.
- 448 critic: the waist band renders shirt-pale, the braces thin and black (TABS a darker team shade).
