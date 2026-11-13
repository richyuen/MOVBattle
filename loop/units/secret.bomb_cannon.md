# secret.bomb_cannon
Status: open   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 533, CONFIRM 533 list)
 1. hatless head on the barrel rider in unit_secret.bomb_cannon_idle (bare round head with bead eyes, sitting on the barrel) — TABS: the pirate astride the barrel wears a big floppy team-coloured pirate hat (ref: secret.bomb_cannon.red.png, secret.bomb_cannon.blue.png)
 2. pale grey-blue plated mannequin body on the barrel rider in unit_secret.bomb_cannon_idle (it reads as armour, not as a pirate) — TABS: a team-skinned pirate in an open shirt with a green sash (ref: secret.bomb_cannon.blue.png, secret.bomb_cannon.jpg)
b FAIL (0 since 533, CONFIRM 533 list)
 1. barrel rider empty-handed in unit_secret.bomb_cannon_idle and _windup (both hands rest on the barrel) — TABS: the rider on the cannon holds a cutlass, and points it in the action shot (ref: secret.bomb_cannon.red.png, secret.bomb_cannon.jpg; card Appearance "small pirate on top of the cannon that wields a cutlass")
c PASS (527 AUDIT x2; CONFIRM 533 passed)
d PASS (533 stats; CONFIRM 533 passed)
## Ranked gaps
1. [S] secret.bomb_cannon.a rider cap — blocker 1: the floppy team cap (bombCrewCap shape) on the BOMB_RIDER in vehicleBuilder, in place of cannonBandanna — ref: secret.bomb_cannon.red.png — ours: unit_secret.bomb_cannon_idle
2. [S] secret.bomb_cannon.a rider body — blocker 2: team-skinned rider, open shirt and green sash, not the pale plated rig — ref: secret.bomb_cannon.jpg — ours: unit_secret.bomb_cannon_idle
3. [S] secret.bomb_cannon.b rider cutlass — blocker 1: a cutlass in the rider's fist, raised as the shot readies — ref: secret.bomb_cannon.jpg — ours: unit_secret.bomb_cannon_windup
## Attempts (iter | gap | criterion | verdict)
533 | floppy team caps with knot tails on both crewmen, helmet and beret off, bombCrewCap (d129e7ac) | a | approved (struck 3; CONFIRM failed a, b)
532 | long eight-sided gun, bell muzzle, BOMB_BARREL (4a2e4801) | a | approved (struck 2; 4 by lineup)
531 | crew cutlass re-seated blade-up "cutlassReseat" (135a95d9) | b | approved (struck 2, b PASS)
529 | small pirate astride the barrel, BOMB_RIDER (be2c0fc3) | a | approved (struck 1)
527 | crew cutlasses, the loader's reload raises his (7d5002bd) | b | approved (struck 1; added 2)
## Rejected (last 4)
## Notes (max 3 lines)
- The rider is an addOperator in buildBombCannon (vehicleBuilder), dressed with cannonBandanna + cannonShirt (shared with pirate.cannon: gate any change on secret.bomb_cannon).
- 533 critic: cap knot and tails do not read at idle distance; crown reads flat (minor).
- 532: rider seat follows BOMB_BARREL (rAt); muzzle socket at the bell's mouth.
