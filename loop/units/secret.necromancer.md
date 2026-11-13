# secret.necromancer
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. Headgear in unit_secret.necromancer_idle is a dark round hood with a flat collar brim — TABS: a dark team leather cap with two long curved horns and lank dark hair (ref: secret.necromancer.red.png)
 3. No vest in unit_secret.necromancer_idle — TABS: a tattered dark team vest stitched with pale laces (ref: secret.necromancer.red.png)
 4. No shorts in unit_secret.necromancer_idle — TABS: ragged dark shorts with a pink rope belt over bare bone thighs (ref: secret.necromancer.red.png)
 5. No boots in unit_secret.necromancer_idle — TABS: tall laced worn brown boots to the knee (ref: secret.necromancer.red.png)
 6. No armbands in unit_secret.necromancer_idle — TABS: grey metal bands on both upper arms (ref: secret.necromancer.red.png; card Appearance)
b FAIL (2 since 527, 2 struck)
 3. Knife grip in unit_secret.necromancer_windup floats beside the fist, parallel to it, with the blade running back toward his body — TABS: the team grip closed in the fist, the blade hanging point-down (ref: secret.necromancer.red.png) introduced by 88adc711 at propBuilder.ts:buildNecroKnife
c FAIL (1 since 527, 1 struck)
 2. The summon at 417 ms in unit_secret.necromancer_flight raises skeleton warriors beside him — TABS: skeletons rise only from enemies killed by the skull curse (ref: card Characteristics)
 3. missing: Gravestone Wall — three graves rising from the ground to push enemies away (ref: card Characteristics)
d PASS (531 stats)
## Ranked gaps
1. [S] secret.necromancer.a horned cap — blocker 2: dark team leather cap with long curved horns and lank hair — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle.png
2. [S] secret.necromancer.c raise from kills — blocker 2: skeletons rise only from skull-cursed dead, no free summon beside him — ref: card Characteristics — ours: unit_secret.necromancer_flight
3. [S] secret.necromancer.b knife seat — blocker 3: team grip in the fist, blade point-down (fallout of [S] 88adc711) — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_windup
## Attempts (iter | gap | criterion | verdict)
531 | Stiffy bone body via dressSkeleton (SKELETON_UNITS), no hood added (c99eccde) | a | approved (struck 1)
530 | ghost skull thrown from the lantern glass, NECRO_SKULL (PS, SS) (9efd3166) | c | approved (struck 1)
529 | team kerosene lantern on the off hand, NECRO_LANTERN (8d4f93db) | b | approved (struck 2)
528 | Necromancer Knife, NECRO_KNIFE, weapon dagger (88adc711) | b | approved (struck 1; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 531 critic: unit_secret.necromancer_idle frames his back (evidence commit first for a face/front pick); a grey slab hangs on his back; dressSkeleton gives him a team rag skirt.
- 530 critic: the skull reads as a white glow ball with one dark dot at release size.
- 529 critic: the lantern sticks out sideways from the fist and is small (TABS hangs straight down, head-sized).
