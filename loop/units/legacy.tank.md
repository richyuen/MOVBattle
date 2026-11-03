# legacy.tank
Status: open   Audited: 468, 475 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 475)
 1. the three riders in unit_legacy.tank_idle: about half a man's scale on the hull; the barrel rider's torso is about half the turret's height — TABS: full-size soldiers whose seated torso is as tall as the turret and dominates the top of the tank (ref: legacy.tank.red.png, legacy.tank.png)
b PASS (468; CONFIRM 475)
c PASS (470: the shell bursts in a big white-yellow fireball; TANK_FIREBALL; CONFIRM 475)
d PASS (cost 6000=6000, hp 62.57x vs 56.25x (+11%), dmg 22.22x vs 22.22x (0%), cd 2.50x vs 2.50x (0%); 475 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] legacy.tank.a TANK_ROOF domeAt (0.34, 0.14) -> (0.34, 0.3), so the roof rider is not hidden behind the dome; fallout of [S] 7a612df2 — ours: unit_legacy.tank_idle.png
## Attempts (iter | gap | criterion | verdict)
475 | TANK_TURRET low faceted Abrams wedge (e0b2e72e) | a | approved (struck 3)
475 | TANK_ROOF cupola, team dome, hatch, two antennas (7a612df2) | a | approved (struck 4; a PASS, then CONFIRM failed a)
474 | [P] TANK_PAINT on cloth (66732b31) | a | approved (struck 2)
472 | TANK_PAINT tan hull, team skirts/rails/fittings (f46e36f9, 918ae7b5) | a | approved (none struck)
471 | TANK_RIDERS 3 seated helmeted riders (b6c89034, eab01a0d) | a | approved (struck 1)
470 | TANK_FIREBALL white-yellow fireball (889b498c, 78a19cba) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 475 critic minor: the turret front is a plain facet over the mantlet, not swept back to a blunt point.
- riders: addOperator at TANK_RIDERS seats; the rider scale is the operator's, sized for the old box turret
