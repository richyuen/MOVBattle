# Loop state
Iteration: 86   Last re-audit: 85   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- lightning-ruler-straight-bars 09b932a — REJECT (reverted ff98934)
- flung-bodies-open-stars 60ac5ae — APPROVE
- tribal-ring-single-file 83ed9ef — APPROVE
- grass-needles-not-cards eacd0b9 — APPROVE
- red-knight-tabard-pink b7acf54 — REJECT (reverted 4ae8275)
- far-band-level-berry-hedge 69cfa66 — REJECT (reverted 8e8362a)
- laurel-hoop-on-crown e42c34b — APPROVE
- crowns-read-as-dice 92ce477 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lightning-ruler-straight-bars (09b932a) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: flung-bodies-open-stars (60ac5ae) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tribal-ring-single-file (83ed9ef) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: grass-needles-not-cards (eacd0b9) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-knight-tabard-pink (b7acf54) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: far-band-level-berry-hedge (69cfa66) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: laurel-hoop-on-crown (e42c34b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crowns-read-as-dice (92ce477) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-knight-tabard-pink: unitFactory TABARD_PALE 0.3 -> 0.12, plus a thin pale cross box in TABARD_COLOR on the chest [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
2. [vfx] lightning-ruler-straight-bars: spawnLightning `sign = -sign` -> `if (Math.random() < 0.65) sign = -sign`; shard thickness 0.07-0.04t -> 0.18-0.12t [attempts: 2] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
3. [maps-light] tribal-ring-big-clumps: _createTrees ring height 4+s*5 -> 3+s*3, ringCount 90 -> 140, spread (s-0.5) -> (s-0.3) [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
4. [battle-feel] flung-bodies-one-facing: _buildAirPose twist factor 0.5 -> 2.4, elbows h*0.7 -> h*0.4; fix stale knee comment [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
5. [maps-light] grass-knee-high-carpet: _createFieldBlades patchHeight 0.45+s*0.55 -> 0.3+s*0.4 [attempts: 0] — ref: trailer_3_sheet_03 r3c1 — ours: big_melee_5s.png
6. [maps-light] far-band-level-berry-hedge: _createHazeTreeline height 2.0+s*2.2 -> 5.0+s*6.0, y height*0.7 -> height*0.85, subdivisions 1 -> 2 [attempts: 1] — ref: gameplay_sheet_01 r2c1 — ours: big_melee_2s.png
7. [maps-light] crowns-blood-red: mapBuilder leaves.diffuseColor (0.8, 0.27, 0.2) -> (0.88, 0.42, 0.22) [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
8. [unit-look] laurel-lime-hat-brim: propBuilder laurel diameter 0.15 -> 0.125, thickness 0.03 -> 0.022, tessellation 8 -> 6, colour -> (0.35, 0.45, 0.18) [attempts: 0] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- far-band-level-berry-hedge [attempts: 1] — height 2.0+s*4.5, radius h*(0.28+s*0.3): band still hidden below the ring, stalkless dice, big crowns merge into blobs
- red-knight-tabard-pink [attempts: 1] — TABARD_PALE 0.75: cream slab with no team tint; TABS surcoat is team colour with a white cross
- lightning-ruler-straight-bars [attempts: 2] — own y sign, divisor 0.45, amp 0.7: strict left/right alternation still an even thin sawtooth; before that amp 1.1 with shared sign: parallel bars
- kite-shield-door-sized [attempts: 1] — widths 0.14/0.18 fine, but rim lerped 0.6 to white: references show rims darker than the face
- upright-idle-locked-legs [attempts: 2] — sag 0.2 + lean*0.4: plain idle units bend; before that 0.06 + lean*0.4: invisible
- placement-armies-specks [attempts: 2] — beta PI/6 -> PI/4.5 at radius 88: still specks; before that radius 70: rims off frame
- fireball-balloon-stack [attempts: 2] — heart 1.3 -> 0.8 and yellow: no white core; before that tongue widths halved: tongues buried
- corpses-share-heading-lie-flat [attempts: 2] — seeded yaw spin on blast flight: bodies still on one screen axis, planar

## Notes for next iteration (max 5 lines)
- Any cut to blast lift stalls battle_recap_result_legacy_tank_shell; do not retry it. Air-pose edits must stay pose-only.
- Ring spread 0.34 put trees inside the field and under the HUD: bias outward, never inward. Ring is 90 trees.
- Haze treeline is icospheres merged per shade (variable named cone); the ring stands in front of and above it. Crowns use `${leaf}Crown` clones.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate TEAM_COLORS in unitFactory. getCloth materials are shared: no emissive.
- sed line anchors drift by one between greps and edits: grep -n right before editing and check `git diff -U0`.
