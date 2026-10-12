# Loop state
Iteration: 68   Last re-audit: 65   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- fight-band-grass-buries fdb7eba — APPROVE
- boot-same-tint-as-shin 2b4ccdd — APPROVE
- explosion-crystal-blocks 2ded20a — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fight-band-grass-buries (fdb7eba) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: boot-same-tint-as-shin (2b4ccdd) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: explosion-crystal-blocks (2ded20a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] battle-cam-inside-near-rank: by 9s near rank cut at the shin, spear across frame, mammoth cut by edge [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
2. [vfx] fireball-balloon-cluster: separate opaque white/yellow/orange balls two men tall; TABS one fused glowing mass at man height [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [maps-light] gun-line-grass-tall-clumps: carriages and melee dead stand in knee-high clumps outside the bare band [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
4. [unit-look] foot-small-blob: foot is an ankle-wide oval so legs still taper to a point; bare feet not legible [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
5. [unit-look] bare-mannequin-torsos: flat grey torso slab, no cloth layers, tiny hats [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
6. [battle-feel] stiff-flyers-flat-dead: victims fly spread-eagled, dead lie as flat streaks, no limp piles [attempts: 0] — ref: tabs_screenshot_02 — ours: war_machines_1100ms.png
7. [maps-light] field-flat-no-dressing: flat plane, straight horizon, no hills or ruins in the tree ring [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
8. [ui-flow] result-band-space-reset: says PRESS [SPACE] TO PLAY AGAIN with RESET label, mammoth's back to camera [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass

## Notes for next iteration (max 5 lines)
- Gap 1 is under Rejected attempts, so not pickable (skipped in 68). If retried: subtract _shakeOffset before any moved-by-player test.
- Gap 2: drop glow.addExcludedMesh on fire lobes so they bloom into one mass; fireScale cap 1.6 -> ~1.1.
- Gap 3: _createFieldBlades cap patchHeight ~0.6 inside |x| < 24; leave the open-ground cut alone.
- Gap 4: bodyBuilder foot ~1.5x longer forward, ~1.3x ankle width. No capture shows a tribal unit's bare feet.
