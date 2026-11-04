# legacy.wizard
Status: open   Audited: 468, 475 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 475)
 1. build in unit_legacy.wizard_idle: squat and slab-torsoed, with a wide body and short legs below a robe ending near mid-thigh — TABS: lanky and tall, with long legs under a knee-length open coat (ref: legacy.wizard.red.png)
 2. beard colour in unit_legacy.wizard_idle: a near-white wedge beard — TABS: a mid-to-dark grey long beard (ref: legacy.wizard.red.png, card Appearance "very long, gray beard")
b FAIL (0 since 475)
 1. staff length in unit_legacy.wizard_idle: the staff tip reaches only about shoulder or chin height, so it is shorter than the man — TABS: the staff stands well above the hat tip, about 1.3x the unit's height (ref: legacy.wizard.red.png)
c FAIL (3 since 468)
 2. explodes like a firework (card Characteristics)
d PASS (cost 1200=1200, hp 11.53x vs 11.57x (0%), dmg 45.00 (wiki none, skipped), cd 1.80x vs 2.00x (-10%); 479 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.wizard.a build — blocker 1: long-leg body and knee-length open coat mechanism — ref: legacy.wizard.red.png — ours: unit_legacy.wizard_idle.png
2. [S] legacy.wizard.b staff — blocker 1: grounded tall staff grip extending above hat — ref: legacy.wizard.red.png — ours: unit_legacy.wizard_idle.png
3. [S] legacy.wizard.c airborne firework — blocker 2: expanding radial burst with distinct post-burst frame — ref: card Characteristics and legacy.wizard.png — ours: unit_legacy.wizard_ability.png
## Attempts (iter | gap | criterion | verdict)
479 | sustained spell lift and lethal chest burst (0117757c, c67e45e9) | c | approved (airborne clause struck; explosion stands)
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
- 479 APPROVE: airborne spin clause cleared mechanically; explosion clause stands. Burst is a pale chest flash without expanding radial sparks/distinct after-frame.
- Evidence f4f4e00d follows airborne victim. Next c mechanism: explicit lift/spin/detonate state with expanding sparks.
