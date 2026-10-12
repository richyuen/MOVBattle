# Loop state
Iteration: 49   Last re-audit: 45   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- lightning-reads-as-grey-plank 89efbef — APPROVE
- idle-arms-hang-symmetric a2aa89e — REJECT (reverted d3f78d9)
- impact-dust-row-of-tan-lumps c8a3ab4 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lightning-reads-as-grey-plank (89efbef) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: idle-arms-hang-symmetric (a2aa89e) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: impact-dust-row-of-tan-lumps (c8a3ab4) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] idle-arms-hang-symmetric: knight, purple-cap unit, Zeus still hang both arms in a mirrored A [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: lineup_medieval.png
2. [vfx] lightning-kinks-too-small: straight thin white streak, corners invisible, no visible fork, halo [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
3. [battle-feel] machine-crews-upright-posts: lineup catapult crew a tiny standing figure; bomb cannon crew straight at 3800 ms [attempts: 1] — ref: trailer_1_sheet_01 r1c2 — ours: war_machines_3800ms.png
4. [vfx] blast-mound-reads-as-rock-pile: tan faceted pile that lingers; no bright burst colour [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
5. [battle-feel] flung-bodies-same-rigid-pose: flung and dead squires share one splayed pose, land in a tidy row [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
6. [maps-light] placement-arena-square-slab: flat straight-edged rectangle, no cliff or water [attempts: 2] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
7. [unit-look] box-mitt-hands-and-rod-limbs: box torsos, block hands, stick limbs [attempts: 2] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
8. [camera] melee-camera-inside-the-crowd: spear shaft and torso block a third of the frame [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus; crew pose lasted one frame
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black
- shadows-noon-blobs [attempts: 1] — sun angle alone: trees cast nothing, unit shadows pale half-body smears
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera

## Notes for next iteration (max 5 lines)
- Gap 2: spawnLightning: amp = max(0.5, len*0.12), segments about len/1.4; bolder fork.
- Gap 3: bomb cannon crew are linked RuntimeUnits (linkedActorPresets); a _applyPoseOverlay preset gets overridden after the shot, so find what resets it. Catapult crew: addOperator pose callback in buildCatapult.
- Gap 4: spawnExplosionBurst: dustMat pale cream, fade mound alpha out over the first half; drop the lingering ball.
- Idle arms: a later hold/pose layer resets rightShoulder/rightElbow on plain units; find it before retrying.
- Pickable next: 2, 3, 4, 5, 8 (not 1, 6, 7).
