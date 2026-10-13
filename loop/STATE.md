# Loop state
Iteration: 149   Last re-audit: 145   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- impact-dust-house-sphere 9767b5c — REJECT (reverted)
- shove-walk-share 41c9dc0 — APPROVE
- muzzle-smoke-one-ball 09b88e5 — APPROVE
- cloth-teal-vs-plate 868ed36 — REJECT (reverted)
- crew-hoops-grey b01b721 — APPROVE
- idle-arms-hang-dead a7ce9db — APPROVE
- battle-cam-crops-mammoth cbfa021 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: impact-dust-house-sphere (9767b5c) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: shove-walk-share (41c9dc0) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: muzzle-smoke-one-ball (09b88e5) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cloth-teal-vs-plate (868ed36) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crew-hoops-grey (b01b721) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: idle-arms-hang-dead (a7ce9db) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-cam-crops-mammoth (cbfa021) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-dust-house-sphere: the house ball IS the fireball; spawnExplosionBurst fireScale min(scale*2.0,3.6) to min(scale*0.9,1.5), foot lobeSizes[1]/[3] 1.0/0.9 to 0.5/0.45 [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [unit-look] cloth-teal-vs-plate: archer/staff/king cloth teal beside navy plate; unitFactory.ts ~line 217 skip the accent lerp for cool skin (or CLOTH_ACCENT_WEIGHT 0.2 to 0.05) [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
3. [battle-feel] walk-lean-shared: a charging rank shares one 35-degree lean; scale walking torso pitch (0.38) per unit 0.4-1.0 from the pose hash [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
4. [camera] battle-cam-bare-foreground: bottom quarter bare grass, no-giant fights read small; clearRadius +7.5 only with a giant (else 5.5), lower target height [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [vfx] muzzle-smoke-balloons: lobes split into equal balls clear of the gun; lateral drift 1.2 to 0.5, forward 0.1 + 0.5*(i/7) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
6. [unit-look] crew-hoops-count: four grey-violet hoops, no sleeve stripes; five hoops [0.04,0.2,0.36,0.52,0.68] height chest.y*0.16, hoopMat tan (0.55,0.42,0.32) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
7. [battle-feel] idle-forearm-shelf: Thor's forearm a flat shelf, lineup arms near straight; elbow 0.9-1.2, leading shoulder offset 0.22 to 0.35 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
8. [battle-feel] mammoth-no-launch: no bodies airborne at mammoth contact [attempts: 2, spent] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- impact-dust-house-sphere [attempts: 1] — shrank burstDust only: not visible, the mound is buried in the fireball foot lobes
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: tunic pixel unchanged, the teal comes from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): rejected in 148 as "ref stripes ARE mauve-grey"; 149 critic now asks tan
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: not visible, a bigger static offset is still a frozen pose
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked
- lineup-units-small [attempts: 2] — preset radius is dead, the scenario override wins
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still fills frame

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera, spear length, catapult operator size/base, streak length, red skin shade. Fireball lobe layout/colour was spent; gap 1 only scales it. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep and check last PNGs first. Edit with pattern-anchored sed (line numbers drift), check `git diff`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14, sag *0.2: do not raise) also drives lineups and close-ups.
- Live: walk torso 0.38; shove pitch a third -0.08..0.04, rest 0.1..0.35 (cap 0.6); idle elbow 0.8-1.4, sway wobble*4; smoke life 3.0 + per-lobe drift; 4 crew hoops (0.56,0.46,0.52); melee clearRadius depth+7.5; COOL_CLOTH_HUE_SHIFT 8.
