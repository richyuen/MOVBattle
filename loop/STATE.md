# Loop state
Iteration: 153   Last re-audit: 150   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- run-arms-tidy d0b5429 — APPROVE
- front-lines-no-pile bca3276 — APPROVE
- standoff-cam-fov ac85562 — APPROVE
- bomb-cannon-above-wheels 67818b9 — APPROVE
- crew-hoops-violet e531a43 — APPROVE
- muzzle-smoke-equal-lobes 8a1f54c — APPROVE
- armoured-legs-one-navy 85946ab — REJECT (reverted 623606b)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: run-arms-tidy (d0b5429) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: front-lines-no-pile (bca3276) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: standoff-cam-fov (ac85562) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: bomb-cannon-above-wheels (67818b9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crew-hoops-violet (e531a43) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-equal-lobes (8a1f54c) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: armoured-legs-one-navy (85946ab) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] standoff-crews-cut: crews on the frame edges, seen from above; multiply the standoff fit radius by 1.25 for the 0.65 lens and lower the eye [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
2. [battle-feel] mammoth-launches-nobody: no bodies airborne or dead at the line; mammoth launch is spent, see Notes [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [unit-look] armoured-legs-one-navy: legs must match the tunic; give cool armoured units a neutral grey boot (0.40,0.42,0.46), no leg darkening [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: lineup_medieval.png
4. [vfx] muzzle-smoke-golf-balls: equal pale balls in a round bunch; small lobes 0.14-0.30, lead 0.6, keep the 0.24 offset [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
5. [battle-feel] shields-never-lap: bracedRank 0.8 to 0.7 in minDistance, leave the 0.9 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
6. [unit-look] crew-hoops-cool-grey: hoopMat to (0.66,0.50,0.36) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
7. [vfx] impact-dust-house-sphere: smooth pale spheres on a peach ball; flat-shade the blast, saturated yellow-orange [attempts: 2] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
8. [battle-feel] run-arms-one-splay: both arms at one locked splay; shoulder z wobble phases half a cycle apart, not +1 rad [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- armoured-legs-one-navy [attempts: 1] — legs x0.75: near-black navy; TABS legs match the tunic, split by a pale hem and grey boots
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, the equal foot lobes make it a snowman
- run-arms-tidy [attempts: 1] — wobble*6: a signed sine swings the arm in through the torso, unseen side-on
- muzzle-smoke-equal-lobes [attempts: 1] — small lobes 0.18-0.48, scatter 0.2 under a 0.6 lead: half sat inside the lead
- cloth-teal-vs-plate [attempts: 1] — COOL_CLOTH_HUE_SHIFT 8 to 4: no change, the teal came from the accent lerp
- crew-hoops-grey [attempts: 1] — brown (0.55,0.36,0.24): "ref stripes ARE mauve-grey"
- idle-arms-hang-dead [attempts: 1] — shoulder offset 0.4: a bigger static offset is still a frozen pose
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, grass tufts, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, fireball colour. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong: grep first. Edit with anchored sed (never by line number), check `git diff`. Standoff fit() /0.6 still assumes fov 0.8; x1.25 gives the old crew size back.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (0.26+h*0.14: do not raise) also drives lineups. Mammoth is cut at the right edge. CLOTH_SHADE also darkens armour. Cool armoured legs are already plate x0.68.
- Live: run shoulder z -/+0.3 + wobble*3.5; ally minDistance 0.9, braced 0.8; both battle fovs 0.65; fireScale cap 1.6; smoke lead 0.48, small 0.18-0.48 at reach 0.24, drift 0.2; hoops (0.58,0.45,0.42), cap darken 0.8; bomb barrel y 0.52.
