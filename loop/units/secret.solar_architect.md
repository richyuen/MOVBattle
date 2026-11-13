# secret.solar_architect
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 527, 2 struck)
 3. Torso in unit_secret.solar_architect_idle is a grey vest/shirt — TABS: a long white coat with gold trim, a high collar and wide cuffs, open over a team front (ref: secret.solar_architect.red.png)
 4. Legs in unit_secret.solar_architect_idle are dark blue trousers with dark boots — TABS: team ankle pants with gold cuffs and white shoes (ref: secret.solar_architect.red.png)
b PASS (535: struck 2, both wands rise up and out of the fists)
c FAIL (2 since 527, 1 struck)
 2. The effect in unit_secret.solar_architect_struck is a pink dome — TABS: a golden spinning maelstrom that heals allies, then implodes and pulls enemies in (ref: card Characteristics)
d PASS (535 stats)
## Ranked gaps
1. [S] secret.solar_architect.c maelstrom — blocker 2: Solar Maelstrom, a golden spinning vortex that heals allies in it, then implodes pulling enemies to its middle; logged so the capture frames an ability pair — ref: card Characteristics — ours: unit_secret.solar_architect_struck
2. [S] secret.solar_architect.a white coat — blocker 3: long open white coat with gold trim, high collar, wide cuffs, over a team front (solarArchitectCoat) — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle
3. [S] secret.solar_architect.a legs — blocker 4: team ankle pants with gold cuffs and white shoes — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle
## Attempts (iter | gap | criterion | verdict)
535 | wands re-laid each tick up and out of the fists, SOLAR_WAND_LAY (RU) (9e4c9ac8) | b | approved (struck 2, b PASS)
535 | Solar Orb ray from a wand ring, fists taking turns (0fbcddbe) | c | approved (struck 1)
533 | bald: laurel hat off (e3841ea1) | a | approved (struck 1)
531 | white-gold Solar Orb ray and burst, spawnSolarRay (6704451a) | c | approved (no strike)
528-530 | SUN_HALO; SOLAR_WAND; wand guard off, gold collar | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 535 critic: wands thin next to the render's at lineup distance (TABS thicker shafts, chunky gold bands); not blocking.
- 535 critic: pink dome already gone from _struck, but no second event: the maelstrom does not exist.
- 528: the halo raises his rig to 2.57 m; shots still frame him. a starves after 538.
