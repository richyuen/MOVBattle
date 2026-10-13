# Loop state
Iteration: 133   Last re-audit: 130   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- giant-barely-hit b9c1149 — APPROVE
- blast-body-cream 32e723f — APPROVE
- muzzle-smoke-belly 694ceb8 — APPROVE
- red-shade-flat 8034131 — APPROVE
- head-darker-than-limbs 6cca85d — APPROVE
- lit-field-dull 0cc457a — APPROVE
- victory-giant-backdrop ccef857 — APPROVE
- feet-cropped-2s 500931d — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: giant-barely-hit (b9c1149) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: blast-body-cream (32e723f) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: muzzle-smoke-belly (694ceb8) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-shade-flat (8034131) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: head-darker-than-limbs (6cca85d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lit-field-dull (0cc457a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: victory-giant-backdrop (ccef857) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: feet-cropped-2s (500931d) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] stomp-flings-to-edge: 23 of 30 blue die of 2 splash-secondary + 1 crowd-shock, bodies at x -20 to -28 with the front at -4; simulationSystem.ts `case "iconic_mammoth"` (~895) knockback.scale 2.15 to 1.0 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_result.png
2. [battle-feel] giant-rout: 0/30 vs 26/31 in 14 s, mammoth 84% hp, 19 melee hits; same branch splashRadius 4.4 to 3.0, damage 1.28 to 1.0 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [maps-light] battle-ground-dull: 202,144,91 vs 238,153,89; placement 215,157,103 vs 240,168,107; mapBuilder.ts grass.emissiveColor red up (~0.16, 0.04, 0.03) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [unit-look] red-tomato: blue equals green (203,77,77; shade 177,47,53) vs rose 207,70,113, shade 148,41,83; unitFactory.ts WARM_SKIN_BLUE_LIFT 0.18 to 0.30 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
5. [vfx] blast-foot-step: 212,203,176 to 216,164,99 at y 488-491, orange foot half the ball; visualEffects.ts flameMat emissive ~2.6, 2.3, 1.2 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [vfx] smoke-belly-ratio: 0.56-0.66 vs 0.45, four equal spheres; projectileSystem.ts shade 0.66/0.54/0.18 to 0.78/0.68/0.32, lobe scale 0.5-1.2 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [camera] victory-giant-headless: hide on left 22%, right 40% empty; cameraController.ts giantRadius cap 4.5 to 6 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
8. [unit-look] head-pulse-zeus: Zeus head 81,136,177 vs arms 112,157,193 (hat shadow); head clone misses the status pulse, runtimeUnit.ts 1402-1407 [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved; dropped at audit 130
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd; dropped at audit 130
- mammoth-no-trample [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235, 3.4 ~245. Saturated red tops out near 205: only lifting green and blue raised it. Grass emissive blue 0.036 kept the lit field orange; shadows must stay plum.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`, measure with a zlib PNG sampler, commit one gap at a time (two gaps in one file: checkout, re-apply each). Some files are CRLF. Poses differ run to run. Critic's named material can be wrong.
- Giant: men near it all target it (pull 2, x0.6) and the second rank reaches (+1); what stops hits now is topple/downed/recovering from its stomp, and one slam kills ~12 at once. Hits are `direct` + `splash-primary` in impactCountsByPath.
- Camera: followBattle sinks y 0.6 at 0.8/s. Victory shot differs run to run. hemi.intensity 0.45: no further fill cuts. Head has its own material (HEAD_GLOW 1.9).
