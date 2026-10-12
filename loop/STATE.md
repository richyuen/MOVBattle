# Loop state
Iteration: 54   Last re-audit: 50   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- bare-grass-bottom-quarter 4954102 — APPROVE
- fireball-translucent-cream fb319ca — APPROVE
- flyer-legs-barely-part c93f114 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: bare-grass-bottom-quarter (4954102) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: fireball-translucent-cream (fb319ca) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: flyer-legs-barely-part (c93f114) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-uniform-lemon-ball: needs paler hot core, orange only in bottom fringe [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
2. [battle-feel] flyers-four-pointed-stars: want fore-aft scissor, one bent knee, limbs along trunk [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [camera] near-rank-26pct-empty-flanks: should be ~40% of frame, edge to edge [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
4. [battle-feel] blast-lofts-5-separate: should throw an overlapping clump of 6-10 [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
5. [unit-look] box-torsos-stick-limbs-cube-hands [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
6. [camera] result-shot-bare-bottom-fifth: mammoth rear fills centre [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
7. [maps-light] placement-flat-slab-teal-haze: want rounded island, saturated ground [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [vfx] muzzle-smoke-single-ball: want fat multi-puff trail along barrel [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black

## Notes for next iteration (max 5 lines)
- Gap 1: add a smaller pale core mesh (~1,.97,.75, high emissive) in the blast; flame lobes only below the equator.
- Gap 2: _buildAirPose kicks ~0.15-0.3; trailing leg knee up to ~0.9, lead leg straight.
- Gap 3: swoopToBattle melee radius floor 8 -> ~6.5. Pitch (not a lower eye) is what moved feet to the edge.
- Iter 55 is a re-audit. Pickable: 1, 2, 3, 4, 6, 7, 8 (not 5). No new Math.random in VFX or poses.
