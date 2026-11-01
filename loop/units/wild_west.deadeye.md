# wild_west.deadeye
Status: open   Audited: 444, 453 (CONFIRM: passed a, b; failed c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: peaked team hat, braid over the off shoulder, white shirt, gun belt with hip pouches; CONFIRM 453)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER; CONFIRM 453)
c FAIL (1 since 453; CONFIRM list)
 1. Winchester aim in unit_wild_west.deadeye_release — TABS: the rifle is levelled straight out at waist/chest height toward the target, both hands on it, with the flash leaving the muzzle level (ref: reference/units/wild_west.deadeye.png)
 2. rifle pose in unit_wild_west.deadeye_flight — TABS: the rifle stays levelled toward the target through the recoil (ref: reference/units/wild_west.deadeye.png)
 3. bullet streak in unit_wild_west.deadeye_release — TABS: a long white streak from the muzzle toward the target (ref: reference/units/wild_west.deadeye.png, upper right) [judged on _flight per evidence 087954a5]
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 454 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c tracer - blocker 3: a long white streak from the muzzle to the target on the bullet's flight (projectile visual) - ref: deadeye.png - ours: unit_wild_west.deadeye_flight (critic 454)
2. [S] c hip-level aim - blocker 1: _aimWinchester seats the weapon fist at the hip (not .2 below the shoulder) and solves the barrel pitch to the target's chest, stock under the forearm - ref: deadeye.png - ours: unit_wild_west.deadeye_release (critic 454)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester": barrel + tube, receiver, lever loop, short dark stock, musketMuzzle (2d87dded) | b | approved (struck 1; b PASS)
449-452 | PEAK_HAT, DEADEYE_SHIRT, GUN_BELT pouches | a | approved (struck 1, 2, 3)
453 | WESTERN_BRAID wildWestDress brown plait from under the brim over the off shoulder, dark tie, tuft (ca4802eb) | a | approved (struck 4; a PASS; CONFIRM passed a, b, failed c)
454 | evidence: capture flightAt 3 ticks for the deadeye (087954a5) | c | evidence
454 | WINCHESTER_AIM _aimWinchester two-hand levelled aim in range and through the shot, GUN_WARMUP 1 s, readyAim (6a7b4719) | c | approved (none struck: shoulder height, barrel ~15° up, no streak)
## Rejected (last 4)
## Notes (max 3 lines)
- 454 critic: the stock end pokes out behind her right shoulder in _release/_flight; it should sit under the forearm at the hip.
- 451/452 critic: the vest renders dark navy / olive-brown (wildwest_leather preset), TABS a team vest in deep V fronts - not a blocker yet.
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker).
