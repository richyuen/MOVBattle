# pirate.cannon
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422)
 2. the top of the barrel in unit_pirate.cannon_idle - plain - TABS: a ring crosshair sight standing on the barrel (ref: pirate.cannon.red.png; card "a crosshair on it")
 3. the rider's shirt in unit_pirate.cannon_idle - plain team - TABS: a white shirt with team stripes (ref: pirate.cannon.red.png; card "white, striped shirt")
 4. the carriage in unit_pirate.cannon_idle - a long brown box with a trail reaching back behind the rider - TABS: a short brown block between the wheels, nothing trailing (ref: pirate.cannon.red.png)
  (struck 1 at 425)
b FAIL (1 since 422)
 2. the rider's hands in unit_pirate.cannon_idle - pushing on the wheel rim from behind - TABS: on the two handles either side of the breech (ref: pirate.cannon.red.png)
  (struck 1 at 423)
c FAIL (0 since 422)
 1. the ball's path in unit_pirate.cannon_flight - a steep lob, the ball already above the treeline with the smoke trail climbing at near 45 degrees - TABS: a fast flat shot from a level muzzle (card Weapons: projectile speed 45, range 25; ref: pirate.cannon.jpg)
d PASS (cost 1000, hp 6.25x, dmg 2.09x, cd 3.00x; 425 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a crosshair - blocker 2: a ring crosshair sight (octagon ring with cross bars) standing on the barrel's top (vehicleBuilder buildCannon) - ref: pirate.cannon.red.png - ours: unit_pirate.cannon_idle (425 rank 7)
2. [S] b breech handles - blocker 2: two handles either side of the breech with the rider's fists on them - ref: pirate.cannon.red.png - ours: unit_pirate.cannon_idle (425 rank 8)
## Attempts (iter | gap | criterion | verdict)
423 | CANNON_BARREL long faceted lathe barrel proud of the carriage (b1f1f4aa) | b | approved (struck 1)
425 | CANNON_WHEEL tall octagon-rimmed wheels with clamps, axle raised (5b429ac7, 396cefd1) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- A vehicle (vehicleBuilder buildCannon, special "cannon_base"); crewman dressed by dressCannonCrew. Barrel mesh "barrel" (buildBombCannon strips it; the bomb cannon gets CANNON_WHEEL too); sockets follow CANNON_BARREL's mouth (axis .6).
- 425 defect: the rim blocks show small steps at their joins (TABS a clean octagon). c is unattempted since 422: starving by 427.
