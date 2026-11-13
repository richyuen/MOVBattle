# secret.necromancer
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 527)
 1. Body in unit_secret.necromancer_idle is a team-skinned humanoid — TABS: a Stiffy skeleton of cream bones (ref: secret.necromancer.red.png; card Appearance)
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
d PASS (530 stats)
## Ranked gaps
1. [S] secret.necromancer.a skeleton body — blocker 1: Stiffy cream-bone body build — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
2. [S] secret.necromancer.c raise from kills — blocker 2: skeletons rise only from skull-cursed dead, no free summon beside him — ref: card Characteristics — ours: unit_secret.necromancer_flight
3. [S] secret.necromancer.b knife seat — blocker 3: team grip in the fist, blade point-down (fallout of [S] 88adc711) — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_windup
## Attempts (iter | gap | criterion | verdict)
530 | ghost skull thrown from the lantern glass, bone skull in a blue flame shell, "necro_skull" shape, logged missile_skull, NECRO_SKULL (PS, SS) (9efd3166) | c | approved (struck 1)
529 | team kerosene lantern on the off hand, ghost flame, glowing ring, NECRO_LANTERN (8d4f93db) | b | approved (struck 2)
528 | Necromancer Knife: team grip, bone collars, hooked notched blade, NECRO_KNIFE, weapon dagger (88adc711) | b | approved (struck 1; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 530 critic: the skull reads as a white glow ball with one dark dot at release size (jaw, second socket lost in bloom).
- 529 critic: the lantern sticks out sideways from the fist and is small (TABS hangs straight down, head-sized).
- 530: the skull and his summon both log at 817 ms (release = missile_skull).
