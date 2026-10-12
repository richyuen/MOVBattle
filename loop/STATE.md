# Loop state
Iteration: 77   Last re-audit: 75   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-surfaces-dull-brick eba6767 — APPROVE
- wall-stones-glow-white bf68813 — APPROVE
- surcoat-no-contrast-no-hem 006703d — REJECT (reverted 968676d)
- blast-victims-curled-high-band 49890d2 — APPROVE
- litter-shafts-parallel-thick 07bee25 — APPROVE
- melee-eye-above-heads d112e94 — APPROVE
- rim-flat-band-ruled-lawn 3390643 — REJECT (reverted 2732030)
- corpses-single-flung-arm-straight 0199611 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-surfaces-dull-brick (eba6767) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: wall-stones-glow-white (bf68813) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: surcoat-no-contrast-no-hem (006703d) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-victims-curled-high-band (49890d2) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: litter-shafts-parallel-thick (07bee25) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: melee-eye-above-heads (d112e94) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: rim-flat-band-ruled-lawn (3390643) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: corpses-single-flung-arm-straight (0199611) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] surcoat-slab-no-belt-no-hem: keep TABARD_PALE 0.3, z 1.06; add a thin dark belt box at the waist and hang the tabard 0.15 below the torso bottom [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
2. [maps-light] lawn-edge-ruled-arc: shelf stays at -2.5; jitter the lawn slab's own rim (ragged arg of its _islandSlab call) so the grass line is notched [attempts: 1] — ref: gameplay_sheet_04 r3c1 — ours: hud_placement.png
3. [unit-look] red-dusty-salmon-no-cloth-step: raise saturation of the warm result; trousers/boots back to 0.5 of their darkening [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
4. [battle-feel] corpses-prone-same-heading: one-knee fold 0.4-1.2 and a random rest roll so some lie on their side [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
5. [vfx] stuck-shafts-thick-pass-through: scale stuck cross-section 0.5, pull back along its axis so the head is buried [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_weapon_reads.png
6. [battle-feel] blast-victims-cloud-height-scattered: cut vertical blast impulse by a third so the fan peaks at tree-top [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
7. [camera] front-rank-small-sky-60: clearRadius depth + 5.5, lower pitchUp so the horizon is ~45% from top [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
8. [unit-look] knight-coffin-torso-wide-helm: shorten the torso, narrow the bucket helm in unitVisuals.ts [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- rim-flat-band-ruled-lawn [attempts: 1] — shelf top -0.8, ragged 0.3: flat level apron like pavement, lawn edge untouched
- surcoat-no-contrast-no-hem [attempts: 1] — TABARD_PALE 0.5, z 1.2: pale flesh slab, thicker all over, no hem edge
- armoured-red-still-brick [attempts: 1] — no ARMOUR_SHADE on warm plate: lit plate still value ~0.56, chest hidden by tabard
- island-no-cliff-ruled-rim [attempts: 1] — 1.055x shelf at -0.9, 1-2% sine ragged: flat constant-width ribbon, no facets
- red-cloth-dusty-brick [attempts: 2] — TEAM_COLORS red to (0.93,0.2,0.17), no hue shift: bare reds clean, armoured still brick
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, fat cone streaks
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gap 1/3: unitFactory tabard block and `shade` helper (WARM_SHADE_KEEP now 0.25); never touch TEAM_COLORS.
- Gap 2: lawn is `_islandSlab("ground", 0, 0.04)` and centerGrass in _createGround; ragged also drops top verts up to 1.6, too much for a 0.04 slab.
- Gap 6: lift x0.6 with gravity x0.6 stalled battle_recap_result_legacy_tank_shell (never reaches Result); regression-run any impulse cut first.
- Gap 4: _buildLimpPose keeps its Math.random draw count. Gap 5: _leaveAsLitter struck branch. Gap 7: swoopToBattle melee branch.
- `node loop/scripts/capture.mjs --iter 999 --regression-only` runs the 11 scenarios in 20 s; delete its output dir after.
