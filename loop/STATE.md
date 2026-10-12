# Loop state
Iteration: 51   Last re-audit: 50   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- launched-bodies-stay-rigid 151b065 — APPROVE
- round-crown-shade-near-black 2ffca7a — APPROVE
- cannon-hit-has-no-fireball ad09cf0 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: launched-bodies-stay-rigid (151b065) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: round-crown-shade-near-black (2ffca7a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-hit-has-no-fireball (ad09cf0) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] arena-is-a-flat-rectangle: hard-edged square slab in teal haze, no round island or cliff [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
2. [unit-look] hands-are-oversized-cubes: stick limbs ending in cubes on a box torso; red torsos brown [attempts: 2] — ref: tabs_screenshot_08 — ours: closeup_weapon_reads.png
3. [vfx] fireball-pumpkin-balloon-cluster: orange with pale core, equal lobes, one body tall [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
4. [battle-feel] flyers-mirrored-corpses-flat-T: mirrored limbs, locked knees; landed corpses identical flat T [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_3800ms.png
5. [camera] battle-camera-inside-front-rank: one spearman fills frame, mammoth cropped [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [maps-light] crown-tops-pale-mint-trunks-black: broadleaf tops wash out from above, trunks near-black [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
7. [unit-look] cannon-barrel-plain-team-blue: blue cylinder on slab carriage, not dark ringed iron [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [maps-light] grass-uniform-tall-cones: same-colour sharp cones, no boulders in the field [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple_clubber_vs_protector, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus; crew pose lasted one frame
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black

## Notes for next iteration (max 5 lines)
- Gap 3: flashMat toward cream (1, 0.92, 0.6), flameMat (1, 0.65, 0.2), core 1.5x bigger than lobes, raise fireScale cap.
- Gap 4: _buildAirPose independent hashed left/right knees (0.3-1.2) and shoulders (~0.6 apart); air pose itself does engage (probed).
- Gap 6: crownMat diffuse scale 0.88 -> 0.75, keep emissive 0.26. VFX code must not add Math.random calls.
- Pickable next: 3, 4, 5, 6, 7, 8 (not 1, 2).
