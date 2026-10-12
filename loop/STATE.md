# Loop state
Iteration: 33   Last re-audit: 30   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- impact-lobe-bank c35d186 — APPROVE
- plank-lean-bodies f6cc64c — APPROVE
- victory-shot-no-survivor 60b48b6 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: impact-lobe-bank (c35d186) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: plank-lean-bodies (f6cc64c) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: victory-shot-no-survivor (60b48b6) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] muzzle-smoke-bank: cannon muzzle smoke a unit-tall white bank hiding the crew; cap lobe diameter only [attempts: 2] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
2. [battle-feel] plank-topple-march: toppling/limp bodies still planks; marchers upright, chins up, want pitched with heads hanging [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_9s.png
3. [maps-light] lime-field-flat-sky: saturated lime field, spiky grass cards, no warm grade or vignette, flat teal sky [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [camera] victory-shot-wide-snap: victory shot too wide, snaps in 0.25s; human winners a tenth of frame height [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
5. [vfx] impact-cold-white: impact puff cold white, no warm core, merges into a two-body clump [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_3800ms.png
6. [unit-look] blue-black-bodies: blue knights and spearmen have charcoal bodies that read as a third team [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [vfx] hit-flash-orb: glowing white hit-flash orb at first contact [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
8. [battle-feel] one-rank-lines: front lines one rank deep with open grass; no two-deep pile or shield overlap [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle; shrinking the muzzle puff left cannons bare
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG
- tray-trees-read-through [attempts: 1] — 88% black slab; want light tint

## Notes for next iteration (max 5 lines)
- Pickable: 2-8. Not pickable: 1 (two attempts).
- Gap 2: waist-break block: torso counter 1.4 -> 0.8, drop the (1 - limp) scale; walk neck.x back to -0.1.
- Gap 4: frameSurvivors: cap height term ~2x human, duration ~2s, lower eye; restore lowerRadiusLimit in returnToPlacementView.
- Gap 5: spawnExplosionBurst: smokeMat warm grey-tan, lobes 5 -> 3.
