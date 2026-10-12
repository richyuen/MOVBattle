# Loop state
Iteration: 52   Last re-audit: 50   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- fireball-pumpkin-balloon-cluster 2f23b78 — APPROVE
- flyers-mirrored-corpses-flat-T 5a003e3 — APPROVE
- battle-camera-inside-front-rank 71d95bf — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-pumpkin-balloon-cluster (2f23b78) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: flyers-mirrored-corpses-flat-T (5a003e3) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-camera-inside-front-rank (71d95bf) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-cream-not-fire: blast is ivory/mustard, reads as smoke; needs saturated yellow, orange base [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [battle-feel] corpses-still-T-and-paired-legs: some corpses arms-out square; flyers' legs paired and straight [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
3. [unit-look] props-undersized-box-torsos: cube hands, thin weapons, box torsos, shields not shoulder-wide [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
4. [battle-feel] front-line-thin-no-pile: clash one rank deep, no compression or corpse pile [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
5. [camera] grass-foreground-and-drift: a quarter of frame empty grass; clash drifts off-centre by 9s [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [maps-light] flat-square-arena: flat slab, hard edge, no hills or long shadows [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
7. [unit-look] mammoth-boxy-no-face: block stack, tiny eye, thin straight tusks [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
8. [vfx] muzzle-smoke-and-lightning-thin: lightning a thin line, muzzle smoke a small ball [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple_clubber_vs_protector, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus; crew pose lasted one frame
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black

## Notes for next iteration (max 5 lines)
- Gap 1: flashMat ~(1, 0.85, 0.32), flameMat ~(1, 0.42, 0.06), emissive to match; two largest lobes at lobeHeights <= 0.1.
- Gap 2: wide-arm branch cap flungZ ~0.8, flungElbowZ >= 1.0; _buildAirPose per-leg hip offset +-0.5 from h(44). T corpses may have died airborne.
- Gap 5: swoopToBattle clearance 6.5 -> 5, target.y 1.5 -> 1.1; depth from melee units only; focus is fixed at battle start.
- Pickable next: 1, 2, 5, 7, 8, then 4 (not 3, 6). No new Math.random calls in VFX or poses.
