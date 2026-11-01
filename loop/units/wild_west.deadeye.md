# wild_west.deadeye
Status: done   Audited: 444, 453 (CONFIRM: passed a, b; failed c), 456 (CONFIRM: passed c)   Done: 456
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: peaked team hat, braid over the off shoulder, white shirt, gun belt with hip pouches; CONFIRM 453)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER; CONFIRM 453)
c PASS (456: Winchester levelled at the hip in both hands, white tracer from the muzzle, recoil a slide back along the barrel; WINCHESTER_AIM, RIFLE_TRACER; CONFIRM 456)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 456 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester" (2d87dded) | b | approved (b PASS)
449-453 | PEAK_HAT, DEADEYE_SHIRT, GUN_BELT pouches, WESTERN_BRAID | a | approved (a PASS)
454 | WINCHESTER_AIM two-hand levelled aim, GUN_WARMUP 1 s, readyAim (6a7b4719) | c | approved (none struck)
455 | levelledGun overlay off, hip aim (b5b86f36) | c | rejected (reverted c6329a96)
455 | RIFLE_TRACER white streak muzzle to chest (a5310afa) | c | approved (struck 3)
456 | receiver seated in the fist + overlay off + hip aim, aimed at the man's chest (65b9d4eb, b831338d) | c | approved (struck 1)
456 | recoil a slide back along the level barrel (da3c6b53) | c | approved (struck 2; c PASS; CONFIRM passed c; D)
## Rejected (last 4)
- levelled aim [S] [1] - 455: gunner overlay scaled off by levelledGun, fist at the hip - barrel still climbs ~13° from the hip; the cause was the rifle hanging ~.27 m over the fist (fixed 456 by the seat)
## Notes (max 3 lines)
- 456 critic: in _release she drops into a forward crouch and straightens by _flight (TABS stands upright through the shot) - polish, not a blocker.
- RuntimeUnit._applyPoseOverlay "gunner" runs after the animator; it stands off by animator.levelledGun.
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker).
