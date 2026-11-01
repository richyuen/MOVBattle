# wild_west.deadeye
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. hat in unit_wild_west.deadeye_idle: brown tall-crown wide-brim hat — TABS: team peaked conical hat (ref: red.png)
 2. shirt in unit_wild_west.deadeye_idle: bare team arms under a dark vest block — TABS: puffy white long-sleeved shirt under a team V vest (ref: red.png; card Appearance)
 3. ammo belt in unit_wild_west.deadeye_idle: none — TABS: dark brown cartridge belts with bullet loops on both hips (ref: red.png; card Appearance)
 4. braid in unit_wild_west.deadeye_idle: none — TABS: brown braid under the hat (ref: red.png)
b PASS (448: dark lever-action Winchester, lever loop, dark wooden stock; WINCHESTER)
c PASS (444: shouldered rifle fires from the muzzle with recoil, the target dropped)
d PASS (cost 900, hp 0.91x, dmg 7.22x, cd 2.50x; 448 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
3. [S] a peaked conical team hat - blocker 1: wildWestDress DEADEYE_HAT cone crown with a wide sloped brim - ref: red.png - ours: unit_wild_west.deadeye_idle (critic 448)
4. [S] a white puffy shirt - blocker 2: long puffy white sleeves + team V vest (quickDrawShirt pattern) - ref: red.png - ours: unit_wild_west.deadeye_idle (critic 448)
## Attempts (iter | gap | criterion | verdict)
448 | WINCHESTER propBuilder weaponVariant "winchester": barrel + tube, receiver, lever loop, short dark stock, musketMuzzle (2d87dded) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 448 critic: the stock is a straight box as deep as the receiver; in the shouldered idle the lever loop stands on the top edge (not a blocker).
