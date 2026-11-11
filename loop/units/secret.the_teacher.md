# secret.the_teacher
Status: open   Audited: 500 (AUDIT x2), 512 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 512 CONFIRM)
 1. legs in unit_secret.the_teacher_idle: bare team skin from hip to ankle — TABS: dark trousers matching the jacket, down to the small black shoes (ref: reference/units/secret.the_teacher.blue.png; card Appearance "dark pants with little black shoes")
 2. sleeves in unit_secret.the_teacher_ability: the arms are bright team skin from shoulder to hand — TABS: the dark jacket sleeves run to the wrist and only the hands are team skin (ref: reference/units/secret.the_teacher.red.png)
 3. beard in unit_secret.the_teacher_idle: a small dark tuft at the mouth above the jabot — TABS: a large brown triangular beard from the cheeks down to the jabot (ref: reference/units/secret.the_teacher.blue.png; card Appearance "triangular beard")
b PASS (512 CONFIRM: spadroon, gold swept hilt, one-handed)
c PASS (512 CONFIRM: parry crosses the knight's blade, then a lunge)
d PASS (512 stats)
## Ranked gaps
1. [S] secret.the_teacher.a dark trousers — blocker 1: thigh and shin shells in dark team cloth (as the jacket) down to the shoes (secretDress) — ref: reference/units/secret.the_teacher.blue.png — ours: unit_secret.the_teacher_idle.png
2. [S] secret.the_teacher.a jacket sleeves — blocker 2: upper and lower arm sleeves in the jacket's dark team cloth to the wrist, hands bare (secretDress) — ref: reference/units/secret.the_teacher.red.png — ours: unit_secret.the_teacher_ability.png
3. [S] secret.the_teacher.a beard — blocker 3: a broad brown triangle from the cheeks to the jabot, in front of the face (secretDress teacherHair beard) — ref: reference/units/secret.the_teacher.blue.png — ours: unit_secret.the_teacher_idle.png
## Attempts (iter | gap | criterion | verdict)
512 | monk_robe special off: no orange torso box or drape (5ebe1d59) | a | approved (struck 4)
512 | small black ankle shoes, team foot hidden, secretDress teacherShoes (ee78ffbe) | a | approved (struck 5; a PASS; CONFIRM failed a)
508 | folded cream jabot (843b068d) | a | approved (struck 3)
506 | faceted beard and two moustache halves (50013545) | a | approved (struck 2)
505 | frontal melee parry with a brief spadroon guard (140582e4, 67439484) | c | approved (struck 1; c PASS)
501-502 | spadroon; renaissance hair | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 512 DEFECTS: on the red team the jacket reads dark brown, not dark red (minor).
- 506 beard passed the gap critic but CONFIRM 512 reads it as a small tuft: make it bigger, not a recolour.
