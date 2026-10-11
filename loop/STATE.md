# Loop state
Iteration: 13   Last re-audit: 10   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- blast-flings-nobody 8fd386f + d0f2635 — APPROVE (battle-feel 2->2)
- burst-fog-not-fireball 84e6e10 — APPROVE (vfx 2->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blast-flings-nobody (8fd386f) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: burst-fog-not-fireball (84e6e10) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] cannon-ball-and-impact-burst: no ball visible in flight; white muzzle fog blob out-shouts the fireball [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [battle-feel] blast-bodies-one-plane: flung bodies share one height, heading and rigid pose, no tumble; corpses get no spin [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [vfx] fireball-small-and-pale: ball ~1 body tall, pumpkin/cream; want 2-3 bodies, yellow-white core, smaller and more chunks [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
4. [battle-feel] lines-upright-rows: front lines stay upright spaced rows, no compression, nobody airborne beside the mammoth [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_5s.png
5. [battle-feel] downed-parallel-boards: downed bodies are parallel rigid boards, heads off the ground [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [battle-feel] heavy-corpses-vanish: heavy/boss corpses despawn; corpses never stack [attempts: 0] — ref: tabs_screenshot_09 — ours: big_melee_result.png
7. [unit-look] props-small-squires-purple: props undersized, bodies stiff cylinders; squires dark purple with red heads [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
8. [ui-flow] tray-text-pills: text pills + search box, not an arc of icon tiles [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff; still times guessed
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty

## Notes for next iteration (max 5 lines)
- war_machines blasts land at ~830/3580 ms (50 ms probe); stills are 1100/3800. Re-probe if fire timing changes.
- Gap 2: RuntimeUnit.applyBlastLaunch: vary lift ±35% per unit id, add tumble spin about the axis across `outward`, dead too.
- Gap 3: VisualEffects.spawnExplosionBurst core 1.7 -> ~2.6 x scale, 20 half-size chunks. Fully emissive mats bloom to white.
- Sideways fling over ~3 m/s or re-launching airborne bodies fails battle_recap_result_legacy_tank_shell (shells miss).
- Gap 6: RAGDOLL_PROFILES heavy/boss cleanupDelaySeconds 7/8 -> 90; needs a heavy that dies on camera.
