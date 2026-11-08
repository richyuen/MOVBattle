# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 500; CONFIRM 500 list)
 1. leg build in unit_evil.death_bringer_idle: the pants block runs almost to the ankles over a short wrapped shin stub, so the legs are short of half the height and the unit is squat — TABS: long lanky legs, with knee-length baggy pants above long bandaged shins that are about a third of his height (ref: reference/units/evil.death_bringer.red.png)
 2. hair in unit_evil.death_bringer_idle: a short black bob framing the head (a flat black block on the back of the head in unit_evil.death_bringer_flight) — TABS: long straggly black hair hanging over the chest and back to the waist, the unit's dominant dark mass (ref: reference/units/evil.death_bringer.red.png)
 3. skull mask in unit_evil.death_bringer_idle: a flat square tan plate with two slit eyes on a cube head — TABS: a sculpted demon skull with a brow ridge, hollow drooping eye sockets, a nose hole and a narrowing jaw (ref: reference/units/evil.death_bringer.red.png)
 4. chest in unit_evil.death_bringer_idle: a maroon tabard bib with strips down the front of the torso — TABS: no bib; the black hair falls over a dark chest (ref: reference/units/evil.death_bringer.blue.png)
b PASS (491 twin gold warglaives; CONFIRM 500)
c PASS (499 charge through the line, cutting each man passed; CONFIRM 500)
d PASS (500 stats; CONFIRM 500)
## Ranked gaps
1. [S] evil.death_bringer.a leg build — blocker 1: shorts end at the knee (anchor to knee.position.y, LESSONS 41) and the shins run long under them, wraps over the whole shin — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
2. [S] evil.death_bringer.a chest — blocker 4: the maroon bib (HORNED_EVIL cape/tabard remnant) off; hair falls over a dark chest — ref: evil.death_bringer.blue.png — ours: unit_evil.death_bringer_idle.png
## Attempts (iter | gap | criterion | verdict)
500 | dark team shorts over grey banded shin wraps, evilDress deathBringerShinWraps (5483a3d7) | a | approved (struck 5)
500 | dark belt with bone tusks over each hip, evilDress deathBringerBelt (6e0424e3, 8643adb8) | a | approved (struck 6; critic a PASS, CONFIRM failed a)
499 | bare team trunk and arms, evilDress deathBringerBareTorso (3a3576d4) | a | approved (struck 4)
499 | charge through the line, DEATH_CHARGE (fe3430c4) | c | approved (struck 3; c PASS)
498 | Quick Dodge, QUICK_DODGE (b42cc679) | c | approved (struck 2)
491-496 | lanky build, hair, mask (a); twin warglaives (b PASS); TWIN_SLASH (c) | a, b, c | approved
## Rejected (last 4)
495 | [P] stance default | a | attempts 1 | ledger reversal of UV:DEATH (approved 494); wants an [S] idle pose of its own, square with arms out low
## Notes (max 3 lines)
- 500 DEFECTS: shorts one boxy slab, not puffed per thigh; wraps short stacked rings; tusks mostly at the sides.
- Weapon "greatsword" both hands (variant warglaive). Look is HORNED_EVIL "evil.death_bringer" + evilDress deathBringerHair, Mask, BareTorso, ShinWraps, Belt. Capture: 8 m from three archers, two more 9 m behind.
