# wild_west.deadeye
Status: open   Audited: 444, 453 (CONFIRM: passed a, b; failed c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (453: peaked team hat, braid over the off shoulder, white shirt, gun belt with hip pouches; CONFIRM 453)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER; CONFIRM 453)
c FAIL (0 since 453; CONFIRM list)
 1. Winchester aim in unit_wild_west.deadeye_release — TABS: the rifle is levelled straight out at waist/chest height toward the target, both hands on it, with the flash leaving the muzzle level (ref: reference/units/wild_west.deadeye.png)
 2. rifle pose in unit_wild_west.deadeye_flight — TABS: the rifle stays levelled toward the target through the recoil (ref: reference/units/wild_west.deadeye.png)
 3. bullet streak in unit_wild_west.deadeye_release — TABS: a long white streak from the muzzle toward the target (ref: reference/units/wild_west.deadeye.png, upper right)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 453 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c levelled aim - blocker 1: the Winchester brought level at chest height toward the target in both hands from the warm-up through the shot and recoil (the musketeer's MUSKET_AIM / _aimMusket), not fired from the shoulder carry - ref: wild_west.deadeye.png - ours: unit_wild_west.deadeye_release, _flight (CONFIRM 453)
2. evidence first for blocker 3: fire at 17 ms, target hurt at 100 ms - the release pair cannot show a bullet in flight; a later release frame or a longer range (CONFIRM 453)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester": barrel + tube, receiver, lever loop, short dark stock, musketMuzzle (2d87dded) | b | approved (struck 1; b PASS)
449 | PEAK_HAT wildWestDress team peaked hat, lampshade brim 2.25 W, crown tall .6 peak .22 (33c4d5f0) | a | approved (struck 1)
451 | DEADEYE_SHIRT wildWestDress off-white sleeves upper 1.75, forearm 1.95 to .8, cuff 1.35, collar V, glow .32 (09138420) | a | approved (struck 2)
452 | GUN_BELT gunBelt(holsters, pouches) side lists; deadeye belt with a brass-studded pouch on each hip (f7038a83) | a | approved (struck 3)
453 | WESTERN_BRAID wildWestDress brown plait from under the brim over the off shoulder, dark tie, tuft (ca4802eb) | a | approved (struck 4; a PASS; CONFIRM passed a, b, failed c)
## Rejected (last 4)
## Notes (max 3 lines)
- 451/452 critic: the vest renders dark navy / olive-brown (wildwest_leather preset), TABS a team vest in deep V fronts - not a blocker yet (QUICK_DRAW_VEST pattern fixes it).
- 452 critic: the pouches are small with few brass heads (TABS broad slanting cartridge belts, a full row of loops) - not a blocker.
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker).
