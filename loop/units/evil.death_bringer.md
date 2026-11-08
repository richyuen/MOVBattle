# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 489, 1 struck)
 2. head in unit_evil.death_bringer_idle: a white cube skull with purple horns — TABS: a bone-tan skull mask with sad sockets and team-coloured curved horns (ref: evil.death_bringer.blue.png)
 3. hair in unit_evil.death_bringer_idle: none — TABS: long black hair falling over the chest to the waist (ref: evil.death_bringer.red.png)
 4. torso in unit_evil.death_bringer_idle: a brown leather cuirass — TABS: a team-skinned torso and arms behind the hair (ref: evil.death_bringer.red.png)
 5. shins in unit_evil.death_bringer_idle: white plate greaves — TABS: grey cloth wraps below dark puffed shorts (ref: evil.death_bringer.red.png)
 6. belt in unit_evil.death_bringer_idle: no bones — TABS: a dark belt hung with bone tusks (ref: evil.death_bringer.red.png)
 7. feathers in unit_evil.death_bringer_idle are missing — TABS: dark feathers on the head and shoulders (card Appearance)
b PASS (491 twin gold warglaives)
c FAIL (1 since 489, 1 struck)
 2. ability in unit_evil.death_bringer_ability/_ability_after: a fear status is logged (not on the card) and no dodge is shown — TABS: Quick Dodge, a sidestep and back away from projectiles (card)
 3. missing: the charge — no dash through the enemy line in the pair (card Characteristics)
d PASS (494 stats)
## Ranked gaps
1. [S] evil.death_bringer.a hair — blocker 3: long black faceted hair panels from the crown over the chest to the waist (evilDress) — ref: evil.death_bringer.red.png — ours: unit_evil.death_bringer_idle.png
2. [S] evil.death_bringer.a skull mask — blocker 2: bone-tan skull mask, sad sockets, team curved horns — ref: evil.death_bringer.blue.png — ours: unit_evil.death_bringer_idle.png
3. [S] evil.death_bringer.c Quick Dodge — blocker 2: sidestep and back-off from incoming projectiles, no fear status — ref: card — ours: unit_evil.death_bringer_ability_after.png
4. [S] evil.death_bringer.c no charge — blocker 3: a fast dash through the enemy line, cutting as he passes — ref: card Characteristics — ours: unit_evil.death_bringer_release.png
## Attempts (iter | gap | criterion | verdict)
494 | lanky upright build at 1.2x, narrow chest, thin limbs, duelist stance, unitVisuals (416104b2) | a | approved (struck 1)
493 | alternating flat warglaive cuts, pink trails, proceduralAnimation TWIN_SLASH + simulationSystem DEATH_SLASH (87954be0) | c | approved (struck 1)
491 | twin gold warglaives with red-hot edges, propBuilder WARGLAIVE (cdb92fd0, ddf16a33) | b | approved (struck 1, 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 494 DEFECTS: the idle shows him side-on in the duelist stance (TABS square to the front, arms out low). 493: the cut is stiff with a straight arm.
- Weapon type still "greatsword" both hands (variant warglaive); TWIN_SLASH drives the arms while attacking. Look is HORNED_EVIL "evil.death_bringer" (skull, horns, wraps).
