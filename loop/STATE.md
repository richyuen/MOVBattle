# Loop state
Iteration: 155   Last re-audit: 155   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- catapult-team-slab a60dc59 — REJECT (reverted 9f1ae9a)
- thor-hammer-black 0e4d01d — APPROVE
- melee-feet-cut 3a2f10c — APPROVE
- kite-board-violet 9c74af8 — APPROVE
- catapult-arm-twig 9dc7811 — APPROVE
- catapult-wheels-small f439a59 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: catapult-team-slab (a60dc59) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: thor-hammer-black (0e4d01d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: melee-feet-cut (3a2f10c) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: kite-board-violet (9c74af8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-arm-twig (9dc7811) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-wheels-small (f439a59) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] catapult-bucket-floats: bucket hangs in mid-air over the arm; buildCatapult `arm.rotation.x = 0.4` to -0.4 [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
2. [unit-look] catapult-wood-khaki: frame is khaki-olive; `wood` to the cannon's red-brown `get("wood", (0.36,0.13,0.09), {emissive (0.08,0.04,0.035)})` (buildCannon) [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
3. [unit-look] catapult-team-slab: deck is a flat team-blue slab; it is the tinted main mesh, so pass a BIG team part (cw box 0.2 to 0.4+) as main and make the deck plain `wood` [attempts: 1] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
4. [camera] melee-giant-crop: mammoth runs out of the top and right; swoopToBattle `clearRadius = (center.depth ?? 0) + 6.0` to 6.8 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [unit-look] thor-hammer-small-head: near-cubic head on a long haft; `hammerhead` width 0.14 to 0.22, height and depth 0.1 to 0.14 [attempts: 0] — ref: trailer_2_sheet_03 r1c3 — ours: closeup_pair_zeus_thor.png
6. [unit-look] catapult-crossbar-thin: crossbar thinner than its posts; height/depth 0.1 to 0.16 [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
7. [unit-look] catapult-wheel-plain: wheels the frame's colour; wheel.material to `makeMat(scene, new Color3(0.2, 0.14, 0.09))` [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
8. [unit-look] kite-board-flat-blue: boards a flat primary blue brighter than the cloth; buildShield cool `Math.max(teamHsv.g, 0.95)` to 0.8 [attempts: 0] — ref: trailer_1_sheet_01 r1c3 — ours: closeup_state_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- catapult-team-slab [attempts: 1] — deck Lerp(wood, team, 0.3) is slate grey; main mesh moved to the 0.2 cw cube, unseen, so no team colour or state pulse shows
- run-arms-one-splay [attempts: 1] — phase +PI: right z = -(left), exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat, spacing is not the constraint
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, the equal foot lobes make it a snowman
- run-arms-tidy [attempts: 1] — wobble*6: a signed sine swings the arm in through the torso, unseen side-on
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: no change, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: a bigger static offset is still a frozen pose

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour, impact dust, hoop colour, smoke diameters. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Edit with anchored sed (never by line number), check `git diff`. Commit one file with `git commit <path> -F -`.
- wrapAsBody's 3rd arg is recoloured to the team colour by applyMaterialPreset whatever material it was built with, as is every mesh sharing it. Idle lean (0.26+h*0.14: do not raise) also drives lineups. CLOTH_SHADE also darkens armour. Wood lerped with team blue goes grey.
- Live: run shoulder z -/+0.3 + wobble*3.5, right +1 rad; ally minDistance 0.9, braced 0.8; FOLLOW_DROP 0.9 (do not raise: giants crop); standoff fit /0.48; cool shield hue +15; catapult arm/posts 0.16, wheels 0.7 at x 0.58.
