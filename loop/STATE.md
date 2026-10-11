# Loop state
Iteration: 1   Last re-audit: 0   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- camera-battle-swoop 8feac4a — APPROVE (camera 1->3)
- hide-health-bars a41e5f0 — APPROVE (ui-flow 2->2)
- result-bands 9e8771a — APPROVE (ui-flow 2->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: camera-battle-swoop (8feac4a) VERDICT: APPROVE SCORE: camera 3/5 (previous: 1/5)
- GAP: hide-health-bars (a41e5f0) VERDICT: APPROVE SCORE: ui-flow 2/5 (previous: 2/5)
- GAP: result-bands (9e8771a) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] Battle preset pitches down and sits too far (horizon ~43%, units in lower 40%); set beta ~PI/1.9, radius ~10, target.y ~1.8 in swoopToBattle [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
2. [ui-flow] Placement HUD (pills, status lines, tray, controls-help) stays up during Simulation and bleeds through result bands; hide it on Simulation/Result via a body class, make bands opaque [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [unit-look] Red team has pink heads and tan/brown bodies; paint skin in team color with faction gear layered on top [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
4. [maps-light] Arena is an unbounded flat green plane with two grey cones and a hard horizon; small island with visible edge, tree ring, pastel sky with clouds [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
5. [ui-flow] Unit tray is a flat row of text buttons; white line-art icons on dark tiles in an arc, budget + unit count bottom-left [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
6. [battle-feel] Front lines meet loosely with gaps between units and no compression; shield walls should overlap and bodies pile two deep [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
7. [vfx] Hit/death effects are soft white blur puffs; use chunky solid low-poly bits and airborne rocks [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
8. [camera] Result state holds the static battle preset; add a slow cinematic drift over survivors under the bands [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- none yet

## Notes for next iteration (max 5 lines)
- Camera swoop lives in cameraController.swoopToBattle; advanceSimulationTime steps it, restoreViewState cancels it, gallery sessions skip it.
- Health bar meshes are no longer created; scenario health_bar_partial_damage_clubber (not in the regression set) now fails and should be retired.
- Gaps 1 and 2 are cheap follow-ups to this iteration's work and touch different files (cameraController.ts vs index.html/main.ts).
- Result detail text in #resultDetail is still a four-line recap; gap 2 should collapse it to one continue prompt.
