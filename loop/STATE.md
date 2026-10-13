# Loop state
Iteration: 123   Last re-audit: 120   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-skin-plum b05f2b3 — APPROVE
- blue-skin-dark d0937fd — APPROVE
- boulders-indigo 1cfef4f (+comment 16bcd5e) — APPROVE
- victory-centres-giant 5b229d6 — APPROVE
- reds-arrive-as-singles 3722a2e — REJECT (reverted a5a29fc)
- mammoth-eyes-beads 5d536ec — APPROVE
- muzzle-smoke-bead-row 3f60e75 — REJECT (reverted 406a9b9)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-skin-plum (b05f2b3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blue-skin-dark (d0937fd) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-indigo (1cfef4f) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: victory-centres-giant (5b229d6) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: reds-arrive-as-singles (3722a2e) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-eyes-beads (5d536ec) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-bead-row (3f60e75) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] skin-highlights-dull: red lit 151,82,103 vs 222,95,104; blue mid 102,115,143 vs 112,152,199; unitFactory.ts applyMaterialPreset ~318 skin emissive skinColor.scale(0.2), keep runtimeUnit.ts ~1399 reset in step [attempts: 0] — ref: tabs_screenshot_01, 08 — ours: big_melee_2s.png, lineup_medieval.png
2. [vfx] muzzle-smoke-bead-row: musket puff a line of equal smooth balls vs a clump of lumps 1-3x; projectileSystem.ts 4 lobes, diameter 0.2 + rand*0.5, step 0.09*i, segments 2 [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
3. [battle-feel] reds-arrive-as-singles: bare ground between reds at contact vs shoulder to shoulder; simulationSystem.ts ~275 sameTeam contactBias 0.82 to 0.55 [attempts: 1] — ref: tabs_screenshot_01, trailer_1_sheet_01 r2c2 — ours: big_melee_2s.png
4. [unit-look] mammoth-hide-plum: hide 109,61,75 same as red skin vs brown 160,127,107; vehicleBuilder.ts MAMMOTH_HIDE (0.36,0.13,0.13) to (0.50,0.30,0.20) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
5. [maps-light] boulders-navy-at-eye-level: lit 41,49,68 vs 80,70,83, shade 10,10,13 vs 27,28,64; mapBuilder.ts darkRock diffuse to (0.40,0.31,0.30), emissive (0.02,0.02,0.07) [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
6. [unit-look] mammoth-eye-white-grey: white 117,124,153 vs 204,194,188, edge-on in profile; buildMammoth eyeWhite as bone material with emissive (0.3,0.28,0.25), eyes rotation.y sign*0.9 at xOff 0.36 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [camera] victory-subject-loose: human 53% of band vs 75%; cameraController.ts frameSurvivors giant radius 5 to 4, target y 1.2 to 1.5 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-bead-row [attempts: 1] — 7 equal lobes step 0.2 segments 3: still a bead row at musket scale, smoother
- reds-arrive-as-singles [attempts: 1] — sameTeamPressureScale 0.15*compression: changes topple not spacing, nothing visible
- boulders-lit-violet [attempts: 1] — darkRock (0.25,0.24,0.32): lit B 113-120 vs 79-84
- blue-skin-slate [attempts: 1] — no edit made
- shade-brick-not-plum [attempts: 2] — hemi.diffuse (0.37,0.53,1.55): shade B only 0.42, neutrals navy, red skin plum
- victory-giant-dwarfs-survivors [attempts: 1] — radius min(11, fit): humans still 23-27% of band
- field-shadows-red [attempts: 1] — hemi.diffuse (0.70,0.78,1.0): R ratio stayed 0.79
- fireball-foot-dull [attempts: 2] — flameMat (0.70,0.20,0.04): brown-orange shell; TABS is cream

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball foot/lobes/orange/core/balloon (critic's cannon-impact gap dropped), grass tufts (dropped), presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance.
- Team colours are at the channel cap (red R 1.0, blue B 1.0); skin is teamColor*0.9 on PBR under fill (0.7,0.9,1.6) + ACES, so brighter skin needs emissive, not albedo. Raising red's G/B turns it mauve.
- Measure before colour edits: capture `--iter 9123 --showcase-only` with the edit uncommitted and sample PNG pixels (System.Drawing) before committing; boulder screen G responds steeply to diffuse G.
- One gap, one change: the critic rejects scope creep and claims not visible on screen; fix every comment the edit makes false.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Files have mixed CRLF/LF: edit with `sed -i -b` by line number; commit with `git commit <file> -F -` heredoc.
