# Loop state
Iteration: 19   Last re-audit: 15   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- white-cone-mountains 562e072 — APPROVE
- mammoth-slab-barrel 9accb54 — APPROVE
- shield-overshoot-flat 1be80ba — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: white-cone-mountains (562e072) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: mammoth-slab-barrel (9accb54) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shield-overshoot-flat (1be80ba) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] spire-mountains: isolated tall spires, floating tier ledges; want one low wide continuous ridge [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_2s.png
2. [unit-look] mammoth-flat-back: flat box shelf, head level with back; want shoulder-to-rump diagonal, compact body [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
3. [unit-look] shield-side-carry: round shields beside body with gaps; want chest-centred overlapping wall, two-tone plank face [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
4. [maps-light] clone-cone-trees: identical green two-cone stacks, one size; want darker bushier multi-tier pines of varied height [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
5. [maps-light] sparse-spike-grass: sparse knee-high spikes on flat lime; want dense fine grass, occasional tufts [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_5s.png
6. [unit-look] mammoth-bead-eye: small dark eye, no mane; want big white eye with pupil, face paint, shaggy mane cap [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
7. [maps-light] placement-teal-blocks: mountains fill top edge, no island edge; want visible rim against sky [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: big_melee_placement.png
8. [unit-look] bare-box-torsos: hat-only soldiers; want tunic, belt, collar chunks per faction [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still

## Notes for next iteration (max 5 lines)
- 20 is a RE-AUDIT: run it first; it should restore non-visual gaps (ranks, tray, camera, explosion).
- Gap 1 NEXT EDIT: _createMountain tier height x0.55, base diameterTop back to 0.3 (mid overhangs).
- Gap 2 NEXT EDIT: buildMammoth pitch barrel group (torso, caps, skirts, bands) 0.2 rad nose-up.
- Gap 3 NEXT EDIT: attachProps round shield x toward centreline, yaw to face forward.
