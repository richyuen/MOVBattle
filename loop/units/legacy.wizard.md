# legacy.wizard
Status: open   Audited: 468, 475 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 475)
 1. build in unit_legacy.wizard_idle: squat and slab-torsoed, with a wide body and short legs below a robe ending near mid-thigh — TABS: lanky and tall, with long legs under a knee-length open coat (ref: legacy.wizard.red.png)
 2. beard colour in unit_legacy.wizard_idle: a near-white wedge beard — TABS: a mid-to-dark grey long beard (ref: legacy.wizard.red.png, card Appearance "very long, gray beard")
b FAIL (0 since 475)
 1. staff length in unit_legacy.wizard_idle: the staff tip reaches only about shoulder or chin height, so it is shorter than the man — TABS: the staff stands well above the hat tip, about 1.3x the unit's height (ref: legacy.wizard.red.png)
c FAIL (2 since 468)
 2. target in unit_legacy.wizard_struck: the knight crouches on the ground with his sword up — TABS: the struck unit spins up into the air and explodes like a firework (card Characteristics)
d PASS (cost 1200=1200, hp 11.53x vs 11.57x (0%), dmg 45.00 (wiki none, skipped), cd 1.80x vs 2.00x (-10%); 475 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.wizard.c firework — blocker 2: keep the struck man aloft and spinning until the burst, set the burst on his chest, and blow him apart or kill him in the sparks (projectileSystem _stepFireworks, RuntimeUnit.fireworkLaunch) — ref: card Characteristics, legacy.wizard.png — ours: unit_legacy.wizard_ability.png
2. [P] legacy.wizard.b WIZARD_STAFF long 0.98 -> 1.25, so the staff head rises above the hat; fallout of [S] c4906faa — ours: unit_legacy.wizard_idle.png
## Attempts (iter | gap | criterion | verdict)
475 | WIZARD_STAFF twisted staff, crystal head (c4906faa) | b | approved (struck 1; b PASS, then CONFIRM failed b)
475 | WIZARD_FIREWORK spin up, burst (2475d0af, 41a3dc3b) | c | approved (none struck: the burst is over a man already landed)
475 | [P] proportions.scale 1.76 -> 1.3 (048b6138) | a | approved (struck 5; a PASS, then CONFIRM failed a)
474 | WIZARD_HAT floppy bent-tip hat (7c149002) | a | approved (struck 1)
473 | WIZARD_SPELL glowing star bolt (aee5fce8) | c | approved (struck 1)
472 | WIZARD_ROBE team coat-robe to the knees, dark belt (731cde05) | a | approved (struck 4)
471 | WIZARD_PIPE curved brown pipe (b29ab410, cacbecab) | a | approved (struck 3)
470 | offhand longsword (f309bcf8) | b | approved (struck 2)
468 | WIZARD_BEARD grey wedge to mid-chest, moustache (9c6d188f, shared) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- c is passed by CONFIRM 475 but held FAIL by the gap critic (both must pass): the man lands before the burst at 1867 ms (WIZARD_FIREWORK up 6.5, delay .75).
- ref legacy.wizard.png: staff in one hand, sword in the other
