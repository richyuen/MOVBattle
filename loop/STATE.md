# Loop state
Iteration: 105   Last re-audit: 105   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-heart-cream 6ae1a5a — APPROVE
- lightning-fill-grey cb8f4b7 — APPROVE
- ground-orange-dark a1bd43a — APPROVE
- blast-scatter-too-high 4636c71 — APPROVE
- cannon-carriage-tan 4522aad — APPROVE
- mammoth-topknot-head-wide 93a74b9 — APPROVE
- cloud-banks-oversize 3b9487d — APPROVE
- mammoth-legs-buried 3f4e4fc — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-heart-cream (6ae1a5a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: lightning-fill-grey (cb8f4b7) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: ground-orange-dark (a1bd43a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blast-scatter-too-high (4636c71) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: cannon-carriage-tan (4522aad) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-topknot-head-wide (93a74b9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cloud-banks-oversize (3b9487d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-legs-buried (3f4e4fc) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] mammoth-hide-near-black: body median 58,43,32 vs maroon-brown 101,53,74; vehicleBuilder MAMMOTH_HIDE (0.3, 0.19, 0.11) to (0.48, 0.23, 0.25) [attempts: 0] — ref: tabs_screenshot_01, trailer_1_sheet_01 r2c2 — ours: big_melee_result.png
2. [maps-light] ground-hue-tan: field 203,149,84 (G/R 0.73) vs 223,131,82; mapBuilder tribal grass (0.93, 0.52, 0.3) to (0.98, 0.48, 0.27), dryGrass (0.87, 0.47, 0.29) to (0.92, 0.43, 0.26) [attempts: 0] — ref: tabs_screenshot_01, gameplay_sheet_01 r1c3 — ours: big_melee_2s.png
3. [vfx] fireball-heart-no-bloom: heart a hard matte ball at 224,220,196 vs burnt-out 250,250,226 with halo; spawnExplosionBurst lobe loop, skip glow?.addExcludedMesh(lobe) when i === 0 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
4. [maps-light] canopy-red-and-lemon: crowns 200,82,53 and 210,188,83 vs 210,114,90 and 233,190,117; mapBuilder leaves (0.86, 0.32, 0.24) to (0.9, 0.42, 0.3), darkLeaves (0.93, 0.62, 0.22) to (0.95, 0.66, 0.36) [attempts: 0] — ref: tabs_screenshot_01, gameplay_sheet_01 r2c1 — ours: big_melee_2s.png
5. [battle-feel] airborne-knees-straight: blasted knights fly as planks; proceduralAnimation _buildAirPose leftKnee/rightKnee 0.1 + h*0.5 to 0.4 + h*0.8 [attempts: 0] — ref: trailer_3_sheet_03 r1c1, r1c2 — ours: war_machines_1100ms.png
6. [vfx] lightning-fill-212: bolt faces 212,212,212, same as clouds; spawnLightning addShard, drop glow?.addExcludedMesh(shard) for the white shard only [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
7. [unit-look] cannon-carriage-dark: wood median 81,49,35, near the wheel colour, vs 108,66,78; buildCannon wood (0.5, 0.24, 0.14) to (0.62, 0.32, 0.22) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
8. [maps-light] cloud-bank-44pct: largest bank 44% of frame vs 32%; cloud ring factor 1.5 to 1.2, and lowClouds third size 13 to 10 if that is the bank [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- cloud-level-bases [attempts: 2] — clamp -0.12*size: middle puffs still planed, grey chamfer band
- mammoth-topknot-black-prism [attempts: 1] — sphere tufts plus eye 0.16: scope creep on the eyes
- cloud-slab-undersides [attempts: 1] — big banks at 8-11: a white wall on the treeline
- explosion-smooth-balls [attempts: 1] — segments 3, fire root 1.5 wide: still separate balls
- launched-cloud-height [attempts: 1] — lift 4-6: apex under half a body, a knock-over
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12: flat-topped mesas, snow invisible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift is settled (spread 0.7-1.0, base 8 + 4*falloff): leave it.
- One gap, one change: the critic rejects a commit that also touches anything the gap does not name. Unlit materials: only emissive changes pixels.
- Critic's line numbers can be off by one: sed by pattern, then check `git diff -U0` is non-empty. Commit with `git commit <file> -F -` heredoc.
