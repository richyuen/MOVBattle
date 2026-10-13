# Loop state
Iteration: 135   Last re-audit: 135   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- victory-giant-headless f1bafb8 — APPROVE
- slam-no-airtime b7c8303 — REJECT (reverted)
- ground-tan-not-orange 76b6cca — APPROVE
- red-shade-not-plum d40441f — APPROVE
- clubs-carried-low 7f0d1d9 — APPROVE
- head-darker-than-arms 2ab4d72 — REJECT (reverted)
- smoke-boulder-parked 6e7c955 — APPROVE
- start-pill-off-centre a88b802 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: victory-giant-headless (f1bafb8) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: slam-no-airtime (b7c8303) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: ground-tan-not-orange (76b6cca) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-shade-not-plum (d40441f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: clubs-carried-low (7f0d1d9) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: head-darker-than-arms (2ab4d72) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: smoke-boulder-parked (6e7c955) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: start-pill-off-centre (a88b802) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] slam-no-airtime: 0 airborne of ~40 at 2/5/9 s vs ~8, lift tops out 0.42-0.45; runtimeUnit.ts _enterTopple launched base lift 0.24 to ~0.8 [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_9s.png
2. [camera] victory-near-body-headless: headless clubber torso fills 42% of width, 3 of 21 survivors show; cameraController.ts frameSurvivors giant-case beta PI/1.9 to ~PI/2.25 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [unit-look] charged-arms-outglow-head: charged Zeus arms 36-85 redder-bright than head; runtimeUnit.ts _applyFxPreset skin pulse share 0.25 to 0 [attempts: 1] — ref: tabs_screenshot_08 — ours: closeup_state_reads.png
4. [maps-light] ground-shadow-red: shadow 170,68,60 is 76% of lit red vs 51% (123,66,72); main.ts shadowGen.darkness 0.12 to 0.04 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
5. [vfx] spear-no-streak: thrown spear leaves no white streak; projectileSystem.ts spawnProjectile trail switch, add white createTrail for spear and arrow [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
6. [ui-flow] start-pill-no-fill: Start and Clear outline only over red canopy, Clear ~8 px detached; index.html .btn-start background ~rgba(30,20,30,0.5) [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
7. [unit-look] red-lit-pink-shade-crimson: lit B 136-138 vs 107-117, darkest R 119-143 vs 93-100; unitFactory.ts WARM_SKIN_BLUE_LIFT 0.30 to 0.22 [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_5s.png
8. [battle-feel] clubs-level-not-upright: 0 of ~8 marching clubs upright vs 9 of 9; proceduralAnimation.ts heavy_carry elbow fold 0.16 to ~0.9 [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-darker-than-arms [attempts: 1] — skin pulse 0.25 to 0.1: charged arms still 36-85 over the head
- slam-no-airtime [attempts: 1] — topple lift cap 0.7 to 1.4: inert, lift never passes 0.45
- head-pulse-zeus [attempts: 1] — head took the fx pulse: offset is in the resting state
- victory-giant-headless [attempts: 1] — farSide radius 6, aim floor 1.0: still no head
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- mammoth-no-trample [attempts: 2] — spent

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235. Grass is now diffuse 0.98, 0.5, 0.24, emissive 0.2, 0.04, 0.036; shadows must stay plum.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`), two gaps in one file one after the other. Poses differ run to run. Critic's named material or lever can be wrong: check it is live first.
- Shoulder rotation.x negative raises the arm (-2.0 is overhead). fx pulse is 0.08-0.22, never 0. Dropped at audit 135: giant-still-routs, blast-foot-wide.
- Victory eye now goes a quarter turn (farSide 0.5 PI) and the giant is out of frame; radius and aim floor are spent levers. hemi.intensity 0.45: no further fill cuts.
