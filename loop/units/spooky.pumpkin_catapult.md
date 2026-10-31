# spooky.pumpkin_catapult
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. frame in unit_spooky.pumpkin_catapult_idle is the medieval reddish-brown timber A-frame — TABS: near-black timber frame (ref: spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones")
 2. banners in unit_spooky.pumpkin_catapult_idle absent — TABS: small team banners hanging on both sides of the frame (ref: spooky.pumpkin_catapult.red.png)
 3. operator in unit_spooky.pumpkin_catapult_idle is a blue soldier — TABS: skeleton in tattered team clothing (ref: card Appearance)
b FAIL (1 since 434)
  (struck 2 at 437)
 1. crossbars in unit_spooky.pumpkin_catapult_idle are timber — TABS: cream bones lashed as the arm and crossbars (ref: spooky.pumpkin_catapult.red.png)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 437 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b bone arm and crossbars - blocker 1: rebuild the throwing arm and frame crossbars as cream bone tubes with knob ends and dark lashings - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (critic 437)
2. [S] a banners - blocker 2: small team banners hanging on both sides of the frame - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (critic 437)
## Attempts (iter | gap | criterion | verdict)
434 | PUMPKIN_SHOT jack-o-lantern projectile (008ebd5c) | c | approved (struck 1)
435 | PUMPKIN_BURST rind + bouncing lanterns, no fireball (a7717979) | c | approved (struck 2; c PASS)
437 | RIB_CRADLE bone ribs on a spine round a carved jack-o'-lantern, no cup (3c42103f) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 435 critic: rind shards read as tan wood chips; no bones fly. Burst: visualEffects spawnPumpkinBurst / PUMPKIN_BURST.
- Cradle: vehicleBuilder buildCatapult RIB_CRADLE (spooky branch; the "pumpkinPayload" node still hides at the throw).
- a has had no attempt since audit 434: starving at 439.
