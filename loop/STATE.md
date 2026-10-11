# Loop state
Iteration: 4   Last re-audit: 0   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- props-oversize f100ff8 — APPROVE (unit-look 2->2)
- mammoth-silhouette 07094c9 — APPROVE (unit-look 2->2)
- map-sky-scenery 4556c47 — APPROVE (maps-light 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: props-oversize (f100ff8) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)
- GAP: mammoth-silhouette (07094c9) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)
- GAP: map-sky-scenery (4556c47) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] Battle camera too far, units ~15% of frame height; radius clamp from front-line spread [attempts: 1] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [unit-look] Bodies are smooth capsules with huge white sphere eyes; flat-shade body meshes, small black bead eyes [attempts: 0] — ref: tabs_screenshot_04 — ours: big_melee_9s.png
3. [maps-light] Tribal ground lime with green pines; orange grass, orange/red ball-canopy trees, same-hue dense tufts (own material, ~200) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
4. [unit-look] Shields lie flat at the hip; stand them vertical facing forward, scale ~2.0 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
5. [unit-look] Mammoth is a salmon crate at 2.5x; MAMMOTH_SCALE ~2.6, fur ~(0.32,0.2,0.14), team color as accents [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
6. [maps-light] Cone mountains with wedge artefact, blown-out clouds; low rock slabs behind a tree ring, cloud emissive ~0.5 [attempts: 0] — ref: gameplay_sheet_01 — ours: war_machines_2400ms.png
7. [battle-feel] Front line is a thin standing queue, few bodies down; piled ragdolls and flung units [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_5s.png
8. [unit-look] Dark cloth reads black, preset hue overrides team hue; cloth floor ~0.38 after the preset blend [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Iter 5 is a re-audit; dropped for the cap: camera never re-frames after the swoop (still open).
- Shields: attachProps scales non-bucklers 1.6; club head uses accent (reads as yellow ball), spears carried level.
- Mammoth rig hangs under m_bulk (MAMMOTH_SCALE 1.8); vis `scale` is not applied to vehicle bodies.
- Sky/fog color lives in main.ts and restoreSandboxSceneLook; fogStart/End 70/170 is global (campaign too).
- Clumps/clouds: mapBuilder _createFieldClumps (darkLeaves) and _createClouds (emissive 0.82).
