# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2), 498 (RE-AUDIT a, b x2), 498 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 498)
 5. Robe in lineup_evil (5th figure, pink, with the tall staff): the tunic ends at the hip and both dark trouser legs show in full. TABS shows a ragged robe hanging to the shins, with tattered strips trailing toward the ankles (ref: evil.tempest_lich.red.png; evil.tempest_lich.blue.png; reference/factions/evil.jpg, 5th figure)
b PASS (498 two-handed grip, long blade head; CONFIRM 498)
c PASS (495 hover, legs hanging; CONFIRM 498)
d PASS (498 stats; CONFIRM 498)
## Ranked gaps
1. [S] evil.tempest_lich.a robe to the shins — blocker 5: LICH_TUNIC skirt long to mid-shin with ragged strips toward the ankles, while the hover still opens a gap under the feet (LESSONS: a ground-length skirt hides the hover) — ref: evil.tempest_lich.red.png — ours: lineup_evil.png
## Attempts (iter | gap | criterion | verdict)
498 | off fist on the shaft above the weapon fist, POLE_GRIP lichGrip marker (63006385) | b | approved (struck 4)
498 | long crude team blade head, LICH_CRYSTAL profile (594b761d) | b | approved (struck 5; b PASS)
498 | team coat over trunk and sleeves, flared cuffs, dark seam, evilDress lichCoat (b08f6e09) | a | approved (struck 4; critic a PASS, CONFIRM failed a)
497 | thin banded pole (64959020); team bolt at the staff foot (4757c1df) | b | approved (struck 3, 2)
496 | ochre collar (f724af18); [P] scale 1.05 (8e41dfe9) | a | approved (a PASS)
495 | headless tendrils (f6c8fb65, c08bc4d0); hover .22 (4f458ebd) | a, c | approved (c PASS)
491-494 | storm cloud (c); team tunic (a); crystal (b) | a, b, c | approved
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- 498 DEFECTS: windup holds the pole well out in front; blade lacks the root knuckle; blue-team coat reads the pale skin tint. Blade raised the rig to 2.69 m (capture frames by its top).
- Look is HORNED_EVIL "evil.tempest_lich" + evilDress lichTunic, lichTendrils, lichCollar, lichCoat, lichHover, lichStaffCrystal, lichStaffPole (lichGrip marker), lichStaffFoot.
