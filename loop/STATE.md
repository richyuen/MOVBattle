# Loop state
Iteration: 29   Last re-audit: 25   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- standoff-enemy-unreadable a1c276b — APPROVE
- blast-dome 4a94686 — APPROVE
- rigid-upright-ranks 986d862 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: standoff-enemy-unreadable (a1c276b) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: blast-dome (4a94686) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: rigid-upright-ranks (986d862) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] muzzle-smoke-balloon: muzzle smoke is a smooth glowing sphere ~4 bodies wide; want faceted grey-white lumps 1-1.5 bodies [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
2. [unit-look] cube-hands-stick-limbs: cube hands, untapered stick limbs, slab torsos [attempts: 2] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
3. [maps-light] grass-spikes-and-bloom-clouds: cone-spike grass, glowing blob clouds; want flat card tufts, faceted clouds [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
4. [battle-feel] plank-lean-rod-arms: leaning units are straight planks with rod arms, approaching rank upright; want waist/knee bend, floppy elbows [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_9s.png
5. [camera] battery-cropped-off-axis: camera inside gun line, cannons cropped, pointing across frame; want whole battery as one receding row [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [vfx] impact-no-fireball-pebble-ring: no visible flash or ball, dust a flat pebble ring; want 2-4 body pale fireball, airborne chunks [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_3800ms.png
7. [maps-light] island-rim-off-frame: field runs off frame, no island edge or drop [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
8. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET; want one "PRESS [TAB] TO CONTINUE" line [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle; front view, limbs, torso unchanged
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds uniform white with halo; tufts still 4-sided cones
- mammoth-no-launch [attempts: 1] — no body airborne in any still

## Notes for next iteration (max 5 lines)
- Iteration 30 is a re-audit. Pickable: 1, 4, 5, 6, 8.
- Gap 1: muzzle puff is projectileSystem spawnMuzzleFlash; reuse the faceted lobes of spawnExplosionBurst.
- Gap 4: shove overlay: half of pitch to a hip counter-bend, knee 0.6-0.9, elbows -1.0 +/- 0.6 sin(phase), all live states.
- Gap 5: swoopToBattle side clamp 0.3 -> 0.15, floor radius by halfSpan.
- Gap 6: flash 1.8 m for 0.3 s; clods random height, 2-3x lift, uneven spacing; ball 0.5.
