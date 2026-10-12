# Loop state
Iteration: 83   Last re-audit: 80   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- placement-armies-specks 74b9081 — REJECT (reverted 2e7ccc8)
- tribal-map-spring-green b605f04 — APPROVE
- upright-idle-locked-legs ff1c2c9 — REJECT (reverted 04d71dd)
- mammoth-tusk-low-red-ends 8a2e2ac — REJECT (reverted f971056)
- kite-shield-ridged-blade 7ca08a9 — APPROVE
- far-cones-still-a-wall 8b17e29 — APPROVE
- blast-dust-slab-left e468897 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: placement-armies-specks (74b9081) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: tribal-map-spring-green (b605f04) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: upright-idle-locked-legs (ff1c2c9) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-tusk-low-red-ends (8a2e2ac) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: kite-shield-ridged-blade (7ca08a9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: far-cones-still-a-wall (8b17e29) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blast-dust-slab-left (e468897) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] placement-armies-specks: cameraController constructor radius 88 -> about 62, target z about +6, so units are figures and no sky sits behind Start [attempts: 2] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png
2. [maps-light] tribal-grass-wheat-yellow: mapBuilder _createMaterials grass to about (0.86, 0.45, 0.2), ground (0.74, 0.4, 0.2), darkLeaves to orange (0.9, 0.5, 0.2) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
3. [battle-feel] upright-idle-locked-legs: proceduralAnimation idle sag floor about 0.18; giants stand on pillar legs with mirrored arms [attempts: 1] — ref: gameplay_sheet_05 r3c2 — ours: closeup_state_reads.png
4. [unit-look] mammoth-tusk-low-red-ends: buildMammoth last three tuskGirths to about 0.14, 0.11, 0.06 and full unblended team colour on the tip [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [vfx] blast-grey-pancake-mound: visualEffects blast mound lobes from grey to the fireball's pale yellow, lobes overlapped into one mass [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
6. [maps-light] far-cones-tall-salmon: _createHazeTreeline height 2.2 + v*5.2 -> about 2.0 + v*2.2, cone colour to the canopy red [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_2s.png
7. [unit-look] kite-shield-door-sized: propBuilder kite rim to pale grey (teamColor lerped 0.6 to white), width 0.18 -> about 0.14 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
8. [maps-light] tribal-ring-tiered-pines: replace three-tier pines on Tribal Hills with ball canopies on thin stalks [attempts: 0] — ref: gameplay_sheet_01 r2c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- placement-armies-specks [attempts: 2] — beta PI/6 -> PI/4.5 at radius 88: still specks, sky and mountain roots behind Start; before that radius 70: rims off frame
- upright-idle-locked-legs [attempts: 1] — sag 0.06 + lean*0.4: bend invisible, giants still on pillar legs
- mammoth-tusk-low-red-ends [attempts: 1] — pitches 1.5, 2.1, 2.7, paint last segment only: tip too thin to see, no paint visible
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core, equal balloons; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee
- empty-lawn-band-eye-at-head [attempts: 1] — eye 1.6 -> 1.2: bottom quarter still bare lawn, a lower level eye lifts feet toward the horizon
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll via rot.z: no corpse in profile, heading untouched

## Notes for next iteration (max 5 lines)
- Pair close-up camera is alpha -0.8 (scenarios.ts pairCamera); do not swing it further. Idle sag already was lean*0.4 (0.09-0.15) before the floor.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Corpses: no more yaw; critic wants heaped rest poses.
- Tribal sandbox is autumn (grass/ground/leaves in _createMaterials); recolorBaseTerrain repaints leaves green for campaign maps, keep that in step.
- Haze cones take the leaves colour via paintFarProps (now salmon); gaps keyed on floor(k/15), seed 75, z 37.5-40.5. lowClouds comment is stale.
- unitFactory: never touch TEAM_COLORS. Edit source by pattern, not line number (sed line numbers drifted once); diffs stay clean.
