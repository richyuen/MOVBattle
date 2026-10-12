# Loop state
Iteration: 47   Last re-audit: 45   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- tree-crowns-cast-no-shadow 2bf2f88 — REJECT (reverted 53eacf0)
- cannon-crew-stands-on-cannon 489a86a — APPROVE
- hit-flash-white-orbs fdf8ea6 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tree-crowns-cast-no-shadow (2bf2f88) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-crew-stands-on-cannon (489a86a) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: hit-flash-white-orbs (fdf8ea6) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] unit-shadows-pale-and-short: shapeless dim halo, no silhouette or length [attempts: 1] — ref: gameplay_sheet_01 — ours: lineup_medieval.png
2. [maps-light] tree-crowns-cast-no-shadow: crowns must stay bright; boulders need a visible pool [attempts: 1] — ref: gameplay_sheet_01 — ours: hud_placement.png
3. [vfx] muzzle-and-spell-white-blowout: screen-filling glowing white ball and bloomed beam cover the caster [attempts: 0] — ref: trailer_3_sheet_03 — ours: closeup_state_reads.png
4. [maps-light] placement-arena-square-slab: square slab, sparse ring, no round island edge [attempts: 2] — ref: gameplay_sheet_01 — ours: hud_placement.png
5. [unit-look] box-mitt-hands-and-rod-limbs: cube hands on uniform rods [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
6. [maps-light] flat-teal-sky-and-flat-field: flat teal sky, no warm grading, dead-flat field [attempts: 1] — ref: tabs_screenshot_05 — ours: lineup_medieval.png
7. [battle-feel] idle-stance-narrow-from-front: front-on units and the cannon crewman read as upright posts, arms down [attempts: 0] — ref: trailer_1_sheet_01 — ours: war_machines_3800ms.png
8. [vfx] hit-debris-on-every-hit: identical red pellets on medium hits pile into a bead curtain [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_5s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black
- shadows-noon-blobs [attempts: 1] — sun angle alone: trees cast nothing, unit shadows pale half-body smears
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains

## Notes for next iteration (max 5 lines)
- Gap 2 redo: move addShadowCaster(trunkMesh) after the canopy branch AND set receiveShadows=false in addCanopy and on boulders.
- Gap 3: find the white ball/beam in closeup_state_reads (unlit _fxMat white trips bloom); use lit matte mats.
- Gap 8: impactPresentation: drop spawnHitDebris from "medium"; visualEffects: mixed sizes, segments 1 for facets.
- Gap 7: cannon operator arms forward to the breech (vehicleBuilder buildCannon, pose only); idle hip splay 0.08-0.12.
- Gap 1: main.ts shadows block only: useBlurCloseExponentialShadowMap + setDarkness(0.35); leave light intensities alone.
