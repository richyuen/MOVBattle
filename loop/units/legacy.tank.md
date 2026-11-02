# legacy.tank
Status: open   Audited: 468   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 468)
 2. hull colour in unit_legacy.tank_idle: the whole tank in team blue — TABS: a tan hull with team colour only on the track skirts, handles and fittings (ref: legacy.tank.red.png)
 3. turret in unit_legacy.tank_idle: a tall stepped box turret — TABS: the low wide faceted wedge turret of an M1 Abrams (ref: legacy.tank.red.png; card Appearance)
 4. turret roof in unit_legacy.tank_idle: two flat discs — TABS: cupolas, hatches and two tall antennas (ref: legacy.tank.red.png)
b PASS (468)
c PASS (470: the shell bursts in a big white-yellow fireball; TANK_FIREBALL)
d PASS (cost 6000=6000, hp 62.57x vs 56.25x (+11%), dmg 22.22x vs 22.22x (0%), cd 2.50x vs 2.50x (0%); 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.tank.a turret — blocker 3: a low wide faceted wedge Abrams turret — ref: legacy.tank.red.png — ours: unit_legacy.tank_idle.png
2. [S] legacy.tank.a hull colour — blocker 2: tan hull and turret material, team colour only on the skirts, handles and fittings — ref: legacy.tank.red.png — ours: unit_legacy.tank_idle.png
## Attempts (iter | gap | criterion | verdict)
472 | TANK_PAINT tan hull, team skirts/rails/fittings (f46e36f9, 918ae7b5) | a | approved (none struck; hue still grey on the swatch)
471 | TANK_RIDERS 3 seated helmeted riders (b6c89034, eab01a0d) | a | approved (struck 1)
470 | TANK_FIREBALL white-yellow fireball (889b498c, 78a19cba) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- ref legacy.tank.red.png: khaki Abrams with three red riders seated on it; ours unit_legacy.tank_idle: an all-blue stepped Tiger-like box with no crew
- ref legacy.tank.png: a blinding yellow-white blast at the muzzle and impact; ours unit_legacy.tank_release: the muzzle flash reads, but unit_legacy.tank_struck shows a black smoke lump
