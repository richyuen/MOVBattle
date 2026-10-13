# Loop state
Iteration: 156   Last re-audit: 155   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- catapult-bucket-floats 0e916be — APPROVE
- catapult-wood-khaki f68f056 — APPROVE
- catapult-team-slab bc807c2 — APPROVE
- melee-giant-crop df4ea93 — REJECT (reverted d52bce0)
- thor-hammer-small-head 864b441 — APPROVE
- catapult-crossbar-thin 8afe56e — APPROVE
- catapult-wheel-plain 4f66eed — APPROVE
- kite-board-flat-blue 1efe824 — REJECT (reverted e56214a)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: catapult-bucket-floats (0e916be) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-wood-khaki (f68f056) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-team-slab (bc807c2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: melee-giant-crop (df4ea93) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)
- GAP: thor-hammer-small-head (864b441) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-crossbar-thin (8afe56e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-wheel-plain (4f66eed) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: kite-board-flat-blue (1efe824) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] melee-giant-crop: rearing mammoth cut top and right at 9 s; swoopToBattle target.y 1.5 to 2.2 and clearRadius 6.0 to 7.5 [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [unit-look] kite-board-flat-blue: board brighter than the tabard (value 0.68 vs 0.45); buildShield cool branch value teamHsv.b to teamHsv.b * 0.72 [attempts: 1] — ref: trailer_1_sheet_01 r1c3 — ours: lineup_medieval.png
3. [unit-look] mammoth-purple: mauve hide, coral straps; hide is spent [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
4. [unit-look] catapult-bucket-tiny: small empty box partway down the arm; bucket 0.25/0.12/0.2 to 0.5/0.16/0.45 at the arm tip (z ~0.95, y ~2.05) plus a dark 0.45 boulder [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
5. [battle-feel] mammoth-no-flung: nobody flung or lying under the mammoth; trample is spent [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [unit-look] catapult-goalpost: tall bare frame, pale team card floating in it; post height 1.0 to 0.75 (lower crossbar, arm, bucket, cw, sockets 0.25), cw to (0, 1.12, -0.62) 0.3 cube, color.scale(0.7) [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
7. [unit-look] thor-hammer-plain-box: skin-coloured box with a peen; dark end caps (0.03 x 0.16 x 0.16) at x +/-0.11*s, drop the peen [attempts: 0] — ref: trailer_2_sheet_03 r1c3 — ours: closeup_pair_zeus_thor.png
8. [unit-look] catapult-wheel-black: featureless near-black discs; wheelWood (0.2,0.14,0.09) to (0.3,0.2,0.13) plus a 0.2 hub in frame wood [attempts: 0] — ref: tabs_screenshot_08 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- kite-board-flat-blue [attempts: 1] — saturation floor 0.95 to 0.8: value, not saturation, makes it brighter than the cloth; not legible in closeup_state_reads
- melee-giant-crop [attempts: 1] — clearRadius 6.8: still cut top and right at 9 s; 0.8 more distance does nothing for a rearing giant
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman
- run-arms-tidy [attempts: 1] — wobble*6: arm swings in through the torso
- cloth-teal-vs-plate [attempts: 1] — hue shift 8 to 4: no change, teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown: "ref stripes ARE mauve-grey"

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour, impact dust, hoop colour, smoke diameters. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Edit with anchored sed, check `git diff`. Commit one file with `git commit <path> -F -`.
- wrapAsBody's 3rd arg (and every mesh sharing its material) is recoloured to the team colour. Idle lean (0.26+h*0.14: do not raise) also drives lineups. CLOTH_SHADE also darkens armour. Wood lerped with team blue goes grey.
- Live: FOLLOW_DROP 0.9 (do not raise), clearRadius 6.0 (7.5 once made men 1/4 frame), cool shield hue +15 sat 0.95; catapult: arm rot -0.4 at y 1.65 (+rot.x drops the +Z end), cw 0.36x0.44x0.4 team main mesh, deck/frame cannon wood, wheels dark; hammerhead 0.22x0.14x0.14.
