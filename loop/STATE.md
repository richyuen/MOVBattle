# Loop state
Iteration: 26   Last re-audit: 25   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- placement-no-island-edge 7c1cf55 — APPROVE
- tray-trees-read-through d346058 — REJECT (reverted 0c324d6)
- battle-cam-ranged-off-frame c376fb9 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: placement-no-island-edge (7c1cf55) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: tray-trees-read-through (d346058) VERDICT: REJECT SCORE: ui-flow 3/5 (previous: 3/5)
- GAP: battle-cam-ranged-off-frame (c376fb9) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [ui-flow] tray-trees-read-through (= tray-opaque-slab): want translucent warm tint, top-pointed outline tabs above the tray border [attempts: 1] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
2. [maps-light] grass-spikes-and-bloom-clouds: knee-high dark spike cards, glowing cloud blobs [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
3. [camera] standoff-wide-symmetric: ranged fight framed wide, 39% empty foreground, units 0.1 tall; want near formation large, far side as background [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
4. [maps-light] island-rect-no-cliff: rectangle, hairline rim, near rim off-frame; want organic outline, cliff face, sky on 3 sides [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
5. [ui-flow] budget-plain-pill: want stacked cost/unit-count block with icons flaring into the tray's left end [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
6. [unit-look] cube-hands-stick-limbs: box mannequins, stick limbs, no clothing layers [attempts: 1] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
7. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET buttons over corpses; want one "PRESS [TAB] TO CONTINUE" line over survivors [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
8. [vfx] blast-dome (= balloon-explosion): big flat yellow/orange balls, white dome; want small faceted puffs, debris, smoke [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint, tabs point UP
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds uniform white with halo; tufts still 4-sided cones
- mammoth-no-launch [attempts: 1] — no body airborne in any still
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast
- cube-hands-stick-limbs [attempts: 1] — mitt shows big face side-on; LIMB_THIN compounded to 0.64

## Notes for next iteration (max 5 lines)
- Pickable: 3, 4, 5, 7. Gaps 1, 2, 6, 8 are in Rejected attempts.
- Gap 3 NEXT EDIT (computeBattleFocus + swoopToBattle): on standoff move target 60% toward the ranged formation, cap radius ~9.
- Gap 4 NEXT EDIT (_createGround): ground + islandUnder tessellation 4 -> 8+ so the rim follows the tree ring; nav zones still MAP_WIDTH 160 vs slab 108.
- Critic: units are specks at placement radius 100; do not pull back further.
