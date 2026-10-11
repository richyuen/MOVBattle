# Loop state
Iteration: 6   Last re-audit: 5   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- head-shrink 6def433 — APPROVE (unit-look 2->2)
- charge-cohesion 87508dd — APPROVE (battle-feel 2->2)
- run-lean 4846402 — APPROVE (battle-feel 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: head-shrink (6def433) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)
- GAP: charge-cohesion (87508dd) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: run-lean (4846402) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] spell-solid-shapes: magic is soft white blobs and trails; opaque solid-colour low-poly shapes, no alpha falloff [attempts: 0] — ref: trailer_2_sheet_02 r1c3 — ours: closeup_state_reads.png
2. [maps-light] arena-ring: unbounded flat plane, ~6 trees, 4 cones; ring field with 30+ trees at ~25 m, visible island edge [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: big_melee_placement.png
3. [battle-feel] rear-rank-press: second rank held off stopped allies by the 2.6 m avoidance radius; use the 0.3 m radius for all same-team allies so ranks pile two deep [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
4. [unit-look] shield-size: protector/hoplite shields ~0.3 m flat discs held low; ~0.7 m round, chest-high in front [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [unit-look] helm-fit: bucket helms and hats sit on top of the shrunken head; scale by 0.8 and lower to enclose it, give the head a faceted taper [attempts: 0] — ref: tabs_screenshot_04 — ours: big_melee_9s.png
6. [battle-feel] engaged-rigid: units stopped at the clash stand vertical, arms down; add 0.1 rad lean plus sway to idle/engaged pose, remove the walk neck counter-tilt [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_5s.png
7. [camera] camera-spread-radius: mammoth fills right third, front line off-centre; clash line should fill middle 60% [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
8. [maps-light] divider-no-glow: pink divider has a whitish halo from GlowLayer (main.ts:254)/bloom; exclude mesh or lower emissive [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Capture bug still open: gallery closeups are far oblique (preset likely lost on startBattle in runScenarioGalleryValidation, main.ts:3125).
- Head sphere is 6-segment but reads smooth (no flat shading); hats parent to body.headTop at fixed size (propBuilder:41).
- Cohesion: marchingAlly needs other.isMoving (_applyCrowdAvoidance); cap via setCohesionMoveMultiplier, floor 0.5, 1.5 m.
- Critic unsure: big_melee_result.png shows loose props, few bodies; check whether corpses are removed at Result.
- Walk lean 0.26 rad plus neck -0.1 in _animateWalkHumanoid; weapon-arm bias multipliers 0.6-0.7 in _applyWalkBias.
