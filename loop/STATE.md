# Loop state
Iteration: 109   Last re-audit: 105   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- cloud-olive-undersides c201dc7 — REJECT (reverted)
- airborne-jackknife-square 45cfa4c — APPROVE
- lightning-rim-fades-white 9002a77 — APPROVE
- fireball-no-orange 4eaa81c — REJECT (reverted)
- mammoth-hide-grape 630b68d — APPROVE
- mammoth-crest-bun c83792e — APPROVE
- low-sky-dim 0947530 — APPROVE
- crown-shade-brown 1bd5a3a — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cloud-olive-undersides (c201dc7) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: airborne-jackknife-square (45cfa4c) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lightning-rim-fades-white (9002a77) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: fireball-no-orange (4eaa81c) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-hide-grape (630b68d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-crest-bun (c83792e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: low-sky-dim (0947530) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: crown-shade-brown (1bd5a3a) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-orange-buried: no visible orange vs 238,158,124 base and fringe; spawnExplosionBurst, an orange self-lit (0.93, 0.55, 0.35) material on outer lobe 3 (size 0.7, height -0.15) [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [battle-feel] airborne-sit-square: 2 of 6 flung bodies sit with thighs square; _buildAirPose Sit `hip = 1.2 + h(25) * 0.3` to `0.4 + h(25) * 0.3` [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [maps-light] cloud-dark-undersides: undersides 138,154,139 vs 187,211,197, tops neutral 213; cloudMat diffuse (0.35, 0.40, 0.36) with emissive (0.70, 0.78, 0.72) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [maps-light] crown-shade-brick: shade 103,38,34 B/R 0.33 vs crimson 140,56,72; keep leaves diffuse (0.95, 0.50, 0.40), add leaves.emissiveColor (0.12, 0.01, 0.07) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
5. [unit-look] mammoth-crest-violet: crest 62,37,64 violet vs near-black brown; crestMat Lerp target (0.04, 0.04, 0.30) at 0.45 to (0.05, 0.03, 0.08) at 0.7 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [maps-light] horizon-milky: horizon red 140-155 vs 127, B/R 1.19 vs 1.46; sky dome `mint` red 0.74 to 0.66 [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
7. [unit-look] mammoth-hide-dark: hide median 75,42,53 vs 108,57,75; MAMMOTH_HIDE (0.48, 0.19, 0.31) to (0.58, 0.24, 0.37) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
8. [vfx] lightning-rim-thin: rim a 4-6 px outline vs a broad cyan band; rim.scaling 1.6 to 2.0, blade halo now excluded [attempts: 1] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink
- fireball-no-orange [attempts: 1] — ember on lobes 2 and 4: buried inside the heart, nothing visible
- cloud-olive-undersides [attempts: 1] — diffuse 0.35, emissive 0.55-0.62: hue right, undersides 50 levels dark, tops neutral
- airborne-hips-square [attempts: 1] — Sit hip 0.5-0.9: 3 of 6 still square (Jackknife since fixed)
- cloud-neutral-white [attempts: 1] — diffuse tint, emissive halved: tops clip, undersides olive
- lightning-rim-hairline [attempts: 1] — rim 2.2: wide but ice-grey (before halo exclusion)
- cloud-grey-and-wide [attempts: 1] — emissive tint: no screen effect, white diffuse clips
- airborne-bodies-balled [attempts: 1] — fold 0.2-0.5: the tuck is at the hips, untouched

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift is settled. Grass diffuse red is at its ceiling. Field colour needs no gap.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- Fireball heart radius 0.65 hides small lobes: orange must sit on an outer lobe. Mammoth eyes/colours stay out of shape gaps.
- Critic's line numbers drift: sed by pattern, check `git diff -U0`. Commit with `git commit <file> -F -` heredoc.
