# Loop state
Iteration: 126   Last re-audit: 125   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- blue-army-slate 7146d4f — APPROVE
- cannon-blast-matte-peach e698a0e — APPROVE
- front-runners-outpace 00d856e — APPROVE
- mammoth-hide-plum 38a7a37 — APPROVE
- victory-giant-wall — no commit (see Rejected)
- muzzle-smoke-low-contrast 9e2d3f8 — REJECT (reverted 93d8d39)
- red-skin-pink ae8fe9b — APPROVE
- boulders-lit-violet-2 — no commit (see Rejected)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blue-army-slate (7146d4f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-blast-matte-peach (e698a0e) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: front-runners-outpace (00d856e) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-hide-plum (38a7a37) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-low-contrast (9e2d3f8) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-skin-pink (ae8fe9b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] blast-fringe-peach: lower lobes 212,152,106 over half the blast vs 250,250,224 with a thin 246,216,146 foot; visualEffects.ts flameMat emissive to (1.7,1.25,0.6), lobes 1 and 3 to flashMat [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [vfx] muzzle-smoke-lit-grey: lit 166,169,180 vs 217,213,206, smooth balls vs flat facets; projectileSystem.ts smoke emissive ~(0.20,0.19,0.17) plus convertToFlatShadedMesh [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
3. [unit-look] blue-plate-dark-teal: plate 11,68,96 hue 201 vs 31,78,141 / 38,92,179 hue 218-226; unitFactory.ts cool armoured hue +15, ARMOUR_SHADE to ~0.9 for cool [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_5s.png
4. [battle-feel] mammoth-behind-own-line: mammoth behind the reds at 2s/5s/9s, contact front 35% bare vs 2%; simulationSystem.ts _resolveCohesionMoveMultiplier return 1 for mammoth-class bodies [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [camera] victory-giant-wall: mammoth flank fills 26% of the result scene, survivors cut at the waist; exclude giants from the focus pick or raise the camera above the flank [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [unit-look] red-skin-crimson: mid 201,45,63 S 0.78 vs 170,72,89 S 0.57; unitFactory.ts SKIN_FLESH_WEIGHT 0.25 to 0.35 for warm skin, no more blue cut [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_result.png
7. [unit-look] blue-shields-limbs-slate: shields 94,114,144 (S 0.2-0.36) vs S 0.73-0.95; propBuilder.ts buildShield apply the 0.85 saturation floor to cool team colour [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
8. [maps-light] boulders-lit-violet-2: lit 75,68,92 vs critic's 98,98,101 (worker sampled 84,72,84); lift darkRock base ~25%, cut blue [attempts: 1] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged 166,169,180, underside brown; albedo does not limit the lit faces
- victory-giant-wall [attempts: 1] — alpha 60 deg off the giant: wall grew to 45%; survivors stand ~2.1 from its middle, no alpha clears it at radius 3; not committed
- boulders-lit-violet-2 [attempts: 1] — emissive B 0.08 to 0.05 overshot (shade B 46 vs 67); ours already within 10 of the sampled ref; not committed
- blue-army-slate [attempts: 1] — saturation x1.6 on body only: not visible, the surcoat and shields are the plate on screen
- mammoth-hide-plum [attempts: 1] — (0.80,0.52,0.34): pale khaki

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball foot/lobes/balloon, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot, shade-brick. Never shrink enemy collision distance or lower ally contactBias below 0.55.
- ACES tone map: emissive 1.0 shows ~210, 2.0 ~233 (ceiling). The blue hemi adds ~+20 B over R to greys. Skin glow is in applyMaterialPreset; red skin base blue x0.75 (WARM_SKIN_BLUE).
- Measure first: capture `--iter 9123` uncommitted (full run also checks scenarios), sample PNG and reference JPG regions with System.Drawing percentiles. A critic target can be wrong.
- Runner hold needs 3+ marching allies within 3: with fewer, battlefeel_attack_interrupt_charge and spillover_chain fail. One gap, one change; recheck big_melee_result after any sim edit.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Source files are CRLF: edit by exact-string node script; commit with `git commit <file> -F -` heredoc.
