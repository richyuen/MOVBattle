# wild_west.miner
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. hat in unit_wild_west.miner_idle: black top hat with a headlamp — TABS: team miner's cap, tall dome crown, front peak (ref: red.png, .blue.png)
 2. moustache in unit_wild_west.miner_idle: none — TABS: big black handlebar moustache (ref: red.png; card Characteristics)
 3. overalls in unit_wild_west.miner_idle: dark team vest block, no braces — TABS: team overall trousers, two dark braces over a lighter team shirt (ref: red.png; card Appearance)
 4. boots in unit_wild_west.miner_idle: plain team feet — TABS: dark brown knee boots (ref: red.png)
b PASS (446: long pick, both fists on the haft)
c FAIL (0 since 444)
 1. AoE blast in unit_wild_west.miner_flight: target knocked back, no burst at the impact — TABS: the pick strike explodes, radius 2.5, throws rocks (ref: card Weapons; miner.png)
 2. pick swing in unit_wild_west.miner_release: pick head hidden behind the hat, reads as a head-butt — TABS: the iron head comes down in front of the body (ref: miner.png)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 446 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
5. [S] c pick blast - blocker 1: pick-strike explosion, radius 2.5, with rock chunks at the impact - ref: miner.png - ours: unit_wild_west.miner_flight (critic 446)
6. [S] a miner cap - blocker 1: team miner's cap with a tall dome crown and front peak, the top hat and lamp gone - ref: red.png - ours: unit_wild_west.miner_idle (critic 446)
## Attempts (iter | gap | criterion | verdict)
445 | MINER_PICK weaponVariant "miner_pick" long haft, thin dark drooping head (47f7fe76) | b | approved (struck 1)
446 | POLE_GRIP.minerHaft mark, off fist on the haft under the weapon fist (83e52a4f) | b | approved (struck 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 445 probe: haft ~1.35 m world (near his height); the idle foreshortens it toward the camera.
- 446 critic: idle holds the pick up before the chest, not on the shoulder (not a blocker).
