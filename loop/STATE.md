# Loop state
Iteration: 150   Last re-audit: 150   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- impact-dust-house-sphere a52fc86 — APPROVE
- blue-skin-pale 9d24c62 — APPROVE
- battle-cam-bare-foreground 23f632b — APPROVE
- walk-lean-shared a780e52 — APPROVE
- cloth-teal-vs-plate 964c9e2 — APPROVE
- cannon-dwarfs-crew 9c8a59d — APPROVE
- muzzle-smoke-balloons d11bb82 — APPROVE
- crew-hoops-count 8dd40f2 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: impact-dust-house-sphere (a52fc86) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: blue-skin-pale (9d24c62) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: battle-cam-bare-foreground (23f632b) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: walk-lean-shared (a780e52) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: cloth-teal-vs-plate (964c9e2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-dwarfs-crew (9c8a59d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-balloons (d11bb82) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: crew-hoops-count (8dd40f2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] battle-cam-distance: men are a quarter of frame height; cameraController.ts clearRadius +7.5 to +6.0 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
2. [unit-look] cloth-skin-one-tone: tunic the same value as skin; unitFactory.ts CLOTH_SHADE 1.0 to 0.8 [attempts: 0] — ref: trailer_1_sheet_01 r1c3 — ours: lineup_medieval.png
3. [unit-look] cannon-barrel-perched: barrel rides above the wheels; buildCannon barrel/band/knob/muzzle/socket y 0.52 to 0.44, cheek y 0.49 to 0.43 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
4. [vfx] muzzle-smoke-equal-lobes: equal, separate lobes; spawnMuzzleFlash diameter 0.3+rand*0.19 to 0.18+rand*0.3, scatter 0.3 to 0.2 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
5. [battle-feel] walk-lean-upright: some runners near upright; walk lean 0.16+frac*0.3 to 0.28+frac*0.26 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: big_melee_2s.png
6. [unit-look] crew-hoops-raised: hoops are raised dark rings; dressCannonCrew girth *1.1 to *1.03, hoopMat (0.56,0.46,0.52) to (0.74,0.66,0.72) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
7. [vfx] impact-dust-house-sphere: burst still near three men tall; visualEffects.ts fireScale cap 2.0 to 1.6, scaling only [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- impact-dust-house-sphere [attempts: 1] — shrank burstDust only: not visible, the mound is buried in the fireball foot lobes
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: tunic pixel unchanged, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): rejected in 148 as "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: not visible, a bigger static offset is still a frozen pose
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked
- lineup-units-small [attempts: 2] — preset radius is dead, the scenario override wins
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still fills frame

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera, spear length, catapult operator size/base, streak length, red skin shade, fireball lobe layout/colour (scale only). Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first (melee cam is pitchUp + eye 1.6 in the else branch, not beta/target.y; vehicle scale also scales crew). Edit with anchored node scripts, check `git diff`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14, sag *0.2: do not raise) also drives lineups and close-ups. clearRadius 5.5 cropped the mammoth before pitchUp rose.
- Live: blue team (0.42,0.60,0.98); walk torso 0.16-0.46 hashed; melee pitchUp 0.2, clearRadius depth+7.5; fireScale min(scale*1.2,2.0); smoke drift 0.1-0.4 fwd, 0.5 lateral; 5 crew hoops; cannon wheel 0.44 on 0.24 axle; CLOTH_ACCENT_WEIGHT 0.05.
