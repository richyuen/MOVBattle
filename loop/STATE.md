# Loop state
Iteration: 62   Last re-audit: 60   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- units-cast-no-shadow 9d7b92e — APPROVE
- tree-canopies-cast-nothing 26bea7a — APPROVE
- torso-column-narrower-than-helm 8c20a40 — APPROVE (marginal)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: units-cast-no-shadow (9d7b92e) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: tree-canopies-cast-nothing (26bea7a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: torso-column-narrower-than-helm (8c20a40) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] shadows-short-and-faint: stubs under a near-vertical sun, invisible at placement altitude and on left trees [attempts: 0] — ref: trailer_3_sheet_02 r3c3 — ours: closeup_pair_zeus_thor.png
2. [unit-look] shoulder-caps-still-beads: knight caps are balls outside a chest only helm-wide; Zeus chest a funnel [attempts: 0] — ref: gameplay_sheet_03 r1c3 — ours: closeup_weapon_reads.png
3. [maps-light] flat-rectangle-map: square slab, no island edge, hills or dressing [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
4. [unit-look] knight-single-value-red: plate, helm, limbs one flat red; no darker gear, no neutral accents [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
5. [maps-light] tree-ring-bleached-mint: far pine wall pastel mint in placement, casts no shadow [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
6. [vfx] explosion-blocky-starburst: yellow slabs and orange balls, not a bloomed fireball [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
7. [battle-feel] launched-bodies-rigid: airborne units hold stiff straight limbs [attempts: 0] — ref: trailer_3_sheet_02 r2c2 — ours: war_machines_1100ms.png
8. [maps-light] shadow-speckle-and-merge: white speckle in tree shadows; they fuse with canopies [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: main.ts dir direction y -1 to about -0.6 (keep position = direction.scale(-100), widen shadowMaxZ); no blur.
- Gap 8: shadowGen.bias 0.0004 to about 0.001. Shadows are PCF now; autoCalcShadowZBounds stays off.
- Gap 2: bodyBuilder, showShoulderPads: shoulderCapDiam 1.55 to 1.1, widen torsoBottom by half the 1.24 flare.
- Gap 4: CLOTH_SHADE x.75 for isArmored in unitFactory.
- main.ts is CRLF: edit by node script that keeps line endings.
