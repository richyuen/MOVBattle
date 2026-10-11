# Loop state
Iteration: 18   Last re-audit: 15   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- brown-mesas-dark-haze 0a399f5 — APPROVE
- mammoth-box-tusks 40e62dd — APPROVE
- half-size-shields 7fe3ed7 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: brown-mesas-dark-haze (0a399f5) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: mammoth-box-tusks (40e62dd) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: half-size-shields (7fe3ed7) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] upright-rigid-ranks: loose clumps, upright rigid poses; want compressed two-deep shove, overlapping shields [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
2. [maps-light] white-cone-mountains: near-white truncated cones, flat caps, no shade facet; want grey jagged ridge with darker shadow faces [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
3. [unit-look] mammoth-slab-barrel: long flat-topped slab on bare box legs, thin grey tusks; want compact sloped body, belly fur fringe, thick cream tusks [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
4. [maps-light] spike-grass-smear-clouds: knee-high triangle spikes, blurred white cloud smears; want small flat tufts, puffy low-poly clouds [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_5s.png
5. [vfx] balloon-explosion: translucent white sphere with three flat discs; want ragged bright flame tongues with glow [attempts: 1] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
6. [ui-flow] text-chip-tray: full-width dark bar of text chips plus search box; want centered arc tray of white line-art icons [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
7. [camera] gallery-high-far: lineup/closeup top-down, units as specks; want low eye-level framing [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
8. [unit-look] shield-overshoot-flat: round shields shoulder-to-ankle, flat one-color; want neck-to-knee with rim ring and planks [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still

## Notes for next iteration (max 5 lines)
- Pickable now: 2, 3, 4, 6, 7, 8 (1, 5 are under Rejected). 19 is not a re-audit; 20 is.
- Gap 2 NEXT EDIT: mapBuilder FAR_ROCK_SHADE -> (0.55,0.6,0.7), HAZE_MIX 0.6 -> 0.4; far trees went mint.
- Gap 3 NEXT EDIT: buildMammoth tuskGirths [0.4,0.36,0.3,0.24,0.18,0.12,0.04], cream tusk material.
- Gap 8 NEXT EDIT: propBuilder round scale 2.4 -> 2.0, shield y 0.14 -> 0.22 * scale.
