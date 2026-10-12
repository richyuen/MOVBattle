# Loop state
Iteration: 111   Last re-audit: 110   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-half-size ab6f1b9 — APPROVE
- shadow-red-stain 329f430 — REJECT (reverted)
- mammoth-lit-pink 4f3fedb — APPROVE
- fireball-no-orange 24b9e37 — REJECT (reverted)
- crown-shade-crimson ebcab42 — APPROVE
- shove-lunge-split 549e843 — APPROVE
- mammoth-mop-beret 333ff3e — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-half-size (ab6f1b9) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: shadow-red-stain (329f430) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-lit-pink (4f3fedb) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: fireball-no-orange (24b9e37) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: crown-shade-crimson (ebcab42) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: shove-lunge-split (549e843) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-mop-beret (333ff3e) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-flame-lit-clips: 0-1% orange ball pixels vs 6-15%, base lobes 203,181,132 vs 238,160,122; flameMat createUnique("cloth") to ("unlit"), emissive (0.85,0.6,0.25) to (0.93,0.55,0.3) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [maps-light] shade-fill-warm: ground shade R:B 4.1, blue kept 0.49 vs 124,68,68 R:B 1.8, blue kept 0.66; main.ts add hemi.diffuse = new Color3(0.8, 0.95, 1.25), darkness stays 0.45 [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: closeup_pair_zeus_thor.png
3. [unit-look] mammoth-mop-split: two indigo lumps with hide between vs one mass; dome.position (0,0.58,0.42) to (0,0.52,0.27), dome.scaling (1.2,0.6,1) to (1.2,0.75,1.5) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [battle-feel] shove-torso-fold: pressing units sit a head below upright ones; _buildShovePose pitch 0.4+h(1)*0.25 to 0.2+h(1)*0.15 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
5. [unit-look] mammoth-head-pale: head 150,88,109, hump 143,92,110, B/R 0.74 vs max 125,71,80, B/R 0.64; MAMMOTH_HIDE (0.43,0.18,0.26) to (0.38,0.16,0.20) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [maps-light] orange-crown-shade-brick: darkLeaves crown shade 186,80,64 vs 169,53,70; crownMat emissive multiplier (0.72,0.45,0.8) to (0.72,0.4,0.95) for the darkLeaves crown only [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
7. [battle-feel] shove-knee-sag: knees 0.35-0.65 rad in the press vs near-straight; _buildShovePose knee 0.3+h(5)*0.3 to 0.12+h(5)*0.2 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
8. [maps-light] crown-top-pink: sunlit red crown tops 218,95,106 (B above G) vs 207,107,82; leaves.diffuseColor (0.95,0.50,0.40) to (0.95,0.52,0.34) [attempts: 0] — ref: tabs_screenshot_01 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, hide shows between, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips before emissive
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red R:B 4-5; hue is the white fill
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight, L is at the waist
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink
- cloud-olive-undersides [attempts: 1] — diffuse 0.35, emissive 0.55-0.62: undersides 50 levels dark
- airborne-hips-square [attempts: 1] — Sit hip 0.5-0.9: 3 of 6 still square
- cloud-neutral-white [attempts: 1] — diffuse tint, emissive halved: tops clip, undersides olive

## Notes for next iteration (max 5 lines)
- Spent (never retry): airborne-sit-square, fireball-no-orange (emissive tweaks), cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift and fireball size are settled. Shadow darkness stays 0.45.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- Mammoth fur is self-lit via factory get("wood", c, {emissive}); never mutate cached makeMat materials. Check the factory has an "unlit" category before gap 1. Campaign crowns (recolorBaseTerrain) keep the even 0.62 so green stays green.
- Critic's line numbers drift: sed by pattern, check `git diff -U0`. Commit with `git commit <file> -F -` heredoc. hemi.diffuse tints every lit surface: check unit skin and sky-facing ground.
