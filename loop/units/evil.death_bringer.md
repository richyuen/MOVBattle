# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 489, 3 struck)
 2. head in unit_evil.death_bringer_idle: a white cube skull — TABS: a bone-tan skull mask with sad sockets (ref: evil.death_bringer.blue.png)
 4. torso in unit_evil.death_bringer_idle: a brown leather cuirass — TABS: a team-skinned torso and arms behind the hair (ref: evil.death_bringer.red.png)
 5. shins in unit_evil.death_bringer_idle: white plate greaves — TABS: grey cloth wraps below dark puffed shorts (ref: evil.death_bringer.red.png)
 6. belt in unit_evil.death_bringer_idle: no bones — TABS: a dark belt hung with bone tusks (ref: evil.death_bringer.red.png)
b PASS (491 twin gold warglaives)
c FAIL (2 since 489, 2 struck)
 3. missing: the charge — no dash through the enemy line in the pair (card Characteristics)
d PASS (498 stats)
## Ranked gaps
1. [S] evil.death_bringer.c charge — blocker 3: a speed-burst dash through the target line, cutting each enemy passed, logged "charge" (his scene: three archers 8 m off) — ref: card Characteristics — ours: unit_evil.death_bringer_release.png
2. [S] evil.death_bringer.a team torso — blocker 4: drop the leather cuirass; team-skinned trunk and arms behind the hair — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
3. [S] evil.death_bringer.a skull outline — blocker 2: skull-shaped bone-tan mask tapering to a jaw, hair sides off its edge (palette.png for the tan) — ref: evil.death_bringer.blue.png — ours: unit_evil.death_bringer_idle.png
4. [S] evil.death_bringer.a bone belt — blocker 6: dark belt hung with bone tusks — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
5. [S] evil.death_bringer.a shins — blocker 5: grey cloth leg wraps under dark puffed shorts in place of the white greaves — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
## Attempts (iter | gap | criterion | verdict)
498 | Quick Dodge: sidestep off an incoming shaft and straight back, no fear, simulationSystem QUICK_DODGE (b42cc679; evidence 67337268) | c | approved (struck 2)
496 | tan faceted skull mask, evilDress deathBringerMask (da898f4f) | a | approved (struck 7 by lineup; horn clause of 2)
495 | long black hair to the waist, evilDress deathBringerHair (3218b350) | a | approved (struck 3)
495 | [P] default stand in place of duelist (65d585c3, reverted) | a | rejected (ledger reversal)
491-494 | lanky build (a); twin warglaives (b PASS); TWIN_SLASH (c) | a, b, c | approved
## Rejected (last 4)
495 | [P] stance default | a | attempts 1 | ledger reversal of UV:DEATH (approved 494); wants an [S] idle pose of its own, square with arms out low
## Notes (max 3 lines)
- 496 DEFECTS: the mask reads a flat pale-grey square (hair sides frame it square); wants bone-tan, a narrower jaw.
- Weapon type "greatsword" both hands (variant warglaive). Look is HORNED_EVIL "evil.death_bringer" + evilDress deathBringerHair, deathBringerMask. Capture: 8 m from three archers (evidence 498).
