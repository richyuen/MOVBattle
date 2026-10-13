# Loop state
Iteration: 128   Last re-audit: 125   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- reds-queue-behind-mammoth c9a38ac — APPROVE
- blue-plate-shield-cyan 93be894 — APPROVE
- muzzle-smoke-flat-tone e8a9bb4 — REJECT (reverted 44752c8)
- blast-no-warm-foot ae05538 — REJECT (reverted 5555e1d)
- victory-giant-head-and-waist-cut 920d97d — APPROVE
- mammoth-no-trample 25ab9a2 — rejected before the critic, regression (reverted d613066)
- red-skin-bright 04a4df1 — REJECT (reverted ab1c3ac)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: reds-queue-behind-mammoth (c9a38ac) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: blue-plate-shield-cyan (93be894) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-flat-tone (e8a9bb4) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: blast-no-warm-foot (ae05538) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: victory-giant-head-and-waist-cut (920d97d) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: red-skin-bright (04a4df1) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] blast-no-warm-foot: ball 229,225,209 to the ground vs pale core on a 242,192,140 dome; visualEffects.ts lobe 3 flameMat AND lobeHeights[3] -0.15 to -0.4, reach 0.35 so it clears the core [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [vfx] muzzle-smoke-flat-tone: lit/shade ratio 1.5, lit 173-193 cool grey, see-through vs 2.3, warm white, opaque; projectileSystem.ts base (0.98,0.94,0.87), emissive 0.10, alpha 1 until the final fade [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
3. [unit-look] red-skin-bright: 184,54,70 S 0.71 vs 174,71,84 S 0.60; unitFactory.ts warm skin, shade 0.9 on red only, blue lift 0.07 [attempts: 1] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_result.png
4. [battle-feel] mammoth-no-trample: enemies it walks into stay upright under the tusks vs flung and underfoot; must keep battlefeel_spillover_chain green [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [unit-look] blue-tabard-cyan: tabards hue 202-206 vs 217; unitFactory.ts tabardColor, teamHsv.r + COOL_ARMOUR_HUE_SHIFT; boards V 0.71-0.79 vs 0.46-0.59 [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
6. [battle-feel] reds-trail-mammoth: half the reds at the hind legs, none ahead vs infantry under the tusks; simulationSystem.ts sideways(), add 0.3 of heading to the side push [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
7. [camera] victory-crowded: 8 reds edge to edge, two spears across vs one or two survivors and open field; cameraController.ts giant branch radius cap 4.5 to 6 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
8. [battle-feel] crowd-thin: ~12 a side, bare ground between at 2s vs 20-60 a side, shields overlapping [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- red-skin-bright [attempts: 1] — whole colour x0.9, +0.03 blue: green fell to 53-61, S rose to 0.70
- blast-no-warm-foot [attempts: 1] — lobe 3 flameMat alone: buried inside the core, not visible
- muzzle-smoke-flat-tone [attempts: 1] — emissive halved: whole puff dimmer, ratio unchanged
- mammoth-no-trample [attempts: 1] — applyBlastLaunch(away, 2-4, 7) on steady enemies overlapping a moving colossus: spillover_chain squire shift 0.41 < 0.55, same at either speed
- boulders-lit-violet-2 [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown
- victory-giant-wall [attempts: 1] — alpha 60 deg off the giant: wall grew to 45%
- blue-army-slate [attempts: 1] — saturation x1.6 on body only: not visible

## Notes for next iteration (max 5 lines)
- Spent (never retry): boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot, shade-brick. Never shrink enemy collision distance or lower ally contactBias below 0.55.
- ACES tone map: emissive 1.0 shows ~210, 2.0 ~233 (ceiling). Emissive is additive: it shifts lit and shade alike, contrast comes from the base colour. Blue hemi adds ~+20 B over R to greys.
- Probe uncommitted with `capture.mjs --iter 9123 [--regression-only]`; sample PNG and reference regions. A critic target or lever can be wrong: check it.
- Mammoth: colossal has resistance 1e6 against same-team contact and parts allies sideways while moving over 0.2. One gap, one change; recheck big_melee_result after any sim edit.
- Source files are CRLF: edit by exact-string node script; commit with `git commit <file> -F -` heredoc. runtimeUnit owns root.rotation.x/z.
