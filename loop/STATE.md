# Loop state
Iteration: 12   Last re-audit: 10   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 2

## Focus (2-3 gaps this iteration)
- cannon-ball-and-impact-burst abc06c5 — REJECT, reverted f4c75d2 (vfx 2->2)
- topple-pivots-at-feet 4b8ec8f — APPROVE (battle-feel 2->2)
- dead-not-limp 3177474 — APPROVE (battle-feel 2->2)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cannon-ball-and-impact-burst (abc06c5) VERDICT: REJECT SCORE: vfx 2/5 (previous: 2/5)
- GAP: topple-pivots-at-feet (4b8ec8f) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: dead-not-limp (3177474) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] cannon-ball-and-impact-burst: ball never visible in flight; small puff (~0.8), ball 0.8, time the still off the shot [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1200ms.png
2. [battle-feel] blast-flings-nobody: cannon/explosion hits launch no bodies; squires stand upright in the blast [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3400ms.png
3. [vfx] burst-fog-not-fireball: hit burst is white fog; fireball core must be the dominant opaque shape, dust as solid chunks [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1200ms.png
4. [battle-feel] lines-upright-rows: front lines stay upright spaced rows, no compression, nobody airborne beside the mammoth [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_5s.png
5. [battle-feel] downed-parallel-boards: downed bodies are parallel rigid boards, heads off the ground [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [battle-feel] heavy-corpses-vanish: heavy/boss corpses despawn at 7-8 s; corpses never stack [attempts: 0] — ref: tabs_screenshot_09 — ours: big_melee_result.png
7. [unit-look] props-small-squires-purple: props undersized, bodies stiff cylinders; squires dark purple with red heads [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3400ms.png
8. [ui-flow] tray-text-pills: text pills + search box, not an arc of icon tiles [attempts: 0] — ref: gameplay_sheet_02 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff; still times guessed
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty

## Notes for next iteration (max 5 lines)
- Pirate cannon uses the generic fire path (simulationSystem ~1045, shape "stone", no muzzle puff); the iter-11 puff is the bomb cannon's.
- Cannon fire times are NOT 0.8/3.1 s: a burst was at the squires by 1050 ms. Measure with a probe before timing stills.
- Gap 5: _applyCrowdLean snaps to pure pitch or roll; add a per-unit yaw/roll offset so neighbours don't land parallel.
- Gap 6: RAGDOLL_PROFILES heavy/boss cleanupDelaySeconds 7/8 -> 90 (light/medium already 90).
- Digest error: trailer_3_sheet_03 row 3 is another game's trailer; usable tiles are r1c1-r2c1.
