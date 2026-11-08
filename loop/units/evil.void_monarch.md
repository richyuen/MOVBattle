# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed d; failed a, b, c)   Done: -
## Verdicts
a FAIL (1 since 500, 2 struck)
 2. lower-face mask in unit_evil.void_monarch_idle: a bare blue face below the bead eyes — TABS: a tan bone jaw/beak mask covers the face below the eyes (ref: reference/units/evil.void_monarch.blue.png)
b PASS (501 broad khaki toothed bone swords)
c FAIL (0 since 500; CONFIRM 500 list)
 1. demon transformation in unit_evil.void_monarch_ability -> unit_evil.void_monarch_ability_after: the recorded demon_form at 4917 ms shows only the unit tipping flat inside the melee pile, with no change of form, and he is the same grounded figure in unit_evil.void_monarch_dodge at 5783 ms — TABS: after dealing 800 damage he begins to float and transforms into his demon form (ref: loop/cards/evil.void_monarch.md, ability Demon Transformation)
d PASS (501 stats)
## Ranked gaps
1. [S] evil.void_monarch.a lower-face mask — blocker 2: tan bone jaw/beak plate under the eyes (evilDress, monarchBone) — ref: evil.void_monarch.blue.png — ours: unit_evil.void_monarch_idle
2. [S] evil.void_monarch.c demon transformation — blocker 1: at demon_form he lifts off the ground and visibly changes form (darker body, a bone and aura change) — ref: card Demon Transformation — ours: unit_evil.void_monarch_ability_after
## Attempts (iter | gap | criterion | verdict)
501 | own crown-tan bone material for harness, ribs, knees, elbows, out of the glow, evilDress monarchBone (baccf212) | a | approved (struck 3, 1 by lineup)
501 | broad khaki bone swords .62H x .085H, 7 teeth per edge, MONARCH_SWORD (82b8820a) | b | approved (struck 1; b PASS)
500 | bone-tan ray crown, black-wrapped pole ringed in pink, evilDress monarchCrown (ce31248d, 2b00b363) | a | approved (struck 2; critic a PASS, CONFIRM failed a, b, c)
491-499 | harness, tunic, knees, elbows (a); bone swords (b); burst, DEMON_FORM, MONARCH_DODGE (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag gates harness, tunic, knee plates, elbow balls, crown, monarchBone); custom_* presets and custom.* ids untouched.
- 500 DEFECTS: crown pole leans ~30° with the head pitch; a navy boulder behind his head in idle. Capture: _dodge pair (SECOND_ABILITY), demon_form ~4.9 s; 501 _ability_after still shows him tipping in the pile (c needs a visible form change, not a capture fix).
