# secret.solar_architect
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 1. Head in unit_secret.solar_architect_idle has brown hair and a green headband — TABS: bald team head (ref: secret.solar_architect.red.png; card Appearance)
 3. Torso in unit_secret.solar_architect_idle is a grey vest/shirt — TABS: a long white coat with gold trim, a high collar and wide cuffs, open over a team front (ref: secret.solar_architect.red.png)
 4. Legs in unit_secret.solar_architect_idle are dark blue trousers with dark boots — TABS: team ankle pants with gold cuffs and white shoes (ref: secret.solar_architect.red.png)
b FAIL (2 since 527, 2 struck)
 2. Off hand in unit_secret.solar_architect_idle is empty — TABS: a second identical wand (ref: secret.solar_architect.red.png; card Off Hand)
c FAIL (1 since 527, 0 struck)
 1. The shot in unit_secret.solar_architect_release is a blue zigzag lightning bolt from the staff ball — TABS: a golden solar orb/ray of light from the wand (ref: secret.solar_architect.png; card Weapons Solar Orb)
 2. The effect in unit_secret.solar_architect_struck is a pink dome — TABS: a golden spinning maelstrom that heals allies, then implodes and pulls enemies in (ref: card Characteristics)
d PASS (531 stats)
## Ranked gaps
1. [S] secret.solar_architect.c ray origin — blocker 1: Solar Orb ray from the wand tip (right hand), not attackOrigin at the feet — ref: secret.solar_architect.png — ours: unit_secret.solar_architect_release.png
2. [S] secret.solar_architect.a bald head — blocker 1: bald team head, no hair or headband — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle.png
3. [S] secret.solar_architect.a white coat — blocker 3: long white coat with gold trim, high collar, wide cuffs, open over a team front — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle
## Attempts (iter | gap | criterion | verdict)
531 | white-gold Solar Orb ray and burst, spawnSolarRay (FX SOLAR_RAY), no lightning or dome, logged missile_solar_orb (6704451a) | c | approved (no strike)
530 | wand crossguard off, round gold collar on the rod at the fist (SOLAR_WAND collar) (74451e1d) | b | approved (struck 3)
529 | white-and-gold wand with end ring in each fist, SOLAR_WAND (8471b2c3) | b | approved (struck 1; added 3)
528 | gold sun halo, SUN_HALO (e00ede68) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 531 critic: CLOSER says the lightning and pink dome cleared, but the ray leaves from his feet (attackOrigin), not the wand; no maelstrom (static burst).
- 530 critic: b.2 looks stale (the left fist holds the same wand in _idle): a CONFIRM or re-audit should strike it. Collar reads fat.
- 528: the halo raises his rig to 2.57 m; shots still frame him. Halo bars read pale (not a blocker).
