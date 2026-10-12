# Loop state
Iteration: 66   Last re-audit: 65   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-ankle-high-tombstones ace4f37 — APPROVE
- battle-cam-dead-sky-half af2e54b — APPROVE
- shins-spike-pegs-no-boot 8d64c00 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-ankle-high-tombstones (ace4f37) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: battle-cam-dead-sky-half (af2e54b) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: shins-spike-pegs-no-boot (8d64c00) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] grass-unbroken-carpet-buries: one single-tone carpet buries corpses, cannon carriages, feet; TABS alternates tall clumps with open ground [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
2. [unit-look] legs-dark-points-no-boot: legs still taper to dark points with no boot; sleeves step in at the elbow [attempts: 0] — ref: tabs_screenshot_08 — ours: big_melee_2s.png
3. [camera] battle-cam-inside-near-rank: by 9s units cropped at the knees, spear across frame, mammoth cut by edge [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
4. [maps-light] arena-square-slab-flat-sky: rectangular slab, straight edges, flat forest wall; TABS irregular floating island with cliffs [attempts: 0] — ref: trailer_1_sheet_01 — ours: hud_placement.png
5. [vfx] explosion-polyhedra-clusters: yellow/orange polyhedra and white balls; TABS bright flat flame burst [attempts: 0] — ref: trailer_3_sheet_02 — ours: war_machines_1100ms.png
6. [unit-look] lineup-tiny-props-same-silhouette: props undersized, silhouettes near-identical at distance [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [battle-feel] melee-no-ground-shadows: figures float on the grass; TABS long soft shadows [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
8. [ui-flow] budget-1000000-unlimited-pill: TABS shows compact count and budget numerals [attempts: 0] — ref: gameplay_sheet_01 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: _createFieldBlades bare threshold 0.1 back toward 0.25, keep h and lean; vary blade tone. Grass keeps flip-flopping.
- Gap 2: bodyBuilder drop 0.92 on lowerArmTop, widen footWidth/footHeight; LOWER_LIMB_MIN_TAPER 0.88 overrides limbTaper.
- Gap 3: cameraController leave pitchUp 0.17 (critic: it oscillates); hold opening radius or floor clearRadius 5.5 after contact.
- Gap 7: shadowGen.darkness is 0.45; earlier shadow attempts made them vanish, see Rejected.
