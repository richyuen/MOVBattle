# Loop state
Iteration: 114   Last re-audit: 110   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- mammoth-no-launch 8023760+cea702a — REJECT (regression, reverted before review)
- shove-attack-fold f075b58 — APPROVE
- shade-warm-rust 16b122f — APPROVE
- orange-crown-shade-red a770a34 — APPROVE
- red-crown-shade-blue fdc5331 — APPROVE
- mammoth-hide-green 9fd8fc3 — APPROVE
- fireball-lobes-mustard fa49d4e — APPROVE
- mammoth-mop-hat ecb6e6f — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: shove-attack-fold (f075b58) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: shade-warm-rust (16b122f) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: orange-crown-shade-red (a770a34) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-crown-shade-blue (fdc5331) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-hide-green (9fd8fc3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fireball-lobes-mustard (fa49d4e) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-mop-hat (ecb6e6f) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] ground-salmon-not-ochre: sunlit field 210,116,95 G/R 0.55 vs 238,165,103 G/R 0.60-0.69; mapBuilder.ts grass.diffuseColor (0.98,0.42,0.27) to (0.98,0.52,0.24) [attempts: 0] — ref: gameplay_sheet_01 r1c3, tabs_screenshot_01 — ours: hud_placement.png
2. [vfx] fireball-discs-flame: two discs 211,120,37, edge 0-3 px vs 243,178,136 to 229,131,120 soft; visualEffects.ts flameMat.emissiveColor (0.95,0.24,0.02) to (1.0,0.38,0.18) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [unit-look] mammoth-mop-hat: mop 35,22,52 on head 83-117 (R step 48-82) vs 65,42,71 on 104,63,85; vehicleBuilder.ts crestMat makeMat(...) to getMaterialFactory().get("wood", sameLerp, hideLight) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
4. [battle-feel] charge-lean-shallow: advancing bodies lean 15 degrees, reds bolt upright at 2s vs 40-50 degree charge lean; proceduralAnimation.ts walk torso.rotation.x 0.26 to 0.40 [attempts: 0] — ref: trailer_2_sheet_02 r1c1, trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
5. [unit-look] mammoth-hide-mauve: lit hide 119,65,97 B/R 0.82 vs 115,63,78 B/R 0.68; MAMMOTH_HIDE (0.30,0.11,0.17) to (0.30,0.11,0.13) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [maps-light] crown-no-orange: second crown lit 211,175,127 B/R 0.60, shade R 184-195 vs 236,157,101, shade R 148-160; mapBuilder.ts darkLeaves.diffuseColor (0.95,0.66,0.36) to (0.95,0.56,0.28) [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
7. [maps-light] shade-rust-residual: ground shade B/R 0.40-0.44 vs 0.58-0.65; main.ts hemi.diffuse (0.7,0.9,1.6) to (0.6,0.9,1.6), no more blue [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
8. [unit-look] mammoth-shade-flat: shaded hide 78-89,42-50,60-70 vs 30-54,17-28,59-64; vehicleBuilder.ts hideLight emissive hide.scale(0.16) to hide.scale(0.08) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-mop-hat [attempts: 1] — Lerp weight 0.6: mop still 48-82 levels darker than head, indigo; it has no self-light
- mammoth-no-launch [attempts: 2] — gored loop lift 13-17: farmer still airborne and "steady" at 2.1s, fails battlefeel_spillover_chain even with topple timers stretched over the flight
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-launch, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; the hard orange discs are flameMat, flashMat is the straw lobes. TEAM_COLORS[1] must not be mutated.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- shadowGen.darkness is the light LEFT in shade (0.35). hemi.diffuse blue already lifts sunlit ground B to 94-105 and mammoth B/R: do not add blue.
- Mammoth fur is self-lit via factory get("wood", c, hideLight); never mutate cached makeMat materials. Edit by python single-occurrence replace keeping line endings; commit with `git commit <file> -F -` heredoc.
