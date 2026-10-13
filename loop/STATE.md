# Loop state
Iteration: 138   Last re-audit: 135   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- clubs-lean-45 35dd9a0 — APPROVE
- field-pale-pink c3ad72c — APPROVE
- streak-glowing-beam 112467f — APPROVE
- red-shade-hue 66d7760 — APPROVE
- victory-group-low 60f86d2 — APPROVE
- clear-tab-rounded c2fe396 — APPROVE
- no-bodies-down 648c6fa — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: clubs-lean-45 (35dd9a0) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: field-pale-pink (c3ad72c) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: streak-glowing-beam (112467f) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-shade-hue (66d7760) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-group-low (60f86d2) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: clear-tab-rounded (c2fe396) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: no-bodies-down (648c6fa) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-launches-nobody: 0 airborne at 9 s; critic names simulationSystem.ts iconic_mammoth knockback.y 1.35 to 3.0, scale 1.0 to 1.5 [attempts: 2, spent as mammoth launch: skip] — ref: trailer_3_sheet_03 r1c2 — ours: big_melee_9s.png
2. [unit-look] red-bubblegum-pink: lit 208,88,112 vs 190,74,91, shade 140,40,66 vs 108,36,62; unitFactory.ts WARM_SKIN_GLOW 0.35 to 0.25 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
3. [vfx] shell-burst-cream-ball: cream-white ball taller than the cannon vs flat yellow-orange fireball; visualEffects.ts burstFlash (~line 395) colour orange-yellow, diameter down a third [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
4. [maps-light] field-tan: field red 217 vs 238; mapBuilder.ts grass.diffuseColor red 1.08 to 1.19 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
5. [battle-feel] clubs-shoulder-low: one club level, one 45 deg back at 9 s, one dragging at 2 s; proceduralAnimation.ts heavy_carry shoulder -1.2 to -1.45, jitter 0.9 to 0.5 [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_9s.png
6. [vfx] streak-too-long: streak longer than the shaft, dashed tail vs short splash; projectileSystem.ts _addStreak lengths 1.6/1.4 to 0.8/0.7 [attempts: 0] — ref: trailer_3_sheet_01 r3c3 — ours: closeup_state_reads.png
7. [ui-flow] levels-rounded-pill: Levels a rounded pill, Clear's slant unoutlined; index.html .btn-corner border-radius 0 + clip-path polygon(14px 0, 100% 0, 100% 100%, 0 100%) [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
8. [camera] victory-crossed-by-shafts: tusk and spears cross the men, helmet/corpse in foreground; cameraController.ts frameSurvivors giant beta PI/2.1 to PI/2.25 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards, TABS hide is plum-maroon hue 326-349, as (0.43,0.20,0.25) is
- slam-no-airtime [attempts: 2] — spent
- head-darker-than-arms [attempts: 1] — skin pulse 0.25 to 0.1: charged arms still 36-85 over the head
- head-pulse-zeus [attempts: 1] — head took the fx pulse: offset is in the resting state
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- mammoth-no-trample [attempts: 2] — spent

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210. Grass diffuse 1.08, 0.56, 0.19, emissive 0.09, 0.04, 0.06; emissive shows in shadow. hemi.intensity 0.45: no further fill cuts. Red skin: flat blue glow WARM_SKIN_GLOW_BLUE 0.03 put shade blue at 66.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: check it is live and probe it. sed by line number: re-grep the line first.
- Shoulder rotation.x negative raises the arm; heavy_carry elbow is 0.4 +-0.2. fx pulse is 0.08-0.22. `.btn:hover` resets background. Streak is a mesh child "streak" (factory "wood" mat, alpha 0.5). Frontal-hit balance floor is 0.7 (runtimeUnit _updateCrowdPhysicsState).
- Victory with a giant: eye a quarter turn off it, beta PI/2.1, target y 1, target box.group (men within 3 of focus, set in main.ts); radius and aim floor are spent levers.
