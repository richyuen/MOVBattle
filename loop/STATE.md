# Loop state
Iteration: 78   Last re-audit: 75   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- surcoat-slab-no-belt-no-hem 5000fd9 — APPROVE
- lawn-edge-ruled-arc 5f8ccf1 — REJECT (reverted c9e5672)
- red-dusty-salmon-no-cloth-step a3d1652 — APPROVE
- corpses-prone-same-heading c27fbeb — REJECT (reverted a763906)
- stuck-shafts-thick-pass-through 4e02f9a — APPROVE
- blast-victims-cloud-height-scattered (no commit) — REJECT (regression before the critic, edit discarded)
- front-rank-small-sky-60 b2eb93c — APPROVE
- knight-coffin-torso-wide-helm d3e0ea3 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: surcoat-slab-no-belt-no-hem (5000fd9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lawn-edge-ruled-arc (5f8ccf1) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-dusty-salmon-no-cloth-step (a3d1652) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: corpses-prone-same-heading (c27fbeb) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: stuck-shafts-thick-pass-through (4e02f9a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: front-rank-small-sky-60 (b2eb93c) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: knight-coffin-torso-wide-helm (d3e0ea3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] corpses-share-heading-lie-flat: runtimeUnit corpse settle, seeded +-0.9 rad yaw on rot.y so blast-thrown bodies stop sharing a heading [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
2. [maps-light] lawn-edge-ruled-arc: LAWN_NOTCH -0.045 -> -0.14 so bites show from the placement camera [attempts: 2] — ref: gameplay_sheet_04 r3c1 — ours: hud_placement.png
3. [unit-look] squire-torso-deep-box: unitVisuals.ts medieval.squire add torsoDepth 0.75 [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
4. [vfx] arrowheads-outside-shafts-one-height: projectileSystem stuck branch, `back` a further -0.12 and a seeded +-0.25 on mesh.position.y [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_weapon_reads.png
5. [camera] empty-lawn-band-eye-at-head: cameraController melee target.y base 1.6 -> 1.2, keep pitchUp -0.04 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
6. [unit-look] red-trousers-barely-darker: unitFactory WARM_LEG_SHADE_KEEP 0.5 -> 0.8 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [unit-look] belt-jutting-plate: unitFactory tabardBelt height chest.y*0.26 -> 0.14, width/depth factor 0.84 -> 0.78 [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: lineup_medieval.png
8. [vfx] cannon-hit-no-chunky-debris: add 4-6 dark faceted chunks to the impact burst [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll onto side via rot.z: no corpse in profile in the PNGs, heading untouched
- lawn-edge-ruled-arc [attempts: 2] — negative ragged pulls lawn/ground/zone corners in 0-4.5%: invisible from placement view, still a ruled polygon in a grey band
- blast-victims-cloud-height-scattered [attempts: 2] — lift x2/3 alone, gravity untouched: battle_recap_result_legacy_tank_shell fails again
- rim-flat-band-ruled-lawn [attempts: 1] — shelf top -0.8, ragged 0.3: flat level apron like pavement, lawn edge untouched
- surcoat-no-contrast-no-hem [attempts: 1] — TABARD_PALE 0.5, z 1.2: pale flesh slab, thicker all over, no hem edge
- armoured-red-still-brick [attempts: 1] — no ARMOUR_SHADE on warm plate: lit plate still value ~0.56, chest hidden by tabard
- island-no-cliff-ruled-rim [attempts: 1] — 1.055x shelf at -0.9, 1-2% sine ragged: flat constant-width ribbon, no facets
- red-cloth-dusty-brick [attempts: 2] — TEAM_COLORS red to (0.93,0.2,0.17), no hue shift: bare reds clean, armoured still brick

## Notes for next iteration (max 5 lines)
- Gap 1: _corpseYaw is already a random +-pi turn at death (runtimeUnit ~907) and a spread(5) turn in applyBlastLaunch; check why it does not show before adding more. No new Math.random draws.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it.
- Gap 4: stuck shafts are scaled x/y 0.5 and pulled back tip-0.07 along their axis before setParent. Gap 3: torsoLength exists in BodyProportions.
- unitFactory: never touch TEAM_COLORS; warm legs use `legShade`, torso/plate use `shade`.
- `node loop/scripts/capture.mjs --iter 999 --regression-only` runs the 11 scenarios in 20 s; delete its output dir after.
