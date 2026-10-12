# Loop state
Iteration: 112   Last re-audit: 110   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-flame-lit-clips 5a7c76c — REJECT (reverted)
- shade-fill-warm 9452e93 — APPROVE
- mammoth-mop-split 29c4997 — APPROVE
- shove-torso-fold 1c746f0 — APPROVE
- mammoth-head-pale 99ab5c8 — APPROVE
- orange-crown-shade-brick 6b2d112 — REJECT (reverted)
- shove-knee-sag ce79a73 — APPROVE
- crown-top-pink 52bb12d — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-flame-lit-clips (5a7c76c) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: shade-fill-warm (9452e93) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-mop-split (29c4997) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shove-torso-fold (1c746f0) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-head-pale (99ab5c8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: orange-crown-shade-brick (6b2d112) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: shove-knee-sag (ce79a73) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: crown-top-pink (52bb12d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-flame-lit-clips: ball all cream 242,239,226, orange 0-0.5% vs 2-3%, yellow 1-9% vs 8-19%; flashMat createUnique("unlit"), emissive (0.95,0.7,0.3), with flameMat unlit (0.93,0.55,0.3) again [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [battle-feel] mammoth-no-launch: no body airborne at 2s, 5s or 9s with a mammoth in the melee; raise mammoth hit launch [attempts: 0] — ref: tabs_screenshot_01, trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
3. [maps-light] orange-crown-shade-brick: darkLeaves crown shade dark brown 125,69,48 vs red 157-209 (ref yellow crowns shade 176,118,85); crownMat darkLeaves multiplier (0.9,0.55,0.8) [attempts: 1] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
4. [unit-look] mammoth-flank-mauve: flank 142,88,103, hump B/R 0.73 vs 122,71,80; MAMMOTH_HIDE (0.38,0.16,0.20) to (0.34,0.15,0.17) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
5. [unit-look] mammoth-mop-royal-blue: mop B/R 2.2-2.4 vs 46,31,68 B/R 1.5; crestMat lerp target (0.03,0.04,0.36) to (0.10,0.05,0.22) [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
6. [battle-feel] shove-attack-fold: front-line blues fold 70 degrees or squat at half height; halve shove pitch while Attacking as for Walking, or halve _limpPose knee [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
7. [maps-light] shade-light-rust: ground shade 173,71,55 vs 124,68,68; critic asks darkness 0.45 to 0.55 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: closeup_pair_zeus_thor.png
8. [maps-light] red-crown-top-green: tops G/R 0.54 vs 0.62, shade 165,41,51 vs 170,56,72; leaves.diffuseColor (0.95,0.52,0.34) to (0.95,0.58,0.32) [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- fireball-flame-lit-clips [attempts: 1] — flameMat unlit (0.93,0.55,0.3): no orange seen, lit flashMat and core cover most lobes and still clip to cream
- orange-crown-shade-brick [attempts: 1] — darkLeaves multiplier (0.72,0.4,0.95): shade brown and too dark; target was wrong, yellow crowns shade orange
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red R:B 4-5
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight, L at the waist
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink
- cloud-olive-undersides [attempts: 1] — diffuse 0.35, emissive 0.55-0.62: undersides 50 levels dark

## Notes for next iteration (max 5 lines)
- Spent (never retry): airborne-sit-square, fireball-no-orange (emissive tweaks on lit mats), cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Blast lift and fireball size are settled.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- Gap 7: darkness is the light LEFT in shade, so 0.55 lightens it; the critic wants darker shade, which is below 0.45 (0.2 was rejected). hemi.diffuse is now (0.8,0.95,1.25) and blues upward faces (mammoth hump).
- Mammoth fur is self-lit via factory get("wood", c, {emissive}); never mutate cached makeMat materials. Campaign crowns keep the even 0.62. Sed by pattern, check `git diff -U0`; commit with `git commit <file> -F -` heredoc.
