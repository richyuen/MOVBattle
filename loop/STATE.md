# Loop state
Iteration: 98   Last re-audit: 95   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- grass-thin-scatter 0e8c8ea — REJECT (reverted fc56619)
- lightning-long-bands 2d42934 — APPROVE
- bucket-helm-tall 4c9f48a — REJECT (reverted 9f7ec47)
- cannon-crew-upright 28cf8d7 — APPROVE
- far-ridge-lit-faces-white 50ddbd1 — APPROVE
- victory-hint-font a752298 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-thin-scatter (0e8c8ea) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: lightning-long-bands (2d42934) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: bucket-helm-tall (4c9f48a) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-crew-upright (28cf8d7) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: far-ridge-lit-faces-white (50ddbd1) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: victory-hint-font (a752298) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] helm-wide-pale (was bucket-helm-tall): TABS helm is 1.25 times as tall as wide, head-width, mid blue steel with a gold cross; scaling (0.74, 0.95, 0.74), steel (0.45, 0.5, 0.58) [attempts: 2] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
2. [maps-light] grass-tufts-apart (was grass-thin-scatter): ground shows between tufts; per-blade scatter 0.08 to 0.35 m, `half` 0.02 to 0.045, BLADES stays 480000 [attempts: 2] — ref: tabs_screenshot_02 — ours: big_melee_2s.png
3. [vfx] lightning-band-edge-on: bolt a straight constant-width band, star oversized; zigzag axis square to bolt and camera view, amp floor 0.28 to 0.45, star radius x0.6 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
4. [battle-feel] cannon-operator-hands-air: pirate cannon operator touches nothing; addOperator z -0.42 toward -0.2 so the hand lands on the carriage; crew hunch at the waist, TABS is a straight-backed lean [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
5. [unit-look] cannon-crew-bare: crew are bare team-coloured bodies; TABS has striped shirt, brown trousers, cap [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [maps-light] clouds-cauliflower: tall stacks; TABS clouds are flat, stretched, level underside [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
7. [maps-light] far-ridge-cones: separate symmetric cones, cool shade faces; FAR_ROCK_SHADE to (0.4, 0.38, 0.36), FAR_ROCK_MIX to 0.22 [attempts: 0] — ref: trailer_3_sheet_01 r3c3 — ours: big_melee_2s.png
8. [unit-look] mammoth-plain: brown block, short straight tusks; TABS has long curved blue-tipped tusks, blue face paint, dark fur crest [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), steel (0.6, 0.66, 0.72): a wide near-white bin; the ref helm is tall and narrow, "squat" was wrong
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7, jitter 1: tuft spacing unchanged, ground still shows, no patch edge
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged, cloth desaturated
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands
- backdrop-peaks-ice-blue [attempts: 1] — FAR_ROCK warm brown: invisible under scene fog (ridges now fog-free)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head

## Notes for next iteration (max 5 lines)
- Spent (never retry): red-team-maroon/dusty, corpses-all-flat/identical-prone, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm and grass (gaps 1-2). Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Rendering: ACES tone mapping crushes material red; judge colours by sampled screen pixel. Rims were pipeline bloom (main.ts), not the glow layer.
- Units: TEAM_COLORS[1] must not be mutated. Crew pose is case "crew" in runtimeUnit (bomb cannon only); the pirate cannon's operator is a static pose in buildCannon's addOperator call.
- Lightning: zigzag `side` axis is Cross(dir, Up), amp at visualEffects line 82; star is two 3-sided discs (radius 0.5) under `lburst`, offset 0.5 m to the camera. Far ridge consts are at mapBuilder line 19.
- Edit with a byte-exact unique-string replace script (files are LF in the working copy); never line-number sed.
