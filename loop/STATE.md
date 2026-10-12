# Loop state
Iteration: 44   Last re-audit: 40   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- flung-bodies-one-crumple 256342a — APPROVE
- low-clouds-matched-on-horizon fbcb99b — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: flung-bodies-one-crumple (256342a) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: low-clouds-matched-on-horizon (fbcb99b) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] fliers-parallel-pitch-flat-row: fliers share one whole-body pitch/heading, topmost still a star; landed bodies lie in one flat row [attempts: 0] — ref: trailer_2_sheet_02 r1c3, tabs_screenshot_01 — ours: war_machines_1100ms.png, war_machines_3800ms.png
2. [battle-feel] crowd-thin-ground-visible: open grass between units, no two-deep pile at the contact line [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
3. [maps-light] low-cloud-on-treeline: a low cloud still rests on the treeline from battle cameras [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
4. [maps-light] lime-field-flat-sky: saturated lime grass, flat teal sky, no warm grading or long shadows [attempts: 1] — ref: tabs_screenshot_05 — ours: lineup_medieval.png
5. [maps-light] arena-rectangle-no-rim: square slab with straight edges, no rounded island rim [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
6. [unit-look] torsos-boxy-mitts-cubes: dark shins, cube hands, stick limbs on boxy torsos [attempts: 2] — ref: trailer_3_sheet_01 r1c2 — ours: lineup_medieval.png
7. [vfx] cannon-impact-flat-blobs: impact is a ring of flat beige blobs, no flash or debris [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
8. [camera] result-shot-mammoth-rear: result shot centers the mammoth's rear, victors half hidden [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; team colours muddied

## Notes for next iteration (max 5 lines)
- N=45 is a re-audit. Pickable: 1, 2, 3, 7, 8. Keep _buildLimpPose at 14 Math.random draws; hash from _wobblePhase.
- Gap 1: in _buildAirPose widen torso roll/twist (0.9/1.2 rad) to about a half-turn; air pose is cached per animator.
- Gap 3: lowClouds medium entry base y 1.5 -> ~6 (above far pine tops); keep it visible in placement (top cut y~11 at z 57).
- Gap 2: BIG_MELEE lives in loop/scripts/capture.mjs; do not edit it to fake density; spacing route failed spillover_chain.
- Back ridge next edit (when pickable): delete the four +Z _createMountain calls.
