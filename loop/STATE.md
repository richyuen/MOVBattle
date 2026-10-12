# Loop state
Iteration: 81   Last re-audit: 80   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-balloon-stack aed6aae — REJECT (reverted f8db877)
- mammoth-tusk-stub-slab 68b3022 — APPROVE
- idle-lean-on-locked-legs da7b057 — REJECT (reverted a25a8dd)
- placement-side-rock-bands 74bea9e — APPROVE
- top-left-level-name-missing d78ed06 — APPROVE
- far-rim-cone-picket 8ad9ff0 — APPROVE
- club-head-two-tone 70db469 — APPROVE
- kite-shield-point-stub ac01af0 — REJECT (reverted ccd1d7a)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-balloon-stack (aed6aae) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-tusk-stub-slab (68b3022) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: idle-lean-on-locked-legs (da7b057) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: placement-side-rock-bands (74bea9e) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: top-left-level-name-missing (d78ed06) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: far-rim-cone-picket (8ad9ff0) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: club-head-two-tone (70db469) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: kite-shield-point-stub (ac01af0) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] kite-shield-point-stub: propBuilder case "kite", long point (0.2) again but with point.scaling.z 0.14 and rimPoint to match, so it is a flat triangle [attempts: 1] — ref: trailer_2_sheet_03 r2c3 — ours: lineup_medieval.png
2. [vfx] fireball-balloon-stack: visualEffects fireball, dominant near-white coreMat heart, orange lobes sunk two-thirds into it [attempts: 2] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
3. [battle-feel] idle-lean-on-locked-legs: proceduralAnimation idle (l.~488), make the lineup/closeup pose path show p.lean and bent knees [attempts: 1] — ref: gameplay_sheet_05 r3c2 — ours: closeup_pair_zeus_thor.png
4. [camera] placement-armies-specks: cameraController constructor radius 88 -> about 70 [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png
5. [vfx] blast-grey-boulder-lumps: visualEffects burst dust blobs, flatten and lighten to a low tan puff [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
6. [unit-look] mammoth-tusk-kinked-low: vehicleBuilder buildMammoth, first two tuskLengths about 0.4, last two segments team blue [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [maps-light] far-rim-unbroken-cone-wall: mapBuilder _createHazeTreeline, seeded gaps (about 1 cone in 4, in runs) and a second darker material [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_2s.png
8. [ui-flow] top-left-caption-sandbox: mapBuilder l.~1574, sandbox displayName -> a place name [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- kite-shield-point-stub [attempts: 1] — point 0.08 -> 0.2, board 0.32 -> 0.2: kpoint is 0.18 deep unscaled, reads as a thick pyramid gem
- idle-lean-on-locked-legs [attempts: 1] — knee sag 0.8 lean in _animateIdleHumanoid: not visible, big_melee has no waiting men and closeup figures stand upright
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core, equal balloons; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on living blast flight: lying bodies still on one screen axis, spread-eagled and planar
- arrowheads-outside-shafts-one-height [attempts: 1] — back -0.19, symmetric +-0.25 height: heads still visible, shafts land at thigh and knee
- empty-lawn-band-eye-at-head [attempts: 1] — eye 1.6 -> 1.2: bottom quarter still bare lawn, a lower level eye lifts feet toward the horizon
- corpses-prone-same-heading [attempts: 1] — straight knee 0.4-1.2, quarter roll via rot.z: no corpse in profile, heading untouched
- lawn-edge-ruled-arc [attempts: 2] — ragged pulls on lawn/ground/zone corners: invisible from placement view

## Notes for next iteration (max 5 lines)
- Idle gap: first grep how the closeup/lineup figures are posed (they show no p.lean), or the edit cannot be seen. Hips never move in y.
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Corpses: no more yaw; critic wants heaped rest poses.
- Mammoth head ellipsoid front is z ~0.72 at the eye. Kite shield face is +z; only rimPoint has scaling.z (0.6).
- lowClouds comment in mapBuilder is stale (clouds now at y 14-19); fix it with the next cloud edit. Haze cones span z 37.5-47 (rim 47).
- unitFactory: never touch TEAM_COLORS. Source .ts files are CRLF; single-line `sed -i` and the Edit tool both keep diffs clean.
