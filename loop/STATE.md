# Loop state
Iteration: 5   Last re-audit: 5   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- bead-eyes db63808 — APPROVE (unit-look 2->2)
- center-line-thin 61627ea — APPROVE (maps-light 2->2)
- crowd-density b995fe3 — APPROVE (battle-feel 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: bead-eyes (db63808) VERDICT: APPROVE SCORE: unit-look 2/5 (previous: 2/5)
- GAP: center-line-thin (61627ea) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: crowd-density (b995fe3) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] head-shrink: heads are smooth spheres ~2/3 shoulder width; scale head dims x0.8 (0.27/0.24/0.22 in bodyBuilder), sphere segments ~6 [attempts: 0] — ref: tabs_screenshot_04 — ours: big_melee_9s.png
2. [battle-feel] charge-cohesion: ranks spread to 1-2 m gaps by 2 s; cap approach speed to slowest neighbour within 1.5 m, <=0.7 m gaps at contact [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
3. [battle-feel] run-lean: moving units bolt upright, spears at one angle; ~15 deg torso lean, +/-25 deg arm swing while running [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
4. [maps-light] arena-ring: unbounded flat plane, ~6 trees, 4 cones; ring field with 30+ trees at ~25 m, visible island edge [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: big_melee_placement.png
5. [vfx] spell-solid-shapes: magic is soft white blobs and trails; opaque solid-colour low-poly shapes, no alpha falloff [attempts: 0] — ref: trailer_2_sheet_02 r1c3 — ours: closeup_state_reads.png
6. [unit-look] shield-size: protector/hoplite shields ~0.3 m flat discs held low; ~0.7 m round, chest-high in front [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [maps-light] divider-no-glow: pink divider has a whitish halo from GlowLayer (main.ts:254)/bloom; exclude mesh or lower emissive [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [camera] camera-spread-radius: mammoth fills right third, front line off-centre; clash line should fill middle 60% [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_9s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Capture bug: war_machines_* frames show no units, lineup_medieval only shadows, closeup_* shot from far oblique. Fix first.
- Hats use fixed sizes (propBuilder has no head dims); check they still fit when shrinking heads. Pupil meshes are disabled, not removed.
- Guides toggle by mesh name "border" via setPlacementGuidesVisible (mapBuilder); campaign zone borders untouched.
- BIG_MELEE in capture.mjs: ranks x 6/6.9/7.8; critic suggests 4/4.6/5.2. Dropped for the cap: hud-declutter, mammoth-mass.
- Sky/fog color lives in main.ts and restoreSandboxSceneLook; clumps/clouds in mapBuilder _createFieldClumps/_createClouds.
