# Loop state
Iteration: 110   Last re-audit: 110   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- crown-shade-brick e64f98f — APPROVE
- mammoth-hide-dark 76006a3 — APPROVE
- airborne-sit-square 4e3b567 — REJECT (reverted)
- cloud-dark-undersides db7a563 — APPROVE
- shove-squat-low 8b60809 — APPROVE
- unit-shadows-pale e425009 — APPROVE
- fireball-half-size f77827e — REJECT (reverted)
- mammoth-crest-violet 070fd9f — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: crown-shade-brick (e64f98f) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-hide-dark (76006a3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: airborne-sit-square (4e3b567) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: cloud-dark-undersides (db7a563) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: shove-squat-low (8b60809) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: unit-shadows-pale (e425009) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-half-size (f77827e) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-crest-violet (070fd9f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] airborne-sit-square: 3 of 5 flung knights trunk-flat, legs 90 deg up; _buildAirPose jackknife torso 0.9+h(25)*0.5 to 0.4+h(25)*0.3, pitch *2.4 to *1.2 [attempts: 2] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [vfx] fireball-half-size: ball ~2.5 knight lengths vs ~4; spawnExplosionBurst fireScale Math.min(scale, 2.4) to Math.min(scale * 2.0, 3.6), shell scale is 1.8 [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [maps-light] shadow-red-stain: shade 190,74,48 on 211,122,72 loses R 10% G 39% vs even 36/32/29%; main.ts shadowGen.darkness 0.45 to 0.2 [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
4. [unit-look] mammoth-lit-pink: lit flank 129,76,100, tops 165,102,129 vs max 120,69,81; MAMMOTH_HIDE (0.48, 0.19, 0.31) to (0.43, 0.18, 0.26) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
5. [vfx] fireball-no-orange: ball all cream 233,229,213 vs orange rim 228,183,118; flashMat.emissiveColor (0.9, 0.75, 0.35) to (0.7, 0.45, 0.15) [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [maps-light] crown-shade-crimson: shade 146-165,59-72,44-53 vs 171-206,51-54,70-72; both crown.emissiveColor scale(0.62) to multiply(new Color3(0.72, 0.45, 0.8)) [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
7. [battle-feel] shove-lunge-split: front-liners hold a 0.5-1.0 rad hip split, a head low; _buildShovePose stance 0.25+h(4)*0.25 to 0.12+h(4)*0.15 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_9s.png
8. [unit-look] mammoth-mop-beret: crest is two round domes proud of the skull vs a low mop over the brow; buildMammoth dome.position (0, 0.58, 0.42) to (0, 0.5, 0.52) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- fireball-half-size [attempts: 1] — fireScale 1.5x cap 3.6, dust (1, 0.88, 0.58): still 2.5 lengths, foot 25 grey
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight, L is at the waist
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink
- fireball-no-orange [attempts: 1] — ember on lobes 2 and 4: buried inside the heart, nothing visible
- cloud-olive-undersides [attempts: 1] — diffuse 0.35, emissive 0.55-0.62: undersides 50 levels dark
- airborne-hips-square [attempts: 1] — Sit hip 0.5-0.9: 3 of 6 still square
- cloud-neutral-white [attempts: 1] — diffuse tint, emissive halved: tops clip, undersides olive
- lightning-rim-hairline [attempts: 1] — rim 2.2: wide but ice-grey

## Notes for next iteration (max 5 lines)
- Spent (never retry): cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift is settled. Field colour needs no gap.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- Mammoth fur is self-lit via factory get("wood", c, {emissive}); never mutate cached makeMat materials. If a slot opens: cloudMat diffuse (1,1,1) to (0.94, 1, 0.97).
- Critic's line numbers drift: sed by pattern, check `git diff -U0`. Commit with `git commit <file> -F -` heredoc. Shadow darkness under 0.45: check tree-ring fusing.
