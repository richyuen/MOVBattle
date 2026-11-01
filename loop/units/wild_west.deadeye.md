# wild_west.deadeye
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
  (struck 1 at 449)
 2. shirt in unit_wild_west.deadeye_idle: bare team arms under a dark vest block — TABS: puffy white long-sleeved shirt under a team V vest (ref: red.png; card Appearance)
 3. ammo belt in unit_wild_west.deadeye_idle: none — TABS: dark brown cartridge belts with bullet loops on both hips (ref: red.png; card Appearance)
 4. braid in unit_wild_west.deadeye_idle: none — TABS: brown braid under the hat (ref: red.png)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER)
c PASS (444: shouldered rifle fires from the muzzle with recoil, the target dropped)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 449 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
3. [S] a white puffy shirt - blocker 2: wildWestDress deadeyeShirt, long puffy white sleeves under a team V vest (quickDrawShirt pattern) - ref: red.png - ours: unit_wild_west.deadeye_idle (critic 448, 449)
4. [S] a ammo belts - blocker 3: dark brown cartridge belts with bullet loops on both hips - ref: red.png - ours: unit_wild_west.deadeye_idle (critic 449)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester": barrel + tube, receiver, lever loop, short dark stock, musketMuzzle (2d87dded) | b | approved (struck 1; b PASS)
449 | PEAK_HAT wildWestDress team peaked hat, lampshade brim 2.25 W, crown tall .6 peak .22 (33c4d5f0) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 448 critic: the stock is a straight box as deep as the receiver; in the shouldered idle the lever loop stands on the top edge (not a blocker).
- 449 critic: the hat crown is a little tall and sharp (witch-like); TABS a lower blunter peak (not a blocker, below lineup notice).
