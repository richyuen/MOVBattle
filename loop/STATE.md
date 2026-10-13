# Loop state
Iteration: 142   Last re-audit: 140   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- red-skin-lit-side-dull 5283783 — APPROVE
- result-shot-tusk-and-offcentre 4243323 — REJECT (reverted)
- bucket-helm-wider-than-shoulders 7f36199 — APPROVE
- lineup-blue-bodies-one-tone be556b1 — APPROVE
- budget-count-not-shown 1ced296 — APPROVE
- muzzle-puff-too-white 676990a — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-skin-lit-side-dull (5283783) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: result-shot-tusk-and-offcentre (4243323) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)
- GAP: bucket-helm-wider-than-shoulders (7f36199) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lineup-blue-bodies-one-tone (be556b1) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: budget-count-not-shown (1ced296) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: muzzle-puff-too-white (676990a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-burst-glow-ball: flat white glowing ball over an orange dome [attempts: 2, spent: skip] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [camera] result-shot-tusk-and-offcentre: tusk x~160-570, leg x 0-150; critic: long lens again with GIANT_SHY 0.8 [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [camera] result-shot-sky-thin: sky ~15% of the band, foreground spear shafts cross the survivors (beta and aim floor are spent) [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [unit-look] spears-too-thick: spearheads as big as a torso, shafts far thicker than TABS sticks; propBuilder.ts spear case [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [unit-look] cone-hats-shrunk: keep HAT_OVERSIZE 1.3 for helm types only, cone/brim hats back to 1.6; propBuilder.ts attachProps [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: lineup_medieval.png
6. [unit-look] tunics-same-teal-and-dark: archer hue 203 vs healer 198, all value 0.31-0.44; unitFactory.ts CLOTH_ACCENT_WEIGHT 0.2 to 0.35 [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [ui-flow] empty-hud-zero-budget: empty field shows 0 over 0, TABS shows the budget figure [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [vfx] muzzle-puff-dull-and-few-lobes: tops ~210 vs ~240, 4-5 big spheres vs many small chunks; projectileSystem.ts base to ~(2.1,1.8,1.2) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- result-shot-tusk-and-offcentre [attempts: 1] — fov 0.5 at effective radius 3.6, shy 0.5: men centred (0.48) and fill the band, but tusk still x~160-570, sky 15%
- impact-burst-glow-ball [attempts: 2] — emissives ~0.6 and lit faceted foot: a putty ball on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: lit side fell; the lit side is what is short
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft on screen, 1 px hairline
- clubs-shoulder-low [attempts: 1] — shoulder -1.45, jitter 0.5: walk swing still drops the arm
- field-tan [attempts: 1] — diffuse red 1.19: on screen still 217, ACES flattens it
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards

## Notes for next iteration (max 5 lines)
- Spent (never retry, even when a re-audit lists them): impact burst colour/glow, mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge and its snow, corpses-flat, zeus skirt, idle legs, melee-no-downed-bodies. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65 (main.ts). Red skin: GREEN_LIFT 0.14 (lit now 214,107,115; critic: BLUE_LIFT 0.06 to 0.04 next, red still 17 short), GLOW 0.25.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min); commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: probe it. Edit multi-line with a node script; bash single quotes break on apostrophes.
- Victory beside a giant: the mammoth stands 1-2 from the men, so a side-on frame cannot both centre them and lose it. A lens (fov on CameraViewState, lerped, reset in restoreViewState; also reset it in returnToPlacementView) lets the shot be tight without the eye in the crowd. Alpha, beta, aim floor spent.
- Shoulder rotation.x negative raises the arm. Streak is a mesh child "streak". Harness spawns now spend budget in sandbox; hand placement always did.
