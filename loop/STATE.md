# Loop state
Iteration: 2   Last re-audit: 0   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- camera-battle-preset 529177e — APPROVE (camera 3->3)
- hud-hide-in-battle dd8e9eb — APPROVE (ui-flow 3->3)
- team-color-skin 8b397da — APPROVE (unit-look 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: camera-battle-preset (529177e) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: hud-hide-in-battle (dd8e9eb) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)
- GAP: team-color-skin (8b397da) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] Battle camera ignores army spread (sparse = empty frame, dense = unit on the lens); derive radius from spread (clamp ~10-18), beta ~PI/2.05 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_2400ms.png
2. [unit-look] Bodies are one flat hue; cloth needs a darker team-tinted second tone distinct from skin, clamp dark presets [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
3. [unit-look] TEAM_COLORS are salmon and pale cyan; deepen to crimson and royal blue [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [ui-flow] Result bottom band is 20% tall with four recap lines and two buttons; one prompt line, title "VICTORY!"; also hide HUD from Countdown [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
5. [ui-flow] Placement tray is a flat bar of text chips with a search box; centered icon-tile tray, budget + unit count bottom-left, no status lines or controls-help [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
6. [unit-look] Heads are oversized balloons with big white ball eyes on thick tube limbs; small heads, black bead eyes, long thin limbs [attempts: 0] — ref: tabs_screenshot_04 — ours: big_melee_9s.png
7. [maps-light] Backdrop is smooth grey cones on flat grey-blue sky, no clouds, no tree ring or island edge [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
8. [camera] Placement view cuts off the arena and shows no island edge; whole island from a high oblique [attempts: 0] — ref: gameplay_sheet_01 r3c3 — ours: big_melee_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- none yet

## Notes for next iteration (max 5 lines)
- Battle preset is in cameraController.swoopToBattle; main.ts computeBattleFocus passes only a centroid, so gap 1 needs spread passed in too.
- body.in-battle (index.html CSS) is added in enterSimulation and removed beside both returnToPlacementView calls.
- unitFactory: SKIN_FLESH_WEIGHT/BODY_PRESET_WEIGHT scale preset tints; body team lerp is 0.7. TEAM_COLORS live in data/factionColors.ts.
- main.ts:2352 asserts #resultDetail keeps newlines (white-space); gap 4 must not break battle_recap_result_legacy_tank_shell.
- Scenario health_bar_partial_damage_clubber (not in the regression set) fails since 1.2 and should be retired.
