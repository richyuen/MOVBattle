# Loop state
Iteration: 76   Last re-audit: 75   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- armoured-red-still-brick 45a875d — REJECT (reverted 674a4d9)
- island-no-cliff-ruled-rim 61f9720 — APPROVE
- blast-launch-too-high-and-stiff e6bfba5 — APPROVE
- battle-cam-inside-near-rank b7e415e — APPROVE
- wall-stones-black-in-shade 1616236 — APPROVE
- knight-surcoat-thin-stripe 756de75 — APPROVE
- litter-shafts-bundled-blue bdb0b26 — APPROVE
- corpses-flat-no-elbow 03aedb8 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: armoured-red-still-brick (45a875d) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: island-no-cliff-ruled-rim (61f9720) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blast-launch-too-high-and-stiff (e6bfba5) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-cam-inside-near-rank (b7e415e) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: wall-stones-black-in-shade (1616236) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: knight-surcoat-thin-stripe (756de75) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: litter-shafts-bundled-blue (bdb0b26) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: corpses-flat-no-elbow (03aedb8) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-surfaces-dull-brick: red skin #8f4a47, plate #7f413d vs TABS coral #ef7085; WARM_SHADE_KEEP 0.5 -> 0.25, warm plate shade ~0.85 [attempts: 1] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [maps-light] wall-stones-glow-white: stones #dadad0 with bloom halo from placement; emissive 0.25 -> 0.08, diffuse x0.7 toward grey [attempts: 0] — ref: gameplay_sheet_04 r2c1 — ours: hud_placement.png
3. [unit-look] surcoat-no-contrast-no-hem: reads as bare torso; TABARD_PALE 0.3 -> 0.5, z 1.06 -> 1.2 so a hem shows [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
4. [battle-feel] blast-victims-curled-high-band: flyers curled in one band over the trees; drop constant fold in _flailInAir, less for dead, fan low [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
5. [vfx] litter-shafts-parallel-thick: shafts parallel, limb-thick, beside legs; seeded pitch/yaw +-0.35, height spread 0.6 -> 0.35 [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_weapon_reads.png
6. [camera] melee-eye-above-heads: rank 0.3 of frame, sky two thirds, feet cropped at 9s; target.y 2.1 -> 1.6, clearRadius +8 -> +6.5 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [maps-light] rim-flat-band-ruled-lawn: shelf is one flat taupe band, lawn edge still ruled; ragged 0.14 -> 0.3, top -2.5 -> -0.8 [attempts: 0] — ref: gameplay_sheet_04 r3c1 — ours: hud_placement.png
8. [battle-feel] corpses-single-flung-arm-straight: dead lie singly, flung arm straight; give non-overhead flung elbow 0.7-1.57 [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- armoured-red-still-brick [attempts: 1] — no ARMOUR_SHADE on warm plate: lit plate still value ~0.56, same as skin, chest hidden by tabard
- island-no-cliff-ruled-rim [attempts: 1] — 1.055x shelf at -0.9, 1-2% sine ragged: flat constant-width ribbon, no facets
- red-cloth-dusty-brick [attempts: 2] — TEAM_COLORS red to (0.93,0.2,0.17), no hue shift: bare reds clean, armoured still brick
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, fat cone streaks
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gap 1: unitFactory `shade` helper; do not touch TEAM_COLORS (two rejects). Gap 2: mapBuilder _createSetDressing wallStone material.
- Gap 4: blast height cannot move: lift x0.6 with gravity x0.6 and scaled bounce thresholds still fails battle_recap_result_legacy_tank_shell (never reaches Result). Only pose work is safe.
- Gap 5: projectileSystem _leaveAsLitter struck branch; setParent keeps world rotation, so add the offset before it.
- Gap 7: _islandSlab(name, top, height, taper, tessellation, ragged); shelf call in _createGround. Gap 8: _buildLimpPose flungElbowZ.
- `node loop/scripts/capture.mjs --iter 999 --regression-only` runs the 11 scenarios in 20 s; delete its output dir after.
