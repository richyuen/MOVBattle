# Loop state
Iteration: 42   Last re-audit: 40   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- downed-bodies-t-knees-up 4f07cf3 — APPROVE
- clouds-bead-strings 82bf1e0 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: downed-bodies-t-knees-up (4f07cf3) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: clouds-bead-strings (82bf1e0) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] back-ridge-pale-slab: pale ridge band crosses placement view above tree picket; want open sky [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
2. [maps-light] arena-rectangle-no-rim: rectangular slab, straight cone picket; want round arena, curved tree ring, rim [attempts: 2] — ref: gameplay_sheet_01 r1c3 — ours: big_melee_placement.png
3. [battle-feel] flung-bodies-one-crumple: all airborne bodies one spread-eagle splay; want mixed tumbling poses [attempts: 1] — ref: trailer_2_sheet_02 r1c3 — ours: war_machines_1100ms.png
4. [battle-feel] downed-arm-skyward: downed bodies hold one arm and fist straight up, same pose in a row [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
5. [unit-look] torsos-boxy-mitts-cubes: slab torsos, cube hands, stick limbs; want tapered bodies, mitts [attempts: 2] — ref: trailer_3_sheet_01 r2c3 — ours: closeup_pair_zeus_thor.png
6. [vfx] lightning-straight-bar-halo: soft glowing zigzag ending in a white fog ball covering a unit [attempts: 1] — ref: tabs_screenshot_09 — ours: closeup_state_reads.png
7. [battle-feel] crowd-thin-ground-visible: 61 units leave open grass; want lines that hide the ground [attempts: 0] — ref: trailer_1_sheet_01 r3c1 — ours: big_melee_result.png
8. [maps-light] clouds-absent-in-placement: no cloud in placement frame, puffs still in a line [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; team colours muddied

## Notes for next iteration (max 5 lines)
- Pickable: 3, 4, 7, 8. 3 and 4 share proceduralAnimation _buildLimpPose; do not pair them.
- Gap 4: cut torsoX to ~0-0.2 so the overhead arm lands on the ground; overhead arm on only ~half of bodies.
- Gap 8: _createClouds, put 2-3 clouds low behind the far treeline; add a fifth puff stacked on the two middle ones.
- Gap 7: BIG_MELEE lives in loop/scripts/capture.mjs; do not edit the capture script to fake density.
- Back ridge next edit (when pickable): delete the four +Z _createMountain calls.
