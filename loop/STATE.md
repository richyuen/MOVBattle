# Loop state
Iteration: 22   Last re-audit: 20   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- haze-spike-fence 8e852a1 — APPROVE
- tray-flat-band 03fdd4c — APPROVE
- closeups-still-mid-distance b29b047 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: haze-spike-fence (8e852a1) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: tray-flat-band (03fdd4c) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)
- GAP: closeups-still-mid-distance (b29b047) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] mesa-snow-lids: flat humps, glowing lids, no taller than treeline; want matte pointed grey ridge twice treeline height [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
2. [camera] closeup-ground-band: bottom fifth empty grass, horizon at 38%; want feet cut by bottom edge, horizon mid-frame [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
3. [ui-flow] result-band-clutter: 190px band, four recap lines, two pills, "TEAM B WINS!"; want only VICTORY! and continue hint in thin bands [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [ui-flow] tray-too-wide-boxed: 1100px panel, near-flat arch, dark square tiles, mixed fill/outline glyphs; want ~620px curved band, silhouettes directly on it [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
5. [camera] lineup-top-down: steep overhead, units 40px; want eye-level group filling frame [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
6. [unit-look] hero-pair-rigid: box torsos, arms down, rank-and-file height, small hammer; want towering hero mid-swing [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_pair_zeus_thor.png
7. [vfx] blast-dome (= balloon-explosion): smooth dome of discs, 3-4 flung; want ragged flame, 8+ bodies [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
8. [maps-light] placement-teal-ring: far cones still pale mint from placement camera; want near-tree dark green [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted

## Notes for next iteration (max 5 lines)
- Gap 7 is in Rejected attempts: not pickable.
- Gap 2 NEXT EDIT (scenarios.ts): reads target.y 1.3->1.6, radius ~7; pair y 1.1->1.3, radius ~4.5; beta PI/2.05. Also applyGalleryPreset never restores lowerRadiusLimit 8.
- Gap 4 NEXT EDIT (index.html): #unitPanel width ~620px, arch 60px, .unit-btn background transparent.
- Gap 8 NEXT EDIT (paintFarProps): canopy.scale(0.75) before hazing, HAZE_MIX 0.25->0.1.
