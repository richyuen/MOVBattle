# Loop state
Iteration: 82   Last re-audit: 80   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- kite-shield-point-stub 8d40a02 — APPROVE
- idle-lean-on-locked-legs 424a8c6 — APPROVE
- placement-armies-specks 0fd85b6 — REJECT (reverted 0bb2c36)
- blast-grey-boulder-lumps 17708d0 — APPROVE
- mammoth-tusk-kinked-low 6350c82 — APPROVE
- far-rim-unbroken-cone-wall 0d583b7 — APPROVE
- top-left-caption-sandbox f15cf10 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: kite-shield-point-stub (8d40a02) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: idle-lean-on-locked-legs (424a8c6) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: placement-armies-specks (0fd85b6) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: blast-grey-boulder-lumps (17708d0) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-tusk-kinked-low (6350c82) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: far-rim-unbroken-cone-wall (0d583b7) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: top-left-caption-sandbox (f15cf10) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] placement-armies-specks: cameraController constructor beta PI/6 -> about PI/4.5, radius set so both end rims stay just inside the frame [attempts: 1] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png
2. [vfx] fireball-balloon-stack: separate orange, yellow and white spheres, not one blown-out ragged mass [attempts: 2] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [maps-light] tribal-map-spring-green: map named Tribal Hills is green meadow and green trees; TABS tribal is orange grass, red ball trees, teal sky [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
4. [battle-feel] upright-idle-locked-legs: proceduralAnimation idle, floor the knee sag at about 0.06 so upright units (Zeus, giants) bend too [attempts: 0] — ref: gameplay_sheet_05 r3c2 — ours: closeup_state_reads.png
5. [unit-look] mammoth-tusk-low-red-ends: vehicleBuilder buildMammoth, paint only the last segment, last three tuskPitches to about 1.5, 2.1, 2.7 so the tip reaches eye height [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [unit-look] kite-shield-ridged-blade: propBuilder "kite", point 0.2 -> about 0.13 and rotation.y PI/4 so a flat face points forward [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
7. [maps-light] far-cones-still-a-wall: mapBuilder _createHazeTreeline, depth jitter 9.5 -> about 3, left-out run 6 -> about 15 cones [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_2s.png
8. [vfx] blast-dust-slab-left: visualEffects blast mound, fade the lobes out over the first 40% of the effect [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- placement-armies-specks [attempts: 1] — radius 88 -> 70: men still 12px blobs seen from above, island end rims pushed off frame
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core, equal balloons; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee
- empty-lawn-band-eye-at-head [attempts: 1] — eye 1.6 -> 1.2: bottom quarter still bare lawn, a lower level eye lifts feet toward the horizon
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll via rot.z: no corpse in profile, heading untouched
- lawn-edge-ruled-arc [attempts: 2] — ragged pulls on lawn/ground/zone corners: invisible from placement view

## Notes for next iteration (max 5 lines)
- Pair close-up camera is now alpha -0.8 (scenarios.ts pairCamera); critic says it shows Thor from behind. Do not swing it further.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Corpses: no more yaw; critic wants heaped rest poses.
- Haze cones: materials hazeTrees + hazeTreesShade (painted in paintFarProps); gaps keyed on floor(k/6), seed 75. Cones span z 37.5-47.
- lowClouds comment in mapBuilder is stale (clouds now at y 14-19); fix it with the next cloud edit. Tusk tips use paintMat.
- unitFactory: never touch TEAM_COLORS. Source .ts files are CRLF; single-line `sed -i` and the Edit tool both keep diffs clean.
