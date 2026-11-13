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
b FAIL (1 since 527, 1 struck)
 2. Off hand in unit_secret.necromancer_idle is empty — TABS: a team-coloured kerosene lantern with a ghost flame and a glowing ring circling it (ref: secret.necromancer.red.png; card Off Hand)
 3. Knife grip in unit_secret.necromancer_windup floats beside the fist, parallel to it, with the blade running back toward his body — TABS: the team grip closed in the fist, the blade hanging point-down (ref: secret.necromancer.red.png) introduced by 88adc711 at propBuilder.ts:buildNecroKnife
c FAIL (0 since 527)
 1. missing: skull projectile thrown from the lantern — nothing flies in unit_secret.necromancer_release/_flight (ref: card Weapons Necromancer Skulls)
 2. The summon at 417 ms in unit_secret.necromancer_flight raises skeleton warriors beside him — TABS: skeletons rise only from enemies killed by the skull curse (ref: card Characteristics)
 3. missing: Gravestone Wall — three graves rising from the ground to push enemies away (ref: card Characteristics)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.necromancer.b lantern — blocker 2: a team kerosene lantern with a ghost flame and a glowing ring in the off hand — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_idle
2. [P] secret.necromancer.b knife seat — blocker 3: seat buildNecroKnife's hold in the fist (down one fist) with the blade point-down (fallout of [S] 88adc711) — ref: secret.necromancer.red.png — ours: unit_secret.necromancer_windup
## Attempts (iter | gap | criterion | verdict)
528 | Necromancer Knife: team grip, bone collars, hooked notched blade, NECRO_KNIFE, weapon dagger (88adc711) | b | approved (struck 1; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 528: with the knife his summon logs at 817 ms (was 417).
