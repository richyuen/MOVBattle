# Loop state
Iteration: 46   Last re-audit: 45   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- trees-cast-no-shadow 48e7d5a — APPROVE
- idle-legs-locked-parallel 1aedec5 — APPROVE
- unit-shadows-pale-and-short 5a7a5d1 — REJECT (reverted b16ed6d)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: trees-cast-no-shadow (48e7d5a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: idle-legs-locked-parallel (1aedec5) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: unit-shadows-pale-and-short (5a7a5d1) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] unit-shadows-pale-and-short: shapeless dim halo, no silhouette or length [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
2. [maps-light] tree-crowns-cast-no-shadow: only trunks cast thin stripes; boulders/props cast nothing [attempts: 0] — ref: gameplay_sheet_01 — ours: hud_placement.png
3. [battle-feel] cannon-crew-stands-on-cannon: a crewman stands on the wheel/barrel, not beside the gun [attempts: 0] — ref: trailer_1_sheet_01 — ours: war_machines_3800ms.png
4. [vfx] hit-flash-white-orbs: glowing white spheres mark melee hits; ref has debris, no flash [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_2s.png
5. [maps-light] placement-arena-square-slab: square slab, sparse ring, no round island edge [attempts: 2] — ref: gameplay_sheet_01 — ours: big_melee_placement.png
6. [unit-look] box-mitt-hands-and-rod-limbs: cube hands on uniform rods [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [maps-light] flat-teal-sky-and-flat-field: flat teal sky, no warm grading, dead-flat field [attempts: 1] — ref: tabs_screenshot_05 — ours: war_machines_3800ms.png
8. [battle-feel] idle-stance-narrow-from-front: stagger is fore-aft only; front-on units read as upright posts [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black
- shadows-noon-blobs [attempts: 1] — sun angle alone: trees cast nothing, unit shadows pale half-body smears
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains
- shield-line-gapped [attempts: 1] — ally overlap fails battlefeel_spillover_chain

## Notes for next iteration (max 5 lines)
- Gap 1: main.ts shadows block only: useBlurCloseExponentialShadowMap + setDarkness(0.35); leave light intensities alone.
- Gap 2: mapBuilder _createTree: move sunShadows().addShadowCaster(trunkMesh) after the canopy branch (descendants are collected at call time); then rocks/props.
- Tree casters widen the 2048 shadow map to the whole ring; this likely washes out unit shadows (untested).
- Gap 3: buildCannon operator is already at -Z; check linked actors in runtimeUnit before vehicleBuilder.
- Gap 8: _animateIdleHumanoid: hip rotation.z splay 0.08-0.12 per leg, trailing knee to ~0.3.
