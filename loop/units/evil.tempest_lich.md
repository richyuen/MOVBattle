# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2), 498 (RE-AUDIT a, b x2), 498 (CONFIRM: passed b, c, d; failed a), 499 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 499) plateau (CONFIRM failed a twice: 498 robe length, 499 tendril height)
 1. headless tendril crown in unit_evil.tempest_lich_idle — short spiky tuft about half the torso's height. TABS: tall black tendrils rising from the collar, the longest one taller than the whole torso, making a tall dark antler-like silhouette (ref: reference/units/evil.tempest_lich.red.png, reference/factions/evil.jpg fifth figure)
b PASS (498 two-handed grip, long blade head; CONFIRM 498)
c PASS (495 hover, legs hanging; CONFIRM 498)
d PASS (499 stats; CONFIRM 498)
## Ranked gaps
1. [R] evil.tempest_lich.a tendril crown — blocker 1: rebuild LICH_SOCKET/lichTendrils from a spec read off evil.tempest_lich.blue.png: tendrils from the collar to ~1.9x the collar-to-hem torso, the tallest central, black, antler-like; keep the robe to the shins (499) and the hover gap — ref: evil.tempest_lich.blue.png — ours: unit_evil.tempest_lich_idle.png, lineup_evil.png
## Attempts (iter | gap | criterion | verdict)
499 | robe past the knee, torn hem, a robe round each shin, strips to the ankles, evilDress lichTunic (bb1030f6) | a | approved (struck 5; critic a PASS, CONFIRM failed a: tendril height)
498 | off fist on the shaft (63006385); long crude team blade head (594b761d) | b | approved (struck 4, 5; b PASS)
498 | team coat over trunk and sleeves, evilDress lichCoat (b08f6e09) | a | approved (struck 4; CONFIRM failed a: robe length)
497 | thin banded pole (64959020); team bolt at the staff foot (4757c1df) | b | approved (struck 3, 2)
496 | ochre collar (f724af18); [P] scale 1.05 (8e41dfe9) | a | approved
495 | headless tendrils (f6c8fb65, c08bc4d0); hover .22 (4f458ebd) | a, c | approved (c PASS)
491-494 | storm cloud (c); team tunic (a); crystal (b) | a, b, c | approved
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- 498 DEFECTS: windup holds the pole well out in front; blade lacks the root knuckle; blue-team coat reads the pale skin tint. Blade raised the rig to 2.69 m (capture frames by its top).
- Look is HORNED_EVIL "evil.tempest_lich" + evilDress lichTunic, lichTendrils (LICH_SOCKET: 7 tendrils to 2.45H), lichCollar, lichCoat, lichHover, lichStaffCrystal, lichStaffPole (lichGrip), lichStaffFoot.
