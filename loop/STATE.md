# Loop state
Iteration: 147   Last re-audit: 145   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- walk-ranks-bow a860310 — REJECT (reverted)
- rear-ranks-stand-upright 6b0e095 — APPROVE
- armour-navy-vs-teal 24ac6c6 — REJECT (reverted)
- mammoth-stilt-legs — not attempted: misread, spent
- catapult-crew-bare e7ecd3b — APPROVE
- muzzle-puff-detached a43e3ce — APPROVE
- spear-point-pin e78e9b7 — APPROVE
- witch-band-thread 8d71c58 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: walk-ranks-bow (a860310) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: rear-ranks-stand-upright (6b0e095) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: armour-navy-vs-teal (24ac6c6) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: catapult-crew-bare (e7ecd3b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-puff-detached (a43e3ce) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: spear-point-pin (e78e9b7) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: witch-band-thread (8d71c58) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] walk-ranks-bow: three pitches stack; redo walk torso 0.55 to 0.38 AND runtimeUnit.ts _applyCrowdLean clamp targetLeanX +/-0.34 to +/-0.18 (~L1054) [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
2. [unit-look] armour-navy-vs-teal: the navy mass is the surcoat; unitFactory.ts COOL_ARMOUR_HUE_SHIFT 30 to 12 AND COOL_TABARD_SHADE 0.6 to 0.78, COOL_TABARD_HUE_SHIFT 15 to 6 [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
3. [vfx] muzzle-smoke-one-ball: projectileSystem.ts smokeLife 1.5 to 3.0 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
4. [unit-look] spear-tip-dark: propBuilder.ts spear tip Color3(0.35,0.35,0.4) to (0.6,0.6,0.65) [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_2s.png
5. [battle-feel] idle-arms-hang-dead: _animateIdleHumanoid shoulder rotation.x p.side * 0.22 to * 0.4 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
6. [unit-look] witch-hat-black: propBuilder.ts witch cone Color3(0.15,0.13,0.2) to teamColor * 0.55 when passed [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: closeup_state_reads.png
7. [unit-look] crew-hoops-grey: vehicleBuilder.ts dressCannonCrew hoopMat (0.5,0.42,0.52) to (0.55,0.36,0.24) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [battle-feel] shove-walk-share: proceduralAnimation.ts shove overlay ~L337 walking share p.pitch * 0.5 to * 0.3 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- armour-navy-vs-teal [attempts: 1] — plate shift 12 alone: knight still navy, the surcoat (COOL_TABARD_*) is the dark mass
- walk-ranks-bow [attempts: 1] — torso 0.38 alone: rank still pitched ~40 deg, root crowd lean and shove pitch stack on it
- mammoth-stilt-legs [attempts: 2] — never coded: lever was buildMinotaur; mammoth legs are 0.76/0.62 fur, the stilts are clubbers' clubs
- rear-ranks-stand-upright [attempts: 1] — lean 0.32+h*0.2: idle heroes bowed ~35 deg and half squatted
- catapult-operator-miniature [attempts: 2] — wrapAsBody tinted the whole machine team blue
- cones-brimless-straight [attempts: 2] — the TABS wizard hat IS broad and kinked
- lineup-units-small [attempts: 2] — preset radius is dead, the scenario override wins
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still fills frame

## Notes for next iteration (max 5 lines)
- Spent (never retry): impact burst, mammoth hide/launch/hat/tusks/trample/legs, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders, fireball lobes, grass tufts, presser lean, airborne sit, clouds, far ridge, corpses, idle legs, downed bodies, empty hud, witch brim/kink, lineup camera, spear length, catapult operator size/base, streak length, red skin shade. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`. Critic levers can be wrong (wrong unit, one of several stacked terms): grep and check last PNGs first. Match sed on text, check `git diff`.
- wrapAsBody team-tints every mesh sharing its 3rd arg's material. Idle lean (now 0.26+h*0.14, sag *0.2: do not raise) also drives lineups and close-ups.
- Live: spear shaft 0.024, tip 0.05/0.18 at y 0.59; witch band 0.125/0.022; smoke offset 0.15; COOL_CLOTH_HUE_SHIFT 8.
