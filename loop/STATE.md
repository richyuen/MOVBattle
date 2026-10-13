# Loop state
Iteration: 148   Last re-audit: 145   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- walk-ranks-bow b1c3128 — APPROVE
- armour-navy-vs-teal d445980 — APPROVE
- muzzle-smoke-one-ball 0e2ee1f — REJECT (reverted)
- spear-tip-dark 509c0be — APPROVE
- idle-arms-hang-dead bce5be4 — REJECT (reverted)
- witch-hat-black 8346f65 — APPROVE
- crew-hoops-grey 7134094 — REJECT (reverted)
- shove-walk-share 272dc65 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: walk-ranks-bow (b1c3128) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: armour-navy-vs-teal (d445980) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-one-ball (0e2ee1f) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: spear-tip-dark (509c0be) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: idle-arms-hang-dead (bce5be4) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: witch-hat-black (8346f65) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crew-hoops-grey (7134094) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shove-walk-share (272dc65) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-dust-house-sphere: hit dust is a house-sized cream sphere on an orange dome; shrink impact smoke/dust diameters to ~40% and split into separate lobes [attempts: 0] — ref: trailer_3_sheet_03 r1c1-r2c1 — ours: war_machines_1100ms.png
2. [battle-feel] shove-walk-share: pressers lean at one angle; widen per-unit `pitch` in _buildShovePose (a third near zero or slightly negative) [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
3. [vfx] muzzle-smoke-one-ball: add per-lobe drift in the `f.smokeLife` update branch (0.4-0.6/s along fire direction + small lateral), life 3.0 [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
4. [unit-look] cloth-teal-vs-plate: unitFactory.ts COOL_CLOTH_HUE_SHIFT 8 to 4 [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
5. [unit-look] crew-hoops-grey: dressCannonCrew hoopMat to mauve (0.56,0.46,0.52), 3 hoops to 4-5 even ([0.06,0.26,0.46,0.66], height chest.y*0.2) [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [battle-feel] mammoth-no-launch: no bodies airborne at mammoth contact [attempts: 2, spent] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [battle-feel] idle-arms-hang-dead: _animateIdleHumanoid raise elbow fold (p.leftElbow/p.rightElbow) and shoulder sway wobble*2 to *4; keep offset 0.22 [attempts: 1] — ref: tabs_screenshot_06 left vikings — ours: closeup_pair_zeus_thor.png
8. [camera] battle-cam-crops-mammoth: pull the battle camera back a body length so both ranks and sky fit [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- shove-walk-share [attempts: 1] — walking share 0.3: rank still folds in unison, the angle is the shared p.pitch capped 0.6
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): moved away, the ref stripes ARE mauve-grey cloth, ~6 even bands
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: not visible, a bigger static offset is still a frozen straight-elbowed pose
- muzzle-smoke-one-ball [attempts: 1] — smokeLife 3.0 alone: a longer-lived ball, lobes only rise 0.3/s with no lateral motion
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked
- lineup-units-small [attempts: 2] — preset radius is dead, the scenario override wins
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still fills frame

## Notes for next iteration (max 5 lines)
- Spent (never retry): impact burst, mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, fireball lobes, grass tufts, presser lean, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera, spear length, catapult operator size/base, streak length, red skin shade. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep and check last PNGs first. Line-anchored sed, check `git diff`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14, sag *0.2: do not raise) also drives lineups and close-ups.
- Live: walk torso 0.38, crowd pitch clamp 0.18; COOL_ARMOUR_HUE_SHIFT 12, COOL_TABARD 6/0.78; spear tip steel 0.6; witch cone teamColor*0.55 (brim still dark); smoke offset 0.15.
