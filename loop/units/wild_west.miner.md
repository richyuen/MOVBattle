# wild_west.miner
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
  (struck 1 at 447)
 2. moustache in unit_wild_west.miner_idle: none — TABS: big black handlebar moustache (ref: red.png; card Characteristics)
 3. overalls in unit_wild_west.miner_idle: dark team vest block, no braces — TABS: team overall trousers, two dark braces over a lighter team shirt (ref: red.png; card Appearance)
 4. boots in unit_wild_west.miner_idle: plain team feet — TABS: dark brown knee boots (ref: red.png)
b PASS (446: long pick, both fists on the haft)
c FAIL (1 since 444)
  (struck 1 at 447)
 2. pick swing in unit_wild_west.miner_release: pick head hidden behind the hat, reads as a head-butt — TABS: the iron head comes down in front of the body (ref: miner.png)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 447 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
3. [S] c pick swing - blocker 2: an overhead chop pose bringing the pick head from over the shoulder down in front onto the target at release (proceduralAnimation) - ref: miner.png - ours: unit_wild_west.miner_release (critic 447)
4. [S] a overalls - blocker 3: remove the vest block; two dark braces over a lighter team shirt into overall trousers (wildWestDress minerOveralls) - ref: red.png - ours: unit_wild_west.miner_idle (critic 447)
## Attempts (iter | gap | criterion | verdict)
445 | MINER_PICK weaponVariant "miner_pick" long haft, thin dark drooping head (47f7fe76) | b | approved (struck 1)
446 | POLE_GRIP.minerHaft mark, off fist on the haft under the weapon fist (83e52a4f) | b | approved (struck 2; b PASS)
447 | MINER_CAP wildWestDress team cap, dome .72 of the head, front peak (e7018233, b579c896) | a | approved (struck 1)
447 | MINER_BLAST spawnExplosionBurst .85 at the landed blow, splash 2.5 (1796e237) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 445 probe: haft ~1.35 m world (near his height); the idle foreshortens it toward the camera.
- 447 critic: the blast whites out half the _flight/_ability_after frame (MINER_BLAST.scale .85 -> smaller is [P] fallout of 1796e237); cap dome reads beanie-round (not a blocker).
- 447: a .29-of-head dome read as a flat cap; the capture's mesh-top rule is .3 of the UNIT's height, not the head's.
