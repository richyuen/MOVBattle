# Loop state
Iteration: 154   Last re-audit: 150   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- standoff-crews-cut 0917b37 — APPROVE
- armoured-legs-one-navy 07e3e0c — APPROVE
- muzzle-smoke-golf-balls d09da87 — APPROVE
- shields-never-lap 21b1dc7 — REJECT (reverted 1541162)
- crew-hoops-cool-grey 747155f — APPROVE
- run-arms-one-splay 06db992 — REJECT (reverted 8877703)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: standoff-crews-cut (0917b37) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: armoured-legs-one-navy (07e3e0c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-golf-balls (d09da87) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: shields-never-lap (21b1dc7) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: crew-hoops-cool-grey (747155f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: run-arms-one-splay (06db992) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] shields-carried-flat: shields lie flat like trays; in `_applyWalkBias` "braced" pin leftShoulder.x -0.35, leftElbow.x -0.5 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
2. [battle-feel] run-arms-one-splay: right shoulder z `sin(t*speed*1.7 + 2.1)`, a different frequency, never 0 or PI off [attempts: 1] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png
3. [unit-look] crew-trousers-black: dressCannonCrew trouserMat to (0.58,0.32,0.20) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
4. [unit-look] crew-cap-black-cone: capMat darken 0.8 to 0.35, cap=true for every gun crewman [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
5. [camera] standoff-crews-small: crews 1/5 frame high over bare grass; standoff radius cap 14 to 10, keep target.y 1.2 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [vfx] smoke-lobes-belted: identical belted spheres; random `smoke.scaling` (x/z 1-1.5, y 0.7-0.95) and rotation.y, no diameter changes [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [unit-look] knights-blue-slab: knee meshes to COOL_ARMOUR_BOOT; arm meshes to plate grey (0.62,0.64,0.70) [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: lineup_medieval.png
8. [maps-light] tree-crowns-squat: mapBuilder broadleaf `trunkHeight = height * 0.5` to 0.7 [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- run-arms-one-splay [attempts: 1] — phase +PI: right z = -(left), exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat, spacing is not the constraint
- armoured-legs-one-navy [attempts: 1] — legs x0.75: near-black navy (fixed since: plate legs, grey boots)
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, the equal foot lobes make it a snowman
- run-arms-tidy [attempts: 1] — wobble*6: a signed sine swings the arm in through the torso, unseen side-on
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: no change, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: a bigger static offset is still a frozen pose

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour, impact dust, hoop colour, smoke diameters. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Edit with anchored sed (never by line number), check `git diff`. Commit one file with `git commit <path> -F -`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14: do not raise) also drives lineups. Mammoth is cut at the right edge. CLOTH_SHADE also darkens armour.
- Live: run shoulder z -/+0.3 + wobble*3.5, right +1 rad; ally minDistance 0.9, braced 0.8; battle fovs 0.65; standoff fit /0.48, target.y max(1.2, eye 0.5); smoke lead 0.6, small 0.14-0.30 at 0.24; hoops (0.66,0.50,0.36).
