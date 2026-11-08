# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed d; failed a, b, c)   Done: -
## Verdicts
a FAIL (0 since 500; CONFIRM 500 list)
 1. bone ribcage armour in unit_evil.void_monarch_idle: small grey-white spikes at the collar and a narrow crossed piece on the chest — TABS: a large bone V-yoke over the chest, its arms reaching past the shoulders with spiked tips, and three stacked chevron ribs below it (ref: reference/units/evil.void_monarch.red.png)
 2. lower-face mask in unit_evil.void_monarch_idle: a bare blue face below the bead eyes — TABS: a tan bone jaw/beak mask covers the face below the eyes (ref: reference/units/evil.void_monarch.blue.png)
 3. thigh plates colour in unit_evil.void_monarch_idle: the spiked thigh pads are light grey/silver — TABS: tan bone with tan spikes, matching the crown and ribcage (ref: reference/units/evil.void_monarch.red.png)
b FAIL (0 since 500; CONFIRM 500 list)
 1. swords in unit_evil.void_monarch_windup: thin pale rapier-like blades about torso length — TABS: broad tan bone swords with a jagged edge, each about hip-to-above-head long, held point-up at the sides (ref: reference/units/evil.void_monarch.red.png)
c FAIL (0 since 500; CONFIRM 500 list)
 1. demon transformation in unit_evil.void_monarch_ability -> unit_evil.void_monarch_ability_after: the recorded demon_form at 4917 ms shows only the unit tipping flat inside the melee pile, with no change of form, and he is the same grounded figure in unit_evil.void_monarch_dodge at 5783 ms — TABS: after dealing 800 damage he begins to float and transforms into his demon form (ref: loop/cards/evil.void_monarch.md, ability Demon Transformation)
d PASS (500 stats; CONFIRM 500)
## Ranked gaps
1. [S] evil.void_monarch.a bone colour — blocker 3 (and the harness of 1): the shared HORNED_EVIL bone (.6,.6,.46) to the crown's tan for the evil preset, so harness, ribs, knee plates, elbows read tan — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
2. [S] evil.void_monarch.b broad bone swords — blocker 1: MONARCH_SWORD wider with a jagged edge, hip-to-over-head long — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_windup.png
3. [S] evil.void_monarch.a beak mask — blocker 2: tan bone jaw/beak mask below the eyes (evilDress) — ref: evil.void_monarch.blue.png — ours: unit_evil.void_monarch_idle.png
## Attempts (iter | gap | criterion | verdict)
500 | bone-tan ray crown, black-wrapped pole ringed in pink, evilDress monarchCrown (ce31248d, 2b00b363) | a | approved (struck 2; critic a PASS, CONFIRM failed a, b, c)
491-499 | harness, tunic, knees, elbows (a); bone swords (b); burst, DEMON_FORM, MONARCH_DODGE (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag gates harness, tunic, knee plates, elbow balls, crown); custom_* presets and custom.* ids untouched.
- 500 DEFECTS: crown pole leans ~30° with the head pitch; a navy boulder behind his head in idle. Capture: _dodge pair (SECOND_ABILITY), demon_form ~4.9 s.
