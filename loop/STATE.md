# Loop state
Iteration: 157   Last re-audit: 155   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- melee-giant-crop 52475b8 — APPROVE
- kite-board-flat-blue 4fa0e89 — APPROVE
- catapult-bucket-tiny 6247cf8 — APPROVE
- catapult-goalpost bc05985 — REJECT (reverted a64bebd)
- thor-hammer-plain-box 1ac46e5 — REJECT (reverted c19f9c9)
- catapult-wheel-black 1114126 — REJECT (reverted b2b63e1)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: melee-giant-crop (52475b8) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: kite-board-flat-blue (4fa0e89) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-bucket-tiny (6247cf8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-goalpost (bc05985) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: thor-hammer-plain-box (1ac46e5) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-wheel-black (1114126) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] catapult-wheel-black: flat discs; keep wheelWood, add a dark torus rim + hub per the cannon (vehicleBuilder ~696-715), face in `wood` [attempts: 1] — ref: tabs_screenshot_08 — ours: lineup_medieval.png
2. [unit-look] thor-hammer-plain-box: head skin-blue, torso-sized; one dark collar at x=0 (0.06*s), stoneMat fixed pale (0.85,0.82,0.78), head ~30% smaller [attempts: 1] — ref: trailer_2_sheet_03 r1c3 — ours: closeup_pair_zeus_thor.png
3. [unit-look] catapult-goalpost: upright A with a pale team block; arm rot -0.4 to ~-0.1 (lower bucket, boulder, sockets), cw dark [attempts: 1] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
4. [unit-look] catapult-tray-slab: blue-grey slab, small ball; bucket.material = wood, boulder 0.45 to 0.65 [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
5. [camera] giant-rump-off-right: hindquarters off the right edge at 2 s; computeBattleFocus x biased toward the tallest unit [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [camera] battle-flat-profile: dead side-on view; swoopToBattle alpha -PI/2 to ~-PI/2.3 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
7. [unit-look] kite-no-rim: no edge band, electric blue; thin pale rim mesh behind the kite board [attempts: 0] — ref: trailer_2_sheet_03 r2c3 — ours: lineup_medieval.png
8. [camera] result-foreground-club: club and cropped tusk fill the result shot; result radius +2 m [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- catapult-wheel-black [attempts: 1] — lit (0.3,0.2,0.13) + wood hub: putty discs lighter than the frame, hub invisible; wheels must stay darker than the deck
- thor-hammer-plain-box [attempts: 1] — dark end caps: inverted (ref is pale faces, dark middle); head still skin-blue
- catapult-goalpost [attempts: 1] — posts 0.75, cw 0.3 cube: the raised arm sets the height, team block still pale
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman
- run-arms-tidy [attempts: 1] — wobble*6: arm swings in through the torso
- cloth-teal-vs-plate [attempts: 1] — hue shift 8 to 4: no change, teal came from the accent lerp

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs/flung, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), grass tufts, airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour, impact dust, hoop colour, smoke diameters. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Files are CRLF: patch with a node script that joins lines on the file's own newline. Commit one file with `git commit <path> -F -`.
- wrapAsBody's 3rd arg (and meshes sharing its material) is recoloured to the team colour at unitFactory:359, so scaling it is a no-op: darken by using another material. Idle lean (0.26+h*0.14: do not raise) also drives lineups. CLOTH_SHADE also darkens armour. Wood lerped with team blue goes grey.
- Live: FOLLOW_DROP 0.9 (do not raise), clearRadius depth + max(6.0, tall*1.35/0.58) when tall > 3 (men-only stays 6.0), melee target.y is set in the else branch (1.6 + r*sin 0.2); cool shield hue +15 sat 0.95 value*0.72; catapult: arm rot -0.4 at y 1.65, tray 0.5x0.16x0.45 at (0,2.05,0.95) + 0.45 boulder, cw team main mesh, wheels dark; hammerhead 0.22x0.14x0.14.
