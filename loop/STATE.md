# Loop state
Iteration: 140   Last re-audit: 140   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- result-shot-inside-crowd f78b0eb — APPROVE
- red-team-bubblegum b21a93c — APPROVE
- muzzle-puff-grey-stack 1941d46 — APPROVE
- budget-seven-digits fb76532 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: result-shot-inside-crowd (f78b0eb) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: red-team-bubblegum (b21a93c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-puff-grey-stack (1941d46) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: budget-seven-digits (fb76532) VERDICT: REJECT SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [ui-flow] budget-seven-digits: counter reads 1000000 vs 3-4 digits; keep BATTLE_CONFIG, in main.ts updateBudgetDisplay show spent in sandbox (budget - getRemaining), starts at 0 [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
2. [camera] result-shot-giant-in-frame: mammoth leg and tusk fill the left 30% of the victory window; cameraController.ts frameSurvivors farSide 0.5 PI to ~0.7 PI; fix its stale doc comment (3 off, aims 1) [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [unit-look] red-skin-no-shade: shaded red 0.92 of lit (164 vs 179) vs 0.73 in TABS; unitFactory.ts WARM_SKIN_GLOW 0.25 to ~0.18, leave BLUE_LIFT [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [vfx] muzzle-puff-flat-facets: puff luminance 169-220 vs 80-215; projectileSystem.ts spawnMuzzleFlash sm.emissiveColor to ~(0.11,0.11,0.10), fix the comment above it [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
5. [battle-feel] melee-no-downed-bodies: nobody down or airborne at 9 s vs a third of reds on the ground; same as mammoth-launches-nobody [attempts: 2, spent: skip] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [vfx] impact-burst-glow-ball: cream impact balls (242,240,223) bloom into a halo over a smooth orange dome vs matte facets; visualEffects.ts drop the burst emissive under the bloom threshold, flat-shade the dust dome (was shell-burst-mustard) [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
7. [unit-look] lineup-props-undersized: thin swords and staffs vanish at 90 px, every blue body one grey-blue; propBuilder.ts scale weapon and hat props ~1.3x [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
8. [ui-flow] result-prompt-wording: "PRESS [SPACE] TO PLAY AGAIN" vs "PRESS [TAB] TO CONTINUE"; index.html #btnResultPrimary::before (~l.449), keep to one line [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- budget-seven-digits [attempts: 1] — budget 50000: dark_peasant, super_peasant (500000), super_boxer (100000) unplaceable; change the display, not the economy
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft on screen, 1 px hairline
- clubs-shoulder-low [attempts: 1] — shoulder -1.45, jitter 0.5: walk swing still drops the arm
- field-tan [attempts: 1] — diffuse red 1.19: on screen still 217, ACES flattens it
- shell-burst-cream-ball [attempts: 1] — yellow-orange heart: premise backwards, read as mustard ball on a peach dome
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards
- slam-no-airtime [attempts: 2] — spent

## Notes for next iteration (max 5 lines)
- Spent (never retry, even when a re-audit lists them, as 140's did for hide, grass, snow caps): mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge and its snow, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. hemi.intensity 0.45: no further fill cuts. Red skin: WARM_SKIN_GLOW 0.25, GLOW_BLUE 0.03, BLUE_LIFT 0.06. Muzzle smoke emissive 0.22 reads white but flat.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: check it is live and probe it. Harness spawnUnit skips the budget; scenarios do not cover sandbox placement.
- Shoulder rotation.x negative raises the arm. `.btn:hover` resets background. Streak is a mesh child "streak". Open from 139, dropped by the audit: field-tan (grass emissive red), clubs heavy_carry swing * 0.25, streak lengths 0.3/0.25.
- Victory with a giant: radius 4.5-6, target y 0.8, beta PI/2.1, target box.group; aim floor and beta are spent levers.
