# Loop state
Iteration: 43   Last re-audit: 40   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- downed-arm-skyward d6e6006 — APPROVE
- clouds-absent-in-placement a6b079e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: downed-arm-skyward (d6e6006) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: clouds-absent-in-placement (a6b079e) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] flung-bodies-one-crumple: airborne and downed bodies share one flat star splay, straight torso, parallel headings [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
2. [unit-look] torsos-boxy-mitts-cubes: box torso, cube hands on stick arms [attempts: 2] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
3. [maps-light] arena-rectangle-no-rim: flat rectangle, pale side slabs, no island edge or cliff [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
4. [battle-feel] crowd-thin-ground-visible: open grass between clumps, lines not two deep [attempts: 0] — ref: trailer_1_sheet_01 r3c1 — ours: big_melee_2s.png
5. [vfx] lightning-straight-bar-halo: thin kinked bar ending in a white blob hiding the caster [attempts: 1] — ref: tabs_screenshot_09 — ours: closeup_state_reads.png
6. [maps-light] back-ridge-pale-slab: teal shape and pale strip behind treeline, flat sky tint [attempts: 1] — ref: tabs_screenshot_05 — ours: hud_placement.png
7. [maps-light] low-clouds-matched-on-horizon: three same-size clouds at one height on the treeline, ground-level from battle cameras [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_placement.png
8. [battle-feel] downed-bodies-flat-planks: corpses lie alone and flat, no knee fold, none draped [attempts: 0] — ref: trailer_2_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; team colours muddied

## Notes for next iteration (max 5 lines)
- Pickable: 1, 4, 7, 8. 1 and 8 share proceduralAnimation _buildLimpPose; do not pair them. Keep its 14 Math.random draws.
- Gap 8: one leg per body gets a sideways hip yaw plus knee fold in the ground plane; small random body roll/heading offset.
- Gap 7: lowClouds in _createClouds: sizes ~6, 9, 13, base heights ~3, 6, 10; crown ~0.9 x size. Frame top cuts above y~11 at z 57.
- Gap 4: BIG_MELEE lives in loop/scripts/capture.mjs; do not edit it to fake density; spacing route failed spillover_chain.
- Back ridge next edit (when pickable): delete the four +Z _createMountain calls.
