# Loop state
Iteration: 3   Last re-audit: 0   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- team-colors-deepen cf4e5d4 — APPROVE (unit-look 2->2)
- cloth-second-tone d27000d — REJECT, reverted 3d3649e (unit-look 2->2)
- camera-spread-radius d250efa — REJECT, reverted a817149 (camera 3->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: team-colors-deepen (cf4e5d4) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)
- GAP: cloth-second-tone (d27000d) VERDICT: REJECT SCORE: unit-look 2/5 (previous: 2/5)
- GAP: camera-spread-radius (d250efa) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] Battle camera too far: units ~15% of frame height, 35% dead foreground; radius clamp ~7-13 from front-line (z) spread [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
2. [unit-look] Most units one flat hue, dark cloth reads black; cloth floor ~0.38, darken after the preset blend [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
3. [unit-look] Props undersized: spears body height and thin, shields and clubs small; spears taller than unit, shields shoulder-wide [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
4. [unit-look] Mammoth is a smooth orange cylinder with stub legs, no tusks or head mass, barely taller than infantry [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
5. [maps-light] Grey-blue cone mountains, grey sky, flat empty lime ground; teal sky, clouds, faceted scenery, ground clutter [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [camera] Camera never re-frames after the swoop; re-center target on the living centroid during battle [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_2400ms.png
7. [unit-look] Preset hue overrides team hue on cloth (blue head, maroon body); blue too dark vs periwinkle: lower BODY_PRESET_WEIGHT, TEAM_COLORS[0] ~(0.32,0.45,0.85) [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
8. [battle-feel] Front line is a thin standing queue, few bodies down; piled ragdolls and flung units [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_5s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Battle preset is cameraController.swoopToBattle (beta PI/1.9, radius 10); main.ts computeBattleFocus passes only a centroid.
- unitFactory: bodyColor = lerp(faction, team, 0.7); presets blend in resolveMaterialTint; applyMaterialPreset sets baseColor.
- TEAM_COLORS (data/factionColors.ts) also tint projectiles via projectileSystem.
- main.ts asserts #resultDetail keeps newlines; result-band edits must not break battle_recap_result_legacy_tank_shell.
- Scenario health_bar_partial_damage_clubber (not in the regression set) fails since 1.2 and should be retired.
