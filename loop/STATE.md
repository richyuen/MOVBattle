# Loop state
Iteration: 113   Last re-audit: 110   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-flame-lit-clips 412076f — APPROVE
- mammoth-no-launch af8dfa1 — REJECT (reverted)
- orange-crown-shade-brick f5da58d — APPROVE
- mammoth-flank-mauve 5a791b5 — APPROVE
- mammoth-mop-royal-blue d67722a — APPROVE
- shove-attack-fold 982a149 — REJECT (reverted)
- shade-light-rust 54c1330 — APPROVE
- red-crown-top-green d7581a5 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-flame-lit-clips (412076f) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-no-launch (af8dfa1) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: orange-crown-shade-brick (f5da58d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-flank-mauve (5a791b5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-mop-royal-blue (d67722a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shove-attack-fold (982a149) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: shade-light-rust (54c1330) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-crown-top-green (d7581a5) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-no-launch: no body airborne at 2s, 5s, 9s; redo the gored loop (git show af8dfa1) with lift 13 + 4 * near [attempts: 1] — ref: trailer_3_sheet_03 r1c2, tabs_screenshot_01 — ours: big_melee_5s.png
2. [battle-feel] shove-attack-fold: two blues fold past 60 degrees at 5s; shove pitch is not the cause; clamp torso.rotation.x to 0.6 rad after the shove add when not toppling [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
3. [maps-light] shade-warm-rust: ground shade 152,60,49 B/R 0.31 vs 124,66,70 B/R 0.55; main.ts hemi.diffuse (0.8,0.95,1.25) to (0.7,0.9,1.6), sunlit ground must stay near 210,120,84 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: closeup_pair_zeus_thor.png
4. [maps-light] orange-crown-shade-red: shade 203,88,63 G/R 0.42-0.51 vs 141-162,86-90,73 G/R 0.56-0.61; crownMat darkLeaves multiplier (0.9,0.55,0.8) to (0.78,0.68,0.9) [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
5. [maps-light] red-crown-shade-blue: shade blue 47 vs 69-72; crownMat default multiplier (0.72,0.45,0.8) to (0.72,0.45,1.1) [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
6. [unit-look] mammoth-hide-green: G/R 0.59-0.66, R 111-131 vs 0.50-0.55, R 86-99; MAMMOTH_HIDE (0.34,0.15,0.17) to (0.30,0.11,0.17) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [vfx] fireball-lobes-mustard: lobes hard discs 210,118,34, fringe 0-3 px vs soft grade 244,177,128 to 247,222,156; flashMat.emissiveColor (0.95,0.55,0.07) to (1.0,0.72,0.30) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
8. [unit-look] mammoth-mop-hat: mop a hard colour break from the head vs 57,36,68 on 91,45,67; crestMat Lerp weight 0.75 to 0.6 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — applyBlastLaunch on enemies within 2.6, lift 7-10: nothing airborne in any still, lift scaled down by impactMultiplier/mass
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s, removes 10 degrees at most
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red R:B 4-5
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight, L at the waist
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink
- cloud-olive-undersides [attempts: 1] — diffuse 0.35, emissive 0.55-0.62: undersides 50 levels dark

## Notes for next iteration (max 5 lines)
- Spent (never retry): airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire flame mats are unlit now. TEAM_COLORS[1] must not be mutated. Blast lift and fireball size are settled.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- shadowGen.darkness is the light LEFT in shade, now 0.35 (0.2 was rejected). hemi.diffuse (0.8,0.95,1.25) also blues upward faces (mammoth hump).
- Mammoth fur is self-lit via factory get("wood", c, {emissive}); never mutate cached makeMat materials. Campaign crowns keep the even 0.62. Files are CRLF: edit by sed/python per line, check `git diff -U0`; commit with `git commit <file> -F -` heredoc.
