# Loop state
Iteration: 61   Last re-audit: 60   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- red-armour-muddy-maroon 1e109b9 — APPROVE (closed)
- placement-haze-washes-teams 79926fa — REJECT (reverted adfe13f)
- torso-box-no-shoulders 1ac7ca0 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-armour-muddy-maroon (1e109b9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: placement-haze-washes-teams (79926fa) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: torso-box-no-shoulders (1ac7ca0) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] units-cast-no-shadow: no unit or mammoth ground shadows in any view [attempts: 0] — ref: trailer_3_sheet_02 r3c3 — ours: closeup_pair_zeus_thor.png
2. [maps-light] tree-canopies-cast-nothing: trunk strips at most, canopies never cast [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
3. [unit-look] torso-column-narrower-than-helm: armoured chest a narrow prism, caps sit outside it as balls [attempts: 0] — ref: gameplay_sheet_03 r1c3 — ours: closeup_weapon_reads.png
4. [maps-light] tree-ring-bleached-mint: far pine wall and canopies pastel mint in placement [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
5. [unit-look] knight-single-value-red: plate, helm, limbs one flat red; no darker gear, no neutral accents [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
6. [maps-light] flat-rectangle-map: square slab, no island edge, hills or dressing [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
7. [vfx] explosion-blocky-starburst: yellow slabs and orange balls, not a bloomed fireball [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
8. [battle-feel] launched-bodies-rigid: airborne units hold stiff straight limbs [attempts: 0] — ref: trailer_3_sheet_02 r2c2 — ours: war_machines_1100ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: main.ts shadowGen is blur-ESM over ring-wide extents; critic suggests usePercentageCloserFiltering, check zeus/thor pair.
- Gap 2: mapBuilder:394 addShadowCaster(trunkMesh) runs before canopies are parented; move it after.
- Gap 3: widen armoured chest top or squash cap y to .7. Gap 5: CLOTH_SHADE x.75 for isArmored in unitFactory.
- main.ts is CRLF: edit by node script that keeps line endings.
