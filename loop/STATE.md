# Loop state
Iteration: 158   Last re-audit: 155   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- catapult-wheel-black 5c260f9 — APPROVE
- thor-hammer-plain-box 0ffa0f6 — APPROVE
- catapult-goalpost 2b7fe9d — REJECT (rejected-kept)
- catapult-tray-slab c51ea7f — APPROVE
- giant-rump-off-right 770f0c9 — APPROVE
- battle-flat-profile 4013840 — REJECT (reverted 22e76bd)
- kite-no-rim 0bbe0f2 — APPROVE
- result-foreground-club 62de650 — REJECT (reverted 5fa15b0)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: catapult-wheel-black (5c260f9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: thor-hammer-plain-box (0ffa0f6) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-goalpost (2b7fe9d) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-tray-slab (c51ea7f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: giant-rump-off-right (770f0c9) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: battle-flat-profile (4013840) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)
- GAP: kite-no-rim (0bbe0f2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: result-foreground-club (62de650) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] battle-flat-profile: still a broadside frieze; melee `to.alpha` -PI/3 [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
2. [unit-look] catapult-goalpost: upright, no team colour; posts 1.0 to 0.6, crossbar/arm/rest down 0.4, `wood` 25% toward team [attempts: 2] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
3. [camera] result-foreground-club: mammoth cut at left, men small by empty grass; GIANT_SHY 1.0 to 2.0, sideOn 4.5 to 6.5 [attempts: 1] — ref: tabs_screenshot_02 — ours: big_melee_result.png
4. [unit-look] mammoth-legs-spikes: thin dark tapering legs; double diameter, no taper [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
5. [unit-look] club-log-pile: clubs longer than the man; clubHead height 0.35*s to 0.25*s, diameterTop 0.2*s to 0.14*s [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_5s.png
6. [vfx] cannon-impact-balls: smooth orange/cream balls; low-segment spheres, white-yellow core [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
7. [maps-light] grass-sparse: feet and bodies exposed; tuft density 2x [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
8. [camera] giant-lean-cuts-blue: blue rear cut at left; main.ts GIANT_LEAN 0.4 to 0.25 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- result-foreground-club [attempts: 1] — giant radius +2: giant back in at left, men small. Probed shy 1.6 too: men in left third by empty field
- battle-flat-profile [attempts: 1] — alpha -PI/2.3: 12 degrees, no visible recession
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height, no team colour
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman
- run-arms-tidy [attempts: 1] — wobble*6: arm swings in through the torso
- cloth-teal-vs-plate [attempts: 1] — hue shift 8 to 4: no change

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/flung, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), grass tufts (check before gap 7), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour, impact dust, hoop colour, smoke diameters. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Develop all gaps as JSON patches (CRLF-safe node script), probe once uncommitted with `capture.mjs --iter 9123 --showcase-only`, then `git checkout` and re-apply + commit per gap (`git commit <path> -F -`). Revert rejects newest first. Critic levers can be wrong: grep first.
- wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Idle lean (0.26+h*0.14: do not raise) drives lineups. CLOTH_SHADE also darkens armour. Wood lerped with team blue goes grey.
- Live: FOLLOW_DROP 0.9 (do not raise), clearRadius depth + max(6.0, tall*1.35/0.58), GIANT_LEAN 0.4; catapult: arm rot -0.1, wood tray at (0,1.78,0.99), 0.65 boulder, dark cw y 1.28, team mesh is an axle, wheels wood face + dark rim/hub; hammer head pale stone 0.155x0.1x0.1 + dark collar; kite rim pale.
