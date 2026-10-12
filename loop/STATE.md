# Loop state
Iteration: 31   Last re-audit: 30   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- plank-lean-rod-arms b8bab4c — REJECT (reverted b60c576)
- muzzle-smoke-balloon 9217738 — REJECT (reverted d214573)
- battery-cropped-off-axis 589304c — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: plank-lean-rod-arms (b8bab4c) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: muzzle-smoke-balloon (9217738) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: battery-cropped-off-axis (589304c) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] rod-arms-outside-attack: walking and shoving units hold arms as straight bars; dark unit is a rigid 40-degree board [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [vfx] muzzle-smoke-bank: cannon puffs unit-sized, chain into a bank 1.7 units high; want head-sized puff per shot [attempts: 1] — ref: gameplay_sheet_05 r1c3 — ours: war_machines_3800ms.png
3. [maps-light] grass-spikes: large pale cones poke through units, litter the foreground; want short dense tufts [attempts: 1] — ref: tabs_screenshot_08 — ours: lineup_medieval.png
4. [unit-look] cube-hands-stick-limbs: block hands on pipe-thin limbs; want tapered limbs, mitts [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
5. [maps-light] bloom-clouds: clouds, snow caps blow out into soft glows; want flat hard-edged shapes [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [vfx] bloomed-white-blob: large glowing white mass fills frame left, source unidentified [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_state_reads.png
7. [maps-light] island-rim-off-frame: square slab running off frame; want whole round island [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [ui-flow] victory-band-buttons: PLAY AGAIN/RESET links; want one centred prompt [attempts: 0] — ref: gameplay_sheet_05 r2c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp; rod arms belong to walking/shoving units (now rod-arms-outside-attack)
- muzzle-smoke-balloon [attempts: 1] — swell cut but spawn size unchanged; still a bank at 3800ms (now muzzle-smoke-bank)
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle; front view, limbs, torso unchanged
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint

## Notes for next iteration (max 5 lines)
- Pickable: 1, 2, 6, 8 (1 and 2 are the renamed residuals, one attempt each).
- Gap 1: proceduralAnimation walk elbows (~401, ~425) and shove walking branch: bend >= 0.5 rad in every live state.
- Gap 2: spawnMuzzleFlash lobe diameter uses Math.min(scale, 1.6), floor smokeLife at 0.6; white lobes at the enemy are muzzle path per critic.
- Camera leftover: swoopToBattle lowers lowerRadiusLimit and never restores it; standoff eye sits above crew heads (lower to.beta).
