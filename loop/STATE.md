# Loop state
Iteration: 146   Last re-audit: 145   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- catapult-operator-miniature 3a85af5 — REJECT (reverted)
- spear-shafts-thick 18f39ec — APPROVE
- team-cloth-three-hues 8e44eac — APPROVE
- muzzle-puff-undersized 33f2244 — APPROVE
- witch-band-hoop 9fdf3f9 — APPROVE
- rear-ranks-stand-upright ce9e77f — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: catapult-operator-miniature (3a85af5) VERDICT: REJECT SCORE: unit-look 2/5 (previous: 3/5)
- GAP: spear-shafts-thick (18f39ec) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: team-cloth-three-hues (8e44eac) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-puff-undersized (33f2244) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: witch-band-hoop (9fdf3f9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: rear-ranks-stand-upright (ce9e77f) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] walk-ranks-bow: advancing ranks all bow ~40 deg in unison; proceduralAnimation.ts _animateWalkHumanoid torso.rotation.x 0.55 to 0.38 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
2. [battle-feel] rear-ranks-stand-upright: some rear clubbers still vertical; _buildIdlePose lean 0.22+h*0.16 to 0.26+h*0.14 and sag = p.lean * 0.4 to * 0.2 [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
3. [unit-look] armour-navy-vs-teal: armour hue 216-220 beside cloth 193-201; unitFactory.ts COOL_ARMOUR_HUE_SHIFT 30 to 12 [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
4. [unit-look] mammoth-stilt-legs: vehicleBuilder.ts ~L1396 uleg diameters 0.14/0.12 to 0.24/0.2, lleg 0.11/0.09 to 0.18/0.16 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [unit-look] catapult-crew-bare: crewman a bare washed mannequin; buildCatapult addOperator pose callback calling dressCannonCrew(scene, body, color) as the cannon does (~L749) [attempts: 0] — ref: tabs_screenshot_08 — ours: lineup_medieval.png
6. [vfx] muzzle-puff-detached: clump hangs a barrel-width clear of the muzzle; projectileSystem.ts smoke offset direction.scale(0.3 * scale) to 0.15 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [unit-look] spear-point-pin: propBuilder.ts spear tip height 0.12 to 0.18, diameterBottom 0.038 to 0.05 [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_result.png
8. [unit-look] witch-band-thread: propBuilder.ts witchBand thickness 0.012 to 0.022, diameter 0.13 to 0.125 [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: closeup_state_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- rear-ranks-stand-upright [attempts: 1] — lean 0.32+h*0.2: idle heroes and the lineup king bowed ~35 deg and half squatted
- catapult-operator-miniature [attempts: 2] — operator 0.72 + base to wood: size was right, but wrapAsBody tints every mesh sharing base.material, so the whole machine went team blue
- cones-brimless-straight [attempts: 2] — witch_hat straight, brim 0.24: the TABS wizard hat IS broad and kinked; spent
- lineup-units-small [attempts: 2] — preset radius 16: dead for this shot, the scenario override wins
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still x~80-510, no sky
- impact-burst-glow-ball [attempts: 2] — a putty ball on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: lit side fell; the lit side is what is short
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft, 1 px hairline

## Notes for next iteration (max 5 lines)
- Spent (never retry, even if re-listed): impact burst colour/glow, mammoth hide/launch/mop-hat/tusks/trample, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, melee-no-downed-bodies, giant victory shot, empty-hud-zero-budget, witch hat brim/kink, lineup camera, held spear length, catapult operator size/base. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min). Critic's named lever can be wrong: probe it. sed line numbers drift: match on text and check `git diff`.
- wrapAsBody(scene, root, base, ...) team-tints every mesh sharing its 3rd arg's material: never give that mesh the shared wood. Body root origin is at the feet. Idle lean also drives lineups and close-ups.
- Muzzle lobes: keep the rest at half to four fifths of the lead (0.6 / 0.3-0.49). Held spear shaft 0.024, tip 0.038/0.12. COOL_CLOTH_HUE_SHIFT 8, warm stays 18.
