# Loop state
Iteration: 28   Last re-audit: 25   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- cube-hands-stick-limbs f890ab9 — REJECT (reverted 67ff14f)
- standoff-enemy-cropped 83033e3 — APPROVE
- budget-icon-wrap a804b0c — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cube-hands-stick-limbs (f890ab9) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: standoff-enemy-cropped (83033e3) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: budget-icon-wrap (a804b0c) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] blast-dome (= balloon-explosion): orange balloon spheres and brown cubes hide the target; want white smoke puff, dark ball, dust burst [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
2. [unit-look] cube-hands-stick-limbs: paddle hands, untapered stick limbs, slab torsos [attempts: 2] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
3. [maps-light] grass-spikes-and-bloom-clouds: cone-spike grass, glowing blob clouds; want flat card tufts, faceted clouds [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
4. [maps-light] island-rim-off-frame (= island-rect-no-cliff): field runs off frame, no island edge or drop [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
5. [camera] standoff-enemy-unreadable: enemy a speck behind blasts, cannons ~35 deg off-axis [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [battle-feel] rigid-upright-ranks: mid-melee units bolt upright, arms at sides; want leaning, windmilling [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
7. [ui-flow] tray-trees-read-through: canopies show through tray and budget block [attempts: 1] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET; want one "PRESS [TAB] TO CONTINUE" line; budget icons small, untinted [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle; front view, limbs, torso unchanged
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds uniform white with halo; tufts still 4-sided cones
- mammoth-no-launch [attempts: 1] — no body airborne in any still

## Notes for next iteration (max 5 lines)
- Pickable: 1, 5, 6, 8. Iteration 30 is a re-audit.
- Gap 5 NEXT EDIT (swoopToBattle standoff): target lerp toward `near` 0.6 -> ~0.3, that only.
- Gap 1: last try failed on near-black smoke spheres owning 80% of the blast.
- Gap 8 extra: budget ::after icons ~18px, salmon #e9a39a.
- Gap 2 if reopened: mitt() as flat-shaded 1-subdiv IcoSphere ~0.6 x 0.85 x 0.55.
