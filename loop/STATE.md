# Loop state
Iteration: 122   Last re-audit: 120   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- shade-brick-not-plum 1ee1c0e — REJECT (reverted 1b1fc13)
- victory-fits-giant-not-humans eb9f6ab — APPROVE
- blue-skin-slate (no edit prescribed) — REJECT
- muzzle-smoke-two-tone 4b3239e — APPROVE
- mammoth-eyes-stalked ce02253 — APPROVE
- boulders-lit-violet 3223cb5 — REJECT (reverted 391d307)
- cannon-cheeks-unstepped 24d79df — APPROVE
- melee-lines-stand-apart d33a26e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: shade-brick-not-plum (1ee1c0e) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: victory-fits-giant-not-humans (eb9f6ab) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: blue-skin-slate ((none)) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-two-tone (4b3239e) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-eyes-stalked (ce02253) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-lit-violet (3223cb5) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-cheeks-unstepped (24d79df) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: melee-lines-stand-apart (d33a26e) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
Gaps 1-4 were measured under the since-reverted fill (0.37, 0.53, 1.55); the live fill is (0.7, 0.9, 1.6).
1. [unit-look] red-skin-plum: lit 116,50,78 vs 207,74,94; factionColors.ts line 56 Team B (0.8,0.16,0.2) to (1.0,0.30,0.32) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [maps-light] shade-brick-not-plum: shade R 0.64, B 0.42 of lit vs R 0.32, B 0.68; main.ts hemi.diffuse (0.55,0.72,1.55), hemi.intensity 0.6 to 0.45, shadowGen.darkness 0.12 to 0.04 [attempts: 2] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
3. [unit-look] blue-skin-dark: lit 87,107,160 vs 140,172,213; factionColors.ts line 55 Team A (0.50,0.68,0.96) to (0.62,0.86,1.0) [attempts: 1] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
4. [maps-light] boulders-indigo: lit faces 75,52,115 vs 75,63,79; mapBuilder.ts darkRock.diffuseColor to (0.26,0.29,0.22) [attempts: 1] — ref: tabs_screenshot_01 — ours: hud_placement.png
5. [camera] victory-centres-giant: frame centre on the mammoth foreleg, humans 18-41% vs 45-75%; main.ts frameSurvivorsForResult keep units over 4.2 tall out of `spots`, radius 6.5 to 5 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [battle-feel] reds-arrive-as-singles: clubbers 1-2 body widths apart at contact vs two-deep crush; simulationSystem.ts sameTeamPressureScale 0 to 0.15 * compressionRatio [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
7. [unit-look] mammoth-eyes-beads: 0.12 spheres proud of the outline vs flat discs 1/5 of the face; buildMammoth eye 0.2 with scaling.z 0.3, pupil 0.09 flattened at z 0.69 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
8. [vfx] muzzle-smoke-bead-row: four smooth balls in a line vs a clump of faceted lumps; projectileSystem.ts 7 equal lobes, step 0.2, segments 3 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- boulders-lit-violet [attempts: 1] — darkRock (0.25,0.24,0.32) under the blue fill: lit B 113-120 vs 79-84, G lowest
- blue-skin-slate [attempts: 1] — no edit; under fill (0.37,0.53,1.55) lit skin went dark 87,107,160
- shade-brick-not-plum [attempts: 2] — hemi.diffuse (0.37,0.53,1.55): shade B only 0.42, iron and stone navy, red skin plum
- victory-giant-dwarfs-survivors [attempts: 1] — radius min(11, fit): humans still 23-27% of band
- field-shadows-red [attempts: 1] — hemi.diffuse (0.70,0.78,1.0): R ratio stayed 0.79, shade brick
- fireball-foot-dull [attempts: 2] — flameMat (0.70,0.20,0.04): brown-orange shell; TABS is cream
- fireball-core-dull [attempts: 1] — coreMat (1.0,0.97,0.75): whiter not creamier
- red-rank-knot [attempts: 1] — either-bracer 0.8: spillover_chain squire shift 0.20 < 0.55

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball foot/lobes/orange/balloon, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, muzzle-smoke-one-ball, idle legs, placement specks, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. hemi.diffuse lights every surface: cutting its R/G turns neutrals navy and red skin plum, cutting its blue bricks the shade. Re-measure skin and boulders under the live fill before editing them.
- One gap, one change: the critic rejects scope creep and claims not visible on screen; keep comments true.
- big_melee ranks spawn 0.6 apart, tighter than body widths; ally contact toppled 13 of 30 at 1 s until 122.8. Probe unit states with render_game_to_text before choosing a battle-feel lever.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Edit with `sed -i -b` by line number; commit with `git commit <file> -F -` heredoc.
