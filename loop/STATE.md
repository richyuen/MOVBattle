# Loop state
Iteration: 24   Last re-audit: 20   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- mountain-cones-oversized 36af5fd — APPROVE
- lineup-top-down 904be61 — APPROVE
- tray-too-wide-boxed 95b495e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mountain-cones-oversized (36af5fd) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: lineup-top-down (904be61) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: tray-too-wide-boxed (95b495e) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] blast-dome (= balloon-explosion): opaque yellow/orange balls ~2x unit height hide the hit [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
2. [maps-light] grass-spikes-and-bloom-clouds: large pale spike cones, glowing blob clouds; want short flat tufts, flat-shaded puffs [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
3. [battle-feel] upright-ranks-at-contact (= upright-rigid-ranks): bolt upright neat ranks; want leaning, lunging, overlapping [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
4. [ui-flow] tray-no-fill-no-tab-tiles: no backing so icons vanish over trees, bare tab glyphs; want ~30% dark fill, outlined shield tab tiles [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
5. [unit-look] hero-pair-rigid: stiff box mannequins, arms down, no pose or costume mass [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_pair_zeus_thor.png
6. [camera] lineup-units-still-small: eye level now but units ~10% of frame, widely spaced; want ~45%, shoulder to shoulder [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [camera] state-reads-still-mid-distance: subjects ~100px mid-field, empty foreground [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_state_reads.png
8. [maps-light] ridge-still-pointed: separate blue-grey snow-capped points, still band the placement view top; want one pale level ridge [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png, hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted

## Notes for next iteration (max 5 lines)
- Gaps 1 and 3 are in Rejected attempts: not pickable. N=25 is a re-audit.
- Gap 4 NEXT EDIT (index.html): #unitPanel background rgba(0,0,0,0.3); .faction-tab 1px white border, pointed top, faint fill.
- Gap 6 NEXT EDIT (makeFactionGalleryScenario): radius 15 -> ~8 (19 -> ~11), target y ~1.0, halve spacingZ.
- Gap 8 NEXT EDIT (_createMountain): shoulders ~0.9 of main, footprint ~1.0; FAR_ROCK_MIX -> 0.7.
- Gap 5: pair gallery is same-team placement, so a swing needs an idle pose or an enemy.
