# Loop state
Iteration: 120   Last re-audit: 120   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- field-shadows-faint 0a3d77f — APPROVE
- blue-skin-navy 51ce4dc — APPROVE
- boulders-periwinkle 59608fe — APPROVE
- mammoth-hide-taupe 330a9c4 — APPROVE
- fireball-foot-dull ac26062 — REJECT (reverted 6efcfbb)
- victory-giant-blocks-frame 2476225 — APPROVE
- carriage-side-light d11aa91 — APPROVE
- muzzle-smoke-no-dark 5f0813a — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: field-shadows-faint (0a3d77f) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: blue-skin-navy (51ce4dc) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-periwinkle (59608fe) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-hide-taupe (330a9c4) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fireball-foot-dull (ac26062) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: victory-giant-blocks-frame (2476225) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: carriage-side-light (d11aa91) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-smoke-no-dark (5f0813a) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] boulders-indigo: plum 60,39,52, near-black up close vs indigo 29,32,67 to 67,59,76; mapBuilder.ts darkRock.diffuseColor to (0.18, 0.19, 0.32) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png
2. [vfx] muzzle-smoke-beaded-line: four spheres on a straight line vs ragged clump; projectileSystem.ts smoke loop y/z jitter 0.14 to 0.40, sizes [1, 0.85, 0.7, 0.55] [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
3. [maps-light] field-shadows-red: unit shade 0.65 of lit, R ratio 0.80, vs plum at 0.4, R 0.5; main.ts hemi.diffuse to (0.70, 0.78, 1.0), darkness is at its floor [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [unit-look] blue-skin-dark: lit skin 77,102,153 vs 128,159,194; factionColors.ts TEAM_COLORS[0] to (0.50, 0.68, 0.96) [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_pair_zeus_thor.png
5. [unit-look] mammoth-eyes-googly: eye whites 14% of head width vs 7%; vehicleBuilder.ts buildMammoth eye/pupil diameters x0.6 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [unit-look] cannon-carriage-plank: one flat plank and thin trail vs chunky stepped cheeks; buildCannon add two wood cheek boxes beside the barrel [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
7. [camera] victory-giant-dwarfs-survivors: humans 20% of band height at radius 11 vs 75%; cameraController.ts giant branch radius min(11, (box.height*0.5+0.7)/0.28), target y at 0.4 height [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- fireball-foot-dull [attempts: 2] — flameMat (0.70,0.20,0.04) on all 7 tongues: brown-orange shell over half the blast; TABS is cream with a thin fringe
- fireball-core-dull [attempts: 1] — coreMat (1.0,0.97,0.75): only blue rose, whiter not creamier
- red-rank-knot [attempts: 1] — either-bracer 0.8: battlefeel_spillover_chain squire shift 0.20 < 0.55 (hoplite is a bracer)
- carriage-shade-warm [attempts: 1] — emissive (0.18,0.09,0.09): self-lit blue made the top pink
- field-dark [attempts: 1] — dir.intensity 1.0: wrong lever
- presser-lean-capped [attempts: 2] — clamp while Walking: line units are Idle/Attack
- fireball-lobes-cream [attempts: 2] — coreMat emissive (0.70,0.60,0.25): heart still 236,232,209

## Notes for next iteration (max 5 lines)
- Spent (never retry): fireball-foot-dull, presser-lean-capped, fireball-lobes-cream, mammoth-no-launch, mammoth-mop-hat, tusk-white-not-ivory, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm, grass tufts. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; raising fire emissive past 1 washes to white, lowering it goes brown. Self-light lifts lit and shaded faces alike.
- One gap, one change: the critic rejects scope creep and any claim not visible on screen; keep comments true.
- runtimeUnit owns root.rotation.x/z. Self-lit materials bloom unless glow-excluded. battlefeel_spillover_chain needs the squire shoved 0.55 off a hoplite. buildMammoth is shared with the sacred elephant.
- Self-light via factory get(cat, c, { emissive }); never mutate cached makeMat. Edit with `sed -i -b` by line number (re-grep the line after an insert); commit with `git commit <file> -F -` heredoc.
