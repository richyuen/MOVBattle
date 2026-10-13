# Loop state
Iteration: 152   Last re-audit: 150   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- muzzle-smoke-equal-lobes f6883bc — APPROVE
- battle-cam-fov 99f033b — APPROVE
- bomb-cannon-perched f86c6fa — APPROVE
- run-stride-short 81e5c22 — APPROVE
- run-arms-tidy 7df9b9d — REJECT (reverted 1ff4cd9)
- tunic-trousers-one-navy 17087a8 — APPROVE
- crew-hoops-pale f5d5bee — APPROVE
- impact-dust-house-sphere 783dd5e — REJECT (reverted ecb8dbd)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: muzzle-smoke-equal-lobes (f6883bc) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: battle-cam-fov (99f033b) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: bomb-cannon-perched (f86c6fa) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: run-stride-short (81e5c22) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: run-arms-tidy (7df9b9d) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tunic-trousers-one-navy (17087a8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crew-hoops-pale (f5d5bee) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: impact-dust-house-sphere (783dd5e) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-dust-house-sphere: pale ball on an equal orange ball, 2.5 men tall; lobeSizes[1]/[3] 1.0/0.9 to 0.6/0.55 [attempts: 2] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
2. [battle-feel] run-arms-tidy: arms never stand off the ribs; add a constant 0.3 rad outward shoulder z (opposite sign per side) under the wobble [attempts: 1] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
3. [battle-feel] front-lines-no-pile: lines stand in contact, no two-deep pile or overlapping shields [attempts: 0] — ref: trailer_3_sheet_01 r1c1 — ours: big_melee_5s.png
4. [camera] standoff-cam-fov: crews a sixth of frame under 55% sky; fov 0.65 in the center.near branch of swoopToBattle [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
5. [unit-look] bomb-cannon-above-wheels: buildBombCannon barrel/bands/round/sockets down a further 0.08 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [unit-look] crew-hoops-violet: hoopMat to (0.58,0.45,0.42), capMat darken 0.45 to 0.8 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
7. [vfx] muzzle-smoke-equal-lobes: 3-5 of 8 lobes show; place lobes 1-7 at reach 0.24*scale in random directions, not the 0.2 box [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
8. [unit-look] armoured-legs-one-navy: cool armoured leg shade x0.75 against the tunic [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, the equal foot lobes make it a snowman
- run-arms-tidy [attempts: 1] — wobble*6: a signed sine swings the arm in through the torso, unseen side-on
- muzzle-smoke-equal-lobes [attempts: 1] — small lobes 0.18-0.48, scatter 0.2 under a 0.6 lead: half sat inside the lead
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: no change, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: a bigger static offset is still a frozen pose
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Edit with anchored sed, check `git diff`. The standoff fit() and spanRadius /0.6 assume fov 0.8.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14: do not raise) also drives lineups. Mammoth is cut at the right edge. CLOTH_SHADE also darkens armour.
- Live: stride 0.6-0.85; melee fov 0.65 (restored for placement/victory), pitchUp 0.2, clearRadius depth+6.0; fireScale cap 1.6; smoke lead 0.48, small 0.18-0.48, scatter 0.2; hoops (0.60,0.50,0.68); bomb barrel y 0.60; cool unarmoured legs = skin x TROUSER_SHADE 0.68.
