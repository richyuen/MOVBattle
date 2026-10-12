# Loop state
Iteration: 107   Last re-audit: 105   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- canopy-half-yellow 7a6fad2 — APPROVE
- mammoth-hide-no-plum 9733d41 — APPROVE
- field-g-over-r-067 28c7453 — APPROVE
- fireball-orange-balls 4e072b5 — APPROVE
- cannon-carriage-no-mauve 23953b0 — APPROVE
- airborne-bodies-balled 92851c4 — REJECT (reverted)
- cloud-grey-and-wide 4d334bb — REJECT (reverted)
- lightning-rim-hairline 6525a26 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: canopy-half-yellow (7a6fad2) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-hide-no-plum (9733d41) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: field-g-over-r-067 (28c7453) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-orange-balls (4e072b5) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-carriage-no-mauve (23953b0) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: airborne-bodies-balled (92851c4) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: cloud-grey-and-wide (4d334bb) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: lightning-rim-hairline (6525a26) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] lightning-rim-pale: rim 189,212,214 sat 0.11 vs 144,242,248 sat 0.40; visualEffects spawnLightning rimMat base colour and emissiveColor (0.3, 0.9, 1) to (0, 0.55, 0.9) [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
2. [maps-light] cloud-neutral-white: sunlit cloud 212,212,212 vs 212,224,214; _createClouds cloudMat.diffuseColor (1, 1, 1) to (0.62, 0.72, 0.65) and emissiveColor (0.6, 0.63, 0.66) to (0.30, 0.34, 0.31) [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
3. [battle-feel] airborne-hips-square: 4 of 6 flung bodies have thighs square to the trunk vs legs in line; _buildAirPose Sit variant hip `1.2 + h(25) * 0.3` to `0.5 + h(25) * 0.4` [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
4. [vfx] fireball-mustard-lobes: flameMat lobes 192,125,27 vs 248,221,154; spawnExplosionBurst flameMat.emissiveColor (0.5, 0.18, 0) to (0.85, 0.6, 0.25) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [maps-light] sky-grey-teal: sky top 107,178,159 vs 90,193,168; main.ts sky dome vertex colour `[0.43 - 0.10 * t, 0.78 - 0.04 * t, 0.68 - 0.03 * t]` to `[0.43 - 0.20 * t, 0.86 - 0.04 * t, 0.74 - 0.04 * t]` [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
6. [unit-look] mammoth-crest-not-navy: crest 58,37,47 vs 29,22,63 to 58,39,71; buildMammoth line 1562 crestMat lerp target (0.04, 0.03, 0.03) to (0.04, 0.04, 0.30) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
7. [maps-light] red-crowns-dark: red crown 199,104,66 vs 217,126,92; mapBuilder leaves.diffuseColor (0.9, 0.42, 0.3) to (0.95, 0.50, 0.40) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
8. [unit-look] mammoth-hide-grey-plum: hide G/R 0.60-0.67 vs 0.54; MAMMOTH_HIDE (0.48, 0.23, 0.36) to (0.48, 0.19, 0.36) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lightning-rim-hairline [attempts: 1] — rim 2.2: wide but ice-grey, frosted glass
- cloud-grey-and-wide [attempts: 1] — emissive tint: no screen effect, white diffuse clips
- airborne-bodies-balled [attempts: 1] — fold 0.2-0.5: the tuck is at the hips, untouched
- cloud-level-bases [attempts: 2] — clamp -0.12*size: middle puffs still planed
- mammoth-topknot-black-prism [attempts: 1] — sphere tufts plus eye 0.16: scope creep on the eyes
- cloud-slab-undersides [attempts: 1] — big banks at 8-11: a white wall on the treeline
- explosion-smooth-balls [attempts: 1] — segments 3, fire root 1.5 wide: still separate balls
- launched-cloud-height [attempts: 1] — lift 4-6: apex under half a body, a knock-over

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift is settled: leave it. Grass diffuse red is at its ceiling.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen. Gaps 1 and 2 each name two edits: one gap, one commit.
- Critic's line numbers can drift: sed by pattern, check `git diff -U0` is non-empty. Commit with `git commit <file> -F -` heredoc.
