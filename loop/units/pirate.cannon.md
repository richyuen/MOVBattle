# pirate.cannon
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 3. the rider's shirt in unit_pirate.cannon_idle - plain team - TABS: a white shirt with team stripes (ref: pirate.cannon.red.png; card "white, striped shirt")
  (struck 1 at 425; 2 at 426; 4 at 426, not placeable in lineup_pirate)
b FAIL (1 since 422)
 2. the rider's hands in unit_pirate.cannon_idle - pushing on the wheel rim from behind - TABS: on the two handles either side of the breech (ref: pirate.cannon.red.png)
  (struck 1 at 423)
c PASS (427: a fast flat shot off the level barrel, level smoke trail)
d PASS (cost 1000, hp 6.25x, dmg 2.09x, cd 3.00x; 427 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b breech handles - blocker 2: two handles beside the breech with the rider's hands posed on them (vehicleBuilder) - ref: pirate.cannon.red.png - ours: unit_pirate.cannon_idle (427 rank 7)
2. [S] a striped shirt - blocker 3: a white shirt shell over the rider's trunk with 3-4 team bands (dressCannonCrew) - ref: pirate.cannon.red.png - ours: unit_pirate.cannon_idle (427 rank 8)
## Attempts (iter | gap | criterion | verdict)
423 | CANNON_BARREL long faceted lathe barrel proud of the carriage (b1f1f4aa) | b | approved (struck 1)
425 | CANNON_WHEEL tall octagon-rimmed wheels with clamps, axle raised (5b429ac7, 396cefd1) | a | approved (struck 1)
426 | CANNON_SIGHT ring crosshair on the barrel's back (bd059354) | a | approved (struck 2, 4)
427 | LAUNCH.cannonball ballistic flat shot at 45 m/s (5adcac44) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- A vehicle (vehicleBuilder buildCannon, special "cannon_base"); crewman dressed by dressCannonCrew. Barrel mesh "barrel", sight "cannonSight"; sockets follow CANNON_BARREL's mouth (axis .6). "cannonball" shape is the pirate cannon's alone (specialHint cannon + stone).
- 427 defect: no muzzle flash or smoke burst at the bore. 425: rim blocks show small steps at their joins.
