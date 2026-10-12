# Loop state
Iteration: 75   Last re-audit: 75   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-cloth-dusty-brick 5c32f19 — REJECT (reverted d8f8522)
- field-no-set-dressing 6b18a6c — APPROVE
- corpses-rest-as-flat-planks 5feb2d6 — APPROVE
- tabard-pale-board a250f54 — APPROVE
- island-no-cliff-ruled-rim 88ed7d8 — REJECT (reverted d56f6e2)
- mammoth-girder-tusks-dark-eyes 3cdbc27 — APPROVE
- tree-shadows-hard-dark cf61f0e — APPROVE
- projectiles-leave-no-litter b3b2ccd — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-cloth-dusty-brick (5c32f19) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: field-no-set-dressing (6b18a6c) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: corpses-rest-as-flat-planks (5feb2d6) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tabard-pale-board (a250f54) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: island-no-cliff-ruled-rim (88ed7d8) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-girder-tusks-dark-eyes (3cdbc27) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tree-shadows-hard-dark (cf61f0e) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: projectiles-leave-no-litter (b3b2ccd) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] armoured-red-still-brick: armoured reds sample #914546 lit, #58201d shaded; skip ARMOUR_SHADE for red so value stays >= 0.8 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [maps-light] island-no-cliff-ruled-rim: rim is a ruled lawn edge with no rock; ragged flat-shaded shelf, tessellation 20, top about -2.5 [attempts: 1] — ref: gameplay_sheet_04 r3c1 — ours: hud_placement.png
3. [battle-feel] blast-launch-too-high-and-stiff: cannon victims hang above the treetops in rigid poses; apex about 2 body heights, limb flail [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
4. [camera] battle-cam-inside-near-rank: camera sits inside the blue rank; pull back 3-4 body lengths, raise about 1 [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
5. [maps-light] wall-stones-black-in-shade: wall stones are near-black piano-key boxes from the battle camera; pale rock only, ~0.25 emissive, varied sizes [attempts: 0] — ref: gameplay_sheet_05 r3c2 — ours: war_machines_1100ms.png
6. [unit-look] knight-surcoat-thin-stripe: tabard is a pale strip a third of the back wide; full torso width, team colour a shade lighter, short skirt [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
7. [vfx] litter-shafts-bundled-blue: stuck arrows gather at one hip point, horizontal, thick blue; scatter entry points, keep arrival pitch, dark wood [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_weapon_reads.png
8. [battle-feel] corpses-flat-no-elbow: dead lie flat with straight arms; bend one elbow 40-90 deg, lift one knee off the ground [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- island-no-cliff-ruled-rim [attempts: 1] — 1.055x shelf at -0.9, 1-2% sine ragged: a flat constant-width lavender ribbon level with the lawn, no facets
- red-cloth-dusty-brick [attempts: 2] — TEAM_COLORS red to (0.93,0.2,0.17), no hue shift on red cloth: bare reds clean, armoured still brick, hue pure red not rose
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: low in side view, but still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, streaks fat cones, dust-ball base untouched
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gap 1: unitFactory cloth block, the armoured branch multiplies shade(CLOTH_SHADE)*shade(ARMOUR_SHADE); critic also wants red hue ~345-350 and skin pinker than cloth.
- Gap 2: _islandSlab takes one tessellation (48); shelf needs its own, sine amplitudes ~5x. Gap 5: _createSetDressing `place` helper.
- Gap 6: TABARD_WIDTH 0.75 -> 1.02, TABARD_PALE 0.65 -> 0.3. Gap 7: projectileSystem _leaveAsLitter, 0.25 lerp + per-shaft offset.
- Gap 8: proceduralAnimation _buildLimpPose elbows/knees. Critic asides: unit shadows faint (darkness 0.62 -> 0.5), tusks box-section (tessellation 8, girth x0.6).
- Any cut to blast lift (projectileSystem.ts, _flingFromBlast 3rd arg) fails battle_recap_result_legacy_tank_shell.
