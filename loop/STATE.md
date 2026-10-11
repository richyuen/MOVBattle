# Loop state
Iteration: 8   Last re-audit: 5   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 4 | vfx 1

## Focus (2-3 gaps this iteration)
- zones-match-slab 7f55678 — APPROVE (maps-light 3->3)
- fallen-ally-berth a4a7133 — APPROVE (battle-feel 2->2)
- placement-frame 153761b — APPROVE (camera 3->4)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: zones-match-slab (7f55678) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fallen-ally-berth (a4a7133) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: placement-frame (153761b) VERDICT: APPROVE SCORE: camera 4/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] lines-collide: lines hover ~3 body widths apart; 2.6 m enemy berth (fallen enemies too) stops compression [attempts: 0] — ref: trailer_3_sheet_01 r1c1 — ours: big_melee_5s.png
2. [battle-feel] mammoth-launch: mammoth contact launches nobody; no airborne/spinning bodies [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_9s.png
3. [maps-light] nav-match-slab: nav grid extends past the 184x96 slab; campaign maps have no slab placement zones [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
4. [vfx] spell-solid-shapes: magic/smoke are soft glowing white blobs, not solid faceted shapes [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_state_reads.png
5. [battle-feel] corpses-stay: corpses non-blocking and cleaned up; result field has few bodies [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [maps-light] island-edge: flat rectangular slab, no cliff rim; flat teal sky, no warm sun grading [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
7. [camera] placement-target-tray: near tree ring hidden under tray; campaign presets still tight [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [unit-look] props-thin: thin tube bodies, small props; shields thin rings not shoulder-wide discs [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo still in closeup_state_reads; commit also touched hit flash and explosion smoke
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Nav grid is alignment-sensitive (shield_wall failed in iter 7 when zones shrank); pre-check with `capture.mjs --iter 99 --regression-only`.
- Avoidance radii live in _applyCrowdAvoidance (simulationSystem.ts ~620); critic's next edit: fallenAllyAvoidanceRadius for fallen units of any team.
- Placement view = cameraController constructor (beta pi/4.4, radius 82); fog starts at 70 (main.ts:123), so larger radii wash out.
- Captures hide VFX: zeus_thor closeup idle, gallery closeups far oblique, war_machines shots near empty; halo source unconfirmed.
- Critic liked opaque grey icosphere smoke chunks (reverted with d4ccbb1).
