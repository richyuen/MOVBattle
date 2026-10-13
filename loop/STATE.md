# Loop state
Iteration: 130   Last re-audit: 130   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- battle-horizon-high 6714ae4 — APPROVE
- showcase-rout b07e0a5 — APPROVE
- battle-camera-left-behind bb6a95a — REJECT (reverted 2729cb3)
- muzzle-smoke-equator e8e3795 — REJECT (reverted 357433f)
- red-lit-faces-dim 142764b — APPROVE
- blast-foot-one-sided 80f93ff — APPROVE
- eyes-small-tinted 86698d2 — APPROVE
- shadows-pale-warm 454cbf7 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: battle-horizon-high (6714ae4) VERDICT: APPROVE SCORE: camera 4/5 (previous: 3/5)
- GAP: showcase-rout (b07e0a5) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-camera-left-behind (bb6a95a) VERDICT: REJECT SCORE: camera 4/5 (previous: 3/5)
- GAP: muzzle-smoke-equator (e8e3795) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-lit-faces-dim (142764b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-foot-one-sided (80f93ff) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: eyes-small-tinted (86698d2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shadows-pale-warm (454cbf7) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] giant-untouched-wipe: mammoth 8680/9016 hp, 0/30 blues vs 16/31 reds at 18.1 s; unitDefinitions.ts giant_melee healthScale 2.5 to 1.8 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [camera] battle-camera-left-behind: camera identical 5 s to 9 s, contact line in the bottom-left corner; main.ts tick re-aim, trigger distance 2, beta in the player-moved test [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [camera] victory-shot-blocked: a tusk fills 25% of width at centre, a mammoth leg the left 11%; cameraController.ts frameSurvivors giantOff - 2.5 to giantOff - 4.5 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [vfx] muzzle-smoke-equator: top 208 vs belly 122, one-row step; projectileSystem.ts tone 0.8 + 0.2*clamp(ny*0.7 + nx*0.3 + 0.6) [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
5. [vfx] blast-pastel: cream 233,229,212 over peach 243,199,148 vs orange to the ground; visualEffects.ts footMat.emissiveColor (2.0,0.65,0.25) to (1.6,0.45,0.1) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [unit-look] red-lit-faces-short: 208,120,133 vs 246,124,121, pink cast; unitFactory.ts WARM_SKIN_GLOW 0.75 to 0.95, WARM_SKIN_BLUE 0.75 to 0.65 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [maps-light] shadow-hue-orange: 160,65,35 V 0.63 vs 99,41,56 V 0.39; mapBuilder.ts grass.emissiveColor (0.16,0.035,0) to (0.06,0.02,0.05) [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [unit-look] eyes-navy: eyes on blue 0,51,88 vs black; bodyBuilder.ts eyeMat unlit Color3(0.02,0.02,0.02) [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-equator [attempts: 1] — tone floor 0.6 with nx 0.3: three tones, belly still on one value at the floor
- battle-camera-left-behind [attempts: 1] — re-aim at focus drift over 4, 2 s apart: never fired by 9 s; moved test lacked beta
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved; dropped at audit 130
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd; dropped at audit 130
- reds-trail-mammoth [attempts: 1] — 0.3 heading in sideways(): zero once the mammoth stalls; dropped at audit 130
- mammoth-no-trample [attempts: 2] — spent
- boulders-lit-violet-2 [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235. Emissive lifts lit and shade alike. Camera-facing facets are sky-lit (B over R); contrast needs vertex tints or base colour.
- Probe all gaps uncommitted with `capture.mjs --iter 9123 --showcase-only`, tune, `git checkout -- web/src`, then apply and commit one gap at a time (exact-string node patch script; `git commit <file> -F -` heredoc).
- Camera: melee pitchUp is 0.12 (horizon 68%); near rank cut at the knee, untried lever eye 1.6 to 1.3. Re-aim must show a moved camera between the 5 s and 9 s stills: log the focus drift in the probe first.
- Mammoth cooldownMultiplier is 1.6 (battle 18 s). hemi.intensity is 0.45 and dims lit ground too: no further fill cuts.
