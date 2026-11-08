# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a PASS (496 ochre collar, man's height)
b FAIL (3 since 489, 3 struck)
 4. grip in unit_evil.tempest_lich_idle is one hand with the other arm raised — TABS: two-handed, both hands on the shaft at chest and waist (card Weapon Type Two-handed)
c PASS (495 hover, legs hanging)
d PASS (497 stats, size 1.05)
## Ranked gaps
1. [S] evil.tempest_lich.b two-handed grip — blocker 4: off hand closed on the shaft at chest, main hand at the waist, in idle and windup (keep the storm cast) — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
## Attempts (iter | gap | criterion | verdict)
497 | thin near-black banded pole, the rod mesh hidden, evilDress lichStaffPole (64959020) | b | approved (struck 3)
497 | flat team zig-zag lightning bolt under the staff's foot, evilDress lichStaffFoot (4757c1df) | b | approved (struck 2)
496 | jagged ochre-brown collar round the tendrils' socket, evilDress lichCollar (f724af18) | a | approved (struck 3)
496 | [P] UV scale 1.42 to 1.05 (8e41dfe9) | a | approved (struck 1; a PASS)
495 | headless, black tendrils from a neck socket, neck black, evilDress lichTendrils (f6c8fb65, c08bc4d0) | a | approved (struck 2)
495 | hover with his own lift .22, evilDress lichHover + proceduralAnimation REAPER_HOVER mark lift (4f458ebd) | c | approved (struck 2; c PASS)
494 | team tunic over thin dark legs, black strips (8b9c277c); jagged team crystal blade, orb hidden (fbae7a4d, 03307096) | a, b | approved
491-493 | storm cloud bolts (c, approved); REAPER_HOVER mark on the hip (c, rejected 493) | c | mixed
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- 497 evidence 15e766b8: the idle swings .25 rad (probe: he faces the camera; headless, it reads as a back); RE-AUDIT a and b on the new idle at 498.
- Look is unitFactory HORNED_EVIL "evil.tempest_lich" (tines hidden) + evilDress lichTunic, lichTendrils, lichCollar, lichHover, lichStaffCrystal, lichStaffPole, lichStaffFoot (rod mesh and orb hidden, the rod node kept).
