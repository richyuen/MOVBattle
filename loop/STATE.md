# Loop state
Iteration: 144   Last re-audit: 140   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- tunics-same-teal-and-dark c89cb41 — APPROVE
- hoods-and-cones-swallow-head 3d72b95 — APPROVE
- muzzle-lobes-apart d336f5d — APPROVE
- cones-brimless-straight 7df3225 — REJECT (reverted)
- spear-tips-gold b629807 — APPROVE
- stuck-spears-forest 7785be9 — REJECT (reverted)
- lineup-units-small 41722ea — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tunics-same-teal-and-dark (c89cb41) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: hoods-and-cones-swallow-head (3d72b95) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-lobes-apart (d336f5d) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cones-brimless-straight (7df3225) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: spear-tips-gold (b629807) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: stuck-spears-forest (7785be9) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lineup-units-small (41722ea) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] lineup-units-small: units ~90px; scenarios.ts makeFactionGalleryScenario cameraOverride radius 15/19 to 10/13 (it masks the preset) [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
2. [battle-feel] stuck-spears-forest: the standing shafts are ground misses; projectileSystem.ts ground branch, spears pitch 0.08 + vary * 0.15 and scaling.x/y * 0.5 [attempts: 1] — ref: tabs_screenshot_02 — ours: big_melee_result.png
3. [unit-look] cones-brimless-straight: witch_hat only: kinked tip (was approved in passing) and brim ~3x the head; never the shared hood [attempts: 1] — ref: trailer_3_sheet_02 r1c2 — ours: closeup_state_reads.png
4. [unit-look] tunics-one-washed-teal: tunics hue 194-200 at saturation ~0.5 beside 0.75 tabards; COOL_CLOTH_SATURATION 0.55 to 0.7 [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
5. [unit-look] spearheads-fat-shafts-thick: propBuilder.ts spear tip diameterBottom 0.055 to 0.038, height 0.16 to 0.12 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
6. [maps-light] centre-line-neon: thick glowing magenta line under gallery units; dim or hide it in gallery shots [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_pair_zeus_thor.png
7. [vfx] muzzle-clump-small: one barrel-mouth wide, one dominant sphere; secondary lobe diameter 0.15-0.26 to 0.22-0.36 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
8. [unit-look] liripipe-hood-party-cone: hood_liripipe diameterBottom 0.22 to 0.27, keep the 0.07 seat [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lineup-units-small [attempts: 1] — preset radius 16: dead for this shot, the scenario override wins
- stuck-spears-forest [attempts: 1] — body-stuck spears dropped flat on death: the forest is ground misses
- cones-brimless-straight [attempts: 1] — brim and tip on shared "hood": healer and 14 others became wizards
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5, shy 0.8: tusk still x~80-510, no sky
- impact-burst-glow-ball [attempts: 2] — a putty ball on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: lit side fell; the lit side is what is short
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft, 1 px hairline

## Notes for next iteration (max 5 lines)
- Spent (never retry, even if re-listed): impact burst colour/glow, mammoth hide/launch/mop-hat/tusks/trample, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, melee-no-downed-bodies, giant victory shot (any lever), empty-hud-zero-budget. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Red skin: critic: BLUE_LIFT 0.06 to 0.04 next. Muzzle smoke base (2.1,1.8,1.2) is at ref brightness.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min); commit one gap per file (`git commit -- <file>`). Critic's named lever can be wrong: probe it. `sed s/radius: 22,/` hits two presets in cameraController.ts: check `git diff --stat`.
- Victory sky: treeline and ridge cover it, not the framing. targetScreenOffset moves the eye, not the picture.
- Shoulder rotation.x negative raises the arm. Projectile roots run along Z. HAT_OVERSIZE 1.3 (helms, hoods), TALL_HAT_OVERSIZE 1.6 (TALL_HATS). Lineup "cones" are hood (healer) and hood_liripipe (archer).
