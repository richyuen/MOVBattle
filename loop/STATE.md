# Loop state
Iteration: 131   Last re-audit: 130   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- giant-untouched-wipe ceae14a — REJECT (reverted aa66f4e)
- battle-camera-left-behind c8a52f1 — APPROVE
- victory-shot-blocked 4c5068b — REJECT (reverted 0913d94)
- muzzle-smoke-equator ece9e1c — APPROVE
- blast-pastel f723838 — APPROVE
- red-lit-faces-short 6bfdc5a — REJECT (reverted b4b50d5)
- shadow-hue-orange a206337 — APPROVE
- eyes-navy 9cd8d4e — REJECT (reverted 5361443)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: giant-untouched-wipe (ceae14a) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-camera-left-behind (c8a52f1) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: victory-shot-blocked (4c5068b) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: muzzle-smoke-equator (ece9e1c) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: blast-pastel (f723838) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-lit-faces-short (6bfdc5a) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shadow-hue-orange (a206337) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: eyes-navy (9cd8d4e) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] melee-misses-giant: mammoth takes 0 melee-path impacts in 18 s, ends 96% hp, 0/30 vs 16/31; simulationSystem.ts engageDistance (line 442) add the target's collisionRadius [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [unit-look] eyes-navy: 0,46,84 on blue, 95,36,49 on red vs black; critic says pupilMat, but pupils are setEnabled(false): see Notes [attempts: 1] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
3. [camera] victory-shot-blocked: tusk 17-24% of width at centre, limb 10-11% left; cameraController.ts victory branch, eye to the far side of the focus (alpha + PI) when giantOff - 4.5 < 3 [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [unit-look] red-lit-faces-short: 205,109,118 vs 246,124,121; unitFactory.ts WARM_SKIN_RED 0.92 to 1.0, WARM_SKIN_GREEN_LIFT 0.14 to 0.20 [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [vfx] blast-body-cream: body 232,228,211 vs ~255,245,170, hard line at y~490; visualEffects.ts flameMat.emissiveColor blue 0.6 to 0.3 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [camera] contact-line-low: contact at y 700-900 of 960, feet cropped; cameraController.ts followBattle ease aim.target.y down ~0.6 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
7. [maps-light] shadow-not-plum: 119,48,46 V 0.47 vs 99,41,56 V 0.39; mapBuilder.ts grass.emissiveColor to ~0.06,0.012,0.045 [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [vfx] muzzle-smoke-belly: top 213 vs underside 121,110,93; projectileSystem.ts smoke material emissive up so the underside holds ~180 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- eyes-navy [attempts: 1] — eyeMat unlit 0.02: 0,51,88 to 0,46,84 only, lighting is not the cause
- red-lit-faces-short [attempts: 1] — GLOW 0.95, BLUE 0.65: red still 205, glow does not lift the ceiling
- victory-shot-blocked [attempts: 1] — giantOff - 4.5: radius floors at 3 either way, tusk unchanged
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost; superseded by melee-misses-giant
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved; dropped at audit 130
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd; dropped at audit 130
- mammoth-no-trample [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235. Emissive lifts lit and shade alike. Grass emissive blue 0.05 turned the whole lit field salmon; 0.025 kept it orange.
- Probe all gaps uncommitted with `capture.mjs --iter 9123 --showcase-only`, tune, `git checkout -- web/src`, then commit one gap at a time. Source files are CRLF: patch scripts must convert. A PNG pixel sampler is worth rewriting (zlib inflate) to measure before the critic does.
- Eyes: the tint is the head skin's emissive (R 0, G/B up on blue) added over the bead by the GlowLayer blur (main.ts:282) or bloom; try the eye in the glow layer as an occluder plus a bigger bead, or measure with glow off first.
- Camera: followBattle slides target x/z only (slack 0.6, 2.5/s); focus drifts ~3 by 9 s. The probe victory shot differs run to run. hemi.intensity is 0.45: no further fill cuts.
