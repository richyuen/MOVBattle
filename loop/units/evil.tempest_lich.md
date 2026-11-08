# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 1. scale in lineup_evil: rig 2.58 m (s 1.44), standing above the cultist and Shadow Walker — TABS: size 1.00x, a normal man's height (card Infobox; reference/factions/evil.jpg)
 3. collar in unit_evil.tempest_lich_idle: none — TABS: a jagged ochre-brown collar at the base of the tendrils (ref: evil.tempest_lich.blue.png)
b FAIL (1 since 489, 1 struck)
 2. staff foot in unit_evil.tempest_lich_idle: a plain round end — TABS: a lightning-bolt-shaped foot (ref: evil.tempest_lich.red.png)
 3. shaft in unit_evil.tempest_lich_idle: a thick grey tube — TABS: a thin dark pole (ref: evil.tempest_lich.blue.png)
 4. grip in unit_evil.tempest_lich_idle is one hand with the other arm raised — TABS: two-handed, both hands on the shaft at chest and waist (card Weapon Type Two-handed)
c PASS (495 hover, legs hanging)
d PASS (495 stats)
## Ranked gaps
1. [S] evil.tempest_lich.a collar — blocker 3: jagged ochre-brown 8-point ring at the socket's foot (evilDress lichCollar) — ref: evil.tempest_lich.blue.png — ours: unit_evil.tempest_lich_idle.png
2. [S] evil.tempest_lich.b shaft — blocker 3: thin near-black pole replacing the thick grey tube — ref: evil.tempest_lich.blue.png — ours: unit_evil.tempest_lich_idle.png
3. [P] evil.tempest_lich.a scale — blocker 1: UV tempest_lich scale 1.44 toward 1.0 (the row is blocker 1's root; fallout of approved 495 f6c8fb65): lineup_evil 5th figure's shoulders drop to the cultist's — ref: reference/factions/evil.jpg — ours: lineup_evil.png
## Attempts (iter | gap | criterion | verdict)
495 | headless, black tendrils from a neck socket, neck black, evilDress lichTendrils (f6c8fb65, c08bc4d0) | a | approved (struck 2)
495 | hover with his own lift .22, evilDress lichHover + proceduralAnimation REAPER_HOVER mark lift (4f458ebd) | c | approved (struck 2; c PASS)
494 | team tunic over thin dark legs, black strips, evilDress lichTunic (8b9c277c) | a | approved (struck 4)
494 | jagged team crystal blade on the staff, orb hidden (fbae7a4d, 03307096) | b | approved (struck 1)
493 | REAPER_HOVER mark on the hip (301f1fad, reverted 06b4f975) | c | rejected (the ground-length skirt hid the lift)
491-492 | storm cloud over the target drops held Zeus bolts (6a770969, f86388a0, a91f8594) | c | approved
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- 495 DEFECTS: idle frames him from behind (back strips show); rig 2.38 m in capture (s 1.44 in UV) still a head over his neighbours.
- Look is unitFactory HORNED_EVIL "evil.tempest_lich" (tines hidden) + evilDress lichTunic, lichTendrils, lichHover, lichStaffCrystal (orb hidden, rod kept).
