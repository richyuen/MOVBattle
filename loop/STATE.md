# Loop state
Iteration: 70   Last re-audit: 70   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- boot-plinth-slabs daac303 — APPROVE
- hill-saucer-undercut e392bd7 — APPROVE
- blast-launch-too-high-and-stiff ef6928f+949e0ee — REJECT (reverted 0ee8848, 0a4bd0e)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: boot-plinth-slabs (daac303) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: hill-saucer-undercut (e392bd7) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blast-launch-too-high-and-stiff (ef6928f + 949e0ee) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] blast-launch-too-high-and-stiff: thrown bodies above the treetops, spread over half the frame, legs forked; TABS tight clump just over head height [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [unit-look] foot-box-wider-than-ankle: feet are constant-size flat boxes overhanging the shin; TABS ankle-wide tapered stub [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
3. [unit-look] torso-box-and-stiff-idle: armoured units a wide grey box on stick legs, bolt upright [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_state_reads.png
4. [vfx] fireball-balloon-cluster: stack of separate yellow/orange/white spheres on a pebble pile [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
5. [maps-light] hill-bald-oval-rim: mounds are pale smooth ovals with a dark rim from above [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
6. [maps-light] grass-tufts-oversized: foreground tufts are jagged cones shin-high [attempts: 0] — ref: trailer_3_sheet_01 r2c1 — ours: war_machines_3800ms.png
7. [maps-light] ridge-slab-over-placement: dark teal rock slab tops the placement view, hard rectangle field [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [battle-feel] no-bodies-underfoot-at-clash: lines meet with nobody down or airborne, mammoth launches no one [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- fireball-balloon-cluster [attempts: 1] — glow un-excluded + cap 1.1: white egg, still ~2 men tall
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks

## Notes for next iteration (max 5 lines)
- Gaps 1 and 4 are under Rejected, not pickable. Any cut to blast lift (projectileSystem.ts:388, 3rd arg) fails battle_recap_result_legacy_tank_shell; critic suggests cutting outward speed and _airPose hipGap/kick instead.
- Gap 2: bodyBuilder ~268 footWidth from lowerLegBottom * 1.1, footHeight 0.1 -> 0.07.
- Gap 5: mapBuilder _createHill scaling.y height * 1.2, position.y -height * 0.3.
- Gap 6: mapBuilder tuft pass ~528-546, lower heightCap. Gap 7: FAR_ROCK / FAR_ROCK_SHADE toward pale haze.
