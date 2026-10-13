# Loop state
Iteration: 151   Last re-audit: 150   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- battle-cam-distance 8b87b16 — APPROVE
- cloth-skin-one-tone 69e0bb5 — APPROVE
- cannon-barrel-perched fe1e89d — APPROVE
- muzzle-smoke-equal-lobes 59678a4 — REJECT (reverted 6ccd06a)
- walk-lean-upright 814a6e2 — APPROVE
- crew-hoops-raised ddb0b4c — APPROVE
- impact-dust-house-sphere 643bc81 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: battle-cam-distance (8b87b16) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: cloth-skin-one-tone (69e0bb5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-barrel-perched (fe1e89d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-equal-lobes (59678a4) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: walk-lean-upright (814a6e2) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: crew-hoops-raised (ddb0b4c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: impact-dust-house-sphere (643bc81) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] muzzle-smoke-equal-lobes: one big ball with crumbs; spawnMuzzleFlash lead lobe 0.6 to 0.48, with small lobes 0.18+rand*0.3 and scatter 0.2 [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
2. [camera] battle-cam-fov: front rank a quarter of frame, sky over half; swoopToBattle camera.fov 0.8 to 0.65 in battle, restored with the prebattle view [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
3. [unit-look] bomb-cannon-perched: barrel at crew head height; buildBombCannon barrel/bands y 0.69 to 0.60, round 0.72 to 0.63, sockets 0.78/0.76/0.72 to 0.69/0.67/0.63 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
4. [battle-feel] run-stride-short: _buildShovePose stride 0.45+h(10)*0.2 to 0.6+h(10)*0.25 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: big_melee_2s.png
5. [battle-feel] run-arms-tidy: arms pump at the ribs; walk shoulder z wobble*3.5 to wobble*6 [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
6. [unit-look] tunic-trousers-one-navy: unitFactory.ts leg cloth shade about 0.65 beside CLOTH_SHADE 0.8 [attempts: 0] — ref: trailer_1_sheet_01 r1c3 — ours: big_melee_5s.png
7. [unit-look] crew-hoops-pale: dressCannonCrew hoopMat to (0.60,0.50,0.68), keep girth 1.03 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [vfx] impact-dust-house-sphere: two-tier ball 2.5 men tall; fireScale cap 1.6 to 1.35, scale only [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-equal-lobes [attempts: 1] — small lobes 0.18-0.48, scatter 0.2 under a 0.6 lead: half of them sat inside the lead lobe
- impact-dust-house-sphere [attempts: 1] — shrank burstDust only: not visible, buried in the fireball foot lobes
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: no change, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: a bigger static offset is still a frozen pose
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked
- lineup-units-small [attempts: 2] — preset radius is dead, the scenario override wins

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera, spear length, catapult operator size/base, streak length, red skin shade, fireball lobe layout/colour (scale only). Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first (melee cam is pitchUp + eye 1.6 in the else branch; vehicle scale also scales crew). Edit with anchored sed, check `git diff`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14: do not raise) also drives lineups. clearRadius 5.5 cropped the mammoth; it is still cut at the right edge at 6.0. CLOTH_SHADE also darkens armour.
- Live: walk torso 0.28-0.54; melee pitchUp 0.2, clearRadius depth+6.0, fov unset; fireScale cap 1.6; smoke lead 0.6, small 0.3-0.49, scatter 0.3; hoops 1.03 girth (0.74,0.66,0.72); cannon barrel y 0.44; CLOTH_SHADE 0.8.
