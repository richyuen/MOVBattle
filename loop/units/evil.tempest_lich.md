# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a PASS (496 ochre collar, man's height)
b FAIL (1 since 489, 1 struck)
 2. staff foot in unit_evil.tempest_lich_idle: a plain round end — TABS: a lightning-bolt-shaped foot (ref: evil.tempest_lich.red.png)
 3. shaft in unit_evil.tempest_lich_idle: a thick grey tube — TABS: a thin dark pole (ref: evil.tempest_lich.blue.png)
 4. grip in unit_evil.tempest_lich_idle is one hand with the other arm raised — TABS: two-handed, both hands on the shaft at chest and waist (card Weapon Type Two-handed)
c PASS (495 hover, legs hanging)
d PASS (496 stats, size 1.05)
## Ranked gaps
1. [S] evil.tempest_lich.b shaft — blocker 3: thin near-black pole replacing the thick grey tube — ref: evil.tempest_lich.blue.png — ours: unit_evil.tempest_lich_idle.png
2. [S] evil.tempest_lich.b staff foot — blocker 2: lightning-bolt-shaped foot on the staff — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
3. [S] evil.tempest_lich.b grip — blocker 4: two-handed hold, hands at chest and waist — ref: card Weapon Type Two-handed; evil.tempest_lich.blue.png — ours: unit_evil.tempest_lich_idle.png
## Attempts (iter | gap | criterion | verdict)
496 | jagged ochre-brown collar round the tendrils' socket, evilDress lichCollar (f724af18) | a | approved (struck 3)
496 | [P] UV scale 1.42 to 1.05 (8e41dfe9) | a | approved (struck 1; a PASS)
495 | headless, black tendrils from a neck socket, neck black, evilDress lichTendrils (f6c8fb65, c08bc4d0) | a | approved (struck 2)
495 | hover with his own lift .22, evilDress lichHover + proceduralAnimation REAPER_HOVER mark lift (4f458ebd) | c | approved (struck 2; c PASS)
494 | team tunic over thin dark legs, black strips, evilDress lichTunic (8b9c277c) | a | approved (struck 4)
494 | jagged team crystal blade on the staff, orb hidden (fbae7a4d, 03307096) | b | approved (struck 1)
491-493 | storm cloud bolts (c, approved); REAPER_HOVER mark on the hip (c, rejected 493) | c | mixed
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- 496 DEFECTS: idle frames his back three-quarter; collar a little gold-yellow; tunic reads pale lavender (494 row).
- Look is unitFactory HORNED_EVIL "evil.tempest_lich" (tines hidden) + evilDress lichTunic, lichTendrils, lichCollar, lichHover, lichStaffCrystal (orb hidden, rod kept).
