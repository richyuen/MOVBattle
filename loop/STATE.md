# Loop state
Iteration: 80   Last re-audit: 80   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- club-ball-on-stick 53943ac — APPROVE
- kite-shield-bare-slab 24ff459 — APPROVE
- fireball-balloon-stack b4a787b — REJECT (reverted 67eb87a)
- placement-pitch-shows-off-island 13a4935 — APPROVE
- cloud-on-the-ground-line cfcaab8 — APPROVE
- rear-ranks-stand-upright 5d74f9a — APPROVE
- mammoth-eyes-bulge f22921a — APPROVE
- unlimited-pill-top-left dd8697a — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: club-ball-on-stick (53943ac) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: kite-shield-bare-slab (24ff459) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fireball-balloon-stack (b4a787b) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: placement-pitch-shows-off-island (13a4935) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: cloud-on-the-ground-line (cfcaab8) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: rear-ranks-stand-upright (5d74f9a) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-eyes-bulge (f22921a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: unlimited-pill-top-left (dd8697a) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-balloon-stack: visualEffects spawnExplosionBurst, lobeSizes[0] 1.3 -> 0.8 and lobe 0 coreMat -> flashMat so narrow tongues clear a yellow heart [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
2. [unit-look] mammoth-tusk-stub-slab: vehicleBuilder buildMammoth tuskLengths x1.6, tuskGirths x0.7 (l.~1534) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
3. [battle-feel] idle-lean-on-locked-legs: proceduralAnimation _animateIdleHumanoid, knee bend of p.lean * 0.8 with matching hip drop [attempts: 0] — ref: gameplay_sheet_05 r3c2 — ours: big_melee_5s.png
4. [camera] placement-side-rock-bands: cameraController constructor radius 100 -> 88, keep pi/6 [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
5. [ui-flow] top-left-level-name-missing: index.html top bar, small plain-text map name in the top-left slot in sandbox [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
6. [maps-light] far-rim-cone-picket: mapBuilder hazeTreeline cones (l.~642), jitter depth and height about +-40% [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
7. [unit-look] club-head-two-tone: propBuilder case "club", head material accent -> dark brown (0.36, 0.22, 0.12) [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_9s.png
8. [unit-look] kite-shield-point-stub: propBuilder case "kite", kpoint/kpointRim height 0.08 -> 0.2, board shortened to match [attempts: 0] — ref: trailer_2_sheet_03 r2c3 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- fireball-balloon-stack [attempts: 1] — tongue widths halved, fireScale cap 1.6 -> 1: tongues buried in the 1.3 white heart, still a white ball with orange balls
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee
- empty-lawn-band-eye-at-head [attempts: 1] — eye 1.6 -> 1.2: bottom quarter still bare lawn, a lower level eye lifts feet toward the horizon
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll via rot.z: no corpse in profile, heading untouched
- lawn-edge-ruled-arc [attempts: 2] — ragged pulls on lawn/ground/zone corners: invisible from placement view
- blast-victims-cloud-height-scattered [attempts: 2] — lift x2/3 alone: battle_recap_result_legacy_tank_shell fails again
- surcoat-no-contrast-no-hem [attempts: 1] — TABARD_PALE 0.5, z 1.2: pale flesh slab, thicker all over, no hem edge

## Notes for next iteration (max 5 lines)
- Fireball: fireScale and tongue arrays are visual only (safe to change); the shell's scale is 1.8. Tongues root at y 0.3, heart is lobe 0.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Corpses: no more yaw; critic wants heaped rest poses.
- Mammoth head ellipsoid front is z ~0.72 at the eye; an eye centred below z 0.66 is buried. Kite shield face is +z.
- lowClouds comment in mapBuilder is stale (clouds now at y 14-19, out of the placement view); fix it with the next cloud edit.
- unitFactory: never touch TEAM_COLORS. Source .ts files are CRLF; single-line `sed -i` and the Edit tool both keep diffs clean.
