# Loop state
Iteration: 64   Last re-audit: 60   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- great-helm-team-red 6626851 — APPROVE
- shadows-hard-black-fused 80e6295 — APPROVE
- flat-rectangle-map 98e3d96 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: great-helm-team-red (6626851) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shadows-hard-black-fused (80e6295) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: flat-rectangle-map (98e3d96) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] knight-chest-helm-wide: chest only helm-wide, armoured arms bare skin colour, Thor shoulders still balls [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_pair_zeus_thor.png
2. [vfx] cannon-impact-crystal-shards: yellow/orange shards over grey lumps, not white puff, black ball, dust [attempts: 0] — ref: trailer_3_sheet_03 r3c1 — ours: war_machines_1100ms.png
3. [maps-light] island-ruled-edge-flat-sky: grass an exact rectangle, regular crag picket, tan border strip, one-tone sky [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
4. [battle-feel] upright-idle-thin-front: standing units bolt upright, arms hanging; front has gaps, single-layer pile [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
5. [maps-light] tree-shadow-ribbon-red-half: long tree shadows join into one band across the red half; sun too low [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
6. [unit-look] no-neutral-accents: no tabard, emblem, fur or trim on armoured units; torsos plain tubes [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [ui-flow] placed-units-no-blob: at placement altitude units have no ground shadow, one smudge per team [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png
8. [unit-look] great-helm-too-pale: helm brightest, nearly untinted, blank face plate; no cross/grille [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: unitFactory swaps upper arms to skin unless shouldFavorTeamBodyColor; skip that for isArmored. chestTop is 1.24.
- Gap 3: mapBuilder crag loop: d from 0.5 width inside to 0.6 outside, width 4-16. Sky gradient is its own job.
- Gap 5: critic wants a higher sun, but 63.1 lowered it (-0.4,-0.6,0.6) for longer shadows: change little.
- Gap 8: propBuilder great_helm steel to (0.45,0.45,0.5), team lerp 0.25; gold cross on the front facet.
- shadowGen.darkness is 0.45; unit shadows are faint already, do not raise it.
