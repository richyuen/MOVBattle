# Loop state
Iteration: 30   Last re-audit: 30   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- muzzle-smoke-balloon ad4a095 — APPROVE
- plank-lean-rod-arms ec555a5 — APPROVE
- battery-cropped-off-axis eeebc28 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: muzzle-smoke-balloon (ad4a095) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: plank-lean-rod-arms (ec555a5) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battery-cropped-off-axis (eeebc28) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] grass-spikes: large pale cones poke through units; want short dense tufts [attempts: 1] — ref: tabs_screenshot_08 — ours: lineup_medieval.png
2. [unit-look] cube-hands-stick-limbs: block hands on pipe-thin limbs; want tapered limbs, mitts [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
3. [battle-feel] plank-lean-rod-arms: swinging arms still straight bars; a corpse propped as a rigid 45-degree board [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [vfx] muzzle-smoke-balloon: cannon puffs swell and merge into 2-unit-high banks; glowing white mass at frame left [attempts: 0] — ref: gameplay_sheet_05 r1c3 — ours: war_machines_3800ms.png
5. [maps-light] bloom-clouds: clouds, snow caps blow out into soft glows; want flat hard-edged shapes [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [camera] battery-cropped-off-axis: line fits but is small, flat-on, left-heavy, empty foreground [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
7. [maps-light] island-rim-off-frame: square slab running off frame; want whole round island [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET links; want one centred prompt [attempts: 0] — ref: gameplay_sheet_05 r2c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle; front view, limbs, torso unchanged
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds uniform white with halo; tufts still 4-sided cones (now split: grass-spikes, bloom-clouds)
- mammoth-no-launch [attempts: 1] — no body airborne in any still

## Notes for next iteration (max 5 lines)
- Pickable: 3, 4, 6, 8. Gap 8: scenarios.ts:609 asserts labels "Play Again"/"Reset" and there is no Tab key handler.
- Gap 3: attack pose overwrites the shove elbow bend; clamp elbow.x <= -0.5 at end of update. Crouch constants are shared; hash them per unit.
- Gap 4: projectileSystem smoke swell 0.55+1.05 -> 0.7+0.4, shorter smokeLife for scale > 1; check the unlit flash sphere for the glow.
- Gap 6: swoopToBattle standoff: alpha ~0.5 rad off the army axis, then lower the 20 radius cap.
