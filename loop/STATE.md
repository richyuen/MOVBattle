# Loop state
Iteration: 127   Last re-audit: 125   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- blast-fringe-peach b8f4ff1 — APPROVE
- muzzle-smoke-lit-grey 3d7b493 — APPROVE
- blue-plate-dark-teal e7a8349 — APPROVE
- mammoth-behind-own-line c3f9b2e — APPROVE
- victory-giant-wall 37ab7e3 — APPROVE
- red-skin-crimson 4cae1b7 — APPROVE
- blue-shields-limbs-slate 7d9c9e6 — APPROVE
- boulders-lit-violet-2 a07e0d7 — REJECT (reverted f867cb6)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blast-fringe-peach (b8f4ff1) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: muzzle-smoke-lit-grey (3d7b493) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: blue-plate-dark-teal (e7a8349) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-behind-own-line (c3f9b2e) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: victory-giant-wall (37ab7e3) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: red-skin-crimson (4cae1b7) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blue-shields-limbs-slate (7d9c9e6) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-lit-violet-2 (a07e0d7) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] reds-queue-behind-mammoth: ~12 reds bunched at the mammoth's rump at 5s/9s vs infantry level with and ahead of the forelegs; simulationSystem.ts crowd separation, push same-team smalls sideways off a colossus, not along the contact normal [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
2. [unit-look] blue-plate-shield-cyan: plate hue 204-209, shield hue 203-206 S 0.63-0.71 vs hue 218-228 S 0.83-0.96; unitFactory.ts COOL_ARMOUR_HUE_SHIFT 15 to 30, same shift plus S floor 0.95 in propBuilder.ts buildShield [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
3. [vfx] muzzle-smoke-flat-tone: shaded facets 163-189, see-through lobes vs opaque 77-116 shade under 216,209,199 lit; projectileSystem.ts smoke emissive (0.21,0.19,0.16) to (0.10,0.09,0.07) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
4. [vfx] blast-no-warm-foot: whole ball 228,225,210 S 0.08 vs 251,251,227 over a 246,194,148 foot; visualEffects.ts lobe i === 3 takes flameMat [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [camera] victory-giant-head-and-waist-cut: mammoth head fills the left 3/8, survivors cut at the waist, a spear bisects the frame; main.ts frameSurvivorsForResult, camera on the giant's side of the focus looking away from it [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [battle-feel] mammoth-no-trample: at 2s blues stand upright under the tusk vs bodies flung and underfoot; simulationSystem.ts, existing launch impulse on enemies overlapped by a moving colossal [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
7. [unit-look] red-skin-bright: mean 188-197,65-72,75-83 vs 171-172,65-73,85-90; unitFactory.ts warm skin, scale 0.9 and +0.03 blue after the flesh lerp [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- boulders-lit-violet-2 [attempts: 2] — diffuse (0.37,0.33,0.20): lit 96,93,107, too light; the 98,98,101 target was wrong, ref is 78,66,80 and ours is back at 75,68,92
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown
- victory-giant-wall [attempts: 1] — alpha 60 deg off the giant: wall grew to 45%; no alpha clears it at radius 3
- blue-army-slate [attempts: 1] — saturation x1.6 on body only: not visible
- mammoth-hide-plum [attempts: 1] — (0.80,0.52,0.34): pale khaki

## Notes for next iteration (max 5 lines)
- Spent (never retry): boulders lit colour, fireball lobe sizes/heights/balloon, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot, shade-brick. Never shrink enemy collision distance or lower ally contactBias below 0.55.
- ACES tone map: emissive 1.0 shows ~210, 2.0 ~233 (ceiling). The blue hemi adds ~+20 B over R to greys. Red skin: WARM_SKIN_BLUE 0.75, WARM_SKIN_FLESH_WEIGHT 1.0.
- Measure first: capture `--iter 9123` uncommitted, sample PNG and reference JPG regions with System.Drawing. A critic target can be wrong; a critic-named lever can be a no-op (cohesion was 1 for the mammoth: probe it).
- Mammoth: a colossal has resistance 1e6 against same-team contact (simulationSystem collision loop). Runner hold needs 3+ marching allies within 3. One gap, one change; recheck big_melee_result after any sim edit.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Source files are CRLF: edit by exact-string node script; commit with `git commit <file> -F -` heredoc.
