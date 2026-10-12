# Loop state
Iteration: 27   Last re-audit: 25   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- standoff-wide-symmetric 0d37722 — APPROVE
- island-rect-no-cliff 4f3c844 — REJECT (reverted 658d1f4)
- budget-plain-pill 511073c — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: standoff-wide-symmetric (0d37722) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: island-rect-no-cliff (4f3c844) VERDICT: REJECT SCORE: maps-light 2/5 (previous: 2/5)
- GAP: budget-plain-pill (511073c) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] island-rim-off-frame (= island-rect-no-cliff): near/side rims and cliff outside the placement frame, mountains instead of sky [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
2. [maps-light] grass-spikes-and-bloom-clouds: tall sparse cone spikes, blurred glowing clouds; want dense low tufts, flat low-poly clouds [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
3. [vfx] blast-dome (= balloon-explosion): orange/white domes cover 40% of frame; want small puffs and debris [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
4. [unit-look] cube-hands-stick-limbs: cube hands, thin uniform limbs, slab torsos; want tapered limbs, mitten hands [attempts: 1] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
5. [camera] standoff-enemy-cropped: far formation pinned to right edge, barrels side-on; want camera behind the line, enemy centred [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [ui-flow] budget-icon-wrap: coin icon orphaned on a third line, 7-digit cost overflows the curved block [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
7. [ui-flow] tray-trees-read-through: canopies show through tray and budget block [attempts: 1] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET over corpses; want one "PRESS [TAB] TO CONTINUE" line over survivors [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame; superellipse reads as a rectangle
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint, tabs point UP
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds uniform white with halo; tufts still 4-sided cones
- mammoth-no-launch [attempts: 1] — no body airborne in any still
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast

## Notes for next iteration (max 5 lines)
- Pickable: 4, 5, 6, 8. Gaps 1, 2, 3, 7 are in Rejected attempts.
- Gap 5 NEXT EDIT (swoopToBattle): standoff alpha clamp 0.6 -> ~0.3 rad, that change only.
- Gap 6 NEXT EDIT (.budget-label): white-space: nowrap, width ~150px with matching left offset; count as large as cost.
- Gap 1 NEXT EDIT: ISLAND_WIDTH/DEPTH ~96 x 82 so rims and cliff land in frame; 4f3c844 has the reusable outline/cliff code.
- Gap 4 last defect: mitt shows big face side-on; LIMB_THIN compounded to 0.64.
