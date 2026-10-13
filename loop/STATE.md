# Loop state
Iteration: 125   Last re-audit: 125   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- blue-army-slate 635b129 — REJECT (reverted a3d13d4)
- muzzle-smoke-flat-white 02c917a — APPROVE
- cannon-blast-see-through 4d98a3c — APPROVE
- front-runners-outpace — no commit (worker dropped it, see Rejected)
- cannon-barrel-navy ce343c3 — APPROVE
- skin-hue-off 2e0d9c2 — APPROVE
- victory-subject-small ef31018 — APPROVE
- mammoth-eye-bloom d4e562d — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blue-army-slate (635b129) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-flat-white (02c917a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-blast-see-through (4d98a3c) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-barrel-navy (ce343c3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: skin-hue-off (2e0d9c2) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-subject-small (ef31018) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: mammoth-eye-bloom (d4e562d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] blue-army-slate: plate mid 79,99,121, saturation 0.34 vs knights 18,74,167 at 0.9-1.0; unitFactory.ts floor cool-armour saturation at 0.85 (Math.max), then ARMOUR_PRESET_WEIGHT 0.2 to 0.1 [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_2s.png
2. [vfx] cannon-blast-matte-peach: ball mid 209,158,115, upper lobe 208,189,139 vs 250,249,226 throughout; visualEffects.ts coreMat emissive to (1,0.98,0.85), flashMat toward (1,0.9,0.6), flameMat stays [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
3. [battle-feel] front-runners-outpace: 29-38% bare ground among reds at 2s vs 16-23%; hold a runner that is ahead of its allies along the advance until contact; leave contactBias 0.55 [attempts: 1] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_2s.png
4. [unit-look] mammoth-hide-plum: mid 66,38,45 / lit 87,48,57 at 5s vs mid 88,46,70 / lit 124,70,81; vehicleBuilder.ts MAMMOTH_HIDE to ~(0.42,0.20,0.24), no added emissive [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [camera] victory-giant-wall: mammoth covers 31% of the band, tusk behind the subject's head vs open sky; cameraController.ts pick the victory alpha facing away from the giant when `giant` [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [vfx] muzzle-smoke-low-contrast: shade 113,112,121 to lit 162,166,187 vs 80,79,98 to 210,206,199; projectileSystem.ts smoke base to (0.72,0.70,0.66), emissive 0.08 to 0.03 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [unit-look] red-skin-pink: lit 222,99,118 (B 19 over G) vs 215,100,105; unitFactory.ts applyMaterialPreset, halve the blue share of the glow when red is the strongest channel [attempts: 0] — ref: tabs_screenshot_08 — ours: big_melee_result.png
8. [maps-light] boulders-lit-violet-2: mid 52,45,74, lit 75,68,91 vs warm 124,93,87 (re-audit 125 measured TABS at 45,45,71: sample the ref first); mapBuilder.ts darkRock R 0.30 to 0.36 [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- blue-army-slate [attempts: 1] — saturation x1.6: on-screen 0.35 vs 0.37 before, not visible
- front-runners-outpace [attempts: 1] — cohesionRadius 1.5 to 2: reds no closer at 2s, battle outcome changed; not committed
- mammoth-hide-plum [attempts: 1] — (0.80,0.52,0.34): pale khaki lit 147,122,111; TABS hide is 136,74,85
- boulders-lit-violet [attempts: 1] — darkRock (0.25,0.24,0.32): lit B 113-120 vs 79-84
- blue-skin-slate [attempts: 1] — no edit made
- shade-brick-not-plum [attempts: 2] — hemi.diffuse (0.37,0.53,1.55): shade B only 0.42, neutrals navy, red skin plum

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball foot/lobes/orange/balloon, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55.
- Skin glow = 0.4 x (team colour minus its weakest channel, blue x SKIN_GLOW_BLUE 1.5), in applyMaterialPreset; runtimeUnit resets emissive to `_skinGlow` every frame. The blue hemi light adds ~+20 B over R to any grey (barrels, smoke): warm the base to offset.
- Measure before colour edits: capture `--iter 9123 --showcase-only` uncommitted, sample PNG regions (System.Drawing percentiles) against the target, and sample the reference JPG yourself too: a critic target can be wrong. Emissive meshes not excluded from the "glow" layer get a wide halo.
- One gap, one change: the critic rejects scope creep and claims not visible on screen. A changed big_melee outcome can leave one human beside the mammoth and the victory shot inside it: recheck big_melee_result after any sim edit.
- runtimeUnit owns root.rotation.x/z. buildMammoth is shared with the sacred elephant. Source files are CRLF: edit by exact-string node script; commit with `git commit <file> -F -` heredoc.
