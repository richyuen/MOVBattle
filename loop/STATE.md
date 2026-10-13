# Loop state
Iteration: 139   Last re-audit: 135   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-bubblegum-pink b7b3593 — APPROVE
- shell-burst-cream-ball 6771ef2 — REJECT (reverted)
- field-tan 3fbfea0 — REJECT (reverted)
- clubs-shoulder-low 45ee138 — REJECT (reverted)
- streak-too-long c5959ba — REJECT (reverted)
- levels-rounded-pill 76285f5 — APPROVE
- victory-crossed-by-shafts 91d8875 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-bubblegum-pink (b7b3593) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shell-burst-cream-ball (6771ef2) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: field-tan (3fbfea0) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: clubs-shoulder-low (45ee138) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: streak-too-long (c5959ba) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: levels-rounded-pill (76285f5) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: victory-crossed-by-shafts (91d8875) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-launches-nobody: nobody airborne at 2, 5 or 9 s vs 3-6 flung [attempts: 2, spent: skip] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
2. [vfx] shell-burst-mustard (was shell-burst-cream-ball): TABS heart IS cream-white with an orange rim, one ball graded to orange at the ground; ours taller than the cannon; visualEffects.ts keep coreMat cream, flashMat orange rim, fireScale 2.0/3.6 to 1.35/2.4 [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
3. [maps-light] field-tan: field red 217 vs 239; mapBuilder.ts grass.emissiveColor red 0.09 to ~0.18, not diffuse [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
4. [battle-feel] clubs-level-and-dragging: one club level at 9 s, one at knee height at 2 s vs all upright; proceduralAnimation.ts heavy_carry inherited swing rightShoulder.rotation.x * 0.7 to * 0.25 [attempts: 1] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_9s.png
5. [camera] victory-crossed-by-shafts: held spears and tusk cross the men, corner unit cropped; cameraController.ts keep beta PI/2.1, radius +25% beside a giant, or fix the result pose [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [unit-look] red-skin-blue-high: lit 203,86,111 vs 210,83,93; unitFactory.ts WARM_SKIN_BLUE_LIFT 0.12 to ~0.06, leave the glow [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
7. [vfx] streak-hairline: 1 px line 1.3x the shaft, arrow streak 1.6x its shaft vs short splash; projectileSystem.ts _addStreak lengths 0.3 spear, 0.25 arrow, diameterTop 0.02 to 0.05 [attempts: 1] — ref: trailer_3_sheet_01 r3c3 — ours: closeup_state_reads.png
8. [ui-flow] levels-open-bracket: Levels has no dark fill, slant edge unoutlined on Levels and Clear; index.html .btn-corner Clear's fill, slant drawn as a ::before stroke not clip-path [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft on screen, 1 px hairline
- clubs-shoulder-low [attempts: 1] — shoulder -1.45, jitter 0.5: walk swing still drops the arm
- field-tan [attempts: 1] — diffuse red 1.19: on screen still 217, ACES flattens it
- shell-burst-cream-ball [attempts: 1] — yellow-orange heart: premise backwards, read as mustard ball on a peach dome
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards
- slam-no-airtime [attempts: 2] — spent
- head-darker-than-arms [attempts: 1] — skin pulse 0.25 to 0.1: charged arms still 36-85 over the head

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Grass diffuse 1.08, 0.56, 0.19, emissive 0.09, 0.04, 0.06. hemi.intensity 0.45: no further fill cuts. Red skin: WARM_SKIN_GLOW 0.25, WARM_SKIN_GLOW_BLUE 0.03.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: check it is live and probe it. sed by line number: re-grep the line first.
- Shoulder rotation.x negative raises the arm; heavy_carry elbow is 0.4 +-0.2. `.btn:hover` resets background. Streak is a mesh child "streak" (factory "wood" mat, alpha 0.5). Corner tabs: #btnCampaign/#btnUnlimited square, clip-path slant on the inner end.
- Victory with a giant: eye a quarter turn off it, beta PI/2.1, target y 1, target box.group (set in main.ts); aim floor and beta are spent levers.
