# secret.bomb_cannon
Status: done   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed c, d; failed a, b), 534 (CONFIRM: passed b, c, d; failed a), 535 (CONFIRM: passed a, b, c, d)   Done: 535
## Verdicts
a PASS (535 [R]: struck 1, crew of two; CONFIRM 535 passed)
b PASS (534: struck 1, rider's cutlass; CONFIRM 534, 535 passed)
c PASS (527 AUDIT x2; CONFIRM 533, 534, 535 passed)
d PASS (535 stats; CONFIRM 533, 534, 535 passed)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
535 | [R] crew of two: loader actor dropped, gunner behind the breech in a striped shirt, bombGunnerStripes (918f1997) | a | approved (struck 1, a PASS; CONFIRM passed, D)
534 | rider's floppy team cap, bombCrewCap (08ff24b5) | a | approved (struck 1)
534 | rider in team skin, open team shirt, green sash, bombRiderDress (ede7b8a5) | a | approved (struck 2, a PASS; CONFIRM failed a)
534 | rider's curved cutlass raised, RIDER_CUTLASS (0db15db3) | b | approved (struck 1, b PASS)
529-533 | BOMB_RIDER astride the barrel; BOMB_BARREL; cutlassReseat; bombCrewCap | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The rider is an addOperator in buildBombCannon (vehicleBuilder); pirate.cannon (done) has its own builder.
- 535 critic: the striped gunner's blade stands straight up in _windup (TABS hands on the gun; minor). CONFIRM: sight is a plain ring, not a crosshair.
- 534 critic: RIDER_CUTLASS out .22 -> ~.5 fallout never taken (unit done).
