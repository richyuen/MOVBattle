# Loop state
Iteration: 145   Last re-audit: 145   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- lineup-units-small 03a70bd — APPROVE
- centre-line-neon acefef0 — APPROVE
- stuck-spears-forest cc73025 — APPROVE
- catapult-toy-size 09e38a5 — APPROVE
- cones-brimless-straight a213655 — REJECT (reverted)
- tunics-one-washed-teal 900325d — APPROVE
- muzzle-clump-small 63b1db0 — APPROVE
- spearheads-fat-shafts-thick 63d6297 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lineup-units-small (03a70bd) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: centre-line-neon (acefef0) VERDICT: APPROVE SCORE: maps-light 4/5 (previous: 4/5)
- GAP: stuck-spears-forest (cc73025) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: catapult-toy-size (09e38a5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cones-brimless-straight (a213655) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tunics-one-washed-teal (900325d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-clump-small (63b1db0) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: spearheads-fat-shafts-thick (63d6297) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] lineup-units-small: men ~14% of frame, empty grass below; scenarios.ts makeFactionGalleryScenario radius 10.5 to 8, target y 1.3 to 0.9, vehicles a double slot [attempts: 2] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
2. [unit-look] catapult-operator-miniature: crewman ~0.64 of a man on a flat team-blue slab; vehicleBuilder.ts addOperator scale param, 0.72 for the catapult; base teamPrimary to wood [attempts: 1] — ref: tabs_screenshot_03 / _08 — ours: lineup_medieval.png
3. [unit-look] spear-shafts-thick: held shafts ~10px poles, head no wider than shaft; propBuilder.ts spear shaft diameter 0.036*s to 0.024*s [attempts: 1] — ref: tabs_screenshot_02 — ours: big_melee_5s.png
4. [battle-feel] held-spears-upright-tall: held spears vertical at ~1.8x a man, ref ~1.5x slanted; propBuilder.ts shaft 1.0*s to 0.85*s (tip y 0.485, shaft y 0.075) [attempts: 2] — ref: tabs_screenshot_02 — ours: big_melee_5s.png
5. [unit-look] team-cloth-three-hues: teal tunics, navy tabards, periwinkle in one rank; unitFactory.ts CLOTH_HUE_SHIFT 18 to 8, cool branch only [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
6. [vfx] muzzle-puff-undersized: ~1.6 barrel-mouths wide; projectileSystem.ts lead lobe 0.44 to 0.6 * scale [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [unit-look] witch-band-hoop: band torus 0.16 floats round a ~0.13 cone; propBuilder.ts witchBand diameter 0.16 to 0.13, nothing else on the hat [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: closeup_state_reads.png
8. [battle-feel] rear-ranks-stand-upright: clubbers behind the mammoth bolt upright; proceduralAnimation.ts _buildIdlePose lean 0.22 + h*0.16 to 0.32 + h*0.2 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- cones-brimless-straight [attempts: 2] — witch_hat straight, brim 0.24: the TABS wizard hat IS broad and kinked; spent
- lineup-units-small [attempts: 1] — preset radius 16: dead for this shot, the scenario override wins
- stuck-spears-forest [attempts: 1] — body-stuck spears dropped flat on death
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still x~80-510, no sky
- impact-burst-glow-ball [attempts: 2] — a putty ball on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: lit side fell; the lit side is what is short
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft, 1 px hairline

## Notes for next iteration (max 5 lines)
- Spent (never retry, even if re-listed): impact burst colour/glow, mammoth hide/launch/mop-hat/tusks/trample, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, melee-no-downed-bodies, giant victory shot (any lever), empty-hud-zero-budget, witch hat brim/kink. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Muzzle smoke base (2.1,1.8,1.2) is at ref brightness.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min). Critic's named lever can be wrong: probe it (the spear "forest" was held spears, 1.25 x PROP_OVERSIZE 1.6). sed on `diameter: 0.34 * s` also hits cowboyBrim: check `git diff`.
- Lineup rank runs along Z (spacingZ 1.8, not spacingX); catapult is CATAPULT_SCALE 1.4 and already touches its neighbours. Thrown spear tip (projectileSystem.ts:522) is 0.05/0.14, held is 0.038/0.12.
- Shoulder rotation.x negative raises the arm. Projectile roots run along Z, positive rotation.x is nose down. HAT_OVERSIZE 1.3, TALL_HAT_OVERSIZE 1.6. Lineup "cones" are hood (healer) and hood_liripipe (archer).
