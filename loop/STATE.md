# Loop state
Iteration: 87   Last re-audit: 85   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-knight-tabard-pink b0a1f77 — APPROVE
- tribal-ring-big-clumps a8453a2 — APPROVE
- flung-bodies-one-facing 1b1be36 — APPROVE
- grass-knee-high-carpet 2385436 — REJECT (reverted 88843a3)
- far-band-level-berry-hedge adb462a — REJECT (reverted 4c73ac2)
- crowns-blood-red 2d47b64 — REJECT (reverted c8b8284)
- laurel-lime-hat-brim cac5479 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-knight-tabard-pink (b0a1f77) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tribal-ring-big-clumps (a8453a2) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: flung-bodies-one-facing (1b1be36) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: grass-knee-high-carpet (2385436) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: far-band-level-berry-hedge (adb462a) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: crowns-blood-red (2d47b64) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: laurel-lime-hat-brim (cac5479) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] far-band-level-berry-hedge: _createHazeTreeline height 4+s*3, radius h*0.3, subdivisions 1, y h*0.75 [attempts: 2] — ref: gameplay_sheet_01 r2c1 — ours: big_melee_2s.png
2. [maps-light] crowns-blood-red: leaves -> (0.86, 0.32, 0.24), darkLeaves -> (0.93, 0.62, 0.22), crownMat emissive scale 0.26 -> 0.38 [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
3. [battle-feel] flung-bodies-all-horizontal: _buildAirPose add a hashed whole-body pitch of about +-1.2 rad on torso x beside twist; knees straighter [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
4. [vfx] lightning-ruler-straight-bars: bolt needs 4-6 jittered segments [attempts: 2] — ref: gameplay_sheet_06 r3c1 — ours: closeup_state_reads.png
5. [maps-light] grass-knee-high-carpet: keep patchHeight; _createFieldBlades half 0.04+s*0.03 -> 0.025+s*0.02, skip about one cell in three (0.25 -> 0.33) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
6. [unit-look] tabard-back-salmon-fat-cross: unitFactory TABARD_PALE 0.12 -> 0 with colour scaled 0.9; cross bars [0.36, 1.1], [1.15, 0.3] -> [0.2, 1.3], [1.0, 0.18] [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
7. [unit-look] zeus-bald-sweatband: propBuilder laurel y -0.07 -> -0.045, rotation.x 0.25, brown flattened icosphere hair under it; white toga torso [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
8. [maps-light] tribal-ring-one-deep: _createTrees spread factor 0.34 -> 0.22 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- far-band-level-berry-hedge [attempts: 2] — height 5-11, y 0.85h, subdiv 2: giant trunkless balls dwarf the ring; before that 2-6.5: hidden below the ring
- crowns-blood-red [attempts: 1] — leaves (0.88, 0.42, 0.22): same orange as darkLeaves and the ground; canopy needs red and orange side by side
- grass-knee-high-carpet [attempts: 1] — patchHeight 0.3+s*0.4: TABS grass is knee-high in clumps; carpet read comes from even cover and wide blades
- lightning-ruler-straight-bars [attempts: 2] — strict left/right alternation still an even thin sawtooth; before that parallel bars
- kite-shield-door-sized [attempts: 1] — rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend; before that 0.06: invisible
- placement-armies-specks [attempts: 2] — beta PI/4.5 at radius 88: still specks; radius 70: rims off frame
- fireball-balloon-stack [attempts: 2] — heart 0.8 and yellow: no white core; tongue widths halved: tongues buried

## Notes for next iteration (max 5 lines)
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Air-pose edits must stay pose-only.
- Ring is 140 trees 3-6 tall, spread 1+(s-0.3)*0.34: bias outward, never inward. trailer_3_sheet_03 r3c1 is not TABS: do not cite it.
- Haze treeline is trunkless icospheres merged per shade; far crowns must stay smaller than ring crowns. Crowns use `${leaf}Crown` clones.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate TEAM_COLORS in unitFactory. getCloth materials are shared: no emissive.
- Source files are CRLF: sed by line number after a fresh grep -n, node string replaces must convert \n; check `git diff -U0`.
