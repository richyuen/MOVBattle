# Loop state
Iteration: 136   Last re-audit: 135   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- slam-no-airtime 9f2cd74 — REJECT (reverted)
- victory-near-body-headless 0eb5167 — APPROVE
- charged-arms-outglow-head — not attempted (lever measured inert, see Notes)
- ground-shadow-red 191ad4d — APPROVE
- spear-no-streak 8637b97 — REJECT (reverted)
- start-pill-no-fill f3b2a22 — APPROVE
- red-lit-pink-shade-crimson 214be99 — REJECT (reverted)
- clubs-level-not-upright 5f8644b — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: slam-no-airtime (9f2cd74) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: victory-near-body-headless (0eb5167) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: ground-shadow-red (191ad4d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: spear-no-streak (8637b97) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: start-pill-no-fill (f3b2a22) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: red-lit-pink-shade-crimson (214be99) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: clubs-level-not-upright (5f8644b) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] spear-no-streak: 0 streak pixels behind in-flight spear; projectileSystem.ts spear/arrow createTrail capacity 30, size 0.10-0.16, BLENDMODE_STANDARD, zero direction and gravity [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
2. [unit-look] red-lit-pink-shade-crimson: lit skin 228,118,132 vs 231,90,106, darkest R 138 vs 109-115; unitFactory.ts WARM_SKIN_BLUE_LIFT 0.30 to 0.12, GREEN_LIFT 0.18 to 0.10, WARM_SKIN_GLOW 0.5 to 0.35 [attempts: 1] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_5s.png
3. [unit-look] mammoth-plum-not-brown: hide purple with pink bands vs chestnut brown with blue paint; vehicleBuilder.ts mammoth hide colour [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [camera] victory-group-off-centre: survivors in left 50%, cropped at edge, sky ~5% of band vs ~40%; cameraController.ts frameSurvivors giant target = box centre, beta PI/2.25 to PI/2.1 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
5. [battle-feel] clubs-lean-45: 0 of 5 clubs within 15 degrees of vertical vs 9 of 9; proceduralAnimation.ts heavy_carry elbow fold 0.9 to 1.3, jitter 0.8 to 0.4 [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_5s.png
6. [ui-flow] clear-tab-detached: 6-8 px sky gap between Clear and Start vs joined tab; index.html .btn-clear margin-right -2px, no right border, fill alpha 0.5 to 0.7 [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
7. [maps-light] shade-rust-not-plum: shadow B 53-59 vs 71, lit R 218 vs 238; mapBuilder.ts grass emissive blue 0.036 to 0.06 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- red-lit-pink-shade-crimson [attempts: 1] — BLUE_LIFT 0.30 to 0.22 alone: still pink, lit B 132, green and shade untouched
- spear-no-streak [attempts: 1] — createTrail white, 8 particles 0.03-0.07, additive: invisible on sky
- slam-no-airtime [attempts: 2] — spent: lift 4.8/2.4 over mass gave a 0.5 m hop, 0 airborne in stills
- head-darker-than-arms [attempts: 1] — skin pulse 0.25 to 0.1: charged arms still 36-85 over the head
- head-pulse-zeus [attempts: 1] — head took the fx pulse: offset is in the resting state
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- mammoth-no-trample [attempts: 2] — spent

## Notes for next iteration (max 5 lines)
- Spent (never retry): slam-no-airtime, charged-arms-outglow-head (head, arms, hands are one skin material; the offset is flat-shaded facets, head 62-130 R, forearm 137), mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210. Grass is diffuse 1.08, 0.5, 0.24, emissive 0.09, 0.04, 0.036, shadowGen.darkness 0.04: shade is 55% of lit red; emissive shows in shadow.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: check it is live first. Only ~27 topples in a 22 s big_melee.
- Shoulder rotation.x negative raises the arm. fx pulse is 0.08-0.22. `.btn:hover` resets background: repeat any fill on `:hover`.
- Victory with a giant: eye a quarter turn off it, beta PI/2.25, giant out of frame; radius and aim floor are spent levers. hemi.intensity 0.45: no further fill cuts.
