# wild_west.deadeye
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 1 at 449; 2 at 451; 3 at 452)
 4. braid in unit_wild_west.deadeye_idle: none — TABS: brown braid under the hat (ref: red.png)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER)
c PASS (444: shouldered rifle fires from the muzzle with recoil, the target dropped)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 452 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a braid - blocker 4: wildWestDress deadeyeBraid, brown three-segment braid from under the hat brim down over the off shoulder - ref: red.png - ours: unit_wild_west.deadeye_idle (critic 451, 452)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester": barrel + tube, receiver, lever loop, short dark stock, musketMuzzle (2d87dded) | b | approved (struck 1; b PASS)
449 | PEAK_HAT wildWestDress team peaked hat, lampshade brim 2.25 W, crown tall .6 peak .22 (33c4d5f0) | a | approved (struck 1)
451 | DEADEYE_SHIRT wildWestDress off-white sleeves upper 1.75, forearm 1.95 to .8, cuff 1.35, collar V, glow .32 (09138420) | a | approved (struck 2)
452 | GUN_BELT gunBelt(holsters, pouches) side lists; deadeye belt with a brass-studded pouch on each hip (f7038a83) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 451/452 critic: the vest renders dark navy / olive-brown (wildwest_leather preset), TABS a team vest in deep V fronts - not a blocker yet (QUICK_DRAW_VEST pattern fixes it).
- 452 critic: the pouches are small with few brass heads (TABS broad slanting cartridge belts, a full row of loops) - not a blocker.
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker).
