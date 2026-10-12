# Loop state
Iteration: 41   Last re-audit: 40   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- landed-bodies-arms-up ff11c74 — APPROVE
- back-ridge-pale-slab 7a6a60e — REJECT (reverted 1cdb3cd)
- clouds-soft-blobs e79dd20 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: landed-bodies-arms-up (ff11c74) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: back-ridge-pale-slab (7a6a60e) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: clouds-soft-blobs (e79dd20) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] back-ridge-pale-slab: ridge band still crosses placement view above treeline; want void [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
2. [maps-light] arena-rectangle-no-rim: rectangular slab, straight cone picket; want round arena, curved tree ring, rim [attempts: 2] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [battle-feel] flung-bodies-one-crumple: every airborne body the same spread-eagle X; want mixed tumbling poses [attempts: 1] — ref: trailer_3_sheet_01 r2c3 — ours: war_machines_1100ms.png
4. [battle-feel] downed-bodies-t-knees-up: one straight-arm T, knees and feet in the air; want flat legs, mixed arms [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
5. [vfx] lightning-straight-bar-halo: soft glowing zigzag ending in a white fog ball [attempts: 1] — ref: tabs_screenshot_09 — ours: closeup_state_reads.png
6. [unit-look] torsos-boxy-mitts-cubes: slab torsos, cube hands, stick limbs; want tapered bodies, mitts [attempts: 2] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
7. [battle-feel] crowd-thin-ground-visible: 61 units leave open grass; want lines that hide the ground [attempts: 0] — ref: trailer_1_sheet_01 r3c1 — ours: big_melee_result.png
8. [maps-light] clouds-bead-strings: four beads in a row, dark undersides, none in placement view; want heaped near-white cumulus [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; team colours muddied

## Notes for next iteration (max 5 lines)
- Pickable: 3, 4, 7, 8. 3 and 4 share proceduralAnimation _limpPose; 8 is mapBuilder _createClouds.
- Gap 4: knee X ~0.05..0.6; one arm X biased overhead, other elbow up to ~1.4.
- Gap 8: emissive ~(0.6,0.63,0.66); two middle puffs bigger and higher, all sharing one base height.
- Back ridge next edit (when pickable): delete the four +Z _createMountain calls.
