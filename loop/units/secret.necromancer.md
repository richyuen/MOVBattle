# secret.necromancer
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 527, 2 struck)
 3. No vest in unit_secret.necromancer_idle — TABS: a tattered dark team vest stitched with pale laces (ref: secret.necromancer.red.png)
 4. No shorts in unit_secret.necromancer_idle — TABS: ragged dark shorts with a pink rope belt over bare bone thighs (ref: secret.necromancer.red.png)
 5. No boots in unit_secret.necromancer_idle — TABS: tall laced worn brown boots to the knee (ref: secret.necromancer.red.png)
 6. No armbands in unit_secret.necromancer_idle — TABS: grey metal bands on both upper arms (ref: secret.necromancer.red.png; card Appearance)
b PASS (534: struck 3, knife seated in the fist)
c FAIL (2 since 527, 2 struck)
 3. missing: Gravestone Wall — three graves rising from the ground to push enemies away (ref: card Characteristics)
d PASS (536 stats)
## Ranked gaps
1. [S] secret.necromancer.c Gravestone Wall — blocker 3: three gravestone slabs rising out of the ground before him, pushing nearby enemies away (simulationSystem ability + visualEffects rise; log "gravestone_wall") — ref: card Characteristics — ours: unit_secret.necromancer_ability
2. [S] secret.necromancer.a vest — blocker 3: a tattered dark team vest stitched with pale laces over the ribs (secretDress) — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
3. [S] secret.necromancer.a boots — blocker 5: tall laced worn brown boots to the knee over the shins and feet (secretDress) — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
## Attempts (iter | gap | criterion | verdict)
536 | horned team cap, banded horns, lank hair, hood hat off, NECRO_CAP (6cc2555a) | a | approved (struck 2)
535 | skull curse: rot, rises a skeleton of his side where he dies, NECRO_CURSE (f9e0b531, 9a078f73, 72094ba7) | c | approved (struck 2)
534 | knife re-seated in the palm (746fb2cd) | b | approved (struck 3, b PASS)
531 | Stiffy bone body via dressSkeleton (c99eccde) | a | approved (struck 1)
528-530 | NECRO_KNIFE; NECRO_LANTERN; ghost skull NECRO_SKULL | b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 536 critic: the cap reads mid-team, not dark leather (minor colour). Idle is his front: the face shows now.
- 535 critic: rot puff not seen on the cursed man; the risen skeleton overlaps the corpse. Ability pair frames raise_dead.
- 531 critic: a grey slab hangs on his back; dressSkeleton gives him a team rag skirt (shorts blocker 4).
