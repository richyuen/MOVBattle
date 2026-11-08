# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 489, 3 struck)
 2. head in unit_evil.death_bringer_idle: a white cube skull — TABS: a bone-tan skull mask with sad sockets (ref: evil.death_bringer.blue.png)
 4. torso in unit_evil.death_bringer_idle: a brown leather cuirass — TABS: a team-skinned torso and arms behind the hair (ref: evil.death_bringer.red.png)
 5. shins in unit_evil.death_bringer_idle: white plate greaves — TABS: grey cloth wraps below dark puffed shorts (ref: evil.death_bringer.red.png)
 6. belt in unit_evil.death_bringer_idle: no bones — TABS: a dark belt hung with bone tusks (ref: evil.death_bringer.red.png)
b PASS (491 twin gold warglaives)
c FAIL (1 since 489, 1 struck)
 2. ability in unit_evil.death_bringer_ability/_ability_after: a fear status is logged (not on the card) and no dodge is shown — TABS: Quick Dodge, a sidestep and back away from projectiles (card)
 3. missing: the charge — no dash through the enemy line in the pair (card Characteristics)
d PASS (496 stats)
## Ranked gaps
1. [S] evil.death_bringer.a skull outline — blocker 2: deathBringerMask skull-shaped bone-tan faceted mask tapering to a jaw — ref: evil.death_bringer.blue.png — ours: unit_evil.death_bringer_idle.png
2. [S] evil.death_bringer.a shins — blocker 5: grey cloth leg wraps under dark puffed shorts in place of the white greaves — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
3. [S] evil.death_bringer.c Quick Dodge — blocker 2: sidestep and back-off from incoming projectiles in place of the fear status — ref: loop/cards/evil.death_bringer.md — ours: unit_evil.death_bringer_ability_after.png
4. [S] evil.death_bringer.c no charge — blocker 3: a fast dash through the enemy line, cutting as he passes — ref: card Characteristics — ours: unit_evil.death_bringer_release.png
## Attempts (iter | gap | criterion | verdict)
496 | tan faceted skull mask prism, sad sockets, nose, team horns, evilDress deathBringerMask (da898f4f) | a | approved (struck 7 by lineup; horn clause of 2 split off and struck)
495 | long black hair crown to waist, cape off, skull and body out of the glow, evilDress deathBringerHair (3218b350) | a | approved (struck 3)
495 | [P] default stand in place of duelist, unitVisuals posePreset (65d585c3, reverted ec4ffea2) | a | rejected (ledger reversal; idle still side-on)
491-494 | lanky 1.2x build (a); twin warglaives (b PASS); flat twin cuts TWIN_SLASH (c) | a, b, c | approved
## Rejected (last 4)
495 | [P] stance default | a | attempts 1 | ledger reversal of UV:DEATH (approved 494); wants an [S] idle pose of its own, square with arms out low
## Notes (max 3 lines)
- 496 DEFECTS: the mask reads a flat pale-grey square in the shots (the outline tapers to a .42 W chin, probe 496, but the hair sides frame it square); wants bone-tan (.62,.55,.38), a narrower jaw.
- Weapon type still "greatsword" both hands (variant warglaive); TWIN_SLASH drives the arms while attacking. Look is HORNED_EVIL "evil.death_bringer" + evilDress deathBringerHair, deathBringerMask.
