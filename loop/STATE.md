# Loop state
Iteration: 14   Last re-audit: 10   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- blast-bodies-one-plane 226e029 — APPROVE (battle-feel 2->2)
- fireball-small-and-pale 7b4fcde — APPROVE (vfx 3->3)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blast-bodies-one-plane (226e029) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: fireball-small-and-pale (7b4fcde) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] flung-bodies-rigid-and-low: stiff planks, apex ~1.5 bodies, no limb splay; some near the ball stay standing [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [battle-feel] topple-plank-row: downed knights lean at one angle like dominoes; lines do not compress two deep [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_9s.png
3. [vfx] fireball-white-not-yellow: cream ball with orange discs, flat bottom, tan cubes hug it; want yellow mass, white heart, ragged edge, dark lumps thrown clear [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
4. [unit-look] capsule-limbs-ball-joints: smooth glossy tubes with ball hands/feet; want faceted matte, mitt hands [attempts: 0] — ref: tabs_screenshot_08 — ours: big_melee_5s.png
5. [unit-look] red-team-squires-read-black: red squires dark maroon/black, only hands red [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: war_machines_1100ms.png
6. [vfx] lightning-thin-line: thin zigzag plus soft orb; want fat jagged white polygons [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
7. [maps-light] clouds-blurred-smears: soft blurred clouds, smooth cone trees; want hard low-poly puffs, faceted trees [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
8. [ui-flow] tray-text-pills: text pills + search box, result band has a stats paragraph [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff; still times guessed
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo remains
- camera-spread-radius [attempts: 1] — both-teams bbox backs the camera off; sparse fights still empty

## Notes for next iteration (max 5 lines)
- Iteration 15 is a re-audit. war_machines stills at 1100/3800 ms; re-probe if lift or fire timing changes.
- Gap 1: RuntimeUnit.applyBlastLaunch lift band `0.65 + 0.7 * spread(1)` -> `1.1 + 0.8 * spread(1)`; limb splay after.
- Gap 3: spawnExplosionBurst: hotMat on the 2.7 m lobe, coreMat on a ~1.4 m forward lobe; soot chunks, more lift.
- Sideways fling over ~3 m/s or re-launching airborne bodies fails battle_recap_result_legacy_tank_shell.
- heavy-corpses-vanish (RAGDOLL_PROFILES heavy/boss cleanup 7/8 -> 90) skipped: no heavy dies in big_melee.
