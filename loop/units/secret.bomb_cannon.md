# secret.bomb_cannon
Status: open   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed c, d; failed a, b), 534 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL plateau (0 since 534, CONFIRM 534 list; CONFIRM failed a twice: next pick one [R])
 1. a third crewman with a cutlass, standing on foot at the trail behind the carriage, in unit_secret.bomb_cannon_windup — TABS: the crew is two, a gunner sitting astride the barrel and one striped pirate behind the breech, with nobody else around the gun (ref: secret.bomb_cannon.jpg, secret.bomb_cannon.red.png; card Appearance: "the gunner ... and ... a small pirate on top of the cannon")
b PASS (534: struck 1, rider's cutlass; CONFIRM 534 passed)
c PASS (527 AUDIT x2; CONFIRM 533, 534 passed)
d PASS (534 stats; CONFIRM 533, 534 passed)
## Ranked gaps
1. [R] secret.bomb_cannon.a crew of two — blocker 1: specify from CONFIRM 533 (rider cap, body: cleared 534) and 534 (third man) lists; rider astride the barrel plus one striped pirate behind the breech, the extra crew actor dropped (linkedActorPresets secret.bomb_cannon, as the gatling's loader at 533) — ref: secret.bomb_cannon.jpg — ours: unit_secret.bomb_cannon_windup
## Attempts (iter | gap | criterion | verdict)
534 | rider's floppy team cap, bombCrewCap (08ff24b5) | a | approved (struck 1)
534 | rider in team skin, open team shirt, green sash, brown shoes, bombRiderDress (ede7b8a5) | a | approved (struck 2, a PASS; CONFIRM failed a: third man)
534 | rider's curved cutlass with a brass bow raised in his right fist, RIDER_CUTLASS (0db15db3) | b | approved (struck 1, b PASS)
533 | floppy team caps on both crewmen, bombCrewCap (d129e7ac) | a | approved (struck 3; CONFIRM failed a, b)
529-532 | BOMB_RIDER astride the barrel; BOMB_BARREL; cutlassReseat | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The rider is an addOperator in buildBombCannon (vehicleBuilder); pirate.cannon (done) has its own builder.
- 534 critic: fallout [P] RIDER_CUTLASS out .22 -> ~.5 (the fist hides his eyes in the idle); V collar does not read; cap is the crew's beret, not the big floppy hat.
- 532: rider seat follows BOMB_BARREL (rAt); muzzle socket at the bell's mouth.
