# Loop state
Iteration: 79   Last re-audit: 75   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- corpses-share-heading-lie-flat 71d7949 — REJECT (reverted 657e910)
- squire-torso-deep-box 05f3fe9 — APPROVE
- arrowheads-outside-shafts-one-height f265063 — REJECT (reverted 5cd7393)
- empty-lawn-band-eye-at-head 757dbd2 — REJECT (reverted e0097f7)
- red-trousers-barely-darker f7f573e — APPROVE
- belt-jutting-plate 5e4eec4 — APPROVE
- cannon-hit-no-chunky-debris f652eed — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: corpses-share-heading-lie-flat (71d7949) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: squire-torso-deep-box (05f3fe9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: arrowheads-outside-shafts-one-height (f265063) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: empty-lawn-band-eye-at-head (757dbd2) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: red-trousers-barely-darker (f7f573e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: belt-jutting-plate (5e4eec4) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-hit-no-chunky-debris (f652eed) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] corpses-planar-never-heaped: runtimeUnit _layCorpseFlat, seeded residual lean of +-0.25 rad on targetX/targetZ so corpses rest propped [attempts: 2] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
2. [camera] melee-radius-leaves-lawn-band: cameraController melee branch, keep eye 1.6, scale fitted to.radius by 0.75 [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
3. [unit-look] red-team-salmon-not-red: unitFactory WARM_SATURATION 1.18 -> 1.3 [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_weapon_reads.png
4. [vfx] stuck-shafts-below-torso-heads-showing: projectileSystem stuck branch, upward-only extra height `vary(5) * 0.3` on aim.y [attempts: 1] — ref: tabs_screenshot_02 — ours: closeup_weapon_reads.png
5. [unit-look] great-helm-shoulder-wide: propBuilder great_helm to about 0.7 of its width and height [attempts: 0] — ref: trailer_3_sheet_02 r1c1 — ours: closeup_weapon_reads.png
6. [vfx] fireball-balloon-spheres: visualEffects spawnExplosionBurst fire lobes with 1-2 segments so they facet [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
7. [vfx] clods-stay-knee-high: visualEffects clod loop upward velocity `3 + r*2.4` -> `6 + r*4` [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
8. [ui-flow] victory-prompt-wording-and-reset: result band one centred continue prompt, no stray RESET label [attempts: 0] — ref: gameplay_sheet_01 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar, not shown in stills
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee between the legs
- empty-lawn-band-eye-at-head [attempts: 1] — eye 1.6 -> 1.2: bottom quarter still bare lawn, a lower level eye lifts feet toward the horizon
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll onto side via rot.z: no corpse in profile in the PNGs, heading untouched
- lawn-edge-ruled-arc [attempts: 2] — negative ragged pulls lawn/ground/zone corners in 0-4.5%: invisible from placement view, still a ruled polygon in a grey band
- blast-victims-cloud-height-scattered [attempts: 2] — lift x2/3 alone, gravity untouched: battle_recap_result_legacy_tank_shell fails again
- rim-flat-band-ruled-lawn [attempts: 1] — shelf top -0.8, ragged 0.3: flat level apron like pavement, lawn edge untouched
- surcoat-no-contrast-no-hem [attempts: 1] — TABARD_PALE 0.5, z 1.2: pale flesh slab, thicker all over, no hem edge

## Notes for next iteration (max 5 lines)
- Iteration 80 is a re-audit. Corpses: dead already get a random +-pi _corpseYaw; do not add more yaw, the critic wants propped/heaped rest poses.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it.
- tabardBelt is now a cylinder ring (0.88 of max(chest.x, chest.z)); critic asks belt.scaling.z to follow chest.z / chest.x too.
- unitFactory: never touch TEAM_COLORS; warm legs use `legShade` (keep 0.8), torso/plate use `shade`. Source files are CRLF.
- `node loop/scripts/capture.mjs --iter 999 --regression-only` runs the 11 scenarios in 20 s; delete its output dir after.
