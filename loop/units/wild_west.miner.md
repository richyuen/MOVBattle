# wild_west.miner
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. hat in unit_wild_west.miner_idle: black top hat with a headlamp — TABS: team miner's cap, tall dome crown, front peak (ref: red.png, .blue.png)
 2. moustache in unit_wild_west.miner_idle: none — TABS: big black handlebar moustache (ref: red.png; card Characteristics)
 3. overalls in unit_wild_west.miner_idle: dark team vest block, no braces — TABS: team overall trousers, two dark braces over a lighter team shirt (ref: red.png; card Appearance)
 4. boots in unit_wild_west.miner_idle: plain team feet — TABS: dark brown knee boots (ref: red.png)
b FAIL (1 since 444)
  (struck 1 at 445)
 2. grip in unit_wild_west.miner_windup: pick in one hand behind the hat — TABS: both hands over the shoulder (ref: card Two-handed; red.png)
c FAIL (0 since 444)
 1. AoE blast in unit_wild_west.miner_flight: target knocked back, no burst at the impact — TABS: the pick strike explodes, radius 2.5, throws rocks (ref: card Weapons; miner.png)
 2. pick swing in unit_wild_west.miner_release: pick head hidden behind the hat, reads as a head-butt — TABS: the iron head comes down in front of the body (ref: miner.png)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 445 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
7. [S] b two-handed grip - blocker 2: off hand seated on the haft below the main fist through windup and release (brute pose) - ref: red.png - ours: unit_wild_west.miner_windup (critic 445)
8. [S] c pick blast - blocker 1: explosion burst plus thrown rocks at the pick's impact, radius 2.5 - ref: miner.png - ours: unit_wild_west.miner_flight (critic 445)
12. [S] a miner cap - blocker 1: team dome-crown cap with a front peak, replacing the top hat - ref: red.png - ours: unit_wild_west.miner_idle
## Attempts (iter | gap | criterion | verdict)
445 | MINER_PICK weaponVariant "miner_pick" long haft, thin dark drooping head (47f7fe76) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 445 probe: haft ~1.35 m world (near his height); the idle foreshortens it toward the camera.
