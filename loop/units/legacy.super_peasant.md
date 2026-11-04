# legacy.super_peasant
Status: open   Audited: 468, 480 (c RE-AUDIT x2)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (4 since 468)
 2. shirt in unit_legacy.super_peasant_idle: a grey vest block — TABS: a white peasant tunic to mid-thigh with a laced collar (ref: legacy.super_peasant.red.png)
 4. legs in unit_legacy.super_peasant_idle: bare team legs — TABS: white rolled-up trousers to the shin (ref: legacy.super_peasant.red.png; card Appearance)
b PASS (468: glowing gold cuffs on both wrists, bare fists; SUPER_CUFFS)
c FAIL (0 since 480)
 1. punch result in unit_legacy.super_peasant_punch and unit_legacy.super_peasant_punch_after: the knight sits beside the attacker on the ground — TABS: the Super Peasant Punch has force 15,000,000 and sends its victim flying away (ref: loop/cards/legacy.super_peasant.md Weapons).
d PASS (cost 9999999=9999999, hp 1719.84x vs 1653.13x (+4%), dmg 500.00x vs 500.00x (+0%), cd 0.09x vs 0.10x (-8%); 480 stats)
## Ranked gaps
1. [S] a.4 white rolled trouser shells — ref: legacy.super_peasant.red.png — ours: unit_legacy.super_peasant_idle.png.
2. [S] c.1 launch continuity through death/ragdoll, victim-relative airborne root — ref: card Weapons — ours: unit_legacy.super_peasant_punch_after.png; evidence first.
3. Critic NEXT proposes [R] a whole tunic/lower dress; not plateau: 479 struck blocker 3, breaking the no-strike run.
## Attempts (iter | gap | criterion | verdict)
480 | outer tunic (a70e65b3,b2acc355,4a6cb2c2) | a | approved (none struck)
480 | ballistic punch launch (2861b99c) | c | dropped (victim not visible)
479 | white interlocking rope belt (0fb715a1, 3f642c6a) | a | approved (struck 3)
479 | streaming wrist ribbons (909a9f7c) | c | approved (struck 2)
474 | SUPER_FLIGHT superman flight (06150948, 4796acd3) | c | approved (struck 1)
474 | SUPER_TUNIC white tunic, laced collar (f8accbf7) | a | approved (none struck; skirt hidden)
473 | man's size 1.15x, lanky cut (1d7ba5f5) | a | approved (struck 1; 5 by the lineup test)
468 | SUPER_CUFFS gold cuffs, bright rims (9c6d188f, shared) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 480 a APPROVE: white laced chest closer, grey hip skirt and trousers blockers stand verbatim.
- c launch dropped/reverted 93e1b1e9: victim not readable in pair. Evidence f97c47a0/66973e9e/c32f6740 adds held punch pair/reserve; next RE-AUDIT c.
