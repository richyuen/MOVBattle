# Loop state
Iteration: 108   Last re-audit: 105   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- lightning-rim-pale ca3ebfb — APPROVE
- cloud-neutral-white 770c1e2 — REJECT (reverted)
- airborne-hips-square 0e39cd4 — REJECT (reverted)
- fireball-mustard-lobes 939e7a4 — APPROVE
- sky-grey-teal 03f7d0b — APPROVE
- mammoth-crest-not-navy 3662336 — APPROVE
- red-crowns-dark b9c1dfe — APPROVE
- mammoth-hide-grey-plum 4220f9d — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lightning-rim-pale (ca3ebfb) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cloud-neutral-white (770c1e2) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: airborne-hips-square (0e39cd4) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: fireball-mustard-lobes (939e7a4) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: sky-grey-teal (03f7d0b) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-crest-not-navy (3662336) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: red-crowns-dark (b9c1dfe) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-hide-grey-plum (4220f9d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] cloud-olive-undersides: cloud tops neutral 211,211,211 vs 212,224,214 throughout; _createClouds cloudMat.emissiveColor (0.6, 0.63, 0.66) to (0.55, 0.62, 0.57) and diffuseColor (1, 1, 1) to (0.35, 0.40, 0.36) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [battle-feel] airborne-jackknife-square: 3 of 6 flung bodies hold a thigh at 90 degrees to the trunk vs in-line planks; _buildAirPose Jackknife `hip = 0.7 + h(30) * 0.4` to `0.2 + h(30) * 0.3` [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [vfx] lightning-rim-fades-white: rim is a 5px fade, median sat 0.20 vs flat band sat 0.59; spawnLightning rim.scaling 1.6 to 2.2 [attempts: 1, same edit as lightning-rim-hairline] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
4. [vfx] fireball-no-orange: all lobes cream 223,203,160, no orange base vs 238,158,124; spawnExplosionBurst, two smallest lobes (0.45, 0.5) self-lit (0.93, 0.55, 0.35) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [unit-look] mammoth-hide-grape: lit hide 134,74,104 B/R 0.78 vs 124,72,85 B/R 0.69; MAMMOTH_HIDE (0.48, 0.19, 0.36) to (0.48, 0.19, 0.31) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [unit-look] mammoth-crest-bun: two smooth balls behind the head vs a mop draped over the brow; buildMammoth front crest sphere forward and flattened to y 0.6, shape only [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
7. [maps-light] low-sky-dim: low sky 127,193,175 vs 129,208,186; main.ts sky dome `mint` [0.74, 0.92, 0.82] to [0.74, 0.98, 0.87] [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
8. [maps-light] crown-shade-brown: shaded red facets 138,55,41 B/R 0.30 vs 0.39 to 0.49; mapBuilder leaves.diffuseColor (0.95, 0.50, 0.40) to (0.95, 0.50, 0.46) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- airborne-hips-square [attempts: 1] — Sit hip 0.5-0.9: 3 of 6 still square, Jackknife is the source
- cloud-neutral-white [attempts: 1] — diffuse tint, emissive halved: tops still clip, undersides olive 75,87,72
- lightning-rim-hairline [attempts: 1] — rim 2.2: wide but ice-grey, frosted glass
- cloud-grey-and-wide [attempts: 1] — emissive tint: no screen effect, white diffuse clips
- airborne-bodies-balled [attempts: 1] — fold 0.2-0.5: the tuck is at the hips, untouched
- cloud-level-bases [attempts: 2] — clamp -0.12*size: middle puffs still planed
- mammoth-topknot-black-prism [attempts: 1] — sphere tufts plus eye 0.16: scope creep on the eyes
- cloud-slab-undersides [attempts: 1] — big banks at 8-11: a white wall on the treeline

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift is settled: leave it. Grass diffuse red is at its ceiling. Field colour needs no gap.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen. Gap 1 names two edits: one gap, one commit.
- Clouds: diffuse plus emissive over 1 clips tops to neutral; cutting emissive darkens undersides. Keep the cloud comment true.
- Critic's line numbers can drift: sed by pattern, check `git diff -U0` is non-empty. Commit with `git commit <file> -F -` heredoc.
