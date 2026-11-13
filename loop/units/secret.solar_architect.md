# secret.solar_architect
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 1. Head in unit_secret.solar_architect_idle has brown hair and a green headband — TABS: bald team head (ref: secret.solar_architect.red.png; card Appearance)
 3. Torso in unit_secret.solar_architect_idle is a grey vest/shirt — TABS: a long white coat with gold trim, a high collar and wide cuffs, open over a team front (ref: secret.solar_architect.red.png)
 4. Legs in unit_secret.solar_architect_idle are dark blue trousers with dark boots — TABS: team ankle pants with gold cuffs and white shoes (ref: secret.solar_architect.red.png)
b FAIL (1 since 527, 1 struck)
 2. Off hand in unit_secret.solar_architect_idle is empty — TABS: a second identical wand (ref: secret.solar_architect.red.png; card Off Hand)
 3. Wand hilt in unit_secret.solar_architect_idle carries a flat gold sword crossguard across each fist — TABS: a narrow gold collar over the fist, no crossbar (ref: secret.solar_architect.red.png) introduced by 8471b2c3 at propBuilder.ts:buildSolarWand
c FAIL (0 since 527)
 1. The shot in unit_secret.solar_architect_release is a blue zigzag lightning bolt from the staff ball — TABS: a golden solar orb/ray of light from the wand (ref: secret.solar_architect.png; card Weapons Solar Orb)
 2. The effect in unit_secret.solar_architect_struck is a pink dome — TABS: a golden spinning maelstrom that heals allies, then implodes and pulls enemies in (ref: card Characteristics)
d PASS (529 stats)
## Ranked gaps
1. [S] secret.solar_architect.b gold collar — blocker 3: buildSolarWand guard off, a thin gold collar ring at the fist — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle
2. [S] secret.solar_architect.c sun ray — blocker 1: golden-white light orb/beam from the wand tip replacing the blue lightning — ref: secret.solar_architect.png — ours: unit_secret.solar_architect_release
3. [S] secret.solar_architect.a coat — blocker 3: long white coat with gold trim, high collar and wide cuffs, open over a team front — ref: secret.solar_architect.red.png — ours: unit_secret.solar_architect_idle
## Attempts (iter | gap | criterion | verdict)
529 | white-and-gold wand with end ring in each fist on the slab sword mount, SOLAR_WAND (8471b2c3) | b | approved (struck 1; added 3)
528 | gold sun halo, two 12-gon rings and 12 spikes behind the head, SUN_HALO (e00ede68) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 529: b.2 re-aimed _windup -> _idle (critic: the off fist hides behind the body side-on; the off wand shows in _idle).
- 528: the halo raises his rig to 2.57 m; shots still frame him. Halo bars read pale (TABS saturated gold, not a blocker).
