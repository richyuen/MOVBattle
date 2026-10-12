# Loop state
Iteration: 106   Last re-audit: 105   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- mammoth-hide-near-black 790fe44 — APPROVE
- ground-hue-tan 4785cf2 — APPROVE
- fireball-heart-no-bloom febca8d — APPROVE
- canopy-red-and-lemon 1748b8e — APPROVE
- airborne-knees-straight efe8136 — APPROVE
- lightning-fill-212 907f86d — APPROVE
- cannon-carriage-dark e4a9aff — APPROVE
- cloud-bank-44pct a90e5f8 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mammoth-hide-near-black (790fe44) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: ground-hue-tan (4785cf2) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-heart-no-bloom (febca8d) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: canopy-red-and-lemon (1748b8e) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: airborne-knees-straight (efe8136) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lightning-fill-212 (907f86d) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-carriage-dark (e4a9aff) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cloud-bank-44pct (a90e5f8) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] canopy-half-yellow: yellow crowns 50% of canopy pixels vs 12-17%; mapBuilder lines 442/455 `> 0.5 ? leaves : darkLeaves` to `> 0.2`, second crown (line 465) to the tree's own leafMat [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [unit-look] mammoth-hide-no-plum: hide 108,63,66 lit, 66,42,42 shade vs 82-96,43-51,68-73; vehicleBuilder MAMMOTH_HIDE (0.48, 0.23, 0.25) to (0.48, 0.23, 0.36) [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_result.png
3. [maps-light] field-g-over-r-067: field 204,137,74 (G/R 0.67) vs 221,127,81 (0.57); mapBuilder grass (0.98, 0.48, 0.27) to (0.98, 0.42, 0.27), dryGrass (0.92, 0.43, 0.26) to (0.92, 0.38, 0.26) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [vfx] fireball-orange-balls: outer lobes matte 202,140,50, hard edges, vs one cream mass 250,250,226; visualEffects flashMat.emissiveColor (0.6, 0.4, 0.1) to (0.9, 0.75, 0.35) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [unit-look] cannon-carriage-no-mauve: carriage 93,60,46 side, 141,103,84 top (field hue) vs 85,51,73; buildCannon wood (0.62, 0.32, 0.22) to (0.56, 0.30, 0.33) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [battle-feel] airborne-bodies-balled: flung knights tucked into clumps vs long bodies fanned at every angle; _buildAirPose fold `0.4 + h(49) * 0.5` to `0.2 + h(49) * 0.3` [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
7. [maps-light] cloud-grey-and-wide: clouds 211,211,211, 6-8% of frame, largest 35% wide vs 214,224,216, 4.9%, 26.5%; _createClouds cloudMat.emissiveColor (0.6, 0.63, 0.66) to (0.66, 0.74, 0.70), ring size `9 + v * 8` to `8 + v * 6` [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
8. [vfx] lightning-rim-hairline: cyan rim a thin pale line vs thick saturated cyan; addShard rim scaling 1.6 to 2.2 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png

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
- One gap, one change: the critic rejects a commit that also touches anything the gap does not name. Unlit materials: only emissive changes pixels. Gap 7 names two edits (cloud colour and size): they are one gap, one commit.
- Critic's line numbers can be off by one: sed by pattern, then check `git diff -U0` is non-empty. Commit with `git commit <file> -F -` heredoc.
