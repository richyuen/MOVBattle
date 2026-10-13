# Loop state
Iteration: 121   Last re-audit: 120   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- boulders-indigo 3587c82 — APPROVE
- muzzle-smoke-beaded-line addb39e — APPROVE
- field-shadows-red fab43a4 — REJECT (reverted 9c924d9)
- blue-skin-dark e3d323c — APPROVE
- mammoth-eyes-googly a4aa1d7 — APPROVE
- cannon-carriage-plank e478938 — APPROVE
- victory-giant-dwarfs-survivors 9fe4d1e — REJECT (reverted 63e829e)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: boulders-indigo (3587c82) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: muzzle-smoke-beaded-line (addb39e) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: field-shadows-red (fab43a4) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blue-skin-dark (e3d323c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-eyes-googly (a4aa1d7) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-carriage-plank (e478938) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-giant-dwarfs-survivors (9fe4d1e) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] shade-brick-not-plum: ground shade R 0.79, B 0.38 of lit vs R 0.42, B 0.59; main.ts hemi.diffuse (0.7, 0.9, 1.6) to (0.37, 0.53, 1.55) [attempts: 1] — ref: tabs_screenshot_01 — ours: hud_placement.png
2. [camera] victory-fits-giant-not-humans: humans 23-27% of band height vs 75%; cameraController.ts giant branch radius 6.5, target x/z box.focus, y baseY + 1.2 [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [unit-look] blue-skin-slate: lit 108,123,146, shade 76,89,115 vs 140,172,213 and 40,85,150 (measured under the reverted fill); re-measure after gap 1, no factionColors edit [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
4. [vfx] muzzle-smoke-two-tone: two dark grey lobes stacked beside the white vs one pale grey puff; projectileSystem.ts smoke loop `smoke.material = sm` for all lobes [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
5. [unit-look] mammoth-eyes-stalked: white spheres clear of the head, pupil on the outer edge vs flush discs, centred pupil; buildMammoth eye z 0.71 to 0.66, pupil (xOff, 0.08, 0.712) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [maps-light] boulders-lit-violet: sunlit faces 57,39,78 vs 80,69,82; mapBuilder.ts darkRock.diffuseColor to (0.25, 0.24, 0.32) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
7. [unit-look] cannon-cheeks-unstepped: one 0.26 box per side vs stepped cheeks; buildCannon add a rear step box per side (0.1 x 0.14 x 0.3 at z -0.25) [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
8. [battle-feel] melee-lines-stand-apart: at 2 s front ranks three body widths apart vs compressed two deep; simulationSystem.ts melee stop distance (not the collision distance) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- victory-giant-dwarfs-survivors [attempts: 1] — radius min(11, fit) is 10.2+, y 0.4 height: humans still 23-27% of band; fit the humans, let the giant crop
- field-shadows-red [attempts: 1] — hemi.diffuse (0.70, 0.78, 1.0): red untouched so R ratio stayed 0.79, blue cut turned shade brick and blue skin slate
- fireball-foot-dull [attempts: 2] — flameMat (0.70,0.20,0.04) on all 7 tongues: brown-orange shell; TABS is cream with a thin fringe
- fireball-core-dull [attempts: 1] — coreMat (1.0,0.97,0.75): only blue rose, whiter not creamier
- red-rank-knot [attempts: 1] — either-bracer 0.8: battlefeel_spillover_chain squire shift 0.20 < 0.55 (hoplite is a bracer)
- carriage-shade-warm [attempts: 1] — emissive (0.18,0.09,0.09): self-lit blue made the top pink
- field-dark [attempts: 1] — dir.intensity 1.0: wrong lever
- presser-lean-capped [attempts: 2] — clamp while Walking: line units are Idle/Attack

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball-foot-dull, presser-lean-capped, fireball-lobes-cream, mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; fire emissive past 1 washes white, lower goes brown. The hemi fill lights every surface: cutting its blue greys blue skin and bricks the shade.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- runtimeUnit owns root.rotation.x/z. Self-lit materials bloom unless glow-excluded. battlefeel_spillover_chain needs the squire shoved 0.55 off a hoplite. buildMammoth is shared with the sacred elephant.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b` by line number (re-grep the line after an insert); commit with `git commit <file> -F -` heredoc.
