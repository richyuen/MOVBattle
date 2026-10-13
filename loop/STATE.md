# Loop state
Iteration: 141   Last re-audit: 140   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- budget-seven-digits 2debd66 — APPROVE
- result-shot-giant-in-frame 91961cd — APPROVE
- red-skin-no-shade 015ae4b — REJECT (reverted)
- muzzle-puff-flat-facets 9171ee2 — APPROVE
- impact-burst-glow-ball 9ca2728 — REJECT (reverted)
- lineup-props-undersized ddeb48b — APPROVE
- result-prompt-wording 6618cd5 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: budget-seven-digits (2debd66) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: result-shot-giant-in-frame (91961cd) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: red-skin-no-shade (015ae4b) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-puff-flat-facets (9171ee2) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: impact-burst-glow-ball (9ca2728) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: lineup-props-undersized (ddeb48b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: result-prompt-wording (6618cd5) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-burst-glow-ball: cream balls bloom over a smooth orange dome; same gap as putty-ball [attempts: 2, spent: skip] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [unit-look] red-skin-lit-side-dull: lit (208,93,103) vs (223-237,107-116,100-107), shade already matches; unitFactory.ts WARM_SKIN_GREEN_LIFT 0.10 to ~0.14 and a small WARM_SKIN_RED lift, leave WARM_SKIN_GLOW [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [battle-feel] melee-no-downed-bodies: one body down at 9 s vs 6+ in the foreground [attempts: 2, spent: skip] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [camera] result-shot-tusk-and-offcentre: hide x 0-246 (17%), tusk to x~530, survivor centroid 0.38, right 48% empty; cameraController.ts frameSurvivors [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
5. [unit-look] bucket-helm-wider-than-shoulders: helm ~170 px on ~150 px shoulders; propBuilder.ts split PROP_OVERSIZE into weapon 1.6 and hat ~1.3 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
6. [unit-look] lineup-blue-bodies-one-tone: non-knight bodies one grey-blue, shafts a few px wide; unitFactory.ts colour blend, propBuilder.ts shaft radius [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [ui-flow] budget-count-not-shown: 30 units placed, counter 0; main.ts spawnHarnessUnit call trySpend [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png
8. [vfx] muzzle-puff-too-white: luminance floor 126 vs 80, white vs grey; projectileSystem.ts smoke base (2.6,2.15,1.3) to ~(1.9,1.6,1.05) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- impact-burst-glow-ball [attempts: 2] — emissives ~0.6 and lit faceted foot: halo gone but a putty ball (180,179,167) on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: ratio moved 0.03, lit side fell 215 to 208; the lit side is what is short
- budget-seven-digits [attempts: 1] — budget 50000: expensive units unplaceable; fixed in 141 by the display
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft on screen, 1 px hairline
- clubs-shoulder-low [attempts: 1] — shoulder -1.45, jitter 0.5: walk swing still drops the arm
- field-tan [attempts: 1] — diffuse red 1.19: on screen still 217, ACES flattens it
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards

## Notes for next iteration (max 5 lines)
- Spent (never retry, even when a re-audit lists them): impact burst colour/glow, mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge and its snow, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65 (main.ts). Red skin: WARM_SKIN_GLOW 0.25, GLOW_BLUE 0.03, BLUE_LIFT 0.06. Muzzle smoke emissive 0.11.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min); commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: probe it. main.ts is CRLF: multi-line string replaces miss, use a regex with \r?\n.
- Victory beside a near giant (probed 141): farSide 0.3 PI put the eye under its flank, 0.7 PI put it behind the men filling 45%; side-on 0.5 PI with GIANT_SHY 1.0 is in; 1.5 emptied the giant but left the men in the near third. Radius 4.5-6, target y 0.8, beta PI/2.1; aim floor and beta are spent.
- Shoulder rotation.x negative raises the arm. `.btn:hover` resets background. Streak is a mesh child "streak". Campaign result labels still read "Next Scenario"/"Retry" after "Press [Tab] to".
