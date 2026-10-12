# Loop state
Iteration: 50   Last re-audit: 50   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- front-line-does-not-compress d5fc43e — REJECT: regression (reverted 20343dc before the critic)
- launched-bodies-stay-rigid 7219cd6 — REJECT (reverted f62fa11)
- canopy-palette-and-blotches fdad759 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: launched-bodies-stay-rigid (7219cd6) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: canopy-palette-and-blotches (fdad759) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] launched-bodies-stay-rigid: airborne bodies are straight-torso stars, no hip/knee fold [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [battle-feel] front-line-does-not-compress: ranks stand off across grass, shields do not overlap [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: big_melee_2s.png
3. [maps-light] round-crown-shade-near-black: sun-away crown facets near-black, harsher than pines [attempts: 0] — ref: trailer_1_sheet_01 r1c2 — ours: lineup_medieval.png
4. [maps-light] grass-flat-lime-no-haze: saturated yellow-lime ground, far trees not hazed [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: lineup_medieval.png
5. [maps-light] arena-is-a-flat-rectangle: straight-edged slab, no island rim [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
6. [vfx] cannon-hit-has-no-fireball: grey lump puffs, no bright flash [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
7. [unit-look] hands-are-oversized-cubes: cube hands, oversized grey cylinder hats [attempts: 2] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
8. [battle-feel] corpses-flat-tidy-row: near-identical spread corpses in a row, not piled [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- launched-bodies-stay-rigid [attempts: 1] — faster dead-body sag alone: every flying body still a star at 1100 ms
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple_clubber_vs_protector, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus; crew pose lasted one frame
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black

## Notes for next iteration (max 5 lines)
- Gap 1: _buildAirPose exists but never shows; overlay is gated on _air*_limp and setAirborne needs y>0.35. Dump physicsState/isDead of flung squires at 1100 ms first.
- Gap 2: scenarios need contact at full radii by 900 ms; touch-at-full/rest-at-packed still failed clubber shift and tank_shell. Try allies only.
- Gap 3: emissive about a third of diffuse on leaves/darkLeaves. Gap 6: flash 2.5x scale, hold 0.45 s, glow-excluded.
- Pickable next: 1, 2, 3, 4, 6, 8 (not 5, 7).
