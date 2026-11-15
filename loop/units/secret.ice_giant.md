# secret.ice_giant
Status: open   Audited: 538 (AUDIT x2), 550 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts
a FAIL (2 since 550, 3 struck)
 3. torso below the snow mantle is a pale washed-out blue/grey in unit_secret.ice_giant_idle — TABS: saturated team colour flanks the snow V down to the belt (ref: secret.ice_giant.red.png)
b PASS (543: struck 2; CONFIRM 550)
c PASS (549: struck 3; CONFIRM 550)
d PASS (551 stats)
## Ranked gaps
1. [S] secret.ice_giant.a torso flanks — blocker 3 (colour-only: --noglow swatch): the trunk under the snow V in the squared team cloth the legs use, and fxPreset frost off (its pulse lights the body pale every frame, as it did Ullr's: runtimeUnit _applyFxPreset) — ref: secret.ice_giant.red.png — ours: unit_secret.ice_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
551 | ape build: legs 1.4 -> .9, trunk 1.3 -> 2.4, ICE_APE arms 2.8/3.05 (94674c8e) | a | approved (struck 1, 2)
551 | pelvis in the trouser cloth, belt 1.15 tall (bea519a5) | a | approved (struck 4)
550 | legs .92 -> 1.4, trunk 1.3 (56982960) | a | approved (struck 5; CONFIRM failed a)
549 | overhead long-arm slam ICE_SLAM (94a04464) | c | approved (struck 3, c PASS)
548 | mantle clearance and icicle badge (c9d01196); face cone freeze (0dc76c7c) | a, c | approved
546-547 | snow cap, belt, badge, hip shields | a | approved
541-544 | ape rig ICE_APE, club fists, snow mantle, punch shockwave | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- ICE_FIST row spent for [P]. Head top ~5.1-5.3 m (551), must stay over the Tree Giant's ~4.9 m.
- 551 critic: belt reads dark navy (TABS mid team tone); minor.
- 549 critic: the slam's ground shockwave is a few shards, no ring.
