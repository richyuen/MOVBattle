# secret.necromancer
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. Headgear in unit_secret.necromancer_idle is a dark round hood with a flat collar brim — TABS: a dark team leather cap with two long curved horns and lank dark hair (ref: secret.necromancer.red.png)
 3. No vest in unit_secret.necromancer_idle — TABS: a tattered dark team vest stitched with pale laces (ref: secret.necromancer.red.png)
 4. No shorts in unit_secret.necromancer_idle — TABS: ragged dark shorts with a pink rope belt over bare bone thighs (ref: secret.necromancer.red.png)
 5. No boots in unit_secret.necromancer_idle — TABS: tall laced worn brown boots to the knee (ref: secret.necromancer.red.png)
 6. No armbands in unit_secret.necromancer_idle — TABS: grey metal bands on both upper arms (ref: secret.necromancer.red.png; card Appearance)
b PASS (534: struck 3, knife seated in the fist)
c FAIL (2 since 527, 2 struck)
 3. missing: Gravestone Wall — three graves rising from the ground to push enemies away (ref: card Characteristics)
d PASS (535 stats)
## Ranked gaps
1. [S] secret.necromancer.c Gravestone Wall — blocker 3: three gravestones rise between him and close enemies and shove them back (log "gravestone_wall") — ref: card Characteristics — ours: unit_secret.necromancer_ability
2. [S] secret.necromancer.a horned cap — blocker 2: dark team leather cap with two long curved horns and lank hair, replacing the dark hood ball over the face — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
3. [S] secret.necromancer.a vest — blocker 3: tattered dark team vest stitched with pale laces — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
## Attempts (iter | gap | criterion | verdict)
535 | skull curse: rot, rises a skeleton of his side where he dies (onDeath), no free summon, NECRO_CURSE (f9e0b531, 9a078f73, 72094ba7) | c | approved (struck 2)
534 | knife re-seated: grip centred in the palm, blade on out of the fist (746fb2cd) | b | approved (struck 3, b PASS)
531 | Stiffy bone body via dressSkeleton (SKELETON_UNITS), no hood added (c99eccde) | a | approved (struck 1)
530 | ghost skull thrown from the lantern glass, NECRO_SKULL (PS, SS) (9efd3166) | c | approved (struck 1)
528-529 | Necromancer Knife NECRO_KNIFE; team lantern NECRO_LANTERN | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 535: the idle is NOT his back (knife hand on screen-left): the dark round hood ball hides his face; the horned cap fixes that read. Ability pair frames raise_dead on the fallen man.
- 535 critic: rot puff not seen on the cursed man; the risen skeleton overlaps the corpse. 534: knife arm raised overhead in the idle (pose).
- 531 critic: a grey slab hangs on his back; dressSkeleton gives him a team rag skirt. a starves after 536.
