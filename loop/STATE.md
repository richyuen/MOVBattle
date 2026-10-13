# Loop state
Iteration: 124   Last re-audit: 120   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- skin-highlights-dull c91c0a9 — APPROVE
- muzzle-smoke-bead-row 5367da9 — APPROVE
- reds-arrive-as-singles 14f7999 — APPROVE
- mammoth-hide-plum a1b4afd — REJECT (reverted 5b98a21)
- boulders-navy-at-eye-level 5ce0f36 — APPROVE
- mammoth-eye-white-grey 4a98ac3 — APPROVE
- victory-subject-loose 30f550c — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: skin-highlights-dull (c91c0a9) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-bead-row (5367da9) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: reds-arrive-as-singles (14f7999) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-hide-plum (a1b4afd) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-navy-at-eye-level (5ce0f36) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-eye-white-grey (4a98ac3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-subject-loose (30f550c) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] mammoth-hide-plum: TABS hide is dark mahogany lit 136,74,85 / mid 84,45,70 (the old 160,127,107 target was wrong); vehicleBuilder.ts MAMMOTH_HIDE (0.36,0.13,0.13) to ~(0.42,0.20,0.22), no more emissive [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [unit-look] blue-army-slate: mid 94,111,136, shade 66,80,101 vs knights mid 43,86,147, shade 3,24,112; cut the grey preset weight on blue armour/cloth one step [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
3. [vfx] muzzle-smoke-flat-white: 206,207,209 two heads across vs grey 160,156,159 with 102,98,110 shade, torso-sized; projectileSystem.ts smoke emissive 0.22 to 0.08, grey base, lobes 4 to 6 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
4. [camera] victory-subject-small: 56% of band, shoulders 11% of width vs 74% and 20%; cameraController.ts giant radius 4 to 3 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
5. [unit-look] skin-hue-off: red lit 202,84,105 (B-G 21) vs 215,100,105; blue 129,169,191 vs 154,182,218; halve the G share of the skin glow in applyMaterialPreset [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
6. [battle-feel] front-runners-outpace: 29% bare ground among reds at 2s vs 19-23%; hold front runners to the slowest ally within ~2 until contact; leave contactBias 0.55 [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_2s.png
7. [vfx] cannon-blast-see-through: cream mid 232,224,206, bodies show through vs opaque 249,248,224; blast lobe alpha opaque at spawn [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
8. [maps-light] boulders-lit-violet-2: lit 81,71,91 vs warm 124,93,87; mapBuilder.ts darkRock diffuse R 0.30 to 0.36, emissive B 0.08 to 0.06 [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-hide-plum [attempts: 1] — (0.80,0.52,0.34): pale khaki lit 147,122,111; TABS hide is 136,74,85
- boulders-lit-violet [attempts: 1] — darkRock (0.25,0.24,0.32): lit B 113-120 vs 79-84
- blue-skin-slate [attempts: 1] — no edit made
- shade-brick-not-plum [attempts: 2] — hemi.diffuse (0.37,0.53,1.55): shade B only 0.42, neutrals navy, red skin plum
- victory-giant-dwarfs-survivors [attempts: 1] — radius min(11, fit): humans still 23-27% of band
- field-shadows-red [attempts: 1] — hemi.diffuse (0.70,0.78,1.0): R ratio stayed 0.79

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball foot/lobes/orange/core/balloon, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55.
- Skin glow = 0.4 x (team colour minus its weakest channel), set in applyMaterialPreset; runtimeUnit _applyFxPreset resets emissive every frame to `_skinGlow`, so any new unit emissive must go through that base or it is wiped. Whole-colour glow washes skin white.
- Measure before colour edits: capture `--iter 9123 --showcase-only` uncommitted, sample PNG regions (System.Drawing percentiles) against the target, and sample the reference JPG yourself too: a critic target can be wrong.
- One gap, one change: the critic rejects scope creep and claims not visible on screen; fix every comment the edit makes false.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Files have mixed CRLF/LF: edit with `sed -i -b` by line number or a node script; commit with `git commit <file> -F -` heredoc.
