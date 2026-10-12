# Loop state
Iteration: 67   Last re-audit: 65   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-unbroken-carpet-buries 5fd4c02 — APPROVE
- legs-dark-points-no-boot 2529e87 — APPROVE
- battle-cam-inside-near-rank 30d5e17 — REJECT (reverted 170b901)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-unbroken-carpet-buries (5fd4c02) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: legs-dark-points-no-boot (2529e87) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: battle-cam-inside-near-rank (30d5e17) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] battle-cam-inside-near-rank: by 9s near rank cut at the shin, spear across frame, mammoth cut by edge [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
2. [maps-light] fight-band-grass-buries: corpses and cannon carriages still sink into grass; central band should be mostly bare [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
3. [unit-look] boot-same-tint-as-shin: boot is the shin's dark tint; barefoot units still end in points [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
4. [vfx] explosion-crystal-blocks: impact is huge yellow/orange blocks taller than a tree; TABS soft bright fireball [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
5. [unit-look] bare-mannequin-torsos: flat grey torso slab, no cloth layers, tiny hats [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
6. [maps-light] field-flat-no-dressing: flat plane, straight horizon, no hills or ruins in the tree ring [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
7. [battle-feel] stiff-flyers-flat-dead: victims fly spread-eagled, dead lie as flat streaks, no limp piles [attempts: 0] — ref: tabs_screenshot_02 — ours: war_machines_1100ms.png
8. [ui-flow] result-band-space-reset: says PRESS [SPACE] TO PLAY AGAIN with RESET label, mammoth's back to camera [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass

## Notes for next iteration (max 5 lines)
- Gap 1: back-off needs ~+4 (cap 18) and must subtract _shakeOffset before any moved-by-player test; leave pitchUp 0.17 and clearRadius.
- Gap 2: _createFieldBlades open-ground cut 0.25 -> ~0.5 where |x| < 14 only. BLADE_DARK 0.84 still does not read.
- Gap 3: bodyBuilder give the foot mesh its own color (shin lightened ~25% or accent), not bodyMat.
