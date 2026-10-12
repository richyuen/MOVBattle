# Loop state
Iteration: 69   Last re-audit: 65   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- fireball-balloon-cluster 5d2c3d4 — REJECT (reverted b6f40cd)
- gun-line-grass-tall-clumps 7c93c0c — APPROVE
- foot-small-blob dbe6865 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-balloon-cluster (5d2c3d4) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: gun-line-grass-tall-clumps (7c93c0c) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: foot-small-blob (dbe6865) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-balloon-cluster: hard-edged egg two men tall, yellow cap; TABS man-high ragged cream burst wider than tall [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [unit-look] foot-plank-pedestal: feet are oversized flat dark planks; TABS stubby shin-wide wedges [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
3. [maps-light] fight-band-grass-carpet: wall-to-wall broad jagged cards; TABS mostly bare lawn, sparse tiny tufts [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
4. [unit-look] bare-feet-dark-slabs: bare-skinned units (Zeus) have dark feet, not skin-coloured [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
5. [battle-feel] gun-crew-bolt-upright: crews stand upright by the carriage; TABS lean in, arms on the gun [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [maps-light] arena-hard-rectangle: spiky rim, saturated green; TABS round organic pastel island [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
7. [unit-look] idle-rigid-block-torsos: identical arms-out pose, thick torsos; TABS slimmer, slack varied poses [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
8. [vfx] muzzle-smoke-smooth-ball: one smooth white ball; TABS chunky grey faceted puffs along the gun line [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- fireball-balloon-cluster [attempts: 1] — glow un-excluded + cap 1.1: white egg, still ~2 men tall
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray

## Notes for next iteration (max 5 lines)
- Gap 1 is under Rejected, not pickable. If retried: keep glow exclusion, fireScale cap ~0.7, lobeSizes[0] 1.0, coreMat (1,0.9,0.5).
- Gap 2: bodyBuilder footLength 0.3 -> 0.23, footWidth 0.19 -> 0.16, taper the toe end of foot().
- Gap 3: mapBuilder _createFieldBlades skip threshold 0.6 -> ~0.8 for |tuftX| < 24.
- Gap 4: unitFactory.ts:160 soleMaterial is the bare-foot colour; move it toward skin.
